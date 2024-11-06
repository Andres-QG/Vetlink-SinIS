import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  CircularProgress,
  InputAdornment,
  Grid,
} from "@mui/material";
import { Close, Person, Email, Phone, Badge } from "@mui/icons-material";
import axios from "axios";

const ModifyClientModal = ({ open, handleClose, onSuccess, selectedItem }) => {
  const initialFormData = {
    cedula: selectedItem?.cedula || "",
    correo: selectedItem?.correo || "",
    nombre: selectedItem?.nombre || "",
    apellido1: selectedItem?.apellido1 || "",
    apellido2: selectedItem?.apellido2 || "",
    telefono: selectedItem?.telefono || "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [originalData, setOriginalData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (selectedItem) {
      const updatedFormData = {
        cedula: selectedItem.cedula || "",
        correo: selectedItem.correo || "",
        nombre: selectedItem.nombre || "",
        apellido1: selectedItem.apellido1 || "",
        apellido2: selectedItem.apellido2 || "",
        telefono: selectedItem.telefono || "",
      };
      setFormData(updatedFormData);
      setOriginalData(updatedFormData);
    }
  }, [selectedItem]);

  const validate = () => {
    const newErrors = {};
    if (!formData.cedula || !/^[0-9]{9}$/.test(formData.cedula)) {
      newErrors.cedula = "La cédula debe tener 9 dígitos.";
    }
    if (
      !formData.correo ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correo)
    ) {
      newErrors.correo = "El correo electrónico no es válido.";
    }
    if (!formData.telefono || !/^[0-9]{8}$/.test(formData.telefono)) {
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
    if (!validate()) return;
    setLoading(true);
    try {
      await axios.put(
        `http://localhost:8000/api/update-client/${selectedItem.usuario}/`,
        formData
      );
      onSuccess("Cliente modificado exitosamente.", "success");
      handleClose(); // Cierra el modal al modificar correctamente
    } catch (error) {
      const backendError = error.response?.data?.error;
      onSuccess(message, backendError);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setFormData(originalData);
    setErrors({});
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "90%", sm: "80%", md: 600 },
          bgcolor: "background.paper",
          p: 4,
          borderRadius: "10px",
          boxShadow: 24,
        }}>
        <IconButton
          onClick={handleClose}
          sx={{ position: "absolute", top: 8, right: 8 }}>
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
          }}>
          Modificar Cliente
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Cédula"
              name="cedula"
              value={formData.cedula}
              onChange={handleChange}
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
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Correo"
              name="correo"
              value={formData.correo}
              onChange={handleChange}
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
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
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
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Apellido 1"
              name="apellido1"
              value={formData.apellido1}
              onChange={handleChange}
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
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Apellido 2"
              name="apellido2"
              value={formData.apellido2}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Teléfono"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
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
          </Grid>
        </Grid>

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
            }}>
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
            }}>
            {loading ? "Guardando..." : "Guardar Cambios"}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

ModifyClientModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
  selectedItem: PropTypes.object.isRequired,
};

export default ModifyClientModal;
