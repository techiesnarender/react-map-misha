import React, { useEffect, useState} from "react";
// import Modal from 'react-bootstrap/Modal';
//import Updateform from "./updateform";
import { DataGrid, GridFooterContainer, GridPagination, GridToolbar } from '@mui/x-data-grid';
import { Box, Pagination } from "@mui/material";
import Button from '@mui/material/Button';
import UserServices from "../../services/UserServices";

function TestMatUIPagination() {
  const [data, setdata] = useState([])

  /*---------------------props------------------------*/
  

  /*---------------------props------------------------*/

  const columns = [
    { field: 'id', headerName: 'ID', width: 100, headerClassName: 'super-app-theme--header',
    headerAlign: 'center', },
    { field: 'contactname', headerName: 'Name', width: 250,  headerClassName: 'super-app-theme--header',
    headerAlign: 'center', },
    { field: 'email', headerName: 'Email', width: 250,  headerClassName: 'super-app-theme--header',
    headerAlign: 'center', },
    { field: 'company', headerName: 'Company Name', width: 200,  headerClassName: 'super-app-theme--header',
    headerAlign: 'center', },
    { field: 'address', headerName: 'Address', width: 250,  headerClassName: 'super-app-theme--header',
    headerAlign: 'center', },
    { field: 'open', headerName: 'Open Time', width: 130,  headerClassName: 'super-app-theme--header',
    headerAlign: 'center', },
    { field: 'close', headerName: 'Close Time', width: 130,  headerClassName: 'super-app-theme--header',
    headerAlign: 'center', },
    {
      field: 'Action',
      width: 250,
      sortable: false,
      headerAlign: 'center',
      renderCell: (params) => {
        const onClickDelete = async () =>  {
          fetch(`https://tomcat1.shiftescape.com/api/users/delete/${params.row.id}`, {
            method: "POST"
          }).then((response) => {
            setdata(data.filter((row) => row.id !== params.row.id));
            console.log(response);
          })
        };

        const onClickEdit = async () => {
        };
  
        return (
          <>
            <Button
               onClick={onClickDelete}

                  variant="contained"
                  size="small"
                  style={{ marginLeft: 16 }}
                >
                  Delete
                </Button>
                <Button
                onClick={onClickEdit}
                  variant="contained" 
                  color="error"
                  size="small"
                  style={{ marginLeft: 16 }}
                >
                  Edit
                </Button>
          </>
        );
      },
    },
  ]

  /*****************************************Pagination **********************************/
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [count, setCount] = useState(0);
  const [searchAddress, setSearchAddress] = useState("");
  const [loading, setLoading] = useState(false);
 // const pageSizes = [10, 25, 50];

 const onChangeSearchAddress = (e) => {
  const searchAddress = e.target.value;
  setSearchAddress(searchAddress);
  setPage(1);
};

  const getRequestParams = (searchAddress, page, pageSize) => {
    let params = {};
    if (searchAddress) {
      params["address"] = searchAddress;
    }
    if (page) {
      params["page"] = page - 1;
    }
    if (pageSize) {
      params["size"] = pageSize;
    }
    return params;
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };
  
  // const handlePageSizeChange = (event) => {
  //   setPageSize(event.target.value);
  //   setPage(1);
  // };

  const retrieveTutorials = () => {
    setLoading(true);
    const params = getRequestParams(searchAddress, page, pageSize);

    UserServices.getPaginationAll(params)
      .then((response) => {
        const { user, totalPages } = response.data;
        if(user === 0 || user === undefined){
          setdata(0);
        }else{
          setdata(user);
        }
    
        setCount(totalPages);
        setLoading(false);
        console.log(response.data);
      })
      .catch((e) => {
        setLoading(false);
        console.log(e);
      });
  };

  // eslint-disable-next-line
  useEffect(retrieveTutorials, [page, pageSize]);

//   function CustomPerPage() {
//     return (
//         <Box>
//         {"Items per Page: "}
//         <select onChange={handlePageSizeChange} value={pageSize}>
//           {pageSizes.map((size) => (
//             <option key={size} value={size}>
//               {size}
//             </option>
//           ))}
//         </select>
//       </Box>
//     );
//   }


  function CustomPagination() {
    return (
      <Pagination
      className="my-3"
      color="primary"
      count={count}
      page={page}
      siblingCount={1}
      boundaryCount={1}
      variant="outlined"
      //shape="rounded"
      onChange={handlePageChange}
      />
    );
  }

  function CustomFooter() {
    return (
      <GridFooterContainer>
        <CustomPagination />
        <GridPagination />
      </GridFooterContainer>
    );
  }

  const [selectionModel, setSelectionModel] = useState([]);

  return (
    <>

      <div className="col-md-3">
        <div className="input-group mt-2">
          <input
            type="text"
            className="form-control"
            placeholder="Search by Address"
            value={searchAddress}
            onChange={onChangeSearchAddress}
          />
          <div className="input-group-append">
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={retrieveTutorials}
              autoFocus
            >
              Search
            </button>
          </div>
        </div>
      </div>

      <Box sx={{ height: 650, width: '100%'}}>
      <DataGrid
        rows={data}
        //disableColumnFilter
        //disableColumnSelector
        //disableDensitySelector
        disableColumnMenu
        disableSelectionOnClick
        columns={columns}
        // pagination
        // page={page}
        pageSize={pageSize}
        // paginationMode="server"
        // onPageChange={(newPage) => setPage(newPage)}
        onSelectionModelChange={(newSelectionModel) => {
            setSelectionModel(newSelectionModel);
          }}
        selectionModel={selectionModel}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        rowsPerPageOptions={[10, 25, 50]}
        checkboxSelection
        preProcessEditCellProps
        localeText={{
            footerRowSelected: CustomPagination
          }}
          components={{
            Toolbar: GridToolbar,
            Footer: CustomFooter
          }}
        componentsProps={{
          toolbar: {
            showQuickFilter: true,
            quickFilterProps: { debounceMs: 500 },
          },
        }}
         loading={loading}
      />
    </Box>
    {/* <Button
        variant="contained"
        color="primary"
        disabled={!selectionModel.length}
        size="large"
      >
        Next
      </Button> */}
  </>
  )
}

export default TestMatUIPagination