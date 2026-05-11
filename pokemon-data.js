/**
 * Pokémon GO Game Data
 * Base stats, types, and CP multipliers for all relevant Pokémon.
 * Data sourced from Pokémon GO game master file.
 */

// CP Multiplier per level (1 to 51, including half levels)
const CPM = {
    1: 0.094, 1.5: 0.135137432, 2: 0.166397870, 2.5: 0.192650919, 3: 0.215732470, 3.5: 0.236572661,
    4: 0.255720050, 4.5: 0.273530381, 5: 0.290249880, 5.5: 0.306057378, 6: 0.321087600, 6.5: 0.335445036,
    7: 0.349212680, 7.5: 0.362457751, 8: 0.375235600, 8.5: 0.387592416, 9: 0.399567280, 9.5: 0.411193551,
    10: 0.422500000, 10.5: 0.432926409, 11: 0.443107550, 11.5: 0.453059959, 12: 0.462798400, 12.5: 0.472336093,
    13: 0.481684950, 13.5: 0.490855800, 14: 0.499858440, 14.5: 0.508701765, 15: 0.517393950, 15.5: 0.525942511,
    16: 0.534354300, 16.5: 0.542635738, 17: 0.550792700, 17.5: 0.558830586, 18: 0.566754500, 18.5: 0.574569133,
    19: 0.582278900, 19.5: 0.589887907, 20: 0.597400000, 20.5: 0.604823649, 21: 0.612157300, 21.5: 0.619404122,
    22: 0.626567100, 22.5: 0.633649143, 23: 0.640652950, 23.5: 0.647580967, 24: 0.654435630, 24.5: 0.661219252,
    25: 0.667934000, 25.5: 0.674581896, 26: 0.681164900, 26.5: 0.687684904, 27: 0.694143650, 27.5: 0.700542901,
    28: 0.706884200, 28.5: 0.713169109, 29: 0.719399100, 29.5: 0.725575614, 30: 0.731700000, 30.5: 0.734741009,
    31: 0.737769500, 31.5: 0.740785594, 32: 0.743789430, 32.5: 0.746781211, 33: 0.749761040, 33.5: 0.752729087,
    34: 0.755685500, 34.5: 0.758630368, 35: 0.761563840, 35.5: 0.764486065, 36: 0.767397170, 36.5: 0.770297266,
    37: 0.773186500, 37.5: 0.776064962, 38: 0.778932750, 38.5: 0.781790055, 39: 0.784637000, 39.5: 0.787473608,
    40: 0.790300000, 40.5: 0.792803968, 41: 0.795300000, 41.5: 0.797800000, 42: 0.800300000, 42.5: 0.802800000,
    43: 0.805300000, 43.5: 0.807800000, 44: 0.810300000, 44.5: 0.812800000, 45: 0.815300000, 45.5: 0.817800000,
    46: 0.820300000, 46.5: 0.822800000, 47: 0.825300000, 47.5: 0.827800000, 48: 0.830300000, 48.5: 0.832800000,
    49: 0.835300000, 49.5: 0.837800000, 50: 0.840300000, 50.5: 0.842800000, 51: 0.845300000
};

/**
 * Pokémon base stats dictionary
 * Format: { name: { baseAttack, baseDefense, baseStamina, types: [type1, type2?] } }
 * Includes meta-relevant Pokémon for PvP
 */
const POKEMON_DATA = {
    // Gen 1
    "Bulbasaur": { baseAttack: 118, baseDefense: 111, baseStamina: 128, types: ["Grass", "Poison"], dexNum: 1 },
    "Ivysaur": { baseAttack: 151, baseDefense: 143, baseStamina: 155, types: ["Grass", "Poison"], dexNum: 2 },
    "Venusaur": { baseAttack: 198, baseDefense: 189, baseStamina: 190, types: ["Grass", "Poison"], dexNum: 3 },
    "Charmander": { baseAttack: 116, baseDefense: 93, baseStamina: 118, types: ["Fire"], dexNum: 4 },
    "Charmeleon": { baseAttack: 158, baseDefense: 126, baseStamina: 151, types: ["Fire"], dexNum: 5 },
    "Charizard": { baseAttack: 223, baseDefense: 173, baseStamina: 186, types: ["Fire", "Flying"], dexNum: 6 },
    "Squirtle": { baseAttack: 94, baseDefense: 121, baseStamina: 127, types: ["Water"], dexNum: 7 },
    "Wartortle": { baseAttack: 126, baseDefense: 155, baseStamina: 153, types: ["Water"], dexNum: 8 },
    "Blastoise": { baseAttack: 171, baseDefense: 207, baseStamina: 188, types: ["Water"], dexNum: 9 },
    "Pikachu": { baseAttack: 112, baseDefense: 96, baseStamina: 111, types: ["Electric"], dexNum: 25 },
    "Raichu": { baseAttack: 193, baseDefense: 151, baseStamina: 155, types: ["Electric"], dexNum: 26 },
    "Nidoqueen": { baseAttack: 180, baseDefense: 173, baseStamina: 207, types: ["Poison", "Ground"], dexNum: 31 },
    "Nidoking": { baseAttack: 204, baseDefense: 156, baseStamina: 191, types: ["Poison", "Ground"], dexNum: 34 },
    "Clefable": { baseAttack: 178, baseDefense: 162, baseStamina: 216, types: ["Fairy"], dexNum: 36 },
    "Ninetales": { baseAttack: 169, baseDefense: 190, baseStamina: 177, types: ["Fire"], dexNum: 38 },
    "Wigglytuff": { baseAttack: 156, baseDefense: 90, baseStamina: 295, types: ["Normal", "Fairy"], dexNum: 40 },
    "Vileplume": { baseAttack: 202, baseDefense: 167, baseStamina: 181, types: ["Grass", "Poison"], dexNum: 45 },
    "Parasect": { baseAttack: 165, baseDefense: 146, baseStamina: 155, types: ["Bug", "Grass"], dexNum: 47 },
    "Venomoth": { baseAttack: 179, baseDefense: 143, baseStamina: 172, types: ["Bug", "Poison"], dexNum: 49 },
    "Dugtrio": { baseAttack: 167, baseDefense: 134, baseStamina: 111, types: ["Ground"], dexNum: 51 },
    "Primeape": { baseAttack: 207, baseDefense: 138, baseStamina: 163, types: ["Fighting"], dexNum: 57 },
    "Arcanine": { baseAttack: 227, baseDefense: 166, baseStamina: 207, types: ["Fire"], dexNum: 59 },
    "Poliwrath": { baseAttack: 182, baseDefense: 184, baseStamina: 207, types: ["Water", "Fighting"], dexNum: 62 },
    "Alakazam": { baseAttack: 271, baseDefense: 167, baseStamina: 146, types: ["Psychic"], dexNum: 65 },
    "Machamp": { baseAttack: 234, baseDefense: 159, baseStamina: 207, types: ["Fighting"], dexNum: 68 },
    "Victreebel": { baseAttack: 207, baseDefense: 135, baseStamina: 190, types: ["Grass", "Poison"], dexNum: 71 },
    "Golem": { baseAttack: 211, baseDefense: 198, baseStamina: 190, types: ["Rock", "Ground"], dexNum: 76 },
    "Slowbro": { baseAttack: 177, baseDefense: 180, baseStamina: 216, types: ["Water", "Psychic"], dexNum: 80 },
    "Gengar": { baseAttack: 261, baseDefense: 149, baseStamina: 155, types: ["Ghost", "Poison"], dexNum: 94 },
    "Hypno": { baseAttack: 144, baseDefense: 193, baseStamina: 198, types: ["Psychic"], dexNum: 97 },
    "Electrode": { baseAttack: 173, baseDefense: 173, baseStamina: 155, types: ["Electric"], dexNum: 101 },
    "Exeggutor": { baseAttack: 233, baseDefense: 149, baseStamina: 216, types: ["Grass", "Psychic"], dexNum: 103 },
    "Marowak": { baseAttack: 144, baseDefense: 186, baseStamina: 155, types: ["Ground"], dexNum: 105 },
    "Chansey": { baseAttack: 60, baseDefense: 128, baseStamina: 487, types: ["Normal"], dexNum: 113 },
    "Kangaskhan": { baseAttack: 181, baseDefense: 165, baseStamina: 233, types: ["Normal"], dexNum: 115 },
    "Starmie": { baseAttack: 210, baseDefense: 184, baseStamina: 155, types: ["Water", "Psychic"], dexNum: 121 },
    "Mr. Mime": { baseAttack: 192, baseDefense: 205, baseStamina: 120, types: ["Psychic", "Fairy"], dexNum: 122 },
    "Scyther": { baseAttack: 218, baseDefense: 170, baseStamina: 172, types: ["Bug", "Flying"], dexNum: 123 },
    "Jynx": { baseAttack: 223, baseDefense: 151, baseStamina: 163, types: ["Ice", "Psychic"], dexNum: 124 },
    "Electabuzz": { baseAttack: 198, baseDefense: 158, baseStamina: 163, types: ["Electric"], dexNum: 125 },
    "Magmar": { baseAttack: 206, baseDefense: 154, baseStamina: 163, types: ["Fire"], dexNum: 126 },
    "Pinsir": { baseAttack: 238, baseDefense: 182, baseStamina: 163, types: ["Bug"], dexNum: 127 },
    "Tauros": { baseAttack: 198, baseDefense: 183, baseStamina: 181, types: ["Normal"], dexNum: 128 },
    "Gyarados": { baseAttack: 237, baseDefense: 186, baseStamina: 216, types: ["Water", "Flying"], dexNum: 130 },
    "Lapras": { baseAttack: 165, baseDefense: 174, baseStamina: 277, types: ["Water", "Ice"], dexNum: 131 },
    "Vaporeon": { baseAttack: 205, baseDefense: 161, baseStamina: 277, types: ["Water"], dexNum: 134 },
    "Jolteon": { baseAttack: 232, baseDefense: 182, baseStamina: 163, types: ["Electric"], dexNum: 135 },
    "Flareon": { baseAttack: 246, baseDefense: 179, baseStamina: 163, types: ["Fire"], dexNum: 136 },
    "Snorlax": { baseAttack: 190, baseDefense: 169, baseStamina: 330, types: ["Normal"], dexNum: 143 },
    "Dragonite": { baseAttack: 263, baseDefense: 198, baseStamina: 209, types: ["Dragon", "Flying"], dexNum: 149 },
    "Mewtwo": { baseAttack: 300, baseDefense: 182, baseStamina: 214, types: ["Psychic"], dexNum: 150 },
    "Mew": { baseAttack: 210, baseDefense: 210, baseStamina: 225, types: ["Psychic"], dexNum: 151 },

    // Gen 2
    "Typhlosion": { baseAttack: 223, baseDefense: 173, baseStamina: 186, types: ["Fire"], dexNum: 157 },
    "Feraligatr": { baseAttack: 205, baseDefense: 188, baseStamina: 198, types: ["Water"], dexNum: 160 },
    "Meganium": { baseAttack: 168, baseDefense: 202, baseStamina: 190, types: ["Grass"], dexNum: 154 },
    "Ampharos": { baseAttack: 211, baseDefense: 169, baseStamina: 207, types: ["Electric"], dexNum: 181 },
    "Azumarill": { baseAttack: 112, baseDefense: 152, baseStamina: 225, types: ["Water", "Fairy"], dexNum: 184 },
    "Politoed": { baseAttack: 174, baseDefense: 179, baseStamina: 207, types: ["Water"], dexNum: 186 },
    "Umbreon": { baseAttack: 126, baseDefense: 240, baseStamina: 216, types: ["Dark"], dexNum: 197 },
    "Espeon": { baseAttack: 261, baseDefense: 175, baseStamina: 163, types: ["Psychic"], dexNum: 196 },
    "Scizor": { baseAttack: 236, baseDefense: 181, baseStamina: 172, types: ["Bug", "Steel"], dexNum: 212 },
    "Heracross": { baseAttack: 234, baseDefense: 179, baseStamina: 190, types: ["Bug", "Fighting"], dexNum: 214 },
    "Skarmory": { baseAttack: 148, baseDefense: 226, baseStamina: 163, types: ["Steel", "Flying"], dexNum: 227 },
    "Houndoom": { baseAttack: 224, baseDefense: 144, baseStamina: 181, types: ["Dark", "Fire"], dexNum: 229 },
    "Kingdra": { baseAttack: 194, baseDefense: 194, baseStamina: 181, types: ["Water", "Dragon"], dexNum: 230 },
    "Tyranitar": { baseAttack: 251, baseDefense: 207, baseStamina: 225, types: ["Rock", "Dark"], dexNum: 248 },
    "Lugia": { baseAttack: 193, baseDefense: 310, baseStamina: 235, types: ["Psychic", "Flying"], dexNum: 249 },
    "Ho-Oh": { baseAttack: 239, baseDefense: 244, baseStamina: 214, types: ["Fire", "Flying"], dexNum: 250 },
    "Celebi": { baseAttack: 210, baseDefense: 210, baseStamina: 225, types: ["Psychic", "Grass"], dexNum: 251 },
    "Blissey": { baseAttack: 129, baseDefense: 169, baseStamina: 496, types: ["Normal"], dexNum: 242 },
    "Steelix": { baseAttack: 148, baseDefense: 272, baseStamina: 181, types: ["Steel", "Ground"], dexNum: 208 },
    "Crobat": { baseAttack: 194, baseDefense: 178, baseStamina: 198, types: ["Poison", "Flying"], dexNum: 169 },
    "Togetic": { baseAttack: 139, baseDefense: 181, baseStamina: 146, types: ["Fairy", "Flying"], dexNum: 176 },

    // Gen 3
    "Blaziken": { baseAttack: 240, baseDefense: 141, baseStamina: 190, types: ["Fire", "Fighting"], dexNum: 257 },
    "Swampert": { baseAttack: 208, baseDefense: 175, baseStamina: 225, types: ["Water", "Ground"], dexNum: 260 },
    "Sceptile": { baseAttack: 223, baseDefense: 169, baseStamina: 172, types: ["Grass"], dexNum: 254 },
    "Gardevoir": { baseAttack: 237, baseDefense: 195, baseStamina: 169, types: ["Psychic", "Fairy"], dexNum: 282 },
    "Breloom": { baseAttack: 241, baseDefense: 144, baseStamina: 155, types: ["Grass", "Fighting"], dexNum: 286 },
    "Slaking": { baseAttack: 290, baseDefense: 166, baseStamina: 284, types: ["Normal"], dexNum: 289 },
    "Hariyama": { baseAttack: 209, baseDefense: 114, baseStamina: 302, types: ["Fighting"], dexNum: 297 },
    "Aggron": { baseAttack: 198, baseDefense: 257, baseStamina: 172, types: ["Steel", "Rock"], dexNum: 306 },
    "Medicham": { baseAttack: 121, baseDefense: 152, baseStamina: 155, types: ["Fighting", "Psychic"], dexNum: 308 },
    "Manectric": { baseAttack: 215, baseDefense: 127, baseStamina: 172, types: ["Electric"], dexNum: 310 },
    "Altaria": { baseAttack: 141, baseDefense: 201, baseStamina: 181, types: ["Dragon", "Flying"], dexNum: 334 },
    "Whiscash": { baseAttack: 151, baseDefense: 141, baseStamina: 242, types: ["Water", "Ground"], dexNum: 340 },
    "Crawdaunt": { baseAttack: 224, baseDefense: 142, baseStamina: 160, types: ["Water", "Dark"], dexNum: 342 },
    "Claydol": { baseAttack: 140, baseDefense: 229, baseStamina: 155, types: ["Ground", "Psychic"], dexNum: 344 },
    "Milotic": { baseAttack: 192, baseDefense: 219, baseStamina: 216, types: ["Water"], dexNum: 350 },
    "Absol": { baseAttack: 246, baseDefense: 120, baseStamina: 163, types: ["Dark"], dexNum: 359 },
    "Walrein": { baseAttack: 182, baseDefense: 176, baseStamina: 242, types: ["Ice", "Water"], dexNum: 365 },
    "Salamence": { baseAttack: 277, baseDefense: 168, baseStamina: 216, types: ["Dragon", "Flying"], dexNum: 373 },
    "Metagross": { baseAttack: 257, baseDefense: 228, baseStamina: 190, types: ["Steel", "Psychic"], dexNum: 376 },
    "Latias": { baseAttack: 228, baseDefense: 246, baseStamina: 190, types: ["Dragon", "Psychic"], dexNum: 380 },
    "Latios": { baseAttack: 268, baseDefense: 212, baseStamina: 190, types: ["Dragon", "Psychic"], dexNum: 381 },
    "Kyogre": { baseAttack: 270, baseDefense: 228, baseStamina: 205, types: ["Water"], dexNum: 382 },
    "Groudon": { baseAttack: 270, baseDefense: 228, baseStamina: 205, types: ["Ground"], dexNum: 383 },
    "Rayquaza": { baseAttack: 284, baseDefense: 170, baseStamina: 213, types: ["Dragon", "Flying"], dexNum: 384 },
    "Deoxys": { baseAttack: 345, baseDefense: 115, baseStamina: 137, types: ["Psychic"], dexNum: 386 },
    "Registeel": { baseAttack: 143, baseDefense: 285, baseStamina: 190, types: ["Steel"], dexNum: 379 },

    // Gen 4
    "Torterra": { baseAttack: 202, baseDefense: 188, baseStamina: 216, types: ["Grass", "Ground"], dexNum: 389 },
    "Infernape": { baseAttack: 222, baseDefense: 151, baseStamina: 186, types: ["Fire", "Fighting"], dexNum: 392 },
    "Empoleon": { baseAttack: 210, baseDefense: 186, baseStamina: 197, types: ["Water", "Steel"], dexNum: 395 },
    "Staraptor": { baseAttack: 234, baseDefense: 140, baseStamina: 198, types: ["Normal", "Flying"], dexNum: 398 },
    "Luxray": { baseAttack: 232, baseDefense: 156, baseStamina: 190, types: ["Electric"], dexNum: 405 },
    "Roserade": { baseAttack: 243, baseDefense: 185, baseStamina: 155, types: ["Grass", "Poison"], dexNum: 407 },
    "Rampardos": { baseAttack: 295, baseDefense: 109, baseStamina: 219, types: ["Rock"], dexNum: 409 },
    "Bastiodon": { baseAttack: 94, baseDefense: 286, baseStamina: 155, types: ["Rock", "Steel"], dexNum: 411 },
    "Garchomp": { baseAttack: 261, baseDefense: 193, baseStamina: 239, types: ["Dragon", "Ground"], dexNum: 445 },
    "Lucario": { baseAttack: 236, baseDefense: 144, baseStamina: 172, types: ["Fighting", "Steel"], dexNum: 448 },
    "Hippowdon": { baseAttack: 201, baseDefense: 191, baseStamina: 239, types: ["Ground"], dexNum: 450 },
    "Togekiss": { baseAttack: 225, baseDefense: 217, baseStamina: 198, types: ["Fairy", "Flying"], dexNum: 468 },
    "Glaceon": { baseAttack: 238, baseDefense: 205, baseStamina: 163, types: ["Ice"], dexNum: 471 },
    "Mamoswine": { baseAttack: 247, baseDefense: 146, baseStamina: 242, types: ["Ice", "Ground"], dexNum: 473 },
    "Gallade": { baseAttack: 237, baseDefense: 195, baseStamina: 169, types: ["Psychic", "Fighting"], dexNum: 475 },
    "Rhyperior": { baseAttack: 241, baseDefense: 190, baseStamina: 251, types: ["Ground", "Rock"], dexNum: 464 },
    "Electivire": { baseAttack: 249, baseDefense: 163, baseStamina: 181, types: ["Electric"], dexNum: 466 },
    "Magmortar": { baseAttack: 247, baseDefense: 172, baseStamina: 181, types: ["Fire"], dexNum: 467 },
    "Leafeon": { baseAttack: 216, baseDefense: 219, baseStamina: 163, types: ["Grass"], dexNum: 470 },
    "Weavile": { baseAttack: 243, baseDefense: 171, baseStamina: 172, types: ["Dark", "Ice"], dexNum: 461 },
    "Magnezone": { baseAttack: 238, baseDefense: 205, baseStamina: 172, types: ["Electric", "Steel"], dexNum: 462 },
    "Tangrowth": { baseAttack: 207, baseDefense: 184, baseStamina: 225, types: ["Grass"], dexNum: 465 },
    "Yanmega": { baseAttack: 231, baseDefense: 156, baseStamina: 200, types: ["Bug", "Flying"], dexNum: 469 },
    "Porygon-Z": { baseAttack: 264, baseDefense: 150, baseStamina: 198, types: ["Normal"], dexNum: 474 },
    "Dusknoir": { baseAttack: 180, baseDefense: 254, baseStamina: 128, types: ["Ghost"], dexNum: 477 },
    "Dialga": { baseAttack: 275, baseDefense: 211, baseStamina: 205, types: ["Steel", "Dragon"], dexNum: 483 },
    "Palkia": { baseAttack: 280, baseDefense: 215, baseStamina: 189, types: ["Water", "Dragon"], dexNum: 484 },
    "Heatran": { baseAttack: 251, baseDefense: 213, baseStamina: 209, types: ["Fire", "Steel"], dexNum: 485 },
    "Giratina": { baseAttack: 187, baseDefense: 225, baseStamina: 284, types: ["Ghost", "Dragon"], dexNum: 487 },
    "Cresselia": { baseAttack: 152, baseDefense: 258, baseStamina: 260, types: ["Psychic"], dexNum: 488 },
    "Darkrai": { baseAttack: 285, baseDefense: 198, baseStamina: 172, types: ["Dark"], dexNum: 491 },
    "Arceus": { baseAttack: 238, baseDefense: 238, baseStamina: 237, types: ["Normal"], dexNum: 493 },

    // Gen 5
    "Serperior": { baseAttack: 161, baseDefense: 204, baseStamina: 181, types: ["Grass"], dexNum: 497 },
    "Emboar": { baseAttack: 235, baseDefense: 127, baseStamina: 242, types: ["Fire", "Fighting"], dexNum: 500 },
    "Samurott": { baseAttack: 212, baseDefense: 157, baseStamina: 216, types: ["Water"], dexNum: 503 },
    "Excadrill": { baseAttack: 255, baseDefense: 129, baseStamina: 242, types: ["Ground", "Steel"], dexNum: 530 },
    "Conkeldurr": { baseAttack: 243, baseDefense: 158, baseStamina: 233, types: ["Fighting"], dexNum: 534 },
    "Seismitoad": { baseAttack: 188, baseDefense: 150, baseStamina: 233, types: ["Water", "Ground"], dexNum: 537 },
    "Scolipede": { baseAttack: 203, baseDefense: 175, baseStamina: 155, types: ["Bug", "Poison"], dexNum: 545 },
    "Krookodile": { baseAttack: 229, baseDefense: 158, baseStamina: 216, types: ["Ground", "Dark"], dexNum: 553 },
    "Darmanitan": { baseAttack: 263, baseDefense: 114, baseStamina: 233, types: ["Fire"], dexNum: 555 },
    "Cofagrigus": { baseAttack: 163, baseDefense: 237, baseStamina: 151, types: ["Ghost"], dexNum: 563 },
    "Archeops": { baseAttack: 292, baseDefense: 139, baseStamina: 181, types: ["Rock", "Flying"], dexNum: 567 },
    "Zoroark": { baseAttack: 250, baseDefense: 127, baseStamina: 155, types: ["Dark"], dexNum: 571 },
    "Reuniclus": { baseAttack: 214, baseDefense: 148, baseStamina: 242, types: ["Psychic"], dexNum: 579 },
    "Escavalier": { baseAttack: 223, baseDefense: 187, baseStamina: 172, types: ["Bug", "Steel"], dexNum: 589 },
    "Jellicent": { baseAttack: 159, baseDefense: 178, baseStamina: 225, types: ["Water", "Ghost"], dexNum: 593 },
    "Chandelure": { baseAttack: 271, baseDefense: 182, baseStamina: 155, types: ["Ghost", "Fire"], dexNum: 609 },
    "Haxorus": { baseAttack: 284, baseDefense: 172, baseStamina: 186, types: ["Dragon"], dexNum: 612 },
    "Hydreigon": { baseAttack: 256, baseDefense: 188, baseStamina: 211, types: ["Dark", "Dragon"], dexNum: 635 },
    "Volcarona": { baseAttack: 264, baseDefense: 189, baseStamina: 198, types: ["Bug", "Fire"], dexNum: 637 },
    "Cobalion": { baseAttack: 192, baseDefense: 229, baseStamina: 209, types: ["Steel", "Fighting"], dexNum: 638 },
    "Terrakion": { baseAttack: 260, baseDefense: 192, baseStamina: 209, types: ["Rock", "Fighting"], dexNum: 639 },
    "Virizion": { baseAttack: 192, baseDefense: 229, baseStamina: 209, types: ["Grass", "Fighting"], dexNum: 640 },
    "Reshiram": { baseAttack: 275, baseDefense: 211, baseStamina: 205, types: ["Dragon", "Fire"], dexNum: 643 },
    "Zekrom": { baseAttack: 275, baseDefense: 211, baseStamina: 205, types: ["Dragon", "Electric"], dexNum: 644 },
    "Landorus": { baseAttack: 261, baseDefense: 182, baseStamina: 205, types: ["Ground", "Flying"], dexNum: 645 },
    "Kyurem": { baseAttack: 246, baseDefense: 170, baseStamina: 245, types: ["Dragon", "Ice"], dexNum: 646 },
    "Genesect": { baseAttack: 252, baseDefense: 199, baseStamina: 174, types: ["Bug", "Steel"], dexNum: 649 },

    // Gen 6
    "Chesnaught": { baseAttack: 201, baseDefense: 204, baseStamina: 204, types: ["Grass", "Fighting"], dexNum: 652 },
    "Delphox": { baseAttack: 230, baseDefense: 189, baseStamina: 181, types: ["Fire", "Psychic"], dexNum: 655 },
    "Greninja": { baseAttack: 223, baseDefense: 152, baseStamina: 176, types: ["Water", "Dark"], dexNum: 658 },
    "Talonflame": { baseAttack: 176, baseDefense: 155, baseStamina: 186, types: ["Fire", "Flying"], dexNum: 663 },
    "Aegislash": { baseAttack: 97, baseDefense: 291, baseStamina: 155, types: ["Steel", "Ghost"], dexNum: 681 },
    "Sylveon": { baseAttack: 203, baseDefense: 205, baseStamina: 216, types: ["Fairy"], dexNum: 700 },
    "Goodra": { baseAttack: 220, baseDefense: 242, baseStamina: 207, types: ["Dragon"], dexNum: 706 },
    "Trevenant": { baseAttack: 201, baseDefense: 154, baseStamina: 198, types: ["Ghost", "Grass"], dexNum: 709 },
    "Noivern": { baseAttack: 205, baseDefense: 175, baseStamina: 198, types: ["Flying", "Dragon"], dexNum: 715 },
    "Xerneas": { baseAttack: 250, baseDefense: 185, baseStamina: 246, types: ["Fairy"], dexNum: 716 },
    "Yveltal": { baseAttack: 275, baseDefense: 176, baseStamina: 246, types: ["Dark", "Flying"], dexNum: 717 },
    "Zygarde": { baseAttack: 203, baseDefense: 232, baseStamina: 239, types: ["Dragon", "Ground"], dexNum: 718 },

    // Additional Meta-Relevant
    "Annihilape": { baseAttack: 220, baseDefense: 178, baseStamina: 242, types: ["Fighting", "Ghost"], dexNum: 979 },
    "Gholdengo": { baseAttack: 249, baseDefense: 210, baseStamina: 193, types: ["Steel", "Ghost"], dexNum: 1000 },
    "Skeledirge": { baseAttack: 217, baseDefense: 199, baseStamina: 232, types: ["Fire", "Ghost"], dexNum: 911 },
    "Quaquaval": { baseAttack: 238, baseDefense: 156, baseStamina: 198, types: ["Water", "Fighting"], dexNum: 914 },
    "Ceruledge": { baseAttack: 249, baseDefense: 182, baseStamina: 181, types: ["Fire", "Ghost"], dexNum: 937 },
    "Armarouge": { baseAttack: 229, baseDefense: 207, baseStamina: 198, types: ["Fire", "Psychic"], dexNum: 936 },
    "Kingambit": { baseAttack: 234, baseDefense: 200, baseStamina: 225, types: ["Dark", "Steel"], dexNum: 983 },
    "Corviknight": { baseAttack: 163, baseDefense: 229, baseStamina: 219, types: ["Flying", "Steel"], dexNum: 823 },
    "Dragapult": { baseAttack: 266, baseDefense: 170, baseStamina: 204, types: ["Dragon", "Ghost"], dexNum: 887 },

    // Alolan / Galarian Forms
    "Ninetales (Alola)": { baseAttack: 170, baseDefense: 193, baseStamina: 177, types: ["Ice", "Fairy"], dexNum: 38 },
    "Marowak (Alola)": { baseAttack: 144, baseDefense: 186, baseStamina: 155, types: ["Fire", "Ghost"], dexNum: 105 },
    "Muk (Alola)": { baseAttack: 190, baseDefense: 172, baseStamina: 233, types: ["Poison", "Dark"], dexNum: 89 },
    "Exeggutor (Alola)": { baseAttack: 230, baseDefense: 153, baseStamina: 216, types: ["Grass", "Dragon"], dexNum: 103 },
    "Sandslash (Alola)": { baseAttack: 177, baseDefense: 195, baseStamina: 181, types: ["Ice", "Steel"], dexNum: 28 },
    "Stunfisk (Galarian)": { baseAttack: 144, baseDefense: 171, baseStamina: 240, types: ["Ground", "Steel"], dexNum: 618 },
    "Rapidash (Galarian)": { baseAttack: 207, baseDefense: 162, baseStamina: 163, types: ["Psychic", "Fairy"], dexNum: 78 },

    // More PvP relevant mons
    "Lanturn": { baseAttack: 146, baseDefense: 137, baseStamina: 268, types: ["Water", "Electric"], dexNum: 171 },
    "Toxicroak": { baseAttack: 211, baseDefense: 133, baseStamina: 195, types: ["Poison", "Fighting"], dexNum: 454 },
    "Drapion": { baseAttack: 180, baseDefense: 202, baseStamina: 172, types: ["Poison", "Dark"], dexNum: 452 },
    "Froslass": { baseAttack: 171, baseDefense: 150, baseStamina: 172, types: ["Ice", "Ghost"], dexNum: 478 },
    "Abomasnow": { baseAttack: 178, baseDefense: 158, baseStamina: 207, types: ["Grass", "Ice"], dexNum: 460 },
    "Tropius": { baseAttack: 136, baseDefense: 163, baseStamina: 223, types: ["Grass", "Flying"], dexNum: 357 },
    "Pidgeot": { baseAttack: 166, baseDefense: 154, baseStamina: 195, types: ["Normal", "Flying"], dexNum: 18 },
    "Dewgong": { baseAttack: 139, baseDefense: 177, baseStamina: 207, types: ["Water", "Ice"], dexNum: 87 },
    "Mantine": { baseAttack: 148, baseDefense: 226, baseStamina: 163, types: ["Water", "Flying"], dexNum: 226 },
    "Pelipper": { baseAttack: 175, baseDefense: 174, baseStamina: 155, types: ["Water", "Flying"], dexNum: 279 },
    "Drifblim": { baseAttack: 180, baseDefense: 102, baseStamina: 312, types: ["Ghost", "Flying"], dexNum: 426 },
    "Sableye": { baseAttack: 141, baseDefense: 136, baseStamina: 137, types: ["Dark", "Ghost"], dexNum: 302 },
    "Lickitung": { baseAttack: 108, baseDefense: 137, baseStamina: 207, types: ["Normal"], dexNum: 108 },
    "Lickilicky": { baseAttack: 161, baseDefense: 181, baseStamina: 242, types: ["Normal"], dexNum: 463 },
    "Diggersby": { baseAttack: 112, baseDefense: 155, baseStamina: 198, types: ["Normal", "Ground"], dexNum: 660 },
    "Charjabug": { baseAttack: 145, baseDefense: 161, baseStamina: 149, types: ["Bug", "Electric"], dexNum: 737 },
    "Vikavolt": { baseAttack: 254, baseDefense: 158, baseStamina: 184, types: ["Bug", "Electric"], dexNum: 738 },
    "Obstagoon": { baseAttack: 180, baseDefense: 194, baseStamina: 212, types: ["Dark", "Normal"], dexNum: 862 },
    "Runerigus": { baseAttack: 163, baseDefense: 237, baseStamina: 151, types: ["Ground", "Ghost"], dexNum: 867 },
    "Dubwool": { baseAttack: 137, baseDefense: 189, baseStamina: 176, types: ["Normal"], dexNum: 832 },
    "Mandibuzz": { baseAttack: 129, baseDefense: 205, baseStamina: 242, types: ["Dark", "Flying"], dexNum: 630 },
    "Scrafty": { baseAttack: 163, baseDefense: 222, baseStamina: 163, types: ["Dark", "Fighting"], dexNum: 560 },
    "Pangoro": { baseAttack: 226, baseDefense: 133, baseStamina: 216, types: ["Fighting", "Dark"], dexNum: 675 },
    "Ferrothorn": { baseAttack: 158, baseDefense: 223, baseStamina: 179, types: ["Grass", "Steel"], dexNum: 598 },
    "Galvantula": { baseAttack: 201, baseDefense: 128, baseStamina: 172, types: ["Bug", "Electric"], dexNum: 596 },
    "Chandelure": { baseAttack: 271, baseDefense: 182, baseStamina: 155, types: ["Ghost", "Fire"], dexNum: 609 },
    "Golurk": { baseAttack: 222, baseDefense: 154, baseStamina: 205, types: ["Ground", "Ghost"], dexNum: 623 },
    "Bisharp": { baseAttack: 232, baseDefense: 170, baseStamina: 163, types: ["Dark", "Steel"], dexNum: 625 },
    "Volcarona": { baseAttack: 264, baseDefense: 189, baseStamina: 198, types: ["Bug", "Fire"], dexNum: 637 },
    "Tentacruel": { baseAttack: 166, baseDefense: 209, baseStamina: 190, types: ["Water", "Poison"], dexNum: 73 },
    "Quagsire": { baseAttack: 152, baseDefense: 143, baseStamina: 216, types: ["Water", "Ground"], dexNum: 195 },
    "Forretress": { baseAttack: 161, baseDefense: 205, baseStamina: 181, types: ["Bug", "Steel"], dexNum: 205 },
    "Gliscor": { baseAttack: 185, baseDefense: 222, baseStamina: 181, types: ["Ground", "Flying"], dexNum: 472 },
    "Probopass": { baseAttack: 135, baseDefense: 275, baseStamina: 155, types: ["Rock", "Steel"], dexNum: 476 },
};

/**
 * Calculate CP given base stats, IVs, and level
 */
function calculateCP(baseAttack, baseDefense, baseStamina, ivAttack, ivDefense, ivStamina, level) {
    const cpm = CPM[level];
    if (!cpm) return 0;
    const attack = (baseAttack + ivAttack) * cpm;
    const defense = (baseDefense + ivDefense) * cpm;
    const stamina = (baseStamina + ivStamina) * cpm;
    const cp = Math.floor(attack * Math.sqrt(defense) * Math.sqrt(stamina) * 0.1);
    return Math.max(cp, 10);
}

/**
 * Find level from CP and IVs
 */
function findLevel(pokemonName, cp, ivAttack, ivDefense, ivStamina) {
    const pokemon = POKEMON_DATA[pokemonName];
    if (!pokemon) return null;

    let bestLevel = null;
    let bestDiff = Infinity;

    const levels = Object.keys(CPM).map(Number).filter(level => level <= 50).sort((a, b) => a - b);
    for (const level of levels) {
        const calcCP = calculateCP(
            pokemon.baseAttack, pokemon.baseDefense, pokemon.baseStamina,
            ivAttack, ivDefense, ivStamina, level
        );
        const diff = Math.abs(calcCP - cp);
        if (diff < bestDiff) {
            bestDiff = diff;
            bestLevel = level;
        }
    }
    return bestLevel;
}

/**
 * Identify Pokémon by CP and approximate IVs
 */
function identifyPokemonByCP(cp) {
    // Best-effort identification for approximate CP values (OCR can be off by a bit).
    // Returns Pokémon candidates sorted by smallest CP difference.
    const results = [];
    const levels = Object.keys(CPM).map(Number).filter(level => level <= 50).sort((a, b) => a - b);

    // Coarse IV spreads for speed; final IVs/level are refined elsewhere.
    const ivSteps = [0, 5, 10, 15];

    for (const [name, data] of Object.entries(POKEMON_DATA)) {
        let best = null;
        let bestDiff = Infinity;

        for (const level of levels) {
            for (let atk of ivSteps) {
                for (let def of ivSteps) {
                    for (let hp of ivSteps) {
                        const calcCP = calculateCP(
                            data.baseAttack, data.baseDefense, data.baseStamina,
                            atk, def, hp, level
                        );
                        const diff = Math.abs(calcCP - cp);

                        if (diff < bestDiff) {
                            bestDiff = diff;
                            best = { name, level, ivAttack: atk, ivDefense: def, ivStamina: hp, diff };
                        }
                    }
                }
            }

            // Perfect match - can't do better than 0.
            if (bestDiff === 0) break;
        }

        if (best) results.push(best);
    }

    results.sort((a, b) => a.diff - b.diff);
    return results;
}

// Export for use
window.POKEMON_DATA = POKEMON_DATA;
window.CPM = CPM;
window.calculateCP = calculateCP;
window.findLevel = findLevel;
window.identifyPokemonByCP = identifyPokemonByCP;
