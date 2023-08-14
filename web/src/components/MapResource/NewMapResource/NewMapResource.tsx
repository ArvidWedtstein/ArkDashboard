import { navigate, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import MapResourceForm from 'src/components/MapResource/MapResourceForm'

import type { CreateMapResourceInput } from 'types/graphql'

const CREATE_MAP_RESOURCE_MUTATION = gql`
  mutation CreateMapResourceMutation($input: CreateMapResourceInput!) {
    createMapResource(input: $input) {
      id
    }
  }
`

const NewMapResource = () => {
  const [createMapResource, { loading, error }] = useMutation(
    CREATE_MAP_RESOURCE_MUTATION,
    {
      onCompleted: () => {
        navigate(routes.mapResources())
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const onSave = (input: CreateMapResourceInput) => {
    toast.promise(createMapResource({ variables: { input } }), {
      loading: 'Creating new MapResource...',
      success: 'MapResource successfully created',
      error: <b>Failed to create new MapResource.</b>,
    })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">New MapResource</h2>
      </header>
      <div className="rw-segment-main">
        <MapResourceForm onSave={onSave} loading={loading} error={error} />
      </div>
    </div>
  )
}

export default NewMapResource
