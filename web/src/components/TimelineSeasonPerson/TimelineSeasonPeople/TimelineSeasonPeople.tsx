import { Link, routes } from "@redwoodjs/router";
import { useMutation } from "@redwoodjs/web";
import { toast } from "@redwoodjs/web/toast";

import { QUERY } from "src/components/TimelineSeasonPerson/TimelineSeasonPeopleCell";

import type {
  DeleteTimelineSeasonPersonMutationVariables,
  FindTimelineSeasonPeople,
} from "types/graphql";

const DELETE_TIMELINE_SEASON_PERSON_MUTATION = gql`
  mutation DeleteTimelineSeasonPersonMutation($id: String!) {
    deleteTimelineSeasonPerson(id: $id) {
      id
    }
  }
`;

const TimelineSeasonPeopleList = ({
  timelineSeasonPeople,
}: FindTimelineSeasonPeople) => {
  const [deleteTimelineSeasonPerson] = useMutation(
    DELETE_TIMELINE_SEASON_PERSON_MUTATION,
    {
      onCompleted: () => {
        toast.success("Person removed");
      },
      onError: (error) => {
        toast.error(error.message);
      },
      // This refetches the query on the list page. Read more about other ways to
      // update the cache over here:
      // https://www.apollographql.com/docs/react/data/mutations/#making-all-other-cache-updates
      refetchQueries: [
        {
          query: QUERY,
          variables: {
            timeline_season_id: timelineSeasonPeople[0].timeline_season_id,
          },
        },
      ],
      awaitRefetchQueries: true,
    }
  );

  const onDeleteClick = (
    id: DeleteTimelineSeasonPersonMutationVariables["id"],
    ingame_name: string
  ) => {
    if (
      confirm(
        "Are you sure you want to remove " + ingame_name + " from the tribe?"
      )
    ) {
      deleteTimelineSeasonPerson({ variables: { id } });
    }
  };

  return (
    <div className="flex justify-start gap-3 overflow-x-auto px-6">
      {timelineSeasonPeople.map(({ id, user_id, ingame_name, Profile }) => (
        <button
          className="relative flex-none py-6 px-3"
          key={id}
        >
          <div className="flex flex-col items-center justify-center gap-3 ">
            {/* after:absolute after:top-1/3 group-hover:after:opacity-100 after:text-sm after:opacity-0 after:transition after:w-full after:backdrop-blur-sm after:content-['Remove?'] after:text-center after:text-white */}
            <img
              className="relative h-16 w-16 rounded-full transition duration-150 ease-in-out hover:ring hover:ring-red-500"
              src={
                Profile?.avatar_url
                  ? `https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/avatars/${Profile.avatar_url}`
                  : `https://ui-avatars.com/api/?name=${ingame_name}`
              }
              onClick={() => {
                onDeleteClick(id, ingame_name);
              }}
            />
            <strong className="text-xs font-medium text-slate-900 dark:text-slate-200">
              {Profile ? (
                <Link to={routes.profile({ id: user_id })}>
                  {Profile.username || ingame_name}
                </Link>
              ) : (
                ingame_name
              )}
            </strong>
          </div>
        </button>
      ))}
    </div>
  );
};

export default TimelineSeasonPeopleList;
