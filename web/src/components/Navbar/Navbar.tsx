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
      {/* <div className="flex flex-wrap place-items-start">
        <section className="relative mx-auto">
          <nav className="flex w-screen justify-between text-white">
            <div className="flex w-full items-center px-5 py-6 xl:px-12 overflow-x-auto md:overflow-hidden">
              <ul className="font-heading flex space-x-12 px-4 font-semibold">
                <li>
                  <Link className="hover:text-gray-200" to={routes.home()}>
                    {/* Home /}
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-auto h-5 fill-current" viewBox="0 0 576 512">
                      <path d="M576 256c0-4.435-1.83-8.841-5.422-12l-272-240c-3.016-2.656-6.797-3.997-10.58-3.997S280.4 1.344 277.4 4l-272 240C1.83 247.2-.0005 251.6-.0005 256c0 8.924 7.241 15.99 16.05 15.99c3.758 0 7.521-1.313 10.53-3.993L64 234.1V464C64 490.5 85.53 512 112 512h80.01C218.5 512 240 490.5 240 464l.006-112h95.1L336 464c0 26.47 21.53 48 48 48H464c26.47 0 48-21.53 48-48V234.1L549.4 268C552.5 270.7 556.2 272 560 272C568.7 272 576 264.9 576 256zM480 208v256c0 8.812-7.172 16-16 16H384c-8.828 0-16-7.188-16-16V352c0-17.66-14.36-32-32-32h-96c-17.64 0-32 14.34-32 32v112C208 472.8 200.8 480 192 480H112C103.2 480 96 472.8 96 464v-256c0-.377-.1895-.6914-.2148-1.062L288 37.34l192.2 169.6C480.2 207.3 480 207.6 480 208z" />
                    </svg>
                  </Link>
                </li>
                <li>
                  <Link className="hover:text-gray-200" to={routes.basespots()}>
                    {/ Ark /}
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-auto h-5 fill-current" viewBox="0 0 640 512">
                      <path d="M608 160l-32 .0072c-17.67 0-32 14.32-32 31.99v32l-32 .0058V32c0-17.67-14.33-32-32-32h-40c-17.67 0-32 14.33-32 32v32h-32V32c0-17.67-14.33-32-32-32h-48c-17.67 0-32 14.33-32 32v32h-32V32c0-17.67-14.33-32-32-32H160C142.3 0 128 14.33 128 32v192L96 224V192c0-17.67-14.33-31.99-32-31.99L32 160C14.33 160 0 174.3 0 192v256c0 35.35 28.65 64 64 64h512c35.35 0 64-28.65 64-64V192C640 174.3 625.7 160 608 160zM160 32h40v64h96V32h48v64h96V32H480v192H160V32zM384 480H256v-95.99c0-35.29 28.71-64 64-64s64 28.71 64 64V480zM608 448c0 17.64-14.36 32-32 32h-160v-96c0-53.02-42.98-96-96-96s-96 42.98-96 96v96H64c-17.64 0-32-14.36-32-32V192h32v64h512V192h32V448z" />
                    </svg>
                  </Link>
                </li>
                <li>
                  <Link
                    className="hover:text-gray-200"
                    to={routes.materialCalculator()}
                  >
                    {/ Calculator /}
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-auto h-5 fill-current" viewBox="0 0 384 512">
                      <path d="M320 0H64C28.66 0 0 28.66 0 64v384c0 35.34 28.66 64 64 64h256c35.34 0 64-28.66 64-64V64C384 28.66 355.3 0 320 0zM352 448c0 17.64-14.36 32-32 32H64c-17.64 0-32-14.36-32-32V160h320V448zM352 128H32V64c0-17.64 14.36-32 32-32h256c17.64 0 32 14.36 32 32V128zM80 432h128c8.844 0 16-7.156 16-16s-7.156-16-16-16h-128C71.16 400 64 407.2 64 416S71.16 432 80 432zM288 440c13.25 0 24-10.75 24-24s-10.75-24-24-24s-24 10.75-24 24S274.7 440 288 440zM288 344c13.25 0 24-10.75 24-24S301.3 296 288 296S264 306.7 264 320S274.7 344 288 344zM288 248c13.25 0 24-10.75 24-24S301.3 200 288 200S264 210.7 264 224S274.7 248 288 248zM192 344c13.25 0 24-10.75 24-24S205.3 296 192 296S168 306.7 168 320S178.7 344 192 344zM192 248c13.25 0 24-10.75 24-24S205.3 200 192 200S168 210.7 168 224S178.7 248 192 248zM96 344c13.25 0 24-10.75 24-24S109.3 296 96 296S72 306.7 72 320S82.75 344 96 344zM96 248c13.25 0 24-10.75 24-24S109.3 200 96 200S72 210.7 72 224S82.75 248 96 248z" />
                    </svg>
                  </Link>
                </li>
                <li>
                  <Link className="hover:text-gray-200" to={routes.gtw()}>
                    {/ GTW /}
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-auto h-5 fill-current" viewBox="0 0 448 512">
                      <path d="M253.6 128H194.4C157.8 128 128 157.8 128 194.4V204c0 8.844 7.156 16 16 16S160 212.8 160 204V194.4C160 175.4 175.4 160 194.4 160h59.25C272.6 160 288 175.4 288 194.4c0 12.48-6.781 24-17.06 29.72L210.5 254.3C199.1 260.7 192 272.7 192 285.8V304C192 312.8 199.2 320 208 320S224 312.8 224 304V285.8c0-1.453 .7813-2.797 1.438-3.172l60.41-30.22C306.9 240.7 320 218.5 320 194.4C320 157.8 290.2 128 253.6 128zM208 344c-13.25 0-24 10.75-24 24s10.75 24 24 24s24-10.75 24-24S221.3 344 208 344zM384 32H64C28.65 32 0 60.65 0 96v320c0 35.35 28.65 64 64 64h320c35.35 0 64-28.65 64-64V96C448 60.65 419.3 32 384 32zM416 416c0 17.64-14.36 32-32 32H64c-17.64 0-32-14.36-32-32V96c0-17.64 14.36-32 32-32h320c17.64 0 32 14.36 32 32V416z" />
                    </svg>
                  </Link>
                </li>
                <li>
                  <Link className="hover:text-gray-200" to={routes.tribes()}>
                    {/ Tribe /}
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-auto h-5 fill-current" viewBox="0 0 640 512">
                      <path d="M274.7 304H173.3c-95.73 0-173.3 77.6-173.3 173.3C0 496.5 15.52 512 34.66 512H413.3C432.5 512 448 496.5 448 477.3C448 381.6 370.4 304 274.7 304zM413.3 480H34.66C33.2 480 32 478.8 32 477.3C32 399.4 95.4 336 173.3 336H274.7C352.6 336 416 399.4 416 477.3C416 478.8 414.8 480 413.3 480zM224 256c70.7 0 128-57.31 128-128S294.7 0 224 0C153.3 0 96 57.31 96 128S153.3 256 224 256zM224 32c52.94 0 96 43.06 96 96c0 52.93-43.06 96-96 96S128 180.9 128 128C128 75.06 171.1 32 224 32zM375.1 241C392.9 250.8 412.3 256 432 256C493.8 256 544 205.8 544 144S493.8 32 432 32c-12.83 0-25.39 2.156-37.34 6.391c-8.328 2.953-12.69 12.09-9.734 20.42c2.953 8.344 12.12 12.66 20.42 9.734C413.9 65.53 422.8 64 432 64C476.1 64 512 99.89 512 144S476.1 224 432 224c-14.08 0-27.91-3.703-39.98-10.69c-7.656-4.453-17.44-1.828-21.86 5.828C365.7 226.8 368.3 236.6 375.1 241zM490.7 320H448c-8.844 0-16 7.156-16 16S439.2 352 448 352h42.67C555.4 352 608 404.6 608 469.3C608 475.2 603.2 480 597.3 480H496c-8.844 0-16 7.156-16 16s7.156 16 16 16h101.3C620.9 512 640 492.9 640 469.3C640 386.1 573 320 490.7 320z" />
                    </svg>
                  </Link>
                </li>
                <li>
                  <Link className="hover:text-gray-200" to={routes.timelines()}>
                    {/ Story /}
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-auto h-5 fill-current" viewBox="0 0 640 512">
                      <path d="M633.6 243.2l-96-72c-7.031-5.281-17.06-3.891-22.41 3.203c-5.281 7.062-3.844 17.09 3.219 22.39L576 240H368V125.7C395.6 118.6 416 93.79 416 64c0-35.34-28.65-64-64-64C316.7 0 288 28.66 288 64c0 29.79 20.44 54.6 48 61.74V240h-192V125.7C171.6 118.6 192 93.79 192 64c0-35.34-28.65-64-64-64C92.65 0 64 28.66 64 64c0 29.79 20.44 54.6 48 61.74V240h-96C7.156 240 0 247.2 0 256s7.156 16 16 16h192v114.3C180.4 393.4 160 418.2 160 448c0 35.34 28.65 64 64 64c35.35 0 64-28.66 64-64c0-29.79-20.45-54.6-48-61.74V272h336l-57.6 43.2c-7.062 5.297-8.5 15.33-3.219 22.39C518.3 341.8 523.2 344 528 344c3.344 0 6.719-1.047 9.594-3.203l96-72C637.6 265.8 640 261 640 256S637.6 246.2 633.6 243.2zM320 64c0-17.64 14.36-32 32-32s32 14.36 32 32s-14.36 32-32 32S320 81.64 320 64zM96 64c0-17.64 14.36-32 32-32s32 14.36 32 32S145.6 96 128 96S96 81.64 96 64zM256 448c0 17.64-14.36 32-32 32s-32-14.36-32-32s14.36-32 32-32S256 430.4 256 448z" />
                    </svg>
                  </Link>
                </li>
              </ul>
            </div>
            / <a className="flex mr-6 items-center" href="#">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 hover:text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="flex absolute -mt-5 ml-4">
                <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-pink-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-pink-500">
                </span>
              </span>
            </a> /
            <Dropdown
              isAuthenticated={isAuthenticated}
              currentUser={currentUser}
              logOut={logOut}
            />
          </nav>
        </section>
      </div> */}
      <div className="flex justify-between items-center w-full py-4 px-6 relative">
        <div className="flex items-center flex-grow">
          <span className=" w-6 h-1 rounded dark:bg-white bg-[#1f1c2e] relative"></span>
          <p className="dark:text-white mx-8 text-xl leading-6 font-bold">ArkDashboard {title ? `- ${title}` : ''}</p>
          <div className="rounded-3xl dark:bg-[#1f2937] bg-[#ffffff] h-10 w-full pr-3 flex justify-between items-center max-w-md text-[#ffffffcc] shadow-md overflow-hidden dark:shadow-none">
            <input className="border-none h-full flex-1 outline-none px-5 text-base dark:bg-[#1f2937] bg-white text-[#1f1c2e] dark:text-white dark:placeholder:text-[#ffffffcc] placeholder:text-[#1f1c2e] placeholder:opacity-60" type="text" placeholder="Search" />
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="M21 21l-4.35-4.35"></path>
            </svg>
          </div>
        </div>
        <div className="flex items-center">
          {buttonTo && buttonLabel && (<Link to={routes[buttonTo]()} className="bg-[#1f1c24] dark:bg-[#1f2937] text-[#1f1c2e] rounded-full w-8 h-8 flex items-center justify-center border-none p-0 dark:text-white ml-2" title={buttonLabel}>
            <svg className="btn-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" /></svg>
          </Link>)}
          <button className="text-[#1f1c2e] dark:text-white p-0 m-0 h-8 bg-transparent flex items-center justify-center ml-2">
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
            <button onClick={handleOpen} className="p-0 bg-transparent flex items-center pl-3 ml-2 border-l-2 border-l-[#dddddd]">
              <span className="sr-only">Open user menu</span>
              <Avatar
                url={String(currentUser ? currentUser.avatar_url : "")}
                size={30}
                className="h-8 w-8 rounded-full text-[#1f1c2e] dark:text-white"
              />
              <span className="ml-1 text-[#1f1c2e] dark:text-white text-base font-bold"></span>
            </button>
            {isComponentVisible && (
              <ul className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
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
                    className={'block px-4 py-2 text-sm text-gray-700 hover:bg-gray-200'}
                  >
                    Sign out
                  </a>
                </li>
              </ul>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
