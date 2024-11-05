import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Popper,
  Paper,
  ClickAwayListener,
} from "@mui/material";

export default function Component() {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    usuario: "usuario",
    nombre: "nombre",
    apellido1: "apellido1",
    apellido2: "apellido2",
    cedula: "cédula",
    email: "email",
    numero: "número",
  });

  const [anchorEl, setAnchorEl] = useState(null);

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSave = () => {
    setIsEditing(false);
    // Here you would typically save the data to your backend
  };

  const handleDeactivateClick = (event) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const handleDeactivateConfirm = () => {
    setAnchorEl(null);
    // Here you would typically handle the deactivation logic
  };

  const handleClickAway = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popper" : undefined;

  return (
    <Box sx={{ p: 4, maxWidth: "1200px", margin: "0 auto" }}>
      <Typography
        variant="h4"
        sx={{ mb: 4, fontWeight: "bold", color: "#001B3D" }}
      >
        Mi Perfil
      </Typography>

      <Box sx={{ display: "flex", gap: 8 }}>
        {/* Left Section - Personal Data */}
        <Box sx={{ flex: 1 }}>
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
                    backgroundColor: "#002B6B",
                    "&:hover": {
                      backgroundColor: "#001B3D",
                    },
                  }}
                >
                  cancelar
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={handleSave}
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
                  hecho
                </Button>
              </Box>
            )}
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {[
              { name: "usuario", label: "Usuario" },
              { name: "nombre", label: "Nombre" },
              { name: "apellido1", label: "1er Apellido" },
              { name: "apellido2", label: "2do Apellido" },
              { name: "cedula", label: "Cédula" },
              { name: "email", label: "Correo electrónico" },
              { name: "numero", label: "Número teléfono" },
            ].map((field) => (
              <TextField
                key={field.name}
                name={field.name}
                label={field.label}
                variant="outlined"
                fullWidth
                disabled={!isEditing}
                value={formData[field.name]}
                onChange={handleChange}
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
        </Box>

        {/* Right Section - Password and Account Deactivation */}
        <Box sx={{ flex: 1 }}>
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
            <Popper id={id} open={open} anchorEl={anchorEl}>
              <ClickAwayListener onClickAway={handleClickAway}>
                <Paper sx={{ p: 2 }}>
                  <Typography sx={{ mb: 1 }}>¿Está seguro?</Typography>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={handleDeactivateConfirm}
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
        </Box>
      </Box>
    </Box>
  );
}
