import { Link, routes } from "@redwoodjs/router";
import { MetaTags } from "@redwoodjs/web";
import lootcrates from "../../../public/lootcratesItemId.json";
import items from "../../../public/arkitems.json";
import { useCallback, useEffect, useMemo, useState } from "react";
import ArkCard from "src/components/ArkCard/ArkCard";
import Lookup from "src/components/Util/Lookup/Lookup";
import { removeDuplicates } from "src/lib/formatters";
import Tabs from "src/components/Util/Tabs/Tabs";
const LootcratesPage = () => {
  // const [daLootcrates, setDaLootcrates] = useState([]);
  const [currentMap, setCurrentMab] = useState("");
  const [currentCategory, setCurrentCategorb] = useState("");
  const [filters, setFilters] = useState({ map: "", category: "" });
  const [categoryItems, setCategoryItems] = useState([]);
  const getItem = useCallback((id) => {
    return !id || isNaN(id)
      ? null
      : items.items.find((g) => g.id.toString() === id.toString());
  }, [items.items]);

  const daLootcrates = useMemo(() => {
    let filteredCrates = lootcrates?.lootCrates;

    if (filters.map) {

      filteredCrates = filteredCrates.filter(
        (crate) =>
          crate?.map &&
          crate.map.toLowerCase().includes(filters.map.toLowerCase())
      );
      setCategoryItems(
        removeDuplicates(
          filteredCrates
            .map((crate) => crate?.sets)
            .flat()
            .map((set) => set?.name)
        )
      );
    }

    if (filters.category) {
      filteredCrates = filteredCrates.map((crate) => ({
        ...crate,
        sets: crate?.sets
          ? crate?.sets.filter((set) => set.name == filters.category)
          : [],
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
    'The Island',
    'The Center',
    'Scorched Earth',
    'Ragnarok',
    'Aberration',
    'Extinction',
    'Valguero',
    'Genesis',
    'Crystal Isles',
    'Fjordur',
    'Lost Island',
    'Genesis 2',
  ];
  return (
    <>
      <MetaTags title="Lootcrates" description="Lootcrates page" />
      <div className="m-3">
        <Lookup
          items={mapImages.map((k) => ({
            name: k,
          }))}
          onChange={(e) => setCurrentMap(e.name)}
        >
        </Lookup>
        <Lookup
          items={categoryItems.map((k) => ({
            name: k,
          }))}
          onChange={(e) => setCurrentCategory(e.name)}
        >
        </Lookup>
        <div className="mt-3 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {daLootcrates.map((lootcrate, i) => (
            <ArkCard
              className="border-t-2"
              style={{ borderColor: lootcrate.color ? lootcrate.color : 'white' }}
              image={{
                src: `https://images.squarespace-cdn.com/content/v1/5a77b6ab18b27d34acd418fe/1543032194681-R59KJT0WFQG43AFYSDXA/ark-survival-evolved-hd-wallpapers-hd-68984-8087136.png`,
                alt: 'test',
                position: '70% 30%'
              }}
              title={lootcrate.name}
              subtitle={lootcrate.map}
              content={
                <div className="space-y-2 w-full">
                  <Tabs tabs={
                    lootcrate.sets.map((s, l) => {
                      return {
                        title: s.name, content: (
                          <div className="w-full text-sm font-medium text-gray-900  border border-gray-200 rounded-lg  dark:border-gray-400 dark:text-white">
                            {s.entries.map((e, ind) => {
                              return e.items.every((g) => !isNaN(g[1])) && (<details open={e.items.length == 1 && s.entries.length == 1} key={`crate${i}-set${l}-entry${ind}`} className="w-full px-4 py-2 border-b border-gray-200 cursor-pointer hover:text-pea-700 focus:outline-none focus:ring-2 focus:ring-pea-700 focus:text-pea-700 dark:border-gray-400  dark:hover:text-white dark:focus:ring-gray-500 dark:focus:text-white">
                                <summary className="font-semibold text-base">{e.name}</summary>
                                <ul className="grid grid-cols-1 md:grid-cols-1 xl:grid-cols-2 my-2 py-2 border-t border-gray-200 dark:border-gray-400">
                                  {e.items.map((itm) => (
                                    getItem(itm[1])?.name && (
                                      <li className="space-x-2">
                                        <Link to={routes.item({ id: itm[1].toString() })} className="inline-flex space-x-2">
                                          <img src={`https://arkcheat.com/images/ark/items/${getItem(itm[1])?.image}`} className="w-6 h-6 inline-block" />
                                          <p className="text-white">{getItem(itm[1])?.name}</p>
                                        </Link>
                                      </li>
                                    )
                                  ))}
                                </ul>
                              </details>)
                            }
                            )}
                          </div>
                        )
                      }
                    })
                  }
                  />
                </div>
              }
              ring={lootcrate.levelReq.min > 0 ? `Lvl ${lootcrate.levelReq.min}` : null}
            />
          ))}
        </div >
      </div >
    </>
  );
};

export default LootcratesPage;
