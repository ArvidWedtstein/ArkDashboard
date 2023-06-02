import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  IntRange,
  debounce,
  dynamicSort,
  formatNumber,
} from "src/lib/formatters";
import clsx from "clsx";
import useComponentVisible from "src/components/useComponentVisible";
import { Form, SelectField, Submit, TextField } from "@redwoodjs/forms";
import { toast } from "@redwoodjs/web/dist/toast";
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
  className?: string;
  select?: boolean;
  search?: boolean;
  filter?: boolean;
  header?: boolean;
  pagination?: boolean;
  borders?: {
    vertical?: boolean;
    horizontal?: boolean;
  };
  settings?: {
    page?: {
      rowsPerPage?: IntRange<1, 100>;
      pageSizeOptions?: number[];
    };
  };
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

  toolbar?: React.ReactNode[];
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
  summary = false,
  hover = false,
  select = false,
  search = false,
  header = true,
  filter = false,
  pagination = false,
  borders = {
    vertical: false,
    horizontal: true,
  },
  rowsPerPage = 10,
  renderActions,
  toolbar = [],
}: TableProps) => {
  const columnData = useMemo(() => columns, [columns]);

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
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

  const SortedFilteredData = useMemo(() => {
    if (!dataRows?.length) return dataRows;
    if (dataRows.every((r) => !r.hasOwnProperty("row_id"))) {
      dataRows = dataRows.map((r, i) => ({ ...r, row_id: `row-${i}` }));
    }
    let filteredData = dataRows;

    if (search) {
      filteredData = filteredData.filter((row) => {
        const rowString = Object.entries(row)
          .map(([k, v]) => columns.some((c) => c.field === k) && v)
          .join(" ")
          .toLowerCase();

        return rowString.includes(searchTerm.toLowerCase());
      });
    }

    if (filter) {
      filteredData = filterData(filteredData);
    }

    if (sort.column) {
      filteredData = sortData(filteredData, sort.column, sort.direction);
    }

    return filteredData;
  }, [sort, searchTerm, dataRows, pagination, filters]);

  // TODO: Update paginateddata when filters change, search term changes
  const PaginatedData = useMemo(() => {
    if (!pagination) return SortedFilteredData;

    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;

    return SortedFilteredData.slice(startIndex, endIndex);
  }, [SortedFilteredData, currentPage]);

  const handleSearch = debounce((e) => setSearchTerm(e.target.value), 500);

  const handleRowSelect = (event, id?) => {
    if (event.target.id === "checkbox-all-select") {
      return setSelectedRows(
        event.target.checked ? PaginatedData.map((row) => row.row_id) : []
      );
    }
    const selectedIndex = selectedRows.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedRows, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedRows.slice(1));
    } else if (selectedIndex === selectedRows.length - 1) {
      newSelected = newSelected.concat(selectedRows.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedRows.slice(0, selectedIndex),
        selectedRows.slice(selectedIndex + 1)
      );
    }

    setSelectedRows(newSelected);
  };

  const isSelected = (id) => selectedRows.indexOf(id) !== -1;

  const headerRenderer = ({ label, columnIndex, ...other }) => {
    return (
      <th
        key={`headcell-${columnIndex}-${label}`}
        id={`headcell-${other.field}`}
        className={clsx(
          "bg-zinc-400 px-3 py-3 first:rounded-tl-lg last:rounded-tr-lg dark:bg-zinc-800",
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
    const className = clsx(
      other.className,
      "px-3 py-2 bg-zinc-100 dark:bg-zinc-600",
      {
        "font-bold": other.bold,
        truncate: !renderCell && !other.valueFormatter,
        "dark:!bg-zinc-700 !bg-zinc-300": isSelected(rowData.row_id),
      }
    );

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
      <td headers={`headcell-${other.field}`} key={key} className={className}>
        {content}
      </td>
    );
  };

  const tableSelect = ({
    header = false,
    datarow,
  }: {
    header?: boolean;
    datarow?: any;
  }) => {
    return (
      <td
        className={clsx("w-4 p-4", {
          "bg-zinc-400 first:rounded-tl-lg dark:bg-zinc-800": header,
          "bg-zinc-100 dark:bg-zinc-600": !header,
          "!bg-zinc-300 dark:!bg-zinc-700":
            !header && isSelected(datarow.row_id),
        })}
        scope="col"
      >
        <div className="flex items-center">
          <input
            id={header ? "checkbox-all-select" : datarow.row_id}
            checked={
              header
                ? PaginatedData.every((row) =>
                    selectedRows.includes(row.row_id)
                  )
                : isSelected(datarow.row_id)
            }
            onChange={(e) => handleRowSelect(e, datarow?.row_id)}
            type="checkbox"
            className="rw-input rw-checkbox m-0"
          />
          <label
            htmlFor={header ? "checkbox-all-select" : datarow.row_id}
            className="sr-only"
          >
            checkbox
          </label>
        </div>
      </td>
    );
  };

  const calculateSum = (field, valueFormatter) => {
    return PaginatedData.filter(
      (r) => !selectedRows.length || selectedRows.includes(r.row_id)
    ).reduce((sum, row) => {
      const cellData = row[field];
      const valueFormatted = valueFormatter
        ? valueFormatter({ value: cellData, row })
        : cellData;
      const value = parseInt(
        isNaN(valueFormatted) ? valueFormatted?.amount : valueFormatted
      );
      return sum + value;
    }, 0);
  };

  const tableFooter = () => (
    <tfoot>
      <tr
        className={clsx(
          "rounded-b-lg font-semibold text-gray-900 dark:text-white",
          {
            "divide-x divide-gray-400 dark:divide-zinc-800": borders.vertical,
          }
        )}
      >
        {select && (
          <td className="bg-zinc-400 px-3 py-4 first:rounded-bl-lg dark:bg-zinc-800" />
        )}
        {columnData.map(
          ({ label, field, numeric, className, valueFormatter }, index) => {
            const sum = calculateSum(field, valueFormatter);

            const key = `${field}-${label}`; // Use a unique identifier for the key
            return (
              <td
                key={key}
                className={clsx(
                  "bg-zinc-400 px-3 py-4 first:rounded-bl-lg last:rounded-br-lg dark:bg-zinc-800",
                  className,
                  numeric && "test-base"
                )}
              >
                {numeric ? sum : index === 0 ? "Total" : "-"}
              </td>
            );
          }
        )}
        {renderActions && <th></th>}
      </tr>
    </tfoot>
  );

  const paginationRange = (currentPage, totalPageCount) => {
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
    const rightSiblingIndex = Math.min(
      currentPage + siblingCount,
      totalPageCount
    );

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
    (dir) => {
      if (dir === "prev" && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      } else if (
        dir === "next" &&
        currentPage < Math.ceil(SortedFilteredData.length / rowsPerPage)
      ) {
        setCurrentPage(currentPage + 1);
      }
    },
    [currentPage, SortedFilteredData]
  );

  const tablePagination = () => {
    const totalPageCount = Math.ceil(SortedFilteredData.length / rowsPerPage);
    const startRowIndex = currentPage * rowsPerPage - rowsPerPage + 1;
    const endRowIndex = Math.min(
      currentPage * rowsPerPage,
      SortedFilteredData.length
    );
    const range = useMemo(
      () => paginationRange(currentPage, totalPageCount),
      [currentPage, totalPageCount]
    );

    const paginationButtons = range.map((page, index) => (
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
    ));

    // TODO: Implement rowsPerPage functionality
    return (
      <nav className="my-2 flex items-center justify-end space-x-2 text-center text-sm text-zinc-800 dark:text-gray-400">
        Rows per page&nbsp;
        <select
          disabled={dataRows.length == 0}
          className="rw-input rw-input-small !m-0"
          onChange={(e) => {
            debounce(() => {}, 500)();
          }}
          defaultValue={rowsPerPage}
        >
          <option>{rowsPerPage}</option>
          <option>{30}</option>
          <option>{50}</option>
        </select>
        <div
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
          {paginationButtons}
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
        </div>
        <span className="font-normal">
          Showing{" "}
          <span className="font-semibold text-gray-900 dark:text-white">
            {startRowIndex}-{endRowIndex}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-gray-900 dark:text-white">
            {SortedFilteredData.length}
          </span>
        </span>
      </nav>
    );
  };

  const copyToClipboard = () => {
    const textToCopy = SortedFilteredData.filter((row) =>
      selectedRows.includes(row.row_id)
    )
      .map((row) => {
        return Object.entries(row)
          .map(([key, value]) => {
            const col = columns.find((col) => col.field === key);
            if (col) {
              const formattedValue = col.valueFormatter
                ? col.valueFormatter({ value, row })
                : value;
              return `${key}: ${formattedValue}`;
            }
          })
          .join(", ");
      })
      .join(", ");

    navigator.clipboard.writeText(textToCopy);
    toast.success("Copied to clipboard");
  };

  const addFilter = (e?) => {
    setFilters((prev) => [
      ...prev,
      {
        column: e.column,
        operator: e.operator,
        value: e.value,
      },
    ]);
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
              className={`z-10 rounded border bg-zinc-600 p-3 dark:bg-zinc-900`}
              open={isComponentVisible}
              onClose={() => setIsComponentVisible(false)}
            >
              <Form
                className="flex flex-col"
                method="dialog"
                onSubmit={(e) => {
                  addFilter(e);
                }}
              >
                {filters.map(({ column, operator, value }, index) => (
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
                ))}
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
                  <TextField name="value" className="rw-input rw-input-small" />
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
        {select && (
          <button
            className="rw-button rw-button-gray-outline"
            title="Export"
            disabled={selectedRows.length === 0}
            onClick={copyToClipboard}
          >
            <span className="sr-only">Export</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="pointer-events-none h-5"
              viewBox="0 0 576 512"
              fill="currentColor"
              stroke="currentColor"
            >
              <path d="M208 112c-4.094 0-8.188 1.562-11.31 4.688c-6.25 6.25-6.25 16.38 0 22.62l80 80c6.25 6.25 16.38 6.25 22.62 0l80-80c6.25-6.25 6.25-16.38 0-22.62s-16.38-6.25-22.62 0L304 169.4V16C304 7.156 296.8 0 288 0S272 7.156 272 16v153.4L219.3 116.7C216.2 113.6 212.1 112 208 112zM512 0h-144C359.2 0 352 7.162 352 16C352 24.84 359.2 32 368 32H512c17.67 0 32 14.33 32 32v192H32V64c0-17.67 14.33-32 32-32h144C216.8 32 224 24.84 224 16C224 7.162 216.8 0 208 0H64C28.65 0 0 28.65 0 64v288c0 35.35 28.65 64 64 64h149.7l-19.2 64H144C135.2 480 128 487.2 128 496S135.2 512 144 512h288c8.836 0 16-7.164 16-16S440.8 480 432 480h-50.49l-19.2-64H512c35.35 0 64-28.65 64-64V64C576 28.65 547.3 0 512 0zM227.9 480l19.2-64h81.79l19.2 64H227.9zM544 352c0 17.64-14.36 32-32 32H64c-17.64 0-32-14.36-32-32V288h512V352z" />
            </svg>
          </button>
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
              className="rw-input m-0 pl-10"
              placeholder="Search for items"
            />
          </div>
        )}
        {toolbar.map((item, index) => (
          <div key={`toolbar-${index}`}>{item}</div>
        ))}
      </div>

      <table className="relative mr-auto w-full table-auto text-left text-sm text-zinc-700 dark:text-zinc-300">
        <thead className="text-sm uppercase">
          <tr
            className={clsx("table-row rounded-t-lg", {
              "divide-x divide-gray-400 dark:divide-zinc-800": borders.vertical,
              hidden: !header,
            })}
          >
            {select && tableSelect({ header: true })}
            {columns.map(({ ...other }, index) =>
              headerRenderer({
                label: other.label,
                columnIndex: index,
                ...other,
              })
            )}
            {renderActions && <th className="last:rounded-tr-lg"></th>}
          </tr>
        </thead>
        <tbody
          className={
            borders.horizontal &&
            "divide-y divide-gray-400 dark:divide-zinc-800"
          }
        >
          {dataRows &&
            PaginatedData.map((datarow, i) => (
              <tr
                key={datarow.row_id}
                className={clsx({
                  "hover:bg-gray-50 dark:hover:!bg-gray-300": hover,
                  "divide-x divide-gray-400 dark:divide-zinc-800":
                    borders.vertical,
                })}
                onClick={() => onRowClick && onRowClick({ index: i })}
              >
                {select && tableSelect({ datarow })}
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
            ))}
          {(dataRows === null || dataRows.length === 0) && (
            <tr className="w-full bg-zinc-100 dark:bg-zinc-600">
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
    </div>
  );
};

export default Table;
