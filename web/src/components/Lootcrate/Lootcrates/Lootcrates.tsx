import {
  CheckboxField,
  Form,
  Label,
  SearchField,
  Submit,
} from "@redwoodjs/forms";
import { navigate, useParams } from "@redwoodjs/router";
import { Link, routes, parseSearch } from "@redwoodjs/router";
import { useCallback, useContext } from "react";
import Disclosure from "src/components/Util/Disclosure/Disclosure";
import Lookup, { MultiSelectLookup } from "src/components/Util/Lookup/Lookup";
import { Modal, ModalContext } from "src/components/Util/Modal/Modal";
import { removeDuplicates } from "src/lib/formatters";

import type { FindLootcrates } from "types/graphql";

type FormFindLootcrates = NonNullable<{
  map: string;
  search: string;
  color: string;
  types: string;
}>;

const LootcratesList = ({ lootcratesByMap, maps }: FindLootcrates) => {
  let { map, search, color, types } = useParams();

  console.log(lootcratesByMap)
  const onSubmit = useCallback((data: FormFindLootcrates) => {
    console.log(data);
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

  const { openModal } = useContext(ModalContext);
  return (
    <div className="rw-segment">
      <Modal content={<p>test</p>} />

      <Form<FormFindLootcrates> className="w-full" onSubmit={onSubmit}>
        <div className="flex flex-col items-baseline justify-between border-b border-zinc-500 pb-6 pt-24 text-gray-900 dark:text-white sm:flex-row md:pt-6">
          <h1 className="py-3 text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:p-0">
            Lootcrates
          </h1>

          <div className="flex items-center">
            <button
              type="button"
              className="rw-button rw-button-gray-outline ml-5"
            >
              <span className="sr-only">View grid</span>
              Sort
            </button>

            <button
              type="button"
              className="rw-button rw-button-gray-outline ml-5"
            >
              <span className="sr-only">View grid</span>
              Grid
            </button>

            <button
              type="button"
              onClick={() => openModal()}
              className="rw-button rw-button-gray-outline ml-4 sm:ml-6 lg:!hidden"
            >
              Filter
              <span className="sr-only">Filters</span>
            </button>

            <Label name="search" className="sr-only">
              Search
            </Label>

            <SearchField
              name="search"
              className="rw-input ml-4 !mt-0 !w-full grow sm:ml-6"
              placeholder="Search..."
              defaultValue={search}
            />
            <Submit className="rw-button rw-button-green-outline ml-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                className="rw-button-icon-start"
              >
                <path d="M507.3 484.7l-141.5-141.5C397 306.8 415.1 259.7 415.1 208c0-114.9-93.13-208-208-208S-.0002 93.13-.0002 208S93.12 416 207.1 416c51.68 0 98.85-18.96 135.2-50.15l141.5 141.5C487.8 510.4 491.9 512 496 512s8.188-1.562 11.31-4.688C513.6 501.1 513.6 490.9 507.3 484.7zM208 384C110.1 384 32 305 32 208S110.1 32 208 32S384 110.1 384 208S305 384 208 384z" />
              </svg>
              <span className="hidden md:block">Search</span>
            </Submit>
          </div>
        </div>

        <section aria-labelledby="products-heading" className="pb-24 pt-6">
          <h2 id="products-heading" className="sr-only">
            Products
          </h2>

          <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
            {/* Filters */}
            <div className="hidden lg:block">
              <h3 className="sr-only">Categories</h3>
              <Disclosure title="Type">
                <div className="flex flex-col space-y-5">
                  <div className="flex items-center space-x-2">
                    <CheckboxField
                      name="type"
                      id="type-supply-drop"
                      className="rw-input"
                      errorClassName="rw-input rw-input-error"
                      defaultChecked={types && types.includes("Supply Drop")}
                    />
                    <Label
                      name="type"
                      defaultValue={"Supply Drop"}
                      htmlFor="type-supply-drop"
                      className="rw-sublabel"
                      errorClassName="rw-sublabel rw-label-error"
                    >
                      Supply Drop
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckboxField
                      name="type"
                      id="type-artifact"
                      className="rw-input"
                      errorClassName="rw-input rw-input-error"
                      defaultChecked={types && types.includes("Artifact")}
                    />
                    <Label
                      name="type"
                      className="rw-sublabel"
                      htmlFor="type-artifact"
                      errorClassName="rw-sublabel rw-label-error"
                    >
                      Artifact
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckboxField
                      name="type"
                      id="type-boss"
                      className="rw-input"
                      errorClassName="rw-input rw-input-error"
                      defaultChecked={types && types.includes("Boss")}
                    />
                    <Label
                      name="type"
                      htmlFor="type-boss"
                      className="rw-sublabel"
                      errorClassName="rw-sublabel rw-label-error"
                    >
                      Boss
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckboxField
                      id="type-underwater"
                      name="type"
                      className="rw-input"
                      errorClassName="rw-input rw-input-error"
                      defaultChecked={types && types.includes("Underwater")}
                    />
                    <Label
                      name="type"
                      htmlFor="type-underwater"
                      className="rw-sublabel"
                      errorClassName="rw-sublabel rw-label-error"
                    >
                      Underwater
                    </Label>
                  </div>
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
                    lootcratesByMap
                      .filter((c) => c.color != null)
                      .map((l) => l.color)
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
            </div>

            {/* Lootcrate grid */}
            <div className="lg:col-span-3">
              <div className="grid w-full grid-cols-1 gap-6 text-zinc-900 dark:text-white lg:grid-cols-2 xl:grid-cols-3">
                {lootcratesByMap.length == 0 && <p>No lootcrates found</p>}
                {lootcratesByMap
                  .filter((m) => m.name != null && m.name != "")
                  .map(({ id, name, required_level, image, color }) => (
                    <Link
                      to={routes.lootcrate({ id })}
                      className="rounded-lg bg-zinc-300 py-5 px-4 shadow-lg dark:bg-zinc-800"
                      key={id}
                    >
                      <div className="flex items-start">
                        <img
                          style={{ backgroundColor: color || "#2e2882" }}
                          className="h-12 w-12 rounded-lg object-contain p-2.5"
                          src={
                            image && image.length > 0
                              ? `https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/${image}`
                              : "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/White_Beacon.webp"
                          }
                        />
                        <div className="ml-auto mr-2 h-1 w-1 rounded-full bg-[#9b9ba5] p-0 shadow-[-6px_0_0_0_rgb(155,155,165),6px_0_0_0_rgb(155,155,165)]"></div>
                      </div>
                      <div className="mt-4 text-sm font-semibold">{name}</div>
                      <div className="mt-3.5 text-xs text-gray-300"></div>
                      <div className="my-2 flex items-start space-x-1">
                        {required_level > 0 && required_level != null && (
                          <button className="rw-badge rw-badge-gray-outline">
                            Lvl {required_level}
                          </button>
                        )}
                      </div>
                      <div className="mt-1 flex w-full items-center justify-between space-x-3">
                        <button className="rw-button rw-button-green-outline f">
                          Learn more
                        </button>
                      </div>
                    </Link>
                  ))}
              </div>
            </div>
          </div>
        </section>
        <nav className="rw-button-group relative col-span-6 w-full !space-x-0">
          <Label name="map" className="sr-only">
            Choose a Map
          </Label>
          <div className="h-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 576 512"
              className="absolute left-3 top-1/2 z-10 w-5 -translate-y-1/2 fill-black dark:fill-zinc-400"
            >
              <path d="M568.1 34.76c-4.406-2.969-9.982-3.554-14.94-1.616L409.6 90.67L179 32.51C175.9 31.67 172.5 31.89 169.5 33.01l-159.1 59.44C4.141 94.79 0 100.8 0 107.4v356.5c0 5.344 2.672 10.35 7.109 13.32s9.972 3.553 14.89 1.521l152.3-63.08l222.1 63.62C397.9 479.8 399.4 480 400.9 480c1.906 0 3.797-.3438 5.594-1l159.1-59.44C571.9 417.2 576 411.3 576 404.6V48.01C576 42.69 573.4 37.76 568.1 34.76zM192 68.79l192 48.42v325.3L192 387.6V68.79zM32 118.5l128-47.79v316.3l-128 53.02V118.5zM544 393.5l-128 47.8V122.4c.1914-.0684 .4043 .0391 .5938-.0371L544 71.61V393.5z" />
            </svg>
          </div>
          <MultiSelectLookup
            name="map"
            search
            multiple
            placeholder="Map"
            className="rw-input mt-0 min-w-[10rem] !rounded-none !rounded-l-lg pl-10"
            defaultValue={map}
            closeOnSelect
            options={
              maps?.map((map) => ({
                label: map.name,
                value: Number(map.id),
                image: `https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Map/${map.icon}`,
              })) || []
            }
          />
          <Lookup
            name="category"
            className="rw-input mt-0 !rounded-none border-l-transparent"
            placeholder="Type"
            options={removeDuplicates(
              lootcratesByMap
                .filter((k) => k != undefined && k?.name != "")
                .map((crate) => ({
                  label: crate?.name.split(" ")[0],
                  value: crate?.name.split(" ")[0],
                }))
            )}
          />
          <Label name="search" className="sr-only">
            Search
          </Label>
          <SearchField
            name="search"
            className="rw-input mt-0 !w-full !rounded-r-lg border-l-transparent"
            placeholder="Search..."
            defaultValue={search}
            validation={{
              shouldUnregister: true,
            }}
          />
          <Submit className="rw-button rw-button-green absolute top-0 right-0 h-full rounded-l-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              className="rw-button-icon-start"
            >
              <path d="M507.3 484.7l-141.5-141.5C397 306.8 415.1 259.7 415.1 208c0-114.9-93.13-208-208-208S-.0002 93.13-.0002 208S93.12 416 207.1 416c51.68 0 98.85-18.96 135.2-50.15l141.5 141.5C487.8 510.4 491.9 512 496 512s8.188-1.562 11.31-4.688C513.6 501.1 513.6 490.9 507.3 484.7zM208 384C110.1 384 32 305 32 208S110.1 32 208 32S384 110.1 384 208S305 384 208 384z" />
            </svg>
            <span className="hidden md:block">Search</span>
          </Submit>
        </nav>

        {/* <div className="col-span-2 mt-3 flex flex-col md:col-span-1">
          <Disclosure title="Type">
            <div className="flex flex-col space-y-5">
              <div className="flex items-center space-x-2">
                <CheckboxField
                  name="type"
                  id="type-supply-drop"
                  className="rw-input"
                  errorClassName="rw-input rw-input-error"
                  defaultChecked={type && type.includes('Supply Drop')}
                />
                <Label
                  name="type"
                  defaultValue={"Supply Drop"}
                  htmlFor="type-supply-drop"
                  className="rw-sublabel"
                  errorClassName="rw-sublabel rw-label-error"
                >
                  Supply Drop
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <CheckboxField
                  name="type"
                  id="type-artifact"
                  className="rw-input text-indigo-600 focus:ring-indigo-500"
                  errorClassName="rw-input rw-input-error"
                  defaultChecked={type && type.includes('Artifact')}
                />
                <Label
                  name="type"
                  className="rw-sublabel"
                  htmlFor="type-artifact"
                  errorClassName="rw-sublabel rw-label-error"
                >
                  Artifact
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <CheckboxField name="type" id="type-boss" className="rw-input" errorClassName="rw-input rw-input-error" defaultChecked={type && type.includes('Boss')} />
                <Label
                  name="type"
                  htmlFor="type-boss"
                  className="rw-sublabel"
                  errorClassName="rw-sublabel rw-label-error"
                >
                  Boss
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <CheckboxField
                  id="type-underwater"
                  name="type"
                  className="rw-input"
                  errorClassName="rw-input rw-input-error"
                  defaultChecked={type && type.includes('Underwater')}
                />
                <Label
                  name="type"
                  htmlFor="type-underwater"
                  className="rw-sublabel"
                  errorClassName="rw-sublabel rw-label-error"
                >
                  Underwater
                </Label>
              </div>
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
                lootcratesByMap
                  .filter((c) => c.color != null)
                  .map((l) => l.color)
              ).map((HexColor) => (
                <div className="flex items-center space-x-2" key={`color-${HexColor}`}>
                  <CheckboxField name="color" className="rw-input" errorClassName="rw-input rw-input-error" id={`color-${HexColor}`} value={HexColor} defaultChecked={color && color.includes(HexColor)} />
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
        </div> */}

        {/* <div className="col-span-4 md:col-span-5">
          <div className="mt-3 grid w-full grid-cols-1 gap-6 dark:text-white text-zinc-900 md:grid-cols-2 lg:grid-cols-3">
            {lootcratesByMap.length == 0 && <p>No lootcrates found</p>}
            {lootcratesByMap
              .filter((m) => m.name != null && m.name != "")
              .map(({ id, name, required_level, image, color }) => (
                <Link
                  to={routes.lootcrate({ id })}
                  className="rounded-lg bg-zinc-300 py-5 px-4 shadow-lg dark:bg-zinc-800"
                  key={id}
                >
                  <div className="flex items-start">
                    <img
                      style={{ backgroundColor: color || "#2e2882" }}
                      className="h-12 w-12 rounded-lg object-contain p-2.5"
                      src={
                        image && image.length > 0
                          ? `https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/${image}`
                          : "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/White_Beacon.webp"
                      }
                    />
                    <div className="ml-auto mr-2 h-1 w-1 rounded-full bg-[#9b9ba5] p-0 shadow-[-6px_0_0_0_rgb(155,155,165),6px_0_0_0_rgb(155,155,165)]"></div>
                  </div>
                  <div className="mt-4 text-sm font-semibold">{name}</div>
                  <div className="mt-3.5 text-xs text-gray-300"></div>
                  <div className="my-2 flex items-start space-x-1">
                    {required_level > 0 && required_level != null && (
                      <button className="rw-badge rw-badge-gray-outline">
                        Lvl {required_level}
                      </button>
                    )}
                  </div>
                  <div className="mt-1 flex w-full items-center justify-between space-x-3">
                    <button className="rw-button rw-button-green-outline f">
                      Learn more
                    </button>
                  </div>
                </Link>
              ))}
          </div>
        </div> */}
      </Form>
    </div>
  );
};

export default LootcratesList;
