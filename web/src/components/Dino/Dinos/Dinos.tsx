import { Link, routes } from "@redwoodjs/router";
import { useMutation } from "@redwoodjs/web";
import { toast } from "@redwoodjs/web/toast";

import { QUERY } from "src/components/Dino/DinosCell";
import {
  checkboxInputTag,
  jsonTruncate,
  timeTag,
  truncate,
} from "src/lib/formatters";

import type { DeleteDinoMutationVariables, FindDinos } from "types/graphql";

const DELETE_DINO_MUTATION = gql`
  mutation DeleteDinoMutation($id: String!) {
    deleteDino(id: $id) {
      id
    }
  }
`;

const DinosList = ({ dinos }: FindDinos) => {
  const [deleteDino] = useMutation(DELETE_DINO_MUTATION, {
    onCompleted: () => {
      toast.success("Dino deleted");
    },
    onError: (error) => {
      toast.error(error.message);
    },
    // This refetches the query on the list page. Read more about other ways to
    // update the cache over here:
    // https://www.apollographql.com/docs/react/data/mutations/#making-all-other-cache-updates
    refetchQueries: [{ query: QUERY }],
    awaitRefetchQueries: true,
  });

  const onDeleteClick = (id: DeleteDinoMutationVariables["id"]) => {
    if (confirm("Are you sure you want to delete dino " + id + "?")) {
      deleteDino({ variables: { id } });
    }
  };

  return (
    <div className="rw-segment rw-table-wrapper-responsive">
      <table className="rw-table">
        <thead>
          <tr>
            <th>Id</th>
            <th>Created at</th>
            <th>Name</th>
            <th>Synonyms</th>
            <th>Description</th>
            <th>Taming notice</th>
            <th>Can destroy</th>
            <th>Immobilized by</th>
            <th>Base stats</th>
            <th>Gather eff</th>
            <th>Exp per kill</th>
            <th>Fits through</th>
            <th>Egg min</th>
            <th>Egg max</th>
            <th>Tdps</th>
            <th>Eats</th>
            <th>Maturation time</th>
            <th>Weight reduction</th>
            <th>Incubation time</th>
            <th>Affinity needed</th>
            <th>Aff inc</th>
            <th>Flee threshold</th>
            <th>Hitboxes</th>
            <th>Drops</th>
            <th>Food consumption base</th>
            <th>Food consumption mult</th>
            <th>Disable ko</th>
            <th>Violent tame</th>
            <th>Taming bonus attr</th>
            <th>Disable food</th>
            <th>Disable mult</th>
            <th>Water movement</th>
            <th>Admin note</th>
            <th>Base points</th>
            <th>Method</th>
            <th>Knockout</th>
            <th>Non violent food affinity mult</th>
            <th>Non violent food rate mult</th>
            <th>Taming interval</th>
            <th>Base taming time</th>
            <th>Exp per kill adj</th>
            <th>Disable tame</th>
            <th>X variant</th>
            <th>&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          {dinos.map((dino) => (
            <tr key={dino.id}>
              <td>{truncate(dino.id)}</td>
              <td>{timeTag(dino.created_at)}</td>
              <td>{truncate(dino.name)}</td>
              <td>{truncate(dino.synonyms.join(", "))}</td>
              <td>{truncate(dino.description)}</td>
              <td>{truncate(dino.taming_notice)}</td>
              <td>{truncate(dino.can_destroy.join(", "))}</td>
              <td>{truncate(dino.immobilized_by.join(", "))}</td>
              <td>{jsonTruncate(dino.base_stats)}</td>
              <td>{jsonTruncate(dino.gather_eff)}</td>
              <td>{truncate(dino.exp_per_kill)}</td>
              <td>{truncate(dino.fits_through.join(", "))}</td>
              <td>{truncate(dino.egg_min)}</td>
              <td>{truncate(dino.egg_max)}</td>
              <td>{truncate(dino.tdps)}</td>
              <td>{truncate(dino.eats.join(", "))}</td>
              <td>{truncate(dino.maturation_time)}</td>
              <td>{jsonTruncate(dino.weight_reduction)}</td>
              <td>{truncate(dino.incubation_time)}</td>
              <td>{truncate(dino.affinity_needed)}</td>
              <td>{truncate(dino.aff_inc)}</td>
              <td>{truncate(dino.flee_threshold)}</td>
              <td>{jsonTruncate(dino.hitboxes)}</td>
              <td>{truncate(dino.drops.join(", "))}</td>
              <td>{truncate(dino.food_consumption_base)}</td>
              <td>{truncate(dino.food_consumption_mult)}</td>
              <td>{checkboxInputTag(dino.disable_ko)}</td>
              <td>{checkboxInputTag(dino.violent_tame)}</td>
              <td>{truncate(dino.taming_bonus_attr)}</td>
              <td>{checkboxInputTag(dino.disable_food)}</td>
              <td>{checkboxInputTag(dino.disable_mult)}</td>
              <td>{checkboxInputTag(dino.water_movement)}</td>
              <td>{truncate(dino.admin_note)}</td>
              <td>{truncate(dino.base_points)}</td>
              <td>{truncate(dino.method.join(", "))}</td>
              <td>{truncate(dino.knockout.join(", "))}</td>
              <td>{truncate(dino.non_violent_food_affinity_mult)}</td>
              <td>{truncate(dino.non_violent_food_rate_mult)}</td>
              <td>{truncate(dino.taming_interval)}</td>
              <td>{truncate(dino.base_taming_time)}</td>
              <td>{truncate(dino.exp_per_kill_adj)}</td>
              <td>{checkboxInputTag(dino.disable_tame)}</td>
              <td>{checkboxInputTag(dino.x_variant)}</td>
              <td>
                <nav className="rw-table-actions">
                  <Link
                    to={routes.dino({ id: dino.id })}
                    title={"Show dino " + dino.id + " detail"}
                    className="rw-button rw-button-small"
                  >
                    Show
                  </Link>
                  <Link
                    to={routes.editDino({ id: dino.id })}
                    title={"Edit dino " + dino.id}
                    className="rw-button rw-button-small rw-button-blue"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    title={"Delete dino " + dino.id}
                    className="rw-button rw-button-small rw-button-red"
                    onClick={() => onDeleteClick(dino.id)}
                  >
                    Delete
                  </button>
                </nav>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DinosList;
