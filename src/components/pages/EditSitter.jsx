import React, {useState, useEffect} from 'react'
import {useParams, useNavigate} from 'react-router-dom'
import UserServices from '../../services/UserServices';

const EditSitter = () => {
    const {id} = useParams();
    let navigate = useNavigate();

    const initialUserService = {
        id: null,
        contactname: "",
        email: "",
        company: "",
        open: "",
        close: "",
        chargesperhour: ""
    };

    const [currentUser, setCurrentUser] = useState(initialUserService);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const getUser = id => {
      setLoading(true);
        UserServices.get(id)
          .then(response => {
            setCurrentUser(response.data);
            setLoading(false);
            console.log(response.data);
          })
          .catch(e => {
            setLoading(false);
            console.log(e);
          });
      };

      useEffect(() => {
        if (id)
        getUser(id);
      }, [id]);

      const handleInputChange = event => {
        const { name, value } = event.target;
        setCurrentUser({ ...currentUser, [name]: value });
      };
  
    const updateUser = () => {
        UserServices.update(currentUser.id, currentUser)
        .then(response => {
            setCurrentUser({ ...currentUser});
          console.log(response.data);
          setMessage("The User details was updated successfully!");
        })
        .catch(e => {
          console.log(e);
        });
    };

    const deleteUser = () => {
        UserServices.remove(currentUser.id)
          .then(response => {
            console.log(response.data);
            navigate("/admin/sitterlist");
          })
          .catch(e => {
            console.log(e);
          });
      };    
  return (
    <div>
    {currentUser ? (
      <div className="edit-form">
        <h4>Edit Sitter</h4>
        {loading && (
        <span className="spinner-border" style={{ position: "fixed", zIndex:"1031", top:"50%", left: "50%", transform: "initial" }}></span>
        )}
        <form>
          <div className="form-group">
            <label htmlFor="contactname">Contact Name</label>
            <input
              type="text"
              className="form-control"
              id="contactname"
              name="contactname"
              value={currentUser.contactname}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              value={currentUser.email}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="company">Company Name</label>
            <input
              type="text"
              className="form-control"
              id="company"
              name="company"
              value={currentUser.company}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="contactname">Open Time</label>
            <input
              type="text"
              className="form-control"
              id="open"
              name="open"
              value={currentUser.open}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="close">Close Time</label>
            <input
              type="text"
              className="form-control"
              id="close"
              name="close"
              value={currentUser.close}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="chargesperhour">Charges Per Hour's</label>
            <input
              type="text"
              className="form-control"
              id="chargesperhour"
              name="chargesperhour"
              value={currentUser.chargesperhour}
              onChange={handleInputChange}
            />
          </div>
        </form>
        <button className="btn btn-danger mr-2" onClick={deleteUser}>
          Delete
        </button>
        <button
          type="submit"
          className="btn btn-success"
          onClick={updateUser}
        >
          Update
        </button>
        {message && (
              <div
                className= "alert alert-success mt-3"
                role="alert"
              >
                {message}
              </div>
          )}
      </div>
    ) : (
      <div>
      </div>
    )}
  </div>
  )
}
export default EditSitter;