import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  MenuItem,
  Button,
  Snackbar,
  Alert,
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
  LocalHospital as ClinicIcon,
  MedicalServices as SpecialtyIcon,
} from "@mui/icons-material";
import axios from "axios";
import PropTypes from "prop-types";

const EditVetModal = ({
  open,
  onClose,
  vet,
  clinics,
  specialties,
  fetchVets,
}) => {
  const initialFormData = {
    usuario: vet?.usuario || "",
    cedula: vet?.cedula || "",
    correo: vet?.correo || "",
    nombre: vet?.nombre || "",
    apellido1: vet?.apellido1 || "",
    apellido2: vet?.apellido2 || "",
    telefono: vet?.telefono || "",
    clinica: vet?.clinica || "",
    especialidad: vet?.especialidad || "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [originalData, setOriginalData] = useState(initialFormData);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open) {
      const vetData = {
        usuario: vet?.usuario || "",
        cedula: vet?.cedula || "",
        correo: vet?.correo || "",
        nombre: vet?.nombre || "",
        apellido1: vet?.apellido1 || "",
        apellido2: vet?.apellido2 || "",
        telefono: vet?.telefono || "",
        clinica: vet?.clinica || "",
        especialidad: vet?.especialidad || "",
      };
      setFormData(vetData);
      setOriginalData(vetData);
      setErrors({});
    }
  }, [open, vet]);

  useEffect(() => {
    if (vet) {
      const updatedVet = { ...vet };

      const clinic = clinics.find((c) => c.clinica === vet.clinica);
      if (clinic) {
        updatedVet.clinica = clinic.clinica_id;
      }

      const specialty = specialties.find((s) => s.nombre === vet.especialidad);
      if (specialty) {
        updatedVet.especialidad = specialty.especialidad_id;
      }

      setFormData(updatedVet);
      setOriginalData(updatedVet);
    }
  }, [clinics, specialties, vet]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

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
      "especialidad",
      "clinica",
      "telefono",
    ];
    requiredFields.forEach((field) => {
      if (!updatedData[field]) {
        updatedData[field] = originalData[field];
      }
    });

    try {
      setLoading(true);
      await axios.put(
        `http://localhost:8000/api/update-vet/${formData.usuario}/`,
        updatedData
      );
      setSnackbarMessage("Veterinario actualizado exitosamente.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      fetchVets();
      onClose();
    } catch (error) {
      const errorMessage = error.response ? error.response.data : error.message;
      setSnackbarMessage(
        typeof errorMessage === "string"
          ? errorMessage
          : JSON.stringify(errorMessage)
      );
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setFormData(initialFormData);
    setErrors({});
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
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
              Editar Veterinario
            </Typography>
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Stack>

          {/* Campos del formulario */}
          <TextField
            label="Usuario"
            name="usuario"
            value={formData.usuario}
            onChange={handleChange}
            fullWidth
            margin="normal"
            disabled
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            label="Cédula"
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
            label="Correo"
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
            label="Nombre"
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
            label="Apellido 1"
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
            error={!!errors.apellido2}
            helperText={errors.apellido2}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AccountCircleIcon />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            label="Teléfono"
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
                  <Box component="span" sx={{ ml: 1 }}>
                    +506
                  </Box>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            select
            label="Clínica"
            name="clinica"
            value={formData.clinica}
            onChange={handleChange}
            fullWidth
            margin="normal"
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
            label="Especialidad"
            name="especialidad"
            value={formData.especialidad}
            onChange={handleChange}
            fullWidth
            margin="normal"
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
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}>
          <Alert
            onClose={handleSnackbarClose}
            severity={snackbarSeverity}
            sx={{ width: "100%" }}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Box>
    </Modal>
  );
};

EditVetModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  vet: PropTypes.object.isRequired,
  clinics: PropTypes.array.isRequired,
  specialties: PropTypes.array.isRequired,
  fetchVets: PropTypes.func.isRequired,
};

export default EditVetModal;
