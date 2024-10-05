import React, { useState } from "react";
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
  Person,
  Email,
  Phone,
  VpnKey,
  Badge,
  AccountCircle,
} from "@mui/icons-material";

const AddClientModal = ({ open, onClose, onSubmit }) => {
  const initialFormData = {
    usuario: "",
    cedula: "",
    correo: "",
    nombre: "",
    apellido1: "",
    apellido2: "",
    telefono: "",
    clave: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({}); // Estado para los errores de validación

  // Función de validación de campos
  const validate = () => {
    const newErrors = {};

    // Validación de usuario
    if (!formData.usuario) {
      newErrors.usuario = "El usuario es requerido.";
    }

    // Validación de cédula (9 dígitos exactos)
    const cedulaRegex = /^[0-9]{9}$/;
    if (!formData.cedula || !cedulaRegex.test(formData.cedula)) {
      newErrors.cedula = "La cédula debe tener 9 dígitos.";
    }

    // Validación de correo
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.correo || !emailRegex.test(formData.correo)) {
      newErrors.correo = "El correo electrónico no es válido.";
    }

    // Validación de contraseña (al menos 8 caracteres, una mayúscula, un número y un carácter especial)
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
    if (!formData.clave || !passwordRegex.test(formData.clave)) {
      newErrors.clave =
        "La contraseña debe tener al menos 8 caracteres, una mayúscula, un número y un carácter especial.";
    }

    // Validación de teléfono (8 dígitos exactos)
    const telefonoRegex = /^[0-9]{8}$/;
    if (!formData.telefono || !telefonoRegex.test(formData.telefono)) {
      newErrors.telefono = "El teléfono debe tener 8 dígitos.";
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
      const success = await onSubmit(formData);
      setLoading(false);
      if (success) {
        setFormData(initialFormData); // Limpiar los campos si se agrega correctamente
      }
    }
  };

  const handleClear = () => {
    setFormData(initialFormData);
    setErrors({});
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "90%", sm: "80%", md: 450 },
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: "10px",
        }}
      >
        {/* Botón de cerrar modal (X) */}
        <IconButton
          onClick={onClose}
          sx={{ position: "absolute", top: 8, right: 8 }}
        >
          <Close />
        </IconButton>

        {/* Header minimalista */}
        <Typography
          id="modal-title"
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
          Agregar Cliente
        </Typography>

        {/* Campos con iconos */}
        <TextField
          fullWidth
          label="Usuario"
          name="usuario"
          value={formData.usuario}
          onChange={handleChange}
          sx={{ mb: 2 }}
          required
          error={!!errors.usuario}
          helperText={errors.usuario}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <AccountCircle />
              </InputAdornment>
            ),
          }}
        />
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
        <TextField
          fullWidth
          label="Contraseña"
          type="password"
          name="clave"
          value={formData.clave}
          onChange={handleChange}
          sx={{ mb: 2 }}
          required
          error={!!errors.clave}
          helperText={errors.clave}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <VpnKey />
              </InputAdornment>
            ),
          }}
        />

        {/* Botones de Agregar y Limpiar */}
        <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
          <Button
            variant="contained"
            onClick={handleSubmit}
            fullWidth
            disabled={loading}
            startIcon={loading && <CircularProgress size={20} />}
            sx={{
              backgroundColor: "#00308F",
              "&:hover": {
                backgroundColor: "#00246d",
              },
            }}
          >
            {loading ? "Agregando..." : "Agregar Cliente"}
          </Button>
          <Button
            variant="outlined"
            onClick={handleClear}
            fullWidth
            disabled={loading}
            sx={{
              borderColor: "#00308F",
              color: "#00308F",
              "&:hover": {
                color: "#00246d", // Cambia el texto al color de hover sin fondo
                borderColor: "#00246d", // Cambia el borde al color de hover
              },
            }}
          >
            Limpiar
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default AddClientModal;
