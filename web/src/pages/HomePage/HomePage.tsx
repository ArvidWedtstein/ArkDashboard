import { Link, routes } from "@redwoodjs/router";
import { MetaTags } from "@redwoodjs/web";
import { toast } from "@redwoodjs/web/dist/toast";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "src/auth";
import FileUpload, {
  FileUpload2,
} from "src/components/Util/FileUpload/FileUpload";
import Slider from "src/components/Util/Slider/Slider";

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

  //   const channelA = client.channel("public");

  //   channelA.on('presence', { event: 'sync' }, () => {
  //     const newState = channelA.presenceState();
  //     console.log("sync", newState);
  //   }).on('presence', { event: 'join' }, ({ key, newPresences }) => {
  //     console.log('join', key, newPresences)
  //   }).on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
  //     console.log('leave', key, leftPresences)
  //   }).subscribe(async (status) => {
  //     if (status === 'SUBSCRIBED') {
  //       const presenceTrackStatus = await channelA.track({
  //         user: currentUser?.id,
  //         online_at: new Date().toISOString(),
  //       })
  //       console.log("Status", presenceTrackStatus)
  //     }
  //   });

  //   return () => {
  //     channelA.untrack();
  //   }
  // }, [currentUser]);

  //   document.addEventListener("visibilitychange", () => {
  //     // it could be either hidden or visible
  //     document.title = document.visibilityState;
  // });

  return (
    <>
      <MetaTags
        title="ArkDashboard, the best Ark Survival Evolved companion app"
        description="Home page"
        ogContentUrl="https://drive.google.com/uc?export=view&id=1BH3u85NhncIhphAyl2_FR312CnVoKdYj"
        ogType="website"
      />
      <div className="container-xl overflow-hidden text-center">
        <section className="font-montserrat mx-auto mb-12 max-w-screen-xl p-6">
          <div className="mb-8 rounded-lg border border-gray-200 bg-gray-50 p-8 dark:border-zinc-700 dark:bg-gradient-to-tr dark:from-zinc-800 dark:to-zinc-900 md:p-12">
            <h1 className="mb-2 text-3xl font-extrabold text-gray-900 dark:text-white md:text-5xl">
              Welcome Home Bob!
            </h1>
            <p className="mb-6 text-lg font-normal text-gray-500 dark:text-gray-400">
              Here you can find{" "}
              <Link to={routes.basespots()} className="rw-link">
                base
              </Link>{" "}
              locations, material calculator and much more
            </p>
            <Link
              to={routes.signup()}
              className="rw-button rw-button-green-outline"
            >
              Get Started
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

          <div className="mb-8 rounded-lg border border-gray-200 bg-gray-50 p-8 dark:border-zinc-700 dark:bg-gradient-to-tr dark:from-zinc-800 dark:to-zinc-900 md:p-12">
            <a
              href="#"
              className="rw-badge rw-badge-gray mb-2 text-indigo-800 dark:!text-indigo-400"
            >
              {/* TODO: insert fort icon here */}
              <svg
                className="mr-1.5 h-2.5 w-2.5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 14"
              >
                <path d="M11 0H2a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm8.585 1.189a.994.994 0 0 0-.9-.138l-2.965.983a1 1 0 0 0-.685.949v8a1 1 0 0 0 .675.946l2.965 1.02a1.013 1.013 0 0 0 1.032-.242A1 1 0 0 0 20 12V2a1 1 0 0 0-.415-.811Z" />
              </svg>
              Basespot
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
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                  fill="currentColor"
                  className="pointer-events-none mr-1.5 h-2.5 w-2.5"
                >
                  <path d="M496.3 0c-1 0-2.115 .1567-3.115 .2817L364.6 26.03c-12.25 2.5-16.88 17.59-8 26.47l40.12 40.13L144.3 345L90.73 320.9c-7.375-2.375-15.5-.5022-20.1 4.1l-63.75 63.82c-10.75 10.75-6.376 29.12 8.126 33.99l55.62 18.5l18.5 55.62C91.22 506.8 99.47 512 107.8 512c5.125 0 10.37-1.918 14.5-6.041l63.62-63.74c5.502-5.5 7.376-13.62 5.001-20.1l-23.1-53.6l252.4-252.4l40.13 40.08C462.6 158.5 466.6 160 470.5 160c6.998 0 13.89-4.794 15.51-12.67l25.72-128.6C513.6 8.905 505.1 0 496.3 0zM112.7 470.3L94.97 417l-53.25-17.75l44.87-45l49.13 22l21.1 48.1L112.7 470.3zM460.6 111.3L400.7 51.5l74.75-15L460.6 111.3zM148.7 267.3C151.8 270.4 155.9 272 160 272s8.188-1.562 11.31-4.688c6.25-6.25 6.25-16.38 0-22.62L63.58 136.1c73.23-51.43 171.8-54.54 247.9-6.502c7.375 4.688 17.38 2.516 22.06-4.984C338.3 118 336 108.1 328.5 103.4c-88.5-55.89-203.9-51.54-288.1 10.46L27.26 100.7C21.01 94.5 10.94 94.44 4.688 100.7S-1.533 117 4.717 123.3L148.7 267.3zM408.6 183.5c-4.781-7.5-14.75-9.672-22.06-4.984c-7.5 4.719-9.719 14.61-5 22.08c48.06 76.04 44.97 174.6-6.494 247.9l-107.7-107.7c-6.25-6.25-16.38-6.25-22.62 0s-6.25 16.38 0 22.62l144 144C391.8 510.4 395.9 512 400 512s8.188-1.562 11.31-4.688c6.25-6.25 6.25-16.38 0-22.62l-13.17-13.17C460.1 387.3 464.5 271.1 408.6 183.5z" />
                </svg>
                Taming
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
              <div className="mb-2 inline-flex items-center rounded-md bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-800 dark:bg-zinc-700 dark:text-purple-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 576 512"
                  className="mr-1.5 h-2.5 w-2.5"
                  fill="currentColor"
                >
                  <path d="M556.2 258.2L440 213V78.04c0-12.82-7.868-24.32-19.81-28.97l-120.6-46.9C295.9 .7252 291.9 0 288 0C284.1 0 280.1 .7252 276.4 2.176L155.8 49.06C143.9 53.71 136 65.23 136 78.06v134.9L19.84 258.2C7.878 262.8 0 274.2 0 287v146.9c0 12.83 7.876 24.35 19.83 28.1l120.9 47.03C144.4 511.3 148.2 512 152 512s7.625-.7032 11.28-2.125L288 461.4l124.8 48.53C416.4 511.3 420.2 512 424 512s7.625-.7032 11.28-2.125l120.9-47.01C568.1 458.2 576 446.7 576 433.9V287C576 274.2 568.1 262.8 556.2 258.2zM152 241.1l92.45 35.48L152 312.6l-91.84-35.72L152 241.1zM168 340.7L272 300.2v133l-104 40.67V340.7zM304 300.2l104 40.45v133L304 433.3V300.2zM424 312.6l-91.84-35.72L424 241.1l92.45 35.48L424 312.6zM408.5 212.8L304 253.5v-121.9l104.1-40.47L408.5 212.8zM288 32.01l92.45 35.48L288 103.4L196.2 67.72L288 32.01zM272 131.6v121.9L167.1 212.1L167.5 90.91L272 131.6zM31.48 300L136 340.7v133.1L32 433.9L31.48 300zM440 473.9v-133.2l104.1-40.47l.5117 132.8L440 473.9z" />
                </svg>
                Recipes
              </div>
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

          <div className="group my-8 flex overflow-hidden rounded-lg border border-zinc-500 dark:border-zinc-700 dark:bg-gradient-to-tr dark:from-zinc-800 dark:to-zinc-900 dark:text-white">
            <div className="min-h-max overflow-hidden transition">
              <img
                src="https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/thumbnail-small.webp"
                className="aspect-video h-full max-w-sm object-cover grayscale transition-all duration-500 ease-in-out group-hover:grayscale-0"
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
                className="rw-button rw-button-green-outline mt-2"
              >
                Explore
              </Link>
            </div>
          </div>
        </section>
        <div className="m-4">
          <FileUpload
            storagePath="timelineeventimages"
            defaultValue={"0.44845431025828897.png"}
            multiple
            name="images"
            onUpload={(e) => {
              console.log(e);
            }}
            accept="image/png, image/jpeg, image/jpg"
          />

          <FileUpload2
            multiple
            maxSize={1024 * 1024}
            storagePath="timelineeventimages"
            accept="image/png, image/jpeg, image/jpg, image/webp"
          />
        </div>
      </div>
    </>
  );
};

export default HomePage;
