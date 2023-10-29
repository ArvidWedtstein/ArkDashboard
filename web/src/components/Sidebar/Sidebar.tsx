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

const Sidebar = memo(({}) => {
  const { currentUser, isAuthenticated, logOut } = useAuth();
  const navigation = [
    {
      name: "Home",
      href: routes.home(),
      color: "!ring-pea-400 !bg-pea-500",
    },
    {
      name: "Basespot",
      href: routes.basespots({ page: 1 }),
      color: "!ring-blue-400 !bg-blue-500",
    },
    {
      name: "Crafting",
      href: routes.materialCalculator(),
      color: "!ring-red-400 !bg-red-500",
    },
    // {
    //   name: "GTW",
    //   href: routes.gtw(),
    //   color: "!ring-lime-400 !bg-lime-500",
    // },
    {
      name: "Tribes",
      href: routes.tribes(),
      color: "!ring-emerald-400 !bg-emerald-500",
    },
    {
      name: "Story",
      href: routes.timelineSeasons(),
      color: "!ring-sky-200 !bg-sky-400",
    },
    {
      name: "Dinos",
      href: routes.dinos({ category: "ground" }),
      color: "!ring-indigo-400 !bg-indigo-500",
    },
    {
      name: "Items",
      href: routes.items(),
      color: "!ring-teal-500 !bg-teal-700",
    },
    {
      name: "Maps",
      href: routes.maps(),
      color: "!ring-amber-400 !bg-amber-500",
    },
    {
      name: "Lootcrates",
      href: routes.lootcrates(),
      color: "!ring-cyan-400 !bg-cyan-500",
    },
  ];

  return (
    <aside className="group z-10 overflow-x-auto border-gray-700 bg-zinc-800 py-2 dark:border-zinc-300 max-sm:border-b sm:h-auto sm:max-w-sm sm:overflow-visible sm:border-r sm:py-2 sm:px-4 md:min-w-[12rem]">
      <nav className="sticky top-0 flex w-full flex-row items-start justify-between space-y-1.5 sm:flex-col sm:justify-start">
        <div className="flex items-center justify-center border-zinc-300 text-black text-[#ffffffcc] transition-all sm:mt-3 sm:w-full sm:flex-col sm:border-b sm:pb-3">
          <Avatar
            url={
              isAuthenticated && currentUser && currentUser?.avatar_url
                ? currentUser.avatar_url
                : `https://ui-avatars.com/api/?name=${
                    isAuthenticated ? currentUser?.full_name : "Guest"
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
        {navigation.map((item, index) => (
          <NavLink
            key={`sidebar-item-${index}`}
            to={item.href}
            title={item.name}
            activeClassName={`text-white ${item.color}`}
            matchSubPaths={true}
            className="flex w-full flex-auto items-center justify-start space-x-3.5 rounded py-2 px-2.5 text-left text-white outline-none hover:bg-zinc-400/30 hover:text-gray-100 focus:bg-stone-400 dark:hover:bg-zinc-400/30 dark:hover:text-white dark:focus:ring-white"
          >
            {Icon(item.name)}
            {open && <span className="hidden md:block">{item.name}</span>}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
});

export default Sidebar;
