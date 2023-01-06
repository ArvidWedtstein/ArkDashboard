import BasespotsCell from 'src/components/Basespot/BasespotsCell'

// const BasespotsPage = () => {
//   return <BasespotsCell />
// }
const BasespotsPage = ({ page = 1 }) => {
  return <BasespotsCell basespotPage={page} page={page} />
}

export default BasespotsPage
