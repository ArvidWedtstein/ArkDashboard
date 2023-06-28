import EditTimelineSeasonCell from 'src/components/TimelineSeason/EditTimelineSeasonCell'

type TimelineSeasonPageProps = {
  id: string
}

const EditTimelineSeasonPage = ({ id }: TimelineSeasonPageProps) => {
  return <EditTimelineSeasonCell id={id} />
}

export default EditTimelineSeasonPage
