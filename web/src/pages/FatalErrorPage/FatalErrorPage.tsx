// This page will be rendered when an error makes it all the way to the top of the
// application without being handled by a Javascript catch statement or React error
// boundary.
//
// You can modify this page as you wish, but it is important to keep things simple to
// avoid the possibility that it will cause its own error. If it does, Redwood will
// still render a generic error page, but your users will prefer something a bit more
// thoughtful. =)

import { Link, routes } from "@redwoodjs/router"

// Ensures that production builds do not include the error page
let RedwoodDevFatalErrorPage = undefined
if (process.env.NODE_ENV === 'development') {
  RedwoodDevFatalErrorPage =
    require('@redwoodjs/web/dist/components/DevFatalErrorPage').DevFatalErrorPage
}

export default RedwoodDevFatalErrorPage ||
  (() => (
    <main className="flex items-center h-[100vh] text-center">
      <section className="dark:bg-[#252636] bg-white mx-auto">
        <div className="bg-[#0D2836] text-[#97FBFF] p-8 border border-[#60728F]">
          <h1 className="font-bold uppercase mb-3 text-2xl">Error</h1>
          <h1 className="my-8">
            <span>Outgoing reliable buffer overflow</span>
          </h1>
          <div className="flex flex-row mt-3 items-center text-center space-x-8">
            <Link to={routes.home()} className="uppercase w-full duration-150 bg-[#11667B] px-6 py-1 outline outline-1 transition-colors outline-[#11667B] outline-offset-1 hover:outline-offset-0 hover:outline-2">Accept</Link>
            <Link to={routes.home()} className="uppercase w-full duration-150 bg-[#11667B] px-6 py-1 outline outline-1 transition-colors outline-[#11667B] outline-offset-1 hover:outline-offset-0 hover:outline-2">Cancel</Link>
          </div>
        </div>
      </section>
    </main>
  ))
