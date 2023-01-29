import { navigate, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import TribeForm from 'src/components/Tribe/TribeForm'

import type { CreateTribeInput } from 'types/graphql'

const CREATE_TRIBE_MUTATION = gql`
  mutation CreateTribeMutation($input: CreateTribeInput!) {
    createTribe(input: $input) {
      id
    }
  }
`

const NewTribe = () => {
  const [createTribe, { loading, error }] = useMutation(
    CREATE_TRIBE_MUTATION,
    {
      onCompleted: () => {
        toast.success('Tribe created')
        navigate(routes.tribes())
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const onSave = (input: CreateTribeInput) => {
    createTribe({ variables: { input } })
  }

  return (
    <div className="rw-segment">
      <header className="py-3 px-4 text-gray-700 dark:text-stone-200">
        <h2 className="rw-heading-secondary">New Tribe</h2>
      </header>
      <div className="p-4">
        <TribeForm onSave={onSave} loading={loading} error={error} />
      </div>
    </div>
  )
}

export default NewTribe
