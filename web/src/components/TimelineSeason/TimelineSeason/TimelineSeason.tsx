import { Link, routes, navigate } from "@redwoodjs/router";
import { useMutation } from "@redwoodjs/web";
import { toast } from "@redwoodjs/web/toast";

import { timeTag } from "src/lib/formatters";

import type {
  DeleteTimelineSeasonMutationVariables,
  FindTimelineSeasonById,
} from "types/graphql";

const DELETE_TIMELINE_SEASON_MUTATION = gql`
  mutation DeleteTimelineSeasonMutation($id: String!) {
    deleteTimelineSeason(id: $id) {
      id
    }
  }
`;

interface Props {
  timelineSeason: NonNullable<FindTimelineSeasonById["timelineSeason"]>;
}

const TimelineSeason = ({ timelineSeason }: Props) => {
  const [deleteTimelineSeason] = useMutation(DELETE_TIMELINE_SEASON_MUTATION, {
    onCompleted: () => {
      toast.success("TimelineSeason deleted");
      navigate(routes.timelineSeasons());
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onDeleteClick = (id: DeleteTimelineSeasonMutationVariables["id"]) => {
    if (confirm("Are you sure you want to delete timelineSeason " + id + "?")) {
      deleteTimelineSeason({ variables: { id } });
    }
  };

  return (
    <>
      <header className="rw-segment-header ml-0">
        <h2 className="rw-heading rw-heading-secondary ml-0">
          {timelineSeason.server} Season {timelineSeason.season}
        </h2>
      </header>
      <div className="rw-segment flex">
        <div className="w-full flex-1 basis-32">
          <h2 className="rw-heading rw-heading-secondary mb-3 text-white">
            TimelineSeason Basespots
          </h2>
          <div className="grid h-fit grid-cols-4 gap-3">
            {timelineSeason.TimelineSeasonBasespot.map(
              ({ id, Map: { name } }) => (
                <div className="flex justify-between">
                  <Link
                    to={routes.timelineSeasonBasespot({ id: id.toString() })}
                    className={
                      "group relative flex h-auto w-full overflow-hidden rounded-xl"
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
              )
            )}
          </div>

          <section className="my-3 rounded-lg border border-zinc-500 bg-zinc-800 text-center font-semibold text-white">
            <p className="m-3 mx-auto mb-0 w-fit border-b">
              Persons in this season
            </p>
            <div className="flex justify-between gap-3 overflow-x-auto px-6">
              <div className="flex-none py-6 px-3">
                <div className="flex flex-col items-center justify-center gap-3">
                  <img
                    className="h-16 w-16 rounded-full"
                    src="https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?ixlib=rb-1.2.1&amp;ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&amp;auto=format&amp;fit=facearea&amp;facepad=4&amp;w=256&amp;h=256&amp;q=80"
                  />
                  <strong className="text-xs font-medium text-slate-900 dark:text-slate-200">
                    Andrew
                  </strong>
                </div>
              </div>
              <div className="flex-none py-6 px-3">
                <div className="flex flex-col items-center justify-center gap-3">
                  <img
                    className="h-16 w-16 rounded-full"
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&amp;ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&amp;auto=format&amp;fit=facearea&amp;facepad=4&amp;w=256&amp;h=256&amp;q=80"
                  />
                  <strong className="text-xs font-medium text-slate-900 dark:text-slate-200">
                    Emily
                  </strong>
                </div>
              </div>
              <div className="flex-none py-6 px-3">
                <div className="flex flex-col items-center justify-center gap-3">
                  <img
                    className="h-16 w-16 rounded-full"
                    src="https://images.unsplash.com/photo-1502685104226-ee32379fefbe?ixlib=rb-1.2.1&amp;ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&amp;auto=format&amp;fit=facearea&amp;facepad=4&amp;w=256&amp;h=256&amp;q=80"
                  />
                  <strong className="text-xs font-medium text-slate-900 dark:text-slate-200">
                    Whitney
                  </strong>
                </div>
              </div>
              <div className="flex-none py-6 px-3">
                <div className="flex flex-col items-center justify-center gap-3">
                  <img
                    className="h-16 w-16 rounded-full"
                    src="https://images.unsplash.com/photo-1519345182560-3f2917c472ef?ixlib=rb-1.2.1&amp;ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&amp;auto=format&amp;fit=facearea&amp;facepad=4&amp;w=256&amp;h=256&amp;q=80"
                  />
                  <strong className="text-xs font-medium text-slate-900 dark:text-slate-200">
                    David
                  </strong>
                </div>
              </div>
              <div className="flex-none py-6 px-3">
                <div className="flex flex-col items-center justify-center gap-3">
                  <img
                    className="h-16 w-16 rounded-full"
                    src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&amp;ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&amp;auto=format&amp;fit=facearea&amp;facepad=4&amp;w=256&amp;h=256&amp;q=80"
                  />
                  <strong className="text-xs font-medium text-slate-900 dark:text-slate-200">
                    Kristin
                  </strong>
                </div>
              </div>
              <div className="flex-none py-6 px-3">
                <div className="flex flex-col items-center justify-center gap-3">
                  <img
                    className="h-16 w-16 rounded-full"
                    src="https://images.unsplash.com/photo-1605405748313-a416a1b84491?ixlib=rb-1.2.1&amp;ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&amp;auto=format&amp;fit=facearea&amp;facepad=4&amp;w=256&amp;h=256&amp;q=80"
                  />
                  <strong className="text-xs font-medium text-slate-900 dark:text-slate-200">
                    Sarah
                  </strong>
                </div>
              </div>
            </div>
          </section>

          <section></section>
          {/* Calendar */}
          {/* <div className="grid max-h-[350px] grid-cols-[70px,repeat(7,150px)] grid-rows-[auto,repeat(16,50px)] overflow-scroll">
            <div className="sticky top-0 z-10 col-start-[1] row-start-[1] border-b border-slate-100 bg-white bg-clip-padding py-2 text-sm font-medium text-slate-900 dark:border-black/10 dark:bg-gradient-to-b dark:from-slate-600 dark:to-slate-700 dark:text-slate-200"></div>
            <div className="sticky top-0 z-10 col-start-[2] row-start-[1] border-b border-slate-100 bg-white bg-clip-padding py-2 text-center text-sm font-medium text-slate-900 dark:border-black/10 dark:bg-gradient-to-b dark:from-slate-600 dark:to-slate-700 dark:text-slate-200">
              Sun
            </div>
            <div className="sticky top-0 z-10 col-start-[3] row-start-[1] border-b border-slate-100 bg-white bg-clip-padding py-2 text-center text-sm font-medium text-slate-900 dark:border-black/10 dark:bg-gradient-to-b dark:from-slate-600 dark:to-slate-700 dark:text-slate-200">
              Mon
            </div>
            <div className="sticky top-0 z-10 col-start-[4] row-start-[1] border-b border-slate-100 bg-white bg-clip-padding py-2 text-center text-sm font-medium text-slate-900 dark:border-black/10 dark:bg-gradient-to-b dark:from-slate-600 dark:to-slate-700 dark:text-slate-200">
              Tue
            </div>
            <div className="sticky top-0 z-10 col-start-[5] row-start-[1] border-b border-slate-100 bg-white bg-clip-padding py-2 text-center text-sm font-medium text-slate-900 dark:border-black/10 dark:bg-gradient-to-b dark:from-slate-600 dark:to-slate-700 dark:text-slate-200">
              Wed
            </div>
            <div className="sticky top-0 z-10 col-start-[6] row-start-[1] border-b border-slate-100 bg-white bg-clip-padding py-2 text-center text-sm font-medium text-slate-900 dark:border-black/10 dark:bg-gradient-to-b dark:from-slate-600 dark:to-slate-700 dark:text-slate-200">
              Thu
            </div>
            <div className="sticky top-0 z-10 col-start-[7] row-start-[1] border-b border-slate-100 bg-white bg-clip-padding py-2 text-center text-sm font-medium text-slate-900 dark:border-black/10 dark:bg-gradient-to-b dark:from-slate-600 dark:to-slate-700 dark:text-slate-200">
              Fri
            </div>
            <div className="sticky top-0 z-10 col-start-[8] row-start-[1] border-b border-slate-100 bg-white bg-clip-padding py-2 text-center text-sm font-medium text-slate-900 dark:border-black/10 dark:bg-gradient-to-b dark:from-slate-600 dark:to-slate-700 dark:text-slate-200">
              Sat
            </div>
            <div className="sticky left-0 col-start-[1] row-start-[2] border-r border-slate-100 bg-white p-1.5 text-right text-xs font-medium uppercase text-slate-400 dark:border-slate-200/5 dark:bg-slate-800">
              5 AM
            </div>
            <div className="col-start-[2] row-start-[2] border-b border-r border-slate-100 dark:border-slate-200/5"></div>
            <div className="col-start-[3] row-start-[2] border-b border-r border-slate-100 dark:border-slate-200/5"></div>
            <div className="col-start-[4] row-start-[2] border-b border-r border-slate-100 dark:border-slate-200/5"></div>
            <div className="col-start-[5] row-start-[2] border-b border-r border-slate-100 dark:border-slate-200/5"></div>
            <div className="col-start-[6] row-start-[2] border-b border-r border-slate-100 dark:border-slate-200/5"></div>
            <div className="col-start-[7] row-start-[2] border-b border-r border-slate-100 dark:border-slate-200/5"></div>
            <div className="col-start-[8] row-start-[2] border-b border-slate-100 dark:border-slate-200/5"></div>
            <div className="sticky left-0 col-start-[1] row-start-[3] border-r border-slate-100 bg-white p-1.5 text-right text-xs font-medium uppercase text-slate-400 dark:border-slate-200/5 dark:bg-slate-800">
              6 AM
            </div>
            <div className="col-start-[2] row-start-[3] border-b border-r border-slate-100 dark:border-slate-200/5"></div>
            <div className="col-start-[3] row-start-[3] border-b border-r border-slate-100 dark:border-slate-200/5"></div>
            <div className="col-start-[4] row-start-[3] border-b border-r border-slate-100 dark:border-slate-200/5"></div>
            <div className="col-start-[5] row-start-[3] border-b border-r border-slate-100 dark:border-slate-200/5"></div>
            <div className="col-start-[6] row-start-[3] border-b border-r border-slate-100 dark:border-slate-200/5"></div>
            <div className="col-start-[7] row-start-[3] border-b border-r border-slate-100 dark:border-slate-200/5"></div>
            <div className="col-start-[8] row-start-[3] border-b border-slate-100 dark:border-slate-200/5"></div>
            <div className="sticky left-0 col-start-[1] row-start-[4] border-r border-slate-100 bg-white p-1.5 text-right text-xs font-medium uppercase text-slate-400 dark:border-slate-200/5 dark:bg-slate-800">
              7 AM
            </div>
            <div className="col-start-[2] row-start-[4] border-b border-r border-slate-100 dark:border-slate-200/5"></div>
            <div className="col-start-[3] row-start-[4] border-b border-r border-slate-100 dark:border-slate-200/5"></div>
            <div className="col-start-[4] row-start-[4] border-b border-r border-slate-100 dark:border-slate-200/5"></div>
            <div className="col-start-[5] row-start-[4] border-b border-r border-slate-100 dark:border-slate-200/5"></div>
            <div className="col-start-[6] row-start-[4] border-b border-r border-slate-100 dark:border-slate-200/5"></div>
            <div className="col-start-[7] row-start-[4] border-b border-r border-slate-100 dark:border-slate-200/5"></div>
            <div className="col-start-[8] row-start-[4] border-b border-slate-100 dark:border-slate-200/5"></div>
            <div className="sticky left-0 col-start-[1] row-start-[5] border-r border-slate-100 bg-white p-1.5 text-right text-xs font-medium uppercase text-slate-400 dark:border-slate-200/5 dark:bg-slate-800">
              8 AM
            </div>
            <div className="col-start-[2] row-start-[5] border-b border-r border-slate-100 dark:border-slate-200/5"></div>
            <div className="col-start-[3] row-start-[5] border-b border-r border-slate-100 dark:border-slate-200/5"></div>
            <div className="col-start-[4] row-start-[5] border-b border-r border-slate-100 dark:border-slate-200/5"></div>
            <div className="col-start-[5] row-start-[5] border-b border-r border-slate-100 dark:border-slate-200/5"></div>
            <div className="col-start-[6] row-start-[5] border-b border-r border-slate-100 dark:border-slate-200/5"></div>
            <div className="col-start-[7] row-start-[5] border-b border-r border-slate-100 dark:border-slate-200/5"></div>
            <div className="col-start-[8] row-start-[5] border-b border-slate-100 dark:border-slate-200/5"></div>
            <div className="sticky left-0 col-start-[1] row-start-[6] border-r border-slate-100 bg-white p-1.5 text-right text-xs font-medium uppercase text-slate-400 dark:border-slate-200/5 dark:bg-slate-800">
              9 AM
            </div>
            <div className="col-start-[2] row-start-[6] border-b border-r border-slate-100 dark:border-slate-200/5"></div>
            <div className="col-start-[3] row-start-[6] border-b border-r border-slate-100 dark:border-slate-200/5"></div>
            <div className="col-start-[4] row-start-[6] border-b border-r border-slate-100 dark:border-slate-200/5"></div>
            <div className="col-start-[5] row-start-[6] border-b border-r border-slate-100 dark:border-slate-200/5"></div>
            <div className="col-start-[6] row-start-[6] border-b border-r border-slate-100 dark:border-slate-200/5"></div>
            <div className="col-start-[7] row-start-[6] border-b border-r border-slate-100 dark:border-slate-200/5"></div>
            <div className="col-start-[8] row-start-[6] border-b border-slate-100 dark:border-slate-200/5"></div>
            <div className="sticky left-0 col-start-[1] row-start-[7] border-r border-slate-100 bg-white p-1.5 text-right text-xs font-medium uppercase text-slate-400 dark:border-slate-200/5 dark:bg-slate-800">
              10 AM
            </div>
            <div className="col-start-[2] row-start-[7] border-b border-r border-slate-100 dark:border-slate-200/5"></div>
            <div className="col-start-[3] row-start-[7] border-b border-r border-slate-100 dark:border-slate-200/5"></div>
            <div className="col-start-[4] row-start-[7] border-b border-r border-slate-100 dark:border-slate-200/5"></div>
            <div className="col-start-[5] row-start-[7] border-b border-r border-slate-100 dark:border-slate-200/5"></div>
            <div className="col-start-[6] row-start-[7] border-b border-r border-slate-100 dark:border-slate-200/5"></div>
            <div className="col-start-[7] row-start-[7] border-b border-r border-slate-100 dark:border-slate-200/5"></div>
            <div className="col-start-[8] row-start-[7] border-b border-slate-100 dark:border-slate-200/5"></div>
            <div className="sticky left-0 col-start-[1] row-start-[8] border-r border-slate-100 bg-white p-1.5 text-right text-xs font-medium uppercase text-slate-400 dark:border-slate-200/5 dark:bg-slate-800">
              11 AM
            </div>
            <div className="col-start-[2] row-start-[8] border-b border-r border-slate-100 dark:border-slate-200/5"></div>
            <div className="col-start-[3] row-start-[8] border-b border-r border-slate-100 dark:border-slate-200/5"></div>
            <div className="col-start-[4] row-start-[8] border-b border-r border-slate-100 dark:border-slate-200/5"></div>
            <div className="col-start-[5] row-start-[8] border-b border-r border-slate-100 dark:border-slate-200/5"></div>
            <div className="col-start-[6] row-start-[8] border-b border-r border-slate-100 dark:border-slate-200/5"></div>
            <div className="col-start-[7] row-start-[8] border-b border-r border-slate-100 dark:border-slate-200/5"></div>
            <div className="col-start-[8] row-start-[8] border-b border-slate-100 dark:border-slate-200/5"></div>
            <div className="sticky left-0 col-start-[1] row-start-[9] border-r border-slate-100 bg-white p-1.5 text-right text-xs font-medium uppercase text-slate-400 dark:border-slate-200/5 dark:bg-slate-800">
              12 PM
            </div>
            <div className="col-start-[2] row-start-[9] border-b border-r border-slate-100 dark:border-slate-200/5"></div>
            <div className="col-start-[3] row-start-[9] border-b border-r border-slate-100 dark:border-slate-200/5"></div>
            <div className="col-start-[4] row-start-[9] border-b border-r border-slate-100 dark:border-slate-200/5"></div>
            <div className="col-start-[5] row-start-[9] border-b border-r border-slate-100 dark:border-slate-200/5"></div>
            <div className="col-start-[6] row-start-[9] border-b border-r border-slate-100 dark:border-slate-200/5"></div>
            <div className="col-start-[7] row-start-[9] border-b border-r border-slate-100 dark:border-slate-200/5"></div>
            <div className="col-start-[8] row-start-[9] border-b border-slate-100 dark:border-slate-200/5"></div>
            <div className="sticky left-0 col-start-[1] row-start-[10] border-r border-slate-100 bg-white p-1.5 text-right text-xs font-medium uppercase text-slate-400 dark:border-slate-200/5 dark:bg-slate-800">
              1 PM
            </div>
            <div className="col-start-[2] row-start-[10] border-b border-r border-slate-100 dark:border-slate-200/5"></div>
            <div className="col-start-[3] row-start-[10] border-b border-r border-slate-100 dark:border-slate-200/5"></div>
            <div className="col-start-[4] row-start-[10] border-b border-r border-slate-100 dark:border-slate-200/5"></div>
            <div className="col-start-[5] row-start-[10] border-b border-r border-slate-100 dark:border-slate-200/5"></div>
            <div className="col-start-[6] row-start-[10] border-b border-r border-slate-100 dark:border-slate-200/5"></div>
            <div className="col-start-[7] row-start-[10] border-b border-r border-slate-100 dark:border-slate-200/5"></div>
            <div className="col-start-[8] row-start-[10] border-b border-slate-100 dark:border-slate-200/5"></div>
            <div className="sticky left-0 col-start-[1] row-start-[11] border-r border-slate-100 bg-white p-1.5 text-right text-xs font-medium uppercase text-slate-400 dark:border-slate-200/5 dark:bg-slate-800">
              2 PM
            </div>
            <div className="col-start-[2] row-start-[11] border-b border-r border-slate-100 dark:border-slate-200/5"></div>
            <div className="col-start-[3] row-start-[11] border-b border-r border-slate-100 dark:border-slate-200/5"></div>
            <div className="col-start-[4] row-start-[11] border-b border-r border-slate-100 dark:border-slate-200/5"></div>
            <div className="col-start-[5] row-start-[11] border-b border-r border-slate-100 dark:border-slate-200/5"></div>
            <div className="col-start-[6] row-start-[11] border-b border-r border-slate-100 dark:border-slate-200/5"></div>
            <div className="col-start-[7] row-start-[11] border-b border-r border-slate-100 dark:border-slate-200/5"></div>
            <div className="col-start-[8] row-start-[11] border-b border-slate-100 dark:border-slate-200/5"></div>
            <div className="sticky left-0 col-start-[1] row-start-[12] border-r border-slate-100 bg-white p-1.5 text-right text-xs font-medium uppercase text-slate-400 dark:border-slate-200/5 dark:bg-slate-800">
              3 PM
            </div>
            <div className="col-start-[2] row-start-[12] border-b border-r border-slate-100 dark:border-slate-200/5"></div>
            <div className="col-start-[3] row-start-[12] border-b border-r border-slate-100 dark:border-slate-200/5"></div>
            <div className="col-start-[4] row-start-[12] border-b border-r border-slate-100 dark:border-slate-200/5"></div>
            <div className="col-start-[5] row-start-[12] border-b border-r border-slate-100 dark:border-slate-200/5"></div>
            <div className="col-start-[6] row-start-[12] border-b border-r border-slate-100 dark:border-slate-200/5"></div>
            <div className="col-start-[7] row-start-[12] border-b border-r border-slate-100 dark:border-slate-200/5"></div>
            <div className="col-start-[8] row-start-[12] border-b border-slate-100 dark:border-slate-200/5"></div>
            <div className="sticky left-0 col-start-[1] row-start-[13] border-r border-slate-100 bg-white p-1.5 text-right text-xs font-medium uppercase text-slate-400 dark:border-slate-200/5 dark:bg-slate-800">
              4 PM
            </div>
            <div className="col-start-[2] row-start-[13] border-b border-r border-slate-100 dark:border-slate-200/5"></div>
            <div className="col-start-[3] row-start-[13] border-b border-r border-slate-100 dark:border-slate-200/5"></div>
            <div className="col-start-[4] row-start-[13] border-b border-r border-slate-100 dark:border-slate-200/5"></div>
            <div className="col-start-[5] row-start-[13] border-b border-r border-slate-100 dark:border-slate-200/5"></div>
            <div className="col-start-[6] row-start-[13] border-b border-r border-slate-100 dark:border-slate-200/5"></div>
            <div className="col-start-[7] row-start-[13] border-b border-r border-slate-100 dark:border-slate-200/5"></div>
            <div className="col-start-[8] row-start-[13] border-b border-slate-100 dark:border-slate-200/5"></div>
            <div className="sticky left-0 col-start-[1] row-start-[14] border-r border-slate-100 bg-white p-1.5 text-right text-xs font-medium uppercase text-slate-400 dark:border-slate-200/5 dark:bg-slate-800">
              5 PM
            </div>
            <div className="col-start-[2] row-start-[14] border-b border-r border-slate-100 dark:border-slate-200/5"></div>
            <div className="col-start-[3] row-start-[14] border-b border-r border-slate-100 dark:border-slate-200/5"></div>
            <div className="col-start-[4] row-start-[14] border-b border-r border-slate-100 dark:border-slate-200/5"></div>
            <div className="col-start-[5] row-start-[14] border-b border-r border-slate-100 dark:border-slate-200/5"></div>
            <div className="col-start-[6] row-start-[14] border-b border-r border-slate-100 dark:border-slate-200/5"></div>
            <div className="col-start-[7] row-start-[14] border-b border-r border-slate-100 dark:border-slate-200/5"></div>
            <div className="col-start-[8] row-start-[14] border-b border-slate-100 dark:border-slate-200/5"></div>
            <div className="sticky left-0 col-start-[1] row-start-[15] border-r border-slate-100 bg-white p-1.5 text-right text-xs font-medium uppercase text-slate-400 dark:border-slate-200/5 dark:bg-slate-800">
              6 PM
            </div>
            <div className="col-start-[2] row-start-[15] border-b border-r border-slate-100 dark:border-slate-200/5"></div>
            <div className="col-start-[3] row-start-[15] border-b border-r border-slate-100 dark:border-slate-200/5"></div>
            <div className="col-start-[4] row-start-[15] border-b border-r border-slate-100 dark:border-slate-200/5"></div>
            <div className="col-start-[5] row-start-[15] border-b border-r border-slate-100 dark:border-slate-200/5"></div>
            <div className="col-start-[6] row-start-[15] border-b border-r border-slate-100 dark:border-slate-200/5"></div>
            <div className="col-start-[7] row-start-[15] border-b border-r border-slate-100 dark:border-slate-200/5"></div>
            <div className="col-start-[8] row-start-[15] border-b border-slate-100 dark:border-slate-200/5"></div>
            <div className="sticky left-0 col-start-[1] row-start-[16] border-r border-slate-100 bg-white p-1.5 text-right text-xs font-medium uppercase text-slate-400 dark:border-slate-200/5 dark:bg-slate-800">
              7 PM
            </div>
            <div className="col-start-[2] row-start-[16] border-b border-r border-slate-100 dark:border-slate-200/5"></div>
            <div className="col-start-[3] row-start-[16] border-b border-r border-slate-100 dark:border-slate-200/5"></div>
            <div className="col-start-[4] row-start-[16] border-b border-r border-slate-100 dark:border-slate-200/5"></div>
            <div className="col-start-[5] row-start-[16] border-b border-r border-slate-100 dark:border-slate-200/5"></div>
            <div className="col-start-[6] row-start-[16] border-b border-r border-slate-100 dark:border-slate-200/5"></div>
            <div className="col-start-[7] row-start-[16] border-b border-r border-slate-100 dark:border-slate-200/5"></div>
            <div className="col-start-[8] row-start-[16] border-b border-slate-100 dark:border-slate-200/5"></div>
            <div className="sticky left-0 col-start-[1] row-start-[17] border-r border-slate-100 bg-white p-1.5 text-right text-xs font-medium uppercase text-slate-400 dark:border-slate-200/5 dark:bg-slate-800">
              8 PM
            </div>
            <div className="col-start-[2] row-start-[17] border-r border-slate-100 dark:border-slate-200/5"></div>
            <div className="col-start-[3] row-start-[17] border-r border-slate-100 dark:border-slate-200/5"></div>
            <div className="col-start-[4] row-start-[17] border-r border-slate-100 dark:border-slate-200/5"></div>
            <div className="col-start-[5] row-start-[17] border-r border-slate-100 dark:border-slate-200/5"></div>
            <div className="col-start-[6] row-start-[17] border-r border-slate-100 dark:border-slate-200/5"></div>
            <div className="col-start-[7] row-start-[17] border-r border-slate-100 dark:border-slate-200/5"></div>
            <div className="col-start-[8] row-start-[17]"></div>
            <div className="col-start-3 row-span-4 row-start-[2] m-1 flex flex-col rounded-lg border border-blue-700/10 bg-blue-400/20 p-1 dark:border-sky-500 dark:bg-sky-600/50">
              <span className="text-xs text-blue-600 dark:text-sky-100">
                5 AM
              </span>
              <span className="text-xs font-medium text-blue-600 dark:text-sky-100">
                Flight to vancouver
              </span>
              <span className="text-xs text-blue-600 dark:text-sky-100">
                Toronto YYZ
              </span>
            </div>
            <div className="col-start-[4] row-span-4 row-start-[3] m-1 flex flex-col rounded-lg border border-purple-700/10 bg-purple-400/20 p-1 dark:border-fuchsia-500 dark:bg-fuchsia-600/50">
              <span className="text-xs text-purple-600 dark:text-fuchsia-100">
                6 AM
              </span>
              <span className="text-xs font-medium text-purple-600 dark:text-fuchsia-100">
                Breakfast
              </span>
              <span className="text-xs text-purple-600 dark:text-fuchsia-100">
                Mel's Diner
              </span>
            </div>
            <div className="col-start-[7] row-span-3 row-start-[14] m-1 flex flex-col rounded-lg border border-pink-700/10 bg-pink-400/20 p-1 dark:border-indigo-500 dark:bg-indigo-600/50">
              <span className="text-xs text-pink-600 dark:text-indigo-100">
                5 PM
              </span>
              <span className="text-xs font-medium text-pink-600 dark:text-indigo-100">
                🎉 Party party 🎉
              </span>
              <span className="text-xs text-pink-600 dark:text-indigo-100">
                We like to party!
              </span>
            </div>
          </div> */}
        </div>

        {/* <Modal
        isOpen={isRaided}
        onClose={() => setIsRaided(false)}
        form={
          <div className="flex flex-col items-center justify-center">
            <p className="text-lg text-gray-700 dark:text-white">
              Please fill out the form below to report the raid.
            </p>
            <fieldset className="rw-form-group">
              <legend>Raid Form</legend>
              <div>
                <div>
                  <Label
                    name="raid_start"
                    className="rw-label"
                    errorClassName="rw-label rw-label-error"
                  >
                    Raid Start date
                  </Label>

                  <DatetimeLocalField
                    name="raid_start"
                    className="rw-input"
                    errorClassName="rw-input rw-input-error"
                    validation={{ required: true }}
                  />

                  <FieldError name="raid_start" className="rw-field-error" />
                </div>
                <div>
                  <Label
                    name="raid_end"
                    className="rw-label"
                    errorClassName="rw-label rw-label-error"
                  >
                    Raid End date
                  </Label>

                  <DatetimeLocalField
                    name="raid_end"
                    className="rw-input"
                    errorClassName="rw-input rw-input-error"
                    emptyAs={null}
                  />

                  <FieldError name="raid_end" className="rw-field-error" />
                </div>
              </div>
              <div>
                <div>
                  <Label
                    name="raid_comment"
                    className="rw-label"
                    errorClassName="rw-label rw-label-error"
                  >
                    Raid Comment
                  </Label>

                  <TextAreaField
                    name="raid_comment"
                    className="rw-input"
                    errorClassName="rw-input rw-input-error"
                  />

                  <FieldError name="raid_comment" className="rw-field-error" />
                </div>
                <div>
                  <Label
                    name="attackers"
                    className="rw-label"
                    errorClassName="rw-label rw-label-error"
                  >
                    Attackers
                  </Label>

                  <TextAreaField
                    name="attackers"
                    className="rw-input"
                    errorClassName="rw-input rw-input-error"
                  />
                  <p className="rw-helper-text">
                    Player names, comma seperated
                  </p>

                  <FieldError name="attackers" className="rw-field-error" />
                </div>
                <div>
                  <Label
                    name="base_survived"
                    className="rw-label"
                    errorClassName="rw-label rw-label-error"
                  >
                    Base Survived?
                  </Label>

                  <CheckboxField
                    name="base_survived"
                    className="rw-input"
                    errorClassName="rw-input rw-input-error"
                  />
                  <p className="rw-helper-text">Did base survived raid?</p>

                  <FieldError name="base_survived" className="rw-field-error" />
                </div>
              </div>
              <div>
                <div>
                  <Label
                    name="tribe_name"
                    className="rw-label"
                    errorClassName="rw-label rw-label-error"
                  >
                    Tribe Name
                  </Label>

                  <TextField
                    name="tribe_name"
                    className="rw-input"
                    errorClassName="rw-input rw-input-error"
                  />
                  <p className="rw-helper-text">
                    Name of tribe who started the raid
                  </p>

                  <FieldError name="tribe_name" className="rw-field-error" />
                </div>
                <div>
                  <Label
                    name="defenders"
                    className="rw-label"
                    errorClassName="rw-label rw-label-error"
                  >
                    Defenders
                  </Label>

                  <TextAreaField
                    name="defenders"
                    className="rw-input"
                    errorClassName="rw-input rw-input-error"
                  />
                  <p className="rw-helper-text">
                    Name of players who defended, comma seperated
                  </p>

                  <FieldError name="defenders" className="rw-field-error" />
                </div>
              </div>
            </fieldset>
          </div>
        }
        formSubmit={(data) => {
          data.preventDefault();
          const formData = new FormData(data.currentTarget);
          createTimelineBasespotRaid({
            variables: {
              input: {
                raid_start: formData.get("raid_start") || new Date(),
                raid_end: convertToDate(formData.get("raid_end")),
                raid_comment: formData.get("raid_comment"),
                attacker_players: formData.get("attacker_players"),
                base_survived: formData.get("base_survived"),
                tribe_name: formData.get("tribe_name"),
                defenders: formData.get("defenders"),
              },
            },
          });
          setIsRaided(false);
        }}
      /> */}

        {/* TODO: Add map with all basespots, add option for adding persons */}

        <div className="h-screen grow-0 basis-72 p-6 text-white">
          <p>Downloads</p>
          <div className="py-3">
            <div className="text-xs">Today</div>
            <div className="mt-3 flex items-center rounded-xl bg-zinc-500 p-2">
              <div className="w-8">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                  className=""
                >
                  <defs></defs>
                  <circle cx="256" cy="256" r="256" fill="#4b50dd"></circle>
                  <path
                    fill="#f5f5f5"
                    d="M192 64h176c4.4 0 8 3.6 8 8v328c0 4.4-3.6 8-8 8H120c-4.4 0-8-3.6-8-8V148l80-84z"
                  ></path>
                  <path
                    fill="#e6e6e6"
                    d="M184 148c4.4 0 8-3.6 8-8V64l-80 84h72z"
                  ></path>
                  <circle cx="352" cy="384" r="52" fill="#2179a6"></circle>
                  <g fill="#f5f5f5" className="g">
                    <path d="M352 416c-2.208 0-4-1.788-4-4v-56c0-2.212 1.792-4 4-4s4 1.788 4 4v56c0 2.212-1.792 4-4 4z"></path>
                    <path d="M352 416a3.989 3.989 0 01-2.828-1.172l-20-20c-1.564-1.564-1.564-4.092 0-5.656s4.092-1.564 5.656 0L352 406.344l17.172-17.172c1.564-1.564 4.092-1.564 5.656 0s1.564 4.092 0 5.656l-20 20A3.989 3.989 0 01352 416z"></path>
                  </g>
                </svg>
              </div>
              <div className="px-3">
                <p className="m-0 w-36 overflow-hidden text-ellipsis whitespace-nowrap text-sm leading-4">
                  Dilophosaur.mp4
                </p>
                <p className="download-text-info m-0 w-36 overflow-hidden text-ellipsis whitespace-nowrap text-xs leading-4">
                  34.45 MB<span className="ml-1">Waiting for download</span>
                </p>
              </div>
              <div className="w-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 612 612"
                  fill="#fff"
                >
                  <defs />
                  <path d="M403.939 295.749l-78.814 78.833V172.125c0-10.557-8.568-19.125-19.125-19.125s-19.125 8.568-19.125 19.125v202.457l-78.814-78.814c-7.478-7.478-19.584-7.478-27.043 0-7.478 7.478-7.478 19.584 0 27.042L289.208 431c4.59 4.59 10.863 6.005 16.812 4.953 5.929 1.052 12.221-.382 16.811-4.953l108.19-108.19c7.478-7.478 7.478-19.583 0-27.042-7.498-7.478-19.604-7.478-27.082-.019zM306 0C137.012 0 0 136.992 0 306s137.012 306 306 306 306-137.012 306-306S475.008 0 306 0zm0 573.75C158.125 573.75 38.25 453.875 38.25 306S158.125 38.25 306 38.25 573.75 158.125 573.75 306 453.875 573.75 306 573.75z" />
                </svg>
              </div>
            </div>
          </div>

          <p>Events</p>
          {/* TODO: Make modal for event */}
          <div className="relative mt-3 max-h-80 overflow-y-auto rounded-lg border border-zinc-500 bg-zinc-800 px-4">
            <ul className="relative w-full border-l border-gray-200 py-3">
              {/* group by date */}
              {timelineSeason.TimelineSeasonEvent.map(
                ({ title, content, tags, created_at }, idx) => (
                  <li className="mb-10 ml-6">
                    <span className="absolute -left-1.5 flex h-3 w-3 items-center justify-center rounded-full bg-blue-100 dark:bg-white">
                      {/* <svg aria-hidden="true" className="w-3 h-3 text-blue-800 dark:text-black" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"></path>
                  </svg> */}
                    </span>
                    <h3 className="-ml-2 mt-2 mb-1 flex items-center text-xs text-gray-900 dark:text-white">
                      {new Date(created_at).toLocaleTimeString("en-GB", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                      {idx == 0 && (
                        <span className="mr-2 ml-3 rounded bg-blue-100 px-2.5 py-0.5 text-sm font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                          Latest
                        </span>
                      )}
                    </h3>
                    <p className="text-sm font-semibold">{title}</p>
                    <p className="mb-4 text-sm font-normal text-gray-500 dark:text-gray-400">
                      {content}
                    </p>
                    <div className="flex h-fit space-x-2">
                      <div className="flex">
                        <img
                          className="rounded"
                          src="https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?ixlib=rb-1.2.1&auto=format&fit=crop&w=2250&q=80"
                        />
                      </div>
                      <div className="flex">
                        <img
                          className="rounded"
                          src="https://images.unsplash.com/photo-1498855926480-d98e83099315?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2250&q=80"
                        />
                      </div>
                      <div className=" flex">
                        <img
                          className="rounded"
                          src="https://images.unsplash.com/photo-1492648272180-61e45a8d98a7?ixlib=rb-1.2.1&auto=format&fit=crop&w=2250&q=80"
                        />
                      </div>
                    </div>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* <div className="h-[150px] w-full flex pl-1">
            <div className="h-full w-[2px] bg-white flex justify-between flex-col relative pt-3">
              <div className="ml-2 text-xs space-x-2">
                <span className="absolute w-3 h-3 rounded-full -left-1 border bg-white" />
                <span>15:30</span>
              </div>
              <div className="ml-2 text-xs space-x-2">
                <span className="absolute w-3 h-3 rounded-full -left-1 border bg-white" />
                <span>18:30</span>
              </div>
            </div>
            <div className="py-6 px-3">
              <div className="flex h-fit space-x-2 pt-3">
                <div className="flex">
                  <img className='ml-2 rounded' src="https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?ixlib=rb-1.2.1&auto=format&fit=crop&w=2250&q=80" />
                </div>
                <div className="flex">
                  <img className='ml-2 rounded' src="https://images.unsplash.com/photo-1498855926480-d98e83099315?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2250&q=80" />
                </div>
                <div className=" flex">
                  <img className='ml-2 rounded' src="https://images.unsplash.com/photo-1492648272180-61e45a8d98a7?ixlib=rb-1.2.1&auto=format&fit=crop&w=2250&q=80" />
                </div>
              </div>
              <div className="text-xs ml-3 mt-3">
                Received <span className="text-gray-400">3 images</span> total  <span className="text-gray-400">50.3 MB</span>
              </div>
            </div>
          </div> */}
        </div>
      </div>
      <nav className="rw-button-group">
        <Link
          to={routes.editTimelineSeason({ id: timelineSeason.id })}
          className="rw-button rw-button-blue"
        >
          Edit
        </Link>
        <button
          type="button"
          className="rw-button rw-button-red"
          onClick={() => onDeleteClick(timelineSeason.id)}
        >
          Delete
        </button>
      </nav>
    </>
  );
};

export default TimelineSeason;
