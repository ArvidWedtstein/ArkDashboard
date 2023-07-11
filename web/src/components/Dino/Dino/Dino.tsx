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
  debounce,
  clamp,
  formatNumber,
} from "src/lib/formatters";
import { useCallback, useEffect, useMemo, useReducer, useState } from "react";

import type {
  DeleteDinoMutationVariables,
  FindDinoById,
  permission,
} from "types/graphql";
import clsx from "clsx";
import Table from "src/components/Util/Table/Table";
import CheckboxGroup from "src/components/Util/CheckSelect/CheckboxGroup";
import Counter from "src/components/Util/Counter/Counter";
import { useAuth } from "src/auth";
import Tabs from "src/components/Util/Tabs/Tabs";

const DELETE_DINO_MUTATION = gql`
  mutation DeleteDinoMutation($id: String!) {
    deleteDino(id: $id) {
      id
    }
  }
`;

type AdditionBasestat = {
  b?: number | null;
  s?: {
    b?: number | null;
  };
  w?: {
    b?: number | null;
    st?: number | null;
    sw?: number | null;
  };
};
type Basestat = {
  a?: AdditionBasestat[];
  b?: number | null;
  t?: number | null;
  w?: number | null;
};
type BaseStats = {
  /** Weight */
  w?: Basestat;
  /** Torpor */
  t?: Basestat;
  /** Health */
  h?: Basestat;
  /** Stamina */
  s?: Basestat;
  /** Damage */
  d?: Basestat;
  /** Food */
  f?: Basestat;
  /** Movement Speed */
  m?: Basestat;
  /** Oxygen */
  o?: Basestat;
};
type TamingCalculatorForm = {
  level: string;
  x_variant?: boolean | null;
  foodSelect: string;
  seconds_between_hits: string;
};

interface Props {
  dino: NonNullable<FindDinoById["dino"]>;
  itemsByIds: NonNullable<FindDinoById["itemsByIds"]>;
}

const Dino = ({ dino, itemsByIds }: Props) => {
  const { currentUser } = useAuth();
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

  /**
   * Creature stats calculation
   *
   * Base-value: B
   * Increase per wild-level as % of B: Iw
   * Increase per domesticated level as % of Vpt (value post-tamed): Id
   * Additive taming-bonus: Ta
   * Multiplicative taming-bonus: Tm
   * Taming Effectiveness: TE (when tamed)
   * Imprinting Bonus: IB (when tamed)
   * TamedBaseHealthMultiplier: TBHM (lowers the health of a few dinos right after taming, before the tamingAdd is applied)
   *
   * The Tm and  TmM are only affected by the TE if Tm > 0, i.e a malus won't get less bad if the TE is lower. The Tm is negative for aberrant creatures (-0.04)
   *
   * The imprinting bonus IB only affects bred creatures, and all stat-values except of stamina and oxygen (it does affect the torpor-value)
   *
   * Global variables for each stat:
   * Increase per wild level modifier: IwM
   * Increase per domesticated level modifier: IdM
   * Additive taming-bonus modifier: TaM
   * Multiplicative taming-bonus modifier: TmM
   *
   * Currently these modifiers for health are:
   * TaM = 0.14
   * TmM = 0.44
   * IdM = 0.2
   *
   * Melee Damage:
   * TaM = 0.14
   * TmM = 0.44
   * IdM = 0.17
   * IwM is always 1 for official servers
   *
   * https://ark.fandom.com/wiki/Creature_stats_calculation
   *
   * Assume that a creature has upleveled a certain stat in the wild Lw times, was upleveled a stat by a player Ld times and was tamed with a taming effectiveness of TE.
   * Then the final value V of that stat (as you see it ingame) is
   * Stat Formula: V = (B × (1 + Lw × Iw × IwM) × TBHM × (1 + IB × 0.2 × IBM) + Ta × TaM) × (1 + TE × Tm × TmM) × (1 + Ld × Id × IdM)
   *
   * V = (base value × (1 + stat level wild × Increase per wild-level as % of B × Increase per wild level modifier) × TamedBaseHealthMultiplier × (1 + Imprinting Bonus when tamed × 0.2 × IBM) + Additive taming-bonus × Additive taming-bonus modifier) × (1 + Taming Effectiveness × Multiplicative taming-bonus × Multiplicative taming-bonus modifier) × (1 + Ld × Id × IdM)
   * R-Creatures have 5% damage increase and 3% less health when tamed
   * X-Creatures have 5% damage increase and 3% less health when tamed.
   * Wild X-Creatures have a 250% damage increase and a 60% damage resistance from players and tamed creatures.
   * Players and tames gain 2.5 times more XP for killing them.
   */

  const onDeleteClick = (id: DeleteDinoMutationVariables["id"]) => {
    if (confirm("Are you sure you want to delete dino " + id + "?")) {
      deleteDino({ variables: { id } });
    }
  };

  const canDestroy = ({ value, header }: { value: number, header: string }) =>
    <div className={clsx(`space-y-1`, {
      'rw-img-disable': value <= 0
    })}>
      <img src={`https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/${header.toLowerCase()}-wall.webp`} className="w-8 aspect-square" />
      {value > 0 ? (
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
      )}
    </div>;

  // TODO: FIX
  type DinoActionType = "" | "CHANGE_AMOUNT" | "ADD_AMOUNT" | "REMOVE_AMOUNT" | "ADD" | "REMOVE" | "REMOVE_BY_ID" | "RESET";
  interface DinoAction {
    type: DinoActionType;
    payload?: {

    };
  }
  interface DinoState {
    level: number;
    maturation: number;
    seconds_between_hits: number;
    x_variant: boolean;
    weaponDamage: {
      [key: string]: number;
    };
    activeRecipeTabIndex: number;
  }
  const [state, dispatch] = useReducer((state: DinoState, action: DinoAction) => {
    switch (action.type) {
      default:
        return state
    }
  }, { maturation: 0, level: 150, seconds_between_hits: 5, x_variant: false, weaponDamage: {}, activeRecipeTabIndex: 0 })

  const [maturation, setMaturation] = useState(0);
  const [selectedFood, setSelectedFood] = useState(null);
  const [secondsBetweenHits, setSecondsBetweenHits] = useState(5);
  const [dinoLevel, setDinoLevel] = useState(150); // TODO: remove hardcode
  const [dinoXVariant, setDinoXVariant] = useState(false); // TODO: remove hardcode
  const [weaponDamage, setWeaponDamage] = useState({});

  const calcMaturationPercent = useCallback(() => {
    let timeElapsed = maturation * dino?.maturation_time * 1;
    return timeElapsed / 100;
  }, [maturation, setMaturation]);

  const [baseStats, setBaseStats] = useState(
    dino?.base_stats &&
    Object.entries(dino?.base_stats).map(([key, value]) => ({
      stat: {
        s: "Stamina",
        w: "Weight",
        o: "Oxygen",
        d: "Melee Damage",
        f: "Food",
        m: "Movement Speed",
        t: "Torpidity",
        h: "Health",
      }[key],
      base: (typeof value === "object" ? value?.b || 0 : value) || 0,
      increasePerLevelWild: value?.w || 0,
      increasePerLevelTamed: value?.t || 0,
      total: 0,
      points: 0,
    }))
  );

  const onAdd = useCallback(
    (id) => {
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

  const [activeTab, setActiveTab] = useState(0);

  const genRandomStats = () => {
    // scramble level

    let i =
      dinoLevel - baseStats.map((b) => b.points).reduce((a, b) => a + b, 0);

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
        b.total = b?.points * b?.increasePerLevelWild + b?.base;
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

  const weapons = useMemo(
    () =>
      itemsByIds
        .filter((d) => ![121, 123, 713, 719].includes(d.id))
        .map((w) => ({
          ...w,
          userDamage: 100,
          durationDevKit: 5,
          hasMultipler: true,
          multipliers: (
            w.stats as {
              id: number;
              value: number | string[];
              duration?: number;
            }[]
          ).find((d) => d.id === 21)?.value as string[],
        })),
    [dino]
  );

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
  useEffect(() => {
    if (!selectedFood)
      setSelectedFood(
        dino.DinoStat.filter((f) => f.type === "food") &&
        dino?.DinoStat.filter((f) => f.type === "food")[0]?.Item.id
      );
  }, []);

  const calculateDino = (data: TamingCalculatorForm) => {
    const { level, x_variant, foodSelect, seconds_between_hits } = data;
    if (!level) return null;

    setDinoLevel(parseInt(level));
    setDinoXVariant(x_variant);
    setSelectedFood(foodSelect);
    setSecondsBetweenHits(parseInt(seconds_between_hits));

    if (!foodSelect)
      setSelectedFood(
        dino.DinoStat.filter((f) => f.type === "food") &&
        dino.DinoStat.filter((f) => f.type === "food")[0]?.Item.id
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

    return dino.DinoStat.filter(
      (ds) => ds.type === "food" && ds.Item.food != null
    ).map((foodItem) => {
      const foodValue = foodItem.Item.food;
      const affinityValue = foodItem.Item.affinity;

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
        const baseStat = (dino?.base_stats as BaseStats)
          ? (dino.base_stats as BaseStats)?.f
          : null;
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
  }, []);

  const tameData = useMemo(() => {
    if (!tamingFood || tamingFood.length == 0) return null;
    let effectiveness = 100;

    const narcotics = itemsByIds.filter((f) =>
      [121, 123, 713, 719].includes(f.id)
    );

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

    tamingFood.forEach((food) => {
      if (!food) return;
      let foodVal = food.food;
      let affinityVal = food.affinity;

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
        tooMuchFood = numNeeded >= food.use;

        affinityLeft = dino.violent_tame
          ? affinityLeft - numToUse * affinityVal * tamingMultiplier
          : affinityLeft -
          numToUse *
          affinityVal *
          tamingMultiplier *
          dino.non_violent_food_rate_mult;

        totalFood += numToUse * foodVal;

        let i = 1;
        numToUse = numToUse < 1000 ? numToUse : 1;
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

      tamingFood.forEach((food) => {
        numNeeded = Math.ceil(affinityLeft / food.affinity / tamingMultiplier);
        neededValues[food.id] = numNeeded;
        neededValuesSecs[food.id] = Math.ceil(
          (numNeeded * food.food) / foodConsumption + totalSecs
        );
      });
    }
    let percentLeft = affinityLeft / affinityNeeded;
    let percentTamed = 1 - percentLeft;
    let totalTorpor =
      dino.base_taming_time + dino.taming_interval * (dinoLevel - 1);
    let torporDepletionPS =
      dino.tdps +
      Math.pow(dinoLevel - 1, 0.800403041) / (22.39671632 / dino.tdps);

    const calcNarcotics = narcotics.map(({ name, torpor, torpor_duration }) => {
      return {
        [`${name.replace(" ", "-")}Min`]: Math.max(
          Math.ceil(
            (totalSecs * torporDepletionPS - totalTorpor) /
            (torpor + torporDepletionPS * torpor_duration)
          ),
          0
        ),
      };
    });
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

  const calculateWeapons = useMemo(
    () =>
      weapons.map((weapon) => {
        const { id, userDamage, torpor, torpor_duration, multipliers, damage } =
          weapon;

        const { b: baseHealth, w: incPerLevel } = (
          dino?.base_stats as BaseStats
        )?.h || { b: 0, w: 0 };

        const creatureT =
          dino.base_taming_time + dino.taming_interval * (dinoLevel - 1);

        const creatureFleeThreshold =
          typeof dino.flee_threshold === "number" ? dino.flee_threshold : 0.75;

        let torporPerHit = torpor_duration
          ? torpor -
          (secondsBetweenHits - torpor_duration) *
          (dino.tdps +
            Math.pow(dinoLevel - 1, 0.8493) / (22.39671632 / dino.tdps))
          : torpor;
        const isPossible = torporPerHit > 0;

        let knockOut = creatureT / torporPerHit;
        let totalMultipliers = 1;

        if (Array.isArray(multipliers) && dino?.multipliers?.[0]) {
          for (const multiplier of multipliers) {
            const dinoMultiplier = dino.multipliers[0][multiplier];
            if (typeof dinoMultiplier === "number") {
              knockOut /= dinoMultiplier;
              totalMultipliers *= dinoMultiplier;
            }
          }
        }

        if (multipliers && multipliers.includes("DmgType_Melee_Human")) {
          knockOut /= settings.meleeMultiplier / 100;
          totalMultipliers *= settings.meleeMultiplier / 100;
        }

        if (dino.x_variant && dinoXVariant) {
          knockOut /= 0.4;
          totalMultipliers *= 0.4;
        }

        knockOut /= settings.playerDamageMultiplier;
        totalMultipliers *= settings.playerDamageMultiplier;

        const numHitsRaw = knockOut / ((weaponDamage[id] || userDamage) / 100);

        const hitboxes = dino.hitboxes
          ? Object.entries(
            dino.hitboxes as {
              [key: string]: number;
            }
          ).map(([name, multiplier]) => {
            const hitboxHits = numHitsRaw / multiplier;
            const hitsUntilFlee =
              creatureFleeThreshold === 1
                ? "-"
                : Math.max(1, Math.ceil(hitboxHits * creatureFleeThreshold));

            const totalDamage =
              damage *
              Math.ceil(hitboxHits) *
              totalMultipliers *
              ((weaponDamage[id] || userDamage) / 100) *
              multiplier;
            const propsurvival =
              totalDamage < baseHealth
                ? 100
                : calculatePropability(
                  dinoLevel - 1,
                  7,
                  Math.max(
                    Math.ceil((totalDamage - baseHealth) / incPerLevel),
                    0
                  )
                );

            const chanceOfDeath = Math.round(100 - propsurvival);

            return {
              name,
              multiplier,
              hitsRaw: hitboxHits,
              hitsUntilFlee,
              hits: Math.ceil(hitboxHits),
              chanceOfDeath,
              chanceOfDeathHigh: chanceOfDeath > 40,
              isPossible,
            };
          })
          : [];

        let bodyChanceOfDeath = 0;
        let minChanceOfDeath = 0;

        if (isPossible) {
          if (damage != null && baseHealth != null && incPerLevel != null) {
            let numStats = 7;
            let totalDamage =
              damage *
              Math.ceil(numHitsRaw) *
              totalMultipliers *
              ((weaponDamage[id] || userDamage) / 100);

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

            for (const hitbox of hitboxes) {
              totalDamage =
                damage *
                Math.ceil(hitbox.hitsRaw) *
                totalMultipliers *
                ((weaponDamage[id] || userDamage) / 100) *
                hitbox.multiplier;

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
              hitbox.chanceOfDeath = chanceOfDeath;
              hitbox.chanceOfDeathHigh = chanceOfDeath > 40;
              minChanceOfDeath = Math.min(minChanceOfDeath, chanceOfDeath);
            }
          }
        }

        const chanceOfDeathHigh = bodyChanceOfDeath > 40;
        const hitsUntilFlee =
          creatureFleeThreshold == 1
            ? "-"
            : Math.max(1, Math.ceil(numHitsRaw * creatureFleeThreshold));

        return {
          hits: Math.ceil(numHitsRaw),
          hitsRaw: numHitsRaw,
          hitsUntilFlee,
          chanceOfDeath: bodyChanceOfDeath,
          chanceOfDeathHigh,
          minChanceOfDeath: minChanceOfDeath || 0,
          isPossible,
          isRecommended: isPossible && minChanceOfDeath < 90,
          hitboxes,
          ...weapon,
        };
      }),
    [dinoLevel, secondsBetweenHits, dinoXVariant, weaponDamage]
  );

  return (
    <article className="grid grid-cols-1 gap-3 text-black dark:text-white md:grid-cols-2">
      <section className="col-span-2 grid auto-cols-auto grid-cols-1 md:grid-cols-2">
        <img
          src={`https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Dino/${dino.image}`}
          alt={dino.name}
          className="w-auto -scale-x-100 transform"
        />
        <div className="py-4 px-8 text-sm font-light">
          <div className="m-0 mb-4 text-sm">
            <strong className="text-3xl font-light uppercase tracking-widest">
              {dino.name}
            </strong>
            <div className="flex flex-row space-x-2 italic">
              <span>
                {dino.synonyms && dino.synonyms.replace(',', ', ')}
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
          {/* <div className="text-lg">XP Gained when killed:</div> */}
          <div className="mr-4 mb-4 inline-block">
            <strong>XP Gained when killed:</strong>{" "}
            {(
              dino.exp_per_kill *
              settings.XPMultiplier *
              (1 + 0.1 * (dinoLevel - 1))
            ).toFixed() || 0}
            xp
          </div>
        </div>
      </section>

      <section className="col-span-2">

        <Tabs type="around" tabs={[
          {
            title: 'Stats',
            icon: (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor" className="ml-2 w-5 h-5 pointer-events-none">
                <path d="M256 256c8.828 0 16-7.172 16-16v-96C272 135.2 264.8 128 256 128S240 135.2 240 144v96C240 248.8 247.2 256 256 256zM352 192c8.828 0 16-7.172 16-16v-96C368 71.17 360.8 64 352 64s-16 7.172-16 16v96C336 184.8 343.2 192 352 192zM160 352c8.828 0 16-7.172 16-16v-96C176 231.2 168.8 224 160 224S144 231.2 144 240v96C144 344.8 151.2 352 160 352zM496 448h-416C53.53 448 32 426.5 32 400v-352C32 39.17 24.83 32 16 32S0 39.17 0 48v352C0 444.1 35.88 480 80 480h416c8.828 0 16-7.172 16-16S504.8 448 496 448zM448 352c8.828 0 16-7.172 16-16v-256C464 71.17 456.8 64 448 64s-16 7.172-16 16v256C432 344.8 439.2 352 448 352z" />
              </svg>
            ),
            content: (
              <section className="space-y-3 md:space-y-9">
                {dino?.DinoStat.some((d) => d.type == "immobilized_by") && (
                  <section className="">
                    <h4 className="rw-label">Immobilized by</h4>

                    <CheckboxGroup
                      defaultValue={dino.DinoStat.filter(
                        (d) => d.type == "immobilized_by"
                      ).map((item) => item?.Item.id.toString())}
                      form={false}
                      disabled={true}
                      options={[
                        {
                          value: "733",
                          label: "Lasso",
                          image:
                            "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/lasso.webp",
                        },
                        {
                          value: "1040",
                          label: "Bola",
                          image:
                            "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/bola.webp",
                        },
                        {
                          value: "725",
                          label: "Chain Bola",
                          image:
                            "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/chain-bola.webp",
                        },
                        {
                          value: "785",
                          label: "Net Projectile",
                          image:
                            "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/net-projectile.webp",
                        },
                        {
                          value: "1252",
                          label: "Plant Species Y Trap",
                          image:
                            "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/plant-species-y-trap.webp",
                        },
                        {
                          value: "383",
                          label: "Bear Trap",
                          image:
                            "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/bear-trap.webp",
                        },
                        {
                          value: "384",
                          label: "Large Bear Trap",
                          image:
                            "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/large-bear-trap.webp",
                        },
                      ]}
                    />
                  </section>
                )}

                {dino.carryable_by && (
                  <section>
                    <h4 className="rw-label">Carryable by</h4>
                    <CheckboxGroup
                      defaultValue={dino?.carryable_by}
                      form={false}
                      disabled={true}
                      options={[
                        {
                          value: "e85015a5-8694-44e6-81d3-9e1fdd06061d",
                          label: "Pteranodon",
                          image:
                            "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Dino/creature_pteranodon.webp",
                        },
                        {
                          value: "1e7966e7-d63d-483d-a541-1a6d8cf739c8",
                          label: "Tropeognathus",
                          image:
                            "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Dino/creature_tropeognathus.webp",
                        },
                        {
                          value: "b8e304b3-ab46-4232-9226-c713e5a0d22c",
                          label: "Tapejara",
                          image:
                            "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Dino/creature_tapejara.webp",
                        },
                        {
                          value: "da86d88a-3171-4fc9-b96d-79e8f59f1601",
                          label: "Griffin",
                          image:
                            "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Dino/creature_griffin.webp",
                        },
                        {
                          value: "147922ce-912d-4ab6-b4b6-712a42a9d939",
                          label: "Desmodus",
                          image:
                            "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Dino/creature_desmodus.webp",
                        },
                        {
                          value: "28971d02-8375-4bf5-af20-6acb20bf7a76",
                          label: "Argentavis",
                          image:
                            "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Dino/creature_argentavis.webp",
                        },
                        {
                          value: "f924e5d6-832a-4fb3-abc0-2fa42481cee1",
                          label: "Crystal Wyvern",
                          image:
                            "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Dino/creature_crystalwyvern.webp",
                        },
                        {
                          value: "7aec6bf6-357e-44ec-8647-3943ca34e666",
                          label: "Wyvern",
                          image:
                            "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Dino/creature_wyvern.webp",
                        },
                        {
                          value: "2b938227-61c2-4230-b7da-5d4d55f639ae",
                          label: "Quetzal",
                          image:
                            "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Dino/creature_quetzal.webp",
                        },
                        {
                          value: "b1d6f790-d15c-4813-a6c8-9e6f62fafb52",
                          label: "Tusoteuthis",
                          image:
                            "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Dino/creature_tusoteuthis.webp",
                        },
                        {
                          value: "d670e948-055e-45e1-adf3-e56d63236238",
                          label: "Karkinos",
                          image:
                            "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Dino/creature_karkinos.webp",
                        },
                        {
                          value: "52156470-6075-487b-a042-2f1d0d88536c",
                          label: "Kaprosuchus",
                          image:
                            "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Dino/creature_kaprosuchus.webp",
                        },
                        {
                          value: "f723f861-0aa3-40b5-b2d4-6c48ec0ca683",
                          label: "Procoptodon",
                          image:
                            "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Dino/creature_procoptodon.webp",
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
                            "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Dino/creature_gigantopithecus.webp",
                        },
                      ]}
                    />
                  </section>
                )}

                {dino?.DinoStat.some((d) => d.type == "fits_through") && (
                  <section>
                    <h4 className="rw-label">Fits Through</h4>
                    <CheckboxGroup
                      defaultValue={dino.DinoStat.filter(
                        (d) => d.type == "fits_through"
                      ).map((item) => item?.Item.id.toString())}
                      form={false}
                      disabled={true}
                      options={[
                        {
                          value: "322",
                          label: "Doorframe",
                          image:
                            "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/stone-doorframe.webp",
                        },
                        {
                          value: "1066",
                          label: "Double Doorframe",
                          image:
                            "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/stone-double-doorframe.webp",
                        },
                        {
                          value: "143",
                          label: "Dinosaur Gateway",
                          image:
                            "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/stone-dinosaur-gateway.webp",
                        },
                        {
                          value: "381",
                          label: "Behemoth Dino Gateway",
                          image:
                            "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/behemoth-stone-dinosaur-gateway.webp",
                        },
                        {
                          value: "316",
                          label: "Hatchframe",
                          image:
                            "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/stone-hatchframe.webp",
                        },
                        {
                          value: "619",
                          label: "Giant Hatchframe",
                          image:
                            "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/giant-stone-hatchframe.webp",
                        },
                      ]}
                    />
                  </section>
                )}

                <section className="grid grid-cols-1 md:grid-cols-2 gap-3 my-12 border-t">
                  {dino.movement && (
                    <section className="space-y-2 col-span-1">
                      <h4 className="rw-label">Movement</h4>
                      <Table
                        className="border border-zinc-500"
                        columns={[
                          { field: "name", header: "", className: "capitalize text-center" },
                          {
                            field: "base",
                            header: "Base",
                            className: 'text-center',
                            valueFormatter: ({ value }) =>
                              value ? formatNumber(Number(value / 300)) : "-",
                          },
                          {
                            field: "sprint",
                            header: "Sprint",
                            className: 'text-center',
                            valueFormatter: ({ value }) =>
                              value ? formatNumber(Number(value / 300)) : "-",
                          },
                          {
                            field: "swim",
                            header: "Swim",
                            className: 'text-center',
                            valueFormatter: ({ value }) =>
                              value ? formatNumber(Number(value / 300)) : "-",
                          },
                          { field: "format", header: "", className: "text-center" },
                        ]}
                        rows={Object.entries(dino.movement["w"]).map(
                          ([k, m]: [
                            k: string,
                            m: { swim?: number; base?: number; fly?: number; sprint?: number }
                          ]) => ({ ...m, format: "Foundation/s", name: k })
                        )}
                      />
                    </section>
                  )}

                  {dino.can_destroy && (
                    <section className="space-y-2 col-span-1">
                      <h4 className="rw-label">Can Destroy</h4>
                      <Table
                        className="min-w-fit border border-zinc-500"
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
                            header: "Thatch",
                            render: canDestroy,
                          },
                          {
                            field: "w",
                            header: "Wooden",
                            render: canDestroy,
                          },
                          {
                            field: "a",
                            header: "Adobe",
                            render: canDestroy,
                          },
                          {
                            field: "s",
                            header: "Stone",
                            render: canDestroy,
                          },
                          {
                            field: "m",
                            header: "Metal",
                            render: canDestroy,
                          },
                          {
                            field: "g",
                            header: "Greenhouse",
                            render: canDestroy,
                          },
                          {
                            field: "tk",
                            header: "Tek",
                            render: canDestroy,
                          },
                        ]}
                      />
                    </section>
                  )}

                  {dino?.DinoStat &&
                    dino?.DinoStat.some((d) => d.type == "gather_efficiency") && (
                      <section className="space-y-2 col-span-1">
                        <h4 className="rw-label">Gather Efficiency</h4>
                        <Table
                          className="min-w-fit border border-zinc-500"
                          settings={{
                            pagination: {
                              enabled: true,
                              rowsPerPage: 5,
                              pageSizeOptions: [5, 10, 20, 50],
                            },
                          }}
                          rows={dino.DinoStat.filter(
                            (d) => d.type == "gather_efficiency"
                          ).sort((a, b) => b?.value - a?.value)}
                          columns={[
                            {
                              field: "Item",
                              header: "Name",
                              render: ({ value }) => (
                                <div className="inline-flex gap-2 justify-center items-center">
                                  <img
                                    src={`https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/${value.image}`}
                                    className="h-8 w-8 self-end"
                                    title={value.name}
                                  />
                                  <Link to={routes.item({ id: value?.id })}>
                                    {value.name}
                                  </Link>
                                </div>
                              ),
                            },
                            {
                              field: "value",
                              header: "Value",
                              sortable: true,
                              render: ({ value }) => {
                                const colors = [
                                  "bg-red-500",
                                  "bg-orange-500",
                                  "bg-yellow-500",
                                  "bg-lime-500",
                                  "bg-green-500",
                                ];

                                const getBarColor = (index) => {
                                  return Math.round(value) >= index + 1
                                    ? colors[index]
                                    : "bg-transparent";
                                };
                                return (
                                  <div
                                    className="flex h-2 w-32 flex-row divide-x divide-black rounded-full bg-gray-300"
                                    title={value}
                                  >
                                    {colors.map((_, i) => (
                                      <div
                                        key={`gather-efficiency-${i}`}
                                        className={clsx(
                                          `h-full w-1/5`,
                                          "first:rounded-l-full last:rounded-r-full",
                                          getBarColor(i)
                                        )}
                                      ></div>
                                    ))}
                                  </div>
                                );
                              },
                            },
                            {
                              field: "rank",
                              header: "rank",
                              sortable: true,
                              render: ({ value }) => {
                                return value <= 10 && <p>#{value}</p>;
                              },
                            },
                          ]}
                        />
                      </section>
                    )}

                  {dino.DinoStat.some((d) => d.type == "weight_reduction") && (
                    <section className="space-y-2 col-span-1">
                      <h4 className="rw-label">Weight Reduction</h4>
                      <Table
                        className="min-w-fit border border-zinc-500"
                        rows={dino.DinoStat.filter(
                          (d) => d.type == "weight_reduction"
                        ).sort((a, b) => b?.value - a?.value)}
                        columns={[
                          {
                            field: "Item",
                            header: "",
                            render: ({ value }) => (
                              <img
                                src={`https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/${value.image}`}
                                className="h-8 w-8 self-end"
                              />
                            ),
                          },
                          {
                            field: "Item",
                            header: "Name",
                            render: ({ value: { id, name } }) => {
                              return <Link to={routes.item({ id })}>{name}</Link>;
                            },
                          },
                          {
                            field: "value",
                            header: "Value",
                            render: ({ value }) => (
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
                            header: "Rank",
                            render: ({ value }) =>
                              value <= 10 && <p>#{value}</p>,
                          },
                        ]}
                      />
                    </section>
                  )}

                  {dino.DinoStat.some((d) => d.type == "drops") && (
                    <section className="space-y-2 col-span-1">
                      <h4 className="rw-label">Drops</h4>
                      <Table
                        className="min-w-fit border border-zinc-500"
                        rows={dino.DinoStat.filter((d) => d.type == "drops")}
                        columns={[
                          {
                            field: "Item",
                            header: "Name",
                            render: ({ value: { id, image, name } }) => (
                              <Link
                                to={routes.item({ id })}
                                className="flex flex-row items-center space-x-2"
                              >
                                <img
                                  src={`https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/${image}`}
                                  className="h-8 w-8 self-end"
                                />
                                <span>{name}</span>
                              </Link>
                            ),
                          },
                        ]}
                      />
                    </section>
                  )}

                  {dino.DinoStat.some((d) => d.type == "food") && (
                    <section className="space-y-2 col-span-1">
                      <h4 className="rw-label">Food</h4>
                      <Table
                        className="min-w-fit border border-zinc-500"
                        rows={dino.DinoStat.filter((d) => d.type == "food")}
                        columns={[
                          {
                            field: "Item",
                            header: "Name",
                            render: ({ value: { id, name, image } }) => (
                              <Link
                                to={routes.item({ id })}
                                className="flex flex-row items-center space-x-2"
                              >
                                <img
                                  src={`https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/${image}`}
                                  className="h-8 w-8 self-end"
                                />
                                <span>{name}</span>
                              </Link>
                            ),
                          },
                        ]}
                      />
                    </section>
                  )}

                  {baseStats && (
                    <Table
                      className="w-fit"
                      rows={baseStats}
                      toolbar={
                        !dino.type.includes("boss")
                          ? [
                            <button
                              type="button"
                              className="rw-button rw-button-gray"
                              onClick={genRandomStats}
                            >
                              Random
                            </button>,
                            <button
                              type="button"
                              className="rw-button rw-button-gray text-white"
                              onClick={() =>
                                setBaseStats(
                                  baseStats.map((s) => ({
                                    ...s,
                                    points:
                                      s.stat == "Torpidity"
                                        ? 0
                                        : Math.round(dinoLevel / 7),
                                  }))
                                )
                              }
                            >
                              Distribute Evenly
                            </button>,
                            <button
                              type="button"
                              className="rw-button rw-button-red"
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
                            </button>,
                            <p>
                              {dinoLevel -
                                baseStats
                                  .map((b) => b?.points)
                                  .reduce((a, b) => a + b, 0)}{" "}
                              points wasted
                            </p>,
                          ]
                          : []
                      }
                      columns={[
                        {
                          field: "stat",
                          header: "Stat",
                          className: "font-bold w-fit",
                          sortable: true,
                          render: ({ value }) =>
                            value && (
                              <div className="inline-flex items-center space-x-2 w-fit">
                                <img
                                  title={value}
                                  className="h-6 w-6"
                                  src={`https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/${value
                                    ?.replace(" ", "_")
                                    .toLowerCase()}.webp`}
                                  alt={value}
                                />
                                <p className="sm:block hidden">{value ?? 0}</p>
                              </div>
                            ),
                        },
                        {
                          field: "base",
                          header: "Base",
                          className: "w-fit",
                          numeric: true,
                          sortable: true,
                        },
                        {
                          field: "increasePerLevelWild",
                          header: "Increase per level (w)",
                          className: "w-fit",
                          numeric: true,
                          render: ({ value }) => value === null ? "" : `+${value}`,
                        },
                        {
                          field: "increasePerLevelTamed",
                          header: "Increase per level (t)",
                          numeric: true,
                          render: ({ value }) => value === null ? "" : `+${value}%`,
                        },
                        {
                          field: "total",
                          header: "Total",
                          className: "w-fit",
                          numeric: true,
                        },
                        !dino.type.includes("boss") && {
                          field: "base",
                          header: "",
                          render: ({ row }) => (
                            <nav className="flex flex-row items-center space-x-2">
                              <button
                                type="button"
                                disabled={
                                  baseStats.find((s) => s.stat === row.stat)?.points <=
                                  0 || row.stat === "Torpidity"
                                }
                                className="rw-button rw-button-red-outline h-8 w-8 rounded-full p-0 !text-xl"
                                onClick={() => onRemove(row.stat)}
                              >
                                -
                              </button>
                              <input
                                type="text"
                                disabled={true}
                                className="rw-input w-16 p-3 text-center"
                                value={
                                  baseStats.find((s) => s.stat === row.stat)?.points
                                }
                              />
                              <button
                                type="button"
                                disabled={
                                  baseStats
                                    .map((b) => b.points)
                                    .reduce((a, b) => a + b, 0) >= dinoLevel ||
                                  row.stat === "Torpidity"
                                }
                                className="rw-button rw-button-green-outline h-8 w-8 rounded-full p-0 !text-xl"
                                onClick={() => onAdd(row.stat)}
                              >
                                +
                              </button>
                            </nav>
                          ),
                        },
                      ]}
                    />
                  )}
                </section>
              </section>
            )
          }, dino.tamable && {
            title: 'Taming',
            icon: (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor" className="ml-2 w-5 h-5 pointer-events-none">
                <path d="M496.3 0c-1 0-2.115 .1567-3.115 .2817L364.6 26.03c-12.25 2.5-16.88 17.59-8 26.47l40.12 40.13L144.3 345L90.73 320.9c-7.375-2.375-15.5-.5022-20.1 4.1l-63.75 63.82c-10.75 10.75-6.376 29.12 8.126 33.99l55.62 18.5l18.5 55.62C91.22 506.8 99.47 512 107.8 512c5.125 0 10.37-1.918 14.5-6.041l63.62-63.74c5.502-5.5 7.376-13.62 5.001-20.1l-23.1-53.6l252.4-252.4l40.13 40.08C462.6 158.5 466.6 160 470.5 160c6.998 0 13.89-4.794 15.51-12.67l25.72-128.6C513.6 8.905 505.1 0 496.3 0zM112.7 470.3L94.97 417l-53.25-17.75l44.87-45l49.13 22l21.1 48.1L112.7 470.3zM460.6 111.3L400.7 51.5l74.75-15L460.6 111.3zM148.7 267.3C151.8 270.4 155.9 272 160 272s8.188-1.562 11.31-4.688c6.25-6.25 6.25-16.38 0-22.62L63.58 136.1c73.23-51.43 171.8-54.54 247.9-6.502c7.375 4.688 17.38 2.516 22.06-4.984C338.3 118 336 108.1 328.5 103.4c-88.5-55.89-203.9-51.54-288.1 10.46L27.26 100.7C21.01 94.5 10.94 94.44 4.688 100.7S-1.533 117 4.717 123.3L148.7 267.3zM408.6 183.5c-4.781-7.5-14.75-9.672-22.06-4.984c-7.5 4.719-9.719 14.61-5 22.08c48.06 76.04 44.97 174.6-6.494 247.9l-107.7-107.7c-6.25-6.25-16.38-6.25-22.62 0s-6.25 16.38 0 22.62l144 144C391.8 510.4 395.9 512 400 512s8.188-1.562 11.31-4.688c6.25-6.25 6.25-16.38 0-22.62l-13.17-13.17C460.1 387.3 464.5 271.1 408.6 183.5z" />
              </svg>
            ),
            content: (
              <section>
                <p className="my-1 text-sm leading-relaxed">{dino?.taming_notice}</p>

                {/* Tek Stryder */}
                {dino.id === "a5a9f2bb-7d89-4672-9d1c-567d035e23a7" && (
                  <p className="my-1 text-sm leading-relaxed">
                    <b className="underline">
                      {Math.floor(1 + 48 * (dinoLevel / 150))}
                    </b>{" "}
                    Missions needed for taming a level {dinoLevel} stryder
                  </p>
                )}
                <Form<TamingCalculatorForm> onSubmit={calculateDino}>
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
                    defaultValue={dinoLevel}
                  />

                  <FieldError name="level" className="rw-field-error" />

                  <Label
                    name="sec_between_hits"
                    className="rw-label"
                    errorClassName="rw-label rw-label-error"
                  >
                    Seconds between hits
                  </Label>

                  <NumberField
                    name="sec_between_hits"
                    className="rw-input"
                    errorClassName="rw-input rw-input-error"
                    validation={{
                      valueAsNumber: true,
                      min: 1,
                      max: 500,
                    }}
                    defaultValue={5}
                  />

                  <FieldError name="sec_between_hits" className="rw-field-error" />

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

                  <CheckboxGroup
                    className="!mt-3 animate-fade-in"
                    name="foodSelect"
                    form={true}
                    defaultValue={[
                      selectedFood
                        ? selectedFood.toString()
                        : dino?.DinoStat.filter((f) => f.type === "food") &&
                        dino?.DinoStat.filter(
                          (f) => f.type === "food"
                        )[0]?.Item.id.toString(),
                    ]}
                    validation={{
                      single: true,
                    }}
                    options={tamingFood.map(({ id, name, max, image }) => ({
                      value: id,
                      label: `${name} (${max})`,
                      image: `https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/${image}`,
                    }))}
                  />

                  <Submit className="rw-button rw-button-green my-3">
                    Calculate
                  </Submit>

                  {tameData && (
                    <section>
                      <p className="rw-label">
                        With selected food:
                      </p>
                      <div className="rounded-t-md border border-zinc-500 bg-zinc-300 p-4 dark:bg-zinc-600 dark:text-white">
                        <ol className="w-full items-center justify-center space-y-4 sm:flex sm:space-x-8 sm:space-y-0">
                          {[
                            {
                              name: "Current",
                              sub: `Lvl ${dinoLevel}`,
                              icon: (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 448 512"
                                >
                                  <path d="M432 144h-85.73l21.32-92.4c1.969-8.609-3.375-17.2-12-19.19c-8.688-2.031-17.19 3.39-19.19 11.1l-22.98 99.59H186.3l21.32-92.4c1.969-8.609-3.375-17.2-12-19.19c-8.719-2.031-17.19 3.39-19.19 11.1L153.4 144H48c-8.844 0-16 7.144-16 15.99C32 168.8 39.16 176 48 176h98.04L109.1 336H16c-8.844 0-16 7.151-16 15.99s7.156 16 16 16h85.73L80.41 460.4c-1.969 8.609 3.375 17.2 12 19.19C93.63 479.9 94.81 480 96 480c7.281 0 13.88-4.1 15.59-12.41l22.98-99.59h127.2l-21.32 92.4c-1.969 8.609 3.375 17.2 12 19.19C253.6 479.9 254.8 480 256 480c7.281 0 13.88-4.1 15.59-12.41l22.98-99.59H400c8.844 0 16-7.161 16-16s-7.156-15.99-16-15.99h-98.04l36.92-159.1H432c8.844 0 16-7.168 16-16.01C448 151.2 440.8 144 432 144zM269.1 336H141.1L178.9 176h127.2L269.1 336z" />
                                </svg>
                              ),
                            },
                            {
                              name: "Taming Eff.",
                              sub: `${(tameData.effectiveness
                                ? tameData.effectiveness
                                : 0
                              ).toFixed()}%`,
                              icon: (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 384 512"
                                >
                                  <path d="M379.3 68.69c-6.25-6.25-16.38-6.25-22.62 0l-352 352c-6.25 6.25-6.25 16.38 0 22.62C7.813 446.4 11.91 448 16 448s8.188-1.562 11.31-4.688l352-352C385.6 85.06 385.6 74.94 379.3 68.69zM64 192c35.35 0 64-28.65 64-64S99.35 64.01 64 64.01c-35.35 0-64 28.65-64 63.1S28.65 192 64 192zM64 96c17.64 0 32 14.36 32 32S81.64 160 64 160S32 145.6 32 128S46.36 96 64 96zM320 320c-35.35 0-64 28.65-64 64s28.65 64 64 64c35.35 0 64-28.65 64-64S355.3 320 320 320zM320 416c-17.64 0-32-14.36-32-32s14.36-32 32-32s32 14.36 32 32S337.6 416 320 416z" />
                                </svg>
                              ),
                            },
                            {
                              name: "With Bonus",
                              sub: `Lvl ${dinoLevel + tameData.levelsGained}`,
                              icon: (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 512 512"
                                >
                                  <path d="M466.5 83.69l-192-80.01C268.6 1.188 262.3 0 256.1 0S243.5 1.188 237.6 3.688l-192 80.01C27.72 91.07 16 108.6 16 127.1C16 385.4 205.4 512 255.1 512C305.2 512 496 387.3 496 127.1C496 108.6 484.3 91.07 466.5 83.69zM463.9 128.3c0 225.3-166.2 351.7-207.8 351.7C213.3 479.1 48 352.2 48 128c0-6.5 3.875-12.25 9.75-14.75l192-80c1.973-.8275 4.109-1.266 6.258-1.266c2.071 0 4.154 .4072 6.117 1.266l192 80C463.3 117.1 463.9 125.8 463.9 128.3zM336 240H271.1v-64C271.1 167.2 264.8 160 256 160S240 167.2 240 176v64H175.1C167.2 240 160 247.2 160 256s7.154 16 15.1 16H240v64c0 8.836 7.154 16 15.1 16c8.838 0 15.1-7.16 15.1-16v-64h64C344.8 272 352 264.8 352 256S344.8 240 336 240z" />
                                </svg>
                              ),
                            },
                            {
                              name: "Max after Taming",
                              sub: `Lvl ${dinoLevel +
                                tameData.levelsGained +
                                (dinoXVariant && dino.x_variant ? 88 : 73)
                                }`,
                              icon: (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 576 512"
                                >
                                  <path d="M477.4 304.2l-131 21.75C336.5 303.6 314.1 288 288 288c-35.38 0-64 28.62-64 64s28.62 64 64 64c33.38 0 60.5-25.75 63.38-58.38l131.3-21.87c8.75-1.375 14.62-9.625 13.12-18.38C494.4 308.6 485.9 302.8 477.4 304.2zM288 384c-17.62 0-32-14.38-32-32s14.38-31.1 32-31.1S320 334.4 320 352S305.6 384 288 384zM288 32c-159 0-288 129-288 288c0 52.75 14.25 102.3 39 144.8c5.625 9.625 16.38 15.25 27.5 15.25h443c11.12 0 21.88-5.625 27.5-15.25C561.8 422.3 576 372.8 576 320C576 161 447 32 288 32zM509.5 448H66.75C44 409.1 32 365.2 32 320c0-141.1 114.9-256 256-256s256 114.9 256 256C544 365.2 532 409.8 509.5 448z" />
                                </svg>
                              ),
                            },
                          ].map(({ name, sub, icon }, i) => (
                            <li
                              key={`taming-stage-${i}`}
                              className="[&>*]:fill-secondary-button [&>*]:border-secondary-button flex items-center space-x-2.5 [&>*]:dark:border-white [&>*]:dark:fill-white [&:last-of-type>svg]:hidden"
                            >
                              <span className="flex md:h-12 md:w-12 w-6 h-6 shrink-0 items-center justify-center rounded-full border p-1 md:p-3">
                                {icon}
                              </span>
                              <span>
                                <h3 className="font-medium leading-tight">{name}</h3>
                                <p className="space-x-1 text-sm">
                                  <span>{sub.replace(/[0-9]/g, "")}</span>
                                  <Counter
                                    className="inline-block"
                                    startNumber={0}
                                    endNumber={parseInt(sub.replace(/\D/g, ""))}
                                    duration={500}
                                  />
                                </p>
                              </span>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6 transform rotate-90 md:rotate-0"
                                viewBox="0 0 256 512"
                              >
                                <path d="M219.9 266.7L75.89 426.7c-5.906 6.562-16.03 7.094-22.59 1.188c-6.918-6.271-6.783-16.39-1.188-22.62L186.5 256L52.11 106.7C46.23 100.1 46.75 90.04 53.29 84.1C59.86 78.2 69.98 78.73 75.89 85.29l144 159.1C225.4 251.4 225.4 260.6 219.9 266.7z" />
                              </svg>
                            </li>
                          ))}
                        </ol>
                      </div>

                      <div className="rounded-b-md border border-t-0 border-zinc-500 bg-zinc-200 p-4 dark:bg-zinc-700 dark:text-white">
                        <div className="relative my-3 grid grid-cols-5 gap-4 text-center">
                          {!!tameData.totalTorpor && !!tameData.torporDepletionPS && (
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
                          )}
                          {Object.entries(tameData)
                            .filter(([k, _]) =>
                              [
                                "NarcoberryMin",
                                "Bio-ToxinMin",
                                "NarcoticMin",
                                "Ascerbic-MushroomMin",
                              ].includes(k)
                            )
                            .map(([name, amount]) => {
                              const newName = name.replace("Min", "").toLowerCase();
                              return (
                                <div
                                  className="flex flex-col items-center"
                                  key={`narcotic-${name}`}
                                >
                                  <img
                                    src={`https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/${newName}.webp`}
                                    alt="food"
                                    className="w-8 sm:w-12"
                                  />
                                  <p>{amount.toString()}</p>
                                  <p className="text-xs capitalize">
                                    {newName.replace("-", " ")}
                                  </p>
                                </div>
                              )
                            })}
                        </div>
                      </div>

                      {calculateWeapons && (
                        <>
                          <h4 className="rw-label">Knock Out</h4>
                          <div className="max-w-screen relative flex flex-row gap-3 overflow-x-auto rounded-md text-center">
                            {calculateWeapons.sort((a, b) => b.isPossible ? 1 : 0 - (a.isPossible ? 1 : 0)).map(
                              ({
                                id,
                                name,
                                visible,
                                image,
                                isPossible,
                                chanceOfDeath,
                                hits,
                                hitboxes,
                                userDamage,
                                chanceOfDeathHigh,
                              }) => (
                                <div
                                  key={`weapon-${id}`}
                                  className={clsx(
                                    `animate-fade-in flex min-h-full min-w-[8rem] flex-1 flex-col items-center justify-between space-y-1 rounded bg-zinc-200 p-3 dark:bg-zinc-700 border border-zinc-500`,
                                    {
                                      "shadow":
                                        isPossible && chanceOfDeath < 99,
                                      "rw-img-disable text-gray-500":
                                        !isPossible || chanceOfDeath >= 99,
                                    }
                                  )}
                                >
                                  <img
                                    className="h-16 w-16"
                                    src={`https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/${image}`}
                                  />
                                  <Link
                                    to={routes.item({ id: id.toString() })}
                                    className={clsx("w-full", {
                                      "pointer-events-none": !visible
                                    })}
                                  >
                                    {name}
                                  </Link>
                                  {isPossible ? (
                                    <Counter
                                      startNumber={0}
                                      endNumber={hits}
                                      duration={3000 / hits}
                                    />
                                  ) : (
                                    <p>Not Possible</p>
                                  )}
                                  {chanceOfDeath > 0 && isPossible && (
                                    <p
                                      className={clsx("text-xs", {
                                        "text-red-300": chanceOfDeathHigh,
                                      })}
                                    >
                                      {chanceOfDeath}% chance of death
                                    </p>
                                  )}
                                  {hitboxes.length > 0 && (
                                    <span className="rw-badge rw-badge-gray">
                                      {hitboxes.map(({ name, multiplier }) => (
                                        <span
                                          key={`hitbox-${name}`}
                                        >{`${name} - ${multiplier}x`}</span>
                                      ))}
                                    </span>
                                  )}

                                  <div className="relative">
                                    <input
                                      type="text"
                                      className="rw-input w-24 rw-input-small !pr-10"
                                      placeholder="Percent"
                                      defaultValue={userDamage}
                                      disabled={!isPossible || chanceOfDeath >= 99}
                                      onChange={debounce((e) => {
                                        setWeaponDamage({
                                          ...weaponDamage,
                                          [id]: e.target.value,
                                        });
                                      }, 300)}
                                    />
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none">
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 text-gray-500 dark:text-gray-400" viewBox="0 0 384 512" fill="currentColor">
                                        <path d="M379.3 68.69c-6.25-6.25-16.38-6.25-22.62 0l-352 352c-6.25 6.25-6.25 16.38 0 22.62C7.813 446.4 11.91 448 16 448s8.188-1.562 11.31-4.688l352-352C385.6 85.06 385.6 74.94 379.3 68.69zM64 192c35.35 0 64-28.65 64-64S99.35 64.01 64 64.01c-35.35 0-64 28.65-64 63.1S28.65 192 64 192zM64 96c17.64 0 32 14.36 32 32S81.64 160 64 160S32 145.6 32 128S46.36 96 64 96zM320 320c-35.35 0-64 28.65-64 64s28.65 64 64 64c35.35 0 64-28.65 64-64S355.3 320 320 320zM320 416c-17.64 0-32-14.36-32-32s14.36-32 32-32s32 14.36 32 32S337.6 416 320 416z" />
                                      </svg>
                                    </div>
                                  </div>
                                </div>
                              )
                            )}
                          </div>
                        </>
                      )}

                      <section className="bg-gray-200 my-3 p-4 dark:bg-zinc-600 rounded-lg border border-zinc-500">
                        <iframe width="100%" seamless
                          src={`https://www.youtube.com/results?search_query=ark+${dino.name}+taming`}>
                        </iframe>
                      </section>
                    </section>
                  )}
                </Form>
              </section>
            )
          }, {
            title: 'Breeding / Reproduction',
            icon: (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor" className="ml-2 w-5 h-5 pointer-events-none">
                  <path d="M446.8 41.89c-1.621-3.918-4.742-7.039-8.66-8.66c-1.955-.8086-4.047-1.23-6.129-1.23L304 32C295.2 32 288 39.16 288 48S295.2 64 304 64h89.38l-104.8 104.8C258.1 143.3 218.8 128 176 128C78.8 128 0 206.8 0 304S78.8 480 176 480S352 401.2 352 304c0-42.84-15.34-82.08-40.78-112.6L416 86.63V176C416 184.8 423.2 192 432 192S448 184.8 448 176v-128C448 45.92 447.6 43.85 446.8 41.89zM320 304c0 79.4-64.6 144-144 144S32 383.4 32 304S96.6 160 176 160S320 224.6 320 304z" />
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor" className="w-5 h-5 pointer-events-none">
                  <path d="M368 176c0-97.2-78.8-176-176-176c-97.2 0-176 78.8-176 176c0 91.8 70.31 167.1 160 175.2V400h-64C103.2 400 96 407.2 96 416s7.156 16 16 16h64v64c0 8.844 7.156 16 16 16s16-7.156 16-16v-64h64c8.844 0 16-7.156 16-16s-7.156-16-16-16h-64v-48.81C297.7 343.1 368 267.8 368 176zM48 176C48 96.6 112.6 32 192 32s144 64.6 144 144S271.4 320 192 320S48 255.4 48 176z" />
                </svg>
              </>
            ),
            content: (
              <section>
                {!!dino.maturation_time &&
                  dino.maturation_time != 0 &&
                  dino.incubation_time && (
                    <section className="col-span-2 rounded-md">
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

                      <ol className="w-full items-center justify-center space-y-4 sm:flex sm:space-x-8 sm:space-y-0">
                        {[
                          {
                            name: "Incubation",
                            time: dino.incubation_time / settings.hatchMultiplier,
                          },
                          { name: "Baby", time: (dino.maturation_time * 1) / 10 },
                          {
                            name: "Juvenile",
                            time:
                              (dino?.maturation_time * 1) / 2 -
                              (dino?.maturation_time * 1) / 10,
                          },
                          {
                            name: "Adolescent",
                            time: (dino?.maturation_time * settings.matureMultiplier) / 2,
                          },
                          {
                            name: "Total",
                            time: dino?.maturation_time * settings.matureMultiplier,
                          },
                        ].map(({ name, time }, i) => (
                          <li
                            key={`breeding-stage-${i}`}
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
                        ))}
                      </ol>
                    </section>
                  )}

                {dino.egg_max != null &&
                  dino.egg_min != null &&
                  dino.egg_max > 0 &&
                  dino.egg_min > 0 && (
                    <section className="">
                      <img
                        src={`https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/dodo-egg.webp`}
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
              </section>
            )
          }, dino.DinoStat.some((d) => d.type == "bossrecipe" || d.type == "saddle") && {
            title: "Recipes",
            content: (
              <section className="animate-fade-in">
                {dino?.DinoStat.some((d) => d.type == "saddle") && (
                  <>
                    <h4 className="rw-label">Saddle Crafting Recipe</h4>
                    {dino.DinoStat.filter((d) => d.type === "saddle").map(
                      ({
                        Item: {
                          id: itemid,
                          name,
                          image,
                          ItemRecipe_ItemRecipe_crafted_item_idToItem,
                        },
                      }) => (
                        <div className="flex h-64 gap-4 overflow-hidden rounded-lg border border-zinc-500 bg-gray-200 p-4 dark:bg-zinc-600">
                          {ItemRecipe_ItemRecipe_crafted_item_idToItem.map(
                            (
                              {
                                id,
                                Item_ItemRecipe_crafting_station_idToItem,
                                ItemRecipeItem,
                                yields,
                              },
                              i
                            ) => (
                              <div
                                className={clsx(
                                  "flex h-full flex-row items-center transition-all duration-500 ease-in-out",
                                  {
                                    "flex-grow": activeTab === i,
                                    "flex-grow-0": activeTab !== i,
                                  }
                                )}
                                key={`recipe-${id}`}
                                onClick={() => setActiveTab(i)}
                              >
                                <div className="relative flex h-full flex-1 flex-row space-x-4 overflow-hidden rounded-lg bg-zinc-300 p-4 dark:bg-zinc-700">
                                  <div className="animate-fade-in flex h-full items-center justify-center transition-colors">
                                    <img
                                      src={`https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/${Item_ItemRecipe_crafting_station_idToItem.image}`}
                                      className="h-16 w-16"
                                    />
                                  </div>

                                  <div
                                    className={clsx(
                                      "flex flex-row items-center gap-2 border-l border-zinc-600 px-4 dark:border-zinc-200",
                                      {
                                        hidden: activeTab !== i,
                                        block: activeTab === i,
                                      }
                                    )}
                                  >
                                    <div className="flex flex-row flex-wrap gap-2">
                                      {ItemRecipeItem.map(({ Item, amount }, i) => (
                                        <Link
                                          to={routes.item({ id: Item.id.toString() })}
                                          className="animate-fade-in relative rounded-lg border border-zinc-500 p-2 text-center"
                                          title={Item.name}
                                          key={`recipe-${Item.id}`}
                                        >
                                          <img
                                            className="h-10 w-10"
                                            src={`https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/${Item.image}`}
                                            alt={Item.name}
                                          />
                                          <div className="absolute -bottom-1  inline-flex h-6 w-6 items-center justify-center rounded-full bg-transparent text-xs font-bold">
                                            {amount}
                                          </div>
                                        </Link>
                                      ))}
                                    </div>

                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      viewBox="0 0 448 512"
                                      fill="currentColor"
                                      className="h-12 w-12"
                                    >
                                      <path d="M427.8 266.8l-160 176C264.7 446.3 260.3 448 256 448c-3.844 0-7.703-1.375-10.77-4.156c-6.531-5.938-7.016-16.06-1.078-22.59L379.8 272H16c-8.844 0-15.1-7.155-15.1-15.1S7.156 240 16 240h363.8l-135.7-149.3c-5.938-6.531-5.453-16.66 1.078-22.59c6.547-5.906 16.66-5.469 22.61 1.094l160 176C433.4 251.3 433.4 260.7 427.8 266.8z" />
                                    </svg>

                                    <Link
                                      to={routes.item({ id: itemid.toString() })}
                                      className="animate-fade-in relative rounded-lg border border-zinc-500 p-2 text-center"
                                      title={name}
                                      key={`recipe-${id}`}
                                    >
                                      <img
                                        className="h-10 w-10"
                                        src={`https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/${image}`}
                                        alt={name}
                                      />
                                      <div className="absolute -bottom-1 -right-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-transparent text-xs font-bold">
                                        {yields}
                                      </div>
                                    </Link>
                                  </div>
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      )
                    )}
                  </>
                )}

                {dino.DinoStat.some((d) => d.type == "bossrecipe") && (
                  <>
                    <h4 className="rw-label">Recipe for summoning boss</h4>
                    <Table
                      className="min-w-fit"
                      settings={{
                        header: false,
                      }}
                      rows={dino.DinoStat.filter((d) => d.type == "bossrecipe")}
                      columns={[
                        {
                          field: "Item",
                          header: "",
                          render: ({ value: { id, name, image } }) => (
                            <Link
                              to={routes.item({ id })}
                              className="mr-3 flex flex-row items-center space-x-2"
                            >
                              <img
                                src={`https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/${image}`}
                                className="h-8 w-8 self-end"
                              />
                              <span>{name}</span>
                            </Link>
                          ),
                        },
                        {
                          field: "value",
                          header: "Amount",
                        },
                      ]}
                    />
                  </>
                )}
              </section>
            )
          }
        ]}
        />
      </section>

      <nav className="rw-button-group col-span-2">
        {currentUser &&
          currentUser?.permissions.some(
            (p: permission) => p === "gamedata_update"
          ) && (
            <Link
              to={routes.editDino({ id: dino.id })}
              className="rw-button rw-button-blue"
            >
              Edit
            </Link>
          )}
        {currentUser &&
          currentUser?.permissions.some(
            (p: permission) => p === "gamedata_delete"
          ) && (
            <button
              type="button"
              className="rw-button rw-button-red"
              onClick={() => onDeleteClick(dino.id)}
            >
              Delete
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
                className="rw-button-icon-end"
              >
                <path d="M432 64h-96l-33.63-44.75C293.4 7.125 279.1 0 264 0h-80c-15.1 0-29.4 7.125-38.4 19.25L112 64H16C7.201 64 0 71.2 0 80c0 8.799 7.201 16 16 16h416c8.801 0 16-7.201 16-16 0-8.8-7.2-16-16-16zm-280 0l19.25-25.62C174.3 34.38 179 32 184 32h80c5 0 9.75 2.375 12.75 6.375L296 64H152zm248 64c-8.8 0-16 7.2-16 16v288c0 26.47-21.53 48-48 48H112c-26.47 0-48-21.5-48-48V144c0-8.8-7.16-16-16-16s-16 7.2-16 16v288c0 44.1 35.89 80 80 80h224c44.11 0 80-35.89 80-80V144c0-8.8-7.2-16-16-16zM144 416V192c0-8.844-7.156-16-16-16s-16 7.2-16 16v224c0 8.844 7.156 16 16 16s16-7.2 16-16zm96 0V192c0-8.844-7.156-16-16-16s-16 7.2-16 16v224c0 8.844 7.156 16 16 16s16-7.2 16-16zm96 0V192c0-8.844-7.156-16-16-16s-16 7.2-16 16v224c0 8.844 7.156 16 16 16s16-7.2 16-16z" />
              </svg>
            </button>
          )}
      </nav>
    </article>
  );
};

export default Dino;
