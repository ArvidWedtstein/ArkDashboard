import { Link, routes } from "@redwoodjs/router";
import { useMutation } from "@redwoodjs/web";
import { toast } from "@redwoodjs/web/toast";
import { useCallback, useMemo, useState } from "react";
import ArkCard from "src/components/ArkCard/ArkCard";

import { QUERY } from "src/components/Lootcrate/LootcratesCell";
import Lookup from "src/components/Util/Lookup/Lookup";
import Tabs from "src/components/Util/Tabs/Tabs";
import items from "../../../../public/arkitems.json";
import {
  checkboxInputTag,
  jsonTruncate,
  removeDuplicates,
  timeTag,
  truncate,
} from "src/lib/formatters";

import type {
  DeleteLootcrateMutationVariables,
  FindLootcrates,
} from "types/graphql";

const DELETE_LOOTCRATE_MUTATION = gql`
  mutation DeleteLootcrateMutation($id: String!) {
    deleteLootcrate(id: $id) {
      id
    }
  }
`;

const LootcratesList = ({ lootcrates }: FindLootcrates) => {
  const [deleteLootcrate] = useMutation(DELETE_LOOTCRATE_MUTATION, {
    onCompleted: () => {
      toast.success("Lootcrate deleted");
    },
    onError: (error) => {
      toast.error(error.message);
    },
    // This refetches the query on the list page. Read more about other ways to
    // update the cache over here:
    // https://www.apollographql.com/docs/react/data/mutations/#making-all-other-cache-updates
    refetchQueries: [{ query: QUERY }],
    awaitRefetchQueries: true,
  });

  const onDeleteClick = (id: DeleteLootcrateMutationVariables["id"]) => {
    if (confirm("Are you sure you want to delete lootcrate " + id + "?")) {
      deleteLootcrate({ variables: { id } });
    }
  };

  const [filters, setFilters] = useState({ map: "", category: "" });
  const [categoryItems, setCategoryItems] = useState([]);
  const getItem = useCallback(
    (id) => {
      return !id || isNaN(id)
        ? null
        : items.items.find((g) => g.id.toString() === id.toString());
    },
    [items.items]
  );

  const daLootcrates = useMemo(() => {
    let filteredCrates = lootcrates;

    if (filters.map) {
      filteredCrates = filteredCrates.filter(
        (crate) =>
          crate?.Map &&
          crate.Map.name.toLowerCase().includes(filters.map.toLowerCase())
      );
      setCategoryItems(
        removeDuplicates(
          filteredCrates
            .map((crate) => crate?.sets)
            .flat()
            .map((set: any) => set?.name)
        )
      );
    }

    if (filters.category) {
      filteredCrates = filteredCrates.map((crate) => ({
        ...crate,
        sets: (crate?.sets as any[]).filter(
          (set) => set.name == filters.category
        ),
      }));
    }

    return filteredCrates;
  }, [filters]);

  const setCurrentMap = useCallback((map) => {
    setFilters({ ...filters, map });
  }, []);

  const setCurrentCategory = useCallback((category) => {
    setFilters({ ...filters, category });
  }, []);

  const mapImages = [
    "The Island",
    "The Center",
    "Scorched Earth",
    "Ragnarok",
    "Aberration",
    "Extinction",
    "Valguero",
    "Genesis",
    "Crystal Isles",
    "Fjordur",
    "Lost Island",
    "Genesis 2",
  ];
  return (
    <div className="m-3">
      <Lookup
        items={mapImages.map((k) => ({
          name: k,
        }))}
        onChange={(e) => setCurrentMap(e.name)}
      ></Lookup>
      <Lookup
        items={categoryItems.map((k) => ({
          name: k,
        }))}
        onChange={(e) => setCurrentCategory(e.name)}
      ></Lookup>
      <div className="mt-3 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {daLootcrates.map((lootcrate, i) => (
          <ArkCard
            className="border-t-2"
            style={{
              borderColor: lootcrate.color ? lootcrate.color : "white",
            }}
            image={{
              src: `https://images.squarespace-cdn.com/content/v1/5a77b6ab18b27d34acd418fe/1543032194681-R59KJT0WFQG43AFYSDXA/ark-survival-evolved-hd-wallpapers-hd-68984-8087136.png`,
              alt: "test",
              position: "70% 30%",
            }}
            title={lootcrate.name}
            subtitle={lootcrate.Map.name}
            content={
              <div className="w-full space-y-2">
                <Tabs
                  tabs={lootcrate.LootcrateSet.map((s, l) => {
                    return {
                      title: s.name,
                      content: (
                        <div className="w-full rounded-lg border border-gray-200 bg-white/20 text-sm font-medium text-gray-900 backdrop-blur-sm transition-all duration-150 dark:border-gray-400 dark:text-white">
                          {s.LootcrateSetEntry.map((e, ind) => {
                            return (
                              e.items.every((g) => !isNaN(g[1])) && (
                                <details
                                  open={
                                    e.items.length == 1 &&
                                    s.LootcrateSetEntry.length == 1
                                  }
                                  key={`crate${i}-set${l}-entry${ind}`}
                                  className="hover:text-pea-700 focus:ring-pea-700 focus:text-pea-700 w-full cursor-pointer border-b border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 dark:border-gray-400  dark:hover:text-white dark:focus:text-white dark:focus:ring-gray-500"
                                >
                                  <summary className="text-base font-semibold">
                                    {e.name}
                                  </summary>
                                  <ul className="my-2 grid grid-cols-1 border-t border-gray-200 py-2 dark:border-gray-400 md:grid-cols-1 xl:grid-cols-2">
                                    {e.items.map(
                                      (itm) =>
                                        true && (
                                          <li className="space-x-2">
                                            <Link
                                              to={routes.item({
                                                id: itm[1],
                                              })}
                                              className="inline-flex space-x-2"
                                            >
                                              <img
                                                src={`https://arkcheat.com/images/ark/items/${
                                                  getItem(itm[1])?.image
                                                }`}
                                                className="inline-block h-6 w-6"
                                              />
                                              <p className="text-white">
                                                {getItem(itm[1])?.name}
                                              </p>
                                            </Link>
                                          </li>
                                        )
                                    )}
                                  </ul>
                                </details>
                              )
                            );
                          })}
                        </div>
                      ),
                    };
                  })}
                />
              </div>
            }
            ring={
              lootcrate?.level_requirement &&
              lootcrate.level_requirement?.min > 0
                ? `Lvl ${lootcrate.level_requirement.min}`
                : null
            }
          />
        ))}
      </div>
    </div>
  );
};

export default LootcratesList;
