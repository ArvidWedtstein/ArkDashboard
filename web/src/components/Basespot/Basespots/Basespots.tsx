import type {
  DeleteBasespotMutationVariables,
  FindBasespots,
} from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { QUERY } from 'src/components/Basespot/BasespotsCell'
import { timeTag, truncate } from 'src/lib/formatters'

const DELETE_BASESPOT_MUTATION = gql`
  mutation DeleteBasespotMutation($id: Int!) {
    deleteBasespot(id: $id) {
      id
    }
  }
`

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
  const spots = [
    {
      id: 1,
      name: 'Red Obelisk Cave',
      description:
        'This is a smaller cave that may be better suited for solo players or those looking for a quick place to set up shop.',
      img: 'https://d.newsweek.com/en/full/1506001/ark-valguero-cave-2.webp?w=790&f=aa5cac796dcd6f52665e6512352ffc38',
      lat: 82,
      lon: 25,
      map: 'Valguero',
      created: '2021-05-01T00:00:00.000Z',
      EstimatedForPlayers: '4-6',
    },
    {
      id: 2,
      name: 'Westtern Cave',
      description:
        "As seen below, you'll come to this waterfall. Enter through the middle of the fall or the smaller falls at the base of the structure. Once you get inside there's lots of space, but you'll need to be careful about ensuring those pathways are thoroughly guarded. Not only is the open area great for breeding, but there's also an underwater cave inside this cave, making it perfect for aquatic tames.",
      img: 'https://d.newsweek.com/en/full/1506004/ark-valguero-cave-1.webp?w=790&f=27680a51ee9ed6bd7cdc46f70eaf5045',
      lat: 33,
      lon: 10,
      map: 'Valguero',
      created: '2021-05-01T00:00:00.000Z',
      EstimatedForPlayers: '?',
    },
    {
      id: 3,
      name: 'Spider Cave',
      description:
        "If you want a much bigger cave that's also close to lots of resources go here. There are winding paths that go on forever in multiple directions. It should be noted that this is one of the big Artifact Caves you'll need to head towards if you want to conquer Valguero's boss. Be aware that you'll need scuba gear too because there's tons of water here.",
      lat: 73,
      lon: 40,
      map: 'Valguero',
      created: '2021-05-01T00:00:00.000Z',
      EstimatedForPlayers: '?',
    },
    {
      id: 4,
      name: 'Temple Cave',
      description:
        "This is the second Artifact Cave you'll need to make your way through if beating the boss is your goal.",
      lat: 44,
      lon: 84,
      map: 'Valguero',
      created: '2021-05-01T00:00:00.000Z',
      EstimatedForPlayers: '?',
    },
    {
      id: 5,
      name: 'Abberation Zone Cave',
      description:
        "If you're hunting for Aberration creatures, this is where you'll find them.",
      lat: 38,
      lon: 57,
      map: 'Valguero',
      created: '2021-05-01T00:00:00.000Z',
      EstimatedForPlayers: '?',
    },
    {
      id: 6,
      name: 'Ice Cave',
      description: 'This is a narrow ice cave with an artifact inside.',
      lat: 15,
      lon: 27,
      map: 'Valguero',
      created: '2021-05-01T00:00:00.000Z',
      EstimatedForPlayers: '?',
    },
    {
      id: 7,
      name: 'Solid Hiding Spot',
      description:
        'This is a small, narrow cave network that will keep you concealed from enemies or Dinos.',
      lat: 53,
      lon: 87,
      map: 'Valguero',
      created: '2021-05-01T00:00:00.000Z',
      EstimatedForPlayers: '?',
    },
    {
      id: 8,
      name: 'Under castle cave',
      description:
        "There's a massive breeding cave in this area with plenty of water.",
      lat: 37,
      lon: 90,
      map: 'Valguero',
      created: '2021-05-01T00:00:00.000Z',
      EstimatedForPlayers: '?',
    },
  ]
  return (
    <div className="">
      <div className="mb-5 grid grid-cols-2 gap-5">
        {spots.map((basespot, i) => (
          <div
            key={i}
            className={
              'group flex overflow-hidden rounded bg-white leading-snug shadow-xl lg:max-w-screen-md ' +
              (i % 2 === 0 ? 'flex-row' : 'flex-row-reverse')
            }
          >
            <div className="meta relative h-52 lg:h-auto lg:basis-2/5">
              <div
                className="absolute top-0 bottom-0 left-0 right-0 bg-cover bg-center transition-transform"
                style={{
                  backgroundImage: `url(${
                    basespot.img
                      ? basespot.img
                      : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTvC4tJUjp6TudN0t7kMxrGll3AQDUOPCncWSSogN5lgA&s'
                  })`,
                }}
              ></div>
              <ul className="list-style-none absolute -left-full top-0 bottom-0 flex w-full flex-col bg-slate-700 bg-opacity-60 p-[10px] text-sm text-white transition-[left] group-hover:left-0 ">
                <li className="inline-block before:mr-2.5">
                  <ul className="inline-block">
                    <li className="mr-0.5">
                      <p>Created: {timeTag(basespot.created)}</p>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
            <div className="relative z-10 bg-gray-700 p-4 text-white lg:basis-3/5 lg:before:absolute lg:before:-left-2.5 lg:before:z-10 lg:before:w-7 lg:before:-skew-x-3 lg:before:bg-slate-500 ">
              <Link
                to={routes.basespot({ id: basespot.id })}
                target="_blank"
                className="m-0 text-2xl leading-none text-gray-100"
              >
                {basespot.name}
              </Link>
              <div className="relative mt-2 flex flex-row">
                <span className="mr-2 rounded bg-black px-2.5 py-0.5 text-sm font-medium text-slate-200 dark:bg-slate-200 dark:text-black">
                  {basespot.map}
                </span>
              </div>
              <p className="relative mt-4 before:absolute before:-top-3 before:h-1 before:w-9 before:rounded before:bg-lime-500 first-of-type:mt-5">
                {truncate(basespot.description)}
              </p>
              <p className="read-more relative mt-4 text-right first-of-type:mt-5">
                <a
                  className="text-imdb_green_500 relative inline-block underline decoration-dotted after:ml-2.5 after:align-middle after:opacity-0 after:transition-[margin,opacity] after:content-['👉'] hover:after:ml-1.5 hover:after:opacity-100"
                  href="/read-more"
                >
                  Les mer
                </a>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default BasespotsList
