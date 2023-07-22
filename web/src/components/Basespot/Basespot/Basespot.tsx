import { Link, routes, navigate } from "@redwoodjs/router";
import { toast } from "@redwoodjs/web/toast";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "src/auth";
import Map from "src/components/Util/Map/Map";
import Slideshow from "src/components/Util/Slideshow/Slideshow";

import { timeTag } from "src/lib/formatters";

import type { FindBasespotById } from "types/graphql";

interface Props {
  basespot: NonNullable<FindBasespotById["basespot"]>;
}

const Basespot = ({ basespot }: Props) => {
  const [images, setImages] =
    useState<{ url: string; error?: string; thumbnail: boolean }[]>(null);
  const [currentModalImage, setCurrentModalImage] = useState(null);
  const { client: supabase } = useAuth();

  const getImage = useCallback(async () => {
    const baseURL = `M${basespot.map_id}-${basespot.id}`;
    try {
      if (
        basespot.thumbnail &&
        !images &&
        !basespot.thumbnail.startsWith("http")
      ) {
        const { data, error } = await supabase.storage
          .from(`basespotimages`)
          .createSignedUrls(
            [
              `${baseURL}/${basespot.thumbnail}`,
              ...(basespot.base_images
                ? basespot?.base_images
                    .split(",")
                    .map((img) => `${baseURL}/${img}`)
                : []),
            ],
            60 * 60 * 24 * 365 * 10
          );
        if (error) {
          toast.error(error.message);
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
      <div className="lg:flex lg:items-center lg:justify-between">
        <div className="min-w-0 flex-1">Basespot</div>
        <div className="mt-5 flex space-x-2 lg:ml-4 lg:mt-0">
          <Link
            to={routes.editBasespot({ id: basespot.id.toString() })}
            className="rw-button rw-button-gray-outline hidden sm:block"
          >
            Edit
          </Link>

          <button
            type="button"
            className="rw-button rw-button-gray-outline hidden sm:block"
          >
            View
          </button>

          <button type="button" className="rw-button rw-button-green">
            Publish
          </button>
        </div>
      </div>

      <header
        className="font-montserrat group flex min-h-[200px] w-full flex-col justify-between rounded-lg bg-cover bg-center bg-no-repeat p-12 text-white ring-1 ring-zinc-500"
        style={{
          backgroundImage: `url(${
            images
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

      {images && images.filter((img) => !img.thumbnail).length > 0 && (
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
                onSlideChange={(index) => {
                  if (images[index]) {
                    setCurrentModalImage(images[index].url);
                  }
                }}
                slide={
                  images.findIndex((img) => img.url == currentModalImage) || 0
                }
              />
              <div className="grid grid-cols-5 flex-nowrap gap-4 overflow-hidden">
                {images
                  .filter((img) => !img.thumbnail)
                  .map((img, i) => (
                    <div
                      className="rounded-lg border border-zinc-500 transition-all ease-in hover:rounded-[50px]"
                      onClick={() => {
                        setCurrentModalImage(img.url);
                      }}
                    >
                      <img
                        className="aspect-auto w-full rounded-lg object-cover"
                        src={img.url}
                        alt=""
                      />
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </section>
      )}
    </article>
  );
};

export default Basespot;
