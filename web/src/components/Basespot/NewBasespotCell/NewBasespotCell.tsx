import type {
  EditBasespotById,
  UpdateBasespotInput,
  CreateBasespotInput,
  NewBasespot,
} from "types/graphql";

import { navigate, routes } from "@redwoodjs/router";
import type { CellSuccessProps, CellFailureProps } from "@redwoodjs/web";
import { useMutation } from "@redwoodjs/web";
import { toast } from "@redwoodjs/web/toast";

import BasespotForm from "src/components/Basespot/BasespotForm";

export const QUERY = gql`
  query NewBasespot {
    maps {
      id
      name
      icon
      img
    }
    basespotTypes {
      id
      name
      type
    }
  }
`;

const CREATE_BASESPOT_MUTATION = gql`
  mutation CreateBasespotMutation($input: CreateBasespotInput!) {
    createBasespot(input: $input) {
      id
    }
  }
`;

export const Loading = () => (
  <div role="status" className="flex animate-pulse flex-col space-y-8">
    <div className="h-5 w-60 rounded-full bg-zinc-200 dark:bg-zinc-700" />
    <div className="flex flex-col gap-y-5">
      <div className="flex w-full flex-col gap-x-3 space-y-2">
        <div className="h-2.5 w-24 rounded-full bg-zinc-200 dark:bg-zinc-700" />
        <div className="h-12 w-72 rounded-lg bg-zinc-200 dark:bg-zinc-700" />
      </div>
      <div className="flex w-full flex-col gap-x-3 space-y-2">
        <div className="h-2.5 w-24 rounded-full bg-zinc-200 dark:bg-zinc-700" />
        <div className="h-20 w-full rounded-lg bg-zinc-200 dark:bg-zinc-700" />
      </div>
      <div className="flex w-full flex-col gap-x-3 space-y-2">
        <div className="h-2.5 w-24 rounded-full bg-zinc-200 dark:bg-zinc-700" />
        <div className="h-12 w-72 rounded-lg bg-zinc-200 dark:bg-zinc-700" />
      </div>
      <div className="h-96 w-96 rounded-lg bg-zinc-200 dark:bg-zinc-700" />
    </div>
    <span className="sr-only">Loading...</span>
  </div>
);

export const Failure = ({ error }: CellFailureProps) => {
  return (
    <div className="rw-cell-error flex items-center space-x-3">
      <svg
        className="h-12 w-12 fill-current"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 512 512"
      >
        <path d="M256 304c4.406 0 8-3.578 8-8v-176c0-4.422-3.594-8-8-8S248 115.6 248 120v176C248 300.4 251.6 304 256 304zM256 352c-8.836 0-16 7.164-16 16S247.2 384 256 384s16-7.164 16-16S264.8 352 256 352zM256 0C114.6 0 0 114.6 0 256s114.6 256 256 256s256-114.6 256-256S397.4 0 256 0zM256 496c-132.3 0-240-107.7-240-240S123.7 16 256 16s240 107.7 240 240S388.3 496 256 496z" />
      </svg>
      <div className="flex flex-col">
        <p className="text-lg font-bold leading-snug">
          Some unexpected shit happend
        </p>
        <p className="text-sm">{error?.message}</p>
      </div>
    </div>
  );
};

export const Success = ({
  basespotTypes,
  maps,
}: CellSuccessProps<NewBasespot>) => {
  const [createBasespot, { loading, error }] = useMutation(
    CREATE_BASESPOT_MUTATION,
    {
      onCompleted: (data) => {
        navigate(routes.basespots());
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }
  );

  const onSave = (input: CreateBasespotInput) => {
    // TODO: Get images here somehow
    toast.promise(createBasespot({ variables: { input } }), {
      loading: "Creating new basespot...",
      success: "Basespot successfully created",
      error: <b>Failed to create new basespot.</b>,
    });
  };
  console.log(basespotTypes)
  return (
    <div className="rw-segment">
      <div className="rw-segment-main">
        <BasespotForm
          onSave={onSave}
          loading={loading}
          error={error}
          basespotTypes={basespotTypes}
          maps={maps}
        />
      </div>
    </div>
  );
};
