import { ButtonField, Form, SelectField, TextField } from "@redwoodjs/forms";
import clsx from "clsx";
import {
  ReactElement,
  TableHTMLAttributes,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from "react";
import useComponentVisible from "src/components/useComponentVisible";

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
interface Row {
  id: string;
  [key: string]: any;
  variant?:
    | "dark"
    | "light"
    | "warning"
    | "danger"
    | "success"
    | "secondary"
    | "primary"
    | "default";
}
interface Column {
  field: string;
  headerName?: string;
  /**
   * Not implemented yet
   */
  width?: number;
  // type?: "number" | "string" | "boolean" | "date" | "dateTime" | "progress";
  align?: "left" | "center" | "right";
  sortable?: boolean;
  // filter?: Filter;
  valueGetter?: (params: GridValueGetterParams) => any;
}
interface GridCellParams {
  value: any;
  field: string;
  row: Row;
  column: Column;
  selected: boolean;
}
interface ITableProps {
  rows: GridRowData[];
  columns: Column[];
  disabled?: boolean;
  filterable?: boolean;
  selectable?: boolean;
  header?: ReactElement | string;
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
  disabled,
  filterable,
  selectable,
  onSelectRow,
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
  }
  interface DataAction {
    type: DataActionKind;
    payload: any;
  }
  const [data, dispatch] = useReducer((state, action: DataAction) => {
    const { type, payload } = action;
    switch (type) {
      case DataActionKind.SET: {
        const newState = state.map((row, i) => {
          const updatedRow = payload.find((r) => row.id === r.id);
          if (updatedRow) {
            return { ...row, ...updatedRow };
          }
          return row;
        });
        return newState;
      }
      case DataActionKind.FILTER: {
        console.log("FILTER", payload);
        const filter = state
          .filter((row) => {
            if (!payload) {
              return true;
            }
            switch (payload.operator) {
              case "=": {
                return row[payload.column] === payload.value;
              }
              case "!=": {
                return row[payload.column] !== payload.value;
              }
              case ">": {
                return row[payload.column] > payload.value;
              }
              case ">=": {
                return row[payload.column] >= payload.value;
              }
              case "<": {
                return row[payload.column] < payload.value;
              }
              case "<=": {
                return row[payload.column] <= payload.value;
              }
              case "like": {
                return row[payload.column].includes(payload.value);
              }
              case "ilike": {
                return row[payload.column]

                  .toLowerCase()
                  .includes(payload.value.toLowerCase());
              }
              case "in": {
                return payload.value.includes(row[payload.column]);
              }
              case "not_in": {
                return !payload.value.includes(row[payload.column]);
              }
              default: {
                return true;
              }
            }
          })
          .map((row) => ({
            ...row,
          }));
        return filter;
      }
      case DataActionKind.SORT: {
        const sort = state
          .sort((a, b) => {
            if (payload.direction === "asc") {
              if (a[payload.column.field] < b[payload.column.field]) {
                return -1;
              }
              if (a[payload.column.field] > b[payload.column.field]) {
                return 1;
              }
              return 0;
            } else {
              if (a[payload.column.field] > b[payload.column.field]) {
                return -1;
              }
              if (a[payload.column.field] < b[payload.column.field]) {
                return 1;
              }
              return 0;
            }
          })
          .map((row) => ({
            ...row,
            sorted_on: payload.column.field,
            sort_direction: payload.direction,
          }));
        return sort;
      }
      case DataActionKind.SELECT: {
        return state.map((row, i) => {
          if (`row-${i}` !== payload.row.id) {
            return row;
          }
          return { ...row, selected: payload.checked };
        });
      }
      case DataActionKind.SELECT_ALL: {
        return state.map((row) => {
          return { ...row, selected: payload.checked };
        });
      }
      default: {
        return state;
      }
    }
  }, rows);

  useEffect(() => {
    return dispatch({
      type: DataActionKind.SET,
      payload: rows.map((row, i) => ({ ...row, id: `row-${i}` })),
    });
  }, [rows]);

  const { isComponentVisible, setIsComponentVisible, ref } =
    useComponentVisible(false);

  const addFilter = (e) => {
    setFilters([...filters, e]);
  };

  return (
    <>
      <p className="text-white">{JSON.stringify(data, null, 2)}</p>
      <table className="relative w-full table-auto text-left text-sm text-gray-700 dark:text-stone-300">
        {/* TODO: Toolbar over table instead? */}
        <caption className="table-caption h-fit py-3 text-left text-lg font-semibold text-gray-900 dark:text-white">
          <div className="flex w-full space-x-3 ">
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
              </button>
              <div
                className={clsx(
                  `absolute z-10 m-1 flex origin-top flex-col rounded border bg-black p-3`,
                  {
                    block: isComponentVisible,
                    hidden: !isComponentVisible,
                  }
                )}
              >
                <Form
                  className=""
                  config={{ mode: "onBlur" }}
                  onSubmit={(e) => {
                    dispatch({
                      type: DataActionKind.FILTER,
                      payload: e,
                    });
                  }}
                >
                  {filters.map(({ column, operator, value }, index) => (
                    <div
                      className="rw-button-group justify-start"
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
                        onClick={() => {
                          setFilters(
                            filters.filter((f, i) => f !== filters[index])
                          );
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
                </Form>
              </div>
            </div>
            {selectable && (
              <button className="rw-button rw-button-gray-outline">
                <span className="sr-only">Export</span>
                {/* TODO: insert light icon here instead */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                  className="pointer-events-none h-5"
                  fill="currentColor"
                  stroke="currentColor"
                >
                  <path d="M288 32c0-17.7-14.3-32-32-32s-32 14.3-32 32V274.7l-73.4-73.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l128 128c12.5 12.5 32.8 12.5 45.3 0l128-128c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L288 274.7V32zM64 352c-35.3 0-64 28.7-64 64v32c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V416c0-35.3-28.7-64-64-64H346.5l-45.3 45.3c-25 25-65.5 25-90.5 0L165.5 352H64zm368 56a24 24 0 1 1 0 48 24 24 0 1 1 0-48z" />
                </svg>
              </button>
            )}
          </div>
        </caption>
        <thead className="bg-zinc-400 text-sm uppercase text-zinc-700 dark:bg-zinc-700 dark:text-zinc-300">
          <tr>
            {selectable && (
              <th className="w-0 px-3 py-2 sm:py-3 sm:px-4" abbr="checkbox">
                <input
                  type="checkbox"
                  className="rw-input rw-input-small rw-checkbox"
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
                className="line-clamp-1 table-cell border-b border-zinc-500 px-3 py-3 dark:border-zinc-700 sm:px-6"
                align={column.align}
                aria-sort="none"
                onClick={(e) => {
                  if (column.sortable) {
                    dispatch({
                      type: DataActionKind.SORT,
                      payload: {
                        column,
                        direction:
                          data[0].sorted_on === column.field
                            ? data[0].sort_direction === "asc"
                              ? "desc"
                              : "asc"
                            : "asc",
                      },
                    });
                  }
                }}
              >
                {column.headerName}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="ml-1 inline-flex h-3 w-3"
                  fill="currentColor"
                  viewBox="0 0 320 512"
                >
                  {data[0].sorted_on === column.field ? (
                    data[0].sort_direction === "asc" ? (
                      <path d="M182.6 41.4c-12.5-12.5-32.8-12.5-45.3 0l-128 128c-9.2 9.2-11.9 22.9-6.9 34.9s16.6 19.8 29.6 19.8H288c12.9 0 24.6-7.8 29.6-19.8s2.2-25.7-6.9-34.9l-128-128z" />
                    ) : (
                      <path d="M182.6 470.6c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-9.2-9.2-11.9-22.9-6.9-34.9s16.6-19.8 29.6-19.8H288c12.9 0 24.6 7.8 29.6 19.8s2.2 25.7-6.9 34.9l-128 128z" />
                    )
                  ) : (
                    <path d="M27.66 224h264.7c24.6 0 36.89-29.78 19.54-47.12l-132.3-136.8c-5.406-5.406-12.47-8.107-19.53-8.107c-7.055 0-14.09 2.701-19.45 8.107L8.119 176.9C-9.229 194.2 3.055 224 27.66 224zM292.3 288H27.66c-24.6 0-36.89 29.77-19.54 47.12l132.5 136.8C145.9 477.3 152.1 480 160 480c7.053 0 14.12-2.703 19.53-8.109l132.3-136.8C329.2 317.8 316.9 288 292.3 288z" />
                  )}
                </svg>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-500 dark:divide-zinc-700">
          {data.map((row, index) => (
            <tr key={index} className="bg-zinc-100 dark:bg-zinc-800">
              {selectable && (
                <td className="!w-0 px-3 py-2 sm:px-4 sm:py-4">
                  <input
                    type="checkbox"
                    className="rw-input rw-input-small rw-checkbox"
                    name={`select-${index}`}
                    checked={row.selected || false}
                    onChange={(e) => {
                      dispatch({
                        type: DataActionKind.SELECT,
                        payload: {
                          row: { ...row, id: `row-${index}` },
                          checked: e.target.checked,
                        },
                      });
                    }}
                  />
                </td>
              )}
              {columns.map((column, index) => (
                <td
                  key={index}
                  className="whitespace-nowrap px-3 py-2 sm:py-4 sm:px-6"
                  align={column.align}
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
      </table>
    </>
  );
};

export default NewTable;
