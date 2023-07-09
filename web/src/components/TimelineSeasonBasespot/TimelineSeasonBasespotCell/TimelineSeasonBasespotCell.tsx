import type { FindTimelineSeasonBasespotById } from "types/graphql";

import type { CellSuccessProps, CellFailureProps } from "@redwoodjs/web";

import TimelineSeasonBasespot from "src/components/TimelineSeasonBasespot/TimelineSeasonBasespot";

export const QUERY = gql`
  query FindTimelineSeasonBasespotById($id: BigInt!) {
    timelineSeasonBasespot: timelineSeasonBasespot(id: $id) {
      id
      created_at
      updated_at
      start_date
      end_date
      basespot_id
      map_id
      created_by
      latitude
      longitude
      Map {
        name
        img
      }
      TimelineSeason {
        tribe_name
        season
        server
        cluster
      }
      Basespot {
        id
        name
        latitude
        longitude
      }
    }
  }
`;

export const Loading = () => <div>Loading...</div>;

export const Empty = () => <div>TimelineSeasonBasespot not found</div>;

export const Failure = ({ error }: CellFailureProps) => (
  <div className="rw-cell-error">{error?.message}</div>
);

export const Success = ({
  timelineSeasonBasespot,
}: CellSuccessProps<FindTimelineSeasonBasespotById>) => {
  return (
    <TimelineSeasonBasespot timelineSeasonBasespot={timelineSeasonBasespot} />
  );
};
