import { Link, routes } from "@redwoodjs/router";
import { capitalize, isDate, timeTag, truncate } from "src/lib/formatters";

interface ITableProps<P = {}> {
  children?: React.ReactNode;
  data: Object[];
  cols?: any[];
  renderCell?: (params: any) => React.ReactNode
  tableOptions?: {
    header: boolean;
  }
}
const Table = ({ data, cols, renderCell, tableOptions = { header: true } }: ITableProps) => {
  let keys = cols || Object.keys(data[0]);

  // TODO: Create filtering and sorting options for table
  return (
    <div className="flex">
      <div className="relative table table-auto my-4 w-full rounded-xl p-3 bg-white shadow">

        {(tableOptions && tableOptions.header) ?? <div className="table-header-group">
          {keys.map((key) => (
            <div key={key} className="text-xs table-cell p-2 text-[#888da9]">{truncate(capitalize(key))}</div>
          ))}
        </div>}
        {
          data.map((row) => (
            <div key={Math.random()} className="table-row-group">
              {
                keys.map((value) => (
                  <>
                    {value == "actions" ? (
                      <div key={value} className="table-cell text-xs text-black p-2">
                        <nav className="flex flex-row">
                          <Link
                            to={routes.tribe({ id: row["id"] })}
                            title={'Show detail'}
                            className="rw-button rw-button-small"
                          >
                            Show
                          </Link>
                        </nav>
                      </div>
                    ) : (
                      <>
                        {
                          renderCell ? (
                            <div key={Math.random()} className="table-cell text-xs text-black p-2">{renderCell({ id: value, amount: row[value] })}</div>
                          ) : (
                            <div key={Math.random()} className="table-cell text-xs text-black p-2"> {isDate(row[value]) ? timeTag(row[value]) : truncate(row[value])}</div>
                          )
                        }
                      </>
                    )}
                  </>
                ))
              }
            </div>
          ))
        }
      </div>
    </div >
  )
}

export default Table
