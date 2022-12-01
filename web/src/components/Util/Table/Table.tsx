import { Link, routes } from "@redwoodjs/router";
import { capitalize, isDate, timeTag, truncate } from "src/lib/formatters";

interface ITableProps<P = {}> {
  children?: React.ReactNode;
  data: Object[];
  cols?: any[];
  renderCell?: (params: any) => React.ReactNode;
  tableOptions?: {
    header: boolean;
  };
}
const Table = ({
  data,
  cols,
  renderCell,
  tableOptions = { header: true },
}: ITableProps) => {
  let keys = cols || Object.keys(data[0]);

  // TODO: Create filtering and sorting options for table
  return (
    <div className="flex">
      <div className="relative my-4 table w-full table-auto rounded-xl bg-gray-500 p-3 shadow">
        {(tableOptions && tableOptions.header) ?? (
          <div className="table-header-group">
            {keys.map((key) => (
              <div key={key} className="table-cell p-2 text-xs text-[#888da9]">
                {truncate(capitalize(key))}
              </div>
            ))}
          </div>
        )}
        {data.map((row) => (
          <div key={Math.random()} className="table-row-group">
            {keys.map((value) => (
              <>
                {value == "actions" ? (
                  <div
                    key={value}
                    className="table-cell p-2 text-xs text-black"
                  >
                    <nav className="flex flex-row">
                      <Link
                        to={routes.tribe({ id: row["id"] })}
                        title={"Show detail"}
                        className="rw-button rw-button-small"
                      >
                        Show
                      </Link>
                    </nav>
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
