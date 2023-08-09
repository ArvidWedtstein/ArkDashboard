import { navigate, parseSearch, routes } from "@redwoodjs/router";
import { useCallback, useMemo, useState } from "react";
import ArkCard from "src/components/Util/ArkCard/ArkCard";

import Lookup from "src/components/Util/Lookup/Lookup";
import {
  groupBy,
  removeDuplicates,
} from "src/lib/formatters";

import type {
  FindLootcrates,
} from "types/graphql";
import { useParams } from "@redwoodjs/router";
import { Form, Label, SearchField, Submit } from "@redwoodjs/forms";

const LootcratesList = ({ lootcratesByMap: lootcrates, maps }: FindLootcrates) => {

  let { map, category, search } = useParams();
  const [categoryItems, setCategoryItems] = useState([]);

  const daLootcrates = useMemo(() => {
    let filteredCrates = lootcrates;

    if (map) {
      filteredCrates = filteredCrates.filter(
        (crate) =>
          crate?.Map &&
          crate.Map.id === parseInt(map)
      );
      setCategoryItems(
        removeDuplicates(
          filteredCrates
            .map((crate) => crate?.LootcrateSet)
            .flat()
            .map((set) => set?.name)
        )
      );
    }

    if (category) {
      filteredCrates = filteredCrates.map((crate) => ({
        ...crate,
        sets: (crate?.LootcrateSet).filter(
          (set) => set.name.includes(category) || set.name.toLowerCase().includes(category.toLowerCase())
        ),
      }));
    }

    if (search) {
      filteredCrates = filteredCrates.filter(
        (crate) =>
          crate?.name?.toLowerCase().includes(search.toLowerCase()) ||
          crate?.LootcrateSet?.some((set) => set?.LootcrateSetEntry.some((entry) => entry?.LootcrateSetEntryItem.some((item) => item.Item.name.toLowerCase().includes(search.toLowerCase()))))
      );
    }
    return filteredCrates;
  }, [category, map, search]);

  const onSubmit = useCallback((data) => {
    navigate(routes.lootcrates({ ...parseSearch(Object.fromEntries(Object.entries(data).filter(([_, v]) => v != "" && v != undefined)) as any) }))
  }, []);

  // https://ark.wiki.gg/wiki/Coordinates
  return (
    <article>
      <Form className="flex w-auto" onSubmit={onSubmit}>
        <nav className="flex flex-row space-x-2 justify-center w-full">
          <div className="rw-button-group !space-x-0 !w-full">
            <Label name="map" className="sr-only">
              Choose a Map
            </Label>
            <Lookup
              name="map"
              className="rw-input !rounded-l-lg !rounded-none mt-0"
              options={maps?.map((map) => ({ label: map.name, value: Number(map.id), image: `https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Map/${map.icon}` })) || []}
              placeholder="Choose Map"
              defaultValue={map}
            // onSelect={(e) => setCurrentMap(e.value ? e.value : null)}
            />
            {/* <Lookup
              name="category"
              className="rw-input !rounded-none mt-0"
              options={categoryItems.map((k) => ({
                label: k,
                value: k,
              }))}
            // onSelect={(e) => setCurrentCategory(e.name)}
            /> */}

            <Label name="search" className="sr-only">
              Search for item
            </Label>
            <SearchField
              name="search"
              className="rw-input mt-0 !w-full"
              placeholder="Search..."
              defaultValue={search}
              validation={{
                shouldUnregister: true,
              }}
            />
            <Submit className="rw-button rw-button-gray rounded-l-none">
              Search
            </Submit>
          </div>
        </nav>
      </Form>

      {search && <p className="dark:text-white text-black">Lootcrates with {search}</p>}

      <div className="rw-segment-header rw-heading rw-heading-secondary p-0">
        {Object.entries(groupBy(daLootcrates.map(l => ({ ...l, type: l.name.split(' ')[0] })), "type")).map(([k, v], i) => (
          <div className="my-4 py-3 border-b border-zinc-500 animate-fade-in" key={i}>
            <h1 className="rw-heading rw-heading-secondary">{k}</h1>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3 xl:grid-cols-4">
              {v.map((lootcrate, d) => (
                <ArkCard
                  key={`lootcrate-${d}-${i}`}
                  className="border-t-2 !bg-zinc-700"
                  style={{
                    borderColor: lootcrate.color ? lootcrate.color : "white",
                  }}
                  icon={{ src: k == 'Artifact' ? `https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/artifact-of-the-${lootcrate.name.split(' ')[lootcrate.name.split(' ').length - 1].toLowerCase()}.webp` : 'https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/any-gun.webp' }}
                  title={lootcrate.name}
                  ring={
                    lootcrate?.level_requirement &&
                      lootcrate.level_requirement["min"] > 0 ? (
                      <span
                        title={`You need to be lvl ${lootcrate.level_requirement["min"]} to open this crate`}
                        className="rw-badge rw-badge-yellow-outline"
                      >
                        Lvl {lootcrate.level_requirement["min"]}
                      </span>
                    ) : null
                  }
                  button={{
                    link: routes.lootcrate({
                      id: lootcrate.id.toString(),
                    }),
                    text: "View",
                  }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </article>
  );
};

export default LootcratesList;
