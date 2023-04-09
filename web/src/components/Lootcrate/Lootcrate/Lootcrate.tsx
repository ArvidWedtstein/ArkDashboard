import { Link, routes, navigate } from "@redwoodjs/router";
import { useMutation } from "@redwoodjs/web";
import { toast } from "@redwoodjs/web/toast";
import Tabs from "src/components/Util/Tabs/Tabs";

import { checkboxInputTag, jsonDisplay, timeTag } from "src/lib/formatters";

import type {
  DeleteLootcrateMutationVariables,
  FindLootcrateById,
} from "types/graphql";

const DELETE_LOOTCRATE_MUTATION = gql`
  mutation DeleteLootcrateMutation($id: String!) {
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
    if (confirm("Are you sure you want to delete lootcrate " + id + "?")) {
      deleteLootcrate({ variables: { id } });
    }
  };

  return (
    <>
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
              <th>Blueprint</th>
              <td>{lootcrate.blueprint}</td>
            </tr>
            <tr>
              <th>Name</th>
              <td>{lootcrate.name}</td>
            </tr>
            <tr>
              <th>Map</th>
              <td>{lootcrate.map}</td>
            </tr>
            <tr>
              <th>Level requirement</th>
              <td>{jsonDisplay(lootcrate.level_requirement)}</td>
            </tr>
            <tr>
              <th>Decay time</th>
              <td>{jsonDisplay(lootcrate.decay_time)}</td>
            </tr>
            <tr>
              <th>No repeat in sets</th>
              <td>{checkboxInputTag(lootcrate.no_repeat_in_sets)}</td>
            </tr>
            <tr>
              <th>Quality multiplier</th>
              <td>{jsonDisplay(lootcrate.quality_multiplier)}</td>
            </tr>
            <tr>
              <th>Set qty</th>
              <td>{jsonDisplay(lootcrate.set_qty)}</td>
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
      <div className="w-full space-y-2">
        <Tabs
          tabs={lootcrate.LootcrateSet.map((s, l) => {
            return {
              title: s.name,
              content: (
                <div className="w-full rounded-lg border border-gray-200 bg-white/20 text-sm font-medium text-gray-900 backdrop-blur-sm transition-all duration-150 dark:border-gray-400 dark:text-white">
                  {s.LootcrateSetEntry.map((e, ind) => {
                    return (
                      <details
                        open={s.LootcrateSetEntry.length == 1}
                        key={`crate${ind}-set${l}-entry${ind}`}
                        className="hover:text-pea-700 focus:ring-pea-700 focus:text-pea-700 w-full cursor-pointer border-b border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 dark:border-gray-400  dark:hover:text-white dark:focus:text-white dark:focus:ring-gray-500"
                      >
                        <summary className="text-base font-semibold">
                          {e.name}
                        </summary>
                        <ul className="my-2 grid grid-cols-1 border-t border-gray-200 py-2 dark:border-gray-400 md:grid-cols-1 xl:grid-cols-2">
                          {e.LootcrateSetEntryItem.map(
                            (itm, itemindex) =>
                              true && (
                                <li
                                  className="space-x-2"
                                  key={`itemlistitem-${itemindex}`}
                                >
                                  <Link
                                    to={routes.item({
                                      id: itm.Item.id.toString(),
                                    })}
                                    className="inline-flex space-x-2"
                                  >
                                    {itm.Item.image && (
                                      <img
                                        src={`https://arkcheat.com/images/ark/items/${itm.Item.image}`}
                                        className="inline-block h-6 w-6"
                                      />
                                    )}
                                    <p className="text-white">
                                      {itm.Item.name}
                                    </p>
                                  </Link>
                                </li>
                              )
                          )}
                        </ul>
                      </details>
                    );
                  })}
                </div>
              ),
            };
          })}
        />
      </div>
    </>
  );
};

export default Lootcrate;
