import { Link, routes } from "@redwoodjs/router";
import { capitalize, isDate, timeTag, truncate } from "src/lib/formatters";

const Table = ({ data, cols }: { data: Object[], cols?: any[] }) => {
  let keys = cols || Object.keys(data[0]);

  // TODO: Create filtering and sorting options for table
  return (
    <div className="table table-auto w-full drop-shadow-lg bg-white rounded-xl p-3">
      <div className="table-header-group">
        {keys.map((key) => (
          <div className="text-xs table-cell p-2 text-[#888da9]">{truncate(capitalize(key))}</div>
        ))}
      </div>
      {
        data.map((row) => (
          <div className="table-row-group">
            {keys.map((value) => (
              <>
                {value == "actions" ? (
                  <div className="table-cell text-xs text-black p-2">
                    <nav className="flex flex-row">
                      <Link
                        to={routes.tribe({ id: row["id"] })}
                        title={'Show tribe detail'}
                        className="rw-button rw-button-small"
                      >
                        Show
                      </Link>
                    </nav>
                  </div>
                ) : (
                  <div className="table-cell text-xs text-black p-2"> {isDate(row[value]) ? timeTag(row[value]) : truncate(row[value])}</div>
                )}
              </>
            ))}
          </div>
        ))
      }
    </div >
  )
}

export default Table
