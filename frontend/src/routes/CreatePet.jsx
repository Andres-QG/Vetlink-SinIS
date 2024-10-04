import axios from "axios";
import { useState } from "react";
import {
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Button,
  Modal,
  Box,
  Typography,
  Stack,
} from "@mui/material";

const AddPetForm = () => {
  const [formData, setFormData] = useState({
    usuario_cliente: "",
    nombre: "",
    edad: "",
    especie: "",
    raza: "",
    sexo: "M",
    otraEspecie: "",
  });

  const [errors, setErrors] = useState({});
  const [open, setOpen] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.usuario_cliente) {
      newErrors.usuario_cliente = "Usuario cliente es obligatorio";
    }
    if (!formData.nombre) {
      newErrors.nombre = "Nombre es obligatorio";
    }
    if (!formData.especie) {
      newErrors.especie = "Especie es obligatorio";
    }
    if (!formData.sexo) {
      newErrors.sexo = "Sexo es obligatorio";
    }
    if (!formData.edad || isNaN(formData.edad) || formData.edad <= 0) {
      newErrors.edad = "Por favor, introduzca una edad válida";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateFechaNacimiento = (edad) => {
    const currentDate = new Date();
    const birthYear = currentDate.getFullYear() - edad;
    // Devolver una fecha ficticia con el 1 de enero del año calculado
    return new Date(birthYear, 0, 1).toISOString().split("T")[0];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    // Si los campos no obligatorios están vacíos, asignar "-"
    const formDataToSend = {
      usuario_cliente: formData.usuario_cliente,
      nombre: formData.nombre,
      fecha_nacimiento: calculateFechaNacimiento(formData.edad),
      especie:
        formData.especie === "otro" ? formData.otraEspecie : formData.especie,
      raza: formData.raza || "-",
      sexo: formData.sexo,
    };

    try {
      const response = await axios.post(
        "http://localhost:8000/api/create-pet/",
        formDataToSend,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201) {
        alert("Mascota agregada exitosamente");
        setOpen(false); // Cerrar modal al éxito
      }
    } catch (error) {
      alert("Error al agregar mascota");
    }
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      {/* Botón para abrir el modal */}
      <Button
        onClick={handleOpen}
        variant="contained"
        sx={{
          backgroundColor: "#00308F",
          color: "#fff",
          "&:hover": {
            backgroundColor: "#00246d",
          },
        }}
        className="font-montserrat"
      >
        Agregar Mascota
      </Button>

      {/* Modal con el formulario */}
      <Modal open={open} onClose={handleClose}>
        <Box
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg"
          sx={{ width: 400 }}
        >
          <Typography
            variant="h6"
            component="h2"
            className="font-montserrat font-semibold"
            sx={{ paddingBottom: 4 }}
          >
            Agregar Nueva Mascota
          </Typography>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-6 font-montserrat">
            <TextField
              label="Usuario Cliente"
              variant="outlined"
              fullWidth
              name="usuario_cliente"
              value={formData.usuario_cliente}
              onChange={handleChange}
              error={!!errors.usuario_cliente}
              helperText={errors.usuario_cliente}
              InputProps={{
                sx: {
                  "&.Mui-focused fieldset": {
                    borderColor: "#00308F",
                  },
                },
              }}
              InputLabelProps={{
                sx: {
                  "&.Mui-focused": {
                    color: "#00308F",
                  },
                },
              }}
            />

            <TextField
              label="Nombre"
              variant="outlined"
              fullWidth
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              error={!!errors.nombre}
              helperText={errors.nombre}
              InputProps={{
                sx: {
                  "&.Mui-focused fieldset": {
                    borderColor: "#00308F",
                  },
                },
              }}
              InputLabelProps={{
                sx: {
                  "&.Mui-focused": {
                    color: "#00308F",
                  },
                },
              }}
            />

            {/* Pedir la edad en lugar de la fecha de nacimiento */}
            <TextField
              label="Edad (años)"
              variant="outlined"
              fullWidth
              name="edad"
              value={formData.edad}
              onChange={handleChange}
              error={!!errors.edad}
              helperText={errors.edad}
              InputProps={{
                sx: {
                  "&.Mui-focused fieldset": {
                    borderColor: "#00308F",
                  },
                },
              }}
              InputLabelProps={{
                sx: {
                  "&.Mui-focused": {
                    color: "#00308F",
                  },
                },
              }}
            />

            <FormControl fullWidth variant="outlined">
              <InputLabel
                sx={{
                  "&.Mui-focused": {
                    color: "#00308F",
                  },
                }}
              >
                Especie
              </InputLabel>
              <Select
                label="Especie"
                name="especie"
                value={formData.especie}
                onChange={handleChange}
                error={!!errors.especie}
                sx={{
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#00308F",
                  },
                }}
              >
                <MenuItem value="perro">Perro</MenuItem>
                <MenuItem value="gato">Gato</MenuItem>
                <MenuItem value="roedor">Roedor</MenuItem>
                <MenuItem value="ave">Ave</MenuItem>
                <MenuItem value="otro">Otro</MenuItem>
              </Select>
              {errors.especie && (
                <Typography color="error" variant="body2">
                  {errors.especie}
                </Typography>
              )}
            </FormControl>

            {formData.especie === "otro" && (
              <TextField
                label="Especifique la especie"
                variant="outlined"
                fullWidth
                name="otraEspecie"
                value={formData.otraEspecie}
                onChange={handleChange}
                InputProps={{
                  sx: {
                    "&.Mui-focused fieldset": {
                      borderColor: "#00308F",
                    },
                  },
                }}
                InputLabelProps={{
                  sx: {
                    "&.Mui-focused": {
                      color: "#00308F",
                    },
                  },
                }}
              />
            )}

            <TextField
              label="Raza"
              variant="outlined"
              fullWidth
              name="raza"
              value={formData.raza}
              onChange={handleChange}
              InputProps={{
                sx: {
                  "&.Mui-focused fieldset": {
                    borderColor: "#00308F",
                  },
                },
              }}
              InputLabelProps={{
                sx: {
                  "&.Mui-focused": {
                    color: "#00308F",
                  },
                },
              }}
            />

            <FormControl fullWidth variant="outlined">
              <InputLabel
                sx={{
                  "&.Mui-focused": {
                    color: "#00308F",
                  },
                }}
              >
                Sexo
              </InputLabel>
              <Select
                label="Sexo"
                name="sexo"
                value={formData.sexo}
                onChange={handleChange}
                error={!!errors.sexo}
                sx={{
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#00308F",
                  },
                }}
              >
                <MenuItem value="M">Macho</MenuItem>
                <MenuItem value="H">Hembra</MenuItem>
              </Select>
              {errors.sexo && (
                <Typography color="error" variant="body2">
                  {errors.sexo}
                </Typography>
              )}
            </FormControl>

            <Stack direction="row" spacing={2}>
              <Button
                onClick={handleClose}
                variant="outlined"
                size="small"
                sx={{
                  color: "#00308F",
                  borderColor: "#00308F",
                  "&:hover": {
                    backgroundColor: "#f0f0f0",
                  },
                }}
                className="font-montserrat"
              >
                Cancelar
              </Button>

              <Button
                type="submit"
                variant="contained"
                size="small"
                sx={{
                  backgroundColor: "#00308F",
                  color: "#fff",
                  "&:hover": {
                    backgroundColor: "#00246d",
                  },
                }}
                className="font-montserrat"
              >
                Agregar Mascota
              </Button>
            </Stack>
          </form>
        </Box>
      </Modal>
    </>
  );
};

export default AddPetForm;
