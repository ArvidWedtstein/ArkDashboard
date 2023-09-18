import { Link, routes, navigate } from "@redwoodjs/router";
import { useMutation } from "@redwoodjs/web";
import { toast } from "@redwoodjs/web/toast";
import { useMemo } from "react";
import { useAuth } from "src/auth";
import Map from "src/components/Util/Map/Map";
import StatCard from "src/components/Util/StatCard/StatCard";
import Table from "src/components/Util/Table/Table";
import Tabs, { Tab } from "src/components/Util/Tabs/Tabs";
import Toast from "src/components/Util/Toast/Toast";

import {
  groupBy,
} from "src/lib/formatters";

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

  type qty = { min: number; max: number; pow?: number };
  /**
   * FORMULAS
   *
   * Randomized Quality:
   * For each item stat used by that item, a Randomized Quality(RQ) is generated between 0 and AQ*RO,
   * where RO is the Randomizer Range Override specific to that stat and item type.
   * The RQ is used to determine the overall item quality and the value of that stat.
   *
   * Item Stat Value:
   * The actual value of individual stats are determined by their RQ, Initial Value Constant(IV), State Modifier Scale(MS), Default Modified Value(DM), and Randomizer Range Multiplier(RM) as:
   * IV + IV*MS*DM + IV*MS*RM*RQ
   *
   * Item Cost:
   * The final Cost of the item is calculated based on Base Cost(BC), Resource Requirement Rating Scale(RS), Crafting Resources Requirements Multiplier(CM), which is determined by item quality, and Item Rating(IR) as:
   * BC+(BC*IR*RS*CM*0.3)
   *
   * Item Quality:
   * Each stat's individual item quality is calculated as (RQ^2/(AQ*RO))*RV, where RV is the Rating Value Modifier specific to that stat and item.
   * The item quality of each stat is then averaged together to get the Item Rating(IR) and compared to the Random Multiplier Threshold to determine quality.
   * An Item's Quality tier determines the multipliers applied to the XP gained from crafting or repairing the item and to the crafting cost for the item (including repair costs).
   *
   * NOTE: Double Crates have Arbitrary Value multiplied by 2
   */

  const calculatedLootcrateDrops = useMemo(() => {
    const sets = Object.entries(
      groupBy(lootcrate.LootcrateItem, "set_name")
    ).map(([set, v]) => {
      const entries = Object.entries(groupBy(v, "entry_name"));

      if (!entries) return null;
      return {
        set,
        entries: entries[0][1].length,
        collapseContent: (
          <div className="p-3">
            <p>
              The tier set "{set}" contains exactly{" "}
              {(entries[0][1][0].set_qty_scale as qty).min !==
                (entries[0][1][0].set_qty_scale as qty).max
                ? `at least ${(entries[0][1][0].set_qty_scale as qty).min
                } and at most ${(entries[0][1][0].set_qty_scale as qty).max}`
                : `exactly ${(entries[0][1][0].set_qty_scale as qty).min}`}{" "}
              of the following entries.
            </p>
            <Tabs size="md">
              {entries.map(([entry, items]) => (
                <Tab label={entry}>
                  <div className="py-2">
                    <p>
                      The item entry "{entry}" contains{" "}
                      {(items[0].entry_qty as qty).min !==
                        (items[0].entry_qty as qty).max
                        ? `at least ${(items[0].entry_qty as qty).min
                        } and at most ${(items[0].entry_qty as qty).max}`
                        : `exactly ${(items[0].entry_qty as qty).min}`}{" "}
                      of the following items.
                    </p>
                    <div className="grid grid-flow-row grid-cols-4 gap-1 py-3">
                      {items.map((item) => (
                        <Link
                          to={routes.item({ id: item.Item.id })}
                          className="inline-flex max-w-xs flex-1 items-center space-x-1 rounded bg-zinc-200 p-1  dark:bg-zinc-500"
                        >
                          <img
                            loading="lazy"
                            src={`https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/${item.Item.image}`}
                            className="h-8 w-8"
                          />
                          <span>{item.Item.name}</span>
                        </Link>
                      ))}
                    </div>
                    <p className="rw-badge rw-badge-yellow-outline">
                      {(items[0].entry_quality as qty).min === 0
                        ? `only as blueprint`
                        : `as item or as blueprint with quality ${(items[0].entry_quality as qty).min * 100
                        }%`}
                    </p>
                  </div>
                </Tab>
              ))}
            </Tabs>
          </div>
        ),
      };
    });

    return sets;
  }, [lootcrate]);

  return (
    <article className="rw-segment">
      <div className="grid w-full grid-cols-2 gap-3 text-gray-700 dark:text-white">
        <section className="col-span-2 grid w-full grid-flow-col gap-2 rounded-lg border border-zinc-500 bg-gray-200 p-4 dark:bg-zinc-600">
          <div className="w-full">
            <Link className="rw-button rw-button-small rw-button-gray mb-2" to={routes.lootcrates()}>
              <span className="sr-only">Back</span>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="rw-button-icon">
                <path d="M447.1 256C447.1 264.8 440.8 272 432 272H68.17l135.7 149.3c5.938 6.531 5.453 16.66-1.078 22.59C199.7 446.6 195.8 448 192 448c-4.344 0-8.688-1.75-11.84-5.25l-160-176c-5.547-6.094-5.547-15.41 0-21.5l160-176c5.969-6.562 16.09-7 22.61-1.094c6.531 5.938 7.016 16.06 1.078 22.59L68.17 240H432C440.8 240 447.1 247.2 447.1 256z" />
              </svg>
            </Link>
            <img
              className="max-h-36 w-auto max-w-6xl"
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
            <StatCard
              stat={"Required Level"}
              value={lootcrate.required_level}
              chart={false}
            />
            <StatCard
              stat={"Maps"}
              value={lootcrate.LootcrateMap.length}
              chart={false}
            />
            <StatCard
              stat={"Items"}
              value={lootcrate.LootcrateItem.length}
              chart={false}
            />
            <StatCard
              stat={"Sets"}
              value={`${(lootcrate.set_qty as qty).min}-${(lootcrate.set_qty as qty).max
                }`}
              chart={false}
            />
            <StatCard
              stat={"Quality"}
              value={`${(lootcrate.quality_mult as qty).min * 100}% - ${(lootcrate.quality_mult as qty).max * 100
                }%`}
              chart={false}
            />
          </div>
        </section>

        <Table
          rows={calculatedLootcrateDrops}
          columns={[
            {
              field: "set",
              header: "Set",
            },
            {
              field: "entries",
              header: "Entries",
              render: ({ value }) => (
                <span className="rw-badge rw-badge-small rw-badge-gray">
                  {value}
                </span>
              ),
            },
          ]}
        />

        {lootcrate?.LootcrateMap?.some(f => f.positions != null) && (
          <div className="relative w-fit">
            <Map
              disable_sub_map={false}
              mapFilter={(m) => m.id in lootcrate.LootcrateMap.map(c => c.map_id)}
              pos={lootcrate.LootcrateMap.flatMap(c => {
                const pos = c.positions as { latitude: number; longitude: number; }[];
                return pos.map(p => ({ lat: p.latitude, lon: p.longitude, map_id: c.map_id, name: c.description }))
              })}
            />
          </div>
        )}
      </div>
      <nav className="rw-button-group">
        {currentUser?.permissions.some(
          (p: permission) => p === "gamedata_update"
        ) && (
            <Link
              to={routes.editLootcrate({ id: lootcrate.id })}
              className="rw-button rw-button-blue"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                className="rw-button-icon-start"
              >
                <path d="M493.2 56.26l-37.51-37.51C443.2 6.252 426.8 0 410.5 0c-16.38 0-32.76 6.25-45.26 18.75L45.11 338.9c-8.568 8.566-14.53 19.39-17.18 31.21l-27.61 122.8C-1.7 502.1 6.158 512 15.95 512c1.047 0 2.116-.1034 3.198-.3202c0 0 84.61-17.95 122.8-26.93c11.54-2.717 21.87-8.523 30.25-16.9l321.2-321.2C518.3 121.7 518.2 81.26 493.2 56.26zM149.5 445.2c-4.219 4.219-9.252 7.039-14.96 8.383c-24.68 5.811-69.64 15.55-97.46 21.52l22.04-98.01c1.332-5.918 4.303-11.31 8.594-15.6l247.6-247.6l82.76 82.76L149.5 445.2zM470.7 124l-50.03 50.02l-82.76-82.76l49.93-49.93C393.9 35.33 401.9 32 410.5 32s16.58 3.33 22.63 9.375l37.51 37.51C483.1 91.37 483.1 111.6 470.7 124z" />
              </svg>
              Edit
            </Link>
          )}
        {currentUser?.permissions.some(
          (p: permission) => p === "gamedata_delete"
        ) && (
            <button
              type="button"
              className="rw-button rw-button-red"
              onClick={() => onDeleteClick(lootcrate.id)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
                className="rw-button-icon-start"
              >
                <path d="M432 64h-96l-33.63-44.75C293.4 7.125 279.1 0 264 0h-80C168.9 0 154.6 7.125 145.6 19.25L112 64h-96C7.201 64 0 71.2 0 80c0 8.799 7.201 16 16 16h416c8.801 0 16-7.201 16-16C448 71.2 440.8 64 432 64zM152 64l19.25-25.62C174.3 34.38 179 32 184 32h80c5 0 9.75 2.375 12.75 6.375L296 64H152zM400 128C391.2 128 384 135.2 384 144v288c0 26.47-21.53 48-48 48h-224C85.53 480 64 458.5 64 432v-288C64 135.2 56.84 128 48 128S32 135.2 32 144v288C32 476.1 67.89 512 112 512h224c44.11 0 80-35.89 80-80v-288C416 135.2 408.8 128 400 128zM144 416V192c0-8.844-7.156-16-16-16S112 183.2 112 192v224c0 8.844 7.156 16 16 16S144 424.8 144 416zM240 416V192c0-8.844-7.156-16-16-16S208 183.2 208 192v224c0 8.844 7.156 16 16 16S240 424.8 240 416zM336 416V192c0-8.844-7.156-16-16-16S304 183.2 304 192v224c0 8.844 7.156 16 16 16S336 424.8 336 416z" />
              </svg>
              Delete
            </button>
          )}
      </nav>
    </article>
  );
};

export default Lootcrate;
