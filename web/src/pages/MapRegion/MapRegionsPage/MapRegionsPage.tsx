import MapRegionsCell from 'src/components/MapRegion/MapRegionsCell'

const MapRegionsPage = ({ map_id = 2 }: { map_id: number }) => {
  return <MapRegionsCell map_id={map_id} />
}

export default MapRegionsPage
