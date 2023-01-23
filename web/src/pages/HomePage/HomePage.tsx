import { useAuth } from "@redwoodjs/auth";
import { Link, routes } from "@redwoodjs/router";
import { MetaTags } from "@redwoodjs/web";
import Chat from "src/components/Chat/Chat";
import Lookup from "src/components/Util/Lookup/Lookup";
import { Taybul } from "src/components/Util/Table/Table";
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

  let row = [
    {
      id: 1,
      name: "CTribes",
      pain: 5
    },
    {
      id: 2,
      name: "ATribes2",
      pain: 50
    }
  ]
  let rows = [
    [1, "Tribes", 5],
    [2, "Tribes2", 50]
  ]
  return (
    <>
      <MetaTags title="Home" description="Home page" />

      <div className="container-xl mt-3 p-3 text-center">
        <div
          className="relative overflow-hidden rounded-md border border-white bg-cover bg-no-repeat"
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
        {/* {isAuthenticated && <Chat />} */}
        <Taybul
          rowCount={2}
          headersVertical={false}
          filter={true}
          rows={row}
          summary={true}
          rowGetter={({ index }) => row[index]}
          select={true}
          // caption={{
          //   title: "Test",
          //   text: "Test",
          // }}
          columns={[
            {
              width: 200,
              label: 'Name',
              dataKey: 'name',
              sortable: true,
            },
            {
              width: 120,
              label: "Pain",
              dataKey: "pain",
              numeric: true,
            },
          ]}
        ></Taybul>
        <iframe src="https://github.com/sponsors/ArvidWedtstein/button" title="Sponsor ArvidW" height="35" width="116" style={{ border: 0 }}></iframe>
        {/* <PieChart className="w-32" hollowPercentage={80} backgroundColor="#232323" items={[{ percent: 5, color: 'green' }]}><text x="50%" y="50%" textAnchor="middle" fontSize="5" fill="white" dominantBaseline="middle">test</text></PieChart> */}
      </div>
    </>
  );
};

export default HomePage;
