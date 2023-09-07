import { Link, routes, navigate } from "@redwoodjs/router";
import { useMutation } from "@redwoodjs/web";
import { toast } from "@redwoodjs/web/toast";
import Toast from "src/components/Util/Toast/Toast";

import { checkboxInputTag, jsonDisplay, timeTag } from "src/lib/formatters";

import type {
  DeleteLootcrateMutationVariables,
  FindLootcrateById,
} from "types/graphql";

const DELETE_LOOTCRATE_MUTATION = gql`
  mutation DeleteLootcrateMutation($id: BigInt!) {
    deleteLootcrate(id: $id) {
      id
    }
  }
`;

interface Props {
  lootcrate: NonNullable<FindLootcrateById["lootcrate"]>;
}

const Lootcrate = ({ lootcrate }: Props) => {
  const [deleteLootcrate] = useMutation(DELETE_LOOTCRATE_MUTATION, {
    onCompleted: () => {
      toast.success("Lootcrate deleted");
      navigate(routes.lootcrates());
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onDeleteClick = (id: DeleteLootcrateMutationVariables["id"]) => {
    toast.custom(
      (t) => (
        <Toast
          t={t}
          title={`You are about to delete lootcrate`}
          message={`Are you sure you want to delete lootcrate?`}
          actionType="YesNo"
          primaryAction={() => deleteLootcrate({ variables: { id } })}
        />
      ),
      { position: "top-center" }
    );
  };

  return (
    <>
      {/* TODO: fix */}
      <div className="rw-segment">
        <header className="rw-segment-header">
          <h2 className="rw-heading rw-heading-secondary">
            Lootcrate {lootcrate.id} Detail
          </h2>
        </header>
        <table className="rw-table">
          <tbody>
            <tr>
              <th>Id</th>
              <td>{lootcrate.id}</td>
            </tr>
            <tr>
              <th>Created at</th>
              <td>{timeTag(lootcrate.created_at)}</td>
            </tr>
            <tr>
              <th>Updated at</th>
              <td>{timeTag(lootcrate.updated_at)}</td>
            </tr>
            <tr>
              <th>Name</th>
              <td>{lootcrate.name}</td>
            </tr>
            <tr>
              <th>Blueprint</th>
              <td>{lootcrate.blueprint}</td>
            </tr>
            <tr>
              <th>Image</th>
              <td>{lootcrate.image}</td>
            </tr>
            <tr>
              <th>Required level</th>
              <td>{lootcrate.required_level}</td>
            </tr>
            <tr>
              <th>Quality mult</th>
              <td>{jsonDisplay(lootcrate.quality_mult)}</td>
            </tr>
            <tr>
              <th>Set qty</th>
              <td>{jsonDisplay(lootcrate.set_qty)}</td>
            </tr>
            <tr>
              <th>Repeat in sets</th>
              <td>{checkboxInputTag(lootcrate.repeat_in_sets)}</td>
            </tr>
            <tr>
              <th>Color</th>
              <td>{lootcrate.color}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <nav className="rw-button-group">
        <Link
          to={routes.editLootcrate({ id: lootcrate.id })}
          className="rw-button rw-button-blue"
        >
          Edit
        </Link>
        <button
          type="button"
          className="rw-button rw-button-red"
          onClick={() => onDeleteClick(lootcrate.id)}
        >
          Delete
        </button>
      </nav>
    </>
  );
};

export default Lootcrate;
