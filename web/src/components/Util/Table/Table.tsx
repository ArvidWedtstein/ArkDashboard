import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  debounce,
  dynamicSort,
  formatNumber,
  pluralize,
  truncate,
} from "src/lib/formatters";
import clsx from "clsx";
import useComponentVisible from "src/components/useComponentVisible";
import { Form, SelectField, Submit, TextField } from "@redwoodjs/forms";
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
interface Filter {
  column: string;
  operator: string;
  value: string;
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
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const checkboxAllSelectRef = useRef(null);
  const [filters, setFilters] = useState<Filter[]>([]);
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
  // const SortedFilteredData = useMemo(() => {
  //   // 1. Filter
  //   // 2. Search
  //   // 3. Sort
  //   // 4. Paginate
  //   // 5. Select
  //   if (!dataRows?.length) return [];

  //   if (dataRows.some((r) => !r.hasOwnProperty("selected"))) {
  //     dataRows = dataRows.map((r) => ({ ...r, selected: false }));
  //   }

  //   let filteredData = filterData(dataRows);

  //   if (searchTerm) {
  //     filteredData = filteredData.filter((row) => {
  //       const rowString = Object.values(row).join(" ").toLowerCase();
  //       return rowString.includes(searchTerm.toLowerCase());
  //     });
  //   }
  //   if (sort.column) {
  //     filteredData = sortData(filteredData, sort.column, sort.direction);
  //   }

  //   const startIndex = (currentPage - 1) * rowsPerPage;
  //   const endIndex = startIndex + rowsPerPage;

  //   // return {
  //   //   rows: filteredData,
  //   //   pages: filteredData.slice(startIndex, endIndex)
  //   // }
  //   console.log(dataRows)
  //   return filteredData
  // }, [sort, searchTerm, currentPage, selectRow, dataRows, pagination, filters]);

  // useEffect(() => {
  //   if (select) {
  //     let daRows = document.querySelectorAll(
  //       'input[type="checkbox"][id^="checkbox-row"]'
  //     );
  //     setRows([...daRows]);
  //   }
  // }, []);

  const handleSearch = debounce((e) => setSearchTerm(e.target.value), 500);



  const headerRenderer = ({ label, columnIndex, ...other }) => {
    return (
      <th
        key={`headcell-${columnIndex}-${label}`}
        id={`headcell-${other.field}`}
        className={clsx(
          "bg-zinc-400 px-3 py-3 first:rounded-tl-lg last:rounded-tr-lg dark:bg-zinc-700",
          other.className
        )}
        scope="col"
      >

        <div
          className="line-clamp-1 flex select-none items-center"
          id={other.field}
          onClick={sortRows}
        >
          {label}
          {other.sortable && (
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
          )}
        </div>

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
      cellData = formatNumber(parseInt(cellData));
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
      <td headers={`headcell-${other.field}`} key={key} className={clsx("bg-zinc-100 dark:bg-zinc-800", className)}>
        {content}
      </td>
    );
  };

  const tableSelect = ({
    header = false,
    row,
    datarow,
  }: {
    header?: boolean;
    row: number;
    datarow?: any
  }) => {
    return (
      <td
        className={clsx("w-4 p-4", {
          "first:rounded-tl-lg bg-zinc-400 dark:bg-zinc-700": header,
          "bg-zinc-100 dark:bg-zinc-800": !header,
        })}
        scope="col"
      >
        <div className="flex items-center">
          <input
            id={header ? "checkbox-all-select" : `checkbox-row-${row}`}
            ref={header ? checkboxAllSelectRef : null}
            // checked={datarow?.selected || false}
            onChange={selectRow}
            type="checkbox"
            className="rw-input rw-checkbox h-4 w-4"
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
        <tr className="font-semibold text-gray-900  dark:text-white rounded-b-lg">
          {select && <td className="p-4 first:rounded-bl-lg bg-zinc-400 dark:bg-zinc-700"></td>}
          {
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
                  :
                  0;

                total += numeric ? sum : 0;
                return (
                  <th
                    key={`${index}-${field}`}
                    className={clsx(
                      "px-3 py-4 bg-zinc-400 dark:bg-zinc-700 last:rounded-br-lg first:rounded-bl-lg",
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
    const totalPageCount = Math.ceil(totalRows / rowsPerPage);

    const paginationRange = () => {
      const siblingCount = 1;

      const range = (start, end) => {
        const result = [];
        for (let i = start; i <= end; i++) {
          result.push(i);
        }
        return result;
      };

      if (totalPageCount <= siblingCount + 5) {
        return range(1, totalPageCount);
      }

      const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
      const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPageCount);

      const shouldShowLeftDots = leftSiblingIndex > 2;
      const shouldShowRightDots = rightSiblingIndex < totalPageCount - 2;

      const result = [];

      if (shouldShowLeftDots) {
        result.push(1);
        if (leftSiblingIndex > 3) {
          result.push("...");
        }
      }

      for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
        result.push(i);
      }

      if (shouldShowRightDots) {
        if (rightSiblingIndex < totalPageCount - 2) {
          result.push("...");
        }
        result.push(totalPageCount);
      }

      return result;
    };


    const changePage = useCallback(
      (dir: "next" | "prev") => {
        if (dir === "prev" && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        } else if (
          dir === "next" &&
          currentPage < totalPageCount
        ) {
          setCurrentPage(currentPage + 1);
        }
      },
      [currentPage, dataRows.length, rowsPerPage]
    );
    return useMemo(
      () => (
        <nav
          className="flex items-center justify-end pt-4"
        >
          <nav
            className="rw-button-group m-0 leading-tight"
            aria-label="Page navigation"
          >
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => changePage("prev")}
              className="rw-pagination-item"
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
            {paginationRange().map((page, index) => (
              <button
                key={`page-${index}`}
                type="button"
                disabled={isNaN(page)}
                onClick={() => setCurrentPage(isNaN(page) ? 1 : page)}
                className={clsx("rw-pagination-item", {
                  "rw-pagination-item-active": currentPage === page,
                })}
              >
                {page}
              </button>
            ))}
            <button
              type="button"
              disabled={currentPage === totalPageCount}
              onClick={() => changePage("next")}
              className="rw-pagination-item"
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
          </nav>
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
        </nav>
      ),
      [currentPage, filters]
    );
  };

  const addFilter = (e?) => {
    console.log(e)
    setFilters((prev) => [...prev, {
      column: e.column,
      operator: e.operator,
      value: e.value,
    }])
  };

  const { isComponentVisible, setIsComponentVisible, ref } =
    useComponentVisible(false);

  return (
    <div
      className={clsx(
        "relative overflow-x-auto overflow-y-hidden sm:rounded-lg",
        className
      )}
    >
      {(search || filter) && (
        <div className="my-2 flex items-center justify-start space-x-3">
          {filter && (
            <div className="relative w-fit" ref={ref}>
              <button
                className="rw-button rw-button-gray-outline m-0"
                onClick={() => setIsComponentVisible(!isComponentVisible)}
              >
                <span className="sr-only">Filter</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 640 512"
                  className="pointer-events-none w-6"
                  fill="currentColor"
                  stroke="currentColor"
                >
                  {filters.length > 0 ? (
                    <path d="M479.3 32H32.7C5.213 32-9.965 63.28 7.375 84.19L192 306.8V400c0 7.828 3.812 15.17 10.25 19.66l80 55.98C286.5 478.6 291.3 480 295.9 480C308.3 480 320 470.2 320 455.1V306.8l184.6-222.6C521.1 63.28 506.8 32 479.3 32zM295.4 286.4L288 295.3v145.3l-64-44.79V295.3L32.7 64h446.6l.6934-.2422L295.4 286.4z" />
                  ) : (
                    <path d="M352 440.6l-64-44.79V312.3L256 287V400c0 7.828 3.812 15.17 10.25 19.66l80 55.98C350.5 478.6 355.3 480 359.9 480C372.3 480 384 470.2 384 455.1v-67.91l-32-25.27V440.6zM543.3 64l.6934-.2422l-144.1 173.8l25.12 19.84l143.6-173.2C585.1 63.28 570.8 32 543.3 32H139.6l40.53 32H543.3zM633.9 483.4L25.92 3.42c-6.938-5.453-17-4.25-22.48 2.641c-5.469 6.938-4.281 17 2.641 22.48l608 480C617 510.9 620.5 512 623.1 512c4.734 0 9.422-2.094 12.58-6.078C642 498.1 640.8 488.9 633.9 483.4z" />
                  )}
                </svg>
                {filters.length > 0 && (
                  <div className="absolute -top-2 -right-2 inline-flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-red-500 text-xs font-bold text-white dark:border-gray-900">
                    {filters.length}
                  </div>
                )}
              </button>
              <dialog
                className={`z-10 rounded border bg-zinc-600 dark:bg-zinc-900 p-3`}
                open={isComponentVisible}
                onClose={() => setIsComponentVisible(false)}
              >
                <Form
                  className="flex flex-col"
                  method="dialog"
                  onSubmit={(e) => {
                    addFilter(e)
                  }}
                >
                  {filters.map(
                    ({ column, operator, value }, index) => (
                      <div
                        className="rw-button-group my-1 justify-start"
                        key={`filter-${index}`}
                      >
                        <select
                          name="column"
                          className="rw-input rw-input-small"
                          defaultValue={column}
                        >
                          {columns.map((column, idx) => (
                            <option key={`filter-${index}-column-${idx}`}>
                              {column.field}
                            </option>
                          ))}
                        </select>
                        <select
                          name="operator"
                          className="rw-input rw-input-small"
                          defaultValue={operator}
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
                          name="value"
                          className="rw-input rw-input-small"
                          defaultValue={value}
                        />
                        <button
                          className="rw-button rw-button-small rw-button-red"
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            const newFilters = [...filters];
                            newFilters.splice(index, 1);
                            setFilters(newFilters);
                          }}
                        >
                          -
                        </button>
                      </div>
                    )
                  )}
                  <div className="rw-button-group justify-start">
                    <SelectField
                      name="column"
                      className="rw-input rw-input-small"
                    >
                      {columns.map((column, index) => (
                        <option key={`column-option-${index}`}>
                          {column.field}
                        </option>
                      ))}
                    </SelectField>
                    <SelectField
                      name="operator"
                      className="rw-input rw-input-small"
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
                    </SelectField>
                    <TextField
                      name="value"
                      className="rw-input rw-input-small"
                    />
                    <Submit className="rw-button rw-button-small rw-button-green">
                      +
                    </Submit>
                  </div>
                  <div className="rw-button-group justify-end">
                    <button
                      className="rw-button rw-button-small rw-button-gray"
                      value="cancel"
                      formMethod="dialog"
                      type="button"
                      onClick={() => setIsComponentVisible(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className="rw-button rw-button-small rw-button-green"
                      id="confirmBtn"
                      formMethod="dialog"
                      type="button"
                      onClick={() => setIsComponentVisible(false)}
                    >
                      Confirm
                    </button>
                  </div>
                </Form>
              </dialog>
            </div>
          )}
          {
            search && (
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
            )
          }
        </div >
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
        {header && (
          <thead className="text-sm uppercase text-zinc-700 dark:text-zinc-300">
            <tr className="table-row rounded-t-lg">
              {select && tableSelect({ header: true, row: -1 })}
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
        <tbody className="divide-y divide-gray-400 dark:divide-gray-800 ">
          {dataRows &&
            SortedFilteredData.map((datarow, i) => {
              return (
                <tr
                  key={`row-${i}`}
                  className={clsx({
                    "hover:bg-gray-50 dark:hover:bg-gray-600": hover,
                  })}
                  onClick={() => onRowClick && onRowClick({ index: i })}
                >
                  {select && tableSelect({ datarow, row: i })}
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
              <td headers="" className="p-4 text-center" colSpan={100}>
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
    </div >
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
//       cellData = formatNumber(parseInt(cellData));
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
