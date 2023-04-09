import type { FindLootcrates } from "types/graphql";

import { Link, routes } from "@redwoodjs/router";
import type { CellSuccessProps, CellFailureProps } from "@redwoodjs/web";

import Lootcrates from "src/components/Lootcrate/Lootcrates";
import { toast } from "@redwoodjs/web/dist/toast";

export const QUERY = gql`
  query FindLootcrates {
    lootcrates {
      id
      created_at
      updated_at
      blueprint
      name
      map
      level_requirement
      decay_time
      no_repeat_in_sets
      quality_multiplier
      set_qty
      color
      Map {
        name
      }
      LootcrateSet {
        id
        name
        weight
        can_repeat_items
        qty_scale
        LootcrateSetEntry {
          id
          name
          weight
          qty
          quality
          items
        }
      }
    }
  }
`;

// export const Loading = () => <div>Loading...</div>;
export const Loading = () => (
  <div className="m-4 flex items-center justify-center text-white">
    <p className="mr-4">LOADING</p>
    <div className="dot-revolution"></div>
  </div>
);

export const Empty = () => {
  return (
    <div className="rw-text-center">
      {"No lootcrates yet. "}
      <Link to={routes.newLootcrate()} className="rw-link">
        {"Create one?"}
      </Link>
    </div>
  );
};

export const Failure = ({ error, errorCode }: CellFailureProps) => (
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
      <p className="text-sm">
        {errorCode === "GRAPHQL_VALIDATION_FAILED"
          ? "Failed to fetch data"
          : error?.message}
      </p>
    </div>
  </div>
);

export const Success = ({ lootcrates }: CellSuccessProps<FindLootcrates>) => {
  return <Lootcrates lootcrates={lootcrates} />;
};
