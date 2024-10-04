import axios from "axios";
import { useState } from "react";
import {
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Button,
  Box,
  Stack,
} from "@mui/material";

const CreatePet = ({ handleClose }) => {
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

  // Calcular una fecha de nacimiento estimada
  const calculateFechaNacimiento = (edad) => {
    const currentDate = new Date();
    const birthYear = currentDate.getFullYear() - edad;
    return new Date(birthYear, 0, 1).toISOString().split("T")[0];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    // '-' como valor por defecto en campos no obligatorios.
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
        handleClose(); // Cerrar modal al éxito
      }
    } catch (error) {
      alert("Error al agregar mascota");
    }
  };

  return (
    <Box className="font-montserrat">
      <h2 className="text-2xl font-semibold text-secondary p-3">
        Crear Mascota
      </h2>

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
        />

        <FormControl fullWidth variant="outlined">
          <InputLabel>Especie</InputLabel>
          <Select
            label="Especie"
            name="especie"
            value={formData.especie}
            onChange={handleChange}
            error={!!errors.especie}
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
          />
        )}

        <TextField
          label="Raza"
          variant="outlined"
          fullWidth
          name="raza"
          value={formData.raza}
          onChange={handleChange}
        />

        <FormControl fullWidth variant="outlined">
          <InputLabel>Sexo</InputLabel>
          <Select
            label="Sexo"
            name="sexo"
            value={formData.sexo}
            onChange={handleChange}
            error={!!errors.sexo}
          >
            <MenuItem value="M">Macho</MenuItem>
            <MenuItem value="H">Hembra</MenuItem>
          </Select>
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
          >
            Agregar Mascota
          </Button>
        </Stack>
      </form>
    </Box>
  );
};

export default CreatePet;
