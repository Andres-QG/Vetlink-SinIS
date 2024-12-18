import React, { useState, useEffect, forwardRef, useRef } from "react";
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
  Pets as PetsIcon,
  CalendarMonthRounded as CalendarMonthRoundedIcon,
  BorderColor as BorderColorIcon,
  CorporateFare as CorporateFareIcon,
  ArrowDropDown as ArrowDropDownIcon,
} from "@mui/icons-material";
import Tag from "../Tag";
import dayjs from "dayjs";
import { parseISO } from "date-fns";
import axios from "axios";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { es } from "date-fns/locale";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

const ModifyCitaModal = forwardRef(
  ({ open, handleClose, onSuccess, otherData, selectedItem = {} }, ref) => {
    const getDefaultValue = (options, key, value) => {
      if (!options || !Array.isArray(options)) return null;
      return options.find((option) => option[key] === value) || null;
    };

    const initialFecha = selectedItem.fecha
      ? parseISO(selectedItem.fecha)
      : null;

    const initialFormData = {
      cliente:
        getDefaultValue(
          otherData.clientes,
          "usuario",
          selectedItem.cliente_usuario
        ) || "",
      veterinario:
        getDefaultValue(
          otherData.veterinarios,
          "usuario",
          selectedItem.veterinario_usuario
        ) || "",
      clinica:
        getDefaultValue(
          otherData.clinicas,
          "clinica_id",
          selectedItem.clinica_id
        ) || "",
      mascota:
        {
          nombre: selectedItem.mascota,
          mascota_id: selectedItem.mascota_id,
        } || null,
      fecha: initialFecha,
      hora: selectedItem.hora || "",
      motivo: selectedItem.motivo || "",
      services: selectedItem.services || [],
    };

    const initialDataRef = useRef(initialFormData);

    const [formData, setFormData] = useState(initialFormData);
    const [horarios, setHorarios] = useState([]);
    const [loadingTimes, setLoadingTimes] = useState(true);
    const [errors, setErrors] = useState({});
    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(false);
    const [loadingPets, setLoadingPets] = useState(true);
    const [pets, setPets] = useState([]);

    useEffect(() => {
      setUser(otherData.user);
    }, [otherData]);

    const isSameDate = (date1, date2) => {
      if (!date1 || !date2) return false;
      return date1.toISOString().split("T")[0] === date2.toISOString().split("T")[0];
    };

    const fetchAvailableTimes = async () => {
      if (formData.fecha) {
        console.log(true)
      }
      
      try {
        if (formData.veterinario && formData.clinica && formData.fecha) {
          setLoadingTimes(true);
          const formattedDate = formData.fecha.toISOString().split("T")[0];

          const response = await axios.put(
            "http://localhost:8000/api/get-disp-times/",
            {
              vet_user: formData.veterinario.usuario,
              clinica_id: formData.clinica?.clinica_id,
              full_date: formattedDate,
            }
          );

          let availableTimes = response.data.available_times || [];

          if (isSameDate(formData.fecha, initialFormData.fecha)) {
            if (
              initialFormData.hora &&
              !availableTimes.includes(initialFormData.hora)
            ) {
              availableTimes.push(initialFormData.hora);
              availableTimes.sort();
            }
          } else {
            setFormData((prevData) => ({ ...prevData, hora: "" }));
          }

          setHorarios(availableTimes);
        } else {
          setHorarios([]);
          setFormData((prevData) => ({ ...prevData, hora: "" }));
          setLoadingTimes(true);
        }
      } catch (error) {
        console.error("Error fetching available times:", error);
      } finally {
        setLoadingTimes(false);
      }
    };

    useEffect(() => {
      if (formData.clinica && formData.veterinario && formData.fecha) {
        fetchAvailableTimes();
      } else {
        setHorarios([]);
        setFormData((prevData) => ({ ...prevData, hora: "" }));
        setLoadingTimes(true);
      }
    }, [formData.clinica, formData.veterinario, formData.fecha]);

    useEffect(() => {
      const fetchPets = async () => {
        if (formData.cliente) {
          setLoadingPets(true);
          try {
            const response = await axios.put(
              "http://localhost:8000/api/get-pets/",
              {
                cliente: formData.cliente.usuario,
              }
            );
            setPets(response.data.pets || []);
          } catch (error) {
            console.error("Error fetching pets:", error);
          } finally {
            setLoadingPets(false);
          }
        } else {
          setPets([]);
          setLoadingPets(true);
        }
      };

      fetchPets();
    }, [formData.cliente]);

    const handleReset = () => {
      setFormData(initialFormData);
      fetchAvailableTimes();
      setErrors({});
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      if (!validate()) {
        setLoading(false);
        return;
      }
      try {
        const dataToSend = {
          cliente: formData.cliente,
          veterinario: formData.veterinario,
          mascota: formData.mascota,
          clinica: formData.clinica,
          fecha: formData.fecha,
          hora: formData.hora,
          motivo: formData.motivo,
          services: formData.services,
        };

        await axios.post(
          `http://localhost:8000/api/update-cita/${selectedItem.cita_id}/`,
          dataToSend
        );
        onSuccess("Cita modificada correctamente", "success");
        handleClose();
      } catch (error) {
        onSuccess("Error al modificar cita.", "error");
      }
      setLoading(false);
    };

    const validate = () => {
      const newErrors = {};
      if (!formData.cliente) newErrors.cliente = "Cliente requerido.";
      if (!formData.veterinario)
        newErrors.veterinario = "Veterinario requerido.";
      if (!formData.mascota) newErrors.mascota = "Mascota requerida.";
      if (!formData.fecha) newErrors.fecha = "Fecha requerida.";
      if (!formData.hora) newErrors.hora = "Hora requerida.";
      if (!formData.clinica) newErrors.clinica = "Clínica requerida.";
      if (formData.services.length === 0)
        newErrors.services = "Al menos un servicio es requerido.";
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    // Function used to set the client as the default value
    useEffect(() => {
      if (user.role === 4) {
        const matchingClient = otherData.clientes.find(
          (client) => client.usuario === user.user
        );
        if (matchingClient) {
          setFormData((prevData) => ({
            ...prevData,
            cliente: matchingClient,
          }));
        }
      }
    }, [user, otherData.clientes]);

    return (
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full sm:w-4/5 md:w-[650px] bg-white shadow-lg p-6 rounded-lg"
          sx={{
            maxHeight: { xs: "90vh", sm: "auto" },
            overflowY: { xs: "auto", sm: "unset" },
          }}
        >
          <IconButton
            onClick={handleClose}
            sx={{ position: "absolute", top: 8, right: 8 }}
          >
            <Close />
          </IconButton>
          <form
            onSubmit={handleSubmit}
            className="w-full flex flex-col items-center"
            noValidate
          >
            <Typography
              id="modal-title"
              variant="h6"
              component="h2"
              sx={{
                textAlign: "center",
                marginBottom: "20px",
                fontWeight: "bold",
                color: "#333",
                borderBottom: "1px solid #ddd",
                paddingBottom: "10px",
              }}
            >
              Modificar Cita
            </Typography>

            <div className="flex flex-col md:flex-row gap-0 md:gap-6 w-full">
              <div className="w-full md:w-1/2">
                <Autocomplete
                  options={otherData.clientes || []}
                  getOptionLabel={(option) => option.usuario || ""}
                  value={formData.cliente || null}
                  onChange={(event, newValue) =>
                    setFormData({ ...formData, cliente: newValue })
                  }
                  disabled={user.role === 4}
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
                      }}
                      sx={{ mb: 2 }}
                    />
                  )}
                />

                <Autocomplete
                  options={pets || []}
                  getOptionLabel={(option) => option.nombre || ""}
                  value={formData.mascota || null}
                  onChange={(event, newValue) =>
                    setFormData({ ...formData, mascota: newValue })
                  }
                  disabled={loadingPets}
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
                      }}
                      sx={{ mb: 2 }}
                    />
                  )}
                />

                <Autocomplete
                  multiple
                  options={otherData.services || []}
                  getOptionLabel={(option) => option.nombre || ""}
                  value={formData.services || []}
                  isOptionEqualToValue={(option, value) =>
                    option.servicio_id === value.servicio_id
                  }
                  onChange={(event, newValue) => {
                    const uniqueServices = newValue.filter(
                      (service, index, self) =>
                        index ===
                        self.findIndex(
                          (s) => s.servicio_id === service.servicio_id
                        )
                    );
                    setFormData({ ...formData, services: uniqueServices });
                  }}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => {
                      const { key, ...tagProps } = getTagProps({ index });
                      return (
                        <Tag
                          key={option.id || `${option.nombre}-${index}`}
                          label={option.nombre}
                          {...tagProps}
                        />
                      );
                    })
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      label="Servicios*"
                      placeholder={
                        formData.services.length === 0
                          ? "Selecciona los servicios"
                          : ""
                      }
                      error={!!errors.services}
                      helperText={errors.services}
                      sx={{
                        mb: 2,
                        "& input": {
                          display:
                            formData.services.length > 0 ? "none" : "block",
                          width:
                            formData.services.length > 0 ? "0" : "auto",
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
                  value={formData.motivo || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, motivo: e.target.value })
                  }
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

              <div className="w-full md:w-1/2">
                <Autocomplete
                  options={otherData.veterinarios || []}
                  getOptionLabel={(option) => option.usuario || ""}
                  value={formData.veterinario || null}
                  onChange={(event, newValue) =>
                    setFormData({ ...formData, veterinario: newValue })
                  }
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
                      }}
                      sx={{ mb: 2 }}
                    />
                  )}
                />

                <Autocomplete
                  options={otherData.clinicas || []}
                  getOptionLabel={(option) => option.nombre || ""}
                  value={formData.clinica || null}
                  onChange={(event, newValue) =>
                    setFormData({ ...formData, clinica: newValue })
                  }
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
                      }}
                      sx={{ mb: 2 }}
                    />
                  )}
                />

                <LocalizationProvider
                  dateAdapter={AdapterDateFns}
                  adapterLocale={es}
                >
                  <DatePicker
                    label="Fecha"
                    value={formData.fecha || null}
                    onChange={(newDate) => setFormData({ ...formData, fecha: newDate || null })}
                    minDate={new Date()}
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
                  onChange={(e) =>
                    setFormData({ ...formData, hora: e.target.value })
                  }
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
                      {loadingTimes
                        ? "Cargando horarios..."
                        : "No hay horarios disponibles"}
                    </MenuItem>
                  )}
                </TextField>
              </div>
            </div>

            <Box className="w-full" sx={{ display: "flex", gap: 2, mt: 2 }}>
              <Button
                variant="outlined"
                onClick={handleReset}
                fullWidth
                disabled={loading}
                sx={{
                  borderColor: "#00308F",
                  color: "#00308F",
                  "&:hover": { color: "#00246d", borderColor: "#00246d" },
                }}
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
                  minWidth: "160px",
                  backgroundColor: "#00308F",
                  "&:hover": { backgroundColor: "#00246d" },
                }}
              >
                {loading ? "Modificando..." : "Modificar Cita"}
              </Button>
            </Box>
          </form>
        </Box>
      </Modal>
    );
  }
);

export default ModifyCitaModal;
