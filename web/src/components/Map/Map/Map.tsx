import { Link, routes, navigate } from "@redwoodjs/router";
import { useMutation } from "@redwoodjs/web";
import { toast } from "@redwoodjs/web/toast";
import { useCallback, useMemo, useState } from "react";
import { Map as MapComp } from "src/components/Util/Map/Map";

import { capitalizeSentence, findShortestPath, jsonDisplay, timeTag } from "src/lib/formatters";

import type { DeleteMapMutationVariables, FindMapById } from "types/graphql";

const DELETE_MAP_MUTATION = gql`
  mutation DeleteMapMutation($id: BigInt!) {
    deleteMap(id: $id) {
      id
    }
  }
`;

interface Props {
  map: NonNullable<FindMapById["map"]>;
}

const Map = ({ map }: Props) => {
  const [deleteMap] = useMutation(DELETE_MAP_MUTATION, {
    onCompleted: () => {
      toast.success("Map deleted");
      navigate(routes.maps());
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onDeleteClick = (id: DeleteMapMutationVariables["id"]) => {
    if (confirm("Are you sure you want to delete map " + id + "?")) {
      deleteMap({ variables: { id } });
    }
  };

  const [mapData, setMapData] = useState([]);
  const [categories, setCategories] = useState({
    carniflora: {
      active: false,
      color: '#fed7aa'
    },
    mutagen_bulbs: {
      active: false,
      color: '#0284c7'
    },
    notes: {
      active: false,
      color: '#78350f'
    },
    loot_crates: {
      active: false,
      color: '#ea580c'
    },
    deinonychus_nests: {
      active: false,
      color: '#1c1917'
    },
    wyvern_nests: {
      active: false,
      color: '#bbf7d0'
    },
    ice_wyvern_nests: {
      active: false,
      color: '#22d3ee'
    },
    oil_veins: {
      active: false,
      color: '#171717'
    },
    water_veins: {
      active: false,
      color: '#3b82f6'
    },
    gas_veins: {
      active: false,
      color: '#eab308'
    },
    charge_nodes: {
      active: false,
      color: '#16a34a'
    },
    plant_z_nodes: {
      active: false,
      color: '#a3e635'
    },
    drake_nests: {
      active: false,
      color: '#525252'
    },
    magmasaur_nests: {
      active: false,
      color: '#b91c1c'
    },
    glitches: {
      active: false,
      color: '#7e22ce'
    },
    poison_trees: {
      active: false,
      color: '#365314'
    }
  });

  const setCategory = useCallback((e) => {
    const category = e.target.id.replace("-checkbox", "");
    const color = categories[category].color;
    const dataToAdd = map[category].map((item) => ({
      ...item,
      category,
      color,
      name: `${item.note ? item.note : capitalizeSentence(category.replaceAll("_", " "))}\n${item.lat}, ${item.lon}`
    }));
    setCategories((prevState) => ({
      ...prevState,
      [category]: {
        ...prevState[category],
        active: e.target.checked,
      },
    }));
    if (e.target.checked) {
      setMapData((prevState) => [...prevState, ...dataToAdd]);
    } else {
      setMapData((prevState) =>
        prevState.filter((item) => item.category !== category)
      );
    }
  }, [categories, mapData, setCategories, setMapData]);

  let n: any = map.notes;
  let notes = n.map((n) => {
    return { lat: n.lat, lon: n.lon, color: "#00ff00", name: n.note };
  });
  let noterun = []; //[57, 520, 242, 241, 201, 79, 238, 143, 301, 283, 284, 60]; The Island noterun



  return (
    <>
      <div className="rw-segment">
        <header className="rw-segment-header">
          <h2 className="rw-heading rw-heading-secondary">
            The {map.name} Map
          </h2>
        </header>
        <div className="rw-segment-main">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <div className="grid-col-span-1 text-gray-900 bg-white border border-gray-200 rounded-lg dark:bg-zinc-600 dark:border-zinc-500 dark:text-white h-fit">
              {map.loot_crates && (
                <label htmlFor="loot_crates-checkbox" className="relative inline-flex items-center text-sm group font-medium border-b first:rounded-t-lg last:rounded-b-lg border-gray-200 w-full dark:border-zinc-500">
                  <input id="loot_crates-checkbox" type="checkbox" value="" className="hidden peer" onChange={setCategory} />
                  <div className="dark:peer-checked:bg-zinc-500 peer-checked:bg-gray-100 px-4 py-2 w-full inline-flex items-center hover:bg-gray-100 group-first:rounded-t-lg group-last:rounded-b-lg hover:text-pea-700 peer-checked:z-10 peer-checked:ring-2 peer-checked:ring-pea-700 peer-checked:text-pea-700 dark:hover:bg-zinc-500 dark:hover:text-white dark:peer-checked:ring-zinc-400 dark:peer-checked:text-white peer-[:checked_svg]:text-orange-600">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" aria-hidden="true" className="w-4 h-4 mr-2 fill-current">
                      <path d="M352 336c0 8.875-7.125 16-16 16h-96C231.1 352 224 344.9 224 336V288H128v192h320V288h-96V336zM0 128v128h96V32C43 32 0 75 0 128zM0 448c0 17.62 14.38 32 32 32h64V288H0V448zM480 32v224h96V128C576 75 533 32 480 32zM304 304v-64C304 231.1 296.9 224 288 224S272 231.1 272 240v64C272 312.9 279.1 320 288 320S304 312.9 304 304zM480 480h64c17.62 0 32-14.38 32-32V288h-96V480zM128 256h96V208C224 199.1 231.1 192 240 192h96C344.9 192 352 199.1 352 208V256h96V32H128V256z" />
                    </svg>
                    Loot Crates
                  </div>
                </label>
              )}
              {map.oil_veins && (
                <label htmlFor="oil_veins-checkbox" className="relative inline-flex items-center text-sm group font-medium border-b first:rounded-t-lg last:rounded-b-lg border-gray-200 w-full dark:border-zinc-500">
                  <input id="oil_veins-checkbox" type="checkbox" value="" className="hidden peer" onChange={setCategory} />
                  <div className="dark:peer-checked:bg-zinc-500 peer-checked:bg-gray-100 px-4 py-2 w-full inline-flex items-center hover:bg-gray-100 group-first:rounded-t-lg group-last:rounded-b-lg hover:text-pea-700 peer-checked:z-10 peer-checked:ring-2 peer-checked:ring-pea-700 peer-checked:text-pea-700 dark:hover:bg-zinc-500 dark:hover:text-white dark:peer-checked:ring-zinc-400 dark:peer-checked:text-white peer-[:checked_svg]:text-neutral-900">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" className="w-4 h-4 mr-2 fill-current">
                      <path d="M528.3 61.3c-11.4-42.7-55.3-68-98-56.6L414.9 8.8C397.8 13.4 387.7 31 392.3 48l24.5 91.4L308.5 167.5l-6.3-18.1C297.7 136.6 285.6 128 272 128s-25.7 8.6-30.2 21.4l-13.6 39L96 222.6V184c0-13.3-10.7-24-24-24s-24 10.7-24 24V448H32c-17.7 0-32 14.3-32 32s14.3 32 32 32H544c17.7 0 32-14.3 32-32s-14.3-32-32-32H406.7L340 257.5l-62.2 16.1L305.3 352H238.7L265 277l-74.6 19.3L137.3 448H96V288.8l337.4-87.5 25.2 94c4.6 17.1 22.1 27.2 39.2 22.6l15.5-4.1c42.7-11.4 68-55.3 56.6-98L528.3 61.3zM205.1 448l11.2-32H327.7l11.2 32H205.1z" />
                    </svg>
                    Oil Veins
                  </div>
                </label>
              )}
              {map.water_veins && (
                <label htmlFor="water_veins-checkbox" className="relative inline-flex items-center text-sm group font-medium border-b first:rounded-t-lg last:rounded-b-lg border-gray-200 w-full dark:border-zinc-500">
                  <input id="water_veins-checkbox" type="checkbox" value="" className="hidden peer" onChange={setCategory} />
                  <div className="dark:peer-checked:bg-zinc-500 peer-checked:bg-gray-100 px-4 py-2 w-full inline-flex items-center hover:bg-gray-100 group-first:rounded-t-lg group-last:rounded-b-lg hover:text-pea-700 peer-checked:z-10 peer-checked:ring-2 peer-checked:ring-pea-700 peer-checked:text-pea-700 dark:hover:bg-zinc-500 dark:hover:text-white dark:peer-checked:ring-zinc-400 dark:peer-checked:text-white peer-[:checked_svg]:text-blue-500">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" aria-hidden="true" className="w-4 h-4 mr-2 fill-current">
                      <path d="M221.3 22.13c-8-28.87-49.5-30.12-58.5 0C116 179.9 16 222.8 16 333.9c0 98.5 78.75 178.1 176 178.1s176-79.63 176-178.1C368 222.1 268.3 180.6 221.3 22.13zM192 448c-61.75 0-112-50.25-112-111.1c0-8.875 7.125-16 16-16s16 7.125 16 16c0 44.12 35.88 79.1 80 79.1c8.875 0 16 7.125 16 15.1C208 440.9 200.9 448 192 448z" />
                    </svg>
                    Water Veins
                  </div>
                </label>
              )}
              {map.wyvern_nests && (
                <label htmlFor="wyvern_nests-checkbox" className="relative inline-flex items-center text-sm group font-medium border-b first:rounded-t-lg last:rounded-b-lg border-gray-200 w-full dark:border-zinc-500">
                  <input id="wyvern_nests-checkbox" type="checkbox" value="" className="hidden peer" onChange={setCategory} />
                  <div className="dark:peer-checked:bg-zinc-500 peer-checked:bg-gray-100 px-4 py-2 w-full inline-flex items-center hover:bg-gray-100 group-first:rounded-t-lg group-last:rounded-b-lg hover:text-pea-700 peer-checked:z-10 peer-checked:ring-2 peer-checked:ring-pea-700 peer-checked:text-pea-700 dark:hover:bg-zinc-500 dark:hover:text-white dark:peer-checked:ring-zinc-400 dark:peer-checked:text-white peer-[:checked_svg]:text-green-200">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" className="fill-current w-4 h-4 mr-2">
                      <path fillRule="evenodd" d="M18.43 255.8L192 224L100.8 292.6C90.67 302.8 97.8 320 112 320h222.7c-9.499-26.5-14.75-54.5-14.75-83.38V194.2L200.3 106.8C176.5 90.88 145 92.75 123.3 111.2l-117.5 116.4C-6.562 238 2.436 258 18.43 255.8zM575.2 289.9l-100.7-50.25c-16.25-8.125-26.5-24.75-26.5-43V160h63.99l28.12 22.62C546.1 188.6 554.2 192 562.7 192h30.1c11.1 0 23.12-6.875 28.5-17.75l14.37-28.62c5.374-10.87 4.25-23.75-2.999-33.5l-74.49-99.37C552.1 4.75 543.5 0 533.5 0H296C288.9 0 285.4 8.625 290.4 13.62L351.1 64L292.4 88.75c-5.874 3-5.874 11.37 0 14.37L351.1 128l-.0011 108.6c0 72 35.99 139.4 95.99 179.4c-195.6 6.75-344.4 41-434.1 60.88c-8.124 1.75-13.87 9-13.87 17.38C.0463 504 8.045 512 17.79 512h499.1c63.24 0 119.6-47.5 122.1-110.8C642.3 354 617.1 310.9 575.2 289.9zM489.1 66.25l45.74 11.38c-2.75 11-12.5 18.88-24.12 18.25C497.7 95.25 484.8 83.38 489.1 66.25z" />
                    </svg>
                    Wyvern Nests
                  </div>
                </label>
              )}
              {map.ice_wyvern_nests && (
                <label htmlFor="ice_wyvern_nests-checkbox" className="relative inline-flex items-center text-sm group font-medium border-b first:rounded-t-lg last:rounded-b-lg border-gray-200 w-full dark:border-zinc-500">
                  <input id="ice_wyvern_nests-checkbox" type="checkbox" value="" className="hidden peer" onChange={setCategory} />
                  <div className="dark:peer-checked:bg-zinc-500 peer-checked:bg-gray-100 px-4 py-2 w-full inline-flex items-center hover:bg-gray-100 group-first:rounded-t-lg group-last:rounded-b-lg hover:text-pea-700 peer-checked:z-10 peer-checked:ring-2 peer-checked:ring-pea-700 peer-checked:text-pea-700 dark:hover:bg-zinc-500 dark:hover:text-white dark:peer-checked:ring-zinc-400 dark:peer-checked:text-white peer-[:checked_svg]:text-cyan-400">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" aria-hidden="true" className="fill-current w-4 h-4 mr-2">
                      <path fillRule="evenodd" d="M18.43 255.8L192 224L100.8 292.6C90.67 302.8 97.8 320 112 320h222.7c-9.499-26.5-14.75-54.5-14.75-83.38V194.2L200.3 106.8C176.5 90.88 145 92.75 123.3 111.2l-117.5 116.4C-6.562 238 2.436 258 18.43 255.8zM575.2 289.9l-100.7-50.25c-16.25-8.125-26.5-24.75-26.5-43V160h63.99l28.12 22.62C546.1 188.6 554.2 192 562.7 192h30.1c11.1 0 23.12-6.875 28.5-17.75l14.37-28.62c5.374-10.87 4.25-23.75-2.999-33.5l-74.49-99.37C552.1 4.75 543.5 0 533.5 0H296C288.9 0 285.4 8.625 290.4 13.62L351.1 64L292.4 88.75c-5.874 3-5.874 11.37 0 14.37L351.1 128l-.0011 108.6c0 72 35.99 139.4 95.99 179.4c-195.6 6.75-344.4 41-434.1 60.88c-8.124 1.75-13.87 9-13.87 17.38C.0463 504 8.045 512 17.79 512h499.1c63.24 0 119.6-47.5 122.1-110.8C642.3 354 617.1 310.9 575.2 289.9zM489.1 66.25l45.74 11.38c-2.75 11-12.5 18.88-24.12 18.25C497.7 95.25 484.8 83.38 489.1 66.25z" />
                    </svg>
                    Ice Wyvern Nests
                  </div>
                </label>
              )}
              {map.gas_veins && (
                <label htmlFor="gas_veins-checkbox" className="relative inline-flex items-center text-sm group font-medium border-b first:rounded-t-lg last:rounded-b-lg border-gray-200 w-full dark:border-zinc-500">
                  <input id="gas_veins-checkbox" type="checkbox" value="" className="hidden peer" onChange={setCategory} />
                  <div className="dark:peer-checked:bg-zinc-500 peer-checked:bg-gray-100 px-4 py-2 w-full inline-flex items-center hover:bg-gray-100 group-first:rounded-t-lg group-last:rounded-b-lg hover:text-pea-700 peer-checked:z-10 peer-checked:ring-2 peer-checked:ring-pea-700 peer-checked:text-pea-700 dark:hover:bg-zinc-500 dark:hover:text-white dark:peer-checked:ring-zinc-400 dark:peer-checked:text-white peer-[:checked_svg]:text-yellow-500">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" aria-hidden="true" className="w-4 h-4 mr-2 fill-current">
                      <path d="M203.1 4.365c-6.177-5.82-16.06-5.819-22.23-.0007C74.52 104.5 0 234.1 0 312C0 437.9 79 512 192 512s192-74.05 192-200C384 233.9 309 104.2 203.1 4.365zM192 432c-56.5 0-96-37.76-96-91.74c0-12.47 4.207-55.32 83.87-143c6.314-6.953 17.95-6.953 24.26 0C283.8 284.9 288 327.8 288 340.3C288 394.2 248.5 432 192 432z" />
                    </svg>
                    Gas Veins
                  </div>
                </label>
              )}
              {map.deinonychus_nests && (
                <label htmlFor="deinonychus_nests-checkbox" className="relative inline-flex items-center text-sm group font-medium border-b first:rounded-t-lg last:rounded-b-lg border-gray-200 w-full dark:border-zinc-500">
                  <input id="deinonychus_nests-checkbox" type="checkbox" value="" className="hidden peer" onChange={setCategory} />
                  <div className="dark:peer-checked:bg-zinc-500 peer-checked:bg-gray-100 px-4 py-2 w-full inline-flex items-center hover:bg-gray-100 group-first:rounded-t-lg group-last:rounded-b-lg hover:text-pea-700 peer-checked:z-10 peer-checked:ring-2 peer-checked:ring-pea-700 peer-checked:text-pea-700 dark:hover:bg-zinc-500 dark:hover:text-white dark:peer-checked:ring-zinc-400 dark:peer-checked:text-white peer-[:checked_svg]:text-stone-900">
                    <svg aria-hidden="true" className="w-4 h-4 mr-2 fill-current" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M2 9.5A3.5 3.5 0 005.5 13H9v2.586l-1.293-1.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 15.586V13h2.5a4.5 4.5 0 10-.616-8.958 4.002 4.002 0 10-7.753 1.977A3.5 3.5 0 002 9.5zm9 3.5H9V8a1 1 0 012 0v5z" clipRule="evenodd"></path>
                    </svg>
                    Deino Nests
                  </div>
                </label>
              )}
              {map.charge_nodes && (
                <label htmlFor="charge_nodes-checkbox" className="relative inline-flex items-center text-sm group font-medium border-b first:rounded-t-lg last:rounded-b-lg border-gray-200 w-full dark:border-zinc-500">
                  <input id="charge_nodes-checkbox" type="checkbox" value="" className="hidden peer" onChange={setCategory} />
                  <div className="dark:peer-checked:bg-zinc-500 peer-checked:bg-gray-100 px-4 py-2 w-full inline-flex items-center hover:bg-gray-100 group-first:rounded-t-lg group-last:rounded-b-lg hover:text-pea-700 peer-checked:z-10 peer-checked:ring-2 peer-checked:ring-pea-700 peer-checked:text-pea-700 dark:hover:bg-zinc-500 dark:hover:text-white dark:peer-checked:ring-zinc-400 dark:peer-checked:text-white peer-[:checked_svg]:text-green-600">
                    <svg aria-hidden="true" className="w-4 h-4 mr-2 fill-current" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M2 9.5A3.5 3.5 0 005.5 13H9v2.586l-1.293-1.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 15.586V13h2.5a4.5 4.5 0 10-.616-8.958 4.002 4.002 0 10-7.753 1.977A3.5 3.5 0 002 9.5zm9 3.5H9V8a1 1 0 012 0v5z" clipRule="evenodd"></path>
                    </svg>
                    Charge Nodes
                  </div>
                </label>
              )}
              {map.plant_z_nodes && (
                <label htmlFor="plant_z_nodes-checkbox" className="relative inline-flex items-center text-sm group font-medium border-b first:rounded-t-lg last:rounded-b-lg border-gray-200 w-full dark:border-zinc-500">
                  <input id="plant_z_nodes-checkbox" type="checkbox" value="" className="hidden peer" onChange={setCategory} />
                  <div className="dark:peer-checked:bg-zinc-500 peer-checked:bg-gray-100 px-4 py-2 w-full inline-flex items-center hover:bg-gray-100 group-first:rounded-t-lg group-last:rounded-b-lg hover:text-pea-700 peer-checked:z-10 peer-checked:ring-2 peer-checked:ring-pea-700 peer-checked:text-pea-700 dark:hover:bg-zinc-500 dark:hover:text-white dark:peer-checked:ring-zinc-400 dark:peer-checked:text-white peer-[:checked_svg]:text-lime-400">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" aria-hidden="true" className="w-4 h-4 mr-2 fill-current">
                      <path d="M512 165.4c0 127.9-70.05 235.3-175.3 270.1c-20.04 7.938-41.83 12.46-64.69 12.46c-64.9 0-125.2-36.51-155.7-94.47c-54.13 49.93-68.71 107-68.96 108.1C44.72 472.6 34.87 480 24.02 480c-1.844 0-3.727-.2187-5.602-.6562c-12.89-3.098-20.84-16.08-17.75-28.96c9.598-39.5 90.47-226.4 335.3-226.4C344.8 224 352 216.8 352 208S344.8 192 336 192C228.6 192 151 226.6 96.29 267.6c.1934-10.82 1.242-21.84 3.535-33.05c13.47-65.81 66.04-119 131.4-134.2c28.33-6.562 55.68-6.013 80.93-.0054c56 13.32 118.2-7.412 149.3-61.24c5.664-9.828 20.02-9.516 24.66 .8282C502.7 76.76 512 121.9 512 165.4z" />
                    </svg>
                    Plant Z Nodes
                  </div>
                </label>
              )}
              {map.drake_nests && (
                <label htmlFor="drake_nests-checkbox" className="relative inline-flex items-center text-sm group font-medium border-b first:rounded-t-lg last:rounded-b-lg border-gray-200 w-full dark:border-zinc-500">
                  <input id="drake_nests-checkbox" type="checkbox" value="" className="hidden peer" onChange={setCategory} />
                  <div className="dark:peer-checked:bg-zinc-500 peer-checked:bg-gray-100 px-4 py-2 w-full inline-flex items-center hover:bg-gray-100 group-first:rounded-t-lg group-last:rounded-b-lg hover:text-pea-700 peer-checked:z-10 peer-checked:ring-2 peer-checked:ring-pea-700 peer-checked:text-pea-700 dark:hover:bg-zinc-500 dark:hover:text-white dark:peer-checked:ring-zinc-400 dark:peer-checked:text-white peer-[:checked_svg]:text-neutral-600">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" className="fill-current w-4 h-4 mr-2">
                      <path fillRule="evenodd" d="M18.43 255.8L192 224L100.8 292.6C90.67 302.8 97.8 320 112 320h222.7c-9.499-26.5-14.75-54.5-14.75-83.38V194.2L200.3 106.8C176.5 90.88 145 92.75 123.3 111.2l-117.5 116.4C-6.562 238 2.436 258 18.43 255.8zM575.2 289.9l-100.7-50.25c-16.25-8.125-26.5-24.75-26.5-43V160h63.99l28.12 22.62C546.1 188.6 554.2 192 562.7 192h30.1c11.1 0 23.12-6.875 28.5-17.75l14.37-28.62c5.374-10.87 4.25-23.75-2.999-33.5l-74.49-99.37C552.1 4.75 543.5 0 533.5 0H296C288.9 0 285.4 8.625 290.4 13.62L351.1 64L292.4 88.75c-5.874 3-5.874 11.37 0 14.37L351.1 128l-.0011 108.6c0 72 35.99 139.4 95.99 179.4c-195.6 6.75-344.4 41-434.1 60.88c-8.124 1.75-13.87 9-13.87 17.38C.0463 504 8.045 512 17.79 512h499.1c63.24 0 119.6-47.5 122.1-110.8C642.3 354 617.1 310.9 575.2 289.9zM489.1 66.25l45.74 11.38c-2.75 11-12.5 18.88-24.12 18.25C497.7 95.25 484.8 83.38 489.1 66.25z" />
                    </svg>
                    Drake Nests
                  </div>
                </label>
              )}
              {map.glitches && (
                <label htmlFor="glitches-checkbox" className="relative inline-flex items-center text-sm group font-medium border-b first:rounded-t-lg last:rounded-b-lg border-gray-200 w-full dark:border-zinc-500">
                  <input id="glitches-checkbox" type="checkbox" value="" className="hidden peer" onChange={setCategory} />
                  <div className="dark:peer-checked:bg-zinc-500 peer-checked:bg-gray-100 px-4 py-2 w-full inline-flex items-center hover:bg-gray-100 group-first:rounded-t-lg group-last:rounded-b-lg hover:text-pea-700 peer-checked:z-10 peer-checked:ring-2 peer-checked:ring-pea-700 peer-checked:text-pea-700 dark:hover:bg-zinc-500 dark:hover:text-white dark:peer-checked:ring-zinc-400 dark:peer-checked:text-white peer-[:checked_svg]:text-purple-700">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" aria-hidden="true" className="w-4 h-4 mr-2 fill-current">
                      <path d="M324.4 103.1L384 128l24.88 59.63C410.2 190.3 413 192 416 192s5.75-1.75 7.125-4.375L448 128l59.63-24.88C510.3 101.8 512 99 512 96s-1.75-5.75-4.375-7.125L448 64l-24.88-59.62C421.8 1.75 419 0 416 0s-5.75 1.75-7.125 4.375L384 64l-59.63 24.88C321.8 90.25 320 93 320 96S321.8 101.8 324.4 103.1zM507.6 408.9L448 384l-24.88-59.63C421.8 321.8 419 320 416 320s-5.75 1.75-7.125 4.375L384 384l-59.63 24.88C321.8 410.2 320 413 320 416s1.75 5.75 4.375 7.125L384 448l24.88 59.63C410.2 510.2 413 512 416 512s5.75-1.75 7.125-4.375L448 448l59.63-24.88C510.3 421.8 512 419 512 416S510.3 410.2 507.6 408.9zM384 255.6c0-6-3.375-11.62-8.875-14.38l-112.5-56.31L206.3 72.19c-5.375-10.88-23.13-10.88-28.5 0L121.4 184.9L8.875 241.2C3.375 244 0 249.6 0 255.6c0 6.125 3.375 11.62 8.875 14.38l112.5 56.37l56.38 112.7C180.4 444.4 185.1 447.9 192 447.9c5.999 0 11.62-3.512 14.25-8.887l56.38-112.7l112.5-56.37C380.6 267.2 384 261.8 384 255.6z" />
                    </svg>
                    Glitches
                  </div>
                </label>
              )}
              {map.magmasaur_nests && (
                <label htmlFor="magmasaur_nests-checkbox" className="relative inline-flex items-center text-sm group font-medium border-b first:rounded-t-lg last:rounded-b-lg border-gray-200 w-full dark:border-zinc-500">
                  <input id="magmasaur_nests-checkbox" type="checkbox" value="" className="hidden peer" onChange={setCategory} />
                  <div className="dark:peer-checked:bg-zinc-500 peer-checked:bg-gray-100 px-4 py-2 w-full inline-flex items-center hover:bg-gray-100 group-first:rounded-t-lg group-last:rounded-b-lg hover:text-pea-700 peer-checked:z-10 peer-checked:ring-2 peer-checked:ring-pea-700 peer-checked:text-pea-700 dark:hover:bg-zinc-500 dark:hover:text-white dark:peer-checked:ring-zinc-400 dark:peer-checked:text-white peer-[:checked_svg]:text-red-900">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" aria-hidden="true" className="w-4 h-4 mr-2 fill-current">
                      <path d="M160 144c-35.3 0-64-28.7-64-64s28.7-64 64-64c15.7 0 30 5.6 41.2 15C212.4 12.4 232.7 0 256 0s43.6 12.4 54.8 31C322 21.6 336.3 16 352 16c35.3 0 64 28.7 64 64s-28.7 64-64 64c-14.7 0-28.3-5-39.1-13.3l-32 48C275.3 187 266 192 256 192s-19.3-5-24.9-13.3l-32-48C188.3 139 174.7 144 160 144zM144 352l48.4-24.2c10.2-5.1 21.6-7.8 33-7.8c19.6 0 38.4 7.8 52.2 21.6l32.5 32.5c6.3 6.3 14.9 9.9 23.8 9.9c11.3 0 21.8-5.6 28-15l9.7-14.6-59-66.3c-9.1-10.2-22.2-16.1-35.9-16.1H235.1c-13.7 0-26.8 5.9-35.9 16.1l-59.9 67.4L144 352zm19.4-95.8c18.2-20.5 44.3-32.2 71.8-32.2h41.8c27.4 0 53.5 11.7 71.8 32.2l150.2 169c8.5 9.5 13.2 21.9 13.2 34.7c0 28.8-23.4 52.2-52.2 52.2H52.2C23.4 512 0 488.6 0 459.8c0-12.8 4.7-25.1 13.2-34.7l150.2-169z" />
                    </svg>
                    Magmasaur Nests
                  </div>
                </label>
              )}
              {map.poison_trees && (
                <label htmlFor="poison_trees-checkbox" className="relative inline-flex items-center text-sm group font-medium border-b first:rounded-t-lg last:rounded-b-lg border-gray-200 w-full dark:border-zinc-500">
                  <input id="poison_trees-checkbox" type="checkbox" value="" className="hidden peer" onChange={setCategory} />
                  <div className="dark:peer-checked:bg-zinc-500 peer-checked:bg-gray-100 px-4 py-2 w-full inline-flex items-center hover:bg-gray-100 group-first:rounded-t-lg group-last:rounded-b-lg hover:text-pea-700 peer-checked:z-10 peer-checked:ring-2 peer-checked:ring-pea-700 peer-checked:text-pea-700 dark:hover:bg-zinc-500 dark:hover:text-white dark:peer-checked:ring-zinc-400 dark:peer-checked:text-white peer-[:checked_svg]:text-lime-900">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" aria-hidden="true" className="w-4 h-4 mr-2 fill-current">
                      <path d="M413.8 447.1L256 448l0 31.99C256 497.7 241.8 512 224.1 512c-17.67 0-32.1-14.32-32.1-31.99l0-31.99l-158.9-.0099c-28.5 0-43.69-34.49-24.69-56.4l68.98-79.59H62.22c-25.41 0-39.15-29.8-22.67-49.13l60.41-70.85H89.21c-21.28 0-32.87-22.5-19.28-37.31l134.8-146.5c10.4-11.3 28.22-11.3 38.62-.0033l134.9 146.5c13.62 14.81 2.001 37.31-19.28 37.31h-10.77l60.35 70.86c16.46 19.34 2.716 49.12-22.68 49.12h-15.2l68.98 79.59C458.7 413.7 443.1 447.1 413.8 447.1z" />
                    </svg>
                    Poison Trees
                  </div>
                </label>
              )}
              {map.mutagen_bulbs && (
                <label htmlFor="mutagen_bulbs-checkbox" className="relative inline-flex items-center text-sm group font-medium border-b first:rounded-t-lg last:rounded-b-lg border-gray-200 w-full dark:border-zinc-500">
                  <input id="mutagen_bulbs-checkbox" type="checkbox" value="" className="hidden peer" onChange={setCategory} />
                  <div className="dark:peer-checked:bg-zinc-500 peer-checked:bg-gray-100 px-4 py-2 w-full inline-flex items-center hover:bg-gray-100 group-first:rounded-t-lg group-last:rounded-b-lg hover:text-pea-700 peer-checked:z-10 peer-checked:ring-2 peer-checked:ring-pea-700 peer-checked:text-pea-700 dark:hover:bg-zinc-500 dark:hover:text-white dark:peer-checked:ring-zinc-400 dark:peer-checked:text-white peer-[:checked_svg]:text-teal-400">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" aria-hidden="true" className="w-4 h-4 mr-2 fill-current">
                      <path d="M192 16c-106 0-192 182-192 288c0 106 85.1 192 192 192c105.1 0 192-85.1 192-192C384 198 297.1 16 192 16zM160.1 138C128.6 177.1 96 249.8 96 304C96 312.8 88.84 320 80 320S64 312.8 64 304c0-63.56 36.7-143.3 71.22-186c5.562-6.906 15.64-7.969 22.5-2.406C164.6 121.1 165.7 131.2 160.1 138z" />
                    </svg>
                    Mutagen Bulbs
                  </div>
                </label>
              )}
              {map.carniflora && (
                <label htmlFor="carniflora-checkbox" className="relative inline-flex items-center text-sm group font-medium border-b first:rounded-t-lg last:rounded-b-lg border-gray-200 w-full dark:border-zinc-500">
                  <input id="carniflora-checkbox" type="checkbox" value="" className="hidden peer" onChange={setCategory} />
                  <div className="dark:peer-checked:bg-zinc-500 peer-checked:bg-gray-100 px-4 py-2 w-full inline-flex items-center hover:bg-gray-100 group-first:rounded-t-lg group-last:rounded-b-lg hover:text-pea-700 peer-checked:z-10 peer-checked:ring-2 peer-checked:ring-pea-700 peer-checked:text-pea-700 dark:hover:bg-zinc-500 dark:hover:text-white dark:peer-checked:ring-zinc-400 dark:peer-checked:text-white peer-[:checked_svg]:text-orange-200">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" aria-hidden="true" className="w-4 h-4 mr-2 fill-current">
                      <path d="M512 165.4c0 127.9-70.05 235.3-175.3 270.1c-20.04 7.938-41.83 12.46-64.69 12.46c-64.9 0-125.2-36.51-155.7-94.47c-54.13 49.93-68.71 107-68.96 108.1C44.72 472.6 34.87 480 24.02 480c-1.844 0-3.727-.2187-5.602-.6562c-12.89-3.098-20.84-16.08-17.75-28.96c9.598-39.5 90.47-226.4 335.3-226.4C344.8 224 352 216.8 352 208S344.8 192 336 192C228.6 192 151 226.6 96.29 267.6c.1934-10.82 1.242-21.84 3.535-33.05c13.47-65.81 66.04-119 131.4-134.2c28.33-6.562 55.68-6.013 80.93-.0054c56 13.32 118.2-7.412 149.3-61.24c5.664-9.828 20.02-9.516 24.66 .8282C502.7 76.76 512 121.9 512 165.4z" />
                    </svg>
                    Carniflora
                  </div>
                </label>
              )}
              {map.notes && (
                <label htmlFor="notes-checkbox" className="relative inline-flex items-center text-sm group font-medium first:rounded-t-lg last:rounded-b-lg border-gray-200 w-full dark:border-zinc-500">
                  <input id="notes-checkbox" type="checkbox" value="" className="hidden peer" onChange={setCategory} />
                  <div className="dark:peer-checked:bg-zinc-500 peer-checked:bg-gray-100 px-4 py-2 w-full inline-flex items-center hover:bg-gray-100 group-first:rounded-t-lg group-last:rounded-b-lg hover:text-pea-700 peer-checked:z-10 peer-checked:ring-2 peer-checked:ring-pea-700 peer-checked:text-pea-700 dark:hover:bg-zinc-500 dark:hover:text-white dark:peer-checked:ring-zinc-400 dark:peer-checked:text-white peer-[:checked_svg]:text-amber-900">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" aria-hidden="true" className="w-4 h-4 mr-2 fill-current">
                      <path d="M352 336c0 8.875-7.125 16-16 16h-96C231.1 352 224 344.9 224 336V288H128v192h320V288h-96V336zM0 128v128h96V32C43 32 0 75 0 128zM0 448c0 17.62 14.38 32 32 32h64V288H0V448zM480 32v224h96V128C576 75 533 32 480 32zM304 304v-64C304 231.1 296.9 224 288 224S272 231.1 272 240v64C272 312.9 279.1 320 288 320S304 312.9 304 304zM480 480h64c17.62 0 32-14.38 32-32V288h-96V480zM128 256h96V208C224 199.1 231.1 192 240 192h96C344.9 192 352 199.1 352 208V256h96V32H128V256z" />
                    </svg>
                    Notes
                  </div>
                </label>
              )}
            </div>
            <MapComp
              interactive={true}
              map={map.name.replace(" ", "")}
              size={{ width: 500, height: 500 }}
              pos={mapData}
              path={{
                color: "#0000ff",
                coords: noterun.map((b) => {
                  let note = n.find((j) => j.noteIndex === b);

                  return {
                    lat: note.lat,
                    lon: note.long,
                  };
                }),
              }}
            />
          </div>

          {/* <MapComp
            interactive={true}
            map={map.name.replace(" ", "")}
            size={{ width: 500, height: 500 }}
            pos={notes}
            path={{
              color: "#0000ff",
              coords: noterun.map((b) => {
                let note = n.find((j) => j.noteIndex === b);

                return {
                  lat: note.lat,
                  lon: note.long,
                };
              }),
            }}
          /> */}
        </div>
      </div>
      <section>
        <Link to={routes.basespots({ map: map.name })}>Basespots</Link>
      </section>
      <nav className="rw-button-group">
        <Link
          to={routes.editMap({ id: map.id.toString() })}
          className="rw-button rw-button-blue"
        >
          Edit
        </Link>
        <button
          type="button"
          className="rw-button rw-button-red"
          onClick={() => onDeleteClick(map.id)}
        >
          Delete
        </button>
      </nav>
    </>
  );
};

export default Map;