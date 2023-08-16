import { navigate, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import MapForm from 'src/components/Map/MapForm'

import type { CreateMapInput } from 'types/graphql'

const CREATE_MAP_MUTATION = gql`
  mutation CreateMapMutation($input: CreateMapInput!) {
    createMap(input: $input) {
      id
    }
  }
`

const NewMap = () => {
  const [createMap, { loading, error }] = useMutation(
    CREATE_MAP_MUTATION,
    {
      onCompleted: () => {
        toast.success('Map created')
        navigate(routes.maps())
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const onSave = (input: CreateMapInput) => {
    toast.promise(createMap({ variables: { input } }), {
      loading: "Creating new map...",
      success: "Map successfully created",
      error: <b>Failed to create new map.</b>,
    });
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">New Map</h2>
      </header>
      <div className="rw-segment-main">
        <MapForm onSave={onSave} loading={loading} error={error} />
      </div>
    </div>
  )
}

export default NewMap
