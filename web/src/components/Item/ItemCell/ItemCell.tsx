import type { FindItemById } from "types/graphql";

import type { CellSuccessProps, CellFailureProps } from "@redwoodjs/web";

import Item from "src/components/Item/Item";

export const QUERY = gql`
  query FindItemById($id: BigInt!) {
    item: item(id: $id) {
      id
      created_at
      name
      description
      image
      max_stack
      weight
      engram_points
      crafting_time
      req_level
      yields
      recipe
      stats
      color
      crafted_in
      effects
      type
      DinoStat {
        Dino {
          id
          name
        }
        value
        rank
        type
      }
    }
  }
`;

export const Loading = () => <div>Loading...</div>;

export const Empty = () => <div>Item not found</div>;

export const Failure = ({ error }: CellFailureProps) => (
  <div className="rw-cell-error">{error?.message}</div>
);

export const Success = ({ item }: CellSuccessProps<FindItemById>) => {
  return <Item item={item} />;
};
