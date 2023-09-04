import { navigate, parseSearch, routes } from "@redwoodjs/router";
import { useCallback, useMemo, useState } from "react";
import ArkCard from "src/components/Util/ArkCard/ArkCard";

import Lookup from "src/components/Util/Lookup/Lookup";
import { groupBy, removeDuplicates } from "src/lib/formatters";

import { useParams } from "@redwoodjs/router";
import { Form, Label, SearchField, Submit } from "@redwoodjs/forms";
{/* <div className="rw-cell-error flex items-center space-x-3">
    <svg
      className="h-12 w-12 fill-current"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
    >
      <path d="M256 304c4.406 0 8-3.578 8-8v-176c0-4.422-3.594-8-8-8S248 115.6 248 120v176C248 300.4 251.6 304 256 304zM256 352c-8.836 0-16 7.164-16 16S247.2 384 256 384s16-7.164 16-16S264.8 352 256 352zM256 0C114.6 0 0 114.6 0 256s114.6 256 256 256s256-114.6 256-256S397.4 0 256 0zM256 496c-132.3 0-240-107.7-240-240S123.7 16 256 16s240 107.7 240 240S388.3 496 256 496z" />
    </svg>
    <div className="flex flex-col">
      <p className="text-lg font-bold leading-snug">
        Some unexpected shit happend
      </p>
      <p className="text-sm">
        {errorCode === "GRAPHQL_VALIDATION_FAILED"
          ? "Failed to fetch data"
          : error?.message}
      </p>
    </div>
  </div> */}
const LootcratesList = ({
  lootcratesByMap: lootcrates,
  maps,
}: any) => {
  let { map, category, search } = useParams();
  const [categoryItems, setCategoryItems] = useState([]);

  const daLootcrates = useMemo(() => {
    let filteredCrates = lootcrates;

    if (map) {
      filteredCrates = filteredCrates.filter(
        (crate) => crate?.Map && crate.Map.id === parseInt(map)
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
          (set) =>
            set.name.includes(category) ||
            set.name.toLowerCase().includes(category.toLowerCase())
        ),
      }));
    }

    if (search) {
      filteredCrates = filteredCrates.filter(
        (crate) =>
          crate?.name?.toLowerCase().includes(search.toLowerCase()) ||
          crate?.LootcrateSet?.some((set) =>
            set?.LootcrateSetEntry.some((entry) =>
              entry?.LootcrateSetEntryItem.some((item) =>
                item.Item.name.toLowerCase().includes(search.toLowerCase())
              )
            )
          )
      );
    }
    return filteredCrates;
  }, [category, map, search]);

  const onSubmit = useCallback((data) => {
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

  // https://ark.wiki.gg/wiki/Coordinates
  return (
    <article>
      <Form className="flex w-auto" onSubmit={onSubmit}>
        <nav className="flex w-full flex-row justify-center space-x-2">
          <div className="rw-button-group !w-full !space-x-0">
            <Label name="map" className="sr-only">
              Choose a Map
            </Label>
            <Lookup
              name="map"
              className="rw-input mt-0 !rounded-none !rounded-l-lg"
              options={
                maps?.map((map) => ({
                  label: map.name,
                  value: Number(map.id),
                  image: `https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Map/${map.icon}`,
                })) || []
              }
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

      {search && (
        <p className="text-black dark:text-white">Lootcrates with {search}</p>
      )}

      <div className="rw-segment-header rw-heading rw-heading-secondary p-0">
        {Object.entries(
          groupBy(
            daLootcrates.map((l) => ({ ...l, type: l.name.split(" ")[0] })),
            "type"
          )
        ).map(([k, v], i) => (
          <div
            className="animate-fade-in my-4 border-b border-zinc-500 py-3"
            key={i}
          >
            <h1 className="rw-heading rw-heading-secondary">{k}</h1>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3 xl:grid-cols-4">
              {v.map((lootcrate, d) => (
                <ArkCard
                  key={`lootcrate-${d}-${i}`}
                  style={{
                    borderStyle: "solid",
                    borderWidth: "1px",
                    borderImage: `linear-gradient(180deg, rgba(0, 0, 0, 0), ${lootcrate.color ? lootcrate.color : "white"
                      }, rgba(0, 0, 0, 0)) 0 100%`,
                  }}
                  icon={{
                    src:
                      k == "Artifact"
                        ? `https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/artifact-of-the-${lootcrate.name
                          .split(" ")
                        [
                          lootcrate.name.split(" ").length - 1
                        ].toLowerCase()}.webp`
                        : "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/any-gun.webp",
                  }}
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
