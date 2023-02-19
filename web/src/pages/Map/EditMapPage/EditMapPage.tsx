import EditMapCell from 'src/components/Map/EditMapCell'

type MapPageProps = {
  id: number
}

const EditMapPage = ({ id }: MapPageProps) => {
  return <EditMapCell id={id} />
}

export default EditMapPage
