import type {
  CreateTimelineSeasonBasespotInput, NewTimelineSeasonBasespot,
} from "types/graphql";

import { navigate, routes } from "@redwoodjs/router";
import type { CellSuccessProps, CellFailureProps } from "@redwoodjs/web";
import { useMutation } from "@redwoodjs/web";
import { toast } from "@redwoodjs/web/toast";

import TimelineSeasonBasespotForm from "src/components/TimelineSeasonBasespot/TimelineSeasonBasespotForm";

export const QUERY = gql`
  query NewTimelineSeasonBasespot {
    maps {
      id
      name
      icon
    }
    basespots {
      id,
      name
    }
  }
`;

const CREATE_TIMELINE_SEASON_BASESPOT_MUTATION = gql`
  mutation CreateTimelineSeasonBasespotMutation(
    $input: CreateTimelineSeasonBasespotInput!
  ) {
    createTimelineSeasonBasespot(input: $input) {
      id
    }
  }
`

export const beforeQuery = (props: { timeline_season_id: string }) => {
  return { variables: props };
}

export const Loading = () => <div>Loading...</div>;

export const Failure = ({ error }: CellFailureProps) => (
  <div className="rw-cell-error">{error?.message}</div>
);

export const Success = ({
  maps,
  basespots,
  queryResult,
}: CellSuccessProps<NewTimelineSeasonBasespot>) => {
  const [createTimelineSeasonBasespot, { loading, error }] = useMutation(
    CREATE_TIMELINE_SEASON_BASESPOT_MUTATION,
    {
      onCompleted: () => {
        toast.success('TimelineSeasonBasespot created')
        navigate(routes.timelineSeasonBasespots())
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const onSave = (input: CreateTimelineSeasonBasespotInput) => {
    createTimelineSeasonBasespot({ variables: { input } })
  }

  return (
    <div className="rw-segment">
      <div className="rw-segment-main">
        <TimelineSeasonBasespotForm
          timeline_season_id={queryResult.variables.timeline_season_id}
          maps={maps}
          basespots={basespots}
          onSave={onSave}
          loading={loading}
          error={error}
        />
      </div>
    </div>
  )
};
