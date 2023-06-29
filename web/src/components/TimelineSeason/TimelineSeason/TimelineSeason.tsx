import { Link, routes, navigate } from "@redwoodjs/router";
import { useMutation } from "@redwoodjs/web";
import { toast } from "@redwoodjs/web/toast";
import NewTimelineSeasonEvent from "src/components/TimelineSeasonEvent/NewTimelineSeasonEvent/NewTimelineSeasonEvent";
import TimelineSeasonEventsCell from "src/components/TimelineSeasonEvent/TimelineSeasonEventsCell";
import NewTimelineSeasonPerson from "src/components/TimelineSeasonPerson/NewTimelineSeasonPerson/NewTimelineSeasonPerson";
import TimelineSeasonPeopleCell from "src/components/TimelineSeasonPerson/TimelineSeasonPeopleCell";
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

  const servers = {
    "Elite Ark":
    {
      icon: "https://eliteark.com/wp-content/uploads/2022/06/cropped-0_ark-logo.thumb_.png.36427f75c51aff4ecec55bba50fd194d.png",
      badge: "rw-badge-blue-outline"
    },
    "Bloody Ark": {
      icon: "https://preview.redd.it/cdje2wcsmr521.png?width=313&format=png&auto=webp&s=bf1e8347b8dcd066bcf3aace6a461b61e804570b",
      badge: "rw-badge-red-outline"
    },

    Arkosic: {
      icon: "https://steamuserimages-a.akamaihd.net/ugc/2023839858710970915/3E075CEE248A0C9F9069EC7D12894F597E74A2CF/?imw=200&imh=200&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=true",
      badge: "rw-badge-green-outline"
    }
  };

  const [openModal, setOpenModal] = React.useState<'timelineseasonevent' | 'timelineseasonperson' | 'timelineseasonbasespot'>(null);

  return (
    <>
      <Modal
        isOpen={openModal === 'timelineseasonevent'}
        title="New TimelineSeasonEvent"
        onClose={() => setOpenModal(null)}
        content={<NewTimelineSeasonEvent timeline_season_id={timelineSeason.id} />}
        actions={[]}
      />
      <Modal
        isOpen={openModal === 'timelineseasonperson'}
        title="Add person"
        onClose={() => setOpenModal(null)}
        content={<NewTimelineSeasonPerson timeline_season_id={timelineSeason.id} />}
        actions={[]}
      />
      <Modal
        isOpen={openModal === 'timelineseasonbasespot'}
        title="Add Basespot"
        onClose={() => setOpenModal(null)}
        content={<NewTimelineSeasonPerson timeline_season_id={timelineSeason.id} />}
        actions={[]}
      />
      <header
        className="flex w-full flex-col justify-between rounded-lg bg-cover bg-center bg-no-repeat p-12 text-white"
        style={{
          backgroundImage:
            "url(https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/timelineimages/4/20210603185039_1.jpg)",
        }}
      >
        <div className="flex justify-between pb-5">
          <div className="text-xl font-bold uppercase tracking-widest">
            <span className="font-medium text-gray-900 dark:text-white align-middle">
              {timelineSeason.server} {timelineSeason.cluster && (
                <span className={`align-middle rw-badge ${servers[timelineSeason.server].badge}`}>
                  {timelineSeason.cluster} <span className="border-l mx-2 border-current"></span> Season {timelineSeason.season}
                </span>
              )}
            </span>
          </div>
          <div className="flex items-center text-sm opacity-50 space-x-3">
            {timeTag(timelineSeason.season_start_date)}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="w-5 fill-current">
              <path d="M272 249.4V128c0-8.844-7.156-16-16-16s-16 7.156-16 16v128c0 4.25 1.688 8.312 4.688 11.31l80 80C327.8 350.4 331.9 352 336 352s8.188-1.562 11.31-4.688c6.25-6.25 6.25-16.38 0-22.62L272 249.4zM255.1 0c-141.4 0-256 114.6-256 256s114.6 256 256 256s255.1-114.6 255.1-256S397.4 0 255.1 0zM256 480c-123.5 0-224-100.5-224-224s100.5-224 224-224s224 100.5 224 224S379.5 480 256 480z" />
            </svg>
          </div>
        </div>
        <div className="pt-12">
          <div className="mb-3 flex items-center space-x-1 opacity-75 [&>span:not(:last-child)]:after:content-[',']">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              className="mr-3 w-5 fill-current"
            >
              <path
                className="d"
                d="M19.22,9.66L10.77,1.21c-.74-.74-1.86-1.21-2.97-1.21H1.67C.75,0,0,.75,0,1.67V7.8c0,1.11,.46,2.23,1.3,2.97l8.45,8.46c1,1,2.62,1,3.62,0l5.94-5.95c.93-.93,.93-2.6-.09-3.62ZM6.96,6.35c-.59,.59-1.56,.59-2.15,0-.59-.59-.59-1.56,0-2.15,.59-.59,1.56-.59,2.15,0,.59,.59,.59,1.56,0,2.15Z"
              />
            </svg>
            {["Placeholder data", "Placeholder data"].map((tag) => (
              <span className="text-sm" key={tag}>
                {tag}
              </span>
            ))}
          </div>
          <h1 className="my-3 text-5xl font-bold">{timelineSeason.tribe_name}</h1>
        </div>
      </header>

      <div className="rw-segment flex gap-3 my-3">
        <div className="w-full flex-1 basis-32">
          <section className="w-full my-3 rounded-lg border border-zinc-500 bg-zinc-300 dark:bg-zinc-800 font-semibold text-black dark:text-white relative">
            <div className="w-full p-3 mb-0 inline-flex items-center space-x-3">
              <p className="underline underline-offset-8 flex-1">
                Basespots
              </p>
              <button
                className="relative flex h-5 w-5 items-center justify-center rounded-full border-none p-0 text-black ring-1 ring-black transition-all hover:rotate-45 hover:ring-2 dark:text-white dark:ring-white md:h-7 md:w-7"
                onClick={() => setOpenModal('timelineseasonbasespot')}
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
            <div className="grid h-fit grid-cols-4 gap-3 p-3">
              {/* TODO: move this to TimelineSeasonBasespots */}
              {timelineSeason.TimelineSeasonBasespot.map(
                ({ id, Map: { name } }) => (
                  <div className="flex justify-between border border-white rounded-lg">
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
          </section>

          <section className="w-full my-3 rounded-lg border border-zinc-500 bg-zinc-300 dark:bg-zinc-800 font-semibold text-black dark:text-white relative">
            <div className="w-full p-3 mb-0 inline-flex items-center space-x-3">
              <p className="underline underline-offset-8 flex-1">
                Persons in this season
              </p>
              <button
                className="relative flex h-5 w-5 items-center justify-center rounded-full border-none p-0 text-black ring-1 ring-black transition-all hover:rotate-45 hover:ring-2 dark:text-white dark:ring-white md:h-7 md:w-7"
                onClick={() => setOpenModal('timelineseasonperson')}
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
            <TimelineSeasonPeopleCell timeline_season_id={timelineSeason.id} />
          </section>

          <section></section>

        </div>



        <div className="h-screen grow-0 basis-72 pr-3 dark:text-white text-black my-3 space-y-3">
          <div className="flex justify-between items-center">
            <p>Bases</p>
          </div>
          <div className="py-3">
            <div className="text-xs">Today</div>
            <div className="mt-3 flex items-center rounded-lg dark:bg-zinc-600 bg-zinc-300 border border-zinc-500 p-2">
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
                  Crouch Cave
                </p>
                <p className="download-text-info m-0 w-36 overflow-hidden text-ellipsis whitespace-nowrap text-xs leading-4">

                </p>
              </div>
            </div>
          </div>


          <div className="flex justify-between items-center">
            <p>Events</p>
            <button
              className="relative flex h-5 w-5 items-center justify-center rounded-full border-none p-0 text-black ring-1 ring-black transition-all hover:rotate-45 hover:ring-2 dark:text-white dark:ring-white md:h-7 md:w-7"
              onClick={() => setOpenModal('timelineseasonevent')}
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
