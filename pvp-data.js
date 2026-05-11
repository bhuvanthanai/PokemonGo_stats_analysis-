/**
 * PvP Rankings & Meta Data
 * Based on PvPoke rankings and community tier lists.
 * Rankings are approximate and may shift with game updates.
 */

// Type effectiveness chart
const TYPE_EFFECTIVENESS = {
    Normal:   { weakTo: ["Fighting"], resistantTo: [], immuneTo: ["Ghost"] },
    Fire:     { weakTo: ["Water", "Ground", "Rock"], resistantTo: ["Fire", "Grass", "Ice", "Bug", "Steel", "Fairy"], immuneTo: [] },
    Water:    { weakTo: ["Electric", "Grass"], resistantTo: ["Fire", "Water", "Ice", "Steel"], immuneTo: [] },
    Electric: { weakTo: ["Ground"], resistantTo: ["Electric", "Flying", "Steel"], immuneTo: [] },
    Grass:    { weakTo: ["Fire", "Ice", "Poison", "Flying", "Bug"], resistantTo: ["Water", "Electric", "Grass", "Ground"], immuneTo: [] },
    Ice:      { weakTo: ["Fire", "Fighting", "Rock", "Steel"], resistantTo: ["Ice"], immuneTo: [] },
    Fighting: { weakTo: ["Flying", "Psychic", "Fairy"], resistantTo: ["Bug", "Rock", "Dark"], immuneTo: [] },
    Poison:   { weakTo: ["Ground", "Psychic"], resistantTo: ["Grass", "Fighting", "Poison", "Bug", "Fairy"], immuneTo: [] },
    Ground:   { weakTo: ["Water", "Grass", "Ice"], resistantTo: ["Poison", "Rock"], immuneTo: ["Electric"] },
    Flying:   { weakTo: ["Electric", "Ice", "Rock"], resistantTo: ["Grass", "Fighting", "Bug"], immuneTo: ["Ground"] },
    Psychic:  { weakTo: ["Bug", "Ghost", "Dark"], resistantTo: ["Fighting", "Psychic"], immuneTo: [] },
    Bug:      { weakTo: ["Fire", "Flying", "Rock"], resistantTo: ["Grass", "Fighting", "Ground"], immuneTo: [] },
    Rock:     { weakTo: ["Water", "Grass", "Fighting", "Ground", "Steel"], resistantTo: ["Normal", "Fire", "Poison", "Flying"], immuneTo: [] },
    Ghost:    { weakTo: ["Ghost", "Dark"], resistantTo: ["Poison", "Bug"], immuneTo: ["Normal", "Fighting"] },
    Dragon:   { weakTo: ["Ice", "Dragon", "Fairy"], resistantTo: ["Fire", "Water", "Electric", "Grass"], immuneTo: [] },
    Dark:     { weakTo: ["Fighting", "Bug", "Fairy"], resistantTo: ["Ghost", "Dark"], immuneTo: ["Psychic"] },
    Steel:    { weakTo: ["Fire", "Fighting", "Ground"], resistantTo: ["Normal", "Grass", "Ice", "Flying", "Psychic", "Bug", "Rock", "Dragon", "Steel", "Fairy"], immuneTo: ["Poison"] },
    Fairy:    { weakTo: ["Poison", "Steel"], resistantTo: ["Fighting", "Bug", "Dark"], immuneTo: ["Dragon"] },
};

/**
 * PvP Rankings by league
 * Score is 0-100 (100 = best in league)
 * Tier: S, A, B, C, D
 */
const PVP_RANKINGS = {
    // Great League (1500 CP)
    great: {
        name: "Great League",
        cpCap: 1500,
        rankings: {
            "Medicham": { rank: 1, score: 98.5, tier: "S", role: "Lead/Switch" },
            "Azumarill": { rank: 2, score: 97.8, tier: "S", role: "Lead/Closer" },
            "Bastiodon": { rank: 3, score: 97.2, tier: "S", role: "Closer" },
            "Registeel": { rank: 4, score: 96.9, tier: "S", role: "Lead/Switch" },
            "Altaria": { rank: 5, score: 96.4, tier: "S", role: "Lead" },
            "Galvantula": { rank: 6, score: 95.8, tier: "S", role: "Lead/Switch" },
            "Swampert": { rank: 7, score: 95.5, tier: "S", role: "Closer/Switch" },
            "Skarmory": { rank: 8, score: 95.1, tier: "S", role: "Lead" },
            "Nidoqueen": { rank: 9, score: 94.7, tier: "S", role: "Switch" },
            "Umbreon": { rank: 10, score: 94.3, tier: "S", role: "Closer" },
            "Trevenant": { rank: 11, score: 93.9, tier: "A", role: "Lead/Switch" },
            "Stunfisk (Galarian)": { rank: 12, score: 93.5, tier: "A", role: "Closer" },
            "Walrein": { rank: 13, score: 93.1, tier: "A", role: "Lead/Closer" },
            "Lanturn": { rank: 14, score: 92.7, tier: "A", role: "Switch" },
            "Lickitung": { rank: 15, score: 92.3, tier: "A", role: "Lead" },
            "Sableye": { rank: 16, score: 91.9, tier: "A", role: "Lead" },
            "Whiscash": { rank: 18, score: 91.1, tier: "A", role: "Closer" },
            "Scrafty": { rank: 19, score: 90.7, tier: "A", role: "Switch" },
            "Froslass": { rank: 20, score: 90.3, tier: "A", role: "Lead" },
            "Venusaur": { rank: 21, score: 89.9, tier: "A", role: "Closer" },
            "Toxicroak": { rank: 22, score: 89.5, tier: "A", role: "Switch" },
            "Dewgong": { rank: 23, score: 89.1, tier: "A", role: "Lead" },
            "Pelipper": { rank: 25, score: 88.3, tier: "B", role: "Lead" },
            "Hypno": { rank: 26, score: 87.9, tier: "B", role: "Switch" },
            "Diggersby": { rank: 27, score: 87.5, tier: "B", role: "Closer" },
            "Mandibuzz": { rank: 28, score: 87.1, tier: "B", role: "Closer" },
            "Jellicent": { rank: 29, score: 86.7, tier: "B", role: "Lead/Switch" },
            "Abomasnow": { rank: 30, score: 86.3, tier: "B", role: "Lead/Closer" },
            "Obstagoon": { rank: 31, score: 85.9, tier: "B", role: "Switch" },
            "Ferrothorn": { rank: 32, score: 85.5, tier: "B", role: "Closer" },
            "Cresselia": { rank: 33, score: 85.1, tier: "B", role: "Closer" },
            "Drapion": { rank: 34, score: 84.7, tier: "B", role: "Switch" },
            "Ninetales (Alola)": { rank: 35, score: 84.3, tier: "B", role: "Lead" },
            "Marowak (Alola)": { rank: 36, score: 83.9, tier: "B", role: "Switch" },
            "Politoed": { rank: 37, score: 83.5, tier: "B", role: "Switch" },
            "Machamp": { rank: 40, score: 82.3, tier: "B", role: "Closer" },
            "Muk (Alola)": { rank: 42, score: 81.5, tier: "B", role: "Switch" },
            "Sandslash (Alola)": { rank: 45, score: 80.3, tier: "C", role: "Closer" },
            "Wigglytuff": { rank: 48, score: 79.1, tier: "C", role: "Lead" },
            "Clefable": { rank: 50, score: 78.3, tier: "C", role: "Closer" },
            "Poliwrath": { rank: 55, score: 76.5, tier: "C", role: "Closer" },
            "Tentacruel": { rank: 58, score: 75.3, tier: "C", role: "Switch" },
            "Quagsire": { rank: 60, score: 74.5, tier: "C", role: "Closer" },
            "Lapras": { rank: 65, score: 72.3, tier: "C", role: "Closer" },
            "Rapidash (Galarian)": { rank: 70, score: 70.1, tier: "C", role: "Lead" },
        }
    },

    // Ultra League (2500 CP)
    ultra: {
        name: "Ultra League",
        cpCap: 2500,
        rankings: {
            "Cresselia": { rank: 1, score: 98.2, tier: "S", role: "Lead/Closer" },
            "Registeel": { rank: 2, score: 97.5, tier: "S", role: "Closer/Switch" },
            "Giratina": { rank: 3, score: 97.1, tier: "S", role: "Lead/Closer" },
            "Swampert": { rank: 4, score: 96.7, tier: "S", role: "Closer" },
            "Walrein": { rank: 5, score: 96.3, tier: "S", role: "Lead" },
            "Talonflame": { rank: 6, score: 95.8, tier: "S", role: "Lead/Switch" },
            "Trevenant": { rank: 7, score: 95.4, tier: "S", role: "Lead/Switch" },
            "Jellicent": { rank: 8, score: 94.9, tier: "S", role: "Switch" },
            "Scrafty": { rank: 9, score: 94.5, tier: "S", role: "Switch" },
            "Nidoqueen": { rank: 10, score: 94.1, tier: "S", role: "Switch" },
            "Obstagoon": { rank: 11, score: 93.6, tier: "A", role: "Switch" },
            "Cobalion": { rank: 12, score: 93.2, tier: "A", role: "Lead" },
            "Gallade": { rank: 13, score: 92.8, tier: "A", role: "Closer" },
            "Venusaur": { rank: 14, score: 92.3, tier: "A", role: "Closer" },
            "Steelix": { rank: 15, score: 91.9, tier: "A", role: "Closer" },
            "Machamp": { rank: 16, score: 91.5, tier: "A", role: "Closer" },
            "Empoleon": { rank: 17, score: 91.0, tier: "A", role: "Closer" },
            "Escavalier": { rank: 18, score: 90.6, tier: "A", role: "Switch" },
            "Umbreon": { rank: 19, score: 90.1, tier: "A", role: "Closer" },
            "Politoed": { rank: 20, score: 89.7, tier: "A", role: "Switch" },
            "Gyarados": { rank: 21, score: 89.3, tier: "A", role: "Closer" },
            "Poliwrath": { rank: 25, score: 87.5, tier: "B", role: "Closer" },
            "Charizard": { rank: 26, score: 87.1, tier: "B", role: "Lead" },
            "Gliscor": { rank: 28, score: 86.3, tier: "B", role: "Switch" },
            "Blastoise": { rank: 30, score: 85.5, tier: "B", role: "Closer" },
            "Snorlax": { rank: 32, score: 84.7, tier: "B", role: "Closer" },
            "Kingdra": { rank: 35, score: 83.5, tier: "B", role: "Switch" },
            "Lapras": { rank: 38, score: 82.3, tier: "B", role: "Closer" },
            "Drapion": { rank: 40, score: 81.5, tier: "B", role: "Switch" },
            "Aggron": { rank: 42, score: 80.7, tier: "B", role: "Closer" },
            "Latias": { rank: 45, score: 79.5, tier: "C", role: "Closer" },
            "Goodra": { rank: 48, score: 78.3, tier: "C", role: "Switch" },
            "Feraligatr": { rank: 50, score: 77.5, tier: "C", role: "Closer" },
        }
    },

    // Master League (no CP cap)
    master: {
        name: "Master League",
        cpCap: null,
        rankings: {
            "Dialga": { rank: 1, score: 99.0, tier: "S", role: "Lead" },
            "Giratina": { rank: 2, score: 98.2, tier: "S", role: "Closer" },
            "Mewtwo": { rank: 3, score: 97.5, tier: "S", role: "Lead/Switch" },
            "Garchomp": { rank: 4, score: 97.0, tier: "S", role: "Closer" },
            "Groudon": { rank: 5, score: 96.5, tier: "S", role: "Closer" },
            "Kyogre": { rank: 6, score: 96.0, tier: "S", role: "Closer" },
            "Zekrom": { rank: 7, score: 95.5, tier: "S", role: "Lead/Closer" },
            "Dragonite": { rank: 8, score: 95.0, tier: "S", role: "Lead/Switch" },
            "Reshiram": { rank: 9, score: 94.5, tier: "S", role: "Switch" },
            "Palkia": { rank: 10, score: 94.0, tier: "S", role: "Closer" },
            "Lugia": { rank: 11, score: 93.5, tier: "A", role: "Lead" },
            "Ho-Oh": { rank: 12, score: 93.0, tier: "A", role: "Lead" },
            "Togekiss": { rank: 13, score: 92.5, tier: "A", role: "Lead" },
            "Metagross": { rank: 14, score: 92.0, tier: "A", role: "Lead/Closer" },
            "Landorus": { rank: 15, score: 91.5, tier: "A", role: "Lead" },
            "Snorlax": { rank: 16, score: 91.0, tier: "A", role: "Closer" },
            "Mamoswine": { rank: 17, score: 90.5, tier: "A", role: "Closer" },
            "Gyarados": { rank: 18, score: 90.0, tier: "A", role: "Closer" },
            "Rhyperior": { rank: 19, score: 89.5, tier: "A", role: "Closer" },
            "Swampert": { rank: 20, score: 89.0, tier: "A", role: "Closer" },
            "Tyranitar": { rank: 22, score: 88.0, tier: "A", role: "Closer" },
            "Salamence": { rank: 23, score: 87.5, tier: "B", role: "Lead" },
            "Excadrill": { rank: 25, score: 86.5, tier: "B", role: "Closer" },
            "Heatran": { rank: 27, score: 85.5, tier: "B", role: "Lead" },
            "Conkeldurr": { rank: 30, score: 84.0, tier: "B", role: "Closer" },
            "Rayquaza": { rank: 32, score: 83.0, tier: "B", role: "Lead" },
            "Yveltal": { rank: 35, score: 81.5, tier: "B", role: "Switch" },
            "Darkrai": { rank: 38, score: 80.0, tier: "B", role: "Closer" },
            "Hydreigon": { rank: 40, score: 79.0, tier: "B", role: "Switch" },
            "Latias": { rank: 42, score: 78.0, tier: "C", role: "Switch" },
            "Latios": { rank: 44, score: 77.0, tier: "C", role: "Closer" },
            "Kyurem": { rank: 46, score: 76.0, tier: "C", role: "Closer" },
            "Blissey": { rank: 50, score: 74.0, tier: "C", role: "Closer" },
        }
    }
};

/**
 * Type ranking data
 */
const TYPE_META_RANKINGS = {
    Steel:    { rank: 1, score: 95, description: "Best defensive typing, resists 10 types" },
    Dragon:   { rank: 2, score: 92, description: "Premium attackers, resists 4 common types" },
    Fairy:    { rank: 3, score: 90, description: "Key Dragon counter, strong in Great League" },
    Ground:   { rank: 4, score: 88, description: "Excellent coverage, threatens Steel/Fire/Electric" },
    Fighting: { rank: 5, score: 86, description: "Hits Steel/Dark/Normal, common threats" },
    Ghost:    { rank: 6, score: 84, description: "Only 2 weaknesses, great neutral coverage" },
    Water:    { rank: 7, score: 82, description: "Common type with good bulk options" },
    Dark:     { rank: 8, score: 80, description: "Strong vs Ghost/Psychic, key niche" },
    Flying:   { rank: 9, score: 78, description: "Ground immunity, decent coverage" },
    Psychic:  { rank: 10, score: 76, description: "Powerful attackers, fragile defensively" },
    Fire:     { rank: 11, score: 74, description: "Hits Steel/Grass/Ice/Bug" },
    Ice:      { rank: 12, score: 72, description: "Key Dragon counter, poor defensively" },
    Electric: { rank: 13, score: 70, description: "Fast moves, threatens Water/Flying" },
    Poison:   { rank: 14, score: 68, description: "Underrated, great vs Fairy/Grass" },
    Grass:    { rank: 15, score: 66, description: "Many weaknesses, niche use" },
    Rock:     { rank: 16, score: 64, description: "Many weaknesses but strong attackers" },
    Bug:      { rank: 17, score: 58, description: "Generally outclassed" },
    Normal:   { rank: 18, score: 55, description: "Only weak to Fighting, no super effective hits" },
};

/**
 * Recommended PvP movesets per Pokemon
 */
const PVP_MOVESETS = {
    "Medicham": { fast: "Counter", charged: ["Ice Punch", "Psychic"], fastType: "Fighting", chargedTypes: ["Ice", "Psychic"] },
    "Azumarill": { fast: "Bubble", charged: ["Ice Beam", "Hydro Pump"], fastType: "Water", chargedTypes: ["Ice", "Water"] },
    "Bastiodon": { fast: "Smack Down", charged: ["Stone Edge", "Flamethrower"], fastType: "Rock", chargedTypes: ["Rock", "Fire"] },
    "Registeel": { fast: "Lock-On", charged: ["Focus Blast", "Flash Cannon"], fastType: "Normal", chargedTypes: ["Fighting", "Steel"] },
    "Altaria": { fast: "Dragon Breath", charged: ["Sky Attack", "Moonblast"], fastType: "Dragon", chargedTypes: ["Flying", "Fairy"] },
    "Swampert": { fast: "Mud Shot", charged: ["Hydro Cannon", "Earthquake"], fastType: "Ground", chargedTypes: ["Water", "Ground"] },
    "Skarmory": { fast: "Air Slash", charged: ["Brave Bird", "Sky Attack"], fastType: "Flying", chargedTypes: ["Flying", "Flying"] },
    "Nidoqueen": { fast: "Poison Jab", charged: ["Poison Fang", "Earth Power"], fastType: "Poison", chargedTypes: ["Poison", "Ground"] },
    "Umbreon": { fast: "Snarl", charged: ["Foul Play", "Last Resort"], fastType: "Dark", chargedTypes: ["Dark", "Normal"] },
    "Trevenant": { fast: "Shadow Claw", charged: ["Seed Bomb", "Shadow Ball"], fastType: "Ghost", chargedTypes: ["Grass", "Ghost"] },
    "Walrein": { fast: "Powder Snow", charged: ["Icicle Spear", "Earthquake"], fastType: "Ice", chargedTypes: ["Ice", "Ground"] },
    "Venusaur": { fast: "Vine Whip", charged: ["Frenzy Plant", "Sludge Bomb"], fastType: "Grass", chargedTypes: ["Grass", "Poison"] },
    "Cresselia": { fast: "Psycho Cut", charged: ["Grass Knot", "Moonblast"], fastType: "Psychic", chargedTypes: ["Grass", "Fairy"] },
    "Giratina": { fast: "Shadow Claw", charged: ["Dragon Claw", "Shadow Sneak"], fastType: "Ghost", chargedTypes: ["Dragon", "Ghost"] },
    "Dialga": { fast: "Dragon Breath", charged: ["Iron Head", "Draco Meteor"], fastType: "Dragon", chargedTypes: ["Steel", "Dragon"] },
    "Mewtwo": { fast: "Psycho Cut", charged: ["Psystrike", "Shadow Ball"], fastType: "Psychic", chargedTypes: ["Psychic", "Ghost"] },
    "Garchomp": { fast: "Mud Shot", charged: ["Outrage", "Earth Power"], fastType: "Ground", chargedTypes: ["Dragon", "Ground"] },
    "Groudon": { fast: "Mud Shot", charged: ["Earthquake", "Fire Punch"], fastType: "Ground", chargedTypes: ["Ground", "Fire"] },
    "Kyogre": { fast: "Waterfall", charged: ["Surf", "Blizzard"], fastType: "Water", chargedTypes: ["Water", "Ice"] },
    "Dragonite": { fast: "Dragon Breath", charged: ["Dragon Claw", "Superpower"], fastType: "Dragon", chargedTypes: ["Dragon", "Fighting"] },
    "Metagross": { fast: "Bullet Punch", charged: ["Meteor Mash", "Earthquake"], fastType: "Steel", chargedTypes: ["Steel", "Ground"] },
    "Togekiss": { fast: "Charm", charged: ["Aerial Ace", "Flamethrower"], fastType: "Fairy", chargedTypes: ["Flying", "Fire"] },
    "Latias": { fast: "Dragon Breath", charged: ["Outrage", "Thunder"], fastType: "Dragon", chargedTypes: ["Dragon", "Electric"] },
    "Latios": { fast: "Dragon Breath", charged: ["Dragon Claw", "Solar Beam"], fastType: "Dragon", chargedTypes: ["Dragon", "Grass"] },
    "Machamp": { fast: "Counter", charged: ["Cross Chop", "Rock Slide"], fastType: "Fighting", chargedTypes: ["Fighting", "Rock"] },
    "Charizard": { fast: "Fire Spin", charged: ["Blast Burn", "Dragon Claw"], fastType: "Fire", chargedTypes: ["Fire", "Dragon"] },
    "Gengar": { fast: "Shadow Claw", charged: ["Shadow Ball", "Shadow Punch"], fastType: "Ghost", chargedTypes: ["Ghost", "Ghost"] },
    "Tyranitar": { fast: "Smack Down", charged: ["Stone Edge", "Crunch"], fastType: "Rock", chargedTypes: ["Rock", "Dark"] },
    "Snorlax": { fast: "Lick", charged: ["Body Slam", "Superpower"], fastType: "Ghost", chargedTypes: ["Normal", "Fighting"] },
    "Gyarados": { fast: "Dragon Breath", charged: ["Aqua Tail", "Crunch"], fastType: "Dragon", chargedTypes: ["Water", "Dark"] },
    "Lapras": { fast: "Ice Shard", charged: ["Surf", "Skull Bash"], fastType: "Ice", chargedTypes: ["Water", "Normal"] },
    "Salamence": { fast: "Dragon Tail", charged: ["Outrage", "Hydro Pump"], fastType: "Dragon", chargedTypes: ["Dragon", "Water"] },
    "Mamoswine": { fast: "Powder Snow", charged: ["Avalanche", "Bulldoze"], fastType: "Ice", chargedTypes: ["Ice", "Ground"] },
    "Rhyperior": { fast: "Mud-Slap", charged: ["Rock Wrecker", "Surf"], fastType: "Ground", chargedTypes: ["Rock", "Water"] },
    "Galvantula": { fast: "Volt Switch", charged: ["Discharge", "Lunge"], fastType: "Electric", chargedTypes: ["Electric", "Bug"] },
    "Lanturn": { fast: "Spark", charged: ["Surf", "Thunderbolt"], fastType: "Electric", chargedTypes: ["Water", "Electric"] },
    "Sableye": { fast: "Shadow Claw", charged: ["Foul Play", "Return"], fastType: "Ghost", chargedTypes: ["Dark", "Normal"] },
    "Froslass": { fast: "Powder Snow", charged: ["Avalanche", "Shadow Ball"], fastType: "Ice", chargedTypes: ["Ice", "Ghost"] },
    "Scrafty": { fast: "Counter", charged: ["Foul Play", "Power-Up Punch"], fastType: "Fighting", chargedTypes: ["Dark", "Fighting"] },
    "Jellicent": { fast: "Hex", charged: ["Shadow Ball", "Bubble Beam"], fastType: "Ghost", chargedTypes: ["Ghost", "Water"] },
    "Talonflame": { fast: "Incinerate", charged: ["Flame Charge", "Brave Bird"], fastType: "Fire", chargedTypes: ["Fire", "Flying"] },
    "Obstagoon": { fast: "Counter", charged: ["Night Slash", "Cross Chop"], fastType: "Fighting", chargedTypes: ["Dark", "Fighting"] },
};

/**
 * Get type ranking for a Pokemon's types
 */
function getTypeRanking(types) {
    return types.map(type => ({
        type,
        ...TYPE_META_RANKINGS[type]
    }));
}

/**
 * Get PvP ranking across all leagues
 */
function getPvPRankings(pokemonName, cp) {
    const results = {};

    for (const [leagueKey, league] of Object.entries(PVP_RANKINGS)) {
        const ranking = league.rankings[pokemonName];
        if (ranking) {
            const eligible = league.cpCap === null || cp <= league.cpCap;
            results[leagueKey] = {
                leagueName: league.name,
                eligible: leagueKey === 'master' ? true : eligible,
                cpCap: league.cpCap,
                ...ranking
            };
        } else {
            results[leagueKey] = {
                leagueName: league.name,
                eligible: league.cpCap === null || cp <= league.cpCap,
                cpCap: league.cpCap,
                rank: null,
                score: 0,
                tier: "D",
                role: "Not ranked"
            };
        }
    }

    return results;
}

/**
 * Get recommended moveset
 */
function getRecommendedMoveset(pokemonName) {
    return PVP_MOVESETS[pokemonName] || null;
}

/**
 * Get type color for CSS
 */
function getTypeColor(type) {
    const colors = {
        Normal: "#a8a878", Fire: "#f08030", Water: "#6890f0", Electric: "#f8d030",
        Grass: "#78c850", Ice: "#98d8d8", Fighting: "#c03028", Poison: "#a040a0",
        Ground: "#e0c068", Flying: "#a890f0", Psychic: "#f85888", Bug: "#a8b820",
        Rock: "#b8a038", Ghost: "#705898", Dragon: "#7038f8", Dark: "#705848",
        Steel: "#b8b8d0", Fairy: "#ee99ac"
    };
    return colors[type] || "#888";
}

window.TYPE_EFFECTIVENESS = TYPE_EFFECTIVENESS;
window.PVP_RANKINGS = PVP_RANKINGS;
window.TYPE_META_RANKINGS = TYPE_META_RANKINGS;
window.PVP_MOVESETS = PVP_MOVESETS;
window.getTypeRanking = getTypeRanking;
window.getPvPRankings = getPvPRankings;
window.getRecommendedMoveset = getRecommendedMoveset;
window.getTypeColor = getTypeColor;
