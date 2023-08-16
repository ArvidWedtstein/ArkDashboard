import type {
  NewTimelineSeasonEvent,
} from 'types/graphql'

import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'
import { useMutation } from '@redwoodjs/web'
import { toast } from "@redwoodjs/web/toast";

import type { CreateTimelineSeasonEventInput } from "types/graphql";
import { QUERY as eventsquery } from "../TimelineSeasonEventsCell";

import TimelineSeasonEventForm from 'src/components/TimelineSeasonEvent/TimelineSeasonEventForm'

export const QUERY = gql`
  query NewTimelineSeasonEvent {
    maps {
      id
      name
      icon
    }
  }
`



const CREATE_TIMELINE_SEASON_EVENT_MUTATION = gql`
  mutation CreateTimelineSeasonEventMutation(
    $input: CreateTimelineSeasonEventInput!
  ) {
    createTimelineSeasonEvent(input: $input) {
      id
    }
  }
`;

// TODO: fix skeleton loader
export const Loading = () => <div>Loading...</div>

export const Failure = ({ error }: CellFailureProps) => (
  <div className="rw-cell-error">{error?.message}</div>
)
export const beforeQuery = (props: { timeline_season_id: string }) => {
  return { variables: props };
}

export const Success = ({
  maps,
  queryResult,
}: CellSuccessProps<NewTimelineSeasonEvent>) => {
  const [createTimelineSeasonEvent, { loading, error }] = useMutation(
    CREATE_TIMELINE_SEASON_EVENT_MUTATION,
    {
      onCompleted: () => {
        toast.success("Event successfully created");
      },
      onError: (error) => {
        toast.error(error.message);
      },
      refetchQueries: [{ query: eventsquery, variables: { timeline_season_id: queryResult.variables.timeline_season_id } }],
    }
  );

  const onSave = (input: CreateTimelineSeasonEventInput) => {
    toast.promise(createTimelineSeasonEvent({ variables: { input } }), {
      loading: "Creating new event...",
      success: "Event successfully created",
      error: <b>Failed to create new event.</b>,
    });
  };

  return (
    <div className="rw-segment">
      <TimelineSeasonEventForm
        onSave={onSave}
        loading={loading}
        error={error}
        maps={maps}
        timeline_season_id={queryResult.variables.timeline_season_id}
      />
    </div>
  )
}
