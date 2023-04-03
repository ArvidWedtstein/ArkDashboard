import EditLootcrateCell from 'src/components/Lootcrate/EditLootcrateCell'

type LootcratePageProps = {
  id: string
}

const EditLootcratePage = ({ id }: LootcratePageProps) => {
  return <EditLootcrateCell id={id} />
}

export default EditLootcratePage
