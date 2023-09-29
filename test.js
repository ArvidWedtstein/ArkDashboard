console.time("normal");
const Valg = require("./web/public/species.json");

var partition = function (arr, length) {
  var result = [];
  for (var i = 0; i < arr.length; i++) {
    if (i % length === 0) result.push([]);
    result[result.length - 1].push(arr[i]);
  }
  return result;
};

/**
 * For extracting biomes to MapRegions table
 */

let biomes = [
  `INSERT INTO public."MapRegion" ("map_id", "name", "wind", "temperature", "priority", "outside", "start_x", "start_y", "start_z", "end_x", "end_y", "end_z", "radiation") VALUES`,
];

// Valg.biomes.forEach((x) => {
//   x.boxes.forEach((y) => {
//     biomes.push(
//       `(2, '${x.name.replaceAll("'", "''")}', ${
//         x?.wind
//           ? x.wind?.override
//             ? x.wind.override
//             : x.wind?.final
//             ? x.wind?.final[0]
//             : null
//           : null
//       }, ${
//         x?.temperature
//           ? x.temperature?.override ??
//             (x.temperature?.initial
//               ? x.temperature?.initial[2]
//               : x.temperature?.final
//               ? x.temperature.final[0]
//               : x.temperature?.override ?? null)
//           : null
//       }, ${x.priority}, ${x.isOutside}, ${y.start.x}, ${y.start.y}, ${
//         y.start.z
//       }, ${y.end.x}, ${y.end.y}, ${y.end.z})`
//     );
//   });
// });
// Valg.radiationVolumes.forEach((x) => {
//   biomes.push(
//     `(1, null, null, null, 2, false, ${x.start.x}, ${x.start.y}, ${x.start.z}, ${x.end.x}, ${x.end.y}, ${x.end.z}, true)`
//   );
// });

require("fs").writeFile(`insert.txt`, speciesAttacks.join("\n"), (error) => {
  if (error) {
    throw error;
  }
});

[
  "isBigDino",
  "isBossDino",
  "isCarnivore",
  "canBeTorpid",
  "allowRiding",
  "canBeDragged",
  "canDrag",
  "doStepDamage",
  "isTameable",
  "allowMountedWeaponry",
  "isAmphibious",
  "isWaterDino",
  "canBeWildTrappedWithFishBasket",
  "canBeTamedWithFishBasket",
  "allowFlyerLandedRider",
  "canMountOnHumans",
  "isFlyerDino",
  "preventNeuter",
  "isCorrupted",
  "isRaidDino",
  "isRobot",
  "preventCharacterBasing",
  "flyerAllowRidingInCaves",
  "dieIfLeftWater",
  "allowCarryFlyerDinos",
];
return;
// let countCrates = 0;
// let countnonCrates = [];
// let data = {};
// let output = Object.entries(ids).map(([map, crates]) => {
//   Object.assign(data, {
//     [map]: crates.map((crate) => {
//       const item = lootcrateitems.find((lootcrate) =>
//         lootcrate.blueprint.includes(crate.id)
//       );
//       if (item) {
//         countCrates++;
//         return {
//           id: crate.id,
//           name: crate.name || item.name,
//           items: item.items,
//         };
//       } else {
//         countnonCrates.push(crate.id);
//       }
//     }),
//   });
//   return;
// });

// console.log(countCrates);
// console.log(countnonCrates);

// require("fs").writeFile(
//   `insert.txt`,
//   [JSON.stringify(data, null, 4)].join("\n"),
//   (error) => {
//     if (error) {
//       throw error;
//     }
//   }
// );
// return;

function findCommonItemSetsWithThresholdAndLootcrates(lootcrates, threshold) {
  if (lootcrates.length === 0) {
    return [];
  }

  // Create a map to store itemIds as keys and their occurrences as values
  const itemIdOccurrences = new Map();

  // Count the occurrences of each itemId across all lootcrates
  for (let i = 0; i < lootcrates.length; i++) {
    const lootcrate = lootcrates[i];
    for (const item of lootcrate.items) {
      if (itemIdOccurrences.has(item.itemId)) {
        itemIdOccurrences.set(
          item.itemId,
          itemIdOccurrences.get(item.itemId) + 1
        );
      } else {
        itemIdOccurrences.set(item.itemId, 1);
      }
    }
  }

  // Get the itemIds that occurred in more than the specified threshold of lootcrates
  const commonItemIds = [...itemIdOccurrences.entries()]
    .filter(([itemId, occurrences]) => occurrences >= threshold)
    .map(([itemId]) => itemId);

  // Create sets of items using the common itemIds and store lootcrate information
  const commonItemSets = [];
  for (let i = 0; i < lootcrates.length; i++) {
    const lootcrate = lootcrates[i];
    const commonItems = lootcrate.items.filter((item) =>
      commonItemIds.includes(item.itemId)
    );
    if (commonItems.length > 0) {
      commonItemSets.push({
        lootcrateIndex: i,
        items: commonItems,
      });
    }
  }

  // Create a map to store which lootcrates use each common item set
  const lootcratesUsingSet = new Map();
  for (const commonItemSet of commonItemSets) {
    for (const item of commonItemSet.items) {
      if (lootcratesUsingSet.has(item.itemId)) {
        lootcratesUsingSet.get(item.itemId).push(commonItemSet.lootcrateIndex);
      } else {
        lootcratesUsingSet.set(item.itemId, [commonItemSet.lootcrateIndex]);
      }
    }
  }

  return {
    commonItemSets: commonItemSets,
    lootcratesUsingSet: lootcratesUsingSet,
  };
}

const commonItemSets = findCommonItemSetsWithThresholdAndLootcrates(
  lootcrateitems,
  2
);

// TODO: check for map lootcrates in map specific json files from arkwiki
console.log("Grouped Common ItemIds:", commonItemSets.commonItemSets);
require("fs").writeFile(
  `insert.txt`,
  [
    // `INSERT INTO public."Item" ("crafted_item_id", "item_id", "amount") VALUES`,
    JSON.stringify(commonItemSets.commonItemSets, null, 4),
  ].join("\n"),
  (error) => {
    if (error) {
      throw error;
    }
  }
);
return;

// USED FOR GETTING ITEMS IN LOOTCRATES.JSON
// const output = loot.lootCrates.map((lootcrate) => {
//   return {
//     blueprint: lootcrate.bp,
//     name: lootcrate.name || "",
//     items: lootcrate.sets.flatMap((set) => {
//       return set.entries.flatMap((entry) => {
//         return entry.items.flatMap((item) => {
//           return {
//             itemId: itemarray.find((i) => i.blueprint == item[1])?.id || null,
//             itemName:
//               itemarray.find((i) => i.blueprint == item[1])?.name || null,
//             itemBlueprint: item[1],
//             entryName: entry.name,
//             setName: set.name,
//             setCanRepeatItems: set.canRepeatItems,
//             setQtyMin: set.qtyScale.min,
//             setQtyMax: set.qtyScale.max,
//             setQtyPow: set.qtyScale.pow,
//             setWeight: set.weight,
//             entryWeight: entry.weight,
//             entryQtyMin: entry.qty.min,
//             entryQtyMax: entry.qty.max,
//             entryQtyPow: entry.qty.pow,
//             entryQualityMin: entry.quality.min,
//             entryQualityMax: entry.quality.max,
//             entryQualityPow: entry.quality.pow,
//             bpChance: entry.bpChance || 0,
//           };
//         });
//       });
//     }),
//   };
// });
//
// require("fs").writeFile(
//   `insert.txt`,
//   [JSON.stringify(output, null, 4)].join("\n"),
//   (error) => {
//     if (error) {
//       throw error;
//     }
//   }
// );

const dinos = dadinos.map((x) => {
  return `
  UPDATE public."Dino"
  SET bp = '${x.bp}'
  WHERE name LIKE '${x.name}';`;

  // return `
  // UPDATE public."Dino"
  // SET taming_ineffectiveness = ${x?.taming?.tamingIneffectiveness || 0},
  // baby_food_consumption_mult = ${x?.taming?.babyFoodConsumptionMult || 0},
  // gestation_time = ${x?.breeding?.gestationTime || 0},
  // maturation_time = ${x?.breeding?.maturationTime || "maturation_time"},
  // incubation_time = ${x?.breeding?.incubationTime || "incubation_time"},
  // mating_cooldown_min = ${x?.breeding?.matingCooldownMin || 0},
  // mating_cooldown_max = ${x?.breeding?.matingCooldownMax || 0},
  // egg_min = ${x?.breeding?.eggTempMin || "egg_min"},
  // egg_max = ${x?.breeding?.eggTempMax || "egg_max"}
  // WHERE name LIKE '${x.name}';`;

  return {
    name: x.name,
    taming_ineffectiveness: x?.taming?.tamingIneffectiveness || 0,
    baby_food_consumption_mult: x?.taming?.babyFoodConsumptionMult || 0,
    gestation_time: x?.breeding?.gestationTime || 0,
    maturation_time: x?.breeding?.maturationTime || 0,
    incubation_time: x?.breeding?.incubationTime || 0,
    mating_cooldown_min: x?.breeding?.matingCooldownMin || 0,
    mating_cooldown_max: x?.breeding?.matingCooldownMax || 0,
    egg_min: x?.breeding?.eggTempMin || 0,
    egg_max: x?.breeding?.eggTempMax || 0,
  };
});

// const crates = Object.entries(dino).map(([k, v]) => {
//   let d = v.mult
//     ? `UPDATE public."Dino" SET multipliers = '[${JSON.stringify(
//         v.mult || ""
//       )}]' WHERE name LIKE '${v.name}';`
//     : "";
//   return d;
// });

// For downloading images
// setInterval(function(){
// if(images.length > i){
//         srcList.push(images[i].src);
//         var link = document.createElement("a");
//         link.id=i;
//         link.download = images[i].src;
//         link.href = images[i].src;
//         link.click();
// 		link.remove();
//         i++;
//     }

// 		Array.from(document.querySelectorAll("img.download-me")).forEach((img) => {
//   var link = document.createElement('a');
// link.href = img.currentSrc;
// link.download = 'Download.jpg';
// document.body.appendChild(link);
// link.click();
// document.body.removeChild(link);
// });
// },500);

let color = {
  white: "#ffffff",
  green: "#1FD50E",
  blue: "#0A3BE5",
  purple: "#B60AE5",
  yellow: "#FFD600",
  red: "#EE0C0C",
  cyan: "#0CDBEE",
  orange: "#F58508",
};
let map = {
  "The Island": 2,
  "The Center": 3,
  "Scorched Earth": 7,
  Ragnarok: 4,
  Aberration: 5,
  Extinction: 6,
  Valguero: 1,
  Genesis: 8,
  "Genesis 2": 9,
  Fjordur: 11,
  "Crystal Isles": 10,
  "Lost Island": 12,
};

// const dd = d2.dinos.map((x) => {
//   if (x?.eats && x.eats !== null) {
//     return x.eats
//       .filter((d) => !isNaN(d))
//       .map((y) => {
//         return `('${x.id}', ${parseInt(y)}, 'food'),`;
//       })
//       .join("\n");
//   }
//   return "";
//   // return `INSERT INTO public."DinoEffWeight" ("dino_id", "item_id", "value", "is_gather_eff")`;
// });
// const dd = items
//   .filter((x) => x.name.includes("Saddle"))
//   .map((x) => {
//     return `
//   UPDATE public."Item"
//   SET type = '${x.type}'
//   WHERE id = ${x.id};`;
//   });
require("fs").writeFile(
  `insert.txt`,
  [
    // `INSERT INTO public."Item" ("crafted_item_id", "item_id", "amount") VALUES`,
    ...dinos,
  ].join("\n"),
  (error) => {
    if (error) {
      throw error;
    }
  }
);
return;
console.timeEnd("normal");
const g = {
  items: fff,
};

const chunkSize = 50;
for (let i = 0; i < fff.length; i += chunkSize) {
  const chunk = fff.slice(i, i + chunkSize);
  // do whatever
  require("fs").writeFile(`insert${i}.txt`, chunk.join("\n"), (error) => {
    if (error) {
      throw error;
    }
  });
}
console.time("optimized");

console.timeEnd("optimized");
return;

// Same data as MapLootcrates.json
let ids = {
  TheIsland: [
    {
      id: "SupplyCrate_Cave_QualityTier1_C",
      name: "Cave Beacon 1",
    },
    {
      id: "SupplyCrate_Cave_QualityTier2_C",
      name: "Cave Beacon 2",
    },
    {
      id: "SupplyCrate_Cave_QualityTier3_C",
      name: "Cave Beacon 3",
    },
    {
      id: "SupplyCrate_Cave_QualityTier4_C",
      name: "Cave Beacon 4",
    },
    {
      id: "SupplyCrate_SwampCaveTier1_C",
      name: "Swamp Cave Loot Crate blue",
    },
    {
      id: "SupplyCrate_SwampCaveTier2_C",
      name: "Swamp Cave Loot Crate yellow",
    },
    {
      id: "SupplyCrate_SwampCaveTier3_C",
      name: "Swamp Cave Loot Crate red",
    },
    {
      id: "SupplyCrate_IceCaveTier1_C",
      name: "Ice Cave Loot Crate blue",
    },
    {
      id: "SupplyCrate_IceCaveTier2_C",
      name: "Ice Cave Loot Crate yellow",
    },
    {
      id: "SupplyCrate_IceCaveTier3_C",
      name: "Ice Cave Loot Crate red",
    },
    {
      id: "SupplyCrate_UnderwaterCaveTier1_C",
      name: "Underwater Caves Loot Crate blue",
    },
    {
      id: "SupplyCrate_UnderwaterCaveTier2_C",
      name: "Underwater Caves Loot Crate yellow",
    },
    {
      id: "SupplyCrate_UnderwaterCaveTier3_C",
      name: "Underwater Caves Loot Crate red",
    },
    {
      id: "SupplyCrate_OceanInstant_C",
      name: "Deep Sea Loot Crate",
    },
    {
      id: "SupplyCrate_Level03_C",
      name: "White Beacon",
    },
    {
      id: "SupplyCrate_Level03_Double_C",
      name: "White Beacon (Double items)",
    },
    {
      id: "SupplyCrate_Level15_C",
      name: "Green Beacon",
    },
    {
      id: "SupplyCrate_Level15_Double_C",
      name: "Green Beacon (Double items)",
    },
    {
      id: "SupplyCrate_Level25_C",
      name: "Blue Beacon",
    },
    {
      id: "SupplyCrate_Level25_Double_C",
      name: "Blue Beacon (Double items)",
    },
    {
      id: "SupplyCrate_Level35_C",
      name: "Purple Beacon",
    },
    {
      id: "SupplyCrate_Level35_Double_C",
      name: "Purple Beacon (Double items)",
    },
    {
      id: "SupplyCrate_Level45_C",
      name: "Yellow Beacon",
    },
    {
      id: "SupplyCrate_Level45_Double_C",
      name: "Yellow Beacon (Double items)",
    },
    {
      id: "SupplyCrate_Level60_C",
      name: "Red Beacon",
    },
    {
      id: "SupplyCrate_Level60_Double_C",
      name: "Red Beacon (Double items)",
    },
    {
      id: "ArtifactCrate_1_C",
      name: "Artifact Container Hunter",
    },
    {
      id: "ArtifactCrate_2_C",
      name: "Artifact Container Pack",
    },
    {
      id: "ArtifactCrate_3_C",
      name: "Artifact Container Massive",
    },
    {
      id: "ArtifactCrate_4_C",
      name: "Artifact Container Devious",
    },
    {
      id: "ArtifactCrate_5_C",
      name: "Artifact Container Clever",
    },
    {
      id: "ArtifactCrate_6_C",
      name: "Artifact Container Skylord",
    },
    {
      id: "ArtifactCrate_7_C",
      name: "Artifact Container Devourer",
    },
    {
      id: "ArtifactCrate_8_C",
      name: "Artifact Container Immune",
    },
    {
      id: "ArtifactCrate_9_C",
      name: "Artifact Container Strong",
    },
    {
      id: "ArtifactCrate_10_C",
      name: "Artifact Container Cunning",
    },
    {
      id: "ArtifactCrate_11_C",
      name: "Artifact Container Brute",
    },
    {
      id: "BeaverDam_C",
      name: "Beaver Dam",
    },
    {
      id: "SupplyCrateBaseBP_Instantaneous_DamLogs_Child_C",
      name: "Giant Beaver Dam Logs",
    },
    {
      id: "SupplyCrateBaseBP_Instantaneous_DenLogs_Child2_C",
      name: "Giant Beaver Dam",
    },
  ],
  Event: [
    {
      id: "SupplyCrate_Gift_C",
      name: "Raptor Claus Present",
    },
  ],
  ScorchedEarth: [
    {
      id: "SupplyCrate_Cave_QualityTier1_ScorchedEarth_C",
      name: "Cave Beacon 1",
    },
    {
      id: "SupplyCrate_Cave_QualityTier2_ScorchedEarth_C",
      name: "Cave Beacon 2",
    },
    {
      id: "SupplyCrate_Cave_QualityTier3_ScorchedEarth_C",
      name: "Cave Beacon 3",
    },
    {
      id: "SupplyCrate_Level03_ScorchedEarth_C",
      name: "White Beacon",
    },
    {
      id: "SupplyCrate_Level03_Double_ScorchedEarth_C",
      name: "White Beacon (Double items)",
    },
    {
      id: "SupplyCrate_Level15_ScorchedEarth_C",
      name: "Green Beacon",
    },
    {
      id: "SupplyCrate_Level15_Double_ScorchedEarth_C",
      name: "Green Beacon (Double items)",
    },
    {
      id: "SupplyCrate_Level30_ScorchedEarth_C",
      name: "Blue Beacon",
    },
    {
      id: "SupplyCrate_Level30_Double_ScorchedEarth_C",
      name: "Blue Beacon (Double items)",
    },
    {
      id: "SupplyCrate_Level45_ScorchedEarth_C",
      name: "Purple Beacon",
    },
    {
      id: "SupplyCrate_Level45_Double_ScorchedEarth_C",
      name: "Purple Beacon (Double items)",
    },
    {
      id: "SupplyCrate_Level55_ScorchedEarth_C",
      name: "Yellow Beacon",
    },
    {
      id: "SupplyCrate_Level55_Double_ScorchedEarth_C",
      name: "Yellow Beacon (Double items)",
    },
    {
      id: "SupplyCrate_Level70_ScorchedEarth_C",
      name: "Red Beacon",
    },
    {
      id: "SupplyCrate_Level70_Double_ScorchedEarth_C",
      name: "Red Beacon (Double items)",
    },
    {
      id: "ArtifactCrate_SE_C",
      name: "Artifact Container Destroyer",
    },
    {
      id: "ArtifactCrate_2_SE_C",
      name: "Artifact Container Gatekeeper",
    },
    {
      id: "ArtifactCrate_3_SE_C",
      name: "Artifact Container Crag",
    },
  ],
  Ragnarok: [
    {
      id: "SupplyCrate_Chest_Treasure_JacksonL_C",
      name: "Treasure Chest",
    },
  ],
  RagnarokExtracrates: [
    {
      id: "SupplyCrate_Cave_QualityTier1_C",
      name: "Cave Beacon 1",
    },
    {
      id: "SupplyCrate_Cave_QualityTier2_C",
      name: "Cave Beacon 2",
    },
    {
      id: "SupplyCrate_Cave_QualityTier3_C",
      name: "Cave Beacon 3",
    },
    {
      id: "SupplyCrate_Cave_QualityTier4_C",
      name: "Cave Beacon 4",
    },
    {
      id: "SupplyCrate_SwampCaveTier1_C",
      name: "Swamp Cave Loot Crate blue",
    },
    {
      id: "SupplyCrate_SwampCaveTier2_C",
      name: "Swamp Cave Loot Crate yellow",
    },
    {
      id: "SupplyCrate_SwampCaveTier3_C",
      name: "Swamp Cave Loot Crate red",
    },
    {
      id: "SupplyCrate_IceCaveTier1_C",
      name: "Ice Cave Loot Crate blue",
    },
    {
      id: "SupplyCrate_IceCaveTier2_C",
      name: "Ice Cave Loot Crate yellow",
    },
    {
      id: "SupplyCrate_IceCaveTier3_C",
      name: "Ice Cave Loot Crate red",
    },
    {
      id: "SupplyCrate_UnderwaterCaveTier1_C",
      name: "Underwater Caves Loot Crate blue",
    },
    {
      id: "SupplyCrate_UnderwaterCaveTier2_C",
      name: "Underwater Caves Loot Crate yellow",
    },
    {
      id: "SupplyCrate_UnderwaterCaveTier3_C",
      name: "Underwater Caves Loot Crate red",
    },
    {
      id: "SupplyCrate_OceanInstant_C",
      name: "Deep Sea Loot Crate",
    },
    {
      id: "SupplyCrate_Level03_C",
      name: "White Beacon",
    },
    {
      id: "SupplyCrate_Level03_Double_C",
      name: "White Beacon (Double items)",
    },
    {
      id: "SupplyCrate_Level15_C",
      name: "Green Beacon",
    },
    {
      id: "SupplyCrate_Level15_Double_C",
      name: "Green Beacon (Double items)",
    },
    {
      id: "SupplyCrate_Level25_C",
      name: "Blue Beacon",
    },
    {
      id: "SupplyCrate_Level25_Double_C",
      name: "Blue Beacon (Double items)",
    },
    {
      id: "SupplyCrate_Level35_C",
      name: "Purple Beacon",
    },
    {
      id: "SupplyCrate_Level35_Double_C",
      name: "Purple Beacon (Double items)",
    },
    {
      id: "SupplyCrate_Level45_C",
      name: "Yellow Beacon",
    },
    {
      id: "SupplyCrate_Level45_Double_C",
      name: "Yellow Beacon (Double items)",
    },
    {
      id: "SupplyCrate_Level60_C",
      name: "Red Beacon",
    },
    {
      id: "SupplyCrate_Level60_Double_C",
      name: "Red Beacon (Double items)",
    },
    {
      id: "ArtifactCrate_1_C",
      name: "Artifact Container Hunter",
    },
    {
      id: "ArtifactCrate_2_C",
      name: "Artifact Container Pack",
    },
    {
      id: "ArtifactCrate_3_C",
      name: "Artifact Container Massive",
    },
    {
      id: "ArtifactCrate_4_C",
      name: "Artifact Container Devious",
    },
    {
      id: "ArtifactCrate_5_C",
      name: "Artifact Container Clever",
    },
    {
      id: "ArtifactCrate_6_C",
      name: "Artifact Container Skylord",
    },
    {
      id: "ArtifactCrate_7_C",
      name: "Artifact Container Devourer",
    },
    {
      id: "ArtifactCrate_8_C",
      name: "Artifact Container Immune",
    },
    {
      id: "ArtifactCrate_9_C",
      name: "Artifact Container Strong",
    },
    {
      id: "ArtifactCrate_10_C",
      name: "Artifact Container Cunning",
    },
    {
      id: "ArtifactCrate_11_C",
      name: "Artifact Container Brute",
    },
    {
      id: "BeaverDam_C",
      name: "Beaver Dam",
    },
    {
      id: "SupplyCrateBaseBP_Instantaneous_DamLogs_Child_C",
      name: "Giant Beaver Dam Logs",
    },
    {
      id: "SupplyCrateBaseBP_Instantaneous_DenLogs_Child2_C",
      name: "Giant Beaver Dam",
    },
    {
      id: "SupplyCrate_Cave_QualityTier1_ScorchedEarth_C",
      name: "Cave Beacon 1",
    },
    {
      id: "SupplyCrate_Cave_QualityTier2_ScorchedEarth_C",
      name: "Cave Beacon 2",
    },
    {
      id: "SupplyCrate_Cave_QualityTier3_ScorchedEarth_C",
      name: "Cave Beacon 3",
    },
    {
      id: "SupplyCrate_Level03_ScorchedEarth_C",
      name: "White Beacon",
    },
    {
      id: "SupplyCrate_Level03_Double_ScorchedEarth_C",
      name: "White Beacon (Double items)",
    },
    {
      id: "SupplyCrate_Level15_ScorchedEarth_C",
      name: "Green Beacon",
    },
    {
      id: "SupplyCrate_Level15_Double_ScorchedEarth_C",
      name: "Green Beacon (Double items)",
    },
    {
      id: "SupplyCrate_Level30_ScorchedEarth_C",
      name: "Blue Beacon",
    },
    {
      id: "SupplyCrate_Level30_Double_ScorchedEarth_C",
      name: "Blue Beacon (Double items)",
    },
    {
      id: "SupplyCrate_Level45_ScorchedEarth_C",
      name: "Purple Beacon",
    },
    {
      id: "SupplyCrate_Level45_Double_ScorchedEarth_C",
      name: "Purple Beacon (Double items)",
    },
    {
      id: "SupplyCrate_Level55_ScorchedEarth_C",
      name: "Yellow Beacon",
    },
    {
      id: "SupplyCrate_Level55_Double_ScorchedEarth_C",
      name: "Yellow Beacon (Double items)",
    },
    {
      id: "SupplyCrate_Level70_ScorchedEarth_C",
      name: "Red Beacon",
    },
    {
      id: "SupplyCrate_Level70_Double_ScorchedEarth_C",
      name: "Red Beacon (Double items)",
    },
    {
      id: "ArtifactCrate_SE_C",
      name: "Artifact Container Destroyer",
    },
    {
      id: "ArtifactCrate_2_SE_C",
      name: "Artifact Container Gatekeeper",
    },
    {
      id: "ArtifactCrate_3_SE_C",
      name: "Artifact Container Crag",
    },
  ],
  Aberration: [
    {
      id: "SupplyCrate_Cave_Aberration_Level10_C",
      name: "White Crate",
    },
    {
      id: "SupplyCrate_Cave_Aberration_Level10_Double_C",
      name: "White Crate (Double)",
    },
    {
      id: "SupplyCrate_Cave_Aberration_Level25_C",
      name: "Green Crate",
    },
    {
      id: "SupplyCrate_Cave_Aberration_Level25_Double_C",
      name: "Green Crate (Double)",
    },
    {
      id: "SupplyCrate_Cave_Aberration_Level35_C",
      name: "Blue Crate",
    },
    {
      id: "SupplyCrate_Cave_Aberration_Level35_Double_C",
      name: "Blue Crate (Double)",
    },
    {
      id: "SupplyCrate_Cave_Aberration_Level50_C",
      name: "Purple Crate",
    },
    {
      id: "SupplyCrate_Cave_Aberration_Level50_Double_C",
      name: "Purple Crate (Double)",
    },
    {
      id: "SupplyCrate_Cave_Aberration_Level65_C",
      name: "Yellow Crate",
    },
    {
      id: "SupplyCrate_Cave_Aberration_Level65_Double_C",
      name: "Yellow Crate (Double)",
    },
    {
      id: "SupplyCrate_Cave_Aberration_Level80_C",
      name: "Red Crate",
    },
    {
      id: "SupplyCrate_Cave_Aberration_Level80_Double_C",
      name: "Red Crate (Double)",
    },
    {
      id: "SupplyCrate_Dungeon_Aberration_Level35_C",
      name: "Blue Dungeon Crate",
    },
    {
      id: "SupplyCrate_Dungeon_Aberration_Level50_C",
      name: "Purple Dungeon Crate",
    },
    {
      id: "SupplyCrate_Dungeon_Aberration_Level65_C",
      name: "Yellow Dungeon Crate",
    },
    {
      id: "SupplyCrate_Dungeon_Aberration_Level80_C",
      name: "Red Dungeon Crate",
    },
    {
      id: "SupplyCrate_Level35_Aberrant_Surface_C",
      name: "Blue Surface Beacon",
    },
    {
      id: "SupplyCrate_Level35_Aberrant_Surface_Double_C",
      name: "Blue Surface Beacon (Double)",
    },
    {
      id: "SupplyCrate_Level50_Aberrant_Surface_C",
      name: "Purple Surface Beacon",
    },
    {
      id: "SupplyCrate_Level50_Aberrant_Surface_Double_C",
      name: "Purple Surface Beacon (Double)",
    },
    {
      id: "SupplyCrate_Level65_Aberrant_Surface_C",
      name: "Yellow Surface Beacon",
    },
    {
      id: "SupplyCrate_Level65_Aberrant_Surface_Double_C",
      name: "Yellow Surface Beacon (Double)",
    },
    {
      id: "SupplyCrate_Level80_Aberrant_Surface_C",
      name: "Red Surface Beacon",
    },
    {
      id: "SupplyCrate_Level80_Aberrant_Surface_Double_C",
      name: "Red Surface Beacon (Double)",
    },
    {
      id: "ArtifactCrate_AB_C",
      name: "Artifact Container Depths",
    },
    {
      id: "ArtifactCrate_2_AB_C",
      name: "Artifact Container Shadows",
    },
    {
      id: "ArtifactCrate_3_AB_C",
      name: "Artifact Container Stalker",
    },
    {
      id: "ArtifactCrate_4_AB_C",
      name: "Artifact Container Lost",
    },
  ],
  Extinction: [
    {
      id: "SupplyCrate_Cave_QualityTier1_EX_C",
      name: "Cave Loot Crate Blue",
    },
    {
      id: "SupplyCrate_Cave_QualityTier2_EX_C",
      name: "Cave Loot Crate Yellow",
    },
    {
      id: "SupplyCrate_Cave_QualityTier3_EX_C",
      name: "Cave Loot Crate Red",
    },
    {
      id: "SupplyCrate_Base_Horde_Easy_C",
      name: "Orbital Supply Drop Blue",
    },
    {
      id: "SupplyCrate_Base_Horde_Medium_C",
      name: "Orbital Supply Drop Yellow",
    },
    {
      id: "SupplyCrate_Base_Horde_Hard_C",
      name: "Orbital Supply Drop Red",
    },
    {
      id: "SupplyCrate_Base_Horde_Legendary_C",
      name: "Orbital Supply Drop Purple",
    },
    {
      id: "ElementNode_Easy_Horde_C",
      name: "Corrupt Element Node",
    },
    {
      id: "ElementNode_Hard_Horde_C",
      name: "Corrupt Element Node",
    },
    {
      id: "ElementNode_Medium_Horde_C",
      name: "Corrupt Element Node",
    },
    {
      id: "KingKaiju_ElementNode_C",
      name: "Corrupt Element Node",
    },
    {
      id: "ArtifactCrate_Desert_Kaiju_EX_C",
      name: "Artifact Container Chaos",
    },
    {
      id: "ArtifactCrate_ForestKaiju_EX_C",
      name: "Artifact Container Growth",
    },
    {
      id: "ArtifactCrate_IceKaiju_EX_C",
      name: "Artifact Container Void",
    },
    {
      id: "ArtifactCrate_KingKaiju_Alpha_EX_C",
      name: "King Titan Alpha",
    },
    {
      id: "ArtifactCrate_KingKaiju_Beta_EX_C",
      name: "King Titan Beta",
    },
    {
      id: "ArtifactCrate_KingKaiju_EX_C",
      name: "King Titan Gamma",
    },
  ],
  Valguero: [
    {
      id: "Val_SupplyCrate_Level35_C",
      name: "Purple Beacon",
    },
    {
      id: "Val_SupplyCrate_Level35_Double_C",
      name: "Purple Beacon (Double items)",
    },
    {
      id: "Val_SupplyCrate_Level45_C",
      name: "Yellow Beacon",
    },
    {
      id: "Val_SupplyCrate_Level45_Double_C",
      name: "Yellow Beacon (Double items)",
    },
    {
      id: "Val_SupplyCrate_Level60_C",
      name: "Red Beacon",
    },
    {
      id: "Val_SupplyCrate_Level60_Double_C",
      name: "Red Beacon (Double items)",
    },
  ],
  ValgueroExtracrates: [
    {
      id: "SupplyCrate_Cave_QualityTier1_C",
      name: "Cave Beacon 1",
    },
    {
      id: "SupplyCrate_Cave_QualityTier2_C",
      name: "Cave Beacon 2",
    },
    {
      id: "SupplyCrate_Cave_QualityTier3_C",
      name: "Cave Beacon 3",
    },
    {
      id: "SupplyCrate_Cave_QualityTier4_C",
      name: "Cave Beacon 4",
    },
    {
      id: "SupplyCrate_SwampCaveTier1_C",
      name: "Swamp Cave Loot Crate blue",
    },
    {
      id: "SupplyCrate_SwampCaveTier2_C",
      name: "Swamp Cave Loot Crate yellow",
    },
    {
      id: "SupplyCrate_SwampCaveTier3_C",
      name: "Swamp Cave Loot Crate red",
    },
    {
      id: "SupplyCrate_IceCaveTier1_C",
      name: "Ice Cave Loot Crate blue",
    },
    {
      id: "SupplyCrate_IceCaveTier2_C",
      name: "Ice Cave Loot Crate yellow",
    },
    {
      id: "SupplyCrate_IceCaveTier3_C",
      name: "Ice Cave Loot Crate red",
    },
    {
      id: "SupplyCrate_UnderwaterCaveTier1_C",
      name: "Underwater Caves Loot Crate blue",
    },
    {
      id: "SupplyCrate_UnderwaterCaveTier2_C",
      name: "Underwater Caves Loot Crate yellow",
    },
    {
      id: "SupplyCrate_UnderwaterCaveTier3_C",
      name: "Underwater Caves Loot Crate red",
    },
    {
      id: "SupplyCrate_OceanInstant_C",
      name: "Deep Sea Loot Crate",
    },
    {
      id: "SupplyCrate_Level03_C",
      name: "White Beacon",
    },
    {
      id: "SupplyCrate_Level03_Double_C",
      name: "White Beacon (Double items)",
    },
    {
      id: "SupplyCrate_Level15_C",
      name: "Green Beacon",
    },
    {
      id: "SupplyCrate_Level15_Double_C",
      name: "Green Beacon (Double items)",
    },
    {
      id: "SupplyCrate_Level25_C",
      name: "Blue Beacon",
    },
    {
      id: "SupplyCrate_Level25_Double_C",
      name: "Blue Beacon (Double items)",
    },
    {
      id: "SupplyCrate_Level35_C",
      name: "Purple Beacon",
    },
    {
      id: "SupplyCrate_Level35_Double_C",
      name: "Purple Beacon (Double items)",
    },
    {
      id: "SupplyCrate_Level45_C",
      name: "Yellow Beacon",
    },
    {
      id: "SupplyCrate_Level45_Double_C",
      name: "Yellow Beacon (Double items)",
    },
    {
      id: "SupplyCrate_Level60_C",
      name: "Red Beacon",
    },
    {
      id: "SupplyCrate_Level60_Double_C",
      name: "Red Beacon (Double items)",
    },
    {
      id: "ArtifactCrate_1_C",
      name: "Artifact Container Hunter",
    },
    {
      id: "ArtifactCrate_2_C",
      name: "Artifact Container Pack",
    },
    {
      id: "ArtifactCrate_3_C",
      name: "Artifact Container Massive",
    },
    {
      id: "ArtifactCrate_4_C",
      name: "Artifact Container Devious",
    },
    {
      id: "ArtifactCrate_5_C",
      name: "Artifact Container Clever",
    },
    {
      id: "ArtifactCrate_6_C",
      name: "Artifact Container Skylord",
    },
    {
      id: "ArtifactCrate_7_C",
      name: "Artifact Container Devourer",
    },
    {
      id: "ArtifactCrate_8_C",
      name: "Artifact Container Immune",
    },
    {
      id: "ArtifactCrate_9_C",
      name: "Artifact Container Strong",
    },
    {
      id: "ArtifactCrate_10_C",
      name: "Artifact Container Cunning",
    },
    {
      id: "ArtifactCrate_11_C",
      name: "Artifact Container Brute",
    },
    {
      id: "BeaverDam_C",
      name: "Beaver Dam",
    },
    {
      id: "SupplyCrateBaseBP_Instantaneous_DamLogs_Child_C",
      name: "Giant Beaver Dam Logs",
    },
    {
      id: "SupplyCrateBaseBP_Instantaneous_DenLogs_Child2_C",
      name: "Giant Beaver Dam",
    },
    {
      id: "SupplyCrate_Cave_Aberration_Level10_C",
      name: "White Crate",
    },
    {
      id: "SupplyCrate_Cave_Aberration_Level10_Double_C",
      name: "White Crate (Double)",
    },
    {
      id: "SupplyCrate_Cave_Aberration_Level25_C",
      name: "Green Crate",
    },
    {
      id: "SupplyCrate_Cave_Aberration_Level25_Double_C",
      name: "Green Crate (Double)",
    },
    {
      id: "SupplyCrate_Cave_Aberration_Level35_C",
      name: "Blue Crate",
    },
    {
      id: "SupplyCrate_Cave_Aberration_Level35_Double_C",
      name: "Blue Crate (Double)",
    },
    {
      id: "SupplyCrate_Cave_Aberration_Level50_C",
      name: "Purple Crate",
    },
    {
      id: "SupplyCrate_Cave_Aberration_Level50_Double_C",
      name: "Purple Crate (Double)",
    },
    {
      id: "SupplyCrate_Cave_Aberration_Level65_C",
      name: "Yellow Crate",
    },
    {
      id: "SupplyCrate_Cave_Aberration_Level65_Double_C",
      name: "Yellow Crate (Double)",
    },
    {
      id: "SupplyCrate_Cave_Aberration_Level80_C",
      name: "Red Crate",
    },
    {
      id: "SupplyCrate_Cave_Aberration_Level80_Double_C",
      name: "Red Crate (Double)",
    },
    {
      id: "SupplyCrate_Dungeon_Aberration_Level35_C",
      name: "Blue Dungeon Crate",
    },
    {
      id: "SupplyCrate_Dungeon_Aberration_Level50_C",
      name: "Purple Dungeon Crate",
    },
    {
      id: "SupplyCrate_Dungeon_Aberration_Level65_C",
      name: "Yellow Dungeon Crate",
    },
    {
      id: "SupplyCrate_Dungeon_Aberration_Level80_C",
      name: "Red Dungeon Crate",
    },
    {
      id: "SupplyCrate_Level35_Aberrant_Surface_C",
      name: "Blue Surface Beacon",
    },
    {
      id: "SupplyCrate_Level35_Aberrant_Surface_Double_C",
      name: "Blue Surface Beacon (Double)",
    },
    {
      id: "SupplyCrate_Level50_Aberrant_Surface_C",
      name: "Purple Surface Beacon",
    },
    {
      id: "SupplyCrate_Level50_Aberrant_Surface_Double_C",
      name: "Purple Surface Beacon (Double)",
    },
    {
      id: "SupplyCrate_Level65_Aberrant_Surface_C",
      name: "Yellow Surface Beacon",
    },
    {
      id: "SupplyCrate_Level65_Aberrant_Surface_Double_C",
      name: "Yellow Surface Beacon (Double)",
    },
    {
      id: "SupplyCrate_Level80_Aberrant_Surface_C",
      name: "Red Surface Beacon",
    },
    {
      id: "SupplyCrate_Level80_Aberrant_Surface_Double_C",
      name: "Red Surface Beacon (Double)",
    },
    {
      id: "ArtifactCrate_AB_C",
      name: "Artifact Container Depths",
    },
    {
      id: "ArtifactCrate_2_AB_C",
      name: "Artifact Container Shadows",
    },
    {
      id: "ArtifactCrate_3_AB_C",
      name: "Artifact Container Stalker",
    },
    {
      id: "ArtifactCrate_4_AB_C",
      name: "Artifact Container Lost",
    },
    {
      id: "SupplyCrate_Cave_QualityTier1_ScorchedEarth_C",
      name: "Cave Beacon 1",
    },
    {
      id: "SupplyCrate_Cave_QualityTier2_ScorchedEarth_C",
      name: "Cave Beacon 2",
    },
    {
      id: "SupplyCrate_Cave_QualityTier3_ScorchedEarth_C",
      name: "Cave Beacon 3",
    },
    {
      id: "SupplyCrate_Level03_ScorchedEarth_C",
      name: "White Beacon",
    },
    {
      id: "SupplyCrate_Level03_Double_ScorchedEarth_C",
      name: "White Beacon (Double items)",
    },
    {
      id: "SupplyCrate_Level15_ScorchedEarth_C",
      name: "Green Beacon",
    },
    {
      id: "SupplyCrate_Level15_Double_ScorchedEarth_C",
      name: "Green Beacon (Double items)",
    },
    {
      id: "SupplyCrate_Level30_ScorchedEarth_C",
      name: "Blue Beacon",
    },
    {
      id: "SupplyCrate_Level30_Double_ScorchedEarth_C",
      name: "Blue Beacon (Double items)",
    },
    {
      id: "SupplyCrate_Level45_ScorchedEarth_C",
      name: "Purple Beacon",
    },
    {
      id: "SupplyCrate_Level45_Double_ScorchedEarth_C",
      name: "Purple Beacon (Double items)",
    },
    {
      id: "SupplyCrate_Level55_ScorchedEarth_C",
      name: "Yellow Beacon",
    },
    {
      id: "SupplyCrate_Level55_Double_ScorchedEarth_C",
      name: "Yellow Beacon (Double items)",
    },
    {
      id: "SupplyCrate_Level70_ScorchedEarth_C",
      name: "Red Beacon",
    },
    {
      id: "SupplyCrate_Level70_Double_ScorchedEarth_C",
      name: "Red Beacon (Double items)",
    },
    {
      id: "ArtifactCrate_SE_C",
      name: "Artifact Container Destroyer",
    },
    {
      id: "ArtifactCrate_2_SE_C",
      name: "Artifact Container Gatekeeper",
    },
    {
      id: "ArtifactCrate_3_SE_C",
      name: "Artifact Container Crag",
    },
  ],
  Genesis2: [
    {
      id: "SupplyCrate_Space_01_Ambergris_C",
      name: "White Supply Crate",
    },
    {
      id: "SupplyCrate_Space_02_Crystal_C",
      name: "Green Supply Crate",
    },
    {
      id: "SupplyCrate_Space_03_Sulfur_C",
      name: "Blue Supply Crate",
    },
    {
      id: "SupplyCrate_Space_04_ElementShards_C",
      name: "Purple Supply Crate",
    },
    {
      id: "SupplyCrate_Space_05_Obsidian_C",
      name: "Yellow Supply Crate",
    },
    {
      id: "SupplyCrate_Space_06_Oil_C",
      name: "Red Supply Crate",
    },
    {
      id: "SupplyCrate_Space_07_ElementDust_C",
      name: "Cyan Supply Crate",
    },
    {
      id: "SupplyCrate_Space_08_BlackPearls_C",
      name: "Orange Supply Crate",
    },
  ],
  LostIsland: [
    {
      id: "SupplyCrate_Level45_LostIsland_C",
      name: "Yellow Beacon",
    },
    {
      id: "SupplyCrate_Level45_LostIsland_Double_C",
      name: "Yellow Beacon (Double items)",
    },
    {
      id: "SupplyCrate_Level60_LostIsland_C",
      name: "Red Beacon",
    },
    {
      id: "SupplyCrate_Level60_LostIsland_Double_C",
      name: "Red Beacon (Double items)",
    },
    {
      id: "SupplyCrate_Ruins_LostIsland_C",
      name: "Ruins Dungeon Crate",
    },
  ],
  LostIslandExtracrates: [
    {
      id: "SupplyCrate_Cave_QualityTier1_C",
      name: "Cave Beacon 1",
    },
    {
      id: "SupplyCrate_Cave_QualityTier2_C",
      name: "Cave Beacon 2",
    },
    {
      id: "SupplyCrate_Cave_QualityTier3_C",
      name: "Cave Beacon 3",
    },
    {
      id: "SupplyCrate_Cave_QualityTier4_C",
      name: "Cave Beacon 4",
    },
    {
      id: "SupplyCrate_SwampCaveTier1_C",
      name: "Swamp Cave Loot Crate blue",
    },
    {
      id: "SupplyCrate_SwampCaveTier2_C",
      name: "Swamp Cave Loot Crate yellow",
    },
    {
      id: "SupplyCrate_SwampCaveTier3_C",
      name: "Swamp Cave Loot Crate red",
    },
    {
      id: "SupplyCrate_IceCaveTier1_C",
      name: "Ice Cave Loot Crate blue",
    },
    {
      id: "SupplyCrate_IceCaveTier2_C",
      name: "Ice Cave Loot Crate yellow",
    },
    {
      id: "SupplyCrate_IceCaveTier3_C",
      name: "Ice Cave Loot Crate red",
    },
    {
      id: "SupplyCrate_UnderwaterCaveTier1_C",
      name: "Underwater Caves Loot Crate blue",
    },
    {
      id: "SupplyCrate_UnderwaterCaveTier2_C",
      name: "Underwater Caves Loot Crate yellow",
    },
    {
      id: "SupplyCrate_UnderwaterCaveTier3_C",
      name: "Underwater Caves Loot Crate red",
    },
    {
      id: "SupplyCrate_OceanInstant_C",
      name: "Deep Sea Loot Crate",
    },
    {
      id: "SupplyCrate_Level03_C",
      name: "White Beacon",
    },
    {
      id: "SupplyCrate_Level03_Double_C",
      name: "White Beacon (Double items)",
    },
    {
      id: "SupplyCrate_Level15_C",
      name: "Green Beacon",
    },
    {
      id: "SupplyCrate_Level15_Double_C",
      name: "Green Beacon (Double items)",
    },
    {
      id: "SupplyCrate_Level25_C",
      name: "Blue Beacon",
    },
    {
      id: "SupplyCrate_Level25_Double_C",
      name: "Blue Beacon (Double items)",
    },
    {
      id: "SupplyCrate_Level35_C",
      name: "Purple Beacon",
    },
    {
      id: "SupplyCrate_Level35_Double_C",
      name: "Purple Beacon (Double items)",
    },
    {
      id: "SupplyCrate_Level45_C",
      name: "Yellow Beacon",
    },
    {
      id: "SupplyCrate_Level45_Double_C",
      name: "Yellow Beacon (Double items)",
    },
    {
      id: "SupplyCrate_Level60_C",
      name: "Red Beacon",
    },
    {
      id: "SupplyCrate_Level60_Double_C",
      name: "Red Beacon (Double items)",
    },
    {
      id: "ArtifactCrate_1_C",
      name: "Artifact Container Hunter",
    },
    {
      id: "ArtifactCrate_2_C",
      name: "Artifact Container Pack",
    },
    {
      id: "ArtifactCrate_3_C",
      name: "Artifact Container Massive",
    },
    {
      id: "ArtifactCrate_4_C",
      name: "Artifact Container Devious",
    },
    {
      id: "ArtifactCrate_5_C",
      name: "Artifact Container Clever",
    },
    {
      id: "ArtifactCrate_6_C",
      name: "Artifact Container Skylord",
    },
    {
      id: "ArtifactCrate_7_C",
      name: "Artifact Container Devourer",
    },
    {
      id: "ArtifactCrate_8_C",
      name: "Artifact Container Immune",
    },
    {
      id: "ArtifactCrate_9_C",
      name: "Artifact Container Strong",
    },
    {
      id: "ArtifactCrate_10_C",
      name: "Artifact Container Cunning",
    },
    {
      id: "ArtifactCrate_11_C",
      name: "Artifact Container Brute",
    },
    {
      id: "BeaverDam_C",
      name: "Beaver Dam",
    },
    {
      id: "SupplyCrateBaseBP_Instantaneous_DamLogs_Child_C",
      name: "Giant Beaver Dam Logs",
    },
    {
      id: "SupplyCrateBaseBP_Instantaneous_DenLogs_Child2_C",
      name: "Giant Beaver Dam",
    },
    {
      id: "SupplyCrate_Cave_QualityTier1_ScorchedEarth_C",
      name: "Cave Beacon 1",
    },
    {
      id: "SupplyCrate_Cave_QualityTier2_ScorchedEarth_C",
      name: "Cave Beacon 2",
    },
    {
      id: "SupplyCrate_Cave_QualityTier3_ScorchedEarth_C",
      name: "Cave Beacon 3",
    },
    {
      id: "SupplyCrate_Level03_ScorchedEarth_C",
      name: "White Beacon",
    },
    {
      id: "SupplyCrate_Level03_Double_ScorchedEarth_C",
      name: "White Beacon (Double items)",
    },
    {
      id: "SupplyCrate_Level15_ScorchedEarth_C",
      name: "Green Beacon",
    },
    {
      id: "SupplyCrate_Level15_Double_ScorchedEarth_C",
      name: "Green Beacon (Double items)",
    },
    {
      id: "SupplyCrate_Level30_ScorchedEarth_C",
      name: "Blue Beacon",
    },
    {
      id: "SupplyCrate_Level30_Double_ScorchedEarth_C",
      name: "Blue Beacon (Double items)",
    },
    {
      id: "SupplyCrate_Level45_ScorchedEarth_C",
      name: "Purple Beacon",
    },
    {
      id: "SupplyCrate_Level45_Double_ScorchedEarth_C",
      name: "Purple Beacon (Double items)",
    },
    {
      id: "SupplyCrate_Level55_ScorchedEarth_C",
      name: "Yellow Beacon",
    },
    {
      id: "SupplyCrate_Level55_Double_ScorchedEarth_C",
      name: "Yellow Beacon (Double items)",
    },
    {
      id: "SupplyCrate_Level70_ScorchedEarth_C",
      name: "Red Beacon",
    },
    {
      id: "SupplyCrate_Level70_Double_ScorchedEarth_C",
      name: "Red Beacon (Double items)",
    },
    {
      id: "ArtifactCrate_SE_C",
      name: "Artifact Container Destroyer",
    },
    {
      id: "ArtifactCrate_2_SE_C",
      name: "Artifact Container Gatekeeper",
    },
    {
      id: "ArtifactCrate_3_SE_C",
      name: "Artifact Container Crag",
    },
  ],
};
function calcXP(theXpk, level, night = false) {
  return parsePercision(theXpk * ((level - 1) / 10 + 1) * 4 * XPMultiplier);
}
function Creature(creatureID) {
  Object.assign(this, CREATURES[creatureID]);
  if (
    this.disableTame == 1 ||
    typeof this.a0 == "undefined" ||
    typeof this.eats == "undefined"
  ) {
    this.isTamable = false;
  } else {
    this.isTamable = true;
  }
  if (
    this.disableKO != "1" &&
    WEAPONS != null &&
    typeof this.t1 != "undefined" &&
    typeof this.tI != "undefined"
  ) {
    this.isKOable = true;
  } else {
    this.isKOable = false;
  }
  if (typeof this.forceW == "object") {
    this.isKOable = true;
  }
  if (
    typeof this.bm !== "undefined" &&
    (typeof this.be !== "undefined" || typeof this.bp !== "undefined")
  ) {
    this.isBreedable = true;
  }

  // X Creatues gain 88 levels after taming, while others gain 73
  if (typeof this.c == "object" && this.c.indexOf(40) >= 0) {
    this.maxLevelsAfterTame = 88;
  } else {
    this.maxLevelsAfterTame = 73;
  }
  this.getAttr = function (attr) {
    var r = false;
    if (typeof this.af == "object") {
      r = this.af.indexOf(attr) >= 0;
    }
    if (r != true && typeof this.carry == "object") {
      r = this.carry.indexOf(attr) >= 0;
    }
    return r;
  };
  this.hasStats = function () {
    return typeof this.bs == "object";
  };
  this.getNumStats = function () {
    if (this.hasStats()) {
      return Object.keys(this.stats.bs);
    } else {
      return 0;
    }
  };
  this.getStat = function (statKey) {
    if (this.hasStats() && typeof this.bs[statKey] == "object") {
      return this.bs[statKey];
    } else {
      return null;
    }
  };
  this.getNumEligibleStats = function () {
    var theStat = this.getStat("o");
    if (typeof theStat == "object" && theStat.b == null) {
      return 5;
    } else {
      return 6;
    }
  };
  this.getEstimatedStat = function (statKey, level) {
    if (this.hasStats()) {
      var baseStat = this.getStat(statKey);
      if (baseStat) {
        if (baseStat.b >= 0 && baseStat.w > 0) {
          var numEligibleStats = this.getNumEligibleStats();
          if (level > 0) {
            var numLevels = level - 1;
          } else {
            var numLevels = 1;
          }
          var estFoodLevels = Math.round(numLevels / numEligibleStats);
          return baseStat.b + baseStat.w * estFoodLevels;
        } else if (typeof baseStat.b == "number") {
          return baseStat.b;
        }
      }
    } else {
      return null;
    }
  };
}
function initTamingNotice() {
  if (creature.tamingNotice && creature.tamingNotice.charCodeAt(0) != 55358) {
    $("#taming").append(
      `<p class="light marginTop0">${creature.tamingNotice}</h2>`
    );
  }
}

function processTameInput() {
  console.log("processTameInput()");
  var level = Settings.get("level");
  if (typeof tamingResults == "object") {
    var oldTamingResults = tamingResults;
    tamingResults = calcTame(CREATURES[creatureID], taming.food);
  } else {
    tamingResults = calcTame(CREATURES[creatureID], taming.food);
    var oldTamingResults = tamingResults;
  }
  if (tamingResults.enoughFood) {
    if ($("#tamingResults").is(":hidden")) {
      $("#tamingResults").show();
      $("#tamingWarning").food.hide();
    }
    if (tamingResults.tooMuchFood) {
      $("#tamingExcess").show();
    } else {
      $("#tamingExcess").hide();
    }
    var prevLevel = parseInt($("#baseLevel").text());
    if (isNaN(prevLevel)) {
      prevLevel = level;
    }
    $("#baseLevel").countTo({ from: prevLevel, to: level });
    $("#gainedLevels").countTo({
      from: oldTamingResults.gainedLevels,
      to: tamingResults.gainedLevels,
    });
    $("#bonusLevel").countTo({
      from: level + oldTamingResults.gainedLevels,
      to: level + tamingResults.gainedLevels,
    });
    $("#maxLevel").countTo({
      from: level + oldTamingResults.gainedLevels + creature.maxLevelsAfterTame,
      to: level + tamingResults.gainedLevels + creature.maxLevelsAfterTame,
    });
    $("#totalTime").text(timeFormatL(tamingResults.totalSecs));
    $("#effectiveness").countTo({
      decimals: 1,
      from: Math.round(oldTamingResults.effectiveness * 10) / 10,
      to: Math.round(tamingResults.effectiveness * 10) / 10,
    });
    setRingProgress(tamingResults.effectiveness);
    if (method != "n") {
      $("#torporDeplPS").countTo({
        decimals: 1,
        from: Math.round(tamingResults.torporDeplPS * 10) / 10,
        to: Math.round(tamingResults.torporDeplPS * 10) / 10,
      });
      $("#ascerbicmushroomsMin").countTo({
        from: oldTamingResults.ascerbicmushroomsMin,
        to: tamingResults.ascerbicmushroomsMin,
      });
      $("#biotoxinsMin").countTo({
        from: oldTamingResults.biotoxinsMin,
        to: tamingResults.biotoxinsMin,
      });
      $("#narcsMin").countTo({
        from: oldTamingResults.narcsMin,
        to: tamingResults.narcsMin,
      });
      $("#narcBMin").countTo({
        from: oldTamingResults.narcBMin,
        to: tamingResults.narcBMin,
      });
      if (tamingResults.narcBMin > 0) {
        $("#narcsNeeded").removeClass("noNarcs");
      } else {
        $("#narcsNeeded").addClass("noNarcs");
      }
    }
    starveTimer.updateTotalFood(tamingResults.totalFood);
  } else {
    $("#tamingResults").hide();
    $("#tamingWarning").show();
    $("#tamingWarning .miniBar").css(
      "width",
      Math.min(tamingResults.percentTamed * 100, 100) + "%"
    );
  }
}
function calcData(cr, level, method = "v", useState = null) {
  var affinityNeeded = cr.a0 + cr.aI * level;
  if (Settings.get("sanguineElixir")) {
    affinityNeeded *= 0.7;
  }
  var theEats = [];
  for (var i in cr.eats) {
    if (FOODS[cr.eats[i]] != null) {
      theEats.push(cr.eats[i]);
    }
  }
  var row = Array();
  var use = Array();
  var food = Array();
  var foodConsumption =
    cr.foodBase * cr.foodMult * Settings.get("consumptionMultiplier");
  if (method == "n") {
    foodConsumption = foodConsumption * cr.nvfrm;
  }
  var selectedFood = 0;
  var theRecentFoods = Settings.get("recentFoods");
  var selectedFoodFound = false;
  for (var i in theRecentFoods) {
    if (!selectedFoodFound) {
      var foodNameBase = this.getBaseName(theRecentFoods[i]);
      for (var j in theEats) {
        if (this.getBaseName(theEats[j]) == foodNameBase) {
          selectedFood = j;
          selectedFoodFound = true;
          break;
        }
      }
    }
  }
  if (selectedFood >= MAX_FOOD_COLLAPSED) {
    var expanded = true;
  } else {
    var expanded = false;
  }
  for (var key in theEats) {
    row.push({ key: key, food: theEats[key], use: 0, level: level });
    var foodName = theEats[key];
    var foodNameBase = this.getBaseName(foodName);
    if (typeof cr.kf != "undefined" && typeof ITEMS[cr.kf] != "undefined") {
      var kf = ITEMS[cr.kf];
    }
    var foodNameFormatted = foodNameBase;
    if (cr.disableMult) {
      var tamingMult = 4;
    } else {
      var tamingMult = Settings.get("tamingMultiplier", true) * 4;
    }
    var foodMaxRaw = affinityNeeded / FOODS[foodName].affinity / tamingMult;
    var interval1 = null;
    if (method == "n") {
      var foodMaxRaw = foodMaxRaw / cr.nvfam;
      var interval = FOODS[foodName].food / foodConsumption;
      if (
        typeof cr.bs == "object" &&
        typeof cr.bs.f == "object" &&
        typeof cr.bs.f.b == "number" &&
        typeof cr.bs.f.w == "number"
      ) {
        var avgPerStat = Math.round(level / 7);
        var estimatedFood = cr.bs.f.b + cr.bs.f.w * avgPerStat;
        var passiveFoodPerc = 0.9;
        var requiredFoodDecrease = estimatedFood * (1 - passiveFoodPerc);
        var requiredFood = Math.max(requiredFoodDecrease, FOODS[foodName].food);
        var interval1 = requiredFood / foodConsumption;
      }
      var foodMax = Math.ceil(foodMaxRaw);
      if (foodMax == 1) {
        var foodSecondsPer = 0;
        var foodSeconds = 0;
        interval1 = 0;
        interval = 0;
      } else {
        var foodSecondsPer = FOODS[foodName].food / foodConsumption;
        if (typeof interval1 == "number") {
          var foodSeconds = Math.ceil(
            Math.max(foodMax - 2, 0) * foodSecondsPer + interval1
          );
        } else {
          var foodSeconds = Math.ceil(
            Math.max(foodMax - 1, 0) * foodSecondsPer
          );
        }
      }
    } else {
      var interval = null;
      var foodMax = Math.ceil(foodMaxRaw);
      var foodSecondsPer = FOODS[foodName].food / foodConsumption;
      var foodSeconds = Math.ceil(foodMax * foodSecondsPer);
    }
    if (key == selectedFood) {
      use[key] = foodMax;
    } else {
      use[key] = 0;
    }
    if (Settings.get("sanguineElixir")) {
      var percentPer = 70 / foodMaxRaw;
    } else {
      var percentPer = 100 / foodMaxRaw;
    }
    food[key] = {
      name: foodName,
      nameFormatted: foodNameFormatted,
      food: FOODS[foodName].food,
      l: FOODS[foodName].l,
      df: FOODS[foodName].df,
      max: foodMax,
      use: use[key],
      seconds: foodSeconds,
      secondsPer: foodSecondsPer,
      percentPer: percentPer,
      interval: interval,
      interval1: interval1,
      expanded: false,
      key: key,
    };
  }
  var returnData = { food: food, affinityNeeded: affinityNeeded };
  return returnData;
}
function getBaseName(name) {
  var foodNameSplit = name.split("|");
  return foodNameSplit[0];
}
function useExclusive(usedFoodIndex) {
  for (var i in taming.food) {
    if (i == usedFoodIndex) {
      taming.food[i].use = taming.food[i].max;
      var amountUsed = taming.food[i].max;
    } else {
      taming.food[i].use = 0;
    }
  }
  return amountUsed;
}
function calcTame(cr, foodList, useExclusive) {
  var level = Settings.get("level");
  var effectiveness = 100;
  var totalSecs = 0;
  var affinityNeeded = cr.a0 + cr.aI * level;
  if (Settings.get("sanguineElixir")) {
    affinityNeeded *= 0.7;
  }
  var affinityLeft = affinityNeeded;
  var foodConsumption =
    cr.foodBase * cr.foodMult * Settings.get("consumptionMultiplier");
  totalFood = 0;
  if (cr.disableMult) {
    var tamingMult = 4;
  } else {
    var tamingMult = Settings.get("tamingMultiplier", true) * 4;
  }
  if (method == "n") {
    foodConsumption = foodConsumption * cr.nvfrm;
  }
  var tooMuchFood = false;
  var numUsedTotal = 0;
  for (var aFoodKey in foodList) {
    var aFood = Object.assign({}, foodList[aFoodKey]);
    if (affinityLeft > 0) {
      if (useExclusive >= 0) {
        if (aFoodKey == useExclusive) {
          aFood.use = aFood.max;
        } else {
          aFood.use = 0;
        }
      }
      var aFoodName = aFood.name;
      if (method == "n") {
        var numNeeded = Math.ceil(
          affinityLeft / FOODS[aFoodName].affinity / tamingMult / cr.nvfam
        );
      } else {
        var numNeeded = Math.ceil(
          affinityLeft / FOODS[aFoodName].affinity / tamingMult
        );
      }
      if (numNeeded >= aFood.use) {
        var numToUse = aFood.use;
      } else {
        tooMuchFood = true;
        var numToUse = numNeeded;
      }
      if (method == "n") {
        affinityLeft -=
          numToUse * FOODS[aFoodName].affinity * tamingMult * cr.nvfam;
      } else {
        affinityLeft -= numToUse * FOODS[aFoodName].affinity * tamingMult;
      }
      totalFood += numToUse * FOODS[aFoodName].food;
      var i = 1;
      while (i <= numToUse) {
        if (method == "n") {
          effectiveness -=
            (Math.pow(effectiveness, 2) * cr.tiba) /
            FOODS[aFoodName].affinity /
            tamingMult /
            cr.nvfam /
            100;
          if (numUsedTotal == 0) {
          } else if (numUsedTotal == 1) {
            totalSecs += aFood.interval1;
          } else {
            totalSecs += FOODS[aFoodName].food / foodConsumption;
          }
        } else {
          effectiveness -=
            (Math.pow(effectiveness, 2) * cr.tiba) /
            FOODS[aFoodName].affinity /
            tamingMult /
            100;
          totalSecs += FOODS[aFoodName].food / foodConsumption;
        }
        numUsedTotal++;
        i++;
      }
      if (effectiveness < 0) {
        effectiveness = 0;
      }
    } else if (aFood.use > 0) {
      tooMuchFood = true;
    }
  }
  totalSecs = Math.ceil(totalSecs);
  var neededValues = Array();
  var neededValuesSecs = Array();
  if (affinityLeft <= 0) {
    var enoughFood = true;
  } else {
    var enoughFood = false;
    for (var aFood in foodList) {
      var aFood = Object.assign({}, foodList[aFoodKey]);
      var aFoodName = aFood.name;
      var numNeeded = Math.ceil(
        affinityLeft / FOODS[aFoodName].affinity / tamingMult
      );
      neededValues[aFood] = numNeeded;
      neededValuesSecs[aFood] = Math.ceil(
        (numNeeded * FOODS[aFoodName].food) / foodConsumption + totalSecs
      );
    }
  }
  var percentLeft = affinityLeft / affinityNeeded;
  var percentTamed = 1 - percentLeft;
  var totalTorpor = cr.t1 + cr.tI * (level - 1);
  var torporDeplPS =
    cr.tDPS0 + Math.pow(level - 1, 0.800403041) / (22.39671632 / cr.tDPS0);
  var ascerbicmushroomsMin = Math.max(
    Math.ceil(
      (totalSecs * torporDeplPS - totalTorpor) /
        (narcotics.ascerbic.torpor + torporDeplPS * narcotics.ascerbic.secs)
    ),
    0
  );
  var biotoxinsMin = Math.max(
    Math.ceil(
      (totalSecs * torporDeplPS - totalTorpor) /
        (narcotics.bio.torpor + torporDeplPS * narcotics.bio.secs)
    ),
    0
  );
  var narcsMin = Math.max(
    Math.ceil(
      (totalSecs * torporDeplPS - totalTorpor) /
        (narcotics.narcotics.torpor + torporDeplPS * narcotics.narcotics.secs)
    ),
    0
  );
  var narcBMin = Math.max(
    Math.ceil(
      (totalSecs * torporDeplPS - totalTorpor) /
        (narcotics.narcoberries.torpor +
          torporDeplPS * narcotics.narcoberries.secs)
    ),
    0
  );
  var gainedLevels = Math.floor((level * 0.5 * effectiveness) / 100);
  return {
    totalFood,
    tooMuchFood,
    enoughFood,
    percentTamed,
    neededValues,
    neededValuesSecs,
    totalTorpor,
    torporDeplPS,
    ascerbicmushroomsMin,
    biotoxinsMin,
    narcsMin,
    narcBMin,
    effectiveness,
    gainedLevels,
    totalSecs,
  };
}
if (typeof HOST != "string") {
  var HOST = "https://www.dododex.com";
}
const REQUEST_URL = HOST + "/api/data.json";
const PATH_IMG_CREATURE = HOST + "/media/creature/";
const PATH_IMG = HOST + "/media/item/";
const PATH_IMG_UI = HOST + "/media/ui/";
const WIKI_URL = "https://ark.gamepedia.com/";
function getImage(item) {
  if (typeof IMAGES[item] === "undefined") {
    if (item.indexOf(" Dye") >= 0) {
      var filename = PATH_IMG + IMAGES["White Dye"];
    } else if (item.indexOf("Egg") >= 0) {
      var filename = PATH_IMG + IMAGES["Dodo Egg"];
    } else if (item.indexOf("Kibble") >= 0) {
      var filename = PATH_IMG + IMAGES["Kibble"];
    } else {
      var filename = null;
    }
  } else {
    var filename = PATH_IMG + IMAGES[item];
  }
  return filename;
}

jQuery(function ($) {
  $(".timer").countTo({
    from: 50,
    to: 2500,
    speed: 500,
    refreshInterval: 50,
    onComplete: function (value) {
      console.debug(this);
    },
  });
});
function setRingProgress(percent) {
  const offset = circumference - (percent / 100) * circumference;
  circle.style.strokeDashoffset = offset;
}
function fetchWeapons() {
  if (typeof CREATURES[creatureID].forceW == "object") {
    weapons = {};
    for (var i in CREATURES[creatureID].forceW) {
      var weaponID = CREATURES[creatureID].forceW[i];
      weapons[weaponID] = WEAPONS[weaponID];
      weapons[weaponID].id = weaponID;
      weapons[weaponID].type = weaponID;
      weapons[weaponID].userDamage =
        Settings.get("userDamage")[weaponID] > 0
          ? Settings.get("userDamage")[weaponID]
          : 100;
    }
  } else {
    weapons = {};
    for (var i in WEAPONS) {
      if (WEAPONS[i].disable !== true) {
        weapons[i] = WEAPONS[i];
        weapons[i].id = i;
        weapons[i].type = i;
        weapons[i].userDamage =
          Settings.get("userDamage")[i] > 0
            ? Settings.get("userDamage")[i]
            : 100;
      }
    }
  }
  calculateAllWeapons();
}
function updateWeapon(weaponID) {
  weapons[weaponID].data = calculateWeapon(weapons[weaponID]);
  var weaponEl = $('#ko [data-weapon="' + weaponID + '"]');
  if (weapons[weaponID].data.isRecommended) {
    $(weaponEl).removeClass("koNotRec");
  } else {
    $(weaponEl).addClass("koNotRec");
  }
  var i = 0;
  $(weaponEl)
    .find(".koHitbox")
    .each(function () {
      if (i == 0) {
        var data = weapons[weaponID].data;
      } else {
        var data = weapons[weaponID].data.hitboxes[i - 1];
      }
      if (data.isPossible) {
        $(this).find(".koHits").text(numberFormat(data.hits));
      } else {
        if (i == 0) {
          $(this).find(".koHits").text("Not possible");
        }
      }
      if (data.chanceOfDeathHigh) {
        $(this).find(".koCOD").addClass("koCODHigh");
      } else {
        $(this).find(".koCOD").removeClass("koCODHigh");
      }
      if (data.chanceOfDeath < 0.1) {
        $(this).find(".koCOD").addClass("koCODNone");
      } else {
        $(this).find(".koCOD").removeClass("koCODNone");
      }
      $(this)
        .find(".koCODval")
        .text(data.chanceOfDeath + "%");
      i++;
    });
}
function numberFormat(num) {
  return new Intl.NumberFormat().format(num);
}
function calculateAllWeapons() {
  for (var i in weapons) {
    weapons[i].data = calculateWeapon(weapons[i]);
  }
}
function calculateWeapon(weapon) {
  var level = Settings.get("level");
  var secGap = Settings.get("secGap");
  if (typeof weapon != "object") {
    return null;
  }
  var key = weapon.key;
  var creatureT = creature.t1 + creature.tI * (level - 1);
  if (typeof creature.ft == "number") {
    var creatureFleeThreshold = creature.ft;
  } else {
    var creatureFleeThreshold = 0.75;
  }
  var torporPerHit = WEAPONS[weapon.type].torpor;
  var weaponDuration = WEAPONS[weapon.type].duration || 0;
  if (creature.tDPS0) {
    var torporDeplPS =
      creature.tDPS0 +
      Math.pow(level - 1, 0.8493) / (22.39671632 / creature.tDPS0);
    if (secGap > weaponDuration) {
      var secsOfRegen = secGap - weaponDuration;
      torporPerHit = torporPerHit - secsOfRegen * torporDeplPS;
    }
    if (torporPerHit > 0) {
      var isPossible = true;
    } else {
      var isPossible = false;
    }
  } else {
    isPossible = true;
  }
  var knockOut = creatureT / torporPerHit;
  var totalMultipliers = 1;
  if (
    typeof WEAPONS[weapon.type].mult == "object" &&
    WEAPONS[weapon.type].mult != null &&
    typeof creature.mult == "object"
  ) {
    for (var i in WEAPONS[weapon.type].mult) {
      if (typeof creature.mult[WEAPONS[weapon.type].mult[i]] == "number") {
        knockOut /= creature.mult[WEAPONS[weapon.type].mult[i]];
        totalMultipliers *= creature.mult[WEAPONS[weapon.type].mult[i]];
      }
    }
  }
  if (WEAPONS[weapon.type].usesMeleeDamage == true) {
    knockOut = knockOut / (Settings.get("meleeMultiplier") / 100);
    totalMultipliers *= Settings.get("meleeMultiplier") / 100;
  }
  if (creature.xv && Settings.get("xv") == true) {
    knockOut = knockOut / 0.4;
    totalMultipliers *= 0.4;
  }
  knockOut = knockOut / Settings.get("playerDamageMultiplier");
  totalMultipliers *= Settings.get("playerDamageMultiplier");
  var numHitsRaw = knockOut / (weapon.userDamage / 100);
  var hitboxes = [];
  if (typeof creature.hitboxes !== "undefined") {
    for (var i in creature.hitboxes) {
      var hitboxHits = numHitsRaw / creature.hitboxes[i];
      if (creatureFleeThreshold == 1) {
        var hitsUntilFlee = "-";
      } else {
        var hitsUntilFlee = Math.max(
          1,
          Math.ceil(hitboxHits * creatureFleeThreshold)
        );
      }
      hitboxes.push({
        name: name,
        multiplier: creature.hitboxes[i],
        hitsRaw: hitboxHits,
        hitsUntilFlee: hitsUntilFlee,
        hits: Math.ceil(hitboxHits),
        chanceOfDeath: 0,
        isPossible: isPossible,
      });
    }
  }
  var bodyChanceOfDeath = 0;
  var minChanceOfDeath = 0;
  if (level < 2000 && isPossible) {
    if (
      typeof creature.bs == "object" &&
      typeof creature.bs.h == "object" &&
      typeof creature.bs.h.b == "number" &&
      typeof creature.bs.h.w == "number"
    ) {
      var baseHealth = creature.bs.h.b;
      var incPerLevel = creature.bs.h.w;
      if (
        typeof WEAPONS[weapon.type].damage != null &&
        typeof baseHealth != null &&
        typeof incPerLevel != null
      ) {
        var numStats = 7;
        var totalDamage =
          WEAPONS[weapon.type].damage *
          Math.ceil(numHitsRaw) *
          totalMultipliers *
          (weapon.userDamage / 100);
        if (totalDamage < baseHealth) {
          var propsurvival = 100;
        } else {
          var pointsNeeded = Math.max(
            Math.ceil((totalDamage - baseHealth) / incPerLevel),
            0
          );
          if (level - 1 < pointsNeeded) {
            var propsurvival = 0;
          } else {
            var propsurvival = calculatePropability(
              level - 1,
              numStats,
              pointsNeeded
            );
          }
        }
        var bodyChanceOfDeath = formatCOD(100 - propsurvival);
        var minChanceOfDeath = bodyChanceOfDeath;
        if (hitboxes.length > 0) {
          for (var i in hitboxes) {
            totalDamage =
              WEAPONS[weapon.type].damage *
              Math.ceil(hitboxes[i].hitsRaw) *
              totalMultipliers *
              (weapon.userDamage / 100) *
              hitboxes[i].multiplier;
            if (totalDamage < baseHealth) {
              var propsurvival = 100;
            } else {
              pointsNeeded = Math.max(
                Math.ceil((totalDamage - baseHealth) / incPerLevel),
                0
              );
              propsurvival = calculatePropability(
                level - 1,
                numStats,
                pointsNeeded
              );
            }
            var chanceOfDeath = formatCOD(100 - propsurvival);
            hitboxes[i].chanceOfDeath = chanceOfDeath;
            hitboxes[i].chanceOfDeathHigh = chanceOfDeath > 40;
            minChanceOfDeath = Math.min(minChanceOfDeath, chanceOfDeath);
          }
        }
      }
    }
  }
  var chanceOfDeathHigh = bodyChanceOfDeath > 40;
  if (creatureFleeThreshold == 1) {
    var hitsUntilFlee = "-";
  } else {
    var hitsUntilFlee = Math.max(
      1,
      Math.ceil(numHitsRaw * creatureFleeThreshold)
    );
  }
  return {
    hits: Math.ceil(numHitsRaw),
    hitsRaw: numHitsRaw,
    hitsUntilFlee: hitsUntilFlee,
    chanceOfDeath: bodyChanceOfDeath,
    chanceOfDeathHigh: chanceOfDeathHigh,
    minChanceOfDeath: minChanceOfDeath,
    isPossible: isPossible,
    isRecommended: isPossible && minChanceOfDeath < 90,
    minChanceOfDeath: 0,
    hitboxes: hitboxes,
  };
}
function initKO() {
  var r = '<h2 class="hborder">Knock Out</h2>';
  r += '<div class="scrollxw">';
  r +=
    '<div class="marginTopS marginBottomS koWeaponLead" style="position:absolute;left:0;"><div class="koWeaponHead"></div><div class="koHitbox"></div>';
  if (creature.hitboxes) {
    var ji = 0;
    for (var j in creature.hitboxes) {
      r += '<div class="koHitbox">';
      r += '<div class="lighter small koHitboxLabel">';
      r +=
        '<span class="white">' +
        j +
        "</span> " +
        creature.hitboxes[j] +
        "&times;";
      r += "</div>";
      r += "</div>";
      ji++;
    }
  }
  r += "</div>";
  r += '<div class="scrollx scrollvisibile" style="overflow-x:scroll">';
  r += '<div class="row ko marginBottom" style="min-width:600px;">';
  j = 0;
  for (var i in weapons) {
    var weapon = weapons[i];
    r +=
      '<div class="rowItemN center koWeapon" data-weapon="' + weapon.id + '">';
    r += '<div class="marginTopS marginBottomS">';
    r += '<div class="koWeaponHead">';
    r += '<div class="center">';
    if (weapon.img) {
      r +=
        '<img src="' +
        getImage(weapon.img) +
        '" width="50" height="50" alt="' +
        weapon.name +
        '" />';
    }
    r += "</div>";
    r += '<div class="marginTopS">';
    r +=
      '<div class="whiteinputh"><input class="koInput center" value="' +
      weapon.userDamage +
      '" keyboardtype="number-pad" maxlength="10" style="width:2.5em;" /></div>';
    r +=
      '<div class="knockLabelT" style="height:3em">' + weapon.name + "</div>";
    r += "</div>";
    r += "</div>";
    r += '<div class="koHitbox">';
    r += '<div class="koHits"></div>';
    r += '<div class="rowItem small koCOD">';
    r += '<div class="koCODval"></div>';
    r += "<div>Chance of Death</div>";
    r += "</div>";
    r += "</div>";
    if (creature.hitboxes) {
      var ji = 0;
      for (var j in creature.hitboxes) {
        r += '<div class="koHitbox">';
        r += '<div class="rowItem lighter small uppercase" style="height:1em">';
        if (j == 0) {
          r +=
            '<span class="white">' +
            ucfirst(key) +
            "</span> " +
            creature.hitboxes[j] +
            "&times;";
        }
        r += "</div>";
        r += '<div class="koHits"></div>';
        r += '<div class="rowItem small koCOD">';
        r += '<div class="koCODval"></div>';
        r += "<div>Chance of Death</div>";
        r += "</div>";
        r += "</div>";
        ji++;
      }
    }
    if (weapon.data.propsurvival < 99.9) {
      r += '<div class="rowItem small uppercase propSurvival">';
      opacity = round(100 - weapon.data.propsurvival, 2) / 100;
      r +=
        '<div class="warningBubble" style="margin:auto;background-color: rgba(184, 83, 80,' +
        max(opacity, 0.3) +
        ')">';
      r += round(100 - weapon.data.propsurvival, 2);
      r += "%</div>";
      if (!weapon.data.hasCODlabel) {
        r +=
          '<div class="warningBubbleText small light">CHANCE <br />OF DEATH</div>';
        weapon.data.hasCODlabel = true;
      }
      r += "</div>";
    }
    r += "</div>";
    r += "</div>";
    j++;
  }
  r += "</div>";
  r += "</div></div>";
  if (!creature.hitboxes) {
    r +=
      '<p class="light small center">The ' +
      creature.name +
      " does not have multipliers for headshots or any other areas.</p>";
  }
  r += `<div class="row marginTop small jcsb">
    <div class="left marginBottom">
      <input class="whiteinput center" id="secGap" value="${Settings.get(
        "secGap"
      )}" keyboardtype="number-pad" maxlength="4" style="width:2.5em;" type="number" min="1" max="100" /> <b>Seconds between hits</b>
      <div class="light marginTopS">Enter your expected gap between <br />your hits for increased accuracy.</div>
    </div>`;
  if (creature.xv) {
    r += `<div class="right">
      <div class="boolButtons" data-type="xv">
        <div class="boolButton active" data-xv="false">${creature.name}</div><div class="boolButton" data-xv="true">X-${creature.name}</div>
      </div>
      <div class="light marginTopS">X-creatures have a 40% resistance <br />to damage & torpor.</div>
    </div>`;
  }
  r += `</div>`;
  $("#ko").html(r);
  updateAllWeapons();
}
function updateAllWeapons() {
  for (var i in weapons) {
    updateWeapon(weapons[i].id);
  }
}
function formatCOD(cod) {
  if (cod < 1 || cod > 99) {
    return Math.round(cod * 10) / 10;
  } else {
    return Math.round(cod);
  }
}
function calculatePropability(n, numOptions, ll) {
  var ll, ul;
  var p = 1 / numOptions;
  if (!isNaN(n) && !isNaN(p)) {
    if (n > 0 && p > 0 && p < 1) {
      if (!isNaN(ll) && ll >= 0) {
        return calculatePropabilityMore(ll, n, p);
      }
    }
  }
}
function calculatePropabilityMore(ll, ul, p) {
  var n = ul;
  var numIntervals = n + 1;
  var probs = new Array(numIntervals);
  var maxProb = 0;
  for (var i = 0; i < numIntervals; i++) {
    probs[i] = b(p, n, i);
    maxProb = Math.max(maxProb, probs[i]);
  }
  var topProb = Math.ceil(100 * maxProb) / 100;
  var pCumulative = 0;
  for (var i = 0; i < numIntervals; i++) {
    if (i >= ll && i <= ul) {
      pCumulative += probs[i];
    }
  }
  pCumulative = Math.round(10000 * pCumulative) / 100;
  return pCumulative;
}
function nper(n, x) {
  var n1 = n + 1;
  var r = 1.0;
  var xx = Math.min(x, n - x);
  for (var i = 1; i < xx + 1; i++) {
    r = (r * (n1 - i)) / i;
  }
  return r;
}
function b(p, n, x) {
  var px = Math.pow(p, x) * Math.pow(1.0 - p, n - x);
  return nper(n, x) * px;
}
var lowbeep = new Audio("/media/audio/lowbeep.mp3");
var eat = new Audio("/media/audio/eat.mp3?3");
var dododeath = new Audio("/media/audio/dododeath.mp3");
var dodo = new Audio("/media/audio/dodo.mp3");
var rate,
  maxUnits,
  totalUnits,
  constantSeconds,
  totalSeconds,
  narcoticsUsed,
  narcoticsTorporQueue,
  narcoberriesUsed,
  narcoberriesTorporQueue,
  biotoxinsUsed,
  biotoxinsTorporQueue,
  ttRunning,
  alarm,
  alarmSecs,
  ttHasAlarmed,
  ascerbicUsed,
  ascerbicTorporQueue;
function torporTimerInit() {
  rate = taming.food[0].results.torporDeplPS;
  maxUnits = creature.bs.t.b + creature.bs.t.w * (Settings.get("level") - 1);
  maxUnits = parseFloat(maxUnits.toFixed(3));
  totalUnits = maxUnits;
  constantSeconds = totalUnits / rate;
  totalSeconds = constantSeconds;
  ascerbicUsed = 0;
  ascerbicTorporQueue = 0;
  biotoxinsUsed = 0;
  biotoxinsTorporQueue = 0;
  narcoticsUsed = 0;
  narcoticsTorporQueue = 0;
  narcoberriesUsed = 0;
  narcoberriesTorporQueue = 0;
  ttRunning = false;
  alarm = parseFloat($("#ttAlarm").val());
  alarmSecs = alarm * 60 + 1;
  ttHasAlarmed = false;
  if (creature.tDPS0 <= 0.3) {
    var trClass = "Low";
    var trClassNote =
      "This creature's torpor drops slowly, so you won't have to give it narcotics as frequently.";
    var trClassBGColor = "#B9EF85";
    var trClassColor = "#572";
    var trImgCSS = {
      filter:
        "invert(43%) sepia(12%) saturate(2454%) hue-rotate(42deg) brightness(69%) contrast(85%)",
    };
  } else if (creature.tDPS0 <= 0.7) {
    var trClass = "Medium";
    var trClassNote =
      "This creature's torpor drops a little bit faster than most creatures.";
    var trClassBGColor = "#FDED7D";
    var trClassColor = "rgba(0,0,0,.5)";
    var trImgCSS = { filter: "invert(100%) brightness(100%) opacity(0.5)" };
  } else if (creature.tDPS0 < 5) {
    var trClass = "High";
    var trClassNote =
      "This creature's torpor drops faster than most creatures. Be attentive and have narcotics ready so it doesn't wake up. When knocking out a high torpor rate creature, excess time gaps between shots (or misses) can cancel out some of the torpor inflicted, increasing the hits required.";
    var trClassBGColor = "#e3564d";
    var trClassColor = "#FFF";
  } else if (creature.tDPS0 >= 5) {
    var trClass = "Extremely High";
    var trClassNote =
      "This creature's torpor drops significantly faster than most creatures. Be attentive and have narcotics ready so it doesn't wake up. When knocking out a high torpor rate creature, excess time gaps between shots (or misses) can cancel out some of the torpor inflicted, increasing the hits required.";
    var trClassBGColor = "#e3564d";
    var trClassColor = "#FFF";
  }
  $("#trClass span").html(trClass);
  $("#trClass").css("color", trClassColor);
  $("#trClass").css("background-color", trClassBGColor);
  $("#trClassNote").text(trClassNote);
  if (trImgCSS) {
    $("#trClass img").css(trImgCSS);
  }
  $("#trClassNote").shorten({
    moreText: "(read more)",
    lessText: "(read less)",
    showChars: 70,
  });
  $("#ttRate").text(Math.round(rate * 100) / 100);
  $(".ttTimeRemaining").html(timeFormat(totalSeconds, true));
  $("#ttMaxUnits").text(maxUnits);
  $("#ttUnits").val(totalUnits);
  $("#ttUnits").on("change keyup paste", function () {
    totalUnits = parseFloat($("#ttUnits").val());
    if (totalUnits > maxUnits) {
      totalUnits = maxUnits;
    }
    if (totalUnits < 0) {
      totalUnits = 0;
    }
    totalSeconds = totalUnits / rate;
    renderUpdate();
  });
  $("#ttAlarm").on("change keyup paste", function () {
    var alarm = parseFloat($("#ttAlarm").val());
    var alarmSecs = alarm * 60 + 1;
  });
  $("#ttStart").click(function (event) {
    startTimer();
  });
  $("#useNarcotics").click(function (event) {
    useNarcotics("narcotics");
  });
  $("#useNarcoberries").click(function (event) {
    useNarcotics("narcoberries");
  });
  $("#useBiotoxins").click(function (event) {
    useNarcotics("biotoxins");
  });
  $("#useAscerbic").click(function (event) {
    useNarcotics("ascerbic");
  });
}
function decreaseTimer() {
  if (totalSeconds <= alarmSecs && !ttHasAlarmed) {
    ttHasAlarmed = true;
    $(".tt").addClass("alarming");
    dodo.play();
  } else if (totalSeconds > alarmSecs && ttHasAlarmed) {
    ttHasAlarmed = false;
    $(".tt").removeClass("alarming");
  }
  if (ascerbicTorporQueue > 0) {
    var torpIncPerSec = narcotics.ascerbic.torpor / narcotics.ascerbic.secs;
    var torpToInc = Math.min(torpIncPerSec, ascerbicTorporQueue);
    ascerbicTorporQueue = ascerbicTorporQueue - torpIncPerSec;
    totalUnits = totalUnits + torpToInc;
    totalSeconds = totalUnits / rate;
  } else if (biotoxinsTorporQueue > 0) {
    var torpIncPerSec = narcotics.bio.torpor / narcotics.bio.secs;
    var torpToInc = Math.min(torpIncPerSec, biotoxinsTorporQueue);
    biotoxinsTorporQueue = biotoxinsTorporQueue - torpIncPerSec;
    totalUnits = totalUnits + torpToInc;
    totalSeconds = totalUnits / rate;
  } else if (narcoticsTorporQueue > 0) {
    var torpIncPerSec = narcotics.narcotics.torpor / narcotics.narcotics.secs;
    var torpToInc = Math.min(torpIncPerSec, narcoticsTorporQueue);
    narcoticsTorporQueue = narcoticsTorporQueue - torpIncPerSec;
    totalUnits = totalUnits + torpToInc;
    totalSeconds = totalUnits / rate;
  } else if (narcoberriesTorporQueue > 0) {
    var torpIncPerSec =
      narcotics.narcoberries.torpor / narcotics.narcoberries.secs;
    var torpToInc = Math.min(torpIncPerSec, narcoberriesTorporQueue);
    narcoberriesTorporQueue = narcoberriesTorporQueue - torpIncPerSec;
    totalUnits = totalUnits + torpToInc;
    totalSeconds = totalUnits / rate;
  } else {
    totalSeconds = totalSeconds - 1;
    totalUnits = totalUnits - rate;
  }
  validateData();
  totalSeconds = totalUnits / rate;
  $("#ttUnits").val(totalUnits.toFixed(1));
  renderUpdate();
}
function renderUpdate() {
  miniBarPerc = (totalUnits / maxUnits) * 100;
  if (miniBarPerc > 100) {
    miniBarPerc = 100;
  }
  $("#torporTimer .miniBar").css("width", miniBarPerc + "%");
  $(".ttTimeRemaining").html(timeFormat(totalSeconds, true));
}
function validateData() {
  if (totalUnits > maxUnits) {
    totalUnits = maxUnits;
    ascerbicTorporQueue = 0;
    biotoxinsTorporQueue = 0;
    narcoticsTorporQueue = 0;
    narcoberriesTorporQueue = 0;
  }
  if (totalSeconds <= 1) {
    totalSeconds = 0;
    totalUnits = 0;
    stopTimer();
    dododeath.play();
  }
}
function useNarcotics(narcType) {
  var numNarcsToUse = 1;
  if (narcType == "narcotics") {
    narcoticsUsed = narcoticsUsed + numNarcsToUse;
    narcoticsTorporQueue =
      narcoticsTorporQueue + numNarcsToUse * narcotics.narcotics.torpor;
    $("#narcoticsUsed").html("<b>" + narcoticsUsed + "</b> used");
  } else if (narcType == "narcoberries") {
    narcoberriesUsed = narcoberriesUsed + numNarcsToUse;
    narcoberriesTorporQueue =
      narcoberriesTorporQueue + numNarcsToUse * narcotics.narcoberries.torpor;
    $("#narcoberriesUsed").html("<b>" + narcoberriesUsed + "</b> used");
  } else if (narcType == "biotoxins") {
    biotoxinsUsed = biotoxinsUsed + numNarcsToUse;
    biotoxinsTorporQueue =
      biotoxinsTorporQueue + numNarcsToUse * narcotics.bio.torpor;
    $("#biotoxinsUsed").html("<b>" + biotoxinsUsed + "</b> used");
  } else if (narcType == "ascerbic") {
    ascerbicUsed = ascerbicUsed + numNarcsToUse;
    ascerbicTorporQueue =
      ascerbicTorporQueue + numNarcsToUse * narcotics.ascerbic.torpor;
    $("#ascerbicUsed").html("<b>" + ascerbicUsed + "</b> used");
  }
  eat.play();
}
function startTimer() {
  lowbeep.play();
  if (!ttRunning) {
    totalUnits = parseFloat($("#ttUnits").val());
    ttRunning = true;
    interval = setInterval(decreaseTimer, 1000);
    $("#ttStart").html("Pause Timer");
  } else {
    ttRunning = false;
    stopTimer();
    $("#ttStart").html("Start Timer");
  }
}

function stopTimer() {
  clearInterval(interval);
}
function getURLHashVars() {
  var vars = {},
    hash;
  if (window.location.href.indexOf("#") > 0) {
    var hashes = window.location.href
      .slice(window.location.href.indexOf("#") + 1)
      .split("&");
    for (var i = 0; i < hashes.length; i++) {
      hash = hashes[i].split("=");
      vars[hash[0]] = hash[1];
    }
  }
  return vars;
}
function starveTimerInit() {
  console.log("starveTimerInit()");
  starveTimer = new StarveTimer(totalFood, creature);
  $(".starveTimer .maxFood").on("keyup change", function (e) {
    var newVal = $(e.target).val();
    if (isNaN(newVal)) {
    } else {
      starveTimer.updateMax(newVal);
    }
  });
  $(".starveTimer .currentFood").on("keyup change", function (e) {
    var newVal = $(e.target).val();
    if (isNaN(newVal)) {
    } else {
      starveTimer.updateCurrent(newVal);
    }
  });
  $(".starveTimer .alarm").on("keyup change", function (e) {
    var newVal = $(e.target).val();
    if (isNaN(newVal)) {
    } else {
      starveTimer.updateAlarm(newVal);
    }
  });
  $(".starveTimer .timerStart").click(function (e) {
    starveTimer.toggleTimer();
  });
  $(".starveNote").shorten({
    moreText: "(read more)",
    lessText: "(read less)",
    showChars: 61,
  });
}
function StarveTimer(totalFood, creature) {
  var suggestedFood = creature.getEstimatedStat("f", Settings.get("level"));
  if (typeof suggestedFood != "number") {
    suggestedFood = 500;
  }
  this.maxFood = suggestedFood;
  this.currentFood = suggestedFood;
  this.currentFoodTotal = totalFood;
  this.creature = creature;
  this.totalFood = totalFood;
  this.alarm = 5;
  this.hasAlarmed = false;
  this.timerOn = false;
  this.collapsed = true;
  this.foodRate = this.creature.foodBase * this.creature.foodMult;
  timer = null;
  this.updateEstimatedFood = function () {
    var suggestedFood = creature.getEstimatedStat("f", Settings.get("level"));
    if (typeof suggestedFood != "number") {
      suggestedFood = 500;
    }
    this.maxFood = suggestedFood;
    this.currentFood = suggestedFood;
  };
  this.starveSecsLeft = function () {
    var timedfoodamount = Math.min(this.totalFood, this.maxFood);
    var starveSecsLeft =
      (timedfoodamount - (this.maxFood - this.currentFood)) /
      this.foodRate /
      Settings.get("consumptionMultiplier");
    return Math.max(starveSecsLeft, 0);
  };
  this.tameSecsLeft = function () {
    var tameSecsLeft =
      (this.totalFood - (this.maxFood - this.currentFood)) /
      this.foodRate /
      Settings.get("consumptionMultiplier");
    return Math.max(tameSecsLeft, 0);
  };
  this.starveTimerPercent = function () {
    var starveTimerPercent =
      Math.round((this.maxFood / this.totalFood) * 1000) / 10;
    if (isNaN(starveTimerPercent) || starveTimerPercent > 100) {
      starveTimerPercent = 100;
    }
    return starveTimerPercent;
  };
  this.tameTimerPercent = function () {
    var tameTimerPercent =
      Math.round((this.currentFoodTotal / this.totalFood) * 1000) / 10;
    if (isNaN(tameTimerPercent)) {
      tameTimerPercent = 100;
    }
    return Math.max(Math.min(tameTimerPercent, 100), 0);
  };
  this.toggleTimer = function () {
    if (this.timerOn == false) {
      lowbeep.play((success) => {});
      this.activateTimer(true);
    } else {
      this.activateTimer(false);
    }
  };
  (this.activateTimer = function (turnOn = true) {
    if (turnOn == true) {
      var secsLeft = Math.round(parseInt(this.tameSecsLeft));
      var currentTime = Math.round(Date.now() / 1000);
      var finishTime = currentTime + secsLeft;
      this.finishTime = finishTime;
      var checkFood = parseInt(this.currentFood);
      if (isNaN(checkFood)) {
        this.currentFood = 0;
      }
      checkFood = parseInt(this.maxFood);
      if (isNaN(checkFood)) {
        this.maxFood = 0;
      }
      if (this.currentFood > this.maxFood) {
        this.currentFood = this.maxFood;
      }
      if (this.currentFoodTotal > this.totalFood) {
        this.currentFoodTotal = this.totalFood;
      }
      this.timerOn = true;
      lowbeep.play();
      this.runTimer();
    } else {
      this.timerOn = false;
      this.alarming = false;
      this.hasAlarmed = false;
      clearInterval(this.timer);
      this.timer = null;
      this.update();
    }
    if (this.timerOn) {
      $(".starveTimer .timerStart").html("Pause Timer");
    } else {
      $(".starveTimer .timerStart").html("Start Timer");
    }
  }),
    (this.depleteTimer = function (firstPass = false) {
      console.log("depleteTimer()");
      var newFood =
        this.currentFood -
        this.foodRate * Settings.get("consumptionMultiplier");
      var newFoodTotal =
        this.currentFoodTotal -
        this.foodRate * Settings.get("consumptionMultiplier");
      if (Math.round(newFoodTotal) <= 0) {
        newFood = 0;
        newFoodTotal = 0;
        this.currentFood = newFood;
        this.currentFoodTotal = newFoodTotal;
        this.playAlarm("dododeath");
        this.activateTimer(false);
      } else {
        this.currentFood = newFood;
        this.currentFoodTotal = newFoodTotal;
        var secsLeft = Math.round(parseInt(this.starveSecsLeft()));
        if (secsLeft <= parseInt(this.alarm) * 60) {
          this.alarming = true;
          if (this.hasAlarmed == false) {
            this.hasAlarmed = true;
            if (!firstPass) {
              dodo.play();
            }
          }
        } else {
          this.alarming = false;
        }
      }
      this.update();
    }),
    (this.runTimer = function () {
      if (this.timer == null) {
        this.timer = setInterval(() => {
          this.depleteTimer();
        }, 1000);
        this.depleteTimer(true);
      }
    }),
    (this.updateAlarm = function (value) {
      var newVal = parseInt(value);
      if (isNaN(newVal)) {
        newVal = 0;
      }
      this.alarm = newVal;
      this.update();
    }),
    (this.updateTotalFood = function (value) {
      var newVal = parseFloat(value);
      if (isNaN(newVal)) {
        newVal = 0;
      }
      this.totalFood = newVal;
      this.currentFoodTotal =
        this.totalFood - (this.maxFood - this.currentFood);
      this.update();
    }),
    (this.updateMax = function (value) {
      var newVal = parseFloat(value);
      if (!isNumericAndNotZero(newVal) || isPartialFloat(value)) {
        return;
      }
      this.maxFood = newVal;
      this.currentFoodTotal =
        this.totalFood - (this.maxFood - this.currentFood);
      if (this.timerOn == true) {
        this.activateTimer(false);
      }
      this.update();
    });
  this.updateCurrent = function (value) {
    var newVal = parseFloat(value);
    if (isNaN(newVal) || isPartialFloat(value)) {
      return;
    } else {
      if (newVal > this.maxFood) {
        newVal = this.maxFood;
      }
      this.currentFoodTotal = this.totalFood - (this.maxFood - newVal);
    }
    this.currentFood = newVal;
    if (this.timerOn == true) {
      this.activateTimer(false);
    }
    this.update();
  };
  this.update = function () {
    var currentFoodTotal = Math.max(
      0,
      Math.round(this.currentFoodTotal * 10) / 10
    );
    $(".starveTimer .currentFood").val(Math.round(this.currentFood * 10) / 10);
    $(".starveTimer .maxFood").val(this.maxFood);
    $(".starveTimer .meterStatus").text(currentFoodTotal);
    $(".starveTimer .maxUnits").text(Math.round(this.totalFood * 10) / 10);
    $(".starveTimer .tameSecsLeft").text(timeFormat(this.tameSecsLeft()));
    $(".starveTimer .starveSecsLeft").text(timeFormat(this.starveSecsLeft()));
    if (this.maxFood <= this.totalFood) {
      $(".starveTimer").addClass("hasStarveMeter");
    } else {
      $(".starveTimer").removeClass("hasStarveMeter");
    }
    if (this.hasAlarmed) {
      $(".starveTimer").addClass("alarming");
    } else {
      $(".starveTimer").removeClass("alarming");
    }
    $(".starveTimer .miniBar, .starveTimer .meterStatus").css(
      "width",
      this.tameTimerPercent() + "%"
    );
    var starveTimerPercent = this.starveTimerPercent();
    if (starveTimerPercent > 50) {
      $(".starveTimer .starveMeter").css("width", starveTimerPercent + "%");
      $(".starveTimer .starveMeter").addClass("starveMeterRight");
    } else {
      $(".starveTimer .starveMeter").css(
        "width",
        100 - starveTimerPercent + "%"
      );
      $(".starveTimer .starveMeter").removeClass("starveMeterRight");
    }
  };
}

// Create map insert
let m = d.map((x) => {
  // return `INSERT INTO public."Map" ("name","loot_crates","oil_veins","water_veins","wyvern_nests","ice_wyvern_nests","gas_veins","deinonychus_nests","charge_nodes","plant_z_nodes","drake_nests","glitches","magmasaur_nests","poison_trees","mutagen_bulbs","carniflora") VALUES
  return `UPDATE public."Map" SET "img" = '${x.image}' WHERE "name" = '${x.name}';`;
  // return `UPDATE public."Map" SET "loot_crates" = ${x.lootCrates ? `'${JSON.stringify(x.lootCrates.map((l) => l.crateLocations))}'` : null}, "oil_veins" = ${x.oilVeins ? `'${JSON.stringify(x.oilVeins)}'` : null}, "water_veins" = ${x.waterVeins ? `'${JSON.stringify(x.waterVeins)}'` : null}, "wyvern_nests" = ${x.wyvernNests ? `'${JSON.stringify(x.wyvernNests)}'` : null},
  // "ice_wyvern_nests" = ${x.iceWyvernNests ? `'${JSON.stringify(x.iceWyvernNests)}'` : null}, "gas_veins" = ${x.gasVeins ? `'${JSON.stringify(x.gasVeins)}'` : null}, "deinonychus_nests" = ${x.deinonychusNests ? `'${JSON.stringify(x.deinonychusNests)}'` : null}, "charge_nodes" = ${x.chargeNodes ? `'${JSON.stringify(x.chargeNodes)}'` : null},
  // "plant_z_nodes" = ${x.plantZNodes ? `'${JSON.stringify(x.plantZNodes)}'` : null}, "drake_nests" = ${x.drakeNests ? `'${JSON.stringify(x.drakeNests)}'` : null}, "glitches" = ${x.glitches ? `'${JSON.stringify(x.glitches)}'` : null}, "magmasaur_nests" = ${x.magmasaurNests ? `'${JSON.stringify(x.magmasaurNests)}'` : null},
  // "poison_trees" = ${x.poisonTrees ? `'${JSON.stringify(x.poisonTrees)}'` : null}, "mutagen_bulbs" = ${x.mutagenBulbs ? `'${JSON.stringify(x.mutagenBulbs)}'` : null}, "carniflora" = ${x.carniflora ? `'${JSON.stringify(x.carniflora)}'` : null}, "notes" = ${x.notes ? `'${JSON.stringify(x.notes)}'` : null} WHERE "name" = '${x.name}';`
});
console.log(m.join("\n"));
// require("fs").writeFile(
//   "insert.txt",
//   m.join('\n'),
//   (error) => {
//     if (error) {
//       throw error;
//     }
//   }
// );
