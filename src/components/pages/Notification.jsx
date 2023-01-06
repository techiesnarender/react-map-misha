import React from "react";
import { Snackbar } from "@mui/material";
import MuiAlert from "@mui/material/Alert";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function Notification({
  messageColor,
  message,
  isOpen,
  onClose,
}) 
{
  console.log("Notification Called");
  return (
    <Snackbar
      key={Math.random()}
      open={isOpen}
      onClose={onClose}
      autoHideDuration={4000}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
    >
      <Alert onClose={onClose} severity={messageColor} sx={{ width: "100%" }}>
        {message}
      </Alert>
    </Snackbar>
  );
}
