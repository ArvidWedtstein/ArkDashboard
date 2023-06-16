import { Link, routes } from "@redwoodjs/router";
import { useMutation } from "@redwoodjs/web";
import { toast } from "@redwoodjs/web/toast";

import { QUERY } from "src/components/TimelineBasespotDino/TimelineBasespotDinosCell";
import { timeTag, truncate } from "src/lib/formatters";

import type {
  DeleteTimelineBasespotDinoMutationVariables,
  FindTimelineBasespotDinos,
} from "types/graphql";

const DELETE_TIMELINE_BASESPOT_DINO_MUTATION = gql`
  mutation DeleteTimelineBasespotDinoMutation($id: String!) {
    deleteTimelineBasespotDino(id: $id) {
      id
    }
  }
`;

const TimelineBasespotDinosList = ({
  timelineBasespotDinos,
}: FindTimelineBasespotDinos) => {
  const [deleteTimelineBasespotDino] = useMutation(
    DELETE_TIMELINE_BASESPOT_DINO_MUTATION,
    {
      onCompleted: () => {
        toast.success("TimelineBasespotDino deleted");
      },
      onError: (error) => {
        toast.error(error.message);
      },
      // This refetches the query on the list page. Read more about other ways to
      // update the cache over here:
      // https://www.apollographql.com/docs/react/data/mutations/#making-all-other-cache-updates
      refetchQueries: [{ query: QUERY }],
      awaitRefetchQueries: true,
    }
  );

  const onDeleteClick = (
    id: DeleteTimelineBasespotDinoMutationVariables["id"]
  ) => {
    if (
      confirm(
        "Are you sure you want to delete timelineBasespotDino " + id + "?"
      )
    ) {
      deleteTimelineBasespotDino({ variables: { id } });
    }
  };

  return (
    <div className="rw-segment rw-table-wrapper-responsive">
      <table className="rw-table">
        <thead>
          <tr>
            <th>Id</th>
            <th>Created at</th>
            <th>Updated at</th>
            <th>Timelinebasespot id</th>
            <th>Dino id</th>
            <th>Name</th>
            <th>Birth date</th>
            <th>Death date</th>
            <th>Death cause</th>
            <th>Level wild</th>
            <th>Level</th>
            <th>Health</th>
            <th>Stamina</th>
            <th>Oxygen</th>
            <th>Food</th>
            <th>Weight</th>
            <th>Melee damage</th>
            <th>Movement speed</th>
            <th>Torpor</th>
            <th>Gender</th>
            <th>Wild health</th>
            <th>Wild stamina</th>
            <th>Wild oxygen</th>
            <th>Wild food</th>
            <th>Wild weight</th>
            <th>Wild melee damage</th>
            <th>Wild movement speed</th>
            <th>Wild torpor</th>
            <th>&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          {timelineBasespotDinos.map((timelineBasespotDino) => (
            <tr key={timelineBasespotDino.id}>
              <td>{truncate(timelineBasespotDino.id)}</td>
              <td>{timeTag(timelineBasespotDino.created_at)}</td>
              <td>{timeTag(timelineBasespotDino.updated_at)}</td>
              <td>{truncate(timelineBasespotDino.timelinebasespot_id)}</td>
              <td>{truncate(timelineBasespotDino.dino_id)}</td>
              <td>{truncate(timelineBasespotDino.name)}</td>
              <td>{timeTag(timelineBasespotDino.birth_date)}</td>
              <td>{timeTag(timelineBasespotDino.death_date)}</td>
              <td>{truncate(timelineBasespotDino.death_cause)}</td>
              <td>{truncate(timelineBasespotDino.level_wild)}</td>
              <td>{truncate(timelineBasespotDino.level)}</td>
              <td>{truncate(timelineBasespotDino.health)}</td>
              <td>{truncate(timelineBasespotDino.stamina)}</td>
              <td>{truncate(timelineBasespotDino.oxygen)}</td>
              <td>{truncate(timelineBasespotDino.food)}</td>
              <td>{truncate(timelineBasespotDino.weight)}</td>
              <td>{truncate(timelineBasespotDino.melee_damage)}</td>
              <td>{truncate(timelineBasespotDino.movement_speed)}</td>
              <td>{truncate(timelineBasespotDino.gender)}</td>
              <td>{truncate(timelineBasespotDino.wild_health)}</td>
              <td>{truncate(timelineBasespotDino.wild_stamina)}</td>
              <td>{truncate(timelineBasespotDino.wild_oxygen)}</td>
              <td>{truncate(timelineBasespotDino.wild_food)}</td>
              <td>{truncate(timelineBasespotDino.wild_weight)}</td>
              <td>{truncate(timelineBasespotDino.wild_melee_damage)}</td>
              <td>{truncate(timelineBasespotDino.wild_movement_speed)}</td>
              <td>
                <nav className="rw-table-actions">
                  <Link
                    to={routes.timelineBasespotDino({
                      id: timelineBasespotDino.id,
                    })}
                    title={
                      "Show timelineBasespotDino " +
                      timelineBasespotDino.id +
                      " detail"
                    }
                    className="rw-button rw-button-small"
                  >
                    Show
                  </Link>
                  <Link
                    to={routes.editTimelineBasespotDino({
                      id: timelineBasespotDino.id,
                    })}
                    title={
                      "Edit timelineBasespotDino " + timelineBasespotDino.id
                    }
                    className="rw-button rw-button-small rw-button-blue"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    title={
                      "Delete timelineBasespotDino " + timelineBasespotDino.id
                    }
                    className="rw-button rw-button-small rw-button-red"
                    onClick={() => onDeleteClick(timelineBasespotDino.id)}
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

export default TimelineBasespotDinosList;
