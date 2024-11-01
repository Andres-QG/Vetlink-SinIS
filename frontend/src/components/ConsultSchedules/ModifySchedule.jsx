// Importaciones necesarias
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

// Definición del componente ModifySchedule
const ModifySchedule = forwardRef(
  ({ open, handleClose, onSuccess, selectedItem }, ref) => {
    const { role } = useContext(AuthContext);

    // Estado inicial del formulario, prellenado con los datos de selectedItem
    const [formData, setFormData] = useState({
      horario_id: selectedItem?.horario_id || "",
      usuario_veterinario: selectedItem?.usuario_veterinario || "",
      dia: selectedItem?.dia || "",
      hora_inicio: selectedItem?.hora_inicio
        ? dayjs(selectedItem.hora_inicio, "HH:mm")
        : dayjs(),
      hora_fin: selectedItem?.hora_fin
        ? dayjs(selectedItem.hora_fin, "HH:mm")
        : dayjs(),
      clinica_id: selectedItem?.clinica_id || "",
    });

    const [veterinarios, setVeterinarios] = useState([]);
    const [clinicas, setClinicas] = useState([]);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [loadingVets, setLoadingVets] = useState(false);
    const [loadingClinic, setLoadingClinic] = useState(false);
    const [autocompleteValue, setAutocompleteValue] = useState(null);

    // Efecto para cargar veterinarios al montar el componente
    useEffect(() => {
      fetchVeterinarios();
    }, []);

    // Efecto para cargar clínicas según el rol
    useEffect(() => {
      if (role === 2) {
        fetchAdminClinic();
      } else {
        fetchAllClinics();
      }
    }, [role]);

    // Efecto para prellenar el Autocomplete con el veterinario seleccionado
    useEffect(() => {
      if (selectedItem) {
        setAutocompleteValue({
          usuario: selectedItem.usuario_veterinario,
          nombre: selectedItem.nombre_veterinario || "",
          apellido1: "", // Puedes agregar apellido si está disponible
        });
      }
    }, [selectedItem]);

    // Función para obtener la lista de veterinarios
    const fetchVeterinarios = async () => {
      setLoadingVets(true);
      try {
        const { data } = await axios.get(
          "http://localhost:8000/api/autocomplete-vet/"
        );
        setVeterinarios(data || []);
      } catch (error) {
        console.error("Error fetching veterinarios", error);
      } finally {
        setLoadingVets(false);
      }
    };

    // Función para obtener todas las clínicas
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

    // Función para obtener la clínica del administrador
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

    // Manejador de cambios en los campos del formulario
    const handleChange = (e) => {
      setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    // Manejador de cambios en el Autocomplete de veterinarios
    const handleVetChange = (event, newValue) => {
      setAutocompleteValue(newValue);
      setFormData((prev) => ({
        ...prev,
        usuario_veterinario: newValue ? newValue.usuario : "",
      }));
    };

    // Función de validación del formulario
    const validateForm = () => {
      const newErrors = {};
      if (!formData.usuario_veterinario)
        newErrors.usuario_veterinario = "Usuario veterinario es obligatorio";

      // Validar que el usuario veterinario existe en la lista de veterinarios
      const usuarioExiste = veterinarios.some(
        (vet) => vet.usuario === formData.usuario_veterinario
      );
      if (!usuarioExiste) {
        newErrors.usuario_veterinario = "Seleccione un veterinario válido.";
      }

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

    // Manejador de envío del formulario
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
        const { status } = await axios.put(
          `http://localhost:8000/api/modify-vet-schedule/${formData.horario_id}/`,
          formDataToSend,
          {
            headers: { "Content-Type": "application/json" },
          }
        );
        if (status === 200)
          onSuccess("Horario modificado exitosamente.", "success");
      } catch (error) {
        handleError(error);
      } finally {
        setLoading(false);
        handleClose();
      }
    };

    // Manejador de errores en la solicitud
    const handleError = (error) => {
      const { status, data } = error.response || {};

      if (status === 500 && data?.error) {
        const shortError = data.error.includes("ORA-20001")
          ? "Conflicto de horarios detectado."
          : data.error.split("\n")[0];

        onSuccess(shortError, "error");
      } else {
        onSuccess(
          data?.error || "Error desconocido. Inténtelo más tarde.",
          "error"
        );
      }
    };

    // Función para limpiar el formulario
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

    // Renderización del componente
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
          {/* Botón para cerrar el modal */}
          <IconButton
            onClick={handleClose}
            sx={{ position: "absolute", top: "8px", right: "8px" }}
          >
            <CloseIcon />
          </IconButton>

          {/* Título del modal */}
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
            Modificar Horario
          </Typography>
          <Divider sx={{ mb: 2 }} />

          {/* Formulario */}
          <form onSubmit={handleSubmit}>
            {/* Campo de Autocomplete para veterinarios */}
            <Autocomplete
              options={veterinarios}
              getOptionLabel={(option) =>
                `${option.usuario} - ${option.nombre} ${option.apellido1 || ""}`
              }
              onChange={handleVetChange}
              value={autocompleteValue}
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

            {/* Campo de selección de clínica */}
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
                    <MenuItem
                      key={clinica.clinica_id}
                      value={clinica.clinica_id}
                    >
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

            {/* Campo de selección de día */}
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

            {/* Campos de hora de inicio y fin */}
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

            {/* Botones de acción */}
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
                {loading ? "Modificando..." : "Modificar Horario"}
              </Button>
            </Stack>
          </form>
        </Box>
      </Modal>
    );
  }
);

// Definición del displayName para el componente
ModifySchedule.displayName = "ModifySchedule";

// Validación de PropTypes
ModifySchedule.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
  selectedItem: PropTypes.object.isRequired,
};

// Exportación del componente
export default ModifySchedule;
