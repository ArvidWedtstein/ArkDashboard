import {
  FieldError,
  Form,
  Label,
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
import { Fragment, useCallback, useEffect, useMemo, useReducer } from "react";
import type {
  DeleteDinoMutationVariables,
  FindDinoById,
} from "types/graphql";
import clsx from "clsx";
import Table from "src/components/Util/Table/Table";
import CheckboxGroup from "src/components/Util/CheckSelect/CheckboxGroup";
import Counter from "src/components/Util/Counter/Counter";
import { useAuth } from "src/auth";
import Tabs, { Tab } from "src/components/Util/Tabs/Tabs";
import Toast from "src/components/Util/Toast/Toast";
import {
  Card,
  CardContent,
  CardHeader,
  CardMedia,
} from "src/components/Util/Card/Card";
import Button, { ButtonGroup } from "src/components/Util/Button/Button";
import { Input } from "src/components/Util/Input/Input";
import Switch from "src/components/Util/Switch/Switch";
import Alert from "src/components/Util/Alert/Alert";
import Badge from "src/components/Util/Badge/Badge";

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
  selected_food: number;
  seconds_between_hits: string;
};

interface Props {
  dino: NonNullable<FindDinoById["dino"]>;
  itemsByIds: NonNullable<FindDinoById["itemsByIds"]>;
}

const Dino = ({ dino, itemsByIds }: Props) => {
  const [deleteDino] = useMutation(DELETE_DINO_MUTATION, {
    onCompleted: () => {
      toast.success("Dino deleted");
      navigate(routes.dinos());
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

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
   * The Tm and TmM are only affected by the Taming Efficiency if Tm > 0, i.e a malus won't get less bad if the TE is lower. The Tm is negative for aberrant creatures (-0.04)
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
   * V = (base value × (1 + stat level wild × Increase per wild-level as % of B × Increase per wild level modifier) × TamedBaseHealthMultiplier × (1 + Imprinting Bonus when tamed × 0.2 × IBM) + Additive taming-bonus × Additive taming-bonus modifier) × (1 + Taming Effectiveness × Multiplicative taming-bonus × Multiplicative taming-bonus modifier) × (1 + player leveled stat × Increase per domesticated level as % of Vpt × Increase per domesticated level modifier)
   * R-Creatures have 5% damage increase and 3% less health when tamed
   * X-Creatures have 5% damage increase and 3% less health when tamed.
   * Wild X-Creatures have a 250% damage increase and a 60% damage resistance from players and tamed creatures.
   * Players and tames gain 2.5 times more XP for killing them.
   *
   * Melee damage is affected by 4 factors: Weapon Base Damage, Weapon Damage Quality Multiplier, Survivor Melee Damage Multiplier and Server Settings: Player Damage.
   * Melee Damage = WBD * WDQM * SMDM * PD
   *
   * FORMULAS:
   * - Taming Efficiency: TE = 1 / ( 1 + [number of food eaten] + [damage taken])
   * - Creature stat: (base value × (1 + stat level wild × Increase per wild-level as % of B × Increase per wild level modifier) × TamedBaseHealthMultiplier × (1 + Imprinting Bonus when tamed × 0.2 × IBM) + Additive taming-bonus × Additive taming-bonus modifier) × (1 + Taming Effectiveness × Multiplicative taming-bonus × Multiplicative taming-bonus modifier) × (1 + player leveled stat × Increase per domesticated level as % of Vpt × Increase per domesticated level modifier)
   * - Melee damage: Weapon Base Damage * Weapon Damage Quality Multiplier * Survivor Melee Damage Multiplier * Server Settings: Player Damage
   * - Oxygen under water:  Oxygen / 3 = time in seconds
   *
   * https://ark.fandom.com/wiki/Module:TamingTable/creatures
   **/

  const onDeleteClick = (id: DeleteDinoMutationVariables["id"]) => {
    toast.custom((t) => (
      <Toast
        t={t}
        title={"Are you sure you want to delete dino?"}
        message={<p>Are you sure you want to delete dino {id}?</p>}
        primaryAction={() => deleteDino({ variables: { id } })}
        actionType="YesNo"
      />
    ));
  };

  /**
    Calculates the cumulative probability of getting a result between the given lower and upper limits,
    based on a binomial distribution with a given number of trials and probability of success.
    @param {number} ll - Lower limit of the result
    @param {number} ul - Upper limit of the result
    @param {number} p - Probability of success
    @returns {number} - The cumulative probability
    */
  const calculateProbabilityMore = (ll: number, ul: number, p: number) => {
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
  };

  const nper = (n, x) => {
    let n1 = n + 1;
    let r = 1.0;
    let xx = Math.min(x, n - x);
    for (let i = 1; i < xx + 1; i++) {
      r = (r * (n1 - i)) / i;
    }
    return r;
  };
  const b = (p, n, x) => {
    let px = Math.pow(p, x) * Math.pow(1.0 - p, n - x);
    return nper(n, x) * px;
  };
  /**

    Calculates the cumulative probability of getting a result greater than or equal to the given lower limit,
    based on a binomial distribution with a given number of trials and probability of success.
    @param {number} n - Number of trials
    @param {number} numOptions - Number of possible outcomes
    @param {number} ll - Lower limit of the result
    @returns {number|undefined} - The cumulative probability if all the parameters are valid, undefined otherwise
    */
  const calculatePropability = (n: number, numOptions: number, ll: number) => {
    let ul;
    let p = 1 / numOptions;
    if (!isNaN(n) && !isNaN(p)) {
      if (n > 0 && p > 0 && p < 1) {
        if (!isNaN(ll) && ll >= 0) {
          return calculateProbabilityMore(ll, n, p);
        }
      }
    }
  };
  const canDestroy = ({ value, header }: { value: number; header: string }) => (
    <div
      className={clsx(`space-y-1`, {
        "rw-img-disable": value <= 0,
      })}
    >
      <img
        src={`https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/${header.toLowerCase()}-wall.webp`}
        className="aspect-square w-8"
      />
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
    </div>
  );

  type DinoActionType =
    | "FORM_SUBMIT"
    | "SET_MATURATION"
    | "SELECT_FOOD"
    | "CALC_TAMING_FOOD"
    | "CALC_WEAPON"
    | "RECIPE_TAB_CHANGE"
    | "CHANGE_STAT"
    | "RANDOMIZE_STAT"
    | "DISTRIBUTE_STAT"
    | "RESET_STAT"
    | "RESET";

  interface DinoAction {
    type: DinoActionType;
    payload?: {
      stat?: string;
      type?: string;
      value?: number;
      form?: TamingCalculatorForm;
      id?: number;
    };
  }

  type Food = {
    max: number;
    food: number;
    seconds: number;
    secondsPer: number;
    percentPer: number;
    interval: number;
    interval1: number;
    use: number;
    id: number;
    name: string;
    type: string;
    affinity: number;
    [key: string]: string | number;
  };
  type Weapon = {
    __typename?: "Item";
    id: number;
    name: string;
    image?: string;
    stats?: JSON;
    torpor?: number;
    torpor_duration?: number;
    damage?: number;
    visible?: boolean;
    userDamage?: number;
    multipliers?: string[];
    hits?: number;
    hitsRaw?: number;
    hitsUntilFlee?: number;
    chanceOfDeath?: number;
    changeOfDeathHigh?: boolean;
    minChanceOfDeath?: number;
    isPossible?: boolean;
    isRecommended?: boolean;
    hitboxes?: { [key: string]: number };
    hasMultipler?: boolean;
  };

  interface DinoState {
    level: number;
    maturation: number;
    seconds_between_hits: number;
    x_variant: boolean;
    activeRecipeTabIndex: number;
    selected_food: number;
    foods: Food[];
    base_stats: {
      stat: string;
      base: number;
      increasePerLevelWild: number;
      increasePerLevelTamed: number;
      total: number;
      points: number;
    }[];
    weapons: any;
    settings: {
      [key: string]: number;
    };
  }

  const calculateWeaponStats = (
    state: DinoState,
    dmg?: {
      id: number;
      value: number;
    }
  ) => {
    const {
      base_stats,
      base_taming_time,
      taming_interval,
      flee_threshold,
      // variants,
      x_variant,
    } = dino;
    const { h: { b: baseHealth = 0, w: incPerLevel = 0 } = {} } =
      (base_stats as BaseStats) || { b: 0, w: 0 };
    return state.weapons.map((weapon) => {
      let {
        id,
        userDamage,
        torpor,
        torpor_duration,
        multipliers,
        damage,
        ...rest
      } = weapon;

      if (dmg && id === dmg.id) {
        userDamage = dmg.value;
      }

      const creatureT = base_taming_time + taming_interval * (state.level - 1);
      const creatureFleeThreshold =
        typeof flee_threshold === "number" ? flee_threshold : 0.75;
      const isPossible = torpor_duration
        ? torpor -
        (state.seconds_between_hits - torpor_duration) *
        (dino.tdps +
          Math.pow(state.level - 1, 0.8493) / (22.39671632 / dino.tdps))
        : torpor;

      let torporPerHit = isPossible
        ? torpor -
        (state.seconds_between_hits - torpor_duration) *
        (dino.tdps +
          Math.pow(state.level - 1, 0.8493) / (22.39671632 / dino.tdps))
        : torpor;

      const knockOutMultiplier =
        (multipliers && dino.multipliers?.[0]?.[multipliers]?.[0]) || 1;
      let totalMultipliers = 1 / knockOutMultiplier;
      let knockOut = creatureT / (torporPerHit * knockOutMultiplier);

      if (multipliers && multipliers.includes("DmgType_Melee_Human")) {
        knockOut /= state.settings.meleeMultiplier / 100;
        totalMultipliers *= state.settings.meleeMultiplier / 100;
      }

      // if (variants.includes('Genesis') && state.variants.includes('Genesis')) {
      if (x_variant && state.x_variant) {
        knockOut /= 0.4;
        totalMultipliers *= 0.4;
      }

      knockOut /= state.settings.playerDamageMultiplier;
      totalMultipliers *= state.settings.playerDamageMultiplier;

      const numHitsRaw = knockOut / (userDamage / 100);

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
            (userDamage / 100) *
            multiplier;
          const propsurvival =
            totalDamage < baseHealth
              ? 100
              : calculatePropability(
                state.level - 1,
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
            (userDamage / 100);

          let propsurvival =
            totalDamage < baseHealth
              ? 100
              : state.level - 1 <
                Math.max(Math.ceil((totalDamage - baseHealth) / incPerLevel), 0)
                ? 0
                : calculatePropability(
                  state.level - 1,
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
              (userDamage / 100) *
              hitbox.multiplier;

            propsurvival =
              totalDamage < baseHealth
                ? 100
                : calculatePropability(
                  state.level - 1,
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
        ...weapon,
        hits: Math.ceil(numHitsRaw),
        hitsRaw: numHitsRaw,
        hitsUntilFlee,
        chanceOfDeath: bodyChanceOfDeath,
        chanceOfDeathHigh,
        minChanceOfDeath: minChanceOfDeath || 0,
        isPossible,
        isRecommended: isPossible && minChanceOfDeath < 90,
        hitboxes,
      };
    });
  };

  const calculateFoodStats = (state: DinoState) => {
    const affinityNeeded = dino.affinity_needed + dino.aff_inc * state.level;
    const foodConsumption =
      dino.food_consumption_base *
      dino.food_consumption_mult *
      state.settings.consumptionMultiplier *
      1;

    const tamingMultiplier = dino.disable_mult
      ? 4
      : state.settings.tamingMultiplier * 4;

    return dino.DinoStat.filter(
      (ds) => ds.type === "food" && ds.Item.food != null
    ).map(({ Item }) => {
      const foodValue = Item.food;
      const affinityValue = Item.affinity;
      let foodMaxRaw = affinityNeeded / affinityValue / tamingMultiplier;
      let foodMax = 0;
      let interval: number = null;
      let interval1: number = null;
      let foodSecondsPer = 0;
      let foodSeconds = 0;
      let isFoodSelected = Item.id === state?.selected_food;

      if (!dino.violent_tame) {
        foodMaxRaw = foodMaxRaw / dino.non_violent_food_rate_mult;
        interval = foodValue / foodConsumption;

        const baseStat = (dino?.base_stats as BaseStats)?.f || null;
        if (
          typeof baseStat?.b === "number" &&
          typeof baseStat?.w === "number"
        ) {
          const averagePerStat = Math.round(state.level / 7);
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
        ...Item,
        max: foodMax,
        food: foodValue,
        seconds: foodSeconds,
        secondsPer: foodSecondsPer,
        percentPer: 100 / foodMaxRaw,
        interval,
        interval1,
        use: isFoodSelected ? foodMax : 0,
      } as unknown as Food;
    });
  };

  const [state, dispatch] = useReducer(
    (state: DinoState, action: DinoAction) => {
      const { type, payload } = action;
      switch (type) {
        case "FORM_SUBMIT":
          return {
            ...state,
            ...(payload.form as unknown as DinoState),
          };
        case "SET_MATURATION":
          return {
            ...state,
            maturation: payload.value,
          };
        case "SELECT_FOOD":
          return {
            ...state,
            selected_food: payload.value,
          };
        case "CALC_TAMING_FOOD":
          return {
            ...state,
            foods: calculateFoodStats(state),
          };
        case "CALC_WEAPON":
          return {
            ...state,
            weapons: calculateWeaponStats(
              state,
              payload ? { id: payload.id, value: payload.value } : null
            ),
          };
        case "RECIPE_TAB_CHANGE":
          return {
            ...state,
            activeRecipeTabIndex: payload.value,
          };
        case "CHANGE_STAT":
          return {
            ...state,
            base_stats: state.base_stats.map((stat) => {
              if (stat.stat === payload.stat) {
                if (payload.type === "set") {
                  stat.total = payload.value;
                  stat.points = Math.round(
                    (payload.value - stat.base) / stat.increasePerLevelWild
                  );
                } else {
                  stat.points =
                    payload.type == "add" ? stat.points + 1 : stat.points - 1;
                  stat.total =
                    payload.type == "set"
                      ? payload.value
                      : stat.points * stat.increasePerLevelWild + stat.base;
                }
              }
              return stat;
            }),
          };
        case "RANDOMIZE_STAT":
          const nonTorpidityStats = state.base_stats.filter(
            (d) => d.stat !== "Torpidity"
          );
          const totalPoints =
            state.level - nonTorpidityStats.reduce((a, b) => a + b.points, 0);

          for (let i = totalPoints; i > 0; i--) {
            const randomIndex = Math.floor(
              Math.random() * nonTorpidityStats.length
            );
            const stat = nonTorpidityStats[randomIndex];

            stat.points = clamp(stat.points + 1, 0, 100);
          }

          return {
            ...state,
            base_stats: state.base_stats.map((stat, i) => {
              if (
                nonTorpidityStats.findIndex((d) => d.stat === stat.stat) !== -1
              ) {
                stat = nonTorpidityStats.find((d) => d.stat === stat.stat);
              }

              stat.total = stat.points * stat.increasePerLevelWild + stat.base;
              return stat;
            }),
          };
        case "DISTRIBUTE_STAT":
          return {
            ...state,
            base_stats: state.base_stats.map((stat) => ({
              ...stat,
              points:
                stat.stat == "Torpidity" ? 0 : Math.round(state.level / 7),
            })),
          };
        case "RESET_STAT":
          return {
            ...state,
            base_stats: state.base_stats.map((stat) => ({
              ...stat,
              points: 0,
              total: stat.base,
            })),
          };
        default:
          return state;
      }
    },
    {
      maturation: 0,
      level: 150,
      seconds_between_hits: 5,
      x_variant: false,
      foods: [],
      activeRecipeTabIndex: 0,
      selected_food: dino.DinoStat.some((f) => f.type === "food")
        ? dino.DinoStat.filter((f) => f.type === "food")[0].Item.id
        : null,
      base_stats:
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
        })),
      weapons: itemsByIds
        .filter((d) => ![121, 123, 713, 719].includes(d.id))
        .map((w) => ({
          ...w,
          userDamage: 100,
          hitboxes: [],
          hasMultipler: true,
          multipliers: (
            w.stats as {
              id: number;
              value: number | string[];
              duration?: number;
            }[]
          ).find((d) => d.id === 21)?.value as string[],
        })),
      settings: {
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
      },
    }
  );
  const calcMaturationPercent = useCallback(() => {
    let timeElapsed = state.maturation * dino?.maturation_time * 1;
    return timeElapsed / 100;
  }, [state.maturation]);

  // Calculate stats off offstring
  // Value = (BaseStat × ( 1 + LevelWild × IncreaseWild) + TamingBonusAdd × TamingBonusAddModifier) × (1 + TamingEffectiveness × TamingBonusMult × TamingBonusMultModifier)

  useEffect(() => {
    dispatch({
      type: "CALC_TAMING_FOOD",
    });
    dispatch({
      type: "CALC_WEAPON",
    });
  }, []);

  const tameData = useMemo(() => {
    if (!state.foods || state.foods.length == 0) return null;
    let effectiveness = 100;

    const narcotics = itemsByIds.filter((f) =>
      [121, 123, 713, 719].includes(f.id)
    );

    let affinityNeeded = dino.affinity_needed + dino.aff_inc * state.level;
    // sanguineElixir = affinityNeeded *= 0.7

    let affinityLeft = affinityNeeded;

    let totalFood = 0;

    let tamingMultiplier = dino.disable_mult
      ? 4
      : state.settings.tamingMultiplier * 4;
    let foodConsumption =
      dino.food_consumption_base *
      dino.food_consumption_mult *
      state.settings.consumptionMultiplier;

    foodConsumption = dino.violent_tame
      ? foodConsumption
      : foodConsumption * dino.non_violent_food_rate_mult;

    let tooMuchFood = false;
    let enoughFood = false;
    let numUsedTotal = 0;
    let numNeeded = 0;
    let numToUse = 0;
    let totalSecs = 0;

    state.foods.forEach((food) => {
      if (!food) return;
      let foodVal = food.food;
      let affinityVal = food.affinity;

      if (affinityLeft > 0) {
        if (state.selected_food) {
          food.use = food.id == state.selected_food ? food.max : 0;
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

      state.foods.forEach((food) => {
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
      dino.base_taming_time + dino.taming_interval * (state.level - 1);
    let torporDepletionPS =
      dino.tdps +
      Math.pow(state.level - 1, 0.800403041) / (22.39671632 / dino.tdps);

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
      levelsGained: Math.floor((state.level * 0.5 * effectiveness) / 100),
      totalTorpor,
      torporDepletionPS,
      percentTamed,
      ...calcNarcotics.reduce((acc, cur) => ({ ...acc, ...cur }), {}),
    };
  }, [state.foods]);
  // https://codepen.io/adamstuartclark/pen/xVgMBY
  return (
    <article className="grid grid-cols-1 gap-3 text-black dark:text-white md:grid-cols-2">
      {/* <div className="relative">
        <div className="parchment [filter:url(#wavy)]" />
        <div className="p-6 text-[#585045]">
          <div className="flex">
            <div className="flex-auto">
              <ul className="space-y-2 divide-y divide-zinc-500 align-middle w-fit text-center">
                <li className="px-3">
                  <p className="font-bold uppercase">{dino.type}</p>
                </li>
                <li className="px-3">test</li>
                <li className="px-3">test</li>
                <li className="px-3">test</li>
                <li className="px-3">test</li>
                <li className="px-3">test</li>
              </ul>
            </div>
            <div className="flex justify-center w-full">
              <img
                src={`https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Dino/${dino.image}`}
                alt={dino.name}
                className="w-auto -scale-x-100 transform"
              />
            </div>
          </div>
          <div className="">
            <h1 className="text-3xl font-bold my-4">{dino.name}</h1>
            <p className="first-letter:text-7xl first-letter:pr-1 first-letter:align-text-top first-letter:font-serif first-letter:text-opacity-50 first-letter:float-left first-letter:inline-block first-letter:leading-[1.125] first-line:uppercase first-line:block first-line:font-bold text-xl overflow-auto">
              {dino.description}
            </p>
          </div>
        </div>
      </div>
      <svg>
        <filter id="wavy">
          <feTurbulence x="0" y="0" baseFrequency="0.02" numOctaves="5" seed="12"></feTurbulence>
          <feDisplacementMap in="SourceGraphic" scale="20" />
        </filter>
      </svg> */}
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
              <span>{dino.synonyms && dino.synonyms.replace(",", ", ")}</span>
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
              state.settings.XPMultiplier *
              (1 + 0.1 * (state.level - 1))
            ).toFixed() || 0}
            xp
          </div>
        </div>
      </section>

      <section className="col-span-2">
        <Tabs>
          <Tab
            label="Stats"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                fill="currentColor"
                className="pointer-events-none mr-2 h-4 w-4"
              >
                <path d="M256 256c8.828 0 16-7.172 16-16v-96C272 135.2 264.8 128 256 128S240 135.2 240 144v96C240 248.8 247.2 256 256 256zM352 192c8.828 0 16-7.172 16-16v-96C368 71.17 360.8 64 352 64s-16 7.172-16 16v96C336 184.8 343.2 192 352 192zM160 352c8.828 0 16-7.172 16-16v-96C176 231.2 168.8 224 160 224S144 231.2 144 240v96C144 344.8 151.2 352 160 352zM496 448h-416C53.53 448 32 426.5 32 400v-352C32 39.17 24.83 32 16 32S0 39.17 0 48v352C0 444.1 35.88 480 80 480h416c8.828 0 16-7.172 16-16S504.8 448 496 448zM448 352c8.828 0 16-7.172 16-16v-256C464 71.17 456.8 64 448 64s-16 7.172-16 16v256C432 344.8 439.2 352 448 352z" />
              </svg>
            }
          >
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

              <section className="my-12 grid grid-cols-1 gap-3 border-t md:grid-cols-2">
                {dino.movement && (
                  <section className="col-span-1 space-y-2">
                    <h4 className="rw-label">Movement</h4>
                    <Table
                      columns={[
                        {
                          field: "name",
                          header: "",
                          className: "capitalize text-center",
                        },
                        {
                          field: "base",
                          header: "Base",
                          className: "text-center",
                          valueFormatter: ({ value }) =>
                            value
                              ? formatNumber(
                                Number(parseInt(value.toString()) / 300)
                              )
                              : "-",
                        },
                        {
                          field: "sprint",
                          header: "Sprint",
                          valueFormatter: ({ value }) =>
                            value
                              ? formatNumber(
                                Number(parseInt(value.toString()) / 300)
                              )
                              : "-",
                        },
                        {
                          field: "swim",
                          header: "Swim",
                          valueFormatter: ({ value }) =>
                            value
                              ? formatNumber(
                                Number(parseInt(value.toString()) / 300)
                              )
                              : "-",
                        },
                        {
                          field: "format",
                          header: "",
                        },
                      ]}
                      rows={Object.entries(dino.movement["w"]).map(
                        ([k, m]: [
                          k: string,
                          m: {
                            swim?: number;
                            base?: number;
                            fly?: number;
                            sprint?: number;
                          }
                        ]) => ({ ...m, format: "Foundation/s", name: k })
                      )}
                    />
                  </section>
                )}

                {dino.can_destroy && (
                  <section className="col-span-1 space-y-2">
                    <h4 className="rw-label">Can Destroy</h4>
                    <Table
                      className="min-w-fit"
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
                          dino.can_destroy.reduce(
                            (a, v) => ({ ...a, [v]: true }),
                            {}
                          )
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
                    <section className="col-span-1 space-y-2">
                      <h4 className="rw-label">Gather Efficiency</h4>
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
                        ).sort((a, b) => b?.value - a?.value)}
                        columns={[
                          {
                            field: "Item",
                            header: "Name",
                            render: ({ value }) => (
                              <div className="inline-flex items-center justify-center gap-2">
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
                  <section className="col-span-1 space-y-2">
                    <h4 className="rw-label">Weight Reduction</h4>
                    <Table
                      className="min-w-fit"
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
                          render: ({ value }) => value <= 10 && <p>#{value}</p>,
                        },
                      ]}
                    />
                  </section>
                )}

                {dino.DinoStat.some((d) => d.type == "drops") && (
                  <section className="col-span-1 space-y-2">
                    <h4 className="rw-label">Drops</h4>
                    <Table
                      className="min-w-fit"
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
                  <section className="col-span-1 space-y-2">
                    <h4 className="rw-label">Food</h4>
                    <Table
                      className="min-w-fit"
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
                                className="w-8 self-end pr-2"
                              />
                              <span>{name}</span>
                            </Link>
                          ),
                        },
                      ]}
                    />
                  </section>
                )}

                {state.base_stats && (
                  <section className="col-span-full">
                    <Table
                      rows={state.base_stats}
                      toolbar={
                        !dino.type.includes("boss")
                          ? [
                            <Button
                              variant="outlined"
                              color="secondary"
                              onClick={() =>
                                dispatch({ type: "RANDOMIZE_STAT" })
                              }
                              style={{
                                borderRadius: '0.375rem 0 0 0.375rem',
                                marginRight: '-0.5px',
                              }}
                            >
                              Random
                            </Button>,
                            <Button
                              variant="outlined"
                              color="secondary"
                              onClick={() =>
                                dispatch({
                                  type: "DISTRIBUTE_STAT",
                                })
                              }
                              style={{
                                borderRadius: '0',
                                marginLeft: '-0.5px',
                              }}
                            >
                              Distribute Evenly
                            </Button>,
                            <Button
                              variant="outlined"
                              color="error"
                              onClick={() =>
                                dispatch({
                                  type: "RESET_STAT",
                                })
                              }
                              style={{
                                borderRadius: '0 0.375rem 0.375rem 0',
                                marginLeft: '-0.5px',
                              }}
                            >
                              Clear
                            </Button>,
                            <Button
                              variant="text"
                              color="DEFAULT"
                              disableRipple
                              style={{
                                borderRadius: '0 0.375rem 0.375rem 0',
                                marginLeft: '-0.5px',
                              }}
                            >
                              {state.level -
                                state.base_stats
                                  .map((b) => b?.points)
                                  .reduce((a, b) => a + b, 0)}{" "}
                              points wasted
                            </Button>,
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
                              <div className="inline-flex w-fit items-center space-x-2">
                                <img
                                  title={value}
                                  className="h-6 w-6"
                                  src={`https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/${value
                                    ?.replace(" ", "_")
                                    .toLowerCase()}.webp`}
                                  alt={value}
                                />
                                <p className="hidden sm:block">{value ?? 0}</p>
                              </div>
                            ),
                        },
                        {
                          field: "base",
                          header: "Base",
                          className: "w-fit",
                          datatype: "number",
                          sortable: true,
                        },
                        // {
                        //   field: "increasePerLevelWild",
                        //   header: "Increase per level (w)",
                        //   className: "w-fit",
                        //   datatype: 'number',
                        //   render: ({ value }) =>
                        //     value === null ? "" : `+${value}`,
                        // },
                        {
                          field: "increasePerLevelTamed",
                          header: "Increase per level (t)",
                          datatype: "number",
                          render: ({ value }) =>
                            value === null ? "" : `+${value}%`,
                        },
                        {
                          field: "total",
                          header: "Total",
                          className: "w-fit",
                          datatype: "number",
                          render: ({ value, row, rowIndex }) => (
                            <Input
                              margin="none"
                              size="small"
                              color="primary"
                              value={value}
                              onChange={(e) => {
                                dispatch({
                                  type: "CHANGE_STAT",
                                  payload: {
                                    stat: row.stat,
                                    type: "set",
                                    value: Number(e.target.value),
                                  },
                                });
                              }}
                            />
                            // TODO: Implement calculation logic
                          ),
                        },
                        !dino.type.includes("boss") && {
                          field: "base",
                          header: "",
                          render: ({ row }) => (
                            <Input
                              margin="none"
                              size="small"
                              color="DEFAULT"
                              value={
                                state.base_stats.find(
                                  (s) => s.stat === row.stat
                                )?.points
                              }
                              InputProps={{
                                className: "max-w-[10rem] w-fit",
                                endAdornment: (
                                  <Fragment>
                                    <Button
                                      variant="icon"
                                      color="error"
                                      disabled={
                                        state.base_stats.find(
                                          (s) => s.stat === row.stat
                                        )?.points <= 0 || row.stat === "Torpidity"
                                      }
                                      onClick={() =>
                                        dispatch({
                                          type: "CHANGE_STAT",
                                          payload: {
                                            stat: row.stat,
                                            type: "remove",
                                          },
                                        })
                                      }
                                    >
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 448 512"
                                        className="h-3.5 w-3.5"
                                        fill="currentColor"
                                      >
                                        <path d="M432 256C432 264.8 424.8 272 416 272H32c-8.844 0-16-7.15-16-15.99C16 247.2 23.16 240 32 240h384C424.8 240 432 247.2 432 256z" />
                                      </svg>
                                    </Button>
                                    <span className="mx-1 h-8 w-px bg-current opacity-30" />
                                    <Button
                                      variant="icon"
                                      color="success"
                                      disabled={
                                        state.base_stats
                                          .map((b) => b.points)
                                          .reduce((a, b) => a + b, 0) >=
                                        state.level || row.stat === "Torpidity"
                                      }
                                      onClick={() =>
                                        dispatch({
                                          type: "CHANGE_STAT",
                                          payload: {
                                            stat: row.stat,
                                            type: "add",
                                          },
                                        })
                                      }
                                    >
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 448 512"
                                        className="h-3.5 w-3.5"
                                        fill="currentColor"
                                      >
                                        <path d="M432 256C432 264.8 424.8 272 416 272h-176V448c0 8.844-7.156 16.01-16 16.01S208 456.8 208 448V272H32c-8.844 0-16-7.15-16-15.99C16 247.2 23.16 240 32 240h176V64c0-8.844 7.156-15.99 16-15.99S240 55.16 240 64v176H416C424.8 240 432 247.2 432 256z" />
                                      </svg>
                                    </Button>
                                  </Fragment>
                                ),
                              }}
                            />
                          ),
                        },
                      ]}
                    />
                  </section>
                )}
              </section>
            </section>
          </Tab>
          <Tab
            label="Taming"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                fill="currentColor"
                className="pointer-events-none mr-2 h-4 w-4"
              >
                <path d="M496.3 0c-1 0-2.115 .1567-3.115 .2817L364.6 26.03c-12.25 2.5-16.88 17.59-8 26.47l40.12 40.13L144.3 345L90.73 320.9c-7.375-2.375-15.5-.5022-20.1 4.1l-63.75 63.82c-10.75 10.75-6.376 29.12 8.126 33.99l55.62 18.5l18.5 55.62C91.22 506.8 99.47 512 107.8 512c5.125 0 10.37-1.918 14.5-6.041l63.62-63.74c5.502-5.5 7.376-13.62 5.001-20.1l-23.1-53.6l252.4-252.4l40.13 40.08C462.6 158.5 466.6 160 470.5 160c6.998 0 13.89-4.794 15.51-12.67l25.72-128.6C513.6 8.905 505.1 0 496.3 0zM112.7 470.3L94.97 417l-53.25-17.75l44.87-45l49.13 22l21.1 48.1L112.7 470.3zM460.6 111.3L400.7 51.5l74.75-15L460.6 111.3zM148.7 267.3C151.8 270.4 155.9 272 160 272s8.188-1.562 11.31-4.688c6.25-6.25 6.25-16.38 0-22.62L63.58 136.1c73.23-51.43 171.8-54.54 247.9-6.502c7.375 4.688 17.38 2.516 22.06-4.984C338.3 118 336 108.1 328.5 103.4c-88.5-55.89-203.9-51.54-288.1 10.46L27.26 100.7C21.01 94.5 10.94 94.44 4.688 100.7S-1.533 117 4.717 123.3L148.7 267.3zM408.6 183.5c-4.781-7.5-14.75-9.672-22.06-4.984c-7.5 4.719-9.719 14.61-5 22.08c48.06 76.04 44.97 174.6-6.494 247.9l-107.7-107.7c-6.25-6.25-16.38-6.25-22.62 0s-6.25 16.38 0 22.62l144 144C391.8 510.4 395.9 512 400 512s8.188-1.562 11.31-4.688c6.25-6.25 6.25-16.38 0-22.62l-13.17-13.17C460.1 387.3 464.5 271.1 408.6 183.5z" />
              </svg>
            }
            disabled={!dino.tamable}
          >
            <section>
              {dino?.taming_notice && (
                <Alert className="my-3" variant="outlined" severity="info">
                  {dino?.taming_notice}
                </Alert>
              )}

              {/* Tek Stryder */}
              {dino.id === "a5a9f2bb-7d89-4672-9d1c-567d035e23a7" && (
                <div className="w-fit">
                  <Card className="bg-zinc-200 shadow-md dark:bg-zinc-700">
                    <CardHeader
                      title={`Missions for Tek Stryder on level ${state.level}`}
                      titleProps={{
                        className:
                          "!text-xs !font-semibold uppercase font-poppins",
                      }}
                      subheader={Math.floor(1 + 48 * (state.level / 150))}
                      subheaderProps={{ className: "text-xl !font-bold" }}
                    />
                  </Card>
                </div>
              )}

              <Form<TamingCalculatorForm>
                config={{
                  mode: "onChange",
                }}
                onSubmit={(data) => {
                  dispatch({
                    type: "FORM_SUBMIT",
                    payload: {
                      form: {
                        ...data,
                        selected_food:
                          parseInt(
                            (
                              data?.selected_food || state.foods[0].id
                            ).toString()
                          ) || null,
                      },
                    },
                  });
                  dispatch({
                    type: "CALC_TAMING_FOOD",
                  });
                  dispatch({
                    type: "CALC_WEAPON",
                  });
                }}
              >
                <Input
                  label="Level"
                  name="level"
                  variant="standard"
                  color="success"
                  defaultValue={state.level}
                  validation={{
                    required: true,
                    valueAsNumber: true,
                    min: 1,
                    max: 500,
                  }}
                  type="number"
                />
                <br />
                <Input
                  label="Seconds Between Hits"
                  name="seconds_between_hits"
                  variant="standard"
                  color="success"
                  defaultValue={state.seconds_between_hits}
                  validation={{
                    valueAsNumber: true,
                    min: 1,
                    max: 500,
                  }}
                  type="number"
                />

                {dino?.x_variant && (
                  <Switch onLabel="X Variant" name="x_variant" />
                )}

                <br />
                <Label
                  name="selected_food"
                  className="rw-label"
                  errorClassName="rw-label rw-label-error"
                >
                  Select Food
                </Label>

                <CheckboxGroup
                  className="animate-fade-in"
                  name="selected_food"
                  form={true}
                  defaultValue={[state?.selected_food?.toString() ?? ""]}
                  validation={{
                    required: true,
                    single: true,
                  }}
                  options={state.foods.map(({ id, name, max, image }) => ({
                    value: id as number,
                    label: `${name} (${max})`,
                    image: `https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/${image}`,
                  }))}
                />

                <FieldError name="selected_food" className="rw-field-error" />

                <Button
                  variant="contained"
                  color="success"
                  className="my-3"
                  type="submit"
                >
                  Calculate
                </Button>

                {tameData && (
                  <>
                    <Card variant="outlined">
                      {/* TODO: use new light */}
                      <CardContent className="border-b border-inherit">
                        <ol className="w-full items-center justify-center space-y-4 sm:flex sm:space-x-8 sm:space-y-0">
                          {[
                            {
                              name: "Current",
                              sub: `Lvl ${state.level}`,
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
                              sub: `Lvl ${state.level + tameData.levelsGained}`,
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
                              sub: `Lvl ${state.level +
                                tameData.levelsGained +
                                (state.x_variant && dino.x_variant ? 88 : 73)
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
                              className="flex items-center space-x-2.5 [&>*]:border-zinc-500 [&>*]:fill-zinc-500 [&>*]:dark:border-white [&>*]:dark:fill-white [&:last-of-type>svg]:hidden"
                            >
                              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border p-1 md:h-12 md:w-12 md:p-3">
                                {icon}
                              </span>
                              <span>
                                <h3 className="font-medium leading-tight">
                                  {name}
                                </h3>
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
                                className="h-6 w-6 rotate-90 transform md:rotate-0"
                                viewBox="0 0 256 512"
                              >
                                <path d="M219.9 266.7L75.89 426.7c-5.906 6.562-16.03 7.094-22.59 1.188c-6.918-6.271-6.783-16.39-1.188-22.62L186.5 256L52.11 106.7C46.23 100.1 46.75 90.04 53.29 84.1C59.86 78.2 69.98 78.73 75.89 85.29l144 159.1C225.4 251.4 225.4 260.6 219.9 266.7z" />
                              </svg>
                            </li>
                          ))}
                        </ol>
                      </CardContent>
                      <CardContent>
                        <div className="relative my-3 grid grid-cols-5 gap-4 text-center">
                          {!!tameData.totalTorpor &&
                            !!tameData.torporDepletionPS && (
                              <div className="flex flex-col items-center">
                                <p className="font-light">
                                  Torpor Drain Rate:{" "}
                                  <span
                                    className={clsx(`font-bold`, {
                                      "text-pea-500":
                                        tameData.torporDepletionPS < 1,
                                      "text-yellow-500":
                                        tameData.torporDepletionPS >= 1 &&
                                        tameData.torporDepletionPS < 2,
                                      "text-red-500":
                                        tameData.torporDepletionPS >= 2,
                                    })}
                                  >
                                    {tameData.torporDepletionPS.toFixed(1)}/s
                                  </span>
                                </p>

                                <p>
                                  {timeFormatL(
                                    tameData.totalTorpor /
                                    tameData.torporDepletionPS
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
                              const newName = name
                                .replace("Min", "")
                                .toLowerCase();
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
                              );
                            })}
                        </div>
                      </CardContent>
                    </Card>
                    <section>
                      {/* <p className="rw-label">With selected food:</p>
                      <div className="rounded-t-md border border-zinc-500 bg-zinc-300 p-4 dark:bg-zinc-600 dark:text-white">
                        <ol className="w-full items-center justify-center space-y-4 sm:flex sm:space-x-8 sm:space-y-0">
                          {[
                            {
                              name: "Current",
                              sub: `Lvl ${state.level}`,
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
                              sub: `Lvl ${state.level + tameData.levelsGained}`,
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
                              sub: `Lvl ${
                                state.level +
                                tameData.levelsGained +
                                (state.x_variant && dino.x_variant ? 88 : 73)
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
                              className="flex items-center space-x-2.5 [&>*]:border-zinc-500 [&>*]:fill-zinc-500 [&>*]:dark:border-white [&>*]:dark:fill-white [&:last-of-type>svg]:hidden"
                            >
                              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border p-1 md:h-12 md:w-12 md:p-3">
                                {icon}
                              </span>
                              <span>
                                <h3 className="font-medium leading-tight">
                                  {name}
                                </h3>
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
                                className="h-6 w-6 rotate-90 transform md:rotate-0"
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
                          {!!tameData.totalTorpor &&
                            !!tameData.torporDepletionPS && (
                              <div className="flex flex-col items-center">
                                <p className="font-light">
                                  Torpor Drain Rate:{" "}
                                  <span
                                    className={clsx(`font-bold`, {
                                      "text-pea-500":
                                        tameData.torporDepletionPS < 1,
                                      "text-yellow-500":
                                        tameData.torporDepletionPS >= 1 &&
                                        tameData.torporDepletionPS < 2,
                                      "text-red-500":
                                        tameData.torporDepletionPS >= 2,
                                    })}
                                  >
                                    {tameData.torporDepletionPS.toFixed(1)}/s
                                  </span>
                                </p>

                                <p>
                                  {timeFormatL(
                                    tameData.totalTorpor /
                                      tameData.torporDepletionPS
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
                              const newName = name
                                .replace("Min", "")
                                .toLowerCase();
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
                              );
                            })}
                        </div>
                      </div> */}

                      {state.weapons && (
                        <>
                          <h4 className="rw-label">Knock Out</h4>
                          <div className="max-w-screen relative flex flex-row gap-3 overflow-x-auto rounded-md text-center">
                            {state.weapons
                              .sort((a, b) => b.userDamage > a.userDamage)
                              .map(
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
                                  <Card
                                    variant="outlined"
                                    className={clsx("min-w-[200px] mb-3 flex flex-col pb-2", {
                                      "rw-img-disable !text-gray-500":
                                        !isPossible || chanceOfDeath >= 99,
                                    })}
                                  >
                                    <div className="mt-4 inline-flex items-center justify-center">
                                      <CardMedia
                                        className="max-h-24"
                                        image={`https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/${image}`}
                                        src={`https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/${image}`}
                                      />
                                    </div>
                                    <CardHeader
                                      title={
                                        <Button
                                          variant="text"
                                          color="success"
                                          size="small"
                                          to={routes.item({ id })}
                                        >
                                          {name}
                                        </Button>
                                      }
                                      subheader={
                                        isPossible ? (
                                          <Counter
                                            startNumber={0}
                                            endNumber={hits}
                                            duration={3000 / hits}
                                          />
                                        ) : (
                                          <p>Not Possible</p>
                                        )
                                      }
                                    />
                                    {chanceOfDeath > 0 && isPossible && (
                                      <Badge
                                        className="m-2"
                                        fullWidth
                                        content={`${chanceOfDeath}% chance of death`}
                                        variant="outlined"
                                        color={chanceOfDeathHigh
                                          ? 'error'
                                          : chanceOfDeath > 30 &&
                                            chanceOfDeath < 60
                                            ? 'warning'
                                            : !chanceOfDeathHigh
                                              ? 'primary'
                                              : 'DEFAULT'
                                        }
                                        standalone
                                      />
                                    )}
                                    {hitboxes.length > 0 && (
                                      <Badge
                                        className="m-2"
                                        variant="standard"
                                        color="secondary"
                                        content={
                                          hitboxes.map(
                                            ({ name, multiplier }) => (
                                              <span
                                                key={`hitbox-${name}`}
                                              >{`${name} - ${multiplier}x`}</span>
                                            )
                                          )
                                        }
                                        standalone
                                      />
                                    )}
                                    <div className="relative w-full max-w-max px-2 self-end place-self-end mt-auto">
                                      <Input
                                        label="Percent"
                                        size="small"
                                        margin="none"
                                        fullWidth
                                        defaultValue={userDamage}
                                        disabled={
                                          !isPossible || chanceOfDeath >= 99
                                        }
                                        InputProps={{
                                          endAdornment: (
                                            <svg
                                              xmlns="http://www.w3.org/2000/svg"
                                              className="h-4 text-gray-500 dark:text-gray-400"
                                              viewBox="0 0 384 512"
                                              fill="currentColor"
                                            >
                                              <path d="M379.3 68.69c-6.25-6.25-16.38-6.25-22.62 0l-352 352c-6.25 6.25-6.25 16.38 0 22.62C7.813 446.4 11.91 448 16 448s8.188-1.562 11.31-4.688l352-352C385.6 85.06 385.6 74.94 379.3 68.69zM64 192c35.35 0 64-28.65 64-64S99.35 64.01 64 64.01c-35.35 0-64 28.65-64 63.1S28.65 192 64 192zM64 96c17.64 0 32 14.36 32 32S81.64 160 64 160S32 145.6 32 128S46.36 96 64 96zM320 320c-35.35 0-64 28.65-64 64s28.65 64 64 64c35.35 0 64-28.65 64-64S355.3 320 320 320zM320 416c-17.64 0-32-14.36-32-32s14.36-32 32-32s32 14.36 32 32S337.6 416 320 416z" />
                                            </svg>
                                          ),
                                        }}
                                        onChange={debounce((e) => {
                                          dispatch({
                                            type: "CALC_WEAPON",
                                            payload: {
                                              id,
                                              value: parseInt(e.target.value),
                                            },
                                          });
                                        }, 300)}
                                      />
                                    </div>
                                  </Card>
                                )
                              )}
                          </div>
                        </>
                      )}
                      <Button variant="outlined" className="my-4" to={`https://www.youtube.com/results?search_query=ark+${dino.name}+taming`}>
                        Youtube tutorial on how to tame this dino
                      </Button>
                    </section>
                  </>
                )}
              </Form>
            </section>
          </Tab>
          <Tab
            label="Breeding / Reproduction"
            disabled={
              (!dino.maturation_time && !dino.incubation_time) ||
              (dino.egg_max == null && dino.egg_min == null)
            }
            icon={
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 448 512"
                  fill="currentColor"
                  className="pointer-events-none h-4 w-4"
                >
                  <path d="M446.8 41.89c-1.621-3.918-4.742-7.039-8.66-8.66c-1.955-.8086-4.047-1.23-6.129-1.23L304 32C295.2 32 288 39.16 288 48S295.2 64 304 64h89.38l-104.8 104.8C258.1 143.3 218.8 128 176 128C78.8 128 0 206.8 0 304S78.8 480 176 480S352 401.2 352 304c0-42.84-15.34-82.08-40.78-112.6L416 86.63V176C416 184.8 423.2 192 432 192S448 184.8 448 176v-128C448 45.92 447.6 43.85 446.8 41.89zM320 304c0 79.4-64.6 144-144 144S32 383.4 32 304S96.6 160 176 160S320 224.6 320 304z" />
                </svg>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 448 512"
                  fill="currentColor"
                  className="pointer-events-none mr-2 h-4 w-4"
                >
                  <path d="M368 176c0-97.2-78.8-176-176-176c-97.2 0-176 78.8-176 176c0 91.8 70.31 167.1 160 175.2V400h-64C103.2 400 96 407.2 96 416s7.156 16 16 16h64v64c0 8.844 7.156 16 16 16s16-7.156 16-16v-64h64c8.844 0 16-7.156 16-16s-7.156-16-16-16h-64v-48.81C297.7 343.1 368 267.8 368 176zM48 176C48 96.6 112.6 32 192 32s144 64.6 144 144S271.4 320 192 320S48 255.4 48 176z" />
                </svg>
              </>
            }
          >
            <section className="space-y-3">
              {dino.maturation_time != 0 && dino.incubation_time && (
                <>
                  <p className="rw-label !text-center">{dino.name} breeding:</p>
                  <div className="mx-auto flex justify-center">
                    <Input
                      color="success"
                      label="Maturation Percent"
                      defaultValue={0}
                      InputProps={{
                        min: 0,
                        max: 100,
                        endAdornment: (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 text-gray-500 dark:text-gray-400"
                            viewBox="0 0 384 512"
                            fill="currentColor"
                          >
                            <path d="M379.3 68.69c-6.25-6.25-16.38-6.25-22.62 0l-352 352c-6.25 6.25-6.25 16.38 0 22.62C7.813 446.4 11.91 448 16 448s8.188-1.562 11.31-4.688l352-352C385.6 85.06 385.6 74.94 379.3 68.69zM64 192c35.35 0 64-28.65 64-64S99.35 64.01 64 64.01c-35.35 0-64 28.65-64 63.1S28.65 192 64 192zM64 96c17.64 0 32 14.36 32 32S81.64 160 64 160S32 145.6 32 128S46.36 96 64 96zM320 320c-35.35 0-64 28.65-64 64s28.65 64 64 64c35.35 0 64-28.65 64-64S355.3 320 320 320zM320 416c-17.64 0-32-14.36-32-32s14.36-32 32-32s32 14.36 32 32S337.6 416 320 416z" />
                          </svg>
                        ),
                      }}
                      onChange={debounce((event) => {
                        dispatch({
                          type: "SET_MATURATION",
                          payload: {
                            value: parseInt(
                              event.target ? event.target["value"] : 0
                            ),
                          },
                        });
                      }, 300)}
                    />
                  </div>

                  <ol className="w-full items-center justify-center space-y-4 sm:flex sm:space-x-8 sm:space-y-0">
                    {[
                      {
                        name: "Incubation",
                        time:
                          dino.incubation_time / state.settings.hatchMultiplier,
                      },
                      {
                        name: "Baby",
                        time: (dino.maturation_time * 1) / 10,
                      },
                      {
                        name: "Juvenile",
                        time:
                          (dino?.maturation_time * 1) / 2 -
                          (dino?.maturation_time * 1) / 10,
                      },
                      {
                        name: "Adolescent",
                        time:
                          (dino?.maturation_time *
                            state.settings.matureMultiplier) /
                          2,
                      },
                      {
                        name: "Total",
                        time:
                          dino?.maturation_time *
                          state.settings.matureMultiplier,
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
                          fill="currentColor"
                        >
                          <path d="M219.9 266.7L75.89 426.7c-5.906 6.562-16.03 7.094-22.59 1.188c-6.918-6.271-6.783-16.39-1.188-22.62L186.5 256L52.11 106.7C46.23 100.1 46.75 90.04 53.29 84.1C59.86 78.2 69.98 78.73 75.89 85.29l144 159.1C225.4 251.4 225.4 260.6 219.9 266.7z" />
                        </svg>
                      </li>
                    ))}
                  </ol>
                </>
              )}

              {dino.egg_max != null &&
                dino.egg_min != null &&
                dino.egg_max > 0 &&
                dino.egg_min > 0 && (
                  <Card
                    variant="outlined"
                    className="flex w-fit flex-col items-center justify-center"
                  >
                    <CardMedia
                      image={`https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/dodo-egg.webp`}
                      className="aspect-square p-2"
                    />
                    <CardContent className="flex flex-col space-y-3">
                      <h3 className="rw-label mt-0 font-medium leading-tight">
                        Egg Temperature
                      </h3>
                      <p className="inline-flex gap-2 text-sm">
                        <Badge
                          color="primary"
                          variant="outlined"
                          content={`${dino.egg_min}°C`}
                          standalone
                        />
                        -
                        <Badge
                          color="error"
                          variant="outlined"
                          content={`${dino.egg_max}°C`}
                          standalone
                        />
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 512 512"
                          className="w-4"
                          fill="currentColor"
                        >
                          <path d="M160 338.8V144C160 135.1 152.9 128 144 128S128 135.1 128 144v194.8c-18.62 6.625-32 24.38-32 45.25c0 26.5 21.5 48 47.1 48C170.5 432 192 410.5 192 384C192 363.1 178.6 345.4 160 338.8zM240 96c0-53-43-95.1-96-95.1C91 .0001 48 43 48 96v203.4c-19.75 22.38-31.88 51.75-32 84C15.63 453.6 72.75 511.5 143.1 512L144 512c70.75 0 128-57.25 128-128c0-32.5-12.12-62.13-32-84.63V96zM144 480H143.4c-52.75-.375-95.62-43.75-95.37-96.5c.25-39.5 22.5-61.38 32-72V96c0-35.25 28.75-64 63.1-64c35.25 0 64 28.75 64 64v215.5c9.125 10.38 32 32.63 32 72.5C240 436.9 196.9 480 144 480zM336 64h160C504.8 64 512 56.8 512 48C512 39.2 504.8 32 496 32h-160C327.2 32 320 39.2 320 48C320 56.8 327.2 64 336 64zM496 160h-160C327.2 160 320 167.2 320 176C320 184.8 327.2 192 336 192h160C504.8 192 512 184.8 512 176C512 167.2 504.8 160 496 160zM496 288h-128C359.2 288 352 295.2 352 304c0 8.799 7.201 16 16 16h128c8.801 0 16-7.201 16-16C512 295.2 504.8 288 496 288z" />
                        </svg>
                      </p>
                    </CardContent>
                  </Card>
                )}
            </section>
          </Tab>
          {dino.DinoStat.some(
            (d) => d.type == "bossrecipe" || d.type == "saddle"
          ) && (
              <Tab label="Recipes">
                <section className="animate-fade-in">
                  {dino?.DinoStat.some((d) => d.type == "saddle") && (
                    <>
                      <h4 className="rw-label">Saddle Crafting Recipe</h4>
                      {dino.DinoStat.filter((d) => d.type === "saddle").map(
                        (
                          {
                            Item: {
                              id: itemid,
                              name,
                              image,
                              ItemRecipe_ItemRecipe_crafted_item_idToItem,
                            },
                          },
                          idx
                        ) => (
                          <div
                            className="flex h-64 gap-4 overflow-hidden rounded-lg border border-zinc-500 bg-gray-200 p-4 dark:bg-zinc-600"
                            key={`Saddle-${idx}`}
                          >
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
                                  key={`saddle-item-${i}`}
                                  className={clsx(
                                    "flex h-full flex-row items-center transition-all duration-500 ease-in-out",
                                    {
                                      "flex-grow":
                                        state.activeRecipeTabIndex === i,
                                      "flex-grow-0":
                                        state.activeRecipeTabIndex !== i,
                                    }
                                  )}
                                  onClick={() =>
                                    dispatch({
                                      type: "RECIPE_TAB_CHANGE",
                                      payload: {
                                        value: i,
                                      },
                                    })
                                  }
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
                                          hidden:
                                            state.activeRecipeTabIndex !== i,
                                          block: state.activeRecipeTabIndex === i,
                                        }
                                      )}
                                    >
                                      <div className="flex flex-row flex-wrap gap-2">
                                        {ItemRecipeItem.map(
                                          ({ Item, amount }, i) => (
                                            <Button
                                              className="aspect-square"
                                              to={routes.item({
                                                id: Item.id,
                                              })}
                                              variant="outlined"
                                              color="DEFAULT"
                                              title={Item.name}
                                              key={`recipe-${Item.id}`}
                                            >
                                              <img
                                                className="h-10 w-10"
                                                src={`https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/${Item.image}`}
                                                alt={Item.name}
                                              />
                                              <div className="absolute -bottom-1 right-0 inline-flex h-6 w-6 items-center justify-center rounded-full bg-transparent text-xs font-bold">
                                                {amount}
                                              </div>
                                            </Button>
                                          )
                                        )}
                                      </div>

                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 448 512"
                                        fill="currentColor"
                                        className="h-12 w-12"
                                      >
                                        <path d="M427.8 266.8l-160 176C264.7 446.3 260.3 448 256 448c-3.844 0-7.703-1.375-10.77-4.156c-6.531-5.938-7.016-16.06-1.078-22.59L379.8 272H16c-8.844 0-15.1-7.155-15.1-15.1S7.156 240 16 240h363.8l-135.7-149.3c-5.938-6.531-5.453-16.66 1.078-22.59c6.547-5.906 16.66-5.469 22.61 1.094l160 176C433.4 251.3 433.4 260.7 427.8 266.8z" />
                                      </svg>

                                      <Button
                                        className="aspect-square"
                                        to={routes.item({
                                          id: itemid,
                                        })}
                                        variant="outlined"
                                        color="DEFAULT"
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
                                      </Button>
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
              </Tab>
            )}
        </Tabs>
      </section>

      <ButtonGroup className="col-span-2">
        <Button
          permission="gamedata_update"
          color="primary"
          variant="outlined"
          to={routes.editDino({ id: dino.id })}
          startIcon={
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
              <path d="M493.2 56.26l-37.51-37.51C443.2 6.252 426.8 0 410.5 0c-16.38 0-32.76 6.25-45.26 18.75L45.11 338.9c-8.568 8.566-14.53 19.39-17.18 31.21l-27.61 122.8C-1.7 502.1 6.158 512 15.95 512c1.047 0 2.116-.1034 3.198-.3202c0 0 84.61-17.95 122.8-26.93c11.54-2.717 21.87-8.523 30.25-16.9l321.2-321.2C518.3 121.7 518.2 81.26 493.2 56.26zM149.5 445.2c-4.219 4.219-9.252 7.039-14.96 8.383c-24.68 5.811-69.64 15.55-97.46 21.52l22.04-98.01c1.332-5.918 4.303-11.31 8.594-15.6l247.6-247.6l82.76 82.76L149.5 445.2zM470.7 124l-50.03 50.02l-82.76-82.76l49.93-49.93C393.9 35.33 401.9 32 410.5 32s16.58 3.33 22.63 9.375l37.51 37.51C483.1 91.37 483.1 111.6 470.7 124z" />
            </svg>
          }
        >
          Edit
        </Button>
        <Button
          permission="gamedata_delete"
          color="error"
          variant="outlined"
          onClick={() => onDeleteClick(dino.id)}
          startIcon={
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
              <path d="M432 64h-96l-33.63-44.75C293.4 7.125 279.1 0 264 0h-80C168.9 0 154.6 7.125 145.6 19.25L112 64h-96C7.201 64 0 71.2 0 80c0 8.799 7.201 16 16 16h416c8.801 0 16-7.201 16-16C448 71.2 440.8 64 432 64zM152 64l19.25-25.62C174.3 34.38 179 32 184 32h80c5 0 9.75 2.375 12.75 6.375L296 64H152zM400 128C391.2 128 384 135.2 384 144v288c0 26.47-21.53 48-48 48h-224C85.53 480 64 458.5 64 432v-288C64 135.2 56.84 128 48 128S32 135.2 32 144v288C32 476.1 67.89 512 112 512h224c44.11 0 80-35.89 80-80v-288C416 135.2 408.8 128 400 128zM144 416V192c0-8.844-7.156-16-16-16S112 183.2 112 192v224c0 8.844 7.156 16 16 16S144 424.8 144 416zM240 416V192c0-8.844-7.156-16-16-16S208 183.2 208 192v224c0 8.844 7.156 16 16 16S240 424.8 240 416zM336 416V192c0-8.844-7.156-16-16-16S304 183.2 304 192v224c0 8.844 7.156 16 16 16S336 424.8 336 416z" />
            </svg>
          }
        >
          Delete
        </Button>
      </ButtonGroup>
    </article>
  );
};

export default Dino;
