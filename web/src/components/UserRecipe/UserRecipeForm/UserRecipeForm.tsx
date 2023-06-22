import {
  Form,
  FormError,
  FieldError,
  Label,
  DatetimeLocalField,
  TextField,
  CheckboxField,
  Submit,
} from "@redwoodjs/forms";

import type {
  DeleteUserRecipeItemRecipeMutationVariables,
  EditUserRecipeById,
  UpdateUserRecipeInput,
} from "types/graphql";
import type { RWGqlError } from "@redwoodjs/forms";
import { Link, routes } from "@redwoodjs/router";
import { useMutation } from "@apollo/client";
import { toast } from "@redwoodjs/web/dist/toast";

const DELETE_USER_RECIPE_ITEM_RECIPE_MUTATION = gql`
  mutation DeleteUserRecipeItemRecipeMutation($id: String!) {
    deleteUserRecipeItemRecipe(id: $id) {
      id
    }
  }
`;
type FormUserRecipe = NonNullable<EditUserRecipeById["userRecipe"]>;

interface UserRecipeFormProps {
  userRecipe?: EditUserRecipeById["userRecipe"];
  onSave: (data: UpdateUserRecipeInput, id?: FormUserRecipe["id"]) => void;
  error: RWGqlError;
  loading: boolean;
}

const UserRecipeForm = (props: UserRecipeFormProps) => {
  const [deleteUserRecipeItemRecipe] = useMutation(
    DELETE_USER_RECIPE_ITEM_RECIPE_MUTATION,
    {
      onCompleted: (data) => {
        console.log(data);
        toast.success("Item Recipe deleted");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }
  );

  const onDeleteClick = (
    id: DeleteUserRecipeItemRecipeMutationVariables["id"]
  ) => {
    if (confirm("Are you sure you want to delete userRecipe " + id + "?")) {
      deleteUserRecipeItemRecipe({ variables: { id } });
    }
  };

  const onSubmit = (data: FormUserRecipe) => {
    props.onSave(data, props?.userRecipe?.id);
  };

  return (
    <div className="rw-form-wrapper">
      <Form<FormUserRecipe> onSubmit={onSubmit} error={props.error}>
        <FormError
          error={props.error}
          wrapperClassName="rw-form-error-wrapper"
          titleClassName="rw-form-error-title"
          listClassName="rw-form-error-list"
        />
        <TextField
          name="user_id"
          defaultValue={props.userRecipe?.user_id}
          className="hidden"
          errorClassName="rw-input rw-input-error"
          placeholder=" "
        />
        {!props?.userRecipe?.id && (
          <>
            <Label
              name="user_id"
              className="rw-label"
              errorClassName="rw-label rw-label-error"
            >
              User id
            </Label>

            <TextField
              name="user_id"
              defaultValue={props.userRecipe?.user_id}
              className="rw-input"
              errorClassName="rw-input rw-input-error"
              validation={{ required: true }}
            />

            <FieldError name="user_id" className="rw-field-error" />
          </>
        )}

        <div className="rw-input-underline relative max-w-sm rounded-t bg-white bg-opacity-10 p-1">
          <TextField
            name="name"
            defaultValue={props.userRecipe?.name}
            className="border-1 focus:border-pea-600 dark:focus:border-pea-500 peer block w-full appearance-none rounded-lg border-gray-300 bg-transparent px-2.5 pb-2.5 pt-4 text-sm text-gray-900 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-white"
            errorClassName="rw-input rw-input-error"
            placeholder=" "
          />
          <Label
            name="name"
            className="peer-focus:text-pea-600 peer-focus:dark:text-pea-500 absolute top-4 left-1 z-10 origin-[0] -translate-y-4 scale-75 transform px-2 text-sm text-gray-500 duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-4 peer-focus:-translate-y-4 peer-focus:scale-75 dark:text-gray-400"
            errorClassName="rw-label rw-label-error"
          >
            Name
          </Label>
          <FieldError name="name" className="rw-field-error" />
        </div>

        <Label
          name="private"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Private
        </Label>

        <CheckboxField
          name="private"
          defaultChecked={props.userRecipe?.private}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
        />

        <FieldError name="private" className="rw-field-error" />

        <pre className="text-black dark:text-white">
          {JSON.stringify(props.userRecipe, null, 2)}
        </pre>
        <div className="my-3 flex flex-row flex-wrap gap-2 text-black dark:text-white">
          {props.userRecipe?.UserRecipeItemRecipe?.map(({ id, ItemRecipe }) =>
            ItemRecipe.ItemRecipeItem.map(({ amount, Item }) => (
              <button
                type="button"
                className="animate-fade-in b relative rounded-lg border border-zinc-500 p-2 text-center hover:border-red-500 hover:ring-1 hover:ring-red-500"
                title={Item.name}
                onClick={() => onDeleteClick(id)}
                key={`recipe-${Item.id}`}
              >
                <img
                  className="h-10 w-10"
                  src={`https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/${Item.image}`}
                  alt={Item.name}
                />
                <div className="absolute -bottom-1 -right-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-transparent text-xs font-bold">
                  {amount}
                </div>
              </button>
            ))
          )}
        </div>

        <div className="rw-button-group">
          <Submit disabled={props.loading} className="rw-button rw-button-blue">
            Save
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 448 512"
              className="rw-button-icon pointer-events-none"
              fill="currentColor"
            >
              <path d="M350.1 55.44C334.9 40.33 314.9 32 293.5 32H80C35.88 32 0 67.89 0 112v288C0 444.1 35.88 480 80 480h288c44.13 0 80-35.89 80-80V186.5c0-21.38-8.312-41.47-23.44-56.58L350.1 55.44zM96 64h192v96H96V64zM416 400c0 26.47-21.53 48-48 48h-288C53.53 448 32 426.5 32 400v-288c0-20.83 13.42-38.43 32-45.05V160c0 17.67 14.33 32 32 32h192c17.67 0 32-14.33 32-32V72.02c2.664 1.758 5.166 3.771 7.438 6.043l74.5 74.5C411 161.6 416 173.7 416 186.5V400zM224 240c-44.13 0-80 35.89-80 80s35.88 80 80 80s80-35.89 80-80S268.1 240 224 240zM224 368c-26.47 0-48-21.53-48-48S197.5 272 224 272s48 21.53 48 48S250.5 368 224 368z" />
            </svg>
          </Submit>
        </div>
      </Form>
    </div>
  );
};

export default UserRecipeForm;
