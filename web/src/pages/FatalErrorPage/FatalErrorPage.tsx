// This page will be rendered when an error makes it all the way to the top of the
// application without being handled by a Javascript catch statement or React error
// boundary.
//
// You can modify this page as you wish, but it is important to keep things simple to
// avoid the possibility that it will cause its own error. If it does, Redwood will
// still render a generic error page, but your users will prefer something a bit more
// thoughtful. =)

import { Link, routes } from "@redwoodjs/router";

// Ensures that production builds do not include the error page
let RedwoodDevFatalErrorPage = undefined;
if (process.env.NODE_ENV === "development") {
  RedwoodDevFatalErrorPage =
    require("@redwoodjs/web/dist/components/DevFatalErrorPage").DevFatalErrorPage;
}

// export default RedwoodDevFatalErrorPage ||
export default (err) => (
  <div className="flex h-[100vh] items-center text-center">
    <section className="mx-auto bg-white dark:bg-[#252636]">
      <div className="border border-[#60728F] bg-[#0D2836] p-8 text-[#97FBFF]">
        <h1 className="mb-3 text-2xl font-bold uppercase">Error</h1>
        <h1 className="my-8">
          <span>Outgoing reliable buffer overflow</span>
        </h1>
        <div className="mt-3 flex flex-row items-center space-x-8 text-center">
          <Link
            to={routes.home()}
            className="w-full bg-[#11667B] px-6 py-1 uppercase outline outline-1 outline-offset-1 outline-[#11667B] transition-colors duration-150 hover:outline-2 hover:outline-offset-0"
          >
            Accept
          </Link>
          <Link
            to={routes.home()}
            className="w-full bg-[#11667B] px-6 py-1 uppercase outline outline-1 outline-offset-1 outline-[#11667B] transition-colors duration-150 hover:outline-2 hover:outline-offset-0"
          >
            Cancel
          </Link>
        </div>
      </div>
    </section>
  </div>
);
