import { Link, routes, navigate } from "@redwoodjs/router";
import { useMutation } from "@redwoodjs/web";
import { toast } from "@redwoodjs/web/toast";
import clsx from "clsx";
import LineChart from "src/components/Util/LineChart/LineChart";

import { getWordType, jsonDisplay, timeTag } from "src/lib/formatters";

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

  let gathereffvals = [
    { "name": "Direbear", value: 3.9 },
    { "name": "Maewing", value: 1.9 },
  ]
  return (
    <>
      <div className="rw-segment">
        <section className="my-3 rounded-md p-4 dark:bg-zinc-600 bg-stone-200 dark:text-white text-gray-700">
          <img className="" src={`https://www.arkresourcecalculator.com/assets/images/80px-${item.image}`} />
          <h4 className="text-2xl font-bold font-serif my-1">{item.name}</h4>
          <p className="italic text-sm">({getWordType(item.name)})</p>
          <p className="mt-2">{item.description}</p>
        </section>
        <section className="my-3 rounded-md dark:text-white text-gray-700 grid grid-cols-2 gap-4">
          <div className="dark:bg-zinc-600 bg-stone-200 rounded-md p-4">
            <p className="text-lg my-1">Gather Efficiency</p>
            <div className="flex flex-col">
              {gathereffvals.map((eff) => (
                <div className="flex items-center">
                  <p className="text-sm mr-2 w-20">{eff.name}</p>

                  <div className="h-2 w-32 bg-gray-300 rounded-full flex flex-row divide-x divide-black">
                    {Array.from(Array(5)).map((_, i) => (
                      <div className={clsx(`first:rounded-l-full last:rounded-r-full h-full w-1/5`, {
                        "bg-transparent": Math.round(eff.value) < i + 1,
                        "[&:nth-child(1)]:bg-red-500 [&:nth-child(2)]:bg-orange-500 [&:nth-child(3)]:bg-yellow-500 [&:nth-child(4)]:bg-lime-500 [&:nth-child(5)]:bg-green-500": Math.round(eff.value) >= i + 1,
                      })}></div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="dark:bg-zinc-600 bg-stone-200 rounded-md p-4">
            <p className="text-lg my-1">Weight Reduction</p>
            <div className="flex flex-col">
              {gathereffvals.map((eff) => (
                <div className="flex items-center">
                  <p className="text-sm mr-2 w-20">{eff.name}</p>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="inline-block fill-current w-4">
                    <path d="M510.3 445.9L437.3 153.8C433.5 138.5 420.8 128 406.4 128H346.1c3.625-9.1 5.875-20.75 5.875-32c0-53-42.1-96-96-96S159.1 43 159.1 96c0 11.25 2.25 22 5.875 32H105.6c-14.38 0-27.13 10.5-30.88 25.75l-73.01 292.1C-6.641 479.1 16.36 512 47.99 512h416C495.6 512 518.6 479.1 510.3 445.9zM256 128C238.4 128 223.1 113.6 223.1 96S238.4 64 256 64c17.63 0 32 14.38 32 32S273.6 128 256 128z" />
                  </svg>
                  <p className="text-lime-300 mx-1">
                    50%
                  </p>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" className="text-lime-300 inline-block fill-current w-4">
                    <path d="M310.6 246.6l-127.1 128C176.4 380.9 168.2 384 160 384s-16.38-3.125-22.63-9.375l-127.1-128C.2244 237.5-2.516 223.7 2.438 211.8S19.07 192 32 192h255.1c12.94 0 24.62 7.781 29.58 19.75S319.8 237.5 310.6 246.6z" />
                  </svg>

                </div>
              ))}
            </div>
          </div>

        </section>
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
      </div >
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
