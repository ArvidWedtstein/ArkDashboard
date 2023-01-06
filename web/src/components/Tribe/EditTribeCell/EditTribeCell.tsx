import type { EditTribeById, UpdateTribeInput } from 'types/graphql'

import { navigate, routes } from '@redwoodjs/router'
import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import TribeForm from 'src/components/Tribe/TribeForm'

export const QUERY = gql`
  query EditTribeById($id: Int!) {
    tribe: tribe(id: $id) {
      id
      name
      description
      created_at
      updated_at
      createdBy
      updatedBy
    }
  }
`
const UPDATE_TRIBE_MUTATION = gql`
  mutation UpdateTribeMutation($id: Int!, $input: UpdateTribeInput!) {
    updateTribe(id: $id, input: $input) {
      id
      name
      description
      created_at
      updated_at
      createdBy
      updatedBy
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Failure = ({ error }: CellFailureProps) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({ tribe }: CellSuccessProps<EditTribeById>) => {
  const [updateTribe, { loading, error }] = useMutation(
    UPDATE_TRIBE_MUTATION,
    {
      onCompleted: () => {
        toast.success('Tribe updated')
        navigate(routes.tribes())
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const onSave = (
    input: UpdateTribeInput,
    id: EditTribeById['tribe']['id']
  ) => {
    updateTribe({ variables: { id, input } })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">Edit Tribe {tribe?.id}</h2>
      </header>
      <div className="rw-segment-main">
        <TribeForm tribe={tribe} onSave={onSave} error={error} loading={loading} />
      </div>
    </div>
  )
}
