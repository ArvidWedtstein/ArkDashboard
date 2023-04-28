import {
  CheckboxField,
  FieldError,
  Form,
  Label,
  NumberField,
  Submit,
} from "@redwoodjs/forms";
import { Link, routes, navigate } from "@redwoodjs/router";
import { useMutation } from "@redwoodjs/web";
import { toast } from "@redwoodjs/web/toast";
import {
  timeFormatL,
  combineBySummingKeys,
  truncate,
  debounce,
  clamp,
} from "src/lib/formatters";
import { useCallback, useMemo, useState } from "react";

import type { DeleteDinoMutationVariables, FindDinoById } from "types/graphql";
import clsx from "clsx";
import Table from "src/components/Util/Table/Table";
import CheckboxGroup from "src/components/Util/CheckSelect/CheckboxGroup";
import Counter from "src/components/Util/Counter/Counter";
import Tabs from "src/components/Util/Tabs/Tabs";
import { PieChart } from "src/components/Util/PieChart/PieChart";

const DELETE_DINO_MUTATION = gql`
  mutation DeleteDinoMutation($id: String!) {
    deleteDino(id: $id) {
      id
    }
  }
`;

// type DinoStat = {
//   fits_through: {
//     item_id: number;
//     value?: number;
//     rank?: number;
//     type: string;

//   }[];
// }
// type DinoExtend = FindDinoById["dino"] & DinoStat

interface Props {
  dino: NonNullable<FindDinoById["dino"]>;
}

const Dino = ({ dino }: Props) => {
  const [deleteDino] = useMutation(DELETE_DINO_MUTATION, {
    onCompleted: () => {
      toast.success("Dino deleted");
      navigate(routes.dinos());
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  // Melee damage is affected by 4 factors: Weapon Base Damage, Weapon Damage Quality Multiplier, Survivor Melee Damage Multiplier and Server Settings: Player Damage.

  // Melee Damage = WBD * WDQM * SMDM * PD

  const onDeleteClick = (id: DeleteDinoMutationVariables["id"]) => {
    if (confirm("Are you sure you want to delete dino " + id + "?")) {
      deleteDino({ variables: { id } });
    }
  };
  const canDestroy = ({ value }) => {
    return value > 0 ? (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 512 512"
        className="fill-pea-500 h-8 w-8"
      >
        <path d="M475.3 123.3l-272 272C200.2 398.4 196.1 400 192 400s-8.188-1.562-11.31-4.688l-144-144c-6.25-6.25-6.25-16.38 0-22.62s16.38-6.25 22.62 0L192 361.4l260.7-260.7c6.25-6.25 16.38-6.25 22.62 0S481.6 117.1 475.3 123.3z" />
      </svg>
    ) : (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 320 512"
        className="h-8 w-8 fill-red-500"
      >
        <path d="M315.3 411.3c-6.253 6.253-16.37 6.253-22.63 0L160 278.6l-132.7 132.7c-6.253 6.253-16.37 6.253-22.63 0c-6.253-6.253-6.253-16.37 0-22.63L137.4 256L4.69 123.3c-6.253-6.253-6.253-16.37 0-22.63c6.253-6.253 16.37-6.253 22.63 0L160 233.4l132.7-132.7c6.253-6.253 16.37-6.253 22.63 0c6.253 6.253 6.253 16.37 0 22.63L182.6 256l132.7 132.7C321.6 394.9 321.6 405.1 315.3 411.3z" />
      </svg>
    );
  };

  const [useFoundationUnit, setUseFoundationUnit] = useState(false);
  const [maturation, setMaturation] = useState(0);
  const [selectedFood, setSelectedFood] = useState(null);
  const [secondsBetweenHits, setSecondsBetweenHits] = useState(5);
  const [dinoLevel, setDinoLevel] = useState(0);
  const [dinoXVariant, setDinoXVariant] = useState(false);
  const [weaponDamage, setWeaponDamage] = useState({});
  const calcMaturationPercent = useCallback(() => {
    let timeElapsed = maturation * parseInt(dino.maturation_time) * 1;
    return timeElapsed / 100;
  }, [maturation, setMaturation]);

  const [baseStats, setBaseStats] = useState(
    Object.entries(dino.base_stats).map(([key, value]: any) => {
      return {
        stat: key,
        base: (typeof value === "object" ? value.b || 0 : value) || 0,
        increasePerLevelWild: value.w || 0,
        increasePerLevelTamed: value.t || 0,
        total: 0,
        points: 0,
      };
    })
  );

  const onAdd = useCallback(
    (id) => {
      console.log(baseStats);
      setBaseStats(
        baseStats.map((stat) => {
          if (stat.stat === id) {
            stat.points = clamp(stat.points + 1, 0, 100);
          }
          stat.total = stat.points * stat.increasePerLevelWild + stat.base;
          return stat;
        })
      );
    },
    [baseStats]
  );

  const onRemove = useCallback(
    (id) => {
      setBaseStats(
        baseStats.map((stat) => {
          if (stat.stat === id) {
            stat.points = clamp(stat.points - 1, 0, 100);
          }
          stat.total = stat.points * stat.increasePerLevelWild + stat.base;
          return stat;
        })
      );
    },
    [baseStats]
  );
  const genRandomStats = () => {
    // scramble level

    let i =
      dinoLevel -
      baseStats.map((b) => b.points).reduce((a: any, b: any): any => a + b, 0);

    while (i > 0) {
      const stat = baseStats.filter((d) => d.stat != "t")[
        Math.floor(
          Math.random() * baseStats.filter((d) => d.stat != "t").length
        )
      ];
      setBaseStats(
        baseStats.map((b) => {
          if (b.stat === stat.stat) {
            b.points = clamp(b.points + 1, 0, 100);
          }
          return b;
        })
      );
      i--;
    }
    setBaseStats(
      baseStats.map((b) => {
        b.total = b.points * b.increasePerLevelWild + b.base;
        return b;
      })
    );
  };
  // Multipliers
  const settings = {
    harvestMultiplier: 1,
    babyCuddleInterval: 1,
    babyImprintAmount: 1,
    hexagonReward: 1,
    tamingMultiplier: 1.0,
    consumptionMultiplier: 1.0,
    hatchMultiplier: 1,
    matureMultiplier: 1,
    meleeMultiplier: 100,
    playerDamageMultiplier: 1.0,
    matingIntervalMultiplier: 1.0,
    eggHatchSpeedMultiplier: 1.0,
    babyMatureSpeedMultiplier: 1.0,
    XPMultiplier: 1.0,
  };
  const weapons = useMemo(() => {
    return [
      {
        name: "Tranquilizer Dart",
        image: "tranquilizer-dart.png",
        torpor: 221,
        damage: 26,
        durationDevKit: 5,
        duration: 6,
        hasMultipler: true,
        mult: ["DmgType_Projectile", "DamageType"],
        id: 745,
        userDamage: 100,
      },
      {
        name: "Shocking Tranquilizer Dart",
        image: "shocking-tranquilizer-dart.png",
        torpor: 442,
        damage: 26,
        durationDevKit: 5,
        duration: 6,
        hasMultipler: true,
        mult: ["DmgType_Projectile", "DamageType"],
        id: 748,
        userDamage: 100,
      },
      {
        name: "Bow",
        image: "tranquilizer-arrow-bow.png",
        torpor: 90,
        damage: 20,
        duration: 6,
        hasMultipler: true,
        mult: ["DmgType_Projectile", "DamageType"],
        id: 1038,
        userDamage: 100,
      },
      {
        name: "Crossbow",
        image: "crossbow.png",
        torpor: 157.5,
        damage: 35,
        duration: 6,
        hasMultipler: true,
        mult: ["DmgType_Projectile", "DamageType"],
        id: 362,
        userDamage: 100,
      },
      {
        name: "Tek Bow",
        image: "tek-bow.png",
        torpor: 336,
        damage: 24,
        duration: 6,
        hasMultipler: true,
        mult: ["DmgType_Projectile", "DamageType"],
        id: 784,
        userDamage: 100,
      },
      {
        name: "Compound Bow",
        image: "compound-bow.png",
        torpor: 121.5,
        damage: 27,
        duration: 6,
        hasMultipler: true,
        mult: ["DmgType_Projectile", "DamageType"],
        id: 376,
        userDamage: 100,
      },
      {
        name: "Harpoon Launcher",
        image: "harpoon-launcher.png",
        torpor: 300,
        damage: 36,
        duration: 5,
        hasMultipler: true,
        mult: ["DmgType_Projectile", "DamageType"],
        id: 731,
        userDamage: 100,
      },
      {
        name: "Fists",
        image: "fists.png",
        torpor: 14,
        damage: 8,
        hasMultipler: false,
        usesMeleeDamage: true,
        mult: [
          "DmgType_Melee_Torpidity_StoneWeapon",
          "DmgType_Melee_Torpidity",
          "DmgType_Melee_Human",
          "DmgType_Melee",
          "DamageType",
        ],
        id: "Fists",
        userDamage: 100,
      },
      {
        name: "Slingshot",
        image: "slingshot.png",
        torpor: 23.8,
        damage: 14,
        hasMultipler: true,
        mult: ["DmgType_StoneWeapon", "DamageType"],
        id: 139,
        userDamage: 100,
      },
      {
        name: "Wooden Club",
        image: "wooden-club.png",
        torpor: 20,
        damage: 5,
        hasMultipler: true,
        usesMeleeDamage: true,
        mult: [
          "DmgType_Melee_HighTorpidity_StoneWeapon",
          "DmgType_Melee_Human",
          "DmgType_StoneWeapon",
          "DamageType",
        ],
        id: 434,
        userDamage: 100,
      },
      {
        name: "Boomerang",
        image: "boomerang.png",
        damage: 30,
        torpor: 70.5,
        mult: [
          "DmgType_Melee_Torpidity_StoneWeapon",
          "DmgType_StoneWeapon",
          "DamageType",
        ],
        id: 848,
        userDamage: 100,
      },
      {
        name: "Electric Prod",
        image: "electric-prod.png",
        torpor: 266,
        damage: 1,
        hasMultipler: true,
        mult: ["DmgType_Melee_Human", "DamageType"],
        id: 451,
        userDamage: 100,
      },
      {
        name: "Tripwire Narcotic Trap",
        image: "tripwire-narcotic-trap.png",
        torpor: 240,
        damage: 0,
        duration: 10,
        mult: ["DamageType"],
        id: 1041,
        type: "Tripwire Narcotic Trap",
        userDamage: 100,
      },
    ];
  }, [dino]);
  const nper = (n, x) => {
    let n1 = n + 1;
    let r = 1.0;
    let xx = Math.min(x, n - x);
    for (let i = 1; i < xx + 1; i++) {
      r = (r * (n1 - i)) / i;
    }
    return r;
  };

  /**

    Calculates the cumulative probability of getting a result between the given lower and upper limits,
    based on a binomial distribution with a given number of trials and probability of success.
    @param {number} ll - Lower limit of the result
    @param {number} ul - Upper limit of the result
    @param {number} p - Probability of success
    @returns {number} - The cumulative probability
    */
  function calculateProbabilityMore(ll, ul, p) {
    let n = ul;
    let numIntervals = n + 1;
    let probs = new Array(numIntervals);
    let maxProb = 0;
    for (let i = 0; i < numIntervals; i++) {
      probs[i] = b(p, n, i);
      maxProb = Math.max(maxProb, probs[i]);
    }
    let pCumulative = 0;
    for (let i = 0; i < numIntervals; i++) {
      if (i >= ll && i <= ul) {
        pCumulative += probs[i];
      }
    }
    pCumulative = Math.round(10000 * pCumulative) / 100;
    return pCumulative;
  }
  function b(p, n, x) {
    let px = Math.pow(p, x) * Math.pow(1.0 - p, n - x);
    return nper(n, x) * px;
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
    let ul;
    let p = 1 / numOptions;
    if (!isNaN(n) && !isNaN(p)) {
      if (n > 0 && p > 0 && p < 1) {
        if (!isNaN(ll) && ll >= 0) {
          return calculateProbabilityMore(ll, n, p);
        }
      }
    }
  }
  // Calculate stats off offstring
  // Value = (BaseStat × ( 1 + LevelWild × IncreaseWild) + TamingBonusAdd × TamingBonusAddModifier) × (1 + TamingEffectiveness × TamingBonusMult × TamingBonusMultModifier)
  const calculateDino = (e) => {
    const { level, x_variant } = e;
    if (!level) return null;

    setDinoLevel(parseInt(level));
    setDinoXVariant(x_variant);

    if (!selectedFood)
      setSelectedFood(
        dino.DinoStat.filter((f) => f.type === "food")[0].Item.id
      );
  };

  const tamingFood = useMemo(() => {
    if (!dino || !dinoLevel) return [];
    const affinityNeeded = dino.affinity_needed + dino.aff_inc * dinoLevel;

    const foodConsumption =
      dino.food_consumption_base *
      dino.food_consumption_mult *
      settings.consumptionMultiplier *
      1;

    const tamingMultiplier = dino.disable_mult
      ? 4
      : settings.tamingMultiplier * 4;
    if (!selectedFood)
      setSelectedFood(
        dino.DinoStat.filter((f) => f.type === "food")[0].Item.id
      );

    return dino.DinoStat.filter(
      (f) =>
        f.type === "food" &&
        (f.Item.stats as any)?.find((s) => s.id === 8)?.value !== null
    ).map((foodItem: any, index: number) => {
      const foodValue = foodItem.Item.stats
        ? foodItem.Item.stats.find((stat) => stat.id == 8)?.value
        : 1;
      const affinityValue =
        foodItem.Item.stats.find((stat) => stat.id == 15)?.value || 1;

      let foodMaxRaw = affinityNeeded / affinityValue / tamingMultiplier;
      let foodMax = 0;
      const isFoodSelected =
        foodItem.Item.id ===
        (selectedFood ||
          dino.DinoStat.filter((f) => f.type === "food")[0].Item.id);
      let interval = null;
      let interval1 = null;
      let foodSecondsPer = 0;
      let foodSeconds = 0;
      if (!dino.violent_tame) {
        // if non violent tame
        foodMaxRaw = foodMaxRaw / dino.non_violent_food_rate_mult;
        interval = foodValue / foodConsumption;
        const baseStat = (dino.base_stats as any)?.f;
        if (
          typeof baseStat?.b === "number" &&
          typeof baseStat?.w === "number"
        ) {
          const averagePerStat = Math.round(dinoLevel / 7);
          const estimatedFood = baseStat.b + baseStat.w * averagePerStat;
          const requiredFood = Math.max(estimatedFood * 0.1, foodValue);
          interval1 = requiredFood / foodConsumption;
        }
        foodMax = Math.ceil(foodMaxRaw);

        if (foodMax !== 1) {
          foodSecondsPer = foodValue / foodConsumption;
          foodSeconds = Math.ceil(
            Math.max(foodMax - (typeof interval1 === "number" ? 2 : 1), 0) *
            foodSecondsPer +
            (typeof interval1 === "number" ? interval1 : 0)
          );
        } else {
          foodSecondsPer = 0;
          foodSeconds = 0;
          interval1 = 0;
          interval = 0;
        }
      } else {
        interval = null;
        foodMax = Math.ceil(foodMaxRaw);
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
      };
    });
  }, [selectedFood, dinoLevel]);

  const tameData = useMemo(() => {
    if (!tamingFood || tamingFood.length == 0) return null;
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

    let affinityNeeded = dino.affinity_needed + dino.aff_inc * dinoLevel;
    // sanguineElixir = affinityNeeded *= 0.7

    let affinityLeft = affinityNeeded;

    let totalFood = 0;

    let tamingMultiplier = dino.disable_mult
      ? 4
      : settings.tamingMultiplier * 4;
    let foodConsumption =
      dino.food_consumption_base *
      dino.food_consumption_mult *
      settings.consumptionMultiplier;

    foodConsumption = dino.violent_tame
      ? foodConsumption
      : foodConsumption * dino.non_violent_food_rate_mult;

    let tooMuchFood = false;
    let enoughFood = false;
    let numUsedTotal = 0;
    let numNeeded = 0;
    let numToUse = 0;
    let totalSecs = 0;

    tamingFood.forEach((food: any) => {
      if (!food) return;
      let foodVal = food?.stats.find((f: any) => f.id === 8)
        ? food?.stats.find((f: any) => f.id === 8)?.value
        : 0;
      let affinityVal = food?.stats.find((f: any) => f.id === 15)
        ? food?.stats.find((f: any) => f.id === 15)?.value
        : 0;

      if (affinityLeft > 0) {
        if (selectedFood) {
          food.use = food.id == selectedFood ? food.max : 0;
        }
        numNeeded = dino.violent_tame
          ? Math.ceil(affinityLeft / affinityVal / tamingMultiplier)
          : Math.ceil(
            affinityLeft /
            affinityVal /
            tamingMultiplier /
            dino.non_violent_food_rate_mult
          );

        numToUse = numNeeded >= food.use ? food.use : numNeeded;
        tooMuchFood = numNeeded >= food.use ? false : true;

        affinityLeft = dino.violent_tame
          ? affinityLeft - numToUse * affinityVal * tamingMultiplier
          : affinityLeft -
          numToUse *
          affinityVal *
          tamingMultiplier *
          dino.non_violent_food_rate_mult;

        totalFood += numToUse * foodVal;

        let i = 1;
        while (i <= numToUse) {
          effectiveness -= dino.violent_tame
            ? (Math.pow(effectiveness, 2) * dino.taming_ineffectiveness) /
            affinityVal /
            tamingMultiplier /
            100
            : (Math.pow(effectiveness, 2) * dino.taming_ineffectiveness) /
            affinityVal /
            tamingMultiplier /
            dino.non_violent_food_rate_mult /
            100;

          totalSecs =
            numUsedTotal == 1
              ? totalSecs + food.interval
              : foodVal / foodConsumption;

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
    totalSecs = Math.ceil(totalSecs);
    const neededValues = {};
    const neededValuesSecs = {};

    if (affinityLeft <= 0) {
      enoughFood = true;
    } else {
      enoughFood = false;

      tamingFood.forEach((food: any) => {
        numNeeded = Math.ceil(
          affinityLeft /
          food?.stats.find((f) => f.id === 15)?.value /
          tamingMultiplier
        );
        neededValues[food.id] = numNeeded;
        neededValuesSecs[food.id] = Math.ceil(
          (numNeeded * food.stats.find((f: any) => f.id === 8)?.value) /
          foodConsumption +
          totalSecs
        );
      });
    }
    console.log(neededValues);
    let percentLeft = affinityLeft / affinityNeeded;
    let percentTamed = 1 - percentLeft;
    let totalTorpor =
      dino.base_taming_time + dino.taming_interval * (dinoLevel - 1);
    let torporDepletionPS =
      dino.tdps +
      Math.pow(dinoLevel - 1, 0.800403041) / (22.39671632 / dino.tdps);

    const calcNarcotics = Object.entries(narcotics).map(
      ([name, stats]: any) => {
        return {
          [`${name}Min`]: Math.max(
            Math.ceil(
              (totalSecs * torporDepletionPS - totalTorpor) /
              (stats.torpor + torporDepletionPS * stats.secs)
            ),
            0
          ),
        };
      }
    );

    return {
      affinityNeeded,
      effectiveness,
      neededValues,
      neededValuesSecs,
      enoughFood,
      tooMuchFood,
      totalFood,
      totalSecs,
      levelsGained: Math.floor((dinoLevel * 0.5 * effectiveness) / 100),
      totalTorpor,
      torporDepletionPS,
      percentTamed,
      ...calcNarcotics.reduce((acc, cur) => ({ ...acc, ...cur }), {}),
    };
  }, [tamingFood]);

  const calcWeapons = useMemo(() => {
    return weapons.map((weapon: any) => {
      // Calculate the taming time for the creature
      const creatureT =
        dino.base_taming_time + dino.taming_interval * (dinoLevel - 1);

      // Calculate the flee threshold for the creature
      const creatureFleeThreshold =
        typeof dino.flee_threshold === "number" ? dino.flee_threshold : 0.75;

      // Calculate torpor per hit for the weapon
      let torporPerHit = weapon.torpor;
      const weaponDuration = weapon.duration || 0;

      // Calculate torpor depletion rate per second for the creature
      let torporDeplPS;
      if (dino.tdps) {
        torporDeplPS =
          dino.tdps +
          Math.pow(dinoLevel - 1, 0.8493) / (22.39671632 / dino.tdps);
      }

      // Adjust torpor per hit based on weapon duration and torpor depletion rate
      if (torporDeplPS && secondsBetweenHits > weaponDuration) {
        const secsOfRegen = secondsBetweenHits - weaponDuration;
        torporPerHit -= secsOfRegen * torporDeplPS;
      }

      // Determine if knocking out the creature with the given weapon is possible
      const isPossible = torporPerHit > 0;

      // Calculate the number of hits required to knock out the creature
      let knockOut = creatureT / torporPerHit;

      // Apply any applicable weapon and dino multipliers to the knockout time
      let totalMultipliers = 1;

      if (
        typeof weapon.mult === "object" &&
        weapon.mult !== null &&
        (dino.multipliers as any)?.length > 0 &&
        typeof dino.multipliers[0] === "object"
      ) {
        for (const i in weapon.mult) {
          if (typeof dino.multipliers[0][weapon.mult[i]] === "number") {
            knockOut /= dino.multipliers[0][weapon.mult[i]];
            totalMultipliers *= dino.multipliers[0][weapon.mult[i]];
          }
        }
      }

      // Adjust knockout time based on melee damage multiplier
      if (weapon.usesMeleeDamage === true) {
        knockOut /= settings.meleeMultiplier / 100;
        totalMultipliers *= settings.meleeMultiplier / 100;
      }

      // Adjust knockout time for special variant creatures
      if (dino.x_variant && dinoXVariant == true) {
        knockOut /= 0.4;
        totalMultipliers *= 0.4;
      }

      // Adjust knockout time based on player damage multiplier
      knockOut /= settings.playerDamageMultiplier;
      totalMultipliers *= settings.playerDamageMultiplier;

      // Calculate the number of hits required based on user damage per hit
      // const numHitsRaw = knockOut / (weapon.userDamage / 100);
      const numHitsRaw =
        knockOut / ((weaponDamage[weapon.id] || weapon.userDamage) / 100);

      // Calculate the number of hits required for each hitbox
      let hitboxes = [];
      if (dino.hitboxes !== undefined) {
        for (const i in dino.hitboxes as any) {
          const hitboxHits = numHitsRaw / dino.hitboxes[i];
          let hitsUntilFlee =
            creatureFleeThreshold === 1
              ? "-"
              : Math.max(1, Math.ceil(hitboxHits * creatureFleeThreshold));
          hitboxes.push({
            name: i,
            multiplier: dino.hitboxes[i],
            hitsRaw: hitboxHits,
            hitsUntilFlee: hitsUntilFlee,
            hits: Math.ceil(hitboxHits),
            chanceOfDeath: 0,
            isPossible: isPossible,
          });
        }
      }
      let bodyChanceOfDeath = 0;
      let minChanceOfDeath = 0;
      if (dinoLevel < 2000 && isPossible) {
        const baseStats = dino.base_stats["h"];
        if (baseStats?.b && baseStats?.w) {
          const baseHealth = baseStats.b;
          const incPerLevel = baseStats.w;
          if (
            typeof weapon.damage != null &&
            typeof baseHealth != null &&
            typeof incPerLevel != null
          ) {
            let numStats = 7;
            let totalDamage =
              weapon.damage *
              Math.ceil(numHitsRaw) *
              totalMultipliers *
              ((weaponDamage[weapon.id] || weapon.userDamage) / 100);

            let propsurvival =
              totalDamage < baseHealth
                ? 100
                : dinoLevel - 1 <
                  Math.max(
                    Math.ceil((totalDamage - baseHealth) / incPerLevel),
                    0
                  )
                  ? 0
                  : calculatePropability(
                    dinoLevel - 1,
                    numStats,
                    Math.max(
                      Math.ceil((totalDamage - baseHealth) / incPerLevel),
                      0
                    )
                  );

            bodyChanceOfDeath = Math.round(100 - propsurvival);
            minChanceOfDeath = bodyChanceOfDeath;

            if (hitboxes.length > 0) {
              for (const i in hitboxes) {
                totalDamage =
                  weapon.damage *
                  Math.ceil(hitboxes[i].hitsRaw) *
                  totalMultipliers *
                  ((weaponDamage[weapon.id] || weapon.userDamage) / 100) *
                  hitboxes[i].multiplier;

                propsurvival =
                  totalDamage < baseHealth
                    ? 100
                    : calculatePropability(
                      dinoLevel - 1,
                      numStats,
                      Math.max(
                        Math.ceil((totalDamage - baseHealth) / incPerLevel),
                        0
                      )
                    );

                const chanceOfDeath = Math.round(100 - propsurvival);
                hitboxes[i].chanceOfDeath = chanceOfDeath;
                hitboxes[i].chanceOfDeathHigh = chanceOfDeath > 40;
                minChanceOfDeath = Math.min(minChanceOfDeath, chanceOfDeath);
              }
            }
          }
        }
      }

      let chanceOfDeathHigh = bodyChanceOfDeath > 40;
      const hitsUntilFlee =
        creatureFleeThreshold == 1
          ? "-"
          : Math.max(1, Math.ceil(numHitsRaw * creatureFleeThreshold));

      return {
        hits: Math.ceil(numHitsRaw),
        hitsRaw: numHitsRaw,
        hitsUntilFlee: hitsUntilFlee,
        chanceOfDeath: bodyChanceOfDeath,
        chanceOfDeathHigh: chanceOfDeathHigh,
        minChanceOfDeath: minChanceOfDeath || 0,
        isPossible: isPossible,
        isRecommended: isPossible && minChanceOfDeath < 90,
        hitboxes: hitboxes,
        ...weapon,
      };
    });
  }, [dinoLevel, secondsBetweenHits, dinoXVariant, weaponDamage]);

  return (
    <div className="container mx-auto text-black dark:text-white">
      <section className="grid grid-cols-1 md:grid-cols-2">
        <img
          src={`https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/${dino.image}`}
          alt={dino.name}
          className="m-4 w-full p-4"
        />
        <div className="py-4 px-8 text-sm font-light">
          <div className="m-0 mb-4 text-sm">
            <strong className="text-3xl font-light uppercase tracking-widest">
              {dino.name}
            </strong>
            <div className="flex flex-row space-x-2 italic">
              <span>
                {dino.synonyms && dino.synonyms.split(",").join(", ")}
              </span>
            </div>
          </div>

          <div className="mr-4 mb-4 italic">
            <p>{dino.description}</p>
          </div>
          <div className="mr-4 mb-4 inline-block">
            <strong>Ridable:</strong> {dino.ridable ? "Yes" : "No"}
          </div>

          <br />
          <div className="mr-4 mb-4 inline-block">
            <strong>X-Variant:</strong> {dino.x_variant ? "Yes" : "No"}
          </div>
          <div className="mr-4 mb-4 inline-block">
            <strong>Weapon:</strong> {dino.mounted_weaponry ? "Yes" : "No"}
          </div>
          <br />
          <div className="mr-4 mb-4 inline-block">
            <strong>Type:</strong>{" "}
            {dino.violent_tame ? "Aggressive" : "Passive"}
          </div>
          {/*
          {!dino.disable_food && dino.DinoStat.some((d) => d.type == "food") && (
            <>
              <div className="text-lg">Food</div>
              <div className="mb-4 space-x-2">
                {dino.DinoStat.filter((d) => d.type == "food").slice(0, 5).map(({ Item: { name, image } }, i) => (
                  <p className="inline-flex leading-5" key={`food-${i}`}>
                    {name}
                    <img
                      className="w-5"
                      title={name}
                      alt={name}
                      src={`https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/${image}`}
                    />
                  </p>
                ))}
              </div>
            </>
          )} */}
          {/* <div className="text-lg">XP Gained when killed:</div> */}
          <div className="mr-4 mb-4 inline-block">
            <strong>XP Gained when killed:</strong>{" "}
            {dino.exp_per_kill *
              settings.XPMultiplier *
              (1 + 0.1 * (dinoLevel - 1))}
            xp
          </div>
        </div>
      </section>

      {/* <Tabs tabs={[
        { title: "Breeding", content: <p>test</p> },
        { title: "Taming", content: <p>test</p> },
        { title: "1", content: <p>test</p> },
      ]}
        tabClassName="" /> */}

      {!!dino.maturation_time && (dino.incubation_time || dino.base_points) && (
        <section className="my-3 rounded-md p-4">
          <p className="my-3 text-center text-sm">{dino.name} breeding:</p>
          <Form className="my-6 mx-auto flex justify-center">
            <NumberField
              name="matPerc"
              id="matPerc"
              className="rw-input w-20 rounded-none rounded-l-lg"
              placeholder="Maturation Percent"
              defaultValue={0}
              min={0}
              max={100}
              onInput={debounce((event) => {
                setMaturation(
                  parseInt(event.target ? event.target["value"] : 0)
                );
              }, 300)}
            />
            <label
              htmlFor="matPerc"
              className="rw-input rounded-none rounded-r-lg"
            >
              %
            </label>
          </Form>
          {/* Mating internal: 24h - 48h * matingIntervalMultiplier */}

          <ol className="w-full items-center justify-center space-y-4 sm:flex sm:space-x-8 sm:space-y-0">
            {[
              {
                name: "Incubation",
                time: dino.incubation_time / settings.hatchMultiplier,
              },
              { name: "Baby", time: (parseInt(dino.maturation_time) * 1) / 10 },
              {
                name: "Juvenile",
                time:
                  (parseInt(dino.maturation_time) * 1) / 2 -
                  (parseInt(dino.maturation_time) * 1) / 10,
              },
              {
                name: "Adolescent",
                time:
                  (parseInt(dino.maturation_time) * settings.matureMultiplier) /
                  2,
              },
              {
                name: "Total",
                time:
                  parseInt(dino.maturation_time) * settings.matureMultiplier,
              },
            ].map(({ name, time }, i) => (
              <>
                <li
                  className={clsx(`flex items-center space-x-2.5`, {
                    "text-black dark:text-gray-400 [&>*]:border-gray-500 [&>*]:fill-gray-500 [&>*]:dark:border-gray-400 [&>*]:dark:fill-gray-400":
                      calcMaturationPercent() < time,
                    "dark:text-pea-500 text-pea-600 [&>*]:border-pea-600 [&>*]:dark:border-pea-500 [&>*]:dark:fill-pea-500 [&>*]:fill-pea-600":
                      calcMaturationPercent() >= time,
                  })}
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border">
                    {i + 1}
                  </span>
                  <span>
                    <h3 className="font-medium leading-tight">{name}</h3>
                    <p className="text-sm">{timeFormatL(time)}</p>
                  </span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={clsx(`h-6 w-6`, {
                      hidden: i === 4,
                    })}
                    viewBox="0 0 256 512"
                  >
                    <path d="M219.9 266.7L75.89 426.7c-5.906 6.562-16.03 7.094-22.59 1.188c-6.918-6.271-6.783-16.39-1.188-22.62L186.5 256L52.11 106.7C46.23 100.1 46.75 90.04 53.29 84.1C59.86 78.2 69.98 78.73 75.89 85.29l144 159.1C225.4 251.4 225.4 260.6 219.9 266.7z" />
                  </svg>
                </li>
              </>
            ))}
          </ol>
        </section>
      )}

      {dino.egg_min &&
        dino.egg_max &&
        dino.egg_max !== 0 &&
        dino.egg_min !== 0 && (
          <section className="mt-4">
            <img
              src={`https://www.dododex.com/media/item/Dodo_Egg.png`}
              alt={dino.name}
            />
            <div className="flex flex-col space-y-2">
              <h3 className="font-medium leading-tight">Egg</h3>
              <p className="text-sm">
                {dino.egg_min} - {dino.egg_max} °C
              </p>
            </div>
          </section>
        )}

      {dino.DinoStat.some((d) => d.type == "immobilized_by") && (
        <section className="mt-4">
          <h3 className="font-medium leading-tight">Immobilized by</h3>

          <CheckboxGroup
            defaultValue={dino.DinoStat.filter(
              (d) => d.type == "immobilized_by"
            ).map((item) => item?.item_id.toString())}
            form={false}
            options={[
              {
                value: "733",
                label: "Lasso",
                image:
                  "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/lasso.png",
              },
              {
                value: "1040",
                label: "Bola",
                image:
                  "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/bola.png",
              },
              {
                value: "725",
                label: "Chain Bola",
                image:
                  "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/chain-bola.png",
              },
              {
                value: "785",
                label: "Net Projectile",
                image:
                  "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/net-projectile.png",
              },
              {
                value: "1252",
                label: "Plant Species Y Trap",
                image:
                  "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/plant-species-y-trap.png",
              },
              {
                value: "383",
                label: "Bear Trap",
                image:
                  "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/bear-trap.png",
              },
              {
                value: "384",
                label: "Large Bear Trap",
                image:
                  "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/large-bear-trap.png",
              },
            ]}
          />
        </section>
      )}

      {dino.carryable_by && (
        <section className="mt-4">
          <h3 className="font-medium leading-tight">Carryable by</h3>
          <CheckboxGroup
            defaultValue={dino?.carryable_by}
            form={false}
            options={[
              {
                value: "e85015a5-8694-44e6-81d3-9e1fdd06061d",
                label: "Pteranodon",
                image: "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/creature_pteranodon.png",
              },
              {
                value: "1e7966e7-d63d-483d-a541-1a6d8cf739c8",
                label: "Tropeognathus",
                image:
                  "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/creature_tropeognathus.png",
              },
              {
                value: "b8e304b3-ab46-4232-9226-c713e5a0d22c",
                label: "Tapejara",
                image: "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/creature_tapejara.png",
              },
              {
                value: "da86d88a-3171-4fc9-b96d-79e8f59f1601",
                label: "Griffin",
                image: "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/creature_griffin.png",
              },
              {
                value: "147922ce-912d-4ab6-b4b6-712a42a9d939",
                label: "Desmodus",
                image: "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/creature_desmodus.png",
              },
              {
                value: "28971d02-8375-4bf5-af20-6acb20bf7a76",
                label: "Argentavis",
                image: "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/creature_argentavis.png",
              },
              {
                value: "f924e5d6-832a-4fb3-abc0-2fa42481cee1",
                label: "Crystal Wyvern",
                image:
                  "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/creature_crystalwyvern.png",
              },
              {
                value: "7aec6bf6-357e-44ec-8647-3943ca34e666",
                label: "Wyvern",
                image: "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/creature_wyvern.png",
              },
              {
                value: "2b938227-61c2-4230-b7da-5d4d55f639ae",
                label: "Quetzal",
                image: "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/creature_quetzal.png",
              },
              {
                value: "b1d6f790-d15c-4813-a6c8-9e6f62fafb52",
                label: "Tusoteuthis",
                image: "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/creature_tusoteuthis.png",
              },
              {
                value: "d670e948-055e-45e1-adf3-e56d63236238",
                label: "Karkinos",
                image: "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/creature_karkinos.png",
              },
              {
                value: "52156470-6075-487b-a042-2f1d0d88536c",
                label: "Kaprosuchus",
                image: "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/creature_kaprosuchus.png",
              },
              {
                value: "f723f861-0aa3-40b5-b2d4-6c48ec0ca683",
                label: "Procoptodon",
                image: "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/creature_procoptodon.png",
              },
              {
                value: "human",
                label: "Human",
                image: "https://www.dododex.com/media/item/Pet.png",
              },
              {
                value: "94708e56-483b-4eef-ad35-2b9ce0e9c669",
                label: "Gigantopithecus",
                image:
                  "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/creature_gigantopithecus.png",
              },
            ]}
          />
        </section>
      )}

      {dino.DinoStat.some((d) => d.type == "fits_through") && (
        <section className="mt-4">
          <h3 className="font-medium leading-tight">Fits Through</h3>
          <CheckboxGroup
            defaultValue={dino.DinoStat.filter(
              (d) => d.type == "fits_through"
            ).map((item) => item?.item_id.toString())}
            form={false}
            options={[
              {
                value: "322",
                label: "Doorframe",
                image: "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/stone-doorframe.png",
              },
              {
                value: "1066",
                label: "Double Doorframe",
                image:
                  "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/stone-double-doorframe.png",
              },
              {
                value: "143",
                label: "Dinosaur Gateway",
                image:
                  "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/stone-dinosaur-gateway.png",
              },
              {
                value: "381",
                label: "Behemoth Dino Gateway",
                image:
                  "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/behemoth-stone-dinosaur-gateway.png",
              },
              {
                value: "316",
                label: "Hatchframe",
                image: "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/stone-hatchframe.png",
              },
              {
                value: "619",
                label: "Giant Hatchframe",
                image:
                  "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/giant-stone-hatchframe.png",
              },
            ]}
          />
        </section>
      )}

      {dino.can_destroy && (
        <section className="mt-4">
          <h3 className="font-medium leading-tight">Can Destroy</h3>
          <Table
            rows={[
              combineBySummingKeys(
                {
                  t: false,
                  w: false,
                  a: false,
                  g: false,
                  s: false,
                  m: false,
                  tk: false,
                },
                dino.can_destroy.reduce((a, v) => ({ ...a, [v]: true }), {})
              ),
            ]}
            columns={[
              {
                field: "t",
                label: "Thatch",
                renderCell: canDestroy,
              },
              {
                field: "g",
                label: "Greenhouse",
                renderCell: canDestroy,
              },
              {
                field: "w",
                label: "Wood",
                renderCell: canDestroy,
              },
              {
                field: "a",
                label: "Adobe",
                renderCell: canDestroy,
              },
              {
                field: "s",
                label: "Stone",
                renderCell: canDestroy,
              },
              {
                field: "m",
                label: "Metal",
                renderCell: canDestroy,
              },
              {
                field: "tk",
                label: "Tek",
                renderCell: canDestroy,
              },
            ]}
          />
        </section>
      )}

      <section className="mt-4 grid grid-cols-1 md:grid-cols-2">
        {dino.DinoStat.some((d) => d.type == "gather_efficiency") && (
          <div className="space-y-2">
            <h4>Gather Efficiency</h4>
            <Table
              className="w-fit"
              header={true}
              pagination={true}
              rowsPerPage={5}
              rows={dino.DinoStat.filter(
                (d) => d.type == "gather_efficiency"
              ).sort((a, b) => b.value - a.value)}
              columns={[
                {
                  field: "Item",
                  label: "",
                  valueFormatter: ({ value }) => {
                    return (
                      <img
                        src={`https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/${value.image}`}
                        className="h-8 w-8 self-end"
                      />
                    );
                  },
                },
                {
                  field: "Item",
                  label: "Name",
                  valueFormatter: ({ value }) => {
                    return <p>{value.name}</p>;
                  },
                },
                {
                  field: "value",
                  label: "Value",
                  sortable: true,
                  valueFormatter: (value) => (
                    <div className="flex h-2 w-32 flex-row divide-x divide-black rounded-full bg-gray-300">
                      {Array.from(Array(5)).map((_, i) => (
                        <div
                          key={`${i},${value.value}`}
                          className={clsx(
                            `h-full w-1/5 first:rounded-l-full last:rounded-r-full`,
                            {
                              "bg-transparent": Math.round(value.value) < i + 1,
                              "[&:nth-child(1)]:bg-red-500 [&:nth-child(2)]:bg-orange-500 [&:nth-child(3)]:bg-yellow-500 [&:nth-child(4)]:bg-lime-500 [&:nth-child(5)]:bg-green-500":
                                Math.round(value.value) >= i + 1,
                            }
                          )}
                        ></div>
                      ))}
                    </div>
                  ),
                },
                {
                  field: "rank",
                  label: "rank",
                  sortable: true,
                  valueFormatter: ({ value }) => {
                    return value <= 10 && <p>#{value}</p>;
                  },
                },
              ]}
            />
          </div>
        )}

        {dino.DinoStat.some((d) => d.type == "weight_reduction") && (
          <div className="space-y-2">
            <h4>Weight Reduction</h4>
            <Table
              className="w-fit"
              header={false}
              rows={dino.DinoStat.filter(
                (d) => d.type == "weight_reduction"
              ).sort((a, b) => b.value - a.value)}
              columns={[
                {
                  field: "Item",
                  label: "",
                  valueFormatter: ({ value }) => {
                    return (
                      <img
                        src={`https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/${value.image}`}
                        className="h-8 w-8 self-end"
                      />
                    );
                  },
                },
                {
                  field: "Item",
                  label: "",
                  valueFormatter: ({ value }) => {
                    return <p>{value.name}</p>;
                  },
                },
                {
                  field: "value",
                  label: "",
                  valueFormatter: ({ value }) => (
                    <div className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 512 512"
                        className="inline-block w-4 fill-current"
                      >
                        <path d="M510.3 445.9L437.3 153.8C433.5 138.5 420.8 128 406.4 128H346.1c3.625-9.1 5.875-20.75 5.875-32c0-53-42.1-96-96-96S159.1 43 159.1 96c0 11.25 2.25 22 5.875 32H105.6c-14.38 0-27.13 10.5-30.88 25.75l-73.01 292.1C-6.641 479.1 16.36 512 47.99 512h416C495.6 512 518.6 479.1 510.3 445.9zM256 128C238.4 128 223.1 113.6 223.1 96S238.4 64 256 64c17.63 0 32 14.38 32 32S273.6 128 256 128z" />
                      </svg>
                      <p className="mx-1 text-lime-300">{value}%</p>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 320 512"
                        className="inline-block w-4 fill-current text-lime-300"
                      >
                        <path d="M310.6 246.6l-127.1 128C176.4 380.9 168.2 384 160 384s-16.38-3.125-22.63-9.375l-127.1-128C.2244 237.5-2.516 223.7 2.438 211.8S19.07 192 32 192h255.1c12.94 0 24.62 7.781 29.58 19.75S319.8 237.5 310.6 246.6z" />
                      </svg>
                    </div>
                  ),
                },
                {
                  field: "rank",
                  label: "",
                  valueFormatter: ({ value }) => {
                    return value <= 10 && <p>#{value}</p>;
                  },
                },
              ]}
            />
          </div>
        )}
      </section>

      <section className="my-4 flex flex-wrap gap-3">
        <div className="space-y-2">
          <h4>Drops</h4>
          <Table
            className="w-fit"
            header={false}
            rows={dino.DinoStat.filter((d) => d.type == "drops")}
            select={false}
            columns={[
              {
                field: "Item",
                label: "",
                valueFormatter: ({ value }) => {
                  return (
                    <div className="mr-3 flex flex-row items-center space-x-2">
                      <img
                        src={`https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/${value.image}`}
                        className="h-8 w-8 self-start"
                      />
                      <p>{value.name}</p>
                    </div>
                  );
                },
              },
            ]}
          />
        </div>
        <div className="space-y-2">
          <h4>Food</h4>
          <Table
            className="w-fit overflow-hidden"
            header={false}
            rows={dino.DinoStat.filter((d) => d.type == "food")}
            columns={[
              {
                field: "Item",
                label: "",
                valueFormatter: ({ value }) => {
                  return (
                    <div className="mr-3 flex flex-row items-center space-x-2">
                      <img
                        src={`https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/${value.image}`}
                        className="h-8 w-8 self-end"
                      />
                      <p>{value.name}</p>
                    </div>
                  );
                },
              },
            ]}
          />
        </div>
      </section>

      <section className="my-4 border-t border-gray-700 pt-3 dark:border-white">
        <h3 className="text-xl font-medium leading-tight">Taming</h3>
        <p>{dino?.taming_notice}</p>
        <div>
          <Form
            onSubmit={(e) => {
              calculateDino(e);
            }}
          >
            <Label
              name="level"
              className="rw-label"
              errorClassName="rw-label rw-label-error"
            >
              Level
            </Label>

            <NumberField
              name="level"
              className="rw-input"
              errorClassName="rw-input rw-input-error"
              validation={{
                required: true,
                valueAsNumber: true,
                min: 1,
                max: 500,
              }}
              defaultValue={100}
            />

            <FieldError name="level" className="rw-field-error" />

            {dino.x_variant && (
              <>
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
                  validation={{ required: false, valueAsBoolean: true }}
                />

                <FieldError name="x_variant" className="rw-field-error" />
              </>
            )}

            <div className="rw-button-group justify-start">
              <Submit className="rw-button rw-button-green !ml-0">
                Calculate
              </Submit>
            </div>
          </Form>
        </div>
        {tamingFood && tameData && (
          <>
            <CheckboxGroup
              name="foodSelect"
              form={false}
              defaultValue={[
                selectedFood
                  ? selectedFood.toString()
                  : dino.DinoStat.filter(
                    (f) => f.type === "food"
                  )[0].Item.id.toString(),
              ]}
              validation={{
                single: true,
              }}
              options={tamingFood.map((food) => {
                return {
                  value: food.id,
                  label: `${food.name} (${food.max})`,
                  image: `https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/${food.image}`,
                };
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
            {tameData && (
              <>
                <p className="my-3 text-center text-base dark:text-gray-200">
                  With selected food:
                </p>
                <section className="mt-3 rounded-t-md bg-zinc-300 p-4 dark:bg-zinc-600 dark:text-white">
                  <div className="relative my-3 grid grid-cols-4 gap-4 text-center">
                    <div className="not-last:before:content-['>'] relative block before:absolute before:ml-auto before:w-full">
                      <p className="text-thin text-sm">
                        Lvl
                        <span className="ml-1 text-lg font-semibold">
                          {dinoLevel}
                        </span>
                      </p>
                    </div>
                    <div className="not-last:before:content-['>'] relative block before:absolute before:ml-auto before:w-full">
                      <p className="text-thin text-sm">
                        <span className="ml-1 text-lg font-semibold">
                          {(tameData.effectiveness
                            ? tameData.effectiveness
                            : 0
                          ).toFixed(1)}
                        </span>
                        %
                      </p>
                    </div>
                    <div className="not-last:before:content-['>'] relative block before:absolute before:ml-auto before:w-full">
                      <span className="text-thin text-sm">
                        Lvl
                        <span className="ml-1 text-lg font-semibold">
                          <Counter
                            startNum={0}
                            endNum={dinoLevel + tameData.levelsGained}
                            duration={500}
                          />
                        </span>
                      </span>
                    </div>
                    <div className="relative block before:absolute before:ml-auto before:w-full last:before:content-['']">
                      <p className="text-thin text-sm">
                        Lvl
                        <span className="ml-1 text-lg font-semibold">
                          {dinoLevel +
                            tameData.levelsGained +
                            (dinoXVariant && dino.x_variant ? 88 : 73)}
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

                <section className="rounded-b-md bg-zinc-200 p-4 dark:bg-zinc-700 dark:text-white">
                  <div className="relative my-3 grid grid-cols-5 gap-4 text-center">
                    <div className="flex flex-col items-center">
                      <p className="font-light">
                        Torpor Drain Rate:{" "}
                        <span
                          className={clsx(`font-bold`, {
                            "text-pea-500": tameData.torporDepletionPS < 1,
                            "text-yellow-500":
                              tameData.torporDepletionPS >= 1 &&
                              tameData.torporDepletionPS < 2,
                            "text-red-500": tameData.torporDepletionPS >= 2,
                          })}
                        >
                          {tameData.torporDepletionPS.toFixed(1)}/s
                        </span>
                      </p>
                      <p>
                        {timeFormatL(
                          tameData.totalTorpor / tameData.torporDepletionPS
                        )}{" "}
                        until unconscious
                      </p>
                    </div>
                    {(tameData["narcoberriesMin"] !== 0 ||
                      tameData["bioMin"] !== 0 ||
                      tameData["narcoticsMin"] !== 0 ||
                      tameData["ascerbicMin"] !== 0) && (
                        <>
                          <div className="flex flex-col items-center">
                            <img
                              src={`https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/narcoberry.png`}
                              alt=""
                              className="w-12"
                            />
                            <p>{tameData["narcoberriesMin"]}</p>
                            <p className="text-xs">Narcoberries</p>
                          </div>
                          <div className="flex flex-col items-center">
                            <img
                              src={`https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/bio-toxin.png`}
                              alt=""
                              className="w-12"
                            />
                            <p>{tameData["bioMin"]}</p>
                            <p className="text-xs">Bio Toxin</p>
                          </div>
                          <div className="flex flex-col items-center">
                            <img
                              src={`https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/narcotic.png`}
                              alt=""
                              className="w-12"
                            />
                            <p>{tameData["narcoticsMin"]}</p>
                            <p className="text-xs">Narcotics</p>
                          </div>
                          <div className="flex flex-col items-center">
                            <img
                              src={`https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/ascerbic-mushroom.png`}
                              alt=""
                              className="w-12"
                            />
                            <p>{tameData["ascerbicMin"]}</p>
                            <p className="text-xs">Ascerbic Mushroom</p>
                          </div>
                        </>
                      )}
                  </div>
                </section>

                {calcWeapons && tameData && (
                  <>
                    <p className="mt-3 text-lg">Knock Out</p>
                    <div className="max-w-screen relative flex flex-row gap-2 overflow-x-auto rounded-md py-3 text-center">
                      {calcWeapons.map((weapon, i) => (
                        <div
                          key={`weapon-${i}`}
                          className={clsx(
                            `animate-fade-in my-1 flex min-h-full min-w-[8rem] flex-1 flex-col items-center justify-between space-y-1 rounded bg-zinc-200 p-3 first:ml-1 last:mr-1 dark:bg-zinc-600`,
                            {
                              "shadow-pea-500 shadow":
                                weapon.isPossible && weapon.chanceOfDeath < 99,
                              "rw-img-disable text-gray-500":
                                !weapon.isPossible ||
                                weapon.chanceOfDeath >= 99,
                            }
                          )}
                        >
                          <img
                            className="h-16 w-16"
                            src={`https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/${weapon.image}`}
                          />
                          <p className="w-full">{weapon.name}</p>
                          {weapon.isPossible ? (
                            <Counter
                              startNum={0}
                              endNum={weapon.hits}
                              duration={3000 / weapon.hits}
                            />
                          ) : (
                            <p>Not Possible</p>
                          )}
                          {weapon.chanceOfDeath > 0 && weapon.isPossible && (
                            <p
                              className={clsx("text-xs", {
                                "text-red-300": weapon.chanceOfDeathHigh,
                              })}
                            >
                              {weapon.chanceOfDeath}% chance of death
                            </p>
                          )}
                          {weapon.hitboxes.length > 0 && (
                            <span className="rounded bg-blue-100 px-2.5 py-0.5 text-sm font-medium text-blue-500 dark:bg-blue-900 dark:text-blue-300">
                              {weapon.hitboxes.map(
                                (h) => `${h.name} - ${h.multiplier}x`
                              )}
                            </span>
                          )}
                          <div className="rw-button-group max-w-full">
                            <input
                              className="rw-input w-12 !p-1 text-center"
                              defaultValue={weapon.userDamage}
                              disabled={
                                !weapon.isPossible || weapon.chanceOfDeath >= 99
                              }
                              onChange={debounce((e) => {
                                setWeaponDamage({
                                  ...weaponDamage,
                                  [weapon.id]: e.target.value,
                                });
                              }, 300)}
                            />
                            <input
                              type="readonly"
                              disabled={
                                !weapon.isPossible || weapon.chanceOfDeath >= 99
                              }
                              className="rw-input !w-5 !p-1 text-center"
                              readOnly
                              placeholder="%"
                              defaultValue={`%`}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                <input
                  type="number"
                  inputMode="numeric"
                  name="sec_between_hits"
                  className="rw-input"
                  placeholder="Seconds between hits"
                  defaultValue={secondsBetweenHits || 5}
                  onChange={debounce((e) => {
                    setSecondsBetweenHits(parseInt(e.target.value));
                  }, 300)}
                />
              </>
            )}
          </>
        )}
      </section>

      {dino.Item && (
        <>
          <p className="my-3 text-lg dark:text-gray-200">Saddle</p>
          <details className="group w-fit rounded-md bg-zinc-300 p-2 dark:bg-zinc-600">
            <summary className="flex h-16 min-w-[4rem] place-content-center place-items-center gap-2 border text-center text-sm transition-all dark:text-gray-200">
              <img
                src={`https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/${dino.Item.image}`}
                alt={dino.name}
                className="h-8 w-8 transform group-open:scale-125"
              />
              <span className="animate-fade-in hidden group-open:block">
                {dino.Item.name}
              </span>
            </summary>

            <ul className="rounded-md">
              <li className="animate-fade-in flex h-16 place-content-start place-items-center border border-stone-400 px-2">
                <p>Crafted in: </p>
                <Link
                  className="inline-flex items-center space-x-2"
                  to={routes.item({
                    id: dino.Item.ItemRecipe_ItemRecipe_crafted_item_idToItem[0].Item_ItemRecipe_crafting_stationToItem.id.toString(),
                  })}
                >
                  <img
                    src={`https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/${dino.Item.ItemRecipe_ItemRecipe_crafted_item_idToItem[0].Item_ItemRecipe_crafting_stationToItem.image}`}
                    alt={"Crafting Station"}
                    className="h-8 w-8"
                  />
                  <span>
                    {
                      dino.Item.ItemRecipe_ItemRecipe_crafted_item_idToItem[0]
                        .Item_ItemRecipe_crafting_stationToItem.name
                    }
                  </span>
                </Link>
              </li>
              {dino.Item.ItemRecipe_ItemRecipe_crafted_item_idToItem.map(
                ({ amount, Item_ItemRecipe_item_idToItem }, i) => (
                  <li
                    key={`recipe-${i}`}
                    className="animate-fade-in flex h-16 place-content-start place-items-center border border-stone-400 px-2"
                  >
                    <Link
                      className="inline-flex items-center space-x-2"
                      to={routes.item({
                        id: Item_ItemRecipe_item_idToItem.id.toString(),
                      })}
                    >
                      <img
                        src={`https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/${Item_ItemRecipe_item_idToItem.image}`}
                        alt={Item_ItemRecipe_item_idToItem.name}
                        className="h-8 w-8"
                      />
                      <span>{amount}</span>
                      <span>{Item_ItemRecipe_item_idToItem.name}</span>
                    </Link>
                  </li>
                )
              )}
            </ul>
          </details>
        </>
      )}

      {dino && baseStats && (
        <>
          <section className="rounded-b-md py-3">
            <Table
              rows={baseStats}
              caption={{
                title: "Base Stats",
                content: (
                  <>
                    <div className="rw-button-group !justify-start">
                      <button
                        type="button"
                        className="rw-button rw-button-gray-outline"
                        onClick={genRandomStats}
                      >
                        Random
                      </button>
                      <button
                        type="button"
                        className="rw-button rw-button-gray-outline"
                        onClick={() =>
                          setBaseStats(
                            baseStats.map((s) => ({
                              ...s,
                              points:
                                s.stat == "t" ? 0 : Math.round(dinoLevel / 7),
                            }))
                          )
                        }
                      >
                        Distribute Evenly
                      </button>
                      <button
                        type="button"
                        className="rw-button rw-button-red-outline"
                        onClick={() =>
                          setBaseStats(
                            baseStats.map((s) => ({
                              ...s,
                              points: 0,
                              total: s.base,
                            }))
                          )
                        }
                      >
                        Clear
                      </button>
                    </div>
                    <p>
                      {dinoLevel -
                        baseStats
                          .map((b) => b.points)
                          .reduce((a, b) => a + b, 0)}{" "}
                      points wasted
                    </p>
                  </>
                ),
              }}
              columns={[
                {
                  field: "stat",
                  bold: true,
                  label: "Stat",
                  sortable: true,
                  renderCell: ({ value }) => {
                    return (
                      <div className="inline-flex items-center space-x-2">
                        <img
                          title={
                            {
                              s: "Stamina",
                              w: "Weight",
                              o: "Oxygen",
                              d: "Melee Damage",
                              f: "Food",
                              m: "Movement Speed",
                              t: "Torpidity",
                              h: "Health",
                            }[value]
                          }
                          className="h-6 w-6"
                          src={
                            {
                              s: "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/stamina.webp",
                              w: "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/weight.webp",
                              o: "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/oxygen.webp",
                              d: "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/melee_damage.webp",
                              f: "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/food.webp",
                              m: "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/movement_speed.webp",
                              t: "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/torpidity.webp",
                              h: "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/health.webp",
                            }[value]
                          }
                          alt=""
                        />
                        <p>
                          {
                            {
                              s: "Stamina",
                              w: "Weight",
                              o: "Oxygen",
                              d: "Melee Damage",
                              f: "Food",
                              m: "Movement Speed",
                              t: "Torpidity",
                              h: "Health",
                            }[value]
                          }
                        </p>
                      </div>
                    );
                  },
                },
                {
                  field: "base",
                  label: "Base (lvl 1)",
                  numeric: true,
                  sortable: true,
                },
                {
                  field: "increasePerLevelWild",
                  label: "Increase per level (wild)",
                  numeric: true,
                  valueFormatter: ({ value }) => {
                    return value === null ? "" : `+${value}`;
                  },
                },
                {
                  field: "increasePerLevelTamed",
                  label: "Increase per level (tamed)",
                  numeric: true,
                  valueFormatter: ({ value }) => {
                    return value === null ? "" : `+${value}%`;
                  },
                },
                {
                  field: "total",
                  label: "Total",
                  numeric: true,
                },
              ]}
              renderActions={(row) => {
                return (
                  <nav className="flex flex-row content-center items-center space-x-2 align-middle">
                    <button
                      disabled={
                        baseStats.find((s) => s.stat === row.stat)?.points <=
                        0 || row.stat === "t"
                      }
                      className="rw-button rw-button-small rw-button-red-outline disabled:bg-slate-500 disabled:text-white"
                      onClick={() => onRemove(row.stat)}
                    >
                      -
                    </button>
                    <input
                      disabled={true}
                      className="rw-input max-w-[50px]"
                      value={baseStats.find((s) => s.stat === row.stat)?.points}
                    />
                    <button
                      disabled={
                        baseStats
                          .map((b) => b.points)
                          .reduce((a: any, b: any): any => a + b, 0) >=
                        dinoLevel || row.stat === "t"
                      }
                      className="rw-button rw-button-small rw-button-green-outline disabled:bg-slate-500 disabled:text-white"
                      onClick={() => onAdd(row.stat)}
                    >
                      +
                    </button>
                  </nav>
                );
              }}
            />
          </section>
          {dino.movement && (
            <section className="my-3 rounded-md p-4">
              <div className="flex flex-col ">
                <div className="flex flex-row items-center space-x-1">
                  <p className="w-14"></p>
                  <p className="w-20">Base</p>
                  <p className="w-20">Sprint</p>
                </div>
                {Object.entries(dino.movement["w"]).map(
                  ([stat, value], index) => (
                    <div
                      className="flex flex-row items-center space-x-1"
                      key={`${stat}-${index}`}
                    >
                      <p className="w-14">{stat}</p>
                      {["base", "sprint"].map((label, d) => (
                        <p
                          className="rw-input w-20"
                          key={`${label}${d}${index}`}
                        >
                          {!value[label]
                            ? "-"
                            : truncate(
                              (useFoundationUnit
                                ? Number(value[label] / 300)
                                : Number(value[label])
                              ).toFixed(2),
                              6
                            )}
                        </p>
                      ))}
                      <p className="w-20">
                        {useFoundationUnit ? "Foundations" : `Units`} per sec
                      </p>
                    </div>
                  )
                )}
              </div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  checked={useFoundationUnit}
                  className="peer sr-only"
                  onChange={(e) => setUseFoundationUnit(!useFoundationUnit)}
                />
                <div className="rw-toggle peer-focus:ring-pea-300 dark:peer-focus:ring-pea-800 peer-checked:bg-pea-600 peer peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4"></div>
                <span className="ml-3 text-sm font-medium">
                  Game Units / Foundation
                </span>
              </label>
            </section>
          )}
        </>
      )}

      <nav className="rw-button-group">
        <Link
          to={routes.editDino({ id: dino.id })}
          className="rw-button rw-button-blue"
        >
          Edit
        </Link>
        <button
          type="button"
          className="rw-button rw-button-red"
          onClick={() => onDeleteClick(dino.id)}
        >
          Delete
        </button>
      </nav>
    </div>
  );
};

export default Dino;
