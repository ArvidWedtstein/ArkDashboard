interface IPaginate {
  currentPage: number;
  postsPerPage: number;
  totalPosts: number;
  onPageChange: (page: number) => void;
  prevLabel?: string;
  nextLabel?: string;
}
const Paginate = ({
  currentPage,
  postsPerPage,
  totalPosts,
  onPageChange,
  prevLabel,
  nextLabel,
}: IPaginate) => {
  const pageNumbers = [];

  const paginate = (page: number) => {
    onPageChange(page);
  };
  // https://stackoverflow.com/questions/44182132/unique-url-for-pagination-pages-in-react
  for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
    pageNumbers.push(i);
  }
  return (
    <div className="flex justify-center">
      <nav aria-label="Page navigation">
        <ul className="list-style-none flex">
          <li className="page-item" onClick={() => paginate(currentPage - 1)}>
            <a
              className="page-link relative block rounded border-0 bg-transparent py-1.5 px-3 text-gray-800 outline-none transition-all duration-300 hover:text-gray-800 focus:shadow-none"
              href="#"
              aria-label="Previous"
            >
              <span aria-hidden="true">&laquo;</span>
            </a>
          </li>

          {pageNumbers.map((number) => (
            <li
              key={number}
              className={`page-item ${
                currentPage === number ? "bg-red-700" : ""
              }`}
              onClick={() => paginate(number)}
            >
              <a
                className="page-link relative block rounded border-0 bg-transparent py-1.5 px-3 text-gray-800 outline-none transition-all duration-300 hover:bg-gray-200 hover:text-gray-800 focus:shadow-none"
                href="#"
              >
                {number}
              </a>
            </li>
          ))}

          <li className="page-item" onClick={() => paginate(currentPage + 1)}>
            <a
              className="page-link relative block rounded border-0 bg-transparent py-1.5 px-3 text-gray-800 outline-none transition-all duration-300 hover:bg-gray-200 hover:text-gray-800 focus:shadow-none"
              href="#"
              aria-label="Next"
            >
              <span aria-hidden="true">&raquo;</span>
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Paginate;
