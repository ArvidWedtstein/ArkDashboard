import { TextField } from "@redwoodjs/forms";
import { Link, routes } from "@redwoodjs/router";
import { bool } from "prop-types";
import { memo, useEffect, useMemo, useState } from "react";
import {
  capitalize,
  debounce,
  dynamicSort,
  isDate,
  isUUID,
  timeTag,
  truncate,
} from "src/lib/formatters";

interface Row {
  index: number;
}
interface ITableProps<P = {}> {
  children?: React.ReactNode;
  data: Object[];
  cols?: any[];
  renderCell?: (params: any) => React.ReactNode;
  renderActions?: (params: any) => React.ReactNode;
  tableOptions?: {
    header: boolean;
  };
  className?: string;
}
interface ColumnData {
  dataKey: string;
  label: string;
  numeric?: boolean;
  bold?: boolean;
  sortable?: boolean;
}
interface TaybulProps {
  columns: ColumnData[];
  hover?: boolean;
  onRowClick?: (row: Row) => void;
  rows: any[];
  headersVertical?: boolean;
  summary?: boolean;
  caption?: {
    title: string;
    text: string;
  };
  className?: string;
  select?: boolean;
  search?: boolean;
  filter?: boolean;
  rowsPerPage?: number;
  renderActions?: (row: any) => React.ReactNode;
}

/**
 * @todo add functionality for row click
 * @borrows dynamicSort and debounce from formatters.ts
 * @param param
 * @returns
 */
export const Taybul = ({
  columns,
  rows: dataRows,
  onRowClick,
  className,
  caption,
  headersVertical = false,
  summary = false,
  hover = false,
  select = false,
  search = false,
  filter = false,
  rowsPerPage,
  renderActions,
}: TaybulProps) => {
  const [rows, setRows] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sort, setSort] = useState({
    column: "",
    direction: "asc",
  });

  const sortRows = (e) => {
    let column = e.target.id;
    let direction = sort.direction === "asc" ? "desc" : "asc";
    setSort({ column, direction });
  };

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
    let filteredData = dataRows.filter((row) => {
      let rowValues = Object.values(row);
      let rowString = rowValues.join(" ");
      return rowString.toLowerCase().includes(searchTerm.toLowerCase());
    });

    return sortData(filteredData);
  }, [sort, searchTerm, dataRows]);

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

  const headerRenderer = ({ label, columnIndex, ...other }) => {
    return (
      <th key={`${columnIndex}-${label}`} className="px-6 py-3" scope="col">
        {other.sortable ? (
          <div
            className="flex select-none items-center"
            id={other.dataKey}
            onClick={sortRows}
          >
            {truncate(label, 30)}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="ml-1 h-3 w-3"
              fill="currentColor"
              viewBox="0 0 320 512"
            >
              {sort.column === other.dataKey ? (
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

  const cellRenderer = ({ rowData, cellData, columnIndex, ...other }) => {
    {
      /* textAlign: `${other.numeric || false ? 'right' : 'left'}`*/
    }
    return (
      <td
        key={`${columnIndex}-${cellData}`}
        className={`px-6 py-4 ${
          other.bold
            ? "whitespace-nowrap font-bold text-gray-900 dark:text-white"
            : ""
        }`}
      >
        {/* {isDate(cellData) ? timeTag(cellData) : truncate(cellData, 30)} */}
        {isUUID(cellData) && other.label.toLowerCase() === "created by" ? (
          <div className="flex flex-row">
            {rowData.Profile.avatar_url && (
              <img
                className="h-10 w-10 rounded-full"
                src={`https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/avatars/${rowData.Profile.avatar_url}`}
                alt={rowData.Profile.full_name || "Profile Image"}
              />
            )}
            <div className="flex items-center pl-3">
              <div className="text-base font-semibold">
                {rowData.Profile.full_name}
              </div>
              {/* <div className="font-normal text-gray-500">
                {rowData.Profile.role_id}
              </div> */}
            </div>
          </div>
        ) : isDate(cellData) ? (
          timeTag(cellData)
        ) : (
          truncate(cellData, 30)
        )}
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
  const tableFooter = () => {
    return (
      <tfoot>
        <tr className="font-semibold text-gray-900 dark:text-white">
          {select && <td className="p-4"></td>}
          {columns.map(({ dataKey, ...other }, index) => {
            return (
              <th
                key={`${index}-${dataKey}`}
                className={`px-6 py-3 ${other.numeric ? "text-base" : ""}`}
              >
                {other.numeric
                  ? SortedFilteredData.reduce((a, b) => a + b[dataKey], 0)
                  : "Total"}
              </th>
            );
          })}
        </tr>
      </tfoot>
    );
  };

  // const tablePagination = () => {
  //   return (
  //     <nav className="flex items-center justify-between pt-4" aria-label="Table navigation">
  //       <span className="ml-1 text-sm font-normal text-gray-500 dark:text-gray-400">Showing <span className="font-semibold text-gray-900 dark:text-white">1-{rowsPerPage * 1}</span> of <span className="font-semibold text-gray-900 dark:text-white">{rows.length}</span></span>
  //       <ul className="inline-flex items-center -space-x-px">
  //         <li>
  //           <a href="#" className="block px-3 py-2 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
  //             <span className="sr-only">Previous</span>
  //             <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
  //           </a>
  //         </li>
  //         <li>
  //           <a href="#" className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">1</a>
  //         </li>
  //         <li>
  //           <a href="#" className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">2</a>
  //         </li>
  //         <li>
  //           <a href="#" aria-current="page" className="z-10 px-3 py-2 leading-tight text-blue-600 border border-blue-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white">3</a>
  //         </li>
  //         <li>
  //           <a href="#" className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">...</a>
  //         </li>
  //         <li>
  //           <a href="#" className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">100</a>
  //         </li>
  //         <li>
  //           <a href="#" className="block px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
  //             <span className="sr-only">Next</span>
  //             <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path></svg>
  //           </a>
  //         </li>
  //       </ul>
  //     </nav>
  //   )
  // }

  return (
    <div
      className={`relative overflow-x-auto shadow-md sm:rounded-lg ${className}`}
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
      <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
        {!!caption && (
          <caption className="bg-white p-5 text-left text-lg font-semibold text-gray-900 dark:bg-gray-800 dark:text-white">
            {caption.title}
            <p className="mt-1 text-sm font-normal text-gray-500 dark:text-gray-400">
              {caption.text}
            </p>
          </caption>
        )}
        {!headersVertical && (
          <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
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
        <tbody>
          {headersVertical ? (
            <>
              {columns.map(({ dataKey, ...other }, index) => {
                return (
                  <tr
                    key={index}
                    className={`border-b bg-white dark:border-gray-700 dark:bg-gray-800 ${
                      hover
                        ? "hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-600"
                        : ""
                    }`}
                    onClick={() => onRowClick && onRowClick({ index: index })}
                  >
                    {headerRenderer({
                      label: other.label,
                      columnIndex: index,
                      ...other,
                    })}
                    {SortedFilteredData.map((datarow) => {
                      return cellRenderer({
                        rowData: datarow,
                        cellData: datarow[dataKey],
                        columnIndex: index,
                        ...other,
                      });
                    })}
                  </tr>
                );
              })}
            </>
          ) : (
            SortedFilteredData.map((datarow, i) => {
              return (
                <tr
                  key={i}
                  className={`border-b bg-white dark:border-gray-700 dark:bg-slate-800 ${
                    hover
                      ? "hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-600"
                      : ""
                  }`}
                  onClick={() => onRowClick && onRowClick({ index: i })}
                >
                  {select && tableSelect({ row: i })}
                  {columns.map(({ dataKey, ...other }, index) => {
                    return cellRenderer({
                      rowData: datarow,
                      cellData: datarow[dataKey],
                      columnIndex: index,
                      ...other,
                    });
                  })}
                  {renderActions && <td>{renderActions(datarow)}</td>}
                </tr>
              );
            })
          )}
        </tbody>
        {summary && tableFooter()}
      </table>
      {/* {rowsPerPage && tablePagination()} */}
    </div>
  );
};

const Table = ({
  data,
  cols,
  renderCell,
  renderActions,
  tableOptions = { header: true },
  className,
}: ITableProps) => {
  if (!data || data.length < 1) return null;

  let keys = cols || Object.keys(data[0]);

  // https://codesandbox.io/s/3rso2u
  const sort = (key: string) => {
    data = data.sort(dynamicSort(key));
    // tableData = tableData.sort(dynamicSort(key));
  };
  // TODO: Create filtering and sorting options for table
  return (
    <div className={`flex ${className && className}`}>
      <div className="dark:border-pea-400 relative my-4 table w-full table-auto rounded-xl border p-3 shadow">
        {tableOptions && tableOptions.header && (
          <div className="table-header-group">
            {keys.map((key) => (
              <div
                key={`${key}${Math.random()}`}
                onClick={() => sort(key)}
                className="table-cell p-2 text-xs text-[#888da9]"
                // /*aria-[sort=ascending]:bg-red-500 aria-[sort=descending]:bg-red-400*/
              >
                {truncate(capitalize(key))}
              </div>
            ))}
          </div>
        )}
        {data.map((row) => (
          <div key={Math.random() * Math.random()} className="table-row-group">
            {keys.map((value, i) => (
              <div key={`table-item-${i}`} className="table-cell">
                {value == "actions" ? (
                  <div
                    key={value}
                    className="p-2 text-xs text-black dark:text-stone-200"
                  >
                    {renderActions && renderActions(row)}
                  </div>
                ) : (
                  <>
                    {renderCell ? (
                      <div
                        key={Math.random()}
                        className="p-2 text-xs text-black dark:text-stone-200"
                      >
                        {renderCell({ id: value, amount: row[value] })}
                      </div>
                    ) : (
                      <div
                        key={Math.random()}
                        className="p-2 text-xs text-black dark:text-stone-200"
                      >
                        {isDate(row[value])
                          ? timeTag(row[value])
                          : truncate(row[value])}
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Table;
