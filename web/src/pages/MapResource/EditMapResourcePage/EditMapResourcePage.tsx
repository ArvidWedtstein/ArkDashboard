import EditMapResourceCell from 'src/components/MapResource/EditMapResourceCell'

type MapResourcePageProps = {
  id: number
}

const EditMapResourcePage = ({ id }: MapResourcePageProps) => {
  return <EditMapResourceCell id={id} />
}

export default EditMapResourcePage
