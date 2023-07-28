import { navigate, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import DinoStatForm from 'src/components/DinoStat/DinoStatForm'

import type { CreateDinoStatInput } from 'types/graphql'

const CREATE_DINO_STAT_MUTATION = gql`
  mutation CreateDinoStatMutation($input: CreateDinoStatInput!) {
    createDinoStat(input: $input) {
      id
    }
  }
`

const NewDinoStat = () => {
  const [createDinoStat, { loading, error }] = useMutation(
    CREATE_DINO_STAT_MUTATION,
    {
      onCompleted: () => {
        toast.success('DinoStat created')
        navigate(routes.dinoStats())
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const onSave = (input: CreateDinoStatInput) => {
    createDinoStat({ variables: { input } })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">New DinoStat</h2>
      </header>
      <div className="rw-segment-main">
        <DinoStatForm onSave={onSave} loading={loading} error={error} />
      </div>
    </div>
  )
}

export default NewDinoStat
