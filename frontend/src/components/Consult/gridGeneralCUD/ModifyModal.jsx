// EditModal.jsx

import React, { useState, useEffect } from "react";
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

const ModifyModal = ({
  open,
  handleClose,
  onMod,
  itemName,
  selectedItem,
  modificationUrl,
}) => {
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [isModified, setIsModified] = useState(false);

  useEffect(() => {
    if (selectedItem) {
      setFormData({
        nombre: selectedItem.nombre || "",
        descripcion: selectedItem.descripcion || "",
      });
    }
  }, [selectedItem]);

  const validate = () => {
    const newErrors = {};

    if (!formData.nombre) {
      newErrors.nombre = "El nombre es requerido.";
    } else if (!validateName(formData.nombre)) {
      newErrors.nombre =
        "El nombre solo puede contener letras, espacios, ñ, tildes y ü.";
    } else if (formData.nombre.length < 3 || formData.nombre.length > 49) {
      newErrors.nombre = "El nombre debe tener entre 3 y 49 caracteres.";
    }

    if (!formData.descripcion) {
      newErrors.descripcion = "La descripción es requerida.";
    } else if (
      formData.descripcion.length < 10 ||
      formData.descripcion.length > 251
    ) {
      newErrors.descripcion =
        "La descripción debe tener entre 10 y 250 caracteres.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setIsModified(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    try {
      await axios.put(`${modificationUrl}${selectedItem.id}/`, formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      onMod(`${itemName} modificado exitosamente.`, "success");
      handleClose();
    } catch (error) {
      const message =
        error.response?.data?.error || `Error al modificar el ${itemName}.`;
      onMod(message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setFormData({
      nombre: "",
      descripcion: "",
    });
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
            <Typography variant="h6">Modificar {itemName}</Typography>
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
              sx={{
                borderColor: "#00308F",
                color: "#00308F",
              }}
            >
              Limpiar
            </Button>
            <Button
              variant="contained"
              type="submit"
              fullWidth
              disabled={loading || !isModified}
              startIcon={loading && <CircularProgress size={20} />}
              sx={{
                backgroundColor: "#00308F",
                "&:hover": {
                  backgroundColor: "#00246d",
                },
              }}
            >
              {loading ? "Modificando..." : `Modificar ${itemName}`}
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

ModifyModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  onMod: PropTypes.func.isRequired,
  itemName: PropTypes.string.isRequired,
  selectedItem: PropTypes.object.isRequired,
  modificationUrl: PropTypes.string.isRequired,
};

export default ModifyModal;
