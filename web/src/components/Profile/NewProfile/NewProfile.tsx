import { navigate, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import ProfileForm from 'src/components/Profile/ProfileForm'

import type { CreateProfileInput } from 'types/graphql'

const CREATE_PROFILE_MUTATION = gql`
  mutation CreateProfileMutation($input: CreateProfileInput!) {
    createProfile(input: $input) {
      id
    }
  }
`

const NewProfile = () => {
  const [createProfile, { loading, error }] = useMutation(
    CREATE_PROFILE_MUTATION,
    {
      onCompleted: () => {
        toast.success('Profile created')
        navigate(routes.profiles())
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const onSave = (input: CreateProfileInput) => {
    createProfile({ variables: { input } })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">New Profile</h2>
      </header>
      <div className="rw-segment-main">
        <ProfileForm onSave={onSave} loading={loading} error={error} />
      </div>
    </div>
  )
}

export default NewProfile
