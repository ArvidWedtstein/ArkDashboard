import ItemRecipeCell from 'src/components/ItemRecipe/ItemRecipeCell'

type ItemRecipePageProps = {
  id: string
}

const ItemRecipePage = ({ id }: ItemRecipePageProps) => {
  return <ItemRecipeCell id={id} />
}

export default ItemRecipePage
