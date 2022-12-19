interface IPaginate {
  postsPerPage: number;
  totalPosts: number;
  paginate: (pageNumber: number) => void;
  previousPage: () => void;
  nextPage: () => void;
}
const Paginate = ({
  postsPerPage,
  totalPosts,
  paginate,
  previousPage,
  nextPage,
}: IPaginate) => {
  const pageNumbers = [];

  // https://stackoverflow.com/questions/44182132/unique-url-for-pagination-pages-in-react
  for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
    pageNumbers.push(i);
  }
  return (
    <div className="flex justify-center">
      <nav aria-label="Page navigation">
        <ul className="flex list-style-none">
          <li className="page-item" onClick={prevPage} ><a
              className="page-link relative block py-1.5 px-3 rounded border-0 bg-transparent outline-none transition-all duration-300 rounded text-gray-800 hover:text-gray-800 focus:shadow-none"
              href="#" aria-label="Previous">
              <span aria-hidden="true">&laquo;</span>
            </a></li>
          {pageNumbers.map((number) => (
          <li key={number} className="page-item" onClick={() => paginate(number)}><a
              className="page-link relative block py-1.5 px-3 rounded border-0 bg-transparent outline-none transition-all duration-300 rounded text-gray-800 hover:text-gray-800 hover:bg-gray-200 focus:shadow-none"
              href="#">{number}</a></li>
          ))}
  
          <li className="page-item" onClick={nextPage}><a
              className="page-link relative block py-1.5 px-3 rounded border-0 bg-transparent outline-none transition-all duration-300 rounded text-gray-800 hover:text-gray-800 hover:bg-gray-200 focus:shadow-none"
              href="#" aria-label="Next">
              <span aria-hidden="true">&raquo;</span>
            </a></li>
        </ul>
      </nav>
    </div>
  );
};

export default Paginate;
