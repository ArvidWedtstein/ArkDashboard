import TimelineSeasonBasespotCell from 'src/components/TimelineSeasonBasespot/TimelineSeasonBasespotCell'

type TimelineSeasonBasespotPageProps = {
  id: number
}

const TimelineSeasonBasespotPage = ({
  id,
}: TimelineSeasonBasespotPageProps) => {
  return <TimelineSeasonBasespotCell id={id} />
}

export default TimelineSeasonBasespotPage
