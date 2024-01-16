import type { EditDinoById, UpdateDinoInput } from "types/graphql";

import { navigate, routes } from "@redwoodjs/router";
import type { CellSuccessProps, CellFailureProps } from "@redwoodjs/web";
import { useMutation } from "@redwoodjs/web";
import { toast } from "@redwoodjs/web/toast";

import DinoForm from "src/components/Dino/DinoForm";

export const QUERY = gql`
  query EditDinoById($id: String!) {
    dino: dino(id: $id) {
      id
      created_at
      name
      synonyms
      description
      taming_notice
      can_destroy
      base_stats
      exp_per_kill
      egg_min
      egg_max
      torpor_depetion_per_second
      maturation_time
      incubation_time
      affinity_needed
      aff_inc
      flee_threshold
      hitboxes
      food_consumption_base
      food_consumption_mult
      taming_method
      taming_ineffectiveness
      disable_food
      disable_mult
      admin_note
      base_points
      non_violent_food_affinity_mult
      non_violent_food_rate_mult
      taming_interval
      base_taming_time
      tamable
      attack
      variants
      mounted_weaponry
      ridable
      movement
      type
      carryable_by
      released
      breedable
      bp
      default_dmg
      diet
      default_swing_radius
      targeting_team_name
      temperament
      flags
      mating_cooldown_min
      mating_cooldown_max
      gestation_time
      baby_food_consumption_mult
      icon
      image
      DinoStat {
        id
        item_id
        dino_id
        Item {
          id
          name
          image
        }
        value
        type
      }
    }
  }
`;
const UPDATE_DINO_MUTATION = gql`
  mutation UpdateDinoMutation($id: String!, $input: UpdateDinoInput!) {
    updateDino(id: $id, input: $input) {
      id
      created_at
      name
      synonyms
      description
      taming_notice
      can_destroy
      base_stats
      exp_per_kill
      egg_min
      egg_max
      torpor_depetion_per_second
      maturation_time
      incubation_time
      affinity_needed
      aff_inc
      flee_threshold
      hitboxes
      food_consumption_base
      food_consumption_mult
      taming_method
      taming_ineffectiveness
      disable_food
      disable_mult
      admin_note
      base_points
      non_violent_food_affinity_mult
      non_violent_food_rate_mult
      taming_interval
      base_taming_time
      tamable
      variants
      attack
      mounted_weaponry
      ridable
      movement
      type
      carryable_by
      released
      breedable
      bp
      default_dmg
      diet
      default_swing_radius
      targeting_team_name
      temperament
      flags
      mating_cooldown_min
      mating_cooldown_max
      gestation_time
      baby_food_consumption_mult
      icon
      image
    }
  }
`;

// TODO: fix loading
export const Loading = () => <div>Loading...</div>;

export const Failure = ({ error }: CellFailureProps) => {
  return (
    <div className="rw-cell-error flex items-center space-x-3">
      <svg
        className="h-12 w-12 fill-current"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 512 512"
      >
        <path d="M256 304c4.406 0 8-3.578 8-8v-176c0-4.422-3.594-8-8-8S248 115.6 248 120v176C248 300.4 251.6 304 256 304zM256 352c-8.836 0-16 7.164-16 16S247.2 384 256 384s16-7.164 16-16S264.8 352 256 352zM256 0C114.6 0 0 114.6 0 256s114.6 256 256 256s256-114.6 256-256S397.4 0 256 0zM256 496c-132.3 0-240-107.7-240-240S123.7 16 256 16s240 107.7 240 240S388.3 496 256 496z" />
      </svg>
      <div className="flex flex-col">
        <p className="text-lg font-bold leading-snug">
          Some unexpected shit happend
        </p>
        <p className="text-sm">{error?.message}</p>
      </div>
    </div>
  );
};
export const Success = ({ dino }: CellSuccessProps<EditDinoById>) => {
  const [updateDino, { loading, error }] = useMutation(UPDATE_DINO_MUTATION, {
    onCompleted: () => {
      toast.success("Dino updated");
      navigate(routes.dinos());
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onSave = (input: UpdateDinoInput, id: EditDinoById["dino"]["id"]) => {
    toast.promise(updateDino({ variables: { id, input } }), {
      loading: "Updating dino...",
      success: "Dino successfully updated",
      error: <b>Failed to update dino.</b>,
    });
  };

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">
          Edit Dino {dino?.name}
        </h2>
      </header>
      <div className="rw-segment-main">
        <DinoForm dino={dino} onSave={onSave} error={error} loading={loading} />
      </div>
    </div>
  );
};
