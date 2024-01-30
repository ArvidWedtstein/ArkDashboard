import { Link, routes } from "@redwoodjs/router";
import { useMutation } from "@redwoodjs/web";
import { toast } from "@redwoodjs/web/toast";
import { useRef, useState } from "react";

import { QUERY } from "src/components/TimelineSeasonPerson/TimelineSeasonPeopleCell";
import { Dialog, DialogActions, DialogContent, DialogTitle } from "src/components/Util/Dialog/Dialog";
import Toast from "src/components/Util/Toast/Toast";

import type {
  CreateTimelineSeasonPersonInput,
  FindTimelineSeasonPeople,
} from "types/graphql";
import Button from "src/components/Util/Button/Button";
import TimelineSeasonPersonForm from "../TimelineSeasonPersonForm/TimelineSeasonPersonForm";
import { ArrayElement } from "src/lib/formatters";
import { Card, CardContent, CardHeader } from "src/components/Util/Card/Card";

const CREATE_TIMELINE_SEASON_PERSON_MUTATION = gql`
  mutation CreateTimelineSeasonPersonMutation(
    $input: CreateTimelineSeasonPersonInput!
  ) {
    createTimelineSeasonPerson(input: $input) {
      id
    }
  }
`

const UPDATE_TIMELINE_SEASON_PERSON_MUTATION = gql`
  mutation UpdateTimelineSeasonPersonMutation(
    $id: String!
    $input: UpdateTimelineSeasonPersonInput!
  ) {
    updateTimelineSeasonPerson(id: $id, input: $input) {
      id
      created_at
      updated_at
      user_id
      ingame_name
      timeline_season_id
      permission
    }
  }
`;

const DELETE_TIMELINE_SEASON_PERSON_MUTATION = gql`
  mutation DeleteTimelineSeasonPersonMutation($id: String!) {
    deleteTimelineSeasonPerson(id: $id) {
      id
    }
  }
`;

const TimelineSeasonPeopleList = ({
  timelineSeasonPeople,
  profiles,
}: FindTimelineSeasonPeople) => {
  const [openModal, setOpenModal] = useState<{ open: boolean, person: ArrayElement<FindTimelineSeasonPeople["timelineSeasonPeople"]> }>({ open: false, person: null });
  const modalRef = useRef<HTMLDivElement>();


  const [createTimelineSeasonPerson, { loading: createLoading, error: createError }] = useMutation(
    CREATE_TIMELINE_SEASON_PERSON_MUTATION,
    {
      onCompleted: () => {
        toast.success('TimelineSeasonPerson created')
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const [updateTimelineSeasonPerson, { loading: updateLoading, error: updateError }] = useMutation(
    UPDATE_TIMELINE_SEASON_PERSON_MUTATION,
    {
      onCompleted: () => {
        toast.success("TimelineSeasonPerson updated");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }
  );

  const [deleteTimelineSeasonPerson, { loading: deleteLoading, error: deleteError }] = useMutation(
    DELETE_TIMELINE_SEASON_PERSON_MUTATION,
    {
      onCompleted: () => {
        toast.success("Person removed");
      },
      onError: (error) => {
        toast.error(error.message);
      },
      // This refetches the query on the list page. Read more about other ways to
      // update the cache over here:
      // https://www.apollographql.com/docs/react/data/mutations/#making-all-other-cache-updates
      refetchQueries: [
        {
          query: QUERY,
          variables: {
            timeline_season_id: timelineSeasonPeople[0].timeline_season_id,
          },
        },
      ],
      awaitRefetchQueries: true,
    }
  );

  const onSave = (input: CreateTimelineSeasonPersonInput, id: ArrayElement<FindTimelineSeasonPeople["timelineSeasonPeople"]>["id"]) => {
    toast.promise(id ? updateTimelineSeasonPerson({ variables: { id, input } }) : createTimelineSeasonPerson({ variables: { input } }), {
      loading: `${id ? 'Updating' : 'Adding new'} person...`,
      success: `Person successfully ${id ? 'updated' : 'added'}`,
      error: `Failed to ${id ? 'update' : 'add'} person.`,
    });
  }

  return (
    <Card variant="outlined" className="col-span-5 row-span-1">
      <CardHeader
        title={`Persons in this season`}
        titleProps={{
          className: 'text-lg'
        }}
        action={(
          <Button variant="outlined" onClick={() => setOpenModal({ open: true, person: null })} className="!rounded-circle !px-[5px] [&:hover>svg]:rotate-45" color="DEFAULT" centerRipple={true}>
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
      <CardContent>
        <div className="flex justify-start gap-3 overflow-x-auto px-6">
          <Dialog ref={modalRef} open={openModal.open} onClose={() => setOpenModal({ open: false, person: null })}>
            <DialogTitle>
              {openModal.person !== null ? 'Edit' : 'New'} person
            </DialogTitle>
            <DialogContent dividers>
              <TimelineSeasonPersonForm
                timeline_season_id={timelineSeasonPeople[0].timeline_season_id}
                timelineSeasonPerson={openModal?.person}
                profiles={profiles}
                onSave={onSave}
                loading={createLoading || updateLoading || deleteLoading}
                error={createError || updateError || deleteError}
              />
            </DialogContent>
            <DialogActions className="space-x-1">
              {openModal?.person && (
                <Button
                  type="reset"
                  color="error"
                  className="mr-auto"
                  permission="timeline_delete"
                  onClick={() => toast.custom((t) => (
                    <Toast
                      t={t}
                      title={`You're about to remove ${openModal.person.ingame_name}`}
                      message={`Are you sure you want to remove ${openModal.person.ingame_name} ${openModal.person.permission == "guest" ? "as guest?" : "from the tribe?"}`}
                      primaryAction={() => {
                        toast.promise(
                          deleteTimelineSeasonPerson({ variables: { id: openModal.person?.id } }),
                          {
                            loading: "Removing user...",
                            success: `Successfully removed ${openModal.person.ingame_name}`,
                            error: `Failed to remove ${openModal.person.ingame_name}`,
                          }
                        );
                      }}
                      actionType="YesNo"
                    />
                  ))}
                  startIcon={
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                      <path d="M432 64h-96l-33.63-44.75C293.4 7.125 279.1 0 264 0h-80C168.9 0 154.6 7.125 145.6 19.25L112 64h-96C7.201 64 0 71.2 0 80c0 8.799 7.201 16 16 16h416c8.801 0 16-7.201 16-16C448 71.2 440.8 64 432 64zM152 64l19.25-25.62C174.3 34.38 179 32 184 32h80c5 0 9.75 2.375 12.75 6.375L296 64H152zM400 128C391.2 128 384 135.2 384 144v288c0 26.47-21.53 48-48 48h-224C85.53 480 64 458.5 64 432v-288C64 135.2 56.84 128 48 128S32 135.2 32 144v288C32 476.1 67.89 512 112 512h224c44.11 0 80-35.89 80-80v-288C416 135.2 408.8 128 400 128zM144 416V192c0-8.844-7.156-16-16-16S112 183.2 112 192v224c0 8.844 7.156 16 16 16S144 424.8 144 416zM240 416V192c0-8.844-7.156-16-16-16S208 183.2 208 192v224c0 8.844 7.156 16 16 16S240 424.8 240 416zM336 416V192c0-8.844-7.156-16-16-16S304 183.2 304 192v224c0 8.844 7.156 16 16 16S336 424.8 336 416z" />
                    </svg>
                  }
                >
                  Delete
                </Button>
              )}
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
                onClick={() => setOpenModal({ open: false, person: null })}
              >
                Cancel
              </Button>
            </DialogActions>
          </Dialog>

          {timelineSeasonPeople.map(
            ({ id, user_id, ingame_name, Profile, permission, ...other }) => (
              <button className="relative flex-none py-6 px-3" key={id}>
                <div className="flex flex-col items-center justify-center gap-3">
                  <img
                    className="relative h-16 w-16 rounded-full transition duration-150 ease-in-out hover:ring hover:ring-red-500"
                    src={
                      Profile?.avatar_url
                        ? `https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/avatars/${Profile.avatar_url}`
                        : `https://ui-avatars.com/api/?name=${ingame_name}`
                    }
                    onClick={() => setOpenModal({ open: true, person: { id, ingame_name, user_id, permission, ...other } })}
                  />
                  <div className="inline-flex gap-x-1 items-center justify-center">
                    <strong className="text-xs font-medium text-slate-900 dark:text-slate-200" title={`Role: ${permission}`}>
                      {Profile ? (
                        <Link to={routes.profile({ id: user_id })}>
                          {Profile.username || ingame_name}
                        </Link>
                      ) : (
                        ingame_name
                      )}
                    </strong>
                    {permission == 'guest' && <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" className="w-3 h-3" fill="currentColor"><path d="M315.1 271l-70.56-112.1C232.8 139.3 212.5 128 190.3 128H129.7c-22.22 0-42.53 11.25-54.28 30.09L4.873 271c-9.375 14.98-4.812 34.72 10.16 44.09c15 9.375 34.75 4.812 44.09-10.19l28.88-46.18L87.1 480c0 17.67 14.33 32 32 32c17.67 0 31.1-14.33 31.1-32l0-144h16V480c0 17.67 14.33 32 32 32c17.67 0 32-14.33 32-32V258.8l28.88 46.2C266.9 314.7 277.4 320 288 320c5.781 0 11.66-1.562 16.94-4.859C319.9 305.8 324.5 286 315.1 271zM160 96c26.5 0 48-21.5 48-48S186.5 0 160 0C133.5 0 112 21.5 112 48S133.5 96 160 96z" /></svg>}
                  </div>
                </div>
              </button>
            )
          )}
        </div>
      </CardContent>
    </Card >
  );
};

export default TimelineSeasonPeopleList;
