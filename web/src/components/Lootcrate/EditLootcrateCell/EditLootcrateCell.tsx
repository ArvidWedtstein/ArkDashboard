import type { EditLootcrateById, UpdateLootcrateInput } from 'types/graphql'

import { navigate, routes } from '@redwoodjs/router'
import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import LootcrateForm from 'src/components/Lootcrate/LootcrateForm'

export const QUERY = gql`
  query EditLootcrateById($id: String!) {
    lootcrate: lootcrate(id: $id) {
      id
      created_at
      updated_at
      blueprint
      name
      map
      level_requirement
      decay_time
      no_repeat_in_sets
      quality_multiplier
      set_qty
      color
    }
  }
`
const UPDATE_LOOTCRATE_MUTATION = gql`
  mutation UpdateLootcrateMutation($id: String!, $input: UpdateLootcrateInput!) {
    updateLootcrate(id: $id, input: $input) {
      id
      created_at
      updated_at
      blueprint
      name
      map
      level_requirement
      decay_time
      no_repeat_in_sets
      quality_multiplier
      set_qty
      color
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Failure = ({ error }: CellFailureProps) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({ lootcrate }: CellSuccessProps<EditLootcrateById>) => {
  const [updateLootcrate, { loading, error }] = useMutation(
    UPDATE_LOOTCRATE_MUTATION,
    {
      onCompleted: () => {
        toast.success('Lootcrate updated')
        navigate(routes.lootcrates())
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const onSave = (
    input: UpdateLootcrateInput,
    id: EditLootcrateById['lootcrate']['id']
  ) => {
    updateLootcrate({ variables: { id, input } })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">Edit Lootcrate {lootcrate?.id}</h2>
      </header>
      <div className="rw-segment-main">
        <LootcrateForm lootcrate={lootcrate} onSave={onSave} error={error} loading={loading} />
      </div>
    </div>
  )
}
