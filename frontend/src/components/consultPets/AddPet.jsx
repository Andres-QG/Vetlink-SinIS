import axios from "axios";
import { useState, forwardRef } from "react";
import {
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Button,
  Box,
  Stack,
  IconButton,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import {
  Close as CloseIcon,
  Person as PersonIcon,
  Pets as PetsIcon,
  Cake as CakeIcon,
  Transgender as TransgenderIcon,
  Category as CategoryIcon,
  LocalOffer as BreedIcon,
} from "@mui/icons-material";

const AddPet = forwardRef(({ handleClose, onSuccess }, ref) => {
  AddPet.displayName = "AddPet";
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
    if (!formData.especie || !/^[a-zA-Z]+$/.test(formData.especie)) {
      newErrors.especie = "Especie solo puede contener letras";
    }
    if (!/^[a-zA-Z]+$/.test(formData.raza)) {
      newErrors.raza = "Raza solo puede contener letras";
    }
    if (!formData.sexo) {
      newErrors.sexo = "Sexo es obligatorio";
    }
    if (
      !formData.edad ||
      isNaN(formData.edad) ||
      formData.edad < 0 ||
      formData.edad > 100
    ) {
      newErrors.edad = "Por favor, introduzca una edad válida";
    }

    if (formData.especie === "otro" && !formData.otraEspecie) {
      newErrors.otraEspecie = "Por favor, introduzca la otra especie";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    if (!validateForm()) {
      return;
    }
    e.preventDefault();
    setLoading(true);

    const formDataToSend = {
      usuario_cliente: formData.usuario_cliente,
      nombre: formData.nombre,
      edad: formData.edad,
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
        onSuccess("Mascota agregada exitosamente.", "success"); // Llamar al éxito con mensaje
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 404) {
          onSuccess("Usuario no encontrado.", "error");
        } else if (error.response.status === 400) {
          onSuccess(
            "Datos inválidos. Revise los campos e intente nuevamente.",
            "error"
          );
        } else if (error.response.status === 500) {
          onSuccess(
            "Error interno del servidor. Inténtelo más tarde.",
            "error"
          );
        }
      } else {
        onSuccess("Error desconocido. Inténtelo más tarde.", "error");
      }
    }

    setLoading(false);
  };

  const handleClear = () => {
    setFormData({
      usuario_cliente: "",
      nombre: "",
      edad: "",
      especie: "",
      raza: "",
      sexo: "M",
      otraEspecie: "",
    });
    setErrors({});
  };

  return (
    <Box
      ref={ref}
      sx={{
        p: 3,
        borderRadius: 2,
        boxShadow: 3,
        bgcolor: "#fff",
        width: "100%",
        maxWidth: "500px",
        mx: "auto",
      }}
    >
      <form onSubmit={handleSubmit}>
        {/* Cabecera con botón de cierre */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <h2>Agregar Mascota</h2>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Stack>

        {/* Campos del formulario */}
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
            startAdornment: (
              <InputAdornment position="start">
                <PersonIcon />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 2 }}
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
            startAdornment: (
              <InputAdornment position="start">
                <PetsIcon />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 2 }}
        />

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
            startAdornment: (
              <InputAdornment position="start">
                <CakeIcon />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 2 }}
        />

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Especie</InputLabel>
          <Select
            label="Especie"
            name="especie"
            value={formData.especie}
            onChange={handleChange}
            error={!!errors.especie}
            startAdornment={
              <InputAdornment position="start">
                <CategoryIcon />
              </InputAdornment>
            }
          >
            <MenuItem value="perro">Perro</MenuItem>
            <MenuItem value="gato">Gato</MenuItem>
            <MenuItem value="otro">Otro</MenuItem>
          </Select>
        </FormControl>

        {formData.especie === "otro" && (
          <TextField
            label="Especifique la especie"
            variant="outlined"
            fullWidth
            name="otraEspecie"
            value={formData.otraEspecie}
            onChange={handleChange}
            startAdornment={
              <InputAdornment position="start">
                <CategoryIcon />
              </InputAdornment>
            }
            sx={{ mb: 2 }}
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
            startAdornment: (
              <InputAdornment position="start">
                <BreedIcon />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 2 }}
        />

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Sexo</InputLabel>
          <Select
            label="Sexo"
            name="sexo"
            value={formData.sexo}
            onChange={handleChange}
            error={!!errors.sexo}
            startAdornment={
              <InputAdornment position="start">
                <TransgenderIcon />
              </InputAdornment>
            }
          >
            <MenuItem value="M">Macho</MenuItem>
            <MenuItem value="H">Hembra</MenuItem>
          </Select>
        </FormControl>

        <Stack
          direction="row"
          spacing={2}
          sx={{
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
            mx: "auto",
          }}
        >
          <Button
            variant="outlined"
            onClick={handleClear}
            fullWidth
            size="medium"
            sx={{
              borderColor: "#00308F",
              color: "#00308F",
            }}
          >
            Limpiar
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            fullWidth
            size="medium"
            disabled={loading}
            startIcon={loading && <CircularProgress size={20} />}
            sx={{
              backgroundColor: "#00308F",
              "&:hover": {
                backgroundColor: "#00246d",
              },
            }}
          >
            {loading ? "Agregando..." : "Agregar Mascota"}
          </Button>
        </Stack>
      </form>
    </Box>
  );
});

export default AddPet;
