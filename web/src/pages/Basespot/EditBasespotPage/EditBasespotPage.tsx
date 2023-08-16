import EditBasespotCell from 'src/components/Basespot/EditBasespotCell'

type BasespotPageProps = {
  id: string
}

const EditBasespotPage = ({ id }: BasespotPageProps) => {
  return <EditBasespotCell id={id} />
}

export default EditBasespotPage
