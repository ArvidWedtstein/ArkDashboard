import { Link, routes, navigate } from "@redwoodjs/router";
import { useMutation } from "@redwoodjs/web";
import { CheckmarkIcon, toast } from "@redwoodjs/web/toast";
import { useAuth } from "src/auth";
import StatCard from "src/components/Util/StatCard/StatCard";
import Table from "src/components/Util/Table/Table";
import Toast from "src/components/Util/Toast/Toast";

import { checkboxInputTag, jsonDisplay, timeTag } from "src/lib/formatters";

import type {
  DeleteLootcrateMutationVariables,
  FindLootcrateById,
  permission,
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
  const { currentUser } = useAuth();
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

    <article className="rw-segment">
      <div className="grid w-full grid-cols-2 gap-3 text-gray-700 dark:text-white">
        <section className="col-span-2 grid w-full grid-flow-col gap-2 rounded-lg border border-zinc-500 bg-gray-200 p-4 dark:bg-zinc-600">
          <div className="w-full">
            <img
              className="w-auto max-w-6xl"
              src={
                lootcrate.image && lootcrate.image.length > 0
                  ? `https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/${lootcrate.image}`
                  : "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/White_Beacon.webp"
              }
            />
            <h4 className="my-1 text-2xl font-semibold">{lootcrate.name}</h4>
            <p className="mt-2">{lootcrate.type}</p>
          </div>

          <div className="grid w-fit grid-cols-3 gap-2 justify-self-end">
            <StatCard stat={"Required Level"} value={lootcrate.required_level} chart={false} />
            <StatCard stat={"Type"} value={lootcrate.type} chart={false} />
            <StatCard stat={"Maps"} value={lootcrate.LootcrateMap.length} chart={false} />
            <StatCard stat={"Items"} value={lootcrate.LootcrateItem.length} chart={false} />
          </div>
        </section>

        <section className="rounded-lg bg-gray-200 p-4 dark:bg-zinc-600">
          <Table rows={lootcrate.LootcrateItem} columns={[
            {
              field: "set_name",
              header: 'Set'
            }
          ]} />
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
        </section>
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
    </article>
  );
};

export default Lootcrate;
