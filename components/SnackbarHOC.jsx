import React, { useState } from "react";
import Alert from "@material-ui/lab/Alert";
import { Snackbar, Backdrop, Slide } from "@material-ui/core";

export const withSnackbar = WrappedComponent => {
  return props => {
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState("I'm a custom snackbar");
    const [duration, setDuration] = useState(2000);
    const [severity, setSeverity] = useState(
      "success"
    ); /** error | warning | info */

    const showMessage = (message, severity = "success", duration = 2000) => {
      setMessage(message);
      setSeverity(severity);
      setDuration(duration);
      setOpen(true);
    };

    const handleClose = (event, reason) => {
      if (reason === "clickaway") {
        return;
      }
      setOpen(false);
    };

    if(process.browser)
      window.snackbar = showMessage

    return (
      <>
        <WrappedComponent {...props} snackbar={showMessage} />
        
        <Backdrop
          variant={ severity === 'error' ? "snackbar" : "snackbar-error"}
          onClick={handleClose}
          open={open}>
          <Snackbar
            anchorOrigin={{
              vertical: "top",
              horizontal: "right"
            }}
            autoHideDuration={duration}
            open={open}
            onClose={handleClose}
            TransitionComponent={Slide}
          >
            <Alert variant="filled" onClose={handleClose} severity={severity}>
              {message}
            </Alert>
          </Snackbar>
        </Backdrop>
      </>
    );
  };
};