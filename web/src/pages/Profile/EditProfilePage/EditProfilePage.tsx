import EditProfileCell from 'src/components/Profile/EditProfileCell'

type ProfilePageProps = {
  id: string
}

const EditProfilePage = ({ id }: ProfilePageProps) => {
  return <EditProfileCell id={id} />
}

export default EditProfilePage
