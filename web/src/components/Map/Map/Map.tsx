import { Link, routes, navigate } from "@redwoodjs/router";
import { useMutation } from "@redwoodjs/web";
import { toast } from "@redwoodjs/web/toast";
import { useCallback, useState } from "react";
import ArkCard from "src/components/ArkCard/ArkCard";
import CheckboxGroup from "src/components/Util/CheckSelect/CheckboxGroup";
import MapComp from "src/components/Util/Map/Map";

import { capitalizeSentence } from "src/lib/formatters";

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
    mutagen_bulb: {
      active: false,
      color: "#0284c7",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 384 512"
          aria-hidden="true"
          className="h-12 w-12 fill-current"
        >
          <path d="M192 16c-106 0-192 182-192 288c0 106 85.1 192 192 192c105.1 0 192-85.1 192-192C384 198 297.1 16 192 16zM160.1 138C128.6 177.1 96 249.8 96 304C96 312.8 88.84 320 80 320S64 312.8 64 304c0-63.56 36.7-143.3 71.22-186c5.562-6.906 15.64-7.969 22.5-2.406C164.6 121.1 165.7 131.2 160.1 138z" />
        </svg>
      ),
    },
    notes: {
      active: false,
      color: "#78350f",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 576 512"
          aria-hidden="true"
          className="h-12 w-12 fill-current"
        >
          <path d="M352 336c0 8.875-7.125 16-16 16h-96C231.1 352 224 344.9 224 336V288H128v192h320V288h-96V336zM0 128v128h96V32C43 32 0 75 0 128zM0 448c0 17.62 14.38 32 32 32h64V288H0V448zM480 32v224h96V128C576 75 533 32 480 32zM304 304v-64C304 231.1 296.9 224 288 224S272 231.1 272 240v64C272 312.9 279.1 320 288 320S304 312.9 304 304zM480 480h64c17.62 0 32-14.38 32-32V288h-96V480zM128 256h96V208C224 199.1 231.1 192 240 192h96C344.9 192 352 199.1 352 208V256h96V32H128V256z" />
        </svg>
      ),
    },
    loot_crate: {
      active: false,
      color: "#ea580c",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 576 512"
          aria-hidden="true"
          className="h-12 w-12 fill-current"
        >
          <path d="M352 336c0 8.875-7.125 16-16 16h-96C231.1 352 224 344.9 224 336V288H128v192h320V288h-96V336zM0 128v128h96V32C43 32 0 75 0 128zM0 448c0 17.62 14.38 32 32 32h64V288H0V448zM480 32v224h96V128C576 75 533 32 480 32zM304 304v-64C304 231.1 296.9 224 288 224S272 231.1 272 240v64C272 312.9 279.1 320 288 320S304 312.9 304 304zM480 480h64c17.62 0 32-14.38 32-32V288h-96V480zM128 256h96V208C224 199.1 231.1 192 240 192h96C344.9 192 352 199.1 352 208V256h96V32H128V256z" />
        </svg>
      ),
    },
    deinonychus_nest: {
      active: false,
      color: "#1c1917",
      icon: (
        <svg
          aria-hidden="true"
          className="h-12 w-12 fill-current"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M2 9.5A3.5 3.5 0 005.5 13H9v2.586l-1.293-1.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 15.586V13h2.5a4.5 4.5 0 10-.616-8.958 4.002 4.002 0 10-7.753 1.977A3.5 3.5 0 002 9.5zm9 3.5H9V8a1 1 0 012 0v5z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    wyvern_nest: {
      active: false,
      color: "#bbf7d0",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 640 512"
          className="mr-2 h-12 w-12 fill-current"
        >
          <path
            fillRule="evenodd"
            d="M18.43 255.8L192 224L100.8 292.6C90.67 302.8 97.8 320 112 320h222.7c-9.499-26.5-14.75-54.5-14.75-83.38V194.2L200.3 106.8C176.5 90.88 145 92.75 123.3 111.2l-117.5 116.4C-6.562 238 2.436 258 18.43 255.8zM575.2 289.9l-100.7-50.25c-16.25-8.125-26.5-24.75-26.5-43V160h63.99l28.12 22.62C546.1 188.6 554.2 192 562.7 192h30.1c11.1 0 23.12-6.875 28.5-17.75l14.37-28.62c5.374-10.87 4.25-23.75-2.999-33.5l-74.49-99.37C552.1 4.75 543.5 0 533.5 0H296C288.9 0 285.4 8.625 290.4 13.62L351.1 64L292.4 88.75c-5.874 3-5.874 11.37 0 14.37L351.1 128l-.0011 108.6c0 72 35.99 139.4 95.99 179.4c-195.6 6.75-344.4 41-434.1 60.88c-8.124 1.75-13.87 9-13.87 17.38C.0463 504 8.045 512 17.79 512h499.1c63.24 0 119.6-47.5 122.1-110.8C642.3 354 617.1 310.9 575.2 289.9zM489.1 66.25l45.74 11.38c-2.75 11-12.5 18.88-24.12 18.25C497.7 95.25 484.8 83.38 489.1 66.25z"
          />
        </svg>
      ),
    },
    ice_wyvern_nest: {
      active: false,
      color: "#22d3ee",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 640 512"
          aria-hidden="true"
          className="mr-2 h-12 w-12 fill-current"
        >
          <path
            fillRule="evenodd"
            d="M18.43 255.8L192 224L100.8 292.6C90.67 302.8 97.8 320 112 320h222.7c-9.499-26.5-14.75-54.5-14.75-83.38V194.2L200.3 106.8C176.5 90.88 145 92.75 123.3 111.2l-117.5 116.4C-6.562 238 2.436 258 18.43 255.8zM575.2 289.9l-100.7-50.25c-16.25-8.125-26.5-24.75-26.5-43V160h63.99l28.12 22.62C546.1 188.6 554.2 192 562.7 192h30.1c11.1 0 23.12-6.875 28.5-17.75l14.37-28.62c5.374-10.87 4.25-23.75-2.999-33.5l-74.49-99.37C552.1 4.75 543.5 0 533.5 0H296C288.9 0 285.4 8.625 290.4 13.62L351.1 64L292.4 88.75c-5.874 3-5.874 11.37 0 14.37L351.1 128l-.0011 108.6c0 72 35.99 139.4 95.99 179.4c-195.6 6.75-344.4 41-434.1 60.88c-8.124 1.75-13.87 9-13.87 17.38C.0463 504 8.045 512 17.79 512h499.1c63.24 0 119.6-47.5 122.1-110.8C642.3 354 617.1 310.9 575.2 289.9zM489.1 66.25l45.74 11.38c-2.75 11-12.5 18.88-24.12 18.25C497.7 95.25 484.8 83.38 489.1 66.25z"
          />
        </svg>
      ),
    },
    oil_vein: {
      active: false,
      color: "#171717",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 576 512"
          className="h-12 w-12 fill-current"
        >
          <path d="M528.3 61.3c-11.4-42.7-55.3-68-98-56.6L414.9 8.8C397.8 13.4 387.7 31 392.3 48l24.5 91.4L308.5 167.5l-6.3-18.1C297.7 136.6 285.6 128 272 128s-25.7 8.6-30.2 21.4l-13.6 39L96 222.6V184c0-13.3-10.7-24-24-24s-24 10.7-24 24V448H32c-17.7 0-32 14.3-32 32s14.3 32 32 32H544c17.7 0 32-14.3 32-32s-14.3-32-32-32H406.7L340 257.5l-62.2 16.1L305.3 352H238.7L265 277l-74.6 19.3L137.3 448H96V288.8l337.4-87.5 25.2 94c4.6 17.1 22.1 27.2 39.2 22.6l15.5-4.1c42.7-11.4 68-55.3 56.6-98L528.3 61.3zM205.1 448l11.2-32H327.7l11.2 32H205.1z" />
        </svg>
      ),
    },
    water_vein: {
      active: false,
      color: "#3b82f6",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 384 512"
          aria-hidden="true"
          className="h-12 w-12 fill-current"
        >
          <path d="M221.3 22.13c-8-28.87-49.5-30.12-58.5 0C116 179.9 16 222.8 16 333.9c0 98.5 78.75 178.1 176 178.1s176-79.63 176-178.1C368 222.1 268.3 180.6 221.3 22.13zM192 448c-61.75 0-112-50.25-112-111.1c0-8.875 7.125-16 16-16s16 7.125 16 16c0 44.12 35.88 79.1 80 79.1c8.875 0 16 7.125 16 15.1C208 440.9 200.9 448 192 448z" />
        </svg>
      ),
    },
    gas_vein: {
      active: false,
      color: "#eab308",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 384 512"
          aria-hidden="true"
          className="h-12 w-12 fill-current"
        >
          <path d="M203.1 4.365c-6.177-5.82-16.06-5.819-22.23-.0007C74.52 104.5 0 234.1 0 312C0 437.9 79 512 192 512s192-74.05 192-200C384 233.9 309 104.2 203.1 4.365zM192 432c-56.5 0-96-37.76-96-91.74c0-12.47 4.207-55.32 83.87-143c6.314-6.953 17.95-6.953 24.26 0C283.8 284.9 288 327.8 288 340.3C288 394.2 248.5 432 192 432z" />
        </svg>
      ),
    },
    charge_node: {
      active: false,
      color: "#16a34a",
      icon: (
        <svg
          aria-hidden="true"
          className="h-12 w-12 fill-current"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M2 9.5A3.5 3.5 0 005.5 13H9v2.586l-1.293-1.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 15.586V13h2.5a4.5 4.5 0 10-.616-8.958 4.002 4.002 0 10-7.753 1.977A3.5 3.5 0 002 9.5zm9 3.5H9V8a1 1 0 012 0v5z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    plant_z_node: {
      active: false,
      color: "#a3e635",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
          aria-hidden="true"
          className="h-12 w-12 fill-current"
        >
          <path d="M512 165.4c0 127.9-70.05 235.3-175.3 270.1c-20.04 7.938-41.83 12.46-64.69 12.46c-64.9 0-125.2-36.51-155.7-94.47c-54.13 49.93-68.71 107-68.96 108.1C44.72 472.6 34.87 480 24.02 480c-1.844 0-3.727-.2187-5.602-.6562c-12.89-3.098-20.84-16.08-17.75-28.96c9.598-39.5 90.47-226.4 335.3-226.4C344.8 224 352 216.8 352 208S344.8 192 336 192C228.6 192 151 226.6 96.29 267.6c.1934-10.82 1.242-21.84 3.535-33.05c13.47-65.81 66.04-119 131.4-134.2c28.33-6.562 55.68-6.013 80.93-.0054c56 13.32 118.2-7.412 149.3-61.24c5.664-9.828 20.02-9.516 24.66 .8282C502.7 76.76 512 121.9 512 165.4z" />
        </svg>
      ),
    },
    drake_nest: {
      active: false,
      color: "#525252",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 640 512"
          className="mr-2 h-12 w-12 fill-current"
        >
          <path
            fillRule="evenodd"
            d="M18.43 255.8L192 224L100.8 292.6C90.67 302.8 97.8 320 112 320h222.7c-9.499-26.5-14.75-54.5-14.75-83.38V194.2L200.3 106.8C176.5 90.88 145 92.75 123.3 111.2l-117.5 116.4C-6.562 238 2.436 258 18.43 255.8zM575.2 289.9l-100.7-50.25c-16.25-8.125-26.5-24.75-26.5-43V160h63.99l28.12 22.62C546.1 188.6 554.2 192 562.7 192h30.1c11.1 0 23.12-6.875 28.5-17.75l14.37-28.62c5.374-10.87 4.25-23.75-2.999-33.5l-74.49-99.37C552.1 4.75 543.5 0 533.5 0H296C288.9 0 285.4 8.625 290.4 13.62L351.1 64L292.4 88.75c-5.874 3-5.874 11.37 0 14.37L351.1 128l-.0011 108.6c0 72 35.99 139.4 95.99 179.4c-195.6 6.75-344.4 41-434.1 60.88c-8.124 1.75-13.87 9-13.87 17.38C.0463 504 8.045 512 17.79 512h499.1c63.24 0 119.6-47.5 122.1-110.8C642.3 354 617.1 310.9 575.2 289.9zM489.1 66.25l45.74 11.38c-2.75 11-12.5 18.88-24.12 18.25C497.7 95.25 484.8 83.38 489.1 66.25z"
          />
        </svg>
      ),
    },
    magmasaur_nest: {
      active: false,
      color: "#b91c1c",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
          aria-hidden="true"
          className="h-12 w-12 fill-current"
        >
          <path d="M160 144c-35.3 0-64-28.7-64-64s28.7-64 64-64c15.7 0 30 5.6 41.2 15C212.4 12.4 232.7 0 256 0s43.6 12.4 54.8 31C322 21.6 336.3 16 352 16c35.3 0 64 28.7 64 64s-28.7 64-64 64c-14.7 0-28.3-5-39.1-13.3l-32 48C275.3 187 266 192 256 192s-19.3-5-24.9-13.3l-32-48C188.3 139 174.7 144 160 144zM144 352l48.4-24.2c10.2-5.1 21.6-7.8 33-7.8c19.6 0 38.4 7.8 52.2 21.6l32.5 32.5c6.3 6.3 14.9 9.9 23.8 9.9c11.3 0 21.8-5.6 28-15l9.7-14.6-59-66.3c-9.1-10.2-22.2-16.1-35.9-16.1H235.1c-13.7 0-26.8 5.9-35.9 16.1l-59.9 67.4L144 352zm19.4-95.8c18.2-20.5 44.3-32.2 71.8-32.2h41.8c27.4 0 53.5 11.7 71.8 32.2l150.2 169c8.5 9.5 13.2 21.9 13.2 34.7c0 28.8-23.4 52.2-52.2 52.2H52.2C23.4 512 0 488.6 0 459.8c0-12.8 4.7-25.1 13.2-34.7l150.2-169z" />
        </svg>
      ),
    },
    glitch: {
      active: false,
      color: "#7e22ce",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
          aria-hidden="true"
          className="h-12 w-12 fill-current"
        >
          <path d="M324.4 103.1L384 128l24.88 59.63C410.2 190.3 413 192 416 192s5.75-1.75 7.125-4.375L448 128l59.63-24.88C510.3 101.8 512 99 512 96s-1.75-5.75-4.375-7.125L448 64l-24.88-59.62C421.8 1.75 419 0 416 0s-5.75 1.75-7.125 4.375L384 64l-59.63 24.88C321.8 90.25 320 93 320 96S321.8 101.8 324.4 103.1zM507.6 408.9L448 384l-24.88-59.63C421.8 321.8 419 320 416 320s-5.75 1.75-7.125 4.375L384 384l-59.63 24.88C321.8 410.2 320 413 320 416s1.75 5.75 4.375 7.125L384 448l24.88 59.63C410.2 510.2 413 512 416 512s5.75-1.75 7.125-4.375L448 448l59.63-24.88C510.3 421.8 512 419 512 416S510.3 410.2 507.6 408.9zM384 255.6c0-6-3.375-11.62-8.875-14.38l-112.5-56.31L206.3 72.19c-5.375-10.88-23.13-10.88-28.5 0L121.4 184.9L8.875 241.2C3.375 244 0 249.6 0 255.6c0 6.125 3.375 11.62 8.875 14.38l112.5 56.37l56.38 112.7C180.4 444.4 185.1 447.9 192 447.9c5.999 0 11.62-3.512 14.25-8.887l56.38-112.7l112.5-56.37C380.6 267.2 384 261.8 384 255.6z" />
        </svg>
      ),
    },
  });

  const setCategory = useCallback(
    (e, checked) => {
      const category = e;
      const color = categories[category].color;

      let dataToAdd = [];

      if (category === "notes") {
        dataToAdd = map.MapNote;
      } else {
        for (const coordinate of map.MapCoordinate) {
          if (coordinate.type === category) {
            dataToAdd.push(coordinate);
          }
        }
      }

      const newDataToAdd = dataToAdd.flatMap((item) => ({
        ...item,
        category,
        color,
        name: `${category.replaceAll("_", " ")}\n${item.latitude}, ${
          item.longitude
        }`,
      }));

      setCategories((prevState) => ({
        ...prevState,
        [category]: {
          ...prevState[category],
          active: checked,
        },
      }));

      setMapData((prevState) => {
        if (checked) {
          return [...prevState, ...newDataToAdd];
        } else {
          return prevState.filter((item) => item.category !== category);
        }
      });
    },
    [categories, mapData, setCategories, setMapData]
  );

  let noterun =
    map.id === 1
      ? [57, 520, 242, 241, 201, 79, 238, 143, 301, 283, 284, 60]
      : [];
  return (
    <article>
      <div className="rw-segment">
        <header className="rw-segment-header">
          <h2 className="rw-heading rw-heading-primary">
            {map.name.includes("The") ? map.name : `The ${map.name}`} Map
          </h2>
        </header>
        <div className="rw-segment-main">
          <div className="grid grid-flow-row gap-4 md:grid-cols-2">
            <CheckboxGroup
              options={Object.entries(categories)
                .filter(
                  (c) =>
                    map.MapCoordinate.filter((d) => d.type === c[0]) != null &&
                    map.MapCoordinate.filter((d) => d.type === c[0])
                )
                .map((category) => ({
                  label: capitalizeSentence(category[0].replaceAll("_", " ")),
                  value: category[0],
                  image: category[1].icon,
                }))}
              onChange={(name, values) => {
                setCategory(
                  name,
                  values.some((h) => h === name)
                );
              }}
            />

            <MapComp
              interactive={true}
              className="col-span-1 w-auto"
              url={`https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Map/${map.img}`}
              size={{ width: 500, height: 500 }}
              pos={mapData.map((d) => ({
                lat: d.latitude,
                lon: d.longitude,
                ...d,
              }))}
              path={{
                color: "#0000ff",
                coords: noterun.map((b) => {
                  if (map.MapNote && map.MapNote.length > 0) {
                    let note = (map?.MapNote).find((j) => j.note_index === b);
                    return {
                      lat: note.latitude,
                      lon: note.longitude,
                    };
                  }
                }),
              }}
            />

            <ul className="rw-segment max-h-44 overflow-auto rounded-lg border border-gray-200 bg-stone-300 text-sm font-medium text-gray-900 dark:border-zinc-500 dark:bg-zinc-600 dark:text-white">
              {mapData.map((d, i) => (
                <li
                  key={`point-${i}`}
                  className="w-full border-b border-gray-200 first:rounded-t-lg last:rounded-b-lg last:border-none dark:border-zinc-500"
                >
                  <button
                    onClick={(e) => {
                      let c: SVGCircleElement = document.getElementById(
                        `map-pos-${i}`
                      ) as any;
                      c.setAttribute("fill", "antiquewhite");

                      setTimeout(() => {
                        c.setAttribute("fill", d.color);
                      }, 3000);

                      // TODO: set to original color after leave
                    }}
                    className={
                      "w-full border-l-2 px-4 py-2 text-left capitalize"
                    }
                    style={{ borderLeftColor: d.color }}
                  >
                    {d?.name ? d.name.split("\n")[0] : ""} - {d.latitude},{" "}
                    {d.longitude}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <section className="rw-segment-header rw-heading rw-heading-secondary">
        <Link
          className="after:content-['_↗']"
          to={routes.basespots({ map: map.name })}
        >
          Basespots
        </Link>
      </section>

      <section className="rw-segment-header rw-heading rw-heading-secondary">
        <Link
          className="after:content-['_↗']"
          to={routes.lootcrates({ map: map.id })}
        >
          Lootcrates
        </Link>
        <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-3 xl:grid-cols-4">
          {map.Lootcrate.map((lootcrate, i) => (
            <ArkCard
              key={`lootcrate-${i}`}
              className="border-t-2 bg-zinc-700"
              style={{
                borderColor: lootcrate.color ? lootcrate.color : "white",
              }}
              title={lootcrate.name}
              ring={
                lootcrate?.level_requirement &&
                lootcrate.level_requirement["min"] > 0 ? (
                  <button
                    title={`You need to be lvl ${lootcrate.level_requirement["min"]} to open this crate`}
                    className="relative flex items-center justify-center space-x-2 rounded-full bg-gray-600 px-4 py-2.5 text-gray-100 shadow-sm ring-1 ring-green-500"
                  >
                    <span>Lvl {lootcrate.level_requirement["min"]}</span>
                    <i className="fa-solid fa-circle my-auto ml-2 animate-pulse text-green-500"></i>
                  </button>
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
      </section>
      {/* <nav className="rw-button-group">
        <Link
          to={routes.editMap({ id: map.id.toString() })}
          className="rw-button rw-button-blue-outline"
        >
          Edit
        </Link>
        <button
          type="button"
          className="rw-button rw-button-red-outline"
          onClick={() => onDeleteClick(map.id)}
        >
          Delete
        </button>
      </nav> */}
    </article>
  );
};

export default Map;
