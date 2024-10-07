import React, { useState } from "react";
import { Modal, Box, TextField, Button, MenuItem } from "@mui/material";

const AddVetModal = ({ open, onClose, onSubmit, clinics, specialties }) => {
  const initialFormData = {
    usuario: "",
    cedula: "",
    correo: "",
    nombre: "",
    apellido1: "",
    apellido2: "",
    telefono: "",
    clave: "",
    clinica: "",
    especialidad: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    // Validación de campos
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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
        <h2>Agregar Veterinario</h2>
        <TextField
          label="Usuario"
          name="usuario"
          value={formData.usuario}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Cédula"
          name="cedula"
          value={formData.cedula}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Correo"
          name="correo"
          value={formData.correo}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Nombre"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Apellido 1"
          name="apellido1"
          value={formData.apellido1}
          onChange={handleChange}
          fullWidth
          margin="normal"
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
          label="Teléfono"
          name="telefono"
          value={formData.telefono}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Clave"
          name="clave"
          type="password"
          value={formData.clave}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          select
          label="Clínica"
          name="clinica"
          value={formData.clinica}
          onChange={handleChange}
          fullWidth
          margin="normal">
          {clinics.map((clinic) => (
            <MenuItem key={clinic.clinica_id} value={clinic.clinica_id}>
              {clinic.nombre}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label="Especialidad"
          name="especialidad"
          value={formData.especialidad}
          onChange={handleChange}
          fullWidth
          margin="normal">
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
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

export default AddVetModal;
