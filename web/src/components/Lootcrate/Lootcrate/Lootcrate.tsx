import { Link, routes, navigate } from "@redwoodjs/router";
import { useMutation } from "@redwoodjs/web";
import { toast } from "@redwoodjs/web/toast";
import { useAuth } from "src/auth";
import Tabs, { Tab } from "src/components/Util/Tabs/Tabs";

import type {
  DeleteLootcrateMutationVariables,
  FindLootcrateById,
  permission,
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
    if (confirm("Are you sure you want to delete lootcrate " + id + "?")) {
      deleteLootcrate({ variables: { id } });
    }
  };

  return (
    <>
      <div className="rw-segment">
        <header className="rw-segment-header">
          <h2 className="rw-heading rw-heading-secondary">
            {lootcrate.name} on{" "}
            <Link to={routes.map({ id: lootcrate.Map.id })}>
              {lootcrate.Map.name}
            </Link>
          </h2>
        </header>
      </div>

      <div className="w-full space-y-2">
        {/* {lootcrate.LootcrateSet.length > 0 && (
          <Tabs>
            {lootcrate.LootcrateSet.map((s, l) => (
              <Tab label={s.name} className="my-3" key={l}>
                <div className="my-3 w-full rounded-lg border border-gray-200 bg-white/20 text-sm font-medium text-gray-900 backdrop-blur-sm transition-all duration-150 dark:border-gray-400 dark:text-white">
                  {s.LootcrateSetEntry.map((e, ind) => {
                    return (
                      <details
                        open={true}
                        key={`crate${ind}-set${l}-entry${ind}`}
                        className="hover:text-pea-700 focus:ring-pea-700 focus:text-pea-700 w-full cursor-pointer border-b border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 dark:border-gray-400  dark:hover:text-white dark:focus:text-white dark:focus:ring-gray-500"
                      >
                        <summary className="text-base font-semibold">
                          {e.name}
                        </summary>
                        <ul className="my-2 grid grid-cols-1 border-t border-gray-200 py-2 dark:border-gray-400 md:grid-cols-1 xl:grid-cols-2">
                          {e.LootcrateSetEntryItem.map((itm, itemindex) => (
                            <li
                              className="space-x-2"
                              key={`itemlistitem-${itemindex}`}
                            >
                              <Link
                                to={routes.item({
                                  id: itm.Item.id,
                                })}
                                className="inline-flex space-x-2"
                              >
                                {itm.Item.image && (
                                  <img
                                    src={`https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/${itm.Item.image}`}
                                    className="inline-block h-6 w-6"
                                  />
                                )}
                                <p className="text-white">{itm.Item.name}</p>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </details>
                    );
                  })}
                </div>
              </Tab>
            ))}
          </Tabs>
        )} */}
        {lootcrate.LootcrateSet.length > 0 && (
          <div className="my-3 w-full rounded-lg border border-gray-200 bg-white/20 text-sm font-medium text-gray-900 backdrop-blur-sm transition-all duration-150 dark:border-gray-400 dark:text-white">
            {lootcrate.LootcrateSet.map((s, l) => (
              <details
                open={true}
                key={`crate${l}-set${l}-entry${s.name}`}
                className="hover:text-pea-700 focus:ring-pea-700 focus:text-pea-700 w-full cursor-pointer border-b border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 dark:border-gray-400  dark:hover:text-white dark:focus:text-white dark:focus:ring-gray-500"
              >
                <summary className="text-base font-semibold">{s.name}</summary>
                {s.LootcrateSetEntry.map((e, ind) => {
                  return (
                    <details
                      open={true}
                      key={`crate${ind}-set${l}-entry${ind}`}
                      className="hover:text-pea-700 focus:ring-pea-700 focus:text-pea-700 w-full cursor-pointer border-b border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 dark:border-gray-400  dark:hover:text-white dark:focus:text-white dark:focus:ring-gray-500"
                    >
                      <summary className="text-base font-semibold">
                        {e.name}
                      </summary>
                      <ul className="my-2 grid grid-cols-1 border-t border-gray-200 py-2 dark:border-gray-400 md:grid-cols-1 xl:grid-cols-2">
                        {e.LootcrateSetEntryItem.map((itm, itemindex) => (
                          <li
                            className="space-x-2"
                            key={`itemlistitem-${itemindex}`}
                          >
                            <Link
                              to={routes.item({
                                id: itm.Item.id,
                              })}
                              className="rw-link inline-flex space-x-2"
                            >
                              {itm.Item.image && (
                                <img
                                  src={`https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/${itm.Item.image}`}
                                  className="inline-block h-6 w-6"
                                />
                              )}
                              <p className="space-x-1 dark:text-white">
                                <span>{Math.floor(itm.value * 100)}%</span>
                                <span>{itm.Item.name}</span>
                              </p>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </details>
                  );
                })}
              </details>
            ))}
          </div>
        )}
      </div>
      <nav className="rw-button-group">
        {currentUser &&
          currentUser?.permissions.some(
            (p: permission) => p === "gamedata_update"
          ) && (
            <Link
              to={routes.editLootcrate({ id: lootcrate.id })}
              className="rw-button rw-button-blue"
            >
              Edit
            </Link>
          )}
        {currentUser &&
          currentUser?.permissions.some(
            (p: permission) => p === "gamedata_delete"
          ) && (
            <button
              type="button"
              className="rw-button rw-button-red"
              onClick={() => onDeleteClick(lootcrate.id)}
            >
              Delete
            </button>
          )}
      </nav>
    </>
  );
};

export default Lootcrate;
