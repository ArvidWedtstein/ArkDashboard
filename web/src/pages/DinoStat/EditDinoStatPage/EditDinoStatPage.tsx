import EditDinoStatCell from 'src/components/DinoStat/EditDinoStatCell'

type DinoStatPageProps = {
  id: string
}

const EditDinoStatPage = ({ id }: DinoStatPageProps) => {
  return <EditDinoStatCell id={id} />
}

export default EditDinoStatPage
