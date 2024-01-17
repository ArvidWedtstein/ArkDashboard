import { CheckboxField, Form, Label, Submit, set } from "@redwoodjs/forms/dist";
import {
  Link,
  routes,
  navigate,
  parseSearch,
  useParams,
} from "@redwoodjs/router";
import clsx from "clsx";
import { Fragment, useState } from "react";
import Button, { ButtonGroup } from "src/components/Util/Button/Button";
import {
  Card,
  CardActionArea,
  CardHeader,
  CardMedia,
} from "src/components/Util/Card/Card";
import Disclosure from "src/components/Util/Disclosure/Disclosure";
import { Input } from "src/components/Util/Input/Input";
import { Lookup } from "src/components/Util/Lookup/Lookup";
import { Modal, useModal } from "src/components/Util/Modal/Modal";
import Tabs, { Tab } from "src/components/Util/Tabs/Tabs";
import {
  ToggleButton,
  ToggleButtonGroup,
} from "src/components/Util/ToggleButton/ToggleButton";

import type { FindItems } from "types/graphql";

const ItemsList = ({
  itemsPage,
  loading = false,
}: FindItems & {
  loading?: boolean;
}) => {
  let { search, category, type } = useParams();

  type LookupOption = {
    value: string;
    label: string;
  };
  type Category = LookupOption & {
    types: LookupOption[];
  };

  const categories: Category[] = [
    {
      value: "resource",
      label: "Resources",
      types: [{ value: "resource", label: "Resources" }],
    },
    {
      value: "structure",
      label: "Structures",
      types: [
        { value: "tek", label: "Tek" },
        { value: "greenhouse", label: "Greenhouse" },
        { value: "metal", label: "Metal" },
        { value: "stone", label: "Stone" },
        { value: "adobe", label: "Adobe" },
        { value: "wood", label: "Wood" },
        { value: "thatch", label: "Thatch" },
        { value: "building", label: "Building" },
        { value: "crafting", label: "Crafting" },
        { value: "electrical", label: "Electrical" },
        { value: "vehicle", label: "Vehicle" },
        { value: "elevator", label: "Elevator" },
        { value: "utility", label: "Utility" },
      ],
    },
    {
      value: "armor",
      label: "Armor",
      types: [
        { value: "tek", label: "Tek" },
        { value: "tiot", label: "Riot" },
        { value: "flak", label: "Flak" },
        { value: "hazard", label: "Hazard" },
        { value: "scuba", label: "Scuba" },
        { value: "fur", label: "Fur" },
        { value: "ghillie", label: "Ghillie" },
        { value: "chitin", label: "Chitin" },
        { value: "desert", label: "Desert" },
        { value: "hide", label: "Hide" },
        { value: "cloth", label: "Cloth" },
        { value: "saddle", label: "Saddle" },
        { value: "attachment", label: "Attachment" },
      ],
    },
    {
      value: "weapon",
      label: "Weapons",
      types: [
        { value: "explosive", label: "Explosive" },
        { value: "ammunition", label: "Ammunition" },
        { value: "arrow", label: "Arrow" },
        { value: "tool", label: "Tool" },
        { value: "attachment", label: "Attachment" },
        { value: "shield", label: "Shield" },
        { value: "melee", label: "Melee" },
        { value: "gun", label: "Gun" },
        { value: "other", label: "Other" },
      ],
    },
    {
      value: "consumable",
      label: "Consumable",
      types: [
        { value: "dish", label: "Dish" },
        { value: "drug", label: "Drug" },
        { value: "egg", label: "Egg" },
        { value: "food", label: "Food" },
        { value: "fungus", label: "Fungus" },
        { value: "meat", label: "Meat" },
        { value: "plant", label: "Plant" },
        { value: "seed", label: "Seed" },
        { value: "tool", label: "Tool" },
        { value: "other", label: "Other" },
      ],
    },
    {
      value: "tool",
      label: "Tools",
      types: [{ value: "tool", label: "Tool" }],
    },
    {
      value: "fertilizer",
      label: "Fertilizer",
      types: [{ value: "feces", label: "Feces" }],
    },
    {
      value: "other",
      label: "Other",
      types: [
        { value: "navigation", label: "Navigation" },
        { value: "other", label: "Other" },
        { value: "artifact", label: "Artifact" },
        { value: "tool", label: "Tool" },
        { value: "coloring", label: "Coloring" },
        { value: "utility", label: "Utility" },
      ],
    },
  ];

  const [selectedCategories, setSelectedCategories] = useState<Category[]>(
    categories.filter((c) => c.value === category)
  );
  const [selectedTypes, setSelectedTypes] = useState<LookupOption[]>(
    categories
      .filter((c) => c.value === category)
      .flatMap((c) => c.types)
      .filter((t) => t.value === type)
  );
  const Filters = (
    <>
      <h3 className="sr-only">Categories</h3>
      <Disclosure title="Category">
        <div className="flex flex-col space-y-5">
          {categories.map(({ label, value, types }) => (
            <div
              className="flex items-center space-x-2"
              key={`category-${label}`}
            >
              <CheckboxField
                name="category"
                id={`category-${label}`}
                className="rw-input"
                value={value}
                errorClassName="rw-input rw-input-error"
                onChange={(e) => {
                  setSelectedTypes([]);
                  setSelectedCategories((prev) =>
                    prev.includes({ label, value, types }) && e.target.checked
                      ? []
                      : [{ label, value, types }]
                  );
                }}
                checked={selectedCategories?.some((c) => c?.value === value)}
              />
              <Label
                name="category"
                htmlFor={`category-${label}`}
                className="rw-sublabel capitalize"
                errorClassName="rw-sublabel rw-label-error"
              >
                {label}
              </Label>
            </div>
          ))}
        </div>
      </Disclosure>
      <Disclosure title="Type">
        {selectedCategories?.length > 0 && (
          <div className="flex flex-col space-y-5">
            {selectedCategories
              ?.flatMap((c) => c?.types)
              .sort((a, b) => a?.label.localeCompare(b?.label))
              .map(({ label, value }) => (
                <div
                  className="flex items-center space-x-2"
                  key={`type-${label}`}
                >
                  <CheckboxField
                    name="type"
                    id={`type-${label}`}
                    className="rw-input"
                    value={value}
                    errorClassName="rw-input rw-input-error"
                    onChange={(e) => {
                      setSelectedTypes((prev) =>
                        prev.some((p) => p.value === value)
                          ? prev.filter((p) => p.value != value)
                          : [...prev, { label, value }]
                      );
                    }}
                    checked={selectedTypes.some((t) => t.value === value)}
                  />
                  <Label
                    name="type"
                    htmlFor={`type-${label}`}
                    className="rw-sublabel capitalize"
                    errorClassName="rw-sublabel rw-label-error"
                  >
                    {label}
                  </Label>
                </div>
              ))}
          </div>
        )}
      </Disclosure>
    </>
  );

  type FormFindItems = {
    search: string;
    category: string;
    type: string;
  };
  const onSubmit = (data: FormFindItems) => {
    navigate(
      routes.items({
        ...parseSearch(
          Object.fromEntries(
            Object.entries(data).filter(([_, v]) => v != "")
          ) as FormFindItems
        ),
        page: 1,
      })
    );
  };
  const [view, setView] = useState<"grid" | "list">("grid");
  const { openModal } = useModal();

  return (
    <Form<FormFindItems>
      className="rw-segment overflow-hidden"
      onSubmit={onSubmit}
    >
      {window.innerWidth < 1024 && <Modal content={Filters} />}

      <div className="flex flex-col items-center justify-between border-b border-zinc-500 pb-6 pt-1 text-gray-900 dark:text-white sm:flex-row">
        <h1 className="mr-4 py-3 text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:p-0">
          Items
        </h1>

        <nav className="flex w-full items-center justify-end space-x-3">
          <ButtonGroup>
            <Button
              to={routes.newItem()}
              color="success"
              variant="outlined"
              permission="gamedata_create"
              className="grow"
              startIcon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 448 512"
                >
                  <path d="M432 256C432 264.8 424.8 272 416 272h-176V448c0 8.844-7.156 16.01-16 16.01S208 456.8 208 448V272H32c-8.844 0-16-7.15-16-15.99C16 247.2 23.16 240 32 240h176V64c0-8.844 7.156-15.99 16-15.99S240 55.16 240 64v176H416C424.8 240 432 247.2 432 256z" />
                </svg>
              }
            >
              New Item
            </Button>

            <Lookup
              label="Category"
              name="category"
              margin="none"
              options={categories}
              isOptionEqualToValue={(option, value) =>
                option?.value === value?.value
              }
              getOptionValue={(opt) => opt?.value}
              getOptionLabel={(option) => option?.label}
              value={categories[0]}
              disabled={loading}
              onChange={(_, e) => {
                console.log(e)
                setSelectedCategories(!e ? [] : [e]);
                setSelectedTypes([]);
              }}
            />

            {selectedCategories.length > 0 && (
              <Lookup
                name="type"
                label="Type"
                margin="none"
                value={selectedTypes}
                multiple
                limitTags={1}
                options={selectedCategories.flatMap((c) => c.types)}
                getOptionLabel={(option) => option.label}
                isOptionEqualToValue={(option, value) =>
                  option.value === value.value
                }
                onChange={(_, e) => {
                  if (!e.length) return setSelectedTypes([]);
                  setSelectedTypes(e);
                }}
                disabled={loading}
                validation={{
                  deps: ["category"],
                  required: false,
                }}
              />
            )}

            <Button
              onClick={() => openModal()}
              color="secondary"
              variant="outlined"
              permission="gamedata_create"
              startIcon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                >
                  <path d="M479.3 32H32.7C5.213 32-9.965 63.28 7.375 84.19L192 306.8V400c0 7.828 3.812 15.17 10.25 19.66l80 55.98C286.5 478.6 291.3 480 295.9 480C308.3 480 320 470.2 320 455.1V306.8l184.6-222.6C521.1 63.28 506.8 32 479.3 32zM295.4 286.4L288 295.3v145.3l-64-44.79V295.3L32.7 64h446.6l.6934-.2422L295.4 286.4z" />
                </svg>
              }
            >

              <span className="sr-only">Filters</span>
            </Button>

            <Input
              name="search"
              label="Search"
              type="search"
              margin="none"
              defaultValue={search}
              disabled={loading}
              InputProps={{
                endAdornment: (
                  <Button
                    type="submit"
                    variant="contained"
                    color="success"
                    ignoreButtonGroupPosition
                    startIcon={(
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 512 512"
                        className="w-4"
                      >
                        <path d="M507.3 484.7l-141.5-141.5C397 306.8 415.1 259.7 415.1 208c0-114.9-93.13-208-208-208S-.0002 93.13-.0002 208S93.12 416 207.1 416c51.68 0 98.85-18.96 135.2-50.15l141.5 141.5C487.8 510.4 491.9 512 496 512s8.188-1.562 11.31-4.688C513.6 501.1 513.6 490.9 507.3 484.7zM208 384C110.1 384 32 305 32 208S110.1 32 208 32S384 110.1 384 208S305 384 208 384z" />
                      </svg>
                    )}
                  >
                    <span className="hidden md:block">Search</span>
                  </Button>
                )
              }}
            />
          </ButtonGroup>

          <ToggleButtonGroup
            orientation="horizontal"
            value={view}
            exclusive
            enforce
            onChange={(_, value) => setView(value)}
          >
            <ToggleButton value="list">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                className="h-5 w-5 fill-current"
              >
                <path d="M64 48H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32v-32C96 62.33 81.67 48 64 48zM64 112H32v-32h32V112zM64 368H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32v-32C96 382.3 81.67 368 64 368zM64 432H32v-32h32V432zM176 112h320c8.801 0 16-7.201 16-15.1C512 87.2 504.8 80 496 80h-320C167.2 80 160 87.2 160 95.1C160 104.8 167.2 112 176 112zM496 240h-320C167.2 240 160 247.2 160 256c0 8.799 7.201 16 16 16h320C504.8 272 512 264.8 512 256C512 247.2 504.8 240 496 240zM496 400h-320C167.2 400 160 407.2 160 416c0 8.799 7.201 16 16 16h320c8.801 0 16-7.201 16-16C512 407.2 504.8 400 496 400zM64 208H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32v-32C96 222.3 81.67 208 64 208zM64 272H32v-32h32V272z" />
              </svg>
            </ToggleButton>
            <ToggleButton value="grid">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                className="h-5 w-5 fill-current"
              >
                <path d="M160 0H64C28.65 0 0 28.65 0 64v96c0 35.35 28.65 64 64 64h96c35.35 0 64-28.65 64-64V64C224 28.65 195.3 0 160 0zM192 160c0 17.64-14.36 32-32 32H64C46.36 192 32 177.6 32 160V64c0-17.64 14.36-32 32-32h96c17.64 0 32 14.36 32 32V160zM160 288H64c-35.35 0-64 28.65-64 64v96c0 35.35 28.65 64 64 64h96c35.35 0 64-28.65 64-64v-96C224 316.7 195.3 288 160 288zM192 448c0 17.64-14.36 32-32 32H64c-17.64 0-32-14.36-32-32v-96c0-17.64 14.36-32 32-32h96c17.64 0 32 14.36 32 32V448zM448 0h-96c-35.35 0-64 28.65-64 64v96c0 35.35 28.65 64 64 64h96c35.35 0 64-28.65 64-64V64C512 28.65 483.3 0 448 0zM480 160c0 17.64-14.36 32-32 32h-96c-17.64 0-32-14.36-32-32V64c0-17.64 14.36-32 32-32h96c17.64 0 32 14.36 32 32V160zM448 288h-96c-35.35 0-64 28.65-64 64v96c0 35.35 28.65 64 64 64h96c35.35 0 64-28.65 64-64v-96C512 316.7 483.3 288 448 288zM480 448c0 17.64-14.36 32-32 32h-96c-17.64 0-32-14.36-32-32v-96c0-17.64 14.36-32 32-32h96c17.64 0 32 14.36 32 32V448z" />
              </svg>
            </ToggleButton>
          </ToggleButtonGroup>
        </nav>
      </div>

      <section className="grid grid-cols-1 gap-x-8 gap-y-10 pb-24 pt-6 lg:grid-cols-4">
        {/* Filters */}
        <div className="hidden lg:block">{Filters}</div>
        {/* Items Grid */}
        <div
          className={clsx(
            "grid w-full gap-3 text-zinc-900 transition-all ease-in-out dark:text-white lg:col-span-3",
            {
              "grid-cols-1": view === "list",
              "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4":
                view === "grid",
            }
          )}
        >
          {itemsPage.items.map((item, i) => (
            <Fragment key={`item-${i}`}>
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
            </Fragment>
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
      </section>
    </Form>
  );
};

export default ItemsList;
