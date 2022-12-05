import { Link, routes } from "@redwoodjs/router";
import { capitalize, isDate, timeTag, truncate } from "src/lib/formatters";

interface ITableProps<P = {}> {
  children?: React.ReactNode;
  data: Object[];
  cols?: any[];
  renderCell?: (params: any) => React.ReactNode;
  renderActions?: (params: any) => React.ReactNode;
  tableOptions?: {
    header: boolean;
  };
}
const Table = ({
  data,
  cols,
  renderCell,
  renderActions,
  tableOptions = { header: true },
}: ITableProps) => {
  if (!data || data.length < 1) return null;
  let keys = cols || Object.keys(data[0]);



  const sort = (key: string) => {
    console.log(key)
    let i = 9
    let dir = 'asc'
    let s = data.sort((a, b) => (a[key] > b[key]) ? 1 : ((b[key] > a[key]) ? -1 : 0))
    console.log(s)
    // for (i = 1; i < (data.length - 1); i++) {

    // }
  }
  // TODO: Create filtering and sorting options for table
  return (
    <div className="flex">
      <div className="relative my-4 table w-full table-auto rounded-xl bg-white border border-black p-3 shadow">
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
            {keys.map((value) => (
              <>
                {value == "actions" ? (
                  <div
                    key={value}
                    className="table-cell p-2 text-xs text-black"
                  >
                    {renderActions && renderActions(row)}
                  </div>
                ) : (
                  <>
                    {renderCell ? (
                      <div
                        key={Math.random()}
                        className="table-cell p-2 text-xs text-black"
                      >
                        {renderCell({ id: value, amount: row[value] })}
                      </div>
                    ) : (
                      <div
                        key={Math.random()}
                        className="table-cell p-2 text-xs text-black"
                      >
                        {" "}
                        {isDate(row[value])
                          ? timeTag(row[value])
                          : truncate(row[value])}
                      </div>
                    )}
                  </>
                )}
              </>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Table;
