import { Link, routes, navigate } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { timeTag } from 'src/lib/formatters'

import type {
  DeleteItemRecMutationVariables,
  FindItemRecById,
} from 'types/graphql'

const DELETE_ITEM_REC_MUTATION = gql`
  mutation DeleteItemRecMutation($id: String!) {
    deleteItemRec(id: $id) {
      id
    }
  }
`

interface Props {
  itemRec: NonNullable<FindItemRecById['itemRec']>
}

const ItemRec = ({ itemRec }: Props) => {
  const [deleteItemRec] = useMutation(DELETE_ITEM_REC_MUTATION, {
    onCompleted: () => {
      toast.success('ItemRec deleted')
      navigate(routes.itemRecs())
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const onDeleteClick = (id: DeleteItemRecMutationVariables['id']) => {
    if (confirm('Are you sure you want to delete itemRec ' + id + '?')) {
      deleteItemRec({ variables: { id } })
    }
  }

  return (
    <>
      <div className="rw-segment">
        <header className="rw-segment-header">
          <h2 className="rw-heading rw-heading-secondary">
            ItemRec {itemRec.id} Detail
          </h2>
        </header>
        <table className="rw-table">
          <tbody>
            <tr>
              <th>Id</th>
              <td>{itemRec.id}</td>
            </tr>
            <tr>
              <th>Created at</th>
              <td>{timeTag(itemRec.created_at)}</td>
            </tr>
            <tr>
              <th>Updated at</th>
              <td>{timeTag(itemRec.updated_at)}</td>
            </tr>
            <tr>
              <th>Crafted item id</th>
              <td>{itemRec.crafted_item_id}</td>
            </tr>
            <tr>
              <th>Crafting station id</th>
              <td>{itemRec.crafting_station_id}</td>
            </tr>
            <tr>
              <th>Crafting time</th>
              <td>{itemRec.crafting_time}</td>
            </tr>
            <tr>
              <th>Yields</th>
              <td>{itemRec.yields}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <nav className="rw-button-group">
        <Link
          to={routes.editItemRec({ id: itemRec.id })}
          className="rw-button rw-button-blue"
        >
          Edit
        </Link>
        <button
          type="button"
          className="rw-button rw-button-red"
          onClick={() => onDeleteClick(itemRec.id)}
        >
          Delete
        </button>
      </nav>
    </>
  )
}

export default ItemRec
