import http from "../http-common";
import authHeader from "./auth-header";

const getAll = () => {
  return http.get("/admin/users", { headers: authHeader() });
};

const getPublicAll = () => {
  return http.get("/users");
};

const get = id => {
  return http.get(`/users/${id}`);
};

const create = data => {
  console.log(data)
  return http.post("/users", data);
};

const update = (id, data) => {
  return http.post(`/users/edit/${id}`, data);
};

const remove = id => {
  return http.post(`/users/delete/${id}`);
};

const findNearestLocation = (address, latitude, longitude) => {
  return http.get(`/users/search?address=${address}&latitude=${latitude}&longitude=${longitude}`);
}

const upload = (file, email,  onUploadProgress) => {
  let formData = new FormData();

  formData.append("file", file);
  formData.append('email', email);

  return http.post("/users/uploadFile", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    onUploadProgress,
  });
};

const getPaginationAll = (params) => {
  return http.get("/users/paging", { params }); 
 
};

const UserServices =  {
  getAll,
  get,
  create,
  update,
  remove,
  findNearestLocation,
  upload,
  getPaginationAll,
  getPublicAll
};

export default  UserServices;