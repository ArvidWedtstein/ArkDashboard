import { Link, routes } from "@redwoodjs/router";
import { MetaTags } from "@redwoodjs/web";
import { useAuth } from "src/auth";
const HomePage = () => {
  const { isAuthenticated, currentUser } = useAuth();
  // if (document.addEventListener) {
  //   document.addEventListener('contextmenu', function (e) {
  //     alert("You've tried to open context menu");
  //     e.preventDefault();
  //   }, false);
  // }
  // useEffect(() => {
  //   const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
  //     console.log(event, session)
  //   })

  //   return () => {
  //     subscription.unsubscribe()
  //   }
  // }, [supabase])
  return (
    <>
      <MetaTags
        title="Home"
        description="Home page"
        ogContentUrl="https://drive.google.com/uc?export=view&id=1BH3u85NhncIhphAyl2_FR312CnVoKdYj"
        ogType="website"
      />
      <div className="container-xl p-3 pt-0 text-center">
        <div
          className="relative overflow-hidden rounded-md bg-cover bg-no-repeat"
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
                <h1 className="mt-0 mb-6 text-5xl">Welcome Home Bob!</h1>
                <h3 className="mb-8 text-3xl">
                  Here you can find{" "}
                  <span className="decoration-pea-500 underline decoration-4 underline-offset-8">
                    base
                  </span>{" "}
                  locations, material calculator and much more
                </h3>
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

        {/* <iframe src="https://github.com/sponsors/ArvidWedtstein/button" title="Sponsor ArvidW" height="35" width="116" style={{ border: 0 }}></iframe> */}

        <section className="my-12 mx-auto flex max-w-5xl overflow-hidden rounded-lg border border-zinc-500 bg-zinc-800 dark:text-white">
          <div className="min-h-max overflow-hidden transition">
            <img
              src="https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/timelineimages/4/20210603185039_1.jpg"
              className="aspect-video h-full max-w-sm object-cover"
            />
          </div>
          <div className="font-montserrat w-full space-y-6 bg-opacity-80 p-8 text-left font-normal text-zinc-300 dark:bg-black">
            <h1 className="text-5xl">Crafting Made Easy</h1>
            <p className="font-light">
              Struggling to remember how to craft that rare item? Use our
              crafting recipe calculator to quickly look up the ingredients and
              steps needed for any item in ARK Survival Evolved. Never waste
              resources on failed crafting attempts again!
            </p>
            <details className="transition">
              <summary>How to Use the Calculator</summary>
              <p className="m-1 border-l pl-5">
                Simply select the item you want to craft from the dropdown list,
                and the calculator will show you the materials and steps needed
                to craft it. You can also filter the list by item type or
                crafting station.
              </p>
              <Link
                to={routes.materialCalculator()}
                className="rw-button rw-button-green-outline mt-2"
              >
                Explore
              </Link>
            </details>
          </div>
        </section>
      </div>
    </>
  );
};

export default HomePage;
