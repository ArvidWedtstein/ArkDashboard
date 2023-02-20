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
import { useEffect, useState } from "react";
import Counter from "src/components/Util/Counter/Counter";
import Table from "src/components/Util/Table/Table";
import { combineBySummingKeys } from "src/lib/formatters";
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

  const onSubmit = (data) => {
    // console.log(getEstimatedStat("food", data.name, data.level))
    let dino = arkdinos.find(
      (d) => d.name.toLowerCase() === data.name.toLowerCase()
    );
    if (!dino) return null;
    let t = Object.entries(dino.baseStats).map(([key, value]) => {
      return {
        stat: key,
        base: value.b,
        increasePerLevelWild: value.w || null,
        increasePerLevelTamed: value.t || null,
        dino: (value.b && value.w && level[key] ? value.b + value.w * level[key] : null),
      };
    });
    setValue("level", data.level);
    setPoints(data.level - 1);
    setDino(t);
    let c = calcData({ creature: dino, level: data.level, method: "v" })
    for (let i in c.food) {
      c.food[i].results = calcTame({ cr: dino, level: data.level, foods: c.food, i })
    }
    setSelect(c);

    // console.log(calcData({ creature: dino, level: data.level, method: "v" }));
  };

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

  // const getEstimatedStat = (stat, dino, level) => {
  //   let d = arkdinos.find(
  //     (d) => d.name.toLowerCase() === dino.toLowerCase()
  //   );
  //   if (!d) return null;

  //   let numEligibleStats = 0;
  //   if (d.baseStats[stat].increasePerLevelWild > 0 && d.baseStats[stat].base >= 0) {
  //     if (typeof d.baseStats["oxygen"] === 'object' && d.baseStats["oxygen"].base == null) {
  //       numEligibleStats = 5;
  //     } else {
  //       numEligibleStats = 6;
  //     }

  //     let numLevels = 0;
  //     if (level > 0) {
  //       numLevels = level - 1;
  //     } else {
  //       numLevels = 1;
  //     }
  //     let estFoodLevels = Math.round(numLevels / numEligibleStats);
  //     return d.baseStats[stat].base + d.baseStats[stat].increasePerLevelWild * estFoodLevels;

  //   } else {
  //     return d.baseStats[stat].base;
  //   }
  // }
  let settings = {
    consumptionMultiplier: 1,
    tamingMultiplier: 1,
  }


  const calcData = ({ creature, level, method = "v", selectedFood }: any) => {
    const affinityNeeded = creature.affinityNeeded + creature.affinityIncreasePerLevel * level;
    const foodConsumption = creature.foodConsumptionBase * creature.foodConsumptionMult * settings.consumptionMultiplier * (method === "n" ? creature.nonViolentFoodRateMultiplier : 1);

    const foods = creature.eats.map((foodName: any, index: number) => {
      const food: any = items.items.find((item: any) => item.name.toLowerCase() === foodName.toLowerCase());
      if (!food) return null;
      const foodValue = food.stats.find((stat) => stat.id === 8)?.value || 0;
      const affinityValue = food.stats.find((stat) => stat.id === 15)?.value || 0;
      const foodMaxRaw = affinityNeeded / affinityValue / 4;
      const foodMax = Math.ceil(foodMaxRaw);
      const isFoodSelected = food.itemId === selectedFood;
      let interval = null;
      let interval1 = null;
      let foodSecondsPer = 0;
      let foodSeconds = 0;
      if (method === "n") {
        const baseStat = creature.baseStats?.f;
        if (typeof baseStat?.b === "number" && typeof baseStat?.w === "number") {
          const averagePerStat = Math.round(level / 7);
          const estimatedFood = baseStat.b + baseStat.w * averagePerStat;
          const requiredFood = Math.max(estimatedFood * 0.1, foodValue);
          interval1 = requiredFood / foodConsumption;
        }
        interval = foodValue / foodConsumption;
        if (foodMax > 1) {
          foodSecondsPer = foodValue / foodConsumption;
          foodSeconds = Math.ceil(Math.max(foodMax - (typeof interval1 === "number" ? 2 : 1), 0) * foodSecondsPer + (interval1 || 0));
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
    }).filter(food => !!food);
    return { food: foods, affinityNeeded };
  };



  const calcTame = ({ cr, level, foods, useExclusive, method = "v" }: any) => {
    let effectiveness = 100;
    let affinityNeeded = cr.affinityNeeded + cr.affinityIncreasePerLevel * level;
    // sanguineElixir = affinityNeeded *= 0.7

    let affinityLeft = affinityNeeded;

    let foodConsumption = cr.foodConsumptionBase * cr.foodConsumptionMult * settings.consumptionMultiplier;
    let totalFood = 0;

    let tamingMultiplier = cr.disableMultiplier ? 4 : settings.tamingMultiplier * 4;

    if (method == "n") {
      foodConsumption = foodConsumption * cr.nonViolentFoodRateMultiplier;
    }
    let tooMuchFood = false;
    let enoughFood = false
    let numUsedTotal = 0;
    let numNeeded = 0;
    let numToUse = 0;
    let totalSecs = 0;
    foods.forEach((food: any) => {
      if (!food) return;
      let foodVal = food.stats.find((f: any) => f.id === 8).value;
      let affinityVal = food.stats.find((f: any) => f.id === 15).value;
      if (affinityLeft > 0) {
        if (useExclusive >= 0) {
          if (food.key == useExclusive) {
            food.use = food.max;
          } else {
            food.use = 0;
          }
        }
        if (method == "n") {
          numNeeded = Math.ceil(affinityLeft / affinityVal / tamingMultiplier / cr.nonViolentFoodRateMultiplier);
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
          affinityLeft -= numToUse * affinityVal * tamingMultiplier * cr.nonViolentFoodRateMultiplier;
        } else {
          affinityLeft -= numToUse * affinityVal * tamingMultiplier;
        }
        totalFood += numToUse * foodVal;
        let i = 1;
        while (i <= numToUse) {
          if (method == "n") {
            effectiveness -= (Math.pow(effectiveness, 2) * cr.tamingBonusAttribute) /
              affinityVal / tamingMultiplier / cr.nonViolentFoodRateMultiplier;
          } else {
            effectiveness -= (Math.pow(effectiveness, 2) * cr.tamingBonusAttribute) /
              affinityVal / 100;
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
    })

    let neededValues = Array();

    if (affinityLeft <= 0) {
      enoughFood = true;
    } else {
      enoughFood = false;

      foods.forEach((food: any) => {
        numNeeded = Math.ceil(affinityLeft / food.stats.find((f: any) => f.id === 15).value / tamingMultiplier);
        neededValues[food.id] = numNeeded;
      })

    }

    let percentLeft = affinityLeft / affinityNeeded;
    let percentTamed = 1 - percentLeft;
    let totalTorpor = cr.baseTamingTime + cr.tamingInterval * (level - 1)
    let torporDepletionPS = cr.torporDepletionPS + Math.pow(level - 1, 0.800403041) / (22.39671632 / cr.torporDepletionPS)
    let levelsGained = Math.floor((level * 0.5 * effectiveness) / 100)

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
      percentTamed
    }
  }

  // const d = calcData({ creature: dodo, level: 100, method: 'v' });
  // console.log(d)
  // console.log(calcTame({
  //   cr: dodo, level: 100, foods: d.food, useExclusive: 0
  // }));


  const calcMaturation = () => {
    let maturation = 0;
    let maturationCalcCurrent = 0
    let weightCurrent = 0;
    let weightTotal = 30
    let mutationTimeTotal = 15002;
    if (weightCurrent > weightTotal) {
      weightCurrent = weightTotal;
    }

    weightCurrent = Math.max(weightCurrent, 0);
    let percentDone = weightCurrent / weightTotal;
    let timeElapsed = percentDone * mutationTimeTotal;
    let timeStarted = Date.now() - timeElapsed;
    let timeRemaining = (1 - percentDone) * mutationTimeTotal;

    console.log(timeRemaining)
  }


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
              <Submit className="rw-button rw-button-blue">Calc</Submit>
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

          {select && <Table
            rows={select.food}
            columns={[
              {
                field: "name",
                label: "Food",
                bold: true,
                sortable: true,
                renderCell: ({ row, rowIndex }) => {
                  return (
                    <button type="button" className=" relative rounded-full w-10 h-10 flex items-center justify-center">
                      <img className="w-8 h-8" src={"https://www.arkresourcecalculator.com/assets/images/80px-" + row.icon} />
                    </button>
                  )
                },
              },
              {
                field: "use",
                label: "Use",
                bold: true,
                renderCell: ({ row, rowIndex }) => {
                  return (
                    <div className="flex flex-row items-center" key={`${row.use}+${Math.random()}`}>
                      <button type="button" className="border border-black dark:border-white relative dark:text-white text-black hover:bg-white hover:text-black mx-2 rounded-full w-8 h-8 text-lg font-semibold" >
                        -
                      </button>
                      <p
                        defaultValue={row.use}
                        className="rw-input w-16 p-3 text-center"
                      >{row.use}/{row.max}</p>
                      <button type="button" className="border border-black dark:border-white relative dark:text-white text-black hover:bg-white hover:text-black mx-2 rounded-full w-8 h-8 text-lg font-semibold">
                        +
                      </button>
                    </div>
                  )
                }
              },
              {
                field: "seconds",
                label: "Time",
                numeric: true,
                className: "text-center",
                valueFormatter: ({ value }) => {

                  let minutes = Math.floor(value / 60);
                  let remainingSeconds = value % 60 < 10 ? `0${value % 60}` : value % 60;
                  return `${minutes}:${remainingSeconds}`;
                },
              },
              {
                field: "results",
                label: "Effectiveness",
                valueFormatter: ({ value }) => {
                  return value ? value.effectiveness : 0;
                },
              }
            ]}
          />}

        </div>
      </div>
    </>
  );
};

export default DinoStatsPage;
