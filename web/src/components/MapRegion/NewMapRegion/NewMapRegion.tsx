import { navigate, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import MapRegionForm from 'src/components/MapRegion/MapRegionForm'

import type { CreateMapRegionInput } from 'types/graphql'

const CREATE_MAP_REGION_MUTATION = gql`
  mutation CreateMapRegionMutation($input: CreateMapRegionInput!) {
    createMapRegion(input: $input) {
      id
    }
  }
`

const NewMapRegion = () => {
  const [createMapRegion, { loading, error }] = useMutation(
    CREATE_MAP_REGION_MUTATION,
    {
      onCompleted: () => {
        navigate(routes.mapRegions())
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const onSave = (input: CreateMapRegionInput) => {
    toast.promise(createMapRegion({ variables: { input } }), {
      loading: 'Creating new MapRegion...',
      success: 'MapRegion successfully created',
      error: <b>Failed to create new MapRegion.</b>,
    })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">New MapRegion</h2>
      </header>
      <div className="rw-segment-main">
        <MapRegionForm onSave={onSave} loading={loading} error={error} />
      </div>
    </div>
  )
}

export default NewMapRegion
