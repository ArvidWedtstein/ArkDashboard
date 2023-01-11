import { Link, routes } from "@redwoodjs/router";
import { MetaTags } from "@redwoodjs/web";
import { PieChart } from "src/components/Util/PieChart/PieChart";
const HomePage = () => {
  // const { isAuthenticated, client: supabase } = useAuth();
  // if (document.addEventListener) {
  //   document.addEventListener('contextmenu', function (e) {
  //     alert("You've tried to open context menu");
  //     e.preventDefault();
  //   }, false);
  // }
  // supabase.auth.onAuthStateChange((event, session) => {
  //   console.log(event, session)
  // })
  return (
    <>
      <MetaTags title="Home" description="Home page" />


      <div className="container-xl p-3 mt-3 text-center">
        <div
          className="relative overflow-hidden bg-cover bg-no-repeat border border-white rounded-md"
          style={{
            backgroundPosition: "50%",
            backgroundImage: "url('https://wallpaper.dog/large/5509169.jpg')",
            height: "350px",
          }}
        >
          <div
            className="h-full w-full overflow-hidden bg-fixed"
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
                  to={routes.signin()}
                >
                  Get started
                </Link>
              </div>
            </div>
          </div>
        </div>
        {/* <PieChart className="w-32" hollowPercentage={80} backgroundColor="#232323" items={[{ percent: 5, color: 'green' }]}><text x="50%" y="50%" textAnchor="middle" fontSize="5" fill="white" dominantBaseline="middle">test</text></PieChart> */}
        {/* <div className="">
          <div
            className={`flex touch-pan-x select-none flex-row items-stretch justify-start space-x-1 overflow-x-auto p-3 will-change-scroll`}
          >
            <>
              <div className="flex flex-col">
                <div
                  className={`group w-full min-w-fit flex-1 rounded-md border border-white bg-slate-200 text-black dark:bg-neutral-800  dark:text-white before:content-none before:absolute before:-top-1 before:-bottom-1 before:p-1 before:bg-red-600`}
                >
                  <div
                    className={`flex h-16 w-full rounded-t-md  bg-cover bg-center`}
                    style={{
                      backgroundImage: `url(https://cdn.akamai.steamstatic.com/steam/apps/1646700/ss_c939dd546237cba9352807d4deebd79c4e29e547.1920x1080.jpg?t=1622514386)`,
                      backgroundPosition: "center",
                    }}
                  ></div>
                  <div className="flex min-h-[150px] flex-col items-start py-3 px-6">
                    <p className="text-xs">Genesis</p>
                    <p className="text-sm font-bold uppercase">
                      Test
                    </p>
                    <hr className="bg-gray-150 mb-2 h-[1px] w-full rounded border-0 dark:bg-stone-200"></hr>
                    <div className="relative flex flex-row space-y-1">
                      <div className="mt-3 flex flex-row items-center space-x-6">
                        <div className="flex flex-col items-start">
                          <p className="text-xs font-light">
                            25. feb 2023
                          </p>
                          <p className="text-sm font-normal">Started</p>
                        </div>
                        <div className="flex flex-col items-start">
                          <p className="text-xs font-light">
                            Season 69
                          </p>
                          <p className="text-sm font-normal">
                            <span className="ml-2 rounded bg-gray-100 px-2.5 text-sm font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                              3man
                            </span>

                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="italic text-center mt-2 text-white font-extralight">February</p>
                <div className="flex items-center">
                  <div className="hidden sm:flex bg-gray-200 h-6 w-0.5 dark:bg-gray-200"></div>
                  <div className="hidden sm:flex w-full bg-gray-200 h-0.5 dark:bg-gray-200"></div>
                </div>
              </div>
              <div className="flex flex-col">
                <div
                  className={`group w-full min-w-fit flex-1 rounded-md border border-white bg-slate-200 text-black dark:bg-neutral-800 dark:text-white before:content-none before:absolute before:-top-1 before:-bottom-1 before:p-1 before:bg-red-600`}
                >
                  <div
                    className={`flex h-16 w-full rounded-t-md  bg-cover bg-center`}
                    style={{
                      backgroundImage: `url(https://cdn.cloudflare.steamstatic.com/steam/apps/1646720/ss_5cad67b512285163143cfe21513face50c0a00f6.1920x1080.jpg?t=1622744444)`,
                      backgroundPosition: "center",
                    }}
                  ></div>
                  <div className="flex min-h-[150px] flex-col items-start py-3 px-6">
                    <p className="text-xs">Genesis 2</p>
                    <p className="text-sm font-bold uppercase">
                      Test
                    </p>
                    <hr className="bg-gray-150 mb-2 h-[1px] w-full rounded border-0 dark:bg-stone-200"></hr>
                    <div className="relative flex flex-row space-y-1">
                      <div className="mt-3 flex flex-row items-center space-x-6">
                        <div className="flex flex-col items-start">
                          <p className="text-xs font-light">
                            25. march 2023
                          </p>
                          <p className="text-sm font-normal">Started</p>
                        </div>
                        <div className="flex flex-col items-start">
                          <p className="text-xs font-light">
                            Season 69
                          </p>
                          <p className="text-sm font-normal">
                            <span className="ml-2 rounded bg-gray-100 px-2.5 text-sm font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                              3man
                            </span>

                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="italic text-center mt-2 text-white font-extralight">March</p>
                <div className="flex items-center">
                  <div className="hidden sm:flex bg-gray-200 h-6 w-0.5 dark:bg-gray-200"></div>
                  <div className="hidden sm:flex w-full bg-gray-200 h-0.5 dark:bg-gray-200"></div>
                </div>
              </div>

              <div className="flex flex-col">
                <div
                  className={`group w-full min-w-fit flex-1 rounded-md border border-white bg-slate-200 text-black dark:bg-neutral-800 dark:text-white before:content-none before:absolute before:-top-1 before:-bottom-1 before:p-1 before:bg-red-600`}
                >
                  <div
                    className={`flex h-16 w-full rounded-t-md  bg-cover bg-center`}
                    style={{
                      backgroundImage: `url(https://cdn.cloudflare.steamstatic.com/steam/apps/1887560/ss_331869adb5f0c98e3f13b48189e280f8a0ba1616.1920x1080.jpg?t=1655054447)`,
                      backgroundPosition: "center",
                    }}
                  ></div>
                  <div className="flex min-h-[150px] flex-col items-start py-3 px-6">
                    <p className="text-xs">Fjordur</p>
                    <p className="text-sm font-bold uppercase">
                      Test
                    </p>
                    <hr className="bg-gray-150 mb-2 h-[1px] w-full rounded border-0 dark:bg-stone-200"></hr>
                    <div className="relative flex flex-row space-y-1">
                      <div className="mt-3 flex flex-row items-center space-x-6">
                        <div className="flex flex-col items-start">
                          <p className="text-xs font-light">
                            25. march 2023
                          </p>
                          <p className="text-sm font-normal">Started</p>
                        </div>
                        <div className="flex flex-col items-start">
                          <p className="text-xs font-light">
                            Season 69
                          </p>
                          <p className="text-sm font-normal">
                            <span className="ml-2 rounded bg-gray-100 px-2.5 text-sm font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                              3man
                            </span>

                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="italic text-center mt-2 text-white font-extralight">March</p>
                <div className="flex items-center">
                  <div className="hidden sm:flex bg-transparent h-6 w-0.5 dark:bg-transparent"></div>
                  <div className="hidden sm:flex w-full bg-gray-200 h-0.5 dark:bg-gray-200"></div>
                </div>
              </div>
              <div className="flex flex-col">
                <div
                  className={`group w-full min-w-fit flex-1 rounded-md border border-white bg-slate-200 text-black dark:bg-neutral-800 dark:text-white before:content-none before:absolute before:-top-1 before:-bottom-1 before:p-1 before:bg-red-600`}
                >
                  <div
                    className={`flex h-16 w-full rounded-t-md  bg-cover bg-center`}
                    style={{
                      backgroundImage: `url(https://cdn.cloudflare.steamstatic.com/steam/apps/1887560/ss_331869adb5f0c98e3f13b48189e280f8a0ba1616.1920x1080.jpg?t=1655054447)`,
                      backgroundPosition: "center",
                    }}
                  ></div>
                  <div className="flex min-h-[150px] flex-col items-start py-3 px-6">
                    <p className="text-xs">Fjordur</p>
                    <p className="text-sm font-bold uppercase">
                      Test
                    </p>
                    <hr className="bg-gray-150 mb-2 h-[1px] w-full rounded border-0 dark:bg-stone-200"></hr>
                    <div className="relative flex flex-row space-y-1">
                      <div className="mt-3 flex flex-row items-center space-x-6">
                        <div className="flex flex-col items-start">
                          <p className="text-xs font-light">
                            25. march 2023
                          </p>
                          <p className="text-sm font-normal">Started</p>
                        </div>
                        <div className="flex flex-col items-start">
                          <p className="text-xs font-light">
                            Season 69
                          </p>
                          <p className="text-sm font-normal">
                            <span className="ml-2 rounded bg-gray-100 px-2.5 text-sm font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                              3man
                            </span>

                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="italic text-center mt-2 text-white font-extralight">April</p>
                <div className="flex items-center">
                  <div className="hidden sm:flex bg-transparent h-6 w-0.5 dark:bg-gray-200"></div>
                  <div className="hidden sm:flex w-full bg-gray-200 h-0.5 dark:bg-gray-200"></div>
                </div>
              </div>
            </>
          </div >
        </div> */}
      </div >
    </>
  );
};

export default HomePage;
