import React, { useState } from 'react'
import AuthService from '../../services/auth.service';
import UserServices from '../../services/UserServices';

const TestImagePreview = () => {
  /** Fecth Current user details */
    const currentUser = AuthService.getCurrentUser();
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

  return (  
    <div>
    <div className="row">
    <div className="col-sm-3"> 
    {previewImage ? (
    <div>
        <img className="avatar rounded-circle img-thumbnail" src={previewImage} alt="" style={{height:"200px", width:"200px"}} />
    </div>
    ) :
    <img
      src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
      className="preview avatar rounded-circle img-thumbnail"
      alt=""
    /> 
     }
    {/* {previewImage && (
      <div>
        <img className="preview avatar rounded-circle img-thumbnail" src={previewImage} alt="" />
      </div>
    )} */}
        <label className="btn btn-default p-0">
          <input type="file" accept="image/*" onChange={selectFile} />
        </label>

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

<div className="col-4">
        <button
          className="btn btn-success btn-sm"
          disabled={!currentFile}
          onClick={upload}
        >
          Upload
        </button>
      </div>
    </div>
    {message && (
      <div className="alert alert-secondary mt-3" role="alert">
        {message}
      </div>
    )}
    
    </div>
  </div>
  )
}
export default TestImagePreview