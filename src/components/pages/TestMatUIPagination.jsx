import React, { useEffect, useState } from "react";
// import Modal from 'react-bootstrap/Modal';
//import Updateform from "./updateform";
import {
  DataGrid,
  GridFooterContainer,
  GridPagination,
  GridToolbar,
} from "@mui/x-data-grid";
import {
  Avatar,
  Box,
  IconButton,
  Pagination,
  styled,
  Typography,
} from "@mui/material";
import Button from "@mui/material/Button";
import UserServices from "../../services/UserServices";
import { DeleteForever } from "@mui/icons-material";

function TestMatUIPagination() {
  const [data, setdata] = useState([]);
  const [selectionModel, setSelectionModel] = useState([]);
  /*---------------------props------------------------*/

  /*---------------------props------------------------*/

  const columns = [
    {
      field: "logo",
      headerName: "image",
      width: 70,
      sortable: false,
      renderCell: (params) => <Avatar src={params.value} />, //<img style={{width: "50px", height: "50px"}} src={params.value} alt=""/>
    },
    {
      field: "id",
      headerName: "ID",
      width: 50,
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
    },
    {
      field: "contactname",
      headerName: "Name",
      width: 150,
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
    },
    {
      field: "email",
      headerName: "Email",
      width: 250,
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
    },
    {
      field: "company",
      headerName: "Company Name",
      width: 200,
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
    },
    {
      field: "address",
      headerName: "Address",
      width: 350,
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
    },
    {
      field: "open",
      headerName: "Open Time",
      width: 100,
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
    },
    {
      field: "close",
      headerName: "Close Time",
      width: 100,
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
    },
    {
      field: "Action",
      width: 180,
      sortable: false,
      headerAlign: "center",
      renderCell: (params) => {
        const onClickDelete = async () => {
          setLoading(true);
          fetch(
            `https://tomcat1.shiftescape.com/api/users/delete/${params.row.id}`,
            {
              method: "POST",
            }
          ).then((response) => {
            setdata(data.filter((row) => row.id !== params.row.id));
            console.log(response);
            setLoading(false);
          });
        };

        const onClickEdit = async () => {};

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

    {
      field: "delete",
      width: 75,
      sortable: false,
      disableColumnMenu: true,
      renderHeader: () => {
        return (
          <IconButton
            onClick={async () => {
              setLoading(true);
              console.log(selectionModel);
              fetch(
                `https://tomcat1.shiftescape.com/api/users/deleteall/${selectionModel}`,
                {
                  method: "POST",
                }
              )
                .then((response) => {
                  setdata((data) =>
                    data.filter((r) => !selectionModel.includes(r.id))
                  );
                  console.log(response);
                  setLoading(false);
                })
                .catch((e) => {
                  setLoading(false);
                  console.log(e);
                });
            }}
          >
            <DeleteForever />
          </IconButton>
        );
      },
    },
  ];

  /*****************************************Pagination **********************************/
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState("");
  const [count, setCount] = useState(0);
  const [searchAddress, setSearchAddress] = useState("");
  const [searchCompany, setSearchCompany] = useState("");
  const [loading, setLoading] = useState(false);
  const pageSizes = [10, 25, 50];

  const onChangeSearchAddress = (e) => {
    const searchAddress = e.target.value;
    setSearchAddress(searchAddress);
    setPage(1);
  };

  const onChangeSearchCompany = (e) => {
    const searchCompany = e.target.value;
    setSearchCompany(searchCompany);
    setPage(1);
  };

  const getRequestParams = (searchAddress, searchCompany, page, pageSize) => {
    let params = {};
    if (searchAddress) {
      params["address"] = searchAddress;
    }
    if (searchCompany) {
      params["company"] = searchCompany;
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

  const handlePageSizeChange = (event) => {
    setPageSize(event);
    setPage(1);
  };

  const retrieveTutorials = () => {
    setLoading(true);
    const params = getRequestParams(
      searchAddress,
      searchCompany,
      page,
      pageSize
    );

    UserServices.getPaginationWithAddrAndCompany(params)
      .then((response) => {
        const { user, totalPages, totalItems } = response.data;
        if (user === 0 || user === undefined) {
          setdata(0);
        } else {
          setdata(user);
        }
        setTotalItems(totalItems);
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

  // function checkLength( page,pageSize, totalItems)
  // {
  //  var temp = (pageSize * (page - 1) + 10)
  //  if(totalItems <= temp)
  //  {
  //   return temp;
  //  }
  //  else
  //  {
  //   return totalItems;
  //  }
  // }
  function CustomPagination() {
    return (
      <>
        <Pagination
          className="my-3"
          color="secondary"
          count={count}
          page={page}
          siblingCount={1}
          boundaryCount={1}
          variant="outlined"
          //shape="rounded"
          onChange={handlePageChange}
        />
        <Box>
          <div className="float-right">
            Showing the first {pageSize * (page - 1) + 1} -{" "}
            {totalItems > pageSize * (page - 1) + pageSize
              ? pageSize * (page - 1) + pageSize
              : totalItems}{" "}
            results of {totalItems} rows
          </div>
          <Typography>
            Page: {page} of {count}
          </Typography>
        </Box>
      </>
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

  // const onDelete = () => {
  //     console.log(selectionModel);
  // const onDelete = async () =>  {
  //   console.log(selectionModel);
  //   fetch(`https://tomcat1.shiftescape.com/api/users/deleteall/${selectionModel}`, {
  //     method: "POST"
  //   }).then((response) => {
  //     setdata((data) => data.filter((r) => !selectionModel.includes(r.id)));
  //     console.log(response);
  //   })
  // };

  const StyledGridOverlay = styled("div")(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    "& .ant-empty-img-1": {
      fill: theme.palette.mode === "light" ? "#aeb8c2" : "#262626",
    },
    "& .ant-empty-img-2": {
      fill: theme.palette.mode === "light" ? "#f5f5f7" : "#595959",
    },
    "& .ant-empty-img-3": {
      fill: theme.palette.mode === "light" ? "#dce0e6" : "#434343",
    },
    "& .ant-empty-img-4": {
      fill: theme.palette.mode === "light" ? "#fff" : "#1c1c1c",
    },
    "& .ant-empty-img-5": {
      fillOpacity: theme.palette.mode === "light" ? "0.8" : "0.08",
      fill: theme.palette.mode === "light" ? "#f5f5f5" : "#fff",
    },
  }));

  function CustomNoRowsOverlay() {
    return (
      <StyledGridOverlay>
        <svg
          width="120"
          height="100"
          viewBox="0 0 184 152"
          aria-hidden
          focusable="false"
        >
          <g fill="none" fillRule="evenodd">
            <g transform="translate(24 31.67)">
              <ellipse
                className="ant-empty-img-5"
                cx="67.797"
                cy="106.89"
                rx="67.797"
                ry="12.668"
              />
              <path
                className="ant-empty-img-1"
                d="M122.034 69.674L98.109 40.229c-1.148-1.386-2.826-2.225-4.593-2.225h-51.44c-1.766 0-3.444.839-4.592 2.225L13.56 69.674v15.383h108.475V69.674z"
              />
              <path
                className="ant-empty-img-2"
                d="M33.83 0h67.933a4 4 0 0 1 4 4v93.344a4 4 0 0 1-4 4H33.83a4 4 0 0 1-4-4V4a4 4 0 0 1 4-4z"
              />
              <path
                className="ant-empty-img-3"
                d="M42.678 9.953h50.237a2 2 0 0 1 2 2V36.91a2 2 0 0 1-2 2H42.678a2 2 0 0 1-2-2V11.953a2 2 0 0 1 2-2zM42.94 49.767h49.713a2.262 2.262 0 1 1 0 4.524H42.94a2.262 2.262 0 0 1 0-4.524zM42.94 61.53h49.713a2.262 2.262 0 1 1 0 4.525H42.94a2.262 2.262 0 0 1 0-4.525zM121.813 105.032c-.775 3.071-3.497 5.36-6.735 5.36H20.515c-3.238 0-5.96-2.29-6.734-5.36a7.309 7.309 0 0 1-.222-1.79V69.675h26.318c2.907 0 5.25 2.448 5.25 5.42v.04c0 2.971 2.37 5.37 5.277 5.37h34.785c2.907 0 5.277-2.421 5.277-5.393V75.1c0-2.972 2.343-5.426 5.25-5.426h26.318v33.569c0 .617-.077 1.216-.221 1.789z"
              />
            </g>
            <path
              className="ant-empty-img-3"
              d="M149.121 33.292l-6.83 2.65a1 1 0 0 1-1.317-1.23l1.937-6.207c-2.589-2.944-4.109-6.534-4.109-10.408C138.802 8.102 148.92 0 161.402 0 173.881 0 184 8.102 184 18.097c0 9.995-10.118 18.097-22.599 18.097-4.528 0-8.744-1.066-12.28-2.902z"
            />
            <g className="ant-empty-img-4" transform="translate(149.65 15.383)">
              <ellipse cx="20.654" cy="3.167" rx="2.849" ry="2.815" />
              <path d="M5.698 5.63H0L2.898.704zM9.259.704h4.985V5.63H9.259z" />
            </g>
          </g>
        </svg>
        <Box sx={{ mt: 1 }}>No Rows</Box>
      </StyledGridOverlay>
    );
  }

  return (
    <>
      <div className="col-md-5">
        <div className="input-group mt-2">
          <input
            type="text"
            className="form-control"
            placeholder="Search by Address"
            value={searchAddress}
            onChange={onChangeSearchAddress}
          />
          <input
            type="text"
            className="form-control"
            placeholder="Search by Company Name"
            value={searchCompany}
            onChange={onChangeSearchCompany}
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
      {/* <Button variant="contained" color="primary" onClick={onDelete}>
        Delete selected rows
      </Button> */}
      <Box sx={{ height: 650, width: "100%" }}>
        <DataGrid
          sx={{
            boxShadow: 2,
            border: 2,
            borderColor: "primary.light",
            "& .MuiDataGrid-cell:hover": {
              color: "primary.main",
            },
          }}
          rows={data}
          //disableColumnFilter
          //disableColumnSelector
          //disableDensitySelector
          disableColumnMenu
          disableSelectionOnClick
          columns={columns}
          // pagination
          // page={page}

          // paginationMode="server"
          //onPageChange={(newPage) => setPage(newPage)}

          // onSelectionModelChange={(newSelectionModel) => {
          //     setSelectionModel(newSelectionModel);
          //   }}
          // selectionModel={selectionModel}

          //   onSelectionModelChange={({ selectionModel }) =>
          //   setSelectionModel(selectionModel)
          // }
          onSelectionModelChange={setSelectionModel}
          selectionModel={selectionModel}
          pageSize={pageSize}
          onPageSizeChange={handlePageSizeChange}
          rowsPerPageOptions={pageSizes}
          checkboxSelection
          preProcessEditCellProps
          //rowCount={totalItems}
          localeText={{
            footerRowSelected: CustomPagination,
          }}
          components={{
            Toolbar: GridToolbar,
            NoRowsOverlay: CustomNoRowsOverlay,
            Footer: CustomFooter,
          }}
          componentsProps={{
            toolbar: {
              showQuickFilter: true,
              quickFilterProps: { debounceMs: 500 },
            },
          }}
          loading={loading}
          {...data}
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
  );
}

export default TestMatUIPagination;
