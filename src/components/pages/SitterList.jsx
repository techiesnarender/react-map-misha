import React, {useState, useEffect, useRef} from "react";
import { Link } from "react-router-dom";
import UserServices from "../../services/UserServices";

const  SitterList = () => {
    const effectRan = useRef(false);
    const [users, setUser] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
      if(effectRan.current === false){
        retrieveUser(); 
        return () => {
          effectRan.current = true;
        }
      }       
    }, []);

    const retrieveUser = (e) =>{
      setLoading(true);
        UserServices.getAll()
        .then(response => {
            setUser(response.data);
            setLoading(false);
            setMessage("")
            console.log(response.data);
        })
        .catch( e => {
            console.log(e);
            setLoading(false);
            setMessage("Something went wrong!");
        });
    };
    return (
        <>
        <h4 className="text-center">Sitter Records</h4>	
        {loading && (
        <span className="spinner-border" style={{ position: "fixed", zIndex:"1031", top:"50%", left: "50%", transform: "initial" }}></span>
        )}
        <div className="table-responsive">
       <table className="table table-striped table-bordered table-hover table-sm" id="myTable"> 
          <thead className="table-primary">
            <tr>
              <th>S No.</th>
              <th>Logo</th>
              <th>Company Name</th>
              <th>Name</th>
              <th>Email</th>
              <th>Address</th>
              <th>Open Time</th>
              <th>Charges</th>
              <th>Action</th>
            </tr>
          </thead>  
          <tbody>    
             {users && users.length > 0 && users.map((user, index) => (
                <tr key={user.id}>
                <td>{index + 1}</td>
                <td><img src={user.logo} alt="" style={{height:"40px", width: "40px"}} /></td>
                <td>{user.company}</td>
                <td>{user.contactname}</td>
                <td>{user.email}</td>
                <td>{user.address.substring(0, 30)} ...{" "} {user.address.substr(user.address.length - 20)}</td>
                <td>{user.open}</td>
                <td>{user.chargesperhour}</td>
                <td>
                <Link
                to={"/editsitter/" + user.id}
                className="btn btn-warning"
                >
                Edit
              </Link>
                </td>       
                </tr>
             ))}    
          </tbody>
        </table>
        </div>
        {message && (    
              <span className="alert alert-danger " role="alert" style={{ position: "fixed", zIndex:"1031", left: "45%", transform: "initial" }}>
                {message}
              </span>
          )}   
      </>
    );
}
export default SitterList;


    