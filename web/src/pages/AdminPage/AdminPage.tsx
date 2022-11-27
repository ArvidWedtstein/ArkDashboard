import { useAuth } from "@redwoodjs/auth";
import { Link, routes } from "@redwoodjs/router";
import { MetaTags } from "@redwoodjs/web";

const AdminPage = () => {
  return (
    <>
      <MetaTags title="Admin" description="Admin page" />
      {/* https://api.yomomma.info/ */}
      <div className="container-xl overflow-hidden p-3 text-center">
        <div className="app-main-right cards-area">
          <div className="app-main-right-header">
            <span>Latest Deals</span>
            <a href="#">See More</a>
          </div>
          <div className="card-wrapper main-card">
            <a className="block overflow-hidden border-2 border-red-700 transition-all">
              <div className="pt-[calc(591.44 / 1127.34 * 100%)] h-0 max-h-[40%] overflow-hidden rounded-sm border-2 border-red-600 bg-slate-400 bg-gradient-to-tr">
                <img
                  className="object relative -mt-[60.25%] w-full object-cover"
                  src="https://source.unsplash.com/featured/1200x900/?hotel-room,interior"
                />
              </div>
              <div className="card-info bg-slate-500 py-2 px-4">
                <div className="text-base font-semibold leading-6">
                  Hotel Conrad
                </div>
                <div className="text-xs font-semibold leading-6">
                  Stockton Street
                </div>
                <div className="text-xs font-semibold leading-6">
                  Starts from:
                  <span className="ml-2 inline-block text-xs font-semibold">
                    {" "}
                    $1000
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
