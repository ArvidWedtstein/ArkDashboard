import { Link, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'
import ArkCard from 'src/components/ArkCard/ArkCard'

import { QUERY } from 'src/components/Basespot/BasespotsCell'
import { timeTag, truncate } from 'src/lib/formatters'

import type { DeleteBasespotMutationVariables, FindBasespots } from 'types/graphql'

const DELETE_BASESPOT_MUTATION = gql`
  mutation DeleteBasespotMutation($id: Int!) {
    deleteBasespot(id: $id) {
      id
    }
  }
`
//https://ark.fandom.com/wiki/HUD
const BasespotsList = ({ basespots }: FindBasespots) => {
  const [deleteBasespot] = useMutation(DELETE_BASESPOT_MUTATION, {
    onCompleted: () => {
      toast.success('Basespot deleted')
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

  const onDeleteClick = (id: DeleteBasespotMutationVariables['id']) => {
    if (confirm('Are you sure you want to delete basespot ' + id + '?')) {
      deleteBasespot({ variables: { id } })
    }
  }

  return (
    <div className="">

      <div className='grid mt-8 gap-8 grid-cols-1 md:grid-cols-2 xl:grid-cols-2 mb-5'>
        {basespots.map((basespot, i) => (
          <ArkCard
            key={i}
            title={basespot.name}
            subtitle={basespot.Map}
            content={basespot.description}
            ring={`${basespot.estimatedForPlayers} players`}
            // image={basespot.image}
            button={{
              text: 'Learn Moar',
              link: routes.basespot({ id: basespot.id }),
            }}
          />
        ))}
      </div>
    </div>
  )
}

export default BasespotsList
