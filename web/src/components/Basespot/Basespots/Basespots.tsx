import { useLazyQuery } from "@apollo/client";
import { Form, Submit } from "@redwoodjs/forms";
import { navigate, parseSearch } from "@redwoodjs/router";
import { Link, routes, useParams } from "@redwoodjs/router";
import { useMutation, useQuery } from "@redwoodjs/web";
import { toast } from "@redwoodjs/web/toast";
import { useEffect, useState } from "react";
import ArkCard from "src/components/ArkCard/ArkCard";

import { QUERY } from "src/components/Basespot/BasespotsCell/BasespotsCell";
import Lookup from "src/components/Util/Lookup/Lookup";
import { random } from "src/lib/formatters";

import type {
  DeleteBasespotMutationVariables,
  FindBasespots,
} from "types/graphql";

const BasespotsList = ({ basespotPage }: FindBasespots) => {
  let basespots = basespotPage.basespots;

  // const [loadMaps, { called, loading, error, data }] = useLazyQuery(MAPQUERY, {
  //   onCompleted: (data) => {
  //     console.log(data);
  //   },
  //   onError: (error) => {
  //     console.log(error);
  //     toast.error(error.message);
  //   }
  // });

  // useEffect(() => {
  //   loadMaps();
  // }, []);
  let { search, map } = useParams();
  const onSearch = (e) => {
    navigate(
      routes.basespots({
        ...parseSearch(
          Object.fromEntries(
            Object.entries(e).filter(([_, v]) => v != "")
          ) as any
        ),
        page: 1,
      })
    );
  };

  const mapImages = {
    theisland:
      "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/i/62a15c04-bef2-45a2-a06a-c984d81c3c0b/dd391pu-a40aaf7b-b8e7-4d6d-b49d-aa97f4ad61d0.jpg",
    thecenter:
      "https://cdn.akamai.steamstatic.com/steam/apps/473850/ss_f13c4990d4609d3fc89174f71858835a9f09aaa3.1920x1080.jpg?t=1508277712",
    scorchedearth: "https://wallpapercave.com/wp/wp10504822.jpg",
    ragnarok:
      "https://cdn.survivetheark.com/uploads/monthly_2016_10/large.580b5a9c3b586_Ragnarok02.jpg.6cfa8b30a81187caace6fecc1e9f0c31.jpg",
    aberration:
      "https://cdn.images.express.co.uk/img/dynamic/143/590x/ARK-Survival-Evolved-849382.jpg",
    extinction:
      "https://cdn.cloudflare.steamstatic.com/steam/apps/887380/ss_3c2c1d7c027c8beb54d2065afe3200e457c2867c.1920x1080.jpg?t=1594677636",
    valguero:
      "https://i.pinimg.com/originals/0b/95/09/0b9509ddce658e3209ece1957053b27e.jpg",
    genesis:
      "https://cdn.akamai.steamstatic.com/steam/apps/1646700/ss_c939dd546237cba9352807d4deebd79c4e29e547.1920x1080.jpg?t=1622514386",
    crystalisles:
      "https://cdn2.unrealengine.com/egs-crystalislesarkexpansionmap-studiowildcard-dlc-g1a-05-1920x1080-119682147.jpg?h=720&resize=1&w=1280",
    fjordur:
      "https://cdn.cloudflare.steamstatic.com/steam/apps/1887560/ss_331869adb5f0c98e3f13b48189e280f8a0ba1616.1920x1080.jpg?t=1655054447",
    lostisland:
      "https://dicendpads.com/wp-content/uploads/2021/12/Ark-Lost-Island.png",
    genesis2:
      "https://cdn.cloudflare.steamstatic.com/steam/apps/1646720/ss_5cad67b512285163143cfe21513face50c0a00f6.1920x1080.jpg?t=1622744444",
  };
  // const [currentMap, setCurrentMap] = useState(map || null);

  return (
    <div className="-m-3">
      <header
        className="flex min-h-[200px] w-full flex-col justify-between rounded-2xl bg-cover bg-center bg-no-repeat p-12 text-white"
        style={{
          backgroundImage:
            "url(https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/timelineimages/4/20210603185039_1.jpg)",
        }}
      >
        <div className="pt-12">
          <div className="mb-3 flex items-center space-x-1 opacity-75 [&>span:not(:last-child)]:after:content-[',']">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              className="mr-3 w-5 fill-current "
            >
              <path
                className="d"
                d="M19.22,9.66L10.77,1.21c-.74-.74-1.86-1.21-2.97-1.21H1.67C.75,0,0,.75,0,1.67V7.8c0,1.11,.46,2.23,1.3,2.97l8.45,8.46c1,1,2.62,1,3.62,0l5.94-5.95c.93-.93,.93-2.6-.09-3.62ZM6.96,6.35c-.59,.59-1.56,.59-2.15,0-.59-.59-.59-1.56,0-2.15,.59-.59,1.56-.59,2.15,0,.59,.59,.59,1.56,0,2.15Z"
              />
            </svg>
            {["Base", "Spots"].map((tag) => (
              <span className="text-sm" key={tag}>
                {tag}
              </span>
            ))}
          </div>
          <h1 className="my-5 text-5xl font-bold opacity-90">Basespots!</h1>
          <p className="mt-3 w-1/2 leading-7 opacity-75">
            Here you'll find various basespots
          </p>
        </div>
      </header>
      <div className="my-4 flex items-center justify-start">
        <Lookup
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
          onSelect={(e) => onSearch(e.value ? { map: e.value.toString() } : {})}
        />
      </div>
      <div className="mb-5 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {basespots
          // .filter((spot) =>
          //   currentMap != null
          //     ? spot.map.toString() === currentMap.toString()
          //     : true
          // )
          .map((basespot, i) => (
            <ArkCard
              key={`${basespot.id}-${i}`}
              title={basespot.name}
              subtitle={basespot.Map.name.split(/(?=[A-Z])/).join(" ")}
              content={basespot.description}
              ring={
                parseInt(basespot.estimated_for_players) > 0
                  ? `Est. ${basespot.estimated_for_players} players`
                  : ""
              }
              image={{
                src: mapImages[
                  basespot.Map.name.toLowerCase().replaceAll(" ", "")
                ],
                alt: basespot.Map.name,
                position: `${random(0, 100)}% ${random(25, 75)}%`,
              }}
              button={{
                text: "Learn More",
                link: routes.basespot({ id: basespot.id.toString() }),
              }}
            />
          ))}
      </div>
    </div>
  );
};

export default BasespotsList;
