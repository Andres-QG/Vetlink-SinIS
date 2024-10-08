import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  TextField,
  Button,
  MenuItem,
  Typography,
  IconButton,
  InputAdornment,
  Stack,
  CircularProgress,
} from "@mui/material";
import {
  Close as CloseIcon,
  Person as PersonIcon,
  Badge as BadgeIcon,
  Email as EmailIcon,
  AccountCircle as AccountCircleIcon,
  Phone as PhoneIcon,
  Lock as LockIcon,
  LocalHospital as ClinicIcon,
  MedicalServices as SpecialtyIcon,
} from "@mui/icons-material";

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

  useEffect(() => {
    if (open) {
      setFormData(initialFormData);
      setErrors({});
    }
  }, [open]);

  const validate = () => {
    const newErrors = {};

    if (!/^\d{9}$/.test(formData.cedula)) {
      newErrors.cedula = "Cédula debe tener 9 dígitos y solo números";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correo)) {
      newErrors.correo = "Correo debe tener un formato válido";
    }

    if (!/^[a-zA-Z]+$/.test(formData.nombre)) {
      newErrors.nombre =
        "Nombre no puede tener números ni caracteres especiales";
    }

    if (!/^[a-zA-Z]+$/.test(formData.apellido1)) {
      newErrors.apellido1 =
        "Apellido 1 no puede tener números ni caracteres especiales";
    }

    if (formData.apellido2 && !/^[a-zA-Z]+$/.test(formData.apellido2)) {
      newErrors.apellido2 =
        "Apellido 2 no puede tener números ni caracteres especiales";
    }

    if (!/^\d{8}$/.test(formData.telefono)) {
      newErrors.telefono = "Teléfono debe tener 8 dígitos y solo números";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      setLoading(true);
      await onSubmit(formData);
      setLoading(false);
      onClose();
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
          p: 3,
          borderRadius: 2,
          boxShadow: 3,
          bgcolor: "#fff",
          width: "100%",
          maxWidth: "500px",
          maxHeight: "90vh", // Altura máxima del 90% de la pantalla
          overflowY: "auto", // Permitir desplazamiento vertical
          mx: "auto",
        }}>
        <form onSubmit={handleSubmit}>
          {/* Cabecera con botón de cierre */}
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            mb={2}>
            <Typography variant="h6" component="h2">
              Agregar Veterinario
            </Typography>
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Stack>

          {/* Campos del formulario */}
          <TextField
            label="Usuario *"
            name="usuario"
            value={formData.usuario}
            onChange={handleChange}
            fullWidth
            margin="normal"
            error={!!errors.usuario}
            helperText={errors.usuario}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon />
                </InputAdornment>
              ),
            }}
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
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <BadgeIcon />
                </InputAdornment>
              ),
            }}
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
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon />
                </InputAdornment>
              ),
            }}
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
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AccountCircleIcon />
                </InputAdornment>
              ),
            }}
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
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AccountCircleIcon />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            label="Apellido 2"
            name="apellido2"
            value={formData.apellido2}
            onChange={handleChange}
            fullWidth
            margin="normal"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AccountCircleIcon />
                </InputAdornment>
              ),
            }}
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
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PhoneIcon />
                </InputAdornment>
              ),
            }}
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
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon />
                </InputAdornment>
              ),
            }}
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
            helperText={errors.clinica}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <ClinicIcon />
                </InputAdornment>
              ),
            }}>
            {clinics.map((clinic) => (
              <MenuItem key={clinic.clinica_id} value={clinic.clinica_id}>
                {clinic.clinica}
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
            helperText={errors.especialidad}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SpecialtyIcon />
                </InputAdornment>
              ),
            }}>
            {specialties.map((specialty) => (
              <MenuItem
                key={specialty.especialidad_id}
                value={specialty.especialidad_id}>
                {specialty.nombre}
              </MenuItem>
            ))}
          </TextField>

          <Stack
            direction="row"
            spacing={2}
            sx={{
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
              mx: "auto",
              mt: 2,
            }}>
            <Button
              variant="outlined"
              onClick={handleClear}
              fullWidth
              size="medium"
              sx={{
                borderColor: "#00308F",
                color: "#00308F",
              }}>
              Limpiar
            </Button>
            <Button
              variant="contained"
              type="submit"
              fullWidth
              size="medium"
              disabled={loading}
              startIcon={loading && <CircularProgress size={20} />}
              sx={{
                backgroundColor: "#00308F",
                "&:hover": {
                  backgroundColor: "#00246d",
                },
              }}>
              {loading ? "Guardando..." : "Guardar"}
            </Button>
          </Stack>
        </form>
      </Box>
    </Modal>
  );
};

export default AddVetModal;
