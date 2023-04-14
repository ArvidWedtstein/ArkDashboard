import type { FindBasespotById } from "types/graphql";

import type { CellSuccessProps, CellFailureProps } from "@redwoodjs/web";

import Basespot from "src/components/Basespot/Basespot";

export const QUERY = gql`
  query FindBasespotById($id: BigInt!) {
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
      defenseImages
      created_by
      turretsetup_image
      updated_at
      Map_Basespot_MapToMap {
        name
      }
    }
  }
`;

export const Loading = () => <div>Loading...</div>;

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
