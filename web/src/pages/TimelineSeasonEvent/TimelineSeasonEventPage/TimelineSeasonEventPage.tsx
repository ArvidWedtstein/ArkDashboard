import TimelineSeasonEventCell from 'src/components/TimelineSeasonEvent/TimelineSeasonEventCell'

type TimelineSeasonEventPageProps = {
  id: string
}

const TimelineSeasonEventPage = ({ id }: TimelineSeasonEventPageProps) => {
  return <TimelineSeasonEventCell id={id} />
}

export default TimelineSeasonEventPage
