import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import UserServices from "../../services/UserServices";

const Search = () => {

  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [pageSize, setPageSize] = useState(100);

  useEffect(() => {
      findNearestLocation();
   // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search,pageSize]);

  const onChangeSearch = (e) => {
    const search = e.target.value;
    setSearch(search);
  };

  const getRequestParams = (search) => {
    let params = {};
    if (search) {
      params["address"] = search;
    }
    if (pageSize) {
        params["size"] = pageSize;
      }
   
    return params;
  };

  const findNearestLocation = () => {
    const params = getRequestParams(search, pageSize);
    UserServices.getGlobalSearch(params).then(
      (response) => {
        setUsers(response.data.user);
        console.log(response.data);
      }
    ).catch((error) => {
      console.error('Error:', error);
    });
  };

  return (
    <div>
      <Helmet>
        <title>Search Sitter | Misha Infotech </title>
      </Helmet>
      <h4 className="text-center">Search Sitter</h4>

      {/************  Show list of sitter with nearest location  ***********************/}

      <div className="container" style={{ marginTop: "10px" }}>
            <input type="text" placeholder="Search..." value={search} onChange={onChangeSearch}/>
       
        {users &&
              users.length > 0 && users.map((user) => (
                // eslint-disable-next-line
                    <div  className={`card-body list-item`} key={user.id}>
                      <div className="row ">
                        <div className="col-sm-8">
                          <h6 className="card-subtitle text-muted" >
                            {user.address}
                          </h6>
                        </div>
                      </div>
                    </div>                 
              ))}
      </div>
    </div>
  );
};
export default Search;
