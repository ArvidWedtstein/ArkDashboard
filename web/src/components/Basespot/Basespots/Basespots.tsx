import { Link, routes, useParams } from "@redwoodjs/router";
import { useMutation } from "@redwoodjs/web";
import { toast } from "@redwoodjs/web/toast";
import { useState } from "react";
import ArkCard from "src/components/ArkCard/ArkCard";

import { QUERY } from "src/components/Basespot/BasespotsCell/BasespotsCell";
import Lookup from "src/components/Util/Lookup/Lookup";
import { random } from "src/lib/formatters";

import type {
  DeleteBasespotMutationVariables,
  FindBasespots,
} from "types/graphql";

const DELETE_BASESPOT_MUTATION = gql`
  mutation DeleteBasespotMutation($id: BigInt!) {
    deleteBasespot(id: $id) {
      id
    }
  }
`;

const BasespotsList = ({ basespotPage }: FindBasespots) => {
  const [deleteBasespot] = useMutation(DELETE_BASESPOT_MUTATION, {
    onCompleted: () => {
      toast.success("Basespot deleted");
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

  const onDeleteClick = (id: DeleteBasespotMutationVariables["id"]) => {
    if (confirm("Are you sure you want to delete basespot " + id + "?")) {
      deleteBasespot({ variables: { id } });
    }
  };

  let { map } = useParams();
  let basespots = basespotPage.basespots;

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
  const [currentMap, setCurrentMap] = useState(map || null);

  return (
    <div className="h-[80vh]">
      <div className="flex items-center">
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
          placeholder="Choose Map"
          defaultValue={currentMap}
          onSelect={(e) => setCurrentMap(e.value ? e.value : null)}
        />
      </div>
      <div className="mt-8 mb-5 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {basespots
          .filter((spot) =>
            currentMap != null ? spot.map.toString() === currentMap.toString() : true
          )
          .map((basespot, i) => (
            <ArkCard
              key={`${basespot.id}-${i}`}
              title={basespot.name}
              subtitle={basespot.Map.name
                .split(/(?=[A-Z])/)
                .join(" ")}
              content={basespot.description}
              ring={`${basespot.estimated_for_players} players`}
              image={{
                src: mapImages[
                  basespot.Map.name
                    .toLowerCase()
                    .replaceAll(" ", "")
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
