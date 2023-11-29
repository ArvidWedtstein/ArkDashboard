import { routes } from "@redwoodjs/router";
import { Card, CardActionArea, CardMedia } from "src/components/Util/Card/Card";
import type { FindTimelineSeasonBasespots } from "types/graphql";

const TimelineSeasonBasespotsList = ({
  timelineSeasonBasespotsByTimelineSeasonId,
}: FindTimelineSeasonBasespots) => {
  return (
    <div className="grid h-fit grid-cols-2 gap-3 p-3 md:grid-cols-3 xl:grid-cols-4">
      {timelineSeasonBasespotsByTimelineSeasonId &&
        timelineSeasonBasespotsByTimelineSeasonId.map(
          ({ id, Map: { name } }) => (
            <Card
              className="group relative flex h-auto justify-between rounded-lg ring-1 ring-zinc-500"
              key={id}
            >
              <CardMedia
                image={`https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/timelineimages/13/20220618173551_1.jpg?t=2023-06-28T09%3A03%3A09.582Z`}
                title="base"
                component="div"
                className="h-full min-h-[10rem] w-full transition duration-200 ease-in group-hover:rotate-2 group-hover:scale-110"
              >
                <CardActionArea
                  className="from-0% to-90% h-full w-full bg-gradient-to-t from-[#001022cc] to-[#f0f4fd33]"
                  to={routes.timelineSeasonBasespot({ id })}
                  component="link"
                >
                  <div className="relative flex h-full w-full justify-between transition duration-200 ease-in group-hover:-rotate-2 group-hover:scale-90">
                    <div className="flex h-full w-full flex-col items-end justify-end p-3">
                      <div className="flex w-full justify-between text-left">
                        <div className="w-full">
                          <p className="m-0 overflow-hidden text-ellipsis whitespace-nowrap text-xs text-white">
                            Basespot
                          </p>
                        </div>
                      </div>
                    </div>
                    <span className="absolute right-0 top-0 z-10 inline-flex space-x-1 p-1 text-xs">
                      {/* TODO: insert house-cracked/house icon here, depending if base is raided */}
                      <span className="rw-badge rw-badge-gray-outline dark:!text-white">
                        {name}
                      </span>
                      <span className="rw-badge rw-badge-gray-outline dark:!text-white">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 576 512"
                          className="h-4 w-4 fill-current"
                        >
                          <path d="M543.8 287.6c17 0 32-14 32-32.1c1-9-3-17-11-24L309.5 7c-6-5-14-7-21-7s-15 1-22 8L10 231.5c-7 7-10 15-10 24c0 18 14 32.1 32 32.1h32V448c0 35.3 28.7 64 64 64H230.4l-31.3-52.2c-4.1-6.8-2.6-15.5 3.5-20.5L288 368l-60.2-82.8c-10.9-15 8.2-33.5 22.8-22l117.9 92.6c8 6.3 8.2 18.4 .4 24.9L288 448l38.4 64H448.5c35.5 0 64.2-28.8 64-64.3l-.7-160.2h32z" />
                        </svg>
                      </span>
                    </span>
                  </div>
                </CardActionArea>
              </CardMedia>
            </Card>
          )
        )}
    </div>
  );
};

export default TimelineSeasonBasespotsList;
