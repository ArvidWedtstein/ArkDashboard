import { Link, routes, useParams } from '@redwoodjs/router'

const Pagination = ({ count, route, itemsPerPage = 6 }: { count: number, route: string, itemsPerPage?: number }) => {
  const items = []
  let query = useParams();

  for (let i = 0; i < Math.ceil(count / itemsPerPage); i++) {
    items.push(
      <li
        key={i}
        className={`page-item ${parseInt(query.page) === i + 1 ? "bg-red-700" : ""} `}

      >
        <Link to={routes[route]({ page: i + 1 })} className="page-link relative block rounded border-0 bg-transparent py-1.5 px-3 text-gray-800 outline-none transition-all duration-300 hover:bg-gray-200 hover:text-gray-800 focus:shadow-none">
          {i + 1}
        </Link>
      </li>
    )
  }

  return (
    <>
      <div className="flex justify-center">
        <nav aria-label="Page navigation">
          <ul className="list-style-none flex">
            <li className="page-item">
              <Link
                className="page-link relative block rounded border-0 bg-transparent py-1.5 px-3 text-gray-800 outline-none transition-all duration-300 hover:text-gray-800 focus:shadow-none"
                to={routes[route]({ page: parseInt(query.page) - (parseInt(query.page) > 1 ? 1 : 0) })}
                aria-label="Previous"
              >
                <span aria-hidden="true">&laquo;</span>
              </Link>
            </li>
            {items}
            <li className="page-item">
              <Link
                className="page-link relative block rounded border-0 bg-transparent py-1.5 px-3 text-gray-800 outline-none transition-all duration-300 hover:bg-gray-200 hover:text-gray-800 focus:shadow-none"
                to={routes[route]({ page: parseInt(query.page) + (parseInt(query.page) < Math.ceil(count / itemsPerPage) ? 1 : 0) })}
                aria-label="Next"
              >
                <span aria-hidden="true">&raquo;</span>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </>
  )
}

export default Pagination