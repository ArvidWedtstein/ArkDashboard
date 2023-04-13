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
import { useParams } from "@redwoodjs/router";

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

  let { map } = useParams();
  const [filters, setFilters] = useState({ map: map || "", category: "" });
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
  // https://ark.wiki.gg/wiki/Coordinates
  return (
    <div className="m-3">
      <Lookup
        items={mapImages.map((k) => ({
          name: k,
        }))}
        onSelect={(e) => setCurrentMap(e.name)}
      ></Lookup>
      <Lookup
        items={categoryItems.map((k) => ({
          name: k,
        }))}
        onSelect={(e) => setCurrentCategory(e.name)}
      ></Lookup>
      <div className="mt-3 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {daLootcrates.map((lootcrate, i) => (
          <ArkCard
            key={`lootcrate-${i}`}
            className="border-t-2"
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
                lootcrate.level_requirement?.min > 0
                ? `Lvl ${lootcrate.level_requirement.min}`
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
