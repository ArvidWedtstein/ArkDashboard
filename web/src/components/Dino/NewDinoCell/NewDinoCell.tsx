import { navigate, routes } from "@redwoodjs/router";
import { CellFailureProps, CellSuccessProps, useMutation } from "@redwoodjs/web";
import { toast } from "@redwoodjs/web/toast";
import DinoForm from "../DinoForm/DinoForm";
import type { CreateDinoInput, NewDino } from "types/graphql";

export const QUERY = gql`
query NewDino {
  itemsByCategory(category: "Resource,Consumable,Armor") {
    items {
      id
      name
      description
      image
      color
      type
      category
    }
    count
  }
}
`;


const CREATE_DINO_MUTATION = gql`
  mutation CreateDinoMutation($input: CreateDinoInput!) {
    createDino(input: $input) {
      id
    }
  }
`;

export const Loading = () => (
  <div role="status" className="flex animate-pulse flex-col space-y-8">
    <div className="flex space-x-3">
      <div aria-label="Input" className="h-12 w-72 rounded bg-zinc-200 dark:bg-zinc-700" />
      <div aria-label="Input" className="h-12 w-72 rounded bg-zinc-200 dark:bg-zinc-700" />
    </div>
    <div className="flex space-x-3">
      <div aria-label="Input" className="h-12 w-72 rounded bg-zinc-200 dark:bg-zinc-700" />
      <div aria-label="Input" className="h-12 w-72 rounded bg-zinc-200 dark:bg-zinc-700" />
    </div>
    <div aria-label="Input" className="h-12 w-72 rounded bg-zinc-200 dark:bg-zinc-700" />
    <div aria-label="Input" className="h-12 w-72 rounded bg-zinc-200 dark:bg-zinc-700" />
    <div className="h-96 w-96 rounded-lg bg-zinc-200 dark:bg-zinc-700" />

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
  itemsByCategory
}: CellSuccessProps<NewDino>) => {
  const [createDino, { loading, error }] = useMutation(CREATE_DINO_MUTATION, {
    onCompleted: () => {
      toast.success("Dino created");
      navigate(routes.dinos());
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onSave = (input: CreateDinoInput) => {
    toast.promise(createDino({ variables: { input } }), {
      loading: "Creating new dino ...",
      success: "Dino successfully created",
      error: <b>Failed to create dino.</b>,
    });
  };

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">New Dino</h2>
      </header>
      <div className="rw-segment-main">
        <DinoForm onSave={onSave} loading={loading} error={error} itemsByCategory={itemsByCategory} />
      </div>
    </div>
  );
};
