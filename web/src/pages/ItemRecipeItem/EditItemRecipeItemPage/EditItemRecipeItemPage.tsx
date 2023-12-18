import EditItemRecipeItemCell from 'src/components/ItemRecipeItem/EditItemRecipeItemCell'

type ItemRecipeItemPageProps = {
  id: string
}

const EditItemRecipeItemPage = ({ id }: ItemRecipeItemPageProps) => {
  return <EditItemRecipeItemCell id={id} />
}

export default EditItemRecipeItemPage
