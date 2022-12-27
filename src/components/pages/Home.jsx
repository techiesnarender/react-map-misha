import React from "react";
import { Helmet } from "react-helmet-async";

const Home = () => {
  return (
    <>
      <Helmet>
        <title>Home | Misha Infotech </title>
      </Helmet>
      <div className="container" id="homedev">
        <div className="jumbotron text-center">
          <h1>Welcome to Misha Infotech</h1>
        </div>
      </div>
    </>
  );
};
export default Home;
