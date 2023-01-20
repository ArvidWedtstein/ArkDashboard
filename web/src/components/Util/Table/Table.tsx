import { Link, routes } from "@redwoodjs/router";
import { useEffect, useState } from "react";
import { capitalize, dynamicSort, isDate, timeTag, truncate } from "src/lib/formatters";

interface ColumnData {
  dataKey: string;
  label: string;
  numeric?: boolean;
  width: number;
}
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
interface TaybulProps {
  columns: ColumnData[];
  headerHeight?: number;
  onRowClick?: (row: Row) => void;
  rowCount: number;
  rowGetter: (row: Row) => any;
  rowHeight?: number;
}
export const Taybul = ({
  columns,
  headerHeight = 48,
  rowHeight = 48,
  onRowClick,
  rowCount,
  rowGetter,
}: TaybulProps) => {


  const cellRenderer = ({ cellData, columnIndex, ...other }) => {
    return (
      <div className="p-4 flex items-center box-border" style={{ height: rowHeight, textAlign: `${other.numeric || false ? 'right' : 'left'}` }}>
        <span className="w-full" style={{ alignSelf: `${other.numeric || false ? 'flex-end' : 'flex-start'}` }}>{cellData}</span>
      </div>
    )
  }

  const headerRenderer = ({ label, columnIndex }) => {
    return (
      <div className="flex items-center p-4 box-border cursor-default" style={{ height: headerHeight, textAlign: `${columns[columnIndex].numeric || false ? 'right' : 'left'}` }}>
        <span className="w-full place-self-end" style={{ alignSelf: `${columns[columnIndex].numeric || false ? 'flex-end' : 'flex-start'}` }}>{label}</span>
      </div>
    )
  }

  return (
    <table
      className="bg-red-500 w-full text-white"
    >
      <thead>
        <tr className="table-row">
          {columns.map(({ dataKey, ...other }, index) => {
            return (
              <th key={index} className="bg-slate-500 text-white table-cell">
                {headerRenderer({ label: other.label, columnIndex: index })}
              </th>
            )
          })}
        </tr>
        <tr className="border border-transparet border-b-neutral-600"></tr>
      </thead>
      <tbody>
        {Array(rowCount).fill({}).map((_, i) => {
          return (
            <>
              <tr
                key={i}
                className="bg-slate-500 text-white table-row"
                onClick={() => onRowClick && onRowClick({ index: i })}
              >
                {columns.map(({ dataKey, ...other }, index) => {
                  return (
                    <td key={index} className="bg-slate-500 text-white">
                      {cellRenderer({ cellData: rowGetter({ index: i })[index + 1], columnIndex: index, ...other })}
                    </td>
                  )
                })}
              </tr>
              <tr className="border border-transparet border-b-neutral-600"></tr>
            </>
          )
        })}
      </tbody>
    </table>
  )
}
// let rows = [
//   [1, "Tribes", 5],
//   [2, "Tribes2", 50]
// ]
// <Taybul
// rowCount={2}
// rowGetter={({ index }) => rows[index]}
// columns={[
//   {
//     width: 200,
//     label: 'Name',
//     dataKey: 'name',
//   },
//   {
//     width: 120,
//     label: "Pain",
//     dataKey: "pain",
//     numeric: true,
//   },
// ]}
// ></Taybul>

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
