import { useLazyQuery } from "@apollo/client";
import { useQuery } from "@redwoodjs/web";
import { DocumentNode } from 'graphql';
interface DataTableProps {
  QUERY: DocumentNode;
}
const DataTable = ({
  QUERY
}) => {
  // const [load, { data, loading, error }] = useLazyQuery(QUERY)
  const { data, loading, error } = useQuery(QUERY)

  if (loading) {
    return <p>Loading...</p>
  }

  if (error) {
    return <p>Error: {error.message}</p>
  }

  const columns = Object.keys(data[Object.keys(data)[0]][0] || {})
  const rowdata = data[Object.keys(data)[0]]
  console.log(rowdata)
  return (
    <table className="rw-table">
      <thead>
        <tr>
          {columns.map((column) => (
            <th className="capitalize" key={column}>{column}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rowdata.map((item) => (
          <tr key={item.id}>
            {columns.map((column) => (
              <td key={column}>{item[column]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default DataTable
