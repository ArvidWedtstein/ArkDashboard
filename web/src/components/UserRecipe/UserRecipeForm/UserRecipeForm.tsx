import {
  Form,
  FormError,
  FieldError,
  Label,
  CheckboxField,
} from "@redwoodjs/forms";

import type {
  DeleteUserRecipeItemRecipeMutationVariables,
  EditUserRecipeById,
  UpdateUserRecipeInput,
  UpdateUserRecipeItemRecipeInput,
  UserRecipeItemRecipe,
} from "types/graphql";
import type { RWGqlError } from "@redwoodjs/forms";
import { useMutation } from "@apollo/client";
import { toast } from "@redwoodjs/web/dist/toast";
import { formatNumber } from "src/lib/formatters";
import { useRef, useState } from "react";
import { Input } from "src/components/Util/Input/Input";
import Button from "src/components/Util/Button/Button";
import Badge from "src/components/Util/Badge/Badge";
import { Dialog, DialogActions, DialogContent, DialogTitle } from "src/components/Util/Dialog/Dialog";
import { Lookup } from "src/components/Util/Lookup/Lookup";
import Toast from "src/components/Util/Toast/Toast";
import { useAuth } from "src/auth";
import Switch from "src/components/Util/Switch/Switch";


const CREATE_USER_RECIPE_ITEM_RECIPE_MUTATION = gql`
  mutation CreateUserRecipeItemRecipeMutation($input: CreateUserRecipeItemRecipeInput!) {
    createUserRecipeItemRecipe(input: $input) {
      id
    }
  }
`

const UPDATE_USER_RECIPE_ITEM_RECIPE_MUTATION = gql`
  mutation UpdateUserRecipeItemRecipeMutation(
    $id: BigInt!
    $input: UpdateUserRecipeItemRecipeInput!
  ) {
    updateUserRecipeItemRecipe(id: $id, input: $input) {
      id
      created_at
      item_recipe_id
      user_recipe_id
      amount
    }
  }
`;


const DELETE_USER_RECIPE_ITEM_RECIPE_MUTATION = gql`
  mutation DeleteUserRecipeItemRecipeMutation($id: BigInt!) {
    deleteUserRecipeItemRecipe(id: $id) {
      id
    }
  }
`;
type FormUserRecipe = NonNullable<EditUserRecipeById["userRecipe"]>;

interface UserRecipeFormProps {
  userRecipe?: EditUserRecipeById["userRecipe"];
  itemRecipes?: EditUserRecipeById["itemRecipes"];
  onSave: (data: UpdateUserRecipeInput, id?: FormUserRecipe["id"]) => void;
  error: RWGqlError;
  loading: boolean;
}

const UserRecipeForm = (props: UserRecipeFormProps) => {
  const { currentUser } = useAuth();
  // const [loadItems, { called, loading, data }] = useLazyQuery(ITEMQUERY, {
  //   variables: { category: "Resource,Consumable" },
  //   onCompleted: (data) => {
  //     console.log(data);
  //     toast.success("Items loaded");
  //   },
  //   onError: (error) => {
  //     console.log(error);
  //     toast.error(error.message);
  //   },
  // });

  const onSubmit = (data: FormUserRecipe) => {
    console.log(data)
    props.onSave(data, props?.userRecipe?.id);
  };


  const categoriesIcons = {
    Armor: "cloth-shirt",
    Tool: "stone-pick",
    Weapon: "assault-rifle",
    Resource: "stone",
    Fertilizer: "fertilizer",
    Structure: "wooden-foundation",
    Other: "any-craftable-resource",
    Consumable: "any-berry-seed",
  };


  const [openModal, setOpenModal] = useState<{ open: boolean; edit?: boolean, itemRecipe?: UpdateUserRecipeItemRecipeInput & { id?: number } }>({
    open: false,
    edit: false,
    itemRecipe: null
  });

  const modalRef = useRef<HTMLDivElement>();

  const [createUserRecipeItemRecipe, { error: createError }] = useMutation(
    CREATE_USER_RECIPE_ITEM_RECIPE_MUTATION,
    {
      onCompleted: () => {
        setOpenModal({ open: false, edit: null });
      },
      onError: (error) => {
        if (process.env.NODE_ENV !== "production") {
          console.error(error)
        }
        toast.error(error.message)
      },
    }
  )

  const [updateUserRecipeItemRecipe, { error: updateError }] = useMutation(
    UPDATE_USER_RECIPE_ITEM_RECIPE_MUTATION,
    {
      onCompleted: () => {
        setOpenModal({ open: false, edit: null, itemRecipe: null });
      },
      onError: (error) => {
        if (process.env.NODE_ENV !== "production") {
          console.error(error)
        }
        toast.error(error.message)
      },
    }
  );

  const [deleteUserRecipeItemRecipe] = useMutation(
    DELETE_USER_RECIPE_ITEM_RECIPE_MUTATION,
    {
      onCompleted: () => {
        toast.success("Item Recipe deleted");
        setOpenModal({ open: false, edit: null, itemRecipe: null });
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }
  );

  const onDeleteClick = (
    id: DeleteUserRecipeItemRecipeMutationVariables["id"]
  ) => {
    // TODO: add refresh after deleting
    toast.custom(
      (t) => (
        <Toast
          t={t}
          title={`Confirm deletion`}
          message={`Are you sure you want to delete recipe?`}
          actionType="YesNo"
          primaryAction={() => deleteUserRecipeItemRecipe({ variables: { id } })}
        />
      ),
      { position: 'top-center' }
    )
  };


  const onSubmitUserRecipeItemRecipe = (data: UserRecipeItemRecipe) => {
    const input: UserRecipeItemRecipe = {
      ...data,
      created_at: data.created_at ?? new Date().toISOString(),
      user_recipe_id: props.userRecipe?.id,
    };
    toast.promise(
      openModal.edit
        ? updateUserRecipeItemRecipe({ variables: { id: openModal.itemRecipe?.id, input } })
        : createUserRecipeItemRecipe({ variables: { input } }),
      {
        loading: openModal.edit ? 'Updating ItemRecipeItem...' : 'Creating new ItemRecipeItem...',
        success: `ItemRecipeItem successfully ${openModal.edit ? 'updated' : 'created'}`,
        error: <b>Failed to {openModal.edit ? 'update' : 'create new'} ItemRecipeItem.</b>,
      });
  };

  return (
    <div className="-mt-4 text-sm">
      <Dialog ref={modalRef} open={openModal.open} onClose={() => setOpenModal({ open: false, edit: false, itemRecipe: null })}>
        <DialogTitle>{openModal.edit ? 'Edit' : 'Add'} Recipe</DialogTitle>
        <DialogContent dividers>
          <Form onSubmit={onSubmitUserRecipeItemRecipe} error={createError || updateError}>
            <FormError
              error={createError || updateError}
              wrapperClassName="rw-form-error-wrapper"
              titleClassName="rw-form-error-title"
              listClassName="rw-form-error-list"
            />
            {/* <Lookup
              label="Item Recipe"
              name="item_recipe_id"
              loading={props.loading}
              isOptionEqualToValue={(opt, val) => opt.id === val.id}
              getOptionValue={(opt) => opt.id}
              getOptionLabel={(opt) => opt.Item_ItemRecipe_crafted_item_idToItem.name}
              defaultValue={openModal?.itemRecipe?.item_recipe_id}
              // groupBy={(d) => d.Item_ItemRecipe_crafted_item_idToItem.category || ""}
              options={[...props?.itemRecipes]?.sort((a, b) => {
                if (a.Item_ItemRecipe_crafted_item_idToItem.category || "" < b.Item_ItemRecipe_crafted_item_idToItem.category) {
                  return -1;
                }
                if (a.Item_ItemRecipe_crafted_item_idToItem.category > b.Item_ItemRecipe_crafted_item_idToItem.category) {
                  return 1;
                }
                return 0;
              }) || []}
              validation={{ required: true }}
            /> */}

            <Input
              label="Amount"
              name="amount"
              defaultValue={openModal.itemRecipe?.amount}
              validation={{ valueAsNumber: true, required: true, setValueAs: (v) => parseInt(v) }}
              type="number"
            />
          </Form>
        </DialogContent>
        <DialogActions className="space-x-1">
          <Button
            type="button"
            color="success"
            variant="contained"
            permission={openModal.edit ? 'gamedata_update' : 'gamedata_create'}
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
            {openModal.edit ? 'Save' : 'Add'}
          </Button>
          {openModal.edit && (
            <Button
              type="button"
              color="error"
              variant="contained"
              onClick={() => onDeleteClick(openModal.itemRecipe?.id)}
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
            type="reset"
            color="error"
            onClick={() => setOpenModal({ open: false, edit: false })}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      <Form<FormUserRecipe> onSubmit={onSubmit} error={props.error}>
        <FormError
          error={props.error}
          wrapperClassName="rw-form-error-wrapper"
          titleClassName="rw-form-error-title"
          listClassName="rw-form-error-list"
        />
        <Input
          label={'User'}
          name="created_by"
          validation={{ required: true }}
          defaultValue={props.userRecipe?.created_by || currentUser?.id}
          className="hidden invisible"
        />
        <Input
          label={'Name'}
          name="name"
          defaultValue={props.userRecipe?.name}
        />

        <br />


        <Switch
          name="public_access"
          defaultChecked={props.userRecipe?.public_access}
          offLabel="Private"
          onLabel="Public"
          helperText="Should this recipe be visible to everyone?"
        />
        <FieldError name="public_access" className="rw-field-error" />

        <div className="my-3">

          <div className="col-span-5 flex flex-row flex-wrap gap-3 text-black dark:text-white">
            {props.userRecipe?.UserRecipeItemRecipe.map(({ id, amount, ItemRecipe, ...other }) => {
              return (
                <Button
                  key={`recipe-${id}`}
                  className="aspect-square"
                  variant="outlined"
                  color="DEFAULT"
                  title={`${ItemRecipe.Item_ItemRecipe_crafted_item_idToItem.name} - ${amount}`}
                  onClick={() => {
                    setOpenModal({ open: true, edit: true, itemRecipe: { id, user_recipe_id: props.userRecipe.id, amount, ...other } })
                  }}
                >
                  <div className="flex flex-col items-center justify-center w-16 p-1">
                    <img
                      className="h-10 w-10"
                      src={`https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/${ItemRecipe.Item_ItemRecipe_crafted_item_idToItem.image}`}
                    />
                    <span className="text-xs">{ItemRecipe.Item_ItemRecipe_crafted_item_idToItem.name}</span>
                  </div>
                  <Badge color="DEFAULT" variant="standard" size="small" className="absolute top-0 right-2.5" max={1000000} content={formatNumber(amount, { notation: "compact" })} />
                </Button>
              )
            })}

            {props?.userRecipe?.id && (
              <Button
                className="aspect-square"
                variant="contained"
                color="success"
                onClick={() => setOpenModal({ open: true, edit: false, itemRecipe: { user_recipe_id: props.userRecipe.id } })}
                startIcon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 448 512"
                  >
                    <path d="M432 256C432 264.8 424.8 272 416 272h-176V448c0 8.844-7.156 16.01-16 16.01S208 456.8 208 448V272H32c-8.844 0-16-7.15-16-15.99C16 247.2 23.16 240 32 240h176V64c0-8.844 7.156-15.99 16-15.99S240 55.16 240 64v176H416C424.8 240 432 247.2 432 256z" />
                  </svg>
                }
              >
                Add
              </Button>
            )}
          </div>
        </div>

        <Button
          color="success"
          variant="outlined"
          type="submit"
          className="my-3"
          disabled={props.loading}
          startIcon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 448 512"
              className="fill-current pointer-events-none"
              fill="currentColor"
            >
              <path d="M350.1 55.44C334.9 40.33 314.9 32 293.5 32H80C35.88 32 0 67.89 0 112v288C0 444.1 35.88 480 80 480h288c44.13 0 80-35.89 80-80V186.5c0-21.38-8.312-41.47-23.44-56.58L350.1 55.44zM96 64h192v96H96V64zM416 400c0 26.47-21.53 48-48 48h-288C53.53 448 32 426.5 32 400v-288c0-20.83 13.42-38.43 32-45.05V160c0 17.67 14.33 32 32 32h192c17.67 0 32-14.33 32-32V72.02c2.664 1.758 5.166 3.771 7.438 6.043l74.5 74.5C411 161.6 416 173.7 416 186.5V400zM224 240c-44.13 0-80 35.89-80 80s35.88 80 80 80s80-35.89 80-80S268.1 240 224 240zM224 368c-26.47 0-48-21.53-48-48S197.5 272 224 272s48 21.53 48 48S250.5 368 224 368z" />
            </svg>
          }
        >
          Save
        </Button>
      </Form>
    </div>
  );
};

export default UserRecipeForm;
