import { Link, routes } from "@redwoodjs/router";
import { MetaTags } from "@redwoodjs/web";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "src/auth";

const HomePage = () => {
  const { isAuthenticated, currentUser, client, reauthenticate } = useAuth();

  // useEffect(() => {
  //   const {
  //     data: { subscription },
  //   } = client.auth.onAuthStateChange(async (event, session) => {
  //     console.log(event, session);
  //     if (event == "SIGNED_IN") {

  //       const { data, error } = await client
  //         .from("Profile")
  //         .update({ status: "ONLINE" })
  //         .eq("id", session.user.id);
  //     } else if (event == "SIGNED_OUT") {
  //       const { data, error } = await client
  //         .from("Profile")
  //         .update({ status: "OFFLINE" })
  //         .eq("id", currentUser.id);
  //     }
  //   });

  //   return () => {
  //     subscription.unsubscribe();
  //   };
  // }, [client]);

  //   document.addEventListener("visibilitychange", () => {
  //     // it could be either hidden or visible
  //     document.title = document.visibilityState;
  // });

  // TODO: add gen 2 basespot

  // 49.6 21.3 - under bridge
  // 43.5 37.5
  // https://www.youtube.com/watch?v=n_19SVJWcbc

  return (
    <>
      <MetaTags
        title="ArkDashboard, the best Ark Survival Evolved companion app"
        description="Home page"
        ogContentUrl="https://drive.google.com/uc?export=view&id=1BH3u85NhncIhphAyl2_FR312CnVoKdYj"
        ogType="website"
      />
      <div className="container-xl text-center">
        <div
          className="relative m-3 overflow-hidden rounded-md bg-cover bg-no-repeat ring-1 ring-zinc-500"
          style={{
            backgroundPosition: "50%",
            backgroundImage:
              "url('https://drive.google.com/uc?export=view&id=1BH3u85NhncIhphAyl2_FR312CnVoKdYj')",
            height: "350px",
          }}
        >
          <div className="h-full w-full overflow-hidden bg-black bg-opacity-60 bg-fixed">
            <div className="flex h-full items-center justify-center">
              <div className="px-6 text-center font-extralight text-white md:px-12">
                <h1 className="mt-0 mb-6 text-xl md:text-5xl">
                  Welcome Home Bob!
                </h1>
                <span className="mb-8 block text-lg md:text-3xl">
                  Here you can find{" "}
                  <Link to={routes.basespots()} className="rw-link">
                    base
                  </Link>{" "}
                  locations, material calculator and much more
                </span>
                {/* <h3 className="mb-8 text-3xl">
                  H're thee can findeth <span className="underline decoration-pea-500 decoration-4 underline-offset-8">base</span> locations, mat'rial calculat'rs and much m're
                </h3> */}
                <Link
                  // className="rounded border-2 bg-pea-500 border-pea-500 px-6 py-2.5 text-sm font-normal uppercase leading-tight text-white transition duration-150 ease-in-out hover:bg-black hover:bg-opacity-5 focus:outline-none focus:ring-0"
                  className="rw-button rw-button-green-outline uppercase"
                  to={isAuthenticated ? routes.basespots() : routes.signin()}
                >
                  Get started
                </Link>
              </div>
            </div>
          </div>
        </div>
        {/* {isAuthenticated && <Chat />} */}

        <section className="font-montserrat mx-auto mb-12 max-w-screen-xl p-6">
          <div className="my-8 flex overflow-hidden rounded-lg border border-zinc-500 dark:border-zinc-700 dark:bg-gradient-to-tr dark:from-zinc-800 dark:to-zinc-900 dark:text-white">
            <div className="min-h-max overflow-hidden transition">
              <img
                src="https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/timelineimages/4/20210603185039_1.jpg"
                className="aspect-video h-full max-w-sm object-cover"
              />
            </div>
            <div className="font-montserrat w-full space-y-6 bg-opacity-80 p-8 text-left font-normal text-zinc-300 ">
              <h1 className="text-xl">Crafting Made Easy</h1>
              <p className="font-light">
                Struggling to remember how to craft that rare item? Use our
                crafting recipe calculator to quickly look up the ingredients
                and steps needed for any item in ARK Survival Evolved. Never
                waste resources on failed crafting attempts again!
              </p>
              <details className="transition">
                <summary>How to Use the Calculator</summary>
                <p className="m-1 border-l pl-5">
                  Simply select the item you want to craft from the dropdown
                  list, and the calculator will show you the materials and steps
                  needed to craft it. You can also filter the list by item type
                  or crafting station.
                </p>
              </details>
              <Link
                to={routes.materialCalculator()}
                className="rw-button rw-button-green-gradient mt-2"
              >
                Explore
              </Link>
            </div>
          </div>

          <div className="mb-8 rounded-lg border border-gray-200 bg-gray-50 p-8 dark:border-zinc-700 dark:bg-gradient-to-tr dark:from-zinc-800 dark:to-zinc-900 md:p-12">
            <a
              href="#"
              className="rw-badge rw-badge-gray mb-2 text-indigo-800 dark:!text-indigo-400"
            >
              <svg
                className="mr-1.5 h-2.5 w-2.5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 14"
              >
                <path d="M11 0H2a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm8.585 1.189a.994.994 0 0 0-.9-.138l-2.965.983a1 1 0 0 0-.685.949v8a1 1 0 0 0 .675.946l2.965 1.02a1.013 1.013 0 0 0 1.032-.242A1 1 0 0 0 20 12V2a1 1 0 0 0-.415-.811Z" />
              </svg>
              Tutorial
            </a>
            <h1 className="mb-2 text-3xl font-extrabold text-gray-900 dark:text-white md:text-5xl">
              Basespots and more
            </h1>
            <p className="mb-6 text-lg font-normal text-gray-500 dark:text-gray-400">
              Find the best base locations and more in ARK Survival Evolved.
            </p>
            <Link
              to={routes.basespots()}
              className="rw-button rw-button-green-outline"
            >
              Read more
              <svg
                className="ml-2 h-3.5 w-3.5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 10"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M1 5h12m0 0L9 1m4 4L9 9"
                />
              </svg>
            </Link>
          </div>
          <div className="grid gap-8 md:grid-cols-2">
            <div className="rounded-lg border border-zinc-500 bg-gray-50 p-8 dark:border-zinc-700 dark:bg-gradient-to-tr dark:from-zinc-800 dark:to-zinc-900 md:p-12">
              <a href="#" className="rw-badge rw-badge-gray !text-pea-500 mb-2">
                <svg
                  className="mr-1.5 h-2.5 w-2.5"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 18 18"
                >
                  <path d="M17 11h-2.722L8 17.278a5.512 5.512 0 0 1-.9.722H17a1 1 0 0 0 1-1v-5a1 1 0 0 0-1-1ZM6 0H1a1 1 0 0 0-1 1v13.5a3.5 3.5 0 1 0 7 0V1a1 1 0 0 0-1-1ZM3.5 15.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2ZM16.132 4.9 12.6 1.368a1 1 0 0 0-1.414 0L9 3.55v9.9l7.132-7.132a1 1 0 0 0 0-1.418Z" />
                </svg>
                Dinos
              </a>
              <h2 className="mb-2 text-3xl font-extrabold text-gray-900 dark:text-white">
                Dinos
              </h2>
              <p className="mb-4 flex-grow text-lg font-normal text-gray-500 dark:text-zinc-400">
                Get a complete overview of all the dinos that are in ARK
                Survival Evolved. You can filter the list to easily find the
                creature or item you are looking for.
              </p>
              <Link
                to={routes.dinos()}
                className="rw-link inline-flex items-center text-lg font-medium"
              >
                Read more
                <svg
                  className="ml-2 h-3.5 w-3.5"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 10"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M1 5h12m0 0L9 1m4 4L9 9"
                  />
                </svg>
              </Link>
            </div>
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 dark:border-zinc-700 dark:bg-gradient-to-tr dark:from-zinc-800 dark:to-zinc-900 md:p-12">
              <a
                href="#"
                className="mb-2 inline-flex items-center rounded-md bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-800 dark:bg-zinc-700 dark:text-purple-400"
              >
                <svg
                  className="mr-1.5 h-2.5 w-2.5"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 16"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 4 1 8l4 4m10-8 4 4-4 4M11 1 9 15"
                  />
                </svg>
                Code
              </a>
              <h2 className="mb-2 text-3xl font-extrabold text-gray-900 dark:text-white">
                Items
              </h2>
              <p className="mb-4 text-lg font-normal text-gray-500 dark:text-gray-400">
                Get a complete overview of all the items that are in ARK
                Survival Evolved. You can filter the list to easily find the
                item you are looking for.
              </p>
              <Link
                to={routes.basespots()}
                className="rw-link inline-flex items-center text-lg font-medium"
              >
                Read more
                <svg
                  className="ml-2 h-3.5 w-3.5"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 10"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M1 5h12m0 0L9 1m4 4L9 9"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default HomePage;
