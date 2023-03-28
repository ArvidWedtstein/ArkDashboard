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
    { name: "Direbear", value: 3.9 },
    { name: "Maewing", value: 1.9 },
  ];
  return (
    <>
      <div className="rw-segment">
        <section className="my-3 rounded-md bg-stone-200 p-4 text-gray-700 dark:bg-zinc-600 dark:text-white">
          <img
            className=""
            src={`https://arkcheat.com/images/ark/items/${item.image}`}
          />
          <h4 className="my-1 font-serif text-2xl font-bold">{item.name}</h4>
          <p className="text-sm italic">
            (
            {getWordType(item.name.split(" ")[item.name.split(" ").length - 1])}
            )
          </p>
          <p className="mt-2">{item.description}</p>
        </section>
        <section className="my-3 grid grid-cols-2 gap-4 rounded-md text-gray-700 dark:text-white">
          <div className="rounded-md bg-stone-200 p-4 dark:bg-zinc-600">
            <p className="my-1 text-lg">Gather Efficiency</p>
            <div className="flex flex-col">
              {/* {gathereffvals.map((eff) => (
                <div className="flex items-center">
                  <p className="mr-2 w-20 text-sm">{eff.name}</p>

                  <div className="flex h-2 w-32 flex-row divide-x divide-black rounded-full bg-gray-300">
                    {Array.from(Array(5)).map((_, i) => (
                      <div
                        className={clsx(
                          `/5 h-full w-1 first:rounded-l-full last:rounded-r-full`,
                          {
                            "bg-transparent": Math.round(eff.value) < i + 1,
                            "[&:nth-child(1)]:bg-red-500 [&:nth-child(2)]:bg-orange-500 [&:nth-child(3)]:bg-yellow-500 [&:nth-child(4)]:bg-lime-500 [&:nth-child(5)]:bg-green-500":
                              Math.round(eff.value) >= i + 1,
                          }
                        )}
                      ></div>
                    ))}
                  </div>
                </div>
              ))} */}
            </div>
          </div>
          <div className="rounded-md bg-stone-200 p-4 dark:bg-zinc-600">
            <p className="my-1 text-lg">Weight Reduction</p>
            <div className="flex flex-col">
              {/* {gathereffvals.map((eff) => (
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
              ))} */}
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
              <td>
                {item.crafting_time}
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 384 512">
                  <path d="M352 80C352 71.16 344.8 64 336 64S320 71.16 320 80c0 27.5-9.094 54.78-25.59 76.81l-67.2 89.59c-4.266 5.688-4.266 13.5 0 19.19l67.2 89.59C310.9 377.2 320 404.5 320 432c0 8.844 7.156 16 16 16s16-7.156 16-16c0-34.38-11.36-68.47-32-96L260 256L320 176C340.6 148.5 352 114.4 352 80zM32 432C32 440.8 39.16 448 48 448S64 440.8 64 432c0-27.5 9.094-54.78 25.59-76.81l67.2-89.59c4.266-5.688 4.266-13.5 0-19.19L89.59 156.8C73.09 134.8 64 107.5 64 80C64 71.16 56.84 64 48 64S32 71.16 32 80c0 34.38 11.36 68.47 32 96L124 256L64 336C43.36 363.5 32 397.6 32 432zM368 480h-352C7.156 480 0 487.2 0 496S7.156 512 16 512h352c8.844 0 16-7.156 16-16S376.8 480 368 480zM16 32h352C376.8 32 384 24.84 384 16S376.8 0 368 0h-352C7.156 0 0 7.156 0 16S7.156 32 16 32zM112 448h160c8.844 0 16-7.156 16-16c0-24.81-6.453-49.59-18.64-71.72C266.5 355.2 261.2 352 255.3 352H128.7c-5.828 0-11.2 3.156-14.02 8.281C102.5 382.4 96 407.2 96 432C96 440.8 103.2 448 112 448zM138.5 384h106.1c4.656 10.25 7.812 21.03 9.375 32H129.1C130.7 405 133.9 394.3 138.5 384zM179.7 234.3C182.8 237.9 187.3 240 192 240s9.25-2.125 12.3-5.75l49.25-59.13c5.719-6.844 10.88-14.5 15.8-23.38C272.1 146.8 272 140.8 269.1 135.9S261 128 255.3 128H128.7C122.1 128 117.8 131 114.9 135.9S111.9 146.8 114.7 151.8c4.922 8.875 10.08 16.53 15.78 23.38L179.7 234.3zM224.5 160L192 199L159.5 160H224.5z" />
                </svg>
              </td>
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
