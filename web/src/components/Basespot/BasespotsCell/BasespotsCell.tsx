import type { FindNewBasespots } from "types/graphql";

import { routes } from "@redwoodjs/router";
import type { CellSuccessProps, CellFailureProps } from "@redwoodjs/web";

import Basespots from "src/components/Basespot/Basespots";
import Button from "src/components/Util/Button/Button";
import Skeleton from "src/components/Util/Skeleton/Skeleton";

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
    },
    maps {
      id
      name
      icon
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
      className="relative flex animate-puls flex-col space-y-8"
    >
      <Skeleton height={"7rem"} width={"100%"} variant="rounded" />
      <div className="flex space-x-1 w-full justify-start">
        <Skeleton height={"3rem"} width={"10%"} variant="rounded" />
        <Skeleton height={"3rem"} width={"15%"} variant="rounded" />
        <Skeleton height={"3rem"} width={"15%"} variant="rounded" />
        <Skeleton height={"3rem"} width={"20%"} variant="rounded" />
        <div className="!ml-auto inline-flex space-x-1">
          <Skeleton height={"3rem"} width={"3rem"} variant="rounded" />
          <Skeleton height={"3rem"} width={"3rem"} variant="rounded" />
        </div>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
        <Skeleton variant="rounded" animation="wave" width={"100%"} height={"24rem"} />
        <Skeleton variant="rounded" animation="wave" width={"100%"} height={"24rem"} />
        <Skeleton variant="rounded" animation="wave" width={"100%"} height={"24rem"} />
        <Skeleton variant="rounded" animation="wave" width={"100%"} height={"24rem"} />
        <Skeleton variant="rounded" animation="wave" width={"100%"} height={"24rem"} />
        <Skeleton variant="rounded" animation="wave" width={"100%"} height={"24rem"} />
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
  basespotPagination,
  maps
}: CellSuccessProps<FindNewBasespots>) => {
  return (
    <Basespots basespotPagination={basespotPagination} maps={maps} />
  );
};


