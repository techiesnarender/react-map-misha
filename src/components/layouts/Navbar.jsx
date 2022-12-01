import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AuthService from "../../services/auth.service";

const Navbar = () => {
  const [showAdminBoard, setShowAdminBoard] = useState(false);
  const [currentUser, setCurrentUser] = useState(undefined);
  
  useEffect(() => {
    const user = AuthService.getCurrentUser();

    if (user) {
      setCurrentUser(user);
      setShowAdminBoard(user.roles.includes("ROLE_ADMIN"));
    }
  }, []);

  // Logout function 
  const logOut = () => {
    AuthService.logout();
  };
  return (
    <div>
      <nav className="navbar navbar-expand navbar-dark bg-dark">
        <Link to={"/"} className="navbar-brand">
          Misha Infotech
        </Link>
        <ul className="navbar-nav mr-auto">
          <li className="nav-item active">
            <Link to={"/home"} className="nav-link">
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link to={"/search"} className="nav-link">
              Search Sitter
            </Link>
          </li>
          <li className="nav-item">
            <Link to={"/sitterlisttest"} className="nav-link">
              Pagination List
            </Link>
          </li>
          {/* <li className="nav-item">
            <Link to={"/searchSitter"} className="nav-link">
              Test Search Sitter
            </Link>
          </li> */}
          {/* <li className="nav-item">
            <Link to={"/formvalidation"} className="nav-link">
              Test Validation
            </Link>
          </li> */}
          {/* <li className="nav-item">
            <Link to={"/imagepreview"} className="nav-link">
              Image Preview
            </Link>
          </li> */}
          {showAdminBoard && (
            <li className="nav-item">
              <Link to={"/admin/sitterlist"} className="nav-link">
                Sitter List
              </Link>
            </li>
          )}

          {currentUser && (
            <li className="nav-item">
              <Link to={"/user"} className="nav-link">
                User
              </Link>
            </li>
          )}
        </ul>
        {currentUser ? (
          <ul className="navbar-nav ml-auto">
            <li className="nav-item dropdown">
              <Link to={"/profile"} className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                {currentUser.contactname}
              </Link>

              <div className="dropdown-menu" aria-labelledby="navbarDropdown">
              <Link to={"/profile"} className="dropdown-item" href="#">
               Profile
              </Link>
              <Link to={"/changepassword"} className="dropdown-item" href="#">
               Change Password?
              </Link>
              </div>
            </li>
            <li className="nav-item">
              <a href="/login" className="nav-link" onClick={logOut}>
                LogOut
              </a>
            </li>
          </ul>
        ) : (
          <ul className="navbar-nav ml-auto">
            <li className="nav-item">
              <Link to={"/login"} className="nav-link">
                Login
              </Link>
            </li>
            <li className="nav-item">
              <Link to={"/register"} className="nav-link">
                Sign Up
              </Link>
            </li>
          </ul>
        )}
      </nav>
    </div>
  );
};
 export default Navbar;