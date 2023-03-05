import DinoCell from 'src/components/Dino/DinoCell'

type DinoPageProps = {
  id: string
}

const DinoPage = ({ id }: DinoPageProps) => {
  return <DinoCell id={id} />
}

export default DinoPage
