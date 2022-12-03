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

  return (
    <>
      {/* TODO: Maek better layout */}
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
