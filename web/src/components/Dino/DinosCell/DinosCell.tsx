import type { FindDinos } from "types/graphql";

import { Link, routes } from "@redwoodjs/router";
import type { CellSuccessProps, CellFailureProps } from "@redwoodjs/web";

import Dinos from "src/components/Dino/Dinos";
import Pagination from "src/components/Util/Pagination/Pagination";

export const QUERY = gql`
  query FindDinos($page: Int, $search: String, $category: String) {
    dinosPage(page: $page, search: $search, category: $category) {
      dinos {
        id
        name
        description
        type
        image
      }
      count
    }
  }
`;

export const beforeQuery = ({ page, search, category }) => {
  page = parseInt(page) ? parseInt(page, 10) : 1;
  return { variables: { page, search, category } };
};

export const Loading = () => (
  <div className="border-pea-300 mx-auto w-full rounded-md border p-4 shadow">
    <div className="flex animate-pulse space-x-4">
      <div className="bg-pea-600 h-10 w-10 rounded-full"></div>
      <div className="flex-1 space-y-6 py-1">
        <div className="bg-pea-600 h-2 rounded"></div>
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-pea-600 col-span-2 h-2 rounded"></div>
            <div className="bg-pea-600 col-span-1 h-2 rounded"></div>
          </div>
          <div className="bg-pea-600 h-2 rounded"></div>
        </div>
      </div>
    </div>
  </div>
);

export const Empty = () => {
  return (
    <div className="rw-text-center">
      {"No dinos yet. "}
      <Link to={routes.newDino()} className="rw-link">
        {"Create one?"}
      </Link>
    </div>
  );
};

export const Failure = ({ error }: CellFailureProps) => {
  return (
    <div className="rw-cell-error animate-fly-in flex items-center space-x-3">
      <svg
        className="h-12 w-12 fill-current"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 512 512"
      >
        <path d="M256 304c4.406 0 8-3.578 8-8v-176c0-4.422-3.594-8-8-8S248 115.6 248 120v176C248 300.4 251.6 304 256 304zM256 352c-8.836 0-16 7.164-16 16S247.2 384 256 384s16-7.164 16-16S264.8 352 256 352zM256 0C114.6 0 0 114.6 0 256s114.6 256 256 256s256-114.6 256-256S397.4 0 256 0zM256 496c-132.3 0-240-107.7-240-240S123.7 16 256 16s240 107.7 240 240S388.3 496 256 496z" />
      </svg>
      <div className="flex flex-col">
        <p className="text-lg font-bold leading-snug">
          Some unexpected shit happend
        </p>
        <p className="text-sm">{error?.message}</p>
      </div>
    </div>
  );
};

export const Success = ({ dinosPage }: CellSuccessProps<FindDinos>) => {
  return dinosPage.count > 0 ? (
    <>
      <Dinos dinosPage={dinosPage} />
      <Pagination count={dinosPage.count} route={"dinos"} />
    </>
  ) : (
    Empty()
  );
};
