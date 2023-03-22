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
      TimelineBasespot {
        id
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
const timelines = [{
  "id": "76e83e7e-0e05-4c70-a3ab-3ec8a30d1c87", "createdAt": "2022-12-27T23:00:00+00:00", "TimelineBasespot": [{
    id: 1232
  }, {
    id: 1232
  }], "updatedAt": "2022-12-28T13:34:44.430151+00:00", "Profile": { id: '1232', full_name: "Arvid" }, "createdBy": "7a2878d1-4f61-456d-bcb6-edc707383ea8"
}]
export const Failure = ({ error }: CellFailureProps) => (
  // <div className="rw-cell-error">{error?.message}</div>
  <Timelines timelines={timelines} />
);

export const Success = ({ timelines }: CellSuccessProps<FindTimelines>) => {
  return <Timelines timelines={timelines} />;
};
