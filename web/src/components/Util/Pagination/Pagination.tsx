import { Link, routes, useParams } from "@redwoodjs/router";
import clsx from "clsx";
import { Fragment, useCallback } from "react";

interface IPagination {
  count: number;
  route: string;
  itemsPerPage?: number;
  pageLimit?: number;
}
const Pagination = ({
  count,
  route,
  itemsPerPage = 6,
  pageLimit = 3,
}: IPagination) => {
  let params = useParams();
  const { page = "1" } = params;

  const getPaginationGroup = useCallback(() => {
    const paginationGroup: number[] = [];
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
      if (dir === "prev") return parseInt(page) - (parseInt(page) > 1 ? 1 : 0);

      return (
        parseInt(page) +
        (parseInt(page) < Math.ceil(count / itemsPerPage) ? 1 : 0)
      );
    },
    [page]
  );

  return (
    <nav className="flex justify-center" role="menubar">
      <div className="inline-flex items-center justify-center rounded border border-zinc-500 bg-zinc-300 py-1 text-zinc-800 dark:bg-zinc-600 dark:text-white">
        <Link
          className={clsx("inline-flex h-8 w-8 items-center justify-center", {
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
            xmlns="http://www.w3.org/2000/svg"
            className="h-3 w-3"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </Link>

        {getPaginationGroup().map((item, index) => (
          <Fragment key={`page-${index}`}>
            <span className="h-4 w-px bg-zinc-800/25 dark:bg-white/25" />
            <Link
              to={routes[route]({ ...params, page: item })}
              className={clsx({
                "inline-flex h-8 w-12 items-center justify-center rounded border-none bg-transparent p-0 text-center align-middle text-xs font-medium ring-1 ring-inset ring-zinc-800 dark:ring-white":
                  parseInt(page) === item,
                "inline-flex h-8 w-12 items-center justify-center rounded border-none bg-transparent p-0 text-center align-middle text-xs font-medium hover:ring-1 hover:ring-inset hover:ring-white/30":
                  parseInt(page) !== item,
              })}
            >
              {item}
            </Link>
          </Fragment>
        ))}

        <span className="h-4 w-px bg-zinc-800/25 dark:bg-white/25" />

        <Link
          className={clsx("inline-flex h-8 w-8 items-center justify-center", {
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
            xmlns="http://www.w3.org/2000/svg"
            className="h-3 w-3"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </Link>
      </div>
    </nav>
  );
};

export default Pagination;
