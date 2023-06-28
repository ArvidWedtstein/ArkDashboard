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
      <div className="rw-segment">
        <header className="rw-segment-header">
          <h2 className="rw-heading rw-heading-secondary">
            TimelineSeason {timelineSeason.id} Detail
          </h2>
        </header>

        <div className='grid grid-cols-4 gap-3 mb-3'>


          <div className="flex h-full justify-between">
            <button
              className={"group relative flex h-auto w-full overflow-hidden rounded-xl"}
            // onClick={() => {
            //   setCurrentModalImage(
            //     `https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/timelineimages/${timelineBasespot.id}/${img.name}`
            //   );
            //   setIsComponentVisible(true);
            //   setIsRaided(false);
            // }}
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
                Ragnarok
              </span>
            </button>
          </div>
        </div>
        {/*
        <table className="rw-table">
          <tbody>
            <tr>
              <th>Id</th>
              <td>{timelineSeason.id}</td>
            </tr>
            <tr>
              <th>Created at</th>
              <td>{timeTag(timelineSeason.created_at)}</td>
            </tr>
            <tr>
              <th>Updated at</th>
              <td>{timeTag(timelineSeason.updated_at)}</td>
            </tr>
            <tr>
              <th>Server</th>
              <td>{timelineSeason.server}</td>
            </tr>
            <tr>
              <th>Season</th>
              <td>{timelineSeason.season}</td>
            </tr>
            <tr>
              <th>Tribe name</th>
              <td>{timelineSeason.tribe_name}</td>
            </tr>
            <tr>
              <th>Season start date</th>
              <td>{timeTag(timelineSeason.season_start_date)}</td>
            </tr>
            <tr>
              <th>Season end date</th>
              <td>{timeTag(timelineSeason.season_end_date)}</td>
            </tr>
            <tr>
              <th>Cluster</th>
              <td>{timelineSeason.cluster}</td>
            </tr>
            <tr>
              <th>Timeline id</th>
              <td>{timelineSeason.timeline_id}</td>
            </tr>
          </tbody>
        </table> */}
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
