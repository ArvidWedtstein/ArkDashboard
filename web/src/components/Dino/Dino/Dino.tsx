import { Link, routes, navigate } from "@redwoodjs/router";
import { useMutation } from "@redwoodjs/web";
import { toast } from "@redwoodjs/web/toast";


import type { DeleteDinoMutationVariables, FindDinoById } from "types/graphql";

const DELETE_DINO_MUTATION = gql`
  mutation DeleteDinoMutation($id: String!) {
    deleteDino(id: $id) {
      id
    }
  }
`;

interface Props {
  dino: NonNullable<FindDinoById["dino"]>;
}

const Dino = ({ dino }: Props) => {
  const [deleteDino] = useMutation(DELETE_DINO_MUTATION, {
    onCompleted: () => {
      toast.success("Dino deleted");
      navigate(routes.dinos());
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onDeleteClick = (id: DeleteDinoMutationVariables["id"]) => {
    if (confirm("Are you sure you want to delete dino " + id + "?")) {
      deleteDino({ variables: { id } });
    }
  };

  let walls = {
    t: "thatch",
    w: "wooden",
    a: "adobe",
    s: "stone",
    m: "metal",
    tk: "tek",
  };
  return (
    <>
      <div className="container mx-auto flex flex-row items-center">
        <img src="https://www.dododex.com/media/creature/shadowmane.png" />
        <div className="py-4 px-8 font-['lato'] text-sm font-light text-white">
          <div className="m-0 mb-4 text-2xl uppercase tracking-widest">
            <strong className="text-3xl font-light">{dino.name}</strong>
          </div>

          <div className="mr-4 mb-4 italic">
            <p>{dino.description}</p>
          </div>
          {/* <div className="mr-4 mb-4 inline-block">
            <strong>Seen:</strong> 0
          </div> */}
          <div className="mr-4 mb-4 flex flex-row space-x-1">
            {/* <svg className="w-6 fill-white" viewBox="0 0 640 512">
              <path d="M168.8 462.3c-7.9-4-11.1-13.6-7.2-21.5L192 380.2l0-44.2c0-4.2 1.7-8.3 4.7-11.3L256 265.4V242.2L139.2 344C87.8 395.3 0 358.9 0 286.3c0-41.1 30.6-75.8 71.4-80.9l159.9-23.9-49.6-41.3c-5.1-4.2-7-11.1-4.9-17.4l13.9-41.7-29-58.1c-4-7.9-.7-17.5 7.2-21.5s17.5-.7 21.5 7.2l32 64c1.9 3.8 2.2 8.2 .9 12.2l-12.5 37.6L256 160.5V137.9c0-14.9 10.1-27.3 23.8-31V63.7c0-4.5 3.7-8.2 8.2-8.2s8.2 3.7 8.2 8.2V107c13.7 3.6 23.8 16.1 23.8 31v22.6l45.4-37.8L352.8 85.1c-1.3-4-1-8.4 .9-12.2l32-64c4-7.9 13.6-11.1 21.5-7.2s11.1 13.6 7.2 21.5l-29 58.1 13.9 41.7c2.1 6.2 .1 13.1-4.9 17.4l-49.6 41.3 159.9 23.9c22.5 2.8 41.8 14.6 54.7 31.4c-2.7 2.6-5.2 5.4-7.3 8.6c-8.6-12.9-23.3-21.5-40-21.5s-31.4 8.5-40 21.5c-8.6-12.9-23.3-21.5-40-21.5c-21.7 0-40 14.3-45.9 34.1c-10.7 3.2-19.8 10.1-25.9 19.2l-40.2-35v23.1l32.4 32.4c-.3 2-.4 4.1-.4 6.2c0 16.7 8.5 31.4 21.5 40c-4 2.6-7.5 5.9-10.6 9.5L320 310.6v50c0 17.7-14.3 32-32 32s-32-14.3-32-32v-50l-32 32 0 41.4c0 2.5-.6 4.9-1.7 7.2l-32 64c-4 7.9-13.6 11.1-21.5 7.2zM512 256c8.8 0 16 7.2 16 16v16h48V272c0-8.8 7.2-16 16-16s16 7.2 16 16v16h16c8.8 0 16 7.2 16 16s-7.2 16-16 16H608v48h16c8.8 0 16 7.2 16 16s-7.2 16-16 16H608v48h16c8.8 0 16 7.2 16 16s-7.2 16-16 16H608v16c0 8.8-7.2 16-16 16s-16-7.2-16-16V480H528v16c0 8.8-7.2 16-16 16s-16-7.2-16-16V480H448v16c0 8.8-7.2 16-16 16s-16-7.2-16-16V480H400c-8.8 0-16-7.2-16-16s7.2-16 16-16h16V400H400c-8.8 0-16-7.2-16-16s7.2-16 16-16h16V320H400c-8.8 0-16-7.2-16-16s7.2-16 16-16h16V272c0-8.8 7.2-16 16-16s16 7.2 16 16v16h48V272c0-8.8 7.2-16 16-16zm16 112h48V320H528v48zm0 80h48V400H528v48zM448 320v48h48V320H448zm0 80v48h48V400H448z" />
            </svg> */}
            <strong>Immobilized By:</strong>
            {dino.immobilized_by &&
              dino.immobilized_by.map((w) => (
                <img
                  className="w-5"
                  src={`https://arkids.net/image/item/120/${w
                    .replaceAll(" ", "-")
                    .replace("plant-species-y", "plant-species-y-trap")}.png`}
                />
              ))}
          </div>
          <div className="mr-4 mb-4 flex flex-row space-x-1">
            <strong>Can Destroy:</strong>
            {dino.can_destroy &&
              dino.can_destroy.map((w) => (
                <img
                  className="w-6"
                  src={`https://arkids.net/image/item/120/${walls[w]}-wall.png`}
                />
              ))}
          </div>
          {/* <br /> */}
          {/* <div className="mr-4 mb-4 inline-block">
            <strong>Weight:</strong> 69kg
          </div>
          <div className="mr-4 mb-4 inline-block">
            <strong>Height:</strong> 0.3m
          </div> */}
          <br />
          <div className="mr-4 mb-4 inline-block">
            <strong>Type:</strong>{" "}
            {dino.violent_tame ? "Aggressive" : "Passive"}
          </div>
          <div className="text-lg">Food</div>
          <div className="mb-4">
            {dino.eats.map((f) => (
              <p className="leading-5">{f}</p>
            ))}
          </div>
          <div className="text-lg">Some tegst</div>
          <div className="mr-4 mb-4 inline-block">
            <strong>Taming:</strong> yes
          </div>
        </div>
      </div>
      {/* <div className="rw-segment">
        <header className="rw-segment-header">
          <h2 className="rw-heading rw-heading-secondary">
            Dino {dino.id} Detail
          </h2>
        </header>
        <table className="rw-table">
          <tbody>
            <tr>
              <th>Id</th>
              <td>{dino.id}</td>
            </tr>
            <tr>
              <th>Created at</th>
              <td>{timeTag(dino.created_at)}</td>
            </tr>
            <tr>
              <th>Name</th>
              <td>{dino.name}</td>
            </tr>
            <tr>
              <th>Synonyms</th>
              <td>{dino.synonyms}</td>
            </tr>
            <tr>
              <th>Description</th>
              <td>{dino.description}</td>
            </tr>
            <tr>
              <th>Taming notice</th>
              <td>{dino.taming_notice}</td>
            </tr>
            <tr>
              <th>Can destroy</th>
              <td>{dino.can_destroy}</td>
            </tr>
            <tr>
              <th>Immobilized by</th>
              <td>{dino.immobilized_by}</td>
            </tr>
            <tr>
              <th>Base stats</th>
              <td>{jsonDisplay(dino.base_stats)}</td>
            </tr>
            <tr>
              <th>Gather eff</th>
              <td>{jsonDisplay(dino.gather_eff)}</td>
            </tr>
            <tr>
              <th>Exp per kill</th>
              <td>{dino.exp_per_kill}</td>
            </tr>
            <tr>
              <th>Fits through</th>
              <td>{dino.fits_through}</td>
            </tr>
            <tr>
              <th>Egg min</th>
              <td>{dino.egg_min}</td>
            </tr>
            <tr>
              <th>Egg max</th>
              <td>{dino.egg_max}</td>
            </tr>
            <tr>
              <th>Tdps</th>
              <td>{dino.tdps}</td>
            </tr>
            <tr>
              <th>Eats</th>
              <td>{dino.eats}</td>
            </tr>
            <tr>
              <th>Maturation time</th>
              <td>{dino.maturation_time}</td>
            </tr>
            <tr>
              <th>Weight reduction</th>
              <td>{jsonDisplay(dino.weight_reduction)}</td>
            </tr>
            <tr>
              <th>Incubation time</th>
              <td>{dino.incubation_time}</td>
            </tr>
            <tr>
              <th>Affinity needed</th>
              <td>{dino.affinity_needed}</td>
            </tr>
            <tr>
              <th>Aff inc</th>
              <td>{dino.aff_inc}</td>
            </tr>
            <tr>
              <th>Flee threshold</th>
              <td>{dino.flee_threshold}</td>
            </tr>
            <tr>
              <th>Hitboxes</th>
              <td>{jsonDisplay(dino.hitboxes)}</td>
            </tr>
            <tr>
              <th>Drops</th>
              <td>{dino.drops}</td>
            </tr>
            <tr>
              <th>Food consumption base</th>
              <td>{dino.food_consumption_base}</td>
            </tr>
            <tr>
              <th>Food consumption mult</th>
              <td>{dino.food_consumption_mult}</td>
            </tr>
            <tr>
              <th>Disable ko</th>
              <td>{checkboxInputTag(dino.disable_ko)}</td>
            </tr>
            <tr>
              <th>Violent tame</th>
              <td>{checkboxInputTag(dino.violent_tame)}</td>
            </tr>
            <tr>
              <th>Taming bonus attr</th>
              <td>{dino.taming_bonus_attr}</td>
            </tr>
            <tr>
              <th>Disable food</th>
              <td>{checkboxInputTag(dino.disable_food)}</td>
            </tr>
            <tr>
              <th>Disable mult</th>
              <td>{checkboxInputTag(dino.disable_mult)}</td>
            </tr>
            <tr>
              <th>Water movement</th>
              <td>{checkboxInputTag(dino.water_movement)}</td>
            </tr>
            <tr>
              <th>Admin note</th>
              <td>{dino.admin_note}</td>
            </tr>
            <tr>
              <th>Base points</th>
              <td>{dino.base_points}</td>
            </tr>
            <tr>
              <th>Method</th>
              <td>{dino.method}</td>
            </tr>
            <tr>
              <th>Knockout</th>
              <td>{dino.knockout}</td>
            </tr>
            <tr>
              <th>Non violent food affinity mult</th>
              <td>{dino.non_violent_food_affinity_mult}</td>
            </tr>
            <tr>
              <th>Non violent food rate mult</th>
              <td>{dino.non_violent_food_rate_mult}</td>
            </tr>
            <tr>
              <th>Taming interval</th>
              <td>{dino.taming_interval}</td>
            </tr>
            <tr>
              <th>Base taming time</th>
              <td>{dino.base_taming_time}</td>
            </tr>
            <tr>
              <th>Exp per kill adj</th>
              <td>{dino.exp_per_kill_adj}</td>
            </tr>
            <tr>
              <th>Disable tame</th>
              <td>{checkboxInputTag(dino.disable_tame)}</td>
            </tr>
            <tr>
              <th>X variant</th>
              <td>{checkboxInputTag(dino.x_variant)}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <nav className="rw-button-group">
        <Link
          to={routes.editDino({ id: dino.id })}
          className="rw-button rw-button-blue"
        >
          Edit
        </Link>
        <button
          type="button"
          className="rw-button rw-button-red"
          onClick={() => onDeleteClick(dino.id)}
        >
          Delete
        </button>
      </nav> */}
    </>
  );
};

export default Dino;
