import { Link, navigate, parseSearch, routes } from "@redwoodjs/router";
import { useMutation } from "@redwoodjs/web";
import { toast } from "@redwoodjs/web/toast";
import { useCallback, useMemo, useState } from "react";
import ArkCard from "src/components/ArkCard/ArkCard";

import { QUERY } from "src/components/Lootcrate/LootcratesCell";
import Lookup from "src/components/Util/Lookup/Lookup";
import Tabs from "src/components/Util/Tabs/Tabs";
import {
  removeDuplicates,
} from "src/lib/formatters";

import type {
  DeleteLootcrateMutationVariables,
  FindLootcrates,
} from "types/graphql";
import { useParams } from "@redwoodjs/router";
import { Form, Label, SearchField, SelectField, Submit } from "@redwoodjs/forms";

// const DELETE_LOOTCRATE_MUTATION = gql`
//   mutation DeleteLootcrateMutation($id: String!) {
//     deleteLootcrate(id: $id) {
//       id
//     }
//   }
// `;

const LootcratesList = ({ lootcratesByMap: lootcrates }: FindLootcrates) => {
  // const [deleteLootcrate] = useMutation(DELETE_LOOTCRATE_MUTATION, {
  //   onCompleted: () => {
  //     toast.success("Lootcrate deleted");
  //   },
  //   onError: (error) => {
  //     toast.error(error.message);
  //   },
  //   // This refetches the query on the list page. Read more about other ways to
  //   // update the cache over here:
  //   // https://www.apollographql.com/docs/react/data/mutations/#making-all-other-cache-updates
  //   refetchQueries: [{ query: QUERY }],
  //   awaitRefetchQueries: true,
  // });

  // const onDeleteClick = (id: DeleteLootcrateMutationVariables["id"]) => {
  //   if (confirm("Are you sure you want to delete lootcrate " + id + "?")) {
  //     deleteLootcrate({ variables: { id } });
  //   }
  // };

  let { map, category, search } = useParams();
  const [filters, setFilters] = useState({ map: map || "", category: category || "", search: search || "" });
  const [categoryItems, setCategoryItems] = useState([]);


  const daLootcrates = useMemo(() => {
    let filteredCrates = lootcrates;

    if (filters.map) {
      filteredCrates = filteredCrates.filter(
        (crate) =>
          crate?.Map &&
          crate.Map.id === parseInt(filters.map)
      );
      setCategoryItems(
        removeDuplicates(
          filteredCrates
            .map((crate) => crate?.LootcrateSet)
            .flat()
            .map((set: any) => set?.name)
        )
      );
    }

    if (filters.category) {
      filteredCrates = filteredCrates.map((crate) => ({
        ...crate,
        sets: (crate?.LootcrateSet).filter(
          (set) => set.name == filters.category
        ),
      }));
    }

    if (filters.search) {
      filteredCrates = filteredCrates.filter(
        (crate) =>
          crate?.name?.toLowerCase().includes(filters.search.toLowerCase()) ||
          crate?.LootcrateSet?.some((set) => set?.LootcrateSetEntry.some((entry) => entry?.LootcrateSetEntryItem.some((item) => item.Item.name.toLowerCase().includes(filters.search.toLowerCase()))))
      );
    }
    return filteredCrates;
  }, [filters, map, search]);

  const onSubmit = useCallback((data) => {
    // setFilters({ ...filters, ...data });
    navigate(routes.lootcrates({ ...parseSearch(Object.fromEntries(Object.entries(data).filter(([_, v]) => v != "" && v != undefined)) as any) }))
  }, []);

  // https://ark.wiki.gg/wiki/Coordinates
  return (
    <div className="m-3">
      <Form className="flex w-auto" onSubmit={onSubmit}>
        <nav className="flex flex-row space-x-2 justify-center w-full">
          <div className="rw-button-group !space-x-0 !w-full">
            <Label name="map" className="sr-only">
              Choose a Map
            </Label>
            <Lookup
              name="map"
              className="rw-input !rounded-l-lg !rounded-none mt-0"
              options={[
                { label: "Valguero", value: 1 },
                { label: "The Island", value: 2 },
                { label: "The Center", value: 3 },
                { label: "Ragnarok", value: 4 },
                { label: "Abberation", value: 5 },
                { label: "Extinction", value: 6 },
                { label: "Scorched Earth", value: 7 },
                { label: "Genesis", value: 8 },
                { label: "Genesis 2", value: 9 },
                { label: "Crystal Isles", value: 10 },
                { label: "Fjordur", value: 11 },
                { label: "Lost Island", value: 12 },
              ]}
              // options={data?.maps.map((map) => ({
              //   label: map.name,
              //   value: map.id,
              // }))}
              placeholder="Choose Map"
              defaultValue={map}
            // onSelect={(e) => setCurrentMap(e.value ? e.value : null)}
            />
            <Lookup
              name="category"
              className="rw-input !rounded-none mt-0"
              options={categoryItems.map((k) => ({
                label: k,
                value: k,
              }))}
            // onSelect={(e) => setCurrentCategory(e.name)}
            />

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

      {search && <p className="dark:text-white">Lootcrates with {search}</p>}

      <div className="mt-3 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {daLootcrates.map((lootcrate, i) => (
          <ArkCard
            key={`lootcrate-${i}`}
            className="border-t-2 "
            style={{
              borderColor: lootcrate.color ? lootcrate.color : "white",
            }}
            image={{
              src: `https://images.squarespace-cdn.com/content/v1/5a77b6ab18b27d34acd418fe/1543032194681-R59KJT0WFQG43AFYSDXA/ark-survival-evolved-hd-wallpapers-hd-68984-8087136.png`,
              alt: "test",
              position: "70% 30%",
            }}
            icon={{
              src: 'https://static.wikia.nocookie.net/arksurvivalevolved_gamepedia/images/f/f2/Purple_Beacon.png',
            }}
            title={lootcrate.name}
            subtitle={lootcrate.Map.name}
            ring={
              lootcrate?.level_requirement &&
                lootcrate.level_requirement["min"] > 0
                ? `Lvl ${lootcrate.level_requirement["min"]}`
                : null
            }
            button={{
              text: "View",
              link: routes.lootcrate({ id: lootcrate.id }),
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default LootcratesList;
