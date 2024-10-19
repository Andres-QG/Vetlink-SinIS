import { createContext, useContext, useState, useCallback } from "react";
import PropTypes from "prop-types";
import { Snackbar, Alert } from "@mui/material";

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

  return (
    <NotificationContext.Provider value={showNotification}>
      {children}
      <Snackbar
        open={notification.open}
        autoHideDuration={3000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "left" }}
      >
        <Alert
          onClose={handleClose}
          severity={notification.type}
          variant="filled"
        >
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
