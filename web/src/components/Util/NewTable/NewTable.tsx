import { ButtonField, Form, SelectField, TextField } from "@redwoodjs/forms";
import clsx from "clsx";
import { useMemo, useState } from "react";
import useComponentVisible from "src/components/useComponentVisible";


interface GridRowData {
  [key: string]: any;
}
interface GridValueGetterParams {
  row: GridRowData;
  column: Column;
  value: any;
  field: string;
}
interface Column {
  field: string;
  headerName?: string;
  width?: number;
  type?: 'number' | 'string' | 'boolean' | 'date' | 'dateTime' | 'progress';
  sortable?: boolean;
  valueGetter?: (params: GridValueGetterParams) => any;
  variant?: 'dark' | 'light' | 'warning' | 'danger' | 'success' | 'secondary' | 'primary' | 'default'
}
interface GridCellParams {
  value: any;
  field: string;
  row: GridRowData;
  column: Column;
  width?: number;
  variant?: 'dark' | 'light' | 'warning' | 'danger' | 'success' | 'secondary' | 'primary' | 'default'
}

interface NewTableProps {
  rows: GridRowData[];
  columns: Column[];
  disabled?: boolean;
  filterable?: boolean;
}
interface Filter {
  column: string;
  operator: string;
  value: string;
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
}: NewTableProps) => {
  const [filters, setFilters] = useState<Filter[]>([]);

  const data = useMemo(() => {
    return rows
  }, [rows])

  const { isComponentVisible, setIsComponentVisible, ref } = useComponentVisible(false)

  const addFilter = (e) => {
    setFilters([...filters, e])
  }
  return (
    <>
      <table className="relative mr-auto w-full table-auto text-left text-sm text-gray-700 dark:text-stone-300">
        <caption className="bg-zinc-200 p-5 text-left text-lg font-semibold text-gray-900 dark:bg-zinc-800 dark:text-white">
          <div className="relative w-fit" ref={ref}>
            <button className="inline-block relative rw-button rw-button-gray-outline" onClick={() => setIsComponentVisible(!isComponentVisible)}>
              <span className="sr-only">Filter</span>
              {(filters.length > 0) ? (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="w-5 pointer-events-none" fill="currentColor" stroke="currentColor">
                  <path d="M479.3 32H32.7C5.213 32-9.965 63.28 7.375 84.19L192 306.8V400c0 7.828 3.812 15.17 10.25 19.66l80 55.98C286.5 478.6 291.3 480 295.9 480C308.3 480 320 470.2 320 455.1V306.8l184.6-222.6C521.1 63.28 506.8 32 479.3 32zM295.4 286.4L288 295.3v145.3l-64-44.79V295.3L32.7 64h446.6l.6934-.2422L295.4 286.4z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" className="w-5 pointer-events-none" fill="currentColor" stroke="currentColor">
                  <path d="M352 440.6l-64-44.79V312.3L256 287V400c0 7.828 3.812 15.17 10.25 19.66l80 55.98C350.5 478.6 355.3 480 359.9 480C372.3 480 384 470.2 384 455.1v-67.91l-32-25.27V440.6zM543.3 64l.6934-.2422l-144.1 173.8l25.12 19.84l143.6-173.2C585.1 63.28 570.8 32 543.3 32H139.6l40.53 32H543.3zM633.9 483.4L25.92 3.42c-6.938-5.453-17-4.25-22.48 2.641c-5.469 6.938-4.281 17 2.641 22.48l608 480C617 510.9 620.5 512 623.1 512c4.734 0 9.422-2.094 12.58-6.078C642 498.1 640.8 488.9 633.9 483.4z" />
                </svg>
              )}
            </button>
            <div className={clsx(`absolute origin-top z-10 rounded m-1 border p-3 flex flex-col bg-black`, {
              'block': isComponentVisible,
              'hidden': !isComponentVisible,
            })}
            >
              <Form className="" config={{ mode: 'onBlur', context: "s" }} onSubmit={addFilter}>
                {filters.map(({ column, operator, value }, index) => (
                  <div
                    className="rw-button-group justify-start"
                    key={`filter-${index}`}
                  >
                    <select name="column" className="rw-input rw-input-small" defaultValue={column}>
                      {columns.map((column, idx) => (
                        <option key={`filter-${index}-column-${idx}`}>{column.field}</option>
                      ))}
                    </select>
                    <select name="operator" className="rw-input rw-input-small" defaultValue={operator}>
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
                    <input name="value" className="rw-input rw-input-small" defaultValue={value} />
                    <button className="rw-button rw-button-small rw-button-red" type="button" onClick={() => {
                      setFilters(filters.filter((f, i) => f !== filters[index]));
                    }}>-</button>
                  </div>
                ))}
                <div
                  className="rw-button-group justify-start"
                >
                  <SelectField name="column" className="rw-input rw-input-small">
                    {columns.map((column, index) => (
                      <option>{column.field}</option>
                    ))}
                  </SelectField>
                  <SelectField name="operator" className="rw-input rw-input-small">
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
                  <button className="rw-button rw-button-small rw-button-green">+</button>
                </div>
              </Form>
            </div>
          </div>
        </caption>
        <thead className="bg-zinc-400 text-sm uppercase text-zinc-700 dark:bg-zinc-700 dark:text-zinc-300">
          <tr>
            {columns.map((column, index) => (
              <th
                key={index}
                className="px-6 py-3 border-b border-zinc-500 dark:border-zinc-700"
              >
                {column.headerName}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-500 dark:divide-zinc-700">
          {data.map((row, index) => (
            <tr
              key={index}
              className="bg-zinc-100 dark:bg-zinc-800"
            >
              {columns.map((column, index) => (
                <td
                  key={index}
                  className="px-6 py-4 whitespace-nowrap"
                >
                  {column.valueGetter ? column.valueGetter({ row, column, value: row[column.field], field: column.field }) : row[column.field]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}

export default NewTable
