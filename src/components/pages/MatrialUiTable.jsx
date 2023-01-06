import React, { useState, useEffect } from "react";
import Pagination from "@mui/material/Pagination";
import UserServices from "../../services/UserServices";
import {
  Backdrop,
  CircularProgress,
  Paper,
  Skeleton,
  Stack,
  styled,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const MatrialUiTable = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [totalItems, setTotalItems] = useState("");
  const [pageSize, setPageSize] = useState(6);
  const [searchAddress, setSearchAddress] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const pageSizes = [6, 9, 15];

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

  const retrieveTutorials = () => {
    setOpen(!open);
    setLoading(true);
    const params = getRequestParams(searchAddress, page, pageSize);

    UserServices.getPaginationAll(params)
      .then((response) => {
        const { user, totalPages, totalItems } = response.data;
        setOpen(false);
        setLoading(false);
        setMessage("");
        setUsers(user);
        setCount(totalPages);
        setTotalItems(totalItems);

        console.log(response.data);
      })
      .catch((e) => {
        setLoading(false);
        setMessage("Something went wrong!");
        setOpen(false);
        console.log(e);
      });
  };
  // eslint-disable-next-line
  useEffect(retrieveTutorials, [page, pageSize]);

  // useEffect(retrieveTutorials, [page, pageSize, searchAddress]);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handlePageSizeChange = (event) => {
    setPageSize(event.target.value);
    setPage(1);
  };

  const [open, setOpen] = React.useState(false);

  // const handleClose = () => {
  //   setOpen(false);
  // };
  // const handleToggle = () => {
  //   setOpen(!open);
  // };

  return (
    <>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <div className="col-md-3">
        <div className="input-group mt-3">
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

      <div className="mt-3 mb-3 ml-3">
        {"Items per Page: "}
        <select onChange={handlePageSizeChange} value={pageSize}>
          {pageSizes.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>
      {loading ? (
        //  <Stack  style={{
        //   position: 'absolute', left: '50%', top: '50%',
        //   transform: 'translate(-50%, -50%)'
        // }}>
        //   <CircularProgress />
        // </Stack>

        <Stack spacing={1}>
          <Skeleton variant="rectangular" width="100%" height={60} />
          <Skeleton variant="rectangular" width="100%" height={60} />
          <Skeleton variant="rectangular" width="100%" height={60} />
          <Skeleton variant="rectangular" width="100%" height={60} />
        </Stack>
      ) : (
        <div>
          <TableContainer component={Paper}>
            <Table
              sx={{ minWidth: 650 }}
              size="small"
              aria-label="customized table"
            >
              <TableHead>
                <TableRow>
                  <StyledTableCell>Sr. No.</StyledTableCell>
                  <StyledTableCell>Contact Name</StyledTableCell>
                  <StyledTableCell>Company Name</StyledTableCell>
                  <StyledTableCell>Email</StyledTableCell>
                  <StyledTableCell>Address</StyledTableCell>
                  <StyledTableCell>Open Time</StyledTableCell>
                  <StyledTableCell>Charges Per Hours</StyledTableCell>
                  <StyledTableCell>Action</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users?.map((row, index) => (
                  <StyledTableRow key={row.id}>
                    <StyledTableCell component="th" scope="row">
                      {pageSize * (page - 1) + index + 1}
                    </StyledTableCell>
                    <StyledTableCell>{row.contactname}</StyledTableCell>
                    <StyledTableCell>{row.company}</StyledTableCell>
                    <StyledTableCell>{row.email}</StyledTableCell>
                    <StyledTableCell>
                      {row.address.substring(0, 30)} ...{" "}
                      {row.address.substr(row.address.length - 20)}
                    </StyledTableCell>
                    <StyledTableCell>{row.open}</StyledTableCell>
                    <StyledTableCell>{row.chargesperhour}</StyledTableCell>
                    <StyledTableCell>
                      <Link
                        to={"/editsitter/" + row.id}
                        className="btn btn-sm btn-warning"
                      >
                        <EditIcon fontSize="small" />
                        Edit
                      </Link>
                    </StyledTableCell>
                  </StyledTableRow>
                )) || (
                  <TableRow>
                    <TableCell align="center" colSpan={8} sx={{ py: 3 }}>
                      <Paper
                        sx={{
                          textAlign: "center",
                        }}
                      >
                        <Typography variant="h6" paragraph>
                          Not found
                        </Typography>

                        <Typography variant="body2">
                          No results found for &nbsp;
                          <strong>&quot;{searchAddress}&quot;</strong>.
                          <br /> Try checking for typos or using complete words.
                        </Typography>
                      </Paper>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          {/* <table className="table table-striped table-bordered table-hover" {...getTableProps()} >
            <thead>
              {headerGroups.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                      {column.render("Header")}
                      <span>
                        {column.isSorted ? (column.isSortedDesc ? '🔽':'🔼') : ''}
                      </span>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
                <tbody {...getTableBodyProps()}>
                { rows === '' ? (<tr><td>No Records Found!</td></tr>) :
                (rows.length > 0 && rows.map((row, i) => {      
                  prepareRow(row);
                  return (
                    <tr {...row.getRowProps()}>
                      {row.cells.map((cell) => {
                        return (
                          <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                        );
                      })}
                    </tr>
                  );
                }))
                }  
              </tbody> 
          </table> */}
        </div>
      )}
      <div className="float-right">
        Showing the first {users?.length} results of {totalItems} rows
      </div>
      <Typography>
        Page: {page} of {count}
      </Typography>
      <div
        style={{
          position: "absolute",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <Pagination
          count={count}
          page={page}
          siblingCount={1}
          boundaryCount={1}
          variant="outlined"
          color="secondary"
          onChange={handlePageChange}
          showFirstButton
          showLastButton
        />
      </div>
      {message && (
        <span
          className="alert alert-danger "
          role="alert"
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          {message}
        </span>
      )}
    </>
  );
};
export default MatrialUiTable;
