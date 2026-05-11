/**
 * Pokémon GO Power-Up Costs
 * Candy, XL Candy, and Stardust costs for each half-level power-up.
 */

const POWERUP_COSTS = [
    // Level -> Level+0.5 : { candy, xlCandy, stardust }
    // Levels 1-40 use regular candy only
    { fromLevel: 1, candy: 1, xlCandy: 0, stardust: 200 },
    { fromLevel: 1.5, candy: 1, xlCandy: 0, stardust: 200 },
    { fromLevel: 2, candy: 1, xlCandy: 0, stardust: 200 },
    { fromLevel: 2.5, candy: 1, xlCandy: 0, stardust: 200 },
    { fromLevel: 3, candy: 1, xlCandy: 0, stardust: 400 },
    { fromLevel: 3.5, candy: 1, xlCandy: 0, stardust: 400 },
    { fromLevel: 4, candy: 1, xlCandy: 0, stardust: 400 },
    { fromLevel: 4.5, candy: 1, xlCandy: 0, stardust: 400 },
    { fromLevel: 5, candy: 1, xlCandy: 0, stardust: 600 },
    { fromLevel: 5.5, candy: 1, xlCandy: 0, stardust: 600 },
    { fromLevel: 6, candy: 1, xlCandy: 0, stardust: 600 },
    { fromLevel: 6.5, candy: 1, xlCandy: 0, stardust: 600 },
    { fromLevel: 7, candy: 1, xlCandy: 0, stardust: 800 },
    { fromLevel: 7.5, candy: 1, xlCandy: 0, stardust: 800 },
    { fromLevel: 8, candy: 1, xlCandy: 0, stardust: 800 },
    { fromLevel: 8.5, candy: 1, xlCandy: 0, stardust: 800 },
    { fromLevel: 9, candy: 1, xlCandy: 0, stardust: 1000 },
    { fromLevel: 9.5, candy: 1, xlCandy: 0, stardust: 1000 },
    { fromLevel: 10, candy: 1, xlCandy: 0, stardust: 1000 },
    { fromLevel: 10.5, candy: 1, xlCandy: 0, stardust: 1000 },

    { fromLevel: 11, candy: 2, xlCandy: 0, stardust: 1300 },
    { fromLevel: 11.5, candy: 2, xlCandy: 0, stardust: 1300 },
    { fromLevel: 12, candy: 2, xlCandy: 0, stardust: 1300 },
    { fromLevel: 12.5, candy: 2, xlCandy: 0, stardust: 1300 },
    { fromLevel: 13, candy: 2, xlCandy: 0, stardust: 1600 },
    { fromLevel: 13.5, candy: 2, xlCandy: 0, stardust: 1600 },
    { fromLevel: 14, candy: 2, xlCandy: 0, stardust: 1600 },
    { fromLevel: 14.5, candy: 2, xlCandy: 0, stardust: 1600 },
    { fromLevel: 15, candy: 2, xlCandy: 0, stardust: 1900 },
    { fromLevel: 15.5, candy: 2, xlCandy: 0, stardust: 1900 },
    { fromLevel: 16, candy: 2, xlCandy: 0, stardust: 1900 },
    { fromLevel: 16.5, candy: 2, xlCandy: 0, stardust: 1900 },
    { fromLevel: 17, candy: 2, xlCandy: 0, stardust: 2200 },
    { fromLevel: 17.5, candy: 2, xlCandy: 0, stardust: 2200 },
    { fromLevel: 18, candy: 2, xlCandy: 0, stardust: 2200 },
    { fromLevel: 18.5, candy: 2, xlCandy: 0, stardust: 2200 },
    { fromLevel: 19, candy: 2, xlCandy: 0, stardust: 2500 },
    { fromLevel: 19.5, candy: 2, xlCandy: 0, stardust: 2500 },
    { fromLevel: 20, candy: 2, xlCandy: 0, stardust: 2500 },
    { fromLevel: 20.5, candy: 2, xlCandy: 0, stardust: 2500 },

    { fromLevel: 21, candy: 3, xlCandy: 0, stardust: 3000 },
    { fromLevel: 21.5, candy: 3, xlCandy: 0, stardust: 3000 },
    { fromLevel: 22, candy: 3, xlCandy: 0, stardust: 3000 },
    { fromLevel: 22.5, candy: 3, xlCandy: 0, stardust: 3000 },
    { fromLevel: 23, candy: 3, xlCandy: 0, stardust: 3500 },
    { fromLevel: 23.5, candy: 3, xlCandy: 0, stardust: 3500 },
    { fromLevel: 24, candy: 3, xlCandy: 0, stardust: 3500 },
    { fromLevel: 24.5, candy: 3, xlCandy: 0, stardust: 3500 },
    { fromLevel: 25, candy: 3, xlCandy: 0, stardust: 4000 },
    { fromLevel: 25.5, candy: 4, xlCandy: 0, stardust: 4000 },
    { fromLevel: 26, candy: 4, xlCandy: 0, stardust: 4000 },
    { fromLevel: 26.5, candy: 4, xlCandy: 0, stardust: 4000 },
    { fromLevel: 27, candy: 4, xlCandy: 0, stardust: 4500 },
    { fromLevel: 27.5, candy: 4, xlCandy: 0, stardust: 4500 },
    { fromLevel: 28, candy: 4, xlCandy: 0, stardust: 4500 },
    { fromLevel: 28.5, candy: 4, xlCandy: 0, stardust: 4500 },
    { fromLevel: 29, candy: 4, xlCandy: 0, stardust: 5000 },
    { fromLevel: 29.5, candy: 4, xlCandy: 0, stardust: 5000 },
    { fromLevel: 30, candy: 4, xlCandy: 0, stardust: 5000 },
    { fromLevel: 30.5, candy: 4, xlCandy: 0, stardust: 5000 },

    { fromLevel: 31, candy: 6, xlCandy: 0, stardust: 6000 },
    { fromLevel: 31.5, candy: 6, xlCandy: 0, stardust: 6000 },
    { fromLevel: 32, candy: 6, xlCandy: 0, stardust: 6000 },
    { fromLevel: 32.5, candy: 6, xlCandy: 0, stardust: 6000 },
    { fromLevel: 33, candy: 8, xlCandy: 0, stardust: 7000 },
    { fromLevel: 33.5, candy: 8, xlCandy: 0, stardust: 7000 },
    { fromLevel: 34, candy: 8, xlCandy: 0, stardust: 7000 },
    { fromLevel: 34.5, candy: 8, xlCandy: 0, stardust: 7000 },
    { fromLevel: 35, candy: 10, xlCandy: 0, stardust: 8000 },
    { fromLevel: 35.5, candy: 10, xlCandy: 0, stardust: 8000 },
    { fromLevel: 36, candy: 10, xlCandy: 0, stardust: 8000 },
    { fromLevel: 36.5, candy: 10, xlCandy: 0, stardust: 8000 },
    { fromLevel: 37, candy: 12, xlCandy: 0, stardust: 9000 },
    { fromLevel: 37.5, candy: 12, xlCandy: 0, stardust: 9000 },
    { fromLevel: 38, candy: 12, xlCandy: 0, stardust: 9000 },
    { fromLevel: 38.5, candy: 12, xlCandy: 0, stardust: 9000 },
    { fromLevel: 39, candy: 15, xlCandy: 0, stardust: 10000 },
    { fromLevel: 39.5, candy: 15, xlCandy: 0, stardust: 10000 },

    // Levels 40-50 use XL Candy
    { fromLevel: 40, candy: 0, xlCandy: 10, stardust: 10000 },
    { fromLevel: 40.5, candy: 0, xlCandy: 10, stardust: 10000 },
    { fromLevel: 41, candy: 0, xlCandy: 10, stardust: 11000 },
    { fromLevel: 41.5, candy: 0, xlCandy: 10, stardust: 11000 },
    { fromLevel: 42, candy: 0, xlCandy: 12, stardust: 11000 },
    { fromLevel: 42.5, candy: 0, xlCandy: 12, stardust: 11000 },
    { fromLevel: 43, candy: 0, xlCandy: 12, stardust: 12000 },
    { fromLevel: 43.5, candy: 0, xlCandy: 12, stardust: 12000 },
    { fromLevel: 44, candy: 0, xlCandy: 15, stardust: 12000 },
    { fromLevel: 44.5, candy: 0, xlCandy: 15, stardust: 12000 },
    { fromLevel: 45, candy: 0, xlCandy: 15, stardust: 13000 },
    { fromLevel: 45.5, candy: 0, xlCandy: 15, stardust: 13000 },
    { fromLevel: 46, candy: 0, xlCandy: 17, stardust: 13000 },
    { fromLevel: 46.5, candy: 0, xlCandy: 17, stardust: 13000 },
    { fromLevel: 47, candy: 0, xlCandy: 17, stardust: 14000 },
    { fromLevel: 47.5, candy: 0, xlCandy: 17, stardust: 14000 },
    { fromLevel: 48, candy: 0, xlCandy: 20, stardust: 15000 },
    { fromLevel: 48.5, candy: 0, xlCandy: 20, stardust: 15000 },
    { fromLevel: 49, candy: 0, xlCandy: 20, stardust: 15000 },
    { fromLevel: 49.5, candy: 0, xlCandy: 20, stardust: 15000 },
    { fromLevel: 50, candy: 0, xlCandy: 0, stardust: 0 }, // max level with best buddy
    { fromLevel: 50.5, candy: 0, xlCandy: 0, stardust: 0 },
];

/**
 * Calculate total power-up cost from currentLevel to targetLevel
 */
function calculatePowerUpCost(currentLevel, targetLevel) {
    let totalCandy = 0;
    let totalXLCandy = 0;
    let totalStardust = 0;
    const steps = [];

    for (const cost of POWERUP_COSTS) {
        if (cost.fromLevel >= currentLevel && cost.fromLevel < targetLevel) {
            totalCandy += cost.candy;
            totalXLCandy += cost.xlCandy;
            totalStardust += cost.stardust;
            steps.push({
                fromLevel: cost.fromLevel,
                toLevel: cost.fromLevel + 0.5,
                candy: cost.candy,
                xlCandy: cost.xlCandy,
                stardust: cost.stardust,
                cumulativeCandy: totalCandy,
                cumulativeXLCandy: totalXLCandy,
                cumulativeStardust: totalStardust,
            });
        }
    }

    return {
        totalCandy,
        totalXLCandy,
        totalStardust,
        steps,
    };
}

/**
 * Get cost for leveling from currentLevel to each whole level up to 50
 */
function getLevelByCandyTable(currentLevel) {
    const table = [];
    let cumulativeCandy = 0;
    let cumulativeXLCandy = 0;
    let cumulativeStardust = 0;

    for (const cost of POWERUP_COSTS) {
        if (cost.fromLevel < currentLevel) continue;
        if (cost.fromLevel >= 50.5) break;

        cumulativeCandy += cost.candy;
        cumulativeXLCandy += cost.xlCandy;
        cumulativeStardust += cost.stardust;

        const toLevel = cost.fromLevel + 0.5;
        // Show every whole level and half level
        table.push({
            level: toLevel,
            candy: cost.candy,
            xlCandy: cost.xlCandy,
            stardust: cost.stardust,
            cumulativeCandy,
            cumulativeXLCandy,
            cumulativeStardust,
            isXLZone: cost.fromLevel >= 40,
        });
    }

    return table;
}

window.POWERUP_COSTS = POWERUP_COSTS;
window.calculatePowerUpCost = calculatePowerUpCost;
window.getLevelByCandyTable = getLevelByCandyTable;
