import { useLazyQuery } from "@apollo/client";
import { Form, Submit } from "@redwoodjs/forms";
import { navigate, parseSearch } from "@redwoodjs/router";
import { Link, routes, useParams } from "@redwoodjs/router";
import { useMutation, useQuery } from "@redwoodjs/web";
import { toast } from "@redwoodjs/web/toast";
import { useEffect, useState } from "react";
import ArkCard from "src/components/Util/ArkCard/ArkCard";

import { QUERY } from "src/components/Basespot/BasespotsCell/BasespotsCell";
import Lookup from "src/components/Util/Lookup/Lookup";
import { random } from "src/lib/formatters";

import type {
  DeleteBasespotMutationVariables,
  FindBasespots,
} from "types/graphql";

const BasespotsList = ({ basespotPage, maps }: FindBasespots) => {
  let basespots = basespotPage.basespots;

  let { search, map, type } = useParams();

  const [params, setParams] = useState({ map, type });
  useEffect(() => {
    navigate(
      routes.basespots({
        ...parseSearch(
          Object.fromEntries(
            Object.entries(params).filter(([_, v]) => v != "" && v != null)
          ) as Record<string, string>
        ),
        page: 1,
      })
    );
  }, [params]);

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
        className="flex min-h-[100px] w-full flex-col justify-between rounded-lg bg-cover bg-center bg-no-repeat p-8 text-white"
        style={{
          backgroundImage:
            "url(https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/timelineimages/4/20210603185039_1.jpg)",
        }}
      >
        <div className="">
          <h1 className="my-5 text-5xl font-bold opacity-90">Basespots!</h1>
          <p className="mt-3 w-1/2 leading-7 opacity-75">
            Here you'll find various basespots
          </p>
        </div>
      </header>
      <div className="my-4 flex items-center justify-start gap-3">
        <Link to={routes.newBasespot()} className="rw-button rw-button-green-outline">
          New Basespot
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="rw-button-icon">
            <path d="M432 256C432 264.8 424.8 272 416 272h-176V448c0 8.844-7.156 16.01-16 16.01S208 456.8 208 448V272H32c-8.844 0-16-7.15-16-15.99C16 247.2 23.16 240 32 240h176V64c0-8.844 7.156-15.99 16-15.99S240 55.16 240 64v176H416C424.8 240 432 247.2 432 256z" />
          </svg>
        </Link>

        <Lookup
          options={maps.map((map) => ({
            label: map.name,
            value: map.id.toString(),
            image: `https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Map/${map.icon}`,
          }))}
          placeholder="Choose a Map"
          defaultValue={parseInt(map)}
          onSelect={(e) => {
            setParams({
              ...(e.value && { map: e.value.toString() }),
              ...(params.type && { type: params.type }),
            });
          }}
        />
        {/* TODO: make this to multiselect? */}
        <Lookup
          options={[
            { label: "Rathole", value: "rathole" },
            { label: "Cave", value: "cave" },
            { label: "Cliff", value: "cliff" },
            { label: "Open", value: "open" },
            { label: "Waterfall", value: "waterfall" },
            { label: "Underwater", value: "underwater" },
          ]}
          placeholder="Choose a type"
          defaultValue={type}
          onSelect={(e) => {
            setParams({
              ...(e.value && { type: e.value.toString() }),
              ...(params.map && { map: params.map.toString() }),
            });
          }}
        />
      </div>
      <div className="mb-5 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {basespots.map((basespot, i) => (
          <ArkCard
            className=""
            key={`${basespot.id}-${i}`}
            title={basespot.name}
            subtitle={
              <span className="text-zinc-300">
                {basespot.Map.name.split(/(?=[A-Z])/).join(" ")}
              </span>
            }
            content={basespot.description}
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
