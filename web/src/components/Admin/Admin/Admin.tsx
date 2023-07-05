import { MetaTags } from "@redwoodjs/web"
import StatCard from "src/components/Util/StatCard/StatCard"
import Table from "src/components/Util/Table/Table"
import { FindAdminData } from "types/graphql"

const Admin = ({ basespots }: FindAdminData) => {
  return (
    <>
      <MetaTags title="Admin" description="Admin page" />

      {/* TODO: Replace with taybul?*/}
      <div className="container-xl overflow-hidden p-3 text-center m-4">
        <div className="flex flex-col-reverse md:flex-row space-x-3 mb-3">
          <StatCard stat={"Test"} value={10} />
          <StatCard stat={"Test"} value={10} />
          <StatCard stat={"Test"} value={10} />
          <StatCard stat={"Test"} value={10} />
        </div>
        <Table settings={{
          borders: { horizontal: true, vertical: true }
        }} columns={[{
          header: "Name",
          field: "name",
        }, {
          header: "Description",
          field: "description",
        }, {
          header: "Map",
          field: "Map.name",
        }]} rows={basespots} />
        {/* Object.keys(basespots[0]).map((f) => {
          if (f !== "__typename" && f !== "Map") {
            return {
              label: f,
              field: f,
            }
          }
          return null
        }).filter((f) => f != null) */}
      </div>
    </>
  )
}

export default Admin
