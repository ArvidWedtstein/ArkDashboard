import { useAuth } from "@redwoodjs/auth";
import { Link, routes } from "@redwoodjs/router";
import { MetaTags } from "@redwoodjs/web";
import UserCard from "src/components/Util/UserCard/UserCard";

const AdminPage = () => {
  new Date().toISOString()
  return (
    <>
      <MetaTags title="Admin" description="Admin page" />

      {/* TODO: Replace with taybul?*/}
      <div className="container-xl overflow-hidden p-3 text-center">
        <div className="flex-[2 0 0] relative ml-6 h-full max-h-[300px] max-w-[400px] overflow-y-auto rounded bg-slate-700 p-6">
          <div className="flex items-center justify-between py-4 text-gray-500">
            <span className="text-lg font-semibold">Users</span>
          </div>
          <div className="w-100 py-2">
            <UserCard user={
              {
                name: 'test',
                subtext: "Peasant",
                img: 'https://randomuser.me/portraits/men/4.jpg'
              }
            } />
            <UserCard user={
              {
                name: 'test',
                subtext: "Peasant",
                img: 'https://randomuser.me/portraits/men/4.jpg'
              }
            } />
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminPage;
