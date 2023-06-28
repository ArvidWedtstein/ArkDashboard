import EditTimelineSeasonBasespotCell from 'src/components/TimelineSeasonBasespot/EditTimelineSeasonBasespotCell'

type TimelineSeasonBasespotPageProps = {
  id: number
}

const EditTimelineSeasonBasespotPage = ({
  id,
}: TimelineSeasonBasespotPageProps) => {
  return <EditTimelineSeasonBasespotCell id={id} />
}

export default EditTimelineSeasonBasespotPage
