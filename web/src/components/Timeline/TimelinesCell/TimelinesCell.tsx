import type { FindTimelines } from "types/graphql";

import { Link, routes } from "@redwoodjs/router";
import type { CellSuccessProps, CellFailureProps } from "@redwoodjs/web";

import Timelines from "src/components/Timeline/Timelines";

export const QUERY = gql`
  query FindTimelines {
    timelines {
      id
      createdAt
      updatedAt
      createdBy
      Profile {
        id
        full_name
      }
    }
  }
`;

export const Loading = () => {
  return (
    <div className="flex h-full w-full items-center justify-center ">
      <span className="inline-block h-16 w-16 animate-spin rounded-full border-t-4 border-r-2 border-black border-transparent dark:border-white"></span>
    </div>
  );
};

export const Empty = () => {
  return (
    <div className="rw-text-center">
      {"No timelines yet. "}
      <Link to={routes.newTimeline()} className="rw-link">
        {"Create one?"}
      </Link>
    </div>
  );
};

export const Failure = ({ error }: CellFailureProps) => (
  <div className="rw-cell-error">{error?.message}</div>
);

export const Success = ({ timelines }: CellSuccessProps<FindTimelines>) => {
  return <Timelines timelines={timelines} />;
};
