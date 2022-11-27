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
          className="inline-flex w-full justify-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-offset-gray-100"
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
        <div
          className="absolute right-0 top-16 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="menu-button"
          tabIndex={-1}
        >
          <div className="py-1" role="none">
            {isAuthenticated ? (
              <Link
                to={routes.account()}
                className="block px-4 py-2 text-sm text-gray-700"
                role="menuitem"
                tabIndex={-1}
                id="menu-item-0"
              >
                Account
              </Link>
            ) : null}
            {isAuthenticated ? (
              <button
                onClick={logOut}
                className="block w-full px-4 py-2 text-left text-sm text-gray-700"
                role="menuitem"
                tabIndex={-1}
                id="menu-item-3"
              >
                Sign out
              </button>
            ) : (
              <Link
                className="block w-full px-4 py-2 text-left text-sm text-gray-700"
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
