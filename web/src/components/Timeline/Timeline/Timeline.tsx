import { routes, navigate } from "@redwoodjs/router";
import { useMutation } from "@redwoodjs/web";
import { toast } from "@redwoodjs/web/toast";


import type {
  DeleteTimelineMutationVariables,
  FindTimelineById,
} from "types/graphql";

const DELETE_TIMELINE_MUTATION = gql`
  mutation DeleteTimelineMutation($id: String!) {
    deleteTimeline(id: $id) {
      id
    }
  }
`;

interface Props {
  timeline: NonNullable<FindTimelineById["timeline"]>;
}

const Timeline = ({ timeline }: Props) => {

  const [deleteTimeline] = useMutation(DELETE_TIMELINE_MUTATION, {
    onCompleted: () => {
      toast.success("Timeline deleted");
      navigate(routes.timelines());
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onDeleteClick = (id: DeleteTimelineMutationVariables["id"]) => {
    if (confirm("Are you sure you want to delete timeline " + id + "?")) {
      deleteTimeline({ variables: { id } });
    }
  };

  return (
    <>

    </>
  );
};

export default Timeline;
