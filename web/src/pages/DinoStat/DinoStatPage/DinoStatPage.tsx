import DinoStatCell from 'src/components/DinoStat/DinoStatCell'

type DinoStatPageProps = {
  id: string
}

const DinoStatPage = ({ id }: DinoStatPageProps) => {
  return <DinoStatCell id={id} />
}

export default DinoStatPage
