
import { useAuth } from '@redwoodjs/auth'
import { Link, routes, navigate } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'
import { useEffect, useState } from 'react'
import { TimelineList } from 'src/components/Util/Timeline'
import { timeTag } from 'src/lib/formatters'

import type { DeleteTimelineMutationVariables, FindTimelineById } from 'types/graphql'

const DELETE_TIMELINE_MUTATION = gql`
  mutation DeleteTimelineMutation($id: String!) {
    deleteTimeline(id: $id) {
      id
    }
  }
`

interface Props {
  timeline: NonNullable<FindTimelineById['timeline']>
}

const Timeline = ({ timeline }: Props) => {
  const { client: supabase, currentUser, logOut } = useAuth();
  const [basespots, setBasespots] = useState([]);

  const getStory = async () => {
    try {
      let { data, error, status } = await supabase
        .from("timelinebasespot_view")
        .select(
          `
          id,
          created_at,
          updated_at,
          startDate,
          endDate,
          timeline_id,
          tribeName,
          map,
          server,
          region,
          season,
          cluster,
          location,
          players,
          created_by,
          raided_by,
          raidcomment,
          images,
          basespot
        `
        )
        // .eq("created_by", "7a2878d1-4f61-456d-bcb6-edc707383ea8")
        .eq("timeline_id", timeline.id)
        .order("startDate", { ascending: true });

      if (error && status !== 406) {
        throw error;
      }
      setBasespots(data);
      return (
        <>

          {basespots && <TimelineList events={basespots} />}
        </>
      );
    } catch (error) {
      toast.error(error.message);
    }
  }

  useEffect(() => {
    getStory();
  }, []);
  const [deleteTimeline] = useMutation(DELETE_TIMELINE_MUTATION, {
    onCompleted: () => {
      toast.success('Timeline deleted')
      navigate(routes.timelines())
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const onDeleteClick = (id: DeleteTimelineMutationVariables['id']) => {
    if (confirm('Are you sure you want to delete timeline ' + id + '?')) {
      deleteTimeline({ variables: { id } })
    }
  }

  return (
    <>
      {basespots && <TimelineList events={basespots} />}
    </>
  );

}

export default Timeline
