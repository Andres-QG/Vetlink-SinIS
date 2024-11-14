import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Popper,
  Paper,
  ClickAwayListener,
  Skeleton,
  CircularProgress,
  Grid,
} from "@mui/material";
import axios from "axios";
import { useNotification } from "../components/Notification";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    usuario: "",
    nombre: "",
    apellido1: "",
    apellido2: "",
    cedula: "",
    correo: "",
    telefono: "",
  });
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [errors, setErrors] = useState({});
  const [confirmUser, setConfirmUser] = useState("");
  const navigate = useNavigate();

  const notify = useNotification();

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/get-user-personal-info/",
        {
          withCredentials: true,
        }
      );
      const userData = response.data;

      setFormData({
        usuario: userData.usuario,
        nombre: userData.nombre,
        apellido1: userData.apellido1,
        apellido2: userData.apellido2,
        cedula: userData.cedula,
        correo: userData.correo,
        telefono: userData.telefono,
      });
      setLoading(false);
    } catch (error) {
      notify("Error al obtener los datos del usuario", "error");
      console.error("Error fetching user data:", error);
      setLoading(false);
    }
  };

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
    setHasChanges(true);
  };

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

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setHasChanges(false);
    fetchUserData();
  };

  const handleSave = async () => {
    if (!validate()) return;

    setIsSaving(true);
    try {
      await axios.put(
        `http://localhost:8000/api/update-client/${formData.usuario}/`,
        formData,
        {
          withCredentials: true,
        }
      );
      notify("Datos actualizados correctamente", "success");
      setIsEditing(false);
      setHasChanges(false);
    } catch (error) {
      notify("Error al actualizar los datos", "error");
      console.error("Error updating user data:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeactivateClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const logOut = async () => {
    try {
      await axios.post(
        "http://localhost:8000/api/log-out/",
        {},
        { withCredentials: true }
      );
      document.cookie = "active=false;path=/;";
      navigate("/login");
    } catch (error) {
      console.error("Error cerrando sesión:", error);
    }
  };

  const handleDeactivateConfirm = async () => {
    setAnchorEl(null);
    try {
      await axios.post(
        "http://localhost:8000/api/deactivate-user-client/",
        {},
        {
          withCredentials: true,
        }
      );
      notify("Usuario desactivado correctamente", "success");
      await logOut();
    } catch (error) {
      notify("Error al desactivar el usuario", "error");
      console.error("Error deactivating user:", error);
    }
  };

  const handleClickAway = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popper" : undefined;

  const displayFields = isEditing
    ? [
        { name: "usuario", label: "Usuario" },
        { name: "nombre", label: "Nombre" },
        { name: "apellido1", label: "Apellido 1" },
        { name: "apellido2", label: "Apellido 2" },
        { name: "cedula", label: "Cédula" },
        { name: "correo", label: "Correo electrónico" },
        { name: "telefono", label: "Número teléfono" },
      ]
    : [
        { name: "usuario", label: "Usuario" },
        { name: "nombre", label: "Nombre" },
        {
          name: "apellidos",
          label: "Apellidos",
          value: `${formData.apellido1} ${formData.apellido2}`,
        },
        { name: "cedula", label: "Cédula" },
        { name: "correo", label: "Correo electrónico" },
        { name: "telefono", label: "Número teléfono" },
      ];

  return (
    <Box sx={{ p: 4, maxWidth: "1200px", margin: "0 auto" }}>
      <Typography
        variant="h4"
        sx={{ mb: 4, fontWeight: "bold", color: "#001B3D" }}
      >
        Mi Perfil
      </Typography>

      <Grid container spacing={4}>
        {/* Left Section - Personal Data */}
        <Grid item xs={12} md={6}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 3, gap: 2 }}>
            <Typography
              variant="h6"
              sx={{ fontWeight: "bold", color: "#001B3D" }}
            >
              Mis Datos Personales
            </Typography>
            {!isEditing ? (
              <Button
                variant="outlined"
                size="small"
                onClick={handleEdit}
                sx={{
                  textTransform: "none",
                  borderColor: "#2E5AAC",
                  color: "#2E5AAC",
                  "&:hover": {
                    borderColor: "#2E5AAC",
                    backgroundColor: "rgba(46, 90, 172, 0.04)",
                  },
                }}
              >
                editar
              </Button>
            ) : (
              <Box sx={{ display: "flex", gap: 1 }}>
                <Button
                  variant="contained"
                  size="small"
                  onClick={handleCancel}
                  sx={{
                    textTransform: "none",
                    backgroundColor: "#2E5AAC",
                    "&:hover": {
                      backgroundColor: "#234785",
                    },
                  }}
                >
                  cancelar
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={handleSave}
                  disabled={!hasChanges || isSaving}
                  sx={{
                    textTransform: "none",
                    borderColor: "#2E5AAC",
                    color: "#2E5AAC",
                    backgroundColor: "white",
                    "&:hover": {
                      borderColor: "#2E5AAC",
                      backgroundColor: "rgba(46, 90, 172, 0.04)",
                    },
                  }}
                >
                  {isSaving ? <CircularProgress size={24} /> : "hecho"}
                </Button>
              </Box>
            )}
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {loading
              ? [1, 2, 3, 4, 5, 6].map((_, index) => (
                  <Skeleton
                    key={index}
                    variant="rectangular"
                    height={56}
                    animation="pulse"
                  />
                ))
              : displayFields.map((field) => (
                  <TextField
                    key={field.name}
                    name={field.name}
                    label={field.label}
                    variant="outlined"
                    fullWidth
                    disabled={!isEditing || field.name === "usuario"}
                    value={
                      field.value !== undefined
                        ? field.value
                        : formData[field.name] || ""
                    }
                    onChange={handleChange}
                    error={!!errors[field.name]}
                    helperText={errors[field.name]}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: "white",
                      },
                      "& .MuiInputLabel-root": {
                        color: "#666666",
                      },
                      "& .Mui-disabled": {
                        backgroundColor: "white",
                        "-webkit-text-fill-color": "#000000",
                      },
                    }}
                  />
                ))}
          </Box>
        </Grid>

        {/* Right Section - Password and Account Deactivation */}
        <Grid item xs={12} md={6}>
          <Box sx={{ mb: 6 }}>
            <Typography
              variant="h6"
              sx={{ fontWeight: "bold", color: "#001B3D", mb: 1 }}
            >
              Contraseña
            </Typography>
            <Typography variant="body2" sx={{ color: "#666666", mb: 2 }}>
              Puedes cambiar tu contraseña cuando quieras. Recuerda que sea
              segura, pero que puedas recordarla.
            </Typography>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#2E5AAC",
                textTransform: "none",
                "&:hover": {
                  backgroundColor: "#234785",
                },
              }}
              onClick={() => navigate("/reset")}
            >
              Cambiar contraseña
            </Button>
          </Box>

          <Box>
            <Typography
              variant="h6"
              sx={{ fontWeight: "bold", color: "#001B3D", mb: 1 }}
            >
              Activación de cuenta
            </Typography>
            <Typography variant="body2" sx={{ color: "#666666", mb: 2 }}>
              Desactiva tu cuenta temporalmente. Mientras esté desactivada, no
              podrás acceder a tus datos. Deberás solicitar la reactivación de
              la misma.
            </Typography>
            <Button
              variant="contained"
              onClick={handleDeactivateClick}
              sx={{
                backgroundColor: "#2E5AAC",
                textTransform: "none",
                "&:hover": {
                  backgroundColor: "#FF3B3B",
                },
              }}
            >
              Desactivar cuenta
            </Button>
            <Popper id={id} open={open} anchorEl={anchorEl} disablePortal>
              <ClickAwayListener onClickAway={handleClickAway}>
                <Paper sx={{ p: 2 }}>
                  <Typography sx={{ mb: 1 }} data-testid="popper-title">
                    Introduzca su usuario para confirmar
                  </Typography>
                  <TextField
                    variant="outlined"
                    fullWidth
                    value={confirmUser}
                    onChange={(e) => setConfirmUser(e.target.value)}
                    sx={{ mb: 2 }}
                  />
                  <Button
                    variant="contained"
                    color="error"
                    onClick={handleDeactivateConfirm}
                    disabled={confirmUser !== formData.usuario}
                    sx={{ mr: 1 }}
                  >
                    Sí
                  </Button>
                  <Button variant="outlined" onClick={handleClickAway}>
                    No
                  </Button>
                </Paper>
              </ClickAwayListener>
            </Popper>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Profile;
