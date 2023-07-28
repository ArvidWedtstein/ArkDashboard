import type { FindUserRecipes } from "types/graphql";

import { Link, routes } from "@redwoodjs/router";
import type { CellSuccessProps, CellFailureProps } from "@redwoodjs/web";

import UserRecipes from "src/components/UserRecipe/UserRecipes";
import { ArrayElement } from "src/lib/formatters";

export const QUERY = gql`
  query FindUserRecipes {
    userRecipes {
      id
      created_at
      user_id
      private
      name
      UserRecipeItemRecipe {
        item_recipe_id
        amount
      }
    }
  }
`;

export const Loading = () => (
  <div
    role="status"
    className="flex max-w-sm animate-pulse space-y-3 sm:space-x-3 sm:space-y-0"
  >
    {Array.from(Array(4).keys()).map((_, i) => (
      <div
        className="flex h-32 max-w-fit flex-col items-start justify-between rounded-lg border border-zinc-200 p-4 shadow dark:border-zinc-700"
        key={i}
      >
        <div className="flex w-full flex-row items-start justify-start space-x-3">
          <div className="aspect-square h-12 w-12 rounded bg-zinc-200 p-1 shadow dark:bg-zinc-700">
            <svg
              className="h-full w-full p-1 text-gray-200 dark:text-gray-600"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              fill="currentColor"
              viewBox="0 0 640 512"
            >
              <path d="M480 80C480 35.82 515.8 0 560 0C604.2 0 640 35.82 640 80C640 124.2 604.2 160 560 160C515.8 160 480 124.2 480 80zM0 456.1C0 445.6 2.964 435.3 8.551 426.4L225.3 81.01C231.9 70.42 243.5 64 256 64C268.5 64 280.1 70.42 286.8 81.01L412.7 281.7L460.9 202.7C464.1 196.1 472.2 192 480 192C487.8 192 495 196.1 499.1 202.7L631.1 419.1C636.9 428.6 640 439.7 640 450.9C640 484.6 612.6 512 578.9 512H55.91C25.03 512 .0006 486.1 .0006 456.1L0 456.1z" />
            </svg>
          </div>
          <div className="my-4 h-3 w-full min-w-[10rem] rounded-full bg-zinc-200 dark:bg-zinc-700"></div>
        </div>
        <div className="inline-flex w-full space-x-1">
          <div className="h-2 w-1/3 rounded-full bg-zinc-200 dark:bg-zinc-700"></div>
          <div className="h-2 w-2 rounded-full bg-zinc-200 dark:bg-zinc-700"></div>
          <div className="h-2 w-1/12 rounded-full bg-zinc-200 dark:bg-zinc-700"></div>
        </div>
      </div>
    ))}
    <span className="sr-only">Loading...</span>
  </div>
);

export const Empty = () => {
  return (
    <div className="rw-text-center">
      {"No userRecipes yet. "}
      <Link to={routes.newUserRecipe()} className="rw-link">
        {"Create one?"}
      </Link>
    </div>
  );
};

export const Failure = ({ error }: CellFailureProps) => (
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
interface SuccessProps extends CellSuccessProps<FindUserRecipes> {
  onSelect: (userRecipe: ArrayElement<FindUserRecipes["userRecipes"]>) => void;
}
export const Success = ({ userRecipes, onSelect }: SuccessProps) => {
  return <UserRecipes userRecipes={userRecipes} onSelect={onSelect} />;
};
