import { navigate, routes } from "@redwoodjs/router";
import { useMutation } from "@redwoodjs/web";
import { toast } from "@redwoodjs/web/toast";

import DinoForm from "src/components/Dino/DinoForm";

import type { CreateDinoInput, CreateDinoStatInput } from "types/graphql";

const CREATE_DINO_MUTATION = gql`
  mutation CreateDinoMutation($input: CreateDinoInput!) {
    createDino(input: $input) {
      id
    }
  }
`;

const NewDino = () => {
  const [createDino, { loading, error }] = useMutation(CREATE_DINO_MUTATION, {
    onCompleted: () => {
      toast.success("Dino created");
      navigate(routes.dinos());
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onSave = (input: CreateDinoInput & CreateDinoStatInput) => {
    createDino({ variables: { input } });
  };

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">New Dino</h2>
      </header>
      <div className="rw-segment-main">
        <DinoForm onSave={onSave} loading={loading} error={error} />
      </div>
    </div>
  );
};

export default NewDino;
