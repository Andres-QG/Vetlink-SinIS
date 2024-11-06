import React, { useState } from "react";
import {
  TextField,
  MenuItem,
  Button,
  Box,
  IconButton,
  CircularProgress,
  Modal,
  Typography,
  Divider,
  Stack,
  InputAdornment,
} from "@mui/material";
import {
  Close as CloseIcon,
  Pets as PetsIcon,
  CalendarMonthRounded as CalendarIcon,
  Badge as NameIcon,
  Male as MaleIcon,
  Female as FemaleIcon,
  PetsRounded as BreedIcon,
} from "@mui/icons-material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { es } from "date-fns/locale";
import dayjs from "dayjs";
import axios from "axios";
import PropTypes from "prop-types";

const AddMyPets = ({ open, handleClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    fecha_nacimiento: dayjs().format("YYYY-MM-DD"),
    especie: "",
    raza: "",
    sexo: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "especie" && { raza: "" }), // Resetear raza al cambiar especie
    }));
  };

  const handleDateChange = (date) => {
    const selectedDate = dayjs(date).format("YYYY-MM-DD");
    setFormData((prev) => ({
      ...prev,
      fecha_nacimiento: selectedDate,
    }));

    if (dayjs(selectedDate).isAfter(dayjs())) {
      setErrors((prev) => ({
        ...prev,
        fecha_nacimiento: "La fecha de nacimiento no puede ser futura",
      }));
    } else {
      setErrors((prev) => ({
        ...prev,
        fecha_nacimiento: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nombre) newErrors.nombre = "Nombre es obligatorio";
    if (!formData.fecha_nacimiento) {
      newErrors.fecha_nacimiento = "Fecha de nacimiento es obligatoria";
    } else if (dayjs(formData.fecha_nacimiento).isAfter(dayjs())) {
      // Validación adicional para fechas futuras
      newErrors.fecha_nacimiento = "La fecha de nacimiento no puede ser futura";
    }
    if (!formData.especie) newErrors.especie = "Especie es obligatoria";
    if (!formData.raza) newErrors.raza = "Raza es obligatoria";
    if (!formData.sexo) newErrors.sexo = "Sexo es obligatorio";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return; // Evita el envío si hay errores de validación

    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:8000/api/add-mypet/",
        {
          nombre: formData.nombre,
          fecha_nacimiento: formData.fecha_nacimiento,
          especie: formData.especie,
          raza: formData.raza,
          sexo: formData.sexo,
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (response.status === 201) {
        onSuccess("Mascota agregada exitosamente", "success");
        handleClose();
      }
    } catch (error) {
      const errorMessage =
        error.response && error.response.data && error.response.data.error
          ? error.response.data.error
          : "Error al agregar la mascota";
      onSuccess(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setFormData({
      nombre: "",
      fecha_nacimiento: dayjs().format("YYYY-MM-DD"),
      especie: "",
      raza: "",
      sexo: "",
    });
    setErrors({});
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          p: { xs: 2, sm: 3 },
          borderRadius: 2,
          boxShadow: 3,
          bgcolor: "#fff",
          width: "90%",
          maxWidth: "500px",
          mx: "auto",
        }}
      >
        <IconButton
          onClick={handleClose}
          sx={{ position: "absolute", top: "8px", right: "8px" }}
        >
          <CloseIcon />
        </IconButton>
        <Typography
          variant="h6"
          component="h2"
          sx={{
            textAlign: "center",
            fontWeight: "bold",
            color: "#333",
            mb: 1,
          }}
        >
          Agregar Mascota
        </Typography>
        <Divider sx={{ mb: 2 }} />

        <form onSubmit={handleSubmit}>
          <TextField
            label="Nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            fullWidth
            error={!!errors.nombre}
            helperText={errors.nombre}
            variant="outlined"
            sx={{ mb: 2 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <NameIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />

          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
            <DatePicker
              label="Fecha de Nacimiento"
              value={dayjs(formData.fecha_nacimiento).toDate()}
              onChange={handleDateChange}
              maxDate={dayjs().toDate()} // Restringir fecha futura
              slotProps={{
                openPickerButton: {
                  color: "standard",
                },
                inputAdornment: {
                  position: "start",
                  size: "small",
                },
                textField: {
                  fullWidth: true,
                  error: !!errors.fecha_nacimiento,
                  helperText: errors.fecha_nacimiento,
                  sx: { mb: 2 },
                },
              }}
            />
          </LocalizationProvider>

          <TextField
            select
            label="Especie"
            name="especie"
            value={formData.especie}
            onChange={handleChange}
            fullWidth
            error={!!errors.especie}
            helperText={errors.especie}
            variant="outlined"
            sx={{ mb: 2 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PetsIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          >
            {speciesOptions.map((species) => (
              <MenuItem key={species} value={species}>
                {species}
              </MenuItem>
            ))}
          </TextField>

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

          <TextField
            select
            label="Sexo"
            name="sexo"
            value={formData.sexo}
            onChange={handleChange}
            fullWidth
            error={!!errors.sexo}
            helperText={errors.sexo}
            variant="outlined"
            sx={{ mb: 2 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  {formData.sexo === "M" ? (
                    <MaleIcon fontSize="small" />
                  ) : (
                    <FemaleIcon fontSize="small" />
                  )}
                </InputAdornment>
              ),
            }}
          >
            <MenuItem value="M">Macho</MenuItem>
            <MenuItem value="H">Hembra</MenuItem>
          </TextField>

          <Stack
            direction="row"
            spacing={2}
            sx={{ justifyContent: "center", mx: "auto" }}
          >
            <Button
              variant="outlined"
              onClick={handleClear}
              fullWidth
              sx={{ borderColor: "#00308F", color: "#00308F" }}
            >
              Limpiar
            </Button>
            <Button
              variant="contained"
              type="submit"
              fullWidth
              disabled={loading}
              startIcon={loading && <CircularProgress size={20} />}
              sx={{
                backgroundColor: "#00308F",
                "&:hover": { backgroundColor: "#00246d" },
              }}
            >
              {loading ? "Agregando..." : "Agregar Mascota"}
            </Button>
          </Stack>
        </form>
      </Box>
    </Modal>
  );
};

AddMyPets.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
};

export default AddMyPets;
