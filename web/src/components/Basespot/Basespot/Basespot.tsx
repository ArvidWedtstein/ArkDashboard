
import { Link, routes, navigate } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { timeTag, } from 'src/lib/formatters'

import type { DeleteBasespotMutationVariables, FindBasespotById } from 'types/graphql'

const DELETE_BASESPOT_MUTATION = gql`
  mutation DeleteBasespotMutation($id: Int!) {
    deleteBasespot(id: $id) {
      id
    }
  }
`

interface Props {
  basespot: NonNullable<FindBasespotById['basespot']>
}

const Basespot = ({ basespot }: Props) => {
  const [deleteBasespot] = useMutation(DELETE_BASESPOT_MUTATION, {
    onCompleted: () => {
      toast.success('Basespot deleted')
      navigate(routes.basespots())
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const onDeleteClick = (id: DeleteBasespotMutationVariables['id']) => {
    if (confirm('Are you sure you want to delete basespot ' + id + '?')) {
      deleteBasespot({ variables: { id } })
    }
  }

  return (
    <>
      <div className="container mx-auto">
        <header className="bg-slate-900 p-3 text-white">
          <h2 className="">
            Basespot {basespot.id} Detail
          </h2>
        </header>
        <div className="grid grid-cols-2 auto-cols-auto">
          <div>
            <img src={basespot.image} alt={basespot.name} className="max-w-none" />
          </div>
          <div className="bg-slate-600 p-4 text-white font-heading ">
            <h1 className="text-2xl relative first-of-type:mt-5 before:absolute before:h-1 before:w-9 before:bg-red-500 before:-bottom-3 before:rounded">{basespot.name}</h1>
            <p className="text-base mt-5">{basespot.description}</p>

            <div className="mt-5">
              <span className="bg-black text-slate-200 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-slate-200 dark:text-black">
                Lat: {basespot.latitude}
              </span>
              <span className="bg-black text-slate-200 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-slate-200 dark:text-black">
                Lon: {basespot.longitude}
              </span>
            </div>
            <p className="bg-black text-slate-200 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-slate-200 dark:text-black">
              Estimated for {basespot.EstimatedForPlayers} players
            </p>
          </div>
        </div>
        <table className="rw-table">
          <tbody>
            <tr>
              <th>Id</th>
              <td>{basespot.id}</td>
            </tr><tr>
              <th>Name</th>
              <td>{basespot.name}</td>
            </tr><tr>
              <th>Description</th>
              <td>{basespot.description}</td>
            </tr><tr>
              <th>Latitude</th>
              <td>{basespot.latitude}</td>
            </tr><tr>
              <th>Longitude</th>
              <td>{basespot.longitude}</td>
            </tr><tr>
              <th>Image</th>
              <td>{basespot.image}</td>
            </tr><tr>
              <th>Created at</th>
              <td>{timeTag(basespot.createdAt)}</td>
            </tr><tr>
              <th>Map</th>
              <td>{basespot.Map}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <nav className="rw-button-group">
        <Link
          to={routes.editBasespot({ id: basespot.id })}
          className="rw-button rw-button-blue"
        >
          Edit
        </Link>
        <button
          type="button"
          className="rw-button rw-button-red"
          onClick={() => onDeleteClick(basespot.id)}
        >
          Delete
        </button>
      </nav>
    </>
  )
}

export default Basespot
