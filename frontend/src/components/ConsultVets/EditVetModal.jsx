import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
} from "@mui/material";
import axios from "axios";

const EditVetModal = ({
  open,
  onClose,
  vet,
  clinics,
  specialties,
  fetchVets,
}) => {
  const [formData, setFormData] = useState({
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
  });

  useEffect(() => {
    if (vet) {
      setFormData({
        usuario: vet.usuario,
        cedula: vet.cedula,
        correo: vet.correo,
        nombre: vet.nombre,
        apellido1: vet.apellido1,
        apellido2: vet.apellido2,
        telefono: vet.telefono,
        clave: "",
        clinica: vet.clinica ? vet.clinica.id : "",
        especialidad: vet.especialidad ? vet.especialidad.id : "",
      });
    }
  }, [vet]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    try {
      await axios.put(
        `http://localhost:8000/api/update-vet/${formData.usuario}/`,
        formData
      );
      fetchVets();
      onClose();
    } catch (error) {
      console.error("Failed to update vet:", error);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ ...modalStyle }}>
        <Typography variant="h6" component="h2">
          Editar Veterinario
        </Typography>
        <TextField
          label="Usuario"
          name="usuario"
          value={formData.usuario}
          onChange={handleChange}
          fullWidth
          margin="normal"
          disabled
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
            <MenuItem key={clinic.id} value={clinic.id}>
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
            <MenuItem key={specialty.id} value={specialty.id}>
              {specialty.nombre}
            </MenuItem>
          ))}
        </TextField>
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
          <Button onClick={onClose} color="secondary">
            Cancelar
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Guardar
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

export default EditVetModal;
