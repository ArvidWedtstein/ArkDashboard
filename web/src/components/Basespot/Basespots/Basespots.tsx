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
      {/* <div className='grid mt-8 gap-8 grid-cols-1 md:grid-cols-2 xl:grid-cols-2 mb-5'>
        {basespots.map((basespot, i) => (
          <ArkCard
            key={i}
            title={basespot.name}
            subtitle={basespot.Map}
            content={basespot.description}
            ring={`${basespot.estimatedForPlayers} players`}
            image={basespot.image}
            button={{
              text: 'Learn Moar',
              link: routes.basespot({ id: basespot.id }),
            }}
          />
        ))}
      </div> */}
      <div className="grid mt-8 gap-8 grid-cols-1 md:grid-cols-2 xl:grid-cols-2 mb-5">
        {basespots.map((basespot, i) => (
          <div
            key={i}
            className={"group flex shadow-xl bg-white leading-snug overflow-hidden rounded lg:max-w-screen-md " + (i % 2 === 0 ? "flex-row" : "flex-row-reverse")}
          >
            <div className="relative h-52 lg:h-auto lg:basis-2/5 meta">
              <div
                className="absolute top-0 bottom-0 left-0 right-0 bg-cover bg-center transition-transform"
                style={{ backgroundImage: `url(${basespot.image ? basespot.image : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTvC4tJUjp6TudN0t7kMxrGll3AQDUOPCncWSSogN5lgA&s"})` }}
              ></div>
              <ul
                className="flex flex-col list-style-none -left-full absolute top-0 bottom-0 w-full p-[10px] bg-slate-700 bg-opacity-60 transition-[left] text-white text-sm group-hover:left-0 "
              >
                <li
                  className="inline-block before:mr-2.5"
                >
                  <ul className="inline-block">
                    <li
                      className="mr-0.5"
                    >
                      <p>Created: {timeTag(basespot.createdAt)}</p>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
            <div
              className="relative bg-gray-700 text-white p-4 z-10 lg:basis-3/5 lg:before:-skew-x-3 lg:before:bg-slate-500 lg:before:w-7 lg:before:absolute lg:before:-left-2.5 lg:before:z-10 "
            >
              <Link to={routes.basespot({ id: basespot.id })} target="_blank" className="leading-none m-0 text-2xl text-gray-100">
                {basespot.name}
              </Link>
              <div className="relative flex flex-row mt-2">
                <span className="bg-black text-slate-200 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-slate-200 dark:text-black">
                  {basespot.Map}
                </span>
              </div>
              <p className="relative mt-4 first-of-type:mt-5 before:absolute before:h-1 before:w-9 before:bg-lime-500 before:-top-3 before:rounded">
                {truncate(basespot.description)}
              </p>
              <p className="relative mt-4 text-right first-of-type:mt-5 read-more">
                <a
                  className="underline decoration-dotted text-imdb_green_500 inline-block relative after:content-['👉'] after:ml-2.5 after:align-middle after:opacity-0 after:transition-[margin,opacity] hover:after:opacity-100 hover:after:ml-1.5"
                  href="#"
                >Les mer</a>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default BasespotsList
