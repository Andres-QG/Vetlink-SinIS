import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  Modal,
  Box,
  Typography,
  Button,
  IconButton,
  CircularProgress,
  Stack,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import axios from "axios";

const DeactivateModal = ({
  open,
  handleClose,
  itemName,
  selectedItem,
  isRestorable,
  deletionUrl,
  onDelete,
}) => {
  const [loading, setLoading] = useState(false);

  const handleDeactivate = async () => {
    setLoading(true);
    try {
      if (!isRestorable) {
        await axios.delete(`${deletionUrl}${selectedItem.id}/`, {
          headers: {
            "Content-Type": "application/json",
          },
        });
      } else {
        await axios.put(`${deletionUrl}${selectedItem.id}/`, {
          headers: {
            "Content-Type": "application/json",
          },
        });
      }
      handleClose();
      onDelete(`${itemName} modificado exitosamente.`, "success");
    } catch (error) {
      console.error("Error al desactivar/eliminar el item:", error);
      onDelete(`No se pudo desactivar/eliminar ${itemName}.`, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          p: { xs: 2, sm: 3 },
          borderRadius: 2,
          boxShadow: 3,
          bgcolor: "#fff",
          width: "90%",
          maxWidth: "400px",
          textAlign: "center",
        }}
      >
        <IconButton
          onClick={handleClose}
          sx={{
            position: "absolute",
            top: "4px",
            right: "8px",
          }}
        >
          <CloseIcon />
        </IconButton>
        <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
          {`¿Estás seguro de que deseas ${
            isRestorable ? "desactivar" : "eliminar"
          } ${selectedItem.nombre}?`}
        </Typography>
        <Typography variant="body1" sx={{ mb: 4 }}>
          Esta acción{" "}
          {isRestorable
            ? "se puede deshacer activándola nuevamente."
            : "es irreversible."}
        </Typography>
        <Stack direction="row" spacing={2} sx={{ justifyContent: "center" }}>
          <Button
            onClick={handleClose}
            variant="outlined"
            sx={{ borderColor: "#00308F", color: "#00308F" }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleDeactivate}
            variant="contained"
            color="error"
            disabled={loading}
            startIcon={loading && <CircularProgress size={20} />}
            sx={{
              backgroundColor: "#D32F2F",
              "&:hover": { backgroundColor: "#B71C1C" },
            }}
          >
            {loading
              ? "Procesando..."
              : isRestorable
                ? "Desactivar"
                : "Eliminar"}
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
};

DeactivateModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  itemName: PropTypes.string.isRequired,
  selectedItem: PropTypes.object.isRequired,
  isRestorable: PropTypes.bool,
  deletionUrl: PropTypes.string.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default DeactivateModal;
