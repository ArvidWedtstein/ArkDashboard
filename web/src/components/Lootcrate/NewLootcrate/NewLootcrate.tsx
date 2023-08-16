import { navigate, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import LootcrateForm from 'src/components/Lootcrate/LootcrateForm'

import type { CreateLootcrateInput } from 'types/graphql'

const CREATE_LOOTCRATE_MUTATION = gql`
  mutation CreateLootcrateMutation($input: CreateLootcrateInput!) {
    createLootcrate(input: $input) {
      id
    }
  }
`

const NewLootcrate = () => {
  const [createLootcrate, { loading, error }] = useMutation(
    CREATE_LOOTCRATE_MUTATION,
    {
      onCompleted: () => {
        toast.success('Lootcrate created')
        navigate(routes.lootcrates())
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const onSave = (input: CreateLootcrateInput) => {
    toast.promise(createLootcrate({ variables: { input } }), {
      loading: "Creating new lootcrate...",
      success: "Lootcrate successfully created",
      error: <b>Failed to create new lootcrate.</b>,
    });
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">New Lootcrate</h2>
      </header>
      <div className="rw-segment-main">
        <LootcrateForm onSave={onSave} loading={loading} error={error} />
      </div>
    </div>
  )
}

export default NewLootcrate
