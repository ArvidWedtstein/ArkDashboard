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
    ingame_name: string,
    permission: string
  ) => {
    toast.custom((t) => (
      <div
        className={`${t.visible ? "animate-fly-in" : "animate-fade-out"
          } rw-toast rw-toast-error`}
        role="alert"
      >
        <div className="flex items-center">
          <svg
            className="mr-2 h-4 w-4 flex-shrink-0"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
          </svg>
          <span className="sr-only">Info</span>
          <h3 className="text-lg font-medium">
            You're about to remove <b>{ingame_name}</b>
          </h3>
        </div>
        <div className="mt-2 mb-4 text-sm">
          <p>
            Are you sure you want to remove {ingame_name} {permission == "guest" ? "as guest?" : "from the tribe?"}?
          </p>
        </div>
        <div className="flex">
          <button
            type="button"
            onClick={() => {
              toast.dismiss(t.id);
              toast.promise(
                deleteTimelineSeasonPerson({ variables: { id } }),
                {
                  loading: "Removing user...",
                  success: `Successfully removed ${ingame_name}`,
                  error: `Failed to remove ${ingame_name}`,
                }
              );
            }}
            className="mr-2 inline-flex items-center rounded-lg bg-red-800 px-3 py-1.5 text-center text-xs font-medium text-white hover:bg-red-900 focus:outline-none focus:ring-4 focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
          >
            Remove
          </button>
          <button
            type="button"
            onClick={() => toast.dismiss(t.id)}
            className="rounded-lg border border-red-800 bg-transparent px-3 py-1.5 text-center text-xs font-medium text-red-800 hover:bg-red-900 hover:text-white focus:outline-none focus:ring-4 focus:ring-red-300 dark:border-red-600 dark:text-red-500 dark:hover:bg-red-600 dark:hover:text-white dark:focus:ring-red-800"
            data-dismiss-target="#alert-additional-content-2"
            aria-label="Close"
          >
            Dismiss
          </button>
        </div>
      </div>
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
