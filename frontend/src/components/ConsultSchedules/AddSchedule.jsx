import axios from "axios";
import { useState, useEffect, forwardRef, useContext } from "react";
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
  Typography,
  Divider,
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
import { AuthContext } from "../../context/AuthContext";

const AddSchedule = forwardRef(({ open, handleClose, onSuccess }, ref) => {
  const { role } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    usuario_veterinario: "",
    dia: "",
    hora_inicio: dayjs(),
    hora_fin: dayjs(),
    clinica_id: "",
  });
  const [veterinarios, setVeterinarios] = useState([]);
  const [clinicas, setClinicas] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadingVets, setLoadingVets] = useState(false);
  const [loadingClinic, setLoadingClinic] = useState(false);
  const [autocompleteValue, setAutocompleteValue] = useState(null);

  useEffect(() => {
    if (formData.usuario_veterinario.length >= 0) fetchVeterinarios();
  }, [formData.usuario_veterinario]);

  useEffect(() => {
    if (role === 2) {
      fetchAdminClinic();
    } else {
      fetchAllClinics();
    }
  }, [role]);

  const fetchVeterinarios = async () => {
    setLoadingVets(true);
    try {
      const { data } = await axios.get(
        `http://localhost:8000/api/autocomplete-vet/?search=${formData.usuario_veterinario}`
      );
      setVeterinarios(data || []);
    } catch (error) {
      console.error("Error fetching veterinarios", error);
    } finally {
      setLoadingVets(false);
    }
  };

  const fetchAllClinics = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:8000/api/consult-clinics/"
      );
      setClinicas(data.results || []);
    } catch (error) {
      console.error("Error fetching clinics", error);
    }
  };

  const fetchAdminClinic = async () => {
    setLoadingClinic(true);
    try {
      const { data } = await axios.get(
        "http://localhost:8000/api/get-admin-clinic/",
        { withCredentials: true }
      );
      setClinicas([data]);
      setFormData((prev) => ({ ...prev, clinica_id: data.clinica_id }));
    } catch (error) {
      console.error("Error fetching admin clinic", error);
    } finally {
      setLoadingClinic(false);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleVetChange = (event, newValue) => {
    setAutocompleteValue(newValue);
    setFormData((prev) => ({
      ...prev,
      usuario_veterinario: newValue ? newValue.usuario : "",
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.usuario_veterinario)
      newErrors.usuario_veterinario = "Usuario veterinario es obligatorio";
    if (!formData.dia) newErrors.dia = "Día es obligatorio";
    if (!formData.hora_inicio)
      newErrors.hora_inicio = "Hora de inicio es obligatoria";
    if (!formData.hora_fin) newErrors.hora_fin = "Hora de fin es obligatoria";
    if (!formData.clinica_id)
      newErrors.clinica_id = "ID de la clínica es obligatorio";
    if (formData.hora_inicio.isAfter(formData.hora_fin))
      newErrors.hora_fin =
        "La hora de fin debe ser posterior a la hora de inicio";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    const formDataToSend = {
      usuario_veterinario: formData.usuario_veterinario,
      dia: formData.dia,
      hora_inicio: formData.hora_inicio.format("HH:mm"),
      hora_fin: formData.hora_fin.format("HH:mm"),
      clinica_id: formData.clinica_id,
    };

    try {
      const { status } = await axios.post(
        "http://localhost:8000/api/add-schedule/",
        formDataToSend,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      if (status === 201)
        onSuccess("Horario agregado exitosamente.", "success");
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleError = (error) => {
    const { status, data } = error.response || {};

    if (status === 500 && data?.error) {
      // Extraer solo la primera línea o la parte de "ORA-20001"
      const shortError = data.error.includes("ORA-20001")
        ? "Conflicto de horarios detectado."
        : data.error.split("\n")[0];

      // Mostrar el error general sin asociarlo a un campo específico
      onSuccess(shortError, "error");
    } else {
      onSuccess(
        data?.error || "Error desconocido. Inténtelo más tarde.",
        "error"
      );
    }
  };

  const handleClear = () => {
    setAutocompleteValue(null); // Limpiar Autocomplete
    setFormData((prev) => ({
      ...prev,
      usuario_veterinario: "",
      dia: "",
      hora_inicio: dayjs(),
      hora_fin: dayjs(),
      ...(role !== 2 && { clinica_id: "" }),
    }));
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
          id="modal-title"
          variant="h6"
          component="h2"
          sx={{
            textAlign: "center",
            fontWeight: "bold",
            color: "#333",
            mb: 1,
          }}
        >
          Agregar Horario
        </Typography>
        <Divider sx={{ mb: 2 }} />

        <form onSubmit={handleSubmit}>
          <Autocomplete
            options={veterinarios}
            getOptionLabel={(option) =>
              `${option.usuario} - ${option.nombre} ${option.apellido1}`
            }
            onInputChange={(event, newValue) => {
              setFormData((prev) => ({
                ...prev,
                usuario_veterinario: newValue,
              }));
            }}
            onChange={handleVetChange}
            value={autocompleteValue} // Aplicar el estado para limpiar Autocomplete
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
                      {loadingVets && (
                        <CircularProgress color="inherit" size={20} />
                      )}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
                sx={{ mb: 2 }}
              />
            )}
            ListboxProps={{
              style: {
                maxHeight: "200px",
                overflow: "auto",
              },
            }}
          />

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Clínica</InputLabel>
            <Select
              label="Clínica"
              name="clinica_id"
              value={formData.clinica_id}
              onChange={handleChange}
              error={!!errors.clinica_id}
              startAdornment={
                <InputAdornment position="start">
                  <ClinicIcon />
                </InputAdornment>
              }
              MenuProps={{
                PaperProps: { style: { maxHeight: 200 } },
              }}
              disabled={role === 2}
            >
              {loadingClinic ? (
                <MenuItem disabled>
                  <CircularProgress size={20} />
                </MenuItem>
              ) : (
                clinicas.map((clinica) => (
                  <MenuItem key={clinica.clinica_id} value={clinica.clinica_id}>
                    {clinica.clinica}
                  </MenuItem>
                ))
              )}
            </Select>
            {!!errors.clinica_id && (
              <Typography color="error" variant="caption">
                {errors.clinica_id}
              </Typography>
            )}
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
              {[
                "Lunes",
                "Martes",
                "Miércoles",
                "Jueves",
                "Viernes",
                "Sábado",
                "Domingo",
              ].map((day) => (
                <MenuItem key={day} value={day}>
                  {day}
                </MenuItem>
              ))}
            </Select>
            {!!errors.dia && (
              <Typography color="error" variant="caption">
                {errors.dia}
              </Typography>
            )}
          </FormControl>

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <TimeField
              label="Hora Inicio"
              value={formData.hora_inicio}
              onChange={(newValue) =>
                setFormData((prev) => ({ ...prev, hora_inicio: newValue }))
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
                setFormData((prev) => ({ ...prev, hora_fin: newValue }))
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
              onClick={handleSubmit}
              fullWidth
              disabled={loading}
              startIcon={loading && <CircularProgress size={20} />}
              sx={{
                backgroundColor: "#00308F",
                "&:hover": { backgroundColor: "#00246d" },
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

AddSchedule.displayName = "AddSchedule";

AddSchedule.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
};

export default AddSchedule;
