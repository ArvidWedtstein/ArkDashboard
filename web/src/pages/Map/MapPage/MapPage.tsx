import MapCell from 'src/components/Map/MapCell'

type MapPageProps = {
  id: number
}

const MapPage = ({ id }: MapPageProps) => {
  return <MapCell id={id} />
}

export default MapPage
