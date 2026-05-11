/**
 * Pokémon GO Screenshot Analyzer
 * Handles image analysis, IV reading, and level detection.
 * Uses visual analysis of the screenshot to extract game data.
 */

class PokemonAnalyzer {
    constructor() {
        // Known Pokémon names for fuzzy matching
        this.pokemonNames = Object.keys(POKEMON_DATA);
    }

    /**
     * Analyze a screenshot image and extract Pokémon data
     * This uses canvas-based image processing to read IV bars and level arc
     */
    async analyzeScreenshot(imageElement) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = imageElement.naturalWidth;
        canvas.height = imageElement.naturalHeight;
        ctx.drawImage(imageElement, 0, 0);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const result = {};

        const width = canvas.width;
        const height = canvas.height;
        const bounds = this.getContentBounds(imageData, width, height);

        // Prefer OCR-based name detection over CP matching (CP can match many Pokémon/IV combos).
        const nameGuessOCR = await this.detectPokemonNameWithOCR(imageElement, width, height, bounds);

        // OCR-based guesses for IVs/level (more reliable than bar/arc heuristics when available).
        let ivGuess = null;
        let levelGuess = null;
        try {
            const [ivOCR, levelOCR] = await Promise.all([
                this.detectIVsWithOCR(imageElement, width, height, bounds),
                this.detectLevelWithOCR(imageElement, width, height, bounds),
            ]);
            ivGuess = ivOCR || this.detectIVBars(imageData, width, height, bounds);
            levelGuess = levelOCR ?? this.detectLevelArc(imageData, width, height, bounds);
        } catch (e) {
            ivGuess = this.detectIVBars(imageData, width, height, bounds);
            levelGuess = this.detectLevelArc(imageData, width, height, bounds);
        }

        // OCR CP (returns best cp + a few alternatives)
        const cpResult = await this.detectCP(imageElement, width, height, bounds);
        const cpCandidates = cpResult?.candidates || [];

        result.ivs = ivGuess;
        result.level = levelGuess;
        result.cp = cpResult?.cp || null;
        result.cpCandidates = cpCandidates;

        // If we have CP candidates and a confident OCR name, refine IVs/level.
        // This avoids relying on the fragile color-scan IV detection.
        let best = null;
        if (cpCandidates.length > 0 && nameGuessOCR) {
            for (const cpCand of cpCandidates) {
                const pokemonName = nameGuessOCR;

                const inferred = this.inferIVsAndLevel(pokemonName, cpCand, levelGuess, ivGuess);
                if (!inferred) continue;

                // Score: primary is CP mismatch, then prefer levels close to arc guess,
                // then prefer IVs close to bar guess.
                let score = inferred.diff;
                if (levelGuess != null && typeof inferred.level === 'number') {
                    score += Math.abs(inferred.level - levelGuess) * 0.25;
                }
                if (ivGuess) {
                    score += (
                        Math.abs(inferred.ivs.attack - ivGuess.attack) +
                        Math.abs(inferred.ivs.defense - ivGuess.defense) +
                        Math.abs(inferred.ivs.hp - ivGuess.hp)
                    ) * 0.05;
                }

                if (!best || score < best.score) {
                    best = {
                        score,
                        pokemonName,
                        cp: cpCand,
                        level: inferred.level,
                        ivs: inferred.ivs,
                        diff: inferred.diff
                    };
                    // Can't beat a perfect CP match.
                    if (best.diff === 0) break;
                }
            }
        }

        if (best) {
            result.pokemonName = best.pokemonName;
            result.cp = best.cp;
            result.level = best.level;
            result.ivs = best.ivs;
        } else {
            // Keep OCR name only. CP-only name matching is too ambiguous and often wrong.
            result.pokemonName = nameGuessOCR || null;
        }

        return result;
    }

    /**
     * Detect CP value from the screenshot
     * The CP is displayed at the top of the Pokémon screen
     */
    async detectCP(imageElement, width, height) {
        if (!window.Tesseract) return null;
        const bounds = arguments[3] || { left: 0, top: 0, right: width - 1, bottom: height - 1, width, height };
        const bx = bounds.left;
        const by = bounds.top;
        const bw = bounds.width;
        const bh = bounds.height;

        // Try 2 crops because layouts differ (gym team badge, language, etc.)
        const crops = [
            // Top-left-ish where CP usually sits
            { x: bx + Math.floor(bw * 0.06), y: by + Math.floor(bh * 0.015), w: Math.floor(bw * 0.45), h: Math.floor(bh * 0.16) },
            // Slightly wider to handle centering differences
            { x: bx + Math.floor(bw * 0.02), y: by + Math.floor(bh * 0.02), w: Math.floor(bw * 0.60), h: Math.floor(bh * 0.20) },
        ];

        const candidates = new Map(); // cpNumber -> weight

        for (const crop of crops) {
            const scale = 3;
            const ocrCanvas = document.createElement('canvas');
            const ocrCtx = ocrCanvas.getContext('2d', { willReadFrequently: true });
            if (!ocrCtx) continue;

            ocrCanvas.width = Math.max(1, Math.floor(crop.w * scale));
            ocrCanvas.height = Math.max(1, Math.floor(crop.h * scale));

            ocrCtx.drawImage(
                imageElement,
                crop.x, crop.y, crop.w, crop.h,
                0, 0, ocrCanvas.width, ocrCanvas.height
            );

            // Preprocess: grayscale + threshold (auto inverts if needed).
            const imgData = ocrCtx.getImageData(0, 0, ocrCanvas.width, ocrCanvas.height);
            const d = imgData.data;

            // Quick average brightness sample
            let sum = 0;
            let count = 0;
            const sampleStride = Math.max(1, Math.floor((d.length / 4) / 2000));
            for (let i = 0; i < d.length; i += 4 * sampleStride) {
                const r = d[i], g = d[i + 1], b = d[i + 2];
                const gray = 0.299 * r + 0.587 * g + 0.114 * b;
                sum += gray;
                count++;
            }
            const avg = count ? sum / count : 0;

            const threshold = 160;
            const invert = avg > threshold; // if background is bright, digits are likely dark

            for (let i = 0; i < d.length; i += 4) {
                const r = d[i], g = d[i + 1], b = d[i + 2];
                const gray = 0.299 * r + 0.587 * g + 0.114 * b;
                const isOn = invert ? gray < threshold : gray > threshold;
                const v = isOn ? 255 : 0;
                d[i] = v; d[i + 1] = v; d[i + 2] = v;
            }

            ocrCtx.putImageData(imgData, 0, 0);

            try {
                const { data } = await window.Tesseract.recognize(ocrCanvas, 'eng', {
                    logger: () => { },
                    tessedit_char_whitelist: '0123456789'
                });

                const text = (data && data.text) ? data.text : '';
                const matches = text.match(/\d+/g) || [];

                for (const m of matches) {
                    const n = parseInt(m, 10);
                    if (!Number.isFinite(n)) continue;
                    // Typical CP range: 10 - ~5000.
                    if (n < 10 || n > 6000) continue;

                    // Weight: prefer longer numbers (CP is usually 3-4 digits).
                    const weight = Math.min(10, m.length);
                    const prev = candidates.get(n) || 0;
                    candidates.set(n, Math.max(prev, weight));
                }
            } catch (e) {
                // Non-fatal
            }
        }

        if (candidates.size === 0) return null;

        const ordered = Array.from(candidates.entries())
            .sort((a, b) => {
                // Higher weight first, then longer digits, then smaller numeric distance to typical CP.
                const wa = a[1], wb = b[1];
                if (wb !== wa) return wb - wa;
                const la = String(a[0]).length, lb = String(b[0]).length;
                if (lb !== la) return lb - la;
                return Math.abs(a[0] - 2000) - Math.abs(b[0] - 2000);
            })
            .map(([n]) => n);

        return {
            cp: ordered[0],
            candidates: ordered.slice(0, 3)
        };
    }

    /**
     * Detect Pokémon name with OCR.
     * Returns a database-matching name (e.g. "Latias"), not the raw OCR string.
     */
    async detectPokemonNameWithOCR(imageElement, width, height) {
        if (!window.Tesseract) return null;
        const bounds = arguments[3] || { left: 0, top: 0, right: width - 1, bottom: height - 1, width, height };
        const bx = bounds.left;
        const by = bounds.top;
        const bw = bounds.width;
        const bh = bounds.height;

        // Try crops around the middle white card where the Pokémon name appears.
        const crops = [
            // Primary: top of details card area
            { x: bx + Math.floor(bw * 0.18), y: by + Math.floor(bh * 0.33), w: Math.floor(bw * 0.64), h: Math.floor(bh * 0.14) },
            // Slightly larger/lower window
            { x: bx + Math.floor(bw * 0.12), y: by + Math.floor(bh * 0.31), w: Math.floor(bw * 0.76), h: Math.floor(bh * 0.18) },
            // Fallback broader window
            { x: bx + Math.floor(bw * 0.08), y: by + Math.floor(bh * 0.28), w: Math.floor(bw * 0.84), h: Math.floor(bh * 0.22) },
        ];

        let bestName = null;
        let bestScore = Infinity; // lower is better

        for (const crop of crops) {
            const scale = 3;
            const ocrCanvas = document.createElement('canvas');
            const ocrCtx = ocrCanvas.getContext('2d', { willReadFrequently: true });
            if (!ocrCtx) continue;

            ocrCanvas.width = Math.max(1, Math.floor(crop.w * scale));
            ocrCanvas.height = Math.max(1, Math.floor(crop.h * scale));

            ocrCtx.drawImage(
                imageElement,
                crop.x, crop.y, crop.w, crop.h,
                0, 0, ocrCanvas.width, ocrCanvas.height
            );

            const imgData = ocrCtx.getImageData(0, 0, ocrCanvas.width, ocrCanvas.height);
            const d = imgData.data;

            // Adaptive invert-ish preprocessing based on average brightness.
            let sum = 0;
            let count = 0;
            const sampleStride = Math.max(1, Math.floor((d.length / 4) / 2500));
            for (let i = 0; i < d.length; i += 4 * sampleStride) {
                const r = d[i], g = d[i + 1], b = d[i + 2];
                const gray = 0.299 * r + 0.587 * g + 0.114 * b;
                sum += gray;
                count++;
            }
            const avg = count ? sum / count : 0;
            const threshold = 150;
            const invert = avg > threshold;

            for (let i = 0; i < d.length; i += 4) {
                const r = d[i], g = d[i + 1], b = d[i + 2];
                const gray = 0.299 * r + 0.587 * g + 0.114 * b;
                const isOn = invert ? gray < threshold : gray > threshold;
                const v = isOn ? 255 : 0;
                d[i] = v; d[i + 1] = v; d[i + 2] = v;
            }
            ocrCtx.putImageData(imgData, 0, 0);

            try {
                const { data } = await window.Tesseract.recognize(ocrCanvas, 'eng', {
                    logger: () => { },
                    tessedit_char_whitelist: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz().- "
                });
                const raw = (data && data.text) ? data.text : '';

                // Clean up OCR output.
                const cleaned = raw
                    .replace(/[^a-zA-Z().\\-\\s]/g, ' ')
                    .replace(/\\s+/g, ' ')
                    .trim();

                if (!cleaned) continue;

                // Evaluate tokens and full string, then keep only confident matches.
                const candidates = cleaned.split(' ').filter(Boolean);
                candidates.push(cleaned);

                for (const cand of candidates) {
                    const matched = this.fuzzyMatchPokemon(cand);
                    if (!matched) continue;
                    const dist = this.levenshtein(cand.toLowerCase(), matched.toLowerCase());

                    // Ignore weak matches to avoid wrong-name autofill.
                    const maxAllowed = Math.max(1, Math.floor(matched.length * 0.2));
                    if (dist > maxAllowed) continue;

                    if (dist < bestScore) {
                        bestScore = dist;
                        bestName = matched;
                    }
                }
            } catch (e) {
                // Non-fatal
            }
        }

        return bestName;
    }

    /**
     * OCR the displayed level (e.g. "23.5") from the screenshot.
     */
    async detectLevelWithOCR(imageElement, width, height) {
        if (!window.Tesseract) return null;
        const bounds = arguments[3] || { left: 0, top: 0, right: width - 1, bottom: height - 1, width, height };
        const bx = bounds.left;
        const by = bounds.top;
        const bw = bounds.width;
        const bh = bounds.height;

        const crops = [
            // Level is often in the lower half of the Pokémon detail panel.
            { x: bx + Math.floor(bw * 0.20), y: by + Math.floor(bh * 0.38), w: Math.floor(bw * 0.60), h: Math.floor(bh * 0.20) },
            { x: bx + Math.floor(bw * 0.25), y: by + Math.floor(bh * 0.44), w: Math.floor(bw * 0.50), h: Math.floor(bh * 0.20) },
        ];

        for (const crop of crops) {
            const scale = 3;
            const ocrCanvas = document.createElement('canvas');
            const ocrCtx = ocrCanvas.getContext('2d', { willReadFrequently: true });
            if (!ocrCtx) continue;

            ocrCanvas.width = Math.max(1, Math.floor(crop.w * scale));
            ocrCanvas.height = Math.max(1, Math.floor(crop.h * scale));

            ocrCtx.drawImage(
                imageElement,
                crop.x, crop.y, crop.w, crop.h,
                0, 0, ocrCanvas.width, ocrCanvas.height
            );

            const imgData = ocrCtx.getImageData(0, 0, ocrCanvas.width, ocrCanvas.height);
            const d = imgData.data;

            // Preprocess: grayscale + threshold
            let sum = 0;
            let count = 0;
            const sampleStride = Math.max(1, Math.floor((d.length / 4) / 2000));
            for (let i = 0; i < d.length; i += 4 * sampleStride) {
                const r = d[i], g = d[i + 1], b = d[i + 2];
                sum += 0.299 * r + 0.587 * g + 0.114 * b;
                count++;
            }
            const avg = count ? sum / count : 0;
            const threshold = 155;
            const invert = avg > threshold;

            for (let i = 0; i < d.length; i += 4) {
                const r = d[i], g = d[i + 1], b = d[i + 2];
                const gray = 0.299 * r + 0.587 * g + 0.114 * b;
                const isOn = invert ? gray < threshold : gray > threshold;
                const v = isOn ? 255 : 0;
                d[i] = v; d[i + 1] = v; d[i + 2] = v;
            }
            ocrCtx.putImageData(imgData, 0, 0);

            try {
                const { data } = await window.Tesseract.recognize(ocrCanvas, 'eng', {
                    logger: () => { },
                    tessedit_char_whitelist: '0123456789.'
                });

                const raw = (data && data.text) ? data.text : '';
                const matches = raw.match(/\d+(?:[.,]\d+)?/g) || [];
                for (const m of matches) {
                    const n = parseFloat(m.replace(',', '.'));
                    if (!Number.isFinite(n)) continue;
                    // Level is usually 1..50 with 0.5 steps
                    const rounded = Math.round(n * 2) / 2;
                    if (rounded < 1 || rounded > 50) continue;
                    // Ensure it's close to a 0.5 step
                    if (Math.abs(n - rounded) <= 0.3) return rounded;
                }
            } catch (e) {
                // Non-fatal
            }
        }

        return null;
    }

    /**
     * OCR the IV values (Attack/Defense/HP) if the tooltip text is visible.
     * Returns {attack, defense, hp} or null.
     */
    async detectIVsWithOCR(imageElement, width, height) {
        if (!window.Tesseract) return null;
        const bounds = arguments[3] || { left: 0, top: 0, right: width - 1, bottom: height - 1, width, height };
        const bx = bounds.left;
        const by = bounds.top;
        const bw = bounds.width;
        const bh = bounds.height;

        const crops = [
            // Tooltip/IV values panel tends to be on the lower-left of the Pokémon card.
            { x: bx + Math.floor(bw * 0.05), y: by + Math.floor(bh * 0.56), w: Math.floor(bw * 0.40), h: Math.floor(bh * 0.30) },
            // Alternate crop if layout differs
            { x: bx + Math.floor(bw * 0.08), y: by + Math.floor(bh * 0.50), w: Math.floor(bw * 0.45), h: Math.floor(bh * 0.35) },
        ];

        for (const crop of crops) {
            const scale = 3;
            const ocrCanvas = document.createElement('canvas');
            const ocrCtx = ocrCanvas.getContext('2d', { willReadFrequently: true });
            if (!ocrCtx) continue;

            ocrCanvas.width = Math.max(1, Math.floor(crop.w * scale));
            ocrCanvas.height = Math.max(1, Math.floor(crop.h * scale));

            ocrCtx.drawImage(
                imageElement,
                crop.x, crop.y, crop.w, crop.h,
                0, 0, ocrCanvas.width, ocrCanvas.height
            );

            const imgData = ocrCtx.getImageData(0, 0, ocrCanvas.width, ocrCanvas.height);
            const d = imgData.data;

            // Preprocess: grayscale + threshold
            let sum = 0;
            let count = 0;
            const sampleStride = Math.max(1, Math.floor((d.length / 4) / 2000));
            for (let i = 0; i < d.length; i += 4 * sampleStride) {
                const r = d[i], g = d[i + 1], b = d[i + 2];
                sum += 0.299 * r + 0.587 * g + 0.114 * b;
                count++;
            }
            const avg = count ? sum / count : 0;
            const threshold = 150;
            const invert = avg > threshold;

            for (let i = 0; i < d.length; i += 4) {
                const r = d[i], g = d[i + 1], b = d[i + 2];
                const gray = 0.299 * r + 0.587 * g + 0.114 * b;
                const isOn = invert ? gray < threshold : gray > threshold;
                const v = isOn ? 255 : 0;
                d[i] = v; d[i + 1] = v; d[i + 2] = v;
            }
            ocrCtx.putImageData(imgData, 0, 0);

            try {
                const { data } = await window.Tesseract.recognize(ocrCanvas, 'eng', {
                    logger: () => { },
                    tessedit_char_whitelist: '0123456789'
                });

                const raw = (data && data.text) ? data.text : '';
                // Collect IV-like numbers (0..15). There should usually be 3.
                const matches = raw.match(/\d+/g) || [];
                const ivs = matches
                    .map(s => parseInt(s, 10))
                    .filter(n => Number.isFinite(n) && n >= 0 && n <= 15);

                // If there are more numbers, take the first three (Attack, Defense, HP order in UI).
                if (ivs.length >= 3) {
                    return { attack: ivs[0], defense: ivs[1], hp: ivs[2] };
                }
            } catch (e) {
                // Non-fatal
            }
        }

        return null;
    }

    /**
     * Infer exact IVs + level by brute-forcing the CP equation for a Pokémon.
     * Uses `levelGuess` only as a bounds filter to speed up.
     */
    inferIVsAndLevel(pokemonName, cp, levelGuess = null, ivGuess = null) {
        const pokemon = POKEMON_DATA[pokemonName];
        if (!pokemon) return null;

        const levels = Object.keys(CPM).map(Number).filter(level => level <= 50).sort((a, b) => a - b);
        // Level guessing from the arc can be noisy; don't exclude valid levels.
        // We keep the `levelGuess` parameter only for scoring/tie-breaks.
        const levelList = levels;

        let best = null;
        let bestScore = Infinity;

        for (const level of levelList) {
            for (let ivAttack = 0; ivAttack <= 15; ivAttack++) {
                for (let ivDefense = 0; ivDefense <= 15; ivDefense++) {
                    for (let ivHP = 0; ivHP <= 15; ivHP++) {
                        const calculatedCP = calculateCP(
                            pokemon.baseAttack, pokemon.baseDefense, pokemon.baseStamina,
                            ivAttack, ivDefense, ivHP, level
                        );

                        const diff = Math.abs(calculatedCP - cp);
                        // Tie-breakers: prefer solutions matching the arc and bar guesses.
                        let score = diff;
                        if (levelGuess != null) {
                            score += Math.abs(level - levelGuess) * 0.25;
                        }
                        if (ivGuess) {
                            score += (
                                Math.abs(ivAttack - ivGuess.attack) +
                                Math.abs(ivDefense - ivGuess.defense) +
                                Math.abs(ivHP - ivGuess.hp)
                            ) * 0.05;
                        }

                        if (score < bestScore) {
                            bestScore = score;
                            best = {
                                level,
                                ivs: { attack: ivAttack, defense: ivDefense, hp: ivHP },
                                diff
                            };
                        }
                    }
                }
            }
        }

        return best;
    }

    /**
     * Detect IV bars from screenshot
     * In Pokémon GO, the IV appraisal shows 3 bars (Attack, Defense, HP)
     * Each bar is divided into 3 sub-bars, each representing up to 5 points
     */
    detectIVBars(imageData, width, height) {
        const bounds = arguments[3] || { left: 0, top: 0, right: width - 1, bottom: height - 1, width, height };
        const bx = bounds.left;
        const by = bounds.top;
        const bw = bounds.width;
        const bh = bounds.height;
        // Region tuned for Pokémon GO appraisal panel:
        // bottom-left block that contains Attack/Defense/HP bars.
        const left = bx + Math.floor(bw * 0.08);
        const right = bx + Math.floor(bw * 0.44);
        const top = by + Math.floor(bh * 0.66);
        const bottom = by + Math.floor(bh * 0.82);

        if (right <= left || bottom <= top) return null;

        const regionHeight = bottom - top;
        const barHeight = regionHeight / 3;
        const ratios = [];

        // One horizontal scanline per bar (middle of each row).
        for (let i = 0; i < 3; i++) {
            const y = Math.floor(top + barHeight * (i + 0.5));
            const ratio = this.detectBarFillAtLine(imageData, width, left, right, y);
            ratios.push(ratio);
        }

        // If detection looks invalid (all near-zero), fall back to old color-bar scan.
        const sum = ratios[0] + ratios[1] + ratios[2];
        if (sum < 0.15) {
            const bars = this.findColorBars(
                imageData,
                width,
                by + Math.floor(bh * 0.60),
                by + Math.floor(bh * 0.85)
            );
            if (bars.length < 3) return null;
            return {
                attack: this.readBarValue(bars[0]),
                defense: this.readBarValue(bars[1]),
                hp: this.readBarValue(bars[2])
            };
        }

        return {
            attack: this.readBarValue({ fillRatio: ratios[0] }),
            defense: this.readBarValue({ fillRatio: ratios[1] }),
            hp: this.readBarValue({ fillRatio: ratios[2] })
        };
    }

    /**
     * Estimate filled percentage for one IV bar scan line.
     */
    detectBarFillAtLine(imageData, width, left, right, y) {
        const data = imageData.data;
        let firstColored = -1;
        let lastColored = -1;
        let colored = 0;

        for (let x = left; x < right; x++) {
            const idx = (y * width + x) * 4;
            const r = data[idx], g = data[idx + 1], b = data[idx + 2];

            // IV fill color in appraisal panel is usually orange/red.
            const isFilled =
                (r > 170 && g > 70 && g < 200 && b < 130) ||
                (r > 190 && g < 140 && b < 140);

            if (isFilled) {
                if (firstColored === -1) firstColored = x;
                lastColored = x;
                colored++;
            }
        }

        if (firstColored === -1 || lastColored <= firstColored) return 0;

        // Use contiguous colored span as fill estimate.
        const span = lastColored - firstColored + 1;
        const total = Math.max(1, right - left);
        const fill = span / total;

        return Math.max(0, Math.min(1, fill));
    }

    /**
     * Find colored bars in a region of the image
     */
    findColorBars(imageData, width, top, bottom) {
        const bars = [];
        const data = imageData.data;

        // Scan horizontal lines for bar-like color patterns
        for (let y = top; y < bottom; y += 2) {
            let barPixels = 0;
            let startX = -1;

            for (let x = 0; x < width; x++) {
                const idx = (y * width + x) * 4;
                const r = data[idx], g = data[idx + 1], b = data[idx + 2];

                // Check if this pixel is part of a colored bar (orange/red range)
                const isBarColor = (r > 180 && g < 150 && b < 100) || // Red/orange bar
                                   (r > 150 && g > 100 && b < 80);    // Yellow-ish bar

                if (isBarColor) {
                    if (startX === -1) startX = x;
                    barPixels++;
                } else if (startX !== -1 && barPixels > 20) {
                    bars.push({
                        y, startX, endX: x,
                        width: x - startX,
                        fillRatio: barPixels / (x - startX)
                    });
                    startX = -1;
                    barPixels = 0;
                }
            }
        }

        return bars;
    }

    /**
     * Convert bar fill ratio to IV value (0-15)
     * Each bar has 3 sub-bars, each worth 0-5 points
     */
    readBarValue(bar) {
        if (!bar) return 0;
        // Map fill ratio to 0-15
        const value = Math.round(bar.fillRatio * 15);
        return Math.min(15, Math.max(0, value));
    }

    /**
     * Detect level from the CP arc
     * The arc is a semicircle above the Pokémon
     */
    detectLevelArc(imageData, width, height) {
        const bounds = arguments[3] || { left: 0, top: 0, right: width - 1, bottom: height - 1, width, height };
        const bx = bounds.left;
        const by = bounds.top;
        const bw = bounds.width;
        const bh = bounds.height;
        // The arc is in the top ~40% of the image
        // It's a white semicircle with a dot indicator
        const arcRegionTop = by + Math.floor(bh * 0.05);
        const arcRegionBottom = by + Math.floor(bh * 0.35);
        const arcCenterX = bx + Math.floor(bw / 2);

        // Find the white dot on the arc
        const data = imageData.data;
        let dotX = -1, dotY = -1;

        for (let y = arcRegionTop; y < arcRegionBottom; y++) {
            for (let x = 0; x < width; x++) {
                const idx = (y * width + x) * 4;
                const r = data[idx], g = data[idx + 1], b = data[idx + 2];

                // White dot: very bright pixel
                if (r > 240 && g > 240 && b > 240) {
                    // Check if it's part of a small cluster (the dot)
                    const neighborBright = this.checkNeighborBrightness(data, width, height, x, y, 3);
                    if (neighborBright > 5 && neighborBright < 40) {
                        dotX = x;
                        dotY = y;
                    }
                }
            }
        }

        if (dotX === -1) return null;

        // Calculate angle from center
        const dx = dotX - arcCenterX;
        const dy = (arcRegionTop + arcRegionBottom) / 2 - dotY;
        const angle = Math.atan2(dy, dx);

        // Map angle to level (left = level 1, right = level 40/50)
        // Arc goes from ~180° (left) to ~0° (right)
        const normalizedAngle = (Math.PI - angle) / Math.PI;
        const level = Math.round(normalizedAngle * 50 * 2) / 2; // Round to nearest 0.5

        return Math.max(1, Math.min(50, level));
    }

    /**
     * Check brightness of neighboring pixels
     */
    checkNeighborBrightness(data, width, height, cx, cy, radius) {
        let count = 0;
        for (let dy = -radius; dy <= radius; dy++) {
            for (let dx = -radius; dx <= radius; dx++) {
                const x = cx + dx, y = cy + dy;
                if (x < 0 || x >= width || y < 0 || y >= height) continue;
                const idx = (y * width + x) * 4;
                if (data[idx] > 230 && data[idx + 1] > 230 && data[idx + 2] > 230) {
                    count++;
                }
            }
        }
        return count;
    }

    /**
     * Detect the primary screenshot content area.
     * This helps ignore dark margins/background around the phone screenshot.
     */
    getContentBounds(imageData, width, height) {
        const data = imageData.data;
        let minX = width, minY = height, maxX = -1, maxY = -1;

        // A pixel is "content" if it's not very dark.
        const threshold = 28;
        const stride = Math.max(1, Math.floor(Math.min(width, height) / 500));

        for (let y = 0; y < height; y += stride) {
            for (let x = 0; x < width; x += stride) {
                const idx = (y * width + x) * 4;
                const r = data[idx], g = data[idx + 1], b = data[idx + 2];
                const bright = 0.299 * r + 0.587 * g + 0.114 * b;
                if (bright > threshold) {
                    if (x < minX) minX = x;
                    if (x > maxX) maxX = x;
                    if (y < minY) minY = y;
                    if (y > maxY) maxY = y;
                }
            }
        }

        // Fallback to full frame if no region found.
        if (maxX < minX || maxY < minY) {
            return { left: 0, top: 0, right: width - 1, bottom: height - 1, width, height };
        }

        // Pad a bit so crops don't clip text.
        const padX = Math.floor((maxX - minX + 1) * 0.02);
        const padY = Math.floor((maxY - minY + 1) * 0.02);
        minX = Math.max(0, minX - padX);
        minY = Math.max(0, minY - padY);
        maxX = Math.min(width - 1, maxX + padX);
        maxY = Math.min(height - 1, maxY + padY);

        return {
            left: minX,
            top: minY,
            right: maxX,
            bottom: maxY,
            width: maxX - minX + 1,
            height: maxY - minY + 1
        };
    }

    /**
     * Identify Pokémon by visual characteristics and CP
     * Falls back to CP-based matching
     */
    identifyPokemon(imageData, width, height, cp) {
        if (cp) {
            const matches = identifyPokemonByCP(cp);
            if (matches.length > 0) {
                return matches[0].name;
            }
        }
        return null;
    }

    /**
     * Match a name string to known Pokémon names (fuzzy)
     */
    fuzzyMatchPokemon(input) {
        if (!input) return null;
        const normalized = input.toLowerCase().trim();

        // Exact match
        for (const name of this.pokemonNames) {
            if (name.toLowerCase() === normalized) return name;
        }

        // Partial match
        for (const name of this.pokemonNames) {
            if (name.toLowerCase().includes(normalized) || normalized.includes(name.toLowerCase())) {
                return name;
            }
        }

        // Levenshtein distance match
        let bestMatch = null;
        let bestDist = Infinity;
        for (const name of this.pokemonNames) {
            const dist = this.levenshtein(name.toLowerCase(), normalized);
            if (dist < bestDist && dist <= 3) {
                bestDist = dist;
                bestMatch = name;
            }
        }

        return bestMatch;
    }

    /**
     * Levenshtein distance between two strings
     */
    levenshtein(a, b) {
        const matrix = Array.from({ length: a.length + 1 }, (_, i) =>
            Array.from({ length: b.length + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
        );

        for (let i = 1; i <= a.length; i++) {
            for (let j = 1; j <= b.length; j++) {
                const cost = a[i - 1] === b[j - 1] ? 0 : 1;
                matrix[i][j] = Math.min(
                    matrix[i - 1][j] + 1,
                    matrix[i][j - 1] + 1,
                    matrix[i - 1][j - 1] + cost
                );
            }
        }

        return matrix[a.length][b.length];
    }

    /**
     * Get IV appraisal text
     */
    getAppraisal(totalIV) {
        const percentage = (totalIV / 45) * 100;
        if (percentage >= 98) return { text: "⭐ Perfect / Wonder", class: "perfect" };
        if (percentage >= 82) return { text: "🌟 Wonder / 3 Stars", class: "great" };
        if (percentage >= 67) return { text: "✨ Strong / 2 Stars", class: "good" };
        if (percentage >= 51) return { text: "💫 Decent / 1 Star", class: "decent" };
        return { text: "⚪ Not great / 0 Stars", class: "decent" };
    }

    /**
     * Perform full analysis given manual or detected data
     */
    performAnalysis(pokemonName, cp, ivAttack, ivDefense, ivHP, level = null) {
        const pokemon = POKEMON_DATA[pokemonName];
        if (!pokemon) {
            return { error: `Pokémon "${pokemonName}" not found in database.` };
        }

        // Calculate level from CP and IVs if not provided
        if (!level) {
            level = findLevel(pokemonName, cp, ivAttack, ivDefense, ivHP);
        }

        // Verify CP matches
        const calculatedCP = calculateCP(
            pokemon.baseAttack, pokemon.baseDefense, pokemon.baseStamina,
            ivAttack, ivDefense, ivHP, level
        );

        // Total IV
        const totalIV = ivAttack + ivDefense + ivHP;
        const ivPercentage = Math.round((totalIV / 45) * 100 * 10) / 10;
        const appraisal = this.getAppraisal(totalIV);

        // PvP Rankings
        const pvpRankings = getPvPRankings(pokemonName, calculatedCP);

        // Type Rankings
        const typeRankings = getTypeRanking(pokemon.types);

        // Moveset
        const moveset = getRecommendedMoveset(pokemonName);

        // Candy costs
        const candyCostTo50 = calculatePowerUpCost(level, 50);
        const candyTable = getLevelByCandyTable(level);

        // Max CP at level 40 and 50
        const maxCP40 = calculateCP(
            pokemon.baseAttack, pokemon.baseDefense, pokemon.baseStamina,
            15, 15, 15, 40
        );
        const maxCP50 = calculateCP(
            pokemon.baseAttack, pokemon.baseDefense, pokemon.baseStamina,
            15, 15, 15, 50
        );

        // Sprite URL
        const dexStr = String(pokemon.dexNum).padStart(3, '0');
        const spriteUrl = `https://raw.githubusercontent.com/PokeMiners/pogo_assets/master/Images/Pokemon/Addressable%20Assets/pm${dexStr}.icon.png`;
        const fallbackSprite = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.dexNum}.png`;

        return {
            pokemonName,
            dexNum: pokemon.dexNum,
            types: pokemon.types,
            cp: calculatedCP,
            inputCP: cp,
            level,
            ivAttack,
            ivDefense,
            ivHP,
            totalIV,
            ivPercentage,
            appraisal,
            pvpRankings,
            typeRankings,
            moveset,
            candyCostTo50,
            candyTable,
            maxCP40,
            maxCP50,
            spriteUrl,
            fallbackSprite,
            baseStats: {
                attack: pokemon.baseAttack,
                defense: pokemon.baseDefense,
                stamina: pokemon.baseStamina,
            }
        };
    }
}

window.PokemonAnalyzer = PokemonAnalyzer;
