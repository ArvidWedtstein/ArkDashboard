import TribeCell from 'src/components/Tribe/TribeCell'

type TribePageProps = {
  id: number
}

const TribePage = ({ id }: TribePageProps) => {
  return <TribeCell id={id} />
}

export default TribePage
