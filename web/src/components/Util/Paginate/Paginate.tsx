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
    <div className="pagination-container">
      <ul className="pagination">
        <li onClick={previousPage} className="page-number">
          Prev
        </li>
        {pageNumbers.map((number) => (
          <li
            key={number}
            onClick={() => paginate(number)}
            className="page-number"
          >
            {number}
          </li>
        ))}
        <li onClick={nextPage} className="page-number">
          Next
        </li>
      </ul>
    </div>
  );
};

export default Paginate;
