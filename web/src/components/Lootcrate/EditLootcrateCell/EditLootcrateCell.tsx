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
      map_id
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
      map_id
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
  <div className="rw-cell-error flex items-center space-x-3 animate-fly-in" >
    <svg className="w-12 h-12 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
      <path d="M256 304c4.406 0 8-3.578 8-8v-176c0-4.422-3.594-8-8-8S248 115.6 248 120v176C248 300.4 251.6 304 256 304zM256 352c-8.836 0-16 7.164-16 16S247.2 384 256 384s16-7.164 16-16S264.8 352 256 352zM256 0C114.6 0 0 114.6 0 256s114.6 256 256 256s256-114.6 256-256S397.4 0 256 0zM256 496c-132.3 0-240-107.7-240-240S123.7 16 256 16s240 107.7 240 240S388.3 496 256 496z" />
    </svg>
    <div className="flex flex-col">
      <p className="font-bold text-lg leading-snug">Some unexpected shit happend</p>
      <p className="text-sm">{error?.message}</p>
    </div>
  </div>
);

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
    toast.promise(updateLootcrate({ variables: { id, input } }), {
      loading: "Updating lootcrate...",
      success: "Lootcrate successfully updated",
      error: <b>Failed to update lootcrate.</b>,
    });
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
