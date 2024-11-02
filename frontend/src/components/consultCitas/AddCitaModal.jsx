import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  CircularProgress,
  InputAdornment,
  Autocomplete,
} from "@mui/material";
import {
  Close,
  Person as PersonIcon,
  HealthAndSafety as HealthAndSafetyIcon,
  AccessTime as AccessTimeIcon,
  LocalHospital as LocalHospitalIcon,
  Build as BuildIcon
} from "@mui/icons-material";
import Tag from "../Tag";
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import CorporateFareIcon from '@mui/icons-material/CorporateFare';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import axios from "axios";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { enGB } from "date-fns/locale";

const AddCitaModal = ({ open, handleClose, onSuccess }) => {
  const initialFormData = {
    cliente: null,
    veterinario: null,
    mascota: "",
    fecha: null,
    clinica: null,
    hora: "",
    motivo: "",
    services: [],
  };

  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [clientes, setClientes] = useState([]);
  const [veterinarios, setVeterinarios] = useState([]);
  const [horarios, setHorarios] = useState([]);
  const [clinicas, setClinicas] = useState([]);
  const [loadingClinics, setLoadingClinics] = useState([]);
  const [loadingClients, setLoadingClients] = useState(true);
  const [loadingVets, setLoadingVets] = useState(true);
  const [services, setServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingClients(true);
        setLoadingClinics(true);
        setLoadingVets(true);
        setLoadingServices(true);
        const [clientesResponse, veterinariosResponse, servicesResponse, clinicasResponse] = await Promise.all([
          axios.get("http://localhost:8000/api/get-clients/"),
          axios.get("http://localhost:8000/api/get-vets/"),
          axios.get("http://localhost:8000/api/get-services/"),
          axios.get("http://localhost:8000/api/get-clinics/"),
        ]);
        setClinicas(clinicasResponse.data.clinics || [])
        setClientes(clientesResponse.data.clients || []);
        setVeterinarios(veterinariosResponse.data.vets || []);
        setServices(servicesResponse.data.services || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoadingClients(false);
        setLoadingClinics(false);
        setLoadingVets(false);
        setLoadingServices(false);
      }
    };
    fetchData();
  }, []);

  // Function to retrive available times for the given params
  const fetchAvailableTimes = async () => {
    try {
      if (formData.cliente && formData.veterinario && formData.fecha) {
        const response = await axios.get("http://localhost:8000/api/get-available-times/", {
          params: {
            vet_user: formData.veterinario.veterinario,
            clinica_id: formData.clinica.clinica_id,
            full_date: formData.fecha,
          },
        });
        setHorarios(response.data.available_times || []);
      }
    } catch (error) {
      console.error("Error fetching available times:", error);
    }
  };

  const handleVetChange = async (event, newValue) => {
    setFormData({ ...formData, veterinario: newValue });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!validate()) {
      setLoading(false);
      return;
    }
    try {
      await axios.post("http://localhost:8000/api/add-cita/", formData);
      onSuccess("Cita agregada correctamente", "success");
      handleClose();
    } catch (error) {
      console.error(error);
      onSuccess("Error al agregar cita.", "error");
    } finally {
      setLoading(false);
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.cliente) newErrors.cliente = "Cliente requerido.";
    if (!formData.veterinario) newErrors.veterinario = "Veterinario requerido.";
    if (!formData.mascota) newErrors.mascota = "Mascota requerida.";
    if (!formData.fecha) newErrors.fecha = "Fecha requerida.";
    if (!formData.hora) newErrors.hora = "Hora requerida.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDateChange = (newDate) => {
    setFormData({ ...formData, fecha: newDate });
  };

  const handleClear = () => {
    setFormData(initialFormData);
    setErrors({});
  };

  return (
    <Modal open={open} onClose={handleClose} aria-labelledby="modal-title" aria-describedby="modal-description">
      <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: { xs: "90%", sm: "80%", md: 450 }, bgcolor: "background.paper", boxShadow: 24, p: 4, borderRadius: "10px" }}>
        <IconButton onClick={handleClose} sx={{ position: "absolute", top: 8, right: 8 }}>
          <Close />
        </IconButton>
        <form onSubmit={handleSubmit} className="w-full flex flex-col items-center">
          <Typography id="modal-title" variant="h6" component="h2" sx={{ textAlign: "center", marginBottom: "20px", fontWeight: "bold", color: "#333", borderBottom: "1px solid #ddd", paddingBottom: "10px" }}>
            Agregar Cita
          </Typography>

          <Autocomplete
            options={clientes}
            getOptionLabel={(option) => option.usuario || ""}
            value={formData.cliente}
            onChange={(event, newValue) => setFormData({ ...formData, cliente: newValue })}
            loading={loadingClients}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Cliente"
                placeholder="Seleccione un cliente"
                fullWidth
                error={!!errors.cliente}
                helperText={errors.cliente}
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon fontSize="small" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <>
                      {loadingClients ? <CircularProgress color="inherit" size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
                sx={{ mb: 2 }}
              />
            )}
            sx={{ width: "100%" }}
          />

          <Autocomplete
            options={veterinarios}
            getOptionLabel={(option) => option.usuario || ""}
            value={formData.veterinario}
            onChange={handleVetChange}
            loading={loadingVets}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Veterinario"
                placeholder="Seleccione un veterinario"
                fullWidth
                error={!!errors.veterinario}
                helperText={errors.veterinario}
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <InputAdornment position="start">
                      <HealthAndSafetyIcon fontSize="small" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <>
                      {loadingVets ? <CircularProgress color="inherit" size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
                sx={{ mb: 2 }}
              />
            )}
            sx={{ width: "100%" }}
          />

          <Autocomplete
            options={clinicas}
            getOptionLabel={(option) => option.nombre || ""}
            value={formData.clinica}
            onChange={handleChange}
            loading={loadingClinics}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Clínica"
                placeholder="Seleccione una clínica"
                fullWidth
                error={!!errors.veterinario}
                helperText={errors.veterinario}
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <InputAdornment position="start">
                      <CorporateFareIcon fontSize="small" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <>
                      {loadingVets ? <CircularProgress color="inherit" size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
                sx={{ mb: 2 }}
              />
            )}
            sx={{ width: "100%" }}
          /> 

          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={enGB}>
            <DatePicker
              label="Fecha"
              value={formData.fecha}
              onChange={handleDateChange}
              format="dd/MM/yyyy"
              slots={{ openPickerIcon: ArrowDropDownIcon }}
              slotProps={{
                textField: {
                  fullWidth: true,
                  required: true,
                  error: !!errors.fecha,
                  helperText: errors.fecha,
                  sx: { mb: 2 },
                  onClick: (event) => event.stopPropagation(),
                  InputProps: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <CalendarMonthRoundedIcon fontSize="small" />
                      </InputAdornment>
                    ),
                  },
                },
              }}
            />
          </LocalizationProvider>

          <Autocomplete
            multiple
            options={services}
            getOptionLabel={(option) => option.nombre}
            value={services.filter((service) => formData.services.includes(service.nombre))}
            onChange={(event, newValue) => {
              setFormData({
                ...formData,
                services: newValue.map((service) => service.nombre),
              });
            }}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Tag
                  key={option.nombre}
                  label={option.nombre}
                  {...getTagProps({ index })}
                />
              ))
            }
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                label="Servicios*"
                placeholder="Selecciona los servicios"
                error={!!errors.services}
                helperText={errors.services}
                InputProps = {{
                  ...params.InputProps,
                  startAdornment: (
                    <InputAdornment position="start">
                      <CorporateFareIcon fontSize="small" />
                    </InputAdornment>
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
            sx={{ width: "100%" }}
          />

          <TextField
            select
            fullWidth
            label="Hora"
            name="hora"
            value={formData.hora}
            onChange={handleChange}
            sx={{ mb: 2 }}
            required
            error={!!errors.hora}
            helperText={errors.hora}
            disabled={!formData.veterinario}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AccessTimeIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          >
            {horarios.map((hora) => (
              <MenuItem key={hora} value={hora}>
                Hola
              </MenuItem>
            ))}
          </TextField>

          <TextField
            fullWidth
            label="Motivo"
            name="motivo"
            value={formData.motivo}
            onChange={handleChange}
            sx={{ mb: 2 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LocalHospitalIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />

          <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
            <Button variant="outlined" onClick={handleClear} fullWidth disabled={loading} sx={{ borderColor: "#00308F", color: "#00308F", "&:hover": { color: "#00246d", borderColor: "#00246d" } }}>
              Limpiar
            </Button>
            <Button variant="contained" type="submit" fullWidth disabled={loading} startIcon={loading && <CircularProgress size={20} />} sx={{ minWidth: "160px", backgroundColor: "#00308F", "&:hover": { backgroundColor: "#00246d" } }}>
              {loading ? "Agregando..." : "Agregar Cita"}
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );

};

export default AddCitaModal;
