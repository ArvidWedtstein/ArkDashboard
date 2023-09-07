import {
  CheckboxField,
  FieldError,
  Form,
  Label,
  SearchField,
  SelectField,
  Submit,
} from "@redwoodjs/forms";
import { navigate, useParams } from "@redwoodjs/router";
import { Link, routes, parseSearch } from "@redwoodjs/router";
import clsx from "clsx";
import { useCallback, useContext, useMemo, useState } from "react";
import Disclosure from "src/components/Util/Disclosure/Disclosure";
import { Modal, ModalContext } from "src/components/Util/Modal/Modal";
import { dynamicSort, removeDuplicates } from "src/lib/formatters";

import type { FindLootcrates } from "types/graphql";

type FormFindLootcrates = NonNullable<{
  map: string;
  search: string;
  color: string;
  types: string;
}>;

const LootcratesList = ({ lootcratesByMap, maps }: FindLootcrates) => {
  let { map, search, color, types } = useParams();

  const [view, setView] = useState<"grid" | "list">("grid");
  const [sort, setSort] = useState<{ column: string, direction: 'asc' | 'desc' }>({
    column: '',
    direction: 'asc'
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

  const { openModal } = useContext(ModalContext);

  const Filters = useMemo(() => (
    <>
      <h3 className="sr-only">Categories</h3>
      <Disclosure title="Type">
        <div className="flex flex-col space-y-5">
          {removeDuplicates(
            lootcratesByMap.map(c => c.type)
          ).map((type) => (
            <div className="flex items-center space-x-2" key={`type-${type}`}>
              <CheckboxField
                name="type"
                id={`type-${type}`}
                className="rw-input"
                value={type}
                errorClassName="rw-input rw-input-error"
                defaultChecked={types && types.includes(type)}
              />
              <Label
                name="type"
                htmlFor={`type-${type}`}
                className="rw-sublabel"
                errorClassName="rw-sublabel rw-label-error"
              >
                {type}
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
    </>
  ), []);
  return (
    <Form<FormFindLootcrates> className="rw-segment" onSubmit={onSubmit}>

      <Modal content={Filters} />

      <div className="flex flex-col items-baseline justify-between border-b border-zinc-500 pb-6 pt-24 text-gray-900 dark:text-white sm:flex-row md:pt-6">
        <h1 className="py-3 text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:p-0">
          Lootcrates
        </h1>

        <div className="flex items-center">
          <div className="rw-button-group ml-5">
            <SelectField className="rw-input capitalize" name="sort" defaultValue={sort.column} onChange={(e) => {
              setSort((prev) => ({
                ...prev,
                column: e.target.value
              }))
            }}>
              {Object.keys(lootcratesByMap[0] || {}).filter(c => !['__typename', 'id', 'image', 'blueprint'].includes(c)).map((key) => (
                <option className="capitalize" key={key} value={key}>
                  {key}
                </option>
              ))}
            </SelectField>

            <button className="rw-button rw-button-gray !border-l-transparent transition-all ease-in-out duration-150" onClick={() => {
              setSort((prev) => ({
                ...prev,
                direction: prev.direction === 'asc' ? 'desc' : 'asc'
              }))
            }}
              title={sort.direction == 'asc' ? 'Ascending ' : 'Descending'}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" className={clsx("rw-button-icon-start transition-transform ease-out duration-150", {
                'transform rotate-180': sort.direction === 'desc'
              })}>
                <path d="M32.05 224h255.9c28.36 0 42.73-34.5 22.62-54.62l-127.1-128c-12.5-12.5-32.86-12.5-45.36 0L9.304 169.4C-10.69 189.5 3.682 224 32.05 224zM160 63.98L287.1 192h-255.9L160 63.98z" />
              </svg>
            </button>
          </div>

          <div className="rw-button-group ml-5">
            <input
              type="radio"
              id="list"
              name="view"
              value="list"
              className="peer/list hidden"
              checked={view === "list"}
              onChange={() => setView("list")}
            />
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
              htmlFor="list"
              className="rw-button rw-button-gray h-full peer-checked/list:!border-pea-500 !rounded-r-none !rounded-l-lg border peer-checked/grid:border-r-0"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                className="rw-button-icon w-5 h-5"
              >
                <path d="M64 48H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32v-32C96 62.33 81.67 48 64 48zM64 112H32v-32h32V112zM64 368H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32v-32C96 382.3 81.67 368 64 368zM64 432H32v-32h32V432zM176 112h320c8.801 0 16-7.201 16-15.1C512 87.2 504.8 80 496 80h-320C167.2 80 160 87.2 160 95.1C160 104.8 167.2 112 176 112zM496 240h-320C167.2 240 160 247.2 160 256c0 8.799 7.201 16 16 16h320C504.8 272 512 264.8 512 256C512 247.2 504.8 240 496 240zM496 400h-320C167.2 400 160 407.2 160 416c0 8.799 7.201 16 16 16h320c8.801 0 16-7.201 16-16C512 407.2 504.8 400 496 400zM64 208H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32v-32C96 222.3 81.67 208 64 208zM64 272H32v-32h32V272z" />
              </svg>
            </label>
            <label
              htmlFor="grid"
              className="rw-button rw-button-gray peer-checked/grid:!border-pea-500 border peer-checked/list:!border-l-0"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                className="rw-button-icon w-5 h-5"
              >
                <path d="M160 0H64C28.65 0 0 28.65 0 64v96c0 35.35 28.65 64 64 64h96c35.35 0 64-28.65 64-64V64C224 28.65 195.3 0 160 0zM192 160c0 17.64-14.36 32-32 32H64C46.36 192 32 177.6 32 160V64c0-17.64 14.36-32 32-32h96c17.64 0 32 14.36 32 32V160zM160 288H64c-35.35 0-64 28.65-64 64v96c0 35.35 28.65 64 64 64h96c35.35 0 64-28.65 64-64v-96C224 316.7 195.3 288 160 288zM192 448c0 17.64-14.36 32-32 32H64c-17.64 0-32-14.36-32-32v-96c0-17.64 14.36-32 32-32h96c17.64 0 32 14.36 32 32V448zM448 0h-96c-35.35 0-64 28.65-64 64v96c0 35.35 28.65 64 64 64h96c35.35 0 64-28.65 64-64V64C512 28.65 483.3 0 448 0zM480 160c0 17.64-14.36 32-32 32h-96c-17.64 0-32-14.36-32-32V64c0-17.64 14.36-32 32-32h96c17.64 0 32 14.36 32 32V160zM448 288h-96c-35.35 0-64 28.65-64 64v96c0 35.35 28.65 64 64 64h96c35.35 0 64-28.65 64-64v-96C512 316.7 483.3 288 448 288zM480 448c0 17.64-14.36 32-32 32h-96c-17.64 0-32-14.36-32-32v-96c0-17.64 14.36-32 32-32h96c17.64 0 32 14.36 32 32V448z" />
              </svg>
            </label>
          </div>

          {/* TODO: fix icon */}
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
            className="rw-input ml-4 !mt-0 !w-full grow sm:ml-6 hidden lg:block"
            placeholder="Search..."
            defaultValue={search}
          />

          <FieldError name="search" className="rw-field-error" />

          <Submit className="rw-button rw-button-green ml-2 bg-clip-padding">
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

      <section className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4 pb-24 pt-6">
        {/* Filters */}
        <div className="hidden lg:block">
          {Filters}
        </div>

        {/* Lootcrate grid */}
        <div className={clsx("lg:col-span-3 grid w-full gap-6 text-zinc-900 dark:text-white transition-all ease-in-out", {
          'grid-cols-1': view === 'list',
          'grid-cols-1 lg:grid-cols-2 xl:grid-cols-3': view === 'grid'
        })}>
          {lootcratesByMap.length == 0 && <p>No lootcrates found</p>}
          {dynamicSort(lootcratesByMap, sort.column, sort.direction === 'asc')
            .map(({ id, name, required_level, image, color }) => (
              <Link
                to={routes.lootcrate({ id })}
                className="rounded-lg bg-zinc-300 py-5 px-4 shadow-lg dark:bg-zinc-800"
                key={id}
              >
                <div className="flex items-start">
                  <img
                    style={{ backgroundColor: color || "#444444" }}
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
      </section>
    </Form>
  );
};

export default LootcratesList;
