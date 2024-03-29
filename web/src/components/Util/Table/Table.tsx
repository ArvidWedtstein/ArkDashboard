import { ElementType, Fragment, HTMLAttributes, ReactNode, forwardRef, useCallback, useMemo, useRef, useState } from "react";
import { IntRange, debounce, formatNumber, pluralize } from "src/lib/formatters";
import clsx from "clsx";
import { toast } from "@redwoodjs/web/dist/toast";
import Button, { ButtonGroup } from "../Button/Button";
import { Input } from "../Input/Input";
import { Lookup } from "../Lookup/Lookup";
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import Collapse from "../Collapse/Collapse";
import { Dialog, DialogActions, DialogContent, DialogTitle } from "../Dialog/Dialog";

type Filter<Row extends Record<string, any>> = {
  /**
   * The column name.
   */
  column: TableColumn<Row>["field"];
  /**
   * The filter operator.
   */
  operator: string;
  /**
   * The filter value.
   */
  value: string;
  /**
   * Is the value saved?
   */
  saved?: boolean;
};
/**
 * Represents a row of data in the table.
 */

type TableDataRow = {
  readonly row_id?: string;
  collapseContent?: React.ReactNode;
} & Readonly<Omit<Record<string, any>, "row_id" | "collapseContent">>;

type TableColumn<Row extends TableDataRow> = {
  /**
   * The header text for the column.
   */
  header?: string;
  /**
   * The field name for the column.
   */
  field: keyof Row & string;
  /**
   * Indicates type of column
   */
  datatype?:
  | "number"
  | "boolean"
  | "date"
  | "symbol"
  | "function"
  | "string"
  | "bigint"
  | "undefined"
  | "object";
  /**
   * The CSS class name for the column.
   */
  className?: string;
  /**
   * The CSS class name for the column.
   */
  headerClassName?: string;
  /**
   * Indicates whether the column is sortable.
   */
  sortable?: boolean;
  /**
   * width
   */
  width?: number;
  /**
   * Indicates whether the column is hidable.
   */
  visibleOnly?: boolean;
  /**
   * If the column is hidden
   */
  hidden?: boolean;
  /**
   * Column Sort Direction
   */
  sortDirection?: "desc";
  /**
   *  Indicates whether the column is a summary column.
   */
  aggregate?: "sum" | "avg" | "count" | "min" | "max";
  /**
   * A function to format the column value.
   *
   * @param options - Formatting options.
   * @param options.value - The value to format.
   * @param options.row - The current row data.
   * @returns The formatted value.
   */
  valueFormatter?: (options: { value: any; row: Row }) => any;
  /**
   * A function to render custom content in the column.
   *
   * @param options - Rendering options.
   * @param options.value - The value to render.
   * @param options.row - The current row data.
   * @param options.rowIndex - The index of the current row.
   * @returns The rendered content.
   */
  render?: <Field extends keyof Row>(options: {
    // value: Row[TableColumn<Row>["field"]];
    // value: Row[Field];
    value: any;
    row: TableDataRow & Row;
    rowIndex: number;
    field: Field;
    header: string;
  }) => ReactNode;
};

type TableSettings = {
  /**
   * Indicates whether the search feature is enabled.
   */
  search?: boolean;
  /**
   * Indicates whether the header is visible.
   */
  header?: boolean;
  /**
   * Enables exporting selected rows to clipboard
   */
  export?: boolean;
  /**
   * Indicates whether the filter feature is enabled.
   */
  filter?: boolean;
  /**
   * Lets user choose which columns to display
   */
  columnSelector?: boolean;
  /**
   * Configuration for table borders.
   */
  borders?: {
    vertical?: boolean;
    horizontal?: boolean;
  };
  /**
   * Configuration for pagination.
   */
  pagination?: {
    /**
     * Indicates whether pagination is enabled.
     */
    enabled?: boolean;
    /**
     * The range of rows per page.
     */
    rowsPerPage?: IntRange<1, 100>;
    /**
     * The available page size options.
     */
    pageSizeOptions?: number[];
  };
};

type TableProps<Row extends Record<string, any>> = {
  /**
   * The column configurations for the table.
   */
  columns: TableColumn<Row>[];
  /**
   * The data rows for the table.
   */
  rows: Row[]; // TableDataRow
  /**
   * The CSS class name for the table.
   */
  className?: string;
  /**
 * Size of table.
 * @default medium
 */
  size?: 'small' | 'medium' | 'large';
  /**
   * variant
   * @default outlined
   */
  variant?: 'standard' | 'outlined'
  /**
 * Indicates whether the select feature is enabled.
 */
  checkSelect?: boolean;
  /**
   * The settings for the table.
   */
  settings?: TableSettings;
  /**
   * The additional components to display in the toolbar.
   */
  toolbar?: React.ReactNode[];
}
const Table = <Row extends Record<string, any>>(props: TableProps<Row>) => {
  let {
    columns,
    rows: dataRows,
    className,
    settings = {},
    toolbar = [],
    size = "medium",
    variant = "outlined",
    checkSelect = false,
  } = props;

  const defaultSettings: TableSettings = {
    search: false,
    header: true,
    filter: false,
    columnSelector: false,
    borders: {
      vertical: false,
      horizontal: true,
    },
    pagination: {
      enabled: false,
      rowsPerPage: 10,
      pageSizeOptions: [10, 25, 50],
    },
  };

  const [open, setOpen] = useState<boolean>(false);
  const mergedSettings = { ...defaultSettings, ...settings };

  const columnSettings: TableColumn<Row>[] = columns || [];

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<TableDataRow["row_id"][]>(
    []
  );

  // TODO: bug bug where row stays open after removed
  const [collapsedRows, setCollapsedRows] = useState<TableDataRow["row_id"][]>(
    []
  );

  const [selectedPageSizeOption, setSelectedPageSizeOption] = useState(
    mergedSettings.pagination.rowsPerPage ||
    mergedSettings.pagination.pageSizeOptions[0]
  );

  const [searchTerm, setSearchTerm] = useState<string>("");
  const handleSearch = debounce((e) => setSearchTerm(e.target.value), 500);

  const [filters, setFilters] = useState<Filter<Row>[]>([]);
  const [sort, setSort] = useState<{
    column: TableColumn<Row>["field"];
    direction: "asc" | "desc";
    columnDataType: TableColumn<Row>["datatype"];
  }>({
    column: "",
    direction: "asc",
    columnDataType: "string",
  });

  const sortData = (
    data: Row[],
    column: TableColumn<Row>["field"],
    columnDataType: TableColumn<Row>["datatype"],
    direction: "asc" | "desc"
  ) => {
    if (column) {
      const sortKey = column.startsWith("-") ? column.substring(1) : column;
      const { valueFormatter } = columns.find((c) => c.field === column);

      data.sort((a, b) => {
        let c = valueFormatter ? valueFormatter({ value: a[sortKey], row: data[data.indexOf(a)] }) : a[sortKey]
        let d = valueFormatter ? valueFormatter({ value: b[sortKey], row: data[data.indexOf(b)] }) : b[sortKey]

        // Compare based on data type
        if (!columnDataType) {
          columnDataType = typeof c;
        }
        if (columnDataType === "number") {
          return (
            (parseInt(c.toString()) - parseInt(d.toString()))
          );
        } else if (columnDataType === "boolean") {
          return (c === d ? 0 : c ? 1 : -1);
        } else if (columnDataType === "string") {
          return c.toString().localeCompare(d.toString());
        } else if (columnDataType === "date") {
          if (typeof c === "string") c = new Date(c).getTime();
          if (typeof d === "string") d = new Date(d).getTime();
          return (d as number) - (c as number);
        }

        // If data types don't match or are not supported, return 0
        return 0;
      });

      return direction === "desc" ? data.reverse() : data;
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
      case "regex":
        return new RegExp(value).test(rowValue);
      default:
        return true;
    }
  }, []);

  const filterData = (data) => {
    if (filters.filter(({ saved }) => saved).length === 0) {
      return data;
    }

    const filterLookup = {};
    filters.filter(({ saved }) => saved).forEach((filter) => {
      const { column } = filter;
      if (!filterLookup[column as any]) {
        filterLookup[column as any] = [];
      }
      filterLookup[column as any].push(filter);
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
      dataRows = dataRows.map((r, i) => ({
        ...r,
        row_id: `row-${i}`,
      }));
    }
    let filteredData = dataRows;

    if (mergedSettings.search) {
      filteredData = filteredData.filter((row) => {
        const rowString = Object.entries(row)
          .map(([k, v]) => columns.some((c) => c.field === k) && v)
          .join(" ")
          .toLowerCase();

        return rowString.includes(searchTerm.toLowerCase());
      });
    }

    if (mergedSettings.filter) {
      filteredData = filterData(filteredData);
    }

    if (sort.column) {
      filteredData = sortData(
        filteredData,
        sort.column,
        sort.columnDataType,
        sort.direction
      );
    }

    return filteredData;
  }, [sort, searchTerm, dataRows, mergedSettings.pagination, filters]);


  const PaginatedData = useMemo(() => {
    if (!mergedSettings.pagination.enabled) return SortedFilteredData;

    const startIndex = (currentPage - 1) * selectedPageSizeOption;
    const endIndex = startIndex + selectedPageSizeOption;

    return SortedFilteredData.slice(startIndex, endIndex);
  }, [SortedFilteredData, currentPage, selectedPageSizeOption]);


  const handleRowSelect = (event, id?) => {
    const {
      target: { id: targetId, checked },
    } = event;

    if (targetId === "checkbox-all-select") {
      setSelectedRows(
        checked ? PaginatedData.map((row) => row.row_id.toString()) : []
      );
      return;
    }

    setSelectedRows((prevSelectedRows) => {
      const selectedIndex = prevSelectedRows.indexOf(id);
      const newSelected = [...prevSelectedRows];

      if (selectedIndex === -1) {
        newSelected.push(id);
      } else {
        newSelected.splice(selectedIndex, 1);
      }

      return newSelected;
    });
  };

  const handleRowCollapse = (id: TableDataRow["row_id"]) => {
    const collapsedIndex = collapsedRows.indexOf(id);
    setCollapsedRows((prevExpandedRows) => {
      if (collapsedIndex !== -1) {
        return prevExpandedRows.filter((rowId) => rowId !== id);
      } else {
        return [...prevExpandedRows, id];
      }
    });
  };

  const isSelected = (id: TableDataRow["row_id"]) =>
    selectedRows.indexOf(id) !== -1;
  const isRowOpen = (id: TableDataRow["row_id"]) =>
    collapsedRows.indexOf(id) !== -1;

  const classes = {
    table: "table w-full border-collapse border-spacing-0 text-left text-sm text-zinc-700 dark:text-zinc-300",
    tableHead: "table-header-group text-sm uppercase",
    tableBody: clsx("table-row-group", {
      "divide-y divide-gray-400 divide-opacity-30 dark:divide-zinc-500": mergedSettings.borders.horizontal
    }),
  }
  const [columnSizes, setColumnSizes] = useState(columnSettings
    .filter((col) => !col.hidden).map((e, i) => {
      return {
        ...e,
        width: e.width || 300,
        columnIndex: i
      }
    }));
  const handleResize = (event, field) => {
    // console.log('resize', field, event)
  }

  const headerRenderer = ({ label, columnIndex, ...other }) => {
    return (
      <TableCell
        header={true}
        abbr={other.field}
        key={`headcell-${columnIndex}-${label}`}
        id={`headcell-${other.field}`}
        aria-sort="none"
        scope="col"
        className={clsx(other.className, {
          "cursor-pointer": other.sortable
        })}
        columnWidth={columnSizes.find((d) => d.columnIndex === columnIndex)?.width}
        field={other.field}
        variant={variant}
        size={size}
        handleResize={handleResize}
        onClick={() => {
          if (!other.sortable) return
          setSort((prev) => ({
            column: other.field,
            columnDataType: other.datatype,
            direction: prev.direction === "asc" ? "desc" : "asc",
          }));
        }}
      >
        {label}
        {other.sortable && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="ml-1 inline-flex h-3 w-3"
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
      </TableCell>
    );
  };

  const cellRenderer = ({
    rowData,
    cellData,
    columnIndex,
    rowIndex,
    render,
    valueFormatter,
    field,
    className,
    datatype,
    header,
  }: {
    rowData: TableDataRow;
    cellData: any;
    rowIndex: number;
    field: TableColumn<Row>["field"];
    header: string;
    datatype: TableColumn<Row>["datatype"];
    [key: string]: any;
  }) => {
    if (datatype == "number" && !isNaN(cellData) && !render) {
      cellData = formatNumber(parseInt(cellData));
    }

    const key = `cell-${rowIndex}-${columnIndex}`;

    const valueFormatted = valueFormatter
      ? valueFormatter({
        value: cellData,
        row: rowData,
        columnIndex,
      })
      : isNaN(cellData)
        ? cellData?.amount || cellData
        : cellData;

    const content = render
      ? render({
        columnIndex,
        rowIndex,
        value: valueFormatted,
        field: field,
        header,
        row: rowData,
      })
      : valueFormatted;

    return (
      <TableCell
        key={key}
        size={size}
        variant={variant}
        headers={`headcell-${field}`}
        selected={isSelected(rowData.row_id)}
        columnWidth={columnSizes?.find((d) => d.columnIndex === columnIndex)?.width}
        className={className}
      >
        {content}
      </TableCell>
    );
  };

  type TableExtraColumn = {
    header?: boolean;
    datarow?: TableDataRow;
    rowIndex?: number;
    type: 'Select' | 'Collapse'
  }
  const tableExtraColumn = ({
    header = false,
    datarow,
    rowIndex,
    type = 'Select'
  }: TableExtraColumn) => {
    return (
      <TableCell
        header={header}
        size={size}
        variant={variant}
        scope="col"
        columnWidth={50}
        style={{
          width: type === 'Collapse' || type === 'Select' ? '1%' : 'auto'
        }}
        selected={isSelected(datarow?.row_id || "")}
        aria-rowindex={rowIndex}
      >
        {type === 'Select' ? (
          <div className="flex items-center">
            <input
              id={header ? "checkbox-all-select" : datarow.row_id}
              checked={
                header
                  ? PaginatedData.every((row) =>
                    selectedRows.includes(row.row_id.toString())
                  ) && PaginatedData.length > 0
                  : isSelected(datarow.row_id)
              }
              onChange={(e) => handleRowSelect(e, datarow?.row_id)}
              type="checkbox"
              className="rw-checkbox m-0"
            />
            <label
              htmlFor={header ? "checkbox-all-select" : datarow.row_id}
              className="sr-only"
            >
              checkbox
            </label>
          </div>
        ) : (
          !header &&
          type === 'Collapse' && (
            <Button color="secondary" onClick={() => handleRowCollapse(datarow.row_id)} variant="icon" size="small">
              {isRowOpen(datarow.row_id) ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 448 512"
                  className="h-3.5 w-3.5"
                  fill="currentColor"
                >
                  <path d="M432 256C432 264.8 424.8 272 416 272H32c-8.844 0-16-7.15-16-15.99C16 247.2 23.16 240 32 240h384C424.8 240 432 247.2 432 256z" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 448 512"
                  className="h-3.5 w-3.5"
                  fill="currentColor"
                >
                  <path d="M432 256C432 264.8 424.8 272 416 272h-176V448c0 8.844-7.156 16.01-16 16.01S208 456.8 208 448V272H32c-8.844 0-16-7.15-16-15.99C16 247.2 23.16 240 32 240h176V64c0-8.844 7.156-15.99 16-15.99S240 55.16 240 64v176H416C424.8 240 432 247.2 432 256z" />
                </svg>
              )}
            </Button>
          )
        )}
      </TableCell>
    );
  };

  const calculateAggregate = ({
    field,
    aggregationType,
    valueFormatter,
  }: {
    field: TableColumn<Row>["field"];
    aggregationType: TableColumn<Row>["aggregate"];
    valueFormatter: TableColumn<Row>["valueFormatter"];
  }) => {
    const filteredData = PaginatedData.filter(
      (r) => !selectedRows.length || selectedRows.includes(r.row_id.toString())
    );

    switch (aggregationType) {
      case "sum":
        return filteredData.reduce((sum, row) => {
          const cellData = row[field];
          const valueFormatted = valueFormatter
            ? valueFormatter({ value: cellData, row })
            : cellData;

          const value = parseInt(
            isNaN(valueFormatted) ? valueFormatted?.amount : valueFormatted
          );
          return sum + value;
        }, 0);
      case "avg":
        const sum = filteredData.reduce((sum, row) => {
          const cellData = row[field];
          const valueFormatted = valueFormatter
            ? valueFormatter({ value: cellData, row })
            : cellData;

          const value = parseInt(
            isNaN(valueFormatted) ? valueFormatted?.amount : valueFormatted
          );
          return sum + value;
        }, 0);
        return sum / filteredData.length;
      case "count":
        return filteredData.length;
      case "min":
        return filteredData.reduce((min, row) => {
          const cellData = row[field];
          const valueFormatted = valueFormatter
            ? valueFormatter({ value: cellData, row })
            : cellData;

          const value = parseInt(
            isNaN(valueFormatted) ? valueFormatted?.amount : valueFormatted
          );
          return Math.min(min, value);
        }, Infinity);
      case "max":
        return filteredData.reduce((max, row) => {
          const cellData = row[field];
          const valueFormatted = valueFormatter
            ? valueFormatter({ value: cellData, row })
            : cellData;

          const value = parseInt(
            isNaN(valueFormatted) ? valueFormatted?.amount : valueFormatted
          );
          return Math.max(max, value);
        }, -Infinity);
      default:
        return 0;
    }
  };

  const tableFooter = () => (
    <tfoot>
      <TableRow className="font-semibold text-gray-900 dark:text-white border-t">
        {/* If master/detail */}
        {dataRows.some((row) => row.collapseContent) && (
          <TableCell size={size} variant={variant} className="first:rounded-bl-lg" />
        )}
        {checkSelect && (
          <TableCell size={size} variant={variant} className="first:rounded-bl-lg" />
        )}
        {columnSettings
          .filter((col) => !col.hidden)
          .map(
            (
              { header, field, datatype, aggregate, className, valueFormatter },
              index
            ) => {
              const key = `${field}-${header}`; // Use a unique identifier for the key

              if (!aggregate) {
                return (
                  <TableCell key={key} size={size} variant={variant} className="first:rounded-bl-lg" />
                );
              }

              const aggregatedValue = calculateAggregate({
                field,
                aggregationType: aggregate,
                valueFormatter,
              });

              return (
                <TableCell size={size} variant={variant} key={key} className={clsx("first:rounded-bl-lg last:rounded-br-lg", className)}>
                  {datatype === "number"
                    ? formatNumber(aggregatedValue)
                    : index === 0
                      ? "Total"
                      : null}
                </TableCell>
              );
            }
          )}
      </TableRow>
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
        currentPage <
        Math.ceil(SortedFilteredData.length / selectedPageSizeOption)
      ) {
        setCurrentPage(currentPage + 1);
      }
    },
    [currentPage, SortedFilteredData]
  );

  const tablePagination = () => {
    const totalPageCount = Math.ceil(
      SortedFilteredData.length / selectedPageSizeOption
    );
    const startRowIndex =
      currentPage * selectedPageSizeOption - selectedPageSizeOption + 1;
    const endRowIndex = Math.min(
      currentPage * selectedPageSizeOption,
      SortedFilteredData.length
    );
    const range = useMemo(
      () => paginationRange(currentPage, totalPageCount),
      [currentPage, totalPageCount]
    );

    const paginationButtons = range.map((page, index) => (
      <Button
        key={`page-${index}`}
        variant={currentPage === page ? 'contained' : 'outlined'}
        color={currentPage === page ? 'success' : 'secondary'}
        disabled={isNaN(page)}
        onClick={() => setCurrentPage(isNaN(page) ? 1 : page)}
      >
        {page}
      </Button>
    ));

    return (
      <nav className="m-2 flex items-center justify-end space-x-2 text-center text-sm text-zinc-800 dark:text-gray-400">
        <Lookup
          margin="none"
          size="small"
          label="Rows Per Page"
          className="max-w-xs w-40"
          disabled={dataRows.length == 0}
          defaultValue={selectedPageSizeOption}
          getOptionLabel={(opt) => opt.toString()}
          onSelect={setSelectedPageSizeOption}
          options={mergedSettings?.pagination?.pageSizeOptions}
        />

        <ButtonGroup>
          <Button variant="outlined" color="secondary" disabled={currentPage === 1}
            onClick={() => changePage("prev")}>
            <span className="sr-only">Previous</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" className="p-0.5 w-4 fill-current"
              aria-hidden="true">
              <path d="M234.8 36.25c3.438 3.141 5.156 7.438 5.156 11.75c0 3.891-1.406 7.781-4.25 10.86L53.77 256l181.1 197.1c6 6.5 5.625 16.64-.9062 22.61c-6.5 6-16.59 5.594-22.59-.8906l-192-208c-5.688-6.156-5.688-15.56 0-21.72l192-208C218.2 30.66 228.3 30.25 234.8 36.25z" />
            </svg>
          </Button>
          {paginationButtons}
          <Button variant="outlined" color="secondary" disabled={currentPage === totalPageCount}
            onClick={() => changePage("next")}>
            <span className="sr-only">Next</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" className="p-0.5 w-4 fill-current" aria-hidden="true">
              <path d="M85.14 475.8c-3.438-3.141-5.156-7.438-5.156-11.75c0-3.891 1.406-7.781 4.25-10.86l181.1-197.1L84.23 58.86c-6-6.5-5.625-16.64 .9062-22.61c6.5-6 16.59-5.594 22.59 .8906l192 208c5.688 6.156 5.688 15.56 0 21.72l-192 208C101.7 481.3 91.64 481.8 85.14 475.8z" />
            </svg>
          </Button>
        </ButtonGroup>
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
      selectedRows.includes(row.row_id.toString())
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

  const filterDialogRef = useRef<HTMLDivElement>();

  const addFilter = (data: Filter<Row>) => {
    setFilters((prev) => [
      ...prev,
      data,
    ]);
  };

  const handleFilterClose = (confirmSave: boolean = false) => {
    // Filter empty filters
    setFilters((prevFilters) => prevFilters.map(({ saved, column, operator, value }) => {
      return {
        column,
        operator,
        value,
        saved: !saved ? confirmSave : saved
      };
    }).filter(({ saved }) => saved));

    setOpen(false);
  }


  return (
    <div
      className={clsx("relative !overflow-x-hidden overflow-y-auto", className)}
    >
      {(checkSelect || mergedSettings.export || mergedSettings.filter || mergedSettings.search || toolbar.length > 0) && (
        <ButtonGroup className="my-2">
          {mergedSettings.filter && (
            <>
              {/* Filter Button */}

              <Button size="small" variant="outlined" color="secondary" onClick={() => setOpen(!open)}>
                <span className="sr-only">Filter</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 640 512"
                  className="pointer-events-none w-8 h-8"
                  fill="currentColor"
                  stroke="currentColor"
                >
                  {filters.length > 0 ? (
                    <path d="M479.3 32H32.7C5.213 32-9.965 63.28 7.375 84.19L192 306.8V400c0 7.828 3.812 15.17 10.25 19.66l80 55.98C286.5 478.6 291.3 480 295.9 480C308.3 480 320 470.2 320 455.1V306.8l184.6-222.6C521.1 63.28 506.8 32 479.3 32zM295.4 286.4L288 295.3v145.3l-64-44.79V295.3L32.7 64h446.6l.6934-.2422L295.4 286.4z" />
                  ) : (
                    <path d="M352 440.6l-64-44.79V312.3L256 287V400c0 7.828 3.812 15.17 10.25 19.66l80 55.98C350.5 478.6 355.3 480 359.9 480C372.3 480 384 470.2 384 455.1v-67.91l-32-25.27V440.6zM543.3 64l.6934-.2422l-144.1 173.8l25.12 19.84l143.6-173.2C585.1 63.28 570.8 32 543.3 32H139.6l40.53 32H543.3zM633.9 483.4L25.92 3.42c-6.938-5.453-17-4.25-22.48 2.641c-5.469 6.938-4.281 17 2.641 22.48l608 480C617 510.9 620.5 512 623.1 512c4.734 0 9.422-2.094 12.58-6.078C642 498.1 640.8 488.9 633.9 483.4z" />
                  )}
                </svg>
              </Button>

              <Dialog ref={filterDialogRef} open={open} onClose={() => handleFilterClose()}>
                <DialogTitle>{pluralize(
                  filters.length,
                  "Filter",
                  "s",
                  false
                )}</DialogTitle>
                <DialogContent>
                  {!filters.length && (
                    <Fragment>
                      <span className="rw-sublabel">No filters applied</span>
                      <br />
                      <span className="text-xs rw-sublabel">
                        Add a column below to filter the table
                      </span>
                    </Fragment>
                  )}
                  <TransitionGroup className="flex flex-col space-y-1 max-w-lg min-w-[20rem]">
                    {filters.map(({ column, operator, value }, index) => (
                      <CSSTransition
                        key={`columnfilter-${index}`}
                        timeout={500}
                        classNames="item"
                      >
                        <ButtonGroup size="small" className="fadetransition" key={`columnfilter-${index}`}>
                          <Lookup
                            size="small"
                            margin="none"
                            options={columnSettings.filter((col) => !col.hidden).map(c => c.field)}
                            value={column}
                            onSelect={(v) => setFilters((prev) => prev.map((s, i) => ({
                              ...s,
                              column: i === index ? v : s.column
                            })))}
                          />
                          <Lookup
                            size="small"
                            margin="none"
                            defaultValue={operator}
                            options={["=", "!=", ">", ">=", "<", "<=", "like", "ilike", "in", "not", "regex"]}
                            onSelect={(v) => setFilters((prev) => prev.map((s, i) => ({
                              ...s,
                              operator: i === index ? v : s.operator
                            })))}
                          />
                          <Input
                            size="small"
                            margin="none"
                            defaultValue={value}
                            onChange={(e) => setFilters((prev) => prev.map((s, i) => ({
                              ...s,
                              value: i === index ? e.target.value : s.value
                            })))}
                          />
                          <Button
                            color="error"
                            variant="contained"
                            size="small"
                            onClick={() => setFilters((prev) =>
                              prev.filter((_, idx) => idx !== index)
                            )}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 448 512"
                              fill="currentColor"
                              className="w-4"
                            >
                              <path d="M432 256C432 264.8 424.8 272 416 272H32c-8.844 0-16-7.15-16-15.99C16 247.2 23.16 240 32 240h384C424.8 240 432 247.2 432 256z" />
                            </svg>
                          </Button>
                        </ButtonGroup>
                      </CSSTransition>
                    ))}
                  </TransitionGroup>
                </DialogContent>
                <DialogActions>
                  <Button
                    variant="outlined"
                    color="secondary"
                    size="small"
                    ignoreButtonGroupPosition
                    className="float-left mr-auto"
                    startIcon={(
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 448 512"
                      >
                        <path d="M432 256C432 264.8 424.8 272 416 272h-176V448c0 8.844-7.156 16.01-16 16.01S208 456.8 208 448V272H32c-8.844 0-16-7.15-16-15.99C16 247.2 23.16 240 32 240h176V64c0-8.844 7.156-15.99 16-15.99S240 55.16 240 64v176H416C424.8 240 432 247.2 432 256z" />
                      </svg>
                    )}
                    onClick={() => addFilter({ column: columnSettings.length > 0 ? columnSettings[0].field : '', operator: "=", value: "", saved: false })}
                  >
                    Add Filter
                  </Button>
                  <ButtonGroup>
                    <Button
                      variant="outlined"
                      color="secondary"
                      size="small"
                      onClick={() => handleFilterClose()}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="contained"
                      color="success"
                      size="small"
                      id="confirmBtn"
                      formMethod="dialog"
                      onClick={() => handleFilterClose(true)}
                      disabled={!filters.length}
                    >
                      Confirm
                    </Button>
                  </ButtonGroup>
                </DialogActions>
              </Dialog>

            </>
          )}
          {checkSelect && mergedSettings.export && (
            <Button
              variant="outlined"
              color="DEFAULT"
              title="Export"
              size="small"
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
            </Button>
          )}
          {mergedSettings.search && (
            <Input
              fullWidth
              color="DEFAULT"
              margin="none"
              label="Search"
              type="search"
              size="small"
              onChange={handleSearch}
              SuffixProps={{
                style: {
                  borderRadius: '0'
                }
              }}
              InputProps={{
                startAdornment: (
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
                    />
                  </svg>
                ),
              }}
            />
          )}
          {toolbar.map((item, index) => (
            <Fragment key={`toolbar-${index}`}>{item}</Fragment>
          ))}

        </ButtonGroup>
      )}

      <div
        className={"w-full overflow-x-auto rounded border border-zinc-500"}
      >
        <table className={classes.table}>
          {mergedSettings.header && (
            <thead className={classes.tableHead}>
              <TableRow borders={mergedSettings.borders}>
                {dataRows.some((row) => row.collapseContent) &&
                  tableExtraColumn({ header: true, rowIndex: -1, type: 'Collapse' })}

                {checkSelect &&
                  tableExtraColumn({ header: true, rowIndex: -1, type: 'Select' })}

                {columnSettings
                  ?.filter((col) => !col.hidden)
                  .map(({ ...other }, index) => {
                    return headerRenderer({
                      label: other.header,
                      columnIndex: index,
                      ...other,
                    });
                  })}
              </TableRow>
            </thead>
          )}
          <TransitionGroup component="tbody" className={classes.tableBody}>
            {dataRows &&
              PaginatedData.map((datarow, i) => (
                <CSSTransition
                  timeout={500}
                  classNames={"item"}
                  key={datarow.row_id.toString()}
                >
                  <Fragment>
                    <TableRow className="fadetransition" borders={mergedSettings.borders}>
                      {dataRows.some((row) => row.collapseContent) &&
                        tableExtraColumn({
                          datarow,
                          rowIndex: i,
                          type: 'Collapse'
                        })}
                      {checkSelect &&
                        tableExtraColumn({ datarow, rowIndex: i, type: 'Select' })}
                      {columnSettings &&
                        columnSettings.map(
                          (
                            {
                              field,
                              render,
                              valueFormatter,
                              className,
                              datatype,
                              header,
                              ...other
                            },
                            index
                          ) =>
                            cellRenderer({
                              rowData: datarow,
                              cellData: datarow[field],
                              columnIndex: index,
                              header,
                              rowIndex: i,
                              render,
                              valueFormatter,
                              field,
                              className,
                              datatype,
                              ...other,
                            })
                        )}
                    </TableRow>

                    {datarow?.collapseContent && (
                      <TableRow
                        className={clsx({
                          "table-row": isRowOpen(datarow.row_id.toString()),
                          "h-0 [&>td]:p-0": !isRowOpen(datarow.row_id.toString())
                        })}
                        borders={mergedSettings.borders}
                      >

                        <TableCell size={size} variant={variant} colSpan={100}>
                          <Collapse in={isRowOpen(datarow.row_id.toString())}>
                            {datarow.collapseContent}
                          </Collapse>
                        </TableCell>
                      </TableRow>
                    )}
                  </Fragment>
                </CSSTransition>
              ))}
            {(dataRows === null || dataRows.length === 0) && (
              <CSSTransition
                timeout={500}
                classNames={"item"}
              >
                <TableRow className="fadetransition" borders={mergedSettings.borders}>
                  <TableCell size={size} variant={variant} colSpan={100} headers="" className={"text-center"}>No data found</TableCell>
                </TableRow>
              </CSSTransition>
            )}
          </TransitionGroup>
          {columnSettings.some((col) => col.aggregate) && tableFooter()}
        </table>
      </div>
      {mergedSettings.pagination.enabled && tablePagination()}
    </div>
  );
};

type TableCellProps = {
  children?: React.ReactNode;
  size?: TableProps<any>["size"]
  variant?: TableProps<any>["variant"]
  header?: boolean;
  selected?: boolean;
  columnWidth?: number;
  field?: string;
  handleResize?: (event, field: string) => void
} & React.DetailedHTMLProps<React.TdHTMLAttributes<HTMLTableCellElement>, HTMLTableCellElement>
const TableCell = forwardRef<HTMLTableCellElement, TableCellProps>((props, ref) => {
  const { children, header = false, selected = false, variant = "outlined", size = "medium", className, field, columnWidth = 500, handleResize, ...other } = props;
  const variantClasses = {
    outlined: clsx({
      "bg-zinc-300 dark:bg-zinc-800": header,
    }, !header && !selected ? 'dark:bg-zinc-600/80 bg-zinc-100' : ''),
    standard: clsx()
  }
  const classes = clsx("table-cell relative truncate", {
    "py-1 px-3": size === 'small' && !header,
    "p-4": size === 'medium' && !header,
    "px-6 py-5": size === 'large' && !header,
    "py-0.5 px-3": size === 'small' && header,
    "p-3 px-4": size === 'medium' && header,
    "py-4 px-6": size === 'large' && header,
    "bg-zinc-300 dark:bg-zinc-600": selected && !header,
  }, header ? `sticky z-10 align-middle leading-6 min-w-[20px] line-clamp-1` : `align-middle`, className, variantClasses[variant])

  const Component: ElementType = header ? 'th' : 'td';

  return (
    <Component className={classes} ref={ref} style={{ width: columnWidth, maxWidth: columnWidth }} {...other}>
      {children}
    </Component>
  )
})

type TableRowProps = {
  header?: boolean
  children?: React.ReactNode
  borders?: {
    vertical?: boolean;
    horizontal?: boolean;
  }
} & React.DetailedHTMLProps<HTMLAttributes<HTMLTableRowElement>, HTMLTableRowElement>
const TableRow = forwardRef<HTMLTableRowElement, TableRowProps>((props, ref) => {
  const { header = false, children, borders = { vertical: false, horizontal: false }, className, ...other } = props;
  const tableRow = clsx(`table-row text-inherit outline-none align-middle`, className, {
    "divide-x divide-gray-400 dark:divide-zinc-800": borders.vertical,
    "divide-opacity-30": borders.vertical && !header,
  })
  return (
    <tr ref={ref} role="rowgroup" className={tableRow} {...other}>
      {children}
    </tr>
  )
})

export default Table;
