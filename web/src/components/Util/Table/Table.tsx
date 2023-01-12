import { Link, routes } from "@redwoodjs/router";
import { useEffect, useState } from "react";
import { capitalize, dynamicSort, isDate, timeTag, truncate } from "src/lib/formatters";

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
const Table = ({
  data,
  cols,
  renderCell,
  renderActions,
  tableOptions = { header: true },
  className,
}: ITableProps) => {
  if (!data || data.length < 1) return null;
  // let tableData = useState(data);
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
              <div key={`${key}${Math.random()}`} onClick={() => sort(key)} className="table-cell p-2 text-xs text-[#888da9]">
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
