import type { FindLootcrates } from "types/graphql";

import { Link, routes } from "@redwoodjs/router";
import type { CellSuccessProps, CellFailureProps } from "@redwoodjs/web";

import Lootcrates from "src/components/Lootcrate/Lootcrates";

export const QUERY = gql`
  query FindLootcrates(
    $map: String
    $search: String
    $type: String
    $color: String
  ) {
    lootcratesByMap(map: $map, search: $search, type: $type, color: $color) {
      id
      name
      blueprint
      required_level
      color
      image
      type
    }
    maps {
      id
      name
      icon
    }
  }
`;

export const Loading = () => (
  <div
    role="status"
    className="w-full animate-pulse overflow-hidden p-4 md:p-6"
  >
    <div className="mb-4 h-5 w-48 rounded-full bg-zinc-200 dark:bg-zinc-700" />
    <div className="ml-auto mb-3 flex justify-end space-x-5">
      <div className="h-4 w-48 rounded-full bg-zinc-200 dark:bg-zinc-700" />
      <div className="h-4 w-24 rounded-full bg-zinc-200 dark:bg-zinc-700" />
      <div className="h-4 w-60 rounded-full bg-zinc-200 dark:bg-zinc-700" />
      <div className="h-4 w-28 rounded-full bg-zinc-200 dark:bg-zinc-700" />
    </div>

    <div className="h-0.5 w-full bg-zinc-200 dark:bg-zinc-700" />

    <div className="mt-3 grid w-full grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
      <div className="flex flex-col space-y-5">
        <div className="flex justify-between border-t border-zinc-500 py-5">
          <div className="h-2 w-20 rounded-full bg-zinc-200 dark:bg-zinc-700" />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 500 500"
            className="h-4 w-4 fill-zinc-200 dark:fill-zinc-600"
          >
            <path d="M432 256C432 264.8 424.8 272 416 272h-176V448c0 8.844-7.156 16.01-16 16.01S208 456.8 208 448V272H32c-8.844 0-16-7.15-16-15.99C16 247.2 23.16 240 32 240h176V64c0-8.844 7.156-15.99 16-15.99S240 55.16 240 64v176H416C424.8 240 432 247.2 432 256z" />
          </svg>
        </div>
        <div className="flex justify-between border-t border-zinc-500 py-5">
          <div className="h-2 w-20 rounded-full bg-zinc-200 dark:bg-zinc-700" />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 500 500"
            className="h-4 w-4 fill-zinc-200 dark:fill-zinc-600"
          >
            <path d="M432 256C432 264.8 424.8 272 416 272h-176V448c0 8.844-7.156 16.01-16 16.01S208 456.8 208 448V272H32c-8.844 0-16-7.15-16-15.99C16 247.2 23.16 240 32 240h176V64c0-8.844 7.156-15.99 16-15.99S240 55.16 240 64v176H416C424.8 240 432 247.2 432 256z" />
          </svg>
        </div>
        <div className="flex justify-between border-t border-zinc-500 py-5">
          <div className="h-2 w-20 rounded-full bg-zinc-200 dark:bg-zinc-700" />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 500 500"
            className="h-4 w-4 fill-zinc-200 dark:fill-zinc-600"
          >
            <path d="M432 256C432 264.8 424.8 272 416 272h-176V448c0 8.844-7.156 16.01-16 16.01S208 456.8 208 448V272H32c-8.844 0-16-7.15-16-15.99C16 247.2 23.16 240 32 240h176V64c0-8.844 7.156-15.99 16-15.99S240 55.16 240 64v176H416C424.8 240 432 247.2 432 256z" />
          </svg>
        </div>
      </div>
      <div className="grid w-full grid-cols-1 gap-6 lg:col-span-3 lg:grid-cols-2 xl:grid-cols-3">
        <div className="h-48 w-full rounded-lg bg-zinc-200 dark:bg-zinc-700" />
        <div className="h-48 w-full rounded-lg bg-zinc-200 dark:bg-zinc-700" />
        <div className="h-48 w-full rounded-lg bg-zinc-200 dark:bg-zinc-700" />
        <div className="h-48 w-full rounded-lg bg-zinc-200 dark:bg-zinc-700" />
        <div className="h-48 w-full rounded-lg bg-zinc-200 dark:bg-zinc-700" />
        <div className="h-48 w-full rounded-lg bg-zinc-200 dark:bg-zinc-700" />
        <div className="h-48 w-full rounded-lg bg-zinc-200 dark:bg-zinc-700" />
        <div className="h-48 w-full rounded-lg bg-zinc-200 dark:bg-zinc-700" />
        <div className="h-48 w-full rounded-lg bg-zinc-200 dark:bg-zinc-700" />
      </div>
    </div>
    <span className="sr-only">Loading...</span>
  </div>
);

export const Empty = () => {
  return (
    <div className="text-center text-black dark:text-white">
      {"No lootcrates yet. "}
      <Link to={routes.newLootcrate()} className="rw-link">
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

export const Success = ({
  lootcratesByMap,
  maps,
}: CellSuccessProps<FindLootcrates>) => {
  return <Lootcrates lootcratesByMap={lootcratesByMap} maps={maps} />;
};
