import { useAuth } from "@redwoodjs/auth";
import { Link, routes, navigate } from "@redwoodjs/router";
import { useMutation } from "@redwoodjs/web";
import { toast } from "@redwoodjs/web/toast";
import { useEffect, useState } from "react";
import { Maps } from "src/components/Maps";

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
        .download(`${basespot.name.replaceAll(" ", "")}/${basespot.image}`);
      // .download(`thumbnails/${basespot.image}`);
      if (error) {
        console.log(error);
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
      <section className="body-font text-gray-700">
        <div className="container mx-auto flex flex-col items-center px-5 py-12 md:flex-row">
          <div className="mb-16 flex flex-col items-center text-center md:mb-0 md:w-1/2 md:items-start md:pr-16 md:text-left lg:flex-grow lg:pr-24">
            <h1 className="title-font mb-4 text-3xl font-medium text-gray-900 sm:text-4xl">
              {basespot.name}
              <br className="hidden lg:inline-block" />
              {basespot.Map.split(/(?=[A-Z])/).join(" ")}
            </h1>
            <p className="mb-8 leading-relaxed">{basespot.description}</p>
            <div className="flex justify-center">
              <Link
                to={routes.editBasespot({ id: basespot.id })}
                className="inline-flex rounded border-0 bg-gray-200 py-2 px-6 text-lg text-gray-700 hover:bg-gray-300 focus:outline-none"
              >
                Edit
              </Link>
              <button
                onClick={() => onDeleteClick(basespot.id)}
                className="ml-4 inline-flex rounded border-0 bg-red-500 py-2 px-6 text-lg text-white hover:bg-red-600 focus:outline-none"
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
      <section className="body-font border-t border-gray-200 text-gray-700">
        <div className="container mx-auto flex flex-wrap px-5 py-12">
          <div className="mb-10 w-full overflow-hidden rounded-lg lg:mb-0 lg:w-1/2">
            <Maps
              className="h-full w-full object-cover object-center"
              map={basespot.Map}
              size={{ width: 500, height: 500 }}
              pos={{ lat: basespot.latitude, lon: basespot.longitude }}
            />
          </div>
          <div className="-mb-10 flex flex-col flex-wrap text-center lg:w-1/2 lg:py-6 lg:pl-12 lg:text-left">
            <div className="mb-10 flex flex-col items-center lg:items-start">
              <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-indigo-500">
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
                <h2 className="title-font mb-3 text-lg font-medium text-gray-900">
                  Coordinates
                </h2>
                <p className="text-base leading-relaxed">
                  This spot is located at {basespot.latitude} Lat,{" "}
                  {basespot.longitude} Lon
                </p>
              </div>
            </div>
            <div className="mb-10 flex flex-col items-center lg:items-start">
              <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-indigo-500">
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
                <h2 className="title-font mb-3 text-lg font-medium text-gray-900">
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
      <section className="body-font border-t border-gray-200 text-gray-700">
        <div className="container mx-auto px-5 py-24">
          <div className="mb-20 flex w-full flex-col text-center">
            <h2 className="title-font mb-1 text-xs font-medium tracking-widest text-indigo-500">
              Basespot Defense Setup
            </h2>
            <h1 className="title-font text-2xl font-medium text-gray-900 sm:text-3xl">
              Basespot Setup
            </h1>
          </div>
          <div className="-m-4 flex flex-wrap">
            <div className="p-4 md:w-1/3">
              <div className="flex h-full flex-col rounded-lg bg-gray-100 p-8">
                <div className="mb-3 flex items-center">
                  <div className="mr-3 inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-indigo-500 text-white">
                    <svg
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                    >
                      <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                    </svg>
                  </div>
                  <h2 className="title-font text-lg font-medium text-gray-900">
                    Defense Nr.1
                  </h2>
                </div>
                <div className="flex-grow">
                  <p className="text-base leading-relaxed">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    Nulla, voluptatum?
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
              <div className="flex h-full flex-col rounded-lg bg-gray-100 p-8">
                <div className="mb-3 flex items-center">
                  <div className="mr-3 inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-indigo-500 text-white">
                    <svg
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                    >
                      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                  </div>
                  <h2 className="title-font text-lg font-medium text-gray-900">
                    Defense Nr.2
                  </h2>
                </div>
                <div className="flex-grow">
                  <p className="text-base leading-relaxed">
                    Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                    Ducimus, laborum.
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
              <div className="flex h-full flex-col rounded-lg bg-gray-100 p-8">
                <div className="mb-3 flex items-center">
                  <div className="mr-3 inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-indigo-500 text-white">
                    <svg
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                    >
                      <circle cx="6" cy="6" r="3"></circle>
                      <circle cx="6" cy="18" r="3"></circle>
                      <path d="M20 4L8.12 15.88M14.47 14.48L20 20M8.12 8.12L12 12"></path>
                    </svg>
                  </div>
                  <h2 className="title-font text-lg font-medium text-gray-900">
                    Defense Nr.3
                  </h2>
                </div>
                <div className="flex-grow">
                  <p className="text-base leading-relaxed">
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
