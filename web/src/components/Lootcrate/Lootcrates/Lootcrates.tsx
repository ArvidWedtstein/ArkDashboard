import { Link, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { QUERY } from 'src/components/Lootcrate/LootcratesCell'
import {
  checkboxInputTag,
  jsonTruncate,
  timeTag,
  truncate,
} from 'src/lib/formatters'
import Toast from 'src/components/Util/Toast/Toast'

import type {
  DeleteLootcrateMutationVariables,
  FindLootcrates,
} from 'types/graphql'
import clsx from 'clsx'

const DELETE_LOOTCRATE_MUTATION = gql`
  mutation DeleteLootcrateMutation($id: BigInt!) {
    deleteLootcrate(id: $id) {
      id
    }
  }
`

const LootcratesList = ({ lootcrates }: FindLootcrates) => {
  const [deleteLootcrate] = useMutation(DELETE_LOOTCRATE_MUTATION, {
    onCompleted: () => {
      toast.success('Lootcrate deleted')
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

  const onDeleteClick = (id: DeleteLootcrateMutationVariables['id']) => {
    toast.custom(
      (t) => (
        <Toast
          t={t}
          title={`You are about to delete lootcrate`}
          message={`Are you sure you want to delete lootcrate ${id}?`}
          actionType="YesNo"
          primaryAction={() => deleteLootcrate({ variables: { id } })}
        />
      ),
      { position: 'top-center' }
    )
  }

  return (
    <div className="rw-segment rw-table-wrapper-responsive">
      <ul
        className={`test grid grid-cols-9 w-full bg-[#b7ccc3] bg-[length:calc(200%_/_9)]`}
        style={{
          backgroundImage: `url("data:image/svg+xml;charset=utf8,%3Csvg viewBox='0 0 600 1040' xmlns='http://www.w3.org/2000/svg' fill-rule='evenodd' clip-rule='evenodd' stroke-linejoin='round' stroke-miterlimit='2'%3E%3Cpath d='M0 0l300 173.205v346.41L0 346.41V0z' fill='url(%23_Linear1)'/%3E%3Cpath d='M300 519.615L600 692.82v346.411L300 866.025v-346.41z' fill='url(%23_Linear2)'/%3E%3Cpath d='M600 0L300 173.205v346.41L600 346.41V0z' fill='url(%23_Linear3)'/%3E%3Cpath d='M300 519.615L0 692.82v346.411l300-173.206v-346.41z' fill='url(%23_Linear4)'/%3E%3Cdefs%3E%3ClinearGradient id='_Linear1' x1='0' y1='0' x2='1' y2='0' gradientUnits='userSpaceOnUse' gradientTransform='rotate(-30 646.41 173.205) scale(346.41)'%3E%3Cstop offset='0' stop-color='%23b7ccc3'/%3E%3Cstop offset='1' stop-color='%23cde2d9'/%3E%3C/linearGradient%3E%3ClinearGradient id='_Linear2' x1='0' y1='0' x2='1' y2='0' gradientUnits='userSpaceOnUse' gradientTransform='rotate(-30 1766.025 -126.796) scale(346.41)'%3E%3Cstop offset='0' stop-color='%23b7ccc3'/%3E%3Cstop offset='1' stop-color='%23cde2d9'/%3E%3C/linearGradient%3E%3ClinearGradient id='_Linear3' x1='0' y1='0' x2='1' y2='0' gradientUnits='userSpaceOnUse' gradientTransform='rotate(-150 346.41 92.82) scale(346.41)'%3E%3Cstop offset='0' stop-color='%23e8dad1'/%3E%3Cstop offset='1' stop-color='%23fff0e7'/%3E%3C/linearGradient%3E%3ClinearGradient id='_Linear4' x1='0' y1='0' x2='1' y2='0' gradientUnits='userSpaceOnUse' gradientTransform='rotate(-150 266.025 392.82) scale(346.41)'%3E%3Cstop offset='0' stop-color='%23e8dad1'/%3E%3Cstop offset='1' stop-color='%23fff0e7'/%3E%3C/linearGradient%3E%3C/defs%3E%3C/svg%3E")`,
        }}
      >
        {lootcrates.map((lootcrate) => (
          <li
            className={"relative col-end-[span_2] [&:nth-child(8n-7)]:col-start-2 pb-[86.6%]"}
            key={lootcrate.id}
          >
            <div className='absolute w-1/2 mt-[14%] transform-gpu -skew-y-[30deg] p-3 font-montserrat'>
              <h2 className='text-md md:text-xl'>{lootcrate.name}</h2>
              <p className='text-lg md:text-3xl'>LVL {lootcrate.required_level}</p>
            </div>
            <img
              className={clsx(`duration-300 hover:bottom-0 absolute left-1/2 w-1/2 -bottom-3.5 -translate-x-1/2 transition-all`)}
              src='https://static.wikia.nocookie.net/arksurvivalevolved_gamepedia/images/5/52/White_Beacon.png'
              alt=''
              style={{
                filter: `drop-shadow(0 80px 30px ${lootcrate.color || '#FF0000'}33)`
              }}
            />
          </li>
        ))}
      </ul>
      <table className="rw-table">
        <thead>
          <tr>
            <th>Id</th>
            <th>Name</th>
            <th>Required level</th>
            <th>Repeat in sets</th>
            <th>Color</th>
            <th>&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          {lootcrates.map((lootcrate) => (
            <tr key={lootcrate.id}>
              <td>{truncate(lootcrate.id)}</td>
              <td>{truncate(lootcrate.name)}</td>
              <td>{truncate(lootcrate.required_level)}</td>
              <td>{checkboxInputTag(lootcrate.repeat_in_sets)}</td>
              <td>{truncate(lootcrate.color)}</td>
              <td>
                <nav className="rw-table-actions">
                  <Link
                    to={routes.lootcrate({ id: lootcrate.id })}
                    title={'Show lootcrate ' + lootcrate.id + ' detail'}
                    className="rw-button rw-button-small"
                  >
                    Show
                  </Link>
                  <Link
                    to={routes.editLootcrate({ id: lootcrate.id })}
                    title={'Edit lootcrate ' + lootcrate.id}
                    className="rw-button rw-button-small rw-button-blue"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 512 512"
                      className="rw-button-icon-start"
                    >
                      <path d="M493.2 56.26l-37.51-37.51C443.2 6.252 426.8 0 410.5 0c-16.38 0-32.76 6.25-45.26 18.75L45.11 338.9c-8.568 8.566-14.53 19.39-17.18 31.21l-27.61 122.8C-1.7 502.1 6.158 512 15.95 512c1.047 0 2.116-.1034 3.198-.3202c0 0 84.61-17.95 122.8-26.93c11.54-2.717 21.87-8.523 30.25-16.9l321.2-321.2C518.3 121.7 518.2 81.26 493.2 56.26zM149.5 445.2c-4.219 4.219-9.252 7.039-14.96 8.383c-24.68 5.811-69.64 15.55-97.46 21.52l22.04-98.01c1.332-5.918 4.303-11.31 8.594-15.6l247.6-247.6l82.76 82.76L149.5 445.2zM470.7 124l-50.03 50.02l-82.76-82.76l49.93-49.93C393.9 35.33 401.9 32 410.5 32s16.58 3.33 22.63 9.375l37.51 37.51C483.1 91.37 483.1 111.6 470.7 124z" />
                    </svg>
                    Edit
                  </Link>
                  <button
                    type="button"
                    title={'Delete lootcrate ' + lootcrate.id}
                    className="rw-button rw-button-small rw-button-red"
                    onClick={() => onDeleteClick(lootcrate.id)}
                  >
                    Delete
                  </button>
                </nav>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default LootcratesList
