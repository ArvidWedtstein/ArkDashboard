import { Link, routes, navigate } from "@redwoodjs/router";
import { useMutation } from "@redwoodjs/web";
import { toast } from "@redwoodjs/web/toast";
import { useCallback, useContext, useEffect, useState } from "react";
import { useAuth } from "src/auth";
import Map from "src/components/Util/Map/Map";
import { ModalContext, Modal } from "src/components/Util/Modal/Modal";
import Slideshow from "src/components/Util/Slideshow/Slideshow";

import { timeTag } from "src/lib/formatters";

import type {
  DeleteBasespotMutationVariables,
  FindBasespotById,
} from "types/graphql";

const DELETE_BASESPOT_MUTATION = gql`
  mutation DeleteBasespotMutation($id: String!) {
    deleteBasespot(id: $id) {
      id
    }
  }
`;

interface Props {
  basespot: NonNullable<FindBasespotById["basespot"]>;
}

const Basespot = ({ basespot }: Props) => {
  const [images, setImages] = useState<{ url: string, error?: string, thumbnail: boolean }[]>(null);
  const [currentModalImage, setCurrentModalImage] = useState(null);
  const { openModal } = useContext(ModalContext);
  const { client: supabase } = useAuth();


  const getImage = useCallback(async () => {
    const baseURL = `M${basespot.map_id}-${basespot.id}`;
    try {
      if (basespot.thumbnail && !images && !basespot.thumbnail.startsWith("http")) {
        const { data, error } = await supabase.storage
          .from(`basespotimages`)
          .createSignedUrls([`${baseURL}/${basespot.thumbnail}`, ...(basespot.base_images ? basespot?.base_images.split(',').map((img) => `${baseURL}/${img}`) : [])], 60 * 60 * 24 * 365 * 10);
        if (error) {
          toast.error(error.message);
        }
        if (data) {
          setImages(data.map((d) => ({ url: d.signedUrl, error: d.error, thumbnail: d.path.includes(basespot.thumbnail) })));
        }
      }
    } catch (error) {
      toast.error(error.message);
    }
  }, [basespot.thumbnail]);

  useEffect(() => {
    getImage();
  }, [basespot.thumbnail]);

  const [deleteBasespot] = useMutation(DELETE_BASESPOT_MUTATION, {
    onCompleted: () => {
      toast.success("Basespot deleted");
      navigate(routes.basespots());
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onDeleteClick = (id: DeleteBasespotMutationVariables["id"]) => {
    if (confirm("Are you sure you want to delete basespot " + id + "?")) {
      deleteBasespot({ variables: { id } });
    }
  };

  return (
    <article className="text-gray-700 dark:text-stone-200">
      <Modal
        image={currentModalImage}
      />
      <header
        className="font-montserrat group flex min-h-[200px] w-full flex-col justify-between rounded-lg bg-cover bg-center bg-no-repeat p-12 text-white ring-1 ring-zinc-500 dark:ring-white"
        style={{
          backgroundImage: `url(${images ? images?.find((img) => img.thumbnail == true)?.url : "https://images.placeholders.dev/?width=1055&height=200&text=ArkDashboard&bgColor=%23f7f6f6&textColor=%236d6e71"})`,
        }}
      >
        <div className="flex justify-between pb-5">
          <Link
            to={routes.map({ id: basespot.map_id.toString() })}
            className="rw-link text-white transition ease-linear text-xl font-bold uppercase tracking-[0.4rem] opacity-90"
          >
            {basespot.Map.name}
          </Link>
          <div className="flex items-center text-sm group-hover:opacity-90 opacity-50 transition ease-linear">
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
          <h1 className="my-5 text-2xl md:text-5xl font-bold opacity-90">
            {basespot.name}
          </h1>
          <p className="w-full md:w-1/2 leading-7 opacity-75 group-hover:opacity-100 transition ease-linear select-none">
            {basespot.description}
          </p>
        </div>
      </header>


      <div className="flex flex-wrap py-12">
        <div className="w-full md:w-fit overflow-hidden rounded-lg lg:mb-0">
          <Map
            className="h-full w-full object-cover object-center"
            map_id={basespot.map_id}
            interactive={true}
            pos={[{ lat: basespot.latitude, lon: basespot.longitude }]}
            disable_map={true}
          />
        </div>
        <div className="w-full flex flex-col flex-wrap text-center lg:w-1/2 py-6 lg:pl-12 lg:text-left lg:flex-grow space-y-10">
          <div className="flex flex-col items-center lg:items-start space-y-3">
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
            <p className="text-base leading-relaxed flex-grow">
              This spot is located at <strong>{basespot.latitude}</strong> Lat,{" "}
              <strong>{basespot.longitude}</strong> Lon
            </p>
          </div>
          <div className="space-y-3 flex flex-col items-center lg:items-start">
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
            <p className="text-base leading-relaxed flex-grow">
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
              {/* <div>
                <img className="aspect-auto w-full rounded-lg border border-zinc-500 transition animate-fade-in" src={currentModalImage} alt="" />
              </div> */}
              <Slideshow slides={images.map((img) => ({ url: img.url }))} autoPlay={false} onSlideChange={(index) => {
                if (images[index]) {
                  setCurrentModalImage(images[index].url)

                }
              }} slide={images.findIndex((img) => img.url == currentModalImage) || 0} />
              <div className="grid grid-cols-5 flex-nowrap gap-4 overflow-hidden">
                {images.filter((img) => !img.thumbnail).map((img, i) => (
                  <div className="ease-in transition-all rounded-lg hover:rounded-[50px] border border-zinc-500" onClick={() => {
                    setCurrentModalImage(img.url);

                  }}>
                    <img className="aspect-auto object-cover w-full rounded-lg" src={img.url} alt="" />
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {images.filter((img) => !img.thumbnail).map((img, i) => (
                <div key={`basespot-image-${i}`} className="space-y-3 p-4 w-full flex h-full flex-col rounded-lg bg-zinc-200 dark:bg-zinc-600 border border-zinc-500">
                  <div className="inline-flex items-center space-x-3">
                    <div className="relative h-8 w-8 flex-shrink-0 rounded-full text-white ring-1 ring-pea-500">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 512 512"
                        strokeWidth={2}
                        className="p-1.5 w-full h-full fill-current"
                      >
                        <path d="M464 96h-88l-12.38-32.88C356.6 44.38 338.8 32 318.8 32h-125.5c-20 0-38 12.38-45 31.12L136 96H48C21.5 96 0 117.5 0 144v288C0 458.5 21.5 480 48 480h416c26.5 0 48-21.5 48-48v-288C512 117.5 490.5 96 464 96zM496 432c0 17.64-14.36 32-32 32h-416c-17.64 0-32-14.36-32-32v-288c0-17.64 14.36-32 32-32h99.11l16.12-43.28C167.9 56.33 179.9 48 193.3 48h125.5c13.25 0 25.26 8.326 29.9 20.76L364.9 112H464c17.64 0 32 14.36 32 32V432zM256 176C194.2 176 144 226.2 144 288c0 61.76 50.24 112 112 112s112-50.24 112-112C368 226.2 317.8 176 256 176zM256 384c-53 0-96-43-96-96s43-96 96-96s96 43 96 96S309 384 256 384z" />
                      </svg>
                    </div>
                    <h2 className="title-font text-lg font-medium text-gray-900 dark:text-neutral-200">
                      <span className="capitalize">{basespot.type}</span> Image No. {i}
                    </h2>
                  </div>
                  <p className="text-base leading-relaxed flex-grow">
                    'Insert caption here'
                  </p>
                  <img
                    className="rounded object-cover object-center hover:cursor-pointer"
                    loading="lazy"
                    src={
                      img.url
                    }
                    alt={basespot.name}
                    onClick={() => {
                      setCurrentModalImage(img.url);
                      openModal();
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </article>
  );
};

export default Basespot;
