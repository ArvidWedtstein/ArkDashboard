import type { EditProfileById, UpdateProfileInput } from 'types/graphql'

import { navigate, routes } from '@redwoodjs/router'
import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import ProfileForm from 'src/components/Profile/ProfileForm'

export const QUERY = gql`
  query EditProfileById($id: String!) {
    profile: profile(id: $id) {
      id
      updated_at
      username
      full_name
      avatar_url
      website
      biography
      status
      role_id
      created_at
      steam_user_id
    }
    roles {
      id
      name
      permissions
    }
  }
`
const UPDATE_PROFILE_MUTATION = gql`
  mutation UpdateProfileMutation($id: String!, $input: UpdateProfileInput!) {
    updateProfile(id: $id, input: $input) {
      id
      updated_at
      username
      full_name
      avatar_url
      website
      biography
      status
      role_id
      created_at
      steam_user_id
    }
  }
`

export const Loading = () => (
  <div
    role="status"
    className="animate-pulse flex-col space-y-8 md:flex md:items-center md:space-y-0 md:space-x-8"
  >
    <div className="flex w-full items-center justify-between">
      <div className="flex w-1/3 items-center justify-center gap-16">
        <div className="flex flex-col items-center justify-center gap-2">
          <div className="h-4 w-6 rounded-full bg-gray-200 dark:bg-gray-700"></div>
          <div className="h-2 w-12 rounded-full bg-gray-200 dark:bg-gray-700"></div>
        </div>
        <div className="flex flex-col items-center justify-center gap-2">
          <div className="h-4 w-6 rounded-full bg-gray-200 dark:bg-gray-700"></div>
          <div className="h-2 w-12 rounded-full bg-gray-200 dark:bg-gray-700"></div>
        </div>
        <div className="flex flex-col items-center justify-center gap-2">
          <div className="h-4 w-6 rounded-full bg-gray-200 dark:bg-gray-700"></div>
          <div className="h-2 w-12 rounded-full bg-gray-200 dark:bg-gray-700"></div>
        </div>
      </div>
      <div className="w-1/3">
        <svg
          className="mx-auto h-32 w-32 text-gray-200 dark:text-gray-700"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z" />
        </svg>
      </div>
      <div className="w-1/3"></div>
    </div>
    <div className="w-full space-y-2">
      <div className="my-2 mx-auto h-2.5 w-48 rounded-full bg-gray-200 dark:bg-gray-700"></div>
      <div className="mx-auto h-2 w-64 rounded-full bg-gray-200 dark:bg-gray-700"></div>
      <div className="mx-auto h-2 max-w-[440px] rounded-full bg-gray-200 dark:bg-gray-700"></div>
      <div className="mx-auto h-2 max-w-[460px] rounded-full bg-gray-200 dark:bg-gray-700"></div>
      <div className="mx-auto h-2 max-w-[360px] rounded-full bg-gray-200 dark:bg-gray-700"></div>
    </div>
    <span className="sr-only">Loading...</span>
  </div>
)

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

export const Success = ({ profile, roles }: CellSuccessProps<EditProfileById>) => {
  const [updateProfile, { loading, error }] = useMutation(
    UPDATE_PROFILE_MUTATION,
    {
      onCompleted: () => {
        toast.success('Profile updated')
        navigate(routes.profiles())
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const onSave = (
    input: UpdateProfileInput,
    id: EditProfileById['profile']['id']
  ) => {
    updateProfile({ variables: { id, input } })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">Edit Profile for {profile?.full_name}</h2>
      </header>
      <div className="rw-segment-main">
        <ProfileForm profile={profile} roles={roles} onSave={onSave} error={error} loading={loading} />
      </div>
    </div>
  )
}
