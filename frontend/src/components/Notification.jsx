import React, { createContext, useContext, useState, useCallback } from "react";
import PropTypes from "prop-types";
import { Snackbar, Alert, AlertTitle } from "@mui/material";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    type: "success", // success | error | info | warning
  });

  const showNotification = useCallback((message, type = "success") => {
    setNotification({ open: true, message, type });
  }, []);

  const handleClose = () => {
    setNotification({ open: false });
  };

  const getTitle = (type) => {
    switch (type) {
      case "success":
        return "Éxito";
      case "error":
        return "Error";
      case "warning":
        return "Precaución";
      case "info":
        return "Información";
      default:
        return "";
    }
  };

  return (
    <NotificationContext.Provider value={showNotification}>
      {children}
      <Snackbar
        open={notification.open}
        autoHideDuration={3000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        sx={{
          "& .MuiSnackbarContent-root": {
            fontSize: "1.25rem",
          },
        }}
      >
        <Alert
          onClose={handleClose}
          severity={notification.type}
          sx={{
            fontSize: "1.25rem",
            "& .MuiAlertTitle-root": {
              fontSize: "1.75rem",
              fontWeight: "bold",
            },
          }}
        >
          <AlertTitle>{getTitle(notification.type)}</AlertTitle>
          {notification.message}
        </Alert>
      </Snackbar>
    </NotificationContext.Provider>
  );
};

NotificationProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// Function for showing notifications
export const useNotification = () => useContext(NotificationContext);
