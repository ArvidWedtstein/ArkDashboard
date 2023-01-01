import type { FindBasespots } from "types/graphql";

import { Link, Router, routes } from "@redwoodjs/router";
import type { CellSuccessProps, CellFailureProps } from "@redwoodjs/web";

import Basespots from "src/components/Basespot/Basespots";
import SkeletonCard from "src/components/Util/SkeletonCard/SkeletonCard";
import Pagination from "src/components/Pagination/Pagination";

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
//     }
//   }
// `;
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
  page = page ? parseInt(page, 10) : 1;

  return { variables: { page } };
};
export const Loading = () => {
  return (
    <div className="mb-5 grid grid-cols-2 gap-5">
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
    </div>
  );
};

export const Empty = () => {
  return (
    <div className="rw-text-center">
      {"No basespots yet. "}
      <Link to={routes.newBasespot()} className="rw-link">
        {"Create one?"}
      </Link>
    </div>
  );
};

export const Failure = ({ error }: CellFailureProps) => (
  <>
    <div className="rw-cell-error">{error?.message}</div>
  </>
);

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
