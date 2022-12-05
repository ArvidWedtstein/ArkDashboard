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
            <p className="mb-8 leading-relaxed">Copper mug try-hard pitchfork pour-over freegan heirloom neutra air plant cold-pressed tacos poke beard tote bag. Heirloom echo park mlkshk tote bag selvage hot chicken authentic tumeric truffaut hexagon try-hard chambray.</p>
            <div className="flex justify-center">
              <button className="inline-flex text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg">Button</button>
              <button className="ml-4 inline-flex text-gray-700 bg-gray-200 border-0 py-2 px-6 focus:outline-none hover:bg-gray-300 rounded text-lg">Button</button>
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
      <div className="grid auto-cols-auto grid-cols-2">
        <div className="">
          <img
            src={
              baseUrl ||
              "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTvC4tJUjp6TudN0t7kMxrGll3AQDUOPCncWSSogN5lgA&s"
            }
            alt={basespot.name}
            className="max-h-[300px] max-w-none"
          />
        </div>
        <div className="font-heading bg-slate-600 p-4 text-white ">
          <h1 className="relative text-2xl before:absolute before:-bottom-3 before:h-1 before:w-9 before:rounded before:bg-red-500 first-of-type:mt-5">
            {basespot.name}
          </h1>
          <p className="mt-5 text-base">{basespot.description}</p>

          <div className="mt-5">
            <span className="mr-2 rounded bg-black px-2.5 py-0.5 text-sm font-medium text-slate-200 dark:bg-slate-200 dark:text-black">
              Lat: {basespot.latitude}
            </span>
            <span className="mr-2 rounded bg-black px-2.5 py-0.5 text-sm font-medium text-slate-200 dark:bg-slate-200 dark:text-black">
              Lon: {basespot.longitude}
            </span>
          </div>
          <p className="mr-2 rounded bg-black px-2.5 py-0.5 text-sm font-medium text-slate-200 dark:bg-slate-200 dark:text-black">
            Estimated for {basespot.estimatedForPlayers} players
          </p>
        </div>
      </div>
      <Maps
        map={basespot.Map}
        size={{ width: 500, height: 500 }}
        pos={{ lat: basespot.latitude, lon: basespot.longitude }}
      />
      <nav className="rw-button-group">
        <Link
          to={routes.editBasespot({ id: basespot.id })}
          className="rw-button rw-button-blue"
        >
          Edit
        </Link>
        <button
          type="button"
          className="rw-button rw-button-red"
          onClick={() => onDeleteClick(basespot.id)}
        >
          Delete
        </button>
      </nav>
    </>
  );
};

export default Basespot;
