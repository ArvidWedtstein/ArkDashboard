import { navigate, routes } from "@redwoodjs/router";
import { useMutation } from "@redwoodjs/web";
import { toast } from "@redwoodjs/web/dist/toast";
import { ReactNode, useMemo, useState } from "react";
import Button, { ButtonGroup } from "src/components/Util/Button/Button";
import { Card, CardActionArea, CardHeader, CardMedia } from "src/components/Util/Card/Card";
import Chart from "src/components/Util/Chart/Chart";
import CheckboxGroup from "src/components/Util/CheckSelect/CheckboxGroup";
import MapComp from "src/components/Util/Map/Map";
import Tabs, { Tab } from "src/components/Util/Tabs/Tabs";
import Toast from "src/components/Util/Toast/Toast";
import TreeView from "src/components/Util/TreeView/TreeView";
import { capitalizeSentence, groupBy, timeTag } from "src/lib/formatters";

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
    toast.custom(
      (t) => (
        <Toast
          t={t}
          title={`You are about to delete map`}
          message={`Are you sure you want to delete map?`}
          actionType="YesNo"
          primaryAction={() => deleteMap({ variables: { id } })}
        />
      ),
      { position: "top-center" }
    );
  };

  const [checkedItems, setCheckedItems] = useState<string[]>([]);
  const [realm, setRealm] = useState<number>(
    map.other_Map && map.other_Map.length > 0
      ? map.other_Map.findIndex((m) => m.id == 16)
      : null
  );
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  // TODO: remove hardcoded noterun and move it to db
  const [noterun, setNoterun] = useState<number[]>(
    map.id === 2
      ? [57, 520, 242, 241, 201, 79, 238, 143, 301, 283, 284, 60]
      : []
  );

  const categories = {
    mutagen_bulb: {
      active: false,
      color: "#0284c7",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 384 512"
          aria-hidden="true"
          className="h-6 w-6 fill-current"
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
          className="h-6 w-6 fill-current"
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
          className="h-6 w-6 fill-current"
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
          className="h-6 w-6 fill-current"
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
          className="mr-2 h-6 w-6 fill-current"
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
          className="mr-2 h-6 w-6 fill-current"
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
          className="h-6 w-6 fill-current"
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
          className="h-6 w-6 fill-current"
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
          className="h-6 w-6 fill-current"
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
          className="h-6 w-6 fill-current"
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
          className="h-6 w-6 fill-current"
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
          className="mr-2 h-6 w-6 fill-current"
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
          className="h-6 w-6 fill-current"
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
          className="h-6 w-6 fill-current"
        >
          <path d="M324.4 103.1L384 128l24.88 59.63C410.2 190.3 413 192 416 192s5.75-1.75 7.125-4.375L448 128l59.63-24.88C510.3 101.8 512 99 512 96s-1.75-5.75-4.375-7.125L448 64l-24.88-59.62C421.8 1.75 419 0 416 0s-5.75 1.75-7.125 4.375L384 64l-59.63 24.88C321.8 90.25 320 93 320 96S321.8 101.8 324.4 103.1zM507.6 408.9L448 384l-24.88-59.63C421.8 321.8 419 320 416 320s-5.75 1.75-7.125 4.375L384 384l-59.63 24.88C321.8 410.2 320 413 320 416s1.75 5.75 4.375 7.125L384 448l24.88 59.63C410.2 510.2 413 512 416 512s5.75-1.75 7.125-4.375L448 448l59.63-24.88C510.3 421.8 512 419 512 416S510.3 410.2 507.6 408.9zM384 255.6c0-6-3.375-11.62-8.875-14.38l-112.5-56.31L206.3 72.19c-5.375-10.88-23.13-10.88-28.5 0L121.4 184.9L8.875 241.2C3.375 244 0 249.6 0 255.6c0 6.125 3.375 11.62 8.875 14.38l112.5 56.37l56.38 112.7C180.4 444.4 185.1 447.9 192 447.9c5.999 0 11.62-3.512 14.25-8.887l56.38-112.7l112.5-56.37C380.6 267.2 384 261.8 384 255.6z" />
        </svg>
      ),
    },
  };

  const types = useMemo(() => {
    const mapData =
      map.other_Map && map.other_Map.length > 0 ? map.other_Map.find((f) => f.id === realm) : map;
    if (!mapData) return [];
    const resourceData = mapData?.MapResource ?? [];
    const groupedByType = groupBy(
      resourceData.filter((d) => d.type !== null && d.item_id == null),
      "type"
    );
    const groupedByItem = groupBy(
      resourceData.filter((d) => d.item_id !== null),
      "item_id"
    );
    const notes = mapData?.MapResource?.filter(r => r.type === 'note') ?? [];

    const categorizedTypes = Object.entries({
      notes: notes.map((f) => ({
        ...f,
        item_id: null,
        Item: null,
        type: null,
      })),
      ...groupedByType,
      ...groupedByItem,
    })
      .filter(([k, v]) => v.length > 0 && k !== null)
      .map(([key, value]) => ({
        label: value.some((f) => f.item_id == null)
          ? capitalizeSentence(key.replaceAll("_", " "))
          : value[0].Item.name,
        image: value.some((f) => f.item_id == null)
          ? categories[key]?.icon
          : `https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/${value[0].Item.image}`,
        items: value,
        value: key.toString(),
        color:
          value[0].__typename == "MapResource" ||
            value.every((f) => f.item_id == null)
            ? categories[key]?.color
            : value[0].Item.color,
      }));

    return categorizedTypes;
  }, [realm, map]);

  return (
    <article>
      <div className="rw-segment">
        <header className="rw-segment-header">
          <h2 className="rw-heading rw-heading-primary">
            {map.name.includes("The") ? map.name : `The ${map.name}`} Map
          </h2>
        </header>
        <div className="rw-segment text-black dark:text-white">
          {map?.other_Map && map.other_Map.length > 0 && (
            <section>
              <h6>Realms:</h6>

              <Tabs
                onSelect={(_, b) => {
                  setRealm(b);
                  setSelectedTypes([]);
                }}
                selectedTabIndex={realm}
              >
                {map.other_Map.map((submap) => (
                  <Tab key={submap.id} label={submap.name} />
                ))}
              </Tabs>
            </section>
          )}

          <ButtonGroup className="w-full my-5">
            <div className="flex grow h-16 items-center justify-between divide-x divide-zinc-500 rounded-l-lg border border-zinc-500">
              <div className="h-16 px-4">
                <p className="whitespace-nowrap text-xs leading-10 text-zinc-600 dark:text-zinc-300">
                  Released
                </p>
                <p className="-mt-0.5 whitespace-nowrap text-sm font-medium leading-none">
                  {timeTag(map.release_date, { timeStyle: "none" })}
                </p>
              </div>
              <div className="h-16 px-4">
                <p className="whitespace-nowrap text-xs leading-10 text-zinc-600 dark:text-zinc-300">
                  {map.id == 11 || map?.parent_map_id == 11 ? "Runes" : "Notes"}
                </p>
                <p className="-mt-0.5 whitespace-nowrap text-sm font-medium leading-none">
                  {map.other_Map && map.other_Map.length > 0
                    ? map.other_Map[realm]?.MapResource.filter(r => r.type === 'note').length ?? 0
                    : map?.MapResource.filter(r => r.type === 'note').length ?? 0}{" "}
                  {map.id == 11 || map?.parent_map_id == 11 ? "Runes" : "Notes"}
                </p>
              </div>
            </div>
            <Button
              permission="gamedata_update"
              color="secondary"
              variant="outlined"
              to={routes.editMap({ id: map.id })}
              startIcon={
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                  <path d="M493.2 56.26l-37.51-37.51C443.2 6.252 426.8 0 410.5 0c-16.38 0-32.76 6.25-45.26 18.75L45.11 338.9c-8.568 8.566-14.53 19.39-17.18 31.21l-27.61 122.8C-1.7 502.1 6.158 512 15.95 512c1.047 0 2.116-.1034 3.198-.3202c0 0 84.61-17.95 122.8-26.93c11.54-2.717 21.87-8.523 30.25-16.9l321.2-321.2C518.3 121.7 518.2 81.26 493.2 56.26zM149.5 445.2c-4.219 4.219-9.252 7.039-14.96 8.383c-24.68 5.811-69.64 15.55-97.46 21.52l22.04-98.01c1.332-5.918 4.303-11.31 8.594-15.6l247.6-247.6l82.76 82.76L149.5 445.2zM470.7 124l-50.03 50.02l-82.76-82.76l49.93-49.93C393.9 35.33 401.9 32 410.5 32s16.58 3.33 22.63 9.375l37.51 37.51C483.1 91.37 483.1 111.6 470.7 124z" />
                </svg>
              }
            >
              Edit
            </Button>
            <Button
              permission="gamedata_delete"
              color="error"
              variant="contained"
              onClick={() => onDeleteClick(map.id)}
              startIcon={
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                  <path d="M432 64h-96l-33.63-44.75C293.4 7.125 279.1 0 264 0h-80C168.9 0 154.6 7.125 145.6 19.25L112 64h-96C7.201 64 0 71.2 0 80c0 8.799 7.201 16 16 16h416c8.801 0 16-7.201 16-16C448 71.2 440.8 64 432 64zM152 64l19.25-25.62C174.3 34.38 179 32 184 32h80c5 0 9.75 2.375 12.75 6.375L296 64H152zM400 128C391.2 128 384 135.2 384 144v288c0 26.47-21.53 48-48 48h-224C85.53 480 64 458.5 64 432v-288C64 135.2 56.84 128 48 128S32 135.2 32 144v288C32 476.1 67.89 512 112 512h224c44.11 0 80-35.89 80-80v-288C416 135.2 408.8 128 400 128zM144 416V192c0-8.844-7.156-16-16-16S112 183.2 112 192v224c0 8.844 7.156 16 16 16S144 424.8 144 416zM240 416V192c0-8.844-7.156-16-16-16S208 183.2 208 192v224c0 8.844 7.156 16 16 16S240 424.8 240 416zM336 416V192c0-8.844-7.156-16-16-16S304 183.2 304 192v224c0 8.844 7.156 16 16 16S336 424.8 336 416z" />
                </svg>
              }
            >
              Delete
            </Button>
          </ButtonGroup>

          <div className="relative grid grid-flow-row gap-3 grid-cols-1 md:grid-cols-2">
            <div className="relative flex space-x-2 overflow-y-hidden max-h-full h-full">
              <MapComp
                interactive={true}
                disable_sub_map={!(map?.other_Map && map.other_Map.length > 0)}
                className="col-span-1 w-fit"
                map_id={map.parent_map_id ? map.parent_map_id : map.id}
                submap_id={map?.other_Map ? map.other_Map.find(({ id }) => id === realm)?.id : null}
                disable_map={true}
                size={{ width: 500, height: 500 }}
                pos={Object.values(
                  types
                    .filter((f) =>
                      selectedTypes.find((v) => v === f.value || v === f.label)
                    )
                    .flatMap((f) => {
                      return f.items.map((entry) => ({
                        ...entry,
                        lat: entry.latitude,
                        lon: entry.longitude,
                        // color: `${f.color || "#ff0000"}`,
                        color: `${f.color}${checkedItems.includes(
                          `${entry.type}|${entry.latitude}-${entry.longitude}`
                        )
                          ? "1A"
                          : "FF"
                          }`, // checkedItems has no use since images are used instead
                        image: entry.item_id !== null ? f.image : null,
                      }))
                    }
                    )
                )}
                onSubMapChange={(id) => {
                  setRealm(
                    map.other_Map
                      ? map.other_Map.findIndex((m) => m.id == id)
                      : null
                  );
                  setSelectedTypes([]);
                }}
                onPosClick={(e) => {
                  setNoterun((prevState) => {
                    if (prevState.includes(e.node_index)) {
                      return prevState.filter((p) => p !== e.node_index);
                    }
                    return prevState;
                  });
                }}
                path={{
                  color: "#0000ff",
                  coords: noterun
                    .map((b) => {
                      const mapData = map.other_Map ? map.other_Map[realm] : map;
                      if (mapData?.MapResource.filter(r => r.type === 'note') && mapData?.MapResource.filter(r => r.type === 'note').length > 0) {
                        let note = (mapData?.MapResource.filter(r => r.type === 'note')).find(
                          (j) => j.note_index === b
                        );

                        if (note) {
                          return {
                            lat: note?.latitude,
                            lon: note.longitude,
                          };
                        }

                        return {
                          lat: -1,
                          lon: -1,
                        };
                      }
                    })
                    ?.filter((c) => c?.lat !== -1 && c?.lon !== -1),
                }}
              />
              <Card variant="outlined" className="relative p-2 w-full !overflow-y-scroll min-h-full max-h-full h-96">
                <TreeView
                  className="relative"
                  onOptionSelect={(opt) => {
                    let c: SVGCircleElement = document.getElementById(
                      `map-pos-${opt["lat"]}-${opt["lon"]}`
                    ) as unknown as SVGCircleElement;
                    if (c != null && !checkedItems.includes(opt["id"].toString())) {
                      const classNames = [
                        "outline",
                        "outline-offset-4",
                        "outline-red-500",
                        "animate-fade",
                      ];

                      classNames.forEach((className) =>
                        c.classList.toggle(className)
                      );
                      setTimeout(() => {
                        classNames.forEach((className) =>
                          c.classList.toggle(className)
                        );
                      }, 3000);
                    }
                    // if (!opt.children) {
                    //   setCheckedItems((prev) => {
                    //     return !prev.includes(opt["id"].toString())
                    //       ? [...prev, opt["id"]?.toString()]
                    //       : prev.filter((p) => p !== opt["id"]?.toString());
                    //   });
                    // }
                  }}
                  options={Object.entries(
                    groupBy(
                      types
                        .filter((f) =>
                          selectedTypes.find((v) => v === f.value || v === f.label)
                            ? true
                            : false
                        )
                        .flatMap((f) => f.items.map((v) => ({ ...v, ...f }))),
                      "label"
                    )
                  ).map(([k, v]) => ({
                    label: k,
                    children: v.map((i) => ({
                      label: `${i.latitude.toFixed(1)}, ${i.longitude.toFixed(1)}`,
                      id: `${i.type}|${i.latitude}-${i.longitude}`,
                      // checked: checkedItems.includes(
                      //   `${i.type}|${i.latitude}-${i.longitude}`
                      // ),
                      lat: i.latitude,
                      lon: i.longitude,
                    })),
                  }))}
                  getOptionLabel={(opt) => opt.label}
                />
              </Card>
            </div>
            <div className="flex flex-col">
              <CheckboxGroup
                size="medium"
                options={types}
                onChange={(val, values) => {
                  setSelectedTypes(
                    values.filter((v) => values.some((h) => h.toString() === v.toString())) as string[]
                  );
                }}
              />

              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 my-4">
                <Card className="hover:border-success-500 border border-transparent transition-all duration-75 ease-in-out">
                  <CardActionArea
                    to={routes.basespots({ map: map.name })}
                    sx={{
                      height: "100%",
                      minHeight: "200px",
                      position: "relative",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                      width: "100%",
                    }}
                  >
                    <CardHeader
                      title={`${map.name} Basespots`}
                      sx={{
                        position: "relative",
                        width: "100%",
                        zIndex: 10,
                        textAlign: "left",
                        backgroundImage:
                          "linear-gradient(0deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.2) 10%, rgba(0,0,0,0.5) 40%, rgba(0,0,0,0.8) 100%)",
                      }}
                    />

                    <CardMedia
                      sx={{
                        objectFit: "fill",
                        background: `url(https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/timelineimages/13/20220616235414_1.jpg)`,
                        position: "absolute",
                        inset: 0,
                        zIndex: 0,
                      }}
                      component="div"
                      image={"https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/timelineimages/13/20220616235414_1.jpg"}
                    />
                  </CardActionArea>
                </Card>

                <Card className="hover:border-success-500 h-full border border-transparent transition-all duration-75 ease-in-out">
                  <CardActionArea
                    to={routes.lootcrates({ map: map.id })}
                    className="h-full w-full"
                    sx={{
                      minHeight: "100px",
                      position: "relative",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                    }}
                  >
                    <CardHeader
                      title={`${map.name} Lootcrates`}
                      sx={{
                        position: "relative",
                        width: "100%",
                        zIndex: 10,
                        textAlign: "left",
                        backgroundImage:
                          "linear-gradient(0deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.2) 10%, rgba(0,0,0,0.5) 40%, rgba(0,0,0,0.8) 100%)",
                      }}
                    />

                    <CardMedia
                      sx={{
                        objectFit: "fill",
                        background: `url(https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/aberration_lootcrate.webp)`,
                        position: "absolute",
                        inset: 0,
                        zIndex: 0,
                      }}
                      component="div"
                      image={"https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/aberration_lootcrate.webp"}
                    />
                  </CardActionArea>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default Map;
