import { Form, SelectField, TextField, useForm } from "@redwoodjs/forms";
import { toast } from "@redwoodjs/web/dist/toast";
import { GenericTable } from "@supabase/supabase-js/dist/module/lib/types";
import clsx from "clsx";
import { ReactElement, useMemo, useReducer, useState } from "react";
import useComponentVisible from "src/components/useComponentVisible";
import { debounce } from "src/lib/formatters";

interface GridRowData {
  [key: string]: any;
}
interface Filter {
  column: string;
  operator: string;
  value: string;
}
interface GridValueGetterParams {
  row: GridRowData;
  column: Column;
  value: any;
  field: string;
}
// interface Row {
//   id: string;
//   [key: string]: any;
//   variant?:
//     | "dark"
//     | "light"
//     | "warning"
//     | "danger"
//     | "success"
//     | "secondary"
//     | "primary"
//     | "default";
// }
interface Column {
  field: string;
  headerName?: string;
  /**
   * Not implemented yet
   */
  width?: number;
  type?: "number" | "string" | "boolean" | "date" | "dateTime" | "progress";
  align?: "left" | "center" | "right";
  sortable?: boolean;
  valueGetter?: (params: GridValueGetterParams) => any;
}
// interface GridCellParams {
//   value: any;
//   field: string;
//   row: Row;
//   column: Column;
//   selected: boolean;
// }
interface ITableProps {
  rows: GridRowData[];
  columns: Column[];
  disabled?: boolean;
  filterable?: boolean;
  selectable?: boolean;
  summary?: boolean;
  pagination?: {
    /**
     * The total number of rows displayed per page
     */
    pageSize?: number;
    pageSizeOptions?: number[];
    page?: number;
  };
  header?: ReactElement | string;
  className?: React.HTMLAttributes<GenericTable> | string;
  /**
   * Callback function that is fired when a row is selected
   */
  onSelectRow?: (selectedRows: GridRowData[]) => void;
}

/**
 *
 * Renders a table
 *
 * @example Displaying a validation error message with `<FieldError>`

 * ```jsx
 * <form onSubmit={handleSubmit(onSubmit)}>
 *   <input {...register("firstName", { required: true })} />
 *   {errors.firstName?.type === 'required' && "First name is required"}
 * ```
 */
const NewTable = ({
  columns,
  rows,
  filterable,
  selectable,
  onSelectRow,
  header,
  pagination,
  summary,
  className,
}: ITableProps) => {
  const cols = useMemo(() => {
    return columns;
  }, [columns]);
  const [filters, setFilters] = useState<Filter[]>([]);

  enum DataActionKind {
    FILTER = "FILTER",
    SORT = "SORT",
    SELECT = "SELECT",
    SELECT_ALL = "SELECT_ALL",
    SET = "SET",
    SET_PAGE = "SET_PAGE",
  }
  interface DataAction {
    type: DataActionKind;
    state?: "add" | "remove" | "set";
    payload: any;
  }
  let [data, dispatch] = useReducer(
    (state, action: DataAction) => {
      const { type, payload } = action;
      switch (type) {
        case DataActionKind.SET: {
          const newState = state.map((row, i) => {
            if (state === payload) {
              return state;
            }
            const updatedRow = payload.find((r) => row.id === r.id);
            if (updatedRow) {
              return { ...row, ...updatedRow };
            }
            return row;
          });
          return { ...newState, ...payload };
          // return newState;
        }
        case DataActionKind.FILTER: {
          const newFilters =
            action.state === "add"
              ? [...filters, payload]
              : filters.filter((f) => f !== payload);
          if (action.state === "add") {
            if (
              !filters.find(
                (f) =>
                  f.column === payload.column &&
                  f.operator === payload.operator &&
                  f.value === payload.value
              )
            ) {
              setFilters([...filters, payload]);
            }
          } else if (action.state === "remove") {
            setFilters(filters.filter((f) => f !== payload));
          }

          return {
            rows: rows.filter((row) => {
              if (newFilters.length === 0) {
                return true;
              }
              return newFilters
                .map((filter) => {
                  if (!filter) {
                    return true;
                  }
                  switch (filter.operator) {
                    case "=": {
                      return row[filter.column] === filter.value;
                    }
                    case "!=": {
                      return row[filter.column] !== filter.value;
                    }
                    case ">": {
                      return row[filter.column] > filter.value;
                    }
                    case ">=": {
                      return row[filter.column] >= filter.value;
                    }
                    case "<": {
                      return row[filter.column] < filter.value;
                    }
                    case "<=": {
                      return row[filter.column] <= filter.value;
                    }
                    case "like": {
                      return row[filter.column].includes(filter.value);
                    }
                    case "ilike": {
                      return row[filter.column]
                        .toLowerCase()
                        .includes(filter.value.toLowerCase());
                    }
                    case "in": {
                      return filter.value.includes(row[filter.column]);
                    }
                    case "not_in": {
                      return !filter.value.includes(row[filter.column]);
                    }
                    default: {
                      return true;
                    }
                  }
                })
                .reduce((acc, curr) => acc && curr, true);
            }),
            ...state,
          };
        }
        case DataActionKind.SORT: {
          const collator = new Intl.Collator(undefined, { numeric: true });

          const sort = state.rows.sort((a, b) => {
            const aValue = a[payload.column.field];
            const bValue = b[payload.column.field];
            return payload.direction === "asc"
              ? collator.compare(aValue, bValue)
              : collator.compare(bValue, aValue);
          });
          return {
            rows: sort,
            ...state,
            sorted_on: payload.column.field,
            sort_direction: payload.direction,
          };
        }
        case DataActionKind.SELECT: {
          return {
            ...state,
            rows: state.rows.map((row, i) => {
              if (row.tableId === payload.row.tableId) {
                return { ...row, selected: payload.checked };
              }
              return row;
            }),
          };
        }
        case DataActionKind.SELECT_ALL: {
          return {
            ...state,
            rows: state.rows.map((row) => {
              return { ...row, selected: payload.checked || false };
            }),
          };
        }
        case DataActionKind.SET_PAGE: {
          if (!pagination) {
            return state;
          }
          return {
            ...state,
            page: payload.page,
            pageSize: payload.pageSize,
          };
        }
        default: {
        }
      }
    },
    {
      rows: rows.map((row, i) => ({ ...row, tableId: `row-${i}` })),
      ...pagination,
      filters: [],
    }
  );

  // useEffect(() => {
  //   // data = rows.map((row, i) => ({
  //   //   ...row,
  //   //   id: `row-${i}`,
  //   //   selected: false,
  //   //   sorted_on: "",
  //   //   sort_direction: "",
  //   // }));
  //   return;
  // }, [rows]);

  const formMethods = useForm();
  const { isComponentVisible, setIsComponentVisible, ref } =
    useComponentVisible(false);

  return (
    <>
      <div className={clsx("relative overflow-x-auto", className)}>
        <table className="mr-auto w-full table-auto text-left text-sm text-gray-700 dark:text-stone-300">
          {(filterable || selectable) && (
            <caption className="table-caption h-fit py-3 text-left text-lg font-semibold">
              <div className="flex w-full space-x-3">
                <div className="relative w-fit" ref={ref}>
                  <button
                    className="rw-button rw-button-gray-outline relative inline-block"
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
                    className={clsx(`z-10 m-1 rounded border bg-black p-3`)}
                    open={isComponentVisible}
                    onClose={() => setIsComponentVisible(false)}
                  >
                    <Form
                      className="flex flex-col"
                      formMethods={formMethods}
                      method="dialog"
                      onSubmit={(e) => {
                        formMethods.reset();
                        dispatch({
                          type: DataActionKind.FILTER,
                          state: "add",
                          payload: e,
                        });
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
                            onClick={() => {
                              dispatch({
                                type: DataActionKind.FILTER,
                                state: "remove",
                                payload: filters[index],
                              });
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
                        <TextField
                          name="value"
                          className="rw-input rw-input-small"
                        />
                        <button className="rw-button rw-button-small rw-button-green">
                          +
                        </button>
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
                {selectable && (
                  <button
                    className="rw-button rw-button-gray-outline"
                    title="Export"
                    disabled={
                      data.rows.filter((row) => row.selected).length === 0
                    }
                    onClick={() => {
                      navigator.clipboard.writeText(
                        data.rows
                          .filter((row) => row.selected)
                          .map((row) => {
                            return Object.entries(row)
                              .map(([key, value]) => {
                                if (cols.some((col) => col.field === key)) {
                                  const col = cols.find(
                                    (col) => col.field === key
                                  );
                                  return `${key}: ${
                                    col.valueGetter
                                      ? col.valueGetter({
                                          row,
                                          column: col,
                                          value,
                                          field: key,
                                        })
                                      : value
                                  }`;
                                }
                              })
                              .join(", ");
                          })
                          .join(", ")
                      );
                      toast.success("Copied to clipboard");
                    }}
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
              </div>
            </caption>
          )}
          <thead className="!rounded-t-lg bg-zinc-400 text-xs uppercase text-zinc-700 dark:bg-zinc-700  dark:text-zinc-300">
            <tr>
              {selectable && (
                <th
                  className="px-3 py-2 first:rounded-tl-lg last:rounded-tr-lg sm:py-3 sm:px-4"
                  abbr="checkbox"
                >
                  <input
                    type="checkbox"
                    className="rw-input rw-checkbox m-0"
                    onChange={(e) => {
                      dispatch({
                        type: DataActionKind.SELECT_ALL,
                        payload: {
                          checked: e.target.checked,
                        },
                      });
                    }}
                  />
                </th>
              )}
              {cols.map((column, index) => (
                <th
                  key={index}
                  scope="col"
                  className="line-clamp-1 p-3 first:rounded-tl-lg last:rounded-tr-lg sm:px-4"
                  align={column.align}
                  aria-sort="none"
                  onClick={(e) => {
                    if (column.sortable) {
                      dispatch({
                        type: DataActionKind.SORT,
                        payload: {
                          column,
                          direction:
                            data.sorted_on === column.field
                              ? data.sort_direction === "asc"
                                ? "desc"
                                : "asc"
                              : "asc",
                        },
                      });
                    }
                  }}
                >
                  {column.headerName}
                  {column.sortable && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="ml-1 inline-flex h-3 w-3"
                      fill="currentColor"
                      viewBox="0 0 320 512"
                    >
                      {data.rows && data.sorted_on === column.field ? (
                        data.sort_direction === "asc" ? (
                          <path d="M182.6 41.4c-12.5-12.5-32.8-12.5-45.3 0l-128 128c-9.2 9.2-11.9 22.9-6.9 34.9s16.6 19.8 29.6 19.8H288c12.9 0 24.6-7.8 29.6-19.8s2.2-25.7-6.9-34.9l-128-128z" />
                        ) : (
                          <path d="M182.6 470.6c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-9.2-9.2-11.9-22.9-6.9-34.9s16.6-19.8 29.6-19.8H288c12.9 0 24.6 7.8 29.6 19.8s2.2 25.7-6.9 34.9l-128 128z" />
                        )
                      ) : (
                        <path d="M27.66 224h264.7c24.6 0 36.89-29.78 19.54-47.12l-132.3-136.8c-5.406-5.406-12.47-8.107-19.53-8.107c-7.055 0-14.09 2.701-19.45 8.107L8.119 176.9C-9.229 194.2 3.055 224 27.66 224zM292.3 288H27.66c-24.6 0-36.89 29.77-19.54 47.12l132.5 136.8C145.9 477.3 152.1 480 160 480c7.053 0 14.12-2.703 19.53-8.109l132.3-136.8C329.2 317.8 316.9 288 292.3 288z" />
                      )}
                    </svg>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody
            className={
              "divide-y divide-zinc-500 bg-zinc-100 dark:divide-zinc-700 dark:bg-zinc-800"
            }
          >
            {(
              data &&
              (pagination
                ? data.rows.slice(
                    (data.page - 1) * data.pageSize,
                    data.page * data.pageSize
                  )
                : data.rows)
            ).map((row, index) => (
              <tr key={`row-${index}`} className="animate-fade-in">
                {selectable && !!selectable && (
                  <td
                    className={clsx("w-4 p-2 sm:p-4", {
                      "rounded-bl-lg":
                        index ===
                          (pagination
                            ? data.rows.slice(
                                (data.page - 1) * data.pageSize,
                                data.page * data.pageSize
                              )
                            : data.rows
                          ).length -
                            1 && !summary,
                    })}
                  >
                    <input
                      type="checkbox"
                      className="rw-input rw-checkbox m-0"
                      name={`select-${index}`}
                      checked={row.selected}
                      onChange={(e) => {
                        dispatch({
                          type: DataActionKind.SELECT,
                          payload: {
                            row: { ...row, tableId: row.tableId },
                            checked: e.target.checked,
                          },
                        });
                      }}
                    />
                  </td>
                )}
                {cols.map((column, idx) => (
                  <td
                    key={`row-${index}-cell-${idx}`}
                    className={clsx("px-3 py-2 sm:p-4", {
                      "rounded-br-lg":
                        idx === cols.length - 1 &&
                        index ===
                          (pagination
                            ? data.rows.slice(
                                (data.page - 1) * data.pageSize,
                                data.page * data.pageSize
                              )
                            : data.rows
                          ).length -
                            1 &&
                        !summary,
                      "rounded-bl-lg":
                        idx === 0 &&
                        index ===
                          (pagination
                            ? data.rows.slice(
                                (data.page - 1) * data.pageSize,
                                data.page * data.pageSize
                              )
                            : data.rows
                          ).length -
                            1 &&
                        !summary &&
                        !selectable,
                    })}
                    align={column.align}
                    scope="row"
                  >
                    {column.valueGetter
                      ? column.valueGetter({
                          row,
                          column,
                          value: row[column.field],
                          field: column.field,
                        })
                      : row[column.field]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
          <tfoot>
            {summary && (
              <tr className="rounded-b-lg bg-gray-400 font-semibold text-gray-900 dark:bg-zinc-700 dark:text-white ">
                {selectable && <td className="p-4"></td>}
                {cols.map((column, index) => {
                  const { field, valueGetter, align, width, type } = column;
                  if (type !== "number") {
                    return (
                      <th
                        key={`footer-${index}`}
                        className="px-3 py-3 sm:px-6"
                      ></th>
                    );
                  }

                  const sum = (
                    pagination
                      ? data.rows
                          .slice(
                            (pagination.page - 1) * pagination.pageSize,
                            pagination.page * pagination.pageSize
                          )
                          .filter((d) =>
                            selectable &&
                            data.rows.filter((d) => d.selected).length > 0
                              ? d.selected
                              : true
                          )
                      : data.rows.filter((d) =>
                          selectable &&
                          data.rows.filter((d) => d.selected).length > 0
                            ? d.selected
                            : true
                        )
                  ).reduce((a, b) => {
                    return a + parseInt(b[field] || 0);
                  }, 0);

                  return (
                    <th
                      key={`footer-${index}-${field}`}
                      align={align}
                      className={"px-3 py-3 sm:px-6"}
                    >
                      {valueGetter
                        ? valueGetter({ row: {}, column, value: sum, field })
                        : sum}
                    </th>
                  );
                })}
              </tr>
            )}
            {pagination && (
              <tr>
                {selectable && <td></td>}
                <td className="w-full p-2" colSpan={cols.length}>
                  <div className="flex items-center justify-end space-x-2">
                    {/* TODO: add rows per page dropdown/select */}
                    Rows per page &nbsp;
                    <select
                      className="rw-input rw-input-small"
                      onChange={(e) => {
                        debounce(() => {
                          dispatch({
                            type: DataActionKind.SET_PAGE,
                            payload: {
                              page: 1,
                              pageSize: parseInt(e.target.value),
                            },
                          });
                        }, 500)();
                      }}
                      defaultValue={pagination.pageSize}
                    >
                      {pagination.pageSizeOptions?.map((option) => (
                        <option>{option}</option>
                      ))}
                    </select>
                    <nav
                      className="rw-button-group m-0 leading-tight"
                      aria-label="Page navigation"
                    >
                      <button
                        className="rw-pagination-item"
                        onClick={() => {
                          dispatch({
                            type: DataActionKind.SET_PAGE,
                            payload: {
                              page: data.page > 1 ? data.page - 1 : 1,
                              pageSize: data.pageSize,
                            },
                          });
                        }}
                      >
                        <span className="sr-only">Previous</span>
                        <svg
                          aria-hidden="true"
                          className="h-5 w-5"
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
                      </button>
                      {/* TODO: limit pages */}
                      {Array.from(
                        Array(Math.ceil(data.rows.length / data.pageSize))
                      ).map((i, idx) => (
                        <button
                          key={`table-pagination-button-${idx}`}
                          id={`table-pagination-button-${idx}`}
                          className={clsx({
                            "rw-pagination-item": data.page !== idx + 1,
                            "rw-pagination-item-active": data.page == idx + 1,
                          })}
                          onClick={() => {
                            dispatch({
                              type: DataActionKind.SET_PAGE,
                              payload: {
                                page: idx + 1,
                                pageSize: data.pageSize,
                              },
                            });
                          }}
                        >
                          {idx + 1}
                        </button>
                      ))}
                      <button
                        className="rw-pagination-item"
                        onClick={() => {
                          dispatch({
                            type: DataActionKind.SET_PAGE,
                            payload: {
                              page:
                                data.page <
                                Math.ceil(data.rows.length / data.pageSize)
                                  ? data.page + 1
                                  : Math.ceil(data.rows.length / data.pageSize),
                              pageSize: data.pageSize,
                            },
                          });
                        }}
                      >
                        <span className="sr-only">Next</span>
                        <svg
                          aria-hidden="true"
                          className="h-5 w-5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                            clipRule="evenodd"
                          ></path>
                        </svg>
                      </button>
                    </nav>
                    <span className="space-x-1 text-sm font-normal text-gray-500 dark:text-gray-400">
                      <span>Showing</span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {(data.page || 1) * data.pageSize - data.pageSize + 1}-
                        {(data.page || 1) * data.pageSize > rows.length
                          ? rows.length
                          : (data.page || 1) * data.pageSize}
                      </span>
                      <span>of</span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {rows.length}
                      </span>
                    </span>
                  </div>
                </td>
              </tr>
            )}
          </tfoot>
        </table>
      </div>
    </>
  );
};

export default NewTable;
