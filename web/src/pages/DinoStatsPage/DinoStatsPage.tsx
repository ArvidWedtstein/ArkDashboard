import {
  CheckboxField,
  FieldError,
  Form,
  ImageField,
  Label,
  Submit,
  TextField,
  useForm,
  useFormState,
} from "@redwoodjs/forms";
import { Link, routes } from "@redwoodjs/router";
import { MetaTags } from "@redwoodjs/web";
import { useEffect, useMemo, useReducer, useState } from "react";
import Counter from "src/components/Util/Counter/Counter";
import Table from "src/components/Util/Table/Table";
import { combineBySummingKeys, timeFormatL } from "src/lib/formatters";
import { useLazyQuery } from "@apollo/client";
import { toast } from "@redwoodjs/web/dist/toast";
import CheckboxGroup from "src/components/Util/CheckSelect/CheckboxGroup";
import clsx from "clsx";

interface stats {
  h: number;
  s: number;
  o: number;
  f: number;
  w: number;
  d: number;
  m: number;
  t: number;
}
const DINOQUERY = gql`
  query DinoStats($id: String!) {
    dino: dino(id: $id) {
      id
      name
      description
      taming_notice
      can_destroy
      base_stats
      multipliers
      exp_per_kill
      egg_min
      egg_max
      tdps
      eats
      maturation_time
      weight_reduction
      incubation_time
      affinity_needed
      aff_inc
      flee_threshold
      hitboxes
      food_consumption_base
      food_consumption_mult
      disable_ko
      violent_tame
      taming_bonus_attr
      disable_food
      disable_mult
      admin_note
      base_points
      non_violent_food_affinity_mult
      non_violent_food_rate_mult
      taming_interval
      base_taming_time
      disable_tame
      x_variant
      attack
      mounted_weaponry
      ridable
      movement
      type
      icon
      image
      DinoStat {
        Item {
          name
          id
          image
          stats
        }
        type
      }
    }
    # itemsByCategory(category: $category) {
    #   items {
    #     id
    #     name
    #     description
    #     image
    #     color
    #     type
    #     category
    #     stats
    #     image
    #   }
    #   count
    # }
  }
`;
const DinoStatsPage = () => {
  const {
    formState: { isDirty, isValid, isSubmitting, dirtyFields },
    getValues,
    setValue,
  } = useForm({ defaultValues: { name: "Dodo", level: 1 } });

  const [loadDinos, { called, loading, data }] = useLazyQuery(DINOQUERY, {
    variables: { id: "f65d01a8-c158-4c8d-9171-4e7d99a0bd1d", category: "Weapon" },
    onCompleted: (data) => {
      console.log(data);
      toast.success('Dinos loaded');
    },
    onError: (error) => {
      console.log(error);
      toast.error(error.message);
    }
  });

  useEffect(() => {
    if (!called) {
      loadDinos();
    }
  }, []);

  let [dino, setDino] = useState(null);
  let [selectedFood, setSelectedFood] = useState(null);
  const [secondsBetweenHits, setSecondsBetweenHits] = useState(5);
  let [points, setPoints] = useState(0);
  let [level, setLevel] = useState<stats>({
    h: 0,
    s: 0,
    o: 0,
    f: 0,
    w: 0,
    d: 0,
    m: 0,
    t: 0,
  });

  const onAdd = (data) => {
    let id = data.target.id.replace("add", "");
    setLevel({ ...level, [id]: level[id] + 1 });
    setPoints(points - 1);
    let dyno = dino.find((d) => d.stat === id);
    if (!dyno) return null;
    // dyno.dino = (level[id] + 1) * dyno.increaseperlevel + dyno.base;
    dyno.dino = (level[id] + 1) * dyno.increasePerLevelWild + dyno.base;
  };
  const onRemove = (data) => {
    let id = data.target.id.replace("rem", "");
    setLevel({ ...level, [id]: level[id] - 1 });
    setPoints(points + 1);
    let dyno = dino.find((d) => d.stat === id);
    dyno.dino = (level[id] - 1) * dyno.increasePerLevelWild + dyno.base;
  };


  function calculateTamingTime(dinoLevel: number, foodValue: number, foodConsumptionRate: number): number {
    const tamingMultiplier = 1.5; // This is a constant multiplier used in Ark to calculate taming time.
    const foodRequired = foodValue / (dinoLevel * tamingMultiplier); // Calculate the total amount of food required to tame the dinosaur.
    const tamingTime = foodRequired / (foodConsumptionRate * 10); // Calculate the total taming time in seconds, assuming a food consumption rate of 10 food points per second.
    return tamingTime;
  }

  const genRandomStats = () => {
    // scramble level
    let newlevel = {};
    let i = points;
    while (i > 0) {
      let stat = dino[Math.floor(Math.random() * dino.length)];
      newlevel[stat.stat] = (newlevel[stat.stat] || 0) + 1;
      i--;
    }
    let newlvl: any = combineBySummingKeys(level, newlevel);
    setLevel(newlvl);
    setPoints(i);
  };

  const settings = {
    tamingMultiplier: 1.0,
    consumptionMultiplier: 1.0,
    hatchMultiplier: 1,
    matureMultiplier: 1,
    meleeMultiplier: 100,
    playerDamageMultiplier: 1.0,
    matingIntervalMultiplier: 1.0,
    eggHatchSpeedMultiplier: 1.0,
    babyMatureSpeedMultiplier: 1.0,
    XPMultiplier: 1.0
  };

  const onSubmit = (dinoData) => {
    const { name, level, x_variant } = dinoData

    if (!data.dino) return null;
    // let theDino = data.dinos.find((dino) => dino.name.toLowerCase() === name.toLowerCase());
    let theDino = data.dino


    if (!theDino) return null;
    const basestats = Object.entries(theDino.base_stats).map(([key, value]: any) => {
      return {
        stat: key,
        base: value.b,
        increasePerLevelWild: value.w || null,
        increasePerLevelTamed: value.t || null,
        // ...value,
      };
    });

    // setValue("level", level);
    setPoints(level - 1);
    // setDino(basestats);
    setDino({
      ...theDino,
      isTamable: (!theDino.disable_tame || theDino.affinity_needed || theDino.eats),
      isKOable: (!theDino.disable_ko && theDino.base_taming_time && theDino.taming_interval),
      isBreedable: (theDino.maturation_time && (theDino.incubation_time || theDino.base_points)),
      maxLevelsAfterTame: x_variant && theDino.x_variant ? 88 : 73,
      level: level,
      base_stats: basestats,
      food: theDino.DinoStat.filter((stat) => stat.type === "food").map(({ Item }) => ({
        ...Item,
      })),
    });
  };

  const tamingFood = useMemo(() => {
    if (!dino) return [];
    const affinityNeeded =
      dino.affinity_needed + dino.aff_inc * dino.level;

    const foodConsumption =
      dino.food_consumption_base *
      dino.food_consumption_mult *
      settings.consumptionMultiplier *
      1;
    if (!selectedFood) setSelectedFood(dino.DinoStat.filter((f) => f.type === 'food')[0].Item.id)
    return dino.DinoStat.filter((f) => f.type === 'food').map((foodItem: any, index: number) => {
      const foodValue = foodItem.Item.stats
        ? foodItem.Item.stats.find((stat) => stat.id === 8)?.value
        : 0;
      const affinityValue =
        foodItem.Item.stats.find((stat) => stat.id === 15)?.value || 0;

      const foodMaxRaw = affinityNeeded / affinityValue / 4;
      const foodMax = Math.ceil(foodMaxRaw);
      const isFoodSelected = foodItem.Item.id === selectedFood;
      let interval = null;
      let interval1 = null;
      let foodSecondsPer = 0;
      let foodSeconds = 0;
      if (dino.violent_tame) { // if violent tame
        const baseStat = dino.base_stats?.f;
        if (
          typeof baseStat?.b === "number" &&
          typeof baseStat?.w === "number"
        ) {
          const averagePerStat = Math.round(dino.level / 7);
          const estimatedFood = baseStat.b + baseStat.w * averagePerStat;
          const requiredFood = Math.max(estimatedFood * 0.1, foodValue);
          interval1 = requiredFood / foodConsumption;
        }
        interval = foodValue / foodConsumption;
        if (foodMax > 1) {
          foodSecondsPer = foodValue / foodConsumption;
          foodSeconds = Math.ceil(
            Math.max(foodMax - (typeof interval1 === "number" ? 2 : 1), 0) *
            foodSecondsPer +
            (interval1 || 0)
          );
        }
      } else {
        foodSecondsPer = foodValue / foodConsumption;
        foodSeconds = Math.ceil(foodMax * foodSecondsPer);
      }
      return {
        ...foodItem.Item,
        max: foodMax,
        food: foodValue,
        seconds: foodSeconds,
        secondsPer: foodSecondsPer,
        percentPer: 100 / foodMaxRaw,
        interval,
        interval1,
        use: isFoodSelected ? foodMax : 0,
        key: index,
      };
    })
  }, [selectedFood, dino]);

  const weapons = [
    {
      "name": "Tranquilizer Dart",
      "image": "tranquilizer-dart.png",
      "torpor": 221,
      "damage": 26,
      "durationDevKit": 5,
      "duration": 6,
      "hasMultipler": true,
      "mult": [
        "DmgType_Projectile",
        "DamageType"
      ],
      "id": 745,
      "type": "Longneck Rifle",
      "userDamage": 100
    },
    {
      "name": "Shocking Tranquilizer Dart",
      "image": "shocking-tranquilizer-dart.png",
      "torpor": 442,
      "damage": 26,
      "durationDevKit": 5,
      "duration": 6,
      "hasMultipler": true,
      "mult": [
        "DmgType_Projectile",
        "DamageType"
      ],
      "id": 748,
      "type": "Shocking Tranquilizer Dart",
      "userDamage": 100,
    },
    {
      "name": "Bow",
      "image": "tranquilizer-arrow-bow.png",
      "torpor": 90,
      "damage": 20,
      "duration": 6,
      "hasMultipler": true,
      "mult": [
        "DmgType_Projectile",
        "DamageType"
      ],
      "id": 1038,
      "type": "Bow",
      "userDamage": 100,
    },
    {
      "name": "Crossbow",
      "image": "crossbow.png",
      "torpor": 157.5,
      "damage": 35,
      "duration": 6,
      "hasMultipler": true,
      "mult": [
        "DmgType_Projectile",
        "DamageType"
      ],
      "id": 362,
      "type": "Crossbow",
      "userDamage": 100,
    },
    {
      "name": "Tek Bow",
      "image": "tek-bow.png",
      "torpor": 336,
      "damage": 24,
      "duration": 6,
      "hasMultipler": true,
      "mult": [
        "DmgType_Projectile",
        "DamageType"
      ],
      "id": 784,
      "type": "Tek Bow",
      "userDamage": 100,
    },
    {
      "name": "Compound Bow",
      "image": "compound-bow.png",
      "torpor": 121.5,
      "damage": 27,
      "duration": 6,
      "hasMultipler": true,
      "mult": [
        "DmgType_Projectile",
        "DamageType"
      ],
      "id": 376,
      "type": "Compound Bow",
      "userDamage": 100,

    },
    {
      "name": "Harpoon Launcher",
      "image": "harpoon-launcher.png",
      "torpor": 300,
      "damage": 36,
      "duration": 5,
      "hasMultipler": true,
      "mult": [
        "DmgType_Projectile",
        "DamageType"
      ],
      "id": 731,
      "type": "Harpoon Launcher",
      "userDamage": 100,
    },
    {
      "name": "Fists",
      "image": "fists.png",
      "torpor": 14,
      "damage": 8,
      "hasMultipler": false,
      "usesMeleeDamage": true,
      "mult": [
        "DmgType_Melee_Torpidity_StoneWeapon",
        "DmgType_Melee_Torpidity",
        "DmgType_Melee_Human",
        "DmgType_Melee",
        "DamageType"
      ],
      "id": "Fists",
      "type": "Fists",
      "userDamage": 100,
    },
    {
      "name": "Slingshot",
      "image": "slingshot.png",
      "torpor": 23.8,
      "damage": 14,
      "hasMultipler": true,
      "mult": [
        "DmgType_StoneWeapon",
        "DamageType"
      ],
      "id": 139,
      "type": "Slingshot",
      "userDamage": 100,
    },
    {
      "name": "Wooden Club",
      "image": "wooden-club.png",
      "torpor": 20,
      "damage": 5,
      "hasMultipler": true,
      "usesMeleeDamage": true,
      "mult": [
        "DmgType_Melee_HighTorpidity_StoneWeapon",
        "DmgType_Melee_Human",
        "DmgType_StoneWeapon",
        "DamageType"
      ],
      "id": 434,
      "type": "Wooden Club",
      "userDamage": 100,
    },

    {
      "name": "Boomerang",
      "image": "boomerang.png",
      "damage": 30,
      "torpor": 70.5,
      "mult": [
        "DmgType_Melee_Torpidity_StoneWeapon",
        "DmgType_StoneWeapon",
        "DamageType"
      ],
      "id": 848,
      "type": "Boomerang",
      "userDamage": 100,
    },
    {
      "name": "Electric Prod",
      "image": "electric-prod.png",
      "torpor": 266,
      "damage": 1,
      "hasMultipler": true,
      "mult": [
        "DmgType_Melee_Human",
        "DamageType"
      ],
      "id": 451,
      "type": "Electric Prod",
      "userDamage": 100,
    },
    {
      "name": "Tripwire Narcotic Trap",
      "image": "tripwire-narcotic-trap.png",
      "torpor": 240,
      "damage": 0,
      "duration": 10,
      "mult": [
        "DamageType"
      ],
      "id": 1041,
      "type": "Tripwire Narcotic Trap",
      "userDamage": 100,
    },
  ]
  function nper(n, x) {
    let n1 = n + 1;
    let r = 1.0;
    let xx = Math.min(x, n - x);
    for (let i = 1; i < xx + 1; i++) {
      r = (r * (n1 - i)) / i;
    }
    return r;
  }

  /**

    Calculates the cumulative probability of getting a result between the given lower and upper limits,
    based on a binomial distribution with a given number of trials and probability of success.
    @param {number} ll - Lower limit of the result
    @param {number} ul - Upper limit of the result
    @param {number} p - Probability of success
    @returns {number} - The cumulative probability
    */
  function calculateProbabilityMore(ll, ul, p) {
    let maxProb = 0;
    let pCumulative = 0;

    for (let i = ll; i <= ul; i++) {
      const probability = nper(ul, i) * Math.pow(p, i) * Math.pow(1.0 - p, ul - i);
      maxProb = Math.max(maxProb, probability);
      pCumulative += probability;
    }

    const topProb = Math.ceil(100 * maxProb) / 100;
    pCumulative = Math.round(100 * pCumulative) / 100;

    return pCumulative;
  }

  /**

    Calculates the cumulative probability of getting a result greater than or equal to the given lower limit,
    based on a binomial distribution with a given number of trials and probability of success.
    @param {number} n - Number of trials
    @param {number} numOptions - Number of possible outcomes
    @param {number} ll - Lower limit of the result
    @returns {number|undefined} - The cumulative probability if all the parameters are valid, undefined otherwise
    */
  function calculatePropability(n, numOptions, ll) {
    const p = 1 / numOptions;

    if (isNaN(n) || isNaN(p) || n <= 0 || p <= 0 || p >= 1 || isNaN(ll) || ll < 0) {
      return undefined;
    }

    return calculateProbabilityMore(ll, n, p);
  }

  const calcWeapons = useMemo(() => {
    if (!data) return []
    const {
      base_taming_time: baseTamingTime,
      base_stats: bs,
      taming_interval: tamingInterval,
      level,
      flee_threshold: fleeThreshold,
      tdps,
      multipliers: dinoMult,
      hitboxes: dinoHitboxes
    } = dino;

    const {
      tamingMultiplier,
      consumptionMultiplier,
      meleeMultiplier,
      playerDamageMultiplier,
    } = settings;

    return weapons.map((weapon) => {
      const {
        torpor,
        duration,
        userDamage,
        mult: weaponMult,
        usesMeleeDamage,
      } = weapon;

      let creatureT = baseTamingTime + tamingInterval * (level - 1);

      let torporPerHit = torpor;
      let isPossible = true;
      let secsOfRegen = 0;
      let totalMultipliers = 1;
      let numHitsRaw = 0
      let hitsUntilFlee: any = 0
      let hitboxes = [];
      let bodyChanceOfDeath = 0;
      let minChanceOfDeath = 0;
      let propsurvival = 0;

      if (tdps) {
        const torporDeplPS =
          tdps + Math.pow(level - 1, 0.8493) / (22.39671632 / tdps);
        if (secondsBetweenHits > duration) {
          secsOfRegen = secondsBetweenHits - duration;
          torporPerHit = torporPerHit - secsOfRegen * torporDeplPS;
        }
        isPossible = torporPerHit > 0;
      }
      let knockOut = creatureT / torporPerHit;

      // if (
      //   typeof weapon.mult == "object" &&
      //   weapon.mult != null &&
      //   typeof dino.mult == "object"
      // ) {
      //   for (var i in weapon.mult) {
      //     if (typeof dino.mult[weapon.mult[i]] == "number") {
      //       knockOut /= dino.mult[weapon.mult[i]];
      //       totalMultipliers *= dino.mult[weapon.mult[i]];
      //     }
      //   }
      // }

      if (weaponMult && dinoMult) {
        weaponMult.forEach((key) => {
          if (typeof dinoMult[key] === "number") {
            totalMultipliers *= dinoMult[key];
            torporPerHit /= dinoMult[key];
          }
        });
      }
      if (usesMeleeDamage) {
        knockOut /= (meleeMultiplier / 100);
        totalMultipliers *= meleeMultiplier / 100;
      }
      if (dino.x_variant) { // add x variant checkbox to this
        knockOut /= 0.4;
        totalMultipliers *= 0.4;
      }
      numHitsRaw = knockOut / (userDamage / 100);
      knockOut /= playerDamageMultiplier;
      totalMultipliers *= playerDamageMultiplier;
      if (typeof dinoHitboxes !== "undefined") {

        Object.entries(dinoHitboxes).forEach(([key, value]: [string, number]) => {
          let hitboxHits = numHitsRaw / value;
          hitsUntilFlee = fleeThreshold == 1 ? "-" : Math.max(1, Math.ceil(hitboxHits * fleeThreshold));

          hitboxes.push({
            name: key,
            multiplier: value,
            hitsRaw: hitboxHits,
            hitsUntilFlee: hitsUntilFlee,
            hits: Math.ceil(hitboxHits),
            chanceOfDeath: 0,
            isPossible: isPossible,
          });
        });

      }

      if (isPossible) {
        if (
          typeof bs == "object" &&
          typeof bs.h == "object" &&
          typeof bs.h.b == "number" &&
          typeof bs.h.w == "number"
        ) {
          const baseHealth = bs.h.b;
          const incPerLevel = bs.h.w;
          if (
            typeof userDamage != null &&
            typeof baseHealth != null &&
            typeof incPerLevel != null
          ) {
            const numStats = 7;
            let totalDamage =
              userDamage *
              Math.ceil(numHitsRaw) *
              totalMultipliers *
              (userDamage / 100);

            propsurvival = totalDamage < baseHealth ? 100 : level - 1 < Math.max(
              Math.ceil((totalDamage - baseHealth) / incPerLevel),
              0
            ) ? 0 : calculatePropability(level - 1, numStats, Math.max(
              Math.ceil((totalDamage - baseHealth) / incPerLevel),
              0
            ));


            bodyChanceOfDeath = (100 - propsurvival);
            minChanceOfDeath = bodyChanceOfDeath;
            if (hitboxes.length > 0) {
              for (let i in hitboxes) {
                totalDamage =
                  userDamage *
                  Math.ceil(hitboxes[i].hitsRaw) *
                  totalMultipliers *
                  (userDamage / 100) *
                  hitboxes[i].multiplier;

                propsurvival = totalDamage < baseHealth ? 100 : calculatePropability(
                  dino.level - 1,
                  numStats,
                  Math.max(
                    Math.ceil((totalDamage - baseHealth) / incPerLevel),
                    0
                  )
                );

                let chanceOfDeath = (100 - propsurvival);
                hitboxes[i].chanceOfDeath = chanceOfDeath;
                hitboxes[i].chanceOfDeathHigh = chanceOfDeath > 40;
                minChanceOfDeath = Math.min(minChanceOfDeath, chanceOfDeath);
              }
            }
          }
        }
      }
      let chanceOfDeathHigh = bodyChanceOfDeath > 40;
      hitsUntilFlee = fleeThreshold == 1 ? '-' : Math.max(1, Math.ceil(numHitsRaw * fleeThreshold))

      return {
        ...weapon,
        hits: Math.ceil(numHitsRaw),
        hitsRaw: numHitsRaw,
        hitsUntilFlee: hitsUntilFlee,
        chanceOfDeath: bodyChanceOfDeath,
        chanceOfDeathHigh: chanceOfDeathHigh,
        minChanceOfDeath: minChanceOfDeath || 0,
        isPossible: isPossible,
        isRecommended: isPossible && minChanceOfDeath < 90,
        hitboxes: hitboxes,
      };
    });

  }, [dino, secondsBetweenHits, setSecondsBetweenHits])

  const tameData = useMemo(() => {
    if (!dino) return null;
    let effectiveness = 100;
    const narcotics = {
      ascerbic: {
        torpor: 25,
        secs: 2,
      },
      bio: {
        torpor: 80,
        secs: 16,
      },
      narcotics: {
        torpor: 40,
        secs: 8,
      },
      narcoberries: {
        torpor: 7.5,
        secs: 3,
      },
    };

    let affinityNeeded =
      dino.affinity_needed + dino.aff_inc * dino.level;
    // sanguineElixir = affinityNeeded *= 0.7

    let affinityLeft = affinityNeeded;

    let totalFood = 0;

    let tamingMultiplier = dino.disable_mult
      ? 4
      : settings.tamingMultiplier * 4;

    let tooMuchFood = false;
    let enoughFood = false;
    let numUsedTotal = 0;
    let numNeeded = 0;
    let numToUse = 0;
    let totalSecs = 0;

    tamingFood.forEach((food: any) => {
      if (!food) return;
      let foodVal = food.stats.find((f: any) => f.id === 8)
        ? food.stats.find((f: any) => f.id === 8).value
        : 0;
      let affinityVal = food.stats.find((f: any) => f.id === 15)
        ? food.stats.find((f: any) => f.id === 15).value
        : 0;

      if (affinityLeft > 0) {
        if (selectedFood) {
          if (food.id == selectedFood) {
            food.use = food.max;
          } else {
            food.use = 0;
          }
        }
        if (!dino.violent_tame) {
          numNeeded = Math.ceil(
            affinityLeft /
            affinityVal /
            tamingMultiplier /
            dino.non_violent_food_rate_mult
          );
        } else {
          numNeeded = Math.ceil(affinityLeft / affinityVal / tamingMultiplier);
        }

        if (numNeeded >= food.use) {
          numToUse = food.use;
        } else {
          tooMuchFood = true;
          numToUse = numNeeded;
        }

        if (!dino.violent_tame) {
          affinityLeft -=
            numToUse *
            affinityVal *
            tamingMultiplier *
            dino.non_violent_food_rate_mult;
        } else {
          affinityLeft -= numToUse * affinityVal * tamingMultiplier;
        }
        totalFood += numToUse * foodVal;
        let i = 1;
        while (i <= numToUse) {
          if (!dino.violent_tame) {
            effectiveness -=
              (Math.pow(effectiveness, 2) * dino.taming_bonus_attr) /
              affinityVal /
              tamingMultiplier /
              dino.non_violent_food_rate_mult;
          } else {
            effectiveness -=
              (Math.pow(effectiveness, 2) * dino.taming_bonus_attr) /
              affinityVal /
              100;
          }
          numUsedTotal++;
          i++;
        }
        if (effectiveness < 0) {
          effectiveness = 0;
        }
      } else if (food.use > 0) {
        tooMuchFood = true;
      }
    });

    let neededValues = Array();

    if (affinityLeft <= 0) {
      enoughFood = true;
    } else {
      enoughFood = false;

      dino.food.forEach((food: any) => {
        numNeeded = Math.ceil(
          affinityLeft /
          food.stats.find((f: any) => f.id === 15).value /
          tamingMultiplier
        );
        neededValues[food.id] = numNeeded;
      });
    }

    let percentLeft = affinityLeft / affinityNeeded;
    let percentTamed = 1 - percentLeft;
    let totalTorpor = dino.base_taming_time + dino.taming_interval * (dino.level - 1);
    let torporDepletionPS =
      dino.tdps +
      Math.pow(dino.level - 1, 0.800403041) / (22.39671632 / dino.tdps);
    let levelsGained = Math.floor((dino.level * 0.5 * effectiveness) / 100);

    const calcNarcotics = Object.entries(narcotics).map(([name, stats]: any) => {
      return {
        [`${name}Min`]: Math.max(
          Math.ceil(
            (totalSecs * torporDepletionPS - totalTorpor) /
            (stats.torpor + torporDepletionPS * stats.secs)
          ),
          0
        )
      }
    });

    return {
      effectiveness,
      neededValues,
      enoughFood,
      tooMuchFood,
      totalFood,
      totalSecs,
      levelsGained,
      totalTorpor,
      torporDepletionPS,
      percentTamed,
      numUsedTotal,
      ...calcNarcotics.reduce((acc, cur) => ({ ...acc, ...cur }), {})
    };
  }, [selectedFood]);


  // const calcMaturation = () => {
  //   let maturation = 0;
  //   let maturationCalcCurrent = 0;
  //   let weightCurrent = 0;
  //   let weightTotal = 30;
  //   let mutationTimeTotal = 15002;
  //   if (weightCurrent > weightTotal) {
  //     weightCurrent = weightTotal;
  //   }

  //   weightCurrent = Math.max(weightCurrent, 0);
  //   let percentDone = weightCurrent / weightTotal;
  //   let timeElapsed = percentDone * mutationTimeTotal;
  //   let timeStarted = Date.now() - timeElapsed;
  //   let timeRemaining = (1 - percentDone) * mutationTimeTotal;

  //   console.log(timeRemaining);
  // };

  return (
    <>
      <MetaTags title="DinoStats" description="DinoStats page" />

      <div className="p-4">
        <header className="rw-segment-header">
          <h2 className="rw-heading rw-heading-secondary">Dino Calculator</h2>
        </header>
        <div className="p-4">
          <Form onSubmit={onSubmit}>
            {/* TODO: Insert dino lookup here */}
            <Label
              name="name"
              className="rw-label"
              errorClassName="rw-label rw-label-error"
            >
              Name
            </Label>

            <TextField
              name="name"
              className="rw-input"
              errorClassName="rw-input rw-input-error"
              autoCapitalize="words"
              enterKeyHint="next"
              validation={{ required: true }}
              defaultValue={"Dodo"}
            />

            <FieldError name="name" className="rw-field-error" />

            <Label
              name="level"
              className="rw-label"
              errorClassName="rw-label rw-label-error"
            >
              Level
            </Label>

            <TextField
              name="level"
              className="rw-input"
              errorClassName="rw-input rw-input-error"
              validation={{ required: true }}
              defaultValue={1}
            />

            <FieldError name="level" className="rw-field-error" />

            <Label
              name="x_variant"
              className="rw-label"
              errorClassName="rw-label rw-label-error"
            >
              X Variant
            </Label>

            <CheckboxField
              name="x_variant"
              className="rw-input"
              errorClassName="rw-input rw-input-error"
              validation={{ required: false }}
            />

            <FieldError name="x_variant" className="rw-field-error" />

            <div className="rw-button-group">
              <Submit className="rw-button rw-button-green">Calc</Submit>
              <button
                type="button"
                className="rw-button rw-button-red"
                onClick={genRandomStats}
              >
                Random
              </button>
            </div>
          </Form>


          {(dino && tamingFood && tameData) && (
            <>
              <CheckboxGroup
                name="foodSelect"
                form={false}
                defaultValue={[selectedFood]}
                validation={{
                  single: true,
                }}
                options={tamingFood.map((food) => {
                  return {
                    value: food.id,
                    label: `${food.name} (${food.max})`,
                    image: `https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/${food.image}`
                  }
                })}
                onChange={(e) => {
                  setSelectedFood(e);
                }}
              />
              {/* <Table
                rows={tamingFood}
                columns={[
                  {
                    field: "name",
                    label: "Food",
                    bold: true,
                    sortable: true,
                    renderCell: ({ row }) => {
                      return (
                        <button className="flex flex-row content-center items-center align-middle" onClick={() => setSelectedFood(row.id)}>
                          <img
                            className="w-6 h-6 mr-2"
                            src={`https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/${row.image}`}
                            alt={row.name}
                          />
                          <span>{row.name}</span>
                        </button>
                      );
                    },
                  },
                  {
                    field: "use",
                    label: "Use",
                    bold: true,
                    renderCell: ({ row }) => {
                      return (
                        <div
                          className="flex flex-row items-center rw-button-group justify-start"
                          key={`${row.use}+${Math.random()}`}
                        >
                          <button
                            type="button"
                            disabled={row.use <= 0}
                            className="rw-button"
                          >
                            -
                          </button>
                          <p
                            defaultValue={row.use}
                            className="rw-input w-20 p-3 text-center"
                          >
                            {row.use}/{row.max}
                          </p>
                          <button
                            type="button"
                            disabled={row.use >= row.max}
                            className="rw-button"
                          >
                            +
                          </button>
                        </div>
                      );
                    },
                  },
                  {
                    field: "seconds",
                    label: "Time",
                    numeric: true,
                    className: "text-center",
                    valueFormatter: ({ value }) => {
                      let minutes = Math.floor(value / 60);
                      let remainingSeconds =
                        value % 60 < 10 ? `0${value % 60}` : value % 60;
                      return `${minutes}:${remainingSeconds}`;
                    },
                  },
                  {
                    field: "results",
                    label: "Effectiveness",
                    renderCell: ({ value }) => {
                      return (
                        <div className="block">
                          <div className="my-2 h-1 overflow-hidden rounded-md bg-white">
                            <span
                              className="bg-pea-500 block h-1 w-full rounded-md"
                              style={{
                                width: `${value ? value.effectiveness : 0}%`,
                              }}
                            ></span>
                          </div>
                          <p className="text-xs">
                            {(value ? value.effectiveness : 0).toFixed(2)}%
                          </p>
                        </div>
                      );
                    },
                  },
                ]}
              /> */}
              <p className="my-3 text-center text-sm dark:text-gray-200">
                With selected food:
              </p>
              <section className="my-3 rounded-md p-4 dark:bg-zinc-600 bg-stone-200 dark:text-white">
                <div className="relative my-3 grid grid-cols-4 gap-4 text-center">
                  <div className="not-last:before:content-['>'] relative block before:absolute before:ml-auto before:w-full">
                    <p className="text-thin text-sm">
                      Lvl<span className="ml-1 text-lg font-semibold">{dino.level}</span>
                    </p>
                  </div>
                  <div className="not-last:before:content-['>'] relative block before:absolute before:ml-auto before:w-full">
                    <p className="text-thin text-sm">
                      {(tameData.effectiveness ? tameData.effectiveness : 0).toFixed(2)}
                      %
                    </p>
                  </div>
                  <div className="not-last:before:content-['>'] relative block before:absolute before:ml-auto before:w-full">

                    <span className="text-thin text-sm">
                      Lvl
                      <span className="ml-1 text-lg font-semibold">
                        <Counter startNum={0} endNum={parseInt(dino.level) + tameData.levelsGained} duration={500} />
                        {/* {parseInt(dino.level) + tameData.levelsGained} */}
                      </span>
                    </span>
                  </div>
                  <div className="relative block before:absolute before:ml-auto before:w-full last:before:content-['']">
                    <p className="text-thin text-sm">
                      Lvl
                      <span className="ml-1 text-lg font-semibold">
                        {parseInt(dino.level) +
                          tameData.levelsGained +
                          dino.maxLevelsAfterTame}
                      </span>
                    </p>
                  </div>
                </div>
                <div className="my-3 grid grid-cols-4 gap-4 text-center">
                  <p className="text-thin text-xs">Current</p>
                  <p className="text-thin text-xs">Taming Eff.</p>
                  <p className="text-thin text-xs">With Bonus</p>
                  <p className="text-thin text-xs">Max after taming</p>
                </div>
              </section>

              <p className="my-3 text-center text-sm dark:text-gray-200">
                {dino.name} breeding:
              </p>
              {/* Mating internal: 24h - 48h * matingIntervalMultiplier */}
              {/* <p>Xp When Killed: {tame.dino.experiencePerKill * (1 + 0.1 * (tame.dino.level - 1))}xp</p> */}
              {typeof dino.maturation_time !== "undefined" &&
                (typeof dino.incubation_time !== "undefined" ||
                  typeof dino.base_points !== "undefined") && (
                  <section className="my-3 rounded-md p-4 text-stone-600 dark:text-white">
                    <ol className="w-full items-center justify-center space-y-4 sm:flex sm:space-x-8 sm:space-y-0">
                      <li className="dark:text-pea-500 text-pea-600 flex items-center space-x-2.5">
                        <span className="border-pea-600 dark:border-pea-500 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border">
                          1
                        </span>
                        <span>
                          <h3 className="font-medium leading-tight">
                            Incubation
                          </h3>
                          <p className="text-sm">
                            {timeFormatL(dino.incubation_time / settings.hatchMultiplier)}
                          </p>
                        </span>
                      </li>
                      <li>
                        <input
                          id="1"
                          type="checkbox"
                          className="peer/item1 hidden"
                        />
                        <label
                          htmlFor="1"
                          className="peer-checked/item1:dark:fill-pea-500 peer-checked/item1:fill-pea-600 fill-gray-500 dark:fill-gray-400 "
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 "
                            viewBox="0 0 256 512"
                          >
                            <path d="M219.9 266.7L75.89 426.7c-5.906 6.562-16.03 7.094-22.59 1.188c-6.918-6.271-6.783-16.39-1.188-22.62L186.5 256L52.11 106.7C46.23 100.1 46.75 90.04 53.29 84.1C59.86 78.2 69.98 78.73 75.89 85.29l144 159.1C225.4 251.4 225.4 260.6 219.9 266.7z" />
                          </svg>
                        </label>
                      </li>
                      <li className="flex items-center space-x-2.5 text-gray-500 dark:text-gray-400">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-gray-500 dark:border-gray-400">
                          2
                        </span>
                        <span>
                          <h3 className="font-medium leading-tight">Baby</h3>
                          <p className="text-sm">
                            {timeFormatL((dino.maturation_time * 1) / 10)}
                          </p>
                        </span>
                      </li>
                      <li>
                        <input
                          id="2"
                          type="checkbox"
                          className="peer/item2 hidden"
                        />
                        <label
                          htmlFor="2"
                          className="peer-checked/item2:dark:fill-pea-500 peer-checked/item2:fill-pea-600 fill-gray-500 dark:fill-gray-400 "
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 "
                            viewBox="0 0 256 512"
                          >
                            <path d="M219.9 266.7L75.89 426.7c-5.906 6.562-16.03 7.094-22.59 1.188c-6.918-6.271-6.783-16.39-1.188-22.62L186.5 256L52.11 106.7C46.23 100.1 46.75 90.04 53.29 84.1C59.86 78.2 69.98 78.73 75.89 85.29l144 159.1C225.4 251.4 225.4 260.6 219.9 266.7z" />
                          </svg>
                        </label>
                      </li>
                      <li className="flex items-center space-x-2.5 text-gray-500 dark:text-gray-400">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-gray-500 dark:border-gray-400">
                          3
                        </span>
                        <span>
                          <h3 className="font-medium leading-tight">
                            Juvenile
                          </h3>
                          <p className="text-sm">
                            {timeFormatL(
                              (dino.maturation_time * 1) / 2 -
                              (dino.maturation_time * 1) / 10
                            )}
                          </p>
                        </span>
                      </li>
                      <li>
                        <input
                          id="3"
                          type="checkbox"
                          className="peer/item3 hidden"
                        />
                        <label
                          htmlFor="3"
                          className="peer-checked/item3:dark:fill-pea-500 peer-checked/item3:fill-pea-600 fill-gray-500 dark:fill-gray-400 "
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 "
                            viewBox="0 0 256 512"
                          >
                            <path d="M219.9 266.7L75.89 426.7c-5.906 6.562-16.03 7.094-22.59 1.188c-6.918-6.271-6.783-16.39-1.188-22.62L186.5 256L52.11 106.7C46.23 100.1 46.75 90.04 53.29 84.1C59.86 78.2 69.98 78.73 75.89 85.29l144 159.1C225.4 251.4 225.4 260.6 219.9 266.7z" />
                          </svg>
                        </label>
                      </li>
                      <li className="flex items-center space-x-2.5 text-gray-500 dark:text-gray-400">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-gray-500 dark:border-gray-400">
                          4
                        </span>
                        <span>
                          <h3 className="font-medium leading-tight">
                            Adolescent
                          </h3>
                          <p className="text-sm">
                            {timeFormatL((dino.maturation_time * settings.matureMultiplier) / 2)}
                          </p>
                        </span>
                      </li>
                      <li>
                        <input
                          id="4"
                          type="checkbox"
                          className="peer/item4 hidden"
                        />
                        <label
                          htmlFor="4"
                          className="peer-checked/item4:dark:fill-pea-500 peer-checked/item4:fill-pea-600 fill-gray-500 dark:fill-gray-400 "
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 "
                            viewBox="0 0 256 512"
                          >
                            <path d="M219.9 266.7L75.89 426.7c-5.906 6.562-16.03 7.094-22.59 1.188c-6.918-6.271-6.783-16.39-1.188-22.62L186.5 256L52.11 106.7C46.23 100.1 46.75 90.04 53.29 84.1C59.86 78.2 69.98 78.73 75.89 85.29l144 159.1C225.4 251.4 225.4 260.6 219.9 266.7z" />
                          </svg>
                        </label>
                      </li>
                      <li className="flex items-center space-x-2.5 text-gray-500 dark:text-gray-400">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-gray-500 dark:border-gray-400">
                          5
                        </span>
                        <span>
                          <h3 className="font-medium leading-tight">Total</h3>
                          <p className="text-sm">
                            {timeFormatL(dino.maturation_time * settings.matureMultiplier)}
                          </p>
                        </span>
                      </li>
                    </ol>
                  </section>
                )}
              {/* <p className="text-white">{JSON.stringify(calcWeapons)}</p> */}


              <div className="flex flex-row gap-2 overflow-x-auto max-w-screen relative py-3 rounded-md dark:text-white text-gray-800 text-center my-3">
                {calcWeapons.map((weapon, i) => (
                  <div key={`weapon-${i}`} className="flex flex-col space-y-1 flex-1 min-h-full rounded p-3 dark:bg-opacity-50 dark:bg-zinc-600 bg-white min-w-[8rem] justify-between items-center animate-fade-in">
                    <img className="w-16 h-16" src={`https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/${weapon.image}`} />
                    <p className="w-full">{weapon.name}</p>
                    {weapon.isPossible ? <Counter startNum={0} endNum={weapon.hits} duration={500 / weapon.hits} /> : <p>Not Possible</p>}
                    {weapon.chanceOfDeathHigh && <p className="text-xs text-red-300">{weapon.chanceOfDeath}% chance of death</p>}
                    <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">
                      {weapon.hitboxes.map((h) => (
                        `${h.name} - ${h.multiplier}x`
                      ))}
                    </span>
                    <p></p>
                  </div>
                ))}
              </div>

              <Table
                rows={calcWeapons}
                columns={[
                  {
                    field: "hits",
                    label: "Hit be baby one more time",
                    bold: true,
                    sortable: true,
                  },
                  {
                    field: "hitsUntilFlee",
                    label: "Hits Until Dino has had enough of your bullshit",
                    bold: true,
                  },
                  {
                    field: "chanceOfDeath",
                    label: "Chance of dying",
                    numeric: false,
                    className: "text-center",
                    valueFormatter: ({ value, row }) => {
                      return <span className={clsx({
                        "text-red-500": row.chanceOfDeathHigh
                      })}>{value}%</span>
                    }
                  },
                  {
                    field: "name",
                    label: "Item",
                    className: "text-center",
                  },
                  {
                    field: "isPossible",
                    label: "Is Possible?",
                    valueFormatter: ({ value }) => {
                      return value ? "Yes" : "No";
                    }
                  },
                ]}
              />
              <input type="number" inputMode="numeric" name="sec_between_hits" className="rw-input" placeholder="Seconds between hits" defaultValue={secondsBetweenHits || 5} onChange={(e) => {
                setSecondsBetweenHits(parseInt(e.target.value));
              }} />
            </>
          )}

          {/* TODO: Add pretame simulator. Assign available points to random stats */}
          {dino && (<Table
            rows={dino.base_stats}
            columns={[
              {
                field: "stat",
                label: "Stat",
                bold: true,
                sortable: true,
              },
              {
                field: "base",
                label: "Base",
                numeric: true,
                sortable: true,
              },
              {
                field: "increasePerLevelWild",
                label: "Increase per level",
                numeric: true,
              },
              {
                field: "dino",
                label: "Total",
              },
            ]}
            renderActions={(row) => {
              return (
                <nav className="flex flex-row content-center items-center align-middle">
                  <button
                    id={`rem${row.stat}`}
                    disabled={level[row.stat] <= 0}
                    className="rw-button rw-button-small rw-button-red rounded-full disabled:bg-slate-500 disabled:text-white"
                    onClick={onRemove}
                  >
                    -
                  </button>
                  <input
                    disabled={true}
                    className="rw-input max-w-[50px]"
                    value={level[row.stat]}
                  />
                  <button
                    id={`add${row.stat}`}
                    disabled={points <= 0}
                    className="rw-button rw-button-small rw-button-green disabled:bg-slate-500 disabled:text-white"
                    onClick={onAdd}
                  >
                    +
                  </button>
                </nav>
              );
            }}
          />)}


        </div>
      </div>
    </>
  );
};

export default DinoStatsPage;
