import type { FindTimelineBasespotById } from "types/graphql";

import type { CellSuccessProps, CellFailureProps } from "@redwoodjs/web";

import TimelineBasespot from "src/components/TimelineBasespot/TimelineBasespot";

export const QUERY = gql`
  query FindTimelineBasespotById($id: BigInt!) {
    timelineBasespot: timelineBasespot(id: $id) {
      id
      timeline_id
      start_date
      end_date
      tribe_name
      map
      server
      region
      season
      cluster
      latitude
      longitude
      Map {
        name
      }
      basespot {
        id
        name
        latitude
        longitude
      }
      TimelineBasespotRaid {
        id
        tribe_name
        base_survived
        raid_comment
        raid_start
        raid_end
      }
      TimelineBasespotPerson {
        user_id
        ingame_name
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
        wild_health
        wild_stamina
        wild_oxygen
        wild_food
        wild_weight
        wild_melee_damage
        wild_movement_speed
        gender
        Dino {
          name
          base_stats
          icon
        }
      }
    }
  }
`;

export const Loading = () => (
  <div
    role="status"
    className="flex w-full animate-pulse flex-col items-center rounded border border-gray-200 p-6 shadow dark:border-gray-700 md:flex-row md:p-8"
  >
    <div className="mb-16 flex flex-col items-center text-center md:mb-0 md:w-1/2 md:items-start md:pr-16 md:text-left lg:flex-grow lg:pr-24">
      <div className="mb-2 h-3 w-full rounded-full bg-gray-200 dark:bg-gray-700"></div>
      <div className="mb-4 h-3 w-48 rounded-full bg-gray-200 dark:bg-gray-700"></div>
      <div className="mb-4 h-2.5 w-full rounded-full bg-gray-200 dark:bg-gray-700"></div>
      <div className="flex w-full justify-center space-x-2">
        <div className="h-2.5 w-full rounded-full bg-gray-200 dark:bg-gray-600"></div>
        <div className="h-2.5 w-full rounded-full bg-gray-200 dark:bg-gray-600"></div>
        <div className="h-2.5 w-full rounded-full bg-gray-200 dark:bg-gray-600"></div>
        <div className="h-2.5 w-full rounded-full bg-gray-200 dark:bg-gray-600"></div>
      </div>
    </div>
    <div className="flex h-48 w-5/6 items-center justify-center rounded bg-gray-300 dark:bg-gray-700 md:w-1/2 lg:w-full lg:max-w-lg">
      <svg
        className="h-12 w-12 text-gray-200 dark:text-gray-600"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        fill="currentColor"
        viewBox="0 0 640 512"
      >
        <path d="M480 80C480 35.82 515.8 0 560 0C604.2 0 640 35.82 640 80C640 124.2 604.2 160 560 160C515.8 160 480 124.2 480 80zM0 456.1C0 445.6 2.964 435.3 8.551 426.4L225.3 81.01C231.9 70.42 243.5 64 256 64C268.5 64 280.1 70.42 286.8 81.01L412.7 281.7L460.9 202.7C464.1 196.1 472.2 192 480 192C487.8 192 495 196.1 499.1 202.7L631.1 419.1C636.9 428.6 640 439.7 640 450.9C640 484.6 612.6 512 578.9 512H55.91C25.03 512 .0006 486.1 .0006 456.1L0 456.1z" />
      </svg>
    </div>
    <span className="sr-only">Loading...</span>
  </div>
);

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
