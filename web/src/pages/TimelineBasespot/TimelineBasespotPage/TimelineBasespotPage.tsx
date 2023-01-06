import TimelineBasespotCell from 'src/components/TimelineBasespot/TimelineBasespotCell'

type TimelineBasespotPageProps = {
  id: number
}

const TimelineBasespotPage = ({ id }: TimelineBasespotPageProps) => {
  return <TimelineBasespotCell id={id} />
}

export default TimelineBasespotPage
