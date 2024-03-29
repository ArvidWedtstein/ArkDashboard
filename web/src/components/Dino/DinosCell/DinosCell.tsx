import type { FindDinos } from "types/graphql";

import { Link, routes } from "@redwoodjs/router";
import type { CellSuccessProps, CellFailureProps } from "@redwoodjs/web";

import Dinos from "src/components/Dino/Dinos";
import Pagination from "src/components/Util/Pagination/Pagination";
import Button from "src/components/Util/Button/Button";
import { Fragment } from "react";

export const QUERY = gql`
  query FindDinos($page: Int, $search: String, $type: String, $diet: String, $temperament: String) {
    dinosPage(page: $page, search: $search, type: $type, diet: $diet, temperament: $temperament) {
      dinos {
        id
        name
        description
        type
        tamable
        temperament
        image
        icon
      }
      diets
      temperaments
      count
    }
  }
`;

export const beforeQuery = ({ page, search, type, diet, temperament }) => {
  page = parseInt(page) ? parseInt(page, 10) : 1;
  return { variables: { page, search, type, diet, temperament } };
};

// TODO: fix
export const Loading = () => (
  <div role="status" className="w-full animate-pulse">
    <div className="h-12 bg-zinc-200 rounded-lg dark:bg-zinc-700 w-full mb-3"></div>
    <div className="3xl:grid-cols-6 grid grid-cols-1 gap-3 md:grid-cols-3 xl:grid-cols-4">
      <div className="h-96 bg-zinc-200 rounded-lg dark:bg-zinc-700 w-full"></div>
      <div className="h-96 bg-zinc-200 rounded-lg dark:bg-zinc-700 w-full"></div>
      <div className="h-96 bg-zinc-200 rounded-lg dark:bg-zinc-700 w-full"></div>
      <div className="h-96 bg-zinc-200 rounded-lg dark:bg-zinc-700 w-full"></div>
      <div className="h-96 bg-zinc-200 rounded-lg dark:bg-zinc-700 w-full"></div>
      <div className="h-96 bg-zinc-200 rounded-lg dark:bg-zinc-700 w-full"></div>
      <div className="h-96 bg-zinc-200 rounded-lg dark:bg-zinc-700 w-full"></div>
      <div className="h-96 bg-zinc-200 rounded-lg dark:bg-zinc-700 w-full"></div>
      <div className="h-96 bg-zinc-200 rounded-lg dark:bg-zinc-700 w-full"></div>
      <div className="h-96 bg-zinc-200 rounded-lg dark:bg-zinc-700 w-full"></div>
      <div className="h-96 bg-zinc-200 rounded-lg dark:bg-zinc-700 w-full"></div>
      <div className="h-96 bg-zinc-200 rounded-lg dark:bg-zinc-700 w-full"></div>
    </div>
    <span className="sr-only">Loading...</span>
  </div>
);

export const Empty = () => {
  return (
    <div className="text-center text-black dark:text-white">
      {"No dinos yet. "}
      <Button
        variant="text"
        color="primary"
        to={routes.newDino()}
      >
        {'Create one?'}
      </Button>
    </div>
  );
};

export const Failure = ({ error }: CellFailureProps) => {
  return (
    <div className="rw-cell-error flex items-center space-x-3">
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

export const Success = ({ dinosPage, queryResult, updating }: CellSuccessProps<FindDinos>) => {
  return (
    <Fragment>
      <Dinos dinosPage={dinosPage} loading={updating} />
      <Pagination count={dinosPage.count} route={"dinos"} />
    </Fragment>
  )
};
