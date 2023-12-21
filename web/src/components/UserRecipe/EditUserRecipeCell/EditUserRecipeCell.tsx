import type { EditUserRecipeById, UpdateUserRecipeInput } from "types/graphql";

import { navigate, routes } from "@redwoodjs/router";
import type { CellSuccessProps, CellFailureProps } from "@redwoodjs/web";
import { useMutation } from "@redwoodjs/web";
import { toast } from "@redwoodjs/web/toast";

import UserRecipeForm from "src/components/UserRecipe/UserRecipeForm";

export const QUERY = gql`
  query EditUserRecipeById($id: String!) {
    userRecipe: userRecipe(id: $id) {
      id
      created_at
      updated_at
      user_id
      private
      name
      UserRecipeItemRecipe {
        id
        amount
        item_recipe_id
        ItemRecipe {
          id
          Item_ItemRecipe_crafted_item_idToItem {
            id
            name
            image
          }
          ItemRecipeItem {
            id
            amount
            Item {
              id
              name
              image
            }
          }
        }
      }
    }
    itemRecipes {
      id
      crafting_station_id
      crafting_time
      yields
      Item_ItemRecipe_crafted_item_idToItem {
        id
        name
        image
        category
        type
      }
    }
  }
`;
const UPDATE_USER_RECIPE_MUTATION = gql`
  mutation UpdateUserRecipeMutation(
    $id: String!
    $input: UpdateUserRecipeInput!
  ) {
    updateUserRecipe(id: $id, input: $input) {
      id
      created_at
      updated_at
      user_id
      private
      name
    }
  }
`;

export const Loading = () => <div>Loading...</div>;

export const Failure = ({ error }: CellFailureProps) => (
  <div className="rw-cell-error">{error?.message}</div>
);

export const Success = ({
  userRecipe,
  itemRecipes,
}: CellSuccessProps<EditUserRecipeById>) => {
  const [updateUserRecipe, { loading, error }] = useMutation(
    UPDATE_USER_RECIPE_MUTATION,
    {
      onCompleted: ({ updateUserRecipe }) => {
        toast.success("UserRecipe updated");
        navigate(routes.userRecipe({ id: updateUserRecipe.id }));
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }
  );

  const onSave = (
    input: UpdateUserRecipeInput,
    id: EditUserRecipeById["userRecipe"]["id"]
  ) => {
    toast.promise(updateUserRecipe({ variables: { id, input } }), {
      loading: "Updating userrecipe...",
      success: "Userrecipe successfully updated",
      error: <b>Failed to update userrecipe.</b>,
    });
  };

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">
          Edit UserRecipe "{userRecipe?.name}"
        </h2>
      </header>
      <div className="rw-segment-main">
        <UserRecipeForm
          userRecipe={userRecipe}
          itemRecipes={itemRecipes}
          onSave={onSave}
          error={error}
          loading={loading}
        />
      </div>
    </div>
  );
};
