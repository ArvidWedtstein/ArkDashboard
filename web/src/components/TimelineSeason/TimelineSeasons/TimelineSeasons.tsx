import { Link, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'
import { QUERY } from 'src/components/TimelineSeason/TimelineSeasonsCell'
import { timeTag, truncate } from 'src/lib/formatters'

import type {
  DeleteTimelineSeasonMutationVariables,
  FindTimelineSeasons,
} from 'types/graphql'

const DELETE_TIMELINE_SEASON_MUTATION = gql`
  mutation DeleteTimelineSeasonMutation($id: String!) {
    deleteTimelineSeason(id: $id) {
      id
    }
  }
`

const TimelineSeasonsList = ({ timelineSeasons }: FindTimelineSeasons) => {
  const [deleteTimelineSeason] = useMutation(DELETE_TIMELINE_SEASON_MUTATION, {
    onCompleted: () => {
      toast.success('TimelineSeason deleted')
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

  const onDeleteClick = (id: DeleteTimelineSeasonMutationVariables['id']) => {
    if (confirm('Are you sure you want to delete timelineSeason ' + id + '?')) {
      deleteTimelineSeason({ variables: { id } })
    }
  }

  const dateformatter = new Intl.DateTimeFormat("en-GB", {
    timeZone: "utc",
    dateStyle: "long",
  })

  const servers = {
    "Elite Ark":
    {
      icon: "https://eliteark.com/wp-content/uploads/2022/06/cropped-0_ark-logo.thumb_.png.36427f75c51aff4ecec55bba50fd194d.png",
      badge: "rw-badge-blue-outline"
    },
    "Bloody Ark": {
      icon: "https://preview.redd.it/cdje2wcsmr521.png?width=313&format=png&auto=webp&s=bf1e8347b8dcd066bcf3aace6a461b61e804570b",
      badge: "rw-badge-red-outline"
    },

    Arkosic: {
      icon: "https://steamuserimages-a.akamaihd.net/ugc/2023839858710970915/3E075CEE248A0C9F9069EC7D12894F597E74A2CF/?imw=200&imh=200&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=true",
      badge: "rw-badge-green-outline"
    }

  };

  return (
    <article className="rw-segment overflow-x-auto">
      {/* <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">TimelineSeasons</h2>
        <Link
          to={routes.newTimelineSeason()}
          className="rw-button rw-button-green"
        >
          <div className="rw-button-icon">+</div> New TimelineSeason
        </Link>
      </header> */}

      <ol className="mx-2 relative border-l border-gray-200 dark:border-zinc-500">
        {timelineSeasons.map(({ id, season, season_start_date, season_end_date, cluster, server, tribe_name }) => (
          <li className="ml-4 not-last:mb-10" key={id}>
            <div className="absolute w-3 h-3  rounded-full mt-1.5 -left-1.5 border border-white dark:border-gray-900 bg-zinc-500"></div>
            <time className="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">{dateformatter.formatRange(new Date(season_start_date), new Date(season_end_date))}</time>
            <div className="items-center block p-3 sm:flex rounded-lg ">
              <img className="w-16 h-16 mb-3 mr-3 rounded-lg sm:mb-0" src={servers[server].icon} alt="image" />
              <div className="text-gray-600 dark:text-gray-300">
                <div className="text-base font-normal">
                  <span className="font-medium text-gray-900 dark:text-white">{server} {cluster && (
                    <span className={`rw-badge ${servers[server].badge}`}>
                      {cluster}
                    </span>
                  )}</span>

                </div>
                <div className="text-sm font-normal">{season && `Season ${season},`} {tribe_name}</div>
                <span className="inline-flex items-center text-xs font-normal text-gray-500 dark:text-gray-400">
                  <svg aria-hidden="true" className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM10 2a8 8 0 100 16 8 8 0 000-16zm0 2c-.076 0-.232.032-.465.262-.238.234-.497.623-.737 1.182-.389.907-.673 2.142-.766 3.556h3.936c-.093-1.414-.377-2.649-.766-3.556-.24-.56-.5-.948-.737-1.182C10.232 4.032 10.076 4 10 4zm3.971 5c-.089-1.546-.383-2.97-.837-4.118A6.004 6.004 0 0115.917 9h-1.946zm-2.003 2H8.032c.093 1.414.377 2.649.766 3.556.24.56.5.948.737 1.182.233.23.389.262.465.262.076 0 .232-.032.465-.262.238-.234.498-.623.737-1.182.389-.907.673-2.142.766-3.556zm1.166 4.118c.454-1.147.748-2.572.837-4.118h1.946a6.004 6.004 0 01-2.783 4.118zm-6.268 0C6.412 13.97 6.118 12.546 6.03 11H4.083a6.004 6.004 0 002.783 4.118z" clip-rule="evenodd"></path></svg>
                  {/* <svg aria-hidden="true" className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clip-rule="evenodd"></path><path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z"></path></svg> */}
                  Public
                </span>
              </div>
            </div>
            <Link to={routes.timelineSeason({ id })} className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:outline-none focus:ring-gray-200 focus:text-blue-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-700">
              Learn more
              <svg className="w-3 h-3 ml-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
            </Link>
          </li>
        ))}
      </ol>


    </article>
  )
}

export default TimelineSeasonsList