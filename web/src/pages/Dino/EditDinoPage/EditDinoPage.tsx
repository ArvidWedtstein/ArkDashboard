import EditDinoCell from 'src/components/Dino/EditDinoCell'

type DinoPageProps = {
  id: string
}

const EditDinoPage = ({ id }: DinoPageProps) => {
  return <EditDinoCell id={id} />
}

export default EditDinoPage
