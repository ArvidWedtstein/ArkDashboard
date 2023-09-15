import type { FindBasespotById } from "types/graphql";

import type { CellSuccessProps, CellFailureProps } from "@redwoodjs/web";

import Basespot from "src/components/Basespot/Basespot";

export const QUERY = gql`
  query FindBasespotById($id: String!) {
    basespot: basespot(id: $id) {
      id
      name
      description
      latitude
      longitude
      thumbnail
      created_at
      map_id
      estimated_for_players
      created_by
      base_images
      type
      published
      Map {
        name
        img
        cord_shift_lat
        cord_shift_lon
        cord_mult_lat
        cord_mult_lon
      }
    }
  }
`;

export const Loading = () => (
  <div role="status" className="flex animate-pulse flex-col space-y-8">
    <div className="flex min-h-[200px] w-full flex-col rounded-lg border border-zinc-300 p-12 dark:border-zinc-700">
      <div className="flex justify-between">
        <div className="h-2.5 w-60 rounded-full bg-zinc-200 dark:bg-zinc-600" />
        <div className="h-2.5 w-48 rounded-full bg-zinc-200 dark:bg-zinc-600" />
      </div>
      <div className="mt-6 flex w-fit flex-col space-y-2.5 md:mt-12">
        <div className="h-5 w-48 rounded-full bg-zinc-200 dark:bg-zinc-600" />
        <div className="flex w-full items-center space-x-2">
          <div className="h-2.5 w-32 rounded-full bg-zinc-200 dark:bg-zinc-700" />
          <div className="h-2.5 w-24 rounded-full bg-zinc-300 dark:bg-zinc-600" />
          <div className="h-2.5 w-full rounded-full bg-zinc-300 dark:bg-zinc-600" />
        </div>
        <div className="flex w-full max-w-[480px] items-center space-x-2">
          <div className="h-2.5 w-full rounded-full bg-zinc-200 dark:bg-zinc-700" />
          <div className="h-2.5 w-full rounded-full bg-zinc-300 dark:bg-zinc-600" />
          <div className="h-2.5 w-24 rounded-full bg-zinc-300 dark:bg-zinc-600" />
        </div>
        <div className="flex w-full max-w-[400px] items-center space-x-2">
          <div className="h-2.5 w-full rounded-full bg-zinc-300 dark:bg-zinc-600" />
          <div className="h-2.5 w-80 rounded-full bg-zinc-200 dark:bg-zinc-700" />
          <div className="h-2.5 w-full rounded-full bg-zinc-300 dark:bg-zinc-600" />
        </div>
        <div className="flex w-full max-w-[480px] items-center space-x-2">
          <div className="h-2.5 w-full rounded-full bg-zinc-200 dark:bg-zinc-700" />
          <div className="h-2.5 w-full rounded-full bg-zinc-300 dark:bg-zinc-600" />
          <div className="h-2.5 w-24 rounded-full bg-zinc-300 dark:bg-zinc-600" />
        </div>
        <div className="flex w-full max-w-[440px] items-center space-x-2">
          <div className="h-2.5 w-32 rounded-full bg-zinc-300 dark:bg-zinc-600" />
          <div className="h-2.5 w-24 rounded-full bg-zinc-300 dark:bg-zinc-600" />
          <div className="h-2.5 w-full rounded-full bg-zinc-200 dark:bg-zinc-700" />
        </div>
        <div className="flex w-full max-w-[360px] items-center space-x-2">
          <div className="h-2.5 w-full rounded-full bg-zinc-300 dark:bg-zinc-600" />
          <div className="h-2.5 w-80 rounded-full bg-zinc-200 dark:bg-zinc-700" />
          <div className="h-2.5 w-full rounded-full bg-zinc-300 dark:bg-zinc-600" />
        </div>
      </div>
    </div>

    <div className="flex">
      <div className="aspect-square h-96 rounded-lg bg-zinc-200 dark:bg-zinc-600" />
      <div className="flex w-full flex-col flex-wrap py-6 text-center lg:w-1/2 lg:flex-grow lg:pl-12 lg:text-left">
        <div className="mb-10 flex flex-col items-center lg:items-start">
          <div className="mb-5 h-12 w-12 rounded-full bg-zinc-200 dark:bg-zinc-600" />
          <div className="flex-grow space-y-3">
            <div className="h-2.5 w-40 rounded-full bg-zinc-300 dark:bg-zinc-600" />
            <div className="h-2 w-60 rounded-full bg-zinc-300 dark:bg-zinc-600" />
          </div>
        </div>
        <div className="mb-10 flex flex-col items-center lg:items-start">
          <div className="mb-5 h-12 w-12 rounded-full bg-zinc-300 dark:bg-zinc-600" />
          <div className="flex-grow space-y-3">
            <div className="h-2.5 w-40 rounded-full bg-zinc-300 dark:bg-zinc-600" />
            <div className="h-2 w-60 rounded-full bg-zinc-300 dark:bg-zinc-600" />
          </div>
        </div>
      </div>
    </div>

    <hr className="bg-zinc-200 dark:bg-zinc-700" />

    <div className="flex flex-col items-center justify-center space-y-3 py-10">
      <div className="h-2.5 w-60 rounded-full bg-zinc-300 dark:bg-zinc-600" />
      <div className="h-5 w-80 rounded-full bg-zinc-300 dark:bg-zinc-600" />
      <div className="grid grid-cols-3 gap-3 py-24">
        <div className="aspect-square h-60 w-full rounded-lg bg-zinc-200 dark:bg-zinc-600" />
        <div className="aspect-square h-60 w-full rounded-lg bg-zinc-200 dark:bg-zinc-600" />
        <div className="aspect-square h-60 w-full rounded-lg bg-zinc-200 dark:bg-zinc-600" />
      </div>
    </div>
    <span className="sr-only">Loading...</span>
  </div>
);

export const Empty = () => <div>Basespot not found</div>;

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

export const Success = ({ basespot }: CellSuccessProps<FindBasespotById>) => {
  return <Basespot basespot={basespot} />;
};
