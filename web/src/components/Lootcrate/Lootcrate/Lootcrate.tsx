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
            {lootcrate.name} on <Link to={routes.map({ id: lootcrate.Map.id.toString() })}>{lootcrate.Map.name}</Link>
          </h2>
        </header>
      </div>

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
                                        src={`https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/${itm.Item.image}`}
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
