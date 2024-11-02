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
} from "@mui/material";
import { Close } from "@mui/icons-material";
import axios from "axios";

// Función para formatear el nombre solo para el archivo de imagen
const formatServiceNameForImage = (nombre) => {
  // Convertir a minúsculas, reemplazar ñ, eliminar acentos y caracteres especiales
  let formattedName = nombre
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Eliminar acentos
    .replace(/ñ/g, "n")
    .replace(/[^a-z0-9 ]/g, "") // Eliminar caracteres especiales
    .replace(/\s+/g, "_"); // Reemplazar espacios por guiones bajos

  return formattedName;
};

const ModifyServicesModal = ({
  open,
  handleClose,
  onSuccess,
  selectedItem,
}) => {
  const initialFormData = {
    nombre: selectedItem?.nombre || "",
    descripcion: selectedItem?.descripcion || "",
    numero_sesiones: selectedItem?.numero_sesiones || "",
    minutos_sesion: selectedItem?.minutos_sesion || "",
    costo: selectedItem?.costo || "",
    imagen: null, // Nueva imagen a subir
  };

  const [formData, setFormData] = useState(initialFormData);
  const [originalData, setOriginalData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const updatedFormData = {
      nombre: selectedItem?.nombre || "",
      descripcion: selectedItem?.descripcion || "",
      numero_sesiones: selectedItem?.numero_sesiones || "",
      minutos_sesion: selectedItem?.minutos_sesion || "",
      costo: selectedItem?.costo || "",
      imagen: null,
    };
    setFormData(updatedFormData);
    setOriginalData(updatedFormData);
    setErrors({});
  }, [selectedItem]);

  const validate = () => {
    const newErrors = {};
    if (!formData.nombre) newErrors.nombre = "El nombre es requerido.";
    if (!formData.descripcion)
      newErrors.descripcion = "La descripción es requerida.";
    if (!formData.numero_sesiones || isNaN(formData.numero_sesiones))
      newErrors.numero_sesiones = "El número de sesiones debe ser un número.";
    if (!formData.minutos_sesion || isNaN(formData.minutos_sesion))
      newErrors.minutos_sesion = "Los minutos por sesión deben ser un número.";
    if (!formData.costo || isNaN(formData.costo))
      newErrors.costo = "El costo debe ser un número.";

    // Validación de la imagen (opcional, solo si se selecciona una nueva imagen)
    if (formData.imagen && formData.imagen.type !== "image/jpeg") {
      newErrors.imagen = "La imagen debe ser un archivo .jpg.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    if (e.target.name === "imagen") {
      setFormData({ ...formData, imagen: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    try {
      // Formatear el nombre solo para el archivo de imagen
      const formattedNameForImage = formatServiceNameForImage(formData.nombre);

      // Crear FormData para enviar los datos incluyendo el archivo si se seleccionó
      const data = new FormData();
      data.append("nombre", formData.nombre); // Usar el nombre tal cual para el servicio
      data.append("descripcion", formData.descripcion);
      data.append("numero_sesiones", formData.numero_sesiones);
      data.append("minutos_sesion", formData.minutos_sesion);
      data.append("costo", formData.costo);

      if (formData.imagen) {
        data.append(
          "imagen",
          formData.imagen,
          `Services_${formattedNameForImage}.jpg`
        );
      }

      await axios.put(
        `http://localhost:8000/api/update-service/${selectedItem.servicio_id}/`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      onSuccess("Servicio modificado exitosamente.", "success");
      handleClose(); // Cierra el modal al modificar correctamente
    } catch (error) {
      const backendError = error.response?.data?.error;
      const message =
        backendError === "Ya existe un servicio con ese nombre."
          ? backendError
          : "Error al modificar el servicio.";
      onSuccess(message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setFormData(originalData);
    setErrors({});
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          p: 3,
          borderRadius: 2,
          boxShadow: 3,
          bgcolor: "#fff",
          width: "100%",
          maxWidth: "500px",
          maxHeight: "90vh",
          overflowY: "auto",
          mx: "auto",
          mt: "5%",
        }}>
        <form onSubmit={handleSubmit}>
          {/* Cabecera con botón de cierre */}
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}>
            <Typography variant="h6" component="h2">
              Modificar Servicio
            </Typography>
            <IconButton onClick={handleClose}>
              <Close />
            </IconButton>
          </Box>

          {/* Campos del formulario */}
          <TextField
            label="Nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            fullWidth
            sx={{ mb: 2 }}
            required
            error={!!errors.nombre}
            helperText={errors.nombre}
          />
          <TextField
            label="Descripción"
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            fullWidth
            multiline
            rows={4}
            sx={{ mb: 2 }}
            required
            error={!!errors.descripcion}
            helperText={errors.descripcion}
          />
          <TextField
            label="Número de Sesiones"
            name="numero_sesiones"
            value={formData.numero_sesiones}
            onChange={handleChange}
            fullWidth
            sx={{ mb: 2 }}
            required
            error={!!errors.numero_sesiones}
            helperText={errors.numero_sesiones}
          />
          <TextField
            label="Minutos por Sesión"
            name="minutos_sesion"
            value={formData.minutos_sesion}
            onChange={handleChange}
            fullWidth
            sx={{ mb: 2 }}
            required
            error={!!errors.minutos_sesion}
            helperText={errors.minutos_sesion}
          />
          <TextField
            label="Costo"
            name="costo"
            value={formData.costo}
            onChange={handleChange}
            fullWidth
            sx={{ mb: 2 }}
            required
            error={!!errors.costo}
            helperText={errors.costo}
          />

          {/* Campo para subir la imagen */}
          <Button
            variant="contained"
            component="label"
            fullWidth
            sx={{ mb: 2 }}>
            {formData.imagen
              ? "Imagen seleccionada"
              : "Seleccionar Imagen (.jpg)"}
            <input
              type="file"
              accept=".jpg"
              name="imagen"
              hidden
              onChange={handleChange}
            />
          </Button>
          {errors.imagen && (
            <Typography variant="caption" color="error" sx={{ mb: 2 }}>
              {errors.imagen}
            </Typography>
          )}

          {/* Botones del formulario */}
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="outlined"
              onClick={handleClear}
              fullWidth
              disabled={loading}>
              Limpiar
            </Button>
            <Button
              variant="contained"
              type="submit"
              fullWidth
              disabled={loading}
              startIcon={loading && <CircularProgress size={20} />}>
              {loading ? "Guardando..." : "Modificar Servicio"}
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

ModifyServicesModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
  selectedItem: PropTypes.object.isRequired,
};

export default ModifyServicesModal;
