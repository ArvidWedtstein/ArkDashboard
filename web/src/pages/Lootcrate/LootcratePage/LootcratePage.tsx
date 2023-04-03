import LootcrateCell from 'src/components/Lootcrate/LootcrateCell'

type LootcratePageProps = {
  id: string
}

const LootcratePage = ({ id }: LootcratePageProps) => {
  return <LootcrateCell id={id} />
}

export default LootcratePage
