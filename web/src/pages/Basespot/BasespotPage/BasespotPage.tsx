import BasespotCell from 'src/components/Basespot/BasespotCell'

type BasespotPageProps = {
  id: number
}

const BasespotPage = ({ id }: BasespotPageProps) => {
  return <BasespotCell id={id} />
}

export default BasespotPage
