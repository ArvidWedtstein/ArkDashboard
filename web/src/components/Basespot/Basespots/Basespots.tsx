import { navigate, parseSearch } from "@redwoodjs/router";
import { routes, useParams } from "@redwoodjs/router";
import { useEffect, useState } from "react";
import { Lookup } from "src/components/Util/Lookup/Lookup";
import type { FindNewBasespots } from "types/graphql";
import { useApolloClient } from "@apollo/client";
import {
  Card,
  CardActions,
  CardHeader,
  CardMedia,
} from "src/components/Util/Card/Card";
import Button from "src/components/Util/Button/Button";
import Badge from "src/components/Util/Badge/Badge";
import Tooltip from "src/components/Util/Tooltip/Tooltip";
import { useAuth } from "src/auth";
import { toast } from "@redwoodjs/web/dist/toast";
import clsx from "clsx";
import { ToggleButton, ToggleButtonGroup } from "src/components/Util/ToggleButton/ToggleButton";
import { Input } from "src/components/Util/Input/Input";


const QUERY = gql`
  query FindMoreBasespots($cursorId: String, $take: Int, $skip: Int, $map: Int, $type: String) {
    basespotPagination(cursorId: $cursorId, take: $take, skip: $skip, map: $map, type: $type) {
      __typename
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
        type
        has_air
        Map {
          name
          icon
        }
      }
      has_more_basespots
    },
  }
`

const BasespotsList = ({ basespotPagination, maps }: FindNewBasespots) => {
  let { map, type } = useParams();

  const { client: supabase } = useAuth();
  const client = useApolloClient();

  const mapImages = {
    TheIsland:
      "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/i/62a15c04-bef2-45a2-a06a-c984d81c3c0b/dd391pu-a40aaf7b-b8e7-4d6d-b49d-aa97f4ad61d0.jpg",
    TheCenter:
      "https://cdn.akamai.steamstatic.com/steam/apps/473850/ss_f13c4990d4609d3fc89174f71858835a9f09aaa3.1920x1080.jpg?t=1508277712",
    ScorchedEarth: "https://wallpapercave.com/wp/wp10504822.jpg",
    Ragnarok:
      "https://cdn.survivetheark.com/uploads/monthly_2016_10/large.580b5a9c3b586_Ragnarok02.jpg.6cfa8b30a81187caace6fecc1e9f0c31.jpg",
    Aberration:
      "https://cdn.images.express.co.uk/img/dynamic/143/590x/ARK-Survival-Evolved-849382.jpg",
    Extinction:
      "https://cdn.cloudflare.steamstatic.com/steam/apps/887380/ss_3c2c1d7c027c8beb54d2065afe3200e457c2867c.1920x1080.jpg?t=1594677636",
    Valguero:
      "https://i.pinimg.com/originals/0b/95/09/0b9509ddce658e3209ece1957053b27e.jpg",
    Genesis:
      "https://cdn.akamai.steamstatic.com/steam/apps/1646700/ss_c939dd546237cba9352807d4deebd79c4e29e547.1920x1080.jpg?t=1622514386",
    CrystalIsles:
      "https://cdn2.unrealengine.com/egs-crystalislesarkexpansionmap-studiowildcard-dlc-g1a-05-1920x1080-119682147.jpg?h=720&resize=1&w=1280",
    Fjordur:
      "https://cdn.cloudflare.steamstatic.com/steam/apps/1887560/ss_331869adb5f0c98e3f13b48189e280f8a0ba1616.1920x1080.jpg?t=1655054447",
    LostIsland:
      "https://dicendpads.com/wp-content/uploads/2021/12/Ark-Lost-Island.png",
    Genesis2:
      "https://cdn.cloudflare.steamstatic.com/steam/apps/1646720/ss_5cad67b512285163143cfe21513face50c0a00f6.1920x1080.jpg?t=1622744444",
  };

  type Params = {
    map: number;
    type: string;
    search?: string;
  }

  const [params, setParams] = useState<Params>({
    map: map ? parseInt(map) : null,
    type: type || null
  });
  const [basespots, setBasespots] = useState(basespotPagination.basespots);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMoreBasespots, setHasMoreBasespots] = useState<boolean>(basespotPagination.has_more_basespots || true);


  const getThumbnailUrls = async (basespotsToProcess: FindNewBasespots["basespotPagination"]["basespots"]) => {
    const thumbnailIds = basespotsToProcess
      .filter((b) => b?.thumbnail && b?.thumbnail !== "" && b.thumbnail.length > 0 && !b.thumbnail.includes(b.id))
      .map((b) => `M${b.map_id}-${b.id}/${b.thumbnail}`);

    const { data, error } = await supabase.storage.from('basespotimages').createSignedUrls(thumbnailIds, 60);

    if (error) {
      console.error(error);
      toast.error(`Error fetching images: ${error.message}`);
      return [];
    }

    return data;
  };

  const updateBasespots = (basespotsToProcess: FindNewBasespots["basespotPagination"]["basespots"], thumbnailUrls: {
    error: string;
    path: string;
    signedUrl: string;
  }[] = []) => {
    setBasespots(
      basespotsToProcess.map((f) => {
        const matchingThumbnail = thumbnailUrls.find((d) => d.signedUrl?.includes(f.id));
        return {
          ...f,
          thumbnail: matchingThumbnail?.signedUrl || mapImages[f.Map.name.replace(" ", "")],
        };
      })
    );

    toast.dismiss('loading');
  };

  useEffect(() => {
    setBasespots(basespotPagination.basespots);

    const fetchThumbnailUrls = async () => {
      try {
        const thumbnailUrls = await getThumbnailUrls(basespotPagination.basespots)

        updateBasespots(basespots, thumbnailUrls)
      } catch (error) {
        console.error(error);
      }
    };

    if (basespotPagination.basespots.some((b) => b?.thumbnail)) {
      fetchThumbnailUrls();
    }
  }, [basespotPagination])

  const loadMore = async () => {
    const oldBasespots = [...basespots];

    const { map, type } = params;
    const response = await client.query<FindNewBasespots>({
      query: QUERY,
      variables: {
        skip: 1,
        take: 6,
        cursorId: oldBasespots[oldBasespots.length - 1]?.id,
        ...(map && { map }),
        ...(type && { type }),
      }
    });

    if (response.error) {
      handleLoadError(response.loading, response.error);
      return;
    }

    if (!response.data) {
      handleLoadError(response.loading, response.error, 'No data in response.');
      return;
    }

    setHasMoreBasespots((prev) => {
      if (!prev && (response.data.basespotPagination.has_more_basespots || response.data.basespotPagination.basespots.length > 0)) {
        return true
      }
      return response.data.basespotPagination.has_more_basespots
    });

    const basespotsToProcess = [...oldBasespots, ...response.data.basespotPagination.basespots];

    if (basespotsToProcess.some((basespot) => basespot?.thumbnail)) {
      const thumbnailUrls = await getThumbnailUrls(basespotsToProcess);
      updateBasespots(basespotsToProcess, thumbnailUrls);
    } else {
      updateBasespots(basespotsToProcess);
    }

    setLoading(response.loading);
  }

  const handleLoadError = (loading: boolean, error: Record<string, any>, message = "Error fetching basespots") => {
    setLoading(loading);
    toast.dismiss('loading');
    console.error(JSON.stringify(error));
    toast.error(`Error fetching images: ${error?.message || message}`);
  };

  // https://njihiamark.medium.com/cursor-based-pagination-for-infinite-scrolling-using-next-13-tailwind-postgres-and-prisma-5ba921be5ecc
  // https://community.redwoodjs.com/t/infinite-scrolling-using-field-policy-inmemorycache/3570/2

  const refreshData = (parameters: Params) => {
    try {
      navigate(
        routes.basespots({
          ...parseSearch(
            Object.fromEntries(
              Object.entries(parameters).filter(([_, v]) => v != "" && v != null)
            ) as Record<string, string>
          ),
        }),
        { replace: false }
      );
    } catch (error) {
      console.error('Refresh went wrong.', error)
    }
  }

  const handleScroll = (e) => {
    if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight || loading) {
      return;
    }
    toast.loading('Loading data', { id: 'loading' })
    setLoading(true);
    loadMore();
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading])


  const [view, setView] = useState<"grid" | "list">("grid");

  return (
    <article className="rw-segment">
      <div className="">
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
        <div className="flex items-center justify-center space-x-3 w-full">
          <div className="rw-button-group !w-full justify-start space-x-3">
            <Button
              to={routes.newBasespot()}
              color="success"
              variant="outlined"
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
              defaultValue={params.map}
              valueKey="id"
              onSelect={(e) => {
                setParams({
                  map: e ? e?.id : null,
                  type: params.type,
                });
                refreshData({
                  ...(e?.id && { map: e.id }),
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
              value={params.type}
              label="Type"
              onSelect={(e) => {
                setParams({
                  type: e,
                  map: params.map,
                });
                refreshData({
                  ...(e && { type: e }),
                  ...(params.map && { map: params.map }),
                });
              }}
            />

            <Input
              margin="none"
              type="search"
              label="Search"
              color="DEFAULT"
              onChange={(e) => {
                setParams((prev) => ({
                  ...prev,
                  search: e.target.value
                }))
              }}
            />
          </div>
          <ToggleButtonGroup
            orientation="horizontal"
            value={view}
            exclusive
            enforce
            onChange={(_, value) => setView(value)}
          >
            <ToggleButton value="list">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                className="h-5 w-5 fill-current"
              >
                <path d="M64 48H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32v-32C96 62.33 81.67 48 64 48zM64 112H32v-32h32V112zM64 368H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32v-32C96 382.3 81.67 368 64 368zM64 432H32v-32h32V432zM176 112h320c8.801 0 16-7.201 16-15.1C512 87.2 504.8 80 496 80h-320C167.2 80 160 87.2 160 95.1C160 104.8 167.2 112 176 112zM496 240h-320C167.2 240 160 247.2 160 256c0 8.799 7.201 16 16 16h320C504.8 272 512 264.8 512 256C512 247.2 504.8 240 496 240zM496 400h-320C167.2 400 160 407.2 160 416c0 8.799 7.201 16 16 16h320c8.801 0 16-7.201 16-16C512 407.2 504.8 400 496 400zM64 208H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32v-32C96 222.3 81.67 208 64 208zM64 272H32v-32h32V272z" />
              </svg>
            </ToggleButton>
            <ToggleButton value="grid">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                className="h-5 w-5 fill-current"
              >
                <path d="M160 0H64C28.65 0 0 28.65 0 64v96c0 35.35 28.65 64 64 64h96c35.35 0 64-28.65 64-64V64C224 28.65 195.3 0 160 0zM192 160c0 17.64-14.36 32-32 32H64C46.36 192 32 177.6 32 160V64c0-17.64 14.36-32 32-32h96c17.64 0 32 14.36 32 32V160zM160 288H64c-35.35 0-64 28.65-64 64v96c0 35.35 28.65 64 64 64h96c35.35 0 64-28.65 64-64v-96C224 316.7 195.3 288 160 288zM192 448c0 17.64-14.36 32-32 32H64c-17.64 0-32-14.36-32-32v-96c0-17.64 14.36-32 32-32h96c17.64 0 32 14.36 32 32V448zM448 0h-96c-35.35 0-64 28.65-64 64v96c0 35.35 28.65 64 64 64h96c35.35 0 64-28.65 64-64V64C512 28.65 483.3 0 448 0zM480 160c0 17.64-14.36 32-32 32h-96c-17.64 0-32-14.36-32-32V64c0-17.64 14.36-32 32-32h96c17.64 0 32 14.36 32 32V160zM448 288h-96c-35.35 0-64 28.65-64 64v96c0 35.35 28.65 64 64 64h96c35.35 0 64-28.65 64-64v-96C512 316.7 483.3 288 448 288zM480 448c0 17.64-14.36 32-32 32h-96c-17.64 0-32-14.36-32-32v-96c0-17.64 14.36-32 32-32h96c17.64 0 32 14.36 32 32V448z" />
              </svg>
            </ToggleButton>
          </ToggleButtonGroup>
        </div>

        <div className={clsx("mb-5 grid grid-cols-1 gap-4", {
          "grid-cols-1": view === "list",
          "grid-cols-1 md:grid-cols-2 xl:grid-cols-3":
            view === "grid",
        })}>
          {basespots.map((basespot, i) => (
            <Card key={`${basespot.id}-${i}`} className="flex flex-col">
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
                  basespot.thumbnail === "" ? mapImages[basespot.Map.name.replace(" ", "")] : basespot.thumbnail
                }
                loading="lazy"
                className="grow max-h-72"
              />
              <CardActions className="justify-between">
                <Button
                  variant="outlined"
                  color="success"
                  to={routes.basespot({ id: basespot.id })}
                  endIcon={
                    <svg
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 14 10"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M1 5h12m0 0L9 1m4 4L9 9"
                      />
                    </svg>
                  }
                >
                  Learn More
                </Button>
                <div className="shrink justify-end inline-flex items-center py-0.5">
                  {basespot?.type?.toLowerCase().includes('underwater') && (
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
                  {(basespot?.type?.toLowerCase().includes('underwater') && basespot?.type?.toLowerCase().includes('cave')) && <span className="h-4 w-px bg-zinc-800/25 dark:bg-white/25" />}
                  {basespot?.type?.toLowerCase().includes('cave') && (
                    <Tooltip content={'This Basespot is located inside a cave'}>
                      <div className="inline-flex h-8 w-12 items-center justify-center rounded border-none bg-transparent text-center align-middle text-xs font-medium">
                        <Badge
                          variant="outlined"
                          color="secondary"
                          standalone
                          content={
                            <svg fillRule="evenodd" xmlns="http://www.w3.org/2000/svg" viewBox="0, 0, 400,400" className="h-4 fill-current">
                              <path id="path0" d="M178.628 14.217 C 173.142 22.290,163.841 43.690,157.959 61.772 L 147.264 94.649 135.940 83.324 C 114.307 61.692,96.611 72.813,73.827 122.359 C 50.372 173.365,7.851 323.977,1.371 379.000 L -1.101 400.000 71.131 400.000 L 143.364 400.000 146.179 387.000 C 167.231 289.748,226.097 292.919,257.549 393.000 C 259.534 399.317,266.593 400.000,329.874 400.000 L 400.000 400.000 400.000 388.440 C 400.000 346.420,353.648 175.499,334.578 147.202 C 319.647 125.046,301.278 128.040,288.178 154.765 C 275.010 181.631,274.738 181.510,266.290 145.000 C 237.242 19.455,206.368 -26.606,178.628 14.217 M227.664 83.120 C 233.907 102.304,244.860 142.846,252.006 173.213 C 267.465 238.916,274.234 244.065,289.843 202.000 C 302.001 169.233,308.623 156.000,312.862 156.000 C 322.718 156.000,351.544 244.560,367.667 324.372 C 372.292 347.267,376.994 370.050,378.114 375.000 C 380.146 383.972,379.995 384.000,328.708 384.000 L 277.264 384.000 266.640 356.921 C 229.895 263.263,161.270 273.102,126.588 377.000 C 122.441 389.422,19.105 387.450,21.786 375.000 C 51.283 238.021,92.033 114.231,113.488 96.425 C 118.743 92.063,121.239 94.268,130.814 111.725 C 147.996 143.053,153.990 139.219,171.672 85.584 C 179.725 61.155,189.643 36.089,193.710 29.881 L 201.105 18.595 208.710 33.417 C 212.892 41.570,221.422 63.936,227.664 83.120" />
                            </svg>
                          }
                        />
                      </div>
                    </Tooltip>
                  )}
                  {(basespot.has_air && basespot?.type?.toLowerCase().includes('underwater')) && <span className="h-4 w-px bg-zinc-800/25 dark:bg-white/25" />}
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
          {loading && (
            <>
              <div className="flex h-full w-full items-center justify-center rounded bg-zinc-300 dark:bg-zinc-700 animate-pulse" />
              <div className="flex h-full w-full items-center justify-center rounded bg-zinc-300 dark:bg-zinc-700 animate-pulse" />
              <div className="flex h-full w-full items-center justify-center rounded bg-zinc-300 dark:bg-zinc-700 animate-pulse" />
              <div className="flex h-full w-full items-center justify-center rounded bg-zinc-300 dark:bg-zinc-700 animate-pulse" />
              <div className="flex h-full w-full items-center justify-center rounded bg-zinc-300 dark:bg-zinc-700 animate-pulse" />
              <div className="flex h-full w-full items-center justify-center rounded bg-zinc-300 dark:bg-zinc-700 animate-pulse" />
            </>
          )}
        </div>
      </div>
      {!hasMoreBasespots && (
        <Button variant="text" color="DEFAULT" className="mx-auto" onClick={loadMore}>Sorry, that was all the basespots</Button>
      )}
    </article>
  );
};

export default BasespotsList;
