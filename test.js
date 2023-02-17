const { items } = require("./web/public/arkitems.json");
const d = require("./web/public/maps.json");
const d2 = require("./web/public/dinotest.json");




// let d = ["aaaa", "bbbbbbbbb", "Hello", "bruh", "aaaa"];
console.time("normal");

console.timeEnd("normal");

console.time("optimized");

let maps = d.map((map) => {
  return {
    name: map.name,
    image: map.image,
    lootCrates: map.lootCrates.map((crate) => {
      return {
        maxCrateNumber: crate.maxCrateNumber,
        crateClasses: crate.crateClasses,
        crateLocations: crate.crateLocations.map((location) => {
          return {
            lat: location.lat,
            lon: location.long,
          };
        })
      }
    })
  }
});

require("fs").writeFile(
  "./web/public/maps.json",
  JSON.stringify(maps),
  (error) => {
    if (error) {
      throw error;
    }
  }
);
console.timeEnd("optimized");

// `INSERT INTO public."Dino" (name, exp_per_kill, attack, disable_tame, disable_ko, disable_food, flyer_dino, ridable, mounted_weaponry)
//     SELECT '${dd.name}', ${dd.death && dd.death.baseXP ? dd.death.baseXP : 0}, '${JSON.stringify(dd.attack.attacks)}'::jsonb, ${!dd.flags.includes("isTamable")}, ${!dd.flags.includes("canBeTorpid")}, true, ${dd.flags.includes("isFlyerDino")}, ${dd.flags.includes('allowRiding')}, ${dd.flags.includes('allowMountedWeaponry')}
//     WHERE NOT EXISTS (
//       SELECT name require(public."Dino" WHERE name LIKE '%${dd.name}%'
//     );`
// let itemss = [];
// Object.values(d).forEach((dino, i) => {
//   const { name } = dino;
//   let level = 100;

//   // ta, r
//   let v = ["t", "w", "a", "s", "m", "tk"];
//   let fits = ["d", "dd", "dg", "bdg", "hf", "ltd", "ghf"];
//   let imm = ["cb", "b", "bt", "n", "py", "l", "lbt"];
//   let flyers = ["h", "tu", "kr", "me", "p"];
//   itemss.push({
//     id: i + 1,
//     name : dino.name,
//     nameTranslations: dino.name_t ? dino.name_t : null,
//     synonyms: dino.sy ? dino.sy : null,
//     bps: dino.bps ? dino.bps : null,
//     description: dino.desc ? dino.desc : null,
//     tamingNotice: dino.tamingNotice ? dino.tamingNotice : null,
//     adminNote: dino.adminNote ? dino.adminNote : null,
//     note: dino.note ? dino.note : null,
//     affinityNeeded: dino.a0 ? dino.a0 : null,
//     affinityIncreasePerLevel: dino.aI ? dino.aI : null,
//     fleeThreshold: dino.ft ? dino.ft : null,
//     basePoints: dino.bp ? dino.bp : null,
//     maturationTime: dino.bm ? dino.bm : null,
//     incubationTime: dino.be ? dino.be : null,
//     method: dino.m ? dino.m : null,
//     eats: dino.eats ? dino.eats : null,
//     torporDepletionPS: dino.tDPS0 ? dino.tDPS0 : null,
//     experiencePerKill: dino.xpk ? dino.xpk : null,
//     hitboxes: dino.hitboxes ? dino.hitboxes : null,
//     knockoutW: dino.forceW ? dino.forceW : null,
//     nonViolentFoodAffinityMultiplier: dino.nvfam ? dino.nvfam : null,
//     nonViolentFoodRateMultiplier: dino.nvfrm ? dino.nvfrm : null,
//     tamingInterval: dino.tI ? dino.tI : null,
//     baseTamingTime: dino.t1 ? dino.t1 : null,
//     tamingBonusAttribute: dino.tiba ? dino.tiba : null,
//     canDestroy: dino.af ? dino.af.filter((t) => v.includes(t)) : null,
//     canBeCarriedBy: dino.carry ? dino.carry : null,
//     egg: dino.egg ? dino.egg : null,
//     method: dino.method ? dino.method : null,
//     fitsThrough: dino.af ? dino.af
//       .filter((t) => fits.includes(t))
//       .map((t) => {
//         switch (t) {
//           case "d":
//             return "doorframe";
//           case "dd":
//             return "double doorframe";
//           case "dg":
//             return "dinosaur gateway";
//           case "bdg":
//             return "behemoth dinosaur gateway";
//           case "hf":
//             return "hatchframe";
//           case "ltd":
//             return "large trapdoor";
//           case "ghf":
//             return "giant hatchframe";
//           default:
//             return t;
//         }
//       }) : null,
//     immobilizedBy: dino.af ? dino.af
//       .filter((t) => imm.includes(t))
//       .map((t) => {
//         switch (t) {
//           case "b":
//             return "bola";
//           case "bt":
//             return "bear trap";
//           case "n":
//             return "net projectile";
//           case "py":
//             return "plant species y";
//           case "lbt":
//             return "large bear trap";
//           case "l":
//             return "lasso";
//           case "cb":
//             return "chain bola";
//           default:
//             return t;
//         }
//       }) : null,
//     allowableFlyers: dino.af ? dino.af
//       .filter((t) => !v.includes(t) && !fits.includes(t) && !imm.includes(t))
//       .map((t) => {
//         switch (t) {
//           case "h":
//             return "human";
//           case "tu":
//             return "tusoteuthis";
//           case "kr":
//             return "karkinos";
//           case "p":
//             return "procoptodon";
//           case "me":
//             return "megalosaurus";
//           default:
//             return t;
//         }
//       }) : null,
//     gatherEfficiency: dino.ge ? dino.ge : null,
//     baseStats: dino.bs ? dino.bs : null,
//     capabilities: dino.c ? dino.c : null,
//     drops: dino.d ? dino.d.map((t) => {
//       if (t === 13) {
//         t = 12
//       }
//       if (t === 11) {
//         t = 10
//       }
//       return t
//     }) : null,
//     weightReduction: dino.wr ? dino.wr : null,
//     eggTempMin: dino.itl ? dino.itl : null,
//     eggTempMax: dino.ith ? dino.ith : null,
//     experiencePerKillAdjustment: dino.xpka ? dino.xpka : null,
//     xVariant: dino.xv ? true : false,
//     noWaterMovement: dino.noWM ? true : false,
//     disableFood: dino.dFood ? true : false,
//     disableKO: dino.disableKO ? true : false,
//     disableTame: dino.disableTame ? true : false,
//     disableMultiplier: dino.disableMult ? true : false,
//     violentTame: dino.nonViolentTame ? false : true,
//     foodConsumptionBase: dino.foodBase ? dino.foodBase : null,
//     foodConsumptionMult: dino.foodMult ? dino.foodMult : null,
//   });

  //let experiencePerKill = dino.xpk * ((level - 1) / 10 + 1) * 4 * XPMultiplier


  // parseInt(((this.metalperforge + 2) / 2 / 20) * 20 * 20 - 20) / fuelConsumptionRate
  // this.metalperforge = Math.floor(this.metalamount / this.forgeamount);

  // let comsumptionMultiplier = 1;
  // let affinityNeeded = item.a0 + item.aI * level;
  // let foodConsumption = item.foodBase * item.foodMult * comsumptionMultiplier;
  // let foodMax = affinityNeeded / food[name].affinity;
  // var totalTorpor=cr.t1+cr.tI*(level-1);
  // var affinityNeeded=cr.a0+(cr.aI*level)
  // let torporDamagePerSecond = Math.pow(level - 1, 0.800403041) / (22.39671632 / dino.tDPS0)

  /*The repair cost is calculated by taking the percentage of
  lost durability and multiplying it with the half of
  the initial building costs (Scales with increased costs
  caused by Item Quality).
  The repair costs are always rounded up.*/
//   let craftingCostMetalIngot = 100;
//   let lostDurability = 900;
//   let durability = 1300;
//   let itemRepairCost =
//     (100 - Math.round((lostDurability / durability) * 100)) *
//     (craftingCostMetalIngot / 2);
// });
// let sql = "INSERT INTO public.Dino (name, synonyms, description, tamingNotice, canDestroy, immobilizedBy, baseStats, gatherEfficiency, expPerKill, fitsThrough, eggTempMin, eggTempMax, tdps, eats, maturationTime, weightReduction)"

// let t = itemss.map((g) => {
//   return `'${g.name}', ARRAY[${g.synonyms ? g.synonyms.join(",") : ''}], '${g.description}', '${g.tamingNotice}', ARRAY[${g.canDestroy.join(', ')}]
//   `
// })
// const removeNullUndefined = obj => Object.entries(obj).reduce((a, [k, v]) => (v == null ? a : (a[k] = v, a)), {});
// let i = itemss.map((f) => removeNullUndefined(f))
// require("fs").writeFile(
//   "dinotest.json",
//   JSON.stringify(i),
//   (error) => {
//     if (error) {
//       throw error;
//     }
//   }
// );


// let abc2 = d.items.filter((f) => (f.name && f.name.includes("Summon") && !f.name.includes('VR'))).map((b) => {
//     return `INSERT INTO public."Item" (id, name, description, image, max_stack, weight, req_level, recipe) VALUES
//     (${id++}, '${b.name}', '${b.description ? b.description : ""}', '${b.name ? b.name.split(' ').join('_') + ".png" : ""}', ${b.stackSize ? b.stackSize : 1}, ${b.weight ? b.weight : 0}, ${b.crafting && b.crafting.levelReq ? b.crafting.levelReq : 0}, ${
//       b.crafting && b.crafting.recipe.length > 0
//         ? `'[${b.crafting.recipe
//             .map((f) => `${JSON.stringify({ itemId: f.type, count: f.qty })}`)
//             .join()
//             .split(", ")}]'`
//         : null
//     });`
// })


// require("fs").writeFile(
//   "s.txt",
//   bosses.join('\n'),
//   (error) => {
//     if (error) {
//       throw error;
//     }
//   }
// );

// https://www.dododex.com/api/data.json
// https://github.com/arkutils/Purlovia
// https://arkids.net/items
// https://www.dododex.com/capabilities/affected-by

// tamed level = wild level + (50%wild level/taming efficiency) - 1
let craftingStations = {
  smithy: 126,
  fabricator: 185,
  compostBin: 127,
  cookingPot: 128,
  industrialCooker: 601,
  industrialGrill: 360,
  refiningForge: 125,
  tekReplicator: 652,
  beerBarrel: 606,
  chemBench: 607,
  industrialGrinder: 601,
};

// function calcXP(theXpk, level, night = false) {
//   return parsePercision(theXpk * ((level - 1) / 10 + 1) * 4 * XPMultiplier);
// }
// function Creature(creatureID) {
//   Object.assign(this, CREATURES[creatureID]);
//   if (
//     this.disableTame == 1 ||
//     typeof this.a0 == "undefined" ||
//     typeof this.eats == "undefined"
//   ) {
//     this.isTamable = false;
//   } else {
//     this.isTamable = true;
//   }
//   if (
//     this.disableKO != "1" &&
//     WEAPONS != null &&
//     typeof this.t1 != "undefined" &&
//     typeof this.tI != "undefined"
//   ) {
//     this.isKOable = true;
//   } else {
//     this.isKOable = false;
//   }
//   if (typeof this.forceW == "object") {
//     this.isKOable = true;
//   }
//   if (
//     typeof this.bm !== "undefined" &&
//     (typeof this.be !== "undefined" || typeof this.bp !== "undefined")
//   ) {
//     this.isBreedable = true;
//   }

//   // X Creatues gain 88 levels after taming, while others gain 73
//   if (typeof this.c == "object" && this.c.indexOf(40) >= 0) {
//     this.maxLevelsAfterTame = 88;
//   } else {
//     this.maxLevelsAfterTame = 73;
//   }
//   this.getAttr = function (attr) {
//     var r = false;
//     if (typeof this.af == "object") {
//       r = this.af.indexOf(attr) >= 0;
//     }
//     if (r != true && typeof this.carry == "object") {
//       r = this.carry.indexOf(attr) >= 0;
//     }
//     return r;
//   };
//   this.hasStats = function () {
//     return typeof this.bs == "object";
//   };
//   this.getNumStats = function () {
//     if (this.hasStats()) {
//       return Object.keys(this.stats.bs);
//     } else {
//       return 0;
//     }
//   };
//   this.getStat = function (statKey) {
//     if (this.hasStats() && typeof this.bs[statKey] == "object") {
//       return this.bs[statKey];
//     } else {
//       return null;
//     }
//   };
//   this.getNumEligibleStats = function () {
//     var theStat = this.getStat("o");
//     if (typeof theStat == "object" && theStat.b == null) {
//       return 5;
//     } else {
//       return 6;
//     }
//   };
//   this.getEstimatedStat = function (statKey, level) {
//     if (this.hasStats()) {
//       var baseStat = this.getStat(statKey);
//       if (baseStat) {
//         if (baseStat.b >= 0 && baseStat.w > 0) {
//           var numEligibleStats = this.getNumEligibleStats();
//           if (level > 0) {
//             var numLevels = level - 1;
//           } else {
//             var numLevels = 1;
//           }
//           var estFoodLevels = Math.round(numLevels / numEligibleStats);
//           return baseStat.b + baseStat.w * estFoodLevels;
//         } else if (typeof baseStat.b == "number") {
//           return baseStat.b;
//         }
//       }
//     } else {
//       return null;
//     }
//   };
// }
// var Settings = {
//   defaults: {
//     level: 150,
//     tamingMultiplier: 1.0,
//     consumptionMultiplier: 1.0,
//     meleeMultiplier: 100,
//     matingIntervalMultiplier: 1.0,
//     eggHatchSpeedMultiplier: 1.0,
//     babyMatureSpeedMultiplier: 1.0,
//     playerDamageMultiplier: 1.0,
//     XPMultiplier: 1.0,
//     usps: false,
//     sanguineElixir: false,
//     secGap: 5,
//     userDamage: {},
//     timers: {},
//   },
//   settings: {},
//   init: function () {
//     this.settings = this.defaults;
//     for (var i = 0; i < localStorage.length; i++) {
//       var theKey = localStorage.key(i);
//       var theValue = localStorage.getItem(theKey);
//       if (
//         theKey == "userDamage" ||
//         theKey == "timers" ||
//         theKey == "usps" ||
//         theKey == "sanguineElixir"
//       ) {
//         try {
//           theValue = JSON.parse(theValue);
//         } catch {}
//       }
//       this.settings[theKey] = theValue;
//     }
//   },
//   get: function (key) {
//     if (key == "level") {
//       return parseInt(this.settings[key]);
//     } else {
//       return this.settings[key];
//     }
//   },
//   set: function (key, value) {
//     this.settings[key] = value;
//     if (typeof value == "object") {
//       value = JSON.stringify(this.settings[key]);
//     }
//     localStorage.setItem(key, value);
//   },
//   setObject: function (objectKey, key, value) {
//     if (typeof this.settings[objectKey] == "undefined") {
//       this.settings[objectKey] = {};
//     }
//     this.settings[objectKey][key] = value;
//     localStorage.setItem(objectKey, JSON.stringify(this.settings[objectKey]));
//   },
// };
// Settings.init();
// var starveTimer, totalFood;
// function initTamingApp() {
//   var hashVars = getURLHashVars();
//   if (hashVars.level) {
//     var parsedLevel = parseInt(hashVars.level);
//     if (parsedLevel > 0) {
//       Settings.set("level", parsedLevel);
//       history.replaceState(
//         {},
//         document.title,
//         window.location.href.split("#")[0]
//       );
//     }
//   }
//   fetchData().then(() => {
//     creature = new Creature(creatureID);
//     $("#level").val(Settings.get("level"));
//     $("#tamingMultiplier").val(Settings.get("tamingMultiplier"));
//     $("#consumptionMultiplier").val(Settings.get("consumptionMultiplier"));
//     methods = creature.method;
//     if (typeof methods == "object") {
//       if (methods[0] == "n") {
//         method = "n";
//       }
//     }
//     if (creature.isTamable) {
//       initTaming();
//     } else {
//       initTamingNotice();
//     }
//     console.log("fetchData, sanguineElixir", Settings.get("sanguineElixir"));
//     console.log(
//       "fetchData, sanguineElixir",
//       typeof Settings.get("sanguineElixir")
//     );
//     $("#sanguineElixir").prop("checked", Settings.get("sanguineElixir"));
//     if (creature.isKOable) {
//       fetchWeapons();
//       calculateAllWeapons();
//       initKO();
//     }
//     $("#secGap").on("keyup change", function (e) {
//       var newVal = $(e.target).val();
//       if (newVal > 0) {
//         Settings.set("secGap", newVal);
//       }
//       updateAllWeapons();
//     });
//     $(".boolButtons[data-type=xv] .boolButton").on("click", function (e) {
//       if ($(e.target).data("xv") === true) {
//         Settings.set("xv", true);
//       } else {
//         Settings.set("xv", false);
//       }
//       updateAllWeapons();
//     });
//     $(".koInput").on("keyup change", function (e) {
//       var newVal = parseInt($(e.target).val());
//       if (newVal > 0) {
//         var itemID = $(e.target).closest("[data-weapon]").data("weapon");
//         weapons[itemID].userDamage = newVal;
//         Settings.setObject("userDamage", itemID, newVal);
//         updateWeapon(itemID);
//       }
//     });
//     $("#taming").on("keyup change", "input.use", function (e) {
//       var newVal = $(e.target).val();
//       var itemID = $(e.target).closest("[data-ttrow]").data("ttrow");
//       if (newVal == 0) {
//         $(this).addClass("empty");
//       } else {
//         $(this).removeClass("empty");
//       }
//       taming.food[itemID].use = newVal;
//       processTameInput();
//     });
//     $("#taming").on("click", ".useExclusive", function (e) {
//       var row = $(e.target).closest("[data-ttrow]");
//       var foodID = $(row).data("ttrow");
//       var newVal = useExclusive(foodID);
//       $("#tamingTable .use").val(0).addClass("empty");
//       $(row).find(".use").val(newVal).removeClass("empty");
//       processTameInput();
//     });
//     $("#taming").on("click", ".ttexp", function (e) {
//       var row = $(e.target).closest("[data-ttrow]").find(".ttRow2");
//       if ($(row).is(":hidden")) {
//         $(row).slideDown(300);
//         $(this).find(".arrow").addClass("up").removeClass("down");
//       } else {
//         $(row).slideUp(300);
//         $(this).find(".arrow").addClass("down").removeClass("up");
//       }
//     });
//   });
//   $("#content").on("keyup change", ".tameSetting input", function () {
//     var theLevel = parseInt($("#level").val());
//     theLevel = Math.max(Math.min(theLevel, 2000), 1);
//     if (isNaN(theLevel)) {
//     } else {
//       Settings.set("level", theLevel);
//       if (creature.isTamable) {
//         torporTimerInit();
//         starveTimer.updateEstimatedFood();
//       }
//     }
//     var tamingMultiplier = parseFloat($("#tamingMultiplier").val());
//     tamingMultiplier = Math.max(Math.min(tamingMultiplier, 1000), 0.1);
//     if (isNaN(tamingMultiplier)) {
//     } else {
//       Settings.set("tamingMultiplier", tamingMultiplier);
//     }
//     var consumptionMultiplier = parseFloat($("#consumptionMultiplier").val());
//     consumptionMultiplier = Math.max(
//       Math.min(consumptionMultiplier, 1000),
//       0.1
//     );
//     if (isNaN(consumptionMultiplier)) {
//     } else {
//       Settings.set("consumptionMultiplier", consumptionMultiplier);
//     }
//     if ($("#sanguineElixir").is(":checked")) {
//       Settings.set("sanguineElixir", true);
//     } else {
//       Settings.set("sanguineElixir", false);
//     }
//     processTamingTable();
//     processTameInput();
//     updateAllWeapons();
//   });
// }
// function initTamingNotice() {
//   if (creature.tamingNotice && creature.tamingNotice.charCodeAt(0) != 55358) {
//     $("#taming").append(
//       `<p class="light marginTop0">${creature.tamingNotice}</h2>`
//     );
//   }
// }
// function initTaming() {
//   $("#taming").append(`<div class="row jcsb">
//     <div><h2 style="clear:both" class="ib marginBottomS">Taming Calculator</h2>${
//       method == "n"
//         ? ' <span class="bigPill bigPillReverse ib">Passive</span>'
//         : ""
//     }</div>
//     </div>`);
//   initTamingNotice();
//   $("#taming").append(`<div class="ttRowH ttRH row light bold">
//       <div class="flex2 noMob">
//         Food
//       </div>
//       <div class="flex1 jccenter">
//         Selected Food / Max
//       </div>
//       <div class="flex1 jccenter">
//         Time
//       </div>
//       <div class="flex2 tteff">
//         Effectiveness
//       </div>
//       <div class="ttexp noMob"></div>
//     </div>


//   <div class="item tameSetting ttRow">
//     <div class="itemImage" style="">
//       <a href="/item/341/sanguine-elixir"><img src="/media/item/Sanguine_Elixir.png" width="42" height="42" alt="Sanguine Elixir"></a>
//     </div>
//     <div class="itemLabel white bold"><input type="checkbox" id="sanguineElixir" name="sanguineElixir">  <label for="sanguineElixir">Use Sanguine Elixir</label> <span class="lightPill">NEW</span> <span class="bold light small marginTopSS">Increases taming by 30%</span></div>
//   </div>

//   <div id="tamingTable"></div>

//   <div id="tamingExcess" class="lightbox warningBox center">Too much food was used. Excess food is being ignored.</div>

//   <div id="tamingWarning" class="lightbox">
//     <div class="miniBarWrap" style="margin:.1em 0 .3em"><div class="miniBar" style="width:0%;background-color:#FFF"></div></div>
//     <div class="center light">Not enough food.</div>
//   </div>

//   <div id="tamingResults">
//     <div class="center light marginTop2 bold marginBottomSS">With Selected Food:</div>
//     <div class="lightbox rCol ${
//       method != "n" ? "attachedBottom" : ""
//     }" style="justify-content:center;gap:1.5em;">
//       <div class="rowItem">
//         <div class="center marginBottom marginTopS" style="align-self:center">
//           <div class="bigNum light">TOTAL TIME: <span class="white" id="totalTime"></span></div>
//         </div>

//         <div class="starveTimer widget collapsed lightbox pad0">
//           <div class="row pad bold widgetH jcsb">
//             <div class="row acenter">
//               <img src="/media/item/Food.png" width="26" height="26" alt="ARK: Survival Evolved Food Icon" class="marginRightS">
//               Starve Timer&nbsp;&nbsp;<span class="tameSecsLeft widgetHCO light"></span> </div>
//               <div class="arrow down"></div>
//           </div>
//           <div class="pad widgetB">
//             <div class="marginBottom2 flex jccenter">
//               <div class="lightbox">
//                 <div class="marginBottomS light center">Enter your creature's Food stat:</div>

//                 <div class="row acenter">
//                   <img src="/media/item/Food.png" width="34" height="34" alt="ARK: Survival Evolved Food Icon" class="marginRightS">
//                   <span class="kindabig">FOOD</span>

//                   <div class="center marginLeft2 marginRightSS">
//                     <input type="text" value="" class="currentFood whiteinput narc" style="width:4em;font-weight:bold;" />
//                     <div class="light marginTopSS">Current</div>
//                   </div>
//                   <div class="center">
//                     <input type="text" value="" class="maxFood whiteinput narc" style="width:4em;font-weight:bold;" />
//                     <div class="light marginTopSS">Max</div>
//                   </div>
//                 </div>
//               </div>
//             </div>


//             <div class="row jcsb r">
//               <div class="meterStatus actionColor right"></div>
//               <div class="row starveMeter" style="padding-bottom:1.5em">
//                 <div class="row" data-tooltip title="This is the point at which your creature's food value reaches 0. Once it is nearing 0, feed it all required food. It will immediately eat as much as possible and then eat the remainder at a normal pace.">
//                   <div>
//                     <div class="starveSecsLeft timeRemaining">&nbsp;</div>
//                   </div>
//                   <div class="smaller paddedS asc">
//                     <div class="light">UNTIL</div>
//                     <div>STARVED</div>
//                   </div>
//                 </div>
//               </div>
//             </div>


//             <div class="miniBarWrap marginBottomS"><div class="miniBar" style="width:100%"></div></div>
//             <div class="row jcsb" style="align-items:flex-start">
//               <div class="row">
//                 <div class="rowItemN">
//                   <div class="tameSecsLeft timeRemaining">&nbsp;</div>
//                 </div>
//                 <div class="rowItemN smaller paddedS asc">
//                   <div class="light">UNTIL</div>
//                   <div>TAMED</div>
//                 </div>
//               </div>
//               <div class="right light" data-tooltip title="Based on your selected food, this is the total food value that this creature must consume to be tamed.">Food required to eat: <span class="maxUnits"></span></div>
//             </div>
//             <div class="row marginTop2">
//               <div class="rowItem">
//                 <div class="row">
//                   <div class="rowItemN">
//                     <input type="text" value="5" class="alarm whiteinput" style="width:2em;text-align:center;font-weight:bold;" />
//                   </div>
//                   <div class="rowItem light paddedS">
//                     ALARM <br />(mins. before)
//                   </div>
//                 </div>
//               </div>
//               <div class="rowItem right">
//                 <button class="timerStart actionButton bold uppercase">Start Timer</button>
//               </div>
//             </div>
//           </div>
//         </div>
//         <div class="starveNote light small marginTop">Starve taming reduces the risk of losing resources by feeding a creature only once it is hungry enough to eat everything at once (or, eat as much as it can). Once you've selected the food you'll be taming with, enter the creature's current and max food values, then start the timer. <a href="https://help.dododex.com/en/article/how-to-starve-tame-in-ark-survival-evolved" class="">Learn more</a></div>







//       </div>
//       <div class="flex1 row">
//         <div class="rowItem center lvlsec">
//           <div class="light">Lvl <span class="bigNum white" id="baseLevel"></span></div>
//           <div class="light">Current</div>
//         </div>
//         <div class="rowItemN padded lvlsec">
//           <div class="arrow right"></div>
//         </div>
//         <div class="row flex2">
//           <div class="rowItem">
//             <div class="ringHolder">
//               <div class="ringText light white bigNum">+<span id="gainedLevels"></span></div>
//               <svg
//                  class="progress-ring"
//                  width="60"
//                  height="60">
//                 <circle
//                   class="progress-ring__circle"
//                   stroke="#bbff77"
//                   stroke-width="4"
//                   fill="#bbff7718"
//                   r="28"
//                   cx="30"
//                   cy="30"/>
//               </svg>
//             </div>
//             <div class="marginTopS center">
//               <div class="bigNum action"> <span id="effectiveness"></span><sup class="sup">%</sup></div>
//               <div class="light">Taming Eff.</div>
//             </div>
//           </div>
//           <div class="rowItem center lvlsec">
//             <div class="light">Lvl <span class="bigNum white" id="bonusLevel"></span></div>
//             <div class="light">With Bonus</div>
//           </div>
//         </div>
//         <div class="rowItemN padded lvlsec">
//           <div class="arrow right"></div>
//         </div>
//         <div class="rowItem center lvlsec">
//           <div class="light">Lvl <span class="bigNum white" id="maxLevel"></span></div>
//           <div class="light">Max After Taming <a href="https://help.dododex.com/en/article/how-do-creature-levels-work-in-ark-survival-evolved" data-tooltip title="Creatures can gain 73 levels after taming, but ARK: Genesis-exclusive creatures and X-creatures can gain 88 levels. In single player, all creatures gain 88 levels after taming."><i class="fas fa-question-circle"></i></a></div>
//         </div>
//       </div>
//     </div>
//   `);
//   if (method != "n") {
//     $("#taming").append(`
//       <div class="lightbox rCol attachedTop" style="justify-content:center;background-color:#375E79;gap:1.5em;">
//         <div class="rowItem">

//           <div id="torporTimer" class="widget collapsed tt lightbox pad0">
//             <div class="row pad bold widgetH jcsb">
//               <div class="row acenter">
//                 <img src="/media/item/Torpor.png" width="26" height="26" alt="ARK: Survival Evolved Torpor Icon" class="marginRightS">
//                 Torpor Timer&nbsp;<span class="ttTimeRemaining widgetHCO light"></span> </div>
//                 <div class="arrow down"></div>
//             </div>
//             <div class="pad widgetB">
//               <div class="row marginBottomS gridGap2" style="justify-content:center;">
//                 <div class="rowItem">
//                   <a id="useNarcotics" class="button">
//                     <div class="center">
//                       <span class="bigNum">+</span>
//                       <img src="/media/item/Narcotics.png" width="30" height="30" alt="Narcotics" style="vertical-align:middle;" />
//                     </div>
//                     <div class="marginTopS small bold">Narcotics</div>
//                     <div class="small light">40 Torpor</div>
//                   </a>
//                   <div class="narc marginTopS" id="narcoticsUsed">&nbsp;</div>
//                 </div>
//                 <div class="rowItem">
//                   <a id="useNarcoberries" class="button">
//                     <div class="center">
//                       <span class="bigNum">+</span>
//                       <img src="/media/item/Narcoberry.png" width="30" height="30" alt="Narcoberry" style="vertical-align:middle;" />
//                     </div>
//                     <div class="marginTopS small bold">Narcoberries</div>
//                     <div class="small light">7.5 Torpor</div>
//                   </a>
//                   <div class="narc marginTopS" id="narcoberriesUsed">&nbsp;</div>
//                 </div>
//                 <div class="rowItem">
//                   <a id="useAscerbic" class="button">
//                     <div class="center">
//                       <span class="bigNum">+</span>
//                       <img src="/media/item/Ascerbic_Mushroom.png" width="30" height="30" alt="Bio Toxin" style="vertical-align:middle;" />
//                     </div>
//                     <div class="marginTopS small bold">Aserbic Mushrooms</div>
//                     <div class="small light">25 Torpor</div>
//                   </a>
//                   <div class="narc marginTopS" id="ascerbicUsed">&nbsp;</div>
//                 </div>
//                 <div class="rowItem">
//                   <a id="useBiotoxins" class="button">
//                     <div class="center">
//                       <span class="bigNum">+</span>
//                       <img src="/media/item/Bio_Toxin.png" width="30" height="30" alt="Bio Toxin" style="vertical-align:middle;" />
//                     </div>
//                     <div class="marginTopS small bold">Bio Toxin</div>
//                     <div class="small light">80 Torpor</div>
//                   </a>
//                   <div class="narc marginTopS" id="biotoxinsUsed">&nbsp;</div>
//                 </div>

//               </div>

//               <div style="text-align:right;"><input type="text" id="ttUnits" value="" class="whiteinput narc" style="width:4em;font-weight:bold;" /></div>
//               <div class="miniBarWrap marginTopS marginBottomS"><div class="miniBar" style="width:100%"></div></div>
//               <div class="row jcsb">
//                 <div class="row">
//                   <div class="rowItemN">
//                     <div id="ttTimeRemaining" class="ttTimeRemaining timeRemaining">&nbsp;</div>
//                   </div>
//                   <div class="rowItemN smaller paddedS asc">
//                     <div class="light">UNTIL</div>
//                     <div>CONSCIOUS</div>
//                   </div>
//                 </div>
//                 <div class="right light"><span class="ttMaxUnits"></span></div>
//               </div>
//               <div class="row marginTop2">
//                 <div class="rowItem">
//                   <div class="row">
//                     <div class="rowItemN">
//                       <input type="text" id="ttAlarm" value="5" class="whiteinput" style="width:2em;text-align:center;font-weight:bold;" />
//                     </div>
//                     <div class="rowItem light paddedS">
//                       ALARM <br />(mins. before)
//                     </div>
//                   </div>
//                 </div>
//                 <div class="rowItem right">
//                   <button id="ttStart" class="actionButton bold uppercase">Start Timer</button>
//                 </div>
//               </div>
//             </div>
//           </div>
//           <div class="light small marginTop">Track this creature's torpor and narcotic consumpion over time. <a href="https://help.dododex.com/en/article/how-to-use-a-torpor-timer-in-ark-survival-evolved" class="">Learn more</a></div>
//           <div class="marginTop2">
//             <div class="row acenter">
//               <h3 style="margin:0 0.4em 0 0">Torpor Drain Rate:</h3>
//               <div id="trClass" class="bigPill marginRightS">
//                 <img src="/media/item/Torpor.png" width="20" height="20" alt="ARK: Survival Evolved Torpor Icon" class="marginRightS"> <span></span>
//               </div>
//               <span class="bigNum light"><span id="torporDeplPS"></span>/s</span>
//             </div>
//             <div class="light small marginTopS" id="trClassNote"></div>
//           </div>
//         </div>
//         <div class="rowItem">
//           <div>
//             <h3 class="marginTop0">Narcotics Needed</h3>
//             <div class="row" id="narcsNeeded">
//               <div class="rowItem center paddedS">
//                 <div class="marginBottomS"><img src="/media/item/Narcotics.png" width="30" height="30" alt="Narcotics" /></div>
//                 <div class="bigNum" id="narcsMin"></div>
//                 <div class="marginTopS small bold">Narcotics</div>
//               </div>
//               <div class="rowItem center paddedS">
//                 <div class="marginBottomS"><img src="/media/item/Narcoberry.png" width="30" height="30" alt="Narcoberry" /></div>
//                 <div class="bigNum" id="narcBMin"></div>
//                 <div class="marginTopS small bold">Narcoberries</div>
//               </div>
//               <div class="rowItem center paddedS">
//                 <div class="marginBottomS"><img src="/media/item/Ascerbic_Mushroom.png" width="30" height="30" alt="Bio Toxin" /></div>
//                 <div class="bigNum" id="ascerbicmushroomsMin"></div>
//                 <div class="marginTopS small bold">Aserbic Mushrooms</div>
//               </div>
//               <div class="rowItem center paddedS">
//                 <div class="marginBottomS"><img src="/media/item/Bio_Toxin.png" width="30" height="30" alt="Bio Toxin" /></div>
//                 <div class="bigNum" id="biotoxinsMin"></div>
//                 <div class="marginTopS small bold">Bio Toxin</div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     `);
//   }
//   $("#taming").append(`
//   </div>
//   `);
//   circle = document.querySelector(".progress-ring__circle");
//   radius = circle.r.baseVal.value;
//   circumference = radius * 2 * Math.PI;
//   circle.style.strokeDasharray = `${circumference} ${circumference}`;
//   circle.style.strokeDashoffset = `${circumference}`;
//   processTamingTable();
//   torporTimerInit();
//   starveTimerInit();
//   processTameInput();
// }
// function processTamingTable() {
//   var level = Settings.get("level");
//   taming = calcData(CREATURES[creatureID], level, method);
//   for (var i in taming.food) {
//     taming.food[i].results = calcTame(CREATURES[creatureID], taming.food, i);
//   }
//   $("#tamingTable").empty();
//   var numCollapsed = taming.food.length - MAX_FOOD_COLLAPSED;
//   var i = 0;
//   $(taming.food).each(function () {
//     if (typeof this.l == "string") {
//       var labelHTML =
//         '<div class="bold light small uppercase marginTopSS">' +
//         this.l +
//         "</div>";
//     } else {
//       var labelHTML = "";
//     }
//     var effectiveness = Math.round(this.results.effectiveness * 10) / 10;
//     var image = getImage(this.nameFormatted);
//     $("#tamingTable").append(`
//       <div class="ttRow" ${
//         i >= MAX_FOOD_COLLAPSED && numCollapsed > 1
//           ? 'style="display:none" data-ref="ttHidden"'
//           : ""
//       } data-ttrow="${this.key}">
//       <div class="ttBH">
//         <div class="ttB1 flex2">
//           <div class="item">
//             <div class="itemImage">
//               <img src="${image}" width="42" height="42" alt="${this.nameFormatted}">
//             </div>
//             <div class="itemLabel white bold">${
//               this.nameFormatted
//             } ${labelHTML}</div>
//           </div>
//         </div>
//         <div class="ttB2 flex1 jccenter bold kindabig">
//           <input type="number" value="${
//             this.use
//           }" maxlength="6" size="5" min="0" max="${this.max}" class="whiteinput attachedRight use${this.use == 0 ? " empty" : ""}" placeholder="0">
//           <div class="small light button useExclusive">${this.max}</div>
//         </div>
//         <div class="ttB3 flex1 jccenter bold">
//           ${timeFormat(this.seconds)}
//         </div>
//         <div class="ttB4 flex2 row tteff">
//           <div class="rowItem">
//             <div><span class="bold">${effectiveness}%</span> <span class="light">+${this.results.gainedLevels} Lvl (${level + this.results.gainedLevels})</span></div>
//             <div class="miniBarWrap" style="margin:.1em 0 .3em"><div class="miniBar" style="width:${effectiveness}%;background-color:#FFF"></div></div>
//           </div>
//         </div>
//         <div class="ttB5 ttexp">
//           <div class="arrow down" />
//         </div>
//       </div>
//       <div class="ttRow2">
//         <div class="row padVS light">
//           <div class="tt21">
//             <div class="row">
//               <div>Per Item:</div>
//               <div class="paddedS">
//                 ${
//                   this.df ? "" : Math.round(this.food * 10) / 10 + " Food<br />"
//                 }
//                 ${Math.round(this.percentPer * 10) / 10}% Taming
//               </div>
//             </div>
//           </div>
//           ${
//             typeof this.interval1 == "number"
//               ? `<div class="tt22 jccenter center">
//               ~${timeFormat(this.interval1)}<br/>First Interval
//             </div>
//             <div class="tt22 jccenter center">
//               ${timeFormat(this.secondsPer)}<br/>Remaining Intervals
//             </div>
//             `
//               : `<div class="tt22 jccenter center">
//               ${timeFormat(this.secondsPer)}<br/>Intervals
//             </div>
//             <div class="tt23 noMob"></div>
//             `
//           }
//         </div>
//       </div>
//     </div>`);
//     i++;
//   });
//   if (numCollapsed > 0) {
//     $("#tamingTable").append(
//       `<div class="ttRow button rc0" id="ttLoad">Show ${numCollapsed} More</div>`
//     );
//     $("#ttLoad").click(function () {
//       var theElems = $("[data-ref=ttHidden]");
//       $(theElems).fadeIn(300);
//       $(this).hide();
//     });
//   }
// }
// function processTameInput() {
//   console.log("processTameInput()");
//   var level = Settings.get("level");
//   if (typeof tamingResults == "object") {
//     var oldTamingResults = tamingResults;
//     tamingResults = calcTame(CREATURES[creatureID], taming.food);
//   } else {
//     tamingResults = calcTame(CREATURES[creatureID], taming.food);
//     var oldTamingResults = tamingResults;
//   }
//   if (tamingResults.enoughFood) {
//     if ($("#tamingResults").is(":hidden")) {
//       $("#tamingResults").show();
//       $("#tamingWarning").hide();
//     }
//     if (tamingResults.tooMuchFood) {
//       $("#tamingExcess").show();
//     } else {
//       $("#tamingExcess").hide();
//     }
//     var prevLevel = parseInt($("#baseLevel").text());
//     if (isNaN(prevLevel)) {
//       prevLevel = level;
//     }
//     $("#baseLevel").countTo({ from: prevLevel, to: level });
//     $("#gainedLevels").countTo({
//       from: oldTamingResults.gainedLevels,
//       to: tamingResults.gainedLevels,
//     });
//     $("#bonusLevel").countTo({
//       from: level + oldTamingResults.gainedLevels,
//       to: level + tamingResults.gainedLevels,
//     });
//     $("#maxLevel").countTo({
//       from: level + oldTamingResults.gainedLevels + creature.maxLevelsAfterTame,
//       to: level + tamingResults.gainedLevels + creature.maxLevelsAfterTame,
//     });
//     $("#totalTime").text(timeFormatL(tamingResults.totalSecs));
//     $("#effectiveness").countTo({
//       decimals: 1,
//       from: Math.round(oldTamingResults.effectiveness * 10) / 10,
//       to: Math.round(tamingResults.effectiveness * 10) / 10,
//     });
//     setRingProgress(tamingResults.effectiveness);
//     if (method != "n") {
//       $("#torporDeplPS").countTo({
//         decimals: 1,
//         from: Math.round(tamingResults.torporDeplPS * 10) / 10,
//         to: Math.round(tamingResults.torporDeplPS * 10) / 10,
//       });
//       $("#ascerbicmushroomsMin").countTo({
//         from: oldTamingResults.ascerbicmushroomsMin,
//         to: tamingResults.ascerbicmushroomsMin,
//       });
//       $("#biotoxinsMin").countTo({
//         from: oldTamingResults.biotoxinsMin,
//         to: tamingResults.biotoxinsMin,
//       });
//       $("#narcsMin").countTo({
//         from: oldTamingResults.narcsMin,
//         to: tamingResults.narcsMin,
//       });
//       $("#narcBMin").countTo({
//         from: oldTamingResults.narcBMin,
//         to: tamingResults.narcBMin,
//       });
//       if (tamingResults.narcBMin > 0) {
//         $("#narcsNeeded").removeClass("noNarcs");
//       } else {
//         $("#narcsNeeded").addClass("noNarcs");
//       }
//     }
//     starveTimer.updateTotalFood(tamingResults.totalFood);
//   } else {
//     $("#tamingResults").hide();
//     $("#tamingWarning").show();
//     $("#tamingWarning .miniBar").css(
//       "width",
//       Math.min(tamingResults.percentTamed * 100, 100) + "%"
//     );
//   }
// }
// function calcData(cr, level, method = "v", useState = null) {
//   var affinityNeeded = cr.a0 + cr.aI * level;
//   if (Settings.get("sanguineElixir")) {
//     affinityNeeded *= 0.7;
//   }
//   var theEats = [];
//   for (var i in cr.eats) {
//     if (FOODS[cr.eats[i]] != null) {
//       theEats.push(cr.eats[i]);
//     }
//   }
//   var row = Array();
//   var use = Array();
//   var food = Array();
//   var foodConsumption =
//     cr.foodBase * cr.foodMult * Settings.get("consumptionMultiplier");
//   if (method == "n") {
//     foodConsumption = foodConsumption * cr.nvfrm;
//   }
//   var selectedFood = 0;
//   var theRecentFoods = Settings.get("recentFoods");
//   var selectedFoodFound = false;
//   for (var i in theRecentFoods) {
//     if (!selectedFoodFound) {
//       var foodNameBase = this.getBaseName(theRecentFoods[i]);
//       for (var j in theEats) {
//         if (this.getBaseName(theEats[j]) == foodNameBase) {
//           selectedFood = j;
//           selectedFoodFound = true;
//           break;
//         }
//       }
//     }
//   }
//   if (selectedFood >= MAX_FOOD_COLLAPSED) {
//     var expanded = true;
//   } else {
//     var expanded = false;
//   }
//   for (var key in theEats) {
//     row.push({ key: key, food: theEats[key], use: 0, level: level });
//     var foodName = theEats[key];
//     var foodNameBase = this.getBaseName(foodName);
//     if (typeof cr.kf != "undefined" && typeof ITEMS[cr.kf] != "undefined") {
//       var kf = ITEMS[cr.kf];
//     }
//     var foodNameFormatted = foodNameBase;
//     if (cr.disableMult) {
//       var tamingMult = 4;
//     } else {
//       var tamingMult = Settings.get("tamingMultiplier", true) * 4;
//     }
//     var foodMaxRaw = affinityNeeded / FOODS[foodName].affinity / tamingMult;
//     var interval1 = null;
//     if (method == "n") {
//       var foodMaxRaw = foodMaxRaw / cr.nvfam;
//       var interval = FOODS[foodName].food / foodConsumption;
//       if (
//         typeof cr.bs == "object" &&
//         typeof cr.bs.f == "object" &&
//         typeof cr.bs.f.b == "number" &&
//         typeof cr.bs.f.w == "number"
//       ) {
//         var avgPerStat = Math.round(level / 7);
//         var estimatedFood = cr.bs.f.b + cr.bs.f.w * avgPerStat;
//         var passiveFoodPerc = 0.9;
//         var requiredFoodDecrease = estimatedFood * (1 - passiveFoodPerc);
//         var requiredFood = Math.max(requiredFoodDecrease, FOODS[foodName].food);
//         var interval1 = requiredFood / foodConsumption;
//       }
//       var foodMax = Math.ceil(foodMaxRaw);
//       if (foodMax == 1) {
//         var foodSecondsPer = 0;
//         var foodSeconds = 0;
//         interval1 = 0;
//         interval = 0;
//       } else {
//         var foodSecondsPer = FOODS[foodName].food / foodConsumption;
//         if (typeof interval1 == "number") {
//           var foodSeconds = Math.ceil(
//             Math.max(foodMax - 2, 0) * foodSecondsPer + interval1
//           );
//         } else {
//           var foodSeconds = Math.ceil(
//             Math.max(foodMax - 1, 0) * foodSecondsPer
//           );
//         }
//       }
//     } else {
//       var interval = null;
//       var foodMax = Math.ceil(foodMaxRaw);
//       var foodSecondsPer = FOODS[foodName].food / foodConsumption;
//       var foodSeconds = Math.ceil(foodMax * foodSecondsPer);
//     }
//     if (key == selectedFood) {
//       use[key] = foodMax;
//     } else {
//       use[key] = 0;
//     }
//     if (Settings.get("sanguineElixir")) {
//       var percentPer = 70 / foodMaxRaw;
//     } else {
//       var percentPer = 100 / foodMaxRaw;
//     }
//     food[key] = {
//       name: foodName,
//       nameFormatted: foodNameFormatted,
//       food: FOODS[foodName].food,
//       l: FOODS[foodName].l,
//       df: FOODS[foodName].df,
//       max: foodMax,
//       use: use[key],
//       seconds: foodSeconds,
//       secondsPer: foodSecondsPer,
//       percentPer: percentPer,
//       interval: interval,
//       interval1: interval1,
//       expanded: false,
//       key: key,
//     };
//   }
//   var returnData = { food: food, affinityNeeded: affinityNeeded };
//   return returnData;
// }
// function getBaseName(name) {
//   var foodNameSplit = name.split("|");
//   return foodNameSplit[0];
// }
// function useExclusive(usedFoodIndex) {
//   for (var i in taming.food) {
//     if (i == usedFoodIndex) {
//       taming.food[i].use = taming.food[i].max;
//       var amountUsed = taming.food[i].max;
//     } else {
//       taming.food[i].use = 0;
//     }
//   }
//   return amountUsed;
// }
// function calcTame(cr, foodList, useExclusive) {
//   var level = Settings.get("level");
//   var effectiveness = 100;
//   var totalSecs = 0;
//   var affinityNeeded = cr.a0 + cr.aI * level;
//   if (Settings.get("sanguineElixir")) {
//     affinityNeeded *= 0.7;
//   }
//   var affinityLeft = affinityNeeded;
//   var foodConsumption =
//     cr.foodBase * cr.foodMult * Settings.get("consumptionMultiplier");
//   totalFood = 0;
//   if (cr.disableMult) {
//     var tamingMult = 4;
//   } else {
//     var tamingMult = Settings.get("tamingMultiplier", true) * 4;
//   }
//   if (method == "n") {
//     foodConsumption = foodConsumption * cr.nvfrm;
//   }
//   var tooMuchFood = false;
//   var numUsedTotal = 0;
//   for (var aFoodKey in foodList) {
//     var aFood = Object.assign({}, foodList[aFoodKey]);
//     if (affinityLeft > 0) {
//       if (useExclusive >= 0) {
//         if (aFoodKey == useExclusive) {
//           aFood.use = aFood.max;
//         } else {
//           aFood.use = 0;
//         }
//       }
//       var aFoodName = aFood.name;
//       if (method == "n") {
//         var numNeeded = Math.ceil(
//           affinityLeft / FOODS[aFoodName].affinity / tamingMult / cr.nvfam
//         );
//       } else {
//         var numNeeded = Math.ceil(
//           affinityLeft / FOODS[aFoodName].affinity / tamingMult
//         );
//       }
//       if (numNeeded >= aFood.use) {
//         var numToUse = aFood.use;
//       } else {
//         tooMuchFood = true;
//         var numToUse = numNeeded;
//       }
//       if (method == "n") {
//         affinityLeft -=
//           numToUse * FOODS[aFoodName].affinity * tamingMult * cr.nvfam;
//       } else {
//         affinityLeft -= numToUse * FOODS[aFoodName].affinity * tamingMult;
//       }
//       totalFood += numToUse * FOODS[aFoodName].food;
//       var i = 1;
//       while (i <= numToUse) {
//         if (method == "n") {
//           effectiveness -=
//             (Math.pow(effectiveness, 2) * cr.tiba) /
//             FOODS[aFoodName].affinity /
//             tamingMult /
//             cr.nvfam /
//             100;
//           if (numUsedTotal == 0) {
//           } else if (numUsedTotal == 1) {
//             totalSecs += aFood.interval1;
//           } else {
//             totalSecs += FOODS[aFoodName].food / foodConsumption;
//           }
//         } else {
//           effectiveness -=
//             (Math.pow(effectiveness, 2) * cr.tiba) /
//             FOODS[aFoodName].affinity /
//             tamingMult /
//             100;
//           totalSecs += FOODS[aFoodName].food / foodConsumption;
//         }
//         numUsedTotal++;
//         i++;
//       }
//       if (effectiveness < 0) {
//         effectiveness = 0;
//       }
//     } else if (aFood.use > 0) {
//       tooMuchFood = true;
//     }
//   }
//   totalSecs = Math.ceil(totalSecs);
//   var neededValues = Array();
//   var neededValuesSecs = Array();
//   if (affinityLeft <= 0) {
//     var enoughFood = true;
//   } else {
//     var enoughFood = false;
//     for (var aFood in foodList) {
//       var aFood = Object.assign({}, foodList[aFoodKey]);
//       var aFoodName = aFood.name;
//       var numNeeded = Math.ceil(
//         affinityLeft / FOODS[aFoodName].affinity / tamingMult
//       );
//       neededValues[aFood] = numNeeded;
//       neededValuesSecs[aFood] = Math.ceil(
//         (numNeeded * FOODS[aFoodName].food) / foodConsumption + totalSecs
//       );
//     }
//   }
//   var percentLeft = affinityLeft / affinityNeeded;
//   var percentTamed = 1 - percentLeft;
//   var totalTorpor = cr.t1 + cr.tI * (level - 1);
//   var torporDeplPS =
//     cr.tDPS0 + Math.pow(level - 1, 0.800403041) / (22.39671632 / cr.tDPS0);
//   var ascerbicmushroomsMin = Math.max(
//     Math.ceil(
//       (totalSecs * torporDeplPS - totalTorpor) /
//         (narcotics.ascerbic.torpor + torporDeplPS * narcotics.ascerbic.secs)
//     ),
//     0
//   );
//   var biotoxinsMin = Math.max(
//     Math.ceil(
//       (totalSecs * torporDeplPS - totalTorpor) /
//         (narcotics.bio.torpor + torporDeplPS * narcotics.bio.secs)
//     ),
//     0
//   );
//   var narcsMin = Math.max(
//     Math.ceil(
//       (totalSecs * torporDeplPS - totalTorpor) /
//         (narcotics.narcotics.torpor + torporDeplPS * narcotics.narcotics.secs)
//     ),
//     0
//   );
//   var narcBMin = Math.max(
//     Math.ceil(
//       (totalSecs * torporDeplPS - totalTorpor) /
//         (narcotics.narcoberries.torpor +
//           torporDeplPS * narcotics.narcoberries.secs)
//     ),
//     0
//   );
//   var gainedLevels = Math.floor((level * 0.5 * effectiveness) / 100);
//   return {
//     totalFood,
//     tooMuchFood,
//     enoughFood,
//     percentTamed,
//     neededValues,
//     neededValuesSecs,
//     totalTorpor,
//     torporDeplPS,
//     ascerbicmushroomsMin,
//     biotoxinsMin,
//     narcsMin,
//     narcBMin,
//     effectiveness,
//     gainedLevels,
//     totalSecs,
//   };
// }
// if (typeof HOST != "string") {
//   var HOST = "https://www.dododex.com";
// }
// const REQUEST_URL = HOST + "/api/data.json");
// const PATH_IMG_CREATURE = HOST + "/media/creature/";
// const PATH_IMG = HOST + "/media/item/";
// const PATH_IMG_UI = HOST + "/media/ui/";
// const WIKI_URL = "https://ark.gamepedia.com/";
// function getImage(item) {
//   if (typeof IMAGES[item] === "undefined") {
//     if (item.indexOf(" Dye") >= 0) {
//       var filename = PATH_IMG + IMAGES["White Dye"];
//     } else if (item.indexOf("Egg") >= 0) {
//       var filename = PATH_IMG + IMAGES["Dodo Egg"];
//     } else if (item.indexOf("Kibble") >= 0) {
//       var filename = PATH_IMG + IMAGES["Kibble"];
//     } else {
//       var filename = null;
//     }
//   } else {
//     var filename = PATH_IMG + IMAGES[item];
//   }
//   return filename;
// }
// (function ($) {
//   $.fn.countTo = function (options) {
//     options = $.extend({}, $.fn.countTo.defaults, options || {});
//     var loops = Math.ceil(options.speed / options.refreshInterval),
//       increment = (options.to - options.from) / loops;
//     return $(this).each(function () {
//       var _this = this,
//         loopCount = 0,
//         value = options.from,
//         interval = setInterval(updateTimer, options.refreshInterval);
//       function updateTimer() {
//         value += increment;
//         loopCount++;
//         $(_this).html(number_format(value.toFixed(options.decimals)));
//         if (typeof options.onUpdate == "function") {
//           options.onUpdate.call(_this, value);
//         }
//         if (loopCount >= loops) {
//           clearInterval(interval);
//           value = options.to;
//           if (typeof options.onComplete == "function") {
//             options.onComplete.call(_this, value);
//           }
//         }
//       }
//     });
//   };
//   $.fn.countTo.defaults = {
//     from: 0,
//     to: 100,
//     speed: 400,
//     refreshInterval: 50,
//     decimals: 0,
//     onUpdate: null,
//     onComplete: null,
//   };
// })(jQuery);
// jQuery(function ($) {
//   $(".timer").countTo({
//     from: 50,
//     to: 2500,
//     speed: 500,
//     refreshInterval: 50,
//     onComplete: function (value) {
//       console.debug(this);
//     },
//   });
// });
// function setRingProgress(percent) {
//   const offset = circumference - (percent / 100) * circumference;
//   circle.style.strokeDashoffset = offset;
// }
// function fetchWeapons() {
//   if (typeof CREATURES[creatureID].forceW == "object") {
//     weapons = {};
//     for (var i in CREATURES[creatureID].forceW) {
//       var weaponID = CREATURES[creatureID].forceW[i];
//       weapons[weaponID] = WEAPONS[weaponID];
//       weapons[weaponID].id = weaponID;
//       weapons[weaponID].type = weaponID;
//       weapons[weaponID].userDamage =
//         Settings.get("userDamage")[weaponID] > 0
//           ? Settings.get("userDamage")[weaponID]
//           : 100;
//     }
//   } else {
//     weapons = {};
//     for (var i in WEAPONS) {
//       if (WEAPONS[i].disable !== true) {
//         weapons[i] = WEAPONS[i];
//         weapons[i].id = i;
//         weapons[i].type = i;
//         weapons[i].userDamage =
//           Settings.get("userDamage")[i] > 0
//             ? Settings.get("userDamage")[i]
//             : 100;
//       }
//     }
//   }
//   calculateAllWeapons();
// }
// function updateWeapon(weaponID) {
//   weapons[weaponID].data = calculateWeapon(weapons[weaponID]);
//   var weaponEl = $('#ko [data-weapon="' + weaponID + '"]');
//   if (weapons[weaponID].data.isRecommended) {
//     $(weaponEl).removeClass("koNotRec");
//   } else {
//     $(weaponEl).addClass("koNotRec");
//   }
//   var i = 0;
//   $(weaponEl)
//     .find(".koHitbox")
//     .each(function () {
//       if (i == 0) {
//         var data = weapons[weaponID].data;
//       } else {
//         var data = weapons[weaponID].data.hitboxes[i - 1];
//       }
//       if (data.isPossible) {
//         $(this).find(".koHits").text(numberFormat(data.hits));
//       } else {
//         if (i == 0) {
//           $(this).find(".koHits").text("Not possible");
//         }
//       }
//       if (data.chanceOfDeathHigh) {
//         $(this).find(".koCOD").addClass("koCODHigh");
//       } else {
//         $(this).find(".koCOD").removeClass("koCODHigh");
//       }
//       if (data.chanceOfDeath < 0.1) {
//         $(this).find(".koCOD").addClass("koCODNone");
//       } else {
//         $(this).find(".koCOD").removeClass("koCODNone");
//       }
//       $(this)
//         .find(".koCODval")
//         .text(data.chanceOfDeath + "%");
//       i++;
//     });
// }
// function numberFormat(num) {
//   return new Intl.NumberFormat().format(num);
// }
// function calculateAllWeapons() {
//   for (var i in weapons) {
//     weapons[i].data = calculateWeapon(weapons[i]);
//   }
// }
// function calculateWeapon(weapon) {
//   var level = Settings.get("level");
//   var secGap = Settings.get("secGap");
//   if (typeof weapon != "object") {
//     return null;
//   }
//   var key = weapon.key;
//   var creatureT = creature.t1 + creature.tI * (level - 1);
//   if (typeof creature.ft == "number") {
//     var creatureFleeThreshold = creature.ft;
//   } else {
//     var creatureFleeThreshold = 0.75;
//   }
//   var torporPerHit = WEAPONS[weapon.type].torpor;
//   var weaponDuration = WEAPONS[weapon.type].duration || 0;
//   if (creature.tDPS0) {
//     var torporDeplPS =
//       creature.tDPS0 +
//       Math.pow(level - 1, 0.8493) / (22.39671632 / creature.tDPS0);
//     if (secGap > weaponDuration) {
//       var secsOfRegen = secGap - weaponDuration;
//       torporPerHit = torporPerHit - secsOfRegen * torporDeplPS;
//     }
//     if (torporPerHit > 0) {
//       var isPossible = true;
//     } else {
//       var isPossible = false;
//     }
//   } else {
//     isPossible = true;
//   }
//   var knockOut = creatureT / torporPerHit;
//   var totalMultipliers = 1;
//   if (
//     typeof WEAPONS[weapon.type].mult == "object" &&
//     WEAPONS[weapon.type].mult != null &&
//     typeof creature.mult == "object"
//   ) {
//     for (var i in WEAPONS[weapon.type].mult) {
//       if (typeof creature.mult[WEAPONS[weapon.type].mult[i]] == "number") {
//         knockOut /= creature.mult[WEAPONS[weapon.type].mult[i]];
//         totalMultipliers *= creature.mult[WEAPONS[weapon.type].mult[i]];
//       }
//     }
//   }
//   if (WEAPONS[weapon.type].usesMeleeDamage == true) {
//     knockOut = knockOut / (Settings.get("meleeMultiplier") / 100);
//     totalMultipliers *= Settings.get("meleeMultiplier") / 100;
//   }
//   if (creature.xv && Settings.get("xv") == true) {
//     knockOut = knockOut / 0.4;
//     totalMultipliers *= 0.4;
//   }
//   knockOut = knockOut / Settings.get("playerDamageMultiplier");
//   totalMultipliers *= Settings.get("playerDamageMultiplier");
//   var numHitsRaw = knockOut / (weapon.userDamage / 100);
//   var hitboxes = [];
//   if (typeof creature.hitboxes !== "undefined") {
//     for (var i in creature.hitboxes) {
//       var hitboxHits = numHitsRaw / creature.hitboxes[i];
//       if (creatureFleeThreshold == 1) {
//         var hitsUntilFlee = "-";
//       } else {
//         var hitsUntilFlee = Math.max(
//           1,
//           Math.ceil(hitboxHits * creatureFleeThreshold)
//         );
//       }
//       hitboxes.push({
//         name: name,
//         multiplier: creature.hitboxes[i],
//         hitsRaw: hitboxHits,
//         hitsUntilFlee: hitsUntilFlee,
//         hits: Math.ceil(hitboxHits),
//         chanceOfDeath: 0,
//         isPossible: isPossible,
//       });
//     }
//   }
//   var bodyChanceOfDeath = 0;
//   var minChanceOfDeath = 0;
//   if (level < 2000 && isPossible) {
//     if (
//       typeof creature.bs == "object" &&
//       typeof creature.bs.h == "object" &&
//       typeof creature.bs.h.b == "number" &&
//       typeof creature.bs.h.w == "number"
//     ) {
//       var baseHealth = creature.bs.h.b;
//       var incPerLevel = creature.bs.h.w;
//       if (
//         typeof WEAPONS[weapon.type].damage != null &&
//         typeof baseHealth != null &&
//         typeof incPerLevel != null
//       ) {
//         var numStats = 7;
//         var totalDamage =
//           WEAPONS[weapon.type].damage *
//           Math.ceil(numHitsRaw) *
//           totalMultipliers *
//           (weapon.userDamage / 100);
//         if (totalDamage < baseHealth) {
//           var propsurvival = 100;
//         } else {
//           var pointsNeeded = Math.max(
//             Math.ceil((totalDamage - baseHealth) / incPerLevel),
//             0
//           );
//           if (level - 1 < pointsNeeded) {
//             var propsurvival = 0;
//           } else {
//             var propsurvival = calculatePropability(
//               level - 1,
//               numStats,
//               pointsNeeded
//             );
//           }
//         }
//         var bodyChanceOfDeath = formatCOD(100 - propsurvival);
//         var minChanceOfDeath = bodyChanceOfDeath;
//         if (hitboxes.length > 0) {
//           for (var i in hitboxes) {
//             totalDamage =
//               WEAPONS[weapon.type].damage *
//               Math.ceil(hitboxes[i].hitsRaw) *
//               totalMultipliers *
//               (weapon.userDamage / 100) *
//               hitboxes[i].multiplier;
//             if (totalDamage < baseHealth) {
//               var propsurvival = 100;
//             } else {
//               pointsNeeded = Math.max(
//                 Math.ceil((totalDamage - baseHealth) / incPerLevel),
//                 0
//               );
//               propsurvival = calculatePropability(
//                 level - 1,
//                 numStats,
//                 pointsNeeded
//               );
//             }
//             var chanceOfDeath = formatCOD(100 - propsurvival);
//             hitboxes[i].chanceOfDeath = chanceOfDeath;
//             hitboxes[i].chanceOfDeathHigh = chanceOfDeath > 40;
//             minChanceOfDeath = Math.min(minChanceOfDeath, chanceOfDeath);
//           }
//         }
//       }
//     }
//   }
//   var chanceOfDeathHigh = bodyChanceOfDeath > 40;
//   if (creatureFleeThreshold == 1) {
//     var hitsUntilFlee = "-";
//   } else {
//     var hitsUntilFlee = Math.max(
//       1,
//       Math.ceil(numHitsRaw * creatureFleeThreshold)
//     );
//   }
//   return {
//     hits: Math.ceil(numHitsRaw),
//     hitsRaw: numHitsRaw,
//     hitsUntilFlee: hitsUntilFlee,
//     chanceOfDeath: bodyChanceOfDeath,
//     chanceOfDeathHigh: chanceOfDeathHigh,
//     minChanceOfDeath: minChanceOfDeath,
//     isPossible: isPossible,
//     isRecommended: isPossible && minChanceOfDeath < 90,
//     minChanceOfDeath: 0,
//     hitboxes: hitboxes,
//   };
// }
// function initKO() {
//   var r = '<h2 class="hborder">Knock Out</h2>';
//   r += '<div class="scrollxw">';
//   r +=
//     '<div class="marginTopS marginBottomS koWeaponLead" style="position:absolute;left:0;"><div class="koWeaponHead"></div><div class="koHitbox"></div>';
//   if (creature.hitboxes) {
//     var ji = 0;
//     for (var j in creature.hitboxes) {
//       r += '<div class="koHitbox">';
//       r += '<div class="lighter small koHitboxLabel">';
//       r +=
//         '<span class="white">' +
//         j +
//         "</span> " +
//         creature.hitboxes[j] +
//         "&times;";
//       r += "</div>";
//       r += "</div>";
//       ji++;
//     }
//   }
//   r += "</div>";
//   r += '<div class="scrollx scrollvisibile" style="overflow-x:scroll">';
//   r += '<div class="row ko marginBottom" style="min-width:600px;">';
//   j = 0;
//   for (var i in weapons) {
//     var weapon = weapons[i];
//     r +=
//       '<div class="rowItemN center koWeapon" data-weapon="' + weapon.id + '">';
//     r += '<div class="marginTopS marginBottomS">';
//     r += '<div class="koWeaponHead">';
//     r += '<div class="center">';
//     if (weapon.img) {
//       r +=
//         '<img src="' +
//         getImage(weapon.img) +
//         '" width="50" height="50" alt="' +
//         weapon.name +
//         '" />';
//     }
//     r += "</div>";
//     r += '<div class="marginTopS">';
//     r +=
//       '<div class="whiteinputh"><input class="koInput center" value="' +
//       weapon.userDamage +
//       '" keyboardtype="number-pad" maxlength="10" style="width:2.5em;" /></div>';
//     r +=
//       '<div class="knockLabelT" style="height:3em">' + weapon.name + "</div>";
//     r += "</div>";
//     r += "</div>";
//     r += '<div class="koHitbox">';
//     r += '<div class="koHits"></div>';
//     r += '<div class="rowItem small koCOD">';
//     r += '<div class="koCODval"></div>';
//     r += "<div>Chance of Death</div>";
//     r += "</div>";
//     r += "</div>";
//     if (creature.hitboxes) {
//       var ji = 0;
//       for (var j in creature.hitboxes) {
//         r += '<div class="koHitbox">';
//         r += '<div class="rowItem lighter small uppercase" style="height:1em">';
//         if (j == 0) {
//           r +=
//             '<span class="white">' +
//             ucfirst(key) +
//             "</span> " +
//             creature.hitboxes[j] +
//             "&times;";
//         }
//         r += "</div>";
//         r += '<div class="koHits"></div>';
//         r += '<div class="rowItem small koCOD">';
//         r += '<div class="koCODval"></div>';
//         r += "<div>Chance of Death</div>";
//         r += "</div>";
//         r += "</div>";
//         ji++;
//       }
//     }
//     if (weapon.data.propsurvival < 99.9) {
//       r += '<div class="rowItem small uppercase propSurvival">';
//       opacity = round(100 - weapon.data.propsurvival, 2) / 100;
//       r +=
//         '<div class="warningBubble" style="margin:auto;background-color: rgba(184, 83, 80,' +
//         max(opacity, 0.3) +
//         ')">';
//       r += round(100 - weapon.data.propsurvival, 2);
//       r += "%</div>";
//       if (!weapon.data.hasCODlabel) {
//         r +=
//           '<div class="warningBubbleText small light">CHANCE <br />OF DEATH</div>';
//         weapon.data.hasCODlabel = true;
//       }
//       r += "</div>";
//     }
//     r += "</div>";
//     r += "</div>";
//     j++;
//   }
//   r += "</div>";
//   r += "</div></div>";
//   if (!creature.hitboxes) {
//     r +=
//       '<p class="light small center">The ' +
//       creature.name +
//       " does not have multipliers for headshots or any other areas.</p>";
//   }
//   r += `<div class="row marginTop small jcsb">
//     <div class="left marginBottom">
//       <input class="whiteinput center" id="secGap" value="${Settings.get(
//         "secGap"
//       )}" keyboardtype="number-pad" maxlength="4" style="width:2.5em;" type="number" min="1" max="100" /> <b>Seconds between hits</b>
//       <div class="light marginTopS">Enter your expected gap between <br />your hits for increased accuracy.</div>
//     </div>`;
//   if (creature.xv) {
//     r += `<div class="right">
//       <div class="boolButtons" data-type="xv">
//         <div class="boolButton active" data-xv="false">${creature.name}</div><div class="boolButton" data-xv="true">X-${creature.name}</div>
//       </div>
//       <div class="light marginTopS">X-creatures have a 40% resistance <br />to damage & torpor.</div>
//     </div>`;
//   }
//   r += `</div>`;
//   $("#ko").html(r);
//   updateAllWeapons();
// }
// function updateAllWeapons() {
//   for (var i in weapons) {
//     updateWeapon(weapons[i].id);
//   }
// }
// function formatCOD(cod) {
//   if (cod < 1 || cod > 99) {
//     return Math.round(cod * 10) / 10;
//   } else {
//     return Math.round(cod);
//   }
// }
// function calculatePropability(n, numOptions, ll) {
//   var ll, ul;
//   var p = 1 / numOptions;
//   if (!isNaN(n) && !isNaN(p)) {
//     if (n > 0 && p > 0 && p < 1) {
//       if (!isNaN(ll) && ll >= 0) {
//         return calculatePropabilityMore(ll, n, p);
//       }
//     }
//   }
// }
// function calculatePropabilityMore(ll, ul, p) {
//   var n = ul;
//   var numIntervals = n + 1;
//   var probs = new Array(numIntervals);
//   var maxProb = 0;
//   for (var i = 0; i < numIntervals; i++) {
//     probs[i] = b(p, n, i);
//     maxProb = Math.max(maxProb, probs[i]);
//   }
//   var topProb = Math.ceil(100 * maxProb) / 100;
//   var pCumulative = 0;
//   for (var i = 0; i < numIntervals; i++) {
//     if (i >= ll && i <= ul) {
//       pCumulative += probs[i];
//     }
//   }
//   pCumulative = Math.round(10000 * pCumulative) / 100;
//   return pCumulative;
// }
// function nper(n, x) {
//   var n1 = n + 1;
//   var r = 1.0;
//   var xx = Math.min(x, n - x);
//   for (var i = 1; i < xx + 1; i++) {
//     r = (r * (n1 - i)) / i;
//   }
//   return r;
// }
// function b(p, n, x) {
//   var px = Math.pow(p, x) * Math.pow(1.0 - p, n - x);
//   return nper(n, x) * px;
// }
// var lowbeep = new Audio("/media/audio/lowbeep.mp3");
// var eat = new Audio("/media/audio/eat.mp3?3");
// var dododeath = new Audio("/media/audio/dododeath.mp3");
// var dodo = new Audio("/media/audio/dodo.mp3");
// var rate,
//   maxUnits,
//   totalUnits,
//   constantSeconds,
//   totalSeconds,
//   narcoticsUsed,
//   narcoticsTorporQueue,
//   narcoberriesUsed,
//   narcoberriesTorporQueue,
//   biotoxinsUsed,
//   biotoxinsTorporQueue,
//   ttRunning,
//   alarm,
//   alarmSecs,
//   ttHasAlarmed,
//   ascerbicUsed,
//   ascerbicTorporQueue;
// function torporTimerInit() {
//   rate = taming.food[0].results.torporDeplPS;
//   maxUnits = creature.bs.t.b + creature.bs.t.w * (Settings.get("level") - 1);
//   maxUnits = parseFloat(maxUnits.toFixed(3));
//   totalUnits = maxUnits;
//   constantSeconds = totalUnits / rate;
//   totalSeconds = constantSeconds;
//   ascerbicUsed = 0;
//   ascerbicTorporQueue = 0;
//   biotoxinsUsed = 0;
//   biotoxinsTorporQueue = 0;
//   narcoticsUsed = 0;
//   narcoticsTorporQueue = 0;
//   narcoberriesUsed = 0;
//   narcoberriesTorporQueue = 0;
//   ttRunning = false;
//   alarm = parseFloat($("#ttAlarm").val());
//   alarmSecs = alarm * 60 + 1;
//   ttHasAlarmed = false;
//   if (creature.tDPS0 <= 0.3) {
//     var trClass = "Low";
//     var trClassNote =
//       "This creature's torpor drops slowly, so you won't have to give it narcotics as frequently.";
//     var trClassBGColor = "#B9EF85";
//     var trClassColor = "#572";
//     var trImgCSS = {
//       filter:
//         "invert(43%) sepia(12%) saturate(2454%) hue-rotate(42deg) brightness(69%) contrast(85%)",
//     };
//   } else if (creature.tDPS0 <= 0.7) {
//     var trClass = "Medium";
//     var trClassNote =
//       "This creature's torpor drops a little bit faster than most creatures.";
//     var trClassBGColor = "#FDED7D";
//     var trClassColor = "rgba(0,0,0,.5)";
//     var trImgCSS = { filter: "invert(100%) brightness(100%) opacity(0.5)" };
//   } else if (creature.tDPS0 < 5) {
//     var trClass = "High";
//     var trClassNote =
//       "This creature's torpor drops faster than most creatures. Be attentive and have narcotics ready so it doesn't wake up. When knocking out a high torpor rate creature, excess time gaps between shots (or misses) can cancel out some of the torpor inflicted, increasing the hits required.";
//     var trClassBGColor = "#e3564d";
//     var trClassColor = "#FFF";
//   } else if (creature.tDPS0 >= 5) {
//     var trClass = "Extremely High";
//     var trClassNote =
//       "This creature's torpor drops significantly faster than most creatures. Be attentive and have narcotics ready so it doesn't wake up. When knocking out a high torpor rate creature, excess time gaps between shots (or misses) can cancel out some of the torpor inflicted, increasing the hits required.";
//     var trClassBGColor = "#e3564d";
//     var trClassColor = "#FFF";
//   }
//   $("#trClass span").html(trClass);
//   $("#trClass").css("color", trClassColor);
//   $("#trClass").css("background-color", trClassBGColor);
//   $("#trClassNote").text(trClassNote);
//   if (trImgCSS) {
//     $("#trClass img").css(trImgCSS);
//   }
//   $("#trClassNote").shorten({
//     moreText: "(read more)",
//     lessText: "(read less)",
//     showChars: 70,
//   });
//   $("#ttRate").text(Math.round(rate * 100) / 100);
//   $(".ttTimeRemaining").html(timeFormat(totalSeconds, true));
//   $("#ttMaxUnits").text(maxUnits);
//   $("#ttUnits").val(totalUnits);
//   $("#ttUnits").on("change keyup paste", function () {
//     totalUnits = parseFloat($("#ttUnits").val());
//     if (totalUnits > maxUnits) {
//       totalUnits = maxUnits;
//     }
//     if (totalUnits < 0) {
//       totalUnits = 0;
//     }
//     totalSeconds = totalUnits / rate;
//     renderUpdate();
//   });
//   $("#ttAlarm").on("change keyup paste", function () {
//     var alarm = parseFloat($("#ttAlarm").val());
//     var alarmSecs = alarm * 60 + 1;
//   });
//   $("#ttStart").click(function (event) {
//     startTimer();
//   });
//   $("#useNarcotics").click(function (event) {
//     useNarcotics("narcotics");
//   });
//   $("#useNarcoberries").click(function (event) {
//     useNarcotics("narcoberries");
//   });
//   $("#useBiotoxins").click(function (event) {
//     useNarcotics("biotoxins");
//   });
//   $("#useAscerbic").click(function (event) {
//     useNarcotics("ascerbic");
//   });
// }
// function decreaseTimer() {
//   if (totalSeconds <= alarmSecs && !ttHasAlarmed) {
//     ttHasAlarmed = true;
//     $(".tt").addClass("alarming");
//     dodo.play();
//   } else if (totalSeconds > alarmSecs && ttHasAlarmed) {
//     ttHasAlarmed = false;
//     $(".tt").removeClass("alarming");
//   }
//   if (ascerbicTorporQueue > 0) {
//     var torpIncPerSec = narcotics.ascerbic.torpor / narcotics.ascerbic.secs;
//     var torpToInc = Math.min(torpIncPerSec, ascerbicTorporQueue);
//     ascerbicTorporQueue = ascerbicTorporQueue - torpIncPerSec;
//     totalUnits = totalUnits + torpToInc;
//     totalSeconds = totalUnits / rate;
//   } else if (biotoxinsTorporQueue > 0) {
//     var torpIncPerSec = narcotics.bio.torpor / narcotics.bio.secs;
//     var torpToInc = Math.min(torpIncPerSec, biotoxinsTorporQueue);
//     biotoxinsTorporQueue = biotoxinsTorporQueue - torpIncPerSec;
//     totalUnits = totalUnits + torpToInc;
//     totalSeconds = totalUnits / rate;
//   } else if (narcoticsTorporQueue > 0) {
//     var torpIncPerSec = narcotics.narcotics.torpor / narcotics.narcotics.secs;
//     var torpToInc = Math.min(torpIncPerSec, narcoticsTorporQueue);
//     narcoticsTorporQueue = narcoticsTorporQueue - torpIncPerSec;
//     totalUnits = totalUnits + torpToInc;
//     totalSeconds = totalUnits / rate;
//   } else if (narcoberriesTorporQueue > 0) {
//     var torpIncPerSec =
//       narcotics.narcoberries.torpor / narcotics.narcoberries.secs;
//     var torpToInc = Math.min(torpIncPerSec, narcoberriesTorporQueue);
//     narcoberriesTorporQueue = narcoberriesTorporQueue - torpIncPerSec;
//     totalUnits = totalUnits + torpToInc;
//     totalSeconds = totalUnits / rate;
//   } else {
//     totalSeconds = totalSeconds - 1;
//     totalUnits = totalUnits - rate;
//   }
//   validateData();
//   totalSeconds = totalUnits / rate;
//   $("#ttUnits").val(totalUnits.toFixed(1));
//   renderUpdate();
// }
// function renderUpdate() {
//   miniBarPerc = (totalUnits / maxUnits) * 100;
//   if (miniBarPerc > 100) {
//     miniBarPerc = 100;
//   }
//   $("#torporTimer .miniBar").css("width", miniBarPerc + "%");
//   $(".ttTimeRemaining").html(timeFormat(totalSeconds, true));
// }
// function validateData() {
//   if (totalUnits > maxUnits) {
//     totalUnits = maxUnits;
//     ascerbicTorporQueue = 0;
//     biotoxinsTorporQueue = 0;
//     narcoticsTorporQueue = 0;
//     narcoberriesTorporQueue = 0;
//   }
//   if (totalSeconds <= 1) {
//     totalSeconds = 0;
//     totalUnits = 0;
//     stopTimer();
//     dododeath.play();
//   }
// }
// function useNarcotics(narcType) {
//   var numNarcsToUse = 1;
//   if (narcType == "narcotics") {
//     narcoticsUsed = narcoticsUsed + numNarcsToUse;
//     narcoticsTorporQueue =
//       narcoticsTorporQueue + numNarcsToUse * narcotics.narcotics.torpor;
//     $("#narcoticsUsed").html("<b>" + narcoticsUsed + "</b> used");
//   } else if (narcType == "narcoberries") {
//     narcoberriesUsed = narcoberriesUsed + numNarcsToUse;
//     narcoberriesTorporQueue =
//       narcoberriesTorporQueue + numNarcsToUse * narcotics.narcoberries.torpor;
//     $("#narcoberriesUsed").html("<b>" + narcoberriesUsed + "</b> used");
//   } else if (narcType == "biotoxins") {
//     biotoxinsUsed = biotoxinsUsed + numNarcsToUse;
//     biotoxinsTorporQueue =
//       biotoxinsTorporQueue + numNarcsToUse * narcotics.bio.torpor;
//     $("#biotoxinsUsed").html("<b>" + biotoxinsUsed + "</b> used");
//   } else if (narcType == "ascerbic") {
//     ascerbicUsed = ascerbicUsed + numNarcsToUse;
//     ascerbicTorporQueue =
//       ascerbicTorporQueue + numNarcsToUse * narcotics.ascerbic.torpor;
//     $("#ascerbicUsed").html("<b>" + ascerbicUsed + "</b> used");
//   }
//   eat.play();
// }
// function startTimer() {
//   lowbeep.play();
//   if (!ttRunning) {
//     totalUnits = parseFloat($("#ttUnits").val());
//     ttRunning = true;
//     interval = setInterval(decreaseTimer, 1000);
//     $("#ttStart").html("Pause Timer");
//   } else {
//     ttRunning = false;
//     stopTimer();
//     $("#ttStart").html("Start Timer");
//   }
// }
// function stopTimer() {
//   clearInterval(interval);
// }
// function getURLHashVars() {
//   var vars = {},
//     hash;
//   if (window.location.href.indexOf("#") > 0) {
//     var hashes = window.location.href
//       .slice(window.location.href.indexOf("#") + 1)
//       .split("&");
//     for (var i = 0; i < hashes.length; i++) {
//       hash = hashes[i].split("=");
//       vars[hash[0]] = hash[1];
//     }
//   }
//   return vars;
// }
// function starveTimerInit() {
//   console.log("starveTimerInit()");
//   starveTimer = new StarveTimer(totalFood, creature);
//   $(".starveTimer .maxFood").on("keyup change", function (e) {
//     var newVal = $(e.target).val();
//     if (isNaN(newVal)) {
//     } else {
//       starveTimer.updateMax(newVal);
//     }
//   });
//   $(".starveTimer .currentFood").on("keyup change", function (e) {
//     var newVal = $(e.target).val();
//     if (isNaN(newVal)) {
//     } else {
//       starveTimer.updateCurrent(newVal);
//     }
//   });
//   $(".starveTimer .alarm").on("keyup change", function (e) {
//     var newVal = $(e.target).val();
//     if (isNaN(newVal)) {
//     } else {
//       starveTimer.updateAlarm(newVal);
//     }
//   });
//   $(".starveTimer .timerStart").click(function (e) {
//     starveTimer.toggleTimer();
//   });
//   $(".starveNote").shorten({
//     moreText: "(read more)",
//     lessText: "(read less)",
//     showChars: 61,
//   });
// }
// function StarveTimer(totalFood, creature) {
//   var suggestedFood = creature.getEstimatedStat("f", Settings.get("level"));
//   if (typeof suggestedFood != "number") {
//     suggestedFood = 500;
//   }
//   this.maxFood = suggestedFood;
//   this.currentFood = suggestedFood;
//   this.currentFoodTotal = totalFood;
//   this.creature = creature;
//   this.totalFood = totalFood;
//   this.alarm = 5;
//   this.hasAlarmed = false;
//   this.timerOn = false;
//   this.collapsed = true;
//   this.foodRate = this.creature.foodBase * this.creature.foodMult;
//   timer = null;
//   this.updateEstimatedFood = function () {
//     var suggestedFood = creature.getEstimatedStat("f", Settings.get("level"));
//     if (typeof suggestedFood != "number") {
//       suggestedFood = 500;
//     }
//     this.maxFood = suggestedFood;
//     this.currentFood = suggestedFood;
//   };
//   this.starveSecsLeft = function () {
//     var timedfoodamount = Math.min(this.totalFood, this.maxFood);
//     var starveSecsLeft =
//       (timedfoodamount - (this.maxFood - this.currentFood)) /
//       this.foodRate /
//       Settings.get("consumptionMultiplier");
//     return Math.max(starveSecsLeft, 0);
//   };
//   this.tameSecsLeft = function () {
//     var tameSecsLeft =
//       (this.totalFood - (this.maxFood - this.currentFood)) /
//       this.foodRate /
//       Settings.get("consumptionMultiplier");
//     return Math.max(tameSecsLeft, 0);
//   };
//   this.starveTimerPercent = function () {
//     var starveTimerPercent =
//       Math.round((this.maxFood / this.totalFood) * 1000) / 10;
//     if (isNaN(starveTimerPercent) || starveTimerPercent > 100) {
//       starveTimerPercent = 100;
//     }
//     return starveTimerPercent;
//   };
//   this.tameTimerPercent = function () {
//     var tameTimerPercent =
//       Math.round((this.currentFoodTotal / this.totalFood) * 1000) / 10;
//     if (isNaN(tameTimerPercent)) {
//       tameTimerPercent = 100;
//     }
//     return Math.max(Math.min(tameTimerPercent, 100), 0);
//   };
//   this.toggleTimer = function () {
//     if (this.timerOn == false) {
//       lowbeep.play((success) => {});
//       this.activateTimer(true);
//     } else {
//       this.activateTimer(false);
//     }
//   };
//   (this.activateTimer = function (turnOn = true) {
//     if (turnOn == true) {
//       var secsLeft = Math.round(parseInt(this.tameSecsLeft));
//       var currentTime = Math.round(Date.now() / 1000);
//       var finishTime = currentTime + secsLeft;
//       this.finishTime = finishTime;
//       var checkFood = parseInt(this.currentFood);
//       if (isNaN(checkFood)) {
//         this.currentFood = 0;
//       }
//       checkFood = parseInt(this.maxFood);
//       if (isNaN(checkFood)) {
//         this.maxFood = 0;
//       }
//       if (this.currentFood > this.maxFood) {
//         this.currentFood = this.maxFood;
//       }
//       if (this.currentFoodTotal > this.totalFood) {
//         this.currentFoodTotal = this.totalFood;
//       }
//       this.timerOn = true;
//       lowbeep.play();
//       this.runTimer();
//     } else {
//       this.timerOn = false;
//       this.alarming = false;
//       this.hasAlarmed = false;
//       clearInterval(this.timer);
//       this.timer = null;
//       this.update();
//     }
//     if (this.timerOn) {
//       $(".starveTimer .timerStart").html("Pause Timer");
//     } else {
//       $(".starveTimer .timerStart").html("Start Timer");
//     }
//   }),
//     (this.depleteTimer = function (firstPass = false) {
//       console.log("depleteTimer()");
//       var newFood =
//         this.currentFood -
//         this.foodRate * Settings.get("consumptionMultiplier");
//       var newFoodTotal =
//         this.currentFoodTotal -
//         this.foodRate * Settings.get("consumptionMultiplier");
//       if (Math.round(newFoodTotal) <= 0) {
//         newFood = 0;
//         newFoodTotal = 0;
//         this.currentFood = newFood;
//         this.currentFoodTotal = newFoodTotal;
//         this.playAlarm("dododeath");
//         this.activateTimer(false);
//       } else {
//         this.currentFood = newFood;
//         this.currentFoodTotal = newFoodTotal;
//         var secsLeft = Math.round(parseInt(this.starveSecsLeft()));
//         if (secsLeft <= parseInt(this.alarm) * 60) {
//           this.alarming = true;
//           if (this.hasAlarmed == false) {
//             this.hasAlarmed = true;
//             if (!firstPass) {
//               dodo.play();
//             }
//           }
//         } else {
//           this.alarming = false;
//         }
//       }
//       this.update();
//     }),
//     (this.runTimer = function () {
//       if (this.timer == null) {
//         this.timer = setInterval(() => {
//           this.depleteTimer();
//         }, 1000);
//         this.depleteTimer(true);
//       }
//     }),
//     (this.updateAlarm = function (value) {
//       var newVal = parseInt(value);
//       if (isNaN(newVal)) {
//         newVal = 0;
//       }
//       this.alarm = newVal;
//       this.update();
//     }),
//     (this.updateTotalFood = function (value) {
//       var newVal = parseFloat(value);
//       if (isNaN(newVal)) {
//         newVal = 0;
//       }
//       this.totalFood = newVal;
//       this.currentFoodTotal =
//         this.totalFood - (this.maxFood - this.currentFood);
//       this.update();
//     }),
//     (this.updateMax = function (value) {
//       var newVal = parseFloat(value);
//       if (!isNumericAndNotZero(newVal) || isPartialFloat(value)) {
//         return;
//       }
//       this.maxFood = newVal;
//       this.currentFoodTotal =
//         this.totalFood - (this.maxFood - this.currentFood);
//       if (this.timerOn == true) {
//         this.activateTimer(false);
//       }
//       this.update();
//     });
//   this.updateCurrent = function (value) {
//     var newVal = parseFloat(value);
//     if (isNaN(newVal) || isPartialFloat(value)) {
//       return;
//     } else {
//       if (newVal > this.maxFood) {
//         newVal = this.maxFood;
//       }
//       this.currentFoodTotal = this.totalFood - (this.maxFood - newVal);
//     }
//     this.currentFood = newVal;
//     if (this.timerOn == true) {
//       this.activateTimer(false);
//     }
//     this.update();
//   };
//   this.update = function () {
//     var currentFoodTotal = Math.max(
//       0,
//       Math.round(this.currentFoodTotal * 10) / 10
//     );
//     $(".starveTimer .currentFood").val(Math.round(this.currentFood * 10) / 10);
//     $(".starveTimer .maxFood").val(this.maxFood);
//     $(".starveTimer .meterStatus").text(currentFoodTotal);
//     $(".starveTimer .maxUnits").text(Math.round(this.totalFood * 10) / 10);
//     $(".starveTimer .tameSecsLeft").text(timeFormat(this.tameSecsLeft()));
//     $(".starveTimer .starveSecsLeft").text(timeFormat(this.starveSecsLeft()));
//     if (this.maxFood <= this.totalFood) {
//       $(".starveTimer").addClass("hasStarveMeter");
//     } else {
//       $(".starveTimer").removeClass("hasStarveMeter");
//     }
//     if (this.hasAlarmed) {
//       $(".starveTimer").addClass("alarming");
//     } else {
//       $(".starveTimer").removeClass("alarming");
//     }
//     $(".starveTimer .miniBar, .starveTimer .meterStatus").css(
//       "width",
//       this.tameTimerPercent() + "%"
//     );
//     var starveTimerPercent = this.starveTimerPercent();
//     if (starveTimerPercent > 50) {
//       $(".starveTimer .starveMeter").css("width", starveTimerPercent + "%");
//       $(".starveTimer .starveMeter").addClass("starveMeterRight");
//     } else {
//       $(".starveTimer .starveMeter").css(
//         "width",
//         100 - starveTimerPercent + "%"
//       );
//       $(".starveTimer .starveMeter").removeClass("starveMeterRight");
//     }
//   };
// }
