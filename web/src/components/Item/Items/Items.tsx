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
import ArkCard from "src/components/Util/ArkCard/ArkCard";
import {
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
} from "src/components/Util/Card/Card";
import { InputOutlined } from "src/components/Util/Input/Input";
import { Lookup } from "src/components/Util/Lookup/Lookup";
import Tabs, { Tab } from "src/components/Util/Tabs/Tabs";

import type { FindItems } from "types/graphql";

const ItemsList = ({
  itemsPage,
  loading = false,
}: FindItems & {
  loading?: boolean;
}) => {
  let { search, category, type } = useParams();
  const [types, setTypes] = useState<string[]>([]);
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

  type form = {
    search: string;
    category: string;
    type: string;
  };
  const onSubmit = (data: form) => {
    navigate(
      routes.items({
        ...parseSearch(
          Object.fromEntries(
            Object.entries(data).filter(([_, v]) => v != "")
          ) as form
        ),
        page: 1,
      })
    );
  };
  const [view, setView] = useState<"grid" | "list">("grid");
  const [selectedType, selectType] = useState(type || "");
  // const groupedItems = useMemo(() => groupBy(itemsPage.items, "category"), [itemsPage.items])
  return (
    <div className="rw-segment overflow-hidden">
      <Form className="w-auto" onSubmit={onSubmit}>
        <nav className="flex flex-row justify-center space-x-2">
          <div className="rw-button-group w-full !space-x-0">
            <Lookup
              label="Category"
              name="category"
              margin="none"
              options={[
                { value: "resource", label: "Resources" },
                { value: "structure", label: "Structures" },
                { value: "armor", label: "Armor" },
                { value: "weapon", label: "Weapons" },
                { value: "consumable", label: "Consumable" },
                { value: "tool", label: "Tools" },
                { value: "fertilizer", label: "Fertilizer" },
                { value: "other", label: "Other" },
              ]}
              defaultValue={[category]}
              disabled={loading}
              InputProps={{
                style: {
                  borderRadius: "0.375rem 0 0 0.375rem",
                  marginRight: "-0.5px",
                },
              }}
              onSelect={(e) => {
                switch (e[0].value.toString()) {
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
            />

            {types.length > 0 && (
              <Lookup
                name="type"
                margin="none"
                value={[selectedType]}
                options={types.map((type) => ({
                  value: type.toLowerCase().toString(),
                  label: type,
                }))}
                onSelect={(e) => {
                  console.log(e[0].value.toString());
                  selectType(e[0].value.toString());
                }}
                disabled={loading}
                validation={{
                  deps: ["category"],
                  required: false,
                }}
                InputProps={{
                  style: {
                    borderRadius: "0",
                    marginRight: "-0.5px",
                  },
                }}
              />
            )}

            <InputOutlined
              fullWidth
              name="search"
              type="search"
              label="Search"
              defaultValue={search}
              disabled={loading}
              InputProps={{
                style: {
                  borderRadius: "0 0.375rem 0.375rem 0",
                  marginRight: "-0.5px",
                },
                endAdornment: (
                  <Submit
                    className="rw-button rw-button-green"
                    disabled={loading}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 512 512"
                      className="rw-button-icon-start"
                    >
                      <path d="M507.3 484.7l-141.5-141.5C397 306.8 415.1 259.7 415.1 208c0-114.9-93.13-208-208-208S-.0002 93.13-.0002 208S93.12 416 207.1 416c51.68 0 98.85-18.96 135.2-50.15l141.5 141.5C487.8 510.4 491.9 512 496 512s8.188-1.562 11.31-4.688C513.6 501.1 513.6 490.9 507.3 484.7zM208 384C110.1 384 32 305 32 208S110.1 32 208 32S384 110.1 384 208S305 384 208 384z" />
                    </svg>
                    <span className="hidden md:block">Search</span>
                  </Submit>
                ),
              }}
            />
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
              className="rw-button rw-button-gray-outline peer-checked/list:border-pea-500 !rounded-r-none !rounded-l-lg border"
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
              className="rw-button rw-button-gray-outline peer-checked/grid:border-pea-500 border"
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

        <div className="my-3">
          {types.length > 0 && (
            <Tabs
              selectedTabIndex={types.findIndex(
                (t) => t.toLowerCase() === selectedType
              )}
              onSelect={(_, index) => {
                if (!types[index]) return;
                selectType(types[index]?.toLowerCase().toString());
              }}
            >
              {types.map((t) => (
                <Tab key={t} label={t}></Tab>
              ))}
            </Tabs>
          )}
        </div>
      </Form>

      <div
        className={clsx("grid gap-3", {
          "grid-cols-1": view === "list",
          "grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4":
            view === "grid",
        })}
      >
        {itemsPage.items.map((item, i) => (
          <>
            <Card className="hover:border-pea-500 border border-transparent transition-all duration-75 ease-in-out">
              <CardActionArea
                onClick={() => navigate(routes.item({ id: item.id }))}
                className="flex w-full justify-start text-left"
              >
                <CardHeader
                  sx={{
                    flexGrow: 1,
                  }}
                  title={item.name}
                  subheader={item.type}
                />
                <CardMedia
                  className="max-h-32 max-w-[128px] shrink p-4 pl-0"
                  image={`https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/${item.image}`}
                />
              </CardActionArea>
            </Card>
            {/* <Link
              to={routes.item({ id: item.id })}
              key={`item-${i}`}
              className="hover:border-pea-500 rounded-lg border border-transparent transition"
            >
              <ArkCard
                className="h-full border border-zinc-800 dark:border-zinc-500" // bg-[conic-gradient(at_top,_var(--tw-gradient-stops))] from-zinc-900 via-zinc-500 to-zinc-900
                title={item.name}
                subtitle={item.type}
                content={view === "list" ? item.description : ""}
                icon={{
                  src: `https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/${item.image}`,
                  alt: `${item.name}`,
                }}
              />
            </Link> */}
          </>
        ))}
      </div>
      {!loading && itemsPage.items.length === 0 && itemsPage.count === 0 && (
        <div className="w-full text-center text-black dark:text-white">
          {"No items yet. "}
          <Link to={routes.newItem()} className="rw-link">
            {"Create one?"}
          </Link>
        </div>
      )}
    </div>
  );
};

export default ItemsList;
