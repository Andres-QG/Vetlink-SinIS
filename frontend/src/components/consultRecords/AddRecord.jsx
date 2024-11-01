import axios from "axios";
import { useState, useEffect, forwardRef } from "react";
import PropTypes from "prop-types";
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
  Healing as HealingIcon,
  Vaccines as VaccinesIcon,
  MedicationLiquid as TreatmentIcon,
  Pets as PetsIcon,
  MedicalInformation as MedicalInformationIcon,
} from "@mui/icons-material";
import { useAutocomplete } from "@mui/base/useAutocomplete";
import { styled } from "@mui/material/styles";
import CheckIcon from "@mui/icons-material/Check";
import { autocompleteClasses } from "@mui/material/Autocomplete";

const Root = styled("div")(
  ({ theme }) => `
  color: ${theme.palette.mode === "dark" ? "rgba(255,255,255,0.65)" : "rgba(0,0,0,.85)"};
  font-size: 14px;
`
);

const Label = styled("label")`
  padding: 0 0 4px;
  line-height: 1.5;
  display: block;
`;

const InputWrapper = styled("div")(
  ({ theme }) => `
  width: 300px;
  border: 1px solid ${theme.palette.mode === "dark" ? "#434343" : "#d9d9d9"};
  background-color: ${theme.palette.mode === "dark" ? "#141414" : "#fff"};
  border-radius: 4px;
  padding: 1px;
  display: flex;
  flex-wrap: wrap;

  &:hover {
    border-color: ${theme.palette.mode === "dark" ? "#177ddc" : "#40a9ff"};
  }

  &.focused {
    border-color: ${theme.palette.mode === "dark" ? "#177ddc" : "#40a9ff"};
    box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
  }

  & input {
    background-color: ${theme.palette.mode === "dark" ? "#141414" : "#fff"};
    color: ${theme.palette.mode === "dark" ? "rgba(255,255,255,0.65)" : "rgba(0,0,0,.85)"};
    height: 30px;
    box-sizing: border-box;
    padding: 4px 6px;
    width: 0;
    min-width: 30px;
    flex-grow: 1;
    border: 0;
    margin: 0;
    outline: 0;
  }
`
);

function Tag(props) {
  const { label, onDelete, ...other } = props;
  return (
    <div {...other}>
      <span>{label}</span>
      <CloseIcon onClick={onDelete} />
    </div>
  );
}

Tag.propTypes = {
  label: PropTypes.string.isRequired,
  onDelete: PropTypes.func.isRequired,
};

const StyledTag = styled(Tag)(
  ({ theme }) => `
  display: flex;
  align-items: center;
  height: 24px;
  margin: 2px;
  line-height: 22px;
  background-color: ${theme.palette.mode === "dark" ? "rgba(255,255,255,0.08)" : "#fafafa"};
  border: 1px solid ${theme.palette.mode === "dark" ? "#303030" : "#e8e8e8"};
  border-radius: 2px;
  box-sizing: content-box;
  padding: 0 4px 0 10px;
  outline: 0;
  overflow: hidden;

  &:focus {
    border-color: ${theme.palette.mode === "dark" ? "#177ddc" : "#40a9ff"};
    background-color: ${theme.palette.mode === "dark" ? "#003b57" : "#e6f7ff"};
  }

  & span {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  & svg {
    font-size: 12px;
    cursor: pointer;
    padding: 4px;
  }
`
);

const Listbox = styled("ul")(
  ({ theme }) => `
  width: 300px;
  margin: 2px 0 0;
  padding: 0;
  position: absolute;
  list-style: none;
  background-color: ${theme.palette.mode === "dark" ? "#141414" : "#fff"};
  overflow: auto;
  max-height: 250px;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 1;

  & li {
    padding: 5px 12px;
    display: flex;

    & span {
      flex-grow: 1;
    }

    & svg {
      color: transparent;
    }
  }

  & li[aria-selected='true'] {
    background-color: ${theme.palette.mode === "dark" ? "#2b2b2b" : "#fafafa"};
    font-weight: 600;

    & svg {
      color: #1890ff;
    }
  }

  & li.${autocompleteClasses.focused} {
    background-color: ${theme.palette.mode === "dark" ? "#003b57" : "#e6f7ff"};
    cursor: pointer;

    & svg {
      color: currentColor;
    }
  }
`
);

const AddRecord = forwardRef(({ open, handleClose, onSuccess }, ref) => {
  AddRecord.displayName = "AddRecord";
  const [formData, setFormData] = useState({
    mascota_id: "",
    fecha: "",
    peso: "",
    diagnostico: "",
    sintomas: "",
    vacunas: [],
    tratamientos: "",
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
      sintomas: formData.sintomas,
      vacunas: formData.vacunas.join(","),
      tratamientos: formData.tratamientos,
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
      sintomas: "",
      vacunas: [],
      tratamientos: "",
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

  const fetchVacunas = async (search) => {
    setLoadingVacunas(true);
    try {
      const response = await axios.get(
        `http://localhost:8000/api/consult-vaccines/?search=${search}`
      );
      setVacunas(response.data.results);
    } catch (error) {
      console.error("Error fetching vacunas:", error);
    }
    setLoadingVacunas(false);
  };

  useEffect(() => {
    fetchVacunas("");
  }, []);

  const {
    getRootProps,
    getInputLabelProps,
    getInputProps,
    getTagProps,
    getListboxProps,
    getOptionProps,
    groupedOptions,
    value,
    focused,
    setAnchorEl,
  } = useAutocomplete({
    id: "customized-hook-demo",
    multiple: true,
    options: vacunas,
    getOptionLabel: (option) => option.nombre,
    value: vacunas.filter((vacuna) => formData.vacunas.includes(vacuna.nombre)),
    onChange: (event, newValue) => {
      setFormData({
        ...formData,
        vacunas: newValue.map((vacuna) => vacuna.nombre),
      });
    },
  });

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

          <TextField
            label="Síntomas"
            variant="outlined"
            fullWidth
            name="sintomas"
            value={formData.sintomas}
            onChange={handleChange}
            error={!!errors.sintomas}
            helperText={errors.sintomas}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <HealingIcon />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
          />

          <Root>
            <div {...getRootProps()}>
              <Label {...getInputLabelProps()}>Vacunas*</Label>
              <InputWrapper
                ref={setAnchorEl}
                className={focused ? "focused" : ""}
              >
                {value.map((option, index) => {
                  const { key, ...tagProps } = getTagProps({ index });
                  return (
                    <StyledTag key={key} {...tagProps} label={option.nombre} />
                  );
                })}
                <input {...getInputProps()} />
              </InputWrapper>
            </div>
            {groupedOptions.length > 0 ? (
              <Listbox {...getListboxProps()}>
                {groupedOptions.map((option, index) => {
                  const { key, ...optionProps } = getOptionProps({
                    option,
                    index,
                  });
                  return (
                    <li key={key} {...optionProps}>
                      <span>{option.nombre}</span>
                      <CheckIcon fontSize="small" />
                    </li>
                  );
                })}
              </Listbox>
            ) : null}
          </Root>

          <TextField
            label="Tratamientos"
            variant="outlined"
            fullWidth
            name="tratamientos"
            value={formData.tratamientos}
            onChange={handleChange}
            error={!!errors.tratamientos}
            helperText={errors.tratamientos}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <TreatmentIcon />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
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
              onClick={handleSubmit}
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
