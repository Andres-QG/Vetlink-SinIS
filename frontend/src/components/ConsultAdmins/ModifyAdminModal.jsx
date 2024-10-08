import { useState, useEffect } from "react";
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
  Badge,
  Business,
} from "@mui/icons-material";
import axios from "axios";

const ModifyAdminModal = ({ open, onClose, data, fetchData, showSnackbar }) => {
  const initialFormData = {
    cedula: "",
    correo: "",
    nombre: "",
    apellido1: "",
    apellido2: "",
    telefono: "",
    clinica: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);
  const [miniLoad, setMiniLoad] = useState(true);
  const [errors, setErrors] = useState({});
  const [clinics, setClinics] = useState([]);

  useEffect(() => {
    const fetchAllClinics = async () => {
      setMiniLoad(true);
      let allClinics = [];
      let nextPage = "http://localhost:8000/api/consult-clinics/";
      try {
        while (nextPage) {
          const response = await axios.get(nextPage);
          const data = response.data;
          allClinics = allClinics.concat(data.results);

          nextPage = data.next;
        }
        setClinics(allClinics);
      } catch (error) {
        showSnackbar("Error al cargar las clínicas.", "error");
      } finally {
        setMiniLoad(false);
      }
    };

    fetchAllClinics();
  }, [showSnackbar]);

  useEffect(() => {
    if (data) {
      setFormData({
        cedula: data.cedula || "",
        correo: data.correo || "",
        nombre: data.nombre || "",
        apellido1: data.apellido1 || "",
        apellido2: data.apellido2 || "",
        telefono: data.telefono || "",
        clinica: data.clinica_id || "",
      });
    }
  }, [data]);

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
    if (!formData.clinica) {
      newErrors.clinica = "La clínica es requerida.";
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
        `http://localhost:8000/api/update-admin/${data.usuario}/`,
        formData
      );
      showSnackbar("Administrador modificado con éxito.", "success");
      fetchData();
      onClose();
    } catch (error) {
      const backendError = error.response?.data?.error;
      showSnackbar(
        backendError || "Error al actualizar el administrador.",
        "error"
      );
    } finally {
      setLoading(false);
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
          width: { xs: "90%", sm: "80%", md: 600 },
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
          Modificar Administrador
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
                endAdornment: miniLoad && (
                  <InputAdornment position="end">
                    <CircularProgress size={20} />{" "}
                  </InputAdornment>
                ),
              }}
            >
              {clinics.map((clinic) => (
                <MenuItem key={clinic.clinica_id} value={clinic.clinica_id}>
                  {clinic.clinica}
                </MenuItem>
              ))}
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

export default ModifyAdminModal;
