import "bootstrap/dist/css/bootstrap.min.css";
import './App.css';
import React from "react";
import Navbar from './components/layouts/Navbar';
import Registration from "./components/pages/Registration";
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Home from "./components/pages/Home";
import SitterList from "./components/pages/SitterList";
import SearchSitter from "./components/pages/SearchSitter";
import Login from "./components/pages/Login";
import Profile from "./components/pages/Profile";
import ChangePassword from "./components/pages/ChangePassword";
import ForgetPassword from "./components/pages/ForgetPassword";
import ResetPassword from "./components/pages/ResetPassword";
import EditSitter from "./components/pages/EditSitter";
import TestFormValidation from "./components/pages/TestFormValidation";
import TestImagePreview from "./components/pages/TestImagePreview";
import SearchSitterTest from "./components/pages/SearchSitterTest";
import SitterListTestPagination from "./components/pages/SitterListTestPagination";

const  App = () => {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
            <Route exact path="/" element={<Home />} />  
            <Route  path="/home" element={<Home />} />  
            <Route  path="/register" element={<Registration />} />
            <Route  path="/search" element={< SearchSitter />} />
            <Route  path="/searchSitter" element={< SearchSitterTest />} />
            <Route  path="/sitterlisttest" element={< SitterListTestPagination />} />
            <Route  path="/formvalidation" element={< TestFormValidation />} />
            <Route  path="/imagepreview" element={< TestImagePreview />} />
            <Route  path="/admin/sitterlist" element={<SitterList />} />
            <Route  path="/profile" element={<Profile />} />
            <Route  path="/login" element={<Login />} />
            <Route  path="/changepassword" element={<ChangePassword />} />
            <Route  path="/forgetpassword" element={<ForgetPassword />} />
            <Route  path="/editsitter/:id" element={<EditSitter />} />
            <Route  path="/reset_password" element={<ResetPassword />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
