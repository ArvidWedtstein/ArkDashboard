import type { FindBasespots } from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

import Basespots from 'src/components/Basespot/Basespots'
import Pagination from 'src/components/Pagination/Pagination';

// export const QUERY = gql`
//   query FindBasespots {
//     basespots {
//       id
//       name
//       description
//       latitude
//       longitude
//       image
//       created_at
//       Map
//       estimatedForPlayers
//       defenseImages
//       created_by
//       turretsetup_image
//       updated_at
//     }
//   }
// `
export const QUERY = gql`
  query FindBasespots($page: Int) {
    basespotPage(page: $page) {
      basespots {
        id
        name
        description
        latitude
        longitude
        image
        created_at
        updated_at
        Map
        estimatedForPlayers
      }
      count
    }
  }
`;
export const beforeQuery = ({ page }) => {
  page = parseInt(page) ? parseInt(page, 10) : 1;

  return { variables: { page } };
};

// export const Loading = () => {
//   return (
//     <div className='w-full h-full flex items-center justify-center '>
//       {/* <span className='w-16 h-16 inline-block rounded-full border-t-4 border-white border-r-2 border-transparent animate-spin'></span> */}
//     </div>
//   )
// }

export const Loading = () => {
  let items = 6
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 mt-8 mb-5">
      {Array.from(Array(items).keys()).map((item) => (
        <div className="border border-blue-300 shadow rounded-md p-4 w-full mx-auto">
          <div className="animate-pulse flex space-x-4">
            <div className="rounded-full bg-slate-700 h-10 w-10"></div>
            <div className="flex-1 space-y-6 py-1">
              <div className="h-2 bg-slate-700 rounded"></div>
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-4">
                  <div className="h-2 bg-slate-700 rounded col-span-2"></div>
                  <div className="h-2 bg-slate-700 rounded col-span-1"></div>
                </div>
                <div className="h-2 bg-slate-700 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      ))
      }
    </div>
  );
};

export const Empty = () => {
  return (
    <div className="rw-text-center">
      {'No basespots yet. '}
      <Link
        to={routes.newBasespot()}
        className="rw-link"
      >
        {'Create one?'}
      </Link>
    </div>
  )
}

export const Failure = ({ error }: CellFailureProps) => (
  <div className="rw-cell-error">{error?.message}</div>
)

// export const Success = ({ basespots }: CellSuccessProps<FindBasespots>) => {
//   return <Basespots basespots={basespots} />
// }

export const Success = ({ basespotPage }: CellSuccessProps<FindBasespots>) => {
  return (
    <>
      {basespotPage.count > 0 ? (
        <>
          <Basespots basespotPage={basespotPage} />
          <Pagination count={basespotPage.count} route={"basespots"} />
        </>
      ) : (
        Empty()
      )}
    </>
  );
};
