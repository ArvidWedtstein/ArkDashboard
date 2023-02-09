import { useCallback, useEffect, useMemo, useState } from "react";
import { debounce, dynamicSort, isUUID, truncate } from "src/lib/formatters";
import clsx from "clsx";
interface Row {
  index: number;
}
interface GridCell<V = any> {
  columnIndex: number;
  rowIndex: number;
  field: string;
  value: V;
  row?: V;
}
interface ColumnData<V = any, F = V> {
  field: string;
  label: string;
  numeric?: boolean;
  className?: string;
  bold?: boolean;
  sortable?: boolean;
  /**
   * Function that allows to apply a formatter before rendering its value.
   * @template V, F
   * @param {GridValueFormatterParams<V>} params Object containing parameters for the formatter.
   * @returns {F} The formatted value.
   */
  valueFormatter?: (params: GridCell<V>) => F; // add functionality for value formatting
  /**
   * Allows to override the component rendered as cell for this column.
   * @param {GridCell} params Object containing parameters for the renderer.
   * @returns {React.ReactNode} The element to be rendered.
   */
  renderCell?: (params: GridCell<V>) => React.ReactNode;
}
interface TableProps {
  columns: ColumnData[];
  hover?: boolean;
  onRowClick?: (row: Row) => void;
  rows: any[];
  vertical?: boolean;
  summary?: boolean;
  caption?: {
    title: string;
    content?: React.ReactNode;
  };
  className?: string;
  select?: boolean;
  search?: boolean;
  filter?: boolean;
  header?: boolean;
  pagination?: boolean;
  renderActions?: (row: any) => React.ReactNode;
  /**
   * Number of rows per page
   * @default 10
   */
  rowsPerPage?: number;
  onPageChange?: (
    event: React.MouseEvent<HTMLButtonElement> | null,
    page: number
  ) => void;
  page?: number;
}

/**
 * @borrows dynamicSort and debounce from formatters.ts
 * @param param
 * @returns
 */
const Table = ({
  columns,
  rows: dataRows,
  onRowClick,
  className,
  caption,
  vertical = false,
  summary = false,
  hover = false,
  select = false,
  search = false,
  header = true,
  filter = false,
  pagination = false,
  rowsPerPage = 10,
  renderActions,
}: TableProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rows, setRows] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sort, setSort] = useState({
    column: "",
    direction: "asc",
  });

  const sortRows = useCallback(
    (e) => {
      let column = e.target.id;
      let direction = sort.direction === "asc" ? "desc" : "asc";
      setSort({ column, direction });
    },
    [sort]
  );

  const sortData = (data: any[]) => {
    let { column, direction } = sort;
    if (column) {
      data.sort(dynamicSort(column));
      if (direction === "desc") {
        data.reverse();
      }
    }
    return data;
  };

  const SortedFilteredData = useMemo(() => {
    if (!dataRows || dataRows.length < 1) return [];
    let filteredData = dataRows.filter((row) => {
      let rowValues = Object.values(row);
      let rowString = rowValues.join(" ");
      return rowString.toLowerCase().includes(searchTerm.toLowerCase());
    });
    const indexOfLastData = currentPage * rowsPerPage;
    const indexOfFirstData = indexOfLastData - rowsPerPage;
    return sortData(filteredData).slice(indexOfFirstData, indexOfLastData);
  }, [sort, searchTerm, dataRows, currentPage]);

  useEffect(() => {
    if (select) {
      let daRows = document.querySelectorAll(
        'input[type="checkbox"][id^="checkbox-row"]'
      );
      setRows([...daRows]);
    }
  }, []);


  const handleSearch = debounce((e) => setSearchTerm(e.target.value));

  const selectRow = (e) => {
    if (e.target.id === "checkbox-all-select") {
      rows.map((row) => {
        if (row.checked !== e.target.checked) {
          row.checked = e.target.checked;
        }
      });
      return;
    }

    let check: any = document.getElementById("checkbox-all-select");
    if (!e.target.checked) {
      check.checked = e.target.checked;
    } else {
      if (rows.every((row) => row.checked === true) && rows.length > 0) {
        check.checked = true;
      }
    }
  };

  const changePage = (dir: "next" | "prev") => {
    if (dir === "prev") {
      return setCurrentPage(currentPage > 1 ? currentPage - 1 : 1);
    } else {
      return setCurrentPage(
        currentPage < Math.ceil(dataRows.length / rowsPerPage)
          ? currentPage + 1
          : currentPage
      );
    }
  };

  const headerRenderer = ({ label, columnIndex, ...other }) => {
    return (
      <th
        key={`headcell-${columnIndex}-${label}`}
        className={clsx(other.className, "px-6 py-3")}
        scope="col"
      >
        {other.sortable ? (
          <div
            className="flex select-none items-center"
            id={other.field}
            onClick={sortRows}
          >
            {truncate(label, 30)}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="ml-1 h-3 w-3"
              fill="currentColor"
              viewBox="0 0 320 512"
            >
              {sort.column === other.field ? (
                sort.direction === "asc" ? (
                  <path d="M182.6 41.4c-12.5-12.5-32.8-12.5-45.3 0l-128 128c-9.2 9.2-11.9 22.9-6.9 34.9s16.6 19.8 29.6 19.8H288c12.9 0 24.6-7.8 29.6-19.8s2.2-25.7-6.9-34.9l-128-128z" />
                ) : (
                  <path d="M182.6 470.6c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-9.2-9.2-11.9-22.9-6.9-34.9s16.6-19.8 29.6-19.8H288c12.9 0 24.6 7.8 29.6 19.8s2.2 25.7-6.9 34.9l-128 128z" />
                )
              ) : (
                <path d="M27.66 224h264.7c24.6 0 36.89-29.78 19.54-47.12l-132.3-136.8c-5.406-5.406-12.47-8.107-19.53-8.107c-7.055 0-14.09 2.701-19.45 8.107L8.119 176.9C-9.229 194.2 3.055 224 27.66 224zM292.3 288H27.66c-24.6 0-36.89 29.77-19.54 47.12l132.5 136.8C145.9 477.3 152.1 480 160 480c7.053 0 14.12-2.703 19.53-8.109l132.3-136.8C329.2 317.8 316.9 288 292.3 288z" />
              )}
            </svg>
          </div>
        ) : (
          truncate(label, 30)
        )}
      </th>
    );
  };

  const cellRenderer = ({
    rowData,
    cellData,
    columnIndex,
    rowIndex,
    renderCell,
    ...other
  }) => {
    const className = clsx(other.className, "px-3 py-2", {
      "font-bold text-gray-900 dark:text-white": other.bold,
    });
    // px-6 py-4
    const key = `${Math.random()}-${columnIndex}-${cellData}`;

    let content = renderCell
      ? renderCell({
        columnIndex,
        rowIndex,
        value: cellData,
        field: other.field,
        row: rowData,
      })
      : "";

    if (
      !content &&
      isUUID(cellData) &&
      other.label.toLowerCase() === "created by" &&
      "Profile" in rowData
    ) {
      const profile = rowData.Profile;
      content = (
        <div className="flex flex-row">
          {profile.avatar_url && (
            <img
              className="h-10 w-10 rounded-full"
              src={`https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/avatars/${profile.avatar_url}`}
              alt={profile.full_name || "Profile Image"}
            />
          )}
          <div className="flex items-center pl-3">
            <div className="text-base">{profile.full_name}</div>
          </div>
        </div>
      );
    } else if (!content) {
      content = other.valueFormatter
        ? other.valueFormatter({ value: cellData, row: rowData, columnIndex })
        : truncate(cellData, 30);
    }

    return (
      <td key={key} className={className}>
        {content}
      </td>
    );
  };

  const tableSelect = ({
    header = false,
    row,
  }: {
    header?: boolean;
    row: number;
  }) => {
    return (
      <td className="w-4 p-4" scope="col">
        <div className="flex items-center">
          <input
            id={header ? "checkbox-all-select" : `checkbox-row-${row}`}
            onChange={selectRow}
            type="checkbox"
            className="rw-input h-4 w-4"
          />
          <label
            htmlFor={header ? "checkbox-all-select" : `checkbox-row-${row}`}
            className="sr-only"
          >
            checkbox
          </label>
        </div>
      </td>
    );
  };

  // TODO: Fix summary for vertical table
  const tableFooter = () => {
    return (
      <tfoot>
        <tr className="font-semibold text-gray-900 dark:text-white">
          {select && !vertical && <td className="p-4"></td>}
          {!vertical &&
            columns.map(({ field, ...other }, index) => {
              return (
                <th
                  key={`${index}-${field}`}
                  className={clsx("px-6 py-3", other.className, {
                    "test-base": other.numeric,
                  })}
                >
                  {other.numeric
                    ? SortedFilteredData.reduce((a, b) => a + b[field], 0)
                    : index === 0
                      ? "Total"
                      : ""}
                </th>
              );
            })}
        </tr>
      </tfoot>
    );
  };

  const tablePagination = () => {
    return (
      <nav
        className="flex items-center justify-between pt-4"
        aria-label="Table navigation"
      >
        <span className="ml-1 text-sm font-normal text-gray-500 dark:text-gray-400">
          Showing{" "}
          <span className="font-semibold text-gray-900 dark:text-white">
            {currentPage}-{rowsPerPage * 1}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-gray-900 dark:text-white">
            {rows.length || dataRows.length}
          </span>
        </span>
        <ul className="inline-flex items-center -space-x-px text-gray-500 dark:text-gray-400">
          <li onClick={() => changePage("prev")}>
            <a
              href="#"
              className="ml-0 block rounded-l-lg border border-gray-300 bg-white px-3 py-2 leading-tight hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              <span className="sr-only">Previous</span>
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
                ></path>
              </svg>
            </a>
          </li>
          {/* {Array(Math.ceil(dataRows.length / rowsPerPage)).fill('').map((page, index) => {
            return (
              <li key={index}>
                <a
                  className={`px-3 py-2 leading-tight ${currentPage === index + 1 ? "bg-blue-50 hover:bg-blue-100 hover:text-blue-700 border-blue-300" : "bg-white hover:bg-gray-100 border-gray-300 hover:text-gray-700"} border dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 dark:hover:text-white`}
                >
                  {index + 1}
                </a>
              </li>
            )
          })} */}
          {currentPage > 1 && (
            <li onClick={() => changePage("prev")}>
              <a className="border border-gray-300 bg-white px-3 py-2 leading-tight hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 dark:hover:text-white">
                {currentPage - 1}
              </a>
            </li>
          )}
          <li>
            <a className="border border-blue-300 bg-blue-50 px-3 py-2 leading-tight hover:bg-blue-100 hover:text-blue-700 dark:hover:bg-gray-700 dark:hover:text-white">
              {currentPage}
            </a>
          </li>
          {currentPage < Math.ceil(dataRows.length / rowsPerPage) && (
            <li onClick={() => changePage("next")}>
              <a className="border border-gray-300 bg-white px-3 py-2 leading-tight hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 dark:hover:text-white">
                {currentPage + 1}
              </a>
            </li>
          )}
          <li onClick={() => changePage("next")}>
            <a
              href="#"
              className="block rounded-r-lg border border-gray-300 bg-white px-3 py-2 leading-tight hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800  dark:hover:bg-gray-700 dark:hover:text-white"
            >
              <span className="sr-only">Next</span>
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
            </a>
          </li>
        </ul>
      </nav>
    );
  };

  return (
    <div
      className={clsx(
        "relative overflow-x-auto shadow-md sm:rounded-lg",
        className
      )}
    >
      {search && (
        <div className="flex items-center justify-between pb-4">
          <label htmlFor="table-search" className="sr-only">
            Search
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <svg
                className="h-5 w-5 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </div>
            <input
              id="table-search"
              onChange={handleSearch}
              className="block w-80 rounded-lg border border-gray-300 bg-gray-50 p-2 pl-10 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
              placeholder="Search for items"
            />
          </div>
        </div>
      )}
      <table className="mr-auto w-full table-auto text-left text-sm text-gray-500 dark:text-stone-300">
        {!!caption && (
          <caption className="bg-white p-5 text-left text-lg font-semibold text-gray-900 dark:bg-zinc-800 dark:text-white">
            {caption.title}
            {caption.content && (
              <div className="mt-1 text-sm font-normal text-gray-500 dark:text-gray-400">
                {caption.content}
              </div>
            )}
          </caption>
        )}
        {!vertical && header && (
          <thead className="bg-gray-400 text-sm uppercase text-gray-600 dark:bg-gray-700 dark:text-gray-400">
            <tr className="table-row">
              {select && tableSelect({ header: true, row: 0 })}
              {columns.map(({ ...other }, index) => {
                return headerRenderer({
                  label: other.label,
                  columnIndex: index,
                  ...other,
                });
              })}
              {renderActions && <th></th>}
            </tr>
          </thead>
        )}
        <tbody className="divide-y divide-gray-400 dark:divide-gray-800 bg-gray-200 dark:bg-zinc-600">
          {vertical
            ? columns.map(({ field, ...other }, index) => {
              return (
                <tr
                  key={`row-${index}`}
                  className={clsx("bg-white dark:bg-zinc-600", {
                    "hover:bg-gray-50 dark:hover:bg-gray-600": hover,
                  })}
                  onClick={() => onRowClick && onRowClick({ index: index })}
                >
                  {header &&
                    headerRenderer({
                      label: other.label,
                      columnIndex: index,
                      ...other,
                    })}
                  {SortedFilteredData.map((datarow, rowIndex) => {
                    return cellRenderer({
                      rowData: datarow,
                      cellData: datarow[field],
                      columnIndex: index,
                      rowIndex,
                      renderCell: other.renderCell,
                      field,
                      ...other,
                    });
                  })}
                </tr>
              );
            })
            : dataRows && SortedFilteredData.map((datarow, i) => {
              return (
                <tr
                  key={`row-${i}`}
                  className={clsx({
                    "hover:bg-gray-50 dark:hover:bg-gray-600": hover,
                  })}
                  onClick={() => onRowClick && onRowClick({ index: i })}
                >
                  {select && tableSelect({ row: i })}
                  {columns.map(({ field, ...other }, index) => {
                    return cellRenderer({
                      rowData: datarow,
                      cellData: datarow[field],
                      columnIndex: index,
                      rowIndex: i,
                      renderCell: other.renderCell,
                      field,
                      ...other,
                    });
                  })}
                  {renderActions && <td>{renderActions(datarow)}</td>}
                </tr>
              );
            })}
          {(dataRows === null || dataRows.length === 0) && (
            <tr className="w-full">
              <td
                className="text-center p-4"
                colSpan={100}
              >
                <span className="px-3 py-2 text-gray-500 dark:text-gray-400 ">
                  No data found
                </span>
              </td>
            </tr>
          )}
        </tbody>
        {summary && tableFooter()}
      </table>
      {pagination && tablePagination()}
    </div>
  );
};

export default Table;
