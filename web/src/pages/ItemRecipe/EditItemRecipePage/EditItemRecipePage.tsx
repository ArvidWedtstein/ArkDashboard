import EditItemRecipeCell from 'src/components/ItemRecipe/EditItemRecipeCell'

type ItemRecipePageProps = {
  id: string
}

const EditItemRecipePage = ({ id }: ItemRecipePageProps) => {
  return <EditItemRecipeCell id={id} />
}

export default EditItemRecipePage
