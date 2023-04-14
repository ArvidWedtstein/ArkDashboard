import { Link, routes, navigate } from "@redwoodjs/router";
import { useMutation } from "@redwoodjs/web";
import { toast } from "@redwoodjs/web/toast";
import clsx from "clsx";
import LineChart from "src/components/Util/LineChart/LineChart";

import { getWordType } from "src/lib/formatters";

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
        <section className="my-3 grid grid-cols-2 rounded-md bg-stone-200 p-4 text-gray-700 dark:bg-zinc-600 dark:text-white">
          <div className="">
            <img
              className="w-auto max-w-6xl"
              src={`https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/${item.image}`}
            />
            <h4 className="my-1 font-serif text-2xl font-bold">{item.name}</h4>
            <p className="text-sm italic">
              (
              {getWordType(
                item.name.split(" ")[item.name.split(" ").length - 1]
              )}
              )
            </p>
            <p className="mt-2">{item.description}</p>
          </div>
          <div className="flex flex-col">
            <div className="py-4 px-8 text-sm font-light text-white">
              <div className="mr-4 mb-4 inline-block">
                <strong>Max Stack:</strong> {item.max_stack}
              </div>
              <div className="mr-4 mb-4 inline-block">
                <strong>Weight:</strong> {item.weight}
              </div>

              <br />

              <div className="mr-4 mb-4 inline-block">
                <strong>Type:</strong> {item.type}
              </div>

              {item.recipe && item.crafting_time && (
                <>
                  <div className="mr-4 mb-4 inline-block">
                    <strong>Crafting time:</strong> {item.crafting_time}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="inline-block h-5 w-5 fill-current"
                      viewBox="0 0 384 512"
                    >
                      <path d="M352 80C352 71.16 344.8 64 336 64S320 71.16 320 80c0 27.5-9.094 54.78-25.59 76.81l-67.2 89.59c-4.266 5.688-4.266 13.5 0 19.19l67.2 89.59C310.9 377.2 320 404.5 320 432c0 8.844 7.156 16 16 16s16-7.156 16-16c0-34.38-11.36-68.47-32-96L260 256L320 176C340.6 148.5 352 114.4 352 80zM32 432C32 440.8 39.16 448 48 448S64 440.8 64 432c0-27.5 9.094-54.78 25.59-76.81l67.2-89.59c4.266-5.688 4.266-13.5 0-19.19L89.59 156.8C73.09 134.8 64 107.5 64 80C64 71.16 56.84 64 48 64S32 71.16 32 80c0 34.38 11.36 68.47 32 96L124 256L64 336C43.36 363.5 32 397.6 32 432zM368 480h-352C7.156 480 0 487.2 0 496S7.156 512 16 512h352c8.844 0 16-7.156 16-16S376.8 480 368 480zM16 32h352C376.8 32 384 24.84 384 16S376.8 0 368 0h-352C7.156 0 0 7.156 0 16S7.156 32 16 32zM112 448h160c8.844 0 16-7.156 16-16c0-24.81-6.453-49.59-18.64-71.72C266.5 355.2 261.2 352 255.3 352H128.7c-5.828 0-11.2 3.156-14.02 8.281C102.5 382.4 96 407.2 96 432C96 440.8 103.2 448 112 448zM138.5 384h106.1c4.656 10.25 7.812 21.03 9.375 32H129.1C130.7 405 133.9 394.3 138.5 384zM179.7 234.3C182.8 237.9 187.3 240 192 240s9.25-2.125 12.3-5.75l49.25-59.13c5.719-6.844 10.88-14.5 15.8-23.38C272.1 146.8 272 140.8 269.1 135.9S261 128 255.3 128H128.7C122.1 128 117.8 131 114.9 135.9S111.9 146.8 114.7 151.8c4.922 8.875 10.08 16.53 15.78 23.38L179.7 234.3zM224.5 160L192 199L159.5 160H224.5z" />
                    </svg>
                  </div>
                  <div className="mr-4 mb-4 inline-block">
                    <strong>Yields:</strong> {item.yields}
                  </div>
                  <br />
                  <div className="mr-4 mb-4 inline-block">
                    <strong>Engram Points:</strong> {item.engram_points}
                  </div>
                  <div className="mr-4 mb-4 inline-block">
                    <strong>Required level:</strong> {item.req_level}
                  </div>
                </>
              )}
            </div>
          </div>
        </section>

        <section className="my-3 grid grid-cols-2 gap-4 rounded-md text-gray-700 dark:text-white">
          {item.DinoStat &&
            item.DinoStat.filter((g) => g.type === "gather_efficiency").length >
              0 && (
              <div className="rounded-md bg-stone-200 p-4 dark:bg-zinc-600">
                <p className="my-1 text-lg">Gather Efficiency</p>
                <div className="flex flex-col">
                  {item.DinoStat.filter((g) => g.type === "gather_efficiency")
                    .sort((a, b) => b.value - a.value)
                    .slice(0, 10)
                    .map((eff) => (
                      <div className="flex items-center">
                        <Link
                          to={routes.dino({ id: eff.Dino.id })}
                          className="mr-2 w-40 text-sm"
                        >
                          {eff.Dino.name}
                        </Link>

                        <div
                          className="flex h-2 w-32 flex-row divide-x divide-black rounded-full bg-gray-300"
                          title={eff.value.toString()}
                        >
                          {Array.from(Array(5)).map((_, i) => (
                            <div
                              className={clsx(
                                `h-full w-1/5 first:rounded-l-full last:rounded-r-full`,
                                {
                                  "bg-transparent":
                                    Math.round(eff.value) < i + 1,
                                  "[&:nth-child(1)]:bg-red-500 [&:nth-child(2)]:bg-orange-500 [&:nth-child(3)]:bg-yellow-500 [&:nth-child(4)]:bg-lime-500 [&:nth-child(5)]:bg-green-500":
                                    Math.round(eff.value) >= i + 1,
                                }
                              )}
                            ></div>
                          ))}
                        </div>
                        <p
                          className="ml-2 w-40 text-sm"
                          title={eff.value.toString()}
                        >
                          #{eff.rank}
                        </p>
                      </div>
                    ))}
                </div>
              </div>
            )}

          {item.DinoStat &&
            item.DinoStat.filter((g) => g.type === "weight_reduction").length >
              0 && (
              <div className="rounded-md bg-stone-200 p-4 dark:bg-zinc-600">
                <p className="my-1 text-lg">Weight Reduction</p>
                <div className="flex flex-col">
                  {item.DinoStat.filter((g) => g.type === "weight_reduction")
                    .sort((a, b) => b.value - a.value)
                    .slice(0, 10)
                    .map((wr) => (
                      <div className="flex items-center">
                        <Link
                          to={routes.dino({ id: wr.Dino.id })}
                          className="mr-2 w-20 text-sm"
                        >
                          {wr.Dino.name}
                        </Link>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 512 512"
                          className="inline-block w-4 fill-current"
                        >
                          <path d="M510.3 445.9L437.3 153.8C433.5 138.5 420.8 128 406.4 128H346.1c3.625-9.1 5.875-20.75 5.875-32c0-53-42.1-96-96-96S159.1 43 159.1 96c0 11.25 2.25 22 5.875 32H105.6c-14.38 0-27.13 10.5-30.88 25.75l-73.01 292.1C-6.641 479.1 16.36 512 47.99 512h416C495.6 512 518.6 479.1 510.3 445.9zM256 128C238.4 128 223.1 113.6 223.1 96S238.4 64 256 64c17.63 0 32 14.38 32 32S273.6 128 256 128z" />
                        </svg>
                        <p className="mx-1 text-lime-300">{wr.value}%</p>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 320 512"
                          className="inline-block w-4 fill-current text-lime-300"
                        >
                          <path d="M310.6 246.6l-127.1 128C176.4 380.9 168.2 384 160 384s-16.38-3.125-22.63-9.375l-127.1-128C.2244 237.5-2.516 223.7 2.438 211.8S19.07 192 32 192h255.1c12.94 0 24.62 7.781 29.58 19.75S319.8 237.5 310.6 246.6z" />
                        </svg>
                      </div>
                    ))}
                </div>
              </div>
            )}

          {item.DinoStat &&
            item.DinoStat.filter((g) => g.type === "drops").length > 0 && (
              <div className="rounded-md bg-stone-200 p-4 dark:bg-zinc-600">
                <p className="my-1 text-lg">Dinos that drop {item.name}</p>
                <div className="flex flex-col">
                  {item.DinoStat.filter((g) => g.type === "drops")
                    .sort((a, b) => b.value - a.value)
                    .slice(0, 10)
                    .map((d) => (
                      <Link
                        to={routes.dino({ id: d.Dino.id })}
                        className="mr-2 w-20 text-sm"
                      >
                        {d.Dino.name}
                      </Link>
                    ))}
                </div>
              </div>
            )}
        </section>
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
