import type { FindTribes } from "types/graphql";

import { Link, routes } from "@redwoodjs/router";
import type { CellSuccessProps, CellFailureProps } from "@redwoodjs/web";

import Tribes from "src/components/Tribe/Tribes";
import { toast } from "@redwoodjs/web/dist/toast";

export const QUERY = gql`
  query FindTribes {
    tribes {
      id
      name
      created_at
      updated_at
      created_by
      Profile {
        id
        full_name
        avatar_url
      }
    }
  }
`;

export const Loading = () => (
  <div role="status" className="animate-pulse shadow">
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <div className="flex items-start justify-start space-x-4 rounded-lg bg-zinc-300 p-4 dark:bg-zinc-700">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 448 512"
          className="h-12 w-12 rounded-full bg-zinc-200 p-3 text-zinc-200 dark:bg-zinc-600 dark:text-zinc-700"
          fill="currentColor"
        >
          <path d="M432 256C432 264.8 424.8 272 416 272h-176V448c0 8.844-7.156 16.01-16 16.01S208 456.8 208 448V272H32c-8.844 0-16-7.15-16-15.99C16 247.2 23.16 240 32 240h176V64c0-8.844 7.156-15.99 16-15.99S240 55.16 240 64v176H416C424.8 240 432 247.2 432 256z" />
        </svg>
        <div className="h-2.5 w-48 rounded-full bg-zinc-200 dark:bg-zinc-600" />
      </div>
      <div className="flex items-start justify-start space-x-4 rounded-lg bg-zinc-300 p-4 dark:bg-zinc-700">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 320 512"
          className="h-12 w-12 rounded-full bg-zinc-200 p-3 text-zinc-200 dark:bg-zinc-600 dark:text-zinc-700"
          fill="currentColor"
        >
          <path d="M213.1 32H106.7C47.84 32 0 79.84 0 138.7V160c0 8.844 7.156 16 16 16S32 168.9 32 160V138.7C32 97.48 65.5 64 106.7 64h106.5C254.4 64 288 97.58 288 138.9c0 27-14.62 52-38.16 65.25L152.5 258.9C137.4 267.4 128 283.4 128 300.7V336c0 8.844 7.156 16.01 16 16.01S160 344.8 160 336V300.7c0-5.766 3.125-11.11 8.156-13.95l97.38-54.78C299.1 213.1 320 177.4 320 138.9C320 79.94 272.1 32 213.1 32zM144 400c-17.67 0-32 14.32-32 31.99s14.33 32 32 32s32-14.33 32-32S161.7 400 144 400z" />
        </svg>
        <div className="h-2.5 w-48 rounded-full bg-zinc-200 dark:bg-zinc-600" />
      </div>
      <div className="flex items-start justify-start space-x-4 rounded-lg bg-zinc-300 p-4 dark:bg-zinc-700">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-12 w-12 rounded-full bg-zinc-200 p-3 text-zinc-200 dark:bg-zinc-600 dark:text-zinc-700"
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
        <div className="h-2.5 w-48 rounded-full bg-zinc-200 dark:bg-zinc-600" />
      </div>
    </div>
    <div className="my-3 flex space-x-3">
      <div className="h-12 w-16 rounded-lg bg-zinc-200 dark:bg-zinc-700"></div>
      <div className="h-12 w-64 rounded-lg bg-zinc-200 dark:bg-zinc-700"></div>
    </div>
    <div className="divide-y divide-zinc-200 rounded border border-zinc-200 shadow dark:divide-zinc-700 dark:border-zinc-700">
      <div className="flex items-center justify-between p-4">
        <div className="h-2.5 w-80 rounded-full bg-zinc-300 dark:bg-zinc-600" />
        <div className="h-2.5 w-40 rounded-full bg-zinc-300 dark:bg-zinc-600" />
        <div className="h-2.5 w-40 rounded-full bg-zinc-300 dark:bg-zinc-600" />
        <div className="h-2.5 w-6 rounded-full bg-zinc-300 dark:bg-zinc-600" />
      </div>
      <div className="flex items-center justify-between p-4">
        <div className="h-2.5 w-80 rounded-full bg-zinc-300 dark:bg-zinc-600" />
        <div className="h-2.5 w-40 rounded-full bg-zinc-300 dark:bg-zinc-600" />
        <div className="h-2.5 w-40 rounded-full bg-zinc-300 dark:bg-zinc-600" />
        <div className="h-2.5 w-6 rounded-full bg-zinc-300 dark:bg-zinc-600" />
      </div>
      <div className="flex items-center justify-between p-4">
        <div className="h-2.5 w-80 rounded-full bg-zinc-300 dark:bg-zinc-600" />
        <div className="h-2.5 w-40 rounded-full bg-zinc-300 dark:bg-zinc-600" />
        <div className="h-2.5 w-40 rounded-full bg-zinc-300 dark:bg-zinc-600" />
        <div className="h-2.5 w-6 rounded-full bg-zinc-300 dark:bg-zinc-600" />
      </div>
      <div className="flex items-center justify-between p-4">
        <div className="h-2.5 w-80 rounded-full bg-zinc-300 dark:bg-zinc-600" />
        <div className="h-2.5 w-40 rounded-full bg-zinc-300 dark:bg-zinc-600" />
        <div className="h-2.5 w-40 rounded-full bg-zinc-300 dark:bg-zinc-600" />
        <div className="h-2.5 w-6 rounded-full bg-zinc-300 dark:bg-zinc-600" />
      </div>
      <div className="flex items-center justify-between p-4">
        <div className="h-2.5 w-80 rounded-full bg-zinc-300 dark:bg-zinc-600" />
        <div className="h-2.5 w-40 rounded-full bg-zinc-300 dark:bg-zinc-600" />
        <div className="h-2.5 w-40 rounded-full bg-zinc-300 dark:bg-zinc-600" />
        <div className="h-2.5 w-6 rounded-full bg-zinc-300 dark:bg-zinc-600" />
      </div>
      <div className="flex items-center justify-between p-4">
        <div className="h-2.5 w-80 rounded-full bg-zinc-300 dark:bg-zinc-600" />
        <div className="h-2.5 w-40 rounded-full bg-zinc-300 dark:bg-zinc-600" />
        <div className="h-2.5 w-40 rounded-full bg-zinc-300 dark:bg-zinc-600" />
        <div className="h-2.5 w-6 rounded-full bg-zinc-300 dark:bg-zinc-600" />
      </div>
      <div className="flex items-center justify-between p-4">
        <div className="h-2.5 w-80 rounded-full bg-zinc-300 dark:bg-zinc-600" />
        <div className="h-2.5 w-40 rounded-full bg-zinc-300 dark:bg-zinc-600" />
        <div className="h-2.5 w-40 rounded-full bg-zinc-300 dark:bg-zinc-600" />
        <div className="h-2.5 w-6 rounded-full bg-zinc-300 dark:bg-zinc-600" />
      </div>
      <div className="flex items-center justify-between p-4">
        <div className="h-2.5 w-80 rounded-full bg-zinc-300 dark:bg-zinc-600" />
        <div className="h-2.5 w-40 rounded-full bg-zinc-300 dark:bg-zinc-600" />
        <div className="h-2.5 w-40 rounded-full bg-zinc-300 dark:bg-zinc-600" />
        <div className="h-2.5 w-6 rounded-full bg-zinc-300 dark:bg-zinc-600" />
      </div>
      <div className="flex items-center justify-between p-4">
        <div className="h-2.5 w-80 rounded-full bg-zinc-300 dark:bg-zinc-600" />
        <div className="h-2.5 w-40 rounded-full bg-zinc-300 dark:bg-zinc-600" />
        <div className="h-2.5 w-40 rounded-full bg-zinc-300 dark:bg-zinc-600" />
        <div className="h-2.5 w-6 rounded-full bg-zinc-300 dark:bg-zinc-600" />
      </div>
      <div className="flex items-center justify-between p-4">
        <div className="h-2.5 w-80 rounded-full bg-zinc-300 dark:bg-zinc-600" />
        <div className="h-2.5 w-40 rounded-full bg-zinc-300 dark:bg-zinc-600" />
        <div className="h-2.5 w-40 rounded-full bg-zinc-300 dark:bg-zinc-600" />
        <div className="h-2.5 w-6 rounded-full bg-zinc-300 dark:bg-zinc-600" />
      </div>
    </div>

    <span className="sr-only">Loading...</span>
  </div>
);

export const Empty = () => {
  return (
    <div className="rw-text-center">
      {"No tribes yet. "}
      <Link to={routes.newTribe()} className="rw-link">
        {"Create one?"}
      </Link>
    </div>
  );
};

export const Failure = ({ error }: CellFailureProps) => (
  <section className="text-center">
    <div className="mx-auto max-w-3xl border border-[#60728F] bg-[#0D2836] p-8 text-[#97FBFF]">
      <h1 className="mb-3 text-2xl font-bold uppercase">{error.name}</h1>
      <h1 className="my-8">
        <span>{error?.message}</span>
      </h1>
      <div className="mt-3 flex flex-row items-center justify-center space-x-3 text-center">
        <Link
          to={routes.home()}
          className="w-1/2 bg-[#11667B] px-6 py-1 uppercase outline outline-1 outline-offset-1 outline-[#11667B] transition-colors duration-150 hover:outline-2 hover:outline-offset-0"
        >
          Accept
        </Link>
        {/* <Link to={routes.home()} className="uppercase w-1/2 duration-150 bg-[#11667B] px-6 py-1 outline outline-1 transition-colors outline-[#11667B] outline-offset-1 hover:outline-offset-0 hover:outline-2">Cancel</Link> */}
      </div>
    </div>
  </section>
);

export const Success = ({ tribes }: CellSuccessProps<FindTribes>) => {
  return <Tribes tribes={tribes} />;
};
