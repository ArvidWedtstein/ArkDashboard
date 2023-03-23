
import { Link, routes, navigate } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'
import { useEffect, useState } from 'react'
import { supabase } from 'src/App'
import { Map } from 'src/components/Util/Map/Map'
import { RefModal } from 'src/components/Util/Modal/Modal'

import { getDateDiff, timeTag, } from 'src/lib/formatters'

import type { DeleteTimelineBasespotMutationVariables, FindTimelineBasespotById } from 'types/graphql'

const DELETE_TIMELINE_BASESPOT_MUTATION = gql`
  mutation DeleteTimelineBasespotMutation($id: BigInt!) {
    deleteTimelineBasespot(id: $id) {
      id
    }
  }
`

interface Props {
  timelineBasespot: NonNullable<FindTimelineBasespotById['timelineBasespot']>
}

const TimelineBasespot = ({ timelineBasespot }: Props) => {

  const [deleteTimelineBasespot] = useMutation(DELETE_TIMELINE_BASESPOT_MUTATION, {
    onCompleted: () => {
      toast.success('TimelineBasespot deleted')
      navigate(routes.timelineBasespots())
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const onDeleteClick = (id: DeleteTimelineBasespotMutationVariables['id']) => {
    if (confirm('Are you sure you want to delete timelineBasespot ' + id + '?')) {
      deleteTimelineBasespot({ variables: { id } })
    }
  }
  const [images, setImages] = useState([])
  const [isComponentVisible, setIsComponentVisible] = useState(false);
  const [currentModalImage, setCurrentModalImage] = useState(null);
  useEffect(() => {
    supabase.storage
      .from('timelineimages')
      .list('21')
      .then(({ data, error }) => {
        if (error) throw error;
        if (data) {
          setImages(data)
        }
      })
  }, [])

  return (
    <article className="rw-segment">
      <RefModal
        isOpen={isComponentVisible}
        onClose={() => setIsComponentVisible(false)}
        setIsOpen={(open) => setIsComponentVisible(open)}
        image={currentModalImage}
      />
      <div className="m-2 block rounded-md text-white">
        <section className="body-font">
          <div className="container mx-auto flex flex-col items-center px-5 py-12 md:flex-row">
            <div className="mb-16 flex flex-col items-center text-center md:mb-0 md:w-1/2 md:items-start md:pr-16 md:text-left lg:flex-grow lg:pr-24">
              <h1 className="title-font mb-4 text-3xl font-medium text-gray-900 dark:text-zinc-200 sm:text-4xl">
                {timelineBasespot.tribeName}
              </h1>
              <p className="leading-relaxed">
                This time we played on{" "}
                {timelineBasespot.server && timelineBasespot.server}
                {timelineBasespot.cluster &&
                  `, ${timelineBasespot.cluster}`}{" "}
                {timelineBasespot.season &&
                  `, Season ${timelineBasespot.season}`}
              </p>
              <div className="flex justify-center">
                <Link
                  to={routes.editTimelineBasespot({ id: timelineBasespot.id.toString() })}
                  className="inline-flex rounded border-0 bg-gray-200 py-2 px-6 text-lg text-gray-700 hover:bg-gray-300 focus:outline-none"
                >
                  Edit
                </Link>
                <button
                  onClick={() => onDeleteClick(timelineBasespot.id)}
                  className="ml-4 inline-flex rounded border-0 bg-red-500 py-2 px-6 text-lg text-white hover:bg-red-600 focus:outline-none"
                >
                  Delete
                </button>
              </div>
            </div>
            <div className="w-5/6 md:w-1/2 lg:w-full lg:max-w-lg">
              <img
                className="rounded object-cover object-center"
                src={`https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/timelineimages/${timelineBasespot.id}/${images[0].name}`}
                alt={timelineBasespot.tribeName}
              />
            </div>
          </div>
        </section>
        <section className="body-font mx-4 border-t border-gray-200 text-gray-700 dark:text-neutral-200">
          <div className="container mx-auto flex flex-wrap px-5 py-12">
            <div className="mb-10 w-full overflow-hidden text-sm lg:mb-0 lg:w-1/2">
              <p>
                We started playing on{" "}
                {timeTag(timelineBasespot.startDate)}.
              </p>
              <p>
                {!timelineBasespot.endDate &&
                  !timelineBasespot.raided_by
                  ? ""
                  : `Got raided `}
                {timelineBasespot.endDate && `on `}
                {timeTag(timelineBasespot.endDate)}
                {timelineBasespot.raided_by &&
                  `by ${timelineBasespot.raided_by}.`}
              </p>
              {timelineBasespot.startDate &&
                timelineBasespot.endDate && (
                  <p>
                    Base lasted
                    {
                      getDateDiff(
                        new Date(timelineBasespot.startDate),
                        new Date(timelineBasespot.endDate)
                      ).dateString
                    }
                  </p>
                )}
            </div>
          </div>
        </section>
        {timelineBasespot.raidcomment && timelineBasespot.raided_by && (
          <section className="body-font mx-4 border-t border-gray-200 text-stone-300">
            <div className="container mx-auto px-5 py-24">
              <div className="mx-auto w-full text-center lg:w-3/4 xl:w-1/2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  className="mb-8 inline-block h-8 w-8 text-white"
                  viewBox="0 0 975.036 975.036"
                >
                  <path d="M925.036 57.197h-304c-27.6 0-50 22.4-50 50v304c0 27.601 22.4 50 50 50h145.5c-1.9 79.601-20.4 143.3-55.4 191.2-27.6 37.8-69.399 69.1-125.3 93.8-25.7 11.3-36.8 41.7-24.8 67.101l36 76c11.6 24.399 40.3 35.1 65.1 24.399 66.2-28.6 122.101-64.8 167.7-108.8 55.601-53.7 93.7-114.3 114.3-181.9 20.601-67.6 30.9-159.8 30.9-276.8v-239c0-27.599-22.401-50-50-50zM106.036 913.497c65.4-28.5 121-64.699 166.9-108.6 56.1-53.7 94.4-114.1 115-181.2 20.6-67.1 30.899-159.6 30.899-277.5v-239c0-27.6-22.399-50-50-50h-304c-27.6 0-50 22.4-50 50v304c0 27.601 22.4 50 50 50h145.5c-1.9 79.601-20.4 143.3-55.4 191.2-27.6 37.8-69.4 69.1-125.3 93.8-25.7 11.3-36.8 41.7-24.8 67.101l35.9 75.8c11.601 24.399 40.501 35.2 65.301 24.399z"></path>
                </svg>
                <p className="text-lg leading-relaxed">
                  {timelineBasespot.raidcomment}
                </p>
                <span className="mt-8 mb-6 inline-block h-1 w-10 rounded bg-indigo-500"></span>
                <h2 className="title-font text-sm font-medium tracking-wider text-stone-400">
                  {timelineBasespot.raided_by}
                </h2>
                <p className="text-gray-500">
                  {timelineBasespot.cluster}
                </p>
              </div>
            </div>
          </section>
        )}
        <section className="body-font mx-4 border-t border-gray-200 text-gray-700 dark:text-neutral-200">
          <div className="container mx-auto flex flex-wrap px-5 py-12">
            <div className="mb-10 w-full overflow-hidden rounded-lg lg:mb-0 lg:w-1/2">
              <Map
                className="h-full w-full object-cover object-center"
                map={timelineBasespot.map.toString()}
                size={{ width: 500, height: 500 }}
                pos={[timelineBasespot.location as any]}
                interactive={true}
              />
            </div>
            <div className="-mb-10 flex flex-col flex-wrap text-center lg:w-1/2 lg:py-6 lg:pl-12 lg:text-left">
              <div className="mb-10 flex flex-col items-center lg:items-start">
                <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-full bg-pea-50 text-pea-500">
                  <svg
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="h-6 w-6"
                    viewBox="0 0 24 24"
                  >
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                  </svg>
                </div>
                <div className="flex-grow">
                  <h2 className="title-font mb-3 text-lg font-medium text-gray-900 dark:text-neutral-200">
                    Coordinates
                  </h2>
                  <p className="text-base leading-relaxed">
                    Our base was located at:{" "}
                    {timelineBasespot.location.lat}{" "}
                    <abbr title="Latitude">Lat</abbr>,{" "}
                    {timelineBasespot.location.lon}{" "}
                    <abbr title="Longitude">Lon</abbr>
                  </p>

                </div>
              </div>
              {timelineBasespot.basespot && (
                <div className="mb-10 flex flex-col items-center lg:items-start">
                  <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-full bg-pea-50 text-pea-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 576 512"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="h-6 w-6 fill-pea-500"
                    >
                      <path d="M560.02 32c-1.96 0-3.98.37-5.96 1.16L384.01 96H384L212 35.28A64.252 64.252 0 0 0 191.76 32c-6.69 0-13.37 1.05-19.81 3.14L20.12 87.95A32.006 32.006 0 0 0 0 117.66v346.32C0 473.17 7.53 480 15.99 480c1.96 0 3.97-.37 5.96-1.16L192 416l172 60.71a63.98 63.98 0 0 0 40.05.15l151.83-52.81A31.996 31.996 0 0 0 576 394.34V48.02c0-9.19-7.53-16.02-15.98-16.02zM224 90.42l128 45.19v285.97l-128-45.19V90.42zM48 418.05V129.07l128-44.53v286.2l-.64.23L48 418.05zm480-35.13l-128 44.53V141.26l.64-.24L528 93.95v288.97z" />
                    </svg>
                  </div>
                  <div className="flex-grow">
                    <h2 className="title-font mb-3 text-lg font-medium text-gray-900 dark:text-neutral-200">
                      Base
                    </h2>
                    <p className="text-base leading-relaxed">
                      Our basespot was {timelineBasespot.basespot.name}
                    </p>
                  </div>
                </div>
              )}
              <div className="mb-10 flex flex-col items-center lg:items-start">
                <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-full bg-pea-50 text-pea-500">
                  <svg
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="h-6 w-6"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </div>
                <div className="flex-grow">
                  <h2 className="title-font mb-3 text-lg font-medium text-gray-900 dark:text-neutral-200">
                    Players
                  </h2>
                  <p className="text-base leading-relaxed">
                    This time{" "}
                    {timelineBasespot.players.length < 3
                      ? timelineBasespot.players.join(" and ")
                      : timelineBasespot.players.join(", ")}{" "}
                    played
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="body-font mx-4 border-t border-gray-200 text-gray-700 dark:text-neutral-200">
          <div className="container mx-auto px-5 py-24">
            <div className="mb-20 flex w-full flex-col text-center">
              <h2 className="title-font mb-1 text-xs font-medium tracking-widest text-pea-500">
                Images & Screenshots taken during this season
              </h2>
              <h1 className="title-font text-2xl font-medium text-gray-900 dark:text-neutral-200 sm:text-3xl">
                Images
              </h1>
            </div>
            <div className="-m-4 flex flex-wrap">
              {images.map((img, i) => (
                <div key={`img${i}`} className="p-4 md:w-1/3">
                  <div className="flex h-full flex-col rounded-lg bg-gray-100 p-0 dark:bg-gray-600">
                    <div className="mb-3 flex items-center m-3">
                      <div className="mr-3 inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-pea-500 text-white">
                        <svg
                          fill="none"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          className="h-5 w-5"
                          viewBox="0 0 24 24"
                        >
                          <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                        </svg>
                      </div>
                      <h2 className="title-font text-lg font-medium text-gray-900 dark:text-neutral-200">
                        {timeTag(img.created_at)}
                      </h2>
                    </div>
                    <div className="flex-grow">
                      <p className="text-base leading-relaxed"></p>
                      <img
                        onClick={() => {
                          setCurrentModalImage(
                            `https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/timelineimages/${timelineBasespot.id}/${img.name}`
                          );
                          setIsComponentVisible(true);
                        }}
                        className="h-full w-full cursor-pointer rounded-b object-cover object-center"
                        src={`https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/timelineimages/${timelineBasespot.id}/${img.name}`}
                        alt={timelineBasespot.id.toString()}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </article>
  )
}

export default TimelineBasespot
