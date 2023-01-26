import { useAuth } from "@redwoodjs/auth";
import { useEffect } from "react";
import Dropdown from "../Dropdown/Dropdown";
import useComponentVisible from "../useComponentVisible";
import Avatar from "../Avatar/Avatar";
import { Link, routes } from "@redwoodjs/router";
type NavbarProps = {
  title?: string
  titleTo?: string
  buttonLabel?: string
  buttonTo?: string
}

const Navbar = ({ title, titleTo, buttonLabel, buttonTo }: NavbarProps) => {
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

  const { ref, isComponentVisible, setIsComponentVisible } = useComponentVisible(false);

  const handleOpen = () => {
    setIsComponentVisible(!isComponentVisible);
  };

  return (
    <>
      <div className="flex justify-between items-center w-full py-4 px-6 relative">
        <div className="flex items-center flex-grow">
          <span className=" w-6 h-1 rounded dark:bg-white bg-[#1f1c2e] relative"></span>
          <p className="dark:text-white mx-8 text-xl leading-6 font-bold">
            <span className={`lg:inline-block ${!!title ? 'hidden' : ''}`}>ArkDashboard</span>
            {title && <span className="lg:inline-block hidden mx-2">{" "}-{" "}</span>}
            {title ? `${title}` : ''}
          </p>
          <div className="hidden md:flex rounded-3xl dark:bg-[#1f2937] bg-[#ffffff] h-10 w-full pr-3 justify-between items-center max-w-md text-[#ffffffcc] shadow-md overflow-hidden dark:shadow-none">
            <input className="border-none h-full flex-1 outline-none px-5 text-base dark:bg-[#1f2937] bg-white text-[#1f1c2e] dark:text-white dark:placeholder:text-[#ffffffcc] placeholder:text-[#1f1c2e] placeholder:opacity-60" type="text" placeholder="Search" />
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="M21 21l-4.35-4.35"></path>
            </svg>
          </div>
        </div>
        <div className="flex items-center">
          {buttonTo && buttonLabel && (
            <Link to={routes[buttonTo]()} className="bg-[#1f1c24] dark:bg-[#1f2937] text-[#1f1c2e] rounded-full w-5 h-5 md:w-8 md:h-8 flex items-center justify-center border-none p-0 dark:text-white ml-2" title={buttonLabel}>
              <svg className="btn-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" /></svg>
            </Link>
          )}
          <button className="text-[#1f1c2e] dark:text-white p-0 m-0 w-4 h-4 md:w-8 md:h-8 bg-transparent flex items-center justify-center ml-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>
          </button>
          {/* <button className="p-0 bg-transparent flex items-center pl-3 ml-2 border-l-2 border-l-[#dddddd]">
            <Avatar
              url={String(currentUser ? currentUser.avatar_url : "")}
              size={30}
              className="w-8 h-8 object-cover rounded-full mr-1 text-[#1f1c2e] dark:text-white"
            />
            <span className="ml-1 text-[#1f1c2e] dark:text-white text-base font-bold">Aybüke C.</span>
          </button> */}
          <div ref={ref} className="relative ml-3">
            <button onClick={handleOpen} className="p-0 bg-transparent flex items-center pl-3 border-l-2 border-l-[#dddddd]">
              <span className="sr-only">Open user menu</span>
              <Avatar
                url={String(currentUser ? currentUser.avatar_url : "")}
                size={30}
                className="w-4 h-4 md:w-8 md:h-8 rounded-full text-[#1f1c2e] dark:text-white"
              />
              <span className="ml-1 text-[#1f1c2e] dark:text-white text-base font-bold">{currentUser ? currentUser.email : 'test'}</span>
            </button>
            {isComponentVisible && (
              <ul className="absolute right-0 z-40 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                {isAuthenticated && (
                  <>
                    <li>
                      <a
                        href="#"
                        className={'block px-4 py-2 text-sm text-gray-700 hover:bg-gray-200'}
                      >
                        Your Profile
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className={'block px-4 py-2 text-sm text-gray-700 hover:bg-gray-200'}
                      >
                        Settings
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-200'
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
                        className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-200'
                        to={routes.signin()}
                      >
                        Login
                      </Link>
                    </li>
                    <li>
                      <Link
                        className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-200'
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
