import { Link, routes } from "@redwoodjs/router";
import { MetaTags } from "@redwoodjs/web";
import { useEffect } from "react";
import { useAuth } from "src/auth";
import { formatXYtoLatLon } from "src/lib/formatters";
const HomePage = () => {
  const { isAuthenticated, currentUser, client } = useAuth();
};

export default HomePage;
