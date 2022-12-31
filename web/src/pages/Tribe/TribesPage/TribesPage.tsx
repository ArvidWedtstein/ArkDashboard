import TribesCell from 'src/components/Tribe/TribesCell'

// Parameters where get magically transformed into url params
const TribesPage = ({ page = 1 }) => {
  return <TribesCell page={page} />
}

export default TribesPage
