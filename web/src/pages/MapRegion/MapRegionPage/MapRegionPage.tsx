import MapRegionCell from 'src/components/MapRegion/MapRegionCell'

type MapRegionPageProps = {
  id: number
}

const MapRegionPage = ({ id }: MapRegionPageProps) => {
  return <MapRegionCell id={id} />
}

export default MapRegionPage
