import ItemsCell from 'src/components/Item/ItemsCell'

// const ItemsPage = () => {
//   return <ItemsCell />
// }
const ItemsPage = ({ page = 1, search = "" }) => {
  return <ItemsCell page={page} search={search} />
}

export default ItemsPage
