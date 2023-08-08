import { Link, routes, navigate } from "@redwoodjs/router";
import { useMutation } from "@redwoodjs/web";
import { toast } from "@redwoodjs/web/toast";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "src/auth";
import Map from "src/components/Util/Map/Map";
import Slideshow from "src/components/Util/Slideshow/Slideshow";

import { timeTag } from "src/lib/formatters";

import type { FindBasespotById, permission } from "types/graphql";

interface Props {
  basespot: NonNullable<FindBasespotById["basespot"]>;
}

const BASESPOT_PUBLISH = gql`
  mutation PublishBasespotMutation($id: String!, $input: UpdateBasespotInput!) {
    updateBasespot(id: $id, input: $input) {
      id
      name
      description
      latitude
      longitude
      thumbnail
      created_at
      map_id
      published
    }
  }
`;

const Basespot = ({ basespot }: Props) => {
  const [images, setImages] =
    useState<{ url: string; error?: string; thumbnail: boolean }[]>(null);
  const { client: supabase, currentUser } = useAuth();

  const [publishBasespot] = useMutation(
    BASESPOT_PUBLISH,
    {
      onCompleted: (data) => {
        toast.success("Basespot successfully published");
        navigate(routes.basespot({ id: data.updateBasespot.id.toString() }));
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }
  );

  const getImage = useCallback(async () => {
    const baseURL = `M${basespot.map_id}-${basespot.id}`;
    try {
      if (
        !images
      ) {
        const { data, error } = await supabase.storage
          .from(`basespotimages`)
          .createSignedUrls(
            [
              ...(basespot.base_images
                ? basespot?.base_images
                  .split(",")
                  .map((img) => `${baseURL}/${img.trim()}`)
                : []),
            ].concat(!basespot.base_images.includes(basespot.thumbnail) ? [`${baseURL}/${basespot.thumbnail}`] : []),
            60 * 60 * 24 * 365 * 10
          );
        if (error) {
          return toast.error(error.message);
        }
        if (data) {
          setImages(
            data.map((d) => ({
              url: d.signedUrl,
              error: d.error,
              thumbnail: d.path.includes(basespot.thumbnail),
            }))
          );
        }
      }
    } catch (error) {
      toast.error(error.message);
    }
  }, [basespot.thumbnail]);

  useEffect(() => {
    getImage();
  }, [basespot.thumbnail]);

  return (
    <article className="text-gray-700 dark:text-stone-200">
      <div className="mb-3 lg:flex lg:items-center lg:justify-between">
        <div className="min-w-0 flex-1 font-semibold text-lg">Basespot</div>
        <div className="flex space-x-2 lg:ml-4 lg:mt-0">
          {currentUser?.permissions.some(
            (p: permission) => p === "basespot_update"
          ) && (
              <Link
                to={routes.editBasespot({ id: basespot.id.toString() })}
                className="rw-button rw-button-medium rw-button-gray-outline hidden sm:block"

              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="rw-button-icon-start">
                  <path d="M493.2 56.26l-37.51-37.51C443.2 6.252 426.8 0 410.5 0c-16.38 0-32.76 6.25-45.26 18.75L45.11 338.9c-8.568 8.566-14.53 19.39-17.18 31.21l-27.61 122.8C-1.7 502.1 6.158 512 15.95 512c1.047 0 2.116-.1034 3.198-.3202c0 0 84.61-17.95 122.8-26.93c11.54-2.717 21.87-8.523 30.25-16.9l321.2-321.2C518.3 121.7 518.2 81.26 493.2 56.26zM149.5 445.2c-4.219 4.219-9.252 7.039-14.96 8.383c-24.68 5.811-69.64 15.55-97.46 21.52l22.04-98.01c1.332-5.918 4.303-11.31 8.594-15.6l247.6-247.6l82.76 82.76L149.5 445.2zM470.7 124l-50.03 50.02l-82.76-82.76l49.93-49.93C393.9 35.33 401.9 32 410.5 32s16.58 3.33 22.63 9.375l37.51 37.51C483.1 91.37 483.1 111.6 470.7 124z" />
                </svg>
                Edit
              </Link>
            )}

          <button
            type="button"
            className="rw-button rw-button-medium rw-button-gray-outline hidden sm:block"
            onClick={() => {
              // ${encodeURIComponent(
              //   window.location.href
              // )}
              // `https://www.facebook.com/sharer/sharer.php?u=`
              // https://twitter.com/share?url=
              // https://www.linkedin.com/shareArticle?url=
              // https://pinterest.com/pin/create/button/?url=
              // https://reddit.com/submit?url=

              if (
                navigator.canShare({
                  url: window.location.href,
                })
              )
                navigator
                  .share({
                    title: basespot.name,
                    text: basespot.description,
                    url: window.location.href,
                  })
                  .then(() => {
                    toast.success("Thanks for sharing!");
                  })
                  .catch(console.error);
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="rw-button-icon-start"><path d="M176 224h275.8l-158.1-131.7c-6.781-5.656-7.688-15.75-2.031-22.53c5.688-6.812 15.78-7.687 22.53-2.031l192 159.1C509.9 230.8 512 235.2 512 239.1c0 4.75-2.094 9.253-5.75 12.28l-192 159.1c-3 2.5-6.625 3.719-10.25 3.719c-4.562 0-9.125-1.969-12.28-5.75c-5.656-6.781-4.75-16.87 2.031-22.53l158.1-131.7H176c-79.41 0-144 64.59-144 143.1v31.1C32 440.8 24.84 448 16 448S0 440.8 0 432v-31.1C0 302.1 78.97 224 176 224z" /></svg>
            Share
          </button>

          <button
            type="button"
            className="rw-button rw-button-medium rw-button-green"
            disabled={basespot.published || !currentUser?.permissions.some((p: permission) => p === "basespot_update")}
            onClick={(e) => {
              e.preventDefault();
              publishBasespot({
                variables: {
                  id: basespot.id,
                  input: {
                    published: true,
                  },
                },
              });
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="rw-button-icon-start">
              <path d="M498.1 5.629C492.7 1.891 486.4 0 480 0c-5.461 0-10.94 1.399-15.88 4.223l-448 255.1C5.531 266.3-.6875 277.8 .0625 289.1s8.375 22.86 19.62 27.55l103.2 43.01l61.85 146.5C186.2 510.6 189.2 512 191.1 512c2.059 0 4.071-.8145 5.555-2.24l85.75-82.4l120.4 50.16c4.293 1.793 8.5 2.472 12.29 2.472c6.615 0 12.11-2.093 15.68-4.097c8.594-4.828 14.47-13.31 15.97-23.05l64-415.1C513.5 24.72 508.3 12.58 498.1 5.629zM32 288l380.1-217.2l-288.2 255.5L32 288zM200.7 462.3L151.1 344.9l229.5-203.4l-169.5 233.1c-2.906 4-3.797 9.094-2.438 13.84c1.374 4.75 4.844 8.594 9.438 10.41l34.4 13.76L200.7 462.3zM416.7 443.3l-167.7-66.56l225.7-310.3L416.7 443.3z" />
            </svg>
            Publish
          </button>
        </div>
      </div>

      <header
        className="font-montserrat group flex min-h-[200px] w-full flex-col justify-between rounded-lg bg-cover bg-center bg-no-repeat p-12 text-white ring-1 ring-zinc-500"
        style={{
          backgroundImage: `url(${images
            ? images?.find((img) => img.thumbnail == true)?.url
            : "https://images.placeholders.dev/?width=1055&height=200&text=ArkDashboard&bgColor=%23f7f6f6&textColor=%236d6e71"
            })`,
        }}
      >
        <div className="flex justify-between pb-5">
          <Link
            to={routes.map({ id: basespot.map_id.toString() })}
            className="rw-link text-xl font-bold uppercase tracking-[0.4rem] text-white opacity-90 transition ease-linear"
          >
            {basespot.Map.name}
          </Link>
          <div className="flex items-center text-sm opacity-50 transition ease-linear group-hover:opacity-90">
            <p className="text-right">{timeTag(basespot.created_at)}</p>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 30 30"
              className="ml-3 w-5 fill-current"
            >
              <path
                className="d"
                d="M15,0C6.75,0,0,6.75,0,15s6.75,15,15,15,15-6.75,15-15S23.25,0,15,0Zm7.35,16.65h-7.35c-.83,0-1.5-.67-1.5-1.5V7.8c0-.9,.6-1.5,1.5-1.5s1.5,.6,1.5,1.5v5.85h5.85c.9,0,1.5,.6,1.5,1.5s-.6,1.5-1.5,1.5Z"
              />
            </svg>
          </div>
        </div>
        <div className="mt-6 md:mt-12">
          {/* <div className="mb-3 flex items-center space-x-1 opacity-75 [&>span:not(:last-child)]:after:content-[',']">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" className="w-5 mr-3 fill-current ">
                <path className="d" d="M19.22,9.66L10.77,1.21c-.74-.74-1.86-1.21-2.97-1.21H1.67C.75,0,0,.75,0,1.67V7.8c0,1.11,.46,2.23,1.3,2.97l8.45,8.46c1,1,2.62,1,3.62,0l5.94-5.95c.93-.93,.93-2.6-.09-3.62ZM6.96,6.35c-.59,.59-1.56,.59-2.15,0-.59-.59-.59-1.56,0-2.15,.59-.59,1.56-.59,2.15,0,.59,.59,.59,1.56,0,2.15Z" />
              </svg>
              {["Deez", "Nuts"].map((tag) => (
                <span className="text-sm" key={tag}>{tag}</span>
              ))}
          </div> */}
          <h1 className="my-5 text-2xl font-bold opacity-90 md:text-5xl">
            {basespot.name}
          </h1>
          <p className="w-full select-none leading-7 opacity-75 transition ease-linear group-hover:opacity-100">
            {basespot.description}
          </p>
        </div>
      </header>

      <div className="flex flex-wrap py-12">
        <div className="w-full overflow-hidden rounded-lg md:w-fit lg:mb-0">
          <Map
            className="h-full w-full object-cover object-center"
            map_id={basespot.map_id}
            interactive={true}
            pos={[{ lat: basespot.latitude, lon: basespot.longitude }]}
            disable_map={true}
          />
        </div>
        <div className="flex w-full flex-col flex-wrap space-y-10 py-6 text-center lg:w-1/2 lg:flex-grow lg:pl-12 lg:text-left">
          <div className="flex flex-col items-center space-y-3 lg:items-start">
            <div className="bg-pea-50 text-pea-500 inline-flex h-12 w-12 items-center justify-center rounded-full">
              <svg
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-6 w-6"
                viewBox="0 0 24 24"
              >
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
            </div>
            <h2 className="title-font text-lg font-medium text-gray-900 dark:text-stone-200">
              Coordinates
            </h2>
            <p className="flex-grow text-base leading-relaxed">
              This spot is located at <strong>{basespot.latitude}</strong> Lat,{" "}
              <strong>{basespot.longitude}</strong> Lon
            </p>
          </div>
          <div className="flex flex-col items-center space-y-3 lg:items-start">
            <div className="bg-pea-50 text-pea-500 inline-flex h-12 w-12 items-center justify-center rounded-full">
              <svg
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-6 w-6"
                viewBox="0 0 24 24"
              >
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <h2 className="title-font mb-3 text-lg font-medium text-gray-900 dark:text-stone-200">
              Players
            </h2>
            <p className="flex-grow text-base leading-relaxed">
              We think that this basespot does fit about{" "}
              <strong>{basespot.estimated_for_players}</strong> players
            </p>
          </div>
        </div>
      </div>

      {images && images.length > 0 && (
        <section className="body-font border-t border-stone-200 text-gray-700 dark:border-gray-200 dark:text-stone-200">
          <div className="container mx-auto py-24">
            <div className="mb-20 flex w-full flex-col text-center">
              <h2 className="title-font text-pea-500 mb-1 text-xs font-medium tracking-widest">
                Basespot Defense Setup
              </h2>
              <h1 className="title-font text-2xl font-medium text-gray-900 dark:text-stone-200 sm:text-3xl">
                Basespot Images
              </h1>
            </div>

            <div className="grid gap-4">
              <Slideshow
                slides={images.map((img) => ({ url: img.url }))}
                autoPlay={false}
                imageTabs={true}
              />
            </div>
          </div>
        </section>
      )}

      <section className="body-font border-t border-stone-200 text-gray-700 dark:border-gray-200 dark:text-stone-200">
        <div className="container mx-auto py-24">
          <div className="mb-20 flex w-full flex-col text-center">
            <h2 className="title-font text-pea-500 mb-1 text-xs font-medium tracking-widest">
              Tips & tricks
            </h2>
            <h1 className="title-font text-2xl font-medium text-gray-900 dark:text-stone-200 sm:text-3xl">
              Tips for building basespots
            </h1>
          </div>

          <div className="grid gap-4">
            <Slideshow
              className="mb-6"
              border={false}
              controls={true}
              autoPlay={true}
              slides={[
                {
                  title: 'Tip #1',
                  content: (
                    <div className="flex justify-center px-5 py-12">
                      <div className="text-center lg:w-3/4 xl:w-1/2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          className="mb-8 inline-block h-8 w-8 text-black dark:text-white"
                          viewBox="0 0 975.036 975.036"
                        >
                          <path d="M925.036 57.197h-304c-27.6 0-50 22.4-50 50v304c0 27.601 22.4 50 50 50h145.5c-1.9 79.601-20.4 143.3-55.4 191.2-27.6 37.8-69.399 69.1-125.3 93.8-25.7 11.3-36.8 41.7-24.8 67.101l36 76c11.6 24.399 40.3 35.1 65.1 24.399 66.2-28.6 122.101-64.8 167.7-108.8 55.601-53.7 93.7-114.3 114.3-181.9 20.601-67.6 30.9-159.8 30.9-276.8v-239c0-27.599-22.401-50-50-50zM106.036 913.497c65.4-28.5 121-64.699 166.9-108.6 56.1-53.7 94.4-114.1 115-181.2 20.6-67.1 30.899-159.6 30.899-277.5v-239c0-27.6-22.399-50-50-50h-304c-27.6 0-50 22.4-50 50v304c0 27.601 22.4 50 50 50h145.5c-1.9 79.601-20.4 143.3-55.4 191.2-27.6 37.8-69.4 69.1-125.3 93.8-25.7 11.3-36.8 41.7-24.8 67.101l35.9 75.8c11.601 24.399 40.501 35.2 65.301 24.399z"></path>
                        </svg>

                        <p className="text-black dark:text-white text-lg leading-relaxed whitespace-pre-wrap">
                          Configure the turrets so that they have different ranges and different angles of fire. This will make it harder for raiders to find a blind spot.
                        </p>

                        <span className="bg-pea-500 mt-8 inline-block h-1 w-10 rounded" />
                      </div>
                    </div>
                  ),
                },
                {
                  title: 'Tip #2',
                  content: (
                    <div className="flex justify-center px-5 py-12">
                      <div className="text-center lg:w-3/4 xl:w-1/2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          className="mb-8 inline-block h-8 w-8 text-black dark:text-white"
                          viewBox="0 0 975.036 975.036"
                        >
                          <path d="M925.036 57.197h-304c-27.6 0-50 22.4-50 50v304c0 27.601 22.4 50 50 50h145.5c-1.9 79.601-20.4 143.3-55.4 191.2-27.6 37.8-69.399 69.1-125.3 93.8-25.7 11.3-36.8 41.7-24.8 67.101l36 76c11.6 24.399 40.3 35.1 65.1 24.399 66.2-28.6 122.101-64.8 167.7-108.8 55.601-53.7 93.7-114.3 114.3-181.9 20.601-67.6 30.9-159.8 30.9-276.8v-239c0-27.599-22.401-50-50-50zM106.036 913.497c65.4-28.5 121-64.699 166.9-108.6 56.1-53.7 94.4-114.1 115-181.2 20.6-67.1 30.899-159.6 30.899-277.5v-239c0-27.6-22.399-50-50-50h-304c-27.6 0-50 22.4-50 50v304c0 27.601 22.4 50 50 50h145.5c-1.9 79.601-20.4 143.3-55.4 191.2-27.6 37.8-69.4 69.1-125.3 93.8-25.7 11.3-36.8 41.7-24.8 67.101l35.9 75.8c11.601 24.399 40.501 35.2 65.301 24.399z"></path>
                        </svg>

                        <p className="text-black dark:text-white text-lg leading-relaxed">
                          Build multiple turret walls if possible
                        </p>

                        <span className="bg-pea-500 mt-8 inline-block h-1 w-10 rounded" />
                      </div>
                    </div>
                  ),
                },
              ]}
            />
          </div>
        </div>
      </section>
    </article>
  );
};

export default Basespot;
