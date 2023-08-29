import { Link, routes, navigate } from "@redwoodjs/router";
import { useMutation } from "@redwoodjs/web";
import { toast } from "@redwoodjs/web/toast";
import clsx from "clsx";
import { useState } from "react";
import { useAuth } from "src/auth";
import StatCard from "src/components/Util/StatCard/StatCard";
import Tabs from "src/components/Util/Tabs/Tabs";

import { getWordType } from "src/lib/formatters";

import type {
  DeleteItemMutationVariables,
  FindItemById,
  permission,
} from "types/graphql";

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
  const { currentUser } = useAuth();
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
  const ItemStats = {
    2: {
      name: "Armor",
    },
    3: {
      name: "Hypothermal Insulation",
    },
    4: {
      name: "Hyperthermal Insulation",
    },
    5: {
      name: "Durability",
    },
    6: {
      name: "Weapon Damage",
    },
    7: {
      name: "Health",
      icon: "https://static.wikia.nocookie.net/arksurvivalevolved_gamepedia/images/f/f3/Healing.png",
    },
    8: {
      name: "Food",
      icon: "https://static.wikia.nocookie.net/arksurvivalevolved_gamepedia/images/a/a8/Digesting.png",
    },
    9: {
      name: "Spoils",
    },
    10: {
      name: "Torpor",
      icon: "https://static.wikia.nocookie.net/arksurvivalevolved_gamepedia/images/4/42/Tranquilized.png",
    },
    11: {
      name: "Water",
    },
    12: {
      name: "Stamina",
    },
    13: {
      name: "Cooldown",
      icon: "https://static.wikia.nocookie.net/arksurvivalevolved_gamepedia/images/9/93/Cryo_Cooldown.png",
    },
    14: {
      name: "Fertilizer Points",
    },
    15: {
      name: "Affinity",
    },
    16: {
      name: "Ammo",
    },
    17: {
      name: "Weight Reduction",
    },
    18: {
      name: "Fuel",
    },
    19: {
      name: "Gather Efficiency",
    },
    20: {
      name: "Other",
    },
  };

  const [activeTab, setActiveTab] = useState(0);

  return (
    <article className="rw-segment flex flex-row gap-3">
      <div className="grid w-full grid-cols-2 gap-3 text-gray-700 dark:text-white">
        <section className="col-span-2 grid w-full grid-flow-col gap-2 rounded-lg border border-zinc-500 bg-gray-200 p-4 dark:bg-zinc-600">
          <div className="w-full">
            <img
              className="w-auto max-w-6xl"
              src={`https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/${item.image}`}
            />
            <h4 className="my-1 text-2xl font-semibold">{item.name}</h4>
            <p className="text-sm italic">
              (
              {getWordType(
                item.name.split(" ")[item.name.split(" ").length - 1]
              )}
              )
            </p>
            <p className="mt-2">{item.description}</p>
          </div>

          <div className="grid w-fit grid-cols-3 gap-2 justify-self-end">
            <StatCard stat={"Max Stack"} value={item.max_stack} chart={false} />
            <StatCard
              stat={"Weight"}
              value={item.weight}
              iconBackground="relative border border-zinc-500"
              icon={
                <img
                  src={`https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/weight.webp`}
                />
              }
              chart={false}
            />
            <StatCard stat={"Type"} value={item.type} chart={false} />
            <StatCard stat={"Category"} value={item.category} chart={false} />
          </div>

          {item.stats && (
            <div className="flex flex-col">
              <div className="py-4 px-8 text-sm font-normal text-gray-700 dark:text-white">
                <div className="mb-4 inline-block">
                  {(item?.stats as any[]).map(({ id, value }, i) => {
                    if (!ItemStats[id])
                      return <div key={`${id}${value}${i}`}></div>;
                    return (
                      <p key={`${id}${value}${i}`}>
                        <strong>{ItemStats[id].name}</strong>: {value}
                      </p>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </section>

        {item.DinoStat &&
          item.DinoStat.filter((g) => g.type === "gather_efficiency").length >
          0 && (
            <section className="rounded-lg bg-gray-200 p-4 dark:bg-zinc-600">
              <p className="my-1 text-lg">Gather Efficiency</p>
              <div className="flex flex-col">
                {item.DinoStat.filter((g) => g.type === "gather_efficiency")
                  .sort((a, b) => b.value - a.value)
                  .slice(0, 10)
                  .map((eff, i) => (
                    <div
                      className="flex items-center"
                      key={`gather-efficiency-${i}`}
                    >
                      <Link
                        to={routes.dino({ id: eff.Dino.id })}
                        className="mr-2 w-40 text-sm"
                      >
                        {eff.Dino.name}
                      </Link>

                      <div
                        className="flex h-2 w-32 flex-row divide-x divide-black rounded-full bg-stone-300"
                        title={eff.value.toString()}
                      >
                        {Array.from(Array(5)).map((_, j) => (
                          <div
                            key={`dinostat-${i}-${j}`}
                            className={clsx(
                              `h-full w-1/5 first:rounded-l-full last:rounded-r-full`,
                              {
                                "bg-transparent ": Math.round(eff.value) < i,
                                "[&:nth-child(1)]:bg-red-500":
                                  j === 0 && Math.round(eff.value) >= j + 1,
                                "[&:nth-child(2)]:bg-orange-500":
                                  j === 1 && Math.round(eff.value) >= j + 1,
                                "[&:nth-child(3)]:bg-yellow-500":
                                  j === 2 && Math.round(eff.value) >= j + 1,
                                "[&:nth-child(4)]:bg-lime-500":
                                  j === 3 && Math.round(eff.value) >= j + 1,
                                "[&:nth-child(5)]:bg-green-500":
                                  j === 4 && Math.round(eff.value) >= j + 1,
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
            </section>
          )}

        {item.DinoStat &&
          item.DinoStat.filter((g) => g.type === "weight_reduction").length >
          0 && (
            <section className="rounded-lg bg-stone-300 p-4 dark:bg-zinc-600">
              <p className="my-1 text-lg">Weight Reduction</p>
              <div className="flex flex-col">
                {item.DinoStat.filter((g) => g.type === "weight_reduction")
                  .sort((a, b) => b.value - a.value)
                  .slice(0, 10)
                  .map((wr, i) => (
                    <div
                      className="flex items-center"
                      key={`weight-reduction-${i}`}
                    >
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
                      <p className="text-pea-500 mx-1">{wr.value}%</p>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 320 512"
                        className="text-pea-500 inline-block w-4 fill-current"
                      >
                        <path d="M310.6 246.6l-127.1 128C176.4 380.9 168.2 384 160 384s-16.38-3.125-22.63-9.375l-127.1-128C.2244 237.5-2.516 223.7 2.438 211.8S19.07 192 32 192h255.1c12.94 0 24.62 7.781 29.58 19.75S319.8 237.5 310.6 246.6z" />
                      </svg>
                    </div>
                  ))}
              </div>
            </section>
          )}

        {item.DinoStat &&
          item.DinoStat.filter((g) => g.type === "drops").length > 0 && (
            <section className="rounded-lg">
              <div className="w-fit rounded-lg bg-stone-300 p-4 dark:bg-zinc-600">
                <p className="my-1 text-lg">Dinos that drop {item.name}</p>
                <div className="flex flex-col">
                  {item.DinoStat.filter((g) => g.type === "drops")
                    .sort((a, b) => b.value - a.value)
                    .slice(0, 10)
                    .map((d, i) => (
                      <Link
                        key={`drops-${i}`}
                        to={routes.dino({ id: d.Dino.id })}
                        className="mr-2 w-20 text-sm"
                      >
                        {d.Dino.name}
                      </Link>
                    ))}
                </div>
              </div>
            </section>
          )}

        <section className="col-span-2 flex h-64 gap-4 overflow-hidden rounded-lg border border-zinc-500 bg-gray-200 p-4 dark:bg-zinc-600">
          {item.ItemRecipe_ItemRecipe_crafted_item_idToItem.map(
            (
              {
                id,
                Item_ItemRecipe_crafting_station_idToItem,
                ItemRecipeItem,
                yields,
              },
              i
            ) => (
              <div
                className={clsx(
                  "flex h-full flex-row items-center transition-all duration-500 ease-in-out",
                  {
                    "flex-grow": activeTab === i,
                    "flex-grow-0": activeTab !== i,
                  }
                )}
                key={`recipe-${id}`}
                // style={{
                //   background: 'url("https://cdn.akamai.steamstatic.com/steam/apps/473850/ss_f13c4990d4609d3fc89174f71858835a9f09aaa3.1920x1080.jpg?t=1508277712")',
                //   backgroundSize: "auto",
                //   backgroundRepeat: 'no-repeat',
                //   backgroundPosition: 'left',
                // }}
                onClick={() => setActiveTab(i)}
              >
                <div className="relative flex h-full flex-1 flex-row space-x-4 overflow-hidden rounded-lg bg-zinc-300 p-4 dark:bg-zinc-700">
                  <div className="animate-fade-in flex h-full items-center justify-center transition-colors">
                    <img
                      src={`https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/${Item_ItemRecipe_crafting_station_idToItem.image}`}
                      className="h-16 w-16"
                    />
                  </div>

                  <div
                    className={clsx(
                      "flex flex-row items-center gap-2 border-l border-zinc-600 px-4 dark:border-zinc-200",
                      {
                        hidden: activeTab !== i,
                        block: activeTab === i,
                      }
                    )}
                  >
                    <div className="flex flex-row flex-wrap gap-2">
                      {ItemRecipeItem.map(({ Item, amount }, i) => (
                        <Link
                          to={routes.item({ id: Item.id })}
                          className="animate-fade-in relative rounded-lg border border-zinc-500 p-2 text-center"
                          title={Item.name}
                          key={`recipe-${Item.id}`}
                        >
                          <img
                            className="h-10 w-10"
                            src={`https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/${Item.image}`}
                            alt={Item.name}
                          />
                          <div className="absolute -bottom-1 -right-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-transparent text-xs font-bold">
                            {amount}
                          </div>
                        </Link>
                      ))}
                    </div>

                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 448 512"
                      fill="currentColor"
                      className="h-12 w-12"
                    >
                      <path d="M427.8 266.8l-160 176C264.7 446.3 260.3 448 256 448c-3.844 0-7.703-1.375-10.77-4.156c-6.531-5.938-7.016-16.06-1.078-22.59L379.8 272H16c-8.844 0-15.1-7.155-15.1-15.1S7.156 240 16 240h363.8l-135.7-149.3c-5.938-6.531-5.453-16.66 1.078-22.59c6.547-5.906 16.66-5.469 22.61 1.094l160 176C433.4 251.3 433.4 260.7 427.8 266.8z" />
                    </svg>

                    <Link
                      to={routes.item({ id: item.id })}
                      className="animate-fade-in relative rounded-lg border border-zinc-500 p-2 text-center"
                      title={item.name}
                      key={`recipe-${item.id}`}
                    >
                      <img
                        className="h-10 w-10"
                        src={`https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/${item.image}`}
                        alt={item.name}
                      />
                      <div className="absolute -bottom-1 -right-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-transparent text-xs font-bold">
                        {yields}
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            )
          )}
        </section>

        <div className="col-span-full">
          <nav className="rw-button-group">
            {currentUser?.permissions.some(
              (p: permission) => p === "gamedata_update"
            ) && (
                <Link
                  to={routes.editItem({ id: item.id })}
                  className="rw-button rw-button-blue"
                >
                  Edit
                </Link>
              )}
            {currentUser?.permissions.some(
              (p: permission) => p === "gamedata_delete"
            ) && (
                <button
                  type="button"
                  className="rw-button rw-button-red"
                  onClick={() => onDeleteClick(item.id)}
                >
                  Delete
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 448 512"
                    className="rw-button-icon-end"
                  >
                    <path d="M432 64h-96l-33.63-44.75C293.4 7.125 279.1 0 264 0h-80C168.9 0 154.6 7.125 145.6 19.25L112 64h-96C7.201 64 0 71.2 0 80c0 8.799 7.201 16 16 16h416c8.801 0 16-7.201 16-16C448 71.2 440.8 64 432 64zM152 64l19.25-25.62C174.3 34.38 179 32 184 32h80c5 0 9.75 2.375 12.75 6.375L296 64H152zM400 128C391.2 128 384 135.2 384 144v288c0 26.47-21.53 48-48 48h-224C85.53 480 64 458.5 64 432v-288C64 135.2 56.84 128 48 128S32 135.2 32 144v288C32 476.1 67.89 512 112 512h224c44.11 0 80-35.89 80-80v-288C416 135.2 408.8 128 400 128zM144 416V192c0-8.844-7.156-16-16-16S112 183.2 112 192v224c0 8.844 7.156 16 16 16S144 424.8 144 416zM240 416V192c0-8.844-7.156-16-16-16S208 183.2 208 192v224c0 8.844 7.156 16 16 16S240 424.8 240 416zM336 416V192c0-8.844-7.156-16-16-16S304 183.2 304 192v224c0 8.844 7.156 16 16 16S336 424.8 336 416z" />
                  </svg>
                </button>
              )}
          </nav>
        </div>
      </div>

      <aside id="separator-sidebar" className="w-72" aria-label="Sidebar">
        <div className="overflow-y-auto rounded-lg border border-zinc-500 bg-gray-200 px-3 py-4 dark:bg-zinc-600">
          <ul className="space-y-2 divide-y divide-gray-300">
            <li className="flex flex-col">
              <span className="rounded-lg p-2 font-medium text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">
                Unlocked by
              </span>
              <ol className="ml-4 flex flex-col">
                {item.DinoStat.filter((ds) => ds.type === "engrams")
                  .sort((a, b) => a.Dino.name.localeCompare(b.Dino.name))
                  .map((d) => (
                    <li
                      className="space-x-2 py-0.5"
                      key={`bossdino-${d.Dino.id}`}
                    >
                      <Link
                        key={`bossdino-${d.Dino.id}`}
                        to={routes.dino({
                          id: d.Dino.id.toString(),
                        })}
                        className="text-sm font-medium text-gray-800 dark:text-stone-300"
                      >
                        {d.Dino.name
                          .replace("(Alpha)", "")
                          .replace("(Beta)", "")
                          .replace("(Gamma)", "")
                          .trimEnd()}
                      </Link>
                      <span
                        className={clsx(
                          "rounded border px-1 py-0.5 text-xs font-medium dark:bg-zinc-700",
                          {
                            "border-red-400 bg-red-100 text-red-800 dark:text-red-400":
                              d.Dino.name.includes("Alpha"),
                            "border-yellow-300 bg-yellow-100 text-yellow-800 dark:text-yellow-300":
                              d.Dino.name.includes("Beta"),
                            "border-green-400 bg-green-100 text-green-800 dark:text-green-400":
                              d.Dino.name.includes("Gamma"),
                          }
                        )}
                      >
                        {d.Dino.name.match(/(Gamma|Beta|Alpha)/g)[0]}
                      </span>
                    </li>
                  ))}
              </ol>
            </li>

            <li className="flex flex-col">
              <span className="rounded-lg p-2 font-medium text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">
                Found In
              </span>
              <div className="ml-4 flex flex-col">
                {item?.LootcrateSetEntryItem.filter(
                  (value, index, self) =>
                    index ===
                    self.findIndex(
                      (t) =>
                        t.LootcrateSetEntry.LootcrateSet.Lootcrate.id ===
                        value.LootcrateSetEntry.LootcrateSet.Lootcrate.id &&
                        t.LootcrateSetEntry.LootcrateSet.Lootcrate.id ===
                        value.LootcrateSetEntry.LootcrateSet.Lootcrate.id
                    )
                )
                  .slice(0, 5)
                  .map((g) => (
                    <Link
                      key={`lootcrate-${g.LootcrateSetEntry.id}-${g.LootcrateSetEntry.LootcrateSet.Lootcrate.id}`}
                      to={routes.lootcrate({
                        id: g.LootcrateSetEntry.LootcrateSet.Lootcrate.id.toString(),
                      })}
                      className="rounded border px-2.5 py-0.5 text-xs font-medium text-gray-800 dark:text-white"
                      style={{
                        borderColor:
                          g.LootcrateSetEntry.LootcrateSet.Lootcrate.color,
                      }}
                    >
                      {g.LootcrateSetEntry.LootcrateSet.Lootcrate.name}
                    </Link>
                  ))}
              </div>
            </li>
          </ul>
        </div>
      </aside>
    </article>
  );
};

export default Item;
