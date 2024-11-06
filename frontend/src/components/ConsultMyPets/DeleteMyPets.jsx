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

const DeleteMyPets = ({ open, handleClose, petData, onSuccess }) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      const response = await axios.delete(
        `http://localhost:8000/api/delete-my-pet/${petData.MASCOTA_ID}/`,
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        onSuccess("Mascota eliminada exitosamente", "success");
        handleClose();
      }
    } catch (error) {
      const errorMessage =
        error.response && error.response.data && error.response.data.error
          ? error.response.data.error
          : "Error al eliminar la mascota";
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
          Eliminar Mascota
        </Typography>
        <Typography variant="body1" sx={{ mb: 4 }}>
          ¿Estás seguro de que quieres eliminar a{" "}
          <strong>{petData.NOMBRE}</strong>? Esta acción es irreversible.
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
            startIcon={loading && <CircularProgress size={20} />}
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

DeleteMyPets.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  petData: PropTypes.object.isRequired,
  onSuccess: PropTypes.func.isRequired,
};

export default DeleteMyPets;
