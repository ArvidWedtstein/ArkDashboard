import { Link, NavLink, routes } from "@redwoodjs/router";
import clsx from "clsx";
import { memo } from "react";
import { useAuth } from "src/auth";
import Avatar from "../Util/Avatar/Avatar";
const Icon = (icon: string) => {
  // Solid Icons for sidebar
  const icons = {
    home: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 576 512"
        className="h-4 w-4 fill-current stroke-current"
      >
        <path d="M576 256C576 273.6 561.7 287.1 543.1 287.1L511.1 288l.0026 192c0 17.67-14.33 32-32 32h-95.99c-17.67 0-31.1-14.33-31.1-32l.0011-112c0-8.836-7.165-15.1-16-15.1H240c-8.836 0-15.99 7.162-15.99 15.1L224 480c0 17.67-14.33 32-32 32H96.02c-17.67 0-32-14.33-32-32l.0084-192H32C14.22 288 .0002 273.6-.0005 256C-.0009 246.1 3.842 238.1 10.92 231.9l255.1-223.1c6.964-6.098 14.93-7.918 21.08-7.918c7.523 0 15.05 2.637 21.08 7.918l255.1 223.1C572.2 238.1 576 246.1 576 256z" />
      </svg>
    ),
    basespot: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 640 512"
        className="h-4 w-4 fill-current stroke-current"
      >
        <path d="M251.6 219L352 127.8V16.01c0-8.838-7.164-16-16-16l-64 .0049c-8.836 0-16 7.162-16 16v80H224V16.01c0-8.838-7.164-15.1-16-15.1h-64c-8.836 0-16 7.157-16 15.1v80H96v-80c0-8.838-7.164-16-16-16l-64-.0049c-8.836 0-16 7.162-16 16V197.5c0 16.97 6.741 33.25 18.74 45.25L64 288v192c0 17.67 14.33 32 32 32h138.1C227.8 501.8 224 489.9 224 477.1V281.5C224 257.7 234.1 234.1 251.6 219zM212 224c0 8.836-7.164 16-16 16h-40c-8.836 0-16-7.164-16-16v-28c0-19.88 16.12-36 36-36s36 16.12 36 36V224zM622.9 242.8l-151.4-137.7c-13.31-12.11-33.65-12.11-46.96 0L273.1 242.7C262.2 252.6 256 266.7 256 281.4v195.7c0 19.28 15.63 34.91 34.91 34.91h314.2c19.28 0 34.91-15.6 34.91-34.88L640 281.2C639.1 266.5 633.8 252.7 622.9 242.8zM496 368c0 8.875-7.125 16-16 16h-64c-8.875 0-16-7.125-16-16v-64c0-8.875 7.132-16.01 16.01-16.01h64.01c8.875 0 15.98 7.134 15.98 16.01V368z" />
      </svg>
    ),
    crafting: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 512 512"
        className="h-4 w-4 fill-current stroke-current"
      >
        <path d="M192 288H32c-17.62 0-32 14.38-32 32v160c0 17.62 14.38 32 32 32h160c17.62 0 32-14.38 32-32v-160C224 302.4 209.6 288 192 288zM157.3 422.6c6.223 6.221 6.223 16.4 0 22.62c-6.221 6.221-16.4 6.221-22.62 0L112 422.6l-22.62 22.62c-6.221 6.221-16.4 6.221-22.62 0c-6.221-6.223-6.221-16.4 0-22.62L89.37 400l-22.62-22.62c-6.221-6.223-6.221-16.4 0-22.62c6.223-6.223 16.4-6.223 22.62 0L112 377.4l22.62-22.62c6.223-6.223 16.4-6.223 22.62 0c6.223 6.221 6.223 16.4 0 22.62L134.6 400L157.3 422.6zM480 288h-160c-17.62 0-32 14.38-32 32v160c0 17.62 14.38 32 32 32h160c17.62 0 32-14.38 32-32v-160C512 302.4 497.6 288 480 288zM464 431.1C464 440.7 456.8 448 448 448h-96.09C343.2 448 336 440.8 336 432S343.2 416 351.1 416h96.06C456.8 416 464 423.2 464 431.1zM464 367.1C464 376.7 456.8 384 448 384h-96.06C343.2 384 336 376.8 336 368S343.2 352 351.1 352h96.09C456.8 352 464 359.2 464 367.1zM480 0h-160c-17.62 0-32 14.38-32 32v160c0 17.62 14.38 32 32 32h160c17.62 0 32-14.38 32-32V32C512 14.38 497.6 0 480 0zM464 111.1C464 120.8 456.8 128 448 128H416v32.04C416 168.8 408.8 176 400 176S384 168.8 384 160V128h-32.04C343.2 128 336 120.8 336 112S343.2 96 351.1 96H384V63.96C384 55.18 391.2 48 399.1 48S416 55.18 416 63.96V96h32.04C456.8 96 464 103.2 464 111.1zM192 0H32C14.38 0 0 14.38 0 32v160c0 17.62 14.38 32 32 32h160c17.62 0 32-14.38 32-32V32C224 14.38 209.6 0 192 0zM176 111.1C176 120.8 168.8 128 160 128H63.96C55.18 128 48 120.8 48 112S55.18 96 63.96 96h96.09C168.8 96 176 103.2 176 111.1z" />
      </svg>
    ),
    gtw: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 320 512"
        className="h-4 w-4 fill-current stroke-current"
      >
        <path d="M204.3 32.01H96c-52.94 0-96 43.06-96 96c0 17.67 14.31 31.1 32 31.1s32-14.32 32-31.1c0-17.64 14.34-32 32-32h108.3C232.8 96.01 256 119.2 256 147.8c0 19.72-10.97 37.47-30.5 47.33L127.8 252.4C117.1 258.2 112 268.7 112 280v40c0 17.67 14.31 31.99 32 31.99s32-14.32 32-31.99V298.3L256 251.3c39.47-19.75 64-59.42 64-103.5C320 83.95 268.1 32.01 204.3 32.01zM144 400c-22.09 0-40 17.91-40 40s17.91 39.1 40 39.1s40-17.9 40-39.1S166.1 400 144 400z" />
      </svg>
    ),
    tribes: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 640 512"
        className="h-4 w-4 fill-current stroke-current"
      >
        <path d="M319.9 320c57.41 0 103.1-46.56 103.1-104c0-57.44-46.54-104-103.1-104c-57.41 0-103.1 46.56-103.1 104C215.9 273.4 262.5 320 319.9 320zM369.9 352H270.1C191.6 352 128 411.7 128 485.3C128 500.1 140.7 512 156.4 512h327.2C499.3 512 512 500.1 512 485.3C512 411.7 448.4 352 369.9 352zM512 160c44.18 0 80-35.82 80-80S556.2 0 512 0c-44.18 0-80 35.82-80 80S467.8 160 512 160zM183.9 216c0-5.449 .9824-10.63 1.609-15.91C174.6 194.1 162.6 192 149.9 192H88.08C39.44 192 0 233.8 0 285.3C0 295.6 7.887 304 17.62 304h199.5C196.7 280.2 183.9 249.7 183.9 216zM128 160c44.18 0 80-35.82 80-80S172.2 0 128 0C83.82 0 48 35.82 48 80S83.82 160 128 160zM551.9 192h-61.84c-12.8 0-24.88 3.037-35.86 8.24C454.8 205.5 455.8 210.6 455.8 216c0 33.71-12.78 64.21-33.16 88h199.7C632.1 304 640 295.6 640 285.3C640 233.8 600.6 192 551.9 192z" />
      </svg>
    ),
    story: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 640 512"
        className="h-4 w-4 fill-current stroke-current"
      >
        <path d="M627.2 230.4l-96-72c-14.12-10.62-34.19-7.719-44.78 6.391c-10.62 14.14-7.75 34.2 6.406 44.8L512 224H384V153.2C412.2 140.9 432 112.8 432 80C432 35.82 396.2 0 352 0C307.8 0 272 35.82 272 80c0 32.79 19.77 60.89 48 73.25V224H160V153.2C188.2 140.9 208 112.8 208 80C208 35.82 172.2 0 128 0C83.82 0 48 35.82 48 80c0 32.79 19.77 60.89 48 73.25V224H32C14.33 224 0 238.3 0 256s14.33 32 32 32h160v70.75C163.8 371.1 144 399.2 144 432C144 476.2 179.8 512 224 512c44.18 0 80-35.82 80-80c0-32.79-19.77-60.89-48-73.25V288h256l-19.2 14.41c-14.16 10.59-17.03 30.66-6.406 44.8C492.7 355.6 502.3 360 512 360c6.688 0 13.41-2.078 19.16-6.406l96-72C635.3 275.6 640 266.1 640 256S635.3 236.4 627.2 230.4zM352 48c17.64 0 32 14.36 32 32s-14.36 32-32 32s-32-14.36-32-32S334.4 48 352 48zM128 48c17.64 0 32 14.36 32 32s-14.36 32-32 32s-32-14.36-32-32S110.4 48 128 48zM224 464c-17.64 0-32-14.36-32-32s14.36-32 32-32s32 14.36 32 32S241.6 464 224 464z" />
      </svg>
    ),
    dinos: (
      // <svg version="1.0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 290 256" className="fill-current w-6">
      //   <path d="m185 44-13 6c-4 3-7 8-10 15-1 3-4 8-8 12l-6 6h-7c-12 0-21 3-29 11-6 5-7 8-12 20-2 7-5 12-6 13-4 3-11 0-14-6l-1-9c0-10-2-14-9-14-4 0-7 4-11 11-11 23-2 51 20 63 8 4 17 6 29 6h10l11 11 13 13c4 2 33 2 37 0 5-3 7-11 4-18-3-5-5-7-11-10-4-2-5-3-6-6s-1-4 2-7c11-15 5-38-11-45l-9-3c-5 0-6 0-7 2-2 2-2 2-1 5 1 2 3 3 6 3 18 3 24 22 11 35l-3 4 3 9c3 10 5 12 10 12 4 0 7 3 7 7v3h-28l-10-10-11-12-1-8c0-9-3-13-8-8-1 1-2 3-2 7v6h-9c-11 0-17-2-24-6-14-9-21-31-14-46l2-5v6c3 17 19 26 31 18 4-3 6-7 9-17 3-9 5-13 10-17 6-6 9-7 21-8h11l9-9c7-8 9-10 11-15 3-7 6-11 12-14 3-2 5-2 10-2h15c5 0 5 0 8 3l4 4c0 2 2 2 8 3 12 1 16 6 16 19l-1 10-9 1c-7 0-7 0-11-4-5-4-10-6-16-6-4 0-5 0-7 2v5c2 3 3 3 7 3 5 0 6 0 9 4l7 5c2 1-1 1-11 1h-14l-10 9-9 10 2 6c2 5 3 7 8 10s5 3 5 7c0 6 5 10 9 6l1-7c-1-7-3-11-10-15l-6-3 7-6 6-7h13c14 0 18-1 23-6l6-4 10-9c2-4 1-17-1-24-2-10-13-17-23-17l-4-2c-4-6-13-8-22-7h-18z" />
      //   <path d="M205 66v5c2 2 5 3 7 0 2-2 2-4 0-6-2-3-5-2-7 1z" />
      // </svg>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 640 512"
        className="h-4 w-4 fill-current stroke-current"
      >
        <path d="M617.4 180.1l-86.63-26.62c-33.38-10.25-66.63 8.253-78.25 38.5H448c-70.75 0-128 57.26-128 128v63.1c0 17.62-14.38 31.1-32 31.1s-32-14.38-32-32V133.7C256 66.85 207.3 7.099 140.8 .5995C64.5-6.901 0 53.22 0 127.1v191.5c0 62.24 11.12 123.9 33 182.1c5.25 13.88 24.75 13.88 30 0C84.88 443.3 96 381.7 96 319.5V127.1c0-17.62 14.38-31.98 32-31.98S160 110.3 160 127.1v250.3c0 66.87 48.75 126.6 115.3 133.1c76.25 7.5 140.7-52.62 140.7-127.4L416 319.1c0-17.62 14.38-32 32-32h4.25c11 30.62 44.38 49.62 77.88 39.75l87-25.75C630.6 297.1 640 285.4 640 271.2V210.6C640 196.6 630.9 184.2 617.4 180.1zM528 287.1c-8.875 0-16-7.127-16-16c0-8.873 7.125-15.1 16-15.1S544 263.1 544 271.1C544 280.8 536.9 287.1 528 287.1zM528 223.1c-8.875 0-16-7.125-16-16s7.125-16 16-16S544 199.1 544 207.1S536.9 223.1 528 223.1z" />
      </svg>
    ),
    items: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 640 512"
        className="h-4 w-4 fill-current stroke-current"
      >
        <path d="M128 352H32c-17.62 0-32 14.38-32 32v96c0 17.62 14.38 32 32 32h96c17.62 0 32-14.38 32-32v-96C160 366.4 145.6 352 128 352zM104 272h192V320h48V272h192V320h48V262.4C584 241.3 566.8 224 545.6 224H344V160H384c17.62 0 32-14.38 32-32V32c0-17.62-14.38-32-32-32H256C238.4 0 224 14.38 224 32v96c0 17.62 14.38 32 32 32h40v64H94.38C73.25 224 56 241.3 56 262.4V320h48V272zM368 352h-96c-17.62 0-32 14.38-32 32v96c0 17.62 14.38 32 32 32h96c17.62 0 32-14.38 32-32v-96C400 366.4 385.6 352 368 352zM608 352h-96c-17.62 0-32 14.38-32 32v96c0 17.62 14.38 32 32 32h96c17.62 0 32-14.38 32-32v-96C640 366.4 625.6 352 608 352z" />
      </svg>
    ),
    maps: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 576 512"
        className="h-4 w-4 fill-current stroke-current"
      >
        <path d="M0 114.4v349.5c0 11.32 11.49 19.04 22 14.84L160 416V32L10.06 99.59C3.984 102 0 107.9 0 114.4zM554 33.15L416 96v384l149.9-67.59C572 409.1 576 404.1 576 397.6V48.01C576 36.69 564.6 28.94 554 33.15zM192 415.1L384 480V95.1l-192.1-64L192 415.1z" />
      </svg>
    ),
    lootcrates: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 576 512"
        className="h-4 w-4 fill-current stroke-current"
      >
        <path d="M352 336c0 8.875-7.125 16-16 16h-96C231.1 352 224 344.9 224 336V288H128v192h320V288h-96V336zM0 128v128h96V32C43 32 0 75 0 128zM0 448c0 17.62 14.38 32 32 32h64V288H0V448zM480 32v224h96V128C576 75 533 32 480 32zM304 304v-64C304 231.1 296.9 224 288 224S272 231.1 272 240v64C272 312.9 279.1 320 288 320S304 312.9 304 304zM480 480h64c17.62 0 32-14.38 32-32V288h-96V480zM128 256h96V208C224 199.1 231.1 192 240 192h96C344.9 192 352 199.1 352 208V256h96V32H128V256z" />
      </svg>
    ),
  };
  return icons[icon.toLowerCase()] || null;
};


const Sidebar = memo(({ }) => {
  const { currentUser, isAuthenticated } = useAuth();

  return (
    <aside className="group sticky top-0 bottom-0 z-10 overflow-x-auto border-gray-700 bg-zinc-800 py-2 dark:border-zinc-300 max-sm:border-b sm:h-auto sm:max-w-sm sm:overflow-visible sm:border-r sm:py-2 sm:px-4 md:min-w-[12rem]">
      <nav className="sticky top-0 bottom-0 flex w-full flex-row items-start justify-between space-y-1.5 sm:flex-col sm:justify-start">
        <div className="flex items-center justify-center border-zinc-300 text-black text-[#ffffffcc] transition-all sm:mt-3 sm:w-full sm:flex-col sm:border-b sm:pb-3">
          <Avatar
            url={
              isAuthenticated && currentUser && currentUser?.avatar_url
                ? currentUser.avatar_url
                : `https://ui-avatars.com/api/?name=${isAuthenticated ? currentUser?.full_name || "Guest" : "Guest"
                }`
            }
            storage={
              isAuthenticated && currentUser && currentUser?.avatar_url
                ? "avatars"
                : ""
            }
            size={80}
            profileMenu
          />
          <Link
            to={routes.profile({
              id: currentUser?.id || currentUser?.sub || "",
            })}
            className={clsx("mt-3 text-center hover:underline", {
              "pointer-events-none cursor-not-allowed": !isAuthenticated,
            })}
          >
            <p className="hidden text-sm sm:block sm:text-xl">
              {currentUser?.full_name?.toString() || "Guest"}
            </p>
            <p className="hidden text-xs sm:block">
              {currentUser?.role_profile_role_idTorole &&
                currentUser?.role_profile_role_idTorole["name"]?.toString()}
            </p>
            <span className="sr-only">Your Profile</span>
          </Link>
        </div>

        <NavLink
          to={routes.home()}
          title={"Home"}
          activeClassName={`text-white !ring-pea-400 !bg-pea-500`}
          matchSubPaths={true}
          className="relative flex w-full flex-auto items-center justify-start space-x-3.5 rounded py-2 px-2.5 text-left text-white outline-none hover:bg-zinc-400/30 hover:text-gray-100 focus:bg-stone-400 dark:hover:bg-zinc-400/30 dark:hover:text-white dark:focus:ring-white"
        >
          {Icon("Home")}
          <span className="hidden md:block">Home</span>
        </NavLink>
        <NavLink
          to={routes.basespots({ page: 1 })}
          title={"Basespots"}
          activeClassName={`text-white !ring-pea-400 !bg-blue-500`}
          matchSubPaths={true}
          activeMatchParams={["page"]}
          className="relative flex w-full flex-auto items-center justify-start space-x-3.5 rounded py-2 px-2.5 text-left text-white outline-none hover:bg-zinc-400/30 hover:text-gray-100 focus:bg-stone-400 dark:hover:bg-zinc-400/30 dark:hover:text-white dark:focus:ring-white"
        >
          {Icon("Basespot")}
          <span className="hidden md:block">Basespots</span>
        </NavLink>
        <NavLink
          to={routes.materialCalculator()}
          title={"Crafting"}
          activeClassName={`text-white !ring-red-400 !bg-red-500`}
          matchSubPaths={true}
          className="relative flex w-full flex-auto items-center justify-start space-x-3.5 rounded py-2 px-2.5 text-left text-white outline-none hover:bg-zinc-400/30 hover:text-gray-100 focus:bg-stone-400 dark:hover:bg-zinc-400/30 dark:hover:text-white dark:focus:ring-white"
        >
          {Icon("Crafting")}
          <span className="hidden md:block">Crafting</span>
        </NavLink>
        <NavLink
          to={routes.timelineSeasons()}
          title={"Timeline"}
          activeClassName={`text-white !ring-sky-200 !bg-sky-400`}
          matchSubPaths={true}
          className="relative flex w-full flex-auto items-center justify-start space-x-3.5 rounded py-2 px-2.5 text-left text-white outline-none hover:bg-zinc-400/30 hover:text-gray-100 focus:bg-stone-400 dark:hover:bg-zinc-400/30 dark:hover:text-white dark:focus:ring-white"
        >
          {Icon("Story")}
          <span className="hidden md:block">Seasons Timeline</span>
        </NavLink>
        <NavLink
          to={routes.dinos()}
          title={"Dinos"}
          activeClassName={`text-white !ring-indigo-400 !bg-indigo-500`}
          matchSubPaths={true}
          className="relative flex w-full flex-auto items-center justify-start space-x-3.5 rounded py-2 px-2.5 text-left text-white outline-none hover:bg-zinc-400/30 hover:text-gray-100 focus:bg-stone-400 dark:hover:bg-zinc-400/30 dark:hover:text-white dark:focus:ring-white"
        >
          {Icon("Dinos")}
          <span className="hidden md:block">Dinos</span>
        </NavLink>
        <NavLink
          to={routes.items()}
          title={"Items"}
          activeClassName={`text-white !ring-teal-500 !bg-teal-700`}
          matchSubPaths={true}
          className="relative flex w-full flex-auto items-center justify-start space-x-3.5 rounded py-2 px-2.5 text-left text-white outline-none hover:bg-zinc-400/30 hover:text-gray-100 focus:bg-stone-400 dark:hover:bg-zinc-400/30 dark:hover:text-white dark:focus:ring-white"
        >
          {Icon("Items")}
          <span className="hidden md:block">Items</span>
        </NavLink>
        <NavLink
          to={routes.maps()}
          title={"Maps"}
          activeClassName={`text-white !ring-amber-400 !bg-amber-500`}
          matchSubPaths={true}
          className="relative flex w-full flex-auto items-center justify-start space-x-3.5 rounded py-2 px-2.5 text-left text-white outline-none hover:bg-zinc-400/30 hover:text-gray-100 focus:bg-stone-400 dark:hover:bg-zinc-400/30 dark:hover:text-white dark:focus:ring-white"
        >
          {Icon("Maps")}
          <span className="hidden md:block">Maps</span>
        </NavLink>
        <NavLink
          to={routes.lootcrates()}
          title={"Lootcrates"}
          activeClassName={`text-white !ring-cyan-400 !bg-cyan-500`}
          matchSubPaths={true}
          className="relative flex w-full flex-auto items-center justify-start space-x-3.5 rounded py-2 px-2.5 text-left text-white outline-none hover:bg-zinc-400/30 hover:text-gray-100 focus:bg-stone-400 dark:hover:bg-zinc-400/30 dark:hover:text-white dark:focus:ring-white"
        >
          <svg viewBox="0 0 394 730" xmlns="http://www.w3.org/2000/svg" className="h-6 fill-current">
            <path d="M194 31a277 277 0 0 1-2 13l-2 8v9c1 2 1 3-1 2l-1 3-1 7-2 8-1 9-1 9v2l1-6 2-4c1-1 1-1 1 2 0 6 0 7-2 11-1 3-1 4-2 2-1-1-2 1-3 11a124 124 0 0 1-3 16l-1 5v1c2-2 2-2 2 0 2 3 1 9-2 13l-2 3-1-2v1l-1 7-1 8-1 2-1 8-1 4v1l2 2 3 1 3 1 3 3 1 4 4 8 8 18 3 9 1 1 1 1 6 14 3 9 7 14 3 8 18 1a4127 4127 0 0 1 49-3c-5 0-5 0-2-1l29-1c5 0 5 1 1 1l-5 1 5 1h6l-1-3-1-10-1-8a107 107 0 0 1-1-16l-1-9a255 255 0 0 0-5-32c0-2 0-3 3-3 4 0 5-2 2-4l-5-8-7-12-3-6 1-1-2-1-1-1-1-2-3-3-4-7-2-4c1-1-1-4-2-4l-1-1-1-1-1-4c-1 1-2 0-3-1l-1-3v-1l-3-2-4-7-12-19-18-29-12-20 5 6a193 193 0 0 0-7-11l1 4-6-10-7-11-17-4-2 3zm-3 41c0 3-2 8-3 8s-1-3 1-8c0-3 2-2 2 0zm-8 45c0 5-2 12-3 12v-4c0-7 2-15 3-15v7zm101 28c1 0 1 1 0 0l-1-1c0-2 1-1 1 1zm-54 131h-3c-1-1 0-1 2-1 1 0 2 0 1 1zm23 0h-2v-1l2 1zm18 0h-2c-1-1 0-1 1-1l1 1zM182 31c-3 2-5 4-7 8l-4 5-1 1c1 1-1 5-2 4v2h-1l-1 1c1 1-2 7-3 6v2h-1l-1 1c1 1-2 7-3 6l-1 1c1 1-2 7-3 6v2h-1l-1 1c1 1-2 7-3 6v2h-1l-1 1c1 1-6 14-7 13v2h-1l-1 1c1 1-2 7-3 6l-1 1c1 1-2 7-3 6v2h-1l-1 1c1 1-2 7-3 6l-1 1c1 1-7 16-8 15l-1 1c1 1-1 5-2 4v1l-2 6-3 5c-1 1-1 2-2 1l-1 1c1 1-7 16-8 15l-1 1c1 1-2 7-3 6l-1 1c1 1-2 7-3 6v2l-1 1h-2l1 1h1l-4 6-1 1 1 2v8a2876 2876 0 0 0-19 63c0-4 2-5 20-5a131 131 0 0 1 22 2h4l-1 4-1 3 23-44c20-42 22-44 25-45 3 0 3-1 4-10l5-28-4 17-2 11c-1 7-1 8-4 8v-2l2-8 1-11 1-1 1-3-1-9c-1-6-1-6 2-13 3-5 3-7 2-10s-1-5 1-11c1-4 2-9 1-11 0-4 2-13 4-17 2-3 3-5 3-10 0-7 0-8 3-12l3-5v8c-1 7-1 7 2-5a163 163 0 0 1 4-23c2-7 2-13 1-13l-5 2zm-1 28h-1l1-2v2z">
            </path>
            <path d="m178 83-1 6 1-5 1-6-1 5zm-35 9-1 2 2-2 1-2-2 2zm33 1c0 1 0 2 1 1v-3c-1-1-1 0-1 2zm-2 11h1v-2l-1 2zm-1 5c0 1 0 2 1 1v-3c-1-1-1 0-1 2zm-1 6c0 2 0 3 1 2v-4c-1-1-1 0-1 2zm-1 7h1v-2l-1 2zm-1 5c0 2 0 3 1 2v-4c-1-1-1 0-1 2zm-49 4-1 4 2-4 2-4-3 4zm47 3v5c1 2 1 2 1-2 1-4 0-5-1-3zm7 8 1 1-1-1c-1-1-1-1 0 0zm-8 3c0 1 0 2 1 1v-2c-1-1-1 0-1 1zm7 2v2c1 1 1 1 1-1l1-2-2 1zm-13 48c0 3 0 3 1 0 3-6 3 0 1 8v-1c0-4 0-4-1-3-2 1-4 12-4 20l-2 6v5c-2 2-2 3-1 4v1l-1 2v2l1 2 1 1v2c0 1 0 2-1 1-1-4-1-5-2-3v5c-1 1-2 3 0 5v1l-2 2c-1 2 0 2 1 1 3-2 2 0-1 3-2 2-2 2-1 3 2 2 2 3 1 7 0 5-2 8-3 7v3l1 2c-2 1-4-3-3-5l2-2c2 0 2-2 1-3h-1c0 3-1 1-2-2l1-3 1-3v-4l1-6 1-5 1-8 1-7 2-5a269 269 0 0 1 3-23l1-5c1-5 0-7-2-7l-22 43-22 44 5 23a13627 13627 0 0 0 24 118l6 26 7 35c3 13 3 13 2-1l-2-21-1-11-1-11-1-7 21-40c20-38 22-41 24-41s2 0 1 1l-4 4-14 27-19 37-7 13 2 29 5 51 3 28 3 33 3 32 1 16a2742 2742 0 0 0 10 92c1 2 2 2 6-1l4-2v3c0 3 1 3 3 4l2-1 2-1 4-6 3-7 2-6 2-3 1-1c-1-1-1-1 2-6l1-6 3-4 1-3a101 101 0 0 1 9-20l1-5a605 605 0 0 0 17-41l2-4 3-6a2068 2068 0 0 0 26-67c-1-2-1-5 1-17 1-4 2-9 1-10l1-2c1 1 1 0 1-3v-4l1-3v-4l1-3 1-2a699 699 0 0 1 14-76l2-13 3-16 2-11a6421 6421 0 0 1 15-83l-50-1h-50v3l-2 12-3 19-2 12-3 19-3 18-2-3c-1-5-1-13 1-22a492 492 0 0 0 7-45l2-11-3-11a82 82 0 0 1-6-12 149 149 0 0 1-10-24 169 169 0 0 1-11-26l-4-8-3-6-2-5h-6c-5 0-5 1-6 3zm-4 44-1 1 1-2c0-2 1-1 0 0zm-4 22h-1l1-2v2zm-35 14 1 2v3l-2 3c-1 3-1 3-2 2-1-2-1-6 1-9 1-2 3-3 2-1zm190 9-2 1-2-1 2-1 2 1zm-112 77-3 4 3-7c2-4 3-5 3-3l-3 6zm-16 29v1l-1-1v-1l1 1zm-7 13-2 3 1-3 2-2-1 2zm-3 6-2 2 2-3v1zm-2 4-1 1h-1l1-1h1zm-3 6-3 3v2c-2 0-2-1 1-5s3-4 2 0zm-5 10-5 5 1-2 1-2 3-3v2zm156-234 2 2c1 1 1 1 0 0l-2-2z">
            </path>
            <path d="M312 200v4l1 8 3 30c4 29 4 31 4 39l-2 16a1386 1386 0 0 0-12 66 1858 1858 0 0 0-21 117 461 461 0 0 1-7 36v9a1214 1214 0 0 1 28-70 379 379 0 0 0 11-33l5-12 4-8a544 544 0 0 0 7-19l-7 32-2 11-1 5-1 5-1 5-1 3 2 9c3 8 3 7-2 28l-11 43-6 22-4 17a420 420 0 0 1-10 36 561 561 0 0 1-14 56l-4 16c-1 2-2 4-1 5 1 3 7 8 10 6l8-20a720 720 0 0 1 21-57l13-37 39-108c17-44 18-48 18-53l-1-7-4-8-5-12a398 398 0 0 1-19-40c-2-3-2-3 1-10l4-8 7-20c8-20 9-24 7-24-1-1-7-9-6-10l-1-1-1-2-1-2c-1 1-11-15-10-16l-1-1h-1c1-2 0-3-2-5l-1-2v-1l-2-2h-2l1-1h1l-2-2-1-2h-1v-1l-2-3-2-3c0-1 0-2-1-1s-1 0-1-1v-2l-2-2-2-4-1-2-3-5-4-4c0-3-6-5-9-3zm36 144v3l-1-2c0-2 1-3 1 0zm-3 14-1 3v-3l1-3v3zm-5 23v-2l1-1-1 3zm-1 7c-1 1-1 0-1-1l1-1v2zm-2 6v-1l1-1-1 2zm-1 7h-1l1-2v2zm-9 46-1 1h-1l1-1h1zM81 207c-2 1-4 3-8 13l-3 5-2 2-1 3v1l-2 1v2l-2 2-2 4-1 2-1 3-3 3-1 1-3 6-1 1c1 1-1 6-2 6h-1s0 2-2 3l-2 4-2 4-1 3-1 1 1 5 15 51 2 12-2 4-4 6-1 3c1 1 2-1 4-5l4-6 1 3c1 2 0 4-3 9l-5 12 2 29a240 240 0 0 1 2 34 278 278 0 0 1 8 29 294 294 0 0 1 10 29l-2-9c-6-17-10-36-6-26l4 10 4 10 2 10a446 446 0 0 1 4 13 276 276 0 0 1 11 38 372 372 0 0 1 8 36l-9-27-2-7a1163 1163 0 0 0 11 39l4 16a1183 1183 0 0 1 10 36c1 0 1-10-1-18l-3-19a2471 2471 0 0 0-14-99l-4-27c-3-20-3-25-2-22l4 19 1 10a464 464 0 0 1 8 39l6 21 6 29a782 782 0 0 1 13 54l4 18a412 412 0 0 0 9 43c3 17 4 22 8 26l5 5 3-2c2-2 2-3 2-6l-1-10a376 376 0 0 0-3-36 514 514 0 0 0-5-57l-1-12-1-10-2-13a283 283 0 0 1-2-34 399 399 0 0 1-4-44 521 521 0 0 0-7-61l-10-43c-7-28-8-35-7-35h2l20 82 9 109 9 106 11 32 11 32-1-15-4-42a8808 8808 0 0 0-8-85c-3-31-4-33-12-73a58357 58357 0 0 1-43-206c0 3 0 4-3 3a735 735 0 0 0-38-3c-1 0-2-1-2-3l-1-2c-1 0-1 4 2 15l7 36a2346 2346 0 0 0 19 87l1 12c-1 2-1 2-2 1a2454 2454 0 0 1-19-94 1597 1597 0 0 0-13-57 1498 1498 0 0 0 21-75zm-22 68c0 1-1 3-3 3v-2l2-3 1-1v3zm53 73h-2v-1l2 1zm-4 4a1499 1499 0 0 0 8 42l-6-24c-4-18-5-22-3-21l1 3zm28 173h-1l1-2v2zm-35 55h-1l1-2v2z">
            </path>
            <path d="m70 222-1 2 2-2 1-2-2 2zm79 44v2c1 0 3-3 2-4l-2 2zm-64 10h7c2-1 0-1-3-1l-4 1zm-14 7h8c2-1 0-1-5-1l-3 1zm21 1h9c2 0 1-1-4-1s-7 0-5 1zm-51 48-2 3-2 8c-2 3-3 8-3 10l-4 14c-6 20-6 19-3 31a323 323 0 0 0 11 37 708 708 0 0 0 18 54c1-1 1-1 0 0s-1 4 2 14a475 475 0 0 1 7 28l1 1v2l1 1c1-1 1-1 1 1v9l9 28 4 16a535 535 0 0 0 15 53c1 8 2 9 8 7 3-2 3-3 0-8l-8-28a556 556 0 0 0-16-65l-4-16a199 199 0 0 0-8-22l5 19 7 25 3 15-3-6a240 240 0 0 0-11-34 558 558 0 0 0-13-46l-1-11-2-14v-3l1 1 5 12-4-15-4-17 2-11v-6l-1-15-1-14-1-13-1-15c-2-20-2-30-1-29l1-1h-8zm0 11c-1 1-1 0-1-2 0-1 0-2 1-1v3zm2 33 1 12-1-13-2-18c0-5 0-5 1 1l1 18zm2 15-1 1-1-1v-1l2 1zm0 11v4l-1-13 1 9zm1 13c-1 1-1 0-1-2l1-2v4zm1 7v4l-1-9 1 5zm274 6c0 1 0 2 1 1v-2c-1-1-1 0-1 1zm-1 7-1 4 1-3v-1zm-2 7c0 1 0 2 1 1v-2c-1-1-1 0-1 1zm3 15c0 1 0 2 1 1v-3c-1-1-1 0-1 1z">
            </path>
            <path d="m59 473 7 26v-4l-7-22zm15 21 6 23 4 14 2 5-7-27-5-15zm2 29 4 16 6 20 17 66 5 14 2-2-4-13-30-101zm26 3h1v-2l-1 2zm176 1-1 1h1l1-1h-1zm3 92h1v-2l-1 2zm-125 35 1 3-1-4-1-2 1 3zm116 1h1v-2l-1 2zm-116 8c0 1 0 2 1 1v-2c-1-1-1 0-1 1zm113 4h1v-2l-1 2zm-2 7h1v-2l-1 2zm-53 6c-1 1-1 1 0 0l1-1-1 1z">
            </path>
          </svg>
          <span className="hidden md:block">Lootcrates</span>
        </NavLink>
        <NavLink
          to={routes.tribes()}
          title={"Tribes"}
          activeClassName={`text-white !ring-emerald-400 !bg-emerald-500`}
          matchSubPaths={true}
          className="relative flex w-full flex-auto items-center justify-start space-x-3.5 rounded py-2 px-2.5 text-left text-white outline-none hover:bg-zinc-400/30 hover:text-gray-100 focus:bg-stone-400 dark:hover:bg-zinc-400/30 dark:hover:text-white dark:focus:ring-white"
        >
          {Icon("Tribes")}
          <span className="hidden md:block">Tribes</span>
        </NavLink>
      </nav>
    </aside>
  );
});

export default Sidebar;
