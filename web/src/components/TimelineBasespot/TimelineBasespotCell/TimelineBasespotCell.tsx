import type { FindTimelineBasespotById } from "types/graphql";

import type { CellSuccessProps, CellFailureProps } from "@redwoodjs/web";

import TimelineBasespot from "src/components/TimelineBasespot/TimelineBasespot";
import { supabase } from "src/App";

export const QUERY = gql`
  query FindTimelineBasespotById($id: BigInt!) {
    timelineBasespot: timelineBasespot(id: $id) {
      id
      created_at
      updated_at
      timeline_id
      startDate
      endDate
      basespot_id
      tribeName
      map
      server
      region
      season
      cluster
      location
      players
      created_by
      raided_by
      raidcomment
      Map {
        name
      }
      basespot {
        name
        latitude
        longitude
      }
      TimelineBasespotDino {
        name
        birth_date
        death_date
        death_cause
        level_wild
        level
        health
        stamina
        oxygen
        food
        weight
        melee_damage
        movement_speed
        torpor
        wild_health
        wild_stamina
        wild_oxygen
        wild_food
        wild_weight
        wild_melee_damage
        wild_movement_speed
        wild_torpor
        gender
        Dino {
          name
          base_stats
        }
      }
    }
  }
`;

export const afterQuery = (data) => {
  return data.timelineBasespot.basespot_id !== null
    ? {
        ...data,
        timelineBasespot: {
          ...data.timelineBasespot,
          location: {
            lat: data.timelineBasespot.basespot.latitude,
            lon: data.timelineBasespot.basespot.longitude,
          },
        },
      }
    : data;
};

export const Loading = () => <div>Loading...</div>;

export const Empty = () => <div>TimelineBasespot not found</div>;

export const Failure = ({ error }: CellFailureProps) => (
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

export const Success = ({
  timelineBasespot,
}: CellSuccessProps<FindTimelineBasespotById>) => {
  return <TimelineBasespot timelineBasespot={timelineBasespot} />;
};
