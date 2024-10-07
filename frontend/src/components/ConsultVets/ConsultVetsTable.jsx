import React, { useState } from "react";
import {
  Modal,
  Box,
  TextField,
  Button,
  CircularProgress,
  Typography,
} from "@mui/material";

const AddVetModal = ({ open, onClose, onSubmit }) => {
  const initialFormData = {
    usuario: "",
    cedula: "",
    correo: "",
    nombre: "",
    apellido1: "",
    apellido2: "",
    telefono: "",
    clave: "",
    especialidad: "",
    id_clinica: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({}); // Estado para los errores de validación

  // Función de validación de campos
  const validate = () => {
    const newErrors = {};
    if (!formData.usuario) newErrors.usuario = "Usuario es requerido";
    if (!formData.cedula) newErrors.cedula = "Cédula es requerida";
    if (!formData.correo) newErrors.correo = "Correo es requerido";
    if (!formData.nombre) newErrors.nombre = "Nombre es requerido";
    if (!formData.apellido1)
      newErrors.apellido1 = "Primer apellido es requerido";
    if (!formData.apellido2)
      newErrors.apellido2 = "Segundo apellido es requerido";
    if (!formData.telefono) newErrors.telefono = "Teléfono es requerido";
    if (!formData.clave) newErrors.clave = "Clave es requerida";
    if (!formData.especialidad)
      newErrors.especialidad = "Especialidad es requerida";
    if (!formData.id_clinica) newErrors.id_clinica = "ID Clínica es requerido";
    return newErrors;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      await onSubmit(formData);
      setFormData(initialFormData);
      onClose();
    } catch (error) {
      console.error("Error adding vet:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setFormData(initialFormData);
    setErrors({});
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          border: "2px solid #000",
          boxShadow: 24,
          p: 4,
        }}>
        <Typography variant="h6" component="h2">
          Agregar Veterinario
        </Typography>
        <form noValidate autoComplete="off">
          <TextField
            label="Usuario"
            name="usuario"
            value={formData.usuario}
            onChange={handleChange}
            error={!!errors.usuario}
            helperText={errors.usuario}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Cédula"
            name="cedula"
            value={formData.cedula}
            onChange={handleChange}
            error={!!errors.cedula}
            helperText={errors.cedula}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Correo"
            name="correo"
            value={formData.correo}
            onChange={handleChange}
            error={!!errors.correo}
            helperText={errors.correo}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            error={!!errors.nombre}
            helperText={errors.nombre}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Primer Apellido"
            name="apellido1"
            value={formData.apellido1}
            onChange={handleChange}
            error={!!errors.apellido1}
            helperText={errors.apellido1}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Segundo Apellido"
            name="apellido2"
            value={formData.apellido2}
            onChange={handleChange}
            error={!!errors.apellido2}
            helperText={errors.apellido2}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Teléfono"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
            error={!!errors.telefono}
            helperText={errors.telefono}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Clave"
            name="clave"
            type="password"
            value={formData.clave}
            onChange={handleChange}
            error={!!errors.clave}
            helperText={errors.clave}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Especialidad"
            name="especialidad"
            value={formData.especialidad}
            onChange={handleChange}
            error={!!errors.especialidad}
            helperText={errors.especialidad}
            fullWidth
            margin="normal"
          />
          <TextField
            label="ID Clínica"
            name="id_clinica"
            value={formData.id_clinica}
            onChange={handleChange}
            error={!!errors.id_clinica}
            helperText={errors.id_clinica}
            fullWidth
            margin="normal"
          />
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
            <Button onClick={handleClear} color="secondary">
              Limpiar
            </Button>
            <Button
              onClick={handleSubmit}
              color="primary"
              variant="contained"
              disabled={loading}>
              {loading ? <CircularProgress size={24} /> : "Agregar"}
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

export default AddVetModal;
