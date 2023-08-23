import { Link, routes } from "@redwoodjs/router";
import type { FindTimelineSeasonBasespots } from "types/graphql";

const TimelineSeasonBasespotsList = ({
  timelineSeasonBasespotsByTimelineSeasonId,
}: FindTimelineSeasonBasespots) => {
  return (
    <div className="grid h-fit grid-cols-4 gap-3 p-3">
      {timelineSeasonBasespotsByTimelineSeasonId &&
        timelineSeasonBasespotsByTimelineSeasonId.map(
          ({ id, Map: { name } }) => (
            <div
              className="flex justify-between rounded-lg border border-zinc-500 dark:border-white"
              key={id}
            >
              <Link
                to={routes.timelineSeasonBasespot({ id })}
                className={
                  "group relative flex h-auto w-full overflow-hidden rounded-lg"
                }
              >
                {/* TODO: use one image from basespot  */}
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
                  {/* TODO: insert house-cracked/house icon here, depending if base is raided */}
                  {name}
                </span>
              </Link>
            </div>
          )
        )}
    </div>
  );
};

export default TimelineSeasonBasespotsList;
