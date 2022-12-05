import { useAuth } from "@redwoodjs/auth";
import { Link, routes, navigate } from "@redwoodjs/router";
import { useMutation } from "@redwoodjs/web";
import { toast } from "@redwoodjs/web/toast";
import { useState } from "react";
import { Maps } from "src/components/Maps";

import { timeTag } from "src/lib/formatters";

import type {
  DeleteBasespotMutationVariables,
  FindBasespotById,
} from "types/graphql";

const DELETE_BASESPOT_MUTATION = gql`
  mutation DeleteBasespotMutation($id: Int!) {
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
        .from("basespotimages")
        .download(`thumbnails/${basespot.image}`);
      if (error) {
        throw error;
      }
      if (data) {
        const url = URL.createObjectURL(data);
        setBaseUrl(url);
      }
    }
  };
  getImage();
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

  // const scrollFunction = () => {
  //   let scrolled = window.scrollY;
  //   console.log(scrolled)
  // }
  // window.onscroll = function () {
  //   scrollFunction();
  // };
  return (
    <>
      {/* TODO: Maek better layout */}
      {/* TODO: Make map required not optional */}
      <section className="text-gray-700 body-font">
        <div className="container mx-auto flex px-5 py-12 md:flex-row flex-col items-center">
          <div className="lg:flex-grow md:w-1/2 lg:pr-24 md:pr-16 flex flex-col md:items-start md:text-left mb-16 md:mb-0 items-center text-center">
            <h1 className="title-font sm:text-4xl text-3xl mb-4 font-medium text-gray-900">{basespot.name}
              <br className="hidden lg:inline-block" />{basespot.Map.split(/(?=[A-Z])/).join(" ")}
            </h1>
            <p className="mb-8 leading-relaxed">{basespot.description}</p>
            <div className="flex justify-center">
              <Link to={routes.editBasespot({ id: basespot.id })} className="inline-flex text-gray-700 bg-gray-200 border-0 py-2 px-6 focus:outline-none hover:bg-gray-300 rounded text-lg">Edit</Link>
              <button onClick={() => onDeleteClick(basespot.id)} className="ml-4 inline-flex text-white bg-red-500 border-0 py-2 px-6 focus:outline-none hover:bg-red-600 rounded text-lg">Delete</button>
            </div>
          </div>
          <div className="lg:max-w-lg lg:w-full md:w-1/2 w-5/6">
            <img className="object-cover object-center rounded" src={
              baseUrl ||
              "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTvC4tJUjp6TudN0t7kMxrGll3AQDUOPCncWSSogN5lgA&s"
            }
              alt={basespot.name} />
          </div>
        </div>
      </section>
      <section className="text-gray-700 body-font border-t border-gray-200">
        <div className="container px-5 py-12 mx-auto flex flex-wrap">
          <div className="lg:w-1/2 w-full mb-10 lg:mb-0 rounded-lg overflow-hidden">
            <Maps
              className="object-cover object-center h-full w-full"
              map={basespot.Map}
              size={{ width: 500, height: 500 }}
              pos={{ lat: basespot.latitude, lon: basespot.longitude }}
            />
          </div>
          <div className="flex flex-col flex-wrap lg:py-6 -mb-10 lg:w-1/2 lg:pl-12 lg:text-left text-center">
            <div className="flex flex-col mb-10 lg:items-start items-center">
              <div className="w-12 h-12 inline-flex items-center justify-center rounded-full bg-indigo-100 text-indigo-500 mb-5">
                <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-6 h-6" viewBox="0 0 24 24">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                </svg>
              </div>
              <div className="flex-grow">
                <h2 className="text-gray-900 text-lg title-font font-medium mb-3">Coordinates</h2>
                <p className="leading-relaxed text-base">This spot is located at {basespot.latitude} Lat, {basespot.longitude} Lon</p>
              </div>
            </div>
            <div className="flex flex-col mb-10 lg:items-start items-center">
              <div className="w-12 h-12 inline-flex items-center justify-center rounded-full bg-indigo-100 text-indigo-500 mb-5">
                <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" className="w-6 h-6" viewBox="0 0 24 24">
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
              <div className="flex-grow">
                <h2 className="text-gray-900 text-lg title-font font-medium mb-3">Players</h2>
                <p className="leading-relaxed text-base">We think that this basespot does fit about {basespot.estimatedForPlayers} players</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Basespot;
