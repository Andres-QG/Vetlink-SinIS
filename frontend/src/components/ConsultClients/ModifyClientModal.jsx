import React, { useState, useEffect } from "react";
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
import { Close, Person, Email, Phone, Badge } from "@mui/icons-material";
import axios from "axios";

const ModifyClientModal = ({
  open,
  onClose,
  client,
  fetchClients,
  showSnackbar,
}) => {
  const initialFormData = {
    cedula: "",
    correo: "",
    nombre: "",
    apellido1: "",
    apellido2: "",
    telefono: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (client) {
      setFormData({
        cedula: client.cedula || "",
        correo: client.correo || "",
        nombre: client.nombre || "",
        apellido1: client.apellido1 || "",
        apellido2: client.apellido2 || "",
        telefono: client.telefono || "",
      });
    }
  }, [client]);

  const validate = () => {
    const newErrors = {};

    const cedulaRegex = /^[0-9]{9}$/;
    if (!formData.cedula || !cedulaRegex.test(formData.cedula)) {
      newErrors.cedula = "La cédula debe tener 9 dígitos.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.correo || !emailRegex.test(formData.correo)) {
      newErrors.correo = "El correo electrónico no es válido.";
    }

    const telefonoRegex = /^[0-9]{8}$/;
    if (!formData.telefono || !telefonoRegex.test(formData.telefono)) {
      newErrors.telefono = "El teléfono debe tener 8 dígitos.";
    }

    if (!formData.nombre) {
      newErrors.nombre = "El nombre es requerido.";
    }

    if (!formData.apellido1) {
      newErrors.apellido1 = "El primer apellido es requerido.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    if (validate()) {
      setLoading(true);
      setErrors({});
      try {
        await axios.put(
          `http://localhost:8000/api/update-client/${client.usuario}/`,
          formData
        );

        await fetchClients(); // Refresca la lista de clientes
        showSnackbar("Cliente modificado con éxito.", "success");

        onClose(); // Cierra el modal después de guardar
      } catch (error) {
        if (
          error.response &&
          error.response.data.error === "El correo ya está en uso."
        ) {
          setErrors({ correo: "El correo ya está en uso." });
        } else {
          setErrors({ general: "Error al actualizar el cliente." });
        }
        showSnackbar("Error al modificar el cliente.", "error");
      } finally {
        setLoading(false);
      }
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
          width: { xs: "90%", sm: "80%", md: 450 },
          bgcolor: "background.paper",
          p: 4,
          borderRadius: "10px",
          boxShadow: 24,
        }}
      >
        <IconButton
          onClick={onClose}
          sx={{ position: "absolute", top: 8, right: 8 }}
        >
          <Close />
        </IconButton>

        <Typography
          variant="h6"
          component="h2"
          sx={{
            textAlign: "center",
            marginBottom: "20px",
            fontWeight: "bold",
            color: "#333",
            borderBottom: "1px solid #ddd",
            paddingBottom: "10px",
          }}
        >
          Modificar Cliente
        </Typography>

        {/* Campos de formulario */}
        <TextField
          fullWidth
          label="Cédula"
          name="cedula"
          value={formData.cedula}
          onChange={handleChange}
          sx={{ mb: 2 }}
          required
          error={!!errors.cedula}
          helperText={errors.cedula}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Badge />
              </InputAdornment>
            ),
          }}
        />
        <TextField
          fullWidth
          label="Correo"
          name="correo"
          value={formData.correo}
          onChange={handleChange}
          sx={{ mb: 2 }}
          required
          error={!!errors.correo}
          helperText={errors.correo}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Email />
              </InputAdornment>
            ),
          }}
        />
        <TextField
          fullWidth
          label="Nombre"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          sx={{ mb: 2 }}
          required
          error={!!errors.nombre}
          helperText={errors.nombre}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Person />
              </InputAdornment>
            ),
          }}
        />
        <TextField
          fullWidth
          label="Apellido 1"
          name="apellido1"
          value={formData.apellido1}
          onChange={handleChange}
          sx={{ mb: 2 }}
          required
          error={!!errors.apellido1}
          helperText={errors.apellido1}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Person />
              </InputAdornment>
            ),
          }}
        />
        <TextField
          fullWidth
          label="Apellido 2"
          name="apellido2"
          value={formData.apellido2}
          onChange={handleChange}
          sx={{ mb: 2 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Person />
              </InputAdornment>
            ),
          }}
        />
        <TextField
          fullWidth
          label="Teléfono"
          name="telefono"
          value={formData.telefono}
          onChange={handleChange}
          sx={{ mb: 2 }}
          required
          error={!!errors.telefono}
          helperText={errors.telefono}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Phone />
                <Box component="span" sx={{ ml: 1 }}>
                  +506
                </Box>
              </InputAdornment>
            ),
          }}
        />

        <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
          <Button
            variant="outlined"
            onClick={handleClear}
            fullWidth
            disabled={loading}
            sx={{
              borderColor: "#00308F",
              color: "#00308F",
              "&:hover": { color: "#00246d", borderColor: "#00246d" },
            }}
          >
            Limpiar
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            fullWidth
            disabled={loading}
            startIcon={loading && <CircularProgress size={20} />}
            sx={{
              backgroundColor: "#00308F",
              "&:hover": { backgroundColor: "#00246d" },
            }}
          >
            {loading ? "Guardando..." : "Guardar Cambios"}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ModifyClientModal;
