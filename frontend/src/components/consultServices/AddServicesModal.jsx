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
import {
  Close,
  Description,
  Numbers,
  Timer,
  AttachMoney,
  Title,
  Image,
} from "@mui/icons-material";
import axios from "axios";

const formatServiceNameForImage = (nombre) => {
  return nombre
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ñ/g, "n")
    .replace(/ü/g, "u")
    .replace(/[^a-z0-9 ]/g, "")
    .replace(/\s+/g, "_");
};

const validateServiceName = (nombre) => {
  const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/;
  return regex.test(nombre);
};

const AddServicesModal = ({ open, handleClose, onSuccess }) => {
  const initialFormData = {
    nombre: "",
    descripcion: "",
    numero_sesiones: "",
    minutos_sesion: "",
    costo: "",
    imagen: null,
  };

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};

    if (!formData.nombre) {
      newErrors.nombre = "El nombre es requerido.";
    } else if (!validateServiceName(formData.nombre)) {
      newErrors.nombre =
        "El nombre solo puede contener letras, espacios, ñ, tildes y ü.";
    }

    if (!formData.descripcion) {
      newErrors.descripcion = "La descripción es requerida.";
    }

    if (!formData.numero_sesiones || parseInt(formData.numero_sesiones) <= 0) {
      newErrors.numero_sesiones =
        "El número de sesiones debe ser un número positivo.";
    }

    if (!formData.minutos_sesion || parseInt(formData.minutos_sesion) <= 0) {
      newErrors.minutos_sesion =
        "Los minutos por sesión deben ser un número positivo.";
    }

    if (!formData.costo || parseFloat(formData.costo) <= 0) {
      newErrors.costo = "El costo debe ser un número positivo.";
    }

    if (!formData.imagen) {
      newErrors.imagen = "Debe seleccionar una imagen.";
    } else if (formData.imagen.type !== "image/jpeg") {
      newErrors.imagen = "La imagen debe ser un archivo .jpg";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "imagen") {
      if (files && files[0]) {
        if (files[0].type !== "image/jpeg") {
          setErrors({
            ...errors,
            imagen: "La imagen debe ser un archivo .jpg",
          });
          return;
        }
        setFormData({ ...formData, imagen: files[0] });
        setErrors({ ...errors, imagen: "" });
      }
    } else if (name === "nombre") {
      if (validateServiceName(value)) {
        setFormData({ ...formData, nombre: value });
        setErrors({ ...errors, nombre: "" });
      } else {
        setFormData({ ...formData, nombre: value });
        setErrors({
          ...errors,
          nombre:
            "El nombre solo puede contener letras, espacios, ñ, tildes y ü.",
        });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    try {
      const formattedNameForImage = formatServiceNameForImage(formData.nombre);
      const imagePath = `./src/assets/img/Services_${formattedNameForImage}.jpg`;

      // Guardar la imagen físicamente
      const reader = new FileReader();
      reader.readAsDataURL(formData.imagen);
      reader.onload = async () => {
        try {
          // Crear objeto con los datos del servicio
          const serviceData = {
            nombre: formData.nombre,
            descripcion: formData.descripcion,
            numero_sesiones: parseInt(formData.numero_sesiones),
            minutos_sesion: parseInt(formData.minutos_sesion),
            costo: parseFloat(formData.costo),
            dir_imagen: imagePath,
          };

          // Enviar datos al backend
          await axios.post(
            "http://localhost:8000/api/add-service/",
            serviceData
          );

          onSuccess("Servicio agregado exitosamente.", "success");
          setFormData(initialFormData);
          handleClose();
        } catch (error) {
          const message =
            error.response?.data?.error || "Error al agregar el servicio.";
          onSuccess(message, "error");
        }
      };
    } catch (error) {
      onSuccess("Error al procesar la imagen.", "error");
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
        }}>
        <form onSubmit={handleSubmit}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}>
            <Typography variant="h6">Agregar Servicio</Typography>
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

          <TextField
            label="Número de Sesiones"
            name="numero_sesiones"
            value={formData.numero_sesiones}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            error={!!errors.numero_sesiones}
            helperText={errors.numero_sesiones}
            type="number"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Numbers />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            label="Minutos por Sesión"
            name="minutos_sesion"
            value={formData.minutos_sesion}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            error={!!errors.minutos_sesion}
            helperText={errors.minutos_sesion}
            type="number"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Timer />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            label="Costo"
            name="costo"
            value={formData.costo}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            error={!!errors.costo}
            helperText={errors.costo}
            type="number"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AttachMoney />
                </InputAdornment>
              ),
            }}
          />

          <Button
            variant="contained"
            component="label"
            fullWidth
            sx={{ mt: 2, mb: 1 }}
            startIcon={<Image />}>
            {formData.imagen
              ? "Imagen seleccionada"
              : "Seleccionar imagen (.jpg)"}
            <input
              type="file"
              accept=".jpg"
              name="imagen"
              hidden
              onChange={handleChange}
            />
          </Button>

          {errors.imagen && (
            <Typography
              color="error"
              variant="caption"
              display="block"
              sx={{ mb: 2 }}>
              {errors.imagen}
            </Typography>
          )}

          <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
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
              {loading ? "Guardando..." : "Agregar Servicio"}
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

AddServicesModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
};

export default AddServicesModal;
