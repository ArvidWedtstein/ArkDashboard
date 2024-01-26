import EditItemRecipeCell from 'src/components/Item/ItemRecipe/EditItemRecipeCell'

type ItemRecipePageProps = {
  id: number
}

const EditItemRecipePage = ({ id }: ItemRecipePageProps) => {
  return <EditItemRecipeCell id={id} />
}

export default EditItemRecipePage
