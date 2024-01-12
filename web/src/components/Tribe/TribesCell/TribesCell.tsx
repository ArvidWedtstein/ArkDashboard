import type { FindTribes, FindTribesVariables } from "types/graphql";

import { Link, routes } from "@redwoodjs/router";
import type { CellSuccessProps, CellFailureProps } from "@redwoodjs/web";

import Tribes from "src/components/Tribe/Tribes";

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
    <div className="flex space-x-3 my-2 items-center">
      <div className="flex items-center justify-start space-x-2 rounded-lg bg-zinc-300 p-2 pr-4 dark:bg-zinc-700">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 448 512"
          className="h-10 w-10 text-zinc-200 p-2 dark:text-zinc-500"
          fill="currentColor"
        >
          <path d="M432 256C432 264.8 424.8 272 416 272h-176V448c0 8.844-7.156 16.01-16 16.01S208 456.8 208 448V272H32c-8.844 0-16-7.15-16-15.99C16 247.2 23.16 240 32 240h176V64c0-8.844 7.156-15.99 16-15.99S240 55.16 240 64v176H416C424.8 240 432 247.2 432 256z" />
        </svg>
        <div className="h-2.5 w-48 rounded-full bg-zinc-200 dark:bg-zinc-500" />
      </div>

      <div className="flex items-center justify-start space-x-2 rounded-lg bg-zinc-300 p-2 pr-4 dark:bg-zinc-700">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" fill="currentColor" className="h-10 w-10 text-zinc-200 p-2 dark:text-zinc-500">
          <path d="M224 296c-13.25 0-24 10.75-24 24S210.8 344 224 344S248 333.3 248 320S237.3 296 224 296zM128 200C114.8 200 104 210.8 104 224S114.8 248 128 248S152 237.3 152 224S141.3 200 128 200zM224 200C210.8 200 200 210.8 200 224S210.8 248 224 248S248 237.3 248 224S237.3 200 224 200zM480 376c13.25 0 24-10.75 24-24s-10.75-24-24-24s-24 10.75-24 24S466.8 376 480 376zM224 104C210.8 104 200 114.8 200 128S210.8 152 224 152S248 141.3 248 128S237.3 104 224 104zM576 192h-102.7c3.59 10.21 5.848 20.92 5.848 32H576c17.62 0 32 14.38 32 32v192c0 17.62-14.38 32-32 32h-192c-17.62 0-32-14.38-32-32v-56.74l-32 31.9V448c0 35.38 28.62 64 64 64h192c35.38 0 64-28.62 64-64V256C640 220.6 611.4 192 576 192zM320 200C306.8 200 296 210.8 296 224S306.8 248 320 248S344 237.3 344 224S333.3 200 320 200zM447.1 223.1c0-17.15-6.691-33.43-18.84-45.83L270.1 19.07C257.4 6.691 241.1-.0035 223.1-.0035s-33.38 6.695-45.78 18.85L19.07 177.9C6.693 190.6-.0027 206.8-.0027 223.1c0 17.15 6.696 33.48 18.85 45.87L177.9 428.9C190.6 441.3 206.8 447.1 224 447.1s33.43-6.693 45.83-18.85L428.9 270.1C441.3 257.4 447.1 241.2 447.1 223.1zM406.2 247.3l-158.9 158.9C241.1 412.4 232.8 415.9 224 415.9s-17.07-3.514-23.34-9.662L41.79 247.3C35.64 241.1 32.13 232.8 32.13 224c0-8.785 3.516-17.07 9.664-23.34l158.9-158.9C206.9 35.64 215.2 32.13 224 32.13s17.07 3.514 23.34 9.662l158.9 158.9C412.4 206.9 415.9 215.2 415.9 224C415.9 232.8 412.4 241.1 406.2 247.3z" />
        </svg>
        <div className="h-2.5 w-48 rounded-full bg-zinc-200 dark:bg-zinc-500" />
      </div>

      <div className="h-5 w-48 rounded-lg bg-zinc-200 dark:bg-zinc-600" />
    </div>
    <div className="my-3 flex space-x-3">
      <div className="h-12 w-96 rounded-lg bg-zinc-200 dark:bg-zinc-700" />
    </div>

    {/* Table */}
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
    <div className="text-center text-black dark:text-white">
      {"No tribes yet. "}
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

export const Success = ({ tribes, queryResult, updating }: CellSuccessProps<FindTribes, FindTribesVariables>) => {
  return <Tribes tribes={tribes} queryResult={queryResult} updating={updating} />;
};
