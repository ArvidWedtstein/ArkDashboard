import EditTimelineBasespotCell from 'src/components/TimelineBasespot/EditTimelineBasespotCell'

type TimelineBasespotPageProps = {
  id: number
}

const EditTimelineBasespotPage = ({ id }: TimelineBasespotPageProps) => {
  return <EditTimelineBasespotCell id={id} />
}

export default EditTimelineBasespotPage
