import ItemsCell from 'src/components/Item/ItemsCell'

// const ItemsPage = () => {
//   return <ItemsCell />
// }
const ItemsPage = ({ page = 1 }) => {
  return <ItemsCell page={page} />
}

export default ItemsPage
