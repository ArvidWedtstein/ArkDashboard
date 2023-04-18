import { useAuth } from "@redwoodjs/auth";
import { Link, routes, navigate } from "@redwoodjs/router";
import { useMutation } from "@redwoodjs/web";
import { toast } from "@redwoodjs/web/toast";
import { useEffect, useState } from "react";
import { Map } from "src/components/Util/Map/Map";

import { timeTag } from "src/lib/formatters";

import type {
  DeleteBasespotMutationVariables,
  FindBasespotById,
} from "types/graphql";

const DELETE_BASESPOT_MUTATION = gql`
  mutation DeleteBasespotMutation($id: BigInt!) {
    deleteBasespot(id: $id) {
      id
    }
  }
`;

interface Props {
  basespot: NonNullable<FindBasespotById["basespot"]>;
}

const Basespot = ({ basespot }: Props) => {
  const [baseUrl, setBaseUrl] = useState(null);
  const { client: supabase } = useAuth();

  const getImage = async () => {
    if (basespot.image && !baseUrl && !basespot.image.startsWith("http")) {
      const { data, error } = await supabase.storage
        .from(`basespotimages`)
        .download(`${basespot.id}/${basespot.image}`);
      // .download(`thumbnails/${basespot.image}`);
      if (error) {
        throw error;
      }
      if (data) {
        const url = URL.createObjectURL(data);
        setBaseUrl(url);
      }
    }
  };

  useEffect(() => {
    getImage();
  }, [basespot.image]);

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
    <>
      <section className="body-font text-gray-700 dark:text-stone-200">
        <div className="container mx-auto flex flex-col items-center px-5 py-12 md:flex-row">
          <div className="mb-16 flex flex-col items-center text-center md:mb-0 md:w-1/2 md:items-start md:pr-16 md:text-left lg:flex-grow lg:pr-24">
            <h1 className="title-font mb-4 text-3xl font-medium text-gray-900 dark:text-stone-400 sm:text-4xl">
              {basespot.name}
              <br className="hidden lg:inline-block" />
              {basespot.map && (<Link
                to={routes.map({ id: basespot.map.toString() })}
                className=""
              >
                {basespot.Map_Basespot_MapToMap.name}
              </Link>)}
            </h1>
            <p className="mb-8 leading-relaxed">{basespot.description}</p>
            <div className="flex justify-center space-x-2">
              <Link
                to={routes.editBasespot({ id: basespot.id.toString() })}
                className="rw-button rw-button-gray-outline"
              >
                Edit
              </Link>
              <button
                onClick={() => onDeleteClick(basespot.id)}
                className="rw-button rw-button-red-outline"
              >
                Delete
              </button>
            </div>
          </div>
          <div className="w-5/6 md:w-1/2 lg:w-full lg:max-w-lg">
            <img
              className="rounded object-cover object-center"
              src={
                baseUrl ||
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTvC4tJUjp6TudN0t7kMxrGll3AQDUOPCncWSSogN5lgA&s"
              }
              alt={basespot.name}
            />
          </div>
        </div>
      </section>
      <section className="body-font border-t border-stone-200 text-gray-700 dark:border-gray-200 dark:text-stone-200">
        <div className="container mx-auto flex flex-wrap px-5 py-12">
          <div className="mb-10 w-full overflow-hidden rounded-lg lg:mb-0 lg:w-1/2">
            <Map
              className="h-full w-full object-cover object-center"
              map={basespot.map.toString()}
              size={{ width: 500, height: 500 }}
              pos={[{ lat: basespot.latitude, lon: basespot.longitude }]}
            />
          </div>
          <div className="-mb-10 flex flex-col flex-wrap text-center lg:w-1/2 lg:py-6 lg:pl-12 lg:text-left">
            <div className="mb-10 flex flex-col items-center lg:items-start">
              <div className="bg-pea-50 text-pea-500 mb-5 inline-flex h-12 w-12 items-center justify-center rounded-full">
                <svg
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-6 w-6"
                  viewBox="0 0 24 24"
                >
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                </svg>
              </div>
              <div className="flex-grow">
                <h2 className="title-font mb-3 text-lg font-medium text-gray-900 dark:text-stone-200">
                  Coordinates
                </h2>
                <p className="text-base leading-relaxed">
                  This spot is located at {basespot.latitude} Lat,{" "}
                  {basespot.longitude} Lon
                </p>
              </div>
            </div>
            <div className="mb-10 flex flex-col items-center lg:items-start">
              <div className=" bg-pea-50 text-pea-500 mb-5 inline-flex h-12 w-12 items-center justify-center rounded-full">
                <svg
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-6 w-6"
                  viewBox="0 0 24 24"
                >
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
              <div className="flex-grow">
                <h2 className="title-font mb-3 text-lg font-medium text-gray-900 dark:text-stone-200">
                  Players
                </h2>
                <p className="text-base leading-relaxed">
                  We think that this basespot does fit about{" "}
                  {basespot.estimatedForPlayers} players
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="body-font border-t border-stone-200 text-gray-700 dark:border-gray-200 dark:text-stone-200">
        <div className="container mx-auto px-5 py-24">
          <div className="mb-20 flex w-full flex-col text-center">
            <h2 className="title-font text-pea-500 mb-1 text-xs font-medium tracking-widest">
              Basespot Defense Setup
            </h2>
            <h1 className="title-font text-2xl font-medium text-gray-900 dark:text-stone-200 sm:text-3xl">
              Basespot Setup
            </h1>
          </div>
          <div className="-m-4 flex flex-wrap">
            <div className="p-4 md:w-1/3">
              <div className="flex h-full flex-col rounded-lg bg-gray-100 dark:bg-gray-600">
                <div className="m-3 flex items-center">
                  <div className="bg-pea-500 mr-3 inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-white">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 512 512"
                      strokeWidth={2}
                      className="m-1 h-5 w-5 fill-current"
                    >
                      <path d="M464 96h-88l-12.38-32.88C356.6 44.38 338.8 32 318.8 32h-125.5c-20 0-38 12.38-45 31.12L136 96H48C21.5 96 0 117.5 0 144v288C0 458.5 21.5 480 48 480h416c26.5 0 48-21.5 48-48v-288C512 117.5 490.5 96 464 96zM496 432c0 17.64-14.36 32-32 32h-416c-17.64 0-32-14.36-32-32v-288c0-17.64 14.36-32 32-32h99.11l16.12-43.28C167.9 56.33 179.9 48 193.3 48h125.5c13.25 0 25.26 8.326 29.9 20.76L364.9 112H464c17.64 0 32 14.36 32 32V432zM256 176C194.2 176 144 226.2 144 288c0 61.76 50.24 112 112 112s112-50.24 112-112C368 226.2 317.8 176 256 176zM256 384c-53 0-96-43-96-96s43-96 96-96s96 43 96 96S309 384 256 384z" />
                    </svg>
                  </div>
                  <h2 className="title-font text-lg font-medium text-gray-900 dark:text-neutral-200">
                    Defense Nr.1
                  </h2>
                </div>
                <div className="flex-grow">
                  <p className="my-2 px-4 text-base leading-relaxed">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Impedit, vel.
                  </p>
                  <img
                    className="rounded object-cover object-center"
                    src={
                      baseUrl ||
                      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTvC4tJUjp6TudN0t7kMxrGll3AQDUOPCncWSSogN5lgA&s"
                    }
                    alt={basespot.name}
                  />
                </div>
              </div>
            </div>
            <div className="p-4 md:w-1/3">
              <div className="flex h-full flex-col rounded-lg bg-gray-100 dark:bg-gray-600">
                <div className="m-3 flex items-center">
                  <div className="bg-pea-500 mr-3 inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-white">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 512 512"
                      strokeWidth={2}
                      className="m-1 h-5 w-5 fill-current"
                    >
                      <path d="M464 96h-88l-12.38-32.88C356.6 44.38 338.8 32 318.8 32h-125.5c-20 0-38 12.38-45 31.12L136 96H48C21.5 96 0 117.5 0 144v288C0 458.5 21.5 480 48 480h416c26.5 0 48-21.5 48-48v-288C512 117.5 490.5 96 464 96zM496 432c0 17.64-14.36 32-32 32h-416c-17.64 0-32-14.36-32-32v-288c0-17.64 14.36-32 32-32h99.11l16.12-43.28C167.9 56.33 179.9 48 193.3 48h125.5c13.25 0 25.26 8.326 29.9 20.76L364.9 112H464c17.64 0 32 14.36 32 32V432zM256 176C194.2 176 144 226.2 144 288c0 61.76 50.24 112 112 112s112-50.24 112-112C368 226.2 317.8 176 256 176zM256 384c-53 0-96-43-96-96s43-96 96-96s96 43 96 96S309 384 256 384z" />
                    </svg>
                  </div>
                  <h2 className="title-font text-lg font-medium text-gray-900 dark:text-neutral-200">
                    Defense Nr.2
                  </h2>
                </div>
                <div className="flex-grow">
                  <p className="my-2 px-4 text-base leading-relaxed">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Impedit, vel.
                  </p>
                  <img
                    className="rounded object-cover object-center"
                    src={
                      baseUrl ||
                      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTvC4tJUjp6TudN0t7kMxrGll3AQDUOPCncWSSogN5lgA&s"
                    }
                    alt={basespot.name}
                  />
                </div>
              </div>
            </div>
            <div className="p-4 md:w-1/3">
              <div className="flex h-full flex-col rounded-lg bg-gray-100 dark:bg-gray-600">
                <div className="m-3 flex items-center">
                  <div className="bg-pea-500 mr-3 inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-white">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 512 512"
                      strokeWidth={2}
                      className="m-1 h-5 w-5 fill-current"
                    >
                      <path d="M464 96h-88l-12.38-32.88C356.6 44.38 338.8 32 318.8 32h-125.5c-20 0-38 12.38-45 31.12L136 96H48C21.5 96 0 117.5 0 144v288C0 458.5 21.5 480 48 480h416c26.5 0 48-21.5 48-48v-288C512 117.5 490.5 96 464 96zM496 432c0 17.64-14.36 32-32 32h-416c-17.64 0-32-14.36-32-32v-288c0-17.64 14.36-32 32-32h99.11l16.12-43.28C167.9 56.33 179.9 48 193.3 48h125.5c13.25 0 25.26 8.326 29.9 20.76L364.9 112H464c17.64 0 32 14.36 32 32V432zM256 176C194.2 176 144 226.2 144 288c0 61.76 50.24 112 112 112s112-50.24 112-112C368 226.2 317.8 176 256 176zM256 384c-53 0-96-43-96-96s43-96 96-96s96 43 96 96S309 384 256 384z" />
                    </svg>
                  </div>
                  <h2 className="title-font text-lg font-medium text-gray-900 dark:text-neutral-200">
                    Defense Nr.3
                  </h2>
                </div>
                <div className="flex-grow">
                  <p className="my-2 px-4 text-base leading-relaxed">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Impedit, vel.
                  </p>
                  <img
                    className="rounded object-cover object-center"
                    src={
                      baseUrl ||
                      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTvC4tJUjp6TudN0t7kMxrGll3AQDUOPCncWSSogN5lgA&s"
                    }
                    alt={basespot.name}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Basespot;
