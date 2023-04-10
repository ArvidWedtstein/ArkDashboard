import EditTimelineBasespotDinoCell from 'src/components/TimelineBasespotDino/EditTimelineBasespotDinoCell'

type TimelineBasespotDinoPageProps = {
  id: string
}

const EditTimelineBasespotDinoPage = ({ id }: TimelineBasespotDinoPageProps) => {
  return <EditTimelineBasespotDinoCell id={id} />
}

export default EditTimelineBasespotDinoPage
