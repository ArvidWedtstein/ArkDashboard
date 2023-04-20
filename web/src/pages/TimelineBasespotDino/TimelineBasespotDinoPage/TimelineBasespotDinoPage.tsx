import TimelineBasespotDinoCell from 'src/components/TimelineBasespotDino/TimelineBasespotDinoCell'

type TimelineBasespotDinoPageProps = {
  id: string
}

const TimelineBasespotDinoPage = ({ id }: TimelineBasespotDinoPageProps) => {
  return <TimelineBasespotDinoCell id={id} />
}

export default TimelineBasespotDinoPage
