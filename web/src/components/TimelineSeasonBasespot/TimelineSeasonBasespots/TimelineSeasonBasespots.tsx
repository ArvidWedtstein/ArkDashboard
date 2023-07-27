import { Link, routes } from "@redwoodjs/router";
import { useMutation } from "@redwoodjs/web";
import { toast } from "@redwoodjs/web/toast";

import { QUERY } from "src/components/TimelineSeasonBasespot/TimelineSeasonBasespotsCell";
import type {
  DeleteTimelineSeasonBasespotMutationVariables,
  FindTimelineSeasonBasespots,
} from "types/graphql";

const DELETE_TIMELINE_SEASON_BASESPOT_MUTATION = gql`
  mutation DeleteTimelineSeasonBasespotMutation($id: BigInt!) {
    deleteTimelineSeasonBasespot(id: $id) {
      id
    }
  }
`;

const TimelineSeasonBasespotsList = ({
  timelineSeasonBasespotsByTimelineSeasonId: timelineSeasonBasespots,
}: FindTimelineSeasonBasespots) => {
  const [deleteTimelineSeasonBasespot] = useMutation(
    DELETE_TIMELINE_SEASON_BASESPOT_MUTATION,
    {
      onCompleted: () => {
        toast.success("TimelineSeasonBasespot deleted");
      },
      onError: (error) => {
        toast.error(error.message);
      },
      // This refetches the query on the list page. Read more about other ways to
      // update the cache over here:
      // https://www.apollographql.com/docs/react/data/mutations/#making-all-other-cache-updates
      refetchQueries: [{ query: QUERY }],
      awaitRefetchQueries: true,
    }
  );
  const onDeleteClick = (
    id: DeleteTimelineSeasonBasespotMutationVariables["id"]
  ) => {
    if (
      confirm(
        "Are you sure you want to delete timelineSeasonBasespot " + id + "?"
      )
    ) {
      deleteTimelineSeasonBasespot({ variables: { id } });
    }
  };

  return (
    <div className="grid h-fit grid-cols-4 gap-3 p-3">
      {timelineSeasonBasespots && timelineSeasonBasespots.map(({ id, Map: { name } }) => (
        <div
          className="flex justify-between rounded-lg border border-zinc-500 dark:border-white"
          key={id}
        >
          <Link
            to={routes.timelineSeasonBasespot({ id: id.toString() })}
            className={
              "group relative flex h-auto w-full overflow-hidden rounded-lg"
            }
          >
            <img
              className="h-full w-full object-cover transition-all duration-200 ease-in group-hover:scale-110"
              src={`https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/timelineimages/13/20220618173551_1.jpg?t=2023-06-28T09%3A03%3A09.582Z`}
              alt=""
            />
            <div
              className="absolute flex h-full w-full flex-col items-end justify-end p-3"
              style={{
                background:
                  "linear-gradient(0deg, #001022cc 0%, #f0f4fd33 90%)",
              }}
            >
              <div className="flex w-full justify-between text-left">
                <div className="w-full">
                  <p className="m-0 overflow-hidden text-ellipsis whitespace-nowrap text-xs text-white">
                    Basespot
                  </p>
                </div>
              </div>
            </div>
            <span className="absolute right-3 top-3 z-10 rounded-[10px] bg-[#8b9ca380] py-1 px-3 text-xs text-white">
              {name}
            </span>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default TimelineSeasonBasespotsList;
