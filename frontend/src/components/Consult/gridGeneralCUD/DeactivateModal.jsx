import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
} from "@mui/material";

const DeactivateModal = ({
  open,
  onClose,
  onConfirm,
  selectedItem,
  itemDisplayName,
  loading,
  isReactivate,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { borderRadius: "8px" },
      }}
    >
      <DialogTitle>
        {isReactivate ? "Reactivar" : "Desactivar"} {itemDisplayName}
      </DialogTitle>
      <DialogContent>
        ¿Está seguro que desea {isReactivate ? "reactivar" : "desactivar"}{" "}
        {selectedItem?.nombre}?
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} sx={{ textTransform: "none" }}>
          Cancelar
        </Button>
        <Button
          onClick={onConfirm}
          color={isReactivate ? "primary" : "error"}
          sx={{ textTransform: "none" }}
          disabled={loading}
        >
          {loading ? (
            <CircularProgress size={24} />
          ) : isReactivate ? (
            "Reactivar"
          ) : (
            "Desactivar"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeactivateModal;
