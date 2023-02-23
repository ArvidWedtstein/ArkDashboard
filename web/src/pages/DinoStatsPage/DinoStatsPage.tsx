import {
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
import { useEffect, useReducer, useState } from "react";
import Counter from "src/components/Util/Counter/Counter";
import Table from "src/components/Util/Table/Table";
import { combineBySummingKeys, timeFormatL } from "src/lib/formatters";
import items from "../../../public/arkitems.json";
import arkdinos from "../../../public/dinotest.json";

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
const DinoStatsPage = () => {
  const {
    formState: { isDirty, isValid, isSubmitting, dirtyFields },
    getValues,
    setValue,
  } = useForm({ defaultValues: { name: "Dodo", level: 1 } });
  let [dino, setDino] = useState(null);
  let [select, setSelect] = useState(null);
  let [tame, setTame] = useState(null);
  let [points, setPoints] = useState(null);
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

  const reducer = (state, action) => {
    switch (action.type) {
      case "COMPLETE":
        return state.map((todo) => {
          if (todo.id === action.id) {
            return { ...todo, complete: !todo.complete };
          } else {
            return todo;
          }
        });
      case "use_exclusive":

      default:
        return state;
    }
  };
  let xVariant = false;
  const [taming, dispatch] = useReducer(reducer, []);

  const onSubmit = (data) => {
    // console.log(getEstimatedStat("food", data.name, data.level))
    let dinon = arkdinos.find(
      (d) => d.name.toLowerCase() === data.name.toLowerCase()
    );
    if (!dinon) return null;
    let t = Object.entries(dinon.baseStats).map(([key, value]) => {
      return {
        stat: key,
        base: value.b,
        increasePerLevelWild: value.w || null,
        increasePerLevelTamed: value.t || null,
        dino:
          value.b && value.w && level[key]
            ? value.b + value.w * level[key]
            : null,
      };
    });
    setValue("level", data.level);
    setPoints(data.level - 1);
    setDino(t);
    let c = calcData({ creature: dinon, level: data.level, method: "v" });
    for (let i in c.food) {
      c.food[i].results = calcTame({
        cr: dinon,
        level: data.level,
        foods: c.food,
        useExclusive: i,
      });
    }
    dinon["level"] = data.level;
    setTame(calcTame({ cr: dinon, level: data.level, foods: c.food }));
    setSelect(c);
  };

  // const handleComplete = (todo) => {
  //   dispatch({ type: "COMPLETE", id: todo.id });
  // };
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

  let settings = {
    consumptionMultiplier: 1,
    tamingMultiplier: 1,
  };

  const calcData = ({ creature, level, method = "v", selectedFood }: any) => {
    const affinityNeeded =
      creature.affinityNeeded + creature.affinityIncreasePerLevel * level;
    const foodConsumption =
      creature.foodConsumptionBase *
      creature.foodConsumptionMult *
      settings.consumptionMultiplier *
      (method === "n" ? creature.nonViolentFoodRateMultiplier : 1);

    const foods = creature.eats
      .map((foodName: any, index: number) => {
        const food: any = items.items.find(
          (item: any) => item.name.toLowerCase() === foodName.toLowerCase()
        );
        if (!food) return null;
        const foodValue = food.stats ? food.stats.find((stat) => stat.id === 8)?.value : 0;
        const affinityValue =
          food.stats.find((stat) => stat.id === 15)?.value || 0;
        const foodMaxRaw = affinityNeeded / affinityValue / 4;
        const foodMax = Math.ceil(foodMaxRaw);
        const isFoodSelected = food.itemId === selectedFood;
        let interval = null;
        let interval1 = null;
        let foodSecondsPer = 0;
        let foodSeconds = 0;
        if (method === "n") {
          const baseStat = creature.baseStats?.f;
          if (
            typeof baseStat?.b === "number" &&
            typeof baseStat?.w === "number"
          ) {
            const averagePerStat = Math.round(level / 7);
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
          id: food.itemId,
          stats: food.stats,
          name: food.name,
          icon: food.image,
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
      .filter((food) => !!food);

    return {
      food: foods.map((f, i) => {
        return { ...f, key: i };
      }),
      affinityNeeded,
    };
  };
  const useExclusive = (usedFoodIndex: number) => {
    // dispatch({ type: "use_exclusive", id: usedFoodIndex });
    setSelect({
      ...select,
      food: select.food.map((f, index) => {
        if (index == usedFoodIndex) {
          return { ...f, use: f.max };
        } else {
          return { ...f, use: 0 };
        }
      }),
    });
    // setTame(calcTame({ cr: dino, level: level, foods: select.food }));
  };

  const calcTame = ({ cr, level, foods, useExclusive, method = "v" }: any) => {
    let effectiveness = 100;
    // Replace with item json
    let narcotics = {
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
      cr.affinityNeeded + cr.affinityIncreasePerLevel * level;
    // sanguineElixir = affinityNeeded *= 0.7

    let affinityLeft = affinityNeeded;

    let foodConsumption =
      cr.foodConsumptionBase *
      cr.foodConsumptionMult *
      settings.consumptionMultiplier;
    let totalFood = 0;

    let tamingMultiplier = cr.disableMultiplier
      ? 4
      : settings.tamingMultiplier * 4;

    if (method == "n") {
      foodConsumption = foodConsumption * cr.nonViolentFoodRateMultiplier;
    }
    let tooMuchFood = false;
    let enoughFood = false;
    let numUsedTotal = 0;
    let numNeeded = 0;
    let numToUse = 0;
    let totalSecs = 0;
    foods.forEach((food: any) => {
      if (!food) return;
      let foodVal = food.stats.find((f: any) => f.id === 8) ? food.stats.find((f: any) => f.id === 8).value : 0;
      let affinityVal = food.stats.find((f: any) => f.id === 15) ? food.stats.find((f: any) => f.id === 15).value : 0;

      if (affinityLeft > 0) {
        if (useExclusive >= 0) {
          if (food.key == useExclusive) {
            food.use = food.max;
          } else {
            food.use = 0;
          }
        }
        if (method == "n") {
          numNeeded = Math.ceil(
            affinityLeft /
            affinityVal /
            tamingMultiplier /
            cr.nonViolentFoodRateMultiplier
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

        if (method == "n") {
          affinityLeft -=
            numToUse *
            affinityVal *
            tamingMultiplier *
            cr.nonViolentFoodRateMultiplier;
        } else {
          affinityLeft -= numToUse * affinityVal * tamingMultiplier;
        }
        totalFood += numToUse * foodVal;
        let i = 1;
        while (i <= numToUse) {
          if (method == "n") {
            effectiveness -=
              (Math.pow(effectiveness, 2) * cr.tamingBonusAttribute) /
              affinityVal /
              tamingMultiplier /
              cr.nonViolentFoodRateMultiplier;
          } else {
            effectiveness -=
              (Math.pow(effectiveness, 2) * cr.tamingBonusAttribute) /
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

      foods.forEach((food: any) => {
        numNeeded = Math.ceil(
          affinityLeft /
          food.stats.find((f: any) => f.id === 15).value /
          tamingMultiplier
        );
        neededValues[food.key] = numNeeded;
      });
    }

    let percentLeft = affinityLeft / affinityNeeded;
    let percentTamed = 1 - percentLeft;
    let totalTorpor = cr.baseTamingTime + cr.tamingInterval * (level - 1);
    let torporDepletionPS =
      cr.torporDepletionPS +
      Math.pow(level - 1, 0.800403041) / (22.39671632 / cr.torporDepletionPS);
    let levelsGained = Math.floor((level * 0.5 * effectiveness) / 100);
    let ascerbicMushroomsMin = Math.max(
      Math.ceil(
        (totalSecs * torporDepletionPS - totalTorpor) /
        (narcotics.ascerbic.torpor +
          torporDepletionPS * narcotics.ascerbic.secs)
      ),
      0
    );
    let biotoxinsMin = Math.max(
      Math.ceil(
        (totalSecs * torporDepletionPS - totalTorpor) /
        (narcotics.bio.torpor + torporDepletionPS * narcotics.bio.secs)
      ),
      0
    );
    let narcoticsMin = Math.max(
      Math.ceil(
        (totalSecs * torporDepletionPS - totalTorpor) /
        (narcotics.narcotics.torpor +
          torporDepletionPS * narcotics.narcotics.secs)
      ),
      0
    );
    let narcoberriesMin = Math.max(
      Math.ceil(
        (totalSecs * torporDepletionPS - totalTorpor) /
        (narcotics.narcoberries.torpor +
          torporDepletionPS * narcotics.narcoberries.secs)
      ),
      0
    );
    return {
      dino: cr,
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
      ascerbicMushroomsMin,
      biotoxinsMin,
      narcoticsMin,
      narcoberriesMin,
    };
  };

  const calcMaturation = () => {
    let maturation = 0;
    let maturationCalcCurrent = 0;
    let weightCurrent = 0;
    let weightTotal = 30;
    let mutationTimeTotal = 15002;
    if (weightCurrent > weightTotal) {
      weightCurrent = weightTotal;
    }

    weightCurrent = Math.max(weightCurrent, 0);
    let percentDone = weightCurrent / weightTotal;
    let timeElapsed = percentDone * mutationTimeTotal;
    let timeStarted = Date.now() - timeElapsed;
    let timeRemaining = (1 - percentDone) * mutationTimeTotal;

    console.log(timeRemaining);
  };

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
          {/* TODO: Add pretame simulator. Assign available points to random stats */}
          {/* <Table
            rows={dino}
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
          /> */}

          {select && (
            <>
              <Table
                rows={select.food}
                columns={[
                  {
                    field: "name",
                    label: "Food",
                    bold: true,
                    sortable: true,
                    renderCell: ({ row, rowIndex }) => {
                      return (
                        <button
                          className="relative flex items-center justify-start"
                          onClick={() => useExclusive(rowIndex)}
                        >
                          <img
                            className="mr-3 h-8 w-8"
                            src={
                              "https://www.arkresourcecalculator.com/assets/images/80px-" +
                              row.icon
                            }
                          />
                          <p>{row.name}</p>
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
                          className="flex flex-row items-center"
                          key={`${row.use}+${Math.random()}`}
                        >
                          <button
                            type="button"
                            disabled={row.use <= 0}
                            className="relative mx-2 h-8 w-8 rounded-full border border-black text-lg font-semibold text-black hover:bg-white hover:text-black disabled:bg-slate-500 disabled:text-white dark:border-white dark:text-white"
                          >
                            -
                          </button>
                          <p
                            defaultValue={row.use}
                            className="rw-input w-16 p-3 text-center"
                          >
                            {row.use}/{row.max}
                          </p>
                          <button
                            type="button"
                            disabled={row.use >= row.max}
                            className="relative mx-2 h-8 w-8 rounded-full border border-black text-lg font-semibold text-black hover:bg-white hover:text-black disabled:bg-slate-500 disabled:text-white dark:border-white dark:text-white"
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
              />
              <p className="my-3 text-center text-sm dark:text-gray-200">
                With selected food:
              </p>
              <section className="my-3 rounded-md p-4 dark:bg-zinc-600 dark:text-white">
                <div className="relative my-3 grid grid-cols-4 gap-4 text-center">
                  <div className="not-last:before:content-['>'] relative block before:absolute before:ml-auto before:w-full">
                    <p className="text-thin text-sm">
                      Lvl<span className="ml-1 text-lg font-semibold">100</span>
                    </p>
                  </div>
                  <div className="not-last:before:content-['>'] relative block before:absolute before:ml-auto before:w-full">
                    <p className="text-thin text-sm">
                      {(tame.effectiveness ? tame.effectiveness : 0).toFixed(2)}
                      %
                    </p>
                  </div>
                  <div className="not-last:before:content-['>'] relative block before:absolute before:ml-auto before:w-full">
                    <p className="text-thin text-sm">
                      Lvl
                      <span className="ml-1 text-lg font-semibold">
                        {parseInt(tame.dino.level) + tame.levelsGained}
                      </span>
                    </p>
                  </div>
                  <div className="relative block before:absolute before:ml-auto before:w-full last:before:content-['']">
                    <p className="text-thin text-sm">
                      Lvl
                      <span className="ml-1 text-lg font-semibold">
                        {parseInt(tame.dino.level) +
                          tame.levelsGained +
                          (xVariant ? 88 : 77)}
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
                {tame.dino.name} breeding:
              </p>
              {/* Mating internal: 24h - 48h * matingIntervalMultiplier */}
              <p>Xp When Killed: {tame.dino.experiencePerKill * (1 + 0.1 * (tame.dino.level - 1))}xp</p>
              {(typeof tame.dino.maturationTime !== "undefined" &&
                (typeof tame.dino.incubationTime !== "undefined" || typeof tame.dino.basePoints !== "undefined")) && (
                  <section className="my-3 rounded-md p-4 dark:text-white text-stone-600">
                    <ol className="items-center justify-center w-full space-y-4 sm:flex sm:space-x-8 sm:space-y-0">
                      <li className="flex items-center space-x-2.5 dark:text-pea-500 text-pea-600">
                        <span className="flex items-center justify-center w-8 h-8 border border-pea-600 rounded-full shrink-0 dark:border-pea-500">
                          1
                        </span>
                        <span>
                          <h3 className="font-medium leading-tight">Incubation</h3>
                          <p className="text-sm">{timeFormatL(tame.dino.incubationTime / 1)}</p> {/* Hatch multiplier */}
                        </span>
                      </li>
                      <li>
                        <input id="1" type="checkbox" className="peer/item1 hidden" />
                        <label htmlFor="1" className="peer-checked/item1:dark:fill-pea-500 peer-checked/item1:fill-pea-600 dark:fill-gray-400 fill-gray-500 ">
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 " viewBox="0 0 256 512">
                            <path d="M219.9 266.7L75.89 426.7c-5.906 6.562-16.03 7.094-22.59 1.188c-6.918-6.271-6.783-16.39-1.188-22.62L186.5 256L52.11 106.7C46.23 100.1 46.75 90.04 53.29 84.1C59.86 78.2 69.98 78.73 75.89 85.29l144 159.1C225.4 251.4 225.4 260.6 219.9 266.7z" />
                          </svg>
                        </label>
                      </li>
                      <li className="flex items-center text-gray-500 dark:text-gray-400 space-x-2.5">
                        <span className="flex items-center justify-center w-8 h-8 border border-gray-500 rounded-full shrink-0 dark:border-gray-400">
                          2
                        </span>
                        <span>
                          <h3 className="font-medium leading-tight">Baby</h3>
                          <p className="text-sm">Step details here</p>
                        </span>
                      </li>
                      <li>
                        <input id="2" type="checkbox" className="peer/item2 hidden" />
                        <label htmlFor="2" className="peer-checked/item2:dark:fill-pea-500 peer-checked/item2:fill-pea-600 dark:fill-gray-400 fill-gray-500 ">
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 " viewBox="0 0 256 512">
                            <path d="M219.9 266.7L75.89 426.7c-5.906 6.562-16.03 7.094-22.59 1.188c-6.918-6.271-6.783-16.39-1.188-22.62L186.5 256L52.11 106.7C46.23 100.1 46.75 90.04 53.29 84.1C59.86 78.2 69.98 78.73 75.89 85.29l144 159.1C225.4 251.4 225.4 260.6 219.9 266.7z" />
                          </svg>
                        </label>
                      </li>
                      <li className="flex items-center text-gray-500 dark:text-gray-400 space-x-2.5">
                        <span className="flex items-center justify-center w-8 h-8 border border-gray-500 rounded-full shrink-0 dark:border-gray-400">
                          3
                        </span>
                        <span>
                          <h3 className="font-medium leading-tight">Juvenile</h3>
                          <p className="text-sm"></p>
                        </span>
                      </li>
                      <li>
                        <input id="3" type="checkbox" className="peer/item3 hidden" />
                        <label htmlFor="3" className="peer-checked/item3:dark:fill-pea-500 peer-checked/item3:fill-pea-600 dark:fill-gray-400 fill-gray-500 ">
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 " viewBox="0 0 256 512">
                            <path d="M219.9 266.7L75.89 426.7c-5.906 6.562-16.03 7.094-22.59 1.188c-6.918-6.271-6.783-16.39-1.188-22.62L186.5 256L52.11 106.7C46.23 100.1 46.75 90.04 53.29 84.1C59.86 78.2 69.98 78.73 75.89 85.29l144 159.1C225.4 251.4 225.4 260.6 219.9 266.7z" />
                          </svg>
                        </label>
                      </li>
                      <li className="flex items-center text-gray-500 dark:text-gray-400 space-x-2.5">
                        <span className="flex items-center justify-center w-8 h-8 border border-gray-500 rounded-full shrink-0 dark:border-gray-400">
                          4
                        </span>
                        <span>
                          <h3 className="font-medium leading-tight">Adolescent</h3>
                          <p className="text-sm">{timeFormatL((tame.dino.maturationTime * 1) / 2)}</p> {/*matureMultiplier */}
                        </span>
                      </li>
                      <li>
                        <input id="4" type="checkbox" className="peer/item4 hidden" />
                        <label htmlFor="4" className="peer-checked/item4:dark:fill-pea-500 peer-checked/item4:fill-pea-600 dark:fill-gray-400 fill-gray-500 ">
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 " viewBox="0 0 256 512">
                            <path d="M219.9 266.7L75.89 426.7c-5.906 6.562-16.03 7.094-22.59 1.188c-6.918-6.271-6.783-16.39-1.188-22.62L186.5 256L52.11 106.7C46.23 100.1 46.75 90.04 53.29 84.1C59.86 78.2 69.98 78.73 75.89 85.29l144 159.1C225.4 251.4 225.4 260.6 219.9 266.7z" />
                          </svg>
                        </label>
                      </li>
                      <li className="flex items-center text-gray-500 dark:text-gray-400 space-x-2.5">
                        <span className="flex items-center justify-center w-8 h-8 border border-gray-500 rounded-full shrink-0 dark:border-gray-400">
                          5
                        </span>
                        <span>
                          <h3 className="font-medium leading-tight">Total</h3>
                          <p className="text-sm">{timeFormatL(tame.dino.maturationTime * 1)}</p> {/*matureMultiplier */}
                        </span>
                      </li>
                    </ol>
                  </section>
                )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default DinoStatsPage;
