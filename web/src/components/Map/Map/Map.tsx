
import { Link, routes, navigate } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'
import IslandMap, { Map as MapComp } from 'src/components/Util/Map/Map'

import { findShortestPath, jsonDisplay, timeTag, } from 'src/lib/formatters'

import type { DeleteMapMutationVariables, FindMapById } from 'types/graphql'

const DELETE_MAP_MUTATION = gql`
  mutation DeleteMapMutation($id: BigInt!) {
    deleteMap(id: $id) {
      id
    }
  }
`

interface Props {
  map: NonNullable<FindMapById['map']>
}

const Map2 = ({ map }: Props) => {
  const [deleteMap] = useMutation(DELETE_MAP_MUTATION, {
    onCompleted: () => {
      toast.success('Map deleted')
      navigate(routes.maps())
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const onDeleteClick = (id: DeleteMapMutationVariables['id']) => {
    if (confirm('Are you sure you want to delete map ' + id + '?')) {
      deleteMap({ variables: { id } })
    }
  }
  function generateRandomHex(length: number): string {
    const hexChars = '0123456789abcdef';
    let result = '#';
    for (let i = 0; i < length; i++) {
      result += hexChars[Math.floor(Math.random() * hexChars.length)];
    }
    return result;
  }

  interface Note {
    x: number;
    y: number;
    z: number;
    lat: number;
    long: number;
    noteIndex: number;
  }

  function generatePath(notes: Note[]): Note[] {
    // Sort notes by their index in ascending order
    notes.sort((a, b) => a.noteIndex - b.noteIndex);

    const visited = new Set<Note>();
    const path: Note[] = [];

    // Starting point is the first note in the array
    let currentNote = notes[0];

    while (visited.size < notes.length) {
      // Add current note to visited set and path
      visited.add(currentNote);
      path.push(currentNote);

      // Find the nearest unvisited note
      let nearestNote: Note | undefined;
      let nearestDistance = Infinity;

      for (const note of notes) {
        if (!visited.has(note)) {
          const distance = Math.sqrt(
            (note.x - currentNote.x) ** 2 +
            (note.y - currentNote.y) ** 2 +
            (note.z - currentNote.z) ** 2
          );

          if (distance < nearestDistance) {
            nearestNote = note;
            nearestDistance = distance;
          }
        }
      }

      // Set nearest unvisited note as the next current note
      currentNote = nearestNote!;
    }

    // Add last note to path and return it
    if (currentNote) path.push(currentNote);

    return path;
  }



  let d: any = map.notes
  let d2 = generatePath(d)

  let notes = d2.map((w) => {
    return { lat: w.lat, lon: w.long }
  })

  interface Object {
    x: number;
    y: number;
  }

  function groupObjectsByProximity(objects: Object[]): Object[][] {
    const groups: Object[][] = [];
    const visited: boolean[] = new Array(objects.length).fill(false);

    function dfs(index: number, group: Object[]) {
      visited[index] = true;
      group.push(objects[index]);

      for (let i = 0; i < objects.length; i++) {
        if (!visited[i] && distance(objects[index], objects[i]) <= 10) {
          dfs(i, group);
        }
      }
    }

    for (let i = 0; i < objects.length; i++) {
      if (!visited[i]) {
        const group: Object[] = [];
        dfs(i, group);
        groups.push(group);
      }
    }

    return groups;
  }

  function distance(a: Object, b: Object): number {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  function getClosestObjects(objects: Object[]): any[] {
    const groups = groupObjectsByProximity(objects);
    const sorted = groups.sort((a, b) => {
      const aCenter = getCenter(a);
      const bCenter = getCenter(b);
      return distance({ x: 0, y: 0 }, aCenter) - distance({ x: 0, y: 0 }, bCenter);
    });
    const closest = sorted[0];
    const closestObjects = closest.sort((a, b) => distance(a, b));
    return closestObjects.slice(0, 11);
  }

  function getCenter(objects: Object[]) {
    const sum = objects.reduce((acc, obj) => ({ x: acc.x + obj.x, y: acc.y + obj.y }), { x: 0, y: 0 });
    const avg = { x: sum.x / objects.length, y: sum.y / objects.length };
    return avg;
  }
  let coords = getClosestObjects(d).map((w) => {
    return { lat: w.lat, lon: w.long }
  })
  console.log(coords)
  // coords[0].map((w) => {
  //   console.log(w.altitude, w.distance)
  //   return { lat: w.lat, lon: w.long }
  // })
  // let path = findShortestPath(notes)
  // let d: any = map.loot_crates
  // let crates = d.flatMap((crate) => {
  //   let col = generateRandomHex(6)
  //   return crate.map((c) => {
  //     return { lat: c.lat, lon: c.lon, color: col }
  //   })
  // })

  return (
    <>
      <div className="rw-segment">
        <header className="rw-segment-header">
          <h2 className="rw-heading rw-heading-secondary">
            Map {map.id} Detail
          </h2>
        </header>
        <IslandMap />
        <MapComp map={"TheIsland"} size={{ width: 500, height: 500 }} pos={notes} path={{ color: '#0000ff', coords: coords }} />
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
  )
}

export default Map2
