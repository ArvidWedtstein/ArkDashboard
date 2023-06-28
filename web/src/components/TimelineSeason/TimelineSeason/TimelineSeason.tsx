import { Link, routes, navigate } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { timeTag } from 'src/lib/formatters'

import type {
  DeleteTimelineSeasonMutationVariables,
  FindTimelineSeasonById,
} from 'types/graphql'

const DELETE_TIMELINE_SEASON_MUTATION = gql`
  mutation DeleteTimelineSeasonMutation($id: String!) {
    deleteTimelineSeason(id: $id) {
      id
    }
  }
`

interface Props {
  timelineSeason: NonNullable<FindTimelineSeasonById['timelineSeason']>
}

const TimelineSeason = ({ timelineSeason }: Props) => {
  const [deleteTimelineSeason] = useMutation(DELETE_TIMELINE_SEASON_MUTATION, {
    onCompleted: () => {
      toast.success('TimelineSeason deleted')
      navigate(routes.timelineSeasons())
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const onDeleteClick = (id: DeleteTimelineSeasonMutationVariables['id']) => {
    if (confirm('Are you sure you want to delete timelineSeason ' + id + '?')) {
      deleteTimelineSeason({ variables: { id } })
    }
  }

  return (
    <>
      <div className="rw-segment flex">
        {/* <header className="rw-segment-header">
          <h2 className="rw-heading rw-heading-secondary">
            TimelineSeason {timelineSeason.id} Detail
          </h2>
        </header> */}

        <div className='basis-32 flex-1 grid grid-cols-4 gap-3 w-full h-fit'>
          {timelineSeason.TimelineSeasonBasespot.map(({ id, Map: { name } }) => (
            <div className="flex justify-between">
              <Link
                to={routes.timelineSeasonBasespot({ id: id.toString() })}
                className={"group relative flex h-auto w-full overflow-hidden rounded-xl"}
              >
                <img
                  className="h-full w-full object-cover transition-all duration-200 ease-in group-hover:scale-110"
                  src={`https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/timelineimages/13/20220618173551_1.jpg?t=2023-06-28T09%3A03%3A09.582Z`}
                  alt=""
                />
                <div
                  className="absolute flex h-full w-full flex-col items-end justify-end p-3"
                  style={{
                    background:
                      "linear-gradient(0deg, #001022cc 0%, #f0f4fd33 90%)",
                  }}
                >
                  <div className="flex w-full justify-between text-left">
                    <div className="w-full">
                      <p className="m-0 overflow-hidden text-ellipsis whitespace-nowrap text-xs text-white">
                        Basespot
                      </p>
                      {/* {img.metadata?.size && (
                              <p className="m-0 overflow-hidden text-ellipsis whitespace-nowrap text-xs text-white">
                                10mb
                              </p>
                            )} */}
                    </div>
                  </div>
                </div>
                <span className="absolute right-3 top-3 z-10 rounded-[10px] bg-[#8b9ca380] py-1 px-3 text-xs text-white">
                  {/* {new Date(img.updated_at).toLocaleTimeString("de", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })} */}
                  {/* <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 448 512"
                          fill="currentColor"
                          className="mr-1 inline-block h-4 w-4 text-white"
                        >
                          <path d="M152 24c0-13.3-10.7-24-24-24s-24 10.7-24 24V64H64C28.7 64 0 92.7 0 128v16 48V448c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V192 144 128c0-35.3-28.7-64-64-64H344V24c0-13.3-10.7-24-24-24s-24 10.7-24 24V64H152V24zM48 192H400V448c0 8.8-7.2 16-16 16H64c-8.8 0-16-7.2-16-16V192z" />
                        </svg> */}
                  {/* {convertToDate(
                          img.name.replace("_1.jpg", "")
                        ).toLocaleString("de", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        }) === "Invalid Date"
                          ? new Date(img.created_at).toLocaleString("de", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })
                          : convertToDate(
                            img.name.replace("_1.jpg", "")
                          ).toLocaleString("de", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })} */}
                  {name}
                </span>
              </Link>
            </div>
          ))}
        </div>

        <div className="basis-72 grow-0 text-white h-screen p-6 overflow-auto">
          <p>Downloads</p>
          <div className="py-3">
            <div className="text-xs">Today</div>
            <div className="p-2 rounded-xl flex items-center mt-3 bg-zinc-500">
              <div className="w-8">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="">
                  <defs></defs>
                  <circle cx="256" cy="256" r="256" fill="#4b50dd"></circle>
                  <path fill="#f5f5f5" d="M192 64h176c4.4 0 8 3.6 8 8v328c0 4.4-3.6 8-8 8H120c-4.4 0-8-3.6-8-8V148l80-84z"></path>
                  <path fill="#e6e6e6" d="M184 148c4.4 0 8-3.6 8-8V64l-80 84h72z"></path>
                  <circle cx="352" cy="384" r="52" fill="#2179a6"></circle>
                  <g fill="#f5f5f5" className="g">
                    <path d="M352 416c-2.208 0-4-1.788-4-4v-56c0-2.212 1.792-4 4-4s4 1.788 4 4v56c0 2.212-1.792 4-4 4z"></path>
                    <path d="M352 416a3.989 3.989 0 01-2.828-1.172l-20-20c-1.564-1.564-1.564-4.092 0-5.656s4.092-1.564 5.656 0L352 406.344l17.172-17.172c1.564-1.564 4.092-1.564 5.656 0s1.564 4.092 0 5.656l-20 20A3.989 3.989 0 01352 416z"></path>
                  </g>
                </svg>
              </div>
              <div className="px-3">
                <p className="text-sm leading-4 m-0 whitespace-nowrap overflow-hidden w-36 text-ellipsis">Dilophosaur.mp4</p>
                <p className="text-xs download-text-info leading-4 m-0 whitespace-nowrap overflow-hidden w-36 text-ellipsis">34.45 MB<span className='ml-1'>Waiting for download</span></p>
              </div>
              <div className="w-6">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 612 612" fill='#fff'>
                  <defs />
                  <path d="M403.939 295.749l-78.814 78.833V172.125c0-10.557-8.568-19.125-19.125-19.125s-19.125 8.568-19.125 19.125v202.457l-78.814-78.814c-7.478-7.478-19.584-7.478-27.043 0-7.478 7.478-7.478 19.584 0 27.042L289.208 431c4.59 4.59 10.863 6.005 16.812 4.953 5.929 1.052 12.221-.382 16.811-4.953l108.19-108.19c7.478-7.478 7.478-19.583 0-27.042-7.498-7.478-19.604-7.478-27.082-.019zM306 0C137.012 0 0 136.992 0 306s137.012 306 306 306 306-137.012 306-306S475.008 0 306 0zm0 573.75C158.125 573.75 38.25 453.875 38.25 306S158.125 38.25 306 38.25 573.75 158.125 573.75 306 453.875 573.75 306 573.75z" />
                </svg>
              </div>
            </div>
          </div>

          <p>Events</p>
          {/* TODO: Make modal for event */}
          <ol className="relative border-l border-gray-200 mt-3 ml-2">
            {/* group by date */}
            {timelineSeason.TimelineSeasonEvent.map(({ title, content, tags, created_at }, idx) => (
              <li className="mb-10 ml-6">
                <span className="absolute flex items-center justify-center w-3 h-3 bg-blue-100 rounded-full -left-1.5 dark:bg-white">
                  {/* <svg aria-hidden="true" className="w-3 h-3 text-blue-800 dark:text-black" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"></path>
                  </svg> */}
                </span>
                <h3 className="flex items-center -ml-2 mt-2 mb-1 text-xs text-gray-900 dark:text-white">
                  {new Date(created_at).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
                  {idx == 0 && <span className="bg-blue-100 text-blue-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300 ml-3">Latest</span>}
                </h3>
                <p className='text-sm font-semibold'>{title}</p>
                <p className="mb-4 text-sm font-normal text-gray-500 dark:text-gray-400">{content}</p>
                <div className="flex h-fit space-x-2 pt-3">
                  <div className="flex">
                    <img className='ml-2 rounded' src="https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?ixlib=rb-1.2.1&auto=format&fit=crop&w=2250&q=80" />
                  </div>
                  <div className="flex">
                    <img className='ml-2 rounded' src="https://images.unsplash.com/photo-1498855926480-d98e83099315?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2250&q=80" />
                  </div>
                  <div className=" flex">
                    <img className='ml-2 rounded' src="https://images.unsplash.com/photo-1492648272180-61e45a8d98a7?ixlib=rb-1.2.1&auto=format&fit=crop&w=2250&q=80" />
                  </div>
                </div>
              </li>
            ))}
          </ol>

          {/* <div className="h-[150px] w-full flex pl-1">
            <div className="h-full w-[2px] bg-white flex justify-between flex-col relative pt-3">
              <div className="ml-2 text-xs space-x-2">
                <span className="absolute w-3 h-3 rounded-full -left-1 border bg-white" />
                <span>15:30</span>
              </div>
              <div className="ml-2 text-xs space-x-2">
                <span className="absolute w-3 h-3 rounded-full -left-1 border bg-white" />
                <span>18:30</span>
              </div>
            </div>
            <div className="py-6 px-3">
              <div className="flex h-fit space-x-2 pt-3">
                <div className="flex">
                  <img className='ml-2 rounded' src="https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?ixlib=rb-1.2.1&auto=format&fit=crop&w=2250&q=80" />
                </div>
                <div className="flex">
                  <img className='ml-2 rounded' src="https://images.unsplash.com/photo-1498855926480-d98e83099315?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2250&q=80" />
                </div>
                <div className=" flex">
                  <img className='ml-2 rounded' src="https://images.unsplash.com/photo-1492648272180-61e45a8d98a7?ixlib=rb-1.2.1&auto=format&fit=crop&w=2250&q=80" />
                </div>
              </div>
              <div className="text-xs ml-3 mt-3">
                Received <span className="text-gray-400">3 images</span> total  <span className="text-gray-400">50.3 MB</span>
              </div>
            </div>
          </div> */}
        </div>
      </div>
      <nav className="rw-button-group">
        <Link
          to={routes.editTimelineSeason({ id: timelineSeason.id })}
          className="rw-button rw-button-blue"
        >
          Edit
        </Link>
        <button
          type="button"
          className="rw-button rw-button-red"
          onClick={() => onDeleteClick(timelineSeason.id)}
        >
          Delete
        </button>
      </nav>
    </>
  )
}

export default TimelineSeason
