import { Link, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { QUERY } from 'src/components/ItemRecipe/ItemRecipesCell'
import Button, { ButtonGroup } from 'src/components/Util/Button/Button'
import { Card, CardActions, CardContent, CardHeader } from 'src/components/Util/Card/Card'
import { timeTag, truncate } from 'src/lib/formatters'

import type {
  DeleteItemRecipeMutationVariables,
  FindItemRecipes,
} from 'types/graphql'

const DELETE_ITEM_RECIPE_MUTATION = gql`
  mutation DeleteItemRecipeMutations($id: BigInt!) {
    deleteItemRecipe(id: $id) {
      id
    }
  }
`

const ItemRecipesList = ({ itemRecipesByItem }: FindItemRecipes) => {
  const [deleteItemRecipe] = useMutation(DELETE_ITEM_RECIPE_MUTATION, {
    onCompleted: () => {
      toast.success('ItemRecipe deleted')
    },
    onError: (error) => {
      toast.error(error.message)
    },
    // This refetches the query on the list page. Read more about other ways to
    // update the cache over here:
    // https://www.apollographql.com/docs/react/data/mutations/#making-all-other-cache-updates
    refetchQueries: [{ query: QUERY }],
    awaitRefetchQueries: true,
  })

  const onDeleteClick = (id: DeleteItemRecipeMutationVariables['id']) => {
    if (confirm('Are you sure you want to delete itemRecipe ' + id + '?')) {
      deleteItemRecipe({ variables: { id } })
    }
  }

  return (
    <article>

      <div className={"grid w-full gap-3 text-zinc-900 transition-all ease-in-out dark:text-white grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4"}>
        {itemRecipesByItem.map((itemRecipe) => (
          <Card key={itemRecipe.id}>
            <CardHeader
              title={itemRecipe.Item_ItemRecipe_crafted_item_idToItem.name}
              avatar={
                <img
                  src={`https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/${itemRecipe.Item_ItemRecipe_crafted_item_idToItem.image}`}
                  loading="lazy"
                  className="h-10 w-10 rounded-full object-cover"
                />
              }
            />
            <CardContent>
              <span className='inline-flex space-x-2'>
                <strong>Crafting station:</strong>
                <p>{itemRecipe.Item_ItemRecipe_crafting_station_idToItem.name}</p>
                <img
                  src={`https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/${itemRecipe.Item_ItemRecipe_crafting_station_idToItem.image}`}
                  loading="lazy"
                  className="h-6 w-6 rounded-full object-cover"
                />
              </span>
            </CardContent>
            <CardActions>
              <ButtonGroup>
                <Button
                  permission="gamedata_update"
                  color="secondary"
                  variant="outlined"
                  to={routes.editItemRecipe({ id: itemRecipe.id })}
                  startIcon={
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                      <path d="M493.2 56.26l-37.51-37.51C443.2 6.252 426.8 0 410.5 0c-16.38 0-32.76 6.25-45.26 18.75L45.11 338.9c-8.568 8.566-14.53 19.39-17.18 31.21l-27.61 122.8C-1.7 502.1 6.158 512 15.95 512c1.047 0 2.116-.1034 3.198-.3202c0 0 84.61-17.95 122.8-26.93c11.54-2.717 21.87-8.523 30.25-16.9l321.2-321.2C518.3 121.7 518.2 81.26 493.2 56.26zM149.5 445.2c-4.219 4.219-9.252 7.039-14.96 8.383c-24.68 5.811-69.64 15.55-97.46 21.52l22.04-98.01c1.332-5.918 4.303-11.31 8.594-15.6l247.6-247.6l82.76 82.76L149.5 445.2zM470.7 124l-50.03 50.02l-82.76-82.76l49.93-49.93C393.9 35.33 401.9 32 410.5 32s16.58 3.33 22.63 9.375l37.51 37.51C483.1 91.37 483.1 111.6 470.7 124z" />
                    </svg>
                  }
                >
                  Edit
                </Button>
                <Button
                  permission="gamedata_delete"
                  color="error"
                  variant="outlined"
                  onClick={() => onDeleteClick(itemRecipe.id)}
                  startIcon={
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                      <path d="M432 64h-96l-33.63-44.75C293.4 7.125 279.1 0 264 0h-80C168.9 0 154.6 7.125 145.6 19.25L112 64h-96C7.201 64 0 71.2 0 80c0 8.799 7.201 16 16 16h416c8.801 0 16-7.201 16-16C448 71.2 440.8 64 432 64zM152 64l19.25-25.62C174.3 34.38 179 32 184 32h80c5 0 9.75 2.375 12.75 6.375L296 64H152zM400 128C391.2 128 384 135.2 384 144v288c0 26.47-21.53 48-48 48h-224C85.53 480 64 458.5 64 432v-288C64 135.2 56.84 128 48 128S32 135.2 32 144v288C32 476.1 67.89 512 112 512h224c44.11 0 80-35.89 80-80v-288C416 135.2 408.8 128 400 128zM144 416V192c0-8.844-7.156-16-16-16S112 183.2 112 192v224c0 8.844 7.156 16 16 16S144 424.8 144 416zM240 416V192c0-8.844-7.156-16-16-16S208 183.2 208 192v224c0 8.844 7.156 16 16 16S240 424.8 240 416zM336 416V192c0-8.844-7.156-16-16-16S304 183.2 304 192v224c0 8.844 7.156 16 16 16S336 424.8 336 416z" />
                    </svg>
                  }
                >
                  Delete
                </Button>
              </ButtonGroup>
            </CardActions>
          </Card>
        ))}
      </div>
    </article>
  )
}

export default ItemRecipesList
