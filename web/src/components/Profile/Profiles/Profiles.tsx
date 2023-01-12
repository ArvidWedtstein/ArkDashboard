import { Link, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { QUERY } from 'src/components/Profile/ProfilesCell'
import UserCard from 'src/components/Util/UserCard/UserCard'
import { formatEnum, timeTag, truncate } from 'src/lib/formatters'

import type { DeleteProfileMutationVariables, FindProfiles } from 'types/graphql'

const DELETE_PROFILE_MUTATION = gql`
  mutation DeleteProfileMutation($id: String!) {
    deleteProfile(id: $id) {
      id
    }
  }
`

const ProfilesList = ({ profiles }: FindProfiles) => {
  const [deleteProfile] = useMutation(DELETE_PROFILE_MUTATION, {
    onCompleted: () => {
      toast.success('Profile deleted')
    },
    onError: (error) => {
      toast.error(error.message)
    },
    // This refetches the query on the list page. Read more about other ways to
    // update the cache over here:
    // https://www.apollographql.com/docs/react/data/mutations/#making-all-other-cache-updates
    refetchQueries: [{ query: QUERY }],
    awaitRefetchQueries: true,
  })

  const onDeleteClick = (id: DeleteProfileMutationVariables['id']) => {
    if (confirm('Are you sure you want to delete profile ' + id + '?')) {
      deleteProfile({ variables: { id } })
    }
  }

  return (
    <div>
      {profiles.map((profile, i) => {
        <UserCard user={
          {
            name: profile.full_name,
            subtext: "Jøde",
            img: 'https://randomuser.me/portraits/men/4.jpg'
          }
        } />
      })}
      <div className="rw-segment rw-table-wrapper-responsive">
        <table className="rw-table">
          <thead>
            <tr>
              <th>Id</th>
              <th>Updated at</th>
              <th>Username</th>
              <th>Full name</th>
              <th>Avatar url</th>
              <th>Website</th>
              <th>Biography</th>
              <th>Status</th>
              <th>Role id</th>
              <th>Created at</th>
              <th>&nbsp;</th>
            </tr>
          </thead>
          <tbody>
            {profiles.map((profile) => (
              <tr key={profile.id}>
                <td>{truncate(profile.id)}</td>
                <td>{timeTag(profile.updated_at)}</td>
                <td>{truncate(profile.username)}</td>
                <td>{truncate(profile.full_name)}</td>
                <td>{truncate(profile.avatar_url)}</td>
                <td>{truncate(profile.website)}</td>
                <td>{truncate(profile.biography)}</td>
                <td>{formatEnum(profile.status)}</td>
                <td>{truncate(profile.role_id)}</td>
                <td>{timeTag(profile.created_at)}</td>
                <td>
                  <nav className="rw-table-actions">
                    <Link
                      to={routes.profile({ id: profile.id })}
                      title={'Show profile ' + profile.id + ' detail'}
                      className="rw-button rw-button-small"
                    >
                      Show
                    </Link>
                    <Link
                      to={routes.editProfile({ id: profile.id })}
                      title={'Edit profile ' + profile.id}
                      className="rw-button rw-button-small rw-button-blue"
                    >
                      Edit
                    </Link>
                    <button
                      type="button"
                      title={'Delete profile ' + profile.id}
                      className="rw-button rw-button-small rw-button-red"
                      onClick={() => onDeleteClick(profile.id)}
                    >
                      Delete
                    </button>
                  </nav>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ProfilesList
