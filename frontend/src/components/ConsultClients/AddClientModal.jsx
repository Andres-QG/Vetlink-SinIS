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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    const success = await onSubmit(formData);
    setLoading(false);
    if (success) {
      setFormData(initialFormData); // Limpiar los campos si se agrega correctamente
    }
  };

  const handleClear = () => {
    setFormData(initialFormData);
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
          width: { xs: "90%", sm: "80%", md: 450 }, // Ajusta el ancho según el tamaño de pantalla
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
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Phone />
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
