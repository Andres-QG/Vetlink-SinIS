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
  MenuItem,
  Grid,
} from "@mui/material";
import {
  Close,
  Person,
  Email,
  Phone,
  VpnKey,
  Badge,
  AccountCircle,
  Business,
} from "@mui/icons-material";
import axios from "axios";

const AddAdminModal = ({ open, handleClose, fetchAdmins, showSnackbar }) => {
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
  };

  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [clinics, setClinics] = useState([]);

  useEffect(() => {
    const fetchClinics = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/consult-clinics/"
        );
        if (response.data.results) {
          setClinics(response.data.results);
        } else {
          console.error("No clinics found in the response");
        }
      } catch (error) {
        console.error("Error fetching clinics:", error);
        showSnackbar("Error al cargar las clínicas.", "error");
      }
    };
    fetchClinics();
  }, [showSnackbar]);

  const validate = () => {
    const newErrors = {};
    if (!formData.usuario) newErrors.usuario = "El usuario es requerido.";
    if (!formData.cedula || !/^[0-9]{9}$/.test(formData.cedula)) {
      newErrors.cedula = "La cédula debe tener 9 dígitos.";
    }
    if (
      !formData.correo ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correo)
    ) {
      newErrors.correo = "El correo electrónico no es válido.";
    }
    if (
      !formData.clave ||
      !/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/.test(
        formData.clave
      )
    ) {
      newErrors.clave =
        "La contraseña debe tener al menos 8 caracteres, una mayúscula, un número y un carácter especial.";
    }
    if (!formData.telefono || !/^[0-9]{8}$/.test(formData.telefono)) {
      newErrors.telefono = "El teléfono debe tener 8 dígitos.";
    }
    if (!formData.clinica) newErrors.clinica = "La clínica es requerida.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await axios.post("http://localhost:8000/api/add-admin/", formData);
      showSnackbar("Administrador agregado exitosamente.", "success");
      setFormData(initialFormData);
      fetchAdmins();
      handleClose();
    } catch (error) {
      console.log(error);
      const backendError = error.response?.data?.error;
      showSnackbar(backendError || "Error al agregar administrador.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setFormData(initialFormData);
    setErrors({});
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description">
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "90%", sm: "80%", md: 600 },
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: "10px",
        }}>
        <IconButton
          onClick={handleClose}
          sx={{ position: "absolute", top: 8, right: 8 }}>
          <Close />
        </IconButton>
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
          }}>
          Agregar Administrador
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Usuario"
              name="usuario"
              value={formData.usuario}
              onChange={handleChange}
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
          </Grid>
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
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
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
              label="Contraseña"
              type="password"
              name="clave"
              value={formData.clave}
              onChange={handleChange}
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
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              select
              label="Clínica"
              name="clinica"
              value={formData.clinica}
              onChange={handleChange}
              required
              error={!!errors.clinica}
              helperText={errors.clinica}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Business />
                  </InputAdornment>
                ),
              }}>
              {clinics.length > 0 ? (
                clinics.map((clinic) => (
                  <MenuItem key={clinic.clinica_id} value={clinic.clinica_id}>
                    {clinic.clinica}
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled>No hay clínicas disponibles</MenuItem>
              )}
            </TextField>
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
            {loading ? "Agregando..." : "Agregar Administrador"}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default AddAdminModal;
