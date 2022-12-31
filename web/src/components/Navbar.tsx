import { Link, routes } from "@redwoodjs/router";
import { useMutation } from "@redwoodjs/web";
import { toast } from "@redwoodjs/web/toast";
import { useAuth } from "@redwoodjs/auth";
import { timeTag, truncate } from "src/lib/formatters";
import { useEffect } from "react";
import Lookup from "./Lookup/Lookup";
import Dropdown from "./Dropdown/Dropdown";

const Navbar = () => {
  const {
    currentUser,
    getCurrentUser,
    isAuthenticated,
    logIn,
    logOut,
    hasRole,
  } = useAuth();
  useEffect(() => {
    getCurrentUser();
  }, [currentUser]);

  return (
    <>
      <div className="flex flex-wrap place-items-start">
        <section className="relative mx-auto">
          <nav className="flex w-screen justify-between bg-gray-900 text-white">
            <div className="flex w-full items-center px-5 py-6 xl:px-12">
              <a className="font-heading mr-5 text-3xl font-bold" href="#">
                <img className="h-9" src="/favicon.png" alt="logo" />
              </a>
              <ul className="font-heading hidden space-x-12 px-4 font-semibold md:flex">
                <li>
                  <Link className="hover:text-gray-200" to={routes.home()}>
                    Home
                  </Link>
                </li>
                <li>
                  <Link className="hover:text-gray-200" to={routes.basespots()}>
                    Ark
                  </Link>
                </li>
                <li>
                  <Link
                    className="hover:text-gray-200"
                    to={routes.materialCalculator()}
                  >
                    Calculator
                  </Link>
                </li>
                <li>
                  <Link className="hover:text-gray-200" to={routes.gtw()}>
                    GTW
                  </Link>
                </li>
                <li>
                  <Link className="hover:text-gray-200" to={routes.tribes()}>
                    Tribe
                  </Link>
                </li>
                <li>
                  <Link className="hover:text-gray-200" to={routes.story()}>
                    Story
                  </Link>
                </li>
              </ul>
            </div>
            {/* <a className="flex mr-6 items-center" href="#">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 hover:text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="flex absolute -mt-5 ml-4">
                <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-pink-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-pink-500">
                </span>
              </span>
            </a> */}
            <Dropdown
              isAuthenticated={isAuthenticated}
              currentUser={currentUser}
              logOut={logOut}
            />
          </nav>
        </section>
      </div>
    </>
  );
};

export default Navbar;
