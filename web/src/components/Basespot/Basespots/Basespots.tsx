import { Link, routes } from "@redwoodjs/router";
import { useMutation } from "@redwoodjs/web";
import { toast } from "@redwoodjs/web/toast";
import { useState } from "react";
import ArkCard from "src/components/ArkCard/ArkCard";

import { QUERY } from "src/components/Basespot/BasespotsCell";
import Lookup from "src/components/Lookup/Lookup";
import Paginate from "src/components/Util/Paginate/Paginate";
import { random, timeTag, truncate } from "src/lib/formatters";

import type {
  DeleteBasespotMutationVariables,
  FindBasespots,
} from "types/graphql";

const DELETE_BASESPOT_MUTATION = gql`
  mutation DeleteBasespotMutation($id: Int!) {
    deleteBasespot(id: $id) {
      id
    }
  }
`;
//https://ark.fandom.com/wiki/HUD
const BasespotsList = ({ basespots }: FindBasespots) => {
  const [deleteBasespot] = useMutation(DELETE_BASESPOT_MUTATION, {
    onCompleted: () => {
      toast.success("Basespot deleted");
    },
    onError: (error) => {
      toast.error(error.message);
      console.log(error);
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

  const [currentPage, setCurrentPage] = useState(1);
  const paginate = (pageNumber: number) => {
    if (
      (currentPage !== 1 && pageNumber < currentPage) ||
      (currentPage !== Math.ceil(basespots.length / 6) &&
        pageNumber > currentPage)
    ) {
      setCurrentPage(pageNumber);
    }
  };

  const indexOfLastPost = currentPage * 6;
  const indexOfFirstPost = indexOfLastPost - 6;
  const currentPages = basespots.slice(indexOfFirstPost, indexOfLastPost);
  const mapImages = {
    TheIsland:
      "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/i/62a15c04-bef2-45a2-a06a-c984d81c3c0b/dd391pu-a40aaf7b-b8e7-4d6d-b49d-aa97f4ad61d0.jpg",
    TheCenter:
      "https://cdn.akamai.steamstatic.com/steam/apps/473850/ss_f13c4990d4609d3fc89174f71858835a9f09aaa3.1920x1080.jpg?t=1508277712",
    ScorchedEarth: "https://wallpapercave.com/wp/wp10504822.jpg",
    Ragnarok:
      "https://cdn.survivetheark.com/uploads/monthly_2016_10/large.580b5a9c3b586_Ragnarok02.jpg.6cfa8b30a81187caace6fecc1e9f0c31.jpg",
    Abberation:
      "https://cdn.images.express.co.uk/img/dynamic/143/590x/ARK-Survival-Evolved-849382.jpg",
    Extinction:
      "https://cdn.cloudflare.steamstatic.com/steam/apps/887380/ss_3c2c1d7c027c8beb54d2065afe3200e457c2867c.1920x1080.jpg?t=1594677636",
    Valguero:
      "https://i.pinimg.com/originals/0b/95/09/0b9509ddce658e3209ece1957053b27e.jpg",
    Gen1: "https://cdn.akamai.steamstatic.com/steam/apps/1646700/ss_c939dd546237cba9352807d4deebd79c4e29e547.1920x1080.jpg?t=1622514386",
    CrystalIsles:
      "https://cdn2.unrealengine.com/egs-crystalislesarkexpansionmap-studiowildcard-dlc-g1a-05-1920x1080-119682147.jpg?h=720&resize=1&w=1280",
    Fjordur:
      "https://cdn.cloudflare.steamstatic.com/steam/apps/1887560/ss_331869adb5f0c98e3f13b48189e280f8a0ba1616.1920x1080.jpg?t=1655054447",
    LostIsland:
      "https://dicendpads.com/wp-content/uploads/2021/12/Ark-Lost-Island.png",
    Gen2: "https://cdn.cloudflare.steamstatic.com/steam/apps/1646720/ss_5cad67b512285163143cfe21513face50c0a00f6.1920x1080.jpg?t=1622744444",
  };
  let [currentMap, setCurrentMap] = useState("");

  // https://www.freecodecamp.org/news/build-a-custom-pagination-component-in-react/
  return (
    <div className="">
      <div className="flex items-center">
        <Lookup
          items={Object.keys(mapImages).map((k) => ({
            name: k,
          }))}
          onChange={(e) => setCurrentMap(e)}
        >
          {!!currentMap ? currentMap : "Choose map"}
        </Lookup>
        <button
          className="rounded-md bg-gray-800 px-4 py-2 text-white"
          onClick={() => setCurrentMap("")}
        >
          Clear
        </button>
      </div>
      <div className="mt-8 mb-5 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {basespots
          .filter((spot) =>
            spot.Map.toLowerCase().includes(currentMap.toLowerCase())
          )
          .slice(indexOfFirstPost, indexOfLastPost)
          .map((basespot, i) => (
            <>
              <ArkCard
                key={i}
                title={basespot.name}
                subtitle={basespot.Map.split(/(?=[A-Z])/).join(" ")}
                content={basespot.description}
                ring={`${basespot.estimatedForPlayers} players`}
                image={{
                  src: mapImages[basespot.Map],
                  alt: basespot.Map,
                  position: `${random(0, 100)}% ${random(25, 75)}%`,
                }}
                button={{
                  text: "Learn More",
                  link: routes.basespot({ id: basespot.id }),
                }}
              />
            </>
          ))}
      </div>
      <Paginate
        currentPage={currentPage}
        postsPerPage={6}
        totalPosts={basespots.length}
        onPageChange={paginate}
      />
    </div>
  );
};

export default BasespotsList;
