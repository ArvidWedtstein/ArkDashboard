import type { FindMapById } from "types/graphql";

import type { CellSuccessProps, CellFailureProps } from "@redwoodjs/web";

import Map from "src/components/Map/Map";

// TODO: fetch notes for other maps/submaps
export const QUERY = gql`
  query FindMapById($id: BigInt!) {
    map: map(id: $id) {
      id
      created_at
      name
      img
      release_date
      parent_map_id
      MapResource {
        item_id
        latitude
        longitude
        type
        Item {
          name,
          image
          color
        }
      }
      MapNote {
        latitude
        longitude
        note_index
      }
      # Lootcrate {
      #   id
      #   name
      #   level_requirement
      #   color
      # }
      other_Map {
        id
        name
        MapNote {
          latitude
          longitude
          note_index
        }
      }
    }
  }
`;


// TODO: fix skeleton loader
export const Loading = () => <div>Loading...</div>;

export const Empty = () => <div>Map not found</div>;

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

export const Success = ({ map }: CellSuccessProps<FindMapById>) => {
  return <Map map={map} />;
};
