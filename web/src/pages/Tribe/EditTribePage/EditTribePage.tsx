import EditTribeCell from 'src/components/Tribe/EditTribeCell'

type TribePageProps = {
  id: number
}

const EditTribePage = ({ id }: TribePageProps) => {
  return <EditTribeCell id={id} />
}

export default EditTribePage
