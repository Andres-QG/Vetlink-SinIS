import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  CircularProgress,
  InputAdornment,
} from "@mui/material";
import { Close, Description, Title } from "@mui/icons-material";
import axios from "axios";

const validateName = (name) => {
  const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s0-9]+$/;
  return regex.test(name);
};

const AddModal = ({ open, handleClose, onAdd, addUrl, itemName }) => {
  const initialFormData = {
    nombre: "",
    descripcion: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};

    if (!formData.nombre) {
      newErrors.nombre = "El nombre es requerido.";
    } else if (!validateName(formData.nombre)) {
      newErrors.nombre =
        "El nombre solo puede contener letras, espacios, ñ, tildes y ü.";
    }

    if (!formData.descripcion) {
      newErrors.descripcion = "La descripción es requerida.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    try {
      await axios.post(addUrl, formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      onAdd(`${itemName} agregado exitosamente.`, "success");
      setFormData(initialFormData);
      handleClose();
    } catch (error) {
      const message =
        error.response?.data?.error || `Error al agregar el ${itemName}.`;
      onAdd(message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setFormData(initialFormData);
    setErrors({});
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "90%",
          maxWidth: 500,
          maxHeight: "90vh",
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
          overflowY: "auto",
        }}
      >
        <form onSubmit={handleSubmit}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Typography variant="h6">Agregar {itemName}</Typography>
            <IconButton onClick={handleClose}>
              <Close />
            </IconButton>
          </Box>

          <TextField
            label="Nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            error={!!errors.nombre}
            helperText={errors.nombre}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Title />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            label="Descripción"
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            fullWidth
            multiline
            rows={4}
            margin="normal"
            required
            error={!!errors.descripcion}
            helperText={errors.descripcion}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Description />
                </InputAdornment>
              ),
            }}
          />

          <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
            <Button
              variant="outlined"
              onClick={handleClear}
              fullWidth
              disabled={loading}
            >
              Limpiar
            </Button>
            <Button
              variant="contained"
              type="submit"
              fullWidth
              disabled={loading}
              startIcon={loading && <CircularProgress size={20} />}
            >
              {loading ? "Agregando..." : `Agregar ${itemName}`}
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

AddModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  onAdd: PropTypes.func.isRequired,
  addUrl: PropTypes.string.isRequired,
  itemName: PropTypes.string.isRequired,
};

export default AddModal;
