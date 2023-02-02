import { useAuth } from "@redwoodjs/auth";
import { Link, routes } from "@redwoodjs/router";
import { MetaTags } from "@redwoodjs/web";
import Chat from "src/components/Chat/Chat";
import MapPicker from "src/components/Util/MapPicker/MapPicker";
import { merge } from "src/lib/formatters";
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
              <div className="px-6 text-center font-extralight text-white md:px-12">
                <h1 className="mt-0 mb-6 text-5xl">Welcome Home</h1>
                <h3 className="mb-8 text-3xl">
                  Here you can find{" "}
                  <span className="decoration-pea-500 underline decoration-4 underline-offset-8">
                    base
                  </span>{" "}
                  locations, material calculators and much more
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
        <Table data={[
          {
            name: 'Ola',
            age: 20,
            city: 'Oslo'
          }, {
            name: 'Kari',
            age: 23,
            city: 'Oslo'
          }, {
            name: 'Per',
            age: 18,
            city: 'Bergen'
          }, {
            name: 'Kari',
            age: 23,
            city: 'Oslo'
          }, {
            name: 'Peder',
            age: 56,
            city: 'Stavanger'
          },
          {
            name: 'sfd',
            age: 20,
            city: 'Oslo'
          }, {
            name: 'Kari',
            age: 23,
            city: 'Oslo'
          }, {
            name: 'Per',
            age: 18,
            city: 'Bergen'
          }, {
            name: 'ttt',
            age: 23,
            city: 'Oslo'
          }, {
            name: 'ttt',
            age: 56,
            city: 'Stavanger'
          }
        ]} />
        {/* <iframe src="https://github.com/sponsors/ArvidWedtstein/button" title="Sponsor ArvidW" height="35" width="116" style={{ border: 0 }}></iframe> */}
      </div>
    </>
  );
};

export default HomePage;
import React, { useState } from "react";

const Table = ({ data }) => {
  const [filteredData, setFilteredData] = useState(data);
  const [currentPage, setCurrentPage] = useState(1);
  const [dataPerPage, setDataPerPage] = useState(5);

  const handleFilter = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filtered = data.filter((item) => {
      return Object.values(item).join("").toLowerCase().includes(searchTerm);
    });
    setFilteredData(filtered);
    setCurrentPage(1);
  };

  const indexOfLastData = currentPage * dataPerPage;
  const indexOfFirstData = indexOfLastData - dataPerPage;
  const currentData = filteredData.slice(indexOfFirstData, indexOfLastData);

  const handlePagination = (pageNumber) => setCurrentPage(pageNumber);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(filteredData.length / dataPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div>
      <input type="text" placeholder="Filter..." onChange={handleFilter} />
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Age</th>
            <th>City</th>
          </tr>
        </thead>
        <tbody>
          {currentData.map((item) => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>{item.age}</td>
              <td>{item.city}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        {pageNumbers.map((number) => (
          <span
            key={number}
            style={{ cursor: "pointer" }}
            onClick={() => handlePagination(number)}
          >
            {number}{" "}
          </span>
        ))}
      </div>
    </div>
  );
};
