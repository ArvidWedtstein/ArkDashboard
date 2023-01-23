import { Link, routes } from "@redwoodjs/router";
import { bool } from "prop-types";
import { useEffect, useState } from "react";
import useComponentVisible from "src/components/useComponentVisible";
import { capitalize, dynamicSort, isDate, remDupicates, timeTag, truncate } from "src/lib/formatters";


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
  width?: number;
  bold?: boolean;
  sortable?: boolean;
}
interface TaybulProps {
  columns: ColumnData[];
  hover?: boolean;
  rowGetter: (row: Row) => any;
  onRowClick?: (row: Row) => void;
  rowCount: number;
  rows?: any[];
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
}
export const Taybul = ({
  columns,
  rows: dataRows,
  onRowClick,
  rowGetter,
  rowCount,
  className,
  caption,
  headersVertical = false,
  summary = false,
  hover = false,
  select = false,
  search = false,
  filter = false,
}: TaybulProps) => {
  const [rows, setRows] = useState<any[]>([]);
  const { ref, isComponentVisible, setIsComponentVisible } = useComponentVisible(false);
  const [sort, setSort] = useState({
    column: '',
    direction: 'asc',
  });
  const [rowData, setRowData] = useState([]);

  const sortRows = (e) => {
    let column = e.target.id;
    let direction = sort.direction === 'asc' ? 'desc' : 'asc';
    setSort({ column, direction });
  };

  useEffect(() => {
    setRowData(sortData(rowData));
  }, [sort]);

  const sortData = (data: any[]) => {
    let { column, direction } = sort;
    if (column) {
      data.sort(dynamicSort(column));
      if (direction === 'desc') {
        data.reverse();
      }
    }
    return data;
  };

  useEffect(() => {
    if (select) {
      let daRows = document.querySelectorAll('input[type="checkbox"][id^="checkbox-row"]');
      setRows([...daRows]);
    }
    setRowData(dataRows);
  }, []);


  // https://flowbite.com/docs/components/tables/

  const setFilter = (e) => {
    console.log(e.target.value);
  }

  const selectRow = (e) => {
    if (e.target.id === 'checkbox-all-select') {
      rows.map((row) => {
        if (row.checked !== e.target.checked) {
          row.checked = e.target.checked;
        }
      });
      return
    }

    let check: any = document.getElementById('checkbox-all-select');
    if (!e.target.checked) {
      check.checked = e.target.checked;
    } else {
      if (rows.every((row) => row.checked === true) && rows.length > 0) {
        check.checked = true;
      }
    }
    // let daRows = document.querySelectorAll('input[type="checkbox"][id^="checkbox-row"]');

    // setRows([...daRows]);
  }


  const headerRenderer = ({ label, columnIndex, ...other }) => {
    return (
      <th key={`${columnIndex}-${label}`} className="px-6 py-3" style={{ width: `${other.width}px` }} scope="col">
        {other.sortable ? (
          <div className="flex items-center select-none" id={other.dataKey} onClick={sortRows}>
            {label}
            {sort.column === other.dataKey ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 ml-1" fill="currentColor" viewBox="0 0 320 512">{sort.direction === 'asc' ? (
                <path d="M182.6 41.4c-12.5-12.5-32.8-12.5-45.3 0l-128 128c-9.2 9.2-11.9 22.9-6.9 34.9s16.6 19.8 29.6 19.8H288c12.9 0 24.6-7.8 29.6-19.8s2.2-25.7-6.9-34.9l-128-128z" />
              ) : (
                <path d="M182.6 470.6c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-9.2-9.2-11.9-22.9-6.9-34.9s16.6-19.8 29.6-19.8H288c12.9 0 24.6 7.8 29.6 19.8s2.2 25.7-6.9 34.9l-128 128z" />
              )}</svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 ml-1" aria-hidden="true" fill="currentColor" viewBox="0 0 320 512"><path d="M27.66 224h264.7c24.6 0 36.89-29.78 19.54-47.12l-132.3-136.8c-5.406-5.406-12.47-8.107-19.53-8.107c-7.055 0-14.09 2.701-19.45 8.107L8.119 176.9C-9.229 194.2 3.055 224 27.66 224zM292.3 288H27.66c-24.6 0-36.89 29.77-19.54 47.12l132.5 136.8C145.9 477.3 152.1 480 160 480c7.053 0 14.12-2.703 19.53-8.109l132.3-136.8C329.2 317.8 316.9 288 292.3 288z" /></svg>
            )}

          </div>) : label}
      </th>
    )
  }

  const cellRenderer = ({ cellData, columnIndex, ...other }) => {
    {/* textAlign: `${other.numeric || false ? 'right' : 'left'}`*/ }
    return (
      <td key={`${columnIndex}-${cellData}`} className={`px-6 py-4 ${other.bold ? 'font-bold text-gray-900 whitespace-nowrap dark:text-white' : ''}`} style={{ width: `${other.width}px` }}>
        {cellData}
      </td>
    )
  }
  const tableSelect = ({ header = false, row }: { header?: boolean, row: number }) => {
    return (
      <td className="p-4 w-4" scope="col">
        <div className="flex items-center">
          <input id={header ? "checkbox-all-select" : `checkbox-row-${row}`} onChange={selectRow} type="checkbox" className="w-4 h-4 rw-input" />
          <label htmlFor={header ? "checkbox-all-select" : `checkbox-row-${row}`} className="sr-only">checkbox</label>
        </div>
      </td>
    )
  }
  const tableFooter = () => {
    return (
      <tfoot>
        <tr className="font-semibold text-gray-900 dark:text-white">
          {select && (
            <td className="p-4">
            </td>
          )}
          {columns.map(({ dataKey, ...other }, index) => {
            return (
              <th key={`${index}-${dataKey}`} className={`px-6 py-3 ${other.numeric ? 'text-base' : ''}`} style={{ width: other.width }}>
                {other.numeric ? Array(rowCount).fill({}).map((_, i) => {
                  return rowData.length > 0 ? rowData[i][dataKey] : dataRows[i][dataKey]
                }).reduce((a, b) => a + b, 0) : 'Total'}
              </th>
            )
          })}
        </tr>
      </tfoot>
    )
  }
  return (
    <div className={`relative overflow-x-auto shadow-md sm:rounded-lg ${className}`}>
      {(filter || search) && (
        <div className="flex items-center justify-between pb-4">
          {filter && (
            <div>
              <button onClick={() => setIsComponentVisible(!isComponentVisible)} className="inline-flex items-center text-gray-500 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-3 py-1.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700" type="button">
                <svg className="w-4 h-4 mr-2 text-gray-400" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"></path></svg>
                Last 30 days
                <svg className="w-3 h-3 ml-2" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </button>

              <div ref={ref} className="z-10 w-48 bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600" style={{ display: isComponentVisible ? '' : 'none', position: 'absolute', inset: 'auto auto 0px 0px', margin: '0px' }}>
                <ul className="p-3 space-y-1 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownRadioButton">
                  <li>
                    <div className="flex items-center p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
                      <input id="filter-radio-0" type="radio" value="-1h" onChange={setFilter} name="filter-radio" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                      <label htmlFor="filter-radio-0" className="w-full ml-2 text-sm font-medium text-gray-900 rounded dark:text-gray-300">Last hour</label>
                    </div>
                  </li>
                  <li>
                    <div className="flex items-center p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
                      <input id="filter-radio-1" type="radio" value="-1" onChange={setFilter} name="filter-radio" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                      <label htmlFor="filter-radio-1" className="w-full ml-2 text-sm font-medium text-gray-900 rounded dark:text-gray-300">Last day</label>
                    </div>
                  </li>
                  <li>
                    <div className="flex items-center p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
                      <input id="filter-radio-2" type="radio" value="-7" onChange={setFilter} name="filter-radio" defaultChecked className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                      <label htmlFor="filter-radio-2" className="w-full ml-2 text-sm font-medium text-gray-900 rounded dark:text-gray-300">Last 7 days</label>
                    </div>
                  </li>
                  <li>
                    <div className="flex items-center p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
                      <input id="filter-radio-3" type="radio" value="-30" onChange={setFilter} name="filter-radio" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                      <label htmlFor="filter-radio-3" className="w-full ml-2 text-sm font-medium text-gray-900 rounded dark:text-gray-300">Last 30 days</label>
                    </div>
                  </li>
                  <li>
                    <div className="flex items-center p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
                      <input id="filter-radio-4" type="radio" value="-365" onChange={setFilter} name="filter-radio" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                      <label htmlFor="filter-radio-4" className="w-full ml-2 text-sm font-medium text-gray-900 rounded dark:text-gray-300">Last year</label>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          )}
          <label htmlFor="table-search" className="sr-only">Search</label>
          {search && (
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"></path></svg>
              </div>
              <input type="text" id="table-search" className="block p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search for items" />
            </div>
          )}
        </div>
      )}
      <table
        className="w-full text-sm text-left text-gray-500 dark:text-gray-400"
      >
        {!!caption && (
          <caption className="p-5 text-lg font-semibold text-left text-gray-900 bg-white dark:text-white dark:bg-gray-800">
            {caption.title}
            <p className="mt-1 text-sm font-normal text-gray-500 dark:text-gray-400">{caption.text}</p>
          </caption>
        )}
        {!headersVertical && (
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr className="table-row">
              {select && tableSelect({ header: true, row: 0 })}
              {columns.map(({ ...other }, index) => {
                return (
                  headerRenderer({ label: other.label, columnIndex: index, ...other })
                )
              })}
            </tr>
          </thead>
        )}
        <tbody>
          {headersVertical ? (
            <>{
              columns.map(({ dataKey, ...other }, index) => {
                return (
                  <tr
                    key={index}
                    className={`bg-white border-b dark:bg-gray-800 dark:border-gray-700 ${hover ? 'dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600' : ''}`}
                    onClick={() => onRowClick && onRowClick({ index: index })}
                  >
                    {headerRenderer({ label: other.label, columnIndex: index, ...other })}
                    {Array(rowCount).fill({}).map((_, i) => {
                      return (
                        cellRenderer({ cellData: rowData[i][dataKey], columnIndex: index, ...other })
                      )
                    })}
                  </tr>
                )
              })}</>
          ) : (
            dataRows.map((datarow, i) => {
              return (
                <tr
                  key={i}
                  className={`bg-white border-b dark:bg-gray-800 dark:border-gray-700 ${hover ? 'dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600' : ''}`}
                  onClick={() => onRowClick && onRowClick({ index: i })}
                >
                  {select && tableSelect({ row: i })}
                  {columns.map(({ dataKey, ...other }, index) => {
                    return (
                      cellRenderer({ cellData: datarow[dataKey], columnIndex: index, ...other })
                    )
                  })}
                </tr>
              )
            })
          )}
        </tbody>
        {summary && tableFooter()}
      </table>
      {/* <nav className="flex items-center justify-between pt-4" aria-label="Table navigation">
        <span className="text-sm font-normal text-gray-500 dark:text-gray-400">Showing <span className="font-semibold text-gray-900 dark:text-white">1-10</span> of <span className="font-semibold text-gray-900 dark:text-white">1000</span></span>
        <ul className="inline-flex items-center -space-x-px">
          <li>
            <a href="#" className="block px-3 py-2 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
              <span className="sr-only">Previous</span>
              <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
            </a>
          </li>
          <li>
            <a href="#" className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">1</a>
          </li>
          <li>
            <a href="#" className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">2</a>
          </li>
          <li>
            <a href="#" aria-current="page" className="z-10 px-3 py-2 leading-tight text-blue-600 border border-blue-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white">3</a>
          </li>
          <li>
            <a href="#" className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">...</a>
          </li>
          <li>
            <a href="#" className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">100</a>
          </li>
          <li>
            <a href="#" className="block px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
              <span className="sr-only">Next</span>
              <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path></svg>
            </a>
          </li>
        </ul>
      </nav> */}
    </div >
  )
}

const Table = ({
  data,
  cols,
  renderCell,
  renderActions,
  tableOptions = { header: true },
  className
}: ITableProps) => {
  if (!data || data.length < 1) return null;


  let keys = cols || Object.keys(data[0]);

  // https://codesandbox.io/s/3rso2u
  const sort = (key: string) => {
    data = data.sort(dynamicSort(key));
    // tableData = tableData.sort(dynamicSort(key));
  }
  // TODO: Create filtering and sorting options for table
  return (
    <div className={`flex ${className}`}>
      <div className="relative my-4 table w-full table-auto rounded-xl bg-white dark:bg-neutral-800 border border-black dark:border-white p-3 shadow">
        {(tableOptions && tableOptions.header) && (
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
