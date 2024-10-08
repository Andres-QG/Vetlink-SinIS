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
} from "@mui/material";
import {
  Close,
  Person,
  Email,
  Phone,
  LocalHospital,
  AddLocation,
} from "@mui/icons-material";
import axios from "axios";

const AddClinicaModal = ({ open, onClose, onSubmit }) => {
  const initialFormData = {
    clinica: "",
    direccion: "",
    telefono: "",
    usuario: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({}); // Estado para los errores de validación
  const [owners, setOwners] = useState([]);

  useEffect(() => {
    const fetchOwners = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/get-owners/");
        setOwners(response.data.owners);
      } catch (error) {
        console.error("Error fetching owners:", error);
      }
    };
    fetchOwners();
  }, []);


  // Función de validación de campos
  const validate = () => {
    const newErrors = {};

    // Validación de usuario
    if (!formData.clinica) {
      newErrors.clinica= "El nombre de la clinica es requerido.";
    }
    if (!formData.direccion) {
      newErrors.direccion= "La dirección es requerida.";
    }
    if (!formData.usuario) {
      newErrors.usuario= "El usuario es requerido.";
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
          Agregar Clinica
        </Typography>

        {/* Campos con iconos */}
        <TextField
          fullWidth
          label="Clinica"
          name="clinica"
          value={formData.clinica}
          onChange={handleChange}
          sx={{ mb: 2 }}
          required
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LocalHospital />
              </InputAdornment>
            ),
          }}
        />
        <TextField
          fullWidth
          label="Direccion"
          name="direccion"
          value={formData.direccion}
          onChange={handleChange}
          sx={{ mb: 2 }}
          required
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <AddLocation/>
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
          select
          label="Dueño"
          name="usuario"
          value={formData.usuario || ""}
          onChange={handleChange}
          sx={{ mb: 2 }}
          required
          error={!!errors.usuario}
          helperText={errors.usuario}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Person />
              </InputAdornment>
            ),
          }}
        >
          <MenuItem value="" disabled>
            Selecciona un dueño
          </MenuItem>
          {owners.map((owner) => (
            <MenuItem key={owner.usuario} value={owner.nombre} >
              {owner.nombre}
            </MenuItem>
          ))}
        </TextField>
        

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
            {loading ? "Agregando..." : "Agregar Clinica"}
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

export default AddClinicaModal;
