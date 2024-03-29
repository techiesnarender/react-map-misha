import React, { useState, useEffect, useMemo } from "react";
import { useTable, useSortBy } from "react-table";
import Pagination from "@mui/material/Pagination";
import UserServices from "../../services/UserServices";
import {
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

const SitterListTestPagination = () => {
  const [users, setUsers] = useState([]);

  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [totalItems, setTotalItems] = useState("");
  const [pageSize, setPageSize] = useState(6);
  const [searchAddress, setSearchAddress] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const pageSizes = [6, 9];

  const onChangeSearchAddress = (e) => {
    const searchAddress = e.target.value;
    setSearchAddress(searchAddress);
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
    setLoading(true);
    const params = getRequestParams(searchAddress, page, pageSize);

    UserServices.getPaginationAll(params)
      .then((response) => {
        const { user, totalPages, totalItems } = response.data;
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

  const columns = useMemo(
    () => [
      {
        Header: "Contact Name",
        accessor: "contactname",
      },
      {
        Header: "Company Name",
        accessor: "company",
      },
      {
        Header: "Email",
        accessor: "email",
      },
      {
        Header: "Address",
        accessor: "address",
      },
      {
        Header: "Open Time",
        accessor: "open",
      },
      {
        Header: "Charges",
        accessor: "chargesperhour",
      },
    ],
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable(
      {
        columns,
        data: users,
      },
      useSortBy
    );

  return (
    <>
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
              aria-label="customized table"
              {...getTableProps()}
            >
              <TableHead>
                {headerGroups.map((headerGroup) => (
                  <TableRow {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map((column) => (
                      <StyledTableCell
                        {...column.getHeaderProps(
                          column.getSortByToggleProps()
                        )}
                      >
                        {column.render("Header")}
                        <span>
                          {column.isSorted
                            ? column.isSortedDesc
                              ? "🔽"
                              : "🔼"
                            : ""}
                        </span>
                      </StyledTableCell>
                    ))}
                  </TableRow>
                ))}
              </TableHead>
              <TableBody {...getTableBodyProps()}>
                {rows.map((row, i) => {
                  prepareRow(row);
                  return (
                    <StyledTableRow
                      {...row.getRowProps()}
                      key={row.id}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      {row.cells.map((cell) => {
                        return (
                          <StyledTableCell
                            {...cell.getCellProps()}
                            component="th"
                            scope="row"
                          >
                            {cell.render("Cell")}
                          </StyledTableCell>
                        );
                      })}
                    </StyledTableRow>
                  );
                })}
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
        Showing the first {users.length} results of {totalItems} rows
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
export default SitterListTestPagination;
