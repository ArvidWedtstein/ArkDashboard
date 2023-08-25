console.time("normal");
const TheIsland = require("./web/public/ResourcesTheIsland.json");
const Valguero = require("./web/public/ResourcesValguero.json");
const Ragnarok = require("./web/public/ResourcesRagnarok.json");
const Aberration = require("./web/public/ResourcesAberration.json");
const ScorchedEarth = require("./web/public/ResourcesScorchedEarth.json");
const LostIsland = require("./web/public/ResourcesLostIsland.json");
const loot = require("./web/public/loot_crates.json");

const itemarray = [
  {
    id: 1431,
    name: "Chibi Tropeognathus",
    blueprint: "PrimalItemSkin_ChibiDino_Tropeognathus_C",
  },
  {
    id: 1432,
    name: "Chibi Shadowmane",
    blueprint: "PrimalItemSkin_ChibiDino_Shadowmane_C",
  },
  {
    id: 1433,
    name: "Chibi Straw Hat Otter",
    blueprint: "PrimalItemSkin_ChibiDino_StrawHatOtter_C",
  },
  {
    id: 1434,
    name: "Chibi Sabertooth",
    blueprint: "PrimalItemSkin_ChibiDino_Sabertooth_C",
  },
  {
    id: 1435,
    name: "Chibi Unicorn",
    blueprint: "PrimalItemSkin_ChibiDino_Unicorn_C",
  },
  {
    id: 1436,
    name: "Chibi Skeletal Quetzal",
    blueprint: "PrimalItemSkin_ChibiDino_SkeletalQuetzal_C",
  },
  {
    id: 1437,
    name: "Chibi Troodon",
    blueprint: "PrimalItemSkin_ChibiDino_Troodon_C",
  },
  {
    id: 1477,
    name: "Chibi Achatina",
    blueprint: "PrimalItemSkin_ChibiDino_Achatina_C",
  },
  {
    id: 1478,
    name: "Chibi Skeletal Brontosaurus",
    blueprint: "PrimalItemSkin_ChibiDino_SkeletalBrontosaurus_C",
  },
  {
    id: 1410,
    name: "Chibi Oviraptor",
    blueprint: "PrimalItemSkin_ChibiDino_Oviraptor_C",
  },
  {
    id: 1411,
    name: "Chibi Pulmonoscorpius",
    blueprint: "PrimalItemSkin_ChibiDino_Pulmonoscorpius_C",
  },
  {
    id: 1412,
    name: "Chibi Procoptodon",
    blueprint: "PrimalItemSkin_ChibiDino_Procoptodon_C",
  },
  {
    id: 1475,
    name: "Chibi Featherlight",
    blueprint: "PrimalItemSkin_ChibiDino_Featherlight_C",
  },
  {
    id: 1476,
    name: "Chibi Plesiosaur",
    blueprint: "PrimalItemSkin_ChibiDino_Plesiosaur_C",
  },
  {
    id: 1345,
    name: "Nameless Venom",
    blueprint: "PrimalItemConsumable_NamelessVenom_C",
  },
  { id: 1318, name: "Summon\nDodoRex", blueprint: null },
  {
    id: 241,
    name: "Longrass Seed",
    blueprint: "PrimalItemConsumable_Seed_Longrass_C",
  },
  {
    id: 275,
    name: "Mejoberry Seed",
    blueprint: "PrimalItemConsumable_Seed_Mejoberry_C",
  },
  {
    id: 273,
    name: "Narcoberry Seed",
    blueprint: "PrimalItemConsumable_Seed_Narcoberry_C",
  },
  {
    id: 238,
    name: "Rockarrot Seed",
    blueprint: "PrimalItemConsumable_Seed_Rockarrot_C",
  },
  {
    id: 240,
    name: "Savoroot Seed",
    blueprint: "PrimalItemConsumable_Seed_Savoroot_C",
  },
  { id: 1501, name: "Purple Coloring", blueprint: "PrimalItemDye_Magenta_C" },
  {
    id: 1347,
    name: "Alpha Basilisk Fang",
    blueprint: "PrimalItemResource_ApexDrop_Basilisk_Alpha_C",
  },
  { id: 1502, name: "Mistletoe", blueprint: "PrimalItemResource_MistleToe_C" },
  {
    id: 1348,
    name: "Basilisk Scale",
    blueprint: "PrimalItemResource_ApexDrop_Basilisk_C",
  },
  { id: 1503, name: "Coal", blueprint: "PrimalItemResource_Coal_C" },
  {
    id: 1349,
    name: "Rock Drake Feather",
    blueprint: "PrimalItemResource_ApexDrop_RockDrake_C",
  },
  {
    id: 1504,
    name: "Chibi Maewing",
    blueprint: "PrimalItemSkin_ChibiDino_Maewing_C",
  },
  {
    id: 1505,
    name: "Scrap Metal Ingot",
    blueprint: "PrimalItemResource_ScrapMetalIngot_C",
  },
  {
    id: 1506,
    name: "Dino Candy Corn",
    blueprint: "PrimalItemConsumable_FE_Crafted_CandyCorn_C",
  },
  {
    id: 1184,
    name: "Fertilized Tek Raptor Egg",
    blueprint: "PrimalItemConsumable_Egg_Raptor_Fertilized_Bionic_C",
  },
  {
    id: 1507,
    name: "Carno Bone Costume",
    blueprint: "PrimalItemCostume_BoneCarno_C",
  },
  {
    id: 1508,
    name: "Giganotosaurus Bone Costume",
    blueprint: "PrimalItemCostume_BoneGigant_C",
  },
  {
    id: 1509,
    name: "Jerboa Bone Costume",
    blueprint: "PrimalItemCostume_BoneJerboa_C",
  },
  {
    id: 1510,
    name: "Quetzalcoatlus Bone Costume",
    blueprint: "PrimalItemCostume_BoneQuetz_C",
  },
  {
    id: 1511,
    name: "Raptor Bone Costume",
    blueprint: "PrimalItemCostume_BoneRaptor_C",
  },
  {
    id: 1512,
    name: "Rex Bone Costume",
    blueprint: "PrimalItemCostume_BoneRex_C",
  },
  {
    id: 1513,
    name: "Bronto Bone Costume",
    blueprint: "PrimalItemCostume_BoneSauro_C",
  },
  {
    id: 1514,
    name: "Stego Bone Costume",
    blueprint: "PrimalItemCostume_BoneStego_C",
  },
  {
    id: 1515,
    name: "Trike Bone Costume",
    blueprint: "PrimalItemCostume_BoneTrike_C",
  },
  {
    id: 1516,
    name: "Wyvern Bone Costume",
    blueprint: "PrimalItemCostume_BoneWyvern_C",
  },
  {
    id: 1517,
    name: "Dino Witch Hat Skin",
    blueprint: "PrimalItemSkin_DinoWitchHat_C",
  },
  {
    id: 1518,
    name: "ChibiFerox (Large)",
    blueprint: "PrimalItemSkin_ChibiDino_Shapeshifter_Large_C",
  },
  {
    id: 1519,
    name: "ChibiZombie Wyvern",
    blueprint: "PrimalItemSkin_ChibiDino_Wyvern_Zombie_C",
  },
  {
    id: 1520,
    name: "ChibiVoidwyrm",
    blueprint: "PrimalItemSkin_ChibiDino_VoidWyvern_C",
  },
  {
    id: 1521,
    name: "ChibiFestive Noglin",
    blueprint: "PrimalItemSkin_ChibiDino_BrainSlugXmas_C",
  },
  {
    id: 1522,
    name: "ChibiFerox (Small)",
    blueprint: "PrimalItemSkin_ChibiDino_Shapeshifter_Small_C",
  },
  {
    id: 1523,
    name: "ChibiSkeletal Rex",
    blueprint: "PrimalItemSkin_ChibiDino_Rex_Bone_C",
  },
  {
    id: 1524,
    name: "ChibiSkeletal Raptor",
    blueprint: "PrimalItemSkin_ChibiDino_Raptor_Bone_C",
  },
  {
    id: 1525,
    name: "WhiteCollar Kairuku Chibi",
    blueprint: "PrimalItemSkin_ChibiDino_TophatKairuku_C",
  },
  {
    id: 1526,
    name: "ChibiCrystal Wyvern",
    blueprint: "PrimalItemSkin_ChibiDino_WyvernCrystal_C",
  },
  {
    id: 1527,
    name: "ChibiDeal With It Dodo",
    blueprint: "PrimalItemSkin_ChibiDino_DodoDealWithIt_C",
  },
  {
    id: 1528,
    name: "ChibiLovebird",
    blueprint: "PrimalItemSkin_ChibiDino_LoveBird_C",
  },
  {
    id: 1529,
    name: "ChibiSpooky Bulbdog",
    blueprint: "PrimalItemSkin_ChibiDino_Bulbdog_Pumpkin_C",
  },
  {
    id: 1530,
    name: "ChibiSabertooth",
    blueprint: "PrimalItemSkin_ChibiDino_Saber_C",
  },
  {
    id: 1531,
    name: "PairoSaurs Chibi",
    blueprint: "PrimalItemSkin_ChibiDino_Pairosaurs_VDay_C",
  },
  {
    id: 1532,
    name: "ChibiSkeletal Brontosaurus",
    blueprint: "PrimalItemSkin_ChibiDino_Bronto_Bone_C",
  },
  {
    id: 1533,
    name: "ChibiSkeletal Trike",
    blueprint: "PrimalItemSkin_ChibiDino_Trike_Bone_C",
  },
  {
    id: 1534,
    name: "ChibiSkeletal Jerboa",
    blueprint: "PrimalItemSkin_ChibiDino_Jerboa_Bone_C",
  },
  {
    id: 1535,
    name: "ChibiStraw Hat Otter",
    blueprint: "PrimalItemSkin_ChibiDino_OtterStrawHat_C",
  },
  {
    id: 1536,
    name: "ChibiCarcharodontosaurus",
    blueprint: "PrimalItemSkin_ChibiDino_Carcha_C",
  },
  {
    id: 1537,
    name: "ChibiFestive Bulbdog (Green)",
    blueprint: "PrimalItemSkin_ChibiDino_Bulbdog_FestiveG_C",
  },
  {
    id: 1538,
    name: "ChibiFestive Featherlight (Red)",
    blueprint: "PrimalItemSkin_ChibiDino_Featherlight_FestiveR_C",
  },
  {
    id: 1539,
    name: "ChibiFestive Glowtail (Green)",
    blueprint: "PrimalItemSkin_ChibiDino_Glowtail_FestiveG_C",
  },
  {
    id: 1540,
    name: "ChibiFestive Shinehorn (Red)",
    blueprint: "PrimalItemSkin_ChibiDino_Shinehorn_FestiveR_C",
  },
  {
    id: 1541,
    name: "Teeny Tiny Titano",
    blueprint: "PrimalItemSkin_ChibiDino_Titano_C",
  },
  {
    id: 1542,
    name: "ChibiAstrodelphis",
    blueprint: "PrimalItemSkin_ChibiDino_Astrodelphis_C",
  },
  {
    id: 1543,
    name: "ChibiGhost Mantis",
    blueprint: "PrimalItemSkin_ChibiDino_MantisGhost_C",
  },
  {
    id: 1544,
    name: "ChibiFjordhawk",
    blueprint: "PrimalItemSkin_ChibiDino_Fjordhawk_C",
  },
  {
    id: 1545,
    name: "ChibiDiplodocus",
    blueprint: "PrimalItemSkin_ChibiDino_Diplodocus_C",
  },
  {
    id: 1546,
    name: "ChibiRollrat",
    blueprint: "PrimalItemSkin_ChibiDino_MoleRat_C",
  },
  {
    id: 1547,
    name: "ChibiTerror Bird",
    blueprint: "PrimalItemSkin_ChibiDino_TerrorBird_C",
  },
  {
    id: 1548,
    name: "ChibiParasaur",
    blueprint: "PrimalItemSkin_ChibiDino_Parasaur_C",
  },
  {
    id: 1549,
    name: "ChibiParaceratherium",
    blueprint: "PrimalItemSkin_ChibiDino_Paraceratherium_C",
  },
  {
    id: 1550,
    name: "ChibiAmargasaurus",
    blueprint: "PrimalItemSkin_ChibiDino_Amarga_C",
  },
  {
    id: 1551,
    name: "ChibiDilophosaur",
    blueprint: "PrimalItemSkin_ChibiDino_Dilophosaur_C",
  },
  {
    id: 1552,
    name: "ChibiPachy",
    blueprint: "PrimalItemSkin_ChibiDino_Pachy_C",
  },
  { id: 1553, name: "Witch Hat Skin", blueprint: "PrimalItemSkin_WitchHat_C" },
  {
    id: 1554,
    name: "Vampire Eyes Skin",
    blueprint: "PrimalItemSkin_VampireEyes_C",
  },
  {
    id: 1555,
    name: "Werewolf Mask Skin",
    blueprint: "PrimalItemSkin_WerewolfHat_C",
  },
  {
    id: 1556,
    name: "Clown Mask Skin",
    blueprint: "PrimalItemSkin_ClownMask_C",
  },
  {
    id: 1557,
    name: "DodoRex Mask Skin",
    blueprint: "PrimalItemSkin_DodorexMask_C",
  },
  {
    id: 1558,
    name: "DodoWyvern Mask Skin",
    blueprint: "PrimalItemSkin_DodowyvernHat_C",
  },
  {
    id: 1559,
    name: "Trike Bone Helmet Skin",
    blueprint: "PrimalItemSkin_TrikeSkullHelmet_C",
  },
  {
    id: 1560,
    name: "Rex Bone Helmet Skin",
    blueprint: "PrimalItemSkin_BoneHelmet_C",
  },
  {
    id: 1561,
    name: "Scorched Spike Skin",
    blueprint: "PrimalItemSkin_ScorchedSpear_C",
  },
  {
    id: 1562,
    name: "Scorched Torch Skin",
    blueprint: "PrimalItemSkin_TorchScorched_C",
  },
  {
    id: 1563,
    name: "Scorched Sword Skin",
    blueprint: "PrimalItemSkin_ScorchedSword_C",
  },
  {
    id: 1346,
    name: "Alpha Karkinos Claw",
    blueprint: "PrimalItemResource_ApexDrop_CrabClaw_C",
  },
  { id: 1350, name: "Chili Helmet Skin", blueprint: "PrimalItemSkin_Chili_C" },
  {
    id: 1211,
    name: "Fertilized Aberrant Trike Egg",
    blueprint: "PrimalItemConsumable_Egg_Trike_Fertilized_Aberrant_C",
  },
  {
    id: 378,
    name: "Canteen",
    blueprint: "PrimalItemConsumable_CanteenCraftable_C",
  },
  {
    id: 1357,
    name: "Chibi Ammonite",
    blueprint: "PrimalItemSkin_ChibiDino_Ammonite_C",
  },
  {
    id: 1372,
    name: "Chibi Dunkleosteus",
    blueprint: "PrimalItemSkin_ChibiDino_Dunkleosteus_C",
  },
  { id: 1012, name: "Slate Coloring", blueprint: "PrimalItemDye_Slate_C" },
  { id: 482, name: "Propellant", blueprint: "PrimalItemResource_Propellant_C" },
  {
    id: 1098,
    name: "Archaeopteryx Egg",
    blueprint: "PrimalItemConsumable_Egg_Archa_C",
  },
  {
    id: 1112,
    name: "Fertilized Carcharodontosaurus Egg",
    blueprint: "PrimalItemConsumable_Egg_Carcha_Fertilized_C",
  },
  {
    id: 1344,
    name: "Alpha Reaper King Barb",
    blueprint: "PrimalItemResource_ApexDrop_ReaperBarb_C",
  },
  {
    id: 691,
    name: "Medium Wood Elevator Platform",
    blueprint: "PrimalItemStructure_WoodElevatorPlatform_Medium_C",
  },
  {
    id: 979,
    name: "Plant Species Z Seed",
    blueprint: "PrimalItemConsumable_Seed_PlantSpeciesZ_C",
  },
  { id: 757, name: "Gacha Saddle", blueprint: "PrimalItemArmor_GachaSaddle_C" },
  { id: 480, name: "Raw Salt", blueprint: "PrimalItemResource_RawSalt_C" },
  { id: 348, name: "Carno Egg", blueprint: "PrimalItemConsumable_Egg_Carno_C" },
  {
    id: 1113,
    name: "Fertilized Carno Egg",
    blueprint: "PrimalItemConsumable_Egg_Carno_Fertilized_C",
  },
  {
    id: 1114,
    name: "Fertilized Aberrant Carno Egg",
    blueprint: "PrimalItemConsumable_Egg_Carno_Fertilized_Aberrant_C",
  },
  {
    id: 1115,
    name: "Compy Egg",
    blueprint: "PrimalItemConsumable_Egg_Compy_C",
  },
  {
    id: 1116,
    name: "Fertilized Compy Egg",
    blueprint: "PrimalItemConsumable_Egg_Compy_Fertilized_C",
  },
  { id: 349, name: "Dilo Egg", blueprint: "PrimalItemConsumable_Egg_Dilo_C" },
  {
    id: 1117,
    name: "Fertilized Dilo Egg",
    blueprint: "PrimalItemConsumable_Egg_Dilo_Fertilized_C",
  },
  {
    id: 822,
    name: "Ice Titan Saddle",
    blueprint: "PrimalItemArmor_IceKaiju_C",
  },
  {
    id: 1118,
    name: "Dimetrodon Egg",
    blueprint: "PrimalItemConsumable_Egg_Dimetrodon_C",
  },
  {
    id: 1119,
    name: "Fertilized Dimetrodon Egg",
    blueprint: "PrimalItemConsumable_Egg_Dimetrodon_Fertilized_C",
  },
  {
    id: 1120,
    name: "Fertilized Aberrant Dimetrodon Egg",
    blueprint: "PrimalItemConsumable_Egg_Dimetrodon_Fertilized_Aberrant_C",
  },
  {
    id: 1121,
    name: "Dimorph Egg",
    blueprint: "PrimalItemConsumable_Egg_Dimorph_C",
  },
  {
    id: 1124,
    name: "Diplo Egg",
    blueprint: "PrimalItemConsumable_Egg_Diplo_C",
  },
  {
    id: 1125,
    name: "Fertilized Diplo Egg",
    blueprint: "PrimalItemConsumable_Egg_Diplo_Fertilized_C",
  },
  {
    id: 1126,
    name: "Fertilized Aberrant Diplo Egg",
    blueprint: "PrimalItemConsumable_Egg_Diplo_Fertilized_Aberrant_C",
  },
  { id: 294, name: "Dodo Egg", blueprint: "PrimalItemConsumable_Egg_Dodo_C" },
  {
    id: 1127,
    name: "Fertilized Dodo Egg",
    blueprint: "PrimalItemConsumable_Egg_Dodo_Fertilized_C",
  },
  {
    id: 1128,
    name: "Fertilized Aberrant Dodo Egg",
    blueprint: "PrimalItemConsumable_Egg_Dodo_Fertilized_Aberrant_C",
  },
  {
    id: 754,
    name: "Snow Owl Saddle",
    blueprint: "PrimalItemArmor_OwlSaddle_C",
  },
  {
    id: 1129,
    name: "Gallimimus Egg",
    blueprint: "PrimalItemConsumable_Egg_Galli_C",
  },
  {
    id: 1428,
    name: "Chibi Thylacoleo",
    blueprint: "PrimalItemSkin_ChibiDino_Thylacoleo_C",
  },
  {
    id: 1429,
    name: "Chibi Skeletal Wyvern",
    blueprint: "PrimalItemSkin_ChibiDino_SkeletalWyvern_C",
  },
  {
    id: 1130,
    name: "Fertilized Gallimimus Egg",
    blueprint: "PrimalItemConsumable_Egg_Galli_Fertilized_C",
  },
  {
    id: 1461,
    name: "Chibi Rock Drake",
    blueprint: "PrimalItemSkin_ChibiDino_RockDrake_C",
  },
  {
    id: 1462,
    name: "Chibi Kentrosaurus",
    blueprint: "PrimalItemSkin_ChibiDino_Kentrosaurus_C",
  },
  {
    id: 1463,
    name: "Chibi Bulbdog",
    blueprint: "PrimalItemSkin_ChibiDino_Bulbdog_C",
  },
  {
    id: 1131,
    name: "Giganotosaurus Egg",
    blueprint: "PrimalItemConsumable_Egg_Gigant_Bionic_C",
  },
  {
    id: 1243,
    name: "Rock Golem Saddle",
    blueprint: "PrimalItemArmor_RockGolemSaddle_C",
  },
  {
    id: 572,
    name: "Thorny Dragon Saddle",
    blueprint: "PrimalItemArmor_SpineyLizardSaddle_C",
  },
  {
    id: 1133,
    name: "Fertilized Giganotosaurus Egg",
    blueprint: "PrimalItemConsumable_Egg_Gigant_Fertilized_C",
  },
  {
    id: 1134,
    name: "Fertilized Tek Giganotosaurus Egg",
    blueprint: "PrimalItemConsumable_Egg_Gigant_Fertilized_Bionic_C",
  },
  {
    id: 1135,
    name: "Hesperornis Egg",
    blueprint: "PrimalItemConsumable_Egg_Hesperonis_C",
  },
  {
    id: 1136,
    name: "Fertilized Hesperornis Egg",
    blueprint: "PrimalItemConsumable_Egg_Hesperonis_Fertilized_C",
  },
  {
    id: 871,
    name: "Metal Ocean Platform",
    blueprint: "PrimalItemStructure_Metal_OceanPlatform_C",
  },
  {
    id: 1137,
    name: "Golden Hesperornis Egg",
    blueprint: "PrimalItemConsumable_Egg_Hesperonis_Golden_C",
  },
  {
    id: 1138,
    name: "Ichthyornis Egg",
    blueprint: "PrimalItemConsumable_Egg_Ichthyornis_C",
  },
  {
    id: 1139,
    name: "Fertilized Ichthyornis Egg",
    blueprint: "PrimalItemConsumable_Egg_Ichthyornis_Fertilized_C",
  },
  {
    id: 774,
    name: "Superior Kibble",
    blueprint: "PrimalItemConsumable_Kibble_Base_Large_C",
  },
  {
    id: 755,
    name: "Velonasaur Saddle",
    blueprint: "PrimalItemArmor_SpindlesSaddle_C",
  },
  {
    id: 1140,
    name: "Iguanodon Egg",
    blueprint: "PrimalItemConsumable_Egg_Iguanodon_C",
  },
  {
    id: 1312,
    name: "Summon Alpha King Titan",
    blueprint: "PrimalItem_BossTribute_KingKaijuHard_C",
  },
  { id: 124, name: "Stimulant", blueprint: "PrimalItemConsumable_Stimulant_C" },
  {
    id: 1141,
    name: "Fertilized Iguanodon Egg",
    blueprint: "PrimalItemConsumable_Egg_Iguanodon_Fertilized_C",
  },
  {
    id: 1142,
    name: "Fertilized Aberrant Iguanodon Egg",
    blueprint: "PrimalItemConsumable_Egg_Iguanodon_Fertilized_Aberrant_C",
  },
  {
    id: 1143,
    name: "Kairuku Egg",
    blueprint: "PrimalItemConsumable_Egg_Kairuku_C",
  },
  { id: 599, name: "Wall Torch", blueprint: "PrimalItemStructure_WallTorch_C" },
  {
    id: 1144,
    name: "Fertilized Kairuku Egg",
    blueprint: "PrimalItemConsumable_Egg_Kairuku_Fertilized_C",
  },
  {
    id: 1145,
    name: "Kaprosuchus Egg",
    blueprint: "PrimalItemConsumable_Egg_Kaprosuchus_C",
  },
  {
    id: 1146,
    name: "Fertilized Kaprosuchus Egg",
    blueprint: "PrimalItemConsumable_Egg_Kaprosuchus_Fertilized_C",
  },
  {
    id: 1147,
    name: "Kentro Egg",
    blueprint: "PrimalItemConsumable_Egg_Kentro_C",
  },
  {
    id: 1148,
    name: "Fertilized Kentro Egg",
    blueprint: "PrimalItemConsumable_Egg_Kentro_Fertilized_C",
  },
  {
    id: 541,
    name: "Megalosaurus Saddle",
    blueprint: "PrimalItemArmor_MegalosaurusSaddle_C",
  },
  {
    id: 1149,
    name: "Lystro Egg",
    blueprint: "PrimalItemConsumable_Egg_Lystro_C",
  },
  {
    id: 1150,
    name: "Fertilized Lystrosaurus Egg",
    blueprint: "PrimalItemConsumable_Egg_Lystro_Fertilized_C",
  },
  {
    id: 1151,
    name: "Fertilized Aberrant Lystrosaurus Egg",
    blueprint: "PrimalItemConsumable_Egg_Lystro_Fertilized_Aberrant_C",
  },
  { id: 1496, name: "Oil Vein", blueprint: null },
  {
    id: 1152,
    name: "Megalania Egg",
    blueprint: "PrimalItemConsumable_Egg_Megalania_C",
  },
  {
    id: 1153,
    name: "Fertilized Megalania Egg",
    blueprint: "PrimalItemConsumable_Egg_Megalania_Fertilized_C",
  },
  {
    id: 1154,
    name: "Fertilized Aberrant Megalania Egg",
    blueprint: "PrimalItemConsumable_Egg_Megalania_Fertilized_Aberrant_C",
  },
  {
    id: 1155,
    name: "Megalosaurus Egg",
    blueprint: "PrimalItemConsumable_Egg_Megalosaurus_C",
  },
  {
    id: 1156,
    name: "Fertilized Megalosaurus Egg",
    blueprint: "PrimalItemConsumable_Egg_Megalosaurus_Fertilized_C",
  },
  {
    id: 1157,
    name: "Fertilized Aberrant Megalosaurus Egg",
    blueprint: "PrimalItemConsumable_Egg_Megalosaurus_Fertilized_Aberrant_C",
  },
  {
    id: 1158,
    name: "Microraptor Egg",
    blueprint: "PrimalItemConsumable_Egg_MicroRaptor_C",
  },
  {
    id: 1159,
    name: "Fertilized Microraptor Egg",
    blueprint: "PrimalItemConsumable_Egg_MicroRaptor_Fertilized_C",
  },
  {
    id: 1160,
    name: "Moschops Egg",
    blueprint: "PrimalItemConsumable_Egg_Moschops_C",
  },
  {
    id: 1161,
    name: "Fertilized Moschops Egg",
    blueprint: "PrimalItemConsumable_Egg_Moschops_Fertilized_C",
  },
  { id: 1497, name: "Gas Vein", blueprint: null },
  {
    id: 1162,
    name: "Fertilized Aberrant Moschops Egg",
    blueprint: "PrimalItemConsumable_Egg_Moschops_Fertilized_Aberrant_C",
  },
  {
    id: 1163,
    name: "Oviraptor Egg",
    blueprint: "PrimalItemConsumable_Egg_Oviraptor_C",
  },
  {
    id: 1164,
    name: "Fertilized Oviraptor Egg",
    blueprint: "PrimalItemConsumable_Egg_Oviraptor_Fertilized_C",
  },
  {
    id: 418,
    name: "pachycephalosaurus Egg",
    blueprint: "PrimalItemConsumable_Egg_Pachy_C",
  },
  {
    id: 1165,
    name: "Fertilized Pachyrhino Egg",
    blueprint: "PrimalItemConsumable_Egg_PachyRhino_Fertilized_C",
  },
  {
    id: 1166,
    name: "Fertilized Pachycephalosaurus Egg",
    blueprint: "PrimalItemConsumable_Egg_Pachy_Fertilized_C",
  },
  {
    id: 1167,
    name: "Pachyrhino Egg",
    blueprint: "PrimalItemConsumable_Egg_Pachyrhino_C",
  },
  {
    id: 289,
    name: "Parasaur Egg",
    blueprint: "PrimalItemConsumable_Egg_Para_C",
  },
  {
    id: 382,
    name: "Behemoth Reinforced Dinosaur Gate",
    blueprint: "PrimalItemStructure_StoneGateLarge_C",
  },
  {
    id: 1168,
    name: "Tek Parasaur Egg",
    blueprint: "PrimalItemConsumable_Egg_Para_Bionic_C",
  },
  {
    id: 818,
    name: "Unassembled Enforcer",
    blueprint: "PrimalItem_Spawner_Enforcer_C",
  },
  {
    id: 1169,
    name: "Fertilized Parasaur Egg",
    blueprint: "PrimalItemConsumable_Egg_Para_Fertilized_C",
  },
  {
    id: 1170,
    name: "Fertilized Aberrant Parasaur Egg",
    blueprint: "PrimalItemConsumable_Egg_Para_Fertilized_Aberrant_C",
  },
  {
    id: 1171,
    name: "Fertilized Tek Parasaur Egg",
    blueprint: "PrimalItemConsumable_Egg_Para_Fertilized_Bionic_C",
  },
  {
    id: 836,
    name: "Fertilized Snow Owl Egg",
    blueprint: "PrimalItemConsumable_Egg_Owl_Fertilized_C",
  },
  {
    id: 1172,
    name: "Pegomastax Egg",
    blueprint: "PrimalItemConsumable_Egg_Pegomastax_C",
  },
  {
    id: 1173,
    name: "Fertilized Pegomastax Egg",
    blueprint: "PrimalItemConsumable_Egg_Pegomastax_Fertilized_C",
  },
  {
    id: 1174,
    name: "Pelagornis Egg",
    blueprint: "PrimalItemConsumable_Egg_Pela_C",
  },
  {
    id: 1175,
    name: "Fertilized Pelagornis Egg",
    blueprint: "PrimalItemConsumable_Egg_Pela_Fertilized_C",
  },
  {
    id: 350,
    name: "Pteranodon Egg",
    blueprint: "PrimalItemConsumable_Egg_Ptero_C",
  },
  {
    id: 1176,
    name: "Fertilized Pteranodon Egg",
    blueprint: "PrimalItemConsumable_Egg_Ptero_Fertilized_C",
  },
  {
    id: 1177,
    name: "Quetzal Egg",
    blueprint: "PrimalItemConsumable_Egg_Quetz_C",
  },
  { id: 756, name: "Dino Leash", blueprint: "PrimalItemStructure_DinoLeash_C" },
  {
    id: 1178,
    name: "Tek Quetzal Egg",
    blueprint: "PrimalItemConsumable_Egg_Quetz_Bionic_C",
  },
  { id: 1441, name: "Any Chibi", blueprint: null },
  {
    id: 1179,
    name: "Fertilized Quetzal Egg",
    blueprint: "PrimalItemConsumable_Egg_Quetz_Fertilized_C",
  },
  {
    id: 842,
    name: "Fjordhawk Egg",
    blueprint: "PrimalItemConsumable_Egg_Fjordhawk_C",
  },
  {
    id: 1180,
    name: "Fertilized Tek Quetzal Egg",
    blueprint: "PrimalItemConsumable_Egg_Quetz_Fertilized_Bionic_C",
  },
  {
    id: 290,
    name: "Raptor Egg",
    blueprint: "PrimalItemConsumable_Egg_Raptor_C",
  },
  {
    id: 1271,
    name: "Master Controller Trophy",
    blueprint: "PrimalItemTrophy_MasterController_C",
  },
  {
    id: 1181,
    name: "Tek Raptor Egg",
    blueprint: "PrimalItemConsumable_Egg_Raptor_Bionic_C",
  },
  {
    id: 846,
    name: "Moeder Flag",
    blueprint: "PrimalItemStructure_Flag_EelBoss_C",
  },
  { id: 1342, name: "Fists", blueprint: null },
  {
    id: 847,
    name: "VR Boss Flag",
    blueprint: "PrimalItemStructure_Flag_VRBoss_C",
  },
  {
    id: 1182,
    name: "Fertilized Raptor Egg",
    blueprint: "PrimalItemConsumable_Egg_Raptor_Fertilized_C",
  },
  {
    id: 651,
    name: "Wind Turbine",
    blueprint: "PrimalItemStructure_WindTurbine_C",
  },
  {
    id: 1183,
    name: "Fertilized Aberrant Raptor Egg",
    blueprint: "PrimalItemConsumable_Egg_Raptor_Fertilized_Aberrant_C",
  },
  { id: 1185, name: "Rex Egg", blueprint: "PrimalItemConsumable_Egg_Rex_C" },
  {
    id: 850,
    name: "Flaming Spear",
    blueprint: "PrimalItem_WeaponSpear_Flame_Gauntlet_C",
  },
  {
    id: 1352,
    name: "Otter Mask Skin",
    blueprint: "PrimalItemSkin_OtterMask_C",
  },
  {
    id: 86,
    name: "Wooden Hatchframe",
    blueprint: "PrimalItemStructure_WoodCeilingWithTrapdoor_C",
  },
  {
    id: 1186,
    name: "Tek Rex Egg",
    blueprint: "PrimalItemConsumable_Egg_Rex_Bionic_C",
  },
  {
    id: 1187,
    name: "Fertilized Rex Egg",
    blueprint: "PrimalItemConsumable_Egg_Rex_Fertilized_C",
  },
  {
    id: 1188,
    name: "Fertilized Tek Rex Egg",
    blueprint: "PrimalItemConsumable_Egg_Rex_Fertilized_Bionic_C",
  },
  { id: 351, name: "Sarco Egg", blueprint: "PrimalItemConsumable_Egg_Sarco_C" },
  { id: 1267, name: "Moeder Trophy", blueprint: "PrimalItemTrophy_EelBoss_C" },
  {
    id: 1189,
    name: "Fertilized Sarco Egg",
    blueprint: "PrimalItemConsumable_Egg_Sarco_Fertilized_C",
  },
  {
    id: 1190,
    name: "Fertilized Aberrant Sarco Egg",
    blueprint: "PrimalItemConsumable_Egg_Sarco_Fertilized_Aberrant_C",
  },
  {
    id: 352,
    name: "Pulminoscorpius Egg",
    blueprint: "PrimalItemConsumable_Egg_Scorpion_C",
  },
  {
    id: 465,
    name: "Congealed Gas Ball",
    blueprint: "PrimalItemResource_Gas_C",
  },
  {
    id: 90,
    name: "Wooden Pillar",
    blueprint: "PrimalItemStructure_WoodPillar_C",
  },
  {
    id: 1191,
    name: "Fertilized Pulminoscorpius Egg",
    blueprint: "PrimalItemConsumable_Egg_Scorpion_Fertilized_C",
  },
  {
    id: 1192,
    name: "Fertilized Aberrant Pulminoscorpius Egg",
    blueprint: "PrimalItemConsumable_Egg_Scorpion_Fertilized_Aberrant_C",
  },
  { id: 57, name: "Spear", blueprint: "PrimalItem_WeaponSpear_C" },
  {
    id: 353,
    name: "Araneo Egg",
    blueprint: "PrimalItemConsumable_Egg_Spider_C",
  },
  {
    id: 1193,
    name: "Fertilized Araneo Egg",
    blueprint: "PrimalItemConsumable_Egg_Spider_Fertilized_C",
  },
  {
    id: 1194,
    name: "Fertilized Aberrant Araneo Egg",
    blueprint: "PrimalItemConsumable_Egg_Spider_Fertilized_Aberrant_C",
  },
  { id: 354, name: "Spino Egg", blueprint: "PrimalItemConsumable_Egg_Spino_C" },
  {
    id: 1195,
    name: "Fertilized Spino Egg",
    blueprint: "PrimalItemConsumable_Egg_Spino_Fertilized_C",
  },
  {
    id: 1196,
    name: "Fertilized Aberrant Spino Egg",
    blueprint: "PrimalItemConsumable_Egg_Spino_Fertilized_Aberrant_C",
  },
  {
    id: 1197,
    name: "Stego Egg",
    blueprint: "PrimalItemConsumable_Egg_Stego_C",
  },
  {
    id: 1353,
    name: "Rockwell Flag",
    blueprint: "PrimalItemStructure_Flag_Rockwell_C",
  },
  {
    id: 773,
    name: "Regular Kibble",
    blueprint: "PrimalItemConsumable_Kibble_Base_Medium_C",
  },
  {
    id: 883,
    name: "Federation Exo-Gloves",
    blueprint: "PrimalItemArmor_TekGloves_Gen2_C",
  },
  {
    id: 615,
    name: "Wooden Staircase",
    blueprint: "PrimalItemStructure_WoodStairs_C",
  },
  {
    id: 896,
    name: "R-Dilo Egg",
    blueprint: "PrimalItemConsumable_Egg_Dilo_Gen2_C",
  },
  {
    id: 1198,
    name: "Tek Stego Egg",
    blueprint: "PrimalItemConsumable_Egg_Stego_Bionic_C",
  },
  {
    id: 1199,
    name: "Fertilized Stego Egg",
    blueprint: "PrimalItemConsumable_Egg_Stego_Fertilized_C",
  },
  {
    id: 1200,
    name: "Fertilized Aberrant Stego Egg",
    blueprint: "PrimalItemConsumable_Egg_Stego_Fertilized_Aberrant_C",
  },
  {
    id: 1201,
    name: "Fertilized Tek Stego Egg",
    blueprint: "PrimalItemConsumable_Egg_Stego_Fertilized_Bionic_C",
  },
  { id: 429, name: "Fur Leggings", blueprint: "PrimalItemArmor_FurPants_C" },
  {
    id: 1202,
    name: "Tapejara Egg",
    blueprint: "PrimalItemConsumable_Egg_Tapejara_C",
  },
  {
    id: 1203,
    name: "Fertilized Tapejara Egg",
    blueprint: "PrimalItemConsumable_Egg_Tapejara_Fertilized_C",
  },
  {
    id: 1204,
    name: "Fertilized Terror Bird Egg",
    blueprint: "PrimalItemConsumable_Egg_Terrorbird_Fertilized_C",
  },
  {
    id: 1205,
    name: "Terror Bird Egg",
    blueprint: "PrimalItemConsumable_Egg_Terrorbird_C",
  },
  {
    id: 1206,
    name: "Therizino Egg",
    blueprint: "PrimalItemConsumable_Egg_Therizino_C",
  },
  {
    id: 537,
    name: "Karkinos Saddle",
    blueprint: "PrimalItemArmor_CrabSaddle_C",
  },
  {
    id: 922,
    name: "Basic Maewing Egg",
    blueprint: "PrimalItemConsumable_Egg_MilkGlider_XSmall_C",
  },
  {
    id: 931,
    name: "Loadout Dummy Hotbar",
    blueprint: "PrimalItemStructure_LoadoutDummyHotbar_C",
  },
  {
    id: 1272,
    name: "Rockwell Final Form Trophy",
    blueprint: "PrimalItemTrophy_RockwellGen2_C",
  },
  {
    id: 862,
    name: "Fertilized X-Trike Egg",
    blueprint: "PrimalItemConsumable_Egg_Trike_Fertilized_Volcano_C",
  },
  {
    id: 1351,
    name: "Cute Dino Helmet Skin",
    blueprint: "PrimalItemSkin_DinoCute_C",
  },
  {
    id: 932,
    name: "Tek Surveillance Console",
    blueprint: "PrimalItemStructure_TekSecurityConsole_C",
  },
  {
    id: 946,
    name: "Dire Bear Saddle",
    blueprint: "PrimalItemArmor_DireBearSaddle_C",
  },
  { id: 792, name: "Soap", blueprint: "PrimalItemConsumableSoap_C" },
  {
    id: 120,
    name: "Mejoberry",
    blueprint: "PrimalItemConsumable_Berry_Mejoberry_C",
  },
  { id: 539, name: "Manta Saddle", blueprint: "PrimalItemArmor_MantaSaddle_C" },
  {
    id: 1207,
    name: "Fertilized Therizino Egg",
    blueprint: "PrimalItemConsumable_Egg_Therizino_Fertilized_C",
  },
  {
    id: 1208,
    name: "Trike Egg",
    blueprint: "PrimalItemConsumable_Egg_Trike_C",
  },
  {
    id: 1209,
    name: "Tek Trike Egg",
    blueprint: "PrimalItemConsumable_Egg_Trike_Bionic_C",
  },
  {
    id: 428,
    name: "Megaloceros Saddle",
    blueprint: "PrimalItemArmor_StagSaddle_C",
  },
  {
    id: 122,
    name: "Stimberry",
    blueprint: "PrimalItemConsumable_Berry_Stimberry_C",
  },
  {
    id: 1210,
    name: "Fertilized Trike Egg",
    blueprint: "PrimalItemConsumable_Egg_Trike_Fertilized_C",
  },
  {
    id: 1212,
    name: "Fertilized Tek Trike Egg",
    blueprint: "PrimalItemConsumable_Egg_Trike_Fertilized_Bionic_C",
  },
  {
    id: 1213,
    name: "Troodon Egg",
    blueprint: "PrimalItemConsumable_Egg_Troodon_C",
  },
  {
    id: 1358,
    name: "Chibi Araneo",
    blueprint: "PrimalItemSkin_ChibiDino_Araneo_C",
  },
  {
    id: 1214,
    name: "Fertilized Troodon Egg",
    blueprint: "PrimalItemConsumable_Egg_Troodon_Fertilized_C",
  },
  {
    id: 864,
    name: "Fertilized Bloodstalker Egg",
    blueprint: "PrimalItemConsumable_Egg_BogSpider_Fertilized_C",
  },
  {
    id: 1215,
    name: "Tropeognathus Egg",
    blueprint: "PrimalItemConsumable_Egg_Tropeognathus_C",
  },
  {
    id: 1216,
    name: "Fertilized Tropeognathus Egg",
    blueprint: "PrimalItemConsumable_Egg_Tropeognathus_Fertilized_C",
  },
  {
    id: 542,
    name: "Megalania Saddle",
    blueprint: "PrimalItemArmor_MegalaniaSaddle_C",
  },
  {
    id: 355,
    name: "Turtle Egg",
    blueprint: "PrimalItemConsumable_Egg_Turtle_C",
  },
  {
    id: 805,
    name: "Cooked Fish Meat",
    blueprint: "PrimalItemConsumable_CookedMeat_Fish_C",
  },
  {
    id: 1328,
    name: "Allosaurus Brain",
    blueprint: "PrimalItemResource_ApexDrop_Allo_C",
  },
  {
    id: 1217,
    name: "Fertilized Turtle Egg",
    blueprint: "PrimalItemConsumable_Egg_Turtle_Fertilized_C",
  },
  {
    id: 1218,
    name: "Fertilized Aberrant Turtle Egg",
    blueprint: "PrimalItemConsumable_Egg_Turtle_Fertilized_Aberrant_C",
  },
  {
    id: 1219,
    name: "Wyvern Egg",
    blueprint: "PrimalItemConsumable_Egg_Wyvern_C",
  },
  {
    id: 1220,
    name: "Fertilized Wyvern Egg",
    blueprint: "PrimalItemConsumable_Egg_Wyvern_Fertilized_C",
  },
  {
    id: 1493,
    name: "Tusoteuthis Tentacle",
    blueprint: "PrimalItemResource_ApexDrop_Tuso_C",
  },
  {
    id: 1359,
    name: "Chibi Animated Series Raptor",
    blueprint: "PrimalItemSkin_ChibiDino_AnimatedSeriesRaptor_C",
  },
  {
    id: 1360,
    name: "Chibi Argentavis",
    blueprint: "PrimalItemSkin_ChibiDino_Argentavis_C",
  },
  {
    id: 1221,
    name: "Fertilized Fire Wyvern Egg",
    blueprint: "PrimalItemConsumable_Egg_Wyvern_Fertilized_Fire_C",
  },
  {
    id: 1361,
    name: "Chibi Amargasaurus",
    blueprint: "PrimalItemSkin_ChibiDino_Amargasaurus_C",
  },
  {
    id: 1362,
    name: "Chibi Astrocetus",
    blueprint: "PrimalItemSkin_ChibiDino_Astrocetus_C",
  },
  {
    id: 1363,
    name: "Chibi Castoroides",
    blueprint: "PrimalItemSkin_ChibiDino_Castoroides_C",
  },
  {
    id: 1364,
    name: "Chibi Direwolf",
    blueprint: "PrimalItemSkin_ChibiDino_Direwolf_C",
  },
  {
    id: 1365,
    name: "Chibi Cnidaria",
    blueprint: "PrimalItemSkin_ChibiDino_Cnidaria_C",
  },
  {
    id: 1222,
    name: "Fertilized Lightning Wyvern Egg",
    blueprint: "PrimalItemConsumable_Egg_Wyvern_Fertilized_Lightning_C",
  },
  {
    id: 232,
    name: "Savoroot",
    blueprint: "PrimalItemConsumable_Veggie_Savoroot_C",
  },
  {
    id: 1366,
    name: "Chibi Vulture",
    blueprint: "PrimalItemSkin_ChibiDino_Vulture_C",
  },
  {
    id: 1367,
    name: "Chibi Dodo",
    blueprint: "PrimalItemSkin_ChibiDino_Dodo_C",
  },
  {
    id: 1368,
    name: "Chibi Carbonemys",
    blueprint: "PrimalItemSkin_ChibiDino_Carbonemys_C",
  },
  {
    id: 1369,
    name: "Chibi Direbear",
    blueprint: "PrimalItemSkin_ChibiDino_Direbear_C",
  },
  {
    id: 1370,
    name: "Chibi Basilisk",
    blueprint: "PrimalItemSkin_ChibiDino_Basilisk_C",
  },
  {
    id: 1371,
    name: "Chibi Bonnet Otter",
    blueprint: "PrimalItemSkin_ChibiDino_BonnetOtter_C",
  },
  {
    id: 1223,
    name: "Fertilized Poison Wyvern Egg",
    blueprint: "PrimalItemConsumable_Egg_Wyvern_Fertilized_Poison_C",
  },
  {
    id: 1224,
    name: "Fertilized Voidwyrm Egg",
    blueprint: "PrimalItemConsumable_Egg_Wyvern_Fertilized_Tek_C",
  },
  {
    id: 1225,
    name: "Yutyrannus Egg",
    blueprint: "PrimalItemConsumable_Egg_Yuty_C",
  },
  {
    id: 1226,
    name: "Fertilized Yutyrannus Egg",
    blueprint: "PrimalItemConsumable_Egg_Yuty_Fertilized_C",
  },
  {
    id: 597,
    name: "Rocket Turret",
    blueprint: "PrimalItemStructure_TurretRocket_C",
  },
  {
    id: 1373,
    name: "Chibi Carnotaurus",
    blueprint: "PrimalItemSkin_ChibiDino_Carnotaurus_C",
  },
  {
    id: 1374,
    name: "Chibi Daeodon",
    blueprint: "PrimalItemSkin_ChibiDino_Daeodon_C",
  },
  {
    id: 1227,
    name: "Fertilized Angler Egg",
    blueprint: "PrimalItemConsumable_UnderwaterEgg_Angler_C",
  },
  {
    id: 1375,
    name: "Chibi Skeletal Stego",
    blueprint: "PrimalItemSkin_ChibiDino_SkeletalStego_C",
  },
  {
    id: 1376,
    name: "Chibi Deinonychus",
    blueprint: "PrimalItemSkin_ChibiDino_Deinonychus_C",
  },
  {
    id: 1377,
    name: "Chibi Deal With It Dodo",
    blueprint: "PrimalItemSkin_ChibiDino_DealWithItDodo_C",
  },
  {
    id: 1228,
    name: "Fertilized Aberrant Angler Egg",
    blueprint: "PrimalItemConsumable_UnderwaterEgg_Angler_Aberrant_C",
  },
  {
    id: 1378,
    name: "Chibi Ghost Mantis",
    blueprint: "PrimalItemSkin_ChibiDino_GhostMantis_C",
  },
  {
    id: 1229,
    name: "Fertilized Diplocaulus Egg",
    blueprint: "PrimalItemConsumable_UnderwaterEgg_Diplocaulus_C",
  },
  {
    id: 1230,
    name: "Fertilized Aberrant Diplocaulus Egg",
    blueprint: "PrimalItemConsumable_UnderwaterEgg_Diplocaulus_Aberrant_C",
  },
  {
    id: 1379,
    name: "Chibi Beelzebufo",
    blueprint: "PrimalItemSkin_ChibiDino_Beelzebufo_C",
  },
  {
    id: 1381,
    name: "Chibi Dinopithecus",
    blueprint: "PrimalItemSkin_ChibiDino_Dinopithecus_C",
  },
  {
    id: 1380,
    name: "Chibi Brontosaurus",
    blueprint: "PrimalItemSkin_ChibiDino_Bronto_C",
  },
  {
    id: 573,
    name: "Thylacoleo Saddle",
    blueprint: "PrimalItemArmor_ThylacoSaddle_C",
  },
  {
    id: 442,
    name: "Sloped Greenhouse wall Left",
    blueprint: "PrimalItemStructure_GreenhouseWall_Sloped_Left_C",
  },
  {
    id: 1231,
    name: "Fertilized Eel Egg",
    blueprint: "PrimalItemConsumable_UnderwaterEgg_Eel_C",
  },
  {
    id: 1232,
    name: "Fertilized Aberrant Eel Egg",
    blueprint: "PrimalItemConsumable_UnderwaterEgg_Eel_Aberrant_C",
  },
  {
    id: 1233,
    name: "Fertilized Beelzebufo Egg",
    blueprint: "PrimalItemConsumable_UnderwaterEgg_Toad_C",
  },
  {
    id: 1234,
    name: "Fertilized Aberrant Beelzebufo Egg",
    blueprint: "PrimalItemConsumable_UnderwaterEgg_Toad_Aberrant_C",
  },
  {
    id: 1235,
    name: "Fertilized Tusoteuthis Egg",
    blueprint: "PrimalItemConsumable_UnderwaterEgg_Tuso_C",
  },
  {
    id: 1382,
    name: "Chibi Equus",
    blueprint: "PrimalItemSkin_ChibiDino_Equus_C",
  },
  {
    id: 1383,
    name: "Chibi Desmodus",
    blueprint: "PrimalItemSkin_ChibiDino_Desmodus_C",
  },
  { id: 373, name: "Transponder Node", blueprint: "PrimalItemTransGPSAmmo_C" },
  {
    id: 44,
    name: "Blood Extraction Syringe",
    blueprint: "PrimalItem_BloodExtractor_C",
  },
  { id: 485, name: "Camera", blueprint: "PrimalItem_Camera_C" },
  { id: 137, name: "Compass", blueprint: "PrimalItem_WeaponCompass_C" },
  {
    id: 1385,
    name: "Chibi Megalania",
    blueprint: "PrimalItemSkin_ChibiDino_Megalania_C",
  },
  {
    id: 1386,
    name: "Chibi Ghost Basilisk",
    blueprint: "PrimalItemSkin_ChibiDino_GhostBasilisk_C",
  },
  {
    id: 1387,
    name: "Chibi Gallimimus",
    blueprint: "PrimalItemSkin_ChibiDino_Gallimimus_C",
  },
  {
    id: 1388,
    name: "Chibi Mantis",
    blueprint: "PrimalItemSkin_ChibiDino_Mantis_C",
  },
  {
    id: 1384,
    name: "Chibi Giganotosaurus",
    blueprint: "PrimalItemSkin_ChibiDino_Gigant_C",
  },
  {
    id: 557,
    name: "Ravager Saddle",
    blueprint: "PrimalItemArmor_CavewolfSaddle_C",
  },
  { id: 72, name: "GPS", blueprint: "PrimalItem_WeaponGPS_C" },
  {
    id: 488,
    name: "Magnifying Glass",
    blueprint: "PrimalItem_WeaponMagnifyingGlass_C",
  },
  { id: 283, name: "Spyglass", blueprint: "PrimalItem_WeaponSpyglass_C" },
  { id: 1236, name: "Tek ATV", blueprint: "PrimalItemVHBuggy_C" },
  {
    id: 469,
    name: "Cactus Sap",
    blueprint: "PrimalItemConsumable_CactusSap_C",
  },
  { id: 467, name: "Clay", blueprint: "PrimalItemResource_Clay_C" },
  {
    id: 479,
    name: "Preserving Salt",
    blueprint: "PrimalItemResource_PreservingSalt_C",
  },
  { id: 468, name: "Sand", blueprint: "PrimalItemResource_Sand_C" },
  { id: 484, name: "Silk", blueprint: "PrimalItemResource_Silk_C" },
  { id: 481, name: "Sulfur", blueprint: "PrimalItemResource_Sulfur_C" },
  {
    id: 1389,
    name: "Chibi Enforcer",
    blueprint: "PrimalItemSkin_ChibiDino_Enforcer_C",
  },
  {
    id: 545,
    name: "Morellatops Saddle",
    blueprint: "PrimalItemArmor_CamelsaurusSaddle_C",
  },
  {
    id: 1390,
    name: "Chibi Snow Owl",
    blueprint: "PrimalItemSkin_ChibiDino_SnowOwl_C",
  },
  {
    id: 1237,
    name: "Camelsaurus Egg",
    blueprint: "PrimalItemConsumable_Egg_Camelsaurus_C",
  },
  {
    id: 1238,
    name: "Fertilized Camelsaurus Egg",
    blueprint: "PrimalItemConsumable_Egg_Camelsaurus_Fertilized_C",
  },
  {
    id: 540,
    name: "Mantis Saddle",
    blueprint: "PrimalItemArmor_MantisSaddle_C",
  },
  {
    id: 1239,
    name: "Mantis Egg",
    blueprint: "PrimalItemConsumable_Egg_Mantis_C",
  },
  {
    id: 753,
    name: "Managarmr Saddle",
    blueprint: "PrimalItemArmor_IceJumperSaddle_C",
  },
  {
    id: 1240,
    name: "Fertilized Mantis Egg",
    blueprint: "PrimalItemConsumable_Egg_Mantis_Fertilized_C",
  },
  {
    id: 538,
    name: "Lymantria Saddle",
    blueprint: "PrimalItemArmor_MothSaddle_C",
  },
  {
    id: 1391,
    name: "Chibi The Witching Owl",
    blueprint: "PrimalItemSkin_ChibiDino_TheWitchingOwl_C",
  },
  {
    id: 1392,
    name: "Chibi Woolly Rhino",
    blueprint: "PrimalItemSkin_ChibiDino_WoollyRhino_C",
  },
  {
    id: 1393,
    name: "Chibi Festive Noglin",
    blueprint: "PrimalItemSkin_ChibiDino_FestiveNoglin_C",
  },
  {
    id: 1394,
    name: "Chibi Ghost Rex",
    blueprint: "PrimalItemSkin_ChibiDino_GhostRex_C",
  },
  {
    id: 1395,
    name: "Chibi Gigantopithecus",
    blueprint: "PrimalItemSkin_ChibiDino_Gigantopithecus_C",
  },
  {
    id: 1396,
    name: "Chibi Griffin",
    blueprint: "PrimalItemSkin_ChibiDino_Griffin_C",
  },
  {
    id: 1397,
    name: "Chibi Mammoth",
    blueprint: "PrimalItemSkin_ChibiDino_Mammoth_C",
  },
  {
    id: 1398,
    name: "Chibi Karkinos",
    blueprint: "PrimalItemSkin_ChibiDino_Karkinos_C",
  },
  {
    id: 1399,
    name: "Chibi Kaprosuchus",
    blueprint: "PrimalItemSkin_ChibiDino_Kaprosuchus_C",
  },
  { id: 1343, name: "Inventory", blueprint: null },
  { id: 1023, name: "Cannon", blueprint: "PrimalItemStructure_Cannon_C" },
  {
    id: 607,
    name: "Chemistry Bench",
    blueprint: "PrimalItemStructure_ChemBench_C",
  },
  {
    id: 127,
    name: "Compost Bin",
    blueprint: "PrimalItemStructure_CompostBin_C",
  },
  {
    id: 130,
    name: "Small Crop Plot",
    blueprint: "PrimalItemStructure_CropPlot_Small_C",
  },
  {
    id: 1400,
    name: "Chibi Kairuku",
    blueprint: "PrimalItemSkin_ChibiDino_Kairuku_C",
  },
  {
    id: 1401,
    name: "Chibi Managarmr",
    blueprint: "PrimalItemSkin_ChibiDino_Managarmr_C",
  },
  {
    id: 1402,
    name: "Chibi Otter",
    blueprint: "PrimalItemSkin_ChibiDino_Otter_C",
  },
  {
    id: 1403,
    name: "Chibi Phiomia",
    blueprint: "PrimalItemSkin_ChibiDino_Phiomia_C",
  },
  {
    id: 1404,
    name: "Chibi Pelagornis",
    blueprint: "PrimalItemSkin_ChibiDino_Pelagornis_C",
  },
  {
    id: 1405,
    name: "Chibi Microraptor",
    blueprint: "PrimalItemSkin_ChibiDino_Microraptor_C",
  },
  {
    id: 185,
    name: "Fabricator",
    blueprint: "PrimalItemStructure_Fabricator_C",
  },
  {
    id: 1406,
    name: "Chibi Onyc",
    blueprint: "PrimalItemSkin_ChibiDino_Onyc_C",
  },
  {
    id: 1407,
    name: "Chibi Moschops",
    blueprint: "PrimalItemSkin_ChibiDino_Moschops_C",
  },
  {
    id: 1408,
    name: "Chibi Pteranodon",
    blueprint: "PrimalItemSkin_ChibiDino_Pteranodon_C",
  },
  {
    id: 1409,
    name: "Chibi Phoenix",
    blueprint: "PrimalItemSkin_ChibiDino_Phoenix_C",
  },
  {
    id: 1413,
    name: "Chibi Seeker",
    blueprint: "PrimalItemSkin_ChibiDino_Seeker_C",
  },
  {
    id: 1414,
    name: "Chibi Quetzal",
    blueprint: "PrimalItemSkin_ChibiDino_Quetzal_C",
  },
  {
    id: 1415,
    name: "Chibi Sarco",
    blueprint: "PrimalItemSkin_ChibiDino_Sarco_C",
  },
  {
    id: 1416,
    name: "Chibi Shinehorn",
    blueprint: "PrimalItemSkin_ChibiDino_Shinehorn_C",
  },
  {
    id: 1417,
    name: "Chibi Skeletal Rex",
    blueprint: "PrimalItemSkin_ChibiDino_SkeletalRex_C",
  },
  {
    id: 1418,
    name: "Chibi Purlovia",
    blueprint: "PrimalItemSkin_ChibiDino_Purlovia_C",
  },
  {
    id: 1419,
    name: "Chibi Velonasaur",
    blueprint: "PrimalItemSkin_ChibiDino_Velonasaur_C",
  },
  {
    id: 1420,
    name: "Chibi Thorny Dragon",
    blueprint: "PrimalItemSkin_ChibiDino_ThornyDragon_C",
  },
  {
    id: 1421,
    name: "Chibi Tek Raptor",
    blueprint: "PrimalItemSkin_ChibiDino_TekRaptor_C",
  },
  {
    id: 1422,
    name: "Chibi Reaper",
    blueprint: "PrimalItemSkin_ChibiDino_Reaper_C",
  },
  {
    id: 1423,
    name: "Chibi Spring Shinehorn",
    blueprint: "PrimalItemSkin_ChibiDino_SpringShinehorn_C",
  },
  {
    id: 1424,
    name: "Chibi Titanosaur",
    blueprint: "PrimalItemSkin_ChibiDino_Titanosaur_C",
  },
  {
    id: 1425,
    name: "Chibi Spooky Bulbdog",
    blueprint: "PrimalItemSkin_ChibiDino_SpookyBulbdog_C",
  },
  { id: 1426, name: "Chibi Rex", blueprint: "PrimalItemSkin_ChibiDino_Rex_C" },
  {
    id: 1427,
    name: "Chibi Raptor",
    blueprint: "PrimalItemSkin_ChibiDino_Raptor_C",
  },
  {
    id: 1430,
    name: "Chibi Tapejara",
    blueprint: "PrimalItemSkin_ChibiDino_Tapejara_C",
  },
  {
    id: 1438,
    name: "Chibi Voidwyrm",
    blueprint: "PrimalItemSkin_ChibiDino_Voidwyrm_C",
  },
  {
    id: 1439,
    name: "Chibi Tusoteuthis",
    blueprint: "PrimalItemSkin_ChibiDino_Tusoteuthis_C",
  },
  {
    id: 1440,
    name: "Chibi X Sabertooth",
    blueprint: "PrimalItemSkin_ChibiDino_XSabertooth_C",
  },
  {
    id: 1442,
    name: "Chibi Roll Rat",
    blueprint: "PrimalItemSkin_ChibiDino_RollRat_C",
  },
  {
    id: 1443,
    name: "Chibi Queen Bee",
    blueprint: "PrimalItemSkin_ChibiDino_QueenBee_C",
  },
  {
    id: 1444,
    name: "Chibi Lovebird",
    blueprint: "PrimalItemSkin_ChibiDino_Lovebird_C",
  },
  {
    id: 1445,
    name: "Chibi Reindeer",
    blueprint: "PrimalItemSkin_ChibiDino_Reindeer_C",
  },
  {
    id: 1446,
    name: "Chibi Anglerfish",
    blueprint: "PrimalItemSkin_ChibiDino_Anglerfish_C",
  },
  {
    id: 1447,
    name: "Chibi Easter Chick",
    blueprint: "PrimalItemSkin_ChibiDino_EasterChick_C",
  },
  {
    id: 1448,
    name: "Chibi Bunny",
    blueprint: "PrimalItemSkin_ChibiDino_Bunny_C",
  },
  {
    id: 1449,
    name: "Chibi Gasbag",
    blueprint: "PrimalItemSkin_ChibiDino_Gasbag_C",
  },
  {
    id: 1450,
    name: "Chibi Bloodstalker Skin",
    blueprint: "PrimalItemSkin_ChibiDino_BloodstalkerSkin_C",
  },
  {
    id: 1451,
    name: "Chibi Gacha Claus",
    blueprint: "PrimalItemSkin_ChibiDino_GachaClaus_C",
  },
  {
    id: 1452,
    name: "Chibi Ovus",
    blueprint: "PrimalItemSkin_ChibiDino_Ovus_C",
  },
  {
    id: 1453,
    name: "Chibi Rock Golem",
    blueprint: "PrimalItemSkin_ChibiDino_RockGolem_C",
  },
  {
    id: 1454,
    name: "Chibi Ferox Large",
    blueprint: "PrimalItemSkin_ChibiDino_FeroxLarge_C",
  },
  {
    id: 1455,
    name: "Chibi Skeletal Carno",
    blueprint: "PrimalItemSkin_ChibiDino_SkeletalCarno_C",
  },
  {
    id: 1473,
    name: "Chibi Megatherium",
    blueprint: "PrimalItemSkin_ChibiDino_Megatherium_C",
  },
  {
    id: 1456,
    name: "Chibi Gigantopithecus Chieftan",
    blueprint: "PrimalItemSkin_ChibiDino_GigantopithecusChieftan_C",
  },
  {
    id: 1457,
    name: "Chibi Carcharodontosaurus",
    blueprint: "PrimalItemSkin_ChibiDino_Carcharodontosaurus_C",
  },
  {
    id: 1458,
    name: "Chibi Castroides",
    blueprint: "PrimalItemSkin_ChibiDino_Castroides_C",
  },
  {
    id: 1459,
    name: "Chibi Quetzalcoatlus",
    blueprint: "PrimalItemSkin_ChibiDino_Quetzalcoatlus_C",
  },
  {
    id: 1460,
    name: "Chibi Jerbunny",
    blueprint: "PrimalItemSkin_ChibiDino_Jerbunny_C",
  },
  {
    id: 1464,
    name: "Chibi Bloodstalker",
    blueprint: "PrimalItemSkin_ChibiDino_Bloodstalker_C",
  },
  {
    id: 1465,
    name: "Chibi Manta",
    blueprint: "PrimalItemSkin_ChibiDino_Manta_C",
  },
  {
    id: 1466,
    name: "Chibi Mesopithecus",
    blueprint: "PrimalItemSkin_ChibiDino_Mesopithecus_C",
  },
  {
    id: 1467,
    name: "Chibi Crystal Wyvern",
    blueprint: "PrimalItemSkin_ChibiDino_CrystalWyvern_C",
  },
  {
    id: 1468,
    name: "Chibi Ankylosaurus",
    blueprint: "PrimalItemSkin_ChibiDino_Ankylosaurus_C",
  },
  {
    id: 1469,
    name: "Chibi Baryonyx",
    blueprint: "PrimalItemSkin_ChibiDino_Baryonyx_C",
  },
  {
    id: 1470,
    name: "Chibi Megaloceros",
    blueprint: "PrimalItemSkin_ChibiDino_Megaloceros_C",
  },
  {
    id: 1471,
    name: "Chibi Noglin",
    blueprint: "PrimalItemSkin_ChibiDino_Noglin_C",
  },
  {
    id: 1472,
    name: "Chibi Glowtail",
    blueprint: "PrimalItemSkin_ChibiDino_Glowtail_C",
  },
  {
    id: 1474,
    name: "Chibi Megalodon",
    blueprint: "PrimalItemSkin_ChibiDino_Megalodon_C",
  },
  {
    id: 1480,
    name: "Chibi Iguanodon",
    blueprint: "PrimalItemSkin_ChibiDino_Iguanodon_C",
  },
  {
    id: 1479,
    name: "Chibi Ghost Direwolf",
    blueprint: "PrimalItemSkin_ChibiDino_GhostDirewolf_C",
  },
  { id: 1241, name: "Moth Egg", blueprint: "PrimalItemConsumable_Egg_Moth_C" },
  {
    id: 1481,
    name: "Chibi Triceratops",
    blueprint: "PrimalItemSkin_ChibiDino_Triceratops_C",
  },
  {
    id: 1482,
    name: "Chibi Allosaurus",
    blueprint: "PrimalItemSkin_ChibiDino_Allosaurus_C",
  },
  {
    id: 1483,
    name: "Chibi Skeletal Raptor",
    blueprint: "PrimalItemSkin_ChibiDino_SkeletalRaptor_C",
  },
  {
    id: 1484,
    name: "Chibi Sinomacrops",
    blueprint: "PrimalItemSkin_ChibiDino_Sinomacrops_C",
  },
  {
    id: 901,
    name: "Fertilized R-Snow Owl Egg",
    blueprint: "PrimalItemConsumable_Egg_Owl_Gen2_Fertilized_C",
  },
  {
    id: 722,
    name: "Lesser Antidote",
    blueprint: "PrimalItemConsumable_CureLow_C",
  },
  {
    id: 1300,
    name: "Tyrannosaurus Arm",
    blueprint: "PrimalItemResource_ApexDrop_Rex_C",
  },
  {
    id: 1242,
    name: "Fertilized Moth Egg",
    blueprint: "PrimalItemConsumable_Egg_Moth_Fertilized_C",
  },
  { id: 452, name: "Handcuffs", blueprint: "PrimalItem_WeaponHandcuffs_C" },
  {
    id: 809,
    name: "Fertilized Featherlight Egg",
    blueprint: "PrimalItemConsumable_Egg_LanternBird_Fertilized_C",
  },
  {
    id: 1244,
    name: "Thorny Dragon Egg",
    blueprint: "PrimalItemConsumable_Egg_SpineyLizard_C",
  },
  { id: 478, name: "Green Gem", blueprint: "PrimalItemResource_Gem_Fertile_C" },
  {
    id: 793,
    name: "Magmasaur Saddle",
    blueprint: "PrimalItemArmor_CherufeSaddle_C",
  },
  {
    id: 652,
    name: "Tek Replicator",
    blueprint: "PrimalItemStructure_TekReplicator_C",
  },
  { id: 684, name: "Tek Trough", blueprint: "PrimalItemStructure_TekTrough_C" },
  {
    id: 1245,
    name: "Fertilized Thorny Dragon Egg",
    blueprint: "PrimalItemConsumable_Egg_SpineyLizard_Fertilized_C",
  },
  {
    id: 1246,
    name: "Vulture Egg",
    blueprint: "PrimalItemConsumable_Egg_Vulture_C",
  },
  {
    id: 1247,
    name: "Fertilized Vulture Egg",
    blueprint: "PrimalItemConsumable_Egg_Vulture_Fertilized_C",
  },
  {
    id: 509,
    name: "Desert Cloth Boots",
    blueprint: "PrimalItemArmor_DesertClothBoots_C",
  },
  {
    id: 510,
    name: "Desert Cloth Gloves",
    blueprint: "PrimalItemArmor_DesertClothGloves_C",
  },
  {
    id: 511,
    name: "Desert Goggles and Hat",
    blueprint: "PrimalItemArmor_DesertClothGogglesHelmet_C",
  },
  {
    id: 561,
    name: "Rock Drake Tek Saddle",
    blueprint: "PrimalItemArmor_RockDrakeSaddle_Tek_C",
  },
  {
    id: 512,
    name: "Desert Cloth Pants",
    blueprint: "PrimalItemArmor_DesertClothPants_C",
  },
  {
    id: 513,
    name: "Desert Cloth Shirt",
    blueprint: "PrimalItemArmor_DesertClothShirt_C",
  },
  {
    id: 586,
    name: "Wooden Bench",
    blueprint: "PrimalItemStructure_Furniture_WoodBench_C",
  },
  {
    id: 875,
    name: "Tek Jump Pad",
    blueprint: "PrimalItemStructure_TekJumpPad_C",
  },
  {
    id: 594,
    name: "Trophy Wall-Mount",
    blueprint: "PrimalItemStructure_TrophyWall_C",
  },
  { id: 197, name: "Auto Turret", blueprint: "PrimalItemStructure_Turret_C" },
  {
    id: 583,
    name: "Ballista Turret",
    blueprint: "PrimalItemStructure_TurretBallista_C",
  },
  {
    id: 596,
    name: "Catapult Turret",
    blueprint: "PrimalItemStructure_TurretCatapult_C",
  },
  {
    id: 595,
    name: "Minigun Turret",
    blueprint: "PrimalItemStructure_TurretMinigun_C",
  },
  { id: 1495, name: "Charge Node", blueprint: null },
  {
    id: 297,
    name: "Cooked Meat Jerky",
    blueprint: "PrimalItemConsumable_CookedMeat_Jerky_C",
  },
  {
    id: 112,
    name: "Stone Irrigation Pipe - Inclined",
    blueprint: "PrimalItemStructure_StonePipeIncline_C",
  },
  {
    id: 713,
    name: "Ascerbic Mushroom",
    blueprint: "PrimalItemConsumable_Mushroom_Ascerbic_C",
  },
  {
    id: 110,
    name: "Stone Irrigation Pipe - Intake",
    blueprint: "PrimalItemStructure_StonePipeIntake_C",
  },
  {
    id: 695,
    name: "Small Wood Elevator Platform",
    blueprint: "PrimalItemStructure_WoodElevatorPlatform_Small_C",
  },
  { id: 613, name: "Tree Sap Tap", blueprint: "PrimalItemStructure_TreeTap_C" },
  {
    id: 401,
    name: "Sloped Stone Wall Left",
    blueprint: "PrimalItemStructure_StoneWall_Sloped_Left_C",
  },
  {
    id: 900,
    name: "R-Snow Owl Egg",
    blueprint: "PrimalItemConsumable_Egg_Owl_Gen2_C",
  },
  {
    id: 458,
    name: "Giant Bee Honey",
    blueprint: "PrimalItemConsumable_Honey_C",
  },
  {
    id: 813,
    name: "Fertilized Rock Drake Egg",
    blueprint: "PrimalItemConsumable_Egg_RockDrake_Fertilized_C",
  },
  {
    id: 623,
    name: "Adobe Ceiling",
    blueprint: "PrimalItemStructure_AdobeCeiling_C",
  },
  {
    id: 624,
    name: "Giant Adobe Trapdoor",
    blueprint: "PrimalItemStructure_AdobeCeilingDoorGiant_C",
  },
  {
    id: 1248,
    name: "Giant Adobe Hatchframe",
    blueprint: "PrimalItemStructure_AdobeCeilingWithDoorWay_Giant_C",
  },
  {
    id: 625,
    name: "Adobe Hatchframe",
    blueprint: "PrimalItemStructure_AdobeCeilingWithTrapdoor_C",
  },
  { id: 626, name: "Adobe Door", blueprint: "PrimalItemStructure_AdobeDoor_C" },
  {
    id: 627,
    name: "Adobe Fence Foundation",
    blueprint: "PrimalItemStructure_AdobeFenceFoundation_C",
  },
  {
    id: 920,
    name: "Exceptional Maewing Egg",
    blueprint: "PrimalItemConsumable_Egg_MilkGlider_XLarge_C",
  },
  { id: 1498, name: "Mission Dispatcher", blueprint: null },
  {
    id: 1490,
    name: "Manticore Leggings Skin",
    blueprint: "PrimalItemSkin_ManticorePants_C",
  },
  {
    id: 317,
    name: "Reinforced Wooden Door",
    blueprint: "PrimalItemStructure_StoneDoor_C",
  },
  {
    id: 628,
    name: "Adobe Foundation",
    blueprint: "PrimalItemStructure_AdobeFloor_C",
  },
  {
    id: 319,
    name: "Reinforced Dinosaur Gate",
    blueprint: "PrimalItemStructure_StoneGate_C",
  },
  {
    id: 629,
    name: "Adobe Dinosaur Gateway",
    blueprint: "PrimalItemStructure_AdobeFrameGate_C",
  },
  {
    id: 560,
    name: "Rock Drake Saddle",
    blueprint: "PrimalItemArmor_RockDrakeSaddle_C",
  },
  {
    id: 320,
    name: "Stone Dinosaur Gateway",
    blueprint: "PrimalItemStructure_StoneGateframe_C",
  },
  {
    id: 381,
    name: "Behemoth Stone Dinosaur Gateway",
    blueprint: "PrimalItemStructure_StoneGateframe_Large_C",
  },
  {
    id: 592,
    name: "Stone Railing",
    blueprint: "PrimalItemStructure_StoneRailing_C",
  },
  {
    id: 1264,
    name: "Alpha Fenrisúlfr Trophy",
    blueprint: "PrimalItemTrophy_FenrirBoss_Alpha_C",
  },
  {
    id: 863,
    name: "Bloodstalker Egg",
    blueprint: "PrimalItemConsumable_Egg_BogSpider_C",
  },
  {
    id: 1491,
    name: "Manticore Shield Skin",
    blueprint: "PrimalItemSkin_ManticoreShield_C",
  },
  {
    id: 227,
    name: "Enduro Stew",
    blueprint: "PrimalItemConsumable_Soup_EnduroStew_C",
  },
  { id: 1500, name: "Summon Rockwell Prime", blueprint: null },
  {
    id: 630,
    name: "Adobe Dinosaur Gate",
    blueprint: "PrimalItemStructure_AdobeGateDoor_C",
  },
  {
    id: 865,
    name: "Magmasaur Egg",
    blueprint: "PrimalItemConsumable_Egg_Cherufe_Retrieve_C",
  },
  { id: 849, name: "Shotgun", blueprint: "PrimalItem_WeaponShotgun_C" },
  {
    id: 890,
    name: "R-Allosaurus Egg",
    blueprint: "PrimalItemConsumable_Egg_Allo_Gen2_C",
  },
  {
    id: 916,
    name: "Simple Maewing Egg",
    blueprint: "PrimalItemConsumable_Egg_MilkGlider_Small_C",
  },
  {
    id: 1492,
    name: "Manticore Boots Skin",
    blueprint: "PrimalItemSkin_ManticoreBoots_C",
  },
  {
    id: 128,
    name: "Cooking Pot",
    blueprint: "PrimalItemStructure_CookingPot_C",
  },
  {
    id: 631,
    name: "Behemoth Adobe Dinosaur Gate",
    blueprint: "PrimalItemStructure_AdobeGateDoor_Large_C",
  },
  {
    id: 632,
    name: "Behemoth Adobe Dinosaur Gateway",
    blueprint: "PrimalItemStructure_AdobeGateframe_Large_C",
  },
  {
    id: 633,
    name: "Adobe Ladder",
    blueprint: "PrimalItemStructure_AdobeLader_C",
  },
  {
    id: 637,
    name: "Sloped Adobe Roof",
    blueprint: "PrimalItemStructure_AdobeRoof_C",
  },
  {
    id: 638,
    name: "Adobe Staircase",
    blueprint: "PrimalItemStructure_AdobeStaircase_C",
  },
  { id: 640, name: "Adobe Wall", blueprint: "PrimalItemStructure_AdobeWall_C" },
  {
    id: 643,
    name: "Adobe Doorframe",
    blueprint: "PrimalItemStructure_AdobeWallWithDoor_C",
  },
  {
    id: 644,
    name: "Adobe Windowframe",
    blueprint: "PrimalItemStructure_AdobeWallWithWindow_C",
  },
  {
    id: 641,
    name: "Sloped Adobe Wall Left",
    blueprint: "PrimalItemStructure_AdobeWall_Sloped_Left_C",
  },
  {
    id: 642,
    name: "Sloped Adobe Wall Right",
    blueprint: "PrimalItemStructure_AdobeWall_Sloped_Right_C",
  },
  {
    id: 645,
    name: "Adobe Window",
    blueprint: "PrimalItemStructure_AdobeWindow_C",
  },
  { id: 646, name: "Mirror", blueprint: "PrimalItemStructure_Mirror_C" },
  { id: 649, name: "Vessel", blueprint: "PrimalItemStructure_Vessel_C" },
  {
    id: 1249,
    name: "Manticore Flag",
    blueprint: "PrimalItemStructure_Flag_Manticore_C",
  },
  { id: 647, name: "Oil Pump", blueprint: "PrimalItemStructure_oilPump_C" },
  { id: 648, name: "Tent", blueprint: "PrimalItemStructure_Tent_C" },
  {
    id: 1293,
    name: "Manticore Trophy",
    blueprint: "PrimalItemTrophy_Manticore_C",
  },
  {
    id: 1294,
    name: "Alpha Manticore Trophy",
    blueprint: "PrimalItemTrophy_Manticore_Alpha_C",
  },
  {
    id: 1295,
    name: "Beta Manticore Trophy",
    blueprint: "PrimalItemTrophy_Manticore_Beta_C",
  },
  {
    id: 1296,
    name: "Gamma Manticore Trophy",
    blueprint: "PrimalItemTrophy_Manticore_Gamma_C",
  },
  {
    id: 515,
    name: "Hazard Suit Boots",
    blueprint: "PrimalItemArmor_HazardSuitBoots_C",
  },
  {
    id: 517,
    name: "Hazard Suit Gloves",
    blueprint: "PrimalItemArmor_HazardSuitGloves_C",
  },
  {
    id: 516,
    name: "Hazard Suit Hat",
    blueprint: "PrimalItemArmor_HazardSuitHelmet_C",
  },
  {
    id: 519,
    name: "Hazard Suit Pants",
    blueprint: "PrimalItemArmor_HazardSuitPants_C",
  },
  { id: 483, name: "Red Gem", blueprint: "PrimalItemResource_Gem_Element_C" },
  {
    id: 563,
    name: "Roll Rat Saddle",
    blueprint: "PrimalItemArmor_MoleRatSaddle_C",
  },
  {
    id: 659,
    name: "Tek Dinosaur Gate",
    blueprint: "PrimalItemStructure_TekGate_C",
  },
  {
    id: 653,
    name: "Behemoth Tek Gate",
    blueprint: "PrimalItemStructure_TekGate_Large_C",
  },
  {
    id: 824,
    name: "M.R.L.M.",
    blueprint: "PrimalItemArmor_MekBackpack_MissilePod_C",
  },
  {
    id: 1313,
    name: "Summon Beta King Titan",
    blueprint: "PrimalItem_BossTribute_KingKaijuMedium_C",
  },
  {
    id: 660,
    name: "Tek Dinosaur Gateway",
    blueprint: "PrimalItemStructure_TekGateframe_C",
  },
  {
    id: 654,
    name: "Behemoth Tek Gateway",
    blueprint: "PrimalItemStructure_TekGateframe_Large_C",
  },
  { id: 851, name: "Tek Claws", blueprint: "PrimalItem_WeaponTekClaws_C" },
  {
    id: 808,
    name: "Featherlight Egg",
    blueprint: "PrimalItemConsumable_Egg_LanternBird_C",
  },
  {
    id: 655,
    name: "Sloped Tek Wall Left",
    blueprint: "PrimalItemStructure_TekWall_Sloped_Left_C",
  },
  {
    id: 810,
    name: "Glowtail Egg",
    blueprint: "PrimalItemConsumable_Egg_LanternLizard_C",
  },
  {
    id: 656,
    name: "Sloped Tek Wall Right",
    blueprint: "PrimalItemStructure_TekWall_Sloped_Right_C",
  },
  { id: 674, name: "Tek Window", blueprint: "PrimalItemStructure_TekWindow_C" },
  {
    id: 856,
    name: "Fertilized X-Tapejara Egg",
    blueprint: "PrimalItemConsumable_Egg_Tapejara_Fertilized_Bog_C",
  },
  {
    id: 945,
    name: "Carcharo Saddle",
    blueprint: "PrimalItemArmor_CarchaSaddle_C",
  },
  {
    id: 80,
    name: "Thatch Door",
    blueprint: "PrimalItemStructure_ThatchDoor_C",
  },
  {
    id: 587,
    name: "Gravestone",
    blueprint: "PrimalItemStructure_Furniture_Gravestone_C",
  },
  {
    id: 585,
    name: "Wooden Chair",
    blueprint: "PrimalItemStructure_Furniture_WoodChair_C",
  },
  {
    id: 1323,
    name: "Reaper Pheromone Gland",
    blueprint: "PrimalItemResource_XenomorphPheromoneGland_C",
  },
  {
    id: 603,
    name: "Wooden Table",
    blueprint: "PrimalItemStructure_Furniture_WoodTable_C",
  },
  {
    id: 857,
    name: "Fertilized X-Argentavis Egg",
    blueprint: "PrimalItemConsumable_Egg_Argent_Fertilized_Snow_C",
  },
  {
    id: 858,
    name: "Fertilized X-Yutyrannus Egg",
    blueprint: "PrimalItemConsumable_Egg_Yuty_Fertilized_Snow_C",
  },
  {
    id: 610,
    name: "Rope Ladder",
    blueprint: "PrimalItemStructure_RopeLadder_C",
  },
  {
    id: 85,
    name: "Wooden Ceiling",
    blueprint: "PrimalItemStructure_WoodCeiling_C",
  },
  { id: 650, name: "Water Well", blueprint: "PrimalItemStructure_WaterWell_C" },
  {
    id: 728,
    name: "Cluster Grenade",
    blueprint: "PrimalItem_WeaponClusterGrenade_C",
  },
  {
    id: 747,
    name: "Rocket Homing Missile",
    blueprint: "PrimalItemAmmo_RocketHomingMissile_C",
  },
  {
    id: 859,
    name: "Fertilized X-Allosaurus Egg",
    blueprint: "PrimalItemConsumable_Egg_Allo_Fertilized_Volcano_C",
  },
  {
    id: 860,
    name: "Fertilized X-Ankylo Egg",
    blueprint: "PrimalItemConsumable_Egg_Ankylo_Fertilized_Volcano_C",
  },
  {
    id: 868,
    name: "Fertilized Megachelon Egg",
    blueprint: "PrimalItemConsumable_Egg_GiantTurtle_Fertilized_C",
  },
  {
    id: 873,
    name: "Pressure Plate",
    blueprint: "PrimalItemStructure_PressurePlate_C",
  },
  {
    id: 797,
    name: "Mining Drill",
    blueprint: "PrimalItem_WeaponMiningDrill_C",
  },
  { id: 734, name: "Oil Jar", blueprint: "PrimalItem_WeaponOilJar_C" },
  {
    id: 986,
    name: "Plant Species Y Seed",
    blueprint: "PrimalItemConsumable_Seed_PlantSpeciesY_C",
  },
  {
    id: 1252,
    name: "Plant Species Y Trap",
    blueprint: "PrimalItemStructure_PlantSpeciesYTrap_C",
  },
  {
    id: 886,
    name: "Federation Exo-Chestpiece",
    blueprint: "PrimalItemArmor_TekShirt_Gen2_C",
  },
  { id: 87, name: "Wooden Door", blueprint: "PrimalItemStructure_WoodDoor_C" },
  {
    id: 136,
    name: "Wooden Fence Foundation",
    blueprint: "PrimalItemStructure_WoodFenceFoundation_C",
  },
  {
    id: 803,
    name: "Gasbags bladder",
    blueprint: "PrimalItemResource_ApexDrop_GasBag_C",
  },
  {
    id: 88,
    name: "Wooden Foundation",
    blueprint: "PrimalItemStructure_WoodFloor_C",
  },
  { id: 492, name: "Whip", blueprint: "PrimalItem_WeaponWhip_C" },
  {
    id: 893,
    name: "Fertilized R-Bronto Egg",
    blueprint: "PrimalItemConsumable_Egg_Bronto_Gen2_Fertilized_C",
  },
  {
    id: 894,
    name: "R-Carno Egg",
    blueprint: "PrimalItemConsumable_Egg_Carno_Gen2_C",
  },
  {
    id: 897,
    name: "Fertilized R-Dilo Egg",
    blueprint: "PrimalItemConsumable_Egg_Dilo_Gen2_Fertilized_C",
  },
  { id: 431, name: "Fur Cap", blueprint: "PrimalItemArmor_FurHelmet_C" },
  {
    id: 791,
    name: "Deinonychus Saddle",
    blueprint: "PrimalItemArmor_DeinonychusSaddle_C",
  },
  {
    id: 811,
    name: "Fertilized Glowtail Egg",
    blueprint: "PrimalItemConsumable_Egg_LanternLizard_Fertilized_C",
  },
  {
    id: 147,
    name: "Dinosaur Gate",
    blueprint: "PrimalItemStructure_WoodGate_C",
  },
  {
    id: 143,
    name: "Dinosaur Gateway",
    blueprint: "PrimalItemStructure_WoodGateframe_C",
  },
  {
    id: 89,
    name: "Wooden Ladder",
    blueprint: "PrimalItemStructure_WoodLadder_C",
  },
  {
    id: 1253,
    name: "Fertilized Deinonychus Egg",
    blueprint: "PrimalItemConsumable_Egg_Deinonychus_Fertilized_C",
  },
  {
    id: 898,
    name: "R-Giganotosaurus Egg",
    blueprint: "PrimalItemConsumable_Egg_Gigant_Gen2_C",
  },
  {
    id: 899,
    name: "Fertilized R-Giganotosaurus Egg",
    blueprint: "PrimalItemConsumable_Egg_Gigant_Gen2_Fertilized_C",
  },
  {
    id: 902,
    name: "R-Parasaur Egg",
    blueprint: "PrimalItemConsumable_Egg_Para_Gen2_C",
  },
  {
    id: 591,
    name: "Wooden Railing",
    blueprint: "PrimalItemStructure_WoodRailing_C",
  },
  { id: 91, name: "Wooden Ramp", blueprint: "PrimalItemStructure_WoodRamp_C" },
  { id: 97, name: "Wooden Sign", blueprint: "PrimalItemStructure_WoodSign_C" },
  {
    id: 904,
    name: "R-Quetzal Egg",
    blueprint: "PrimalItemConsumable_Egg_Quetz_Gen2_C",
  },
  {
    id: 915,
    name: "Regular Fertilized Maewing Egg",
    blueprint: "PrimalItemConsumable_Egg_MilkGlider_Medium_Fertilized_C",
  },
  {
    id: 917,
    name: "Simple Fertilized Maewing Egg",
    blueprint: "PrimalItemConsumable_Egg_MilkGlider_Small_Fertilized_C",
  },
  {
    id: 307,
    name: "Wooden Spike Wall",
    blueprint: "PrimalItemStructure_WoodSpikeWall_C",
  },
  { id: 471, name: "Angler Gel", blueprint: "PrimalItemResource_AnglerGel_C" },
  {
    id: 798,
    name: "Amargasaurus Saddle",
    blueprint: "PrimalItemArmor_AmargaSaddle_C",
  },
  {
    id: 941,
    name: "Fertilized Sinomacrops Egg",
    blueprint: "PrimalItemConsumable_Egg_Sinomacrops_Fertilized_C",
  },
  { id: 20, name: "Cloth Boots", blueprint: "PrimalItemArmor_ClothBoots_C" },
  { id: 19, name: "Cloth Hat", blueprint: "PrimalItemArmor_ClothHelmet_C" },
  { id: 17, name: "Cloth Pants", blueprint: "PrimalItemArmor_ClothPants_C" },
  { id: 432, name: "Fur Boots", blueprint: "PrimalItemArmor_FurBoots_C" },
  { id: 763, name: "Tek Bridge", blueprint: "PrimalItemStructure_TekBridge_C" },
  { id: 93, name: "Wooden Wall", blueprint: "PrimalItemStructure_WoodWall_C" },
  {
    id: 861,
    name: "Fertilized X-Rex Egg",
    blueprint: "PrimalItemConsumable_Egg_Rex_Fertilized_Volcano_C",
  },
  {
    id: 919,
    name: "Extraordinary Fertilized Maewing Egg",
    blueprint: "PrimalItemConsumable_Egg_MilkGlider_Special_Fertilized_C",
  },
  {
    id: 1315,
    name: "Dragon Summon",
    blueprint: "PrimalItem_GauntletDamageBuffKey_TempTame_Dragon_C",
  },
  {
    id: 94,
    name: "Wooden Doorframe",
    blueprint: "PrimalItemStructure_WoodWallWithDoor_C",
  },
  {
    id: 95,
    name: "Wooden Windowframe",
    blueprint: "PrimalItemStructure_WoodWallWithWindow_C",
  },
  {
    id: 1280,
    name: "Survivors Trophy",
    blueprint: "PrimalItemTrophy_ARKLogo_C",
  },
  {
    id: 507,
    name: "Ghillie Mask",
    blueprint: "PrimalItemArmor_GhillieHelmet_C",
  },
  { id: 225, name: "Flak Boots", blueprint: "PrimalItemArmor_MetalBoots_C" },
  { id: 222, name: "Flak Leggings", blueprint: "PrimalItemArmor_MetalPants_C" },
  {
    id: 1285,
    name: "Beta Broodmother Trophy",
    blueprint: "PrimalItemTrophy_Broodmother_Beta_C",
  },
  {
    id: 1290,
    name: "Alpha Megapithecus Trophy",
    blueprint: "PrimalItemTrophy_Gorilla_Alpha_C",
  },
  { id: 170, name: "Metal Door", blueprint: "PrimalItemStructure_MetalDoor_C" },
  {
    id: 223,
    name: "Flak Chestpiece",
    blueprint: "PrimalItemArmor_MetalShirt_C",
  },
  {
    id: 389,
    name: "Scuba Flippers",
    blueprint: "PrimalItemArmor_ScubaBoots_Flippers_C",
  },
  {
    id: 388,
    name: "Scuba Mask",
    blueprint: "PrimalItemArmor_ScubaHelmet_Goggles_C",
  },
  {
    id: 209,
    name: "Ankylo Saddle",
    blueprint: "PrimalItemArmor_AnkyloSaddle_C",
  },
  {
    id: 205,
    name: "Flashlight Attachment",
    blueprint: "PrimalItemWeaponAttachment_Flashlight_C",
  },
  {
    id: 219,
    name: "Holo-Scope Attachment",
    blueprint: "PrimalItemWeaponAttachment_HoloScope_C",
  },
  {
    id: 220,
    name: "Laser Attachment",
    blueprint: "PrimalItemWeaponAttachment_Laser_C",
  },
  {
    id: 942,
    name: "Fertilized Ice Wyvern Egg",
    blueprint: "RAG_Item_Egg_Wyvern_Fertilized_Ice_C",
  },
  { id: 430, name: "Fur Chestpiece", blueprint: "PrimalItemArmor_FurShirt_C" },
  { id: 224, name: "Flak Helmet", blueprint: "PrimalItemArmor_MetalHelmet_C" },
  {
    id: 138,
    name: "Scope Attachment",
    blueprint: "PrimalItemWeaponAttachment_Scope_C",
  },
  {
    id: 206,
    name: "Silencer Attachment",
    blueprint: "PrimalItemWeaponAttachment_Silencer_C",
  },
  {
    id: 214,
    name: "Argentavis Saddle",
    blueprint: "PrimalItemArmor_ArgentavisSaddle_C",
  },
  { id: 464, name: "Charge Battery", blueprint: "PrimalItem_ChargeBattery_C" },
  {
    id: 466,
    name: "Condensed Gas",
    blueprint: "PrimalItemResource_CondensedGas_C",
  },
  { id: 449, name: "Riot Boots", blueprint: "PrimalItemArmor_RiotBoots_C" },
  {
    id: 448,
    name: "Riot Gauntlets",
    blueprint: "PrimalItemArmor_RiotGloves_C",
  },
  { id: 450, name: "Riot Helmet", blueprint: "PrimalItemArmor_RiotHelmet_C" },
  {
    id: 447,
    name: "Riot Chestpiece",
    blueprint: "PrimalItemArmor_RiotShirt_C",
  },
  {
    id: 525,
    name: "Castoroides Saddle",
    blueprint: "PrimalItemArmor_BeaverSaddle_C",
  },
  {
    id: 527,
    name: "Daeodon Saddle",
    blueprint: "PrimalItemArmor_DaeodonSaddle_C",
  },
  {
    id: 528,
    name: "Diplodocus Saddle",
    blueprint: "PrimalItemArmor_DiplodocusSaddle_C",
  },
  {
    id: 473,
    name: "Element Ore",
    blueprint: "PrimalItemResource_ElementOre_C",
  },
  {
    id: 558,
    name: "Fungal Wood",
    blueprint: "PrimalItemResource_FungalWood_C",
  },
  {
    id: 474,
    name: "Element Dust",
    blueprint: "PrimalItemResource_ElementDust_C",
  },
  {
    id: 226,
    name: "Flak Gauntlets",
    blueprint: "PrimalItemArmor_MetalGloves_C",
  },
  {
    id: 530,
    name: "Dunkleosteus Saddle",
    blueprint: "PrimalItemArmor_DunkleosteusSaddle_C",
  },
  { id: 531, name: "Equus Saddle", blueprint: "PrimalItemArmor_EquusSaddle_C" },
  {
    id: 532,
    name: "Gallimimus Saddle",
    blueprint: "PrimalItemArmor_Gallimimus_C",
  },
  {
    id: 533,
    name: "Giganotosaurus Saddle",
    blueprint: "PrimalItemArmor_GigantSaddle_C",
  },
  {
    id: 1327,
    name: "Argentavis Talon",
    blueprint: "PrimalItemResource_ApexDrop_Argentavis_C",
  },
  {
    id: 1326,
    name: "Basilosaurus Blubber",
    blueprint: "PrimalItemResource_ApexDrop_Basilo_C",
  },
  {
    id: 503,
    name: "Ghillie Boots",
    blueprint: "PrimalItemArmor_GhillieBoots_C",
  },
  {
    id: 504,
    name: "Ghillie Chestpiece",
    blueprint: "PrimalItemArmor_GhillieShirt_C",
  },
  {
    id: 543,
    name: "Megalodon Tek Saddle",
    blueprint: "PrimalItemArmor_MegalodonSaddle_Tek_C",
  },
  {
    id: 1305,
    name: "Titanoboa Venom",
    blueprint: "PrimalItemResource_ApexDrop_Boa_C",
  },
  {
    id: 1306,
    name: "Giganotosaurus Heart",
    blueprint: "PrimalItemResource_ApexDrop_Giga_C",
  },
  {
    id: 1494,
    name: "Yutyrannus Lungs",
    blueprint: "PrimalItemResource_ApexDrop_Yuty_C",
  },
  { id: 716, name: "Beer Liquid", blueprint: "PrimalItemResource_Beer_C" },
  {
    id: 456,
    name: "Black Pearl",
    blueprint: "PrimalItemResource_BlackPearl_C",
  },
  {
    id: 521,
    name: "Heavy Miners Helmet",
    blueprint: "PrimalItemArmor_MinersHelmet_C",
  },
  { id: 508, name: "Gas Mask", blueprint: "PrimalItemArmor_GasMask_C" },
  {
    id: 514,
    name: "Night Vision Goggles",
    blueprint: "PrimalItemArmor_NightVisionGoggles_C",
  },
  { id: 77, name: "Charcoal", blueprint: "PrimalItemResource_Charcoal_C" },
  { id: 11, name: "Chitin", blueprint: "PrimalItemResource_Chitin_C" },
  {
    id: 544,
    name: "Megatherium Saddle",
    blueprint: "PrimalItemArmor_MegatheriumSaddle_C",
  },
  {
    id: 548,
    name: "Mosasaur Tek Saddle",
    blueprint: "PrimalItemArmor_MosaSaddle_Tek_C",
  },
  { id: 417, name: "Pachy Saddle", blueprint: "PrimalItemArmor_PachySaddle_C" },
  {
    id: 549,
    name: "Pachyrhinosaurus Saddle",
    blueprint: "PrimalItemArmor_PachyrhinoSaddle_C",
  },
  {
    id: 520,
    name: "Hazard Suit Shirt",
    blueprint: "PrimalItemArmor_HazardSuitShirt_C",
  },
  {
    id: 146,
    name: "Cementing Paste",
    blueprint: "PrimalItemResource_ChitinPaste_C",
  },
  { id: 78, name: "Crystal", blueprint: "PrimalItemResource_Crystal_C" },
  {
    id: 165,
    name: "Electronics",
    blueprint: "PrimalItemResource_Electronics_C",
  },
  {
    id: 470,
    name: "Element Shard",
    blueprint: "PrimalItemResource_ElementShard_C",
  },
  { id: 472, name: "Element", blueprint: "PrimalItemResource_Element_C" },
  {
    id: 949,
    name: "Paracer Platform Saddle",
    blueprint: "PrimalItemArmor_ParacerSaddle_Platform_C",
  },
  {
    id: 551,
    name: "Pelagornis Saddle",
    blueprint: "PrimalItemArmor_PelaSaddle_C",
  },
  {
    id: 552,
    name: "Phiomia Saddle",
    blueprint: "PrimalItemArmor_PhiomiaSaddle_C",
  },
  {
    id: 553,
    name: "Plesiosaur Platform Saddle",
    blueprint: "PrimalItemArmor_PlesiSaddle_Platform_C",
  },
  {
    id: 556,
    name: "Quetz Platform Saddle",
    blueprint: "PrimalItemArmor_QuetzSaddle_Platform_C",
  },
  {
    id: 866,
    name: "Fertilized Magmasaur Egg",
    blueprint: "PrimalItemConsumable_Egg_Cherufe_Fertilized_C",
  },
  { id: 76, name: "Fiber", blueprint: "PrimalItemResource_Fibers_C" },
  { id: 73, name: "Flint", blueprint: "PrimalItemResource_Flint_C" },
  {
    id: 212,
    name: "Sabertooth Saddle",
    blueprint: "PrimalItemArmor_SaberSaddle_C",
  },
  {
    id: 559,
    name: "Rex Tek Saddle",
    blueprint: "PrimalItemArmor_SaddleGeneric_Tek_C",
  },
  { id: 208, name: "Sarco Saddle", blueprint: "PrimalItemArmor_SarcoSaddle_C" },
  {
    id: 135,
    name: "Bronto Saddle",
    blueprint: "PrimalItemArmor_SauroSaddle_C",
  },
  {
    id: 462,
    name: "Araneo Saddle",
    blueprint: "PrimalItemArmor_SpiderSaddle_C",
  },
  {
    id: 314,
    name: "Ichthyosaurus Saddle",
    blueprint: "PrimalItemArmor_DolphinSaddle_C",
  },
  { id: 164, name: "Gasoline", blueprint: "PrimalItemResource_Gasoline_C" },
  { id: 303, name: "Spino Saddle", blueprint: "PrimalItemArmor_SpinoSaddle_C" },
  { id: 109, name: "Gunpowder", blueprint: "PrimalItemResource_Gunpowder_C" },
  { id: 10, name: "Hide", blueprint: "PrimalItemResource_Hide_C" },
  { id: 74, name: "Metal Ingot", blueprint: "PrimalItemResource_MetalIngot_C" },
  {
    id: 569,
    name: "Tapejara Tek Saddle",
    blueprint: "PrimalItemArmor_Tapejara_Tek_C",
  },
  {
    id: 570,
    name: "Terror Bird Saddle",
    blueprint: "PrimalItemArmor_TerrorBirdSaddle_C",
  },
  {
    id: 571,
    name: "Therizinosaurus Saddle",
    blueprint: "PrimalItemArmor_TherizinosaurusSaddle_C",
  },
  {
    id: 574,
    name: "Titanosaur Platform Saddle",
    blueprint: "PrimalItemArmor_TitanSaddle_Platform_C",
  },
  {
    id: 1354,
    name: "Scary Skull Helmet Skin",
    blueprint: "PrimalItemSkin_ScarySkull_C",
  },
  { id: 1322, name: "Berries", blueprint: null },
  { id: 575, name: "Trike Saddle", blueprint: "PrimalItemArmor_TrikeSaddle_C" },
  {
    id: 576,
    name: "Tusoteuthis Saddle",
    blueprint: "PrimalItemArmor_TusoSaddle_C",
  },
  { id: 499, name: "Metal Shield", blueprint: "PrimalItemArmor_MetalShield_C" },
  { id: 501, name: "Tek Shield", blueprint: "PrimalItemArmor_ShieldTek_C" },
  {
    id: 500,
    name: "Riot Shield",
    blueprint: "PrimalItemArmor_TransparentRiotShield_C",
  },
  { id: 498, name: "Wooden Shield", blueprint: "PrimalItemArmor_WoodShield_C" },
  {
    id: 1489,
    name: "Manticore Gauntlets Skin",
    blueprint: "PrimalItemSkin_ManticoreGloves_C",
  },
  {
    id: 1488,
    name: "Manticore Chestpiece Skin",
    blueprint: "PrimalItemSkin_ManticoreShirt_C",
  },
  { id: 142, name: "Obsidian", blueprint: "PrimalItemResource_Obsidian_C" },
  { id: 496, name: "Tek Gauntlets", blueprint: "PrimalItemArmor_TekGloves_C" },
  { id: 497, name: "Tek Helmet", blueprint: "PrimalItemArmor_TekHelmet_C" },
  { id: 495, name: "Tek Leggings", blueprint: "PrimalItemArmor_TekPants_C" },
  { id: 494, name: "Tek Chestpiece", blueprint: "PrimalItemArmor_TekShirt_C" },
  {
    id: 959,
    name: "Artifact of the Destroyer",
    blueprint: "PrimalItemArtifactSE_03_C",
  },
  {
    id: 960,
    name: "Artifact of the Hunter",
    blueprint: "PrimalItemArtifact_01_C",
  },
  {
    id: 968,
    name: "Artifact of the Strong",
    blueprint: "PrimalItemArtifact_09_C",
  },
  {
    id: 969,
    name: "Artifact of the Cunning",
    blueprint: "PrimalItemArtifact_11_C",
  },
  {
    id: 980,
    name: "Wyvern Milk",
    blueprint: "PrimalItemConsumable_WyvernMilk_C",
  },
  { id: 827, name: "M.O.M.I.", blueprint: "PrimalItemArmor_MekTransformer_C" },
  { id: 162, name: "Oil", blueprint: "PrimalItemResource_Oil_C" },
  {
    id: 415,
    name: "Bronto Platform Saddle",
    blueprint: "PrimalItemArmor_SauroSaddle_Platform_C",
  },
  {
    id: 187,
    name: "Parachute",
    blueprint: "PrimalItemConsumableBuff_Parachute_C",
  },
  { id: 166, name: "Polymer", blueprint: "PrimalItemResource_Polymer_C" },
  {
    id: 502,
    name: "Organic Polymer",
    blueprint: "PrimalItemResource_Polymer_Organic_C",
  },
  {
    id: 250,
    name: "Rare Flower",
    blueprint: "PrimalItemResource_RareFlower_C",
  },
  {
    id: 386,
    name: "Re-Fertilizer",
    blueprint: "PrimalItemConsumableMiracleGro_C",
  },
  {
    id: 413,
    name: "Mindwipe Tonic",
    blueprint: "PrimalItemConsumableRespecSoup_C",
  },
  { id: 424, name: "Pelt", blueprint: "PrimalItemResource_Pelt_C" },
  {
    id: 895,
    name: "Fertilized R-Carno Egg",
    blueprint: "PrimalItemConsumable_Egg_Carno_Gen2_Fertilized_C",
  },
  {
    id: 393,
    name: "Doedicurus Saddle",
    blueprint: "PrimalItemArmor_DoedSaddle_C",
  },
  {
    id: 534,
    name: "Hyaenodon Meatpack",
    blueprint: "PrimalItemArmor_HyaenodonSaddle_C",
  },
  {
    id: 131,
    name: "Pteranodon Saddle",
    blueprint: "PrimalItemArmor_PteroSaddle_C",
  },
  {
    id: 117,
    name: "Amarberry",
    blueprint: "PrimalItemConsumable_Berry_Amarberry_C",
  },
  {
    id: 118,
    name: "Azulberry",
    blueprint: "PrimalItemConsumable_Berry_Azulberry_C",
  },
  {
    id: 121,
    name: "Narcoberry",
    blueprint: "PrimalItemConsumable_Berry_Narcoberry_C",
  },
  {
    id: 523,
    name: "Basilisk Saddle",
    blueprint: "PrimalItemArmor_BasiliskSaddle_C",
  },
  { id: 457, name: "Sap", blueprint: "PrimalItemResource_Sap_C" },
  { id: 163, name: "Silica Pearls", blueprint: "PrimalItemResource_Silicon_C" },
  {
    id: 855,
    name: "Fertilized X-Spino Egg",
    blueprint: "PrimalItemConsumable_Egg_Spino_Fertilized_Bog_C",
  },
  {
    id: 506,
    name: "Ghillie Leggings",
    blueprint: "PrimalItemArmor_GhilliePants_C",
  },
  {
    id: 524,
    name: "Basilosaurus Saddle",
    blueprint: "PrimalItemArmor_BasiloSaddle_C",
  },
  {
    id: 526,
    name: "Chalicotherium Saddle",
    blueprint: "PrimalItemArmor_ChalicoSaddle_C",
  },
  {
    id: 108,
    name: "Sparkpowder",
    blueprint: "PrimalItemResource_Sparkpowder_C",
  },
  {
    id: 454,
    name: "Absorbent Substrate",
    blueprint: "PrimalItemResource_SubstrateAbsorbent_C",
  },
  { id: 75, name: "Thatch", blueprint: "PrimalItemResource_Thatch_C" },
  { id: 7, name: "Wood", blueprint: "PrimalItemResource_Wood_C" },
  {
    id: 696,
    name: "Stone Cliff Platform",
    blueprint: "PrimalItemStructure_Stone_CliffPlatform_C",
  },
  {
    id: 828,
    name: "Corrupted Nodule",
    blueprint: "PrimalItemResource_CorruptedPolymer_C",
  },
  { id: 832, name: "Rocket Pod", blueprint: "PrimalItemAmmo_RocketPod_C" },
  {
    id: 909,
    name: "Fertilized R-Turtle Egg",
    blueprint: "PrimalItemConsumable_Egg_Turtle_Gen2_Fertilized_C",
  },
  { id: 32, name: "Stone Arrow", blueprint: "PrimalItemAmmo_ArrowStone_C" },
  { id: 584, name: "Spear Bolt", blueprint: "PrimalItemAmmo_BallistaArrow_C" },
  { id: 1039, name: "Boulder", blueprint: "PrimalItemAmmo_Boulder_C" },
  { id: 741, name: "Cannon Ball", blueprint: "PrimalItemAmmo_CannonBall_C" },
  {
    id: 377,
    name: "Metal Arrow",
    blueprint: "PrimalItemAmmo_CompoundBowArrow_C",
  },
  {
    id: 119,
    name: "Tintoberry",
    blueprint: "PrimalItemConsumable_Berry_Tintoberry_C",
  },
  { id: 725, name: "Chain Bola", blueprint: "PrimalItemAmmo_ChainBola_C" },
  {
    id: 664,
    name: "Tek Forcefield",
    blueprint: "PrimalItemStructure_TekShield_C",
  },
  {
    id: 978,
    name: "Zip-Line Motor Attachment",
    blueprint: "PrimalItemArmor_ZiplineMotor_C",
  },
  {
    id: 748,
    name: "Shocking Tranquilizer Dart",
    blueprint: "PrimalItemAmmo_RefinedTranqDart_C",
  },
  { id: 4, name: "Simple Bullet", blueprint: "PrimalItemAmmo_SimpleBullet_C" },
  { id: 45, name: "Blood Pack", blueprint: "PrimalItemConsumable_BloodPack_C" },
  {
    id: 984,
    name: "Fish Egg",
    blueprint: "PrimalItemConsumable_UnderwaterEgg_C",
  },
  {
    id: 721,
    name: "Cactus Broth",
    blueprint: "PrimalItemConsumable_CactusBuffSoup_C",
  },
  {
    id: 14,
    name: "Cooked Meat",
    blueprint: "PrimalItemConsumable_CookedMeat_C",
  },
  {
    id: 144,
    name: "Simple Rifle Ammo",
    blueprint: "PrimalItemAmmo_SimpleRifleBullet_C",
  },
  {
    id: 775,
    name: "Exceptional Kibble",
    blueprint: "PrimalItemConsumable_Kibble_Base_XLarge_C",
  },
  {
    id: 776,
    name: "Extraordinary Kibble",
    blueprint: "PrimalItemConsumable_Kibble_Base_Special_C",
  },
  {
    id: 253,
    name: "Cooked Prime Meat",
    blueprint: "PrimalItemConsumable_CookedPrimeMeat_C",
  },
  { id: 589, name: "Wardrums", blueprint: "PrimalItemStructure_Wardrums_C" },
  { id: 605, name: "Wooden Cage", blueprint: "PrimalItemStructure_WoodCage_C" },
  {
    id: 84,
    name: "Wooden Catwalk",
    blueprint: "PrimalItemStructure_WoodCatwalk_C",
  },
  {
    id: 1487,
    name: "Poison Talon",
    blueprint: "PrimalItemResource_ApexDrop_PoisonWyvern_C",
  },
  {
    id: 1486,
    name: "Lightning Talon",
    blueprint: "PrimalItemResource_ApexDrop_LightningWyvern_C",
  },
  {
    id: 772,
    name: "Maewing Saddle",
    blueprint: "PrimalItemArmor_MilkGliderSaddle_C",
  },
  {
    id: 927,
    name: "Ammo Box",
    blueprint: "PrimalItemStructure_AmmoContainer_C",
  },
  {
    id: 1355,
    name: "Megalania Toxin",
    blueprint: "PrimalItemResource_ApexDrop_Megalania_C",
  },
  {
    id: 1324,
    name: "Megalodon Tooth",
    blueprint: "PrimalItemResource_ApexDrop_Megalodon_C",
  },
  {
    id: 1301,
    name: "Sauropod Vertebra",
    blueprint: "PrimalItemResource_ApexDrop_Sauro_C",
  },
  {
    id: 1302,
    name: "Spinosaurus Sail",
    blueprint: "PrimalItemResource_ApexDrop_Spino_C",
  },
  {
    id: 1303,
    name: "Therizino Claws",
    blueprint: "PrimalItemResource_ApexDrop_Theriz_C",
  },
  { id: 750, name: "Zip-Line Anchor", blueprint: "PrimalItemAmmo_Zipline_C" },
  {
    id: 689,
    name: "Gas Collector",
    blueprint: "PrimalItemStructure_GasCollector_C",
  },
  {
    id: 693,
    name: "Portable Rope Ladder",
    blueprint: "PrimalItemStructure_PortableLadder_C",
  },
  {
    id: 690,
    name: "Large Wood Elevator Platform",
    blueprint: "PrimalItemStructure_WoodElevatorPlatform_Large_C",
  },
  { id: 681, name: "Tek Turret", blueprint: "PrimalItemStructure_TurretTek_C" },
  {
    id: 1356,
    name: "Thylacoleo Hook-Claw",
    blueprint: "PrimalItemResource_ApexDrop_Thylaco_C",
  },
  {
    id: 246,
    name: "Advanced Rifle Bullet",
    blueprint: "PrimalItemAmmo_AdvancedRifleBullet_C",
  },
  {
    id: 459,
    name: "Advanced Sniper Bullet",
    blueprint: "PrimalItemAmmo_AdvancedSniperBullet_C",
  },
  {
    id: 268,
    name: "Simple Shotgun Ammo",
    blueprint: "PrimalItemAmmo_SimpleShotgunBullet_C",
  },
  { id: 738, name: "Tek Railgun", blueprint: "PrimalItem_TekSniper_C" },
  {
    id: 745,
    name: "Tranquilizer Dart",
    blueprint: "PrimalItemAmmo_TranqDart_C",
  },
  {
    id: 749,
    name: "Tranq Spear Bolt",
    blueprint: "PrimalItemAmmo_TranqSpearBolt_C",
  },
  { id: 141, name: "Radio", blueprint: "PrimalItemRadio_C" },
  {
    id: 761,
    name: "Large Taxidermy Base",
    blueprint: "PrimalItemStructure_TaxidermyBase_Large_C",
  },
  {
    id: 820,
    name: "Desert Titan Saddle",
    blueprint: "PrimalItemArmor_DesertKaiju_C",
  },
  {
    id: 823,
    name: "Mek Backpack",
    blueprint: "PrimalItemArmor_MekBackpack_Base_C",
  },
  {
    id: 762,
    name: "Taxidermy Tool",
    blueprint: "PrimalItem_WeaponTaxidermyTool_C",
  },
  {
    id: 298,
    name: "Prime Meat Jerky",
    blueprint: "PrimalItemConsumable_CookedPrimeMeat_Jerky_C",
  },
  { id: 362, name: "Crossbow", blueprint: "PrimalItem_WeaponCrossbow_C" },
  {
    id: 487,
    name: "Fishing Rod",
    blueprint: "PrimalItem_WeaponFishingRod_Mission_C",
  },
  { id: 184, name: "Flare Gun", blueprint: "PrimalItem_WeaponFlareGun_C" },
  { id: 1, name: "Simple Pistol", blueprint: "PrimalItem_WeaponGun_C" },
  {
    id: 476,
    name: "Unstable Element Shard",
    blueprint: "PrimalItemResource_ShardRefined_C",
  },
  {
    id: 604,
    name: "Stone Fireplace",
    blueprint: "PrimalItemStructure_Fireplace_C",
  },
  {
    id: 907,
    name: "Fertilized R-Velonasaur Egg",
    blueprint: "PrimalItemConsumable_Egg_Spindles_Gen2_Fertilized_C",
  },
  {
    id: 731,
    name: "Harpoon Launcher",
    blueprint: "PrimalItem_WeaponHarpoon_C",
  },
  { id: 732, name: "Lance", blueprint: "PrimalItem_WeaponLance_C" },
  {
    id: 29,
    name: "Chitin Helmet",
    blueprint: "PrimalItemArmor_ChitinHelmet_C",
  },
  { id: 26, name: "Hide Gloves", blueprint: "PrimalItemArmor_HideGloves_C" },
  { id: 998, name: "Forest Coloring", blueprint: "PrimalItemDye_Forest_C" },
  {
    id: 714,
    name: "Auric Mushroom",
    blueprint: "PrimalItemConsumable_Mushroom_Auric_C",
  },
  { id: 733, name: "Lasso", blueprint: "PrimalItem_WeaponLasso_C" },
  {
    id: 244,
    name: "Fabricated Pistol",
    blueprint: "PrimalItem_WeaponMachinedPistol_C",
  },
  { id: 1010, name: "Silver Coloring", blueprint: "PrimalItemDye_Silver_C" },
  {
    id: 361,
    name: "Pump-Action Shotgun",
    blueprint: "PrimalItem_WeaponMachinedShotgun_C",
  },
  { id: 35, name: "Metal Pick", blueprint: "PrimalItem_WeaponMetalPick_C" },
  {
    id: 1265,
    name: "Beta Fenrisúlfr Trophy",
    blueprint: "PrimalItemTrophy_FenrirBoss_Beta_C",
  },
  {
    id: 132,
    name: "Longneck Rifle",
    blueprint: "PrimalItem_WeaponOneShotRifle_C",
  },
  {
    id: 1026,
    name: "Gorilla Flag",
    blueprint: "PrimalItemStructure_Flag_Gorilla_C",
  },
  { id: 38, name: "Paintbrush", blueprint: "PrimalItem_WeaponPaintbrush_C" },
  { id: 140, name: "Pike", blueprint: "PrimalItem_WeaponPike_C" },
  {
    id: 977,
    name: "Dinosaur Egg",
    blueprint: "PrimalItemConsumable_Egg_XtraLarge_C",
  },
  {
    id: 50,
    name: "Fertilizer",
    blueprint: "PrimalItemConsumable_Fertilizer_Compost_C",
  },
  {
    id: 812,
    name: "Rock Drake Egg",
    blueprint: "PrimalItemConsumable_Egg_RockDrake_C",
  },
  {
    id: 838,
    name: "Fertilized Velonasaur Egg",
    blueprint: "PrimalItemConsumable_Egg_Spindles_Fertilized_C",
  },
  { id: 783, name: "Mutagel", blueprint: "PrimalItemConsumable_Mutagel_C" },
  {
    id: 522,
    name: "Baryonyx Saddle",
    blueprint: "PrimalItemArmor_BaryonyxSaddle_C",
  },
  {
    id: 963,
    name: "Artifact of the Devious",
    blueprint: "PrimalItemArtifact_04_C",
  },
  {
    id: 887,
    name: "Tek Canteen",
    blueprint: "PrimalItemConsumable_TekCanteenCraftable_C",
  },
  {
    id: 1041,
    name: "Tripwire Narcotic Trap",
    blueprint: "PrimalItem_WeaponPoisonTrap_C",
  },
  {
    id: 52,
    name: "Medical Brew",
    blueprint: "PrimalItemConsumable_HealSoup_C",
  },
  {
    id: 804,
    name: "Shell Fragment",
    blueprint: "PrimalItemResource_TurtleShell_C",
  },
  {
    id: 889,
    name: "Tek Phase Pistol",
    blueprint: "PrimalItem_WeaponTekPistol_C",
  },
  {
    id: 55,
    name: "Human Feces",
    blueprint: "PrimalItemConsumable_HumanPoop_C",
  },
  {
    id: 825,
    name: "M.D.S.M.",
    blueprint: "PrimalItemArmor_MekBackpack_Shield_C",
  },
  {
    id: 786,
    name: "Raw Prime Fish Meat",
    blueprint: "PrimalItemConsumable_RawPrimeMeat_Fish_C",
  },
  { id: 451, name: "Electric Prod", blueprint: "PrimalItem_WeaponProd_C" },
  { id: 2, name: "Assault Rifle", blueprint: "PrimalItem_WeaponRifle_C" },
  {
    id: 3,
    name: "Rocket Launcher",
    blueprint: "PrimalItem_WeaponRocketLauncher_C",
  },
  {
    id: 876,
    name: "Cruise Missile",
    blueprint: "PrimalItem_WeaponTekCruiseMissile_C",
  },
  {
    id: 953,
    name: "Artifact of the Depths",
    blueprint: "PrimalItemArtifactAB_C",
  },
  {
    id: 254,
    name: "Battle Tartare",
    blueprint: "PrimalItemConsumable_Soup_BattleTartare_C",
  },
  {
    id: 229,
    name: "Calien Soup",
    blueprint: "PrimalItemConsumable_Soup_CalienSoup_C",
  },
  { id: 434, name: "Wooden Club", blueprint: "PrimalItem_WeaponStoneClub_C" },
  {
    id: 929,
    name: "Egg Incubator",
    blueprint: "PrimalItemStructure_EggIncubator_C",
  },
  { id: 139, name: "Slingshot", blueprint: "PrimalItem_WeaponSlingshot_C" },
  {
    id: 392,
    name: "Spray Painter",
    blueprint: "PrimalItem_WeaponSprayPaint_C",
  },
  {
    id: 981,
    name: "Plant Species Z Fruit",
    blueprint: "PrimalItem_PlantSpeciesZ_Grenade_C",
  },
  {
    id: 967,
    name: "Artifact of the Immune",
    blueprint: "PrimalItemArtifact_08_C",
  },
  {
    id: 1043,
    name: "Crystal Wyvern Egg",
    blueprint: "PrimalItemConsumable_Egg_CrystalWyvern_C",
  },
  {
    id: 34,
    name: "Stone Hatchet",
    blueprint: "PrimalItem_WeaponStoneHatchet_C",
  },
  { id: 736, name: "Sword", blueprint: "PrimalItem_WeaponSword_C" },
  {
    id: 46,
    name: "Improvised Explosive Device",
    blueprint: "PrimalItem_WeaponTripwireC4_C",
  },
  { id: 21, name: "Cloth Gloves", blueprint: "PrimalItemArmor_ClothGloves_C" },
  {
    id: 961,
    name: "Artifact of the Pack",
    blueprint: "PrimalItemArtifact_02_C",
  },
  {
    id: 970,
    name: "Artifact of the Brute",
    blueprint: "PrimalItemArtifact_12_C",
  },
  {
    id: 231,
    name: "Focal Chili",
    blueprint: "PrimalItemConsumable_Soup_FocalChili_C",
  },
  {
    id: 230,
    name: "Fria Curry",
    blueprint: "PrimalItemConsumable_Soup_FriaCurry_C",
  },
  {
    id: 228,
    name: "Lazarus Chowder",
    blueprint: "PrimalItemConsumable_Soup_LazarusChowder_C",
  },
  {
    id: 255,
    name: "Shadow Steak Saute",
    blueprint: "PrimalItemConsumable_Soup_ShadowSteak_C",
  },
  {
    id: 53,
    name: "Energy Brew",
    blueprint: "PrimalItemConsumable_StaminaSoup_C",
  },
  {
    id: 724,
    name: "Sweet Vegetable Cake",
    blueprint: "PrimalItemConsumable_SweetVeggieCake_C",
  },
  {
    id: 453,
    name: "Broth of Enlightenment",
    blueprint: "PrimalItemConsumable_TheHorn_C",
  },
  {
    id: 276,
    name: "Citronal Seed",
    blueprint: "PrimalItemConsumable_Seed_Citronal_C",
  },
  {
    id: 99,
    name: "Citronal",
    blueprint: "PrimalItemConsumable_Veggie_Citronal_C",
  },
  {
    id: 829,
    name: "King Titan Flag",
    blueprint: "PrimalItemStructure_Flag_KingKaiju_C",
  },
  {
    id: 234,
    name: "Rockarrot",
    blueprint: "PrimalItemConsumable_Veggie_Rockarrot_C",
  },
  {
    id: 1046,
    name: "Fertilized Ember Crystal Wyvern Egg",
    blueprint: "PrimalItemConsumable_Egg_CrystalWyvern_Fertilized_Ember_C",
  },
  {
    id: 712,
    name: "Aquatic Mushroom",
    blueprint: "PrimalItemConsumable_Mushroom_Aquatic_C",
  },
  {
    id: 1297,
    name: "Corrupt Heart",
    blueprint: "PrimalItemResource_RareDrop_CorruptHeart_C",
  },
  { id: 831, name: "Cannon Shell", blueprint: "PrimalItemAmmo_CannonShell_C" },
  { id: 990, name: "Specimen Implant", blueprint: "PrimalItem_StartingNote_C" },
  {
    id: 439,
    name: "Greenhouse Ceiling",
    blueprint: "PrimalItemStructure_GreenhouseCeiling_C",
  },
  {
    id: 441,
    name: "Greenhouse Door",
    blueprint: "PrimalItemStructure_GreenhouseDoor_C",
  },
  {
    id: 444,
    name: "Sloped Greenhouse Roof",
    blueprint: "PrimalItemStructure_GreenhouseRoof_C",
  },
  {
    id: 266,
    name: "Metal Dinosaur Gate",
    blueprint: "PrimalItemStructure_MetalGate_C",
  },
  { id: 718, name: "Beer Jar", blueprint: "PrimalItemConsumable_BeerJar_C" },
  {
    id: 1022,
    name: "Metal Sign",
    blueprint: "PrimalItemStructure_MetalSign_C",
  },
  { id: 951, name: "Stego Saddle", blueprint: "PrimalItemArmor_StegoSaddle_C" },
  {
    id: 180,
    name: "Metal Doorframe",
    blueprint: "PrimalItemStructure_MetalWallWithDoor_C",
  },
  { id: 126, name: "Smithy", blueprint: "PrimalItemStructure_AnvilBench_C" },
  {
    id: 715,
    name: "Mushroom Brew",
    blueprint: "PrimalItemConsumable_Soup_MushroomSoup_C",
  },
  {
    id: 100,
    name: "Parasaur Saddle",
    blueprint: "PrimalItemArmor_ParaSaddle_C",
  },
  {
    id: 104,
    name: "Pulmonoscorpius Saddle",
    blueprint: "PrimalItemArmor_ScorpionSaddle_C",
  },
  { id: 730, name: "Glow stick", blueprint: "PrimalItem_GlowStick_C" },
  { id: 125, name: "Refining Forge", blueprint: "PrimalItemStructure_Forge_C" },
  {
    id: 758,
    name: "Scout Remote",
    blueprint: "PrimalItem_WeaponScoutRemote_CityTerminal_C",
  },
  { id: 795, name: "Ambergris", blueprint: "PrimalItemResource_Ambergris_C" },
  {
    id: 837,
    name: "Velonasaur Egg",
    blueprint: "PrimalItemConsumable_Egg_Spindles_C",
  },
  {
    id: 189,
    name: "Electrical Generator",
    blueprint: "PrimalItemStructure_PowerGenerator_C",
  },
  {
    id: 882,
    name: "Federation Exo Boots",
    blueprint: "PrimalItemArmor_TekBoots_Gen2_C",
  },
  {
    id: 954,
    name: "Artifact of the Shadows",
    blueprint: "PrimalItemArtifactAB_2_C",
  },
  {
    id: 1304,
    name: "Alpha Tyrannosaur Tooth",
    blueprint: "PrimalItemResource_ApexDrop_AlphaRex_C",
  },
  {
    id: 955,
    name: "Artifact of the Stalker",
    blueprint: "PrimalItemArtifactAB_3_C",
  },
  {
    id: 956,
    name: "Artifact of the Lost",
    blueprint: "PrimalItemArtifactAB_4_C",
  },
  {
    id: 957,
    name: "Artifact of the Gatekeeper",
    blueprint: "PrimalItemArtifactSE_01_C",
  },
  {
    id: 958,
    name: "Artifact of the Crag",
    blueprint: "PrimalItemArtifactSE_02_C",
  },
  {
    id: 400,
    name: "Sloped Stone Roof",
    blueprint: "PrimalItemStructure_StoneRoof_C",
  },
  {
    id: 923,
    name: "Basic Fertilized Maewing Egg",
    blueprint: "PrimalItemConsumable_Egg_MilkGlider_XSmall_Fertilized_C",
  },
  { id: 952, name: "Base Shield", blueprint: "PrimalItemArmor_Shield_C" },
  {
    id: 964,
    name: "Artifact of the Clever",
    blueprint: "PrimalItemArtifact_05_C",
  },
  {
    id: 966,
    name: "Artifact of the Devourer",
    blueprint: "PrimalItemArtifact_07_C",
  },
  {
    id: 971,
    name: "Cooked Lamb Chop",
    blueprint: "PrimalItemConsumable_CookedLambChop_C",
  },
  {
    id: 989,
    name: "Some Recipe Thing",
    blueprint: "PrimalItem_RecipeNote_Base_C",
  },
  {
    id: 996,
    name: "Cantaloupe Coloring",
    blueprint: "PrimalItemDye_Cantaloupe_C",
  },
  { id: 997, name: "Cyan Coloring", blueprint: "PrimalItemDye_Cyan_C" },
  {
    id: 475,
    name: "Unstable Element",
    blueprint: "PrimalItemResource_ElementRefined_C",
  },
  { id: 1004, name: "Orange Coloring", blueprint: "PrimalItemDye_Orange_C" },
  {
    id: 1005,
    name: "Parchement Coloring",
    blueprint: "PrimalItemDye_Parchment_C",
  },
  { id: 1006, name: "Pink Coloring", blueprint: "PrimalItemDye_Pink_C" },
  { id: 1007, name: "Purple Coloring", blueprint: "PrimalItemDye_Purple_C" },
  { id: 1008, name: "Red Coloring", blueprint: "PrimalItemDye_Red_C" },
  {
    id: 318,
    name: "Stone Foundation",
    blueprint: "PrimalItemStructure_StoneFloor_C",
  },
  { id: 1009, name: "Royalty Coloring", blueprint: "PrimalItemDye_Royalty_C" },
  { id: 489, name: "Pliers", blueprint: "PrimalItem_Pliers_C" },
  { id: 311, name: "Stone Wall", blueprint: "PrimalItemStructure_StoneWall_C" },
  {
    id: 323,
    name: "Stone Windowframe",
    blueprint: "PrimalItemStructure_StoneWallWithWindow_C",
  },
  {
    id: 657,
    name: "Tek Catwalk",
    blueprint: "PrimalItemStructure_TekCatwalk_C",
  },
  {
    id: 658,
    name: "Tek Ceiling",
    blueprint: "PrimalItemStructure_TekCeiling_C",
  },
  {
    id: 666,
    name: "Tek Hatchframe",
    blueprint: "PrimalItemStructure_TekCeilingWithTrapdoor_C",
  },
  { id: 493, name: "Tek Boots", blueprint: "PrimalItemArmor_TekBoots_C" },
  { id: 1011, name: "Sky Coloring", blueprint: "PrimalItemDye_Sky_C" },
  { id: 1013, name: "Tan Coloring", blueprint: "PrimalItemDye_Tan_C" },
  {
    id: 1014,
    name: "Tangerine Coloring",
    blueprint: "PrimalItemDye_Tangerine_C",
  },
  {
    id: 1027,
    name: "Spider Flag",
    blueprint: "PrimalItemStructure_Flag_Spider_C",
  },
  { id: 1042, name: "Glider Suit", blueprint: "PrimalItemArmor_Glider_C" },
  {
    id: 1029,
    name: "Artifact Pedestal",
    blueprint: "PrimalItemStructure_TrophyBase_C",
  },
  { id: 673, name: "Tek Wall", blueprint: "PrimalItemStructure_TekWall_C" },
  {
    id: 662,
    name: "Tek Doorframe",
    blueprint: "PrimalItemStructure_TekWallWithDoor_C",
  },
  {
    id: 675,
    name: "Tek Windowframe",
    blueprint: "PrimalItemStructure_TekWallWithWindow_C",
  },
  { id: 1307, name: "Wishbone", blueprint: "PrimalItemResource_Wishbone_C" },
  {
    id: 47,
    name: "Waterskin",
    blueprint: "PrimalItemConsumable_WaterskinCraftable_C",
  },
  {
    id: 15,
    name: "Water Jar",
    blueprint: "PrimalItemConsumable_WaterJarCraftable_C",
  },
  { id: 18, name: "Cloth Shirt", blueprint: "PrimalItemArmor_ClothShirt_C" },
  { id: 25, name: "Hide Boots", blueprint: "PrimalItemArmor_HideBoots_C" },
  { id: 24, name: "Hide Hat", blueprint: "PrimalItemArmor_HideHelmet_C" },
  {
    id: 171,
    name: "Metal Fence Foundation",
    blueprint: "PrimalItemStructure_MetalFenceFoundation_C",
  },
  {
    id: 83,
    name: "Thatch Doorframe",
    blueprint: "PrimalItemStructure_ThatchWallWithDoor_C",
  },
  {
    id: 27,
    name: "Chitin Leggings",
    blueprint: "PrimalItemArmor_ChitinPants_C",
  },
  {
    id: 28,
    name: "Chitin Chestpiece",
    blueprint: "PrimalItemArmor_ChitinShirt_C",
  },
  {
    id: 463,
    name: "Arthropluera Saddle",
    blueprint: "PrimalItemArmor_ArthroSaddle_C",
  },
  { id: 602, name: "Bunk Bed", blueprint: "PrimalItemStructure_Bed_Modern_C" },
  { id: 30, name: "Chitin Boots", blueprint: "PrimalItemArmor_ChitinBoots_C" },
  {
    id: 31,
    name: "Chitin Gauntlets",
    blueprint: "PrimalItemArmor_ChitinGloves_C",
  },
  {
    id: 106,
    name: "Large Storage Box",
    blueprint: "PrimalItemStructure_StorageBox_Large_C",
  },
  {
    id: 247,
    name: "Rocket Propelled Grenade",
    blueprint: "PrimalItemAmmo_Rocket_C",
  },
  {
    id: 781,
    name: "Ammonite Bile",
    blueprint: "PrimalItemResource_AmmoniteBlood_C",
  },
  {
    id: 826,
    name: "M.S.C.M.",
    blueprint: "PrimalItemArmor_MekBackpack_SiegeCannon_C",
  },
  {
    id: 310,
    name: "Stone Fence Foundation",
    blueprint: "PrimalItemStructure_StoneFenceFoundation_C",
  },
  {
    id: 321,
    name: "Stone Pillar",
    blueprint: "PrimalItemStructure_StonePillar_C",
  },
  {
    id: 322,
    name: "Stone Doorframe",
    blueprint: "PrimalItemStructure_StoneWallWithDoor_C",
  },
  {
    id: 843,
    name: "Fertilized Fjordhawk Egg",
    blueprint: "PrimalItemConsumable_Egg_Fjordhawk_Fertilized_C",
  },
  {
    id: 891,
    name: "Fertilized R-Allosaurus Egg",
    blueprint: "PrimalItemConsumable_Egg_Allo_Gen2_Fertilized_C",
  },
  {
    id: 892,
    name: "R-Bronto Egg",
    blueprint: "PrimalItemConsumable_Egg_Bronto_Gen2_C",
  },
  {
    id: 903,
    name: "Fertilized R-Parasaur Egg",
    blueprint: "PrimalItemConsumable_Egg_Para_Gen2_Fertilized_C",
  },
  {
    id: 908,
    name: "R-Turtle Egg",
    blueprint: "PrimalItemConsumable_Egg_Turtle_Gen2_C",
  },
  {
    id: 913,
    name: "Superior Fertilized Maewing Egg",
    blueprint: "PrimalItemConsumable_Egg_MilkGlider_Large_Fertilized_C",
  },
  {
    id: 914,
    name: "Regular Maewing Egg",
    blueprint: "PrimalItemConsumable_Egg_MilkGlider_Medium_C",
  },
  {
    id: 918,
    name: "Extraordinary Maewing Egg",
    blueprint: "PrimalItemConsumable_Egg_MilkGlider_Special_C",
  },
  { id: 933, name: "Jar of Pitch", blueprint: "PrimalItemAmmo_Boulder_Fire_C" },
  { id: 888, name: "Minigun", blueprint: "PrimalItem_WeaponMinigun_C" },
  { id: 784, name: "Tek Bow", blueprint: "PrimalItem_WeaponTekBow_C" },
  {
    id: 1278,
    name: "Alpha Dinopithecus King Trophy",
    blueprint: "PrimalItemTrophy_BossDinopithecus_Hard_C",
  },
  { id: 433, name: "Fur Gauntlets", blueprint: "PrimalItemArmor_FurGloves_C" },
  {
    id: 505,
    name: "Ghillie Gauntlets",
    blueprint: "PrimalItemArmor_GhillieGloves_C",
  },
  { id: 446, name: "Riot Leggings", blueprint: "PrimalItemArmor_RiotPants_C" },
  {
    id: 461,
    name: "Allosaurus Saddle",
    blueprint: "PrimalItemArmor_AlloSaddle_C",
  },
  { id: 213, name: "Carno Saddle", blueprint: "PrimalItemArmor_CarnoSaddle_C" },
  {
    id: 535,
    name: "Iguanodon Saddle",
    blueprint: "PrimalItemArmor_IguanodonSaddle_C",
  },
  {
    id: 536,
    name: "Kaprosuchus Saddle",
    blueprint: "PrimalItemArmor_KaprosuchusSaddle_C",
  },
  {
    id: 211,
    name: "Megalodon Saddle",
    blueprint: "PrimalItemArmor_MegalodonSaddle_C",
  },
  {
    id: 577,
    name: "Yutyrannus Saddle",
    blueprint: "PrimalItemArmor_YutySaddle_C",
  },
  {
    id: 720,
    name: "Bug Repellant",
    blueprint: "PrimalItemConsumable_BugRepellant_C",
  },
  {
    id: 972,
    name: "Cooked Prime Fish Meat",
    blueprint: "PrimalItemConsumable_CookedPrimeMeat_Fish_C",
  },
  { id: 12, name: "Raw Meat", blueprint: "PrimalItemConsumable_RawMeat_C" },
  {
    id: 787,
    name: "Raw Fish Meat",
    blueprint: "PrimalItemConsumable_RawMeat_Fish_C",
  },
  {
    id: 711,
    name: "Aggeravic Mushroom",
    blueprint: "PrimalItemResource_CommonMushroom_C",
  },
  { id: 727, name: "Climbing Pick", blueprint: "PrimalItem_WeaponClimbPick_C" },
  {
    id: 726,
    name: "Charge Lantern",
    blueprint: "PrimalItem_WeaponRadioactiveLanternCharge_C",
  },
  {
    id: 270,
    name: "Amarberry Seed",
    blueprint: "PrimalItemConsumable_Seed_Amarberry_C",
  },
  {
    id: 274,
    name: "Stimberry Seed",
    blueprint: "PrimalItemConsumable_Seed_Stimberry_C",
  },
  {
    id: 806,
    name: "Raw Mutton",
    blueprint: "PrimalItemConsumable_RawMutton_C",
  },
  {
    id: 252,
    name: "Raw Prime Meat",
    blueprint: "PrimalItemConsumable_RawPrimeMeat_C",
  },
  { id: 999, name: "Green Coloring", blueprint: "PrimalItemDye_Green_C" },
  { id: 1001, name: "Mud Coloring", blueprint: "PrimalItemDye_Mud_C" },
  { id: 1002, name: "Navy Coloring", blueprint: "PrimalItemDye_Navy_C" },
  { id: 1003, name: "Olive Coloring", blueprint: "PrimalItemDye_Olive_C" },
  { id: 1015, name: "White Coloring", blueprint: "PrimalItemDye_White_C" },
  { id: 1016, name: "Yellow Coloring", blueprint: "PrimalItemDye_Yellow_C" },
  {
    id: 582,
    name: "Large Elevator Platform",
    blueprint: "PrimalItemStructure_ElevatorPlatformLarge_C",
  },
  {
    id: 580,
    name: "Small Elevator Platform",
    blueprint: "PrimalItemStructure_ElevatorPlatformSmall_C",
  },
  {
    id: 581,
    name: "Medium Elevator Platform",
    blueprint: "PrimalItemStructure_ElevatorPlatfromMedium_C",
  },
  {
    id: 579,
    name: "Elevator Track",
    blueprint: "PrimalItemStructure_ElevatorTrackBase_C",
  },
  {
    id: 680,
    name: "Cloning Chamber",
    blueprint: "PrimalItemStructure_TekCloningChamber_C",
  },
  {
    id: 678,
    name: "Vacuum Compartment",
    blueprint: "PrimalItemStructure_UnderwaterBase_C",
  },
  {
    id: 679,
    name: "Vacuum Compartment Moonpool",
    blueprint: "PrimalItemStructure_UnderwaterBase_Moonpool_C",
  },
  {
    id: 438,
    name: "Greenhouse Wall",
    blueprint: "PrimalItemStructure_GreenhouseWall_C",
  },
  {
    id: 440,
    name: "Greenhouse DoorFrame",
    blueprint: "PrimalItemStructure_GreenhouseWallWithDoor_C",
  },
  {
    id: 243,
    name: "Metal Billboard",
    blueprint: "PrimalItemStructure_MetalSign_Large_C",
  },
  {
    id: 443,
    name: "Sloped Greenhouse Wall Right",
    blueprint: "PrimalItemStructure_GreenhouseWall_Sloped_Right_C",
  },
  {
    id: 445,
    name: "Greenhouse Window",
    blueprint: "PrimalItemStructure_GreenhouseWindow_C",
  },
  {
    id: 1019,
    name: "Stolen Headstone",
    blueprint: "PrimalItemStructure_HW_Grave_C",
  },
  { id: 1021, name: "Scarecrow", blueprint: "PrimalItemStructure_Scarecrow_C" },
  {
    id: 609,
    name: "Training Dummy",
    blueprint: "PrimalItemStructure_TrainingDummy_C",
  },
  {
    id: 168,
    name: "Metal Ceiling",
    blueprint: "PrimalItemStructure_MetalCeiling_C",
  },
  {
    id: 169,
    name: "Metal Hatchframe",
    blueprint: "PrimalItemStructure_MetalCeilingWithTrapdoor_C",
  },
  {
    id: 621,
    name: "Giant Metal Hatchframe",
    blueprint: "PrimalItemStructure_MetalCeilingWithTrapdoorGiant_C",
  },
  {
    id: 173,
    name: "Behemoth Gate",
    blueprint: "PrimalItemStructure_MetalGate_Large_C",
  },
  {
    id: 265,
    name: "Metal Dinosaur Gateway",
    blueprint: "PrimalItemStructure_MetalGateframe_C",
  },
  {
    id: 174,
    name: "Behemoth Gateway",
    blueprint: "PrimalItemStructure_MetalGateframe_Large_C",
  },
  {
    id: 175,
    name: "Metal Ladder",
    blueprint: "PrimalItemStructure_MetalLadder_C",
  },
  {
    id: 176,
    name: "Metal Pillar",
    blueprint: "PrimalItemStructure_MetalPillar_C",
  },
  {
    id: 593,
    name: "Metal Railing",
    blueprint: "PrimalItemStructure_MetalRailing_C",
  },
  { id: 910, name: "Canoe", blueprint: "PrimalItemCanoe_C" },
  {
    id: 937,
    name: "Dinopithecus King Flag",
    blueprint: "PrimalItemStructure_Flag_BossDinopithecus_C",
  },
  {
    id: 950,
    name: "Paracer Saddle",
    blueprint: "PrimalItemArmor_Paracer_Saddle_C",
  },
  {
    id: 975,
    name: "Medium Animal Feces",
    blueprint: "PrimalItemConsumable_DinoPoopMedium_C",
  },
  { id: 177, name: "Metal Ramp", blueprint: "PrimalItemStructure_MetalRamp_C" },
  {
    id: 578,
    name: "Single Panel Flag",
    blueprint: "PrimalItemStructure_Flag_Single_C",
  },
  {
    id: 269,
    name: "Metal Wall Sign",
    blueprint: "PrimalItemStructure_MetalSign_Wall_C",
  },
  {
    id: 617,
    name: "Metal Staircase",
    blueprint: "PrimalItemStructure_MetalStairs_C",
  },
  {
    id: 178,
    name: "Metal Trapdoor",
    blueprint: "PrimalItemStructure_MetalTrapdoor_C",
  },
  {
    id: 622,
    name: "Giant Metal Trapdoor",
    blueprint: "PrimalItemStructure_MetalTrapdoorGiant_C",
  },
  { id: 179, name: "Metal Wall", blueprint: "PrimalItemStructure_MetalWall_C" },
  {
    id: 181,
    name: "Metal Windowframe",
    blueprint: "PrimalItemStructure_MetalWallWithWindow_C",
  },
  {
    id: 182,
    name: "Metal Window",
    blueprint: "PrimalItemStructure_MetalWindow_C",
  },
  {
    id: 188,
    name: "Air Conditioner",
    blueprint: "PrimalItemStructure_AirConditioner_C",
  },
  { id: 383, name: "Bear Trap", blueprint: "PrimalItemStructure_BearTrap_C" },
  {
    id: 384,
    name: "Large Bear Trap",
    blueprint: "PrimalItemStructure_BearTrap_Large_C",
  },
  {
    id: 746,
    name: "Pheromone Dart",
    blueprint: "PrimalItemAmmo_AggroTranqDart_C",
  },
  {
    id: 744,
    name: "Grappling Hook",
    blueprint: "PrimalItemAmmo_GrapplingHook_C",
  },
  { id: 37, name: "Torch", blueprint: "PrimalItem_WeaponTorch_C" },
  {
    id: 372,
    name: "Transponder Tracker",
    blueprint: "PrimalItem_WeaponTransGPS_C",
  },
  {
    id: 129,
    name: "Simple Bed",
    blueprint: "PrimalItemStructure_Bed_Simple_C",
  },
  {
    id: 606,
    name: "Beer Barrel",
    blueprint: "PrimalItemStructure_BeerBarrel_C",
  },
  { id: 309, name: "Bookshelf", blueprint: "PrimalItemStructure_Bookshelf_C" },
  { id: 39, name: "Campfire", blueprint: "PrimalItemStructure_Campfire_C" },
  {
    id: 375,
    name: "Feeding Trough",
    blueprint: "PrimalItemStructure_FeedingTrough_C",
  },
  {
    id: 1024,
    name: "Multi-Panel Flag",
    blueprint: "PrimalItemStructure_Flag_C",
  },
  {
    id: 1025,
    name: "Dragon Flag",
    blueprint: "PrimalItemStructure_Flag_Dragon_C",
  },
  {
    id: 360,
    name: "Industrial Grill",
    blueprint: "PrimalItemStructure_Grill_C",
  },
  {
    id: 618,
    name: "Industrial Grinder",
    blueprint: "PrimalItemStructure_Grinder_C",
  },
  {
    id: 686,
    name: "Heavy Auto Turret",
    blueprint: "PrimalItemStructure_HeavyTurret_C",
  },
  { id: 196, name: "Refrigerator", blueprint: "PrimalItemStructure_IceBox_C" },
  { id: 414, name: "Wooden Raft", blueprint: "PrimalItemRaft_C" },
  {
    id: 1051,
    name: "Metal Double Door",
    blueprint: "PrimalItemStructure_DoubleDoor_Metal_C",
  },
  {
    id: 766,
    name: "Woolly Rhino Saddle",
    blueprint: "PrimalItemArmor_RhinoSaddle_C",
  },
  {
    id: 688,
    name: "Tek Sleeping Pod",
    blueprint: "PrimalItemStructure_Bed_Tek_C",
  },
  { id: 217, name: "Keratin", blueprint: "PrimalItemResource_Keratin_C" },
  {
    id: 1047,
    name: "Fertilized Tropical Crystal Wyvern Egg",
    blueprint: "PrimalItemConsumable_Egg_CrystalWyvern_Fertilized_WS_C",
  },
  {
    id: 1325,
    name: "Crystal Talon",
    blueprint: "PrimalItemResource_ApexDrop_CrystalWyvern_C",
  },
  {
    id: 796,
    name: "Tropeognathus Saddle",
    blueprint: "PrimalItemArmor_TropeSaddle_C",
  },
  { id: 682, name: "Motorboat", blueprint: "PrimalItemMotorboat_C" },
  {
    id: 788,
    name: "Gasbags Saddle",
    blueprint: "PrimalItemArmor_GasBagsSaddle_C",
  },
  {
    id: 844,
    name: "Fenrisúlfr Flag",
    blueprint: "PrimalItemStructure_Flag_Fjordur_C",
  },
  { id: 9, name: "Metal", blueprint: "PrimalItemResource_Metal_C" },
  { id: 1048, name: "Bee Hive", blueprint: "PrimalItemStructure_BeeHive_C" },
  {
    id: 1050,
    name: "Greenhouse Double Door",
    blueprint: "PrimalItemStructure_DoubleDoor_Greenhouse_C",
  },
  {
    id: 1053,
    name: "Tek Double Door",
    blueprint: "PrimalItemStructure_DoubleDoor_Tek_C",
  },
  {
    id: 601,
    name: "Industrial Cooker",
    blueprint: "PrimalItemStructure_IndustrialCookingPot_C",
  },
  {
    id: 600,
    name: "Industrial Forge",
    blueprint: "PrimalItemStructure_IndustrialForge_C",
  },
  { id: 198, name: "Remote Keypad", blueprint: "PrimalItemStructure_Keypad_C" },
  { id: 195, name: "Lamppost", blueprint: "PrimalItemStructure_Lamppost_C" },
  {
    id: 359,
    name: "Omnidirectional Lamppost",
    blueprint: "PrimalItemStructure_LamppostOmni_C",
  },
  {
    id: 107,
    name: "Mortar And Pestle",
    blueprint: "PrimalItemStructure_MortarAndPestle_C",
  },
  {
    id: 421,
    name: "Painting Canvas",
    blueprint: "PrimalItemStructure_PaintingCanvas_C",
  },
  {
    id: 295,
    name: "Preserving Bin",
    blueprint: "PrimalItemStructure_PreservingBin_C",
  },
  {
    id: 598,
    name: "Homing Underwater Mine",
    blueprint: "PrimalItemStructure_SeaMine_C",
  },
  { id: 814, name: "Tracer Rounds", blueprint: "PrimalItemAmmo_TracerRound_C" },
  {
    id: 767,
    name: "Cryofridge",
    blueprint: "PrimalItemStructure_CryoFridge_C",
  },
  {
    id: 764,
    name: "Tek Gravity Grenade",
    blueprint: "PrimalItem_WeaponTekGravityGrenade_C",
  },
  {
    id: 777,
    name: "Simple Kibble",
    blueprint: "PrimalItemConsumable_Kibble_Base_Small_C",
  },
  {
    id: 799,
    name: "Andrewsarchus Saddle",
    blueprint: "PrimalItemArmor_AndrewsarchusSaddle_C",
  },
  {
    id: 1052,
    name: "Reinforced Double Door",
    blueprint: "PrimalItemStructure_DoubleDoor_Stone_C",
  },
  {
    id: 41,
    name: "Hide Sleeping Bag",
    blueprint: "PrimalItemStructure_SleepingBag_Hide_C",
  },
  {
    id: 40,
    name: "Standing Torch",
    blueprint: "PrimalItemStructure_StandingTorch_C",
  },
  {
    id: 306,
    name: "Vault",
    blueprint: "PrimalItemStructure_StorageBox_Huge_C",
  },
  {
    id: 676,
    name: "Tek Generator",
    blueprint: "PrimalItemStructure_TekGenerator_C",
  },
  { id: 685, name: "Tek Light", blueprint: "PrimalItemStructure_TekLight_C" },
  {
    id: 800,
    name: "Desmodus Saddle",
    blueprint: "PrimalItemArmor_DesmodusSaddle_C",
  },
  {
    id: 801,
    name: "Sanguine Elixir",
    blueprint: "PrimalItem_SanguineElixir_C",
  },
  { id: 785, name: "Net Projectile", blueprint: "PrimalItemAmmo_ArrowNet_C" },
  {
    id: 778,
    name: "Basic Kibble",
    blueprint: "PrimalItemConsumable_Kibble_Base_XSmall_C",
  },
  {
    id: 1054,
    name: "Wooden Double Door",
    blueprint: "PrimalItemStructure_DoubleDoor_Wood_C",
  },
  {
    id: 1055,
    name: "Tek Dedicated Storage",
    blueprint: "PrimalItemStructure_DedicatedStorage_C",
  },
  {
    id: 199,
    name: "Metal Irrigation Pipe - Inclined",
    blueprint: "PrimalItemStructure_MetalPipeIncline_C",
  },
  {
    id: 201,
    name: "Metal Irrigation Pipe - Intersection",
    blueprint: "PrimalItemStructure_MetalPipeIntersection_C",
  },
  {
    id: 202,
    name: "Metal Irrigation Pipe - Straight",
    blueprint: "PrimalItemStructure_MetalPipeStraight_C",
  },
  {
    id: 203,
    name: "Metal Irrigation Pipe - Tap",
    blueprint: "PrimalItemStructure_MetalPipeTap_C",
  },
  {
    id: 204,
    name: "Metal Irrigation Pipe - Vertical",
    blueprint: "PrimalItemStructure_MetalPipeVertical_C",
  },
  {
    id: 191,
    name: "Inclined Electrical Cable",
    blueprint: "PrimalItemStructure_PowerCableIncline_C",
  },
  {
    id: 807,
    name: "Basilisk Egg",
    blueprint: "PrimalItemConsumable_Egg_Basilisk_C",
  },
  {
    id: 816,
    name: "Artifact of Growth",
    blueprint: "PrimalItemArtifact_Extinction_ForestKaiju_C",
  },
  {
    id: 802,
    name: "Scrap Metal",
    blueprint: "PrimalItemResource_ScrapMetal_C",
  },
  {
    id: 841,
    name: "Admin Blink Rifle",
    blueprint: "PrimalItem_WeaponAdminBlinkRifle_C",
  },
  {
    id: 192,
    name: "Electrical Cable Intersection",
    blueprint: "PrimalItemStructure_PowerCableIntersection_C",
  },
  {
    id: 193,
    name: "Straight Electrical Cable",
    blueprint: "PrimalItemStructure_PowerCableStraight_C",
  },
  {
    id: 194,
    name: "Vertical Electrical Cable",
    blueprint: "PrimalItemStructure_PowerCableVertical_C",
  },
  {
    id: 190,
    name: "Electrical Outlet",
    blueprint: "PrimalItemStructure_PowerOutlet_C",
  },
  {
    id: 113,
    name: "Stone Irrigation Pipe - Intersection",
    blueprint: "PrimalItemStructure_StonePipeIntersection_C",
  },
  { id: 683, name: "Toilet", blueprint: "PrimalItemStructure_Toilet_C" },
  {
    id: 186,
    name: "Water Reservoir",
    blueprint: "PrimalItemStructure_WaterTank_C",
  },
  {
    id: 312,
    name: "Metal Water Reservoir",
    blueprint: "PrimalItemStructure_WaterTankMetal_C",
  },
  {
    id: 403,
    name: "Sloped Metal Roof",
    blueprint: "PrimalItemStructure_MetalRoof_C",
  },
  {
    id: 404,
    name: "Sloped Metal Wall Left",
    blueprint: "PrimalItemStructure_MetalWall_Sloped_Left_C",
  },
  { id: 819, name: "Unassembled Mek", blueprint: "PrimalItem_Spawner_Mek_C" },
  {
    id: 554,
    name: "Procoptodon Saddle",
    blueprint: "PrimalItemArmor_ProcoptodonSaddle_C",
  },
  {
    id: 296,
    name: "Metal Spike Wall",
    blueprint: "PrimalItemStructure_MetalSpikeWall_C",
  },
  {
    id: 248,
    name: "Medium Crop Plot",
    blueprint: "PrimalItemStructure_CropPlot_Medium_C",
  },
  {
    id: 1056,
    name: "Metal Irrigation Pipe - Flexible",
    blueprint: "PrimalItemStructure_PipeFlex_Metal_C",
  },
  { id: 1108, name: "Titanoboa Egg", blueprint: null },
  {
    id: 1057,
    name: "Stone Irrigation Pipe - Flexible",
    blueprint: "PrimalItemStructure_PipeFlex_Stone_C",
  },
  {
    id: 1058,
    name: "Adobe Triangle Ceiling",
    blueprint: "PrimalItemStructure_TriCeiling_Adobe_C",
  },
  {
    id: 1059,
    name: "Greenhouse Triangle Ceiling",
    blueprint: "PrimalItemStructure_TriCeiling_Greenhouse_C",
  },
  {
    id: 405,
    name: "Sloped Metal Wall Right",
    blueprint: "PrimalItemStructure_MetalWall_Sloped_Right_C",
  },
  {
    id: 833,
    name: "Empty Cryopod",
    blueprint: "PrimalItem_WeaponEmptyCryopod_C",
  },
  {
    id: 962,
    name: "Artifact of the Massive",
    blueprint: "PrimalItemArtifact_03_C",
  },
  {
    id: 1060,
    name: "Metal Triangle Ceiling",
    blueprint: "PrimalItemStructure_TriCeiling_Metal_C",
  },
  {
    id: 1062,
    name: "Tek Triangle Ceiling",
    blueprint: "PrimalItemStructure_TriCeiling_Tek_C",
  },
  {
    id: 1061,
    name: "Stone Triangle Ceiling",
    blueprint: "PrimalItemStructure_TriCeiling_Stone_C",
  },
  {
    id: 402,
    name: "Sloped Stone Wall Right",
    blueprint: "PrimalItemStructure_StoneWall_Sloped_Right_C",
  },
  {
    id: 394,
    name: "Sloped Thatch Roof",
    blueprint: "PrimalItemStructure_ThatchRoof_C",
  },
  {
    id: 395,
    name: "Sloped Thatch Wall Left",
    blueprint: "PrimalItemStructure_ThatchWall_Sloped_Left_C",
  },
  {
    id: 396,
    name: "Sloped Thatch Wall Right",
    blueprint: "PrimalItemStructure_ThatchWall_Sloped_Right_C",
  },
  {
    id: 397,
    name: "Sloped Wooden Roof",
    blueprint: "PrimalItemStructure_WoodRoof_C",
  },
  {
    id: 398,
    name: "Sloped Wood Wall Left",
    blueprint: "PrimalItemStructure_WoodWall_Sloped_Left_C",
  },
  {
    id: 399,
    name: "Sloped Wood Wall Right",
    blueprint: "PrimalItemStructure_WoodWall_Sloped_Right_C",
  },
  {
    id: 315,
    name: "Stone Ceiling",
    blueprint: "PrimalItemStructure_StoneCeiling_C",
  },
  {
    id: 620,
    name: "Giant Reinforced Trapdoor",
    blueprint: "PrimalItemStructure_StoneCeilingDoorGiant_C",
  },
  { id: 590, name: "War Map", blueprint: "PrimalItemStructure_WarMap_C" },
  {
    id: 815,
    name: "Artifact of Chaos",
    blueprint: "PrimalItemArtifact_Extinction_DesertKaiju_C",
  },
  {
    id: 834,
    name: "Snow Owl Pellet",
    blueprint: "PrimalItemConsumable_OwlPellet_C",
  },
  {
    id: 835,
    name: "Snow Owl Egg",
    blueprint: "PrimalItemConsumable_Egg_Owl_C",
  },
  {
    id: 840,
    name: "Delivery Crate",
    blueprint: "PrimalItemStructure_StorageBox_Balloon_C",
  },
  {
    id: 845,
    name: "Unassembled TEK Hover Skiff",
    blueprint: "PrimalItem_Spawner_HoverSkiff_C",
  },
  {
    id: 316,
    name: "Stone Hatchframe",
    blueprint: "PrimalItemStructure_StoneCeilingWithTrapdoor_C",
  },
  {
    id: 616,
    name: "Stone Staircase",
    blueprint: "PrimalItemStructure_StoneStairs_C",
  },
  { id: 661, name: "Tek Door", blueprint: "PrimalItemStructure_TekDoor_C" },
  {
    id: 663,
    name: "Tek Fence Foundation",
    blueprint: "PrimalItemStructure_TekFenceFoundation_C",
  },
  {
    id: 665,
    name: "Tek Foundation",
    blueprint: "PrimalItemStructure_TekFloor_C",
  },
  { id: 667, name: "Tek Ladder", blueprint: "PrimalItemStructure_TekLadder_C" },
  { id: 668, name: "Tek Pillar", blueprint: "PrimalItemStructure_TekPillar_C" },
  {
    id: 669,
    name: "Tek Railing",
    blueprint: "PrimalItemStructure_TekRailing_C",
  },
  { id: 670, name: "Tek Ramp", blueprint: "PrimalItemStructure_TekRamp_C" },
  { id: 782, name: "Blue Gem", blueprint: "PrimalItemResource_Gem_BioLum_C" },
  {
    id: 869,
    name: "Tek Shoulder Cannon",
    blueprint: "PrimalItemArmor_ShoulderCannon_C",
  },
  {
    id: 872,
    name: "Wood Ocean Platform",
    blueprint: "PrimalItemStructure_Wood_OceanPlatform_C",
  },
  { id: 874, name: "Tek Sensor", blueprint: "PrimalItemStructure_TekAlarm_C" },
  {
    id: 852,
    name: "Tek Grenade Launcher",
    blueprint: "PrimalItem_WeaponTekGrenadeLauncher_C",
  },
  {
    id: 671,
    name: "Tek Staircase",
    blueprint: "PrimalItemStructure_TekStairs_C",
  },
  {
    id: 672,
    name: "Tek Trapdoor",
    blueprint: "PrimalItemStructure_TekTrapdoor_C",
  },
  {
    id: 81,
    name: "Thatch Foundation",
    blueprint: "PrimalItemStructure_ThatchFloor_C",
  },
  {
    id: 82,
    name: "Thatch Wall",
    blueprint: "PrimalItemStructure_ThatchWall_C",
  },
  {
    id: 687,
    name: "Fish Basket",
    blueprint: "PrimalItemStructure_FishBasket_C",
  },
  {
    id: 612,
    name: "Metal Tree Platform",
    blueprint: "PrimalItemStructure_TreePlatform_Metal_C",
  },
  {
    id: 611,
    name: "Wooden Tree Platform",
    blueprint: "PrimalItemStructure_TreePlatform_Wood_C",
  },
  { id: 735, name: "Smoke Grenade", blueprint: "PrimalItem_GasGrenade_C" },
  { id: 435, name: "Poison Grenade", blueprint: "PrimalItem_PoisonGrenade_C" },
  { id: 737, name: "Tek Grenade", blueprint: "PrimalItem_TekGrenade_C" },
  { id: 739, name: "Tek Rifle", blueprint: "PrimalItem_TekRifle_C" },
  {
    id: 884,
    name: "Federation Exo Helmet",
    blueprint: "PrimalItemArmor_TekHelmet_Gen2_C",
  },
  {
    id: 885,
    name: "Federation Exo-leggings",
    blueprint: "PrimalItemArmor_TekPants_Gen2_C",
  },
  {
    id: 906,
    name: "R-Velonasaur Egg",
    blueprint: "PrimalItemConsumable_Egg_Spindles_Gen2_C",
  },
  {
    id: 924,
    name: "Astrodelphis Starwing Saddle",
    blueprint: "PrimalItemArmor_SpaceDolphinSaddle_Tek_C",
  },
  {
    id: 326,
    name: "Tripwire Alarm Trap",
    blueprint: "PrimalItem_WeaponAlarmTrap_C",
  },
  { id: 42, name: "C4 Remote Detonator", blueprint: "PrimalItem_WeaponC4_C" },
  {
    id: 376,
    name: "Compound Bow",
    blueprint: "PrimalItem_WeaponCompoundBow_C",
  },
  {
    id: 436,
    name: "Fabricated Sniper Rifle",
    blueprint: "PrimalItem_WeaponMachinedSniper_C",
  },
  {
    id: 36,
    name: "Metal Hatchet",
    blueprint: "PrimalItem_WeaponMetalHatchet_C",
  },
  { id: 33, name: "Stone Pick", blueprint: "PrimalItem_WeaponStonePick_C" },
  {
    id: 697,
    name: "Wood Elevator Top Switch",
    blueprint: "PrimalItemStructure_WoodElevatorTopSwitch_C",
  },
  {
    id: 698,
    name: "Wood Elevator Track",
    blueprint: "PrimalItemStructure_WoodElevatorTrack_C",
  },
  {
    id: 911,
    name: "Unassembled Exo-Mek",
    blueprint: "PrimalItem_Spawner_Exosuit_C",
  },
  {
    id: 921,
    name: "Exceptional Fertilized Maewing Egg",
    blueprint: "PrimalItemConsumable_Egg_MilkGlider_XLarge_Fertilized_C",
  },
  {
    id: 926,
    name: "Super Mining Drill",
    blueprint: "PrimalItem_WeaponMiningDrill_Maze_C",
  },
  {
    id: 1273,
    name: "Alpha Rockwell Final Form Trophy ",
    blueprint: "PrimalItemTrophy_RockwellGen2_Alpha_C",
  },
  {
    id: 947,
    name: "Mosasaur Saddle",
    blueprint: "PrimalItemArmor_MosaSaddle_C",
  },
  {
    id: 948,
    name: "Mosasaur Platform Saddle",
    blueprint: "PrimalItemArmor_MosaSaddle_Platform_C",
  },
  { id: 740, name: "Tek Sword", blueprint: "PrimalItem_WeaponTekSword_C" },
  {
    id: 1044,
    name: "Fertilized Crystal Wyvern Egg",
    blueprint: "PrimalItemConsumable_Egg_CrystalWyvern_Fertilized_C",
  },
  {
    id: 925,
    name: "Tek Hoversail",
    blueprint: "PrimalItem_Spawner_HoverSail_Main_C",
  },
  {
    id: 1063,
    name: "Wooden Triangle Ceiling",
    blueprint: "PrimalItemStructure_TriCeiling_Wood_C",
  },
  {
    id: 1269,
    name: "Beta Moeder Trophy",
    blueprint: "PrimalItemTrophy_EelBoss_Beta_C",
  },
  {
    id: 928,
    name: "Tek Crop Plot",
    blueprint: "PrimalItemStructure_CropPlot_Tek_C",
  },
  {
    id: 930,
    name: "Loadout Mannequin",
    blueprint: "PrimalItemStructure_LoadoutDummy_C",
  },
  {
    id: 965,
    name: "Artifact of the Skylord",
    blueprint: "PrimalItemArtifact_06_C",
  },
  {
    id: 974,
    name: "Massive Animal Feces",
    blueprint: "PrimalItemConsumable_DinoPoopMassive_C",
  },
  {
    id: 1064,
    name: "Adobe Double Doorframe",
    blueprint: "PrimalItemStructure_DoubleDoorframe_Adobe_C",
  },
  {
    id: 1065,
    name: "Greenhouse Double Doorframe",
    blueprint: "PrimalItemStructure_DoubleDoorframe_Greenhouse_C",
  },
  {
    id: 938,
    name: "Amargasaurus Egg",
    blueprint: "PrimalItemConsumable_Egg_Amargasaurus_C",
  },
  {
    id: 770,
    name: "Metal Double Doorframe",
    blueprint: "PrimalItemStructure_DoubleDoorframe_Metal_C",
  },
  {
    id: 939,
    name: "Fertilized Amargasaurus Egg",
    blueprint: "PrimalItemConsumable_Egg_Amargasaurus_Fertilized_C",
  },
  {
    id: 940,
    name: "Sinomacrops Egg",
    blueprint: "PrimalItemConsumable_Egg_Sinomacrops_C",
  },
  {
    id: 944,
    name: "SCUBA Leggings",
    blueprint: "PrimalItemArmor_ScubaPants_C",
  },
  {
    id: 1066,
    name: "Stone Double Doorframe",
    blueprint: "PrimalItemStructure_DoubleDoorframe_Stone_C",
  },
  {
    id: 1260,
    name: "King Titan Trophy (Alpha)",
    blueprint: "PrimalItemTrophy_Kaiju_King_Alpha_C",
  },
  {
    id: 1067,
    name: "Tek Double Doorframe",
    blueprint: "PrimalItemStructure_DoubleDoorframe_Tek_C",
  },
  {
    id: 1266,
    name: "Gamma Fenrisúlfr Trophy",
    blueprint: "PrimalItemTrophy_FenrirBoss_Gamma_C",
  },
  {
    id: 1068,
    name: "Wooden Double Doorframe",
    blueprint: "PrimalItemStructure_DoubleDoorframe_Wood_C",
  },
  {
    id: 976,
    name: "Small Animal Feces",
    blueprint: "PrimalItemConsumable_DinoPoopSmall_C",
  },
  { id: 992, name: "Black Coloring", blueprint: "PrimalItemDye_Black_C" },
  {
    id: 172,
    name: "Metal Foundation",
    blueprint: "PrimalItemStructure_MetalFloor_C",
  },
  { id: 1038, name: "Tranq Arrow", blueprint: "PrimalItemAmmo_ArrowTranq_C" },
  {
    id: 985,
    name: "Plant Species X Seed",
    blueprint: "PrimalItemConsumable_Seed_DefensePlant_C",
  },
  {
    id: 1283,
    name: "Alpha Wyvern Trophy",
    blueprint: "PrimalItemTrophy_AlphaWyvern_C",
  },
  {
    id: 1069,
    name: "Adobe Fence Support",
    blueprint: "PrimalItemStructure_FenceSupport_Adobe_C",
  },
  {
    id: 1255,
    name: "Rockwell Trophy (Beta)",
    blueprint: "PrimalItemTrophy_Rockwell_Beta_C",
  },
  {
    id: 1276,
    name: "Dinopithecus King Trophy",
    blueprint: "PrimalItemTrophy_BossDinopithecus_C",
  },
  {
    id: 987,
    name: "Box o Chocolates",
    blueprint: "PrimalItemConsumable_ValentinesChocolate_C",
  },
  {
    id: 991,
    name: "Magenta Coloring",
    blueprint: "PrimalItemDye_ActuallyMagenta_C",
  },
  { id: 994, name: "Brick Coloring", blueprint: "PrimalItemDye_Brick_C" },
  { id: 995, name: "Brown Coloring", blueprint: "PrimalItemDye_Brown_C" },
  {
    id: 719,
    name: "Bio Toxin",
    blueprint: "PrimalItemConsumable_JellyVenom_C",
  },
  { id: 993, name: "Blue Coloring", blueprint: "PrimalItemDye_Blue_C" },
  {
    id: 1070,
    name: "Metal Fence Support",
    blueprint: "PrimalItemStructure_FenceSupport_Metal_C",
  },
  {
    id: 1071,
    name: "Stone Fence Support",
    blueprint: "PrimalItemStructure_FenceSupport_Stone_C",
  },
  {
    id: 1292,
    name: "Gamma Megapithecus Trophy",
    blueprint: "PrimalItemTrophy_Gorilla_Gamma_C",
  },
  {
    id: 216,
    name: "Chitin/Keratin",
    blueprint: "PrimalItemResource_ChitinOrKeratin_C",
  },
  {
    id: 780,
    name: "Achatina Paste",
    blueprint: "PrimalItemResource_SnailPaste_C",
  },
  {
    id: 1072,
    name: "Tek Fence Support",
    blueprint: "PrimalItemStructure_FenceSupport_Tek_C",
  },
  {
    id: 1073,
    name: "Wooden Fence Support",
    blueprint: "PrimalItemStructure_FenceSupport_Wood_C",
  },
  {
    id: 769,
    name: "Adobe Triangle Foundation",
    blueprint: "PrimalItemStructure_TriFoundation_Adobe_C",
  },
  {
    id: 1074,
    name: "Metal Triangle Foundation",
    blueprint: "PrimalItemStructure_TriFoundation_Metal_C",
  },
  {
    id: 692,
    name: "Metal Cliff Platform",
    blueprint: "PrimalItemStructure_Metal_CliffPlatform_C",
  },
  {
    id: 1298,
    name: "Fire Talon",
    blueprint: "PrimalItemResource_ApexDrop_FireWyvern_C",
  },
  {
    id: 1299,
    name: "Sarcosuchus Skin",
    blueprint: "PrimalItemResource_ApexDrop_Sarco_C",
  },
  {
    id: 1075,
    name: "Stone Triangle Foundation",
    blueprint: "PrimalItemStructure_TriFoundation_Stone_C",
  },
  {
    id: 1076,
    name: "Tek Triangle Foundation",
    blueprint: "PrimalItemStructure_TriFoundation_Tek_C",
  },
  {
    id: 694,
    name: "Shag Rug",
    blueprint: "PrimalItemStructure_Furniture_Rug_C",
  },
  {
    id: 1311,
    name: "Summon Gamma King Titan",
    blueprint: "PrimalItem_BossTribute_KingKaijuEasy_C",
  },
  {
    id: 1028,
    name: "Tek Transmitter",
    blueprint: "PrimalItemStructure_TekTransmitter_C",
  },
  {
    id: 1077,
    name: "Wooden Triangle Foundation",
    blueprint: "PrimalItemStructure_TriFoundation_Wood_C",
  },
  {
    id: 1031,
    name: "Metal Irrigation Pipe - Intake",
    blueprint: "PrimalItemStructure_MetalPipeIntake_C",
  },
  {
    id: 1032,
    name: "Sloped Tek Roof",
    blueprint: "PrimalItemStructure_TekRoof_C",
  },
  {
    id: 1033,
    name: "Thatch Ceiling",
    blueprint: "PrimalItemStructure_ThatchCeiling_C",
  },
  {
    id: 1035,
    name: "Reinforced Window",
    blueprint: "PrimalItemStructure_StoneWindow_C",
  },
  {
    id: 1282,
    name: "Alpha Deathworm Trophy",
    blueprint: "PrimalItemTrophy_AlphaWorm_C",
  },
  {
    id: 1078,
    name: "Adobe Stairs",
    blueprint: "PrimalItemStructure_Ramp_Adobe_C",
  },
  {
    id: 1308,
    name: "Summon Desert Titan",
    blueprint: "PrimalItem_BossTribute_DesertKaiju_C",
  },
  {
    id: 13,
    name: "Spoiled Meat",
    blueprint: "PrimalItemConsumable_SpoiledMeat_C",
  },
  {
    id: 1079,
    name: "Metal Stairs",
    blueprint: "PrimalItemStructure_Ramp_Metal_C",
  },
  {
    id: 1080,
    name: "Stone Stairs",
    blueprint: "PrimalItemStructure_Ramp_Stone_C",
  },
  {
    id: 1036,
    name: "Wooden Billboard",
    blueprint: "PrimalItemStructure_WoodSign_Large_C",
  },
  {
    id: 1037,
    name: "Wooden Wall Sign",
    blueprint: "PrimalItemStructure_WoodSign_Wall_C",
  },
  {
    id: 1284,
    name: "Alpha Broodmother Trophy",
    blueprint: "PrimalItemTrophy_Broodmother_Alpha_C",
  },
  {
    id: 1049,
    name: "Adobe Double Door",
    blueprint: "PrimalItemStructure_DoubleDoor_Adobe_C",
  },
  { id: 1081, name: "Tek Stairs", blueprint: "PrimalItemStructure_Ramp_Tek_C" },
  {
    id: 614,
    name: "Wooden Stairs",
    blueprint: "PrimalItemStructure_Ramp_Wood_C",
  },
  {
    id: 1286,
    name: "Gamma Broodmother Trophy",
    blueprint: "PrimalItemTrophy_Broodmother_Gamma_C",
  },
  {
    id: 1082,
    name: "Adobe Triangle Roof",
    blueprint: "PrimalItemStructure_TriRoof_Adobe_C",
  },
  {
    id: 1083,
    name: "Greenhouse Triangle Roof",
    blueprint: "PrimalItemStructure_TriRoof_Greenhouse_C",
  },
  {
    id: 1084,
    name: "Metal Triangle Roof",
    blueprint: "PrimalItemStructure_TriRoof_Metal_C",
  },
  {
    id: 1085,
    name: "Stone Triangle Roof",
    blueprint: "PrimalItemStructure_TriRoof_Stone_C",
  },
  {
    id: 271,
    name: "Azulberry Seed",
    blueprint: "PrimalItemConsumable_Seed_Azulberry_C",
  },
  {
    id: 1086,
    name: "Tek Triangle Roof",
    blueprint: "PrimalItemStructure_TriRoof_Tek_C",
  },
  {
    id: 1087,
    name: "Wooden Triangle Roof",
    blueprint: "PrimalItemStructure_TriRoof_Wood_C",
  },
  {
    id: 1088,
    name: "Large Adobe Wall",
    blueprint: "PrimalItemStructure_LargeWall_Adobe_C",
  },
  {
    id: 1034,
    name: "Reinforced Trapdoor",
    blueprint: "PrimalItemStructure_StoneTrapdoor_C",
  },
  {
    id: 1089,
    name: "Large Metal Wall",
    blueprint: "PrimalItemStructure_LargeWall_Metal_C",
  },
  {
    id: 1091,
    name: "Large Tek Wall",
    blueprint: "PrimalItemStructure_LargeWall_Tek_C",
  },
  {
    id: 1092,
    name: "Large Wooden Wall",
    blueprint: "PrimalItemStructure_LargeWall_Wood_C",
  },
  {
    id: 1093,
    name: "Flexible Electrical Cable",
    blueprint: "PrimalItemStructure_Wire_Flex_C",
  },
  {
    id: 1287,
    name: "Alpha Dragon Trophy",
    blueprint: "PrimalItemTrophy_Dragon_Alpha_C",
  },
  { id: 5, name: "Bow", blueprint: "PrimalItem_WeaponBow_C" },
  { id: 43, name: "C4 Charge", blueprint: "PrimalItemC4Ammo_C" },
  { id: 6, name: "Grenade", blueprint: "PrimalItem_WeaponGrenade_C" },
  {
    id: 460,
    name: "Allosaurus Egg",
    blueprint: "PrimalItemConsumable_Egg_Allo_C",
  },
  { id: 69, name: "Rex Saddle", blueprint: "PrimalItemArmor_RexSaddle_C" },
  {
    id: 1094,
    name: "Fertilized Allosaurus Egg",
    blueprint: "PrimalItemConsumable_Egg_Allo_Fertilized_C",
  },
  {
    id: 1095,
    name: "Ankylo Egg",
    blueprint: "PrimalItemConsumable_Egg_Ankylo_C",
  },
  {
    id: 251,
    name: "Rare Mushroom",
    blueprint: "PrimalItemResource_RareMushroom_C",
  },
  {
    id: 1096,
    name: "Fertilized Ankylo Egg",
    blueprint: "PrimalItemConsumable_Egg_Ankylo_Fertilized_C",
  },
  {
    id: 1097,
    name: "Fertilized Aberrant Ankylo Egg",
    blueprint: "PrimalItemConsumable_Egg_Ankylo_Fertilized_AB_C",
  },
  {
    id: 167,
    name: "Metal Catwalk",
    blueprint: "PrimalItemStructure_MetalCatwalk_C",
  },
  {
    id: 1099,
    name: "Fertilized Archaeopteryx Egg",
    blueprint: "PrimalItemConsumable_Egg_Archa_Fertilized_C",
  },
  {
    id: 115,
    name: "Stone Irrigation Pipe - Tap",
    blueprint: "PrimalItemStructure_StonePipeTap_C",
  },
  {
    id: 114,
    name: "Stone Irrigation Pipe - Vertical",
    blueprint: "PrimalItemStructure_StonePipeVertical_C",
  },
  { id: 22, name: "Hide Pants", blueprint: "PrimalItemArmor_HidePants_C" },
  { id: 23, name: "Hide Shirt", blueprint: "PrimalItemArmor_HideShirt_C" },
  {
    id: 1100,
    name: "Argentavis Egg",
    blueprint: "PrimalItemConsumable_Egg_Argent_C",
  },
  {
    id: 1288,
    name: "Beta Dragon Trophy",
    blueprint: "PrimalItemTrophy_Dragon_Beta_C",
  },
  {
    id: 1289,
    name: "Gamma Dragon Trophy",
    blueprint: "PrimalItemTrophy_Dragon_Gamma_C",
  },
  {
    id: 455,
    name: "Woolly Rhino Horn",
    blueprint: "PrimalItemResource_Horn_C",
  },
  { id: 380, name: "Metal Sickle", blueprint: "PrimalItem_WeaponSickle_C" },
  {
    id: 1101,
    name: "Fertilized Argentavis Egg",
    blueprint: "PrimalItemConsumable_Egg_Argent_Fertilized_C",
  },
  {
    id: 1254,
    name: "Rockwell Trophy (Gamma)",
    blueprint: "PrimalItemTrophy_Rockwell_C",
  },
  {
    id: 1102,
    name: "Arthropluera Egg",
    blueprint: "PrimalItemConsumable_Egg_Arthro_C",
  },
  {
    id: 1103,
    name: "Fertilized Arthropluera Egg",
    blueprint: "PrimalItemConsumable_Egg_Arthro_Fertilized_C",
  },
  {
    id: 759,
    name: "Small Taxidermy Base",
    blueprint: "PrimalItemStructure_TaxidermyBase_Small_C",
  },
  {
    id: 1309,
    name: "Summon Forest Titan",
    blueprint: "PrimalItem_BossTribute_ForestKaiju_C",
  },
  { id: 1020, name: "Pumpkin", blueprint: "PrimalItemStructure_Pumpkin_C" },
  {
    id: 233,
    name: "Longrass",
    blueprint: "PrimalItemConsumable_Veggie_Longrass_C",
  },
  {
    id: 96,
    name: "Wooden Window",
    blueprint: "PrimalItemStructure_WoodWindow_C",
  },
  {
    id: 51,
    name: "Bingleberry Soup",
    blueprint: "PrimalItemConsumable_BerrySoup_C",
  },
  {
    id: 1104,
    name: "Fertilized Aberrant Arthropluera Egg",
    blueprint: "PrimalItemConsumable_Egg_Arthro_Fertilized_Aberrant_C",
  },
  {
    id: 634,
    name: "Adobe Pillar",
    blueprint: "PrimalItemStructure_AdobePillar_C",
  },
  {
    id: 1274,
    name: "Beta Rockwell Final Form Trophy",
    blueprint: "PrimalItemTrophy_RockwellGen2_Beta_C",
  },
  {
    id: 111,
    name: "Stone Irrigation Pipe - Straight",
    blueprint: "PrimalItemStructure_StonePipeStraight_C",
  },
  {
    id: 92,
    name: "Wooden Trapdoor",
    blueprint: "PrimalItemStructure_WoodTrapdoor_C",
  },
  { id: 8, name: "Stone", blueprint: "PrimalItemResource_Stone_C" },
  {
    id: 1310,
    name: "Summon Ice Titan",
    blueprint: "PrimalItem_BossTribute_IceKaiju_C",
  },
  { id: 1320, name: "Silicate", blueprint: "PrimalItemResource_Silicate_C" },
  {
    id: 1314,
    name: "Creature Summon",
    blueprint: "PrimalItem_GauntletDamageBuffKey_TempTame_C",
  },
  {
    id: 1316,
    name: "Summon Megapithecus",
    blueprint: "PrimalItem_GauntletDamageBuffKey_TempTame_Gorilla_C",
  },
  {
    id: 1317,
    name: "Broodmother Lysrix Summon",
    blueprint: "PrimalItem_GauntletDamageBuffKey_TempTame_Spider_C",
  },
  {
    id: 387,
    name: "Scuba Tank",
    blueprint: "PrimalItemArmor_ScubaShirt_SuitWithTank_C",
  },
  {
    id: 1321,
    name: "Leech Blood",
    blueprint: "PrimalItemResource_LeechBlood_C",
  },
  {
    id: 245,
    name: "Advanced Bullet",
    blueprint: "PrimalItemAmmo_AdvancedBullet_C",
  },
  { id: 491, name: "Scissors", blueprint: "PrimalItem_WeaponScissors_C" },
  {
    id: 867,
    name: "Megachelon Egg",
    blueprint: "PrimalItemConsumable_Egg_GiantTurtle_C",
  },
  {
    id: 313,
    name: "Plesiosaur Saddle",
    blueprint: "PrimalItemArmor_PlesiaSaddle_C",
  },
  { id: 555, name: "Quetz Saddle", blueprint: "PrimalItemArmor_QuetzSaddle_C" },
  {
    id: 568,
    name: "Tapejara Saddle",
    blueprint: "PrimalItemArmor_TapejaraSaddle_C",
  },
  {
    id: 973,
    name: "Large Animal Feces",
    blueprint: "PrimalItemConsumable_DinoPoopLarge_C",
  },
  { id: 988, name: "Note", blueprint: "PrimalItem_Note_C" },
  {
    id: 1030,
    name: "Plant Species X",
    blueprint: "PrimalItemStructure_TurretPlant_C",
  },
  { id: 742, name: "Flame Arrow", blueprint: "PrimalItemAmmo_ArrowFlame_C" },
  {
    id: 1256,
    name: "Rockwell Trophy (Alpha)",
    blueprint: "PrimalItemTrophy_Rockwell_Beta_Alpha_C",
  },
  {
    id: 821,
    name: "Forest Titan Saddle",
    blueprint: "PrimalItemArmor_ForestKaiju_C",
  },
  {
    id: 1281,
    name: "Alpha Rex Trophy",
    blueprint: "PrimalItemTrophy_AlphaRex_C",
  },
  {
    id: 1090,
    name: "Large Stone Wall",
    blueprint: "PrimalItemStructure_LargeWall_Stone_C",
  },
  {
    id: 1105,
    name: "Baryonyx Egg",
    blueprint: "PrimalItemConsumable_Egg_Baryonyx_C",
  },
  {
    id: 1106,
    name: "Fertilized Baryonyx Egg",
    blueprint: "PrimalItemConsumable_Egg_Baryonyx_Fertilized_C",
  },
  {
    id: 1263,
    name: "Fenrisúlfr Trophy",
    blueprint: "PrimalItemTrophy_FenrirBoss_C",
  },
  {
    id: 1277,
    name: "Gamma Dinopithecus King Trophy",
    blueprint: "PrimalItemTrophy_BossDinopithecus_Easy_C",
  },
  {
    id: 1107,
    name: "Fertilized Aberrant Baryonyx Egg",
    blueprint: "PrimalItemConsumable_Egg_Baryonyx_Fertilized_Aberrant_C",
  },
  {
    id: 1275,
    name: "Gamma Rockwell Final Form Trophy",
    blueprint: "PrimalItemTrophy_RockwellGen2_Gamma_C",
  },
  { id: 123, name: "Narcotic", blueprint: "PrimalItemConsumable_Narcotic_C" },
  {
    id: 249,
    name: "Large Crop Plot",
    blueprint: "PrimalItemStructure_CropPlot_Large_C",
  },
  {
    id: 1109,
    name: "Bronto Egg",
    blueprint: "PrimalItemConsumable_Egg_Bronto_C",
  },
  {
    id: 1257,
    name: "Desert Titan Trophy",
    blueprint: "PrimalItemTrophy_Kaiju_Desert_C",
  },
  {
    id: 1258,
    name: "Forest Titan Trophy",
    blueprint: "PrimalItemTrophy_Kaiju_Forest_C",
  },
  {
    id: 1259,
    name: "Ice Titan Trophy",
    blueprint: "PrimalItemTrophy_Kaiju_Ice_C",
  },
  {
    id: 1261,
    name: "King Titan Trophy (Beta)",
    blueprint: "PrimalItemTrophy_Kaiju_King_Beta_C",
  },
  {
    id: 1262,
    name: "King Titan Trophy (Gamma)",
    blueprint: "PrimalItemTrophy_Kaiju_King_Gamma_C",
  },
  {
    id: 1268,
    name: "Alpha Moeder Trophy",
    blueprint: "PrimalItemTrophy_EelBoss_Alpha_C",
  },
  {
    id: 1270,
    name: "Gamma Moeder Trophy",
    blueprint: "PrimalItemTrophy_EelBoss_Gamma_C",
  },
  {
    id: 817,
    name: "Artifact of the Void",
    blueprint: "PrimalItemArtifact_Extinction_IceKaiju_C",
  },
  {
    id: 760,
    name: "Medium Taxidermy Base",
    blueprint: "PrimalItemStructure_TaxidermyBase_Medium_C",
  },
  { id: 779, name: "Mutagen", blueprint: "PrimalItemConsumable_Mutagen_C" },
  { id: 877, name: "Fish Net", blueprint: "PrimalItem_WeaponFishingNet_C" },
  {
    id: 1279,
    name: "Beta Dinopithecus King Trophy",
    blueprint: "PrimalItemTrophy_BossDinopithecus_Medium_C",
  },
  {
    id: 210,
    name: "Mammoth Saddle",
    blueprint: "PrimalItemArmor_MammothSaddle_C",
  },
  {
    id: 677,
    name: "Tek Teleporter",
    blueprint: "PrimalItemStructure_TekTeleporter_C",
  },
  {
    id: 1291,
    name: "Beta Megapithecus Trophy",
    blueprint: "PrimalItemTrophy_Gorilla_Beta_C",
  },
  {
    id: 1110,
    name: "Fertilized Bronto Egg",
    blueprint: "PrimalItemConsumable_Egg_Bronto_Fertilized_C",
  },
  {
    id: 1111,
    name: "Carcharodontosaurus Egg",
    blueprint: "PrimalItemConsumable_Egg_Carcha_C",
  },
  {
    id: 635,
    name: "Adobe Railing",
    blueprint: "PrimalItemStructure_AdobeRailing_C",
  },
  { id: 636, name: "Adobe Ramp", blueprint: "PrimalItemStructure_AdobeRamp_C" },
  {
    id: 1122,
    name: "Fertilized Dimorph Egg",
    blueprint: "PrimalItemConsumable_Egg_Dimorph_Fertilized_Abberant_C",
  },
  {
    id: 639,
    name: "Adobe Trapdoor",
    blueprint: "PrimalItemStructure_AdobeTrapdoor_C",
  },
  { id: 486, name: "Chainsaw", blueprint: "PrimalItem_ChainSaw_C" },
  {
    id: 1251,
    name: "Electronic Binoculars",
    blueprint: "PrimalItem_WeaponElectronicBinoculars_C",
  },
  {
    id: 743,
    name: "Flamethrower Ammo",
    blueprint: "PrimalItemAmmo_Flamethrower_C",
  },
  { id: 729, name: "Flamethrower", blueprint: "PrimalItem_WeapFlamethrower_C" },
  {
    id: 853,
    name: "Fertilized X-Parasaur Egg",
    blueprint: "PrimalItemConsumable_Egg_Para_Fertilized_Bog_C",
  },
  {
    id: 854,
    name: "Fertilized X-Raptor Egg",
    blueprint: "PrimalItemConsumable_Egg_Raptor_Fertilized_Bog_C",
  },
  {
    id: 794,
    name: "Megachelon Platform Saddle",
    blueprint: "PrimalItemArmor_GiantTurtleSaddle_C",
  },
  {
    id: 905,
    name: "Fertilized R-Quetzal Egg",
    blueprint: "PrimalItemConsumable_Egg_Quetz_Gen2_Fertilized_C",
  },
  {
    id: 912,
    name: "Superior Maewing Egg",
    blueprint: "PrimalItemConsumable_Egg_MilkGlider_Large_C",
  },
  { id: 848, name: "Boomerang", blueprint: "PrimalItem_WeaponBoomerang_C" },
  {
    id: 935,
    name: "Explosive Arrow",
    blueprint: "PrimalItemAmmo_ExplosiveArrow_C",
  },
  {
    id: 101,
    name: "Raptor Saddle",
    blueprint: "PrimalItemArmor_RaptorSaddle_C",
  },
  {
    id: 427,
    name: "Beelzebufo Saddle",
    blueprint: "PrimalItemArmor_ToadSaddle_C",
  },
  {
    id: 207,
    name: "Carbonemys Saddle",
    blueprint: "PrimalItemArmor_TurtleSaddle_C",
  },
  {
    id: 272,
    name: "Tintoberry Seed",
    blueprint: "PrimalItemConsumable_Seed_Tintoberry_C",
  },
  {
    id: 105,
    name: "Storage Box",
    blueprint: "PrimalItemStructure_StorageBox_Small_C",
  },
  {
    id: 619,
    name: "Giant Stone Hatchframe",
    blueprint: "PrimalItemStructure_StoneCeilingWithTrapdoorGiant_C",
  },
  { id: 1040, name: "Bola", blueprint: "PrimalItem_WeaponBola_C" },
  {
    id: 1045,
    name: "Fertilized Blood Crystal Wyvern Egg",
    blueprint: "PrimalItemConsumable_Egg_CrystalWyvern_Fertilized_Bloodfall_C",
  },
];

const output = loot.lootCrates.map((lootcrate) => {
  return {
    blueprint: lootcrate.bp,
    name: lootcrate.name || "",
    items: lootcrate.sets.flatMap((set) => {
      return set.entries.map((entry) => {
        return entry.items.map((item) => {
          return {
            itemId: itemarray.find((i) => i.blueprint == item[1])?.id || null,
            itemName:
              itemarray.find((i) => i.blueprint == item[1])?.name || null,
            itemBlueprint: item[1],
            entryName: entry.name,
            setName: set.name,
            setCanRepeatItems: set.canRepeatItems,
            setQtyMin: set.qtyScale.min,
            setQtyMax: set.qtyScale.max,
            setQtyPow: set.qtyScale.pow,
            setWeight: set.weight,
            entryWeight: entry.weight,
            entryQtyMin: entry.qty.min,
            entryQtyMax: entry.qty.max,
            entryQtyPow: entry.qty.pow,
            entryQualityMin: entry.quality.min,
            entryQualityMax: entry.quality.max,
            entryQualityPow: entry.quality.pow,
          };
        });
      });
    }),
  };
});

require("fs").writeFile(
  `insert.txt`,
  [JSON.stringify(output, null, 4)].join("\n"),
  (error) => {
    if (error) {
      throw error;
    }
  }
);

return;
const lootmaps = {
  TheIsland: TheIsland,
  Valguero: Valguero,
  Ragnarok: Ragnarok,
  Aberration: Aberration,
  ScorchedEarth: ScorchedEarth,
  LostIsland: LostIsland,
};

let lootcrate_beacons = {};

Object.keys(lootmaps).forEach((map) => {
  Object.assign(lootcrate_beacons, {
    [map]: lootmaps[map].lootcrate_beacons,
  });
});
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
      id: "SupplyCrate_OceanInstant_C\n\n\nSupplyCrate_OceanInstant_High_C",
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
      id: "SupplyCrate_OceanInstant_C\n\n\nSupplyCrate_OceanInstant_High_C",
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
      id: "SupplyCrate_Cave_Aberration_Level10_C\n\nSupplyCrate_Cave_Aberration_Level10_Double_C",
      name: "White Crate",
    },
    {
      id: "SupplyCrate_Cave_Aberration_Level25_C\n\nSupplyCrate_Cave_Aberration_Level25_Double_C",
      name: "Green Crate",
    },
    {
      id: "SupplyCrate_Cave_Aberration_Level35_C\n\nSupplyCrate_Cave_Aberration_Level35_Double_C",
      name: "Blue Crate",
    },
    {
      id: "SupplyCrate_Cave_Aberration_Level50_C\n\nSupplyCrate_Cave_Aberration_Level50_Double_C",
      name: "Purple Crate",
    },
    {
      id: "SupplyCrate_Cave_Aberration_Level65_C\n\nSupplyCrate_Cave_Aberration_Level65_Double_C",
      name: "Yellow Crate",
    },
    {
      id: "SupplyCrate_Cave_Aberration_Level80_C\n\nSupplyCrate_Cave_Aberration_Level80_Double_C",
      name: "Red Crate",
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
      id: "SupplyCrate_Level35_Aberrant_Surface_C\n\nSupplyCrate_Level35_Aberrant_Surface_Double_C",
      name: "Blue Surface Beacon",
    },
    {
      id: "SupplyCrate_Level50_Aberrant_Surface_C\n\nSupplyCrate_Level50_Aberrant_Surface_Double_C",
      name: "Purple Surface Beacon",
    },
    {
      id: "SupplyCrate_Level65_Aberrant_Surface_C\n\nSupplyCrate_Level65_Aberrant_Surface_Double_C",
      name: "Yellow Surface Beacon",
    },
    {
      id: "SupplyCrate_Level80_Aberrant_Surface_C\n\nSupplyCrate_Level80_Aberrant_Surface_Double_C",
      name: "Red Surface Beacon",
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
      id: "ElementNode_Easy_Horde_C\nElementNode_Hard_Horde_C\nElementNode_Medium_Horde_C\nKingKaiju_ElementNode_C\n",
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
      id: "SupplyCrate_OceanInstant_C\n\n\nSupplyCrate_OceanInstant_High_C",
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
      id: "SupplyCrate_Cave_Aberration_Level10_C\n\nSupplyCrate_Cave_Aberration_Level10_Double_C",
      name: "White Crate",
    },
    {
      id: "SupplyCrate_Cave_Aberration_Level25_C\n\nSupplyCrate_Cave_Aberration_Level25_Double_C",
      name: "Green Crate",
    },
    {
      id: "SupplyCrate_Cave_Aberration_Level35_C\n\nSupplyCrate_Cave_Aberration_Level35_Double_C",
      name: "Blue Crate",
    },
    {
      id: "SupplyCrate_Cave_Aberration_Level50_C\n\nSupplyCrate_Cave_Aberration_Level50_Double_C",
      name: "Purple Crate",
    },
    {
      id: "SupplyCrate_Cave_Aberration_Level65_C\n\nSupplyCrate_Cave_Aberration_Level65_Double_C",
      name: "Yellow Crate",
    },
    {
      id: "SupplyCrate_Cave_Aberration_Level80_C\n\nSupplyCrate_Cave_Aberration_Level80_Double_C",
      name: "Red Crate",
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
      id: "SupplyCrate_Level35_Aberrant_Surface_C\n\nSupplyCrate_Level35_Aberrant_Surface_Double_C",
      name: "Blue Surface Beacon",
    },
    {
      id: "SupplyCrate_Level50_Aberrant_Surface_C\n\nSupplyCrate_Level50_Aberrant_Surface_Double_C",
      name: "Purple Surface Beacon",
    },
    {
      id: "SupplyCrate_Level65_Aberrant_Surface_C\n\nSupplyCrate_Level65_Aberrant_Surface_Double_C",
      name: "Yellow Surface Beacon",
    },
    {
      id: "SupplyCrate_Level80_Aberrant_Surface_C\n\nSupplyCrate_Level80_Aberrant_Surface_Double_C",
      name: "Red Surface Beacon",
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
      id: "SupplyCrate_OceanInstant_C\n\n\nSupplyCrate_OceanInstant_High_C",
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

console.log(lootcrate_beacons);
function findCommonAndUniqueValues(lootcrate_beacons) {
  const colors = Object.keys(lootcrate_beacons.TheIsland);
  const commonValues = {};
  const uniqueValues = {};

  colors.forEach((color) => {
    const commonSet = new Set(lootcrate_beacons.TheIsland[color]);

    for (const map in lootcrate_beacons) {
      const valuesSet = new Set(lootcrate_beacons[map][color]);

      // Find common values
      commonSet.forEach((value) => {
        if (!valuesSet.has(value)) {
          commonSet.delete(value);
        }
      });
    }

    commonValues[color] = Array.from(commonSet);
    uniqueValues[color] = [];

    for (const map in lootcrate_beacons) {
      lootcrate_beacons[map][color].forEach((value) => {
        if (!commonSet.has(value)) {
          uniqueValues[color].push({ map, value });
        }
      });
    }
  });

  return { commonValues, uniqueValues };
}

const result = findCommonAndUniqueValues(lootcrate_beacons);
console.log("Common Values:", result.commonValues);
// console.log("Unique Values:", result.uniqueValues);
// require("fs").writeFile(
//   `insert.txt`,
//   [
//     // `INSERT INTO public."Item" ("crafted_item_id", "item_id", "amount") VALUES`,
//     JSON.stringify(result.commonValues, null, 4),
//   ].join("\n"),
//   (error) => {
//     if (error) {
//       throw error;
//     }
//   }
// );
return;
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
function initTaming() {
  $("#taming").append(`<div class="row jcsb">
    <div><h2 style="clear:both" class="ib marginBottomS">Taming Calculator</h2>${
      method == "n"
        ? ' <span class="bigPill bigPillReverse ib">Passive</span>'
        : ""
    }</div>
    </div>`);
  initTamingNotice();
  $("#taming").append(`<div class="ttRowH ttRH row light bold">
      <div class="flex2 noMob">
        Food
      </div>
      <div class="flex1 jccenter">
        Selected Food / Max
      </div>
      <div class="flex1 jccenter">
        Time
      </div>
      <div class="flex2 tteff">
        Effectiveness
      </div>
      <div class="ttexp noMob"></div>
    </div>

  <div class="item tameSetting ttRow">
    <div class="itemImage" style="">
      <a href="/item/341/sanguine-elixir"><img src="/media/item/Sanguine_Elixir.png" width="42" height="42" alt="Sanguine Elixir"></a>
    </div>
    <div class="itemLabel white bold"><input type="checkbox" id="sanguineElixir" name="sanguineElixir">  <label for="sanguineElixir">Use Sanguine Elixir</label> <span class="lightPill">NEW</span> <span class="bold light small marginTopSS">Increases taming by 30%</span></div>
  </div>

  <div id="tamingTable"></div>

  <div id="tamingExcess" class="lightbox warningBox center">Too much food was used. Excess food is being ignored.</div>

  <div id="tamingWarning" class="lightbox">
    <div class="miniBarWrap" style="margin:.1em 0 .3em"><div class="miniBar" style="width:0%;background-color:#FFF"></div></div>
    <div class="center light">Not enough food.</div>
  </div>

  <div id="tamingResults">
    <div class="center light marginTop2 bold marginBottomSS">With Selected Food:</div>
    <div class="lightbox rCol ${
      method != "n" ? "attachedBottom" : ""
    }" style="justify-content:center;gap:1.5em;">
      <div class="rowItem">
        <div class="center marginBottom marginTopS" style="align-self:center">
          <div class="bigNum light">TOTAL TIME: <span class="white" id="totalTime"></span></div>
        </div>

        <div class="starveTimer widget collapsed lightbox pad0">
          <div class="row pad bold widgetH jcsb">
            <div class="row acenter">
              <img src="/media/item/Food.png" width="26" height="26" alt="ARK: Survival Evolved Food Icon" class="marginRightS">
              Starve Timer&nbsp;&nbsp;<span class="tameSecsLeft widgetHCO light"></span> </div>
              <div class="arrow down"></div>
          </div>
          <div class="pad widgetB">
            <div class="marginBottom2 flex jccenter">
              <div class="lightbox">
                <div class="marginBottomS light center">Enter your creature's Food stat:</div>

                <div class="row acenter">
                  <img src="/media/item/Food.png" width="34" height="34" alt="ARK: Survival Evolved Food Icon" class="marginRightS">
                  <span class="kindabig">FOOD</span>

                  <div class="center marginLeft2 marginRightSS">
                    <input type="text" value="" class="currentFood whiteinput narc" style="width:4em;font-weight:bold;" />
                    <div class="light marginTopSS">Current</div>
                  </div>
                  <div class="center">
                    <input type="text" value="" class="maxFood whiteinput narc" style="width:4em;font-weight:bold;" />
                    <div class="light marginTopSS">Max</div>
                  </div>
                </div>
              </div>
            </div>

            <div class="row jcsb r">
              <div class="meterStatus actionColor right"></div>
              <div class="row starveMeter" style="padding-bottom:1.5em">
                <div class="row" data-tooltip title="This is the point at which your creature's food value reaches 0. Once it is nearing 0, feed it all required food. It will immediately eat as much as possible and then eat the remainder at a normal pace.">
                  <div>
                    <div class="starveSecsLeft timeRemaining">&nbsp;</div>
                  </div>
                  <div class="smaller paddedS asc">
                    <div class="light">UNTIL</div>
                    <div>STARVED</div>
                  </div>
                </div>
              </div>
            </div>

            <div class="miniBarWrap marginBottomS"><div class="miniBar" style="width:100%"></div></div>
            <div class="row jcsb" style="align-items:flex-start">
              <div class="row">
                <div class="rowItemN">
                  <div class="tameSecsLeft timeRemaining">&nbsp;</div>
                </div>
                <div class="rowItemN smaller paddedS asc">
                  <div class="light">UNTIL</div>
                  <div>TAMED</div>
                </div>
              </div>
              <div class="right light" data-tooltip title="Based on your selected food, this is the total food value that this creature must consume to be tamed.">Food required to eat: <span class="maxUnits"></span></div>
            </div>
            <div class="row marginTop2">
              <div class="rowItem">
                <div class="row">
                  <div class="rowItemN">
                    <input type="text" value="5" class="alarm whiteinput" style="width:2em;text-align:center;font-weight:bold;" />
                  </div>
                  <div class="rowItem light paddedS">
                    ALARM <br />(mins. before)
                  </div>
                </div>
              </div>
              <div class="rowItem right">
                <button class="timerStart actionButton bold uppercase">Start Timer</button>
              </div>
            </div>
          </div>
        </div>
        <div class="starveNote light small marginTop">Starve taming reduces the risk of losing resources by feeding a creature only once it is hungry enough to eat everything at once (or, eat as much as it can). Once you've selected the food you'll be taming with, enter the creature's current and max food values, then start the timer. <a href="https://help.dododex.com/en/article/how-to-starve-tame-in-ark-survival-evolved" class="">Learn more</a></div>

      </div>
      <div class="flex1 row">
        <div class="rowItem center lvlsec">
          <div class="light">Lvl <span class="bigNum white" id="baseLevel"></span></div>
          <div class="light">Current</div>
        </div>
        <div class="rowItemN padded lvlsec">
          <div class="arrow right"></div>
        </div>
        <div class="row flex2">
          <div class="rowItem">
            <div class="ringHolder">
              <div class="ringText light white bigNum">+<span id="gainedLevels"></span></div>
              <svg
                 class="progress-ring"
                 width="60"
                 height="60">
                <circle
                  class="progress-ring__circle"
                  stroke="#bbff77"
                  strokeWidth="4"
                  fill="#bbff7718"
                  r="28"
                  cx="30"
                  cy="30"/>
              </svg>
            </div>
            <div class="marginTopS center">
              <div class="bigNum action"> <span id="effectiveness"></span><sup class="sup">%</sup></div>
              <div class="light">Taming Eff.</div>
            </div>
          </div>
          <div class="rowItem center lvlsec">
            <div class="light">Lvl <span class="bigNum white" id="bonusLevel"></span></div>
            <div class="light">With Bonus</div>
          </div>
        </div>
        <div class="rowItemN padded lvlsec">
          <div class="arrow right"></div>
        </div>
        <div class="rowItem center lvlsec">
          <div class="light">Lvl <span class="bigNum white" id="maxLevel"></span></div>
          <div class="light">Max After Taming <a href="https://help.dododex.com/en/article/how-do-creature-levels-work-in-ark-survival-evolved" data-tooltip title="Creatures can gain 73 levels after taming, but ARK: Genesis-exclusive creatures and X-creatures can gain 88 levels. In single player, all creatures gain 88 levels after taming."><i class="fas fa-question-circle"></i></a></div>
        </div>
      </div>
    </div>
  `);
  if (method != "n") {
    $("#taming").append(`
      <div class="lightbox rCol attachedTop" style="justify-content:center;background-color:#375E79;gap:1.5em;">
        <div class="rowItem">

          <div id="torporTimer" class="widget collapsed tt lightbox pad0">
            <div class="row pad bold widgetH jcsb">
              <div class="row acenter">
                <img src="/media/item/Torpor.png" width="26" height="26" alt="ARK: Survival Evolved Torpor Icon" class="marginRightS">
                Torpor Timer&nbsp;<span class="ttTimeRemaining widgetHCO light"></span> </div>
                <div class="arrow down"></div>
            </div>
            <div class="pad widgetB">
              <div class="row marginBottomS gridGap2" style="justify-content:center;">
                <div class="rowItem">
                  <a id="useNarcotics" class="button">
                    <div class="center">
                      <span class="bigNum">+</span>
                      <img src="/media/item/Narcotics.png" width="30" height="30" alt="Narcotics" style="vertical-align:middle;" />
                    </div>
                    <div class="marginTopS small bold">Narcotics</div>
                    <div class="small light">40 Torpor</div>
                  </a>
                  <div class="narc marginTopS" id="narcoticsUsed">&nbsp;</div>
                </div>
                <div class="rowItem">
                  <a id="useNarcoberries" class="button">
                    <div class="center">
                      <span class="bigNum">+</span>
                      <img src="/media/item/Narcoberry.png" width="30" height="30" alt="Narcoberry" style="vertical-align:middle;" />
                    </div>
                    <div class="marginTopS small bold">Narcoberries</div>
                    <div class="small light">7.5 Torpor</div>
                  </a>
                  <div class="narc marginTopS" id="narcoberriesUsed">&nbsp;</div>
                </div>
                <div class="rowItem">
                  <a id="useAscerbic" class="button">
                    <div class="center">
                      <span class="bigNum">+</span>
                      <img src="/media/item/Ascerbic_Mushroom.png" width="30" height="30" alt="Bio Toxin" style="vertical-align:middle;" />
                    </div>
                    <div class="marginTopS small bold">Aserbic Mushrooms</div>
                    <div class="small light">25 Torpor</div>
                  </a>
                  <div class="narc marginTopS" id="ascerbicUsed">&nbsp;</div>
                </div>
                <div class="rowItem">
                  <a id="useBiotoxins" class="button">
                    <div class="center">
                      <span class="bigNum">+</span>
                      <img src="/media/item/Bio_Toxin.png" width="30" height="30" alt="Bio Toxin" style="vertical-align:middle;" />
                    </div>
                    <div class="marginTopS small bold">Bio Toxin</div>
                    <div class="small light">80 Torpor</div>
                  </a>
                  <div class="narc marginTopS" id="biotoxinsUsed">&nbsp;</div>
                </div>

              </div>

              <div style="text-align:right;"><input type="text" id="ttUnits" value="" class="whiteinput narc" style="width:4em;font-weight:bold;" /></div>
              <div class="miniBarWrap marginTopS marginBottomS"><div class="miniBar" style="width:100%"></div></div>
              <div class="row jcsb">
                <div class="row">
                  <div class="rowItemN">
                    <div id="ttTimeRemaining" class="ttTimeRemaining timeRemaining">&nbsp;</div>
                  </div>
                  <div class="rowItemN smaller paddedS asc">
                    <div class="light">UNTIL</div>
                    <div>CONSCIOUS</div>
                  </div>
                </div>
                <div class="right light"><span class="ttMaxUnits"></span></div>
              </div>
              <div class="row marginTop2">
                <div class="rowItem">
                  <div class="row">
                    <div class="rowItemN">
                      <input type="text" id="ttAlarm" value="5" class="whiteinput" style="width:2em;text-align:center;font-weight:bold;" />
                    </div>
                    <div class="rowItem light paddedS">
                      ALARM <br />(mins. before)
                    </div>
                  </div>
                </div>
                <div class="rowItem right">
                  <button id="ttStart" class="actionButton bold uppercase">Start Timer</button>
                </div>
              </div>
            </div>
          </div>
          <div class="light small marginTop">Track this creature's torpor and narcotic consumpion over time. <a href="https://help.dododex.com/en/article/how-to-use-a-torpor-timer-in-ark-survival-evolved" class="">Learn more</a></div>
          <div class="marginTop2">
            <div class="row acenter">
              <h3 style="margin:0 0.4em 0 0">Torpor Drain Rate:</h3>
              <div id="trClass" class="bigPill marginRightS">
                <img src="/media/item/Torpor.png" width="20" height="20" alt="ARK: Survival Evolved Torpor Icon" class="marginRightS"> <span></span>
              </div>
              <span class="bigNum light"><span id="torporDeplPS"></span>/s</span>
            </div>
            <div class="light small marginTopS" id="trClassNote"></div>
          </div>
        </div>
        <div class="rowItem">
          <div>
            <h3 class="marginTop0">Narcotics Needed</h3>
            <div class="row" id="narcsNeeded">
              <div class="rowItem center paddedS">
                <div class="marginBottomS"><img src="/media/item/Narcotics.png" width="30" height="30" alt="Narcotics" /></div>
                <div class="bigNum" id="narcsMin"></div>
                <div class="marginTopS small bold">Narcotics</div>
              </div>
              <div class="rowItem center paddedS">
                <div class="marginBottomS"><img src="/media/item/Narcoberry.png" width="30" height="30" alt="Narcoberry" /></div>
                <div class="bigNum" id="narcBMin"></div>
                <div class="marginTopS small bold">Narcoberries</div>
              </div>
              <div class="rowItem center paddedS">
                <div class="marginBottomS"><img src="/media/item/Ascerbic_Mushroom.png" width="30" height="30" alt="Bio Toxin" /></div>
                <div class="bigNum" id="ascerbicmushroomsMin"></div>
                <div class="marginTopS small bold">Aserbic Mushrooms</div>
              </div>
              <div class="rowItem center paddedS">
                <div class="marginBottomS"><img src="/media/item/Bio_Toxin.png" width="30" height="30" alt="Bio Toxin" /></div>
                <div class="bigNum" id="biotoxinsMin"></div>
                <div class="marginTopS small bold">Bio Toxin</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `);
  }
  $("#taming").append(`
  </div>
  `);
  circle = document.querySelector(".progress-ring__circle");
  radius = circle.r.baseVal.value;
  circumference = radius * 2 * Math.PI;
  circle.style.strokeDasharray = `${circumference} ${circumference}`;
  circle.style.strokeDashoffset = `${circumference}`;
  processTamingTable();
  torporTimerInit();
  starveTimerInit();
  processTameInput();
}
function processTamingTable() {
  var level = Settings.get("level");
  taming = calcData(CREATURES[creatureID], level, method);
  for (var i in taming.food) {
    taming.food[i].results = calcTame(CREATURES[creatureID], taming.food, i);
  }
  $("#tamingTable").empty();
  var numCollapsed = taming.food.length - MAX_FOOD_COLLAPSED;
  var i = 0;
  $(taming.food).each(function () {
    if (typeof this.l == "string") {
      var labelHTML =
        '<div class="bold light small uppercase marginTopSS">' +
        this.l +
        "</div>";
    } else {
      var labelHTML = "";
    }
    var effectiveness = Math.round(this.results.effectiveness * 10) / 10;
    var image = getImage(this.nameFormatted);
    $("#tamingTable").append(`
      <div class="ttRow" ${
        i >= MAX_FOOD_COLLAPSED && numCollapsed > 1
          ? 'style="display:none" data-ref="ttHidden"'
          : ""
      } data-ttrow="${this.key}">
      <div class="ttBH">
        <div class="ttB1 flex2">
          <div class="item">
            <div class="itemImage">
              <img src="${image}" width="42" height="42" alt="${this.nameFormatted}">
            </div>
            <div class="itemLabel white bold">${
              this.nameFormatted
            } ${labelHTML}</div>
          </div>
        </div>
        <div class="ttB2 flex1 jccenter bold kindabig">
          <input type="number" value="${
            this.use
          }" maxlength="6" size="5" min="0" max="${this.max}" class="whiteinput attachedRight use${this.use == 0 ? " empty" : ""}" placeholder="0">
          <div class="small light button useExclusive">${this.max}</div>
        </div>
        <div class="ttB3 flex1 jccenter bold">
          ${timeFormat(this.seconds)}
        </div>
        <div class="ttB4 flex2 row tteff">
          <div class="rowItem">
            <div><span class="bold">${effectiveness}%</span> <span class="light">+${this.results.gainedLevels} Lvl (${level + this.results.gainedLevels})</span></div>
            <div class="miniBarWrap" style="margin:.1em 0 .3em"><div class="miniBar" style="width:${effectiveness}%;background-color:#FFF"></div></div>
          </div>
        </div>
        <div class="ttB5 ttexp">
          <div class="arrow down" />
        </div>
      </div>
      <div class="ttRow2">
        <div class="row padVS light">
          <div class="tt21">
            <div class="row">
              <div>Per Item:</div>
              <div class="paddedS">
                ${
                  this.df ? "" : Math.round(this.food * 10) / 10 + " Food<br />"
                }
                ${Math.round(this.percentPer * 10) / 10}% Taming
              </div>
            </div>
          </div>
          ${
            typeof this.interval1 == "number"
              ? `<div class="tt22 jccenter center">
              ~${timeFormat(this.interval1)}<br/>First Interval
            </div>
            <div class="tt22 jccenter center">
              ${timeFormat(this.secondsPer)}<br/>Remaining Intervals
            </div>
            `
              : `<div class="tt22 jccenter center">
              ${timeFormat(this.secondsPer)}<br/>Intervals
            </div>
            <div class="tt23 noMob"></div>
            `
          }
        </div>
      </div>
    </div>`);
    i++;
  });
  if (numCollapsed > 0) {
    $("#tamingTable").append(
      `<div class="ttRow button rc0" id="ttLoad">Show ${numCollapsed} More</div>`
    );
    $("#ttLoad").click(function () {
      var theElems = $("[data-ref=ttHidden]");
      $(theElems).fadeIn(300);
      $(this).hide();
    });
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
