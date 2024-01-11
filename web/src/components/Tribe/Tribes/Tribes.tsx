import { toast } from "@redwoodjs/web/toast";
import { useRef, useState } from "react";
import { useAuth } from "src/auth";
import Table from "src/components/Util/Table/Table";
import { ArrayElement, getISOWeek, pluralize, timeTag } from "src/lib/formatters";
import { CreateTribeMutationVariables, type CreateTribeInput, type Exact, type FindTribes, type Tribe, type permission, CreateTribeMutation, UpdateTribeMutation, DeleteTribeMutation, UpdateTribeMutationVariables, UpdateTribeInput } from "types/graphql";
import Popper from "src/components/Util/Popper/Popper";
import ClickAwayListener from "src/components/Util/ClickAwayListener/ClickAwayListener";
import { Card, CardActionArea } from "src/components/Util/Card/Card";
import { Dialog, DialogActions, DialogContent, DialogTitle } from "src/components/Util/Dialog/Dialog";
import Button from "src/components/Util/Button/Button";
import List, { ListItem } from "src/components/Util/List/List";
import TribeForm from "../TribeForm/TribeForm";
import { useMutation } from "@redwoodjs/web";
import Toast from "src/components/Util/Toast/Toast";
import { QUERY } from "../TribesCell";

const CREATE_TRIBE_MUTATION = gql`
  mutation CreateTribeMutation($input: CreateTribeInput!) {
    createTribe(input: $input) {
      id
      name
      created_at
      updated_at
      created_by
      Profile {
        id
        full_name
        avatar_url
      }
    }
  }
`;

const UPDATE_TRIBE_MUTATION = gql`
  mutation UpdateTribeMutation($id: String!, $input: UpdateTribeInput!) {
    updateTribe(id: $id, input: $input) {
      id
      name
      created_at
      updated_at
      created_by
      Profile {
        id
        full_name
        avatar_url
      }
    }
  }
`;


const DELETE_TRIBE_MUTATION = gql`
  mutation DeleteTribeMutation($id: String!) {
    deleteTribe(id: $id) {
      id
    }
  }
`;


type Props = {
  tribes: FindTribes["tribes"];
  queryResult?: Partial<Omit<QueryOperationResult<FindTribes, Exact<{
    [key: string]: never;
  }>>, "loading" | "error" | "data">>
  updating?: boolean
}
const TribesList = ({ tribes, queryResult }: Props) => {
  const { currentUser } = useAuth();

  const [anchorRef, setAnchorRef] = useState<{
    element: HTMLButtonElement | null;
    row_id: ArrayElement<FindTribes["tribes"]>["id"];
    open: boolean;
  }>({ element: null, row_id: null, open: false });

  const [openModal, setOpenModal] = useState<{
    open: boolean;
    edit?: boolean,
    tribe?: ArrayElement<FindTribes["tribes"]>
  }>({
    open: false,
    edit: false,
    tribe: null
  });
  const modalRef = useRef<HTMLDivElement>();

  const filterDatesByCurrentWeek = (dates: FindTribes["tribes"]) => {
    return dates.filter(
      (d) => getISOWeek(new Date()) === getISOWeek(new Date(d.created_at))
    );
  };

  const handleClose = (event: React.MouseEvent<Document>) => {
    if (
      anchorRef?.element &&
      anchorRef.element.contains(event.target as HTMLElement)
    ) {
      return;
    }

    setAnchorRef({ element: null, open: false, row_id: null });
  };

  /**
   * RefetchQueries in Apollo Client is a mechanism to refetch specific queries after a mutation is performed.
   * It allows you to specify the queries that should be refetched to update the client-side cache with the latest data.
   * By default, when you use refetchQueries, the specified queries will be refetched in their entirety,
   * meaning they will request all the data from the server again.
   * This is because Apollo Client assumes that the entire query data might be affected by the mutation, and it refreshes the entire query result.
   * If you want to refetch only specific fields or get only the modified data, you might consider using the update function within the mutation.
   * The update function allows you to manually update the cache with the new data that was returned from the mutation.
   */
  const [createTribe, { loading: loadingCreate, error: errorCreate }] = useMutation<CreateTribeMutation, CreateTribeMutationVariables>(CREATE_TRIBE_MUTATION, {
    update: (cache, { data: { createTribe } }) => {
      const existingData = cache.readQuery<FindTribes>({ query: QUERY });
      if (existingData && createTribe) {
        cache.writeQuery({
          query: QUERY,
          data: {
            ...existingData,
            tribes: [...existingData.tribes, createTribe]
          }
        });
      }
    },
    onCompleted: () => {
      setOpenModal({ open: false, edit: false, tribe: null });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const [updateTribe, { loading, error }] = useMutation<UpdateTribeMutation, UpdateTribeMutationVariables>(UPDATE_TRIBE_MUTATION, {
    update: (cache, { data: { updateTribe } }) => {
      const existingData = cache.readQuery({ query: QUERY });

      if (existingData && updateTribe) {
        cache.modify({
          id: cache.identify(updateTribe),
          fields: {
            name: () => updateTribe.name,
          }
        })
      }
    },
    onCompleted: () => {
      setOpenModal({ open: false, edit: false, tribe: null })
    },
    onError: (error) => {
      toast.error(error.message);
    },
    // refetchQueries: [{ query: QUERY }],
    // awaitRefetchQueries: true,
  });

  // https://shopify.engineering/apollo-cache

  const [deleteTribe] = useMutation<DeleteTribeMutation>(DELETE_TRIBE_MUTATION, {
    update: (cache, { data: { deleteTribe: deletedTribe } }) => {
      const existingData = cache.readQuery({ query: QUERY });
      if (existingData && deletedTribe) {
        cache.writeQuery({
          query: QUERY,
          data: {
            tribes: existingData["tribes"]?.filter((tribe) => tribe.id !== deletedTribe?.id)
          }
        })
      }
    },
    onCompleted: () => {
      toast.success("Tribe deleted");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onDeleteClick = async (tribe: ArrayElement<FindTribes["tribes"]>) => {
    if (!currentUser?.permissions.some((p: permission) => p === "tribe_delete")) return;

    await toast.custom((t) => (
      <Toast
        t={t}
        title={`Confirm deletion`}
        message={`Are you sure you want to delete '${tribe.name}' tribe?`}
        primaryAction={() => deleteTribe({ variables: { id: tribe.id } })}
        actionType="YesNo"
      />
    ));
  };

  const onSave = (input: CreateTribeInput, id?: Tribe["id"]) => {
    if (openModal.edit) {
      toast.promise(updateTribe({ variables: { id, input } }), {
        loading: `${openModal.edit ? 'Updating' : 'Creating new'} tribe...`,
        success: `Tribe successfully ${openModal.edit ? 'updated' : 'created'}`,
        error: <b>Failed to {openModal.edit ? 'update' : 'create new'} Tribe.</b>,
      });
    } else {
      toast.promise(createTribe({ variables: { input } }), {
        loading: `${openModal.edit ? 'Updating' : 'Creating new'} tribe...`,
        success: `Tribe successfully ${openModal.edit ? 'updated' : 'created'}`,
        error: <b>Failed to {openModal.edit ? 'update' : 'create new'} Tribe.</b>,
      });
    }
  };

  return (
    <div className="relative">
      <Dialog ref={modalRef} open={openModal.open} onClose={() => setOpenModal({ open: false, edit: false, tribe: null })}>
        <DialogTitle>{openModal.edit ? 'Edit' : 'Add New'} Tribe</DialogTitle>
        <DialogContent dividers>
          <TribeForm
            tribe={openModal.tribe ? { id: openModal.tribe.id, name: openModal.tribe.name, created_at: openModal.tribe.created_at } : null}
            onSave={onSave}
            loading={loading || loadingCreate}
            error={error || errorCreate}
          />
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
            onClick={() => setOpenModal({ open: false, edit: false })}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 my-2">
        <Card className="hover:ring-pea-400 transition ease-in-out duration-100 focus:ring-pea-400 hover:shadow-sm dark:ring-pea-600 ring-1 ring-zinc-500 disabled:ring-transparent shadow-lg">
          <CardActionArea
            className="relative flex m-0 justify-start items-center w-full h-full p-4"
            onClick={() => setOpenModal({ open: true, edit: false })}
            disabled={
              !currentUser ||
              !currentUser?.permissions?.some(
                (p: permission) => p === "tribe_create"
              )
            }
          >
            <div className="dark:border-pea-400 border-pea-100 bg-pea-50 flex !h-12 !w-12 items-center justify-center rounded-full border-2 dark:bg-zinc-800">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
                className="text-pea-500 fill-pea-500 !h-6 !w-6"
              >
                <path d="M432 256C432 264.8 424.8 272 416 272h-176V448c0 8.844-7.156 16.01-16 16.01S208 456.8 208 448V272H32c-8.844 0-16-7.15-16-15.99C16 247.2 23.16 240 32 240h176V64c0-8.844 7.156-15.99 16-15.99S240 55.16 240 64v176H416C424.8 240 432 247.2 432 256z" />
              </svg>
            </div>
            <span className="ml-3">Add a new tribe</span>
          </CardActionArea>
        </Card>

        <Card className="hover:ring-pea-400 transition ease-in-out duration-100 focus:ring-pea-400 hover:shadow-sm dark:ring-pea-600 ring-1 ring-zinc-500 disabled:ring-transparent shadow-lg">
          <CardActionArea
            className="relative flex m-0 justify-start items-center w-full h-full p-4"
            onClick={() => {
              const randomIndex = Math.floor(Math.random() * tribes.length);
              const randomTribe = tribes[randomIndex];
              toast.success(`You've been assigned to ${randomTribe.name}!`);
            }}
          >
            <div className="dark:border-pea-400 border-pea-100 bg-pea-50 flex aspect-square !h-12 !w-12 items-center justify-center rounded-full border-2 dark:bg-zinc-800">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 320 512"
                className="text-pea-500 fill-pea-500 !h-6 !w-6"
              >
                <path d="M213.1 32H106.7C47.84 32 0 79.84 0 138.7V160c0 8.844 7.156 16 16 16S32 168.9 32 160V138.7C32 97.48 65.5 64 106.7 64h106.5C254.4 64 288 97.58 288 138.9c0 27-14.62 52-38.16 65.25L152.5 258.9C137.4 267.4 128 283.4 128 300.7V336c0 8.844 7.156 16.01 16 16.01S160 344.8 160 336V300.7c0-5.766 3.125-11.11 8.156-13.95l97.38-54.78C299.1 213.1 320 177.4 320 138.9C320 79.94 272.1 32 213.1 32zM144 400c-17.67 0-32 14.32-32 31.99s14.33 32 32 32s32-14.33 32-32S161.7 400 144 400z" />
              </svg>
            </div>
            <span className="ml-3">Pick random tribe name</span>
          </CardActionArea>
        </Card>

        <Card className="flex justify-start space-x-4 items-center p-4 transition ease-in-out duration-100 ring-1 ring-zinc-500 disabled:ring-transparent shadow-lg">
          <div className="border-pea-100 bg-pea-50 dark:border-pea-400 flex h-12 w-12 items-center justify-center rounded-full border-2 dark:bg-zinc-800">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="text-pea-500 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
              />
            </svg>
          </div>
          <div>
            <h2 className="font-semibold text-gray-700 dark:text-white">
              {pluralize(filterDatesByCurrentWeek(tribes).length, "Tribe")}
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-stone-200">
              Created this week
            </p>
          </div>
        </Card>
      </div>

      <div className="">
        <Table
          checkSelect
          settings={{
            filter: true,
            search: true,
            export: true,
            header: true,
            pagination: {
              rowsPerPage: 10,
              enabled: true,
              pageSizeOptions: [10, 25, 50, 100],
            },
          }}
          columns={[
            {
              field: "name",
              header: "Name",
              sortable: true,
              width: 50,
            },
            {
              field: "created_at",
              header: "Created At",
              datatype: "date",
              sortable: true,
              valueFormatter: ({ value }) => timeTag(value.toString()),
            },
            {
              field: "Profile",
              header: "Created By",
              render: ({ value }) => (
                <div className="flex flex-row">
                  {value.avatar_url && (
                    <img
                      className="h-10 w-10 rounded-full"
                      src={`https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/avatars/${value.avatar_url}`}
                      alt={value.full_name || "Profile Image"}
                    />
                  )}
                  <div className="flex items-center pl-3">
                    <div className="text-base">{value.full_name}</div>
                  </div>
                </div>
              ),
            },
            {
              field: "id",
              header: "",
              width: 30,
              render: ({ row }) => (
                <Button
                  variant="icon"
                  color="DEFAULT"
                  permission="authenticated"
                  onClick={(e) => {
                    setAnchorRef({
                      open: anchorRef?.element ? !anchorRef?.open : true,
                      element: e.currentTarget,
                      row_id: row["id"],
                    });
                  }}
                >
                  <svg
                    className="h-4 w-4 fill-current"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 448 512"
                  >
                    <path d="M120 256c0 30.9-25.1 56-56 56s-56-25.1-56-56s25.1-56 56-56s56 25.1 56 56zm160 0c0 30.9-25.1 56-56 56s-56-25.1-56-56s25.1-56 56-56s56 25.1 56 56zm104 56c-30.9 0-56-25.1-56-56s25.1-56 56-56s56 25.1 56 56s-25.1 56-56 56z" />
                  </svg>
                </Button>
              ),
            },
          ]}
          rows={tribes}
        />
      </div>
      <Popper anchorEl={anchorRef?.element} open={anchorRef?.open}>
        <ClickAwayListener onClickAway={handleClose}>
          <div
            className="min-h-[16px] min-w-[16px] rounded bg-white text-black drop-shadow-xl dark:bg-neutral-900 dark:text-white"
            onClick={() => setAnchorRef(null)}
          >
            <List>
              {currentUser?.permissions?.some(
                (p: permission) => p === "tribe_update"
              ) && (
                  <ListItem
                    size="small"
                    className="hover:bg-white/10"
                    onClick={(e) => {
                      setOpenModal({ open: true, edit: true, tribe: tribes.find((t) => t.id === anchorRef.row_id) })
                    }}
                    icon={
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 512 512"
                        className="inline-block h-4 w-4 shrink-0 select-none fill-current"
                        focusable="false"
                      >
                        <path d="M373.1 24.97C401.2-3.147 446.8-3.147 474.9 24.97L487 37.09C515.1 65.21 515.1 110.8 487 138.9L289.8 336.2C281.1 344.8 270.4 351.1 258.6 354.5L158.6 383.1C150.2 385.5 141.2 383.1 135 376.1C128.9 370.8 126.5 361.8 128.9 353.4L157.5 253.4C160.9 241.6 167.2 230.9 175.8 222.2L373.1 24.97zM440.1 58.91C431.6 49.54 416.4 49.54 407 58.91L377.9 88L424 134.1L453.1 104.1C462.5 95.6 462.5 80.4 453.1 71.03L440.1 58.91zM203.7 266.6L186.9 325.1L245.4 308.3C249.4 307.2 252.9 305.1 255.8 302.2L390.1 168L344 121.9L209.8 256.2C206.9 259.1 204.8 262.6 203.7 266.6zM200 64C213.3 64 224 74.75 224 88C224 101.3 213.3 112 200 112H88C65.91 112 48 129.9 48 152V424C48 446.1 65.91 464 88 464H360C382.1 464 400 446.1 400 424V312C400 298.7 410.7 288 424 288C437.3 288 448 298.7 448 312V424C448 472.6 408.6 512 360 512H88C39.4 512 0 472.6 0 424V152C0 103.4 39.4 64 88 64H200z" />
                      </svg>
                    }
                  >
                    Edit
                  </ListItem>
                )}
              {currentUser?.permissions?.some(
                (p: permission) => p === "tribe_delete"
              ) && (
                  <ListItem
                    size="small"
                    className="hover:bg-white/10"
                    onClick={(e) => onDeleteClick(tribes.find((t) => t.id === anchorRef.row_id))}
                    icon={
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 448 512"
                        className="inline-block h-4 w-4 shrink-0 select-none fill-current"
                        focusable="false"
                      >
                        <path d="M432 64h-96l-33.63-44.75C293.4 7.125 279.1 0 264 0h-80c-15.1 0-29.4 7.125-38.4 19.25L112 64H16C7.201 64 0 71.2 0 80c0 8.799 7.201 16 16 16h416c8.801 0 16-7.201 16-16 0-8.8-7.2-16-16-16zm-280 0l19.25-25.62C174.3 34.38 179 32 184 32h80c5 0 9.75 2.375 12.75 6.375L296 64H152zm248 64c-8.8 0-16 7.2-16 16v288c0 26.47-21.53 48-48 48H112c-26.47 0-48-21.5-48-48V144c0-8.8-7.16-16-16-16s-16 7.2-16 16v288c0 44.1 35.89 80 80 80h224c44.11 0 80-35.89 80-80V144c0-8.8-7.2-16-16-16zM144 416V192c0-8.844-7.156-16-16-16s-16 7.2-16 16v224c0 8.844 7.156 16 16 16s16-7.2 16-16zm96 0V192c0-8.844-7.156-16-16-16s-16 7.2-16 16v224c0 8.844 7.156 16 16 16s16-7.2 16-16zm96 0V192c0-8.844-7.156-16-16-16s-16 7.2-16 16v224c0 8.844 7.156 16 16 16s16-7.2 16-16z" />
                      </svg>
                    }
                  >
                    Delete
                  </ListItem>
                )}
            </List>
          </div>
        </ClickAwayListener>
      </Popper>
    </div>
  );
};

export default TribesList;
