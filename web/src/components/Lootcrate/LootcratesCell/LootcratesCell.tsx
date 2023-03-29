import type { FindLootcrates } from "types/graphql";

import { Link, routes } from "@redwoodjs/router";
import type { CellSuccessProps, CellFailureProps } from "@redwoodjs/web";

import Lootcrates from "src/components/Lootcrate/Lootcrates";

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

export const Loading = () => <div>Loading...</div>;

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

export const Failure = ({ error }: CellFailureProps) => (
  <div className="rw-cell-error">{error?.message}</div>
);

export const Success = ({ lootcrates }: CellSuccessProps<FindLootcrates>) => {
  return <Lootcrates lootcrates={lootcrates} />;
};
