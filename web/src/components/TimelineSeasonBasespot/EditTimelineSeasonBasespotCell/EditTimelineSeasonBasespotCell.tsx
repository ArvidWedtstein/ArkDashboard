import type {
  EditTimelineSeasonBasespotById,
  UpdateTimelineSeasonBasespotInput,
} from "types/graphql";

import { navigate, routes } from "@redwoodjs/router";
import type { CellSuccessProps, CellFailureProps } from "@redwoodjs/web";
import { useMutation } from "@redwoodjs/web";
import { toast } from "@redwoodjs/web/toast";

import TimelineSeasonBasespotForm from "src/components/TimelineSeasonBasespot/TimelineSeasonBasespotForm";

export const QUERY = gql`
  query EditTimelineSeasonBasespotById($id: BigInt!) {
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
      timeline_season_id
    }
  }
`;
const UPDATE_TIMELINE_SEASON_BASESPOT_MUTATION = gql`
  mutation UpdateTimelineSeasonBasespotMutation(
    $id: BigInt!
    $input: UpdateTimelineSeasonBasespotInput!
  ) {
    updateTimelineSeasonBasespot(id: $id, input: $input) {
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
      timeline_season_id
    }
  }
`;

export const Loading = () => <div>Loading...</div>;

export const Failure = ({ error }: CellFailureProps) => (
  <div className="rw-cell-error">{error?.message}</div>
);

export const Success = ({
  timelineSeasonBasespot,
}: CellSuccessProps<EditTimelineSeasonBasespotById>) => {
  const [updateTimelineSeasonBasespot, { loading, error }] = useMutation(
    UPDATE_TIMELINE_SEASON_BASESPOT_MUTATION,
    {
      onCompleted: () => {
        toast.success("TimelineSeasonBasespot updated");
        navigate(routes.timelineSeasonBasespots());
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }
  );

  const onSave = (
    input: UpdateTimelineSeasonBasespotInput,
    id: EditTimelineSeasonBasespotById["timelineSeasonBasespot"]["id"]
  ) => {
    updateTimelineSeasonBasespot({ variables: { id, input } });
  };

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">
          Edit TimelineSeasonBasespot {timelineSeasonBasespot?.id}
        </h2>
      </header>
      <div className="rw-segment-main">
        <TimelineSeasonBasespotForm
          timelineSeasonBasespot={timelineSeasonBasespot}
          onSave={onSave}
          error={error}
          loading={loading}
        />
      </div>
    </div>
  );
};
