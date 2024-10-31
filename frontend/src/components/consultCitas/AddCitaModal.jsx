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
  MenuItem,
  Autocomplete,
} from "@mui/material";
import { Close, Person, HealthAndSafety, AccessTime, LocalHospital } from "@mui/icons-material";
import axios from "axios";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

const AddCitaModal = ({ open, handleClose, onSuccess }) => {
  const initialFormData = {
    cliente: "",
    veterinario: "",
    mascota: "",
    fecha: null,
    hora: "",
    motivo: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [clientes, setClientes] = useState([]);
  const [veterinarios, setVeterinarios] = useState([]);
  const [loadingClients, setLoadingClients] = useState(true);
  const [loadingVets, setLoadingVets] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingClients(true);
        setLoadingVets(true);

        const [clientesResponse, veterinariosResponse] = await Promise.all([
          axios.get("http://localhost:8000/api/get-clients/"),
          axios.get("http://localhost:8000/api/get-vets/"),
        ]);

        setClientes(clientesResponse.data.clients || []);
        setVeterinarios(veterinariosResponse.data.vets || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoadingClients(false);
        setLoadingVets(false);
      }
    };
    fetchData();
  }, []);

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
      setLoading(false);
      handleClose();
    } catch (error) {
      console.log(error);
      onSuccess("Error al agregar cita.", "error");
      setLoading(false);
      handleClose();
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
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
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
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "90%", sm: "80%", md: 450 },
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: "10px",
        }}
      >
        <IconButton onClick={handleClose} sx={{ position: "absolute", top: 8, right: 8 }}>
          <Close />
        </IconButton>

        <form onSubmit={handleSubmit} className="w-full flex flex-col items-center">
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
             Agregar Cita
           </Typography>

           <Autocomplete
             options={clientes}
             getOptionLabel={(option) => `${option.usuario ? option.usuario : ""}`}
             value={formData.cliente}
             onChange={(event, newValue) =>
               setFormData({ ...formData, cliente: newValue ? newValue.usuario : "" })
             }
             loading={loadingClients}
             renderInput={(params) => (
               <TextField
                 {...params}
                 label="Cliente"
                 variant="outlined"
                 placeholder="Seleccione un cliente"
                 fullWidth
                 error={!!errors.cliente}
                 helperText={errors.cliente}
                 InputProps={{
                   ...params.InputProps,
                   startAdornment: (
                     <InputAdornment position="start">
                       <Person />
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
             getOptionLabel={(option) => `${option.usuario ? option.usuario : ""}`}
             value={formData.veterinario}
             onChange={(event, newValue) =>
               setFormData({ ...formData, veterinario: newValue ? newValue.usuario : "" })
             }
             loading={loadingVets}
             renderInput={(params) => (
               <TextField
                 {...params}
                 label="Veterinario"
                 placeholder="Seleccione un veterinario"
                 variant="outlined"
                 fullWidth
                 error={!!errors.veterinario}
                 helperText={errors.veterinario}
                 InputProps={{
                   ...params.InputProps,
                   startAdornment: (
                     <InputAdornment position="start">
                       <HealthAndSafety />
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



           <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Fecha"
              value={formData.fecha}
              onChange={handleDateChange}
              slotProps={{
                textField: {
                  fullWidth: true,
                  required: true,
                  error: !!errors.fecha,
                  helperText: errors.fecha,
                  sx: { mb: 2 },
                },
              }}
            />
          </LocalizationProvider>

          <TextField
            fullWidth
            label="Hora"
            name="hora"
            value={formData.hora}
            onChange={handleChange}
            sx={{ mb: 2 }}
            required
            error={!!errors.hora}
            helperText={errors.hora}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AccessTime />
                </InputAdornment>
              ),
            }}
          />

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
                  <LocalHospital />
                </InputAdornment>
              ),
            }}
          />

          <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
            <Button
              variant="outlined"
              onClick={handleClear}
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
              {loading ? "Agregando..." : "Agregar Cita"}
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

export default AddCitaModal;
