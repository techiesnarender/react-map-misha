import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid} from '@mui/material';
import React, {useState, useEffect} from 'react'
import { Helmet } from 'react-helmet-async';
import {useParams, useNavigate} from 'react-router-dom'
import UserServices from '../../services/UserServices';
import ErrorIcon from '@mui/icons-material/Error';
import { red } from '@mui/material/colors';

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
    const [loadingUpdate, setLoadingUpdate] = useState(false);
    const [loadingDelete, setLoadingDelete] = useState(false);

    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
    };

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
      setLoading(true);
      setLoadingUpdate(true);
        UserServices.update(currentUser.id, currentUser)
        .then(response => {
          setLoadingUpdate(false);
          setLoading(false);
            setCurrentUser({ ...currentUser});
          console.log(response.data);
          setMessage("The User details was updated successfully!");
        })
        .catch(e => {
          setLoadingUpdate(false);
          setLoading(false);
          console.log(e);
        });
    };

    const deleteUser = () => {
      setLoading(true);
      setLoadingDelete(true);
        UserServices.remove(currentUser.id)
          .then(response => {
            setLoading(false);
            setLoadingDelete(false);
            console.log(response.data);
            navigate("/admin/sitterlist");
          })
          .catch(e => {
            setLoading(false);
            setLoadingDelete(false);
            console.log(e);
          });
      };    
  return (
    <div>
      <Helmet>
        <title>Edit Sitter | Misha Infotech </title>
      </Helmet>
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
        {/* <button className="btn btn-danger mr-2" onClick={deleteUser}>
          Delete
        </button> */}
        
        
      <Button variant="contained"  color="error" onClick={handleClickOpen} className="mr-2">
        Delete
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
          <Grid container direction="column" alignItems="center" wrap="nowrap" >
              <ErrorIcon sx={{ fontSize: 100, color: red[500] }} />
          </Grid>
         <DialogTitle>{"Are you sure?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
          Once deleted, you will not be able to recover this user!
            <div>
                {loadingDelete && (
                    <span className="spinner-border" align="center" sx={{
                      textAlign: 'center',
                    }}></span>
                  )}
              </div>
          </DialogContentText>

        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="error" onClick={handleClose}>No</Button>
          <Button variant="contained"  color="success" onClick={deleteUser} autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
        <button
          className="btn btn-success"
          onClick={updateUser}
          disabled={loadingUpdate}
        >
           {loadingUpdate && (
                <span className="spinner-border spinner-border-sm" ></span>
              )}
         <span> Update</span> 
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