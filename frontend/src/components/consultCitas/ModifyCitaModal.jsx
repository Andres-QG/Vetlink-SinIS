import React, { useState, useEffect, forwardRef } from "react";
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
  Build as BuildIcon,
  Pets as PetsIcon,
  CalendarMonthRounded as CalendarMonthRoundedIcon,
  BorderColor as BorderColorIcon,
  CorporateFare as CorporateFareIcon,
  ArrowDropDown as ArrowDropDownIcon,
} from "@mui/icons-material";
import Tag from "../Tag";
import { parseISO, isValid } from "date-fns";
import axios from "axios";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { enGB } from "date-fns/locale";

const ModifyCitaModal = forwardRef(
  ({ open, handleClose, onSuccess, otherData, selectedItem = {} }, ref) => {
    const initialFormData = {
      cliente: selectedItem.cliente || null,
      veterinario: selectedItem.veterinario || null,
      mascota: selectedItem.mascota || "",
      fecha: selectedItem.fecha || null,
      clinica: selectedItem.clinica || null,
      hora: selectedItem.hora || "",
      motivo: selectedItem.motivo || "",
      services: selectedItem.services || [],
    };
     
    console.log(selectedItem)

    const [formData, setFormData] = useState(initialFormData);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [clientes, setClientes] = useState([]);
    const [pets, setPets] = useState([]);
    const [veterinarios, setVeterinarios] = useState([]);
    const [horarios, setHorarios] = useState([]);
    const [clinicas, setClinicas] = useState([]);
    const [loadingClinics, setLoadingClinics] = useState([]);
    const [loadingClients, setLoadingClients] = useState(true);
    const [loadingVets, setLoadingVets] = useState(true);
    const [services, setServices] = useState([]);
    const [loadingTimes, setLoadingTimes] = useState(true);
    const [loadingPets, setLoadingPets] = useState(false);
    const [user, setUser] = useState({});

    useEffect(() => {
      if (otherData) {
        setClientes(otherData.clientes || []);
        setPets(otherData.pets || []);
        setVeterinarios(otherData.veterinarios || []);
        setHorarios(otherData.horarios || []);
        setClinicas(otherData.clinicas || []);
        setServices(otherData.services || []);
        setUser(otherData.user || {});

        setLoadingClinics(false);
        setLoadingClients(false);
        setLoadingVets(false);
        setLoadingTimes(false);
        setLoadingPets(false);
      }
    }, [otherData]);

    useEffect(() => {
      if (user.clinica && !formData.clinica) {
        setFormData((prevData) => ({
          ...prevData,
          clinica: clinicas.find((clinic) => clinic.clinica_id === user.clinica) || null,
        }));
      }
    }, [user, clinicas]);

    useEffect(() => {
      const fetchPets = async () => {
        if (formData.cliente) {
          setLoadingPets(true);
          try {
            const response = await axios.put("http://localhost:8000/api/get-pets/", {
              cliente: formData.cliente.usuario,
            });
            setPets(response.data.pets || []);
          } catch (error) {
            console.error("Error fetching pets:", error);
          } finally {
            setLoadingPets(false);
          }
        } else {
          setPets([]);
        }

        // Reset pet field to null if cliente changes
        setFormData((prevData) => ({ ...prevData, pet: null }));
      };

      fetchPets();
    }, [formData.cliente]);



    const fetchAvailableTimes = async () => {
      try {
        if (formData.veterinario && formData.clinica && formData.fecha) {
          setLoadingTimes(true);
          const formattedDate = formData.fecha.toISOString().split("T")[0];

          const response = await axios.put("http://localhost:8000/api/get-disp-times/", {
            vet_user: formData.veterinario.usuario,
            clinica_id: formData.clinica?.clinica_id,
            full_date: formattedDate,
          });
          setHorarios(response.data.available_times || []);
        }
      } catch (error) {
        console.error("Error fetching available times:", error);
      } finally {
        setLoadingTimes(false)
      }
    };

    useEffect(() => {
      if (formData.clinica && formData.veterinario && formData.fecha) {
        fetchAvailableTimes();
      } else {
        setHorarios([]);
        setFormData((prevData) => ({ ...prevData, hora: "" }));
        setLoadingTimes(true)
      }
    }, [formData.clinica, formData.veterinario, formData.fecha]);

    useEffect(() => {
      if (user.clinica) {
        const clinic = clinicas.find((clinic) => clinic.clinica_id === user.clinica) || null;
        setFormData((prevData) => ({
          ...prevData,
          clinica: clinic,
        }));
      }
    }, [user.clinica, clinicas, setFormData]);

    const handleSubmit = async (e) => {
      e.preventDefault(); // Prevent the default HTML5 validation
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
      if (!formData.clinica) newErrors.clinica = "Clínica requerida.";
      if (formData.services.length === 0) newErrors.services = "Al menos un servicio es requerido.";
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    return (
      <Modal open={open} onClose={handleClose} aria-labelledby="modal-title" aria-describedby="modal-description">
        <Box
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full sm:w-4/5 md:w-[650px] bg-white shadow-lg p-6 rounded-lg"
          sx={{
            maxHeight: { xs: "90vh", sm: "auto" },
            overflowY: { xs: "auto", sm: "unset" },
          }}
        >
          <IconButton onClick={handleClose} sx={{ position: "absolute", top: 8, right: 8 }}>
            <Close />
          </IconButton>
          <form onSubmit={handleSubmit} className="w-full flex flex-col items-center" noValidate>
            <Typography id="modal-title" variant="h6" component="h2" sx={{ textAlign: "center", marginBottom: "20px", fontWeight: "bold", color: "#333", borderBottom: "1px solid #ddd", paddingBottom: "10px" }}>
              Modificar Cita
            </Typography>

            <div className="flex flex-col md:flex-row gap-0 md:gap-10 w-full">
              {/* Left Column */}
              <div className="w-full md:w-1/2">
                <Autocomplete
                  options={clientes}
                  getOptionLabel={(option) => option.usuario || ""}
                  value={formData.cliente || ""}
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
                />

                <Autocomplete
                  options={pets}
                  getOptionLabel={(option) => option.nombre || ""}
                  value={formData.mascota || ""}
                  onChange={(event, newValue) => setFormData({ ...formData, mascota: newValue })}
                  loading={loadingPets}
                  disabled={!formData.cliente}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Mascota"
                      placeholder="Seleccione una mascota"
                      fullWidth
                      error={!!errors.mascota}
                      helperText={errors.mascota}
                      InputProps={{
                        ...params.InputProps,
                        startAdornment: (
                          <InputAdornment position="start">
                            <PetsIcon fontSize="small" />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <>
                            {loadingPets ? <CircularProgress color="inherit" size={21} /> : null}
                            {params.InputProps.endAdornment}
                          </>
                        ),
                      }}
                      sx={{ mb: 2 }}
                    />
                  )}
                />

                <Autocomplete
                  multiple
                  options={services}
                  getOptionLabel={(option) => option.nombre || ""}
                  value={formData.services || ""}
                  onChange={(event, newValue) => {
                    setFormData({ ...formData, services: newValue });
                  }}
                  renderTags={(value, getTagProps) => (
                    <div
                      style={{
                        minHeight: "39px",
                        maxHeight: "39px",
                        overflowY: "auto",
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "4px",
                        scrollbarWidth: "none",
                      }}
                    >
                      {value.map((option, index) => (
                        <Tag
                          key={option.id || `${option.nombre}-${index}`}
                          label={option.nombre}
                          {...getTagProps({ index })}
                        />
                      ))}
                    </div>
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      label="Servicios*"
                      placeholder={formData.services.length === 0 ? "Selecciona los servicios" : ""}
                      error={!!errors.services}
                      helperText={errors.services}
                      sx={{
                        mb: 2,
                        // Hide input field when tags are present
                        "& input": {
                          display: formData.services.length > 0 ? "none" : "block",
                          width: formData.services.length > 0 ? "0" : "auto",
                        },
                      }}
                    />
                  )}
                  ListboxProps={{
                    style: {
                      maxHeight: "200px",
                      overflow: "auto",
                    },
                  }}
                  sx={{
                    width: "100%",
                  }}
                />

                <TextField
                  fullWidth
                  label="Motivo"
                  name="motivo"
                  value={formData.motivo}
                  onChange={(e) => setFormData({ ...formData, motivo: e.target.value })}
                  sx={{ mb: 2 }}
                  error={!!errors.motivo}
                  helperText={errors.motivo}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <BorderColorIcon fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                />
              </div>

              {/* Right Column */}
              <div className="w-full md:w-1/2">
                <Autocomplete
                  options={veterinarios}
                  getOptionLabel={(option) => option.usuario || ""}
                  value={formData.veterinario || ""}
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
                />

                <Autocomplete
                  options={clinicas}
                  getOptionLabel={(option) => option.nombre || ""}
                  value={formData.clinica || ""}
                  onChange={(event, newValue) => setFormData({ ...formData, clinica: newValue })}
                  loading={loadingClinics}
                  disabled={!!user.clinica}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Clínica"
                      placeholder="Seleccione una clínica"
                      fullWidth
                      error={!!errors.clinica}
                      helperText={errors.clinica}
                      InputProps={{
                        ...params.InputProps,
                        startAdornment: (
                          <InputAdornment position="start">
                            <CorporateFareIcon fontSize="small" />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <>
                            {loadingClinics ? <CircularProgress color="inherit" size={20} /> : null}
                            {params.InputProps.endAdornment}
                          </>
                        ),
                      }}
                      sx={{ mb: 2 }}
                    />
                  )}
                />

                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={enGB}>
                  <DatePicker
                    label="Fecha"
                    value={formData.fecha || null}
                    onChange={(newDate) => setFormData({ ...formData, fecha: isValid(newDate) ? newDate : null })}
                    slots={{ openPickerIcon: ArrowDropDownIcon }}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        required: true,
                        error: !!errors.fecha,
                        helperText: errors.fecha,
                        sx: { mb: 2 },
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

                <TextField
                  select
                  fullWidth
                  label="Hora"
                  name="hora"
                  value={formData.hora || ""}
                  onChange={(e) => setFormData({ ...formData, hora: e.target.value })}
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
                >
                  {horarios.length > 0 ? (
                    horarios.map((hora) => (
                      <MenuItem key={hora} value={hora}>
                        {hora}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem value="" disabled>
                      No hay horarios disponibles
                    </MenuItem>
                  )}
                </TextField>
              </div>
            </div>

            <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
              <Button variant="outlined" onClick={() => { setFormData(initialFormData); setErrors({}); }} fullWidth disabled={loading} sx={{ borderColor: "#00308F", color: "#00308F", "&:hover": { color: "#00246d", borderColor: "#00246d" } }}>
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
  }
);

export default ModifyCitaModal;
