import React from "react";
import { Detector } from "react-detect-offline";
import WifiDisconntedImg from "../img/icons8-wi-fi-off-50.png";

const CheckConnection = (props) => {
  return (
    <>
      <Detector
        render={({ online }) =>
          online ? (
            props.children
          ) : (
            <div style={{ paddingTop: "10px", textAlign: "center" }}>
              <img src={WifiDisconntedImg} alt="No internet connection" />
              <h1 style={{ marginBottom: "5px" }}>No Connection</h1>
              <h1 style={{ margin: "0" }}>
                Please check your internet connection
              </h1>
            </div>
          )
        }
      />
    </>
  );
};

export default CheckConnection;
