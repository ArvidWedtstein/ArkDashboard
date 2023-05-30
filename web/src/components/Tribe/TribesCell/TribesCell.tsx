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
      description
      created_at
      updated_at
      created_by
      updated_by
      Profile {
        id
        full_name
        avatar_url
      }
    }
  }
`;

// export const Loading = () => <div>Loading...</div>
export const Loading = () => (
  <div className="flex h-full w-full items-center justify-center ">
    <span className="inline-block h-16 w-16 animate-spin rounded-full border-t-4 border-r-2 border-white border-transparent"></span>
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
