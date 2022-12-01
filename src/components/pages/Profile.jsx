import { Button } from "@mui/material";
import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
import AuthService from "../../services/auth.service";
import UserServices from "../../services/UserServices";

const Profile = () => {
  // let navigate = useNavigate();
  /** Fecth Current user details */
  const currentUser = AuthService.getCurrentUser();
  const currentUserId = currentUser.id;
  const [users, setUser] = useState({});
  const [loading, setLoading] = useState(false);
  // Preview image code start here
  const [currentFile, setCurrentFile] = useState(undefined);
  const [previewImage, setPreviewImage] = useState(undefined);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");

  const selectFile = (event) => {
    setCurrentFile(event.target.files[0]);
    setPreviewImage(URL.createObjectURL(event.target.files[0]));
    setProgress(0);
    setMessage("");
  };

  useEffect(() => {
      retrieveUser();
      // eslint-disable-next-line
  },[]);

  const retrieveUser = () =>{
    setLoading(true);
      UserServices.get(currentUserId)
      .then(response => {
          setUser(response.data);
          setLoading(false);
          console.log(response.data);
      })
      .catch( e => {
          console.log(e);
      });
  };
/** Upload image code.. */
const upload = () => {
  setProgress(0);
  UserServices.upload(currentFile, currentUser.email, (event) => {
    setProgress(Math.round((100 * event.loaded) / event.total));
  })
    .then((response) => {
      setMessage(response.data.message);
    })
    .catch((err) => {
      setProgress(0);
      if (err.response && err.response.data && err.response.data.message) {
        setMessage(err.response.data.message);
      } else {
        setMessage("Could not upload the Image!");
      }
      setCurrentFile(undefined);
    });
};
	// const changeHandler = (event) => {
	// 	setSelectedFile(event.target.files[0]);
	// };

	// const handleSubmission = () => {
  //   setImgLoading(true);
	// 	const formData = new FormData();

	// 	formData.append('file', selectedFile);
  //   formData.append('email', currentUser.email);

	// 	fetch(
  //     //'http://localhost:8080/api/users/uploadFile',
  //     'https://tomcat1.shiftescape.com/api/users/uploadFile',
	// 		{
	// 			method: 'POST',
	// 			body: formData,
	// 		}
	// 	)
	// 		.then( 
  //       () => {
  //         navigate("/profile");
  //         window.location.reload();
  //       },
  //       (response) => response.json() )
	// 		.then((result) => {
	// 			console.log('Success:', result);
  //       setImgLoading(false);
	// 		})
	// 		.catch((error) => {
	// 			console.error('Error:', error);
  //       setImgLoading(false);
	// 		});
	// } ;
  return (
    <div className="container">
      <h3 className="text-center"><strong>Sitter Profile</strong></h3>
      {loading && (
        <span className="spinner-border" style={{ position: "fixed", zIndex:"1031", top:"50%", left: "50%", transform: "initial" }}></span>
        )}
       <div className="row">
       <div className="col-sm-3"> 
          {previewImage ? (  
              <img className="avatar rounded-circle img-thumbnail" src={previewImage} alt="" style={{height:"200px", width:"200px"}} /> 
          ) :
          <div>
        <img
            src={users.logo}
            className="avatar rounded-circle img-thumbnail"
            alt={users.contactname}
            style={{height:"200px", width:"200px"}}
          />
          </div>
          
          }
     <label htmlFor="logo" className="col-sm col-form-label font-weight-bold">Upload a different image...</label>
        {/* <div className="btn btn-default mt-2">
          <input type="file" id="logo" accept="image/*" onChange={selectFile} />
        </div> */}

      <Button variant="contained" component="label">
        Upload
        <input hidden accept="image/*" multiple type="file" onChange={selectFile} />
      </Button>

        {currentFile && (
      <div className="progress my-3">
        <div
          className="progress-bar progress-bar-info"
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin="0"
          aria-valuemax="100"
          style={{ width: progress + "%" }}
        >
          {progress}%
        </div>
      </div>     
    )}
        <Button variant="contained"
          color="secondary"
          className="ml-2"
          disabled={!currentFile}
          onClick={upload}>           
            Save
        </Button>
    </div>
    {message && (
      <div className="alert alert-secondary mt-3" role="alert">
        {message}
      </div>
    )}
     
          {/* <div className="col-sm-3">     
          <div className="text-center">
            
    <img
      src={users.logo}
      className="avatar rounded-circle img-thumbnail"
      alt={users.contactname}
      draggable= "true"
      style={{height:"200px", width: "200px"}}
    />
    <h6>Upload a different photo...</h6> 
      <input
        type="file"
        name="file"
        className="text-center center-block file-upload"
        required="required"
        onChange={changeHandler}
      />

      <button className="btn btn-primary" disabled={loadingImg} onClick={handleSubmission}>
              {loadingImg && (
                <span className="spinner-border spinner-border-sm"></span>
              )}
              <span>Update</span>
            </button>
  </div>
  <br />
      </div> */}
          <div className="col-sm-9">       
          <header className="jumbotron"> 
          <p>
            <strong>Contact Name:</strong> <span>{users.contactname}</span>
          </p>
          <p>
            <strong>Email:</strong> {users.email}
          </p>
          <p>
            <strong>Company Name:</strong> {users.company}
          </p>
          <p>
            <strong>Open Time:</strong> {users.open}
          </p>
          <p>
            <strong>Close Time:</strong> {users.close}
          </p>
          <p>
            <strong>Charges:</strong> {users.chargesperhour}
          </p>
          </header>
          </div>
       </div>
      {/* <p>
        <strong>Token:</strong> {currentUser.accessToken.substring(0, 20)} ...{" "}
        {currentUser.accessToken.substr(currentUser.accessToken.length - 20)}
      </p> */}
      {/* <p>
        <strong>Id:</strong> {currentUser.id}
      </p> */}
     
      {/* <strong>Authorities:</strong>
      <ul>
        {currentUser.roles &&
          currentUser.roles.map((role, index) => <li key={index}>{role}</li>)}
      </ul> */}
    </div>
  );
};
export default Profile;