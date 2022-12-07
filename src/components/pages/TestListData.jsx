import React, { useState, useEffect } from "react";
import UserServices from "../../services/UserServices";
import SitterListTestPagination from "./SitterListTestPagination";

export default function TestListData (){
    const [users, setUsers] = useState('');

    const retrieveTutorials = () => {
      UserServices.getPaginationAll()
        .then((response) => {
          setUsers(response.data);
          console.log(response.data);
        })
        .catch((e) => {
          console.log(e);
        });
    };
   
    useEffect(() => {
        retrieveTutorials();
    }, []);
    return (    
        <SitterListTestPagination users= {users} />
    )
    };