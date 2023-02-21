import { Link, routes, navigate } from "@redwoodjs/router";
import { useMutation } from "@redwoodjs/web";
import { toast } from "@redwoodjs/web/toast";

import { jsonDisplay, timeTag } from "src/lib/formatters";

import type { DeleteItemMutationVariables, FindItemById } from "types/graphql";

const DELETE_ITEM_MUTATION = gql`
  mutation DeleteItemMutation($id: BigInt!) {
    deleteItem(id: $id) {
      id
    }
  }
`;

interface Props {
  item: NonNullable<FindItemById["item"]>;
}

const Item = ({ item }: Props) => {
  const [deleteItem] = useMutation(DELETE_ITEM_MUTATION, {
    onCompleted: () => {
      toast.success("Item deleted");
      navigate(routes.items());
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onDeleteClick = (id: DeleteItemMutationVariables["id"]) => {
    if (confirm("Are you sure you want to delete item " + id + "?")) {
      deleteItem({ variables: { id } });
    }
  };

  return (
    <>
      <div className="rw-segment">
        <header className="rw-segment-header">
          <h2 className="rw-heading rw-heading-secondary">
            Item {item.id} Detail
          </h2>
        </header>
        <table className="rw-table">
          <tbody>
            <tr>
              <th>Id</th>
              <td>{item.id}</td>
            </tr>
            <tr>
              <th>Created at</th>
              <td>{timeTag(item.created_at)}</td>
            </tr>
            <tr>
              <th>Name</th>
              <td>{item.name}</td>
            </tr>
            <tr>
              <th>Description</th>
              <td>{item.description}</td>
            </tr>
            <tr>
              <th>Image</th>
              <td>{item.image}</td>
            </tr>
            <tr>
              <th>Max stack</th>
              <td>{item.max_stack}</td>
            </tr>
            <tr>
              <th>Weight</th>
              <td>{item.weight}</td>
            </tr>
            <tr>
              <th>Engram points</th>
              <td>{item.engram_points}</td>
            </tr>
            <tr>
              <th>Crafting time</th>
              <td>{item.crafting_time}</td>
            </tr>
            <tr>
              <th>Req level</th>
              <td>{item.req_level}</td>
            </tr>
            <tr>
              <th>Yields</th>
              <td>{item.yields}</td>
            </tr>
            <tr>
              <th>Recipe</th>
              <td>{jsonDisplay(item.recipe)}</td>
            </tr>
            <tr>
              <th>Stats</th>
              <td>{jsonDisplay(item.stats)}</td>
            </tr>
            <tr>
              <th>Color</th>
              <td>{item.color}</td>
            </tr>
            <tr>
              <th>Crafted in</th>
              <td>{item.crafted_in}</td>
            </tr>
            <tr>
              <th>Effects</th>
              <td>{item.effects}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <nav className="rw-button-group">
        <Link
          to={routes.editItem({ id: item.id.toString() })}
          className="rw-button rw-button-blue"
        >
          Edit
        </Link>
        <button
          type="button"
          className="rw-button rw-button-red"
          onClick={() => onDeleteClick(item.id)}
        >
          Delete
        </button>
      </nav>
    </>
  );
};

export default Item;
