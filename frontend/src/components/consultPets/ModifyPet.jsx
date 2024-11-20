import axios from "axios";
import { useState, useEffect } from "react";
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
  Modal,
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

const ModifyPet = ({
  open,
  handleClose,
  onSuccess,
  selectedItem = undefined,
}) => {
  const [formData, setFormData] = useState({
    usuario_cliente: selectedItem?.usuario_cliente || "",
    nombre: selectedItem?.nombre || "",
    edad: selectedItem?.edad || "",
    especie: selectedItem?.especie || "",
    raza: selectedItem?.raza || "",
    sexo: selectedItem?.sexo || "M",
  });

  const speciesOptions = ["Perro", "Gato"];
  const breedOptions = {
    Perro: [
      "Labrador",
      "Bulldog",
      "Beagle",
      "Poodle",
      "Chihuahua",
      "Pastor Alemán",
    ],
    Gato: ["Persa", "Siamés", "Bengalí", "Sphynx", "Maine Coon", "Angora"],
  };

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  function calcularEdad(fechaNacimiento) {
    const fechaActual = new Date();
    const anoActual = fechaActual.getFullYear();
    const anoNacimiento = new Date(fechaNacimiento).getFullYear();

    return anoActual - anoNacimiento;
  }

  useEffect(() => {
    if (selectedItem) {
      setFormData({
        usuario_cliente: selectedItem.usuario_cliente,
        nombre: selectedItem.nombre,
        edad: calcularEdad(selectedItem.fecha_nacimiento),
        especie: selectedItem.especie,
        raza: selectedItem.raza,
        sexo: selectedItem.sexo,
      });
    }
  }, [selectedItem]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "especie" && { raza: "" }),
    }));
  };

  const clearForm = () => {
    setFormData({
      usuario_cliente: "",
      nombre: "",
      edad: "",
      especie: "",
      raza: "",
      sexo: "M",
    });
    setErrors({});
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.usuario_cliente) {
      newErrors.usuario_cliente = "Usuario cliente es obligatorio";
    }
    if (!formData.nombre) {
      newErrors.nombre = "Nombre es obligatorio";
    }
    if (
      !formData.especie ||
      !/^[a-zA-ZáéíóúüÁÉÍÓÚÜ\s]+$/.test(formData.especie)
    ) {
      newErrors.especie = "Especie solo puede contener letras";
    }
    if (!/^[a-zA-ZáéíóúüÁÉÍÓÚÜ\s]+$/.test(formData.raza)) {
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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    if (!selectedItem.mascota_id) {
      console.error("El ID de la mascota no es válido");
      onSuccess("No se pudo obtener el ID de la mascota.", "error");
      return;
    }

    formData.edad = parseInt(formData.edad, 10);

    setLoading(true);
    try {
      const response = await axios.put(
        `http://localhost:8000/api/update-pet/${selectedItem.mascota_id}/`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        onSuccess("Mascota actualizada exitosamente.", "success");
        handleClose();
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 404) {
          // Cuando el usuario o la mascota no existen
          const errorMessage = error.response.data.error;
          if (errorMessage === "Usuario no encontrado.") {
            onSuccess("Usuario no encontrado.", "error");
          } else if (errorMessage === "Mascota no encontrada.") {
            onSuccess("Mascota no encontrada.", "error");
          }
        } else if (error.response.status === 400) {
          // Cuando hay un error con los datos proporcionados (p. ej., la edad no es un número entero)
          const errorMessage = error.response.data.error;
          if (errorMessage === "La edad debe ser un número entero.") {
            onSuccess("La edad debe ser un número entero.", "error");
          } else {
            onSuccess(
              "Datos inválidos. Revise los campos e intente nuevamente.",
              "error"
            );
          }
        } else if (error.response.status === 500) {
          // Error interno del servidor
          onSuccess(
            "Error interno del servidor. Inténtelo más tarde.",
            "error"
          );
        }
      } else if (error.request) {
        // No hubo respuesta del servidor
        console.error("No se recibió respuesta del servidor:", error.request);
        onSuccess("No se recibió respuesta del servidor.", "error");
      } else {
        // Otro tipo de error en la configuración de la solicitud
        console.error("Error al configurar la solicitud:", error.message);
        onSuccess("Error al configurar la solicitud.", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          p: 3,
          borderRadius: 2,
          boxShadow: 3,
          bgcolor: "#fff",
          width: "100%",
          maxWidth: "500px",
          mx: "auto",
        }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <h2>Modificar Mascota</h2>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Stack spacing={2}>
          <TextField
            label="Usuario Cliente"
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
          />
          <TextField
            label="Nombre"
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
          />
          <TextField
            label="Edad"
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
          />
          <FormControl>
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
              {speciesOptions.map((species) => (
                <MenuItem key={species} value={species}>
                  {species}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            select
            label="Raza"
            name="raza"
            value={formData.raza}
            onChange={handleChange}
            error={!!errors.raza}
            helperText={errors.raza}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <BreedIcon />
                </InputAdornment>
              ),
            }}
            disabled={!formData.especie}
          >
            {(breedOptions[formData.especie] || []).map((breed) => (
              <MenuItem key={breed} value={breed}>
                {breed}
              </MenuItem>
            ))}
          </TextField>
          <FormControl>
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

          {errors.general && (
            <Box color="error.main" textAlign="center">
              {errors.general}
            </Box>
          )}

          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              onClick={clearForm}
              fullWidth
              size="medium"
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
              {loading ? "Modificando..." : "Modificar Mascota"}
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Modal>
  );
};

export default ModifyPet;
