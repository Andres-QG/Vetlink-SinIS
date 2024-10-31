import axios from "axios";
import { useState, useEffect, forwardRef } from "react";
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
import { LocalizationProvider, TimeField } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import {
  Close as CloseIcon,
  Today as TodayIcon,
  Business as ClinicIcon,
  Person as PersonIcon,
  AccessTime as TimeIcon,
} from "@mui/icons-material";
import dayjs from "dayjs";

const AddSchedule = forwardRef(({ open, handleClose, onSuccess }, ref) => {
  AddSchedule.displayName = "AddSchedule";
  const [formData, setFormData] = useState({
    usuario_veterinario: "",
    dia: "",
    hora_inicio: dayjs(),
    hora_fin: dayjs(),
    clinica_id: "",
  });

  const [veterinarios, setVeterinarios] = useState([]);
  const [clinicas, setClinicas] = useState([]);
  const [loadingVets, setLoadingVets] = useState(false);
  const [loadingClinics, setLoadingClinics] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (formData.usuario_veterinario.length > 2) {
      fetchVeterinarios(formData.usuario_veterinario);
    }
  }, [formData.usuario_veterinario]);

  const fetchVeterinarios = async (searchTerm) => {
    setLoadingVets(true);
    try {
      const response = await axios.get(
        `http://localhost:8000/api/autocomplete-vet/?search=${searchTerm}`
      );
      if (response.status === 200) {
        setVeterinarios(response.data || []);
      }
    } catch (error) {
      console.error("Error fetching veterinarios", error);
    }
    setLoadingVets(false);
  };

  const fetchClinics = async () => {
    setLoadingClinics(true);
    try {
      const response = await axios.get(
        "http://localhost:8000/api/consult-clinics/"
      );
      if (response.status === 200) {
        setClinicas(response.data.results || []); // Se ajusta al formato de paginación de la API
      }
    } catch (error) {
      console.error("Error fetching clinics", error);
    }
    setLoadingClinics(false);
  };

  useEffect(() => {
    fetchClinics();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleVetChange = (event, newValue) => {
    setFormData({
      ...formData,
      usuario_veterinario: newValue ? newValue.usuario : "",
    });
  };

  const handleClinicChange = (event) => {
    setFormData({
      ...formData,
      clinica_id: event.target.value,
    });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.usuario_veterinario) {
      newErrors.usuario_veterinario = "Usuario veterinario es obligatorio";
    }
    if (!formData.dia) {
      newErrors.dia = "Día es obligatorio";
    }
    if (!formData.hora_inicio) {
      newErrors.hora_inicio = "Hora de inicio es obligatoria";
    }
    if (!formData.hora_fin) {
      newErrors.hora_fin = "Hora de fin es obligatoria";
    }
    if (!formData.clinica_id) {
      newErrors.clinica_id = "ID de la clínica es obligatorio";
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
    console.log("Datos enviados:", formDataToSend);
  };

  const prepareFormData = () => {
    return {
      usuario_veterinario: formData.usuario_veterinario,
      dia: formData.dia,
      hora_inicio: formData.hora_inicio.format("HH:mm"),
      hora_fin: formData.hora_fin.format("HH:mm"),
      clinica_id: formData.clinica_id,
    };
  };

  const sendFormData = async (formDataToSend) => {
    const response = await axios.post(
      "http://localhost:8000/api/add-schedule/",
      formDataToSend,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status === 201) {
      onSuccess("Horario agregado exitosamente.", "success");
    }
  };

  const handleError = (error) => {
    if (error.response) {
      if (error.response.status === 404) {
        onSuccess("Usuario o clínica no encontrados.", "error");
      } else if (error.response.status === 400) {
        onSuccess(
          "Datos inválidos. Revise los campos e intente nuevamente.",
          "error"
        );
      } else if (error.response.status === 500) {
        onSuccess("Error interno del servidor. Inténtelo más tarde.", "error");
      }
    } else {
      onSuccess("Error desconocido. Inténtelo más tarde.", "error");
    }
  };

  const handleClear = () => {
    setFormData({
      usuario_veterinario: "",
      dia: "",
      hora_inicio: dayjs(),
      hora_fin: dayjs(),
      clinica_id: "",
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
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <h2>Agregar Horario</h2>
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Stack>

          <Autocomplete
            options={veterinarios}
            getOptionLabel={(option) =>
              `${option.usuario} - ${option.nombre} ${option.apellido1}`
            }
            onInputChange={(event, newValue) => {
              setFormData({ ...formData, usuario_veterinario: newValue });
            }}
            onChange={handleVetChange}
            loading={loadingVets}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Usuario Veterinario"
                variant="outlined"
                fullWidth
                error={!!errors.usuario_veterinario}
                helperText={errors.usuario_veterinario}
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <>
                      {loadingVets ? (
                        <CircularProgress color="inherit" size={20} />
                      ) : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
                sx={{ mb: 2 }}
              />
            )}
          />

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Clínica</InputLabel>
            <Select
              label="Clínica"
              name="clinica_id"
              value={formData.clinica_id}
              onChange={handleClinicChange}
              error={!!errors.clinica_id}
              MenuProps={{
                PaperProps: { style: { maxHeight: 200 } }, // Altura con scroll para ver 5 clínicas
              }}
              startAdornment={
                <InputAdornment position="start">
                  <ClinicIcon />
                </InputAdornment>
              }
            >
              {clinicas.map((clinica) => (
                <MenuItem key={clinica.clinica_id} value={clinica.clinica_id}>
                  {clinica.clinica}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Día</InputLabel>
            <Select
              label="Día"
              name="dia"
              value={formData.dia}
              onChange={handleChange}
              error={!!errors.dia}
              startAdornment={
                <InputAdornment position="start">
                  <TodayIcon />
                </InputAdornment>
              }
            >
              <MenuItem value="Lunes">Lunes</MenuItem>
              <MenuItem value="Martes">Martes</MenuItem>
              <MenuItem value="Miércoles">Miércoles</MenuItem>
              <MenuItem value="Jueves">Jueves</MenuItem>
              <MenuItem value="Viernes">Viernes</MenuItem>
              <MenuItem value="Sábado">Sábado</MenuItem>
              <MenuItem value="Domingo">Domingo</MenuItem>
            </Select>
          </FormControl>

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <TimeField
              label="Hora Inicio"
              value={formData.hora_inicio}
              onChange={(newValue) =>
                setFormData({ ...formData, hora_inicio: newValue })
              }
              format="HH:mm"
              fullWidth
              error={!!errors.hora_inicio}
              helperText={errors.hora_inicio}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <TimeIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
            />

            <TimeField
              label="Hora Fin"
              value={formData.hora_fin}
              onChange={(newValue) =>
                setFormData({ ...formData, hora_fin: newValue })
              }
              format="HH:mm"
              fullWidth
              error={!!errors.hora_fin}
              helperText={errors.hora_fin}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <TimeIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
            />
          </LocalizationProvider>

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
              {loading ? "Agregando..." : "Agregar Horario"}
            </Button>
          </Stack>
        </form>
      </Box>
    </Modal>
  );
});

AddSchedule.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
};

export default AddSchedule;
