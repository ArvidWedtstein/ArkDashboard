import { Link, routes, navigate } from "@redwoodjs/router";
import { useMutation } from "@redwoodjs/web";
import { toast } from "@redwoodjs/web/toast";
import { Map as MapComp } from "src/components/Util/Map/Map";

import { findShortestPath, jsonDisplay, timeTag } from "src/lib/formatters";

import type { DeleteMapMutationVariables, FindMapById } from "types/graphql";

const DELETE_MAP_MUTATION = gql`
  mutation DeleteMapMutation($id: BigInt!) {
    deleteMap(id: $id) {
      id
    }
  }
`;

interface Props {
  map: NonNullable<FindMapById["map"]>;
}

const Map = ({ map }: Props) => {
  const [deleteMap] = useMutation(DELETE_MAP_MUTATION, {
    onCompleted: () => {
      toast.success("Map deleted");
      navigate(routes.maps());
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onDeleteClick = (id: DeleteMapMutationVariables["id"]) => {
    if (confirm("Are you sure you want to delete map " + id + "?")) {
      deleteMap({ variables: { id } });
    }
  };

  let n: any = map.notes;
  let notes = n.map((n) => {
    return { lat: n.lat, lon: n.long, color: "#00ff00", note: n.note };
  });
  let noterun = []; //[57, 520, 242, 241, 201, 79, 238, 143, 301, 283, 284, 60];

  // let matchLat = [];
  // n.forEach((not) => {
  //   let note = g.find(
  //     (b) =>
  //       (Math.round((b.lon + Number.EPSILON) * 100) / 100).toFixed(1) ===
  //       not.long.toFixed(1)
  //   );
  //   if (
  //     note &&
  //     (Math.round((note.lon + Number.EPSILON) * 100) / 100).toFixed(1) ===
  //       not.long.toFixed(1) &&
  //     (Math.round((note.lat + Number.EPSILON) * 100) / 100).toFixed(1) ===
  //       not.lat.toFixed(1)
  //   ) {
  //     // console.log(not);
  //     // console.log("found");
  //     // console.log(note);

  //     matchLat.push({
  //       ...not,
  //       note: note.note,
  //     });
  //   } else {
  //     matchLat.push({
  //       ...not,
  //       note: "",
  //     });
  //   }
  // });

  // console.log(n.length);
  return (
    <>
      <div className="rw-segment">
        <header className="rw-segment-header">
          <h2 className="rw-heading rw-heading-secondary">
            The {map.name} Map
          </h2>
        </header>
        <MapComp
          interactive={true}
          map={map.name.replace(" ", "")}
          size={{ width: 500, height: 500 }}
          pos={notes}
          path={{
            color: "#0000ff",
            coords: noterun.map((b) => {
              let note = n.find((j) => j.noteIndex === b);

              return {
                lat: note.lat,
                lon: note.long,
              };
            }),
          }}
        />
        {/* <table className="rw-table">
          <tbody>
            <tr>
              <th>Id</th>
              <td>{map.id}</td>
            </tr><tr>
              <th>Created at</th>
              <td>{timeTag(map.created_at)}</td>
            </tr><tr>
              <th>Name</th>
              <td>{map.name}</td>
            </tr><tr>
              <th>Loot crates</th>
              <td>{jsonDisplay(map.loot_crates)}</td>
            </tr><tr>
              <th>Oil veins</th>
              <td>{jsonDisplay(map.oil_veins)}</td>
            </tr><tr>
              <th>Water veins</th>
              <td>{jsonDisplay(map.water_veins)}</td>
            </tr><tr>
              <th>Wyvern nests</th>
              <td>{jsonDisplay(map.wyvern_nests)}</td>
            </tr><tr>
              <th>Ice wyvern nests</th>
              <td>{jsonDisplay(map.ice_wyvern_nests)}</td>
            </tr><tr>
              <th>Gas veins</th>
              <td>{jsonDisplay(map.gas_veins)}</td>
            </tr><tr>
              <th>Deinonychus nests</th>
              <td>{jsonDisplay(map.deinonychus_nests)}</td>
            </tr><tr>
              <th>Charge nodes</th>
              <td>{jsonDisplay(map.charge_nodes)}</td>
            </tr><tr>
              <th>Plant z nodes</th>
              <td>{jsonDisplay(map.plant_z_nodes)}</td>
            </tr><tr>
              <th>Drake nests</th>
              <td>{jsonDisplay(map.drake_nests)}</td>
            </tr><tr>
              <th>Glitches</th>
              <td>{jsonDisplay(map.glitches)}</td>
            </tr><tr>
              <th>Magmasaur nests</th>
              <td>{jsonDisplay(map.magmasaur_nests)}</td>
            </tr><tr>
              <th>Poison trees</th>
              <td>{jsonDisplay(map.poison_trees)}</td>
            </tr><tr>
              <th>Mutagen bulbs</th>
              <td>{jsonDisplay(map.mutagen_bulbs)}</td>
            </tr><tr>
              <th>Carniflora</th>
              <td>{jsonDisplay(map.carniflora)}</td>
            </tr><tr>
              <th>Notes</th>
              <td>{jsonDisplay(map.notes)}</td>
            </tr><tr>
              <th>Img</th>
              <td>{map.img}</td>
            </tr>
          </tbody>
        </table> */}
      </div>
      <nav className="rw-button-group">
        <Link
          to={routes.editMap({ id: map.id.toString() })}
          className="rw-button rw-button-blue"
        >
          Edit
        </Link>
        <button
          type="button"
          className="rw-button rw-button-red"
          onClick={() => onDeleteClick(map.id)}
        >
          Delete
        </button>
      </nav>
    </>
  );
};

export default Map;
