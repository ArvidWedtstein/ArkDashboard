import type { FindBasespots } from "types/graphql";

import { Link, routes } from "@redwoodjs/router";
import type { CellSuccessProps, CellFailureProps } from "@redwoodjs/web";

import Basespots from "src/components/Basespot/Basespots";
import Pagination from "src/components/Util/Pagination/Pagination";

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
//       map
//       estimated_for_players
//       defense_images
//       created_by
//       turretsetup_image
//       updated_at
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
        map
        estimated_for_players
        Map {
          name
        }
      }
      count
    }
  }
`;

export const beforeQuery = ({ page }) => {
  page = parseInt(page) ? parseInt(page, 10) : 1;

  return { variables: { page } };
};

// export const Loading = () => {
//   return (
//     <div className='w-full h-full flex items-center justify-center '>
//       {/* <span className='w-16 h-16 inline-block rounded-full border-t-4 border-white border-r-2 border-transparent animate-spin'></span> */}
//     </div>
//   )
// }

export const Loading = () => {
  let items = 6;
  return (
    <div className="mt-8 mb-5 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {Array.from(Array(items).keys()).map((item, i) => (
        <div
          key={i}
          className="border-pea-300 mx-auto w-full rounded-md border p-4 shadow"
        >
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
      ))}
    </div>
  );
};

export const Empty = () => {
  return (
    <div className="rw-text-center text-black dark:text-white">
      {"No basespots yet. "}
      <Link to={routes.newBasespot()} className="rw-link">
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

// export const Success = ({ basespots }: CellSuccessProps<FindBasespots>) => {
//   console.log(basespots);
//   return <Basespots basespots={basespots} />;
// };

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
