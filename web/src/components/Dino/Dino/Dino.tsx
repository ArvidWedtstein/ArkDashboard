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
} from "src/lib/formatters";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useTransition,
} from "react";

import type { DeleteDinoMutationVariables, FindDinoById } from "types/graphql";
import clsx from "clsx";
import Table from "src/components/Util/Table/Table";
import CheckboxGroup from "src/components/Util/CheckSelect/CheckboxGroup";
import Counter from "src/components/Util/Counter/Counter";
import ToggleButton from "src/components/Util/ToggleButton/ToggleButton";
import { useAuth } from "src/auth";

const DELETE_DINO_MUTATION = gql`
  mutation DeleteDinoMutation($id: String!) {
    deleteDino(id: $id) {
      id
    }
  }
`;

type TamingCalculatorForm = {
  level: number;
  x_variant?: boolean | null;
  foodSelect: string;
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
  const [dinoLevel, setDinoLevel] = useState(100); // TODO: remove hardcode
  const [dinoXVariant, setDinoXVariant] = useState(false); // TODO: remove hardcode
  const [weaponDamage, setWeaponDamage] = useState({});

  const [isPending, startTransition] = useTransition();
  const calcMaturationPercent = useCallback(() => {
    let timeElapsed = maturation * dino?.maturation_time * 1;
    return timeElapsed / 100;
  }, [maturation, setMaturation]);

  const [baseStats, setBaseStats] = useState(
    dino?.base_points &&
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
      base: (typeof value === "object" ? value.b || 0 : value) || 0,
      increasePerLevelWild: value.w || 0,
      increasePerLevelTamed: value.t || 0,
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
  const genRandomStats = () => {
    // scramble level

    let i =
      dinoLevel -
      baseStats.map((b) => b.points).reduce((a, b) => a + b, 0);

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
            w.stats as { id: number; value: number | string[]; duration?: number }[]
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
      startTransition(() =>
        setSelectedFood(
          dino.DinoStat.filter((f) => f.type === "food") &&
          dino?.DinoStat.filter((f) => f.type === "food")[0]?.Item.id
        )
      );
  }, []);

  const calculateDino = (e) => {
    const { level, x_variant, foodSelect } = e;
    if (!level) return null;

    setDinoLevel(parseInt(level));
    setDinoXVariant(x_variant);
    setSelectedFood(foodSelect);

    if (!foodSelect)
      startTransition(() =>
        setSelectedFood(
          dino.DinoStat.filter((f) => f.type === "food") &&
          dino.DinoStat.filter((f) => f.type === "food")[0]?.Item.id
        )
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
        const baseStat = dino?.base_stats ? (dino.base_stats as any)?.f : null;
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
    // console.log(tamingFood)
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
        numNeeded = Math.ceil(
          affinityLeft /
          food.affinity /
          tamingMultiplier
        );
        neededValues[food.id] = numNeeded;
        neededValuesSecs[food.id] = Math.ceil(
          (numNeeded * food.food) /
          foodConsumption +
          totalSecs
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

        const { b: baseHealth, w: incPerLevel } =
          (dino?.base_stats as BaseStats).h || {};

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
      <section className="col-span-2 grid grid-cols-1 auto-cols-auto md:grid-cols-2">
        <img
          src={`https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Dino/${dino.image}`}
          alt={dino.name}
          className="w-fit max-h-48"
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

      {!!dino.maturation_time &&
        dino.maturation_time != 0 &&
        (dino.incubation_time || dino.base_points) && (
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

      {dino.egg_min &&
        dino.egg_max &&
        dino.egg_max !== 0 &&
        dino.egg_min !== 0 && (
          <section className="col-span-2">
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

      {dino?.DinoStat.some((d) => d.type == "immobilized_by") && (
        <section className="col-span-2">
          <h3 className="font-medium leading-tight">Immobilized by</h3>

          <CheckboxGroup
            defaultValue={dino.DinoStat.filter(
              (d) => d.type == "immobilized_by"
            ).map((item) => item?.Item.id.toString())}
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
        <section className="col-span-2">
          <h3 className="font-medium leading-tight">Carryable by</h3>
          <CheckboxGroup
            defaultValue={dino?.carryable_by}
            form={false}
            options={[
              {
                value: "e85015a5-8694-44e6-81d3-9e1fdd06061d",
                label: "Pteranodon",
                image:
                  "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/creature_pteranodon.png",
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
                image:
                  "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/creature_tapejara.png",
              },
              {
                value: "da86d88a-3171-4fc9-b96d-79e8f59f1601",
                label: "Griffin",
                image:
                  "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/creature_griffin.png",
              },
              {
                value: "147922ce-912d-4ab6-b4b6-712a42a9d939",
                label: "Desmodus",
                image:
                  "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/creature_desmodus.png",
              },
              {
                value: "28971d02-8375-4bf5-af20-6acb20bf7a76",
                label: "Argentavis",
                image:
                  "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/creature_argentavis.png",
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
                image:
                  "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/creature_wyvern.png",
              },
              {
                value: "2b938227-61c2-4230-b7da-5d4d55f639ae",
                label: "Quetzal",
                image:
                  "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/creature_quetzal.png",
              },
              {
                value: "b1d6f790-d15c-4813-a6c8-9e6f62fafb52",
                label: "Tusoteuthis",
                image:
                  "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/creature_tusoteuthis.png",
              },
              {
                value: "d670e948-055e-45e1-adf3-e56d63236238",
                label: "Karkinos",
                image:
                  "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/creature_karkinos.png",
              },
              {
                value: "52156470-6075-487b-a042-2f1d0d88536c",
                label: "Kaprosuchus",
                image:
                  "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/creature_kaprosuchus.png",
              },
              {
                value: "f723f861-0aa3-40b5-b2d4-6c48ec0ca683",
                label: "Procoptodon",
                image:
                  "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/creature_procoptodon.png",
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

      {dino?.DinoStat.some((d) => d.type == "fits_through") && (
        <section className="col-span-2">
          <h3 className="font-medium leading-tight">Fits Through</h3>
          <CheckboxGroup
            defaultValue={dino.DinoStat.filter(
              (d) => d.type == "fits_through"
            ).map((item) => item?.Item.id.toString())}
            form={false}
            options={[
              {
                value: "322",
                label: "Doorframe",
                image:
                  "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/stone-doorframe.png",
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
                image:
                  "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/stone-hatchframe.png",
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
        <section className="col-span-2">
          <h3 className="font-medium leading-tight">Can Destroy</h3>
          <Table
            className="max-w-fit"
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
                field: "g",
                header: "Greenhouse",
                render: canDestroy,
              },
              {
                field: "w",
                header: "Wood",
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
          <section className="col-span-2 space-y-2 md:col-span-1">
            <h4>Gather Efficiency</h4>
            <Table
              className="min-w-fit"
              settings={{
                pagination: {
                  enabled: true,
                  rowsPerPage: 5,
                  pageSizeOptions: [5, 10, 20, 50],
                },
              }}
              rows={dino.DinoStat.filter(
                (d) => d.type == "gather_efficiency"
              ).sort((a, b) => b.value - a.value)}
              columns={[
                {
                  field: "Item",
                  header: "",
                  render: ({ value }) => (
                    <img
                      src={`https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/${value.image}`}
                      className="h-8 w-8 self-end"
                      title={value.name}
                    />
                  ),
                },
                {
                  field: "Item",
                  header: "Name",
                  render: ({ value }) => (
                    <Link to={routes.item({ id: value?.id })}>
                      {value.name}
                    </Link>
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
        <section className="col-span-2 space-y-2 md:col-span-1">
          <h4>Weight Reduction</h4>
          <Table
            className="min-w-fit"
            rows={dino.DinoStat.filter(
              (d) => d.type == "weight_reduction"
            ).sort((a, b) => b.value - a.value)}
            columns={[
              {
                field: "Item",
                header: "",
                render: ({ value }) => (
                  <img
                    src={`https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/${value.image}`}
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
                render: ({ value }) => {
                  return value <= 10 && <p>#{value}</p>;
                },
              },
            ]}
          />
        </section>
      )}

      <section className="col-span-2 flex flex-wrap gap-3 md:col-span-1">
        {dino.DinoStat.some((d) => d.type == "drops") && (
          <div className="space-y-2">
            <h4>Drops</h4>
            <Table
              className="min-w-fit"
              settings={{
                header: false,
                select: false,
              }}
              rows={dino.DinoStat.filter((d) => d.type == "drops")}
              columns={[
                {
                  field: "Item",
                  header: "",
                  render: ({ value: { id, image, name } }) => (
                    <div className="mr-3 flex flex-row items-center space-x-2">
                      <img
                        src={`https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/${image}`}
                        className="h-8 w-8 self-start"
                      />
                      <Link to={routes.item({ id })}>{name}</Link>
                    </div>
                  ),
                },
              ]}
            />
          </div>
        )}

        {dino.DinoStat.some((d) => d.type == "food") && (
          <div className="space-y-2">
            <h4>Food</h4>
            <Table
              className="min-w-fit"
              settings={{
                header: false,
              }}
              rows={dino.DinoStat.filter((d) => d.type == "food")}
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
                        src={`https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/${image}`}
                        className="h-8 w-8 self-end"
                      />
                      <span>{name}</span>
                    </Link>
                  ),
                },
              ]}
            />
          </div>
        )}
      </section>

      <section className="col-span-2 border-t border-gray-700 pt-3 dark:border-white">
        <h3 className="text-xl font-medium leading-tight">Taming</h3>
        <p>{dino?.taming_notice}</p>
        <div>
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

            <CheckboxGroup
              className="!mt-3"
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
              options={tamingFood.map((food) => ({
                value: food.id,
                label: `${food.name} (${food.max})`,
                image: `https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/${food.image}`,
              }))}
            />

            <div className="rw-button-group justify-start">
              <Submit
                className="rw-button rw-button-green !ml-0"
                disabled={false}
              >
                Calculate
              </Submit>
            </div>
          </Form>
        </div>
        <section
          style={{
            opacity: isPending ? 0.5 : 1,
          }}
        >
          <>
            {tameData && (
              <>
                <p className="my-3 text-center text-base dark:text-gray-200">
                  With selected food:
                </p>
                <section className="mt-3 rounded-t-md bg-zinc-300 p-4 dark:bg-zinc-600 dark:text-white">
                  <ol className="w-full items-center justify-center space-y-4 sm:flex sm:space-x-8 sm:space-y-0">
                    {[
                      {
                        name: "Current",
                        sub: `Lvl ${dinoLevel}`,
                        icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M432 144h-85.73l21.32-92.4c1.969-8.609-3.375-17.2-12-19.19c-8.688-2.031-17.19 3.39-19.19 11.1l-22.98 99.59H186.3l21.32-92.4c1.969-8.609-3.375-17.2-12-19.19c-8.719-2.031-17.19 3.39-19.19 11.1L153.4 144H48c-8.844 0-16 7.144-16 15.99C32 168.8 39.16 176 48 176h98.04L109.1 336H16c-8.844 0-16 7.151-16 15.99s7.156 16 16 16h85.73L80.41 460.4c-1.969 8.609 3.375 17.2 12 19.19C93.63 479.9 94.81 480 96 480c7.281 0 13.88-4.1 15.59-12.41l22.98-99.59h127.2l-21.32 92.4c-1.969 8.609 3.375 17.2 12 19.19C253.6 479.9 254.8 480 256 480c7.281 0 13.88-4.1 15.59-12.41l22.98-99.59H400c8.844 0 16-7.161 16-16s-7.156-15.99-16-15.99h-98.04l36.92-159.1H432c8.844 0 16-7.168 16-16.01C448 151.2 440.8 144 432 144zM269.1 336H141.1L178.9 176h127.2L269.1 336z" /></svg>
                      },
                      {
                        name: "Taming Eff.", sub: `${(tameData.effectiveness
                          ? tameData.effectiveness
                          : 0
                        ).toFixed()}%`,
                        icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M379.3 68.69c-6.25-6.25-16.38-6.25-22.62 0l-352 352c-6.25 6.25-6.25 16.38 0 22.62C7.813 446.4 11.91 448 16 448s8.188-1.562 11.31-4.688l352-352C385.6 85.06 385.6 74.94 379.3 68.69zM64 192c35.35 0 64-28.65 64-64S99.35 64.01 64 64.01c-35.35 0-64 28.65-64 63.1S28.65 192 64 192zM64 96c17.64 0 32 14.36 32 32S81.64 160 64 160S32 145.6 32 128S46.36 96 64 96zM320 320c-35.35 0-64 28.65-64 64s28.65 64 64 64c35.35 0 64-28.65 64-64S355.3 320 320 320zM320 416c-17.64 0-32-14.36-32-32s14.36-32 32-32s32 14.36 32 32S337.6 416 320 416z" /></svg>
                      },
                      {
                        name: "With Bonus",
                        sub: `Lvl ${dinoLevel + tameData.levelsGained}`,
                        icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M466.5 83.69l-192-80.01C268.6 1.188 262.3 0 256.1 0S243.5 1.188 237.6 3.688l-192 80.01C27.72 91.07 16 108.6 16 127.1C16 385.4 205.4 512 255.1 512C305.2 512 496 387.3 496 127.1C496 108.6 484.3 91.07 466.5 83.69zM463.9 128.3c0 225.3-166.2 351.7-207.8 351.7C213.3 479.1 48 352.2 48 128c0-6.5 3.875-12.25 9.75-14.75l192-80c1.973-.8275 4.109-1.266 6.258-1.266c2.071 0 4.154 .4072 6.117 1.266l192 80C463.3 117.1 463.9 125.8 463.9 128.3zM336 240H271.1v-64C271.1 167.2 264.8 160 256 160S240 167.2 240 176v64H175.1C167.2 240 160 247.2 160 256s7.154 16 15.1 16H240v64c0 8.836 7.154 16 15.1 16c8.838 0 15.1-7.16 15.1-16v-64h64C344.8 272 352 264.8 352 256S344.8 240 336 240z" /></svg>
                      },
                      {
                        name: "Max after Taming",
                        sub: `Lvl ${dinoLevel +
                          tameData.levelsGained +
                          (dinoXVariant && dino.x_variant ? 88 : 73)}`,
                        icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M477.4 304.2l-131 21.75C336.5 303.6 314.1 288 288 288c-35.38 0-64 28.62-64 64s28.62 64 64 64c33.38 0 60.5-25.75 63.38-58.38l131.3-21.87c8.75-1.375 14.62-9.625 13.12-18.38C494.4 308.6 485.9 302.8 477.4 304.2zM288 384c-17.62 0-32-14.38-32-32s14.38-31.1 32-31.1S320 334.4 320 352S305.6 384 288 384zM288 32c-159 0-288 129-288 288c0 52.75 14.25 102.3 39 144.8c5.625 9.625 16.38 15.25 27.5 15.25h443c11.12 0 21.88-5.625 27.5-15.25C561.8 422.3 576 372.8 576 320C576 161 447 32 288 32zM509.5 448H66.75C44 409.1 32 365.2 32 320c0-141.1 114.9-256 256-256s256 114.9 256 256C544 365.2 532 409.8 509.5 448z" /></svg>
                      },
                    ].map(({ name, sub, icon }, i) => (
                      <li
                        key={`taming-stage-${i}`}
                        className="[&:last-of-type>svg]:hidden flex items-center space-x-2.5 [&>*]:border-black [&>*]:fill-black [&>*]:dark:border-white [&>*]:dark:fill-white"
                      >
                        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border p-3">
                          {icon}
                        </span>
                        <span>
                          <h3 className="font-medium leading-tight">{name}</h3>
                          <p className="text-sm space-x-1">
                            <span>{sub.replace(/[0-9]/g, '')}</span>
                            <Counter
                              className="inline-block"
                              startNum={0}
                              endNum={sub.replace(/\D/g, '')}
                              duration={500}
                            />
                          </p>
                        </span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6"
                          viewBox="0 0 256 512"
                        >
                          <path d="M219.9 266.7L75.89 426.7c-5.906 6.562-16.03 7.094-22.59 1.188c-6.918-6.271-6.783-16.39-1.188-22.62L186.5 256L52.11 106.7C46.23 100.1 46.75 90.04 53.29 84.1C59.86 78.2 69.98 78.73 75.89 85.29l144 159.1C225.4 251.4 225.4 260.6 219.9 266.7z" />
                        </svg>
                      </li>
                    ))}
                  </ol>
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
                    {Object.entries(tameData)
                      .filter(([k, _]) =>
                        [
                          "NarcoberryMin",
                          "Bio-ToxinMin",
                          "NarcoticMin",
                          "Ascerbic-MushroomMin",
                        ].includes(k)
                      )
                      .map(([name, v]) => (
                        <div
                          className="flex flex-col items-center"
                          key={`narcotic-${name}`}
                        >
                          {/* https://placehold.co/100x100/png */}
                          <img
                            src={`https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/${name
                              .replace("Min", "")
                              .toLowerCase()}.png`}
                            alt=""
                            className="w-12"
                          />
                          <p>{v.toString()}</p>
                          <p className="text-xs capitalize">
                            {name.replace("Min", "").replace("-", " ")}
                          </p>
                        </div>
                      ))}
                  </div>
                </section>

                {calculateWeapons && tameData && (
                  <>
                    <p className="mt-3 text-lg">Knock Out</p>
                    <div className="max-w-screen rw-segment relative flex flex-row gap-2 overflow-x-auto rounded-md py-3 text-center">
                      {calculateWeapons.map(
                        ({
                          id,
                          name,
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
                              `animate-fade-in my-1 flex min-h-full min-w-[8rem] flex-1 flex-col items-center justify-between space-y-1 rounded bg-zinc-200 p-3 first:ml-1 last:mr-1 dark:bg-zinc-600`,
                              {
                                "shadow-pea-500 shadow":
                                  isPossible && chanceOfDeath < 99,
                                "rw-img-disable text-gray-500":
                                  !isPossible || chanceOfDeath >= 99,
                              }
                            )}
                          >
                            <img
                              className="h-16 w-16"
                              src={`https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/${image}`}
                            />
                            <Link
                              to={routes.item({ id: id.toString() })}
                              className="w-full"
                            >
                              {name}
                            </Link>
                            {isPossible ? (
                              <Counter
                                startNum={0}
                                endNum={hits}
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
                              <span className="rounded bg-gray-100 px-2.5 py-0.5 text-sm font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                                {hitboxes.map((h) => (
                                  <span
                                    key={`hitbox-${h.name}`}
                                  >{`${h.name} - ${h.multiplier}x`}</span>
                                ))}
                              </span>
                            )}
                            <div className="rw-button-group max-w-full">
                              <input
                                className="rw-input w-12 !p-1 text-center"
                                defaultValue={userDamage}
                                disabled={!isPossible || chanceOfDeath >= 99}
                                onChange={debounce((e) => {
                                  setWeaponDamage({
                                    ...weaponDamage,
                                    [id]: e.target.value,
                                  });
                                }, 300)}
                              />
                              <input
                                type="readonly"
                                disabled={!isPossible || chanceOfDeath >= 99}
                                className="rw-input !w-5 !p-1 text-center"
                                readOnly
                                placeholder="%"
                                defaultValue={`%`}
                              />
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </>
                )}
                <label htmlFor="sec_between_hits" className="rw-label">
                  Seconds between hits
                </label>
                <input
                  type="number"
                  inputMode="numeric"
                  id="sec_between_hits"
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
          {/* )} */}
        </section>
      </section>

      {dino?.DinoStat.some((d) => d.type == "saddle") && (
        <section className="col-span-2">
          <p className="text-lg dark:text-gray-200">Saddle</p>
          <div className="flex flex-row">
            {dino.DinoStat.filter((d) => d.type === "saddle").map(
              ({ Item: { id, name, image } }) => (
                <details
                  className="group w-fit rounded-md bg-zinc-300 p-2 dark:bg-zinc-600"
                  key={`saddle-${id}`}
                >
                  <summary className="flex h-16 min-w-[4rem] place-content-center place-items-center gap-2 border text-center text-sm transition-all dark:text-gray-200">
                    <img
                      src={`https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/${image}`}
                      alt={dino.name}
                      className="h-8 w-8 transform group-open:scale-125"
                    />
                    <span className="animate-fade-in mr-2 hidden group-open:block">
                      {name}
                    </span>
                  </summary>

                  <ul className="rounded-md">
                    {dino?.DinoStat.filter(
                      (d) => d.type == "saddle"
                    )[0].Item.ItemRecipe_ItemRecipe_crafted_item_idToItem.map(
                      ({
                        Item_ItemRecipe_crafting_station_idToItem,
                        crafting_station_id,
                      }) => (
                        <li
                          className="animate-fade-in flex h-16 place-content-start place-items-center border border-stone-400 px-2"
                          key={`craftedin-${crafting_station_id}`}
                        >
                          <p>Crafted in:</p>
                          <Link
                            className="inline-flex items-center space-x-2"
                            to={routes.item({
                              id: crafting_station_id.toString(),
                            })}
                          >
                            <img
                              src={`https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/${Item_ItemRecipe_crafting_station_idToItem.image}`}
                              alt={"Crafting Station"}
                              className="h-8 w-8"
                            />
                            <span>
                              {Item_ItemRecipe_crafting_station_idToItem.name}
                            </span>
                          </Link>
                        </li>
                      )
                    )}
                  </ul>
                </details>
              )
            )}
          </div>
        </section>
      )}

      {dino && baseStats && (
        <>
          <section className="rounded-b-md py-3">
            <Table
              className="w-fit"
              rows={baseStats}
              toolbar={[
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
                          s.stat == "Torpidity" ? 0 : Math.round(dinoLevel / 7),
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
                      .map((b) => b.points)
                      .reduce((a, b) => a + b, 0)}{" "}
                  points wasted
                </p>,
              ]}
              columns={[
                {
                  field: "stat",
                  className: "font-bold",
                  sortable: true,
                  render: ({ value }) => (
                    <div className="inline-flex items-center space-x-2">
                      <img
                        title={value}
                        className="h-6 w-6"
                        src={`https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/${value
                          .replace(" ", "_")
                          .toLowerCase()}.webp`}
                        alt={value}
                      />
                      <p>{value}</p>
                    </div>
                  ),
                },
                {
                  field: "base",
                  header: "Base (lvl 1)",
                  numeric: true,
                  sortable: true,
                },
                {
                  field: "increasePerLevelWild",
                  header: "Increase per level (wild)",
                  numeric: true,
                  render: ({ value }) => {
                    return value === null ? "" : `+${value}`;
                  },
                },
                {
                  field: "increasePerLevelTamed",
                  header: "Increase per level (tamed)",
                  numeric: true,
                  render: ({ value }) => {
                    return value === null ? "" : `+${value}%`;
                  },
                },
                {
                  field: "total",
                  header: "Total",
                  numeric: true,
                },
                {
                  field: "base",
                  header: "",
                  render: ({ row }) => {
                    return (
                      <nav className="flex flex-row items-center space-x-2">
                        <button
                          type="button"
                          disabled={
                            baseStats.find((s) => s.stat === row.stat)
                              ?.points <= 0 || row.stat === "Torpidity"
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
                              .reduce((a, b) => a + b, 0) >=
                            dinoLevel || row.stat === "Torpidity"
                          }
                          className="rw-button rw-button-green-outline h-8 w-8 rounded-full p-0 !text-xl"
                          onClick={() => onAdd(row.stat)}
                        >
                          +
                        </button>
                      </nav>
                    );
                  },
                },
              ]}
            />
          </section>
          {dino.movement && (
            <section className="my-3 rounded-md p-4">
              <div className="grid grid-cols-4 items-center gap-1">
                <p>&nbsp;</p>
                <p>Base</p>
                <p>Sprint</p>
                <p>&nbsp;</p>
                {Object.entries(dino.movement["w"]).map(
                  ([stat, value], index) => (
                    <>
                      <p className="text-right capitalize">{stat}</p>
                      {Object.values(value).map((v, i) => (
                        <p
                          key={`movement-${stat}-${i}`}
                          className={clsx("rw-input rounded-none", {
                            "rounded-tl-lg": i === 0 && index === 0,
                            "rounded-tr-lg": i === 1 && index === 0,
                            "rounded-bl-lg": i === 0 && index === 1,
                            "rounded-br-lg": i === 1 && index === 1,
                          })}
                        >
                          {!v
                            ? "-"
                            : (useFoundationUnit
                              ? Number(v / 300)
                              : Number(v)
                            ).toFixed(2)}
                        </p>
                      ))}
                      <abbr
                        title={`${useFoundationUnit ? "Foundation" : `Units`
                          } per second`}
                      >
                        {useFoundationUnit ? "Foundation" : `Units`}/s
                      </abbr>
                    </>
                  )
                )}

                <ToggleButton
                  className="col-span-4 mx-auto"
                  onLabel="Foundation"
                  offLabel="Game Units"
                  checked={useFoundationUnit}
                  onChange={() => setUseFoundationUnit(!useFoundationUnit)}
                />
              </div>
            </section>
          )}
        </>
      )}

      <nav className="rw-button-group col-span-2">
        {currentUser &&
          currentUser?.permissions.some((p) => p === "gamedata_update") && (
            <Link
              to={routes.editDino({ id: dino.id })}
              className="rw-button rw-button-blue"
            >
              Edit
            </Link>
          )}
        {currentUser &&
          currentUser?.permissions.some((p) => p === "gamedata_delete") && (
            <button
              type="button"
              className="rw-button rw-button-red"
              onClick={() => onDeleteClick(dino.id)}
            >
              Delete
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
                className="rw-button-icon"
              >
                <path d="M432 64h-96l-33.63-44.75C293.4 7.125 279.1 0 264 0h-80C168.9 0 154.6 7.125 145.6 19.25L112 64h-96C7.201 64 0 71.2 0 80c0 8.799 7.201 16 16 16h416c8.801 0 16-7.201 16-16C448 71.2 440.8 64 432 64zM152 64l19.25-25.62C174.3 34.38 179 32 184 32h80c5 0 9.75 2.375 12.75 6.375L296 64H152zM400 128C391.2 128 384 135.2 384 144v288c0 26.47-21.53 48-48 48h-224C85.53 480 64 458.5 64 432v-288C64 135.2 56.84 128 48 128S32 135.2 32 144v288C32 476.1 67.89 512 112 512h224c44.11 0 80-35.89 80-80v-288C416 135.2 408.8 128 400 128zM144 416V192c0-8.844-7.156-16-16-16S112 183.2 112 192v224c0 8.844 7.156 16 16 16S144 424.8 144 416zM240 416V192c0-8.844-7.156-16-16-16S208 183.2 208 192v224c0 8.844 7.156 16 16 16S240 424.8 240 416zM336 416V192c0-8.844-7.156-16-16-16S304 183.2 304 192v224c0 8.844 7.156 16 16 16S336 424.8 336 416z" />
              </svg>
            </button>
          )}
      </nav>
    </article>
  );
};

export default Dino;
