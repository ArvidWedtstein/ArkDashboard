import { Link, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'
import Avatar from 'src/components/Avatar/Avatar'

import { QUERY } from 'src/components/Profile/ProfilesCell'
import Table from 'src/components/Util/Table/Table'
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
    <div className="rw-segment">
      <Table
        rows={profiles}
        columns={[
          {
            field: 'username',
            label: 'Username',
          },
          {
            field: 'full_name',
            label: 'Full name',
          }
        ]}
      />
      <div className='grid grid-cols-4 gap-4'>
        {profiles.map((profile, i) => (
          <div className='w-full'>
            <UserCard key={profile.id} user={
              {
                name: profile.full_name,
                subtext: "Jøde",
                img: 'https://randomuser.me/portraits/men/4.jpg'
              }
            } />
          </div>
        ))}
      </div>

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
            <th>Role id</th>
            <th>Created at</th>
            {/* <th>&nbsp;</th> */}
          </tr>
        </thead>
        <tbody>
          {profiles.map((profile) => (
            <tr key={profile.id}>
              <td>{truncate(profile.id)}</td>
              <td>{timeTag(profile.updated_at)}</td>
              <td>{truncate(profile.username)}</td>
              <td>{truncate(profile.full_name)}</td>
              <td><Avatar url={profile.avatar_url} size={30} className='rounded-full border-4 border-[#f8f8f8]' /></td>
              <td>{truncate(profile.website)}</td>
              <td>{truncate(profile.biography)}</td>
              <td>{truncate(profile.role_id)}</td>
              <td>{timeTag(profile.created_at)}</td>
              {/* <td>
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
                </td> */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ProfilesList
