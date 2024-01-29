import { Link, routes, navigate } from "@redwoodjs/router";
import { useMutation } from "@redwoodjs/web";
import { toast } from "@redwoodjs/web/toast";
import { Fragment, useRef, useState } from "react";
import NewTimelineSeasonBasespotCell from "src/components/TimelineSeasonBasespot/NewTimelineSeasonBasespotCell";
import TimelineSeasonBasespotsCell from "src/components/TimelineSeasonBasespot/TimelineSeasonBasespotsCell";
import NewTimelineSeasonEventCell from "src/components/TimelineSeasonEvent/NewTimelineSeasonEventCell";
import EditTimelineSeasonEventCell from "src/components/TimelineSeasonEvent/EditTimelineSeasonEventCell";
import TimelineSeasonEventsCell from "src/components/TimelineSeasonEvent/TimelineSeasonEventsCell";
import TimelineSeasonPeopleCell from "src/components/TimelineSeasonPerson/TimelineSeasonPeopleCell";
import { timeTag } from "src/lib/formatters";

import type {
  DeleteTimelineSeasonMutationVariables,
  FindTimelineSeasonById,
} from "types/graphql";
import Toast from "src/components/Util/Toast/Toast";
import Button, { ButtonGroup } from "src/components/Util/Button/Button";
import SplitPane from "src/components/Util/SplitPane/SplitPane";
import Badge from "src/components/Util/Badge/Badge";
import { Dialog, DialogActions, DialogContent, DialogTitle } from "src/components/Util/Dialog/Dialog";
import { Card, CardContent, CardHeader, CardMedia } from "src/components/Util/Card/Card";

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
      navigate(routes.timelineSeasons());
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onDeleteClick = (id: DeleteTimelineSeasonMutationVariables["id"]) => {
    toast.custom((t) => (
      <Toast
        t={t}
        title={
          <span>
            You're about to delete season <b>{id}</b>
          </span>
        }
        message={`Are you sure you want to delete timelineSeason ${id}?`}
        primaryAction={() => {
          toast.promise(deleteTimelineSeason({ variables: { id } }), {
            loading: "deleting season...",
            success: `Successfully deleted season`,
            error: `Failed to delete season`,
          });
        }}
        actionType="OkCancel"
      />
    ));
  };

  // TODO: remove this hardcode
  const servers = {
    "Elite Ark": {
      icon: "https://eliteark.com/wp-content/uploads/2022/06/cropped-0_ark-logo.thumb_.png.36427f75c51aff4ecec55bba50fd194d.png",
      badge: "info",
    },
    "Bloody Ark": {
      icon: "https://preview.redd.it/cdje2wcsmr521.png?width=313&format=png&auto=webp&s=bf1e8347b8dcd066bcf3aace6a461b61e804570b",
      badge: "error",
    },
    "Mesa Ark": {
      icon: "https://mesa-ark.com/images/MESA_Icon.png",
      badge: "warning",
    },
    Arkosic: {
      icon: "https://steamuserimages-a.akamaihd.net/ugc/2023839858710970915/3E075CEE248A0C9F9069EC7D12894F597E74A2CF/?imw=200&imh=200&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=true",
      badge: "success",
    },
  };
  type modalType =
    | "timelineseasonevent"
    | "timelineseasonbasespot"
    | "editevent"
    | "previewimage";
  const [editEvent, setEditEvent] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState<modalType>(null);
  const modalRef = useRef<HTMLDivElement>();

  return (
    <article>
      <Dialog ref={modalRef} open={openModal !== null} onClose={() => setOpenModal(null)}>
        <DialogTitle>
          {openModal === "timelineseasonbasespot"
            ? "Add Basespot"
            : openModal === "timelineseasonevent"
              ? "Add Event"
              : openModal === 'editevent'
                ? 'Edit Event'
                : ''}
        </DialogTitle>
        <Button
          variant="icon"
          color="DEFAULT"
          size="small"
          className="!absolute right-2 top-2 w-8 m-1"
          onClick={() => setOpenModal(null)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
            <path d="M315.3 411.3c-6.253 6.253-16.37 6.253-22.63 0L160 278.6l-132.7 132.7c-6.253 6.253-16.37 6.253-22.63 0c-6.253-6.253-6.253-16.37 0-22.63L137.4 256L4.69 123.3c-6.253-6.253-6.253-16.37 0-22.63c6.253-6.253 16.37-6.253 22.63 0L160 233.4l132.7-132.7c6.253-6.253 16.37-6.253 22.63 0c6.253 6.253 6.253 16.37 0 22.63L182.6 256l132.7 132.7C321.6 394.9 321.6 405.1 315.3 411.3z" />
          </svg>
        </Button>
        <DialogContent dividers>
          {openModal === "timelineseasonbasespot" && (
            <NewTimelineSeasonBasespotCell
              timeline_season_id={timelineSeason.id}
            />
          )}
          {openModal === "timelineseasonevent" && (
            <NewTimelineSeasonEventCell timeline_season_id={timelineSeason.id} />
          )}
          {openModal === "editevent" && (
            <EditTimelineSeasonEventCell
              id={editEvent}
              timeline_season_id={timelineSeason.id}
            />
          )}
          {openModal === "previewimage" && (
            <img src={editEvent} className="w-full rounded" />
          )}
        </DialogContent>
        <DialogActions className="space-x-1">
          <Button
            type="button"
            color="success"
            variant="contained"
            onClick={() => {
              if (modalRef?.current) {
                modalRef.current.querySelector("form")?.requestSubmit();
              }
            }}
            startIcon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
                className="pointer-events-none"
                fill="currentColor"
              >
                <path d="M350.1 55.44C334.9 40.33 314.9 32 293.5 32H80C35.88 32 0 67.89 0 112v288C0 444.1 35.88 480 80 480h288c44.13 0 80-35.89 80-80V186.5c0-21.38-8.312-41.47-23.44-56.58L350.1 55.44zM96 64h192v96H96V64zM416 400c0 26.47-21.53 48-48 48h-288C53.53 448 32 426.5 32 400v-288c0-20.83 13.42-38.43 32-45.05V160c0 17.67 14.33 32 32 32h192c17.67 0 32-14.33 32-32V72.02c2.664 1.758 5.166 3.771 7.438 6.043l74.5 74.5C411 161.6 416 173.7 416 186.5V400zM224 240c-44.13 0-80 35.89-80 80s35.88 80 80 80s80-35.89 80-80S268.1 240 224 240zM224 368c-26.47 0-48-21.53-48-48S197.5 272 224 272s48 21.53 48 48S250.5 368 224 368z" />
              </svg>
            }
          >
            Save
          </Button>
          <Button
            type="reset"
            color="error"
            onClick={() => setOpenModal(null)}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      <Card variant="outlined" className="h-80 z-0">
        <CardHeader
          style={{
            zIndex: 10,
            backgroundImage:
              "linear-gradient(-2deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.3) 20%, rgba(0,0,0,0.3) 40%, rgba(0,0,0,0.7) 100%)",
          }}
          title={(
            <div className="inline-flex space-x-1 items-center">
              <span>{timelineSeason.server}</span>
              {timelineSeason.cluster && (
                <Badge
                  standalone
                  variant="outlined"
                  color={servers[timelineSeason.server]?.badge || 'DEFAULT'}
                  content={(
                    <Fragment>
                      {timelineSeason.cluster}
                      <div role="seperator" className="rw-divider bg-current mx-1" />
                      Season
                      {timelineSeason.season}
                    </Fragment>
                  )}
                />
              )}
            </div>
          )}
          subheader={(
            <div className="flex items-center space-x-3 text-sm mt-1">
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
          )}
          action={(
            <ButtonGroup>
              <Button
                permission="timeline_update"
                color="primary"
                variant="outlined"
                to={routes.editTimelineSeason({
                  id: timelineSeason.id,
                })}
                startIcon={
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                    <path d="M493.2 56.26l-37.51-37.51C443.2 6.252 426.8 0 410.5 0c-16.38 0-32.76 6.25-45.26 18.75L45.11 338.9c-8.568 8.566-14.53 19.39-17.18 31.21l-27.61 122.8C-1.7 502.1 6.158 512 15.95 512c1.047 0 2.116-.1034 3.198-.3202c0 0 84.61-17.95 122.8-26.93c11.54-2.717 21.87-8.523 30.25-16.9l321.2-321.2C518.3 121.7 518.2 81.26 493.2 56.26zM149.5 445.2c-4.219 4.219-9.252 7.039-14.96 8.383c-24.68 5.811-69.64 15.55-97.46 21.52l22.04-98.01c1.332-5.918 4.303-11.31 8.594-15.6l247.6-247.6l82.76 82.76L149.5 445.2zM470.7 124l-50.03 50.02l-82.76-82.76l49.93-49.93C393.9 35.33 401.9 32 410.5 32s16.58 3.33 22.63 9.375l37.51 37.51C483.1 91.37 483.1 111.6 470.7 124z" />
                  </svg>
                }
              >
                Edit
              </Button>
              <Button
                permission="timeline_delete"
                color="error"
                variant="outlined"
                onClick={() => onDeleteClick(timelineSeason.id)}
                startIcon={
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                    <path d="M432 64h-96l-33.63-44.75C293.4 7.125 279.1 0 264 0h-80C168.9 0 154.6 7.125 145.6 19.25L112 64h-96C7.201 64 0 71.2 0 80c0 8.799 7.201 16 16 16h416c8.801 0 16-7.201 16-16C448 71.2 440.8 64 432 64zM152 64l19.25-25.62C174.3 34.38 179 32 184 32h80c5 0 9.75 2.375 12.75 6.375L296 64H152zM400 128C391.2 128 384 135.2 384 144v288c0 26.47-21.53 48-48 48h-224C85.53 480 64 458.5 64 432v-288C64 135.2 56.84 128 48 128S32 135.2 32 144v288C32 476.1 67.89 512 112 512h224c44.11 0 80-35.89 80-80v-288C416 135.2 408.8 128 400 128zM144 416V192c0-8.844-7.156-16-16-16S112 183.2 112 192v224c0 8.844 7.156 16 16 16S144 424.8 144 416zM240 416V192c0-8.844-7.156-16-16-16S208 183.2 208 192v224c0 8.844 7.156 16 16 16S240 424.8 240 416zM336 416V192c0-8.844-7.156-16-16-16S304 183.2 304 192v224c0 8.844 7.156 16 16 16S336 424.8 336 416z" />
                  </svg>
                }
              >
                Delete
              </Button>
            </ButtonGroup>
          )}
        />
        <CardContent className="z-10 text-right float-right">
          <h1 className="text-5xl mt-12 rounded my-auto font-bold text-white">
            {timelineSeason.tribe_name}
          </h1>
        </CardContent>
        <CardMedia
          style={{
            objectFit: "fill",
            backgroundPosition: '100% 50%',
            backgroundSize: 'cover',
            position: "absolute",
            backgroundRepeat: 'no-repeat',
            backgroundImage: `https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/timelineimages/4/20210603185039_1.jpg`,
            inset: 0,
            zIndex: -1,
          }}
          component="div"
          image={`https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/timelineimages/4/20210603185039_1.jpg`}
        />
      </Card>

      <div className="relative my-3 grid w-full grid-flow-row grid-cols-4 gap-3 md:grid-cols-6">
        <Card variant="outlined" className="col-span-5 row-span-3">
          <CardHeader
            title={`Bases in this season`}
            titleProps={{
              className: 'text-lg'
            }}
            action={(
              <Button variant="outlined" onClick={() => setOpenModal("timelineseasonbasespot")} className="!rounded-circle !px-[5px] [&:hover>svg]:rotate-45" color="DEFAULT" centerRipple={true}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 448 512"
                  fill="currentColor"
                  className="h-5 w-5 transition-transform ease-in-out"
                >
                  <path d="M432 256C432 264.8 424.8 272 416 272h-176V448c0 8.844-7.156 16.01-16 16.01S208 456.8 208 448V272H32c-8.844 0-16-7.15-16-15.99C16 247.2 23.16 240 32 240h176V64c0-8.844 7.156-15.99 16-15.99S240 55.16 240 64v176H416C424.8 240 432 247.2 432 256z" />
                </svg>
              </Button>
            )}
          />
          <CardContent className="grid h-fit grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
            <TimelineSeasonBasespotsCell timeline_season_id={timelineSeason.id} />
          </CardContent>
        </Card>

        <Card className="col-span-1 row-span-4 flex-auto relative w-full" variant="outlined">
          <CardHeader
            title={`Events`}
            titleProps={{
              className: 'text-lg'
            }}
            action={(
              <Button variant="outlined" onClick={() => setOpenModal("timelineseasonevent")} className="!rounded-circle !px-[5px] [&:hover>svg]:rotate-45" color="DEFAULT" centerRipple={true}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 448 512"
                  fill="currentColor"
                  className="h-5 w-5 transition-transform ease-in-out"
                >
                  <path d="M432 256C432 264.8 424.8 272 416 272h-176V448c0 8.844-7.156 16.01-16 16.01S208 456.8 208 448V272H32c-8.844 0-16-7.15-16-15.99C16 247.2 23.16 240 32 240h176V64c0-8.844 7.156-15.99 16-15.99S240 55.16 240 64v176H416C424.8 240 432 247.2 432 256z" />
                </svg>
              </Button>
            )}
          />
          <CardContent className="py-0 pr-0 space-y-3">
            <TimelineSeasonEventsCell
              timeline_season_id={timelineSeason.id}
              setOpenModal={(id, type) => {
                setOpenModal(type);
                setEditEvent(id);
              }}
            />
          </CardContent>
        </Card>


        <TimelineSeasonPeopleCell timeline_season_id={timelineSeason.id} />
      </div>
    </article>
  );
};

export default TimelineSeason;
