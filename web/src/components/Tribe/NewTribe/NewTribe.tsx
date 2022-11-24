
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
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">New Tribe</h2>
      </header>
      <div className="rw-segment-main">
        <TribeForm onSave={onSave} loading={loading} error={error} />
      </div>
    </div>
  )
}

export default NewTribe
