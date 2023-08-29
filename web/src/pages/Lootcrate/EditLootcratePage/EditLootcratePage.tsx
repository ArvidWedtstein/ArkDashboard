import EditLootcrateCell from 'src/components/Lootcrate/EditLootcrateCell'

type LootcratePageProps = {
  id: number
}

const EditLootcratePage = ({ id }: LootcratePageProps) => {
  return <EditLootcrateCell id={id} />
}

export default EditLootcratePage
