import ItemsCell from 'src/components/Item/ItemsCell'

// const ItemsPage = () => {
//   return <ItemsCell />
// }
const ItemsPage = ({ page = 1, search = "", category = "", type = "", items_per_page = 36 }) => {
  return <ItemsCell page={page} search={search} category={category} type={type} />
}

export default ItemsPage
