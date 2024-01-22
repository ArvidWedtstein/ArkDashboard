import type { FindTimelineSeasons } from "types/graphql";

import { Link, routes } from "@redwoodjs/router";
import type { CellSuccessProps, CellFailureProps } from "@redwoodjs/web";

import TimelineSeasons from "src/components/TimelineSeason/TimelineSeasons";
import Skeleton from "src/components/Util/Skeleton/Skeleton";

export const QUERY = gql`
  query FindTimelineSeasons {
    timelineSeasons {
      id
      server
      season
      tribe_name
      season_start_date
      season_end_date
      cluster
    }
  }
`;

export const Loading = () => (
  <div role="status">
    <div className="flex justify-between mb-3">
      <Skeleton variant="text" className="text-4xl" width={"20%"} />
      <Skeleton variant="rounded" className="text-4xl" width={"10%"} />
    </div>

    <div className="mb-1 flex space-x-1">
      <Skeleton variant="rounded" width={"25%"} height={"2rem"} />
      <Skeleton variant="rounded" width={"2.5rem"} height={"2rem"} />
      <Skeleton variant="rounded" width={"2.5rem"} height={"2rem"} />
      <Skeleton variant="rounded" width={"4rem"} height={"2rem"} />
    </div>

    <Skeleton variant="rounded" animation="wave" width={"100%"} height={"12rem"} />
    <span className="sr-only">Loading...</span>
  </div>
);

export const Empty = () => {
  return (
    <div className="text-center text-black dark:text-white">
      {"No timelineSeasons yet. "}
      <Link to={routes.newTimelineSeason()} className="rw-link">
        {"Create one?"}
      </Link>
    </div>
  );
};

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

export const Success = ({
  timelineSeasons,
}: CellSuccessProps<FindTimelineSeasons>) => {
  return <TimelineSeasons timelineSeasons={timelineSeasons} />;
};
