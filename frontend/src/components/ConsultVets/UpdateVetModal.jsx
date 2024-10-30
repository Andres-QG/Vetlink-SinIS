import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
} from "@mui/material";

const UpdateVetModal = ({
  open,
  onClose,
  onSubmit,
  clinics,
  specialties,
  vetData,
}) => {
  const initialFormData = {
    usuario: vetData?.usuario || "",
    cedula: vetData?.cedula || "",
    correo: vetData?.correo || "",
    nombre: vetData?.nombre || "",
    apellido1: vetData?.apellido1 || "",
    apellido2: vetData?.apellido2 || "",
    telefono: vetData?.telefono || "",
    clave: vetData?.clave || "",
    clinica: vetData?.clinica || "",
    especialidad: vetData?.especialidad || "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (vetData) {
      setFormData({
        usuario: vetData.usuario || "",
        cedula: vetData.cedula || "",
        correo: vetData.correo || "",
        nombre: vetData.nombre || "",
        apellido1: vetData.apellido1 || "",
        apellido2: vetData.apellido2 || "",
        telefono: vetData.telefono || "",
        clave: vetData.clave || "",
        clinica: vetData.clinica || "",
        especialidad: vetData.especialidad || "",
      });
    }
  }, [vetData]);

  const validate = () => {
    const newErrors = {};
    if (!formData.usuario) newErrors.usuario = "Usuario es requerido";
    if (!formData.cedula) newErrors.cedula = "Cédula es requerida";
    if (!formData.correo) newErrors.correo = "Correo es requerido";
    if (!formData.nombre) newErrors.nombre = "Nombre es requerido";
    if (!formData.apellido1) newErrors.apellido1 = "Apellido 1 es requerido";
    if (!formData.telefono) newErrors.telefono = "Teléfono es requerido";
    if (!formData.clave) newErrors.clave = "Clave es requerida";
    if (!formData.clinica) newErrors.clinica = "Clínica es requerida";
    if (!formData.especialidad)
      newErrors.especialidad = "Especialidad es requerida";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    if (validate()) {
      setLoading(true);
      await onSubmit(formData);
      setLoading(false);
    }
  };

  const handleClear = () => {
    setFormData(initialFormData);
    setErrors({});
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ ...modalStyle }}>
        <Typography variant="h6" component="h2">
          Actualizar Veterinario
        </Typography>
        <TextField
          label="Usuario *"
          name="usuario"
          value={formData.usuario}
          onChange={handleChange}
          fullWidth
          margin="normal"
          error={!!errors.usuario}
          helperText={errors.usuario}
        />
        <TextField
          label="Cédula *"
          name="cedula"
          value={formData.cedula}
          onChange={handleChange}
          fullWidth
          margin="normal"
          error={!!errors.cedula}
          helperText={errors.cedula}
        />
        <TextField
          label="Correo *"
          name="correo"
          value={formData.correo}
          onChange={handleChange}
          fullWidth
          margin="normal"
          error={!!errors.correo}
          helperText={errors.correo}
        />
        <TextField
          label="Nombre *"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          fullWidth
          margin="normal"
          error={!!errors.nombre}
          helperText={errors.nombre}
        />
        <TextField
          label="Apellido 1 *"
          name="apellido1"
          value={formData.apellido1}
          onChange={handleChange}
          fullWidth
          margin="normal"
          error={!!errors.apellido1}
          helperText={errors.apellido1}
        />
        <TextField
          label="Apellido 2"
          name="apellido2"
          value={formData.apellido2}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Teléfono *"
          name="telefono"
          value={formData.telefono}
          onChange={handleChange}
          fullWidth
          margin="normal"
          error={!!errors.telefono}
          helperText={errors.telefono}
        />
        <TextField
          label="Clave *"
          name="clave"
          type="password"
          value={formData.clave}
          onChange={handleChange}
          fullWidth
          margin="normal"
          error={!!errors.clave}
          helperText={errors.clave}
        />
        <TextField
          select
          label="Clínica *"
          name="clinica"
          value={formData.clinica}
          onChange={handleChange}
          fullWidth
          margin="normal"
          error={!!errors.clinica}
          helperText={errors.clinica}>
          {clinics.map((clinic) => (
            <MenuItem key={clinic.clinica_id} value={clinic.clinica_id}>
              {clinic.nombre}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label="Especialidad *"
          name="especialidad"
          value={formData.especialidad}
          onChange={handleChange}
          fullWidth
          margin="normal"
          error={!!errors.especialidad}
          helperText={errors.especialidad}>
          {specialties.map((specialty) => (
            <MenuItem
              key={specialty.especialidad_id}
              value={specialty.especialidad_id}>
              {specialty.nombre}
            </MenuItem>
          ))}
        </TextField>
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
          <Button onClick={handleClear} color="secondary">
            Limpiar
          </Button>
          <Button onClick={handleSubmit} color="primary" disabled={loading}>
            {loading ? "Guardando..." : "Guardar"}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  maxWidth: 600,
  maxHeight: "90vh",
  overflowY: "auto",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

export default UpdateVetModal;
