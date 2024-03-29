/*global google*/
import { Backdrop, CircularProgress } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import UserServices from "../../services/UserServices";

const SearchSitter = () => {
  const effectRan = useRef(false);
  const click_ref = useRef(null);
  useEffect(() => {
    if (effectRan.current === false) {
      const script = document.createElement("script");
      script.src =
        "https://maps.googleapis.com/maps/api/js?key=AIzaSyDKXKdHQdtqgPVl2HI2RnUa_1bjCxRCQo4&libraries=places&callback=initMap";
      script.async = true;
      document.body.appendChild(script);
      return () => {
        document.body.removeChild(script);
        effectRan.current = true;
      };
    }
  }, []);

  const [users, setUsers] = useState([]);
  const [searchAddress, setSearchAddress] = useState("");
  const [searchLat, setSearchLat] = useState("");
  const [searchLong, setSearchLong] = useState("");
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(false);
  const [open, setOpen] = useState(false);
  // const [search, setSearch] = useState([]);

  useEffect(() => {
    if (effectRan.current === false) {
      findNearestLocation();
      return () => {
        effectRan.current = true;
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    var neighborhoods = [];
    neighborhoods =
      users &&
      users.map((user) => ({
        lat: parseFloat(user.latitude),
        lng: parseFloat(user.longitude),
        open: user.open,
        company: user.company,
        email: user.email,
        logo: user.logo,
        id: user.id,
      }));

    //console.log("MY Marker",neighborhoods)

    const labels = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    // eslint-disable-next-line
    var map, markers, myLatlng;

    function initMap() {
      //Getting Current geo locations for search box address
      // console.log("MY Marker",neighborhoods)
      var latElGeo = document.getElementById("lat"),
        longElGeo = document.getElementById("lng"),
        error = document.getElementById("demo");

      const getLocation = () => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(showPosition);
        } else {
          error.innerHTML = "Geolocation is not supported by this browser.";
        }
      };

      function showPosition(position) {
        // console.log(position);
        setNativeValue(latElGeo, position.coords.latitude);
        latElGeo.dispatchEvent(new Event("input", { bubbles: true }));
        setNativeValue(longElGeo, position.coords.longitude);
        longElGeo.dispatchEvent(new Event("input", { bubbles: true }));
      }
      getLocation();

      // End of Getting Current geo locations for search box address

      var mapOptions;
      mapOptions = {
        center: new google.maps.LatLng(28.62, 77.36),
        zoom: 8,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
      };
      var bounds = new google.maps.LatLngBounds();
      var infoWindow = new google.maps.InfoWindow();
      var infoWin = new google.maps.InfoWindow();
      map = new google.maps.Map(
        document.getElementById("map-canvas-search"),
        mapOptions
      );

      //Current location svg image
      const svgMarker = {
        path: "M10.453 14.016l6.563-6.609-1.406-1.406-5.156 5.203-2.063-2.109-1.406 1.406zM12 2.016q2.906 0 4.945 2.039t2.039 4.945q0 1.453-0.727 3.328t-1.758 3.516-2.039 3.070-1.711 2.273l-0.75 0.797q-0.281-0.328-0.75-0.867t-1.688-2.156-2.133-3.141-1.664-3.445-0.75-3.375q0-2.906 2.039-4.945t4.945-2.039z",
        fillColor: "blue",
        fillOpacity: 0.6,
        strokeWeight: 0,
        rotation: 0,
        scale: 2,
        anchor: new google.maps.Point(15, 30),
      };

      var x = navigator.geolocation;
      x.getCurrentPosition(success);

      function success(position) {
        var myLat = position.coords.latitude;
        var myLng = position.coords.longitude;
        var myLatlng2 = new google.maps.LatLng(myLat, myLng);

        var markerOption2 = new google.maps.Marker({
          position: myLatlng2,
          map: map,
          zoom: 8,
          icon: svgMarker,
        });

        map.setCenter(myLatlng2);
        let marker2 = new google.maps.Marker(markerOption2);
        marker2.setMap(map);
        bounds.extend(myLatlng2);

        google.maps.event.addListener(markerOption2, "click", (e) => {
          infoWindow.setContent("This is your current location");
          infoWindow.open(map, markerOption2);
        });

        // Automatically center the map fitting all markers on the screen
        map.fitBounds(bounds);
        map.panToBounds(bounds);
      }

      // Adding Multiple marker on google map and bounded with all map
      for (var i = 0; i < neighborhoods.length; i++) {
        var data = neighborhoods[i];
        //console.log(data);
        myLatlng = new google.maps.LatLng(data.lat, data.lng);
        bounds.extend(myLatlng);
      }

      // Code for onclick on tiles show marker location center with infowindow
      markers =
        neighborhoods &&
        neighborhoods.map((location, i) => {
          // var myLatlng = new google.maps.LatLng(location.lat, location.lng);
          var marker = new google.maps.Marker({
            position: location,
            map: map,
            label: labels[i++ % labels.length],
          });

          //OnClick on marker show infowindow with sitter details
          google.maps.event.addListener(marker, "click", function (evt) {
            infoWin.setContent(
              '<img src="' +
                location.logo +
                '" style="position: relative; width: 220px; height: 104px;">' +
                " <br/> <b> Company Name :</b>" +
                location.company +
                "<br/> <b> Email :</b>" +
                location.email +
                "<br/> <b class='text-success'> Open :</b>" +
                location.open
            );
            infoWin.open(map, marker);
          });

          google.maps.event.addListener(marker, "mouseout", function (evt) {
            infoWin.close();
          });

          //OnClick on marker showing sidebar higlighting sidebar tiles
          google.maps.event.addListener(marker, "click", function () {
            // map.setZoom(13);
            // map.setCenter(marker.getPosition());
            var cls = document.getElementsByClassName("active");
            cls[0].classList.remove("active");
            document
              .getElementById(`ids${location.id}`)
              .classList.add("active");

            // on click of the marker scrolling the sidebar tiles
            var scroll = document.getElementById("scroll");
            var divOffset = document.getElementById(
              `idscroll${location.id}`
            ).offsetTop;
            scroll.scrollTop = divOffset;
          });
          return marker;
        });
    }

    setTimeout(() => {
      initMap();
    }, 1000);

    window.initMap = initMap;

    //on click function
    const myClick = (id) => {
      map.setCenter(markers[id].getPosition());
      map.setZoom(16);
      google.maps.event.trigger(markers[id], "click");
    };
    click_ref.current = myClick;
  }, [users]);

  function setNativeValue(element, value) {
    const valueSetter = Object.getOwnPropertyDescriptor(element, "value").set;
    const prototype = Object.getPrototypeOf(element);
    const prototypeValueSetter = Object.getOwnPropertyDescriptor(
      prototype,
      "value"
    ).set;

    if (valueSetter && valueSetter !== prototypeValueSetter) {
      prototypeValueSetter.call(element, value);
    } else {
      valueSetter.call(element, value);
    }
  }

  const onChangeSearchAddress = (e) => {
    const searchAddress = e.target.value;
    setSearchAddress(searchAddress);
  };

  const onChangeSearchLat = (e) => {
    const searchLat = e.target.value;
    setSearchLat(searchLat);
  };
  const onChangeSearchLong = (e) => {
    const searchLong = e.target.value;
    setSearchLong(searchLong);
  };

  const findNearestLocation = () => {
    setOpen(!open);
    setLoading(true);
    UserServices.findNearestLocation(searchAddress, searchLat, searchLong)
      .then((response) => {
        setUsers(response.data);
        setLoading(false);
        setOpen(false);
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error:", error);
        setLoading(false);
        setOpen(false);
      });
  };

  return (
    <div>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Helmet>
        <title>Search Sitter | Misha Infotech </title>
      </Helmet>
      <div id="demo"></div>
      <h4 className="text-center">Search Sitter</h4>
      <div className="container">
        <div className="input-group">
          <input
            type="search"
            name="address"
            id="map-search"
            className="form-control rounded"
            placeholder="Search"
            value={searchAddress}
            onChange={onChangeSearchAddress}
            aria-label="Search"
            aria-describedby="search-addon"
            required="required"
          />
          <input
            type="text"
            name="latitude"
            id="lat"
            className="form-control lat"
            value={searchLat}
            onChange={onChangeSearchLat}
            style={{ display: "none" }}
          />
          <input
            type="text"
            name="longitude"
            id="lng"
            className="form-control lng"
            value={searchLong}
            onChange={onChangeSearchLong}
            style={{ display: "none" }}
          />
          <button
            className="btn btn-primary"
            disabled={loading}
            onClick={findNearestLocation}
          >
            {loading && (
              <span className="spinner-border spinner-border-sm"></span>
            )}
            <span> Search</span>
          </button>
        </div>
        <div id="floating-panel"></div>
      </div>

      {/************  Show list of sitter with nearest location  ***********************/}

      <div className="container" style={{ marginTop: "10px" }}>
        {/* <input type="text" placeholder="Search..."  onChange={(event) => {
                setSearch(event.target.value)
            }}/>
        */}

        {/* {users &&
              users.length > 0 &&
              users.filter((user) => {
                if (search === "") return user; // searchTerm is in scope?
                if (user.address.toLowerCase().includes(search.toLowerCase())) {
                  return user;
                }else{
                  return false
                }
            }).map((user, index) => (
                // eslint-disable-next-line
                    <div  className={`card-body list-item ${active === index && "active"}`} onClick={() => setActive(index)} key={user.id}>
                      <div className="row ">
                        <div className="col-sm-8">
                          <h6 className="card-subtitle text-muted" >
                            {user.address}
                          </h6>
                        </div>
                      </div>
                    </div>                 
              ))} */}

        <div className="row">
          <div
            className="col-sm-6 col-md-6 col-lg-6 col-xs-12"
            id="scroll"
            style={{
              overflowY: "scroll",
              height: "600px",
              scrollBehavior: "smooth",
            }}
          >
            {users &&
              users.length > 0 &&
              users.map((user, index) => (
                // eslint-disable-next-line
                <a
                  id={`idscroll${user.id}`}
                  href="#"
                  className="nav-link"
                  key={user.id}
                  onClick={() => click_ref.current(index)}
                >
                  <div
                    className="card"
                    style={{
                      width: "33rem",
                    }}
                    //id={`ids${user.id}`}
                  >
                    <div
                      className={`card-body list-item  ${
                        active === index && "active"
                      }`}
                      onClick={() => setActive(index)}
                      id={`ids${user.id}`}
                    >
                      <div className="row ">
                        <div className="col-sm-4">
                          <img
                            src={user.logo}
                            alt=""
                            style={{ height: "100px", width: "100px" }}
                          />
                        </div>
                        <div className="col-sm-8">
                          <h6 className="card-subtitle text-muted">
                            {user.address}
                          </h6>
                          <p className="card-text text-muted">
                            Hours: <span className="text-success">Open.</span>
                            {user.open}
                          </p>
                          <p
                            className="card-text text-muted"
                            style={{ marginTop: "-15px" }}
                          >
                            Charge/hr : {user.chargesperhour}
                          </p>
                          <p className="card-text text-muted">
                            <span style={{ fontWeight: "bold" }}>
                              {" "}
                              Distance :{" "}
                            </span>{" "}
                            {user.distance.substring(0, 4)}
                            {" KM"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </a>
              ))}
          </div>
          <div className="col-sm-6 col-md-6 col-lg-6 col-xs-12">
            {/*Google map*/}
            <div id="map-canvas-search" />
          </div>
        </div>
      </div>
    </div>
  );
};
export default SearchSitter;
