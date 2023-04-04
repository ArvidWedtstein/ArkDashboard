import { useAuth } from "@redwoodjs/auth";
import { useCallback, useEffect, useMemo, useState } from "react";
import useComponentVisible from "../useComponentVisible";
import Avatar from "../Avatar/Avatar";
import { Link, routes, useLocation, AvailableRoutes } from "@redwoodjs/router";
import { useRouterState } from "@redwoodjs/router/dist/router-context";
import { capitalize, capitalizeSentence, singularize } from "src/lib/formatters";

const Navbar = () => {
  const { currentUser, isAuthenticated } = useAuth();
  const { pathname } = useLocation();
  const [title, setTitle] = useState(pathname.split("/")[1]);

  useRouterState();

  useEffect(() => {
    setTitle(capitalize(pathname.split("/")[1]));
  }, [pathname]);

  const { ref, isComponentVisible, setIsComponentVisible } =
    useComponentVisible(false);

  const handleOpen = useCallback(() => {
    setIsComponentVisible(!isComponentVisible);
  }, [isComponentVisible]);


  return (
    <>
      <div className="relative flex w-full items-center justify-between py-4 px-6">
        <div className="flex flex-grow items-center">
          <span className=" relative h-1 w-6 rounded bg-[#1f1c2e] dark:bg-white"></span>
          <p className="mx-8 text-xl font-semibold leading-6 dark:text-white">
            <span className={`lg:inline-block ${!!title ? "hidden" : ""}`}>
              ArkDashboard
            </span>
            {title && <span className="mx-2 hidden lg:inline-block"> - </span>}
            {title ? `${title}` : ""}
          </p>
          <div className="hidden h-10 w-full max-w-md items-center justify-between overflow-hidden rounded-3xl bg-gray-300 pr-3 text-[#1f1c2e] dark:bg-gray-700 md:flex">
            <input
              className="h-full flex-1 border-none bg-gray-300 px-5 text-base text-black outline-none placeholder:text-[#1f1c2e] placeholder:opacity-60 dark:bg-gray-700 dark:text-white dark:placeholder:text-[#ffffffcc]"
              type="text"
              placeholder="Search"
              id="search"
            />
            <label htmlFor="search">
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
            </label>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {!isAuthenticated &&
            routes[`new${singularize(capitalizeSentence(title.split('-').join(' ')).replace(' ', ''))}`] !== undefined && (
              <Link
                to={routes[`new${singularize(capitalizeSentence(title.split('-').join(' ')).replace(' ', ''))}`]()}
                title={`New ${singularize(capitalizeSentence(title.split('-').join(' ')).replace(' ', ''))}`}
                className="flex h-5 w-5 items-center justify-center rounded-full border-none p-0 text-black ring-1 ring-black hover:ring-2 dark:ring-white dark:text-white md:h-7 md:w-7"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="btn-icon w-4 h-4 stroke-current fill-current">
                  <path d="M432 256C432 264.8 424.8 272 416 272h-176V448c0 8.844-7.156 16.01-16 16.01S208 456.8 208 448V272H32c-8.844 0-16-7.15-16-15.99C16 247.2 23.16 240 32 240h176V64c0-8.844 7.156-15.99 16-15.99S240 55.16 240 64v176H416C424.8 240 432 247.2 432 256z" />
                </svg>
              </Link>
            )}
          <button className="m-0 flex h-5 w-5 items-center justify-center bg-transparent p-0 text-[#1f1c2e] outline-none dark:text-white md:h-8 md:w-8">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="w-6 h-6 stroke-current fill-current">
              <path d="M433.4 334.8c-28-26.5-49.38-54.38-49.38-148.9c0-79.63-63.38-144.5-144-152.4V16C240 7.125 232.9 0 224 0S208 7.125 208 16v17.5C127.4 41.38 63.1 106.3 63.1 185.9c0 94.5-21.38 122.4-49.38 148.9c-14 13.38-18.38 33.5-11.25 51.25C10.62 404.3 28.12 416 47.99 416h352c19.88 0 37.38-11.75 44.63-29.1C451.8 368.3 447.4 348.1 433.4 334.8zM400 384H47.99c-14.25 0-21.38-16.5-11.38-25.1c34.88-33.25 59.38-70.38 59.38-172.1C95.1 118.5 153.2 64 224 64s128 54.5 128 121.9c0 101.4 24.25 138.8 59.38 172.1C421.4 367.6 414.1 384 400 384zM272.1 448c-7.438 0-14.36 4.146-16.9 10.88C250.6 471.2 238.3 480 223.1 480s-26.61-8.824-31.25-21.12C190.2 452.1 183.3 448 175.8 448c-10.61 0-18.37 9.998-15.08 19.72C169.4 493.4 194.5 512 223.1 512c29.47 0 54.56-18.63 63.22-44.28C290.5 457.1 282.8 448 272.1 448z" /></svg>
          </button>
          <div ref={ref} className="relative ml-3">
            <button
              onClick={handleOpen}
              className="flex items-center border-l-2 border-l-[#c4c4c4] bg-transparent p-0 pl-2 outline-none"
            >
              <span className="sr-only">Open user menu</span>
              <Avatar
                url={String(
                  currentUser && currentUser.avatar_url
                    ? currentUser.avatar_url
                    : ""
                )}
                size={30}
                className="h-5 w-5 rounded-full text-[#1f1c2e] dark:text-white md:h-8 md:w-8"
              />
              <span className="text-base font-bold text-[#1f1c2e] dark:text-white">
                {currentUser ? currentUser.email.split("@")[0] : ""}
              </span>
            </button>
            {isComponentVisible && (
              <ul className="absolute right-0 z-40 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                {isAuthenticated ? (
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
                    <li>
                      <a
                        href="#"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-200"
                      >
                        Sign out
                      </a>
                    </li>
                  </>
                ) : (
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
