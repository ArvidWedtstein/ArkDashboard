import type { FindTimelineBasespots } from "types/graphql";

import { Link, routes } from "@redwoodjs/router";
import type { CellSuccessProps, CellFailureProps } from "@redwoodjs/web";

import TimelineBasespots from "src/components/TimelineBasespot/TimelineBasespots";

export const QUERY = gql`
  query FindTimelineBasespots {
    timelineBasespots {
      id
      created_at
      updated_at
      timeline_id
      start_date
      end_date
      tribe_name
      map
      server
      region
      season
      cluster
      Map {
        name
      }
    }
  }
`;

export const Loading = () => (
  <div
    role="status"
    className="w-full animate-pulse space-y-4 divide-y divide-gray-200 rounded border border-gray-200 p-4 shadow dark:divide-gray-700 dark:border-gray-700 md:p-6"
  >
    <div className="flex items-center justify-between">
      <div>
        <div className="mb-2.5 h-2.5 w-24 rounded-full bg-gray-300 dark:bg-gray-600"></div>
        <div className="h-2 w-32 rounded-full bg-gray-200 dark:bg-gray-700"></div>
      </div>
      <div className="h-2.5 w-12 rounded-full bg-gray-300 dark:bg-gray-700"></div>
    </div>
    <div className="flex items-center justify-between pt-4">
      <div>
        <div className="mb-2.5 h-2.5 w-24 rounded-full bg-gray-300 dark:bg-gray-600"></div>
        <div className="h-2 w-32 rounded-full bg-gray-200 dark:bg-gray-700"></div>
      </div>
      <div className="h-2.5 w-12 rounded-full bg-gray-300 dark:bg-gray-700"></div>
    </div>
    <div className="flex items-center justify-between pt-4">
      <div>
        <div className="mb-2.5 h-2.5 w-24 rounded-full bg-gray-300 dark:bg-gray-600"></div>
        <div className="h-2 w-32 rounded-full bg-gray-200 dark:bg-gray-700"></div>
      </div>
      <div className="h-2.5 w-12 rounded-full bg-gray-300 dark:bg-gray-700"></div>
    </div>
    <div className="flex items-center justify-between pt-4">
      <div>
        <div className="mb-2.5 h-2.5 w-24 rounded-full bg-gray-300 dark:bg-gray-600"></div>
        <div className="h-2 w-32 rounded-full bg-gray-200 dark:bg-gray-700"></div>
      </div>
      <div className="h-2.5 w-12 rounded-full bg-gray-300 dark:bg-gray-700"></div>
    </div>
    <div className="flex items-center justify-between pt-4">
      <div>
        <div className="mb-2.5 h-2.5 w-24 rounded-full bg-gray-300 dark:bg-gray-600"></div>
        <div className="h-2 w-32 rounded-full bg-gray-200 dark:bg-gray-700"></div>
      </div>
      <div className="h-2.5 w-12 rounded-full bg-gray-300 dark:bg-gray-700"></div>
    </div>
    <span className="sr-only">Loading...</span>
  </div>
);

export const Empty = () => {
  return (
    <div className="rw-text-center">
      {"No timelineBasespots yet. "}
      <Link to={routes.newTimelineBasespot()} className="rw-link">
        {"Create one?"}
      </Link>
    </div>
  );
};

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
  timelineBasespots,
}: CellSuccessProps<FindTimelineBasespots>) => {
  return <TimelineBasespots timelineBasespots={timelineBasespots} />;
};
