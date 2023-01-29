import { useAuth } from "@redwoodjs/auth";
import { useCallback, useEffect, useMemo, useState } from "react";
import Dropdown from "../Dropdown/Dropdown";
import useComponentVisible from "../useComponentVisible";
import Avatar from "../Avatar/Avatar";
import { Link, routes, useLocation, AvailableRoutes } from "@redwoodjs/router";
import { useRouterState } from "@redwoodjs/router/dist/router-context";
import { capitalize, singularize } from "src/lib/formatters";

const Navbar = () => {
  const { currentUser, getCurrentUser, isAuthenticated } = useAuth();
  const { pathname } = useLocation();
  const [title, setTitle] = useState(pathname.split("/")[1]);

  useEffect(() => {
    setTitle(capitalize(pathname.split("/")[1]));
  }, [pathname]);

  const { ref, isComponentVisible, setIsComponentVisible } =
    useComponentVisible(false);

  const handleOpen = useCallback(() => {
    setIsComponentVisible(!isComponentVisible);
  }, [isComponentVisible]);
  // const handleOpen = () => {
  //   setIsComponentVisible(!isComponentVisible);
  // };

  return (
    <>
      <div className="relative flex w-full items-center justify-between py-4 px-6">
        <div className="flex flex-grow items-center">
          <span className=" relative h-1 w-6 rounded bg-[#1f1c2e] dark:bg-white"></span>
          <p className="mx-8 text-xl font-bold leading-6 dark:text-white">
            <span className={`lg:inline-block ${!!title ? "hidden" : ""}`}>
              ArkDashboard
            </span>
            {title && <span className="mx-2 hidden lg:inline-block"> - </span>}
            {title ? `${title}` : ""}
          </p>
          <div className="hidden h-10 w-full max-w-md items-center justify-between overflow-hidden rounded-3xl bg-[#ffffff] pr-3 text-[#ffffffcc] shadow-md dark:bg-[#3B424F] dark:shadow-none md:flex">
            <input
              className="h-full flex-1 border-none bg-white px-5 text-base text-[#1f1c2e] outline-none placeholder:text-[#1f1c2e] placeholder:opacity-60 dark:bg-[#3B424F] dark:text-white dark:placeholder:text-[#ffffffcc]"
              type="text"
              placeholder="Search"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <path d="M21 21l-4.35-4.35"></path>
            </svg>
          </div>
        </div>
        <div className="flex items-center">
          {isAuthenticated &&
            routes[`new${singularize(title)}`] !== undefined && (
              <Link
                to={routes[`new${singularize(title)}`]()}
                title={`New ${singularize(title)}`}
                className="ml-2 flex h-5 w-5 items-center justify-center rounded-full border-none bg-[#1f1c24] p-0 text-[#ffffffcc] dark:bg-[#1f2937] dark:text-white md:h-8 md:w-8"
              >
                <svg
                  className="btn-icon"
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </Link>
            )}
          <button className="m-0 ml-2 flex h-4 w-4 items-center justify-center bg-transparent p-0 text-[#1f1c2e] outline-none dark:text-white md:h-8 md:w-8">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
          </button>
          <div ref={ref} className="relative ml-3">
            <button
              onClick={handleOpen}
              className="flex items-center border-l-2 border-l-[#c4c4c4] bg-transparent p-0 pl-3  outline-none"
            >
              <span className="sr-only">Open user menu</span>
              <Avatar
                url={String(
                  currentUser && currentUser.avatar_url
                    ? currentUser.avatar_url
                    : ""
                )}
                size={30}
                className="h-4 w-4 rounded-full text-[#1f1c2e] dark:text-white md:h-8 md:w-8"
              />
              <span className="ml-1 text-base font-bold text-[#1f1c2e] dark:text-white">
                {currentUser ? currentUser.email.split("@")[0] : "test"}
              </span>
            </button>
            {isComponentVisible && (
              <ul className="absolute right-0 z-40 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                {isAuthenticated && (
                  <>
                    <li>
                      <Link
                        to={routes.profile({
                          id: currentUser?.id || currentUser.sub,
                        })}
                        className={
                          "block px-4 py-2 text-sm text-gray-700 hover:bg-gray-200"
                        }
                      >
                        Your Profile
                      </Link>
                    </li>
                    {/* <li>
                      <a
                        href="#"
                        className={'block px-4 py-2 text-sm text-gray-700 hover:bg-gray-200'}
                      >
                        Settings
                      </a>
                    </li> */}
                    <li>
                      <a
                        href="#"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-200"
                      >
                        Sign out
                      </a>
                    </li>
                  </>
                )}
                {!isAuthenticated && (
                  <>
                    <li>
                      <Link
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-200"
                        to={routes.signin()}
                      >
                        Login
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-200"
                        to={routes.signup()}
                      >
                        Signup
                      </Link>
                    </li>
                  </>
                )}
              </ul>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
