import type { FindItemById } from "types/graphql";

import type { CellSuccessProps, CellFailureProps } from "@redwoodjs/web";

import Item from "src/components/Item/Item";

export const QUERY = gql`
  query FindItemById($id: BigInt!) {
    item: item(id: $id) {
      created_at
      id
      name
      description
      image
      max_stack
      weight
      engram_points
      stats
      color
      type
      category
      DinoStat {
        Dino {
          id
          name
          image
        }
        value
        rank
        type
      }
      MapResource {
        map_id
        latitude
        longitude
        type
      }
      ItemRecipe_ItemRecipe_crafted_item_idToItem {
        id
        crafted_item_id
        crafting_station_id
        yields
        Item_ItemRecipe_crafting_station_idToItem {
          id
          name
          image
        }
        ItemRecipeItem {
          id
          amount
          Item {
            id
            name
            image
          }
        }
      }
    }
  }
`;

export const Loading = () => (
  <article className="rw-segment flex flex-col gap-3 animate-pulse">
    <div className="grid w-full grid-cols-2 gap-3 text-gray-700 dark:text-white">
      <div className="col-span-2 grid w-full grid-flow-col gap-2 rounded-lg bg-zinc-200 dark:bg-zinc-700 p-4 h-52" />

      <div className="col-span-1 grid w-full grid-flow-col gap-2 rounded-lg bg-zinc-200 dark:bg-zinc-700 p-4 h-52" />
      <div className="col-span-1 grid w-full grid-flow-col gap-2 rounded-lg bg-zinc-200 dark:bg-zinc-700 p-4 h-52" />
    </div>
    <div className="grid w-full grid-cols-3 gap-3">
      <div className="col-span-1 grid w-full grid-flow-col gap-2 rounded-lg bg-zinc-200 dark:bg-zinc-700 p-4 h-80" />
      <div className="col-span-2 grid w-full grid-flow-col gap-2 rounded-lg  p-4 h-52" />
    </div>
  </article>
);

export const Empty = () => <div>Item not found</div>;

export const Failure = ({ error }: CellFailureProps) => (
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

export const Success = ({ item }: CellSuccessProps<FindItemById>) => {
  return <Item item={item} />;
};
