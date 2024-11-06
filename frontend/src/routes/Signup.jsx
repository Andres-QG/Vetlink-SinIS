import React from "react";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../components/Notification";
import {
  Typography,
  TextField,
  Button,
  CircularProgress,
  InputAdornment,
  Container,
  Box,
  Grid,
} from "@mui/material";
import {
  AccountCircle,
  Badge,
  Email,
  Person,
  Phone,
  VpnKey,
} from "@mui/icons-material";
import PetsIcon from "@mui/icons-material/Pets";
import Logo from "../assets/icons/big_logo.png";

function Signup() {
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

  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const showNotification = useNotification();

  const validations = {
    usuario: (v) => !v && "El usuario es requerido.",
    cedula: (v) => !/^[0-9]{9}$/.test(v) && "La cédula debe tener 9 dígitos.",
    correo: (v) => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) && "Correo inválido.",
    clave: (v) =>
      !/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/.test(v) &&
      "Contraseña debe tener 8 caracteres, una mayúscula, un número y un carácter especial.",
    telefono: (v) =>
      !/^[0-9]{8}$/.test(v) && "El teléfono debe tener 8 dígitos.",
    nombre: (v) => !v && "El nombre es requerido.",
    apellido1: (v) => !v && "El primer apellido es requerido.",
    apellido2: (v) => !v && "El segundo apellido es requerido.",
  };

  const validate = () => {
    const newErrors = {};
    Object.keys(validations).forEach((key) => {
      const error = validations[key](formData[key]);
      if (error) newErrors[key] = error;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (validate()) {
      setLoading(true);
      try {
        const response = await axios.post(
          "http://localhost:8000/api/add-client/",
          formData,
          { withCredentials: true }
        );
        setLoading(false);
        if (response.status === 201) {
          showNotification(response.data.message, "success");
          setTimeout(() => navigate("/login"), 3000); // Espera 3 segundos antes de redirigir
        } else {
          showNotification(response.data.error || "Error desconocido", "error");
        }
      } catch (error) {
        if (error.response) {
          showNotification(
            error.response.data.error || "Error en el servidor",
            "error"
          );
        } else if (error.request) {
          showNotification("No se recibió respuesta del servidor", "error");
        } else {
          showNotification(error.message, "error");
        }
        setLoading(false);
      }
    }
  };

  const handleClear = () => {
    setFormData(initialFormData);
    setErrors({});
  };

  return (
    <Container
      maxWidth="lg"
      sx={{
        display: "flex",
        minHeight: "80vh",
        marginTop: "20px",
        marginBottom: "20px",
        alignItems: "center",
        p: 0,
      }}
    >
      <Grid
        container
        sx={{
          boxShadow: 3,
          borderRadius: 2,
          overflow: "hidden",
          width: "100%",
          display: "flex",
        }}
      >
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            bgcolor: "#00308f",
            color: "white",
            p: { xs: 4, md: 5 },
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box
            component="img"
            src={Logo}
            alt="Logo de VetLink"
            sx={{
              width: { xs: 60, md: 100 }, // Tamaño responsivo
              height: { xs: 60, md: 100 }, // Altura igual al ancho para mantener la proporción
              mb: 2,
            }}
          />
          <Typography variant="h4" fontWeight="bold" mb={2} textAlign="center">
            ¡Bienvenido a VetLink!
          </Typography>
          <Typography
            variant="body1"
            align="center"
            mb={3}
            sx={{ fontSize: { xs: 14, md: 16 } }}
          >
            Únete a nuestra familia y obtén acceso a servicios y cuidados
            exclusivos para tu mascota. Estamos aquí para cuidar a tus amigos
            peludos con la mejor atención.
          </Typography>
          <Button
            variant="outlined"
            color="inherit"
            sx={{
              mt: 2,
              color: "white",
              borderColor: "white",
              "&:hover": {
                borderColor: "white",
                backgroundColor: "rgba(255, 255, 255, 0.1)",
              },
            }}
            onClick={() => navigate("/login")}
          >
            ¿Ya tienes una cuenta? Inicia sesión
          </Button>
        </Grid>
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            bgcolor: "#fff",
            p: { xs: 4, md: 5 },
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            width: "100%",
          }}
        >
          <Typography
            variant="h4"
            fontWeight="bold"
            color="#00308f"
            mb={3}
            textAlign="Center"
          >
            Registro
          </Typography>
          <Grid container spacing={2} sx={{ width: "100%" }}>
            {[
              { label: "Nombre", name: "nombre", icon: <Person /> },
              { label: "Cédula", name: "cedula", icon: <Badge /> },
              { label: "Primer Apellido", name: "apellido1", icon: <Person /> },
              {
                label: "Segundo Apellido",
                name: "apellido2",
                icon: <Person />,
              },
              { label: "Usuario", name: "usuario", icon: <AccountCircle /> },
              {
                label: "Contraseña",
                name: "clave",
                type: "password",
                icon: <VpnKey />,
              },
              { label: "Correo Electrónico", name: "correo", icon: <Email /> },
              { label: "Teléfono", name: "telefono", icon: <Phone /> },
            ].map((field) => (
              <Grid item xs={12} sm={6} key={field.name}>
                <TextField
                  fullWidth
                  label={field.label}
                  name={field.name}
                  type={field.type || "text"}
                  value={formData[field.name]}
                  onChange={handleChange}
                  error={!!errors[field.name]}
                  helperText={errors[field.name]}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        {field.icon}
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            ))}
          </Grid>
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
            <Button
              variant="outlined"
              onClick={handleClear}
              sx={{
                width: "48%",
                color: "#00308f",
                borderColor: "#00308f",
                "&:hover": { backgroundColor: "rgba(0, 48, 143, 0.1)" },
              }}
            >
              Limpiar
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={loading}
              sx={{
                width: "48%",
                bgcolor: "#00308f",
                "&:hover": { bgcolor: "#00246d" },
              }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Crear cuenta"
              )}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Signup;
