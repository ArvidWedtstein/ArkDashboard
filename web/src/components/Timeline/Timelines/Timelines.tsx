import { Link, navigate, routes } from "@redwoodjs/router";
import { useMutation } from "@redwoodjs/web";
import { toast } from "@redwoodjs/web/toast";
import { useEffect, useState } from "react";

import { QUERY } from "src/components/Timeline/TimelinesCell";
import { ContextMenu } from "src/components/Util/ContextMenu/ContextMenu";
import Tooltip from "src/components/Util/Tooltip/Tooltip";
import { timeTag } from "src/lib/formatters";

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
  return (
    <div className="rw-segment rw-table-wrapper-responsive">
      <div className="mt-10 w-full">
        <div className="my-3 flex gap-2 bg-transparent">
          {timelines.map(({ id, created_at, Profile }) => (
            <div
              key={id}
              className="border-pea-500 relative flex h-64 w-fit min-w-fit max-w-xs rounded-md border p-6"
            >
              <div className="relative w-[160px] flex-shrink-0 overflow-hidden">
                <img
                  className="-bottom-8 left-8 h-full flex-shrink-0 rounded-md object-cover shadow transition-all ease-in-out hover:scale-105 hover:transform"
                  src="https://pbs.twimg.com/media/E0AsojmVgAIKg-_?format=jpg&name=4096x4096"
                  alt=""
                />
              </div>
              <div className="px-5 text-left text-gray-900 dark:text-white">
                <div className="text-ellipsis whitespace-nowrap font-semibold">
                  <Link to={routes.profile({ id: Profile.id.toString() })}>
                    {Profile.username}
                  </Link>
                  's Timeline
                </div>
                <div className="mt-1 text-ellipsis whitespace-nowrap text-xs">
                  by <Link to={routes.profile({ id: Profile.id })}>{Profile.full_name}</Link>
                </div>
                <div className="">
                  <span className="mt-2 whitespace-nowrap align-sub text-xs">
                    Created {timeTag(created_at)}
                    {/* {pluralize(TimelineBasespot.length, "basespot")} */}
                  </span>
                </div>
                <p
                  className="mt-5 text-sm overflow-hidden"
                  style={{
                    display: "-webkit-box",
                    lineClamp: 3,
                    maxLines: 3,
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical",
                  }}
                  title="In the untamed expanse of Ark's mysterious world, where pre&shy;historic wonders and perilous challenges await at every turn,
                  brave survivors embark on a tumultuous journey of survival and discovery. As they awaken on the enigmatic shores of Ark,
                  an isle infused with ancient secrets, they find themselves thrust into a primal struggle against nature's fury and formidable creatures."
                >
                  In the untamed expanse of Ark's mysterious world, where pre&shy;historic wonders and perilous challenges await at every turn,
                  brave survivors embark on a tumultuous journey of survival and discovery. As they awaken on the enigmatic shores of Ark,
                  an isle infused with ancient secrets, they find themselves thrust into a primal struggle against nature's fury and formidable creatures.
                </p>
                <div className="rw-button-group rw-button-group-border justify-start mt-5" role="group">
                  <Link
                    to={routes.timelineBasespots({ id })}
                    className="rw-button"
                  >
                    View Timeline
                  </Link>
                  <Tooltip content={<p>cumming soon</p>}>
                    <Link
                      to={routes.timelineSeasons({ id })}
                      className="rw-button"
                    >
                      View Timeline Seasons
                    </Link>
                  </Tooltip>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TimelinesList;
