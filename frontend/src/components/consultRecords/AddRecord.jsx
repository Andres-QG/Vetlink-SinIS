import axios from "axios";
import { useState, useEffect, forwardRef } from "react";
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

const AddRecord = forwardRef(({ open, handleClose, onSuccess }, ref) => {
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
    if (!formData.sintomas) {
      newErrors.sintomas = "Síntomas son obligatorios";
    }
    if (!formData.vacunas.length) {
      newErrors.vacunas = "Vacunas son obligatorias";
    }
    if (!formData.tratamientos) {
      newErrors.tratamientos = "Tratamientos son obligatorios";
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
      sintomas: formData.sintomas.join(","),
      vacunas: formData.vacunas.join(","),
      tratamientos: formData.tratamientos.join(","),
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
      if (error.response.status === 404) {
        onSuccess("Expediente no encontrado.", "error");
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

  const [mascotas, setMascotas] = useState([]);
  const [loadingMascotas, setLoadingMascotas] = useState(false);

  const fetchMascotas = async (search) => {
    setLoadingMascotas(true);
    try {
      const response = await axios.get(
        `http://localhost:8000/api/consult-mascotas/?search=${search}`
      );
      setMascotas(response.data.results);
    } catch (error) {
      console.error("Error fetching mascotas:", error);
    }
    setLoadingMascotas(false);
  };

  useEffect(() => {
    if (formData.mascota_id) {
      fetchMascotas(formData.mascota_id);
    }
  }, [formData.mascota_id]);

  const [vacunas, setVacunas] = useState([]);
  const [loadingVacunas, setLoadingVacunas] = useState(false);

  useEffect(() => {
    fetchVacunas("");
  }, []);

  useEffect(() => {
    fetchMascotas("");
  }, []);

  const fetchVacunas = async (search) => {
    setLoadingVacunas(true);
    try {
      const response = await axios.get(
        `http://localhost:8000/api/consult-vaccines/?search=${search}`
      );
      setVacunas(response.data);
      console.log("Search: ", search);
      console.log("Vacunas: ", response.data);
    } catch (error) {
      console.error("Error fetching vacunas:", error);
      setVacunas([]); // Asegurarse de que vacunas esté vacío en caso de error
      onSuccess("Error al cargar las vacunas. Inténtelo más tarde.", "error");
    }
    setLoadingVacunas(false);
  };

  const [sintomas, setSintomas] = useState([]);
  const [loadingSintomas, setLoadingSintomas] = useState(false);

  useEffect(() => {
    fetchSintomas("");
  }, []);
  const fetchSintomas = async (search) => {
    setLoadingSintomas(true);
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/consult-symptoms/?search=${search}`
      );
      setSintomas(response.data);
    } catch (error) {
      console.error("Error fetching sintomas:", error);
      setSintomas([]);
      onSuccess("Error al cargar los síntomas. Inténtelo más tarde.", "error");
    }
    setLoadingSintomas(false);
  };

  const [tratamientos, setTratamientos] = useState([]);
  const [loadingTratamientos, setLoadingTratamientos] = useState(false);

  const fetchTratamientos = async (search) => {
    setLoadingTratamientos(true);
    try {
      const response = await axios.get(
        `http://localhost:8000/api/consult-treatments/?search=${search}`
      );
      setTratamientos(response.data);
    } catch (error) {
      console.error("Error fetching tratamientos:", error);
      setTratamientos([]);
      onSuccess(
        "Error al cargar los tratamientos. Inténtelo más tarde.",
        "error"
      );
    }
    setLoadingTratamientos(false);
  };

  useEffect(() => {
    fetchTratamientos("");
  }, []);

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
            <h2>Agregar Expediente</h2>
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Stack>

          <Autocomplete
            options={mascotas}
            getOptionLabel={(option) => option.mascota_id.toString()}
            loading={loadingMascotas}
            onInputChange={(event, newInputValue) => {
              fetchMascotas(newInputValue);
            }}
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
                  endAdornment: (
                    <>
                      {loadingMascotas ? (
                        <CircularProgress color="inherit" size={20} />
                      ) : null}
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
            options={sintomas}
            getOptionLabel={(option) => option.nombre}
            value={sintomas.filter((sintoma) =>
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
                  endAdornment: (
                    <>
                      {loadingSintomas ? (
                        <CircularProgress color="inherit" size={20} />
                      ) : null}
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

          <Autocomplete
            multiple
            options={vacunas}
            getOptionLabel={(option) => option.nombre}
            value={vacunas.filter((vacuna) =>
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
                  endAdornment: (
                    <>
                      {loadingVacunas ? (
                        <CircularProgress color="inherit" size={20} />
                      ) : null}
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

          <Autocomplete
            multiple
            options={tratamientos}
            getOptionLabel={(option) => option.nombre}
            value={tratamientos.filter((tratamiento) =>
              formData.tratamientos.includes(tratamiento.nombre)
            )}
            onChange={(event, newValue) => {
              setFormData({
                ...formData,
                tratamientos: newValue.map((tratamiento) => tratamiento.nombre),
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
                  endAdornment: (
                    <>
                      {loadingTratamientos ? (
                        <CircularProgress color="inherit" size={20} />
                      ) : null}
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
});

AddRecord.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
};

export default AddRecord;
