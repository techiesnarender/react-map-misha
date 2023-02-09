import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import {
  GridRowModes,
  GridToolbarContainer,
  GridActionsCellItem,
} from "@mui/x-data-grid-pro";
import UserServices from "../../services/UserServices";
import { DataGrid } from "@mui/x-data-grid";

function EditToolbar(props) {
  console.log(props);
  const { setdata, setRowModesModel } = props;

  const handleClick = () => {
    const id = props.params.id;
    setdata((oldRows) => [...oldRows, { id, name: "", age: "", isNew: true }]);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: "name" },
    }));
  };

  return (
    <GridToolbarContainer>
      <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
        Add record
      </Button>
    </GridToolbarContainer>
  );
}

EditToolbar.propTypes = {
  setRowModesModel: PropTypes.func.isRequired,
  setdata: PropTypes.func.isRequired,
};

export default function TestEditDataTable() {
  const [data, setdata] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchAddress, setSearchAddress] = useState("");

  //  const onChangeSearchAddress = (e) => {
  //   const searchAddress = e.target.value;
  //   setSearchAddress(searchAddress);
  //   setPage(1);
  // };

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

  const handlePageSizeChange = (event) => {
    setPageSize(event);
    setPage(1);
  };

  const retrieveTutorials = () => {
    const params = getRequestParams(searchAddress, page, pageSize);

    UserServices.getPaginationWithAddrAndCompany(params)
      .then((response) => {
        const { user } = response.data;
        if (user === 0 || user === undefined) {
          setdata(0);
        } else {
          setdata(user);
        }
        console.log(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  // eslint-disable-next-line
  useEffect(retrieveTutorials, [page, pageSize]);

  // const [rows, setRows] = React.useState(data);
  const [rowModesModel, setRowModesModel] = React.useState({});

  const handleRowEditStart = (params, event) => {
    event.defaultMuiPrevented = true;
  };

  const handleRowEditStop = (params, event) => {
    event.defaultMuiPrevented = true;
  };

  const handleEditClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id) => () => {
    //setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
    UserServices.update(id, { ...rowModesModel })
      .then((response) => {
        setRowModesModel({
          ...rowModesModel,
          [id]: { mode: GridRowModes.View },
        });
        console.log(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const handleDeleteClick = (id) => () => {
    fetch(`https://tomcat1.shiftescape.com/api/users/delete/${id}`, {
      method: "POST",
    }).then((response) => {
      setdata(data.filter((row) => row.id !== id));
      console.log(response);
    });
  };

  const handleCancelClick = (id) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = data.find((row) => row.id === id);
    if (editedRow.isNew) {
      setdata(data.filter((row) => row.id !== id));
    }
  };

  const processRowUpdate = (newRow) => {
    const updatedRow = { ...newRow, isNew: false };
    setdata(data.map((row) => (row.id === newRow.id ? updatedRow : row)));
    return updatedRow;
  };

  const columns = [
    { field: "id", headerName: "Id", width: 180, editable: true },
    { field: "contactname", headerName: "Name", width: 180, editable: true },
    { field: "company", headerName: "Company", width: 250, editable: true },
    {
      field: "email",
      headerName: "Email",
      width: 250,
      editable: true,
    },
    {
      field: "address",
      headerName: "Address",
      width: 300,
      editable: true,
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 100,
      cellClassName: "actions",
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
        ];
      },
    },
  ];

  return (
    <Box
      sx={{
        height: 500,
        width: "100%",
        "& .actions": {
          color: "text.secondary",
        },
        "& .textPrimary": {
          color: "text.primary",
        },
      }}
    >
      <DataGrid
        rows={data}
        columns={columns}
        editMode="row"
        rowModesModel={rowModesModel}
        onRowModesModelChange={(newModel) => setRowModesModel(newModel)}
        onRowEditStart={handleRowEditStart}
        onRowEditStop={handleRowEditStop}
        processRowUpdate={processRowUpdate}
        components={{
          Toolbar: EditToolbar,
        }}
        componentsProps={{
          toolbar: { setdata, setRowModesModel },
        }}
        experimentalFeatures={{ newEditingApi: true }}
      />
    </Box>
  );
}
