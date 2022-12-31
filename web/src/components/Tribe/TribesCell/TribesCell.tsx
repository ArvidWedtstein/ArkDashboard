import type { FindTribes } from "types/graphql";

import { Link, routes } from "@redwoodjs/router";
import type { CellSuccessProps, CellFailureProps } from "@redwoodjs/web";

import Tribes from "src/components/Tribe/Tribes";
import { useAuth } from "@redwoodjs/auth";
import Pagination from "src/components/Pagination/Pagination";

export const QUERY = gql`
  query FindTribes {
    tribes {
      id
      name
      description
      createdAt
      updatedAt
      createdBy
    }
  }
`;

// export const QUERY = gql`
//   query FindTribes($page: Int) {
//     tribePage(page: $page) {
//       tribes {
//         id
//         name
//         description
//         createdAt
//         updatedAt
//         createdBy
//       }
//       count
//     }
//   }
// `;
// export const beforeQuery = ({ page }) => {
//   page = page ? parseInt(page, 10) : 1

//   return { variables: { page } }
// }
export const Loading = () => (
  <div className="text-center">
    <div className="spinner-border" role="status">
      <span className="sr-only">Loading...</span>
    </div>
  </div>
);

export const Empty = () => {
  return (
    <div className="text-center h-full">
      {"No tribes yet. "}
      <Link to={routes.newTribe()} className="rw-link">
        {"Create one?"}
      </Link>
    </div>
  );
};

export const Failure = ({ error }: CellFailureProps) => (
  <div className="rw-cell-error">{error?.message}</div>
);

// export const Success = ({ tribePage }: CellSuccessProps<FindTribes>) => {
//   console.log(tribePage)
//   return (
//     <>
//       <Tribes tribePage={tribePage} />;

//       <Pagination count={tribePage.count} route={"tribes"} />
//     </>
//   )
// };
export const Success = ({ tribes }: CellSuccessProps<FindTribes>) => {
  return <Tribes tribes={tribes} />;
};
