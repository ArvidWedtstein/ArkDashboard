import { CurrentUser, useAuth } from "@redwoodjs/auth";
import { Link, routes } from "@redwoodjs/router";
import { useEffect, useState } from "react";
import Avatar from "../Avatar/Avatar";
import useComponentVisible from "../useComponentVisible";

const Dropdown = ({
  isAuthenticated,
  currentUser,
  logOut,
}: {
  isAuthenticated: boolean;
  currentUser: CurrentUser;
  logOut: () => void;
}) => {
  const { ref, isComponentVisible, setIsComponentVisible } =
    useComponentVisible(false);

  const handleOpen = () => {
    setIsComponentVisible(!isComponentVisible);
  };
  return (
    <div ref={ref} className=" relative mr-6 flex items-center text-left">
      <div className="inline-block">
        <button
          onClick={handleOpen}
          type="button"
          className="inline-flex w-full justify-center rounded-md px-4 py-2 text-lg font-medium text-white shadow-sm focus:outline-none focus:ring-offset-gray-100"
          id="menu-button"
          aria-expanded="true"
          aria-haspopup="true"
        >
          {currentUser ? (
            <Avatar url={currentUser.avatar_url} size={30} />
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          )}

          <svg
            className="-mr-1 ml-2 h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      {isComponentVisible ? (
        <div className="transition-color absolute right-0 top-16 z-10 mt-2 w-56 rounded-lg bg-[#333333] shadow">
          <div className="p-4">
            <h2 className="mb-1 text-sm font-medium">Theme</h2>
            <div className="theme-switcher relative flex items-center overflow-hidden rounded bg-gray-500 px-1">
              <input
                type="radio"
                id="light-theme"
                name="themes"
                className="hidden"
                checked
              />
              <label
                htmlFor="light-theme"
                className="relative z-[2] w-[calc(100%/3)] text-[#dddddd]"
              >
                <span className="flex items-center justify-center rounded-md py-2 font-medium">
                  <svg
                    className="mr-2 inline-block w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <circle cx="12" cy="12" r="5"></circle>
                    <line x1="12" y1="1" x2="12" y2="3"></line>
                    <line x1="12" y1="21" x2="12" y2="23"></line>
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                    <line x1="1" y1="12" x2="3" y2="12"></line>
                    <line x1="21" y1="12" x2="23" y2="12"></line>
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                  </svg>
                  Light
                </span>
              </label>
              <input
                type="radio"
                id="dark-theme"
                name="themes"
                className="hidden"
              />
              <label
                htmlFor="dark-theme"
                className="relative z-[2] w-[calc(100%/3)] text-[#dddddd]"
              >
                <span className="flex items-center justify-center rounded-md py-2 font-medium">
                  <svg
                    className="mr-2 inline-block w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                  </svg>
                  Dark
                </span>
              </label>
              <input
                type="radio"
                id="black-theme"
                name="themes"
                className="hidden"
              />
              <label
                htmlFor="black-theme"
                className="relative z-[2] w-[calc(100%/3)] text-[#dddddd]"
              >
                <span className="flex items-center justify-center rounded-md py-2 font-medium">
                  <svg
                    className="mr-2 inline-block w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                  </svg>
                  Black
                </span>
              </label>
              <span className="slider absolute top-1 bottom-1 z-[2] block w-[calc((100%-6px)/3)] -translate-x-[110%] rounded-md border-2 border-[#ff0000] transition-transform"></span>
            </div>
          </div>
          <div className="flex flex-col border-t-2 border-[#dddddd] p-2 transition-colors">
            {isAuthenticated ? (
              <>
                <Link
                  to={routes.account()}
                  className="flex items-center rounded p-2 font-medium text-inherit transition-all hover:bg-neutral-600"
                  role="menuitem"
                  tabIndex={-1}
                  id="menu-item-0"
                >
                  <svg
                    className="mr-4 text-neutral-500 transition-colors"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  Account
                </Link>
                <button
                  onClick={logOut}
                  className="flex items-center rounded p-2 font-medium text-inherit transition-all hover:bg-neutral-600"
                  role="menuitem"
                  tabIndex={-1}
                  id="menu-item-3"
                >
                  Sign out
                </button>
              </>
            ) : (
              <Link
                className="flex items-center rounded p-2 font-medium text-inherit transition-all hover:bg-neutral-600"
                to={routes.login()}
              >
                Login
              </Link>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Dropdown;
