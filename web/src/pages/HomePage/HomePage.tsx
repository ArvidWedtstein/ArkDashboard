import { useAuth } from "@redwoodjs/auth";
import { Link, routes } from "@redwoodjs/router";
import { MetaTags } from "@redwoodjs/web";
import Chat from "src/components/Chat/Chat";
const HomePage = () => {
  const { isAuthenticated, client: supabase } = useAuth();
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

      <div className="container-xl mt-3 p-3 text-center">
        <div
          className="relative overflow-hidden rounded-md bg-cover bg-no-repeat"
          style={{
            imageResolution: "10dpi",
            imageRendering: "auto",
            backgroundPosition: "50%",
            backgroundImage:
              "url('https://drive.google.com/uc?export=view&id=1BH3u85NhncIhphAyl2_FR312CnVoKdYj')",
            height: "350px",
          }}
        >
          <div
            className="h-full w-full overflow-hidden bg-fixed"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.75)" }}
          >
            <div className="flex h-full items-center justify-center">
              <div className="px-6 text-center text-white md:px-12 font-extralight">
                <h1 className="mt-0 mb-6 text-5xl">Welcome Home</h1>
                <h3 className="mb-8 text-3xl">
                  Here you can find base locations, material calculators and
                  much more
                </h3>
                <Link
                  // className="rounded border-2 bg-pea-500 border-pea-500 px-6 py-2.5 text-sm font-normal uppercase leading-tight text-white transition duration-150 ease-in-out hover:bg-black hover:bg-opacity-5 focus:outline-none focus:ring-0"
                  className="rw-button rw-button-green-outline"
                  to={routes.signin()}
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
