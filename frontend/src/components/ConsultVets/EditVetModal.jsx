import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  MenuItem,
  Button,
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
  const [originalData, setOriginalData] = useState(initialFormData);

  useEffect(() => {
    if (vet) {
      const vetData = {
        usuario: vet.usuario,
        cedula: vet.cedula,
        correo: vet.correo,
        nombre: vet.nombre,
        apellido1: vet.apellido1,
        apellido2: vet.apellido2,
        telefono: vet.telefono,
        clave: "",
        clinica: vet.clinica,
        especialidad: vet.especialidad,
      };
      setFormData(vetData);
      setOriginalData(vetData);
    }
  }, [vet]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    const updatedData = {};

    // Only update fields that have changed
    Object.keys(formData).forEach((key) => {
      if (formData[key] !== originalData[key]) {
        updatedData[key] = formData[key];
      }
    });

    // Ensure all required fields are included
    const requiredFields = [
      "usuario",
      "cedula",
      "correo",
      "nombre",
      "apellido1",
    ];
    requiredFields.forEach((field) => {
      if (!updatedData[field]) {
        updatedData[field] = originalData[field];
      }
    });

    // Handle clave and especialidad separately
    if (!updatedData.clave) {
      updatedData.clave = originalData.clave;
    }
    if (!updatedData.especialidad) {
      updatedData.especialidad = originalData.especialidad;
    }

    try {
      await axios.put(
        `http://localhost:8000/api/update-vet/${formData.usuario}/`,
        updatedData
      );
      setSnackbarMessage("Veterinario agregado exitosamente.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      fetchVets();
      onClose();
    } catch (error) {
      console.error(
        "Failed to update vet:",
        error.response ? error.response.data : error.message
      );
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
          margin="normal"
        >
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
          margin="normal"
        >
          {specialties.map((specialty) => (
            <MenuItem
              key={specialty.especialidad_id}
              value={specialty.especialidad_id}
            >
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
