import { Link, routes } from "@redwoodjs/router";
import { useMutation } from "@redwoodjs/web";
import { toast } from "@redwoodjs/web/toast";

import { QUERY } from "src/components/TimelineSeasonPerson/TimelineSeasonPeopleCell";
import Toast from "src/components/Util/Toast/Toast";

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
    ingame_name: string,
    permission: string
  ) => {
    toast.custom((t) => (
      <Toast
        t={t}
        title={`You're about to remove ${ingame_name}`}
        message={`Are you sure you want to remove ${ingame_name} ${permission == "guest" ? "as guest?" : "from the tribe?"}`}
        primaryAction={() => {
          toast.promise(
            deleteTimelineSeasonPerson({ variables: { id } }),
            {
              loading: "Removing user...",
              success: `Successfully removed ${ingame_name}`,
              error: `Failed to remove ${ingame_name}`,
            }
          );
        }}
        actionType="YesNo"
      />
    ));
  };

  return (
    <div className="flex justify-start gap-3 overflow-x-auto px-6">
      {timelineSeasonPeople.map(
        ({ id, user_id, ingame_name, Profile, permission }) => (
          <button className="relative flex-none py-6 px-3" key={id}>
            <div className="flex flex-col items-center justify-center gap-3">
              <img
                className="relative h-16 w-16 rounded-full transition duration-150 ease-in-out hover:ring hover:ring-red-500"
                src={
                  Profile?.avatar_url
                    ? `https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/avatars/${Profile.avatar_url}`
                    : `https://ui-avatars.com/api/?name=${ingame_name}`
                }
                onClick={() => {
                  onDeleteClick(id, ingame_name, permission);
                }}
              />
              <div className="inline-flex gap-x-1 items-center justify-center">
                <strong className="text-xs font-medium text-slate-900 dark:text-slate-200" title={`Role: ${permission}`}>
                  {Profile ? (
                    <Link to={routes.profile({ id: user_id })}>
                      {Profile.username || ingame_name}
                    </Link>
                  ) : (
                    ingame_name
                  )}
                </strong>
                {permission == 'guest' && <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" className="w-3 h-3" fill="currentColor"><path d="M315.1 271l-70.56-112.1C232.8 139.3 212.5 128 190.3 128H129.7c-22.22 0-42.53 11.25-54.28 30.09L4.873 271c-9.375 14.98-4.812 34.72 10.16 44.09c15 9.375 34.75 4.812 44.09-10.19l28.88-46.18L87.1 480c0 17.67 14.33 32 32 32c17.67 0 31.1-14.33 31.1-32l0-144h16V480c0 17.67 14.33 32 32 32c17.67 0 32-14.33 32-32V258.8l28.88 46.2C266.9 314.7 277.4 320 288 320c5.781 0 11.66-1.562 16.94-4.859C319.9 305.8 324.5 286 315.1 271zM160 96c26.5 0 48-21.5 48-48S186.5 0 160 0C133.5 0 112 21.5 112 48S133.5 96 160 96z" /></svg>}
              </div>
            </div>
          </button>
        )
      )}
    </div>
  );
};

export default TimelineSeasonPeopleList;
