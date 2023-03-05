import type { EditMapById, UpdateMapInput } from 'types/graphql'

import { navigate, routes } from '@redwoodjs/router'
import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import MapForm from 'src/components/Map/MapForm'

export const QUERY = gql`
  query EditMapById($id: BigInt!) {
    map: map(id: $id) {
      id
      created_at
      name
      loot_crates
      oil_veins
      water_veins
      wyvern_nests
      ice_wyvern_nests
      gas_veins
      deinonychus_nests
      charge_nodes
      plant_z_nodes
      drake_nests
      glitches
      magmasaur_nests
      poison_trees
      mutagen_bulbs
      carniflora
      notes
      img
    }
  }
`
const UPDATE_MAP_MUTATION = gql`
  mutation UpdateMapMutation($id: BigInt!, $input: UpdateMapInput!) {
    updateMap(id: $id, input: $input) {
      id
      created_at
      name
      loot_crates
      oil_veins
      water_veins
      wyvern_nests
      ice_wyvern_nests
      gas_veins
      deinonychus_nests
      charge_nodes
      plant_z_nodes
      drake_nests
      glitches
      magmasaur_nests
      poison_trees
      mutagen_bulbs
      carniflora
      notes
      img
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Failure = ({ error }: CellFailureProps) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({ map }: CellSuccessProps<EditMapById>) => {
  const [updateMap, { loading, error }] = useMutation(
    UPDATE_MAP_MUTATION,
    {
      onCompleted: () => {
        toast.success('Map updated')
        navigate(routes.maps())
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const onSave = (
    input: UpdateMapInput,
    id: EditMapById['map']['id']
  ) => {
    updateMap({ variables: { id, input } })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">Edit Map {map?.id}</h2>
      </header>
      <div className="rw-segment-main">
        <MapForm map={map} onSave={onSave} error={error} loading={loading} />
      </div>
    </div>
  )
}
