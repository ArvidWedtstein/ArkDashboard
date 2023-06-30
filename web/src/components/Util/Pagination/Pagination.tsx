import { Link, routes, useParams } from "@redwoodjs/router";
import clsx from "clsx";
import { useCallback, useEffect, useMemo } from "react";

const Pagination = ({
  count,
  route,
  itemsPerPage = 6,
  pageLimit = 3,
}: {
  count: number;
  route: string;
  itemsPerPage?: number;
  pageLimit?: number;
}) => {
  // const items = [];
  let params = useParams();
  const { page = "1" } = params;
  // const addSearchParams = (url: any, params: any = {}) =>
  //   new URL(
  //     `${url.origin}${url.pathname}?${new URLSearchParams([
  //       ...Array.from(url?.searchParams?.entries()),
  //       ...Object.entries(params),
  //     ])}`
  //   );

  // useEffect(() => {
  //   if (!!!page || isNaN(parseInt(page))) {
  //     page = "1";
  //   }
  //   for (let i = 0; i < Math.round(count / itemsPerPage); i++) {
  //     items.push(
  //       <li key={i}>
  //         <Link
  //           to={routes[route]({ page: i + 1 })}
  //           // className="page-link relative block rounded border-0 bg-transparent py-1.5 px-3 text-gray-800 outline-none transition-all duration-300 hover:bg-gray-200 hover:text-gray-800 focus:shadow-none"
  //           className={clsx("inline-flex h-8 w-8 items-center justify-center rounded-md border leading-none text-gray-800 hover:border-2 dark:text-stone-200", {
  //             "border-2 border-gray-800 outline dark:border-stone-200": parseInt(page) === i + 1,
  //             "border-gray-500 dark:border-gray-200": parseInt(page) !== i + 1,
  //           }
  //           )}
  //         >
  //           {i + 1}
  //         </Link>
  //       </li>
  //     );
  //   }
  // }, [pageLimit]);

  const getPaginationGroup = useCallback(() => {
    const paginationGroup = [];
    let pages = Math.round(count / itemsPerPage);

    if (pages <= pageLimit) {
      for (let i = 1; i <= pages; i++) {
        paginationGroup.push(i);
      }
    } else {
      const halfPageLimit = Math.floor(pageLimit / 2);
      let start = parseInt(page) - halfPageLimit;
      let end = parseInt(page) + halfPageLimit;

      if (start <= 0) {
        start = 1;
        end = pageLimit;
      } else if (end > pages) {
        end = pages;
        start = pages - pageLimit + 1;
      }

      for (let i = start; i <= end; i++) {
        paginationGroup.push(i);
      }
    }

    return paginationGroup;
  }, [itemsPerPage, count, page, route]);

  type direction = "next" | "prev";
  const changePage = useCallback(
    (dir: direction): number => {
      if (!!!page || isNaN(parseInt(page))) return 1;
      if (dir === "prev") {
        return parseInt(page) - (parseInt(page) > 1 ? 1 : 0);
      } else {
        // console.log('next', page, itemsPerPage, Math.ceil(count / itemsPerPage))
        // console.log(parseInt(page) +
        //   (parseInt(page) <= Math.ceil(count / itemsPerPage) ? 1 : 0))
        return (
          parseInt(page) +
          (parseInt(page) < Math.ceil(count / itemsPerPage) ? 1 : 0)
        );
      }
    },
    [page]
  );

  return (
    <>
      <div className="flex justify-center">
        <nav aria-label="Page navigation">
          <div className="rw-button-group mt-5 w-full">
            <Link
              className={clsx("rw-pagination-item", {
                "pointer-events-none cursor-not-allowed select-none":
                  parseInt(page) == 1,
              })}
              to={routes[route]({ ...params, page: changePage("prev") })}
              aria-label="Previous"
              aria-disabled={count / itemsPerPage <= 1}
            >
              <span aria-hidden="true" className="sr-only">
                Previous
              </span>
              <svg
                className="h-5 w-5"
                aria-hidden="true"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
            {getPaginationGroup().map((item, index) => (
              <Link
                key={`page-${index}`}
                to={routes[route]({ ...params, page: item })}
                className={clsx({
                  "rw-pagination-item-active": parseInt(page) === item,
                  "rw-pagination-item": parseInt(page) !== item,
                })}
              >
                {item}
              </Link>
            ))}
            <Link
              className={clsx("rw-pagination-item", {
                "pointer-events-none cursor-not-allowed select-none":
                  Math.ceil(count / itemsPerPage) == parseInt(page),
              })}
              to={routes[route]({ ...params, page: changePage("next") })}
              aria-label="Next"
              aria-disabled={Math.ceil(count / itemsPerPage) == parseInt(page)}
            >
              <span aria-hidden="true" className="sr-only">
                Next
              </span>
              <svg
                className="h-5 w-5"
                aria-hidden="true"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </Link>
          </div>
          {/* <ul className="list-style-none mt-5 flex w-full justify-end space-x-2">
            <li className="">
              <Link
                className="inline-flex h-8 w-8 items-center justify-center rounded-md border leading-none text-gray-800 hover:border-2 aria-disabled:pointer-events-none aria-disabled:hidden dark:text-stone-200"
                to={routes[route]({ ...params, page: changePage("prev") })}
                aria-label="Previous"
                aria-disabled={count / itemsPerPage <= 1}
              >
                <span aria-hidden="true" className="sr-only">
                  Previous
                </span>
                <svg
                  className="w-4"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </Link>
            </li>
            {getPaginationGroup().map((item, index) => (
              <li key={`page-${index}`}>
                <Link
                  to={routes[route]({ ...params, page: index + 1 })}
                  className={clsx(
                    "inline-flex h-8 w-8 items-center justify-center rounded-md border leading-none text-gray-800 hover:border-2 dark:text-stone-200",
                    {
                      "border-2 border-gray-800 outline dark:border-stone-200":
                        parseInt(page) === index + 1,
                      "border-gray-500 dark:border-gray-200":
                        parseInt(page) !== index + 1,
                    }
                  )}
                >
                  {item}
                </Link>
              </li>
            ))}
            <li className="">
              <Link
                className="inline-flex h-8 w-8 items-center justify-center rounded-md border leading-none text-gray-800 hover:border-2 aria-disabled:pointer-events-none aria-disabled:hidden dark:text-stone-200"
                to={routes[route]({ ...params, page: changePage("next") })}
                aria-label="Next"
                aria-disabled={count / itemsPerPage <= 1}
              >
                <span aria-hidden="true" className="sr-only">
                  Next
                </span>
                <svg
                  className="w-4"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </Link>
            </li>
          </ul> */}
        </nav>
      </div>
    </>
  );
};

export default Pagination;
