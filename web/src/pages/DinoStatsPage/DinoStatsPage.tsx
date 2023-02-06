import {
  FieldError,
  Form,
  Label,
  Submit,
  TextField,
  useForm,
  useFormState,
} from "@redwoodjs/forms";
import { Link, routes } from "@redwoodjs/router";
import { MetaTags } from "@redwoodjs/web";
import { useState } from "react";
import Table, { Taybul } from "src/components/Util/Table/Table";
import { combineBySummingKeys } from "src/lib/formatters";
import arkdinos from "../../../public/arkdinos2.json";

interface stats {
  health: number;
  stamina: number;
  oxygen: number;
  food: number;
  weight: number;
  meleeDamage: number;
  movementSpeed: number;
  torpor: number;
}
const DinoStatsPage = () => {
  const {
    formState: { isDirty, isValid, isSubmitting, dirtyFields },
    getValues,
    setValue,
  } = useForm({ defaultValues: { name: "Dodo", level: 1 } });
  let [dino, setDino] = useState(null);
  let [points, setPoints] = useState(null);
  let [level, setLevel] = useState<stats>({
    health: 0,
    stamina: 0,
    oxygen: 0,
    food: 0,
    weight: 0,
    meleeDamage: 0,
    movementSpeed: 0,
    torpor: 0,
  });
  // var totalTorpor=cr.t1+cr.tI*(level-1);
  // var affinityNeeded=cr.a0+(cr.aI*level)

  const onAdd = (data) => {
    let id = data.target.id.replace("add", "");
    setLevel({ ...level, [id]: level[id] + 1 });
    setPoints(points - 1);
    let dyno = dino.find((d) => d.stat === id);
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
    // let dino = arkdinos[data.name.toLowerCase()]

    let dino = arkdinos.find(
      (d) => d.name.toLowerCase() === data.name.toLowerCase()
    );
    let t = Object.entries(dino.baseStats).map(([key, value]) => {
      return {
        stat: key,
        base: value.base,
        increasePerLevelWild: value.increasePerLevelWild || 0,
        increasePerLevelTamed: value.increasePerLevelTamed || 0,
        dino: value?.base + value.increasePerLevelWild * level[key],
      };
    });
    setValue("level", data.level);
    setPoints(data.level - 1);
    setDino(t);
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
    // Object.entries(level).forEach(([key, value]) => {
    //   setLevel({ ...level, [key]: 0 });
    // });
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
          <Table
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
              }
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
              )
            }}
          />
        </div>
      </div>
    </>
  );
};

export default DinoStatsPage;
