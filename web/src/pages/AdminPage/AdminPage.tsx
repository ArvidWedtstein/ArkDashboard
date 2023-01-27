import { useAuth } from "@redwoodjs/auth";
import { Link, routes } from "@redwoodjs/router";
import { MetaTags } from "@redwoodjs/web";
import UserCard from "src/components/Util/UserCard/UserCard";

const AdminPage = () => {
  return (
    <>
      <MetaTags title="Admin" description="Admin page" />
      <UserCard user={
        {
          name: 'test',
          subtext: "Jøde",
          img: 'https://randomuser.me/portraits/men/4.jpg'
        }
      } />
      <div className="container-xl overflow-hidden p-3 text-center">
        <div className="flex-[2 0 0] relative ml-6 h-full max-h-[300px] max-w-[400px] overflow-y-auto rounded bg-slate-700 p-6">
          <div className="flex items-center justify-between py-4 text-gray-500">
            <span className="text-lg font-semibold">Latest Deals</span>
          </div>
          <div className="w-100 main-card py-2">
            <a className="block overflow-hidden border-2 transition-all">
              <div className="pt-[calc(591.44 / 1127.34 * 100%)] h-0 max-h-[40%] overflow-hidden rounded-sm bg-slate-400 bg-gradient-to-tr">
                <img
                  className="object relative -mt-[60.25%] w-full object-cover"
                  src="https://source.unsplash.com/featured/1200x900/?hotel-room,interior"
                />
              </div>
              <div className="bg-slate-500 py-2 px-4">
                <div className="text-base font-semibold leading-6">
                  Arvid Wedtstein
                </div>
                <div className="text-xs font-semibold leading-6">Admin</div>
                <div className="text-xs font-semibold leading-6">
                  Role:
                  <span className="ml-2 inline-block text-xs font-semibold">
                    Admin
                  </span>
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminPage;
