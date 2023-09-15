import LootcrateCell from 'src/components/Lootcrate/LootcrateCell'

type LootcratePageProps = {
  id: number
}

const LootcratePage = ({ id }: LootcratePageProps) => {
  return <LootcrateCell id={id} />
}

export default LootcratePage
