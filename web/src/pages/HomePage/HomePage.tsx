import { Link, routes } from "@redwoodjs/router";
import { MetaTags } from "@redwoodjs/web";
import { useAuth } from "@redwoodjs/auth";
import { useEffect, useState } from "react";

import arkitems from "../../../public/arkitems2.json";
import items from "../../../public/arkitems.json";
const HomePage = () => {
  const { isAuthenticated } = useAuth();
  if (document.addEventListener) {
    document.addEventListener('contextmenu', function (e) {
      alert("You've tried to open context menu"); //here you draw your own menu
      e.preventDefault();
    }, false);
  }

  let currentId = 772
  let itnames = items.items.map((item) => {
    return item.name.toLowerCase()
  })
  let darkitems = Object.entries(arkitems).filter((g) => !itnames.includes(g[1].name.toLowerCase()))
  darkitems.forEach((item, i) => {
    let it = item[1]
    currentId += 1
    if ("color" in it) {
      console.log({
        name: it.name,
        itemId: currentId,
        color: it.color,
        image: `${it.name.toLowerCase().replaceAll(" ", "_")}.png`,
        // recipe: it.ingredients.map((ing) => {
        //   return {
        //     itemId: ing.item, // items.items.find((g) => g.name.toLowerCase() === ing.item.toLowerCase()).itemId,
        //     count: ing.quantity,
        //   };
        // }),

        // craftedIn: it.craftedIn,
      });
    }

  });
  return (
    <>
      <MetaTags title="Home" description="Home page" />
      <div className="container-xl p-3 text-center">
        <div
          className="relative overflow-hidden bg-cover bg-no-repeat"
          style={{
            backgroundPosition: "50%",
            backgroundImage: "url('https://wallpaper.dog/large/5509169.jpg')",
            height: "350px",
          }}
        >
          <div
            className="absolute top-0 right-0 bottom-0 left-0 h-full w-full overflow-hidden bg-fixed"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.75)" }}
          >
            <div className="flex h-full items-center justify-center">
              <div className="px-6 text-center text-white md:px-12">
                <h1 className="mt-0 mb-6 text-5xl font-bold">Welcome Home</h1>
                <h3 className="mb-8 text-3xl font-bold">
                  Here you can find base locations, material calculators and
                  much more
                </h3>
                <Link
                  className="inline-block rounded border-2 border-white px-6 py-2.5 text-xs font-medium uppercase leading-tight text-white transition duration-150 ease-in-out hover:bg-black hover:bg-opacity-5 focus:outline-none focus:ring-0"
                  to={routes.login()}
                >
                  Get started
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;
