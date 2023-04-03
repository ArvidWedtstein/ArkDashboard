import { Link, navigate, routes } from "@redwoodjs/router";
import { useMutation } from "@redwoodjs/web";
import { toast } from "@redwoodjs/web/toast";

import { QUERY } from "src/components/Timeline/TimelinesCell";
import { ContextMenu } from "src/components/Util/ContextMenu/ContextMenu";
import { pluralize, timeTag, truncate } from "src/lib/formatters";

import type {
  DeleteTimelineMutationVariables,
  FindTimelines,
} from "types/graphql";

const DELETE_TIMELINE_MUTATION = gql`
  mutation DeleteTimelineMutation($id: String!) {
    deleteTimeline(id: $id) {
      id
    }
  }
`;

const TimelinesList = ({ timelines }: FindTimelines) => {
  const [deleteTimeline] = useMutation(DELETE_TIMELINE_MUTATION, {
    onCompleted: () => {
      toast.success("Timeline deleted");
    },
    onError: (error) => {
      toast.error(error.message);
    },
    // This refetches the query on the list page. Read more about other ways to
    // update the cache over here:
    // https://www.apollographql.com/docs/react/data/mutations/#making-all-other-cache-updates
    refetchQueries: [{ query: QUERY }],
    awaitRefetchQueries: true,
  });

  const onDeleteClick = (id: DeleteTimelineMutationVariables["id"]) => {
    if (confirm("Are you sure you want to delete timeline " + id + "?")) {
      deleteTimeline({ variables: { id } });
    }
  };

  return (
    <div className="rw-segment rw-table-wrapper-responsive">
      <div className="mt-10 w-full">
        <div className="flex bg-transparent">
          {timelines.map(({ id, Profile, TimelineBasespot }) => (
            <div
              key={id}
              className="border-pea-500 relative mr-[1px] flex h-64 w-fit min-w-fit max-w-[100px] border p-6"
            >
              <div className="flex-shrink-0">
                <img
                  className="-bottom-8 left-8 h-full w-[160px] flex-shrink-0 rounded object-cover shadow transition-all ease-in-out hover:scale-105 hover:transform"
                  src="https://pbs.twimg.com/media/E0AsojmVgAIKg-_?format=jpg&name=4096x4096"
                  alt=""
                />
              </div>
              <div className="book-content overflow-hidden px-5 text-left text-white">
                <div className="overflow-hidden text-ellipsis whitespace-nowrap font-semibold text-white">
                  My Timeline 1
                </div>
                <div className="mt-1 overflow-hidden text-ellipsis whitespace-nowrap text-xs">
                  by {Profile.full_name}
                </div>
                <div className="rate">
                  <span
                    className="mt-2 whitespace-nowrap align-sub text-xs text-white" /*ml-2*/
                  >
                    {pluralize(TimelineBasespot.length, "basespot")}
                  </span>
                </div>
                <div
                  className="mt-5 overflow-hidden text-sm"
                  style={{
                    display: "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical",
                  }}
                >
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo,
                  perspiciatis.
                </div>
                <Link
                  to={routes.timelineBasespots({ id })}
                  className="rw-button rw-button-green mt-5 inline-block"
                >
                  View Timeline
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TimelinesList;
