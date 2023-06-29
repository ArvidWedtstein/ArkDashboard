import { Link, routes, navigate } from "@redwoodjs/router";
import { useMutation } from "@redwoodjs/web";
import { toast } from "@redwoodjs/web/toast";
import NewTimelineSeasonEvent from "src/components/TimelineSeasonEvent/NewTimelineSeasonEvent/NewTimelineSeasonEvent";
import TimelineSeasonEventsCell from "src/components/TimelineSeasonEvent/TimelineSeasonEventsCell";
import { Modal } from "src/components/Util/Modal/Modal";

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

  const [newTimelineSeasonEvent, setNewTimelineSeasonEvent] = React.useState<boolean>(false);

  return (
    <>
      <Modal
        isOpen={newTimelineSeasonEvent}
        title="New TimelineSeasonEvent"
        onClose={() => setNewTimelineSeasonEvent(false)}
        content={<NewTimelineSeasonEvent timeline_season_id={timelineSeason.id} />}
        actions={[]}
      />
      {/* <Modal
        isOpen={newTimelineSeasonEvent}
        title="New TimelineSeasonEvent"
        onClose={() => setNewTimelineSeasonEvent(false)}
        content={<NewTimelineSeasonEvent timeline_season_id={timelineSeason.id} />}
        actions={[]}
      /> */}
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

          <section className="w-full my-3 rounded-lg border border-zinc-500 bg-zinc-800 font-semibold text-white relative">
            <div className="w-full p-3 mb-0 inline-flex items-center space-x-3">

              <p className="underline underline-offset-8 flex-1">
                Persons in this season
              </p>
              <button
                className="relative flex h-5 w-5 items-center justify-center rounded-full border-none p-0 text-black ring-1 ring-black transition-all hover:rotate-45 hover:ring-2 dark:text-white dark:ring-white md:h-7 md:w-7"
              // onClick={() => setNewTimelineSeasonEvent(true)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 448 512"
                  className="rw-button-icon h-4 w-4 fill-current stroke-current"
                >
                  <path d="M432 256C432 264.8 424.8 272 416 272h-176V448c0 8.844-7.156 16.01-16 16.01S208 456.8 208 448V272H32c-8.844 0-16-7.15-16-15.99C16 247.2 23.16 240 32 240h176V64c0-8.844 7.156-15.99 16-15.99S240 55.16 240 64v176H416C424.8 240 432 247.2 432 256z" />
                </svg>
              </button>
            </div>
            <div className="flex justify-start gap-3 overflow-x-auto px-6">
              {timelineSeason.TimelineSeasonPerson.map(({ user_id, ingame_name, Profile }) => (
                <div className="flex-none py-6 px-3">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <img
                      className="h-16 w-16 rounded-full"
                      src={Profile?.avatar_url ? `https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/avatars/${Profile.avatar_url}` : `https://ui-avatars.com/api/?name=${ingame_name}`}
                    />
                    <strong className="text-xs font-medium text-slate-900 dark:text-slate-200">
                      {Profile ? <Link to={routes.profile({ id: user_id })}>{Profile.username}</Link> : ingame_name}
                    </strong>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section></section>

        </div>



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

          <div className="flex justify-between items-center">
            <p>Events</p>
            <button
              className="relative flex h-5 w-5 items-center justify-center rounded-full border-none p-0 text-black ring-1 ring-black transition-all hover:rotate-45 hover:ring-2 dark:text-white dark:ring-white md:h-7 md:w-7"
              onClick={() => setNewTimelineSeasonEvent(true)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
                className="rw-button-icon h-4 w-4 fill-current stroke-current"
              >
                <path d="M432 256C432 264.8 424.8 272 416 272h-176V448c0 8.844-7.156 16.01-16 16.01S208 456.8 208 448V272H32c-8.844 0-16-7.15-16-15.99C16 247.2 23.16 240 32 240h176V64c0-8.844 7.156-15.99 16-15.99S240 55.16 240 64v176H416C424.8 240 432 247.2 432 256z" />
              </svg>
            </button>
          </div>

          <TimelineSeasonEventsCell timeline_season_id={timelineSeason.id} />
        </div >
      </div >
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
