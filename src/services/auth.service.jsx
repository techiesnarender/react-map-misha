import http from "../http-common";

const login = (email, password) => {
  return http
    .post("auth/signin", {
      email,
      password,
    })
    .then((response) => {
      if (response.data.accessToken) {
        localStorage.setItem("user", JSON.stringify(response.data));
      }
      console.log(response.data);
      return response.data;
      
    });
};

const changepassword = (oldpassword, newpassword, email) =>{
  return http
    .post("users/changepassword", {
      oldpassword,
      newpassword,
      email,
    })
    .then((response) => {
      console.log(response.data);
      return response.data;
      
    });
}

const fogetPassword = (email) =>{
  return http
    .post("forgot_password", {
      email,
    })
    .then((response) => {
      console.log(response.data);
      return response.data;
      
    });
}

const resetPassword = (token, password) =>{
  return http
    .post("reset_password", {
      token,
      password
    })
    .then((response) => {
      console.log(response.data);
      return response.data;
      
    });
  }

const logout = () => {
  localStorage.removeItem("user");
};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};

const AuthService = {
  login,
  logout,
  changepassword,
  fogetPassword,
  resetPassword,
  getCurrentUser,
};

export default AuthService;