import { Link, routes, navigate } from "@redwoodjs/router";
import { useMutation } from "@redwoodjs/web";
import { toast } from "@redwoodjs/web/toast";
import NewTimelineSeasonBasespot from "src/components/TimelineSeasonBasespot/NewTimelineSeasonBasespot/NewTimelineSeasonBasespot";
import TimelineSeasonBasespotsCell from "src/components/TimelineSeasonBasespot/TimelineSeasonBasespotsCell";
import NewTimelineSeasonEvent from "src/components/TimelineSeasonEvent/NewTimelineSeasonEvent/NewTimelineSeasonEvent";
import TimelineSeasonEventsCell from "src/components/TimelineSeasonEvent/TimelineSeasonEventsCell";
import NewTimelineSeasonPerson from "src/components/TimelineSeasonPerson/NewTimelineSeasonPerson/NewTimelineSeasonPerson";
import TimelineSeasonPeopleCell from "src/components/TimelineSeasonPerson/TimelineSeasonPeopleCell";
import { FormModal } from "src/components/Util/Modal/Modal";
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
    "Elite Ark": {
      icon: "https://eliteark.com/wp-content/uploads/2022/06/cropped-0_ark-logo.thumb_.png.36427f75c51aff4ecec55bba50fd194d.png",
      badge: "rw-badge-blue-outline",
    },
    "Bloody Ark": {
      icon: "https://preview.redd.it/cdje2wcsmr521.png?width=313&format=png&auto=webp&s=bf1e8347b8dcd066bcf3aace6a461b61e804570b",
      badge: "rw-badge-red-outline",
    },

    Arkosic: {
      icon: "https://steamuserimages-a.akamaihd.net/ugc/2023839858710970915/3E075CEE248A0C9F9069EC7D12894F597E74A2CF/?imw=200&imh=200&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=true",
      badge: "rw-badge-green-outline",
    },
  };

  const [openModal, setOpenModal] = React.useState<
    "timelineseasonevent" | "timelineseasonperson" | "timelineseasonbasespot"
  >(null);

  return (
    <>
      {/* TODO: add editforms here too */}

      <FormModal
        title={
          openModal === "timelineseasonperson"
            ? "Add person"
            : openModal === "timelineseasonbasespot"
            ? "Add Basespot"
            : openModal === "timelineseasonevent"
            ? "Add Event"
            : ""
        }
        isOpen={openModal !== null}
        onClose={() => setOpenModal(null)}
      >
        {openModal === "timelineseasonperson" && (
          <NewTimelineSeasonPerson timeline_season_id={timelineSeason.id} />
        )}
        {openModal === "timelineseasonbasespot" && (
          <NewTimelineSeasonBasespot timeline_season_id={timelineSeason.id} />
        )}
        {openModal === "timelineseasonevent" && (
          <NewTimelineSeasonEvent timeline_season_id={timelineSeason.id} />
        )}
      </FormModal>

      <header
        className="flex w-full flex-col justify-between rounded-lg bg-cover bg-center bg-no-repeat p-12 text-white"
        style={{
          backgroundImage:
            "url(https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/timelineimages/4/20210603185039_1.jpg)",
        }}
      >
        <div className="flex justify-between pb-5">
          <div className="text-xl font-bold uppercase tracking-widest">
            <span className="align-middle font-medium text-white">
              {timelineSeason.server}{" "}
              {timelineSeason.cluster && (
                <span
                  className={`rw-badge align-middle ${
                    servers[timelineSeason.server]?.badge
                  }`}
                >
                  {timelineSeason.cluster}{" "}
                  <span className="mx-2 border-l border-current"></span> Season{" "}
                  {timelineSeason.season}
                </span>
              )}
            </span>
          </div>
          <div className="flex items-center space-x-3 text-sm opacity-50">
            {timeTag(timelineSeason.season_start_date)}
            <span>-</span>
            {timeTag(timelineSeason.season_end_date)}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              className="w-5 fill-current"
            >
              <path d="M272 249.4V128c0-8.844-7.156-16-16-16s-16 7.156-16 16v128c0 4.25 1.688 8.312 4.688 11.31l80 80C327.8 350.4 331.9 352 336 352s8.188-1.562 11.31-4.688c6.25-6.25 6.25-16.38 0-22.62L272 249.4zM255.1 0c-141.4 0-256 114.6-256 256s114.6 256 256 256s255.1-114.6 255.1-256S397.4 0 255.1 0zM256 480c-123.5 0-224-100.5-224-224s100.5-224 224-224s224 100.5 224 224S379.5 480 256 480z" />
            </svg>
          </div>
        </div>
        <div className="pt-12">
          {/* <div className="mb-3 flex items-center space-x-1 opacity-75 [&>span:not(:last-child)]:after:content-[',']">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 448 512"
              className="mr-2 w-4 fill-current"
            >
              <path d="M431.6 225.6l-177.2-177.2c-9.021-9.021-26.84-16.4-39.6-16.4H28c-15.46 0-28 12.54-28 28v186.8c0 12.76 7.381 30.58 16.4 39.6l177.2 177.2C204.5 474.5 218.9 480 233.2 480c14.33 0 28.66-5.469 39.6-16.4l158.8-158.8C453.5 282.9 453.5 247.5 431.6 225.6zM408.1 282.2l-158.8 158.8C245.6 445.5 239.6 448 233.2 448c-6.412 0-12.44-2.496-16.97-7.029L39.03 263.8C36.01 260.8 32 251.1 32 246.8V64h182.8c4.273 0 13.95 4.006 16.97 7.029l177.2 177.2C413.5 252.8 416 258.8 416 265.2C416 271.6 413.5 277.6 408.1 282.2zM111.1 120c-13.25 0-24 10.74-24 24s10.75 24 24 24s24-10.74 24-24S125.2 120 111.1 120z" />
            </svg>
            {["Placeholder data", "Placeholder data"].map((tag) => (
              <span className="text-sm" key={tag}>
                {tag}
              </span>
            ))}
          </div> */}
          <h1 className="my-3 text-5xl font-bold">
            {timelineSeason.tribe_name}
          </h1>
        </div>
      </header>

      <div className="my-3 grid grid-flow-col grid-rows-4 gap-3">
        <section className="bg-accent-900 text-text relative col-span-3 row-span-2 w-full rounded-lg border border-zinc-500 font-semibold dark:bg-zinc-800 dark:text-white">
          <div className="mb-0 inline-flex w-full items-center space-x-3 p-3">
            <p className="flex-1 underline underline-offset-8">Basespots</p>
            <button
              className="relative flex h-5 w-5 items-center justify-center rounded-full border-none p-0 text-black ring-1 ring-black transition-all hover:rotate-45 hover:ring-2 dark:text-white dark:ring-white md:h-7 md:w-7"
              onClick={() => setOpenModal("timelineseasonbasespot")}
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

          <TimelineSeasonBasespotsCell timeline_season_id={timelineSeason.id} />
        </section>
        <section className="bg-background relative col-span-3 row-span-2 w-full rounded-lg border border-zinc-500 font-semibold text-black dark:bg-zinc-800 dark:text-white">
          <div className="mb-0 inline-flex w-full items-center space-x-3 p-3">
            <p className="flex-1 underline underline-offset-8">
              Persons in this season
            </p>
            <button
              className="relative flex h-5 w-5 items-center justify-center rounded-full border-none p-0 text-black ring-1 ring-black transition-all hover:rotate-45 hover:ring-2 dark:text-white dark:ring-white md:h-7 md:w-7"
              onClick={() => setOpenModal("timelineseasonperson")}
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
        <div className="row-span-4 mt-3 max-w-xs space-y-3 pr-3 text-black dark:text-white">
          <div className="flex items-center justify-between">
            <p>Events</p>
            <button
              className="relative flex h-5 w-5 items-center justify-center rounded-full border-none p-0 text-black ring-1 ring-black transition-all hover:rotate-45 hover:ring-2 dark:text-white dark:ring-white md:h-7 md:w-7"
              onClick={() => setOpenModal("timelineseasonevent")}
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
        </div>
      </div>

      {/* <div className="rw-segment my-3 flex gap-3">
        <div className="relative flex h-max min-h-full w-full flex-1 flex-grow flex-col">
          <section className="bg-accent-900 text-text relative w-full rounded-lg border border-zinc-500 font-semibold dark:bg-zinc-800 dark:text-white">
            <div className="mb-0 inline-flex w-full items-center space-x-3 p-3">
              <p className="flex-1 underline underline-offset-8">Basespots</p>
              <button
                className="relative flex h-5 w-5 items-center justify-center rounded-full border-none p-0 text-black ring-1 ring-black transition-all hover:rotate-45 hover:ring-2 dark:text-white dark:ring-white md:h-7 md:w-7"
                onClick={() => setOpenModal("timelineseasonbasespot")}
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

            <TimelineSeasonBasespotsCell
              timeline_season_id={timelineSeason.id}
            />
          </section>

          <section className="bg-background relative my-3 w-full rounded-lg border border-zinc-500 font-semibold text-black dark:bg-zinc-800 dark:text-white">
            <div className="mb-0 inline-flex w-full items-center space-x-3 p-3">
              <p className="flex-1 underline underline-offset-8">
                Persons in this season
              </p>
              <button
                className="relative flex h-5 w-5 items-center justify-center rounded-full border-none p-0 text-black ring-1 ring-black transition-all hover:rotate-45 hover:ring-2 dark:text-white dark:ring-white md:h-7 md:w-7"
                onClick={() => setOpenModal("timelineseasonperson")}
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
        </div>

        <div className="my-3 h-fit grow-0 basis-72 space-y-3 pr-3 text-black dark:text-white">
          <div className="flex items-center justify-between">
            <p>Events</p>
            <button
              className="relative flex h-5 w-5 items-center justify-center rounded-full border-none p-0 text-black ring-1 ring-black transition-all hover:rotate-45 hover:ring-2 dark:text-white dark:ring-white md:h-7 md:w-7"
              onClick={() => setOpenModal("timelineseasonevent")}
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
        </div>
      </div> */}
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
