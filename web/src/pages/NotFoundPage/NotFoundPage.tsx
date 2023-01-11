import { Link, routes } from "@redwoodjs/router";

export default () => (
  <main className="flex items-center h-[100vh] text-center">
    <section className="dark:bg-[#252636] bg-white mx-auto">
      <div className="bg-[#0D2836] text-[#97FBFF] p-8 border border-[#60728F]">
        <h1 className="font-bold uppercase mb-3 text-2xl">Network Error</h1>
        <h1 className="my-8">
          <span>404 Page Not Found</span>
        </h1>
        <div className="flex flex-row mt-3 items-center text-center space-x-8">
          <Link to={routes.home()} className="uppercase w-full duration-150 bg-[#11667B] px-6 py-1 outline outline-1 transition-colors outline-[#11667B] outline-offset-1 hover:outline-offset-0 hover:outline-2">Accept</Link>
          <Link to={routes.home()} className="uppercase w-full duration-150 bg-[#11667B] px-6 py-1 outline outline-1 transition-colors outline-[#11667B] outline-offset-1 hover:outline-offset-0 hover:outline-2">Cancel</Link>
        </div>
      </div>
    </section>
  </main>
)
