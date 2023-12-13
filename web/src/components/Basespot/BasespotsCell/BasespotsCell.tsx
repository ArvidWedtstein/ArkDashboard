import type { FindNewBasespots } from "types/graphql";

import { routes } from "@redwoodjs/router";
import type { CellSuccessProps, CellFailureProps } from "@redwoodjs/web";

import Basespots from "src/components/Basespot/Basespots";
import Button from "src/components/Util/Button/Button";

export const QUERY = gql`
  query FindNewBasespots($cursorId: String, $take: Int, $skip: Int, $map: Int, $type: String) {
    basespotPagination(cursorId: $cursorId, take: $take, skip: $skip, map: $map, type: $type) {
      basespots {
        id
      name
      description
      latitude
      longitude
      thumbnail
      created_at
      updated_at
      map_id
      estimated_for_players
      type
      has_air
      Map {
        name
        icon
      }
      }
      has_more_basespots
      __typename
    }
  }
`

export const beforeQuery = ({ take, map, type }) => {
  take = take || 6
  map = parseInt(map) ? parseInt(map) : map
  return { variables: { take, map, type } };
};

export const Loading = () => {
  return (
    <div
      role="status"
      className="flex animate-pulse flex-col space-y-8 md:items-center"
    >
      <div className="flex h-48 w-full items-center justify-center rounded bg-zinc-300 dark:bg-zinc-700">
        <svg
          className="h-12 w-12 text-zinc-200"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          fill="currentColor"
          viewBox="0 0 640 512"
        >
          <path d="M480 80C480 35.82 515.8 0 560 0C604.2 0 640 35.82 640 80C640 124.2 604.2 160 560 160C515.8 160 480 124.2 480 80zM0 456.1C0 445.6 2.964 435.3 8.551 426.4L225.3 81.01C231.9 70.42 243.5 64 256 64C268.5 64 280.1 70.42 286.8 81.01L412.7 281.7L460.9 202.7C464.1 196.1 472.2 192 480 192C487.8 192 495 196.1 499.1 202.7L631.1 419.1C636.9 428.6 640 439.7 640 450.9C640 484.6 612.6 512 578.9 512H55.91C25.03 512 .0006 486.1 .0006 456.1L0 456.1z" />
        </svg>
      </div>
      <div className="w-full space-y-3">
        <div className="grid h-48 grid-cols-3 gap-3">
          <div className="flex h-48 w-full items-center justify-center rounded bg-zinc-300 dark:bg-zinc-700"></div>
          <div className="flex h-48 w-full items-center justify-center rounded bg-zinc-300 dark:bg-zinc-700"></div>
          <div className="flex h-48 w-full items-center justify-center rounded bg-zinc-300 dark:bg-zinc-700"></div>
          <div className="flex h-48 w-full items-center justify-center rounded bg-zinc-300 dark:bg-zinc-700"></div>
          <div className="flex h-48 w-full items-center justify-center rounded bg-zinc-300 dark:bg-zinc-700"></div>
          <div className="flex h-48 w-full items-center justify-center rounded bg-zinc-300 dark:bg-zinc-700"></div>
        </div>
      </div>
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export const Empty = () => {
  return (
    <div className="text-center text-black dark:text-white">
      {"No basespots yet. "}
      <Button
        variant="text"
        color="success"
        to={routes.newBasespot()}
        size="small"
      >Create one?</Button>
    </div>
  );
};

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
  basespotPagination
}: CellSuccessProps<FindNewBasespots>) => {
  return (
    <Basespots basespotPagination={basespotPagination} />
  );
};


