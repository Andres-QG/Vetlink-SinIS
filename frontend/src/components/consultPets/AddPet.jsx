import axios from "axios";
import { useState, forwardRef } from "react";
import PropTypes from "prop-types";
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
  Autocomplete,
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

const AddPet = forwardRef(
  ({ open, handleClose, onSuccess, otherData }, ref) => {
    AddPet.displayName = "AddPet";
    const [formData, setFormData] = useState({
      usuario_cliente: otherData?.user?.role === 4 ? otherData?.user?.role : "",
      nombre: "",
      edad: "",
      especie: "",
      raza: "",
      sexo: "M",
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

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        ...(name === "especie" && { raza: "" }), // Reset breed when species changes
      }));
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
        newErrors.especie = "Especie solo puede contener letras y espacios";
      }
      if (!/^[a-zA-ZáéíóúüÁÉÍÓÚÜ\s]+$/.test(formData.raza)) {
        newErrors.raza = "Raza solo puede contener letras y espacios";
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

    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
      e.preventDefault();
      if (!validateForm()) {
        return;
      }
      setLoading(true);

      const formDataToSend = prepareFormData();

      try {
        await sendFormData(formDataToSend);
      } catch (error) {
        handleError(error);
      }

      setLoading(false);
    };

    const prepareFormData = () => {
      return {
        usuario_cliente: formData.usuario_cliente,
        nombre: formData.nombre,
        edad: formData.edad,
        especie: formData.especie,
        raza: formData.raza || "-",
        sexo: formData.sexo,
      };
    };

    const sendFormData = async (formDataToSend) => {
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
        onSuccess("Mascota agregada exitosamente.", "success");
      }
    };

    const handleError = (error) => {
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
    };

    const handleClear = () => {
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

    return (
      <Modal open={open} onClose={handleClose}>
        <Box
          ref={ref}
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
            <Autocomplete
              options={otherData.clientes}
              getOptionLabel={(option) => option || ""}
              value={formData.usuario_cliente || ""}
              onChange={(event, newValue) =>
                setFormData({ ...formData, usuario_cliente: newValue })
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Usuario Cliente"
                  placeholder="Seleccione un cliente"
                  fullWidth
                  error={!!errors.usuario_cliente}
                  helperText={errors.usuario_cliente}
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon />
                      </InputAdornment>
                    ),
                    endAdornment: <>{params.InputProps.endAdornment}</>,
                  }}
                  sx={{ mb: 2 }}
                />
              )}
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
                helperText={errors.especie}
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
              fullWidth
              error={!!errors.raza}
              helperText={errors.raza}
              variant="outlined"
              sx={{ mb: 2 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <BreedIcon fontSize="small" />
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

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Sexo</InputLabel>
              <Select
                label="Sexo"
                name="sexo"
                value={formData.sexo}
                onChange={handleChange}
                error={!!errors.sexo}
                helperText={errors.sexo}
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
      </Modal>
    );
  }
);

AddPet.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
};

export default AddPet;
