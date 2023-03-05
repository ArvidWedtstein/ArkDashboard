import ItemCell from 'src/components/Item/ItemCell'

type ItemPageProps = {
  id: number
}

const ItemPage = ({ id }: ItemPageProps) => {
  return <ItemCell id={id} />
}

export default ItemPage
