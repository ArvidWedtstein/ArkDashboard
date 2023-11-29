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
import { DevFatalErrorPage } from "@redwoodjs/web/dist/components/DevFatalErrorPage";
type ErrorWithRequestMeta = Error & {
  mostRecentRequest?: {
    query: string;
    operationName: string;
    operationKind: string;
    variables: any;
  };
  mostRecentResponse?: any;
};

export default (({ error }: { error: ErrorWithRequestMeta }) => {
  const syntaxHighlight = (string) => {
    // Regular expression to match {, }, (, and = outside of strings
    const regex = /([\{\}\(\)=]|String|Number|Int|Boolean|Float)/g;

    // Split the JSX string using the regex
    const parts = string.split(regex);

    return (
      <span>
        {parts.map((part, index) => {
          let className = "";
          if (part === "") {
            return null;
          }
          // Set styles based on the matched symbol
          switch (part) {
            case "{":
            case "}":
              className = "text-blue-500";
              break;
            case "(":
            case ")":
              className = "text-yellow-500";
              break;
            case "=":
              className = "text-blue-400";
              break;
            case "String":
            case "Number":
            case "Boolean":
            case "Int":
            case "Float":
              className = "text-green-600";
              break;
            default:
              break;
          }

          return (
            <span key={index} {...{ className }}>
              {part}
            </span>
          );
        })}
      </span>
    );
  };

  const query = error?.mostRecentRequest ? syntaxHighlight(error?.mostRecentRequest?.query) : '';
  return (
    <div className="flex h-[100vh] items-center text-center">
      <section className="mx-auto max-w-3xl bg-white dark:bg-[#252636]">
        <div className="flex flex-col border border-[#60728F] bg-[#0D2836] p-8 text-[#97FBFF]">
          <h1 className="mb-3 text-2xl font-bold uppercase">
            {error.name ?? "Error"}
          </h1>
          <span className="my-2">
            {error.message || "Outgoing reliable buffer overflow"}
          </span>
          {query != "" && (
            <pre className="mb-4 whitespace-pre-wrap rounded bg-zinc-800 p-4 text-left">
              <div
                id="header-buttons"
                className="inline-flex w-full items-center py-2 px-4"
              >
                <div className="mr-2 h-3 w-3 rounded-full bg-red-500" />
                <div className="mr-2 h-3 w-3 rounded-full bg-yellow-500" />
                <div className="h-3 w-3 rounded-full bg-green-500" />
                <p className="ml-4 text-base font-semibold">Query</p>
              </div>
              <div className="p-4 text-base text-white">
                <code className="font-light">
                  {query}
                </code>
              </div>
            </pre>
          )}
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
}) || DevFatalErrorPage;
