import React, { useState } from "react";
import {
  Button,
  Box,
  IconButton,
  Modal,
  Typography,
  CircularProgress,
  Stack,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import PropTypes from "prop-types";
import axios from "axios";

const DeletePaymentMethod = ({ open, handleClose, paymentData, onSuccess }) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      const response = await axios.delete(
        `http://localhost:8000/api/delete-payment-method/${paymentData.METODO_PAGO_ID}/`,
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        onSuccess("Método de pago eliminado exitosamente", "success");
        handleClose();
      }
    } catch (error) {
      const errorMessage =
        error.response && error.response.data && error.response.data.error
          ? error.response.data.error
          : "Error al eliminar el método de pago";
      onSuccess(errorMessage, "error");
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
          sx={{ position: "absolute", top: "8px", right: "8px" }}
        >
          <CloseIcon />
        </IconButton>
        <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
          Eliminar Método de Pago
        </Typography>
        <Typography variant="body1" sx={{ mb: 4 }}>
          ¿Estás seguro de que quieres eliminar el método de pago con titular{" "}
          <strong>{paymentData.NOMBRE_TITULAR}</strong>? Esta acción es
          irreversible.
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
            onClick={handleDelete}
            variant="contained"
            color="error"
            disabled={loading}
            startIcon={
              loading ? <CircularProgress size={20} role="progressbar" /> : null
            }
            sx={{
              backgroundColor: "#D32F2F",
              "&:hover": { backgroundColor: "#B71C1C" },
            }}
          >
            {loading ? "Eliminando..." : "Eliminar"}
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
};

DeletePaymentMethod.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  paymentData: PropTypes.object.isRequired,
  onSuccess: PropTypes.func.isRequired,
};

export default DeletePaymentMethod;
