import { Link, routes } from "@redwoodjs/router";
import { useMutation } from "@redwoodjs/web";
import { toast } from "@redwoodjs/web/toast";

import { QUERY } from "src/components/Dino/DinosCell";
import {
  checkboxInputTag,
  jsonTruncate,
  timeTag,
  truncate,
} from "src/lib/formatters";

import type { DeleteDinoMutationVariables, FindDinos } from "types/graphql";

const DELETE_DINO_MUTATION = gql`
  mutation DeleteDinoMutation($id: String!) {
    deleteDino(id: $id) {
      id
    }
  }
`;

const DinosList = ({ dinos }: FindDinos) => {
  const [deleteDino] = useMutation(DELETE_DINO_MUTATION, {
    onCompleted: () => {
      toast.success("Dino deleted");
    },
    onError: (error) => {
      toast.error(error.message);
    },
    // This refetches the query on the list page. Read more about other ways to
    // update the cache over here:
    // https://www.apollographql.com/docs/react/data/mutations/#making-all-other-cache-updates
    refetchQueries: [{ query: QUERY }],
    awaitRefetchQueries: true,
  });

  const onDeleteClick = (id: DeleteDinoMutationVariables["id"]) => {
    if (confirm("Are you sure you want to delete dino " + id + "?")) {
      deleteDino({ variables: { id } });
    }
  };

  return (
    <div className="m-4 flex">
      <div className="flex h-auto max-w-xs flex-col rounded-md bg-zinc-600 p-4 text-center text-white">
        <div className="mb-6 h-32 w-32 rounded-full border bg-gradient-to-br from-zinc-700 to-zinc-700">
          <img
            className="h-auto"
            src="https://www.dododex.com/media/creature/shadowmane.png"
          />
        </div>
        <p className="">Shadowmane</p>
      </div>
    </div>
  );
};

export default DinosList;
