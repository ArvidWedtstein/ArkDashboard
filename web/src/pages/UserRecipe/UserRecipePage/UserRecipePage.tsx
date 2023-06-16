import UserRecipeCell from 'src/components/UserRecipe/UserRecipeCell'

type UserRecipePageProps = {
  id: string
}

const UserRecipePage = ({ id }: UserRecipePageProps) => {
  return <UserRecipeCell id={id} />
}

export default UserRecipePage
