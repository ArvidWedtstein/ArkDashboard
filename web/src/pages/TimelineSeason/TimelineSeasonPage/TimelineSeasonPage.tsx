import TimelineSeasonCell from 'src/components/TimelineSeason/TimelineSeasonCell'

type TimelineSeasonPageProps = {
  id: string
}

const TimelineSeasonPage = ({ id }: TimelineSeasonPageProps) => {
  return <TimelineSeasonCell id={id} />
}

export default TimelineSeasonPage
