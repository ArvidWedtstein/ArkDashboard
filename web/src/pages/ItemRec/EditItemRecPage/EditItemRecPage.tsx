import EditItemRecCell from 'src/components/ItemRec/EditItemRecCell'

type ItemRecPageProps = {
  id: string
}

const EditItemRecPage = ({ id }: ItemRecPageProps) => {
  return <EditItemRecCell id={id} />
}

export default EditItemRecPage
