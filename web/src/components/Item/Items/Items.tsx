import {
  Form,
  Label,
  SearchField,
  SelectField,
  Submit,
} from "@redwoodjs/forms";
import {
  Link,
  routes,
  navigate,
  parseSearch,
  useParams,
} from "@redwoodjs/router";

import clsx from "clsx";
import { useEffect, useState } from "react";
import ArkCard from "src/components/ArkCard/ArkCard";

import type { FindItems } from "types/graphql";

const ItemsList = ({
  itemsPage,
  loading = false,
}: FindItems & {
  loading?: boolean;
}) => {
  {
    /* <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M292.3 261.1L99.41 468.4c-14.91 14.94-40.97 14.94-55.88 0c-15.41-15.41-15.41-40.47-.4219-55.47l207.8-193.3C257.3 213.7 257.7 203.6 251.7 197.1C245.6 190.6 235.6 190.3 229.1 196.3l-208.2 193.7c-27.88 27.88-27.73 73.13 .1486 101C34.56 504.4 52.36 512 71.47 512s37.07-7.438 50.97-21.34l193.3-207.8c6.016-6.469 5.657-16.59-.8282-22.62C308.4 254.3 298.3 254.7 292.3 261.1zM571.3 196.7c-6.251-6.25-16.38-6.25-22.63 0l-5.036 5.035l-46.72-43.91c2.063-24.25-6.485-48.19-23.74-65.44l-42.02-42C398.7 17.88 355.5 0 309.5 0C263.6 0 220.4 17.91 187.9 50.38C181 57.3 174.6 61.85 176.2 71.53c.8282 5.062 4.047 9.438 8.641 11.75l80.29 40.13v2.938c0 21.81 8.86 43.19 24.28 58.59l45.64 45.63C352.4 248 376.8 256.7 401.3 254.3l47.14 42.71l-11.73 11.73c-6.25 6.25-6.25 16.38 0 22.62C439.8 334.4 443.9 336 447.1 336s8.188-1.562 11.31-4.688l112-112C577.6 213.1 577.6 202.9 571.3 196.7zM471.1 274.3L417.2 225.5C413.4 222 408.2 220.6 403.3 221.6c-16.56 3.281-33.78-1.875-45.6-13.69l-45.64-45.63c-9.47-9.469-14.91-22.56-14.91-35.97V113.5c0-6.062-3.422-11.59-8.844-14.31L219.5 64.81C244.6 43.56 276.2 32 309.5 32c37.41 0 72.57 14.56 99.01 41l42.02 42c11.84 11.88 16.97 28.97 13.69 45.75c-1.063 5.375 .7344 10.94 4.75 14.72l52.01 48.88L471.1 274.3z"/></svg> */
  }

  // let itemstats = [
  //   { "id": 1, "name": "Type" },
  //   { "id": 2, "name": "Armor" },
  //   { "id": 3, "name": "Hypothermal Insulation" },
  //   { "id": 4, "name": "Hyperthermal Insulation" },
  //   { "id": 5, "name": "Durability" },
  //   { "id": 6, "name": "Weapon Damage" },
  //   {
  //     "id": 7,
  //     "name": "Health",
  //     "icon": "https://static.wikia.nocookie.net/arksurvivalevolved_gamepedia/images/f/f3/Healing.png"
  //   },
  //   {
  //     "id": 8,
  //     "name": "Food",
  //     "icon": "https://static.wikia.nocookie.net/arksurvivalevolved_gamepedia/images/a/a8/Digesting.png"
  //   },
  //   { "id": 9, "name": "Spoils" },
  //   {
  //     "id": 10,
  //     "name": "Torpor",
  //     "icon": "https://static.wikia.nocookie.net/arksurvivalevolved_gamepedia/images/4/42/Tranquilized.png"
  //   },
  //   { "id": 11, "name": "Water" },
  //   { "id": 12, "name": "Stamina" },
  //   {
  //     "id": 13,
  //     "name": "Cooldown",
  //     "icon": "https://static.wikia.nocookie.net/arksurvivalevolved_gamepedia/images/9/93/Cryo_Cooldown.png"
  //   },
  //   { "id": 14, "name": "Fertilizer Points" },
  //   { "id": 15, "name": "Affinity" },
  //   { "id": 16, "name": "Ammo" },
  //   { "id": 17, "name": "Weight Reduction" },
  //   { "id": 18, "name": "Fuel" },
  //   { "id": 19, "name": "Gather Efficiency" },
  //   { "id": 20, "name": "Other" },
  //   { "id": 21, "name": "Multipliers" }
  // ]
  let { search, category, type } = useParams();
  const [types, setTypes] = useState([]);
  useEffect(() => {
    switch (category) {
      case "structure":
        setTypes([
          "Tek",
          "Building",
          "Crafting",
          "Electrical",
          "Vehicle",
          "Elevator",
          "Adobe",
          "Utility",
          "Greenhouse",
          "Metal",
          "Wood",
          "Thatch",
          "Stone",
        ]);
        break;
      case "armor":
        setTypes([
          "Tek",
          "Riot",
          "Flak",
          "Hazard",
          "Scuba",
          "Fur",
          "Ghillie",
          "Chitin",
          "Desert",
          "Hide",
          "Cloth",
          "Saddle",
          "Attachment",
        ]);
        break;
      case "weapon":
        setTypes([
          "Explosive",
          "Ammunition",
          "Arrow",
          "Tool",
          "Attachment",
          "Shield",
          "Melee",
          "Gun",
          "Other",
        ]);
        break;
      case "consumable":
        setTypes([
          "Dish",
          "Drug",
          "Egg",
          "Food",
          "Fungus",
          "Meat",
          "Plant",
          "Seed",
          "Tool",
          "Other",
        ]);
        break;
      case "tool":
        setTypes([]);
        break;
      case "other":
        setTypes([
          "Navigation",
          "Other",
          "Artifact",
          "Tool",
          "Coloring",
          "Utility",
        ]);
        break;
      case "resource":
        setTypes([]);
        break;
      case "fertilizer":
        setTypes(["Feces"]);
        break;
      default:
        setTypes([]);
        break;
    }
  }, [category]);
  const onSubmit = (e) => {
    navigate(
      routes.items({
        ...parseSearch(
          Object.fromEntries(
            Object.entries(e).filter(([_, v]) => v != "")
          ) as any
        ),
        page: 1,
      })
    );
  };
  const [view, setView] = useState<"grid" | "list">("grid");
  // const groupedItems = useMemo(() => groupBy(itemsPage.items, "category"), [itemsPage.items])
  return (
    <div className="rw-segment overflow-hidden">
      <Form className="w-auto" onSubmit={onSubmit}>
        <nav className="flex flex-row justify-center space-x-2">
          <div className="rw-button-group w-full !space-x-0">
            <Label name="category" className="sr-only">
              Choose a category
            </Label>
            <SelectField
              name="category"
              className="rw-input mt-0 !rounded-l-lg"
              defaultValue={category}
              onChange={(e) => {
                switch (e.target.value) {
                  case "structure":
                    setTypes([
                      "Tek",
                      "Building",
                      "Crafting",
                      "Electrical",
                      "Vehicle",
                      "Elevator",
                      "Adobe",
                      "Utility",
                      "Greenhouse",
                      "Metal",
                      "Wood",
                      "Thatch",
                      "Stone",
                    ]);
                    break;
                  case "armor":
                    setTypes([
                      "Tek",
                      "Riot",
                      "Flak",
                      "Hazard",
                      "Scuba",
                      "Fur",
                      "Ghillie",
                      "Chitin",
                      "Desert",
                      "Hide",
                      "Cloth",
                      "Saddle",
                      "Attachment",
                    ]);
                    break;
                  case "weapon":
                    setTypes([
                      "Explosive",
                      "Ammunition",
                      "Arrow",
                      "Tool",
                      "Attachment",
                      "Shield",
                      "Melee",
                      "Gun",
                      "Other",
                    ]);
                    break;
                  case "consumable":
                    setTypes([
                      "Dish",
                      "Drug",
                      "Egg",
                      "Food",
                      "Fungus",
                      "Meat",
                      "Plant",
                      "Seed",
                      "Tool",
                      "Other",
                    ]);
                    break;
                  case "tool":
                    setTypes([]);
                    break;
                  case "other":
                    setTypes([
                      "Navigation",
                      "Other",
                      "Artifact",
                      "Tool",
                      "Coloring",
                      "Utility",
                    ]);
                    break;
                  case "resource":
                    setTypes([]);
                    break;
                  case "fertilizer":
                    setTypes(["Feces"]);
                    break;
                  default:
                    setTypes([]);
                    break;
                }
              }}
              validation={{
                required: false,
                shouldUnregister: true,
                validate: {
                  matchesInitialValue: (value) => {
                    return value !== "Choose a category" || "Select an Option";
                  },
                },
              }}
            >
              <option value="">Choose a category</option>
              <option value="resource">Resources</option>
              <option value="structure">Structures</option>
              <option value="armor">Armor</option>
              <option value="weapon">Weapons</option>
              <option value="consumable">Consumable</option>
              <option value="tool">Tools</option>
              <option value="fertilizer">Fertilizer</option>
              <option value="other">Other</option>
            </SelectField>
            {types.length > 0 && (
              <SelectField
                name="type"
                className="rw-input mt-0"
                defaultValue={type}
                validation={{
                  deps: ["category"],
                  required: false,
                  shouldUnregister: true,
                  validate: {
                    matchesInitialValue: (value) => {
                      return value !== "Choose a type" || "Select an Option";
                    },
                  },
                }}
              >
                <option value="">Choose a type</option>
                {types.map((type) => (
                  <option key={type} value={type.toLowerCase().toString()}>
                    {type}
                  </option>
                ))}
              </SelectField>
            )}
            <SearchField
              name="search"
              className="rw-input mt-0 w-full"
              placeholder="Search..."
              defaultValue={search}
            />
            <Submit
              className="rw-input rw-button rw-button-gray rounded-l-none"
              disabled={loading}
            >
              <span className="sr-only">Search</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                className="rw-button-icon !ml-0"
              >
                <path d="M507.3 484.7l-141.5-141.5C397 306.8 415.1 259.7 415.1 208c0-114.9-93.13-208-208-208S-.0002 93.13-.0002 208S93.12 416 207.1 416c51.68 0 98.85-18.96 135.2-50.15l141.5 141.5C487.8 510.4 491.9 512 496 512s8.188-1.562 11.31-4.688C513.6 501.1 513.6 490.9 507.3 484.7zM208 384C110.1 384 32 305 32 208S110.1 32 208 32S384 110.1 384 208S305 384 208 384z" />
              </svg>
            </Submit>
          </div>
          <div className="rw-button-group">
            <input
              type="radio"
              id="list"
              name="view"
              value="list"
              className="peer/list hidden"
              checked={view === "list"}
              onChange={() => setView("list")}
            />
            <label
              htmlFor="list"
              className="rw-button rw-button-gray peer-checked/list:border-pea-500 !rounded-r-none  border"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                className="h-5 w-5 fill-current"
              >
                <path d="M64 48H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32v-32C96 62.33 81.67 48 64 48zM64 112H32v-32h32V112zM64 368H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32v-32C96 382.3 81.67 368 64 368zM64 432H32v-32h32V432zM176 112h320c8.801 0 16-7.201 16-15.1C512 87.2 504.8 80 496 80h-320C167.2 80 160 87.2 160 95.1C160 104.8 167.2 112 176 112zM496 240h-320C167.2 240 160 247.2 160 256c0 8.799 7.201 16 16 16h320C504.8 272 512 264.8 512 256C512 247.2 504.8 240 496 240zM496 400h-320C167.2 400 160 407.2 160 416c0 8.799 7.201 16 16 16h320c8.801 0 16-7.201 16-16C512 407.2 504.8 400 496 400zM64 208H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32v-32C96 222.3 81.67 208 64 208zM64 272H32v-32h32V272z" />
              </svg>
            </label>
            <input
              type="radio"
              id="grid"
              name="view"
              value="grid"
              className="peer/grid hidden"
              checked={view === "grid"}
              onChange={() => setView("grid")}
            />
            <label
              htmlFor="grid"
              className="rw-button rw-button-gray peer-checked/grid:border-pea-500 border"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                className="h-5 w-5 fill-current"
              >
                <path d="M160 0H64C28.65 0 0 28.65 0 64v96c0 35.35 28.65 64 64 64h96c35.35 0 64-28.65 64-64V64C224 28.65 195.3 0 160 0zM192 160c0 17.64-14.36 32-32 32H64C46.36 192 32 177.6 32 160V64c0-17.64 14.36-32 32-32h96c17.64 0 32 14.36 32 32V160zM160 288H64c-35.35 0-64 28.65-64 64v96c0 35.35 28.65 64 64 64h96c35.35 0 64-28.65 64-64v-96C224 316.7 195.3 288 160 288zM192 448c0 17.64-14.36 32-32 32H64c-17.64 0-32-14.36-32-32v-96c0-17.64 14.36-32 32-32h96c17.64 0 32 14.36 32 32V448zM448 0h-96c-35.35 0-64 28.65-64 64v96c0 35.35 28.65 64 64 64h96c35.35 0 64-28.65 64-64V64C512 28.65 483.3 0 448 0zM480 160c0 17.64-14.36 32-32 32h-96c-17.64 0-32-14.36-32-32V64c0-17.64 14.36-32 32-32h96c17.64 0 32 14.36 32 32V160zM448 288h-96c-35.35 0-64 28.65-64 64v96c0 35.35 28.65 64 64 64h96c35.35 0 64-28.65 64-64v-96C512 316.7 483.3 288 448 288zM480 448c0 17.64-14.36 32-32 32h-96c-17.64 0-32-14.36-32-32v-96c0-17.64 14.36-32 32-32h96c17.64 0 32 14.36 32 32V448z" />
              </svg>
            </label>
          </div>
        </nav>
      </Form>

      <div
        className={clsx("grid gap-4 overflow-y-hidden", {
          "grid-cols-1": view === "list",
          "grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6":
            view === "grid",
        })}
      >
        {itemsPage.items.map((item, i) => (
          <Link
            to={routes.item({ id: item.id.toString() })}
            key={`item-${i}`}
            className="hover:border-pea-500 rounded-3xl border border-transparent transition"
          >
            <ArkCard
              className="border border-gray-800 dark:border-gray-500" // bg-[conic-gradient(at_top,_var(--tw-gradient-stops))] from-zinc-900 via-zinc-500 to-zinc-900
              title={item.name}
              subtitle={item.type}
              content={view === "list" ? item.description : ""}
              icon={{
                src: `https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/${item.image}`,
                alt: `${item.name}`,
              }}
            />
          </Link>
        ))}
      </div>
      {!loading && itemsPage.items.length === 0 && itemsPage.count === 0 && (
        <div className="rw-text-center w-full">
          {"No items yet. "}
          <Link to={routes.newItem()} className="rw-link">
            {"Create one?"}
          </Link>
        </div>
      )}
      {loading === true && (
        <div className="flex h-full w-full items-center justify-center bg-transparent">
          <span className="inline-block h-16 w-16 animate-spin rounded-full border-t-4 border-r-2 border-black border-transparent dark:border-white"></span>
        </div>
      )}
    </div>
  );
};

export default ItemsList;
