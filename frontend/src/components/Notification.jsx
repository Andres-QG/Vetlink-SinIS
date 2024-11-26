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
        autoHideDuration={4000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        sx={{
          "& .MuiSnackbarContent-root": {
            fontSize: "1rem", // Ajuste del tamaño del texto
            backgroundColor:
              notification.type === "success" ? "#4caf50" : undefined,
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
            borderRadius: "8px",
            padding: "10px",
          },
        }}
      >
        <Alert
          onClose={handleClose}
          severity={notification.type}
          sx={{
            fontSize: "1rem",
            fontWeight: "bold",
            "& .MuiAlertTitle-root": {
              fontSize: "1.25rem",
              fontWeight: "bold",
            },
            backgroundColor:
              notification.type === "success"
                ? "#e8f5e9"
                : notification.type === "error"
                  ? "#ffebee"
                  : notification.type === "warning"
                    ? "#fff3e0"
                    : "#e3f2fd",
            color:
              notification.type === "success"
                ? "#388e3c"
                : notification.type === "error"
                  ? "#d32f2f"
                  : notification.type === "warning"
                    ? "#f57c00"
                    : "#1976d2",
            border: "1px solid rgba(0, 0, 0, 0.1)",
            boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.2)",
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

export const useNotification = () => useContext(NotificationContext);
