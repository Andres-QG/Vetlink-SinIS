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
  MenuItem,
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
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import BorderColorIcon from '@mui/icons-material/BorderColor';
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
  const [mascotas, setMascotas] = useState([]);
  const [veterinarios, setVeterinarios] = useState([]);
  const [horarios, setHorarios] = useState([]);
  const [clinicas, setClinicas] = useState([]);
  const [loadingClinics, setLoadingClinics] = useState([]);
  const [loadingClients, setLoadingClients] = useState(true);
  const [loadingVets, setLoadingVets] = useState(true);
  const [services, setServices] = useState([]);
  const [loadingTimes, setLoadingTimes] = useState(true); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingClients(true);
        setLoadingClinics(true);
        setLoadingVets(true);
        const [clientesResponse, veterinariosResponse, servicesResponse, clinicasResponse] = await Promise.all([
          axios.get("http://localhost:8000/api/get-clients/"),
          axios.get("http://localhost:8000/api/get-vets/"),
          axios.get("http://localhost:8000/api/get-services/"),
          axios.get("http://localhost:8000/api/get-clinics/"),
        ]);
        setServices(servicesResponse.data.services || [])
        setClinicas(clinicasResponse.data.clinics || [])
        setClientes(clientesResponse.data.clients || [])
        setVeterinarios(veterinariosResponse.data.vets || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoadingClients(false);
        setLoadingClinics(false);
        setLoadingVets(false);
      }
    };
    fetchData();
  }, []);

  // Function to retrive available times for the given params
  const fetchAvailableTimes = async () => {
    try {
      if (formData.clinica?.clinica_id && formData.veterinario && formData.fecha) {
        setLoadingTimes(true);
        const formattedDate = formData.fecha.toISOString().split("T")[0];
        console.log(formData.clinica?.clinica_id, formData.veterinario, formData.fecha)

        const response = await axios.put("http://localhost:8000/api/get-disp-times/", {
          vet_user: formData.veterinario.usuario,
          clinica_id: formData.clinica?.clinica_id,
          full_date: formattedDate,
        });
        console.log(response.data.available_times)
        setHorarios(response.data.available_times || []);
      }
    } catch (error) {
      console.error("Error fetching available times:", error);
    } finally {
      setLoadingTimes(false)
    }
  };

  useEffect(() => {
    if (formData.clinica?.clinica_id && formData.veterinario && formData.fecha) {
      fetchAvailableTimes();
    }
  }, [formData.clinica?.clinica_id, formData.veterinario, formData.fecha]);

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
            options={clinicas}
            getOptionLabel={(option) => option.nombre || ""}
            value={formData.clinica}
            onChange={(event, newValue) => setFormData({ ...formData, clinica: newValue })}
            loading={loadingClinics}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Clínica"
                placeholder="Seleccione una mascota"
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

          <Autocomplete
            options={veterinarios}
            getOptionLabel={(option) => option.usuario || ""}
            value={formData.veterinario}
            onChange={(event, newValue) => setFormData({ ...formData, veterinario: newValue })}
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
            onChange={(event, newValue) => setFormData({ ...formData, clinica: newValue })}
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
            getOptionLabel={(option) => option.nombre || ""}
            value={formData.services}
            onChange={(event, newValue) => {
              setFormData({
                ...formData,
                services: newValue,
              });
            }}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => {
                // Use a unique identifier, such as option.id, or fallback to a unique combination if id is not available
                const uniqueKey = option.id || `${option.nombre}-${index}`;
                const { key, ...tagProps } = getTagProps({ index });
                return (
                  <Tag
                    key={uniqueKey} // Apply a unique key directly here
                    label={option.nombre}
                    {...tagProps} // Spread the remaining props
                  />
                );
              })
            }
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                label="Servicios*"
                placeholder="Selecciona los servicios"
                error={!!errors.services}
                helperText={errors.services}
                InputProps={{
                  ...params.InputProps,
                  // startAdornment:
                  //   <InputAdornment className='absolute' position="start" sx={{ display: 'flex', alignItems: 'center' }}>
                  //     <MedicalServicesIcon fontSize="small" />
                  //   </InputAdornment>
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
            disabled={loadingTimes}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AccessTimeIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
            MenuProps={{
              PaperProps: {
                style: {
                  maxHeight: 200, // Adjust this height if necessary
                  top: '100%', // Positions the menu directly below the field
                },
              },
            }}
          >
            {horarios.map((hora) => (
              <MenuItem key={hora} value={hora}>
                {hora}
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
                  <BorderColorIcon fontSize="small" />
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
