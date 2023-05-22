import ItemRecCell from 'src/components/ItemRec/ItemRecCell'

type ItemRecPageProps = {
  id: string
}

const ItemRecPage = ({ id }: ItemRecPageProps) => {
  return <ItemRecCell id={id} />
}

export default ItemRecPage
