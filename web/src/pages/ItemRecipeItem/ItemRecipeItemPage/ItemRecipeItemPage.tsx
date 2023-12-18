import ItemRecipeItemCell from 'src/components/ItemRecipeItem/ItemRecipeItemCell'

type ItemRecipeItemPageProps = {
  id: string
}

const ItemRecipeItemPage = ({ id }: ItemRecipeItemPageProps) => {
  return <ItemRecipeItemCell id={id} />
}

export default ItemRecipeItemPage
