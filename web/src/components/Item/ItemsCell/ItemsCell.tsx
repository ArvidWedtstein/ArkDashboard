import type { FindItems } from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

import Items from 'src/components/Item/Items'
import Pagination from 'src/components/Util/Pagination/Pagination';

// export const QUERY = gql`
//   query FindItems {
//     items {
//       id
//       created_at
//       name
//       description
//       image
//       max_stack
//       weight
//       engram_points
//       crafting_time
//       req_level
//       yields
//       recipe
//       stats
//       color
//       crafted_in
//       effects
//       type
//     }
//   }
// `
export const QUERY = gql`
  query FindItems($page: Int) {
    itemsPage(page: $page) {
        items {
          id
          created_at
          name
          description
          image
          max_stack
          weight
          engram_points
          crafting_time
          req_level
          yields
          recipe
          stats
          color
          crafted_in
          effects
          type
      }
      count
    }
  }
`;
export const beforeQuery = ({ page }) => {
  page = parseInt(page) ? parseInt(page, 10) : 1;

  return { variables: { page } };
};

export const Loading = () => <div>Loading...</div>

export const Empty = () => {
  return (
    <div className="rw-text-center">
      {'No items yet. '}
      <Link
        to={routes.newItem()}
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

export const Success = ({ itemsPage }: CellSuccessProps<FindItems>) => {
  return itemsPage.count > 0 ? (
    <>
      <Items items={itemsPage.items} />
      <Pagination count={itemsPage.count} route={"items"} />
    </>
  ) : (
    Empty()
  )
}

// export const Success = ({ items }: CellSuccessProps<FindItems>) => {

//   return <Items items={items} />
// }
