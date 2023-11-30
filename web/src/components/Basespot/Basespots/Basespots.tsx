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
import Badge from "src/components/Util/Badge/Badge";
import Tooltip from "src/components/Util/Tooltip/Tooltip";

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
            <CardActions className="justify-between">
              <Button
                variant="outlined"
                color="success"
                to={routes.basespot({ id: basespot.id })}
              >
                Learn More
              </Button>
              <div className="shrink justify-end inline-flex items-center py-0.5">
                {basespot.type.toLowerCase().includes('underwater') && (
                  <Tooltip content={'This Basespot is located underwater'}>
                    <div className="inline-flex h-8 w-12 items-center justify-center rounded border-none bg-transparent text-center align-middle text-xs font-medium">
                      <Badge
                        variant="outlined"
                        color="info"
                        standalone
                        content={
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" className="w-4 fill-current">
                            <path d="M562 479.1c-28.14-3.625-53.29-18.34-69.03-40.38c-6-8.438-20.04-8.438-26.04 0C448.5 464.6 417.5 480 383.1 480c-33.52 0-64.53-15.44-82.97-41.28c-6.031-8.438-20.03-8.438-26.06 0C256.5 464.6 225.5 480 192 480c-33.51 0-64.53-15.44-82.97-41.28C106 434.5 101.2 432 96 432s-10.02 2.5-13.02 6.719c-15.73 22.03-40.89 36.75-69.03 40.38c-8.766 1.125-14.95 9.156-13.83 17.94c1.125 8.75 9.029 15.06 17.92 13.81c29.98-3.875 57.48-17.47 77.94-38.09c24.62 24.84 59.28 39.25 96.06 39.25c36.77 0 71.33-14.41 95.95-39.25C312.6 497.6 347.3 512 384.1 512c36.78 0 71.33-14.41 95.95-39.25c20.45 20.62 47.95 34.22 77.94 38.09c8.951 1.375 16.79-5.062 17.92-13.81C576.1 488.3 570.8 480.2 562 479.1zM18.05 382.8c29.98-3.875 57.48-17.47 77.94-38.09c24.62 24.84 59.28 39.16 96.06 39.16c36.77 0 71.33-14.32 95.95-39.16c24.62 24.84 59.28 39.16 96.05 39.16c36.78 0 71.34-14.32 95.96-39.16c20.45 20.62 47.95 34.22 77.94 38.09c8.951 1.375 16.79-5.062 17.92-13.81c1.125-8.781-5.062-16.81-13.83-17.94c-28.14-3.625-53.29-18.34-69.03-40.38c-6-8.438-20.04-8.438-26.04 0C448.5 336.6 417.5 352 383.1 352c-33.52 0-64.53-15.44-82.97-41.28c-6.031-8.438-20.03-8.438-26.06 0C256.5 336.6 225.5 352 192 352c-33.51 0-64.53-15.44-82.97-41.28C106 306.5 101.2 304 96 304S85.99 306.5 82.99 310.7c-15.73 22.03-40.89 36.75-69.03 40.38c-8.766 1.125-14.95 9.156-13.83 17.94C1.258 377.8 9.162 384.1 18.05 382.8zM276.7 235.3C279.8 238.4 283.9 240 288 240s8.188-1.562 11.31-4.688l96-96c6.25-6.25 6.25-16.38 0-22.62s-16.38-6.25-22.62 0L304 185.4V16c0-8.844-7.157-16-16-16S272 7.156 272 16v169.4L203.3 116.7c-6.25-6.25-16.38-6.25-22.62 0s-6.25 16.38 0 22.62L276.7 235.3z" />
                          </svg>
                        }
                      />
                    </div>
                  </Tooltip>
                )}
                {(basespot.has_air && basespot.type.toLowerCase().includes('underwater')) && <span className="h-4 w-px bg-zinc-800/25 dark:bg-white/25" />}
                {basespot.has_air && (
                  <Tooltip content={'This Basespot has air'}>
                    <div className="inline-flex h-8 w-12 items-center justify-center rounded border-none bg-transparent text-center align-middle text-xs font-medium">
                      <Badge
                        variant="outlined"
                        color="DEFAULT"
                        standalone
                        content={
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" className="w-4 fill-current">
                            <path d="M224 416c0 35.3-28.7 64-64 64c-26.47 0-48-21.53-48-48S133.5 384 160 384c8.836 0 16-7.164 16-16S168.8 352 160 352c-44.11 0-80 35.89-80 79.1S115.9 512 160 512c52.94 0 96-43.06 96-96V288H224V416zM416 320c-8.836 0-16 7.164-16 15.1S407.2 352 416 352c26.47 0 48 21.53 48 48S442.5 448 416 448c-35.3 0-64-28.7-64-64V288h-32v96c0 52.94 43.06 96 96 96c44.11 0 80-35.89 80-80S460.1 320 416 320zM512 .0002H64c-35.2 0-64 28.8-64 64V192c0 35.2 28.8 64 64 64h448c35.2 0 64-28.8 64-64V64C576 28.8 547.2 .0002 512 .0002zM544 192c0 17.67-14.33 32-32 32H64C46.33 224 32 209.7 32 192V64c0-17.67 14.33-32 32-32h448c17.67 0 32 14.33 32 32V192zM464 128h-352C103.2 128 96 135.2 96 144S103.2 160 112 160h352C472.8 160 480 152.8 480 144S472.8 128 464 128z" />
                          </svg>
                        }
                      />
                    </div>
                  </Tooltip>
                )}
              </div>
            </CardActions>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default BasespotsList;
