import { Link, routes, useParams } from "@redwoodjs/router";

const Pagination = ({
  count,
  route,
  itemsPerPage = 6,
}: {
  count: number;
  route: string;
  itemsPerPage?: number;
}) => {
  const items = [];
  let query = useParams();

  for (let i = 0; i < Math.ceil(count / itemsPerPage); i++) {
    items.push(
      <li key={i}>
        <Link
          to={routes[route]({ page: i + 1 })}
          // className="page-link relative block rounded border-0 bg-transparent py-1.5 px-3 text-gray-800 outline-none transition-all duration-300 hover:bg-gray-200 hover:text-gray-800 focus:shadow-none"
          className={`inline-flex h-8 w-8 items-center justify-center rounded-md border leading-none text-gray-800 hover:border-2 ${
            parseInt(query.page) === i + 1
              ? "border-2 bg-gray-500 dark:border-gray-800 dark:bg-gray-900"
              : "border-gray-200 dark:border-gray-500"
          }`}
        >
          {i + 1}
        </Link>
      </li>
    );
  }

  type direction = "next" | "prev";
  const changePage = (dir: direction): number => {
    if (!!!query.page || isNaN(parseInt(query.page))) return 1;
    if (dir === "prev") {
      return parseInt(query.page) - (parseInt(query.page) > 1 ? 1 : 0);
    } else {
      return (
        parseInt(query.page) +
        (parseInt(query.page) < Math.ceil(count / itemsPerPage) ? 1 : 0)
      );
    }
  };

  return (
    <>
      <div className="flex justify-center">
        <nav aria-label="Page navigation">
          <ul className="list-style-none mt-5 flex w-full justify-end space-x-2">
            <li className="">
              <Link
                className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 leading-none text-gray-800 hover:border-2 dark:border-gray-500"
                to={routes[route]({ page: changePage("prev") })}
                aria-label="Previous"
              >
                {/* <span aria-hidden="true">&laquo;</span> */}
                <svg
                  className="w-4"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2"
                  fill="none"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
              </Link>
            </li>
            {items}
            <li className="">
              <Link
                className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 leading-none text-gray-800 hover:border-2 dark:border-gray-500"
                to={routes[route]({ page: changePage("next") })}
                aria-label="Next"
              >
                {/* <span aria-hidden="true">&raquo;</span> */}
                <svg
                  className="w-4"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2"
                  fill="none"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Pagination;
