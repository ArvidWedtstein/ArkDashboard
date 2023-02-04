import { Link, routes } from "@redwoodjs/router";
import { useMutation } from "@redwoodjs/web";
import { toast } from "@redwoodjs/web/toast";

import { QUERY } from "src/components/TimelineBasespot/TimelineBasespotsCell";
import { jsonTruncate, timeTag, truncate } from "src/lib/formatters";

import type {
  DeleteTimelineBasespotMutationVariables,
  FindTimelineBasespots,
} from "types/graphql";

const DELETE_TIMELINE_BASESPOT_MUTATION = gql`
  mutation DeleteTimelineBasespotMutation($id: BigInt!) {
    deleteTimelineBasespot(id: $id) {
      id
    }
  }
`;

const TimelineBasespotsList = ({
  timelineBasespots,
}: FindTimelineBasespots) => {
  const [deleteTimelineBasespot] = useMutation(
    DELETE_TIMELINE_BASESPOT_MUTATION,
    {
      onCompleted: () => {
        toast.success("TimelineBasespot deleted");
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

  const onDeleteClick = (id: DeleteTimelineBasespotMutationVariables["id"]) => {
    if (
      confirm("Are you sure you want to delete timelineBasespot " + id + "?")
    ) {
      deleteTimelineBasespot({ variables: { id } });
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
            <th>Timeline id</th>
            <th>Start date</th>
            <th>End date</th>
            <th>Basespot id</th>
            <th>Tribe name</th>
            <th>Map</th>
            <th>Server</th>
            <th>Region</th>
            <th>Season</th>
            <th>Cluster</th>
            <th>Location</th>
            <th>Players</th>
            <th>Created by</th>
            <th>Raided by</th>
            <th>Raidcomment</th>
            <th>&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          {timelineBasespots.map((timelineBasespot) => (
            <tr key={timelineBasespot.id}>
              <td>{truncate(timelineBasespot.id)}</td>
              <td>{timeTag(timelineBasespot.created_at)}</td>
              <td>{timeTag(timelineBasespot.updated_at)}</td>
              <td>{truncate(timelineBasespot.timeline_id)}</td>
              <td>{timeTag(timelineBasespot.startDate)}</td>
              <td>{timeTag(timelineBasespot.endDate)}</td>
              <td>{truncate(timelineBasespot.basespot_id)}</td>
              <td>{truncate(timelineBasespot.tribeName)}</td>
              <td>{truncate(timelineBasespot.map)}</td>
              <td>{truncate(timelineBasespot.server)}</td>
              <td>{truncate(timelineBasespot.region)}</td>
              <td>{truncate(timelineBasespot.season)}</td>
              <td>{truncate(timelineBasespot.cluster)}</td>
              <td>{jsonTruncate(timelineBasespot.location)}</td>
              <td>{truncate(timelineBasespot.players.join(", "))}</td>
              <td>{truncate(timelineBasespot.created_by)}</td>
              <td>{truncate(timelineBasespot.raided_by)}</td>
              <td>{truncate(timelineBasespot.raidcomment)}</td>
              <td>
                <nav className="rw-table-actions">
                  <Link
                    to={routes.timelineBasespot({
                      id: timelineBasespot.id.toString(),
                    })}
                    title={
                      "Show timelineBasespot " + timelineBasespot.id + " detail"
                    }
                    className="rw-button rw-button-small"
                  >
                    Show
                  </Link>
                  <Link
                    to={routes.editTimelineBasespot({
                      id: timelineBasespot.id,
                    })}
                    title={"Edit timelineBasespot " + timelineBasespot.id}
                    className="rw-button rw-button-small rw-button-blue"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    title={"Delete timelineBasespot " + timelineBasespot.id}
                    className="rw-button rw-button-small rw-button-red"
                    onClick={() => onDeleteClick(timelineBasespot.id)}
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

export default TimelineBasespotsList;
