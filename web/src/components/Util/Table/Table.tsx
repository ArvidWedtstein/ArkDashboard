import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  debounce,
  dynamicSort,
  formatNumberWithThousandSeparator,
  pluralize,
  truncate,
} from "src/lib/formatters";
import clsx from "clsx";
import useComponentVisible from "src/components/useComponentVisible";
interface Row {
  index: number;
}
interface GridCell<V> {
  columnIndex: number;
  rowIndex: number;
  field: ColumnData["field"];
  value: V;
  row?: V | ThisType<Row>;
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
  valueFormatter?: ({ value, row }: { value: any; row: any }) => F; // add functionality for value formatting
  /**
   * Allows to override the component rendered as cell for this column.
   * @param {GridCell} params Object containing parameters for the renderer.
   * @returns {React.ReactNode} The element to be rendered.
   */
  renderCell?: (params: any) => React.ReactNode;
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
  const datarows = useMemo(() => {
    return dataRows.map((row, index) => {
      return { ...row, tableId: index, selected: false };
    });
  }, [dataRows]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rows, setRows] = useState<any[]>([]);
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const checkboxAllSelectRef = useRef(null);
  const [sort, setSort] = useState({
    column: "",
    direction: "asc",
  });

  interface Filter {
    column: string;
    operator: string;
    value: string;
  }
  const [filters, setFilters] = useState<Filter[]>([]);

  const sortRows = useCallback(
    (e) => {
      let column = e.target.id;
      let direction = sort.direction === "asc" ? "desc" : "asc";
      setSort({ column, direction });
    },
    [sort]
  );

  const sortData = (data: any[], column: string, direction: string) => {
    if (column) {
      data.sort(dynamicSort(column));
      if (direction === "desc") {
        data.reverse();
      }
    }
    return data;
  };

  const applyFilter = useCallback((filter, row) => {
    const { column, operator, value } = filter;
    const rowValue = row[column];

    if (value === "" || rowValue == undefined) return true;
    switch (operator) {
      case "=":
        return rowValue == value;
      case "!=":
        return rowValue !== value;
      case ">":
        return rowValue > value;
      case "<":
        return rowValue < value;
      case ">=":
        return rowValue >= value;
      case "<=":
        return rowValue <= value;
      case "like":
        return rowValue.includes(value);
      case "ilike":
        return !rowValue.includes(value);
      case "in":
        return value.includes(rowValue);
      case "not_in":
        return !value.includes(rowValue);
      default:
        return true;
    }
  }, []);

  const filterData = (data) => {
    if (filters.length === 0) {
      return data;
    }

    const filterLookup = {};
    filters.forEach((filter) => {
      const { column } = filter;
      if (!filterLookup[column]) {
        filterLookup[column] = [];
      }
      filterLookup[column].push(filter);
    });

    return data.filter((row) => {
      for (const column in filterLookup) {
        const filters = filterLookup[column];
        if (filters.some((filter) => !applyFilter(filter, row))) {
          return false;
        }
      }
      return true;
    });
  };

  const SortedFilteredData = useMemo(() => {
    if (!dataRows?.length) return dataRows;

    let filteredData = dataRows.filter((row) => {
      const rowString = Object.values(row).join(" ").toLowerCase();

      return rowString.includes(searchTerm.toLowerCase());
    });

    if (filter) {
      filteredData = filterData(filteredData);
    }

    if (pagination) {
      const startIndex = (currentPage - 1) * rowsPerPage;
      const endIndex = startIndex + rowsPerPage;
      const sortedData = sortData(filteredData, sort.column, sort.direction);
      return sortedData.slice(startIndex, endIndex);
    }
    return sortData(filteredData, sort.column, sort.direction);
  }, [sort, searchTerm, dataRows, currentPage, pagination, filters]);

  useEffect(() => {
    if (select) {
      let daRows = document.querySelectorAll(
        'input[type="checkbox"][id^="checkbox-row"]'
      );
      setRows([...daRows]);
    }
  }, []);

  const handleSearch = debounce((e) => setSearchTerm(e.target.value), 500);

  const selectRow = (e) => {
    if (e.target.id === "checkbox-all-select") {
      const isChecked = e.target.checked;
      rows.forEach((row) => {
        if (row.checked !== isChecked) {
          row.checked = isChecked;
        }
      });
      setSelectedRows(rows.filter((row) => row.checked === true));
      return;
    }

    const checkboxAllSelect = checkboxAllSelectRef.current;
    if (!e.target.checked) {
      checkboxAllSelect.checked = e.target.checked;
    } else {
      if (!rows.some((row) => !row.checked) && rows.length > 0) {
        checkboxAllSelect.checked = true;
      }
    }
    setSelectedRows(rows.filter((row) => row.checked === true));
  };

  const headerRenderer = ({ label, columnIndex, ...other }) => {
    return (
      <th
        key={`headcell-${columnIndex}-${label}`}
        className={clsx(
          "bg-zinc-400 px-3 py-3 first:rounded-tl-lg last:rounded-tr-lg dark:bg-zinc-700",
          other.className
        )}
        scope="col"
      >
        {other.sortable ? (
          <div
            className="line-clamp-1 flex select-none items-center"
            id={other.field}
            onClick={sortRows}
          >
            {label}
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
    // px-6 py-4
    const className = clsx(other.className, "px-3 py-2", {
      "font-bold": other.bold,
      truncate: !renderCell && !other.valueFormatter,
    });

    if (other.numeric && !isNaN(cellData) && !renderCell) {
      cellData = formatNumberWithThousandSeparator(parseInt(cellData));
    }
    const key = `cell-${rowIndex}-${columnIndex}`;

    const valueFormatter = other.valueFormatter
      ? other.valueFormatter({
          // value: isNaN(cellData) ? cellData?.amount : cellData,
          value: cellData,
          row: rowData,
          columnIndex,
        })
      : isNaN(cellData)
      ? cellData?.amount || cellData
      : cellData;

    let content = renderCell
      ? renderCell({
          columnIndex,
          rowIndex,
          value: valueFormatter,
          field: other.field,
          row: rowData,
        })
      : valueFormatter;

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
      <td
        className={clsx("w-4 p-4", {
          "bg-zinc-400 first:rounded-tl-lg dark:bg-zinc-700": header,
        })}
        scope="col"
      >
        <div className="flex items-center">
          <input
            id={header ? "checkbox-all-select" : `checkbox-row-${row}`}
            ref={header ? checkboxAllSelectRef : null}
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

  const tableFooter = () => {
    let total = 0;

    const columnData = useMemo(
      () =>
        columns.map(
          ({ field, className, valueFormatter, label, ...other }) => ({
            field,
            className,
            valueFormatter,
            label,
            numeric: other.numeric,
          })
        ),
      [columns]
    );
    return (
      <tfoot>
        <tr className="bg-gray-400 font-semibold text-gray-900 dark:bg-zinc-700 dark:text-white">
          {select && !vertical && <td className="p-4"></td>}
          {!vertical &&
            columnData.map(
              ({ field, numeric, className, valueFormatter }, index) => {
                const sum = numeric
                  ? SortedFilteredData.filter((r, i) =>
                      select && selectedRows.length > 0
                        ? rows
                            .map((d: any, k) => {
                              return d.checked ? k : -1;
                            })
                            .includes(i)
                        : true
                    ).reduce((a, b) => {
                      const cellData = b[field];
                      const valueFormatted = valueFormatter
                        ? valueFormatter({ value: cellData, row: b })
                        : cellData;

                      return (
                        a +
                        parseInt(
                          isNaN(valueFormatted)
                            ? valueFormatted?.amount
                            : valueFormatted
                        )
                      );
                    }, 0)
                  : // ? SortedFilteredData.filter((r, i) =>
                    //   select && selectedRows.length > 0
                    //     ? rows
                    //       .map((d: any, k) => {
                    //         return d.checked ? k : -1;
                    //       })
                    //       .includes(i)
                    //     : true
                    // ).reduce((a, b) => a + parseInt(b[field]), 0)
                    0;

                total += numeric ? sum : 0;
                return (
                  <th
                    key={`${index}-${field}`}
                    className={clsx(
                      "px-3 py-4",
                      className,
                      numeric && "test-base"
                    )}
                  >
                    {numeric ? sum : index === 0 ? "Total" : ""}
                  </th>
                );
              }
            )}
          {renderActions && <th></th>}
        </tr>
      </tfoot>
    );
  };

  const tablePagination = () => {
    const totalRows = dataRows.length || rows.length;
    const lastRowIndex =
      currentPage * rowsPerPage > totalRows
        ? totalRows
        : currentPage * rowsPerPage;
    const firstRowIndex = currentPage * rowsPerPage - rowsPerPage;

    const changePage = useCallback(
      (dir: "next" | "prev") => {
        if (dir === "prev" && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        } else if (
          dir === "next" &&
          currentPage < Math.ceil(totalRows / rowsPerPage)
        ) {
          setCurrentPage(currentPage + 1);
        }
      },
      [currentPage, dataRows.length, rowsPerPage]
    );
    return useMemo(
      () => (
        <nav
          className="flex items-center justify-between pt-4"
          aria-label="Table navigation"
        >
          <span className="ml-1 text-sm font-normal text-gray-500 dark:text-gray-400">
            Showing{" "}
            <span className="font-semibold text-gray-900 dark:text-white">
              {firstRowIndex + 1}-{lastRowIndex}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-gray-900 dark:text-white">
              {totalRows}
            </span>
          </span>
          <ul className="inline-flex items-center -space-x-px text-gray-500 dark:text-gray-400">
            <li>
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => changePage("prev")}
                className="ml-0 block rounded-l-lg border border-gray-300 bg-white px-3 py-2 leading-tight hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-zinc-600 dark:hover:bg-zinc-700 dark:hover:text-white"
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
                  />
                </svg>
              </button>
            </li>

            {currentPage > 1 && (
              <li>
                <button
                  type="button"
                  onClick={() => changePage("prev")}
                  className="block border border-gray-300 bg-white px-3 py-2 leading-tight hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-zinc-600 dark:hover:bg-zinc-700 dark:hover:text-white"
                >
                  {currentPage - 1}
                </button>
              </li>
            )}
            <li>
              <button
                type="button"
                className="block border border-gray-300 bg-white px-3 py-2 text-lg font-bold leading-tight text-black hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-zinc-600 dark:text-white dark:hover:bg-zinc-700 dark:hover:text-stone-300"
              >
                {currentPage}
              </button>
            </li>
            {currentPage < Math.ceil(dataRows.length / rowsPerPage) && (
              <li>
                <button
                  type="button"
                  onClick={() => changePage("next")}
                  className="block border border-gray-300 bg-white px-3 py-2 leading-tight hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-zinc-600 dark:hover:bg-zinc-700 dark:hover:text-white"
                >
                  {currentPage + 1}
                </button>
              </li>
            )}
            <li>
              <button
                type="button"
                onClick={() => changePage("next")}
                className="block rounded-r-lg border border-gray-300 bg-white px-3 py-2 leading-tight hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-zinc-600  dark:hover:bg-zinc-700 dark:hover:text-white"
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
              </button>
            </li>
          </ul>
        </nav>
      ),
      [currentPage]
    );
  };

  const addFilter = () => {
    setFilters([
      ...filters,
      {
        column: columns[0].field.toString(),
        operator: "=",
        value: "",
      },
    ]);
  };

  const { isComponentVisible, setIsComponentVisible, ref } =
    useComponentVisible(false);

  const FilterDialog = () => {
    if (!filter) return <></>;

    return (
      <dialog
        className="absolute z-10 min-w-max rounded border bg-zinc-700 p-2"
        open={isComponentVisible}
        onClose={() => setIsComponentVisible(false)}
      >
        {filters.map((filter, index) => (
          <div
            className="rw-button-group justify-start"
            key={`filter-${index}`}
          >
            <select
              name="column"
              id="column"
              className="rw-input rw-input-small !rounded-r-none"
              value={filter.column}
              onChange={(e) => {
                const newFilters = [...filters];
                newFilters[index].column = e.target.value;
                setFilters(newFilters);
              }}
            >
              {columns.map((column, index) => (
                <option key={`column-${index}`} value={column.field}>
                  {column.label}
                </option>
              ))}
            </select>

            <select
              name="operator"
              id="operator"
              className="rw-input rw-input-small !rounded-l-none !rounded-r-none"
              value={filter.operator}
              onChange={(e) => {
                const newFilters = [...filters];
                newFilters[index].operator = e.target.value;
                setFilters(newFilters);
              }}
            >
              <option value="=">=</option>
              <option value="!=">!=</option>
              <option value=">">&gt;</option>
              <option value=">=">&gt;=</option>
              <option value="<">&lt;</option>
              <option value="<=">&lt;=</option>
              <option value="like">like</option>
              <option value="ilike">ilike</option>
              <option value="in">in</option>
              <option value="not_in">not in</option>
            </select>

            <input
              type="text"
              name="value"
              className="rw-input rw-input-small !rounded-none"
              value={filter.value}
              onChange={(e) => {
                const newFilters = [...filters];
                newFilters[index].value = e.target.value;
                setFilters(newFilters);
              }}
            />
            <button
              className="rw-button rw-button-gray rw-button-small !ml-0 !rounded-l-none"
              onClick={() => {
                const newFilters = [...filters];
                newFilters.splice(index, 1);
                setFilters(newFilters);
              }}
            >
              Remove
            </button>
          </div>
        ))}
        {filters.length === 0 && (
          <p className="m-1 text-base text-stone-400">
            No filters applied to this view
            <br />
            <span className="text-xs text-stone-500">
              Add a filter below to filter the view
            </span>
          </p>
        )}
        <hr />
        <button
          type="button"
          className="rw-button rw-button-small rw-button-gray-outline"
          onClick={() => addFilter()}
        >
          Add Filter
        </button>
      </dialog>
    );
  };

  return (
    <div
      className={clsx(
        "relative overflow-x-auto overflow-y-hidden sm:rounded-lg",
        className
      )}
    >
      {(search || filter) && (
        <div className="m-1 flex items-center justify-start space-x-3 pb-4">
          {filter && (
            <div className="relative" ref={ref}>
              <button
                className={clsx("rw-button rw-button-gray", {
                  "!text-pea-400": filters.length > 0,
                })}
                onClick={() => setIsComponentVisible(!isComponentVisible)}
              >
                {filters.length > 0
                  ? `Filtered by ${pluralize(filters.length, "rule")}`
                  : "Filter"}
              </button>
              {FilterDialog()}
            </div>
          )}
          {search && (
            <div className="relative">
              <label htmlFor="table-search" className="sr-only">
                Search
              </label>
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
                className="rw-input block w-80 rounded-lg pl-10"
                placeholder="Search for items"
              />
            </div>
          )}
        </div>
      )}

      <table className="relative mr-auto w-full table-auto text-left text-sm text-gray-700 dark:text-stone-300">
        {!!caption && (
          <caption className="bg-zinc-200 p-5 text-left text-lg font-semibold text-gray-900 dark:bg-zinc-800 dark:text-white">
            {caption.title}
            {caption.content && (
              <div className="mt-1 text-sm font-normal">{caption.content}</div>
            )}
          </caption>
        )}
        {!vertical && header && (
          <thead className="rounded-t-lg text-sm uppercase  text-zinc-700 dark:text-zinc-300">
            <tr className="table-row rounded-t-lg">
              {select && tableSelect({ header: true, row: 0 })}
              {columns.map(({ ...other }, index) => {
                return headerRenderer({
                  label: other.label,
                  columnIndex: index,
                  ...other,
                });
              })}
              {renderActions && <th className="last:rounded-tr-lg"></th>}
            </tr>
          </thead>
        )}
        <tbody className="divide-y divide-gray-400 bg-zinc-300 dark:divide-gray-800 dark:bg-zinc-600">
          {vertical
            ? columns.map(({ field, ...other }, index) => {
                return (
                  <tr
                    key={`row-${index}`}
                    className={clsx("bg-zinc-300 dark:bg-zinc-600", {
                      "hover:bg-gray-50 dark:hover:bg-zinc-700": hover,
                    })}
                    onClick={() => onRowClick && onRowClick({ index: index })}
                  >
                    {header &&
                      headerRenderer({
                        label: other.label,
                        columnIndex: index,
                        ...other,
                      })}
                    {SortedFilteredData.map((datarow, rowIndex) =>
                      cellRenderer({
                        rowData: datarow,
                        cellData: datarow[field],
                        columnIndex: index,
                        rowIndex,
                        renderCell: other.renderCell,
                        field,
                        ...other,
                      })
                    )}
                  </tr>
                );
              })
            : dataRows &&
              SortedFilteredData.map((datarow, i) => {
                return (
                  <tr
                    key={`row-${i}`}
                    className={clsx({
                      "hover:bg-gray-50 dark:hover:bg-gray-600": hover,
                    })}
                    onClick={() => onRowClick && onRowClick({ index: i })}
                  >
                    {select && tableSelect({ row: i })}
                    {columns.map(({ field, ...other }, index) =>
                      cellRenderer({
                        rowData: datarow,
                        cellData: datarow[field],
                        columnIndex: index,
                        rowIndex: i,
                        renderCell: other.renderCell,
                        field,
                        ...other,
                      })
                    )}
                    {renderActions && <td>{renderActions(datarow)}</td>}
                  </tr>
                );
              })}
          {(dataRows === null || dataRows.length === 0) && (
            <tr className="w-full">
              <td className="p-4 text-center" colSpan={100}>
                <span className="px-3 py-2 text-gray-500 dark:text-gray-400">
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

// interface Row {
//   index: number;
// }
// interface GridCell<V> {
//   columnIndex: number;
//   rowIndex: number;
//   field: ColumnData["field"];
//   value: V;
//   row?: V | ThisType<Row>;
// }

// interface ColumnData<V = any, F = V> {
//   field: string;
//   label: string;
//   numeric?: boolean;
//   className?: string;
//   bold?: boolean;
//   sortable?: boolean;
//   /**
//    * Function that allows to apply a formatter before rendering its value.
//    * @template V, F
//    * @param {GridValueFormatterParams<V>} params Object containing parameters for the formatter.
//    * @returns {F} The formatted value.
//    */
//   valueFormatter?: ({ value, row }: { value: any; row: any }) => F; // add functionality for value formatting
//   /**
//    * Allows to override the component rendered as cell for this column.
//    * @param {GridCell} params Object containing parameters for the renderer.
//    * @returns {React.ReactNode} The element to be rendered.
//    */
//   renderCell?: (params: any) => React.ReactNode;
// }

// interface TableProps {
//   columns: ColumnData[];
//   hover?: boolean;
//   onRowClick?: (row: Row) => void;
//   rows: any[];
//   vertical?: boolean;
//   summary?: boolean;
//   caption?: {
//     title: string;
//     content?: React.ReactNode;
//   };
//   className?: string;
//   select?: boolean;
//   search?: boolean;
//   filter?: boolean;
//   header?: boolean;
//   pagination?: boolean;
//   renderActions?: (row: any) => React.ReactNode;
//   /**
//    * Number of rows per page
//    * @default 10
//    */
//   rowsPerPage?: number;
//   onPageChange?: (
//     event: React.MouseEvent<HTMLButtonElement> | null,
//     page: number
//   ) => void;
//   page?: number;
// }

// /**
//  * @borrows dynamicSort and debounce from formatters.ts
//  * @param param
//  * @returns
//  */
// const Table = ({
//   columns,
//   rows: dataRows,
//   onRowClick,
//   className,
//   caption,
//   vertical = false,
//   summary = false,
//   hover = false,
//   select = false,
//   search = false,
//   header = true,
//   filter = false,
//   pagination = false,
//   rowsPerPage = 10,
//   renderActions,
// }: TableProps) => {
//   const datarows = useMemo(() => {
//     return dataRows.map((row, index) => {
//       return { ...row, tableId: index };
//     })
//   }, [dataRows])
//   const [currentPage, setCurrentPage] = useState(1);
//   const [rows, setRows] = useState<any[]>([]);
//   const [selectedRows, setSelectedRows] = useState<any[]>([]);
//   const [searchTerm, setSearchTerm] = useState<string>("");
//   const checkboxAllSelectRef = useRef(null);
//   const [sort, setSort] = useState({
//     column: "",
//     direction: "asc",
//   });

//   interface Filter {
//     column: string;
//     operator: string;
//     value: string;
//   }
//   const [filters, setFilters] = useState<Filter[]>([]);

//   const sortRows = useCallback(
//     (e) => {
//       let column = e.target.id;
//       let direction = sort.direction === "asc" ? "desc" : "asc";
//       setSort({ column, direction });
//     },
//     [sort]
//   );

//   const sortData = (data: any[], column: string, direction: string) => {
//     if (column) {
//       data.sort(dynamicSort(column));
//       if (direction === "desc") {
//         data.reverse();
//       }
//     }
//     return data;
//   };

//   const applyFilter = useCallback((filter, row) => {
//     const { column, operator, value } = filter;
//     const rowValue = row[column];

//     if (value === "" || rowValue == undefined) return true;
//     switch (operator) {
//       case "=":
//         return rowValue == value;
//       case "!=":
//         return rowValue !== value;
//       case ">":
//         return rowValue > value;
//       case "<":
//         return rowValue < value;
//       case ">=":
//         return rowValue >= value;
//       case "<=":
//         return rowValue <= value;
//       case "like":
//         return rowValue.includes(value);
//       case "ilike":
//         return !rowValue.includes(value);
//       case "in":
//         return value.includes(rowValue);
//       case "not_in":
//         return !value.includes(rowValue);
//       default:
//         return true;
//     }
//   }, []);

//   const filterData = (data) => {
//     if (filters.length === 0) {
//       return data;
//     }

//     const filterLookup = {};
//     filters.forEach((filter) => {
//       const { column } = filter;
//       if (!filterLookup[column]) {
//         filterLookup[column] = [];
//       }
//       filterLookup[column].push(filter);
//     });

//     return data.filter((row) => {
//       for (const column in filterLookup) {
//         const filters = filterLookup[column];
//         if (filters.some((filter) => !applyFilter(filter, row))) {
//           return false;
//         }
//       }
//       return true;
//     });
//   };

//   const SortedFilteredData = useMemo(() => {
//     if (!dataRows?.length) return dataRows;

//     let filteredData = dataRows.filter((row) => {
//       const rowString = Object.values(row).join(" ").toLowerCase();

//       return rowString.includes(searchTerm.toLowerCase());
//     });

//     if (filter) {
//       filteredData = filterData(filteredData);
//     }

//     if (pagination) {
//       const startIndex = (currentPage - 1) * rowsPerPage;
//       const endIndex = startIndex + rowsPerPage;
//       const sortedData = sortData(filteredData, sort.column, sort.direction);
//       return sortedData.slice(startIndex, endIndex);
//     }
//     return sortData(filteredData, sort.column, sort.direction);
//   }, [sort, searchTerm, dataRows, currentPage, pagination, filters]);

//   useEffect(() => {
//     if (select) {
//       let daRows = document.querySelectorAll(
//         'input[type="checkbox"][id^="checkbox-row"]'
//       );
//       setRows([...daRows]);
//     }
//   }, []);

//   const handleSearch = debounce((e) => setSearchTerm(e.target.value), 500);

//   const selectRow = (e) => {
//     if (e.target.id === "checkbox-all-select") {
//       const isChecked = e.target.checked;
//       rows.forEach((row) => {
//         if (row.checked !== isChecked) {
//           row.checked = isChecked;
//         }
//       });
//       setSelectedRows(rows.filter((row) => row.checked === true));
//       return;
//     }

//     const checkboxAllSelect = checkboxAllSelectRef.current;
//     if (!e.target.checked) {
//       checkboxAllSelect.checked = e.target.checked;
//     } else {
//       if (!rows.some((row) => !row.checked) && rows.length > 0) {
//         checkboxAllSelect.checked = true;
//       }
//     }
//     setSelectedRows(rows.filter((row) => row.checked === true));
//   };

//   const headerRenderer = ({ label, columnIndex, ...other }) => {
//     return (
//       <th
//         key={`headcell-${columnIndex}-${label}`}
//         className={clsx(
//           "px-3 py-3 first:rounded-tl-lg last:rounded-tr-lg bg-zinc-400 dark:bg-zinc-700",
//           other.className
//         )}
//         scope="col"
//       >
//         {other.sortable ? (
//           <div
//             className="line-clamp-1 flex select-none items-center"
//             id={other.field}
//             onClick={sortRows}
//           >
//             {label}
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="ml-1 h-3 w-3"
//               fill="currentColor"
//               viewBox="0 0 320 512"
//             >
//               {sort.column === other.field ? (
//                 sort.direction === "asc" ? (
//                   <path d="M182.6 41.4c-12.5-12.5-32.8-12.5-45.3 0l-128 128c-9.2 9.2-11.9 22.9-6.9 34.9s16.6 19.8 29.6 19.8H288c12.9 0 24.6-7.8 29.6-19.8s2.2-25.7-6.9-34.9l-128-128z" />
//                 ) : (
//                   <path d="M182.6 470.6c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-9.2-9.2-11.9-22.9-6.9-34.9s16.6-19.8 29.6-19.8H288c12.9 0 24.6 7.8 29.6 19.8s2.2 25.7-6.9 34.9l-128 128z" />
//                 )
//               ) : (
//                 <path d="M27.66 224h264.7c24.6 0 36.89-29.78 19.54-47.12l-132.3-136.8c-5.406-5.406-12.47-8.107-19.53-8.107c-7.055 0-14.09 2.701-19.45 8.107L8.119 176.9C-9.229 194.2 3.055 224 27.66 224zM292.3 288H27.66c-24.6 0-36.89 29.77-19.54 47.12l132.5 136.8C145.9 477.3 152.1 480 160 480c7.053 0 14.12-2.703 19.53-8.109l132.3-136.8C329.2 317.8 316.9 288 292.3 288z" />
//               )}
//             </svg>
//           </div>
//         ) : (
//           truncate(label, 30)
//         )}
//       </th>
//     );
//   };

//   const cellRenderer = ({
//     rowData,
//     cellData,
//     columnIndex,
//     rowIndex,
//     renderCell,
//     ...other
//   }) => {
//     // px-6 py-4
//     const className = clsx(other.className, "px-3 py-2", {
//       "font-bold": other.bold,
//       truncate: !renderCell && !other.valueFormatter,
//     });

//     if (other.numeric && !isNaN(cellData) && !renderCell) {
//       cellData = formatNumberWithThousandSeparator(parseInt(cellData));
//     }
//     const key = `cell-${rowIndex}-${columnIndex}`;

//     const valueFormatter = other.valueFormatter
//       ? other.valueFormatter({
//         // value: isNaN(cellData) ? cellData?.amount : cellData,
//         value: cellData,
//         row: rowData,
//         columnIndex,
//       })
//       : isNaN(cellData)
//         ? cellData?.amount || cellData
//         : cellData;

//     let content = renderCell
//       ? renderCell({
//         columnIndex,
//         rowIndex,
//         value: valueFormatter,
//         field: other.field,
//         row: rowData,
//       })
//       : valueFormatter;

//     return (
//       <td key={key} className={className}>
//         {content}
//       </td>
//     );
//   };

//   const tableSelect = ({
//     header = false,
//     row,
//   }: {
//     header?: boolean;
//     row: number;
//   }) => {
//     return (
//       <td className={clsx("w-4 p-4", {
//         "bg-zinc-400 dark:bg-zinc-700 first:rounded-tl-lg": header,
//       })} scope="col">
//         <div className="flex items-center">
//           <input
//             id={header ? "checkbox-all-select" : `checkbox-row-${row}`}
//             ref={header ? checkboxAllSelectRef : null}
//             onChange={selectRow}
//             type="checkbox"
//             className="rw-input h-4 w-4"
//           />
//           <label
//             htmlFor={header ? "checkbox-all-select" : `checkbox-row-${row}`}
//             className="sr-only"
//           >
//             checkbox
//           </label>
//         </div>
//       </td>
//     );
//   };

//   const tableFooter = () => {
//     let total = 0;

//     const columnData = useMemo(
//       () =>
//         columns.map(
//           ({ field, className, valueFormatter, label, ...other }) => ({
//             field,
//             className,
//             valueFormatter,
//             label,
//             numeric: other.numeric,
//           })
//         ),
//       [columns]
//     );
//     return (
//       <tfoot>
//         <tr className="bg-gray-400 font-semibold text-gray-900 dark:bg-zinc-700 dark:text-white">
//           {select && !vertical && <td className="p-4"></td>}
//           {!vertical &&
//             columnData.map(
//               ({ field, numeric, className, valueFormatter }, index) => {
//                 const sum = numeric
//                   ? SortedFilteredData.filter((r, i) =>
//                     select && selectedRows.length > 0
//                       ? rows
//                         .map((d: any, k) => {
//                           return d.checked ? k : -1;
//                         })
//                         .includes(i)
//                       : true
//                   ).reduce((a, b) => {
//                     const cellData = b[field];
//                     const valueFormatted = valueFormatter
//                       ? valueFormatter({ value: cellData, row: b })
//                       : cellData;

//                     return (
//                       a +
//                       parseInt(
//                         isNaN(valueFormatted)
//                           ? valueFormatted?.amount
//                           : valueFormatted
//                       )
//                     );
//                   }, 0)
//                   : // ? SortedFilteredData.filter((r, i) =>
//                   //   select && selectedRows.length > 0
//                   //     ? rows
//                   //       .map((d: any, k) => {
//                   //         return d.checked ? k : -1;
//                   //       })
//                   //       .includes(i)
//                   //     : true
//                   // ).reduce((a, b) => a + parseInt(b[field]), 0)
//                   0;

//                 total += numeric ? sum : 0;
//                 return (
//                   <th
//                     key={`${index}-${field}`}
//                     className={clsx(
//                       "px-3 py-4",
//                       className,
//                       numeric && "test-base"
//                     )}
//                   >
//                     {numeric ? sum : index === 0 ? "Total" : ""}
//                   </th>
//                 );
//               }
//             )}
//           {renderActions && <th></th>}
//         </tr>
//       </tfoot>
//     );
//   };

//   const tablePagination = () => {
//     const totalRows = dataRows.length || rows.length;
//     const lastRowIndex =
//       currentPage * rowsPerPage > totalRows
//         ? totalRows
//         : currentPage * rowsPerPage;
//     const firstRowIndex = currentPage * rowsPerPage - rowsPerPage;

//     const changePage = useCallback(
//       (dir: "next" | "prev") => {
//         if (dir === "prev" && currentPage > 1) {
//           setCurrentPage(currentPage - 1);
//         } else if (
//           dir === "next" &&
//           currentPage < Math.ceil(totalRows / rowsPerPage)
//         ) {
//           setCurrentPage(currentPage + 1);
//         }
//       },
//       [currentPage, dataRows.length, rowsPerPage]
//     );
//     return useMemo(
//       () => (
//         <nav
//           className="flex items-center justify-between pt-4"
//           aria-label="Table navigation"
//         >
//           <span className="ml-1 text-sm font-normal text-gray-500 dark:text-gray-400">
//             Showing{" "}
//             <span className="font-semibold text-gray-900 dark:text-white">
//               {firstRowIndex + 1}-{lastRowIndex}
//             </span>{" "}
//             of{" "}
//             <span className="font-semibold text-gray-900 dark:text-white">
//               {totalRows}
//             </span>
//           </span>
//           <ul className="inline-flex items-center -space-x-px text-gray-500 dark:text-gray-400">
//             <li>
//               <button
//                 type="button"
//                 disabled={currentPage === 1}
//                 onClick={() => changePage("prev")}
//                 className="ml-0 block rounded-l-lg border border-gray-300 bg-white px-3 py-2 leading-tight hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-zinc-600 dark:hover:bg-zinc-700 dark:hover:text-white"
//               >
//                 <span className="sr-only">Previous</span>
//                 <svg
//                   className="h-5 w-5"
//                   aria-hidden="true"
//                   fill="currentColor"
//                   viewBox="0 0 20 20"
//                   xmlns="http://www.w3.org/2000/svg"
//                 >
//                   <path
//                     fillRule="evenodd"
//                     d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
//                     clipRule="evenodd"
//                   />
//                 </svg>
//               </button>
//             </li>

//             {currentPage > 1 && (
//               <li>
//                 <button
//                   type="button"
//                   onClick={() => changePage("prev")}
//                   className="block border border-gray-300 bg-white px-3 py-2 leading-tight hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-zinc-600 dark:hover:bg-zinc-700 dark:hover:text-white"
//                 >
//                   {currentPage - 1}
//                 </button>
//               </li>
//             )}
//             <li>
//               <button
//                 type="button"
//                 className="block border border-gray-300 bg-white px-3 py-2 text-lg font-bold leading-tight text-black hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-zinc-600 dark:text-white dark:hover:bg-zinc-700 dark:hover:text-stone-300"
//               >
//                 {currentPage}
//               </button>
//             </li>
//             {currentPage < Math.ceil(dataRows.length / rowsPerPage) && (
//               <li>
//                 <button
//                   type="button"
//                   onClick={() => changePage("next")}
//                   className="block border border-gray-300 bg-white px-3 py-2 leading-tight hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-zinc-600 dark:hover:bg-zinc-700 dark:hover:text-white"
//                 >
//                   {currentPage + 1}
//                 </button>
//               </li>
//             )}
//             <li>
//               <button
//                 type="button"
//                 onClick={() => changePage("next")}
//                 className="block rounded-r-lg border border-gray-300 bg-white px-3 py-2 leading-tight hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-zinc-600  dark:hover:bg-zinc-700 dark:hover:text-white"
//               >
//                 <span className="sr-only">Next</span>
//                 <svg
//                   className="h-5 w-5"
//                   aria-hidden="true"
//                   fill="currentColor"
//                   viewBox="0 0 20 20"
//                   xmlns="http://www.w3.org/2000/svg"
//                 >
//                   <path
//                     fillRule="evenodd"
//                     d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
//                     clipRule="evenodd"
//                   ></path>
//                 </svg>
//               </button>
//             </li>
//           </ul>
//         </nav>
//       ),
//       [currentPage]
//     );
//   };

//   const addFilter = () => {
//     setFilters([
//       ...filters,
//       {
//         column: columns[0].field.toString(),
//         operator: "=",
//         value: "",
//       },
//     ]);
//   };

//   const { isComponentVisible, setIsComponentVisible, ref } =
//     useComponentVisible(false);

//   const FilterDialog = () => {
//     if (!filter) return <></>

//     return (
//       <dialog className="absolute z-10 min-w-max rounded border bg-zinc-700 p-2" open={isComponentVisible} onClose={() => setIsComponentVisible(false)}>
//         {filters.map((filter, index) => (
//           <div
//             className="rw-button-group justify-start"
//             key={`filter-${index}`}
//           >
//             <select
//               name="column"
//               id="column"
//               className="rw-input rw-input-small !rounded-r-none"
//               value={filter.column}
//               onChange={(e) => {
//                 const newFilters = [...filters];
//                 newFilters[index].column = e.target.value;
//                 setFilters(newFilters);
//               }}
//             >
//               {columns.map((column, index) => (
//                 <option key={`column-${index}`} value={column.field}>
//                   {column.label}
//                 </option>
//               ))}
//             </select>

//             <select
//               name="operator"
//               id="operator"
//               className="rw-input rw-input-small !rounded-l-none !rounded-r-none"
//               value={filter.operator}
//               onChange={(e) => {
//                 const newFilters = [...filters];
//                 newFilters[index].operator = e.target.value;
//                 setFilters(newFilters);
//               }}
//             >
//               <option value="=">=</option>
//               <option value="!=">!=</option>
//               <option value=">">&gt;</option>
//               <option value=">=">&gt;=</option>
//               <option value="<">&lt;</option>
//               <option value="<=">&lt;=</option>
//               <option value="like">like</option>
//               <option value="ilike">ilike</option>
//               <option value="in">in</option>
//               <option value="not_in">not in</option>
//             </select>

//             <input
//               type="text"
//               name="value"
//               className="rw-input rw-input-small !rounded-none"
//               value={filter.value}
//               onChange={(e) => {
//                 const newFilters = [...filters];
//                 newFilters[index].value = e.target.value;
//                 setFilters(newFilters);
//               }}
//             />
//             <button
//               className="rw-button rw-button-gray rw-button-small !ml-0 !rounded-l-none"
//               onClick={() => {
//                 const newFilters = [...filters];
//                 newFilters.splice(index, 1);
//                 setFilters(newFilters);
//               }}
//             >
//               Remove
//             </button>
//           </div>
//         ))}
//         {filters.length === 0 && (
//           <p className="m-1 text-base text-stone-400">
//             No filters applied to this view
//             <br />
//             <span className="text-xs text-stone-500">
//               Add a filter below to filter the view
//             </span>
//           </p>
//         )}
//         <hr />
//         <button
//           type="button"
//           className="rw-button rw-button-small rw-button-gray-outline"
//           onClick={() => addFilter()}
//         >
//           Add Filter
//         </button>
//       </dialog>
//     )
//   }

//   return (
//     <div
//       className={clsx(
//         "relative overflow-x-auto overflow-y-hidden sm:rounded-lg",
//         className
//       )}
//     >
//       {(search || filter) && (
//         <div className="m-1 flex items-center justify-start space-x-3 pb-4">
//           {filter && (
//             <div className="relative" ref={ref}>
//               <button
//                 className={clsx("rw-button rw-button-gray", {
//                   "!text-pea-400": filters.length > 0,
//                 })}
//                 onClick={() => setIsComponentVisible(!isComponentVisible)}
//               >
//                 {filters.length > 0
//                   ? `Filtered by ${pluralize(filters.length, "rule")}`
//                   : "Filter"}
//               </button>
//               {FilterDialog()}
//             </div>
//           )}
//           {search && (
//             <div className="relative">
//               <label htmlFor="table-search" className="sr-only">
//                 Search
//               </label>
//               <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
//                 <svg
//                   className="h-5 w-5 text-gray-500 dark:text-gray-400"
//                   aria-hidden="true"
//                   fill="currentColor"
//                   viewBox="0 0 20 20"
//                   xmlns="http://www.w3.org/2000/svg"
//                 >
//                   <path
//                     fillRule="evenodd"
//                     d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
//                     clipRule="evenodd"
//                   ></path>
//                 </svg>
//               </div>
//               <input
//                 id="table-search"
//                 onChange={handleSearch}
//                 className="rw-input block w-80 rounded-lg pl-10"
//                 placeholder="Search for items"
//               />
//             </div>
//           )}
//         </div>
//       )}

//       <table className="relative mr-auto w-full table-auto text-left text-sm text-gray-700 dark:text-stone-300">
//         {!!caption && (
//           <caption className="bg-zinc-200 p-5 text-left text-lg font-semibold text-gray-900 dark:bg-zinc-800 dark:text-white">
//             {caption.title}
//             {caption.content && (
//               <div className="mt-1 text-sm font-normal">{caption.content}</div>
//             )}
//           </caption>
//         )}
//         {!vertical && header && (
//           <thead className="text-sm uppercase text-zinc-700  dark:text-zinc-300 rounded-t-lg">
//             <tr className="table-row rounded-t-lg">
//               {select && tableSelect({ header: true, row: 0 })}
//               {columns.map(({ ...other }, index) => {
//                 return headerRenderer({
//                   label: other.label,
//                   columnIndex: index,
//                   ...other,
//                 });
//               })}
//               {renderActions && <th className="last:rounded-tr-lg"></th>}
//             </tr>
//           </thead>
//         )}
//         <tbody className="divide-y divide-gray-400 bg-zinc-300 dark:divide-gray-800 dark:bg-zinc-600">
//           {vertical
//             ? columns.map(({ field, ...other }, index) => {
//               return (
//                 <tr
//                   key={`row-${index}`}
//                   className={clsx("bg-zinc-300 dark:bg-zinc-600", {
//                     "hover:bg-gray-50 dark:hover:bg-zinc-700": hover,
//                   })}
//                   onClick={() => onRowClick && onRowClick({ index: index })}
//                 >
//                   {header &&
//                     headerRenderer({
//                       label: other.label,
//                       columnIndex: index,
//                       ...other,
//                     })}
//                   {SortedFilteredData.map((datarow, rowIndex) =>
//                     cellRenderer({
//                       rowData: datarow,
//                       cellData: datarow[field],
//                       columnIndex: index,
//                       rowIndex,
//                       renderCell: other.renderCell,
//                       field,
//                       ...other,
//                     })
//                   )}
//                 </tr>
//               );
//             })
//             : dataRows &&
//             SortedFilteredData.map((datarow, i) => {
//               return (
//                 <tr
//                   key={`row-${i}`}
//                   className={clsx({
//                     "hover:bg-gray-50 dark:hover:bg-gray-600": hover,
//                   })}
//                   onClick={() => onRowClick && onRowClick({ index: i })}
//                 >
//                   {select && tableSelect({ row: i })}
//                   {columns.map(({ field, ...other }, index) =>
//                     cellRenderer({
//                       rowData: datarow,
//                       cellData: datarow[field],
//                       columnIndex: index,
//                       rowIndex: i,
//                       renderCell: other.renderCell,
//                       field,
//                       ...other,
//                     })
//                   )}
//                   {renderActions && <td>{renderActions(datarow)}</td>}
//                 </tr>
//               );
//             })}
//           {(dataRows === null || dataRows.length === 0) && (
//             <tr className="w-full">
//               <td className="p-4 text-center" colSpan={100}>
//                 <span className="px-3 py-2 text-gray-500 dark:text-gray-400">
//                   No data found
//                 </span>
//               </td>
//             </tr>
//           )}
//         </tbody>
//         {summary && tableFooter()}
//       </table>
//       {pagination && tablePagination()}
//     </div>
//   );
// };
