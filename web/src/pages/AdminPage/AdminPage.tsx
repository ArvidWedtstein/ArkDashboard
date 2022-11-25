import { Link, routes } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'

const AdminPage = () => {
  return (
    <>
      <MetaTags title="Admin" description="Admin page" />
      {/* https://api.yomomma.info/ */}
      <div className="container-xl p-3 text-center overflow-hidden">
        <div className="app-main-right cards-area">
          <div className="app-main-right-header">
            <span>Latest Deals</span>
            <a href="#">See More</a>
          </div>
          <div className="card-wrapper main-card">
            <a className="border-2 border-red-700 overflow-hidden block transition-all">
              <div className="max-h-[40%] rounded-sm overflow-hidden border-2 border-red-600 h-0 pt-[calc(591.44 / 1127.34 * 100%)] bg-slate-400 bg-gradient-to-tr">
                <img className="w-full object object-cover relative -mt-[60.25%]" src="https://source.unsplash.com/featured/1200x900/?hotel-room,interior" />
              </div>
              <div className="card-info py-2 px-4 bg-slate-500">
                <div className="leading-6 text-base font-semibold">Hotel Conrad</div>
                <div className="leading-6 text-xs font-semibold">Stockton Street</div>
                <div className="leading-6 text-xs font-semibold">
                  Starts from:
                  <span className="text-xs font-semibold inline-block ml-2"> $1000</span>
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </>
  )
}

export default AdminPage
