const items = require("./itemtest.json");
// const { items: newItm } = require("./web/public/test.json");
console.log(items.length);

// let ittms = [];
// console.log(newItm.length);
// let lastItemId = 807;
// newItm.forEach((item) => {
//   if ("name" in item) {
//     const found = items.find(
//       (itm) => itm.name.toLowerCase().trim() === item.name.toLowerCase().trim()
//     );
//     let obj = {
//       itemId: null,
//       name: null,
//       description: null,
//       color: null,
//       image: null,
//       maxStack: null,
//       weight: null,
//       engramPoints: null,
//       craftedIn: null,
//       craftingTime: null,
//       requiredLevel: null,
//       yields: null,
//       recipe: null,
//       effects: null,
//       stats: null,
//     };
//     if (found) {
//       if (!("weight" in found)) {
//         obj.weight = item.weight;
//       }
//       if (!("description" in found)) {
//         obj.description = item.description;
//       }
//       if (!("maxStack" in found)) {
//         obj.maxStack = item.stackSize;
//       }
//       if (
//         !("craftingTime" in found) &&
//         "crafting" in item &&
//         "time" in item.crafting
//       ) {
//         obj.craftingTime = item.crafting.time;
//       }
//       if (
//         "durability" in item &&
//         "stats" in found &&
//         !found.stats.some((stat) => stat.id === 5)
//       ) {
//         obj.stats =
//           obj.stats != null
//             ? [
//                 ...obj.stats,
//                 {
//                   id: 5,
//                   value: item.durability,
//                 },
//               ]
//             : [
//                 {
//                   id: 5,
//                   value: item.durability,
//                 },
//               ];
//       }
//       if (
//         "crafting" in item &&
//         !("requiredLevel" in found) &&
//         "levelReq" in item.crafting
//       ) {
//         obj.requiredLevel = item.crafting.levelReq;
//       }
//       if ("crafting" in item && "productCount" in item.crafting) {
//         obj.yields = item.crafting.productCount;
//       }
//       if (
//         "spoilsIn" in item &&
//         "stats" in found &&
//         !found.stats.some((stat) => stat.id === 9)
//       ) {
//         obj.stats =
//           obj.stats != null
//             ? [
//                 ...obj.stats,
//                 {
//                   id: 9,
//                   value: item.spoilsIn,
//                 },
//               ]
//             : [
//                 {
//                   id: 9,
//                   value: item.spoilsIn,
//                 },
//               ];
//       }

//       if ("statEffects" in item && item.statEffects.length > 0) {
//         obj.stats =
//           obj.stats != null
//             ? [
//                 ...obj.stats,
//                 ...item.statEffects.map((stat) => {
//                   let d = {};
//                   if (stat.stat === "food") d.id = 8;
//                   if (stat.stat === "health") d.id = 7;
//                   if (stat.stat === "stamina") d.id = 12;
//                   if (stat.stat === "torpidity") d.id = 10;
//                   if (stat.stat === "water") d.id = 11;
//                   d.value = stat.value;
//                   if ("duration" in stat) {
//                     d.duration = stat.duration;
//                   }
//                   return d;
//                 }),
//               ]
//             : [
//                 ...item.statEffects.map((stat) => {
//                   let d = {};
//                   if (stat.stat === "food") d.id = 8;
//                   if (stat.stat === "health") d.id = 7;
//                   if (stat.stat === "stamina") d.id = 12;
//                   if (stat.stat === "torpidity") d.id = 10;
//                   if (stat.stat === "water") d.id = 11;
//                   d.value = stat.value;
//                   if ("duration" in stat) {
//                     d.duration = stat.duration;
//                   }
//                   return d;
//                 }),
//               ];
//       }
//     } else if (
//       "type" in item &&
//       item.type !== "Skin" &&
//       !item.name.includes("Chibi") &&
//       !item.name.includes("Skin") &&
//       !item.name.includes("Costume") &&
//       !item.name.includes("Emote") &&
//       !item.name.includes("Rockwell") &&
//       !item.name.startsWith("Kibble") &&
//       !item.name.includes("Hair Style") &&
//       "folders" in item &&
//       item.folders[0] !== "Holiday"
//     ) {
//       obj.name = item.name.trim();
//       obj.itemId = lastItemId++;
//       obj.weight = item.weight;
//       obj.description = item.description;
//       obj.maxStack = item.stackSize;

//       if ("crafting" in item && "time" in item.crafting) {
//         obj.craftingTime = item.crafting.time;
//       }
//       if ("durability" in item) {
//         obj.stats =
//           obj.stats != null
//             ? [
//                 ...obj.stats,
//                 {
//                   id: 5,
//                   value: item.durability,
//                 },
//               ]
//             : [
//                 {
//                   id: 5,
//                   value: item.durability,
//                 },
//               ];
//       }
//       if ("crafting" in item && "levelReq" in item.crafting) {
//         obj.requiredLevel = item.crafting.levelReq;
//       }
//       if ("crafting" in item && "productCount" in item.crafting) {
//         obj.yields = item.crafting.productCount;
//       }
//       if ("spoilsIn" in item) {
//         obj.stats =
//           obj.stats != null
//             ? [
//                 ...obj.stats,
//                 {
//                   id: 9,
//                   value: item.spoilsIn,
//                 },
//               ]
//             : [
//                 {
//                   id: 9,
//                   value: item.spoilsIn,
//                 },
//               ];
//       }

//       if ("statEffects" in item && item.statEffects.length > 0) {
//         obj.stats =
//           obj.stats != null
//             ? [
//                 ...obj.stats,
//                 ...item.statEffects.map((stat) => {
//                   let d = {};
//                   if (stat.stat === "food") d.id = 8;
//                   if (stat.stat === "health") d.id = 7;
//                   if (stat.stat === "stamina") d.id = 12;
//                   if (stat.stat === "torpidity") d.id = 10;
//                   if (stat.stat === "water") d.id = 11;
//                   d.value = stat.value;
//                   if ("duration" in stat) {
//                     d.duration = stat.duration;
//                   }
//                   return d;
//                 }),
//               ]
//             : [
//                 ...item.statEffects.map((stat) => {
//                   let d = {};
//                   if (stat.stat === "food") d.id = 8;
//                   if (stat.stat === "health") d.id = 7;
//                   if (stat.stat === "stamina") d.id = 12;
//                   if (stat.stat === "torpidity") d.id = 10;
//                   if (stat.stat === "water") d.id = 11;
//                   d.value = stat.value;
//                   if ("duration" in stat) {
//                     d.duration = stat.duration;
//                   }
//                   return d;
//                 }),
//               ];
//       }
//       if ("crafting" in item && "recipe" in item.crafting) {
//         obj.recipe = item.crafting.recipe.map((r) => {
//           let d = {};
//           let itemId = items.find(
//             (f) =>
//               f.name.split(" ").join("").toLowerCase() ===
//               r.type
//                 .split(" ")
//                 .join("")
//                 .toLowerCase()
//                 .replace("fibers", "fiber")
//                 .replace("chitinpaste", "chitin")
//                 .replace("chitinorkeratin", "chitin/keratin")
//           );

//           d.itemId = itemId?.itemId ? itemId.itemId : r.type;
//           d.count = r.qty;
//           return d;
//         });
//       }
//     }
//     Object.assign(obj, found);
//     let o = Object.fromEntries(
//       Object.entries(obj).filter(([_, v]) => v != null)
//     );

//     if (Object.keys(o).length > 0) ittms.push(o);
//   }
// });
// ittms = ittms.sort((a, b) => (a.itemId > b.itemId ? 1 : -1));

const seen = new Set();

const filteredArr = items.filter((el) => {
  const duplicate = seen.has(el.itemId);
  seen.add(el.itemId);
  return !duplicate;
});
console.log(filteredArr.length);
require("fs").writeFile(
  "itemtest.json",
  JSON.stringify(filteredArr),
  (error) => {
    if (error) {
      throw error;
    }
  }
);
