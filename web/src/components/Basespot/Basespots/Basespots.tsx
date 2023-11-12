import { navigate, parseSearch } from "@redwoodjs/router";
import { Link, routes, useParams } from "@redwoodjs/router";
import { useEffect, useState } from "react";
import { Lookup } from "src/components/Util/Lookup/Lookup";
import type { FindBasespots } from "types/graphql";
import { useLazyQuery } from "@apollo/client";
import {
  Card,
  CardActions,
  CardHeader,
  CardMedia,
} from "src/components/Util/Card/Card";
import Button from "src/components/Util/Button/Button";

const QUERY = gql`
  query FindBasespotsAgain($take: Int, $lastCursor: String) {
    basespotPagination(take: $take, lastCursor: $lastCursor) {
      basespots {
        id
        name
        description
        latitude
        longitude
        thumbnail
        created_at
        updated_at
        map_id
        estimated_for_players
        Map {
          name
        }
      }
      hasNextPage
      cursor
    }
  }
`;
// const BasespotsList = ({ basespotPagination, maps }: FindBasespots) => {
const BasespotsList = ({ basespotPage, maps }: FindBasespots) => {
  const [basespot, setBasespot] = useState(basespotPage.basespots);
  // const [cursor, setCursor] = useState(basespotPagination.cursor);
  // let basespots = basespotPagination.basespots;
  let { map, type } = useParams();

  // TODO: https://njihiamark.medium.com/cursor-based-pagination-for-infinite-scrolling-using-next-13-tailwind-postgres-and-prisma-5ba921be5ecc


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
  // const [loadMore, { called, loading, data, variables }] = useLazyQuery(QUERY, {
  //   variables: {
  //     take: 9,
  //     lastCursor: cursor,
  //   },
  //   onError: (error) => {
  //     console.log(error);
  //   },
  //   onCompleted: (data) => {
  //     console.log(data);
  //     setCursor(data.basespotPagination.cursor);
  //     if (
  //       data.basespotPagination.basespots.length == 0 ||
  //       !data.basespotPagination.hasNextPage
  //     )
  //       return;
  //     setBasespot([...basespot, ...data.basespotPagination.basespots]);
  //   },
  // });

  // const loadMoreData = (e) => {
  //   e.preventDefault();
  //   if (!loading) {
  //     loadMore();
  //   }
  // };

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
      <div className="rw-button-group space-x-3">
        <Button
          to={routes.newBasespot()}
          color="success"
          variant="outlined"
          size="large"
          startIcon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 448 512"
            >
              <path d="M432 256C432 264.8 424.8 272 416 272h-176V448c0 8.844-7.156 16.01-16 16.01S208 456.8 208 448V272H32c-8.844 0-16-7.15-16-15.99C16 247.2 23.16 240 32 240h176V64c0-8.844 7.156-15.99 16-15.99S240 55.16 240 64v176H416C424.8 240 432 247.2 432 256z" />
            </svg>
          }
        >
          New Basespot
        </Button>
        {/* <button
          type="button"
          onClick={loadMoreData}
          className="rw-button rw-button-green-outline rw-button-large"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 448 512"
            className="rw-button-icon-start"
          >
            <path d="M432 256C432 264.8 424.8 272 416 272h-176V448c0 8.844-7.156 16.01-16 16.01S208 456.8 208 448V272H32c-8.844 0-16-7.15-16-15.99C16 247.2 23.16 240 32 240h176V64c0-8.844 7.156-15.99 16-15.99S240 55.16 240 64v176H416C424.8 240 432 247.2 432 256z" />
          </svg>
          test
        </button> */}

        <Lookup
          label={"Map"}
          options={maps}
          margin="none"
          getOptionLabel={(option) => option.name}
          getOptionImage={(option) =>
            `https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Map/${option.icon}`
          }
          isOptionEqualToValue={(option, value) => option.id === value.id}
          defaultValue={map}
          onSelect={(e) => {
            setParams({
              ...(e?.id && { map: e.id.toString() }),
              ...(params.type && { type: params.type }),
            });
          }}
        />
        <Lookup
          options={[
            "rathole",
            "cave",
            "cliff",
            "open",
            "waterfall",
            "underwater",
          ]}
          margin="none"
          defaultValue={type}
          label="Type"
          onSelect={(e) => {
            setParams({
              ...(e && { type: e }),
              ...(params.map && { map: params.map }),
            });
          }}
        />
      </div>
      <div className="mb-5 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {basespot.map((basespot, i) => (
          <Card key={`${basespot.id}-${i}`}>
            <CardHeader
              title={basespot.name}
              subheader={basespot.Map.name.split(/(?=[A-Z])/).join(" ")}
              avatar={
                <img
                  src={`https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Map/${basespot.Map.icon}`}
                  alt={basespot.Map.name}
                  title={basespot.Map.name}
                  loading="lazy"
                  className="h-10 w-10 rounded-full object-cover"
                />
              }
            />
            <CardMedia
              image={
                mapImages[basespot.Map.name.toLowerCase().replaceAll(" ", "")]
              }
            />
            <CardActions>
              <Link
                to={routes.basespot({ id: basespot.id.toString() })}
                className="rw-button transition-colors duration-100 ease-in-out hover:bg-black/10 dark:hover:bg-white/10"
              >
                Learn More
              </Link>
            </CardActions>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default BasespotsList;
