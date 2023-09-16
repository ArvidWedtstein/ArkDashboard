import { Link, routes, navigate } from "@redwoodjs/router";
import { useMutation } from "@redwoodjs/web";
import { toast } from "@redwoodjs/web/toast";
import { JSXElementConstructor, ReactElement, useMemo } from "react";
import { useAuth } from "src/auth";
import StatCard from "src/components/Util/StatCard/StatCard";
import Table from "src/components/Util/Table/Table";
import Tabs, { Tab } from "src/components/Util/Tabs/Tabs";
import Toast from "src/components/Util/Toast/Toast";

import {
  checkboxInputTag,
  groupBy,
  jsonDisplay,
  timeTag,
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
      return {
        set,
        entries: entries[1].length,
        collapseContent: (
          <div className="p-3">
            <p>
              The tier set "{set}" contains exactly{" "}
              {(entries[1][1][0].set_qty_scale as qty).min !==
              (entries[1][1][0].set_qty_scale as qty).max
                ? `at least ${
                    (entries[1][1][0].set_qty_scale as qty).min
                  } and at most ${(entries[1][1][0].set_qty_scale as qty).max}`
                : `exactly ${(entries[1][1][0].set_qty_scale as qty).min}`}{" "}
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
                        ? `at least ${
                            (items[0].entry_qty as qty).min
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
                        : `as item or as blueprint with quality ${
                            (items[0].entry_quality as qty).min * 100
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
              value={`${(lootcrate.set_qty as qty).min}-${
                (lootcrate.set_qty as qty).max
              }`}
              chart={false}
            />
            <StatCard
              stat={"Quality"}
              value={`${(lootcrate.quality_mult as qty).min * 100}% - ${
                (lootcrate.quality_mult as qty).max * 100
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

        {/* TODO: add map component */}
      </div>
      <nav className="rw-button-group">
        {currentUser?.permissions.some(
          (p: permission) => p === "gamedata_update"
        ) && (
          <Link
            to={routes.editLootcrate({ id: lootcrate.id })}
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
            onClick={() => onDeleteClick(lootcrate.id)}
          >
            Delete
          </button>
        )}
      </nav>
    </article>
  );
};

export default Lootcrate;
