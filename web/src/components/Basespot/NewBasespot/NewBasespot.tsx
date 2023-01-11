import { navigate, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import BasespotForm from 'src/components/Basespot/BasespotForm'

import type { CreateBasespotInput } from 'types/graphql'

const CREATE_BASESPOT_MUTATION = gql`
  mutation CreateBasespotMutation($input: CreateBasespotInput!) {
    createBasespot(input: $input) {
      id
    }
  }
`

const NewBasespot = () => {
  const [createBasespot, { loading, error }] = useMutation(
    CREATE_BASESPOT_MUTATION,
    {
      onCompleted: () => {
        toast.success('Basespot created')
        navigate(routes.basespots())
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const onSave = (input: CreateBasespotInput) => {
    createBasespot({ variables: { input } })
  }

  return (
    <div className="dark:bg-neutral-800 bg-slate-200 dark:text-white text-black">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">New Basespot</h2>
      </header>
      <div className="rw-segment-main">
        <BasespotForm onSave={onSave} loading={loading} error={error} />
      </div>
    </div>
  )
}

export default NewBasespot
