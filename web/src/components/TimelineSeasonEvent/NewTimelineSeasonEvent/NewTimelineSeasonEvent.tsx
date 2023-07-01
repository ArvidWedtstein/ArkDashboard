import { navigate, routes } from "@redwoodjs/router";
import { useMutation } from "@redwoodjs/web";
import { toast } from "@redwoodjs/web/toast";

import TimelineSeasonEventForm from "src/components/TimelineSeasonEvent/TimelineSeasonEventForm";

import type { CreateTimelineSeasonEventInput } from "types/graphql";
import { QUERY } from "../TimelineSeasonEventsCell";
import { ForwardedRef, forwardRef } from "react";

const CREATE_TIMELINE_SEASON_EVENT_MUTATION = gql`
  mutation CreateTimelineSeasonEventMutation(
    $input: CreateTimelineSeasonEventInput!
  ) {
    createTimelineSeasonEvent(input: $input) {
      id
    }
  }
`;

const NewTimelineSeasonEvent = ({
  timeline_season_id,
}: {
  timeline_season_id: string;
}) => {
  const [createTimelineSeasonEvent, { loading, error }] = useMutation(
    CREATE_TIMELINE_SEASON_EVENT_MUTATION,
    {
      onCompleted: () => {
        toast.success("TimelineSeasonEvent created");
      },
      onError: (error) => {
        toast.error(error.message);
      },
      refetchQueries: [{ query: QUERY, variables: { timeline_season_id } }],
    }
  );

  const onSave = (input: CreateTimelineSeasonEventInput) => {
    createTimelineSeasonEvent({ variables: { input } });
  };

  return (
    <div className="rw-segment">
      <TimelineSeasonEventForm
        onSave={onSave}
        loading={loading}
        error={error}
        timeline_season_id={timeline_season_id}
      />
    </div>
  );
};

export default NewTimelineSeasonEvent;
