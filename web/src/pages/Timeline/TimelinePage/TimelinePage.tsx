import TimelineCell from 'src/components/Timeline/TimelineCell'

type TimelinePageProps = {
  id: string
}

const TimelinePage = ({ id }: TimelinePageProps) => {
  return <TimelineCell id={id} />
}

export default TimelinePage
