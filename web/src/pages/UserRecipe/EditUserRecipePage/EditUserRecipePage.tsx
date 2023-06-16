import EditUserRecipeCell from 'src/components/UserRecipe/EditUserRecipeCell'

type UserRecipePageProps = {
  id: string
}

const EditUserRecipePage = ({ id }: UserRecipePageProps) => {
  return <EditUserRecipeCell id={id} />
}

export default EditUserRecipePage
