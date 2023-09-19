import EditMapRegionCell from 'src/components/MapRegion/EditMapRegionCell'

type MapRegionPageProps = {
  id: number
}

const EditMapRegionPage = ({ id }: MapRegionPageProps) => {
  return <EditMapRegionCell id={id} />
}

export default EditMapRegionPage
