import { Link, routes, navigate } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { formatEnum, timeTag } from 'src/lib/formatters'

import type {
  DeleteDinoStatMutationVariables,
  FindDinoStatById,
} from 'types/graphql'

const DELETE_DINO_STAT_MUTATION = gql`
  mutation DeleteDinoStatMutation($id: String!) {
    deleteDinoStat(id: $id) {
      id
    }
  }
`

interface Props {
  dinoStat: NonNullable<FindDinoStatById['dinoStat']>
}

const DinoStat = ({ dinoStat }: Props) => {
  const [deleteDinoStat] = useMutation(DELETE_DINO_STAT_MUTATION, {
    onCompleted: () => {
      toast.success('DinoStat deleted')
      navigate(routes.dinoStats())
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const onDeleteClick = (id: DeleteDinoStatMutationVariables['id']) => {
    if (confirm('Are you sure you want to delete dinoStat ' + id + '?')) {
      deleteDinoStat({ variables: { id } })
    }
  }

  return (
    <>
      <div className="rw-segment">
        <header className="rw-segment-header">
          <h2 className="rw-heading rw-heading-secondary">
            DinoStat {dinoStat.id} Detail
          </h2>
        </header>
        <table className="rw-table">
          <tbody>
            <tr>
              <th>Id</th>
              <td>{dinoStat.id}</td>
            </tr>
            <tr>
              <th>Created at</th>
              <td>{timeTag(dinoStat.created_at)}</td>
            </tr>
            <tr>
              <th>Updated at</th>
              <td>{timeTag(dinoStat.updated_at)}</td>
            </tr>
            <tr>
              <th>Dino id</th>
              <td>{dinoStat.dino_id}</td>
            </tr>
            <tr>
              <th>Item id</th>
              <td>{dinoStat.item_id}</td>
            </tr>
            <tr>
              <th>Value</th>
              <td>{dinoStat.value}</td>
            </tr>
            <tr>
              <th>Rank</th>
              <td>{dinoStat.rank}</td>
            </tr>
            <tr>
              <th>Type</th>
              <td>{formatEnum(dinoStat.type)}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <nav className="rw-button-group">
        <Link
          to={routes.editDinoStat({ id: dinoStat.id })}
          className="rw-button rw-button-blue"
        >
          Edit
        </Link>
        <button
          type="button"
          className="rw-button rw-button-red"
          onClick={() => onDeleteClick(dinoStat.id)}
        >
          Delete
        </button>
      </nav>
    </>
  )
}

export default DinoStat
