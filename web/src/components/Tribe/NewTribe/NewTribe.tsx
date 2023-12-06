import { navigate, routes } from "@redwoodjs/router";
import { useMutation } from "@redwoodjs/web";
import { toast } from "@redwoodjs/web/toast";

import TribeForm from "src/components/Tribe/TribeForm";

import type { CreateTribeInput } from "types/graphql";

const CREATE_TRIBE_MUTATION = gql`
  mutation CreateTribeMutation($input: CreateTribeInput!) {
    createTribe(input: $input) {
      id
    }
  }
`;

const NewTribe = () => {
  const [createTribe, { loading, error }] = useMutation(CREATE_TRIBE_MUTATION, {
    onCompleted: () => {
      navigate(routes.tribes());
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onSave = (input: CreateTribeInput) => {
    toast.promise(createTribe({ variables: { input } }), {
      loading: "Creating new tribe...",
      success: "Tribe successfully created",
      error: <b>Failed to create new Tribe.</b>,
    });
  };

  return (
    <TribeForm onSave={onSave} loading={loading} error={error} />
  );
};

export default NewTribe;
