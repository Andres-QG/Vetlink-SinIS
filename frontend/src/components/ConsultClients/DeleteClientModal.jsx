import React, { useState } from "react";
import {
  Modal,
  Box,
  Typography,
  Button,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import axios from "axios";

const DeleteClientModal = ({
  open,
  onClose,
  data,
  fetchData,
  showSnackbar,
}) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      // Llama a la API para eliminar el registro
      await axios.delete(
        `http://localhost:8000/api/delete-client/${data.usuario}/`
      );

      // Llama a fetchData para refrescar la lista y muestra el mensaje de éxito
      await fetchData();
      showSnackbar("Registro eliminado con éxito.", "success");

      onClose(); // Cierra el modal si la eliminación fue exitosa
    } catch (error) {
      console.error("Error al eliminar el registro:", error);
      showSnackbar("Error al eliminar el registro.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "90%", sm: "80%", md: 400 },
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: "10px",
        }}
      >
        <IconButton
          onClick={onClose}
          sx={{ position: "absolute", top: 8, right: 8 }}
        >
          <Close />
        </IconButton>

        <Typography
          id="modal-title"
          variant="h6"
          component="h2"
          sx={{
            textAlign: "center",
            marginBottom: "20px",
            fontWeight: "bold",
            color: "#333",
            borderBottom: "1px solid #ddd",
            paddingBottom: "10px",
          }}
        >
          Confirmar Eliminación
        </Typography>

        <Typography sx={{ mb: 3 }} textAlign="center">
          ¿Estás seguro de que deseas eliminar el registro{" "}
          <strong>{data.nombre}</strong>?
        </Typography>

        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
          <Button
            variant="outlined"
            onClick={onClose}
            disabled={loading}
            sx={{ color: "#00308F", borderColor: "#00308F" }}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={handleDelete}
            disabled={loading}
            startIcon={loading && <CircularProgress size={20} />}
            sx={{
              backgroundColor: "#FF0000",
              "&:hover": { backgroundColor: "#CC0000" },
            }}
          >
            {loading ? "Eliminando..." : "Eliminar"}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default DeleteClientModal;
