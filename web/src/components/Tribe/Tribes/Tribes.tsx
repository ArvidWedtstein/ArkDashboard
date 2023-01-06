import { Link, navigate, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { QUERY } from 'src/components/Tribe/TribesCell'
import { ContextMenu } from 'src/components/Util/ContextMenu/ContextMenu'
import Table from 'src/components/Util/Table/Table'
import { getWeekDates } from 'src/lib/formatters'

import type { DeleteTribeMutationVariables, FindTribes } from 'types/graphql'

const DELETE_TRIBE_MUTATION = gql`
  mutation DeleteTribeMutation($id: Int!) {
    deleteTribe(id: $id) {
      id
    }
  }
`

const TribesList = ({ tribes }: FindTribes) => {
  const [deleteTribe] = useMutation(DELETE_TRIBE_MUTATION, {
    onCompleted: () => {
      toast.success('Tribe deleted')
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

  const onDeleteClick = (id: DeleteTribeMutationVariables['id']) => {
    if (confirm('Are you sure you want to delete tribe ' + id + '?')) {
      deleteTribe({ variables: { id } })
    }
  }
  function filterDatesByCurrentWeek(dates: FindTribes["tribes"]) {
    let [start, end] = getWeekDates();
    return dates.filter(
      (d) => +new Date(d.created_at) >= +start && +new Date(d.created_at) < +end
    );
  }
  const pickRandomTribe = () => {
    let randomTribe = tribes[Math.floor(Math.random() * tribes.length)];
    let tempTribe = tribes.filter((t) => t.id === randomTribe.id);
    toast.success(`You've been assigned to ${tempTribe[0].name}!`);
  };
  return (
    <div className="rw-segment relative">
      <div className="m-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <div className="flex items-start rounded-xl bg-white p-4 shadow-lg">
          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-blue-100 bg-blue-50">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-blue-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
              />
            </svg>
          </div>
          <div className="ml-4">
            <h2 className="font-semibold">
              {filterDatesByCurrentWeek(tribes).length}{" "}
              {filterDatesByCurrentWeek(tribes).length > 1 ? "Tribes" : "Tribe"}
            </h2>
            <p className="mt-2 text-sm text-gray-500">Created this week</p>
          </div>
        </div>
        <div
          className="flex items-start rounded-xl bg-white p-4 shadow-lg"
          onClick={pickRandomTribe}
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-blue-100 bg-blue-50">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 fill-blue-400 text-blue-400"
              viewBox="0 0 512 512"
            >
              <path d="M256 0C114.6 0 0 114.6 0 256s114.6 256 256 256s256-114.6 256-256S397.4 0 256 0zM256 464c-114.7 0-208-93.31-208-208S141.3 48 256 48s208 93.31 208 208S370.7 464 256 464zM256 336c-18 0-32 14-32 32s13.1 32 32 32c17.1 0 32-14 32-32S273.1 336 256 336zM289.1 128h-51.1C199 128 168 159 168 198c0 13 11 24 24 24s24-11 24-24C216 186 225.1 176 237.1 176h51.1C301.1 176 312 186 312 198c0 8-4 14.1-11 18.1L244 251C236 256 232 264 232 272V288c0 13 11 24 24 24S280 301 280 288V286l45.1-28c21-13 34-36 34-60C360 159 329 128 289.1 128z" />
            </svg>
          </div>
          <div className="ml-4">
            <button className="" onClick={pickRandomTribe}>
              Pick random tribe name
            </button>
          </div>
        </div>
      </div>
      {/* TODO: Replace user uuid with user name and profile picture */}
      <Table
        className='m-4'
        data={tribes}
        cols={["name", "description", "created_at", "createdBy", "actions"]}
        renderActions={(row) => (
          <>
            <ContextMenu
            type="click"
              items={[
                {
                  label: 'View',
                  icon: (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M160 256C160 185.3 217.3 128 288 128C358.7 128 416 185.3 416 256C416 326.7 358.7 384 288 384C217.3 384 160 326.7 160 256zM288 336C332.2 336 368 300.2 368 256C368 211.8 332.2 176 288 176C287.3 176 286.7 176 285.1 176C287.3 181.1 288 186.5 288 192C288 227.3 259.3 256 224 256C218.5 256 213.1 255.3 208 253.1C208 254.7 208 255.3 208 255.1C208 300.2 243.8 336 288 336L288 336zM95.42 112.6C142.5 68.84 207.2 32 288 32C368.8 32 433.5 68.84 480.6 112.6C527.4 156 558.7 207.1 573.5 243.7C576.8 251.6 576.8 260.4 573.5 268.3C558.7 304 527.4 355.1 480.6 399.4C433.5 443.2 368.8 480 288 480C207.2 480 142.5 443.2 95.42 399.4C48.62 355.1 17.34 304 2.461 268.3C-.8205 260.4-.8205 251.6 2.461 243.7C17.34 207.1 48.62 156 95.42 112.6V112.6zM288 80C222.8 80 169.2 109.6 128.1 147.7C89.6 183.5 63.02 225.1 49.44 256C63.02 286 89.6 328.5 128.1 364.3C169.2 402.4 222.8 432 288 432C353.2 432 406.8 402.4 447.9 364.3C486.4 328.5 512.1 286 526.6 256C512.1 225.1 486.4 183.5 447.9 147.7C406.8 109.6 353.2 80 288 80V80z" /></svg>),
                  onClick: () => {
                    navigate(routes.tribe({ id: row["id"] }))
                  }
                },
                {
                  label: 'Edit',
                  icon: (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M373.1 24.97C401.2-3.147 446.8-3.147 474.9 24.97L487 37.09C515.1 65.21 515.1 110.8 487 138.9L289.8 336.2C281.1 344.8 270.4 351.1 258.6 354.5L158.6 383.1C150.2 385.5 141.2 383.1 135 376.1C128.9 370.8 126.5 361.8 128.9 353.4L157.5 253.4C160.9 241.6 167.2 230.9 175.8 222.2L373.1 24.97zM440.1 58.91C431.6 49.54 416.4 49.54 407 58.91L377.9 88L424 134.1L453.1 104.1C462.5 95.6 462.5 80.4 453.1 71.03L440.1 58.91zM203.7 266.6L186.9 325.1L245.4 308.3C249.4 307.2 252.9 305.1 255.8 302.2L390.1 168L344 121.9L209.8 256.2C206.9 259.1 204.8 262.6 203.7 266.6zM200 64C213.3 64 224 74.75 224 88C224 101.3 213.3 112 200 112H88C65.91 112 48 129.9 48 152V424C48 446.1 65.91 464 88 464H360C382.1 464 400 446.1 400 424V312C400 298.7 410.7 288 424 288C437.3 288 448 298.7 448 312V424C448 472.6 408.6 512 360 512H88C39.4 512 0 472.6 0 424V152C0 103.4 39.4 64 88 64H200z" /></svg>),
                  onClick: () => {
                    navigate(routes.editTribe({ id: row["id"] }))
                  }
                },
                {
                  label: 'Delete',
                  icon: (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M160 400C160 408.8 152.8 416 144 416C135.2 416 128 408.8 128 400V192C128 183.2 135.2 176 144 176C152.8 176 160 183.2 160 192V400zM240 400C240 408.8 232.8 416 224 416C215.2 416 208 408.8 208 400V192C208 183.2 215.2 176 224 176C232.8 176 240 183.2 240 192V400zM320 400C320 408.8 312.8 416 304 416C295.2 416 288 408.8 288 400V192C288 183.2 295.2 176 304 176C312.8 176 320 183.2 320 192V400zM317.5 24.94L354.2 80H424C437.3 80 448 90.75 448 104C448 117.3 437.3 128 424 128H416V432C416 476.2 380.2 512 336 512H112C67.82 512 32 476.2 32 432V128H24C10.75 128 0 117.3 0 104C0 90.75 10.75 80 24 80H93.82L130.5 24.94C140.9 9.357 158.4 0 177.1 0H270.9C289.6 0 307.1 9.358 317.5 24.94H317.5zM151.5 80H296.5L277.5 51.56C276 49.34 273.5 48 270.9 48H177.1C174.5 48 171.1 49.34 170.5 51.56L151.5 80zM80 432C80 449.7 94.33 464 112 464H336C353.7 464 368 449.7 368 432V128H80V432z" /></svg>),
                  onClick: () => {
                    onDeleteClick(row["id"])
                  }
                }
              ]}>
              <svg className="w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                <path d="M120 256c0 30.9-25.1 56-56 56s-56-25.1-56-56s25.1-56 56-56s56 25.1 56 56zm160 0c0 30.9-25.1 56-56 56s-56-25.1-56-56s25.1-56 56-56s56 25.1 56 56zm104 56c-30.9 0-56-25.1-56-56s25.1-56 56-56s56 25.1 56 56s-25.1 56-56 56z" />
              </svg>
            </ContextMenu>
          </>
        )}
      />
    </div>
  )
}

export default TribesList
