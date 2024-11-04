import React from "react";
import { useState, forwardRef } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import Tag from "../Tag";
import {
  TextField,
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
} from "@mui/icons-material";

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

      if (!formData.mascota_id) {
        newErrors.mascota_id = "Nombre de mascota es obligatorio";
      }
      if (!formData.fecha) {
        newErrors.fecha = "Fecha es obligatoria";
      }
      if (!formData.peso || isNaN(formData.peso) || formData.peso <= 0) {
        newErrors.peso = "Por favor, introduzca un peso válido";
      }
      if (!formData.diagnostico) {
        newErrors.diagnostico = "Diagnóstico es obligatorio";
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
              <h2>Agrega Expediente</h2>
              <IconButton onClick={handleClose}>
                <CloseIcon />
              </IconButton>
            </Stack>

            <Autocomplete
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
                />
              )}
              ListboxProps={{
                style: {
                  maxHeight: "200px",
                  overflow: "auto",
                },
              }}
            />

            <TextField
              label="Fecha y hora de consulta*"
              type="datetime-local"
              variant="outlined"
              fullWidth
              name="fecha"
              value={formData.fecha}
              onChange={handleChange}
              error={!!errors.fecha}
              helperText={errors.fecha}
              InputLabelProps={{
                shrink: true,
              }}
              sx={{ mb: 2 }}
            />

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
              options={otherData.sintomas}
              getOptionLabel={(option) => option.nombre}
              value={otherData.sintomas.filter((sintoma) =>
                formData.sintomas.includes(sintoma.nombre)
              )}
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
                  label="Síntomas*"
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
              options={otherData.vacunas}
              getOptionLabel={(option) => option.nombre}
              value={otherData.vacunas.filter((vacuna) =>
                formData.vacunas.includes(vacuna.nombre)
              )}
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
                  label="Vacunas*"
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
              options={otherData.tratamientos}
              getOptionLabel={(option) => option.nombre}
              value={otherData.tratamientos.filter((tratamiento) =>
                formData.tratamientos.includes(tratamiento.nombre)
              )}
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
                  label="Tratamientos*"
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
    vacunas: PropTypes.string.isRequired,
    sintomas: PropTypes.string.isRequired,
    tratamientos: PropTypes.string.isRequired,
  }).isRequired,
};

export default AddRecord;
