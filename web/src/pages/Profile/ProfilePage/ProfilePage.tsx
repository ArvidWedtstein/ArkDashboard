import ProfileCell from 'src/components/Profile/ProfileCell'

type ProfilePageProps = {
  id: string
}

const ProfilePage = ({ id }: ProfilePageProps) => {
  return <ProfileCell id={id} />
}

export default ProfilePage
