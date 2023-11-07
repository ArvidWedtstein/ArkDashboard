import { CheckboxField, Form, Label, Submit } from "@redwoodjs/forms";
import {
  Link,
  routes,
  navigate,
  useParams,
  parseSearch,
} from "@redwoodjs/router";
import clsx from "clsx";
import { useCallback, useMemo, useState } from "react";
import { useAuth } from "src/auth";
import {
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardHeader,
} from "src/components/Util/Card/Card";
import Disclosure from "src/components/Util/Disclosure/Disclosure";
import { InputOutlined } from "src/components/Util/Input/Input";
import { Lookup } from "src/components/Util/Lookup/Lookup";
import { Modal, useModal } from "src/components/Util/Modal/Modal";
import { dynamicSort, removeDuplicates } from "src/lib/formatters";

import type { FindLootcrates, permission } from "types/graphql";

type FormFindLootcrates = NonNullable<{
  map: string;
  search: string;
  color: string;
  types: string;
}>;

const LootcratesList = ({
  lootcratesByMap,
  maps,
  loading,
}: FindLootcrates & {
  loading?: boolean;
}) => {
  const { currentUser } = useAuth();
  let { map, search, color, type } = useParams();

  const [view, setView] = useState<"grid" | "list">("grid");
  const [sort, setSort] = useState<{
    column: string;
    direction: "asc" | "desc";
  }>({
    column: "",
    direction: "asc",
  });

  const onSubmit = useCallback((data: FormFindLootcrates) => {
    navigate(
      routes.lootcrates({
        ...parseSearch(
          Object.fromEntries(
            Object.entries(data).filter(([_, v]) => v != "" && v != undefined)
          ) as Record<string, string>
        ),
      })
    );
  }, []);

  const { openModal } = useModal();

  const Filters = useMemo(
    () => (
      <>
        <h3 className="sr-only">Categories</h3>
        <Disclosure title="Type">
          <div className="flex flex-col space-y-5">
            {removeDuplicates(
              lootcratesByMap.map((c) => c.type ?? "Other")
            ).map((ltype) => (
              <div
                className="flex items-center space-x-2"
                key={`type-${ltype}`}
              >
                <CheckboxField
                  name="type"
                  id={`type-${type}`}
                  className="rw-input"
                  value={ltype}
                  errorClassName="rw-input rw-input-error"
                  defaultChecked={type && type.includes(ltype)}
                />
                <Label
                  name="type"
                  htmlFor={`type-${ltype}`}
                  className="rw-sublabel"
                  errorClassName="rw-sublabel rw-label-error"
                >
                  {ltype}
                </Label>
              </div>
            ))}
          </div>
        </Disclosure>
        <Disclosure title="Map">
          <div className="flex flex-col space-y-5">
            {maps?.map(({ id, name }) => (
              <div className="flex items-center space-x-2" key={id}>
                <CheckboxField
                  id={`map-${id}`}
                  name="map"
                  value={id}
                  defaultChecked={map && map.includes(id.toString())}
                  className="rw-input"
                  errorClassName="rw-input rw-input-error"
                />
                <Label
                  name="map"
                  htmlFor={`map-${id}`}
                  className="rw-sublabel"
                  errorClassName="rw-sublabel rw-label-error"
                >
                  {name}
                </Label>
              </div>
            ))}
          </div>
        </Disclosure>
        <Disclosure title="Color">
          <div className="flex flex-col space-y-5">
            {removeDuplicates(
              lootcratesByMap.filter((c) => c.color != null).map((l) => l.color)
            ).map((HexColor) => (
              <div
                className="flex items-center space-x-2"
                key={`color-${HexColor}`}
              >
                <CheckboxField
                  name="color"
                  className="rw-input"
                  errorClassName="rw-input rw-input-error"
                  id={`color-${HexColor}`}
                  value={HexColor}
                  defaultChecked={color && color.includes(HexColor)}
                />
                <Label
                  name="color"
                  htmlFor={`color-${HexColor}`}
                  className="rw-sublabel"
                  errorClassName="rw-sublabel rw-label-error"
                >
                  <div
                    className={
                      "h-5 w-5 rounded-full ring-1 ring-inset ring-zinc-500"
                    }
                    style={{ backgroundColor: HexColor }}
                  />
                </Label>
              </div>
            ))}
          </div>
        </Disclosure>
      </>
    ),
    [type, map, color, lootcratesByMap]
  );
  return (
    <Form<FormFindLootcrates> className="rw-segment" onSubmit={onSubmit}>
      <Modal content={Filters} />

      <div className="flex flex-col items-baseline justify-between border-b border-zinc-500 pb-3  text-gray-900 dark:text-white sm:flex-row md:pt-3">
        <nav className="mx-1 flex w-full flex-row flex-wrap items-center justify-center space-x-2 sm:flex-nowrap">
          <h1 className="align-middle text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:p-0">
            Lootcrates
          </h1>
          <div className="rw-button-group w-full">
            <Lookup
              label="Sort by"
              margin="none"
              className="hidden capitalize sm:block"
              name="sort"
              defaultValue={sort.column}
              loading={loading}
              onSelect={(e) => {
                if (!e) return;
                setSort((prev) => ({
                  ...prev,
                  column: e ? e.toString() : "",
                }));
              }}
              closeOnSelect
              options={Object.keys(lootcratesByMap[0] || {})
                .filter(
                  (c) => !["__typename", "id", "image", "blueprint"].includes(c)
                )}
              InputProps={{
                style: {
                  borderRadius: "0.375rem 0 0 0.375rem",
                  marginRight: "-1px",
                },
              }}
            />

            <button
              type="button"
              className="rw-button rw-button-gray-outline -mr-px hidden transition-all duration-150 ease-in-out sm:block"
              onClick={() => {
                setSort((prev) => ({
                  ...prev,
                  direction: prev.direction === "asc" ? "desc" : "asc",
                }));
              }}
              title={sort.direction == "asc" ? "Ascending " : "Descending"}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 320 512"
                className={clsx(
                  "rw-button-icon-start transition-transform duration-150 ease-out",
                  {
                    "rotate-180 transform": sort.direction === "desc",
                  }
                )}
              >
                <path d="M32.05 224h255.9c28.36 0 42.73-34.5 22.62-54.62l-127.1-128c-12.5-12.5-32.86-12.5-45.36 0L9.304 169.4C-10.69 189.5 3.682 224 32.05 224zM160 63.98L287.1 192h-255.9L160 63.98z" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => openModal()}
              className="rw-button rw-button-gray-outline -mr-px lg:!hidden"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                className="rw-button-icon"
              >
                <path d="M479.3 32H32.7C5.213 32-9.965 63.28 7.375 84.19L192 306.8V400c0 7.828 3.812 15.17 10.25 19.66l80 55.98C286.5 478.6 291.3 480 295.9 480C308.3 480 320 470.2 320 455.1V306.8l184.6-222.6C521.1 63.28 506.8 32 479.3 32zM295.4 286.4L288 295.3v145.3l-64-44.79V295.3L32.7 64h446.6l.6934-.2422L295.4 286.4z" />
              </svg>
              <span className="sr-only">Filters</span>
            </button>

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
                  flexGrow: 1,
                },
                endAdornment: (
                  <>
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
                    {currentUser?.permissions.some(
                      (p: permission) => p === "gamedata_create"
                    ) && (
                        <Link
                          to={routes.newLootcrate()}
                          className="rw-button rw-button-green ml-1 hidden sm:inline-block"
                        >
                          New
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 448 512"
                            className="rw-button-icon-end h-4 w-4 fill-current stroke-current"
                          >
                            <path d="M432 256C432 264.8 424.8 272 416 272h-176V448c0 8.844-7.156 16.01-16 16.01S208 456.8 208 448V272H32c-8.844 0-16-7.15-16-15.99C16 247.2 23.16 240 32 240h176V64c0-8.844 7.156-15.99 16-15.99S240 55.16 240 64v176H416C424.8 240 432 247.2 432 256z" />
                          </svg>
                        </Link>
                      )}
                  </>
                ),
              }}
            />
          </div>

          <div className="rw-button-group hidden h-full sm:inline-flex">
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
              className="rw-button rw-button-medium rw-button-gray-outline peer-checked/list:border-pea-500 !rounded-r-none !rounded-l-lg border !py-4 peer-checked/list:bg-black/10 dark:peer-checked/list:bg-white/10"
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
              className="rw-button rw-button-medium rw-button-gray-outline peer-checked/grid:border-pea-500 border !py-4 peer-checked/grid:bg-black/10 dark:peer-checked/grid:bg-white/10"
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
      </div>

      <section className="grid grid-cols-1 gap-x-8 gap-y-10 pb-24 pt-6 lg:grid-cols-4">
        {/* Filters */}
        <div className="hidden lg:block">{Filters}</div>

        {/* Lootcrate grid */}
        <div
          className={clsx(
            "grid w-full gap-6 text-zinc-900 transition-all ease-in-out dark:text-white lg:col-span-3",
            {
              "grid-cols-1": view === "list",
              "grid-cols-1 lg:grid-cols-2 xl:grid-cols-3": view === "grid",
            }
          )}
        >
          {lootcratesByMap.length == 0 && <p>No lootcrates found</p>}
          {dynamicSort(
            lootcratesByMap,
            sort.column,
            sort.direction === "asc"
          ).map(({ id, name, required_level, image, color }) => (
            <Card
              key={`lootcrate-${id}`}
              className="hover:border-pea-500 flex flex-col justify-between border border-transparent transition-all duration-75 ease-in-out"
            >
              <CardActionArea
                component="link"
                to={routes.lootcrate({ id })}
                className="w-full cursor-pointer text-left"
              >
                <CardHeader
                  title={name}
                  className="border-b border-zinc-500"
                  avatar={
                    <img
                      src={
                        image && image.length > 0
                          ? `https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/${image}`
                          : "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/White_Beacon.webp"
                      }
                      className="h-12 w-12 rounded-lg border border-zinc-500 bg-neutral-700 object-contain p-2.5"
                      loading="lazy"
                      alt={name}
                    />
                  }
                />
                <CardContent>
                  {required_level > 0 && required_level != null && (
                    <span className="rw-badge rw-badge-gray-outline">
                      Lvl {required_level}
                    </span>
                  )}
                </CardContent>
              </CardActionArea>
              <CardActions>
                <Link
                  to={routes.lootcrate({ id })}
                  className="rw-button rw-button-green-outline"
                >
                  View Lootcrate
                </Link>
              </CardActions>
            </Card>
          ))}
        </div>
      </section>
    </Form>
  );
};

export default LootcratesList;
