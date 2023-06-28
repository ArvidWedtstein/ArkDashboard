import EditTimelineSeasonEventCell from 'src/components/TimelineSeasonEvent/EditTimelineSeasonEventCell'

type TimelineSeasonEventPageProps = {
  id: string
}

const EditTimelineSeasonEventPage = ({ id }: TimelineSeasonEventPageProps) => {
  return <EditTimelineSeasonEventCell id={id} />
}

export default EditTimelineSeasonEventPage
