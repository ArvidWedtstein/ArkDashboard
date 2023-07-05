import { MetaTags } from "@redwoodjs/web";
import StatCard from "src/components/Util/StatCard/StatCard";
import Table from "src/components/Util/Table/Table";
import UserCard from "src/components/Util/UserCard/UserCard";

const AdminPage = () => {

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

        <Table columns={[{
          header: 'test',
          field: 'test',
        }]} rows={[
          {
            test: 'test',
          }
        ]} />
      </div>
    </>
  );
};

export default AdminPage;
