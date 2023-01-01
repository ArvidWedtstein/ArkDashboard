import type { EditBasespotById, UpdateBasespotInput } from "types/graphql";

import { navigate, routes } from "@redwoodjs/router";
import type { CellSuccessProps, CellFailureProps } from "@redwoodjs/web";
import { useMutation } from "@redwoodjs/web";
import { toast } from "@redwoodjs/web/toast";

import BasespotForm from "src/components/Basespot/BasespotForm";

export const QUERY = gql`
  query EditBasespotById($id: Int!) {
    basespot: basespot(id: $id) {
      id
      name
      description
      latitude
      longitude
      image
      created_at
      Map
      estimatedForPlayers
    }
  }
`;
const UPDATE_BASESPOT_MUTATION = gql`
  mutation UpdateBasespotMutation($id: Int!, $input: UpdateBasespotInput!) {
    updateBasespot(id: $id, input: $input) {
      id
      name
      description
      latitude
      longitude
      image
      created_at
      Map
      estimatedForPlayers
    }
  }
`;

export const Loading = () => <div>Loading...</div>;

export const Failure = ({ error }: CellFailureProps) => (
  <div className="rw-cell-error">{error?.message}</div>
);

export const Success = ({ basespot }: CellSuccessProps<EditBasespotById>) => {
  const [updateBasespot, { loading, error }] = useMutation(
    UPDATE_BASESPOT_MUTATION,
    {
      onCompleted: () => {
        toast.success("Basespot updated");
        navigate(routes.basespots());
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }
  );

  const onSave = (
    input: UpdateBasespotInput,
    id: EditBasespotById["basespot"]["id"]
  ) => {
    updateBasespot({ variables: { id, input } });
  };

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">
          Edit Basespot {basespot?.id}
        </h2>
      </header>
      <div className="rw-segment-main">
        <BasespotForm
          basespot={basespot}
          onSave={onSave}
          error={error}
          loading={loading}
        />
      </div>
    </div>
  );
};
