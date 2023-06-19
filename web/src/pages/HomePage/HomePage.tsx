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
      </div>
    </>
  );
};

export default HomePage;
