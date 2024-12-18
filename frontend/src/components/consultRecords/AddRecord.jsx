import React, { useState, forwardRef } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import Tag from "../Tag";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import {
  TextField,
  Typography,
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
  MonitorWeight as MonitorWeightIcon,
  Pets as PetsIcon,
  MedicalInformation as MedicalInformationIcon,
  CalendarMonth as CalendarIcon,
} from "@mui/icons-material";
import dayjs from "dayjs";

const AddRecord = forwardRef(
  ({ open, handleClose, onSuccess, otherData }, ref) => {
    AddRecord.displayName = "AddRecord";
    const [formData, setFormData] = useState({
      mascota_id: "",
      fecha: "",
      peso: "",
      diagnostico: "",
      sintomas: [],
      vacunas: [],
      tratamientos: [],
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
      if (
        !formData.mascota_id ||
        isNaN(formData.mascota_id) ||
        Number(formData.mascota_id) <= 0
      ) {
        newErrors.mascota_id = "Por favor, introduzca un ID de mascota válido";
      }

      if (!formData.fecha) {
        newErrors.fecha = "Fecha es obligatoria";
      } else if (new Date(formData.fecha) > new Date()) {
        newErrors.fecha = "La fecha no puede ser en el futuro";
      }

      if (!formData.peso || isNaN(formData.peso) || formData.peso <= 0) {
        newErrors.peso = "Por favor, introduzca un peso válido";
      } else {
        const integerPart = formData.peso.toString().split(".")[0];
        if (integerPart.length > 4) {
          newErrors.peso = "El peso no puede tener más de 4 dígitos";
        }
      }

      if (!formData.diagnostico) {
        newErrors.diagnostico = "Diagnóstico es obligatorio";
      } else if (formData.diagnostico.length > 255) {
        newErrors.diagnostico =
          "El diagnóstico no puede exceder 255 caracteres";
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
        mascota_id: formData.mascota_id,
        fecha: formData.fecha,
        peso: formData.peso,
        diagnostico: formData.diagnostico,
        sintomas:
          formData.sintomas.length > 0 ? formData.sintomas.join(",") : "",
        vacunas: formData.vacunas.length > 0 ? formData.vacunas.join(",") : "",
        tratamientos:
          formData.tratamientos.length > 0
            ? formData.tratamientos.join(",")
            : "",
      };
    };

    const sendFormData = async (formDataToSend) => {
      const response = await axios.post(
        "http://localhost:8000/api/add-pet-record/",
        formDataToSend,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201) {
        onSuccess("Expediente agregado exitosamente.", "success");
      }
    };

    const handleError = (error) => {
      if (error.response) {
        console.error(error.response.data);
        if (error.response.status === 404) {
          onSuccess("Expediente no encontrado.", "error");
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
        mascota_id: "",
        fecha: "",
        peso: "",
        diagnostico: "",
        sintomas: [],
        vacunas: [],
        tratamientos: [],
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
            maxHeight: "90vh",
            overflowY: "auto",
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
              <Typography variant="h6">Agrega Expediente</Typography>
              <IconButton onClick={handleClose}>
                <CloseIcon />
              </IconButton>
            </Stack>

            <Autocomplete
              disablePortal
              options={otherData.mascotas}
              getOptionLabel={(option) =>
                `${option.mascota_id} - ${option.nombre} (dueño: ${option.usuario_cliente})`
              }
              onChange={(event, newValue) => {
                setFormData({
                  ...formData,
                  mascota_id: newValue ? newValue.mascota_id : "",
                });
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="ID de la mascota*"
                  variant="outlined"
                  fullWidth
                  name="mascota_id"
                  error={!!errors.mascota_id}
                  helperText={errors.mascota_id}
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: (
                      <InputAdornment position="start">
                        <PetsIcon />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 2 }}
                  inputProps={{
                    ...params.inputProps,
                    "data-testid": "mascotaid-input",
                  }}
                />
              )}
              ListboxProps={{
                style: {
                  maxHeight: "200px",
                  overflow: "auto",
                },
              }}
            />

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                label="Fecha y hora de consulta*"
                value={formData.fecha ? dayjs(formData.fecha) : null}
                onChange={(newValue) => {
                  setFormData({
                    ...formData,

                    fecha: newValue ? newValue.format("YYYY-MM-DDTHH:mm") : "",
                  });
                }}
                slots={{
                  openPickerIcon: CalendarIcon,
                }}
                slotProps={{
                  textField: {
                    variant: "outlined",

                    fullWidth: true,

                    error: !!errors.fecha,

                    helperText: errors.fecha,
                  },

                  openPickerButton: {
                    sx: { marginLeft: 0, marginRight: "10px", order: -1 },
                  },
                }}
                sx={{ mb: 2, width: "100%" }}
                timeSteps={{ minutes: 5 }}
              />
            </LocalizationProvider>

            <TextField
              label="Peso (Kg)*"
              variant="outlined"
              fullWidth
              name="peso"
              value={formData.peso}
              onChange={handleChange}
              error={!!errors.peso}
              helperText={errors.peso}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <MonitorWeightIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
            />

            <TextField
              label="Diagnóstico*"
              variant="outlined"
              fullWidth
              name="diagnostico"
              value={formData.diagnostico}
              onChange={handleChange}
              error={!!errors.diagnostico}
              helperText={errors.diagnostico}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <MedicalInformationIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
            />

            <Autocomplete
              multiple
              options={
                Array.isArray(otherData.sintomas) ? otherData.sintomas : []
              }
              getOptionLabel={(option) => option.nombre}
              value={
                Array.isArray(otherData.sintomas)
                  ? otherData.sintomas.filter((sintoma) =>
                      formData.sintomas.includes(sintoma.nombre)
                    )
                  : []
              }
              onChange={(event, newValue) => {
                setFormData({
                  ...formData,
                  sintomas: newValue.map((sintoma) => sintoma.nombre),
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
                  label="Síntomas"
                  placeholder="Selecciona síntomas"
                  error={!!errors.sintomas}
                  helperText={errors.sintomas}
                  InputProps={{
                    ...params.InputProps,
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

            <Autocomplete
              multiple
              options={
                Array.isArray(otherData.vacunas) ? otherData.vacunas : []
              }
              getOptionLabel={(option) => option.nombre}
              value={
                Array.isArray(otherData.vacunas)
                  ? otherData.vacunas.filter((vacuna) =>
                      formData.vacunas.includes(vacuna.nombre)
                    )
                  : []
              }
              onChange={(event, newValue) => {
                setFormData({
                  ...formData,
                  vacunas: newValue.map((vacuna) => vacuna.nombre),
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
                  label="Vacunas"
                  placeholder="Selecciona vacunas"
                  error={!!errors.vacunas}
                  helperText={errors.vacunas}
                  InputProps={{
                    ...params.InputProps,
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

            <Autocomplete
              multiple
              options={
                Array.isArray(otherData.tratamientos)
                  ? otherData.tratamientos
                  : []
              }
              getOptionLabel={(option) => option.nombre}
              value={
                Array.isArray(otherData.tratamientos)
                  ? otherData.tratamientos.filter((tratamiento) =>
                      formData.tratamientos.includes(tratamiento.nombre)
                    )
                  : []
              }
              onChange={(event, newValue) => {
                setFormData({
                  ...formData,
                  tratamientos: newValue.map(
                    (tratamiento) => tratamiento.nombre
                  ),
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
                  label="Tratamientos"
                  placeholder="Selecciona tratamientos"
                  error={!!errors.tratamientos}
                  helperText={errors.tratamientos}
                  InputProps={{
                    ...params.InputProps,
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
                type="submit"
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
                {loading ? "Agregando..." : "Agregar Expediente"}
              </Button>
            </Stack>
          </form>
        </Box>
      </Modal>
    );
  }
);

AddRecord.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
  otherData: PropTypes.shape({
    mascotas: PropTypes.array.isRequired,
    vacunas: PropTypes.array.isRequired,
    sintomas: PropTypes.array.isRequired,
    tratamientos: PropTypes.array.isRequired,
  }).isRequired,
};

export default AddRecord;
