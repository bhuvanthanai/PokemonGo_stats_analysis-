/**
 * Pokémon GO Analyzer — Main Application
 * Handles UI interactions, file uploads, and result rendering.
 */

(function () {
    'use strict';

    // --- DOM References ---
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');
    const previewContainer = document.getElementById('preview-container');
    const previewImage = document.getElementById('preview-image');
    const removeImageBtn = document.getElementById('remove-image');
    const analyzeBtn = document.getElementById('analyze-btn');
    const resetBtn = document.getElementById('reset-btn');

    const uploadSection = document.getElementById('upload-section');
    const loadingSection = document.getElementById('loading-section');
    const resultsSection = document.getElementById('results-section');
    const manualSection = document.getElementById('manual-section');

    const manualAnalyzeBtn = document.getElementById('manual-analyze-btn');

    const analyzer = new PokemonAnalyzer();
    let uploadedFile = null;

    // --- Particle Background ---
    initParticles();

    // --- Populate datalist ---
    const pokemonList = document.getElementById('pokemon-list');
    Object.keys(POKEMON_DATA).sort().forEach(name => {
        const opt = document.createElement('option');
        opt.value = name;
        pokemonList.appendChild(opt);
    });

    // --- File Upload Handlers ---
    dropZone.addEventListener('click', (e) => {
        if (e.target.closest('.remove-btn')) return;
        fileInput.click();
    });

    dropZone.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            fileInput.click();
        }
    });

    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('drag-over');
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('drag-over');
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('drag-over');
        const files = e.dataTransfer.files;
        if (files.length > 0 && files[0].type.startsWith('image/')) {
            handleFile(files[0]);
        }
    });

    fileInput.addEventListener('change', () => {
        if (fileInput.files.length > 0) {
            handleFile(fileInput.files[0]);
        }
    });

    removeImageBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        clearUpload();
    });

    /**
     * Handle uploaded file
     */
    function handleFile(file) {
        uploadedFile = file;
        const reader = new FileReader();
        reader.onload = (e) => {
            previewImage.src = e.target.result;
            document.querySelector('.drop-zone-content').classList.add('hidden');
            previewContainer.classList.remove('hidden');
            analyzeBtn.disabled = false;
            resetBtn.classList.remove('hidden');
        };
        reader.readAsDataURL(file);
    }

    /**
     * Clear uploaded file
     */
    function clearUpload() {
        uploadedFile = null;
        previewImage.src = '';
        fileInput.value = '';
        document.querySelector('.drop-zone-content').classList.remove('hidden');
        previewContainer.classList.add('hidden');
        analyzeBtn.disabled = true;
    }

    // --- Analyze Button ---
    analyzeBtn.addEventListener('click', async () => {
        if (!uploadedFile) return;

        // Show loading
        uploadSection.style.display = 'none';
        loadingSection.classList.remove('hidden');
        resultsSection.classList.add('hidden');
        manualSection.classList.add('hidden');

        // Process image
        const img = new Image();
        img.onload = async () => {
            try {
                const detected = await analyzer.analyzeScreenshot(img);

                // Since pure canvas-based OCR is very limited,
                // we'll show the manual input with any detected values pre-filled
                setTimeout(() => {
                    loadingSection.classList.add('hidden');
                    manualSection.classList.remove('hidden');
                    uploadSection.style.display = '';

                    // Pre-fill detected values from screenshot parsing.
                    if (detected.pokemonName) {
                        document.getElementById('manual-pokemon').value = detected.pokemonName;
                    }
                    if (detected.cp) {
                        document.getElementById('manual-cp').value = detected.cp;
                    }
                    if (detected.ivs) {
                        document.getElementById('manual-attack').value = detected.ivs.attack;
                        document.getElementById('manual-defense').value = detected.ivs.defense;
                        document.getElementById('manual-hp').value = detected.ivs.hp;
                    }
                    if (detected.level && detected.level >= 1 && detected.level <= 50) {
                        document.getElementById('manual-level').value = detected.level;
                    }

                    if (detected.pokemonName && detected.ivs && detected.level) {
                        showNotification('Screenshot analyzed. Please verify detected values before running final analysis.', 'info');
                    } else {
                        showNotification('Partial detection complete. CP is reliable; please confirm or edit other fields.', 'warning');
                    }
                }, 1500);
            } catch (err) {
                console.error('Analysis error:', err);
                loadingSection.classList.add('hidden');
                manualSection.classList.remove('hidden');
                uploadSection.style.display = '';
                showNotification('Could not auto-detect all values. Please enter details manually.', 'warning');
            }
        };
        img.src = previewImage.src;
    });

    // --- Manual Analyze ---
    manualAnalyzeBtn.addEventListener('click', () => {
        const nameInput = document.getElementById('manual-pokemon').value.trim();
        const cp = parseInt(document.getElementById('manual-cp').value) || 0;
        const attack = parseInt(document.getElementById('manual-attack').value);
        const defense = parseInt(document.getElementById('manual-defense').value);
        const hp = parseInt(document.getElementById('manual-hp').value);
        const level = parseFloat(document.getElementById('manual-level').value) || null;

        if (!nameInput) {
            showNotification('Please enter the Pokémon name.', 'error');
            return;
        }

        // Find the Pokémon
        const matchedName = analyzer.fuzzyMatchPokemon(nameInput);
        if (!matchedName) {
            showNotification(`Pokémon "${nameInput}" not found. Try another name.`, 'error');
            return;
        }

        if (isNaN(attack) || isNaN(defense) || isNaN(hp)) {
            showNotification('Please enter all IV values (Attack, Defense, HP).', 'error');
            return;
        }

        if (level !== null && (level < 1 || level > 50)) {
            showNotification('Please enter a valid level between 1 and 50.', 'error');
            return;
        }

        // Show loading briefly
        manualSection.classList.add('hidden');
        loadingSection.classList.remove('hidden');

        setTimeout(() => {
            const result = analyzer.performAnalysis(matchedName, cp, attack, defense, hp, level);

            if (result.error) {
                loadingSection.classList.add('hidden');
                manualSection.classList.remove('hidden');
                showNotification(result.error, 'error');
                return;
            }

            loadingSection.classList.add('hidden');
            renderResults(result);
        }, 1200);
    });

    // --- Reset ---
    resetBtn.addEventListener('click', () => {
        clearUpload();
        resultsSection.classList.add('hidden');
        manualSection.classList.add('hidden');
        resetBtn.classList.add('hidden');
        uploadSection.style.display = '';

        // Clear manual inputs
        ['manual-pokemon', 'manual-cp', 'manual-attack', 'manual-defense', 'manual-hp', 'manual-level']
            .forEach(id => document.getElementById(id).value = '');
    });

    // --- Render Results ---
    function renderResults(data) {
        resultsSection.classList.remove('hidden');

        // Smooth scroll to results
        setTimeout(() => {
            resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);

        renderIdentity(data);
        renderIVStats(data);
        renderLevel(data);
        renderPvP(data);
        renderCandy(data);
    }

    /**
     * Render Pokémon identity card
     */
    function renderIdentity(data) {
        const sprite = document.getElementById('pokemon-sprite');
        sprite.src = data.fallbackSprite;
        sprite.alt = data.pokemonName;
        sprite.onerror = () => {
            sprite.src = `https://img.pokemondb.net/sprites/home/normal/${data.pokemonName.toLowerCase().replace(/[^a-z0-9]/g, '')}.png`;
            sprite.onerror = () => { sprite.style.display = 'none'; };
        };

        document.getElementById('pokemon-name').textContent = data.pokemonName;
        document.getElementById('pokemon-cp').textContent = data.cp || data.inputCP || '—';

        const typeBadges = document.getElementById('pokemon-types');
        typeBadges.innerHTML = data.types.map(type =>
            `<span class="type-badge type-${type.toLowerCase()}">${type}</span>`
        ).join('');
    }

    /**
     * Render IV Stats with sub-bars
     */
    function renderIVStats(data) {
        const ivPercentage = document.getElementById('iv-percentage');
        ivPercentage.textContent = `${data.ivPercentage}%`;

        // Set badge class
        ivPercentage.className = 'iv-badge';
        if (data.ivPercentage >= 98) ivPercentage.classList.add('perfect');
        else if (data.ivPercentage >= 82) ivPercentage.classList.add('great');
        else if (data.ivPercentage >= 67) ivPercentage.classList.add('good');
        else ivPercentage.classList.add('decent');

        // Render each IV bar with 3 sub-bars
        renderIVBar('attack-sub-bars', data.ivAttack, 'iv-attack-value');
        renderIVBar('defense-sub-bars', data.ivDefense, 'iv-defense-value');
        renderIVBar('hp-sub-bars', data.ivHP, 'iv-hp-value');

        // Total
        document.getElementById('iv-total-value').textContent = `${data.totalIV} / 45`;

        // Appraisal
        const appraisalEl = document.getElementById('iv-appraisal');
        appraisalEl.textContent = data.appraisal.text;
        appraisalEl.className = `iv-appraisal ${data.appraisal.class}`;
        appraisalEl.style.background = data.appraisal.class === 'perfect' ? 'rgba(0,230,118,0.1)' :
            data.appraisal.class === 'great' ? 'rgba(0,212,255,0.1)' :
            data.appraisal.class === 'good' ? 'rgba(255,184,0,0.1)' : 'rgba(255,64,87,0.1)';
        appraisalEl.style.color = data.appraisal.class === 'perfect' ? '#00e676' :
            data.appraisal.class === 'great' ? '#00d4ff' :
            data.appraisal.class === 'good' ? '#ffb800' : '#ff4057';
    }

    /**
     * Render a single IV bar with 3 sub-bars (each worth 5)
     */
    function renderIVBar(containerId, value, valueId) {
        const container = document.getElementById(containerId);
        container.innerHTML = '';
        document.getElementById(valueId).textContent = `${value} / 15`;

        // 3 sub-bars, each representing 5 IV points
        for (let i = 0; i < 3; i++) {
            if (i > 0) {
                const divider = document.createElement('div');
                divider.className = 'iv-sub-bar-divider';
                container.appendChild(divider);
            }

            const subBar = document.createElement('div');
            subBar.className = 'iv-sub-bar';

            const segmentStart = i * 5;
            const segmentEnd = (i + 1) * 5;

            if (value >= segmentEnd) {
                // Fully filled
                subBar.classList.add('filled');
            } else if (value > segmentStart) {
                // Partially filled
                const fillPercent = ((value - segmentStart) / 5) * 100;
                subBar.style.background = `linear-gradient(90deg, 
                    rgba(0,212,255,0.7) ${fillPercent}%, 
                    rgba(255,255,255,0.04) ${fillPercent}%)`;
                subBar.classList.add('partial');
            } else {
                // Empty
                subBar.classList.add('empty');
            }

            // Add animation delay
            subBar.style.animationDelay = `${i * 0.15}s`;

            container.appendChild(subBar);
        }
    }

    /**
     * Render Level arc
     */
    function renderLevel(data) {
        const levelValue = document.getElementById('level-value');
        const levelArcFill = document.getElementById('level-arc-fill');
        const levelArcDot = document.getElementById('level-arc-dot');

        levelValue.textContent = data.level || '—';

        if (data.level) {
            // Arc is a semicircle from left to right
            // Total arc length for radius 90 = pi * 90 ≈ 282.7
            const arcLength = Math.PI * 90;
            const progress = (data.level - 1) / 49; // 0 to 1 for levels 1 to 50
            const fillLength = progress * arcLength;

            // Animate the arc fill
            setTimeout(() => {
                levelArcFill.style.strokeDasharray = `${fillLength} ${arcLength}`;
            }, 300);

            // Position the dot along the arc
            const angle = Math.PI - progress * Math.PI; // From PI (left) to 0 (right)
            const cx = 100 + 90 * Math.cos(angle);
            const cy = 100 - 90 * Math.sin(angle);
            
            setTimeout(() => {
                levelArcDot.setAttribute('cx', cx);
                levelArcDot.setAttribute('cy', cy);
            }, 300);
        }
    }

    /**
     * Render PvP Rankings
     */
    function renderPvP(data) {
        // Type Rankings
        const typeRankingEl = document.getElementById('type-ranking');
        typeRankingEl.innerHTML = data.typeRankings.map(tr => {
            const posClass = tr.rank <= 5 ? 'top-5' : tr.rank <= 10 ? 'top-10' : tr.rank <= 20 ? 'top-20' : 'other';
            return `
                <div class="type-rank-item">
                    <div class="type-rank-position ${posClass}">#${tr.rank}</div>
                    <div class="type-rank-info">
                        <div class="type-rank-name">
                            <span class="type-badge type-${tr.type.toLowerCase()}">${tr.type}</span>
                        </div>
                        <div class="type-rank-desc">${tr.description}</div>
                    </div>
                    <div class="type-rank-bar">
                        <div class="type-rank-fill" style="width: ${tr.score}%; background: ${getTypeColor(tr.type)};"></div>
                    </div>
                </div>
            `;
        }).join('');

        // League Rankings
        const leagueRankingsEl = document.getElementById('league-rankings');
        const leagueOrder = ['great', 'ultra', 'master'];
        const leagueClasses = { great: 'great', ultra: 'ultra', master: 'master' };

        leagueRankingsEl.innerHTML = leagueOrder.map(key => {
            const lr = data.pvpRankings[key];
            if (!lr) return '';

            const rankDisplay = lr.rank ? `#${lr.rank}` : '—';
            const tierClass = lr.tier ? `tier-${lr.tier.toLowerCase()}` : 'tier-d';
            const eligibleClass = lr.eligible || key === 'master' ? 'eligible' : 'ineligible';

            // For master league, always eligible
            let eligibleNote = '';
            if (!lr.eligible && key !== 'master') {
                eligibleNote = `<div class="league-score" style="color: var(--accent-red);">CP exceeds ${lr.cpCap}</div>`;
            }

            return `
                <div class="league-item ${leagueClasses[key]}">
                    <div class="league-name">${lr.leagueName}</div>
                    <div class="league-rank ${eligibleClass}">
                        ${lr.eligible || key === 'master' ? rankDisplay : 'Ineligible'}
                    </div>
                    ${lr.score ? `<div class="league-score">Score: ${lr.score}/100 · ${lr.role}</div>` : ''}
                    ${lr.tier ? `<span class="league-tier ${tierClass}">Tier ${lr.tier}</span>` : ''}
                    ${eligibleNote}
                </div>
            `;
        }).join('');

        // Moveset
        const movesetEl = document.getElementById('best-moveset');
        if (data.moveset) {
            const fastColor = getTypeColor(data.moveset.fastType);
            let movesHTML = `
                <div class="move-item">
                    <div class="move-type-dot" style="background: ${fastColor};"></div>
                    <div class="move-details">
                        <div class="move-name">${data.moveset.fast}</div>
                        <div class="move-kind">Fast Move</div>
                    </div>
                    <div class="move-stats-info">${data.moveset.fastType}</div>
                </div>
            `;

            data.moveset.charged.forEach((move, i) => {
                const chargedColor = getTypeColor(data.moveset.chargedTypes[i]);
                movesHTML += `
                    <div class="move-item">
                        <div class="move-type-dot" style="background: ${chargedColor};"></div>
                        <div class="move-details">
                            <div class="move-name">${move}</div>
                            <div class="move-kind">Charged Move</div>
                        </div>
                        <div class="move-stats-info">${data.moveset.chargedTypes[i]}</div>
                    </div>
                `;
            });

            movesetEl.innerHTML = movesHTML;
        } else {
            movesetEl.innerHTML = '<p style="color: var(--text-muted);">No recommended moveset data available for this Pokémon.</p>';
        }
    }

    /**
     * Render Candy costs
     */
    function renderCandy(data) {
        const costTo50 = data.candyCostTo50;

        document.getElementById('total-candy').textContent = costTo50.totalCandy.toLocaleString();
        document.getElementById('total-xl-candy').textContent = costTo50.totalXLCandy.toLocaleString();
        document.getElementById('total-stardust').textContent = costTo50.totalStardust.toLocaleString();

        // Build table
        const tbody = document.getElementById('candy-table-body');
        tbody.innerHTML = '';

        const table = data.candyTable;
        // Show every whole level
        let lastWholeLevel = Math.floor(data.level);

        table.forEach((row, idx) => {
            const tr = document.createElement('tr');

            // Highlight current level
            if (Math.abs(row.level - data.level) < 0.5 && idx === 0) {
                tr.classList.add('current-level');
            }

            // Mark XL candy zone start
            if (row.isXLZone && (idx === 0 || !table[idx - 1]?.isXLZone)) {
                tr.classList.add('xl-start');
            }

            // Only show whole levels and half levels near current
            const isWhole = row.level % 1 === 0;
            const isNearCurrent = Math.abs(row.level - data.level) <= 1;

            if (!isWhole && !isNearCurrent && row.level < 41) {
                return; // Skip half levels far from current (except XL zone)
            }

            tr.innerHTML = `
                <td>${row.level}${row.level === data.level ? ' ←' : ''}</td>
                <td>${row.candy > 0 ? row.candy : '—'}</td>
                <td>${row.xlCandy > 0 ? row.xlCandy : '—'}</td>
                <td>${row.stardust.toLocaleString()}</td>
                <td>🍬${row.cumulativeCandy} / XL:${row.cumulativeXLCandy} / ⭐${row.cumulativeStardust.toLocaleString()}</td>
            `;

            tbody.appendChild(tr);
        });
    }

    /**
     * Show notification
     */
    function showNotification(message, type = 'info') {
        // Remove existing notifications
        document.querySelectorAll('.notification').forEach(n => n.remove());

        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 1000;
            padding: 14px 24px;
            border-radius: 12px;
            font-family: var(--font-main);
            font-size: 0.9rem;
            font-weight: 500;
            max-width: 400px;
            animation: notification-in 0.3s ease;
            backdrop-filter: blur(16px);
            box-shadow: 0 8px 32px rgba(0,0,0,0.4);
        `;

        const colors = {
            info: { bg: 'rgba(0,212,255,0.15)', border: 'rgba(0,212,255,0.3)', text: '#00d4ff' },
            warning: { bg: 'rgba(255,184,0,0.15)', border: 'rgba(255,184,0,0.3)', text: '#ffb800' },
            error: { bg: 'rgba(255,64,87,0.15)', border: 'rgba(255,64,87,0.3)', text: '#ff4057' },
            success: { bg: 'rgba(0,230,118,0.15)', border: 'rgba(0,230,118,0.3)', text: '#00e676' },
        };

        const c = colors[type] || colors.info;
        notification.style.background = c.bg;
        notification.style.border = `1px solid ${c.border}`;
        notification.style.color = c.text;
        notification.textContent = message;

        document.body.appendChild(notification);

        // Auto-dismiss
        setTimeout(() => {
            notification.style.animation = 'notification-out 0.3s ease forwards';
            setTimeout(() => notification.remove(), 300);
        }, 4000);
    }

    // Add notification animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes notification-in {
            from { transform: translateX(100px); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes notification-out {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100px); opacity: 0; }
        }
    `;
    document.head.appendChild(style);

    /**
     * Particle background animation
     */
    function initParticles() {
        const canvas = document.getElementById('particle-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        function resize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        resize();
        window.addEventListener('resize', resize);

        const particles = [];
        const particleCount = 50;

        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.3,
                vy: (Math.random() - 0.5) * 0.3,
                size: Math.random() * 2 + 0.5,
                alpha: Math.random() * 0.3 + 0.05,
                color: ['#ff4057', '#7c4dff', '#00d4ff', '#ffb800'][Math.floor(Math.random() * 4)]
            });
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;

                if (p.x < 0) p.x = canvas.width;
                if (p.x > canvas.width) p.x = 0;
                if (p.y < 0) p.y = canvas.height;
                if (p.y > canvas.height) p.y = 0;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.globalAlpha = p.alpha;
                ctx.fill();
            });

            ctx.globalAlpha = 1;

            // Draw connections
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 120) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(124, 77, 255, ${0.05 * (1 - dist / 120)})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }

            requestAnimationFrame(animate);
        }

        animate();
    }

})();
