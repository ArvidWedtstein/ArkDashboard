import { Form, Label, SearchField, Submit } from "@redwoodjs/forms";
import { navigate, useParams } from "@redwoodjs/router";
import { Link, routes, parseSearch } from "@redwoodjs/router";
import { useCallback } from "react";
import Lookup from "src/components/Util/Lookup/Lookup";
import { removeDuplicates } from "src/lib/formatters";

import type { FindLootcrates } from "types/graphql";

const LootcratesList = ({ lootcratesByMap, maps }: FindLootcrates) => {
  let { map, search } = useParams();

  const onSubmit = useCallback((data) => {
    navigate(
      routes.lootcrates({
        ...parseSearch(
          Object.fromEntries(
            Object.entries(data).filter(([_, v]) => v != "" && v != undefined)
          ) as any
        ),
      })
    );
  }, []);
  return (
    <div className="rw-segment">
      <Form className="flex w-full" onSubmit={onSubmit}>
        <nav className="rw-button-group relative w-full !space-x-0">
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
          <Lookup
            search={true}
            name="map"
            className="rw-input mt-0 min-w-[10rem] !rounded-none !rounded-l-lg pl-10"
            options={
              maps?.map((map) => ({
                label: map.name,
                value: Number(map.id),
                image: `https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Map/${map.icon}`,
              })) || []
            }
            placeholder="Map"
            defaultValue={map}
            filterFn={(item, search) =>
              item.label.toLowerCase().includes(search.toLowerCase())
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
            list="searchlist"
            className="rw-input mt-0 !w-full !rounded-r-lg border-l-transparent"
            placeholder="Search..."
            defaultValue={search}
            validation={{
              shouldUnregister: true,
            }}
          />
          <datalist id="searchlist">
            {maps?.map((map) => (
              <option key={map.id} value={map.name} />
            ))}
          </datalist>
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
      </Form>

      <div className="mt-3 grid w-full grid-cols-3 gap-6 text-white">
        {lootcratesByMap
          .filter((m) => m.name != null && m.name != "")
          .map(({ id, name, required_level, image, color }) => (
            <Link
              to={routes.lootcrate({ id })}
              className="rounded-lg bg-zinc-400 py-5 px-4 shadow-lg dark:bg-zinc-800"
              key={id}
            >
              <div className="flex items-start">
                <img
                  style={{ backgroundColor: color || "#2e2882" }}
                  className="h-12 w-12 rounded-lg object-contain p-2.5"
                  src={
                    image && image.length > 0
                      ? `https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Lootcrate/${image}`
                      : "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Lootcrate/White_Beacon.webp"
                  }
                />
                <div className="ml-auto mr-2 h-1 w-1 rounded-full bg-[#9b9ba5] p-0 shadow-[-6px_0_0_0_rgb(155,155,165),6px_0_0_0_rgb(155,155,165)]"></div>
              </div>
              <div className="mt-4 text-sm font-semibold">{name}</div>
              <div className="mt-3.5 text-xs text-gray-300">
                {image?.toString()}
              </div>
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
  );
};

export default LootcratesList;
