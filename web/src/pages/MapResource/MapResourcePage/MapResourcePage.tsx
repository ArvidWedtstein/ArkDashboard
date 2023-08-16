import MapResourceCell from 'src/components/MapResource/MapResourceCell'

type MapResourcePageProps = {
  id: number
}

const MapResourcePage = ({ id }: MapResourcePageProps) => {
  return <MapResourceCell id={id} />
}

export default MapResourcePage
