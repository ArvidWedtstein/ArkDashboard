import EditItemCell from 'src/components/Item/EditItemCell'

type ItemPageProps = {
  id: number
}

const EditItemPage = ({ id }: ItemPageProps) => {
  return <EditItemCell id={id} />
}

export default EditItemPage
