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
      Map {
        name
        img
      }
    }
  }
`;

export const Loading = () => (
  <div role="status" className="space-y-8 animate-pulse flex flex-col">
    <div className="flex flex-col w-full rounded-lg p-12 min-h-[200px] border border-zinc-300 dark:border-zinc-700">
      <div className="flex justify-between">
        <div className="h-2.5 bg-zinc-200 rounded-full dark:bg-zinc-600 w-60" />
        <div className="h-2.5 bg-zinc-200 rounded-full dark:bg-zinc-600 w-48" />
      </div>
      <div className="mt-6 md:mt-12 flex flex-col space-y-2.5 w-fit">
        <div className="h-5 bg-zinc-200 rounded-full dark:bg-zinc-600 w-48" />
        <div className="flex items-center w-full space-x-2">
          <div className="h-2.5 bg-zinc-200 rounded-full dark:bg-zinc-700 w-32" />
          <div className="h-2.5 bg-zinc-300 rounded-full dark:bg-zinc-600 w-24" />
          <div className="h-2.5 bg-zinc-300 rounded-full dark:bg-zinc-600 w-full" />
        </div>
        <div className="flex items-center w-full space-x-2 max-w-[480px]">
          <div className="h-2.5 bg-zinc-200 rounded-full dark:bg-zinc-700 w-full" />
          <div className="h-2.5 bg-zinc-300 rounded-full dark:bg-zinc-600 w-full" />
          <div className="h-2.5 bg-zinc-300 rounded-full dark:bg-zinc-600 w-24" />
        </div>
        <div className="flex items-center w-full space-x-2 max-w-[400px]">
          <div className="h-2.5 bg-zinc-300 rounded-full dark:bg-zinc-600 w-full" />
          <div className="h-2.5 bg-zinc-200 rounded-full dark:bg-zinc-700 w-80" />
          <div className="h-2.5 bg-zinc-300 rounded-full dark:bg-zinc-600 w-full" />
        </div>
        <div className="flex items-center w-full space-x-2 max-w-[480px]">
          <div className="h-2.5 bg-zinc-200 rounded-full dark:bg-zinc-700 w-full" />
          <div className="h-2.5 bg-zinc-300 rounded-full dark:bg-zinc-600 w-full" />
          <div className="h-2.5 bg-zinc-300 rounded-full dark:bg-zinc-600 w-24" />
        </div>
        <div className="flex items-center w-full space-x-2 max-w-[440px]">
          <div className="h-2.5 bg-zinc-300 rounded-full dark:bg-zinc-600 w-32" />
          <div className="h-2.5 bg-zinc-300 rounded-full dark:bg-zinc-600 w-24" />
          <div className="h-2.5 bg-zinc-200 rounded-full dark:bg-zinc-700 w-full" />
        </div>
        <div className="flex items-center w-full space-x-2 max-w-[360px]">
          <div className="h-2.5 bg-zinc-300 rounded-full dark:bg-zinc-600 w-full" />
          <div className="h-2.5 bg-zinc-200 rounded-full dark:bg-zinc-700 w-80" />
          <div className="h-2.5 bg-zinc-300 rounded-full dark:bg-zinc-600 w-full" />
        </div>
      </div>
    </div>

    <div className="flex">
      <div className="h-96 aspect-square bg-zinc-200 rounded-lg dark:bg-zinc-600" />
      <div className="w-full flex flex-col flex-wrap text-center lg:w-1/2 py-6 lg:pl-12 lg:text-left lg:flex-grow">
        <div className="mb-10 flex flex-col items-center lg:items-start">
          <div className="bg-zinc-200 dark:bg-zinc-600 mb-5 h-12 w-12 rounded-full" />
          <div className="flex-grow space-y-3">
            <div className="h-2.5 bg-zinc-300 rounded-full dark:bg-zinc-600 w-40" />
            <div className="h-2 bg-zinc-300 rounded-full dark:bg-zinc-600 w-60" />
          </div>
        </div>
        <div className="mb-10 flex flex-col items-center lg:items-start">
          <div className="bg-zinc-300 dark:bg-zinc-600 mb-5 h-12 w-12 rounded-full" />
          <div className="flex-grow space-y-3">
            <div className="h-2.5 bg-zinc-300 rounded-full dark:bg-zinc-600 w-40" />
            <div className="h-2 bg-zinc-300 rounded-full dark:bg-zinc-600 w-60" />
          </div>
        </div>
      </div>
    </div>

    <hr className="bg-zinc-200 dark:bg-zinc-700" />

    <div className="flex flex-col justify-center items-center py-10 space-y-3">
      <div className="h-2.5 bg-zinc-300 rounded-full dark:bg-zinc-600 w-60" />
      <div className="h-5 bg-zinc-300 rounded-full dark:bg-zinc-600 w-80" />
      <div className="grid grid-cols-3 gap-3 py-24">
        <div className="w-full h-60 aspect-square bg-zinc-200 rounded-lg dark:bg-zinc-600" />
        <div className="w-full h-60 aspect-square bg-zinc-200 rounded-lg dark:bg-zinc-600" />
        <div className="w-full h-60 aspect-square bg-zinc-200 rounded-lg dark:bg-zinc-600" />
      </div>
    </div>
    <span className="sr-only">Loading...</span>
  </div>
)

export const Empty = () => <div>Basespot not found</div>;

export const Failure = ({ error }: CellFailureProps) => {
  return (
    <div className="rw-cell-error animate-fly-in flex items-center space-x-3">
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
