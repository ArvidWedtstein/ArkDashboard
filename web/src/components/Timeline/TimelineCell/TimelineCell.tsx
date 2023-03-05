import type { FindTimelineById } from "types/graphql";

import type { CellSuccessProps, CellFailureProps } from "@redwoodjs/web";

import Timeline from "src/components/Timeline/Timeline";

export const QUERY = gql`
  query FindTimelineById($id: String!) {
    timeline: timeline(id: $id) {
      id
      createdAt
      updatedAt
      createdBy
      # createdBy {
      #   username
      # }
    }
  }
`;

export const Loading = () => <div>Loading...</div>;

export const Empty = () => <div>Timeline not found</div>;

export const Failure = ({ error }: CellFailureProps) => (
  <div className="rw-cell-error">{error?.message}</div>
);

export const Success = ({ timeline }: CellSuccessProps<FindTimelineById>) => {
  return <Timeline timeline={timeline} />;
};
