import React, { useState, useEffect, forwardRef } from "react";
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
  CalendarMonth as CalendarIcon,
} from "@mui/icons-material";

const ModifyRecord = forwardRef(
  ({ open, handleClose, onSuccess, selectedItem, otherData }, ref) => {
    ModifyRecord.displayName = "ModifyRecord";
    const [formData, setFormData] = useState({
      mascota_id: selectedItem?.mascota_id || "",
      fecha: selectedItem?.fecha || "",
      peso: selectedItem?.peso || "",
      diagnostico: selectedItem?.diagnostico || "",
      sintomas: selectedItem?.sintomas || [],
      vacunas: selectedItem?.vacunas || [],
      tratamientos: selectedItem?.tratamientos || [],
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [isModified, setIsModified] = useState(false);

    useEffect(() => {
      if (selectedItem) {
        const parseStringToArray = (str) =>
          Array.isArray(str)
            ? str
            : str
              ? str.split(",").map((item) => item.trim())
              : [];

        setFormData({
          mascota_id: selectedItem.mascota_id,
          fecha: selectedItem.fecha,
          peso: selectedItem.peso,
          diagnostico: selectedItem.diagnostico,
          sintomas: parseStringToArray(selectedItem.sintomas),
          vacunas: parseStringToArray(selectedItem.vacunas),
          tratamientos: parseStringToArray(selectedItem.tratamientos),
        });
      }
    }, [selectedItem]);

    const handleChange = (e) => {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
      setIsModified(true);
    };

    const validateForm = () => {
      const newErrors = {};
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
        sintomas: formData.sintomas.join(","),
        vacunas: formData.vacunas.join(","),
        tratamientos: formData.tratamientos.join(","),
      };
    };

    const sendFormData = async (formDataToSend) => {
      const response = await axios.put(
        `http://localhost:8000/api/update-pet-record/${selectedItem.mascota_id}/${selectedItem.consulta_id}/`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        onSuccess("Expediente modificado exitosamente.", "success");
      }
    };

    const handleError = (error) => {
      if (error.response) {
        console.error("Error: ", error.response.data);
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
        peso: "",
        diagnostico: "",
        sintomas: [],
        vacunas: [],
        tratamientos: [],
      });
      setErrors({});
      setIsModified(false);
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
              <h2>Modifica Expediente</h2>
              <IconButton onClick={handleClose}>
                <CloseIcon />
              </IconButton>
            </Stack>
            <TextField
              label="ID de la mascota*"
              variant="outlined"
              fullWidth
              name="mascota_id"
              value={formData.mascota_id}
              error={!!errors.mascota_id}
              helperText={errors.mascota_id}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PetsIcon />
                  </InputAdornment>
                ),
                readOnly: true,
              }}
              disabled
              sx={{ mb: 2 }}
            />
            <TextField
              label="Fecha y hora de consulta*"
              type="datetime-local"
              variant="outlined"
              fullWidth
              name="fecha"
              value={formData.fecha}
              onChange={() => {}}
              error={!!errors.fecha}
              helperText={errors.fecha}
              InputLabelProps={{
                shrink: true,
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <CalendarIcon />
                  </InputAdornment>
                ),
                readOnly: true,
              }}
              disabled
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
                setIsModified(true);
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
                setIsModified(true);
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
                setIsModified(true);
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
                disabled={loading || !isModified}
                startIcon={loading && <CircularProgress size={20} />}
                sx={{
                  backgroundColor: "#00308F",
                  "&:hover": {
                    backgroundColor: "#00246d",
                  },
                }}
              >
                {loading ? "Modificando..." : "Modificar Expediente"}
              </Button>
            </Stack>
          </form>
        </Box>
      </Modal>
    );
  }
);

ModifyRecord.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
  selectedItem: PropTypes.object.isRequired,
  otherData: PropTypes.shape({
    mascotas: PropTypes.array.isRequired,
    vacunas: PropTypes.array.isRequired,
    sintomas: PropTypes.array.isRequired,
    tratamientos: PropTypes.array.isRequired,
  }).isRequired,
};

export default ModifyRecord;
