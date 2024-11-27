import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Button,
  Stack,
  InputAdornment,
  TextField,
  Autocomplete,
  Divider,
  IconButton,
  CircularProgress,
  Modal,
} from "@mui/material";
import {
  Home as HomeIcon,
  Close as CloseIcon,
  LocationCity as LocationCityIcon,
  Public as PublicIcon,
  MailOutline as MailIcon,
  Person as PersonIcon,
  Payment as PaymentIcon,
} from "@mui/icons-material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { es } from "date-fns/locale";
import axios from "axios";
import dayjs from "dayjs";
import { useNotification } from "../Notification";

const ModifyPaymentMethod = ({
  open,
  handleClose,
  onSuccess,
  selectedItem,
}) => {
  const [form, setForm] = useState({
    direccion: "",
    provincia: "",
    pais: "",
    codigoPostal: "",
    nombreTitular: "",
    tipoTarjeta: "",
    fechaExpiracion: "",
  });

  const [errors, setErrors] = useState({});
  const [countries, setCountries] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [loadingCountries, setLoadingCountries] = useState(true);
  const [loadingProvinces, setLoadingProvinces] = useState(false);
  const [loading, setLoading] = useState(false);
  const showNotification = useNotification();

  const tipoTarjetaOptions = ["Crédito", "Débito"];

  useEffect(() => {
    if (selectedItem) {
      setForm({
        direccion: selectedItem.DIRECCION || "",
        provincia: selectedItem.PROVINCIA || "",
        pais: selectedItem.PAIS || "",
        codigoPostal: selectedItem.CODIGO_POSTAL || "",
        nombreTitular: selectedItem.NOMBRE_TITULAR || "",
        tipoTarjeta: selectedItem.TIPO_PAGO || "",
        fechaExpiracion: selectedItem.FECHA_EXPIRACION || "",
      });

      if (selectedItem.PAIS) {
        fetchProvinces(selectedItem.PAIS);
      }
    }
  }, [selectedItem]);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get("https://restcountries.com/v3.1/all");
        const countryList = response.data.map((country) => country.name.common);
        setCountries(countryList.sort());
      } catch (error) {
        console.error("Error fetching countries:", error);
      } finally {
        setLoadingCountries(false);
      }
    };
    fetchCountries();
  }, []);

  const fetchProvinces = async (country) => {
    setLoadingProvinces(true);
    try {
      const response = await axios.post(
        "https://countriesnow.space/api/v0.1/countries/states",
        { country }
      );
      const provinceList = response.data.data.states.map((state) => state.name);
      setProvinces(provinceList.sort());
    } catch (error) {
      console.error("Error fetching provinces:", error);
      setProvinces([]);
    } finally {
      setLoadingProvinces(false);
    }
  };

  const handleChange = (field, value) => {
    setForm((prevForm) => ({
      ...prevForm,
      [field]: value,
    }));
    setErrors((prevErrors) => ({ ...prevErrors, [field]: undefined }));

    if (field === "pais") {
      setProvinces([]);
      setForm((prevForm) => ({ ...prevForm, provincia: "" }));
      if (value) {
        fetchProvinces(value);
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.direccion) newErrors.direccion = "La dirección es obligatoria.";
    if (!form.provincia) newErrors.provincia = "La provincia es obligatoria.";
    if (!form.pais) newErrors.pais = "El país es obligatorio.";
    if (!form.codigoPostal || !/^\d{4,10}$/.test(form.codigoPostal))
      newErrors.codigoPostal =
        "El código postal debe contener entre 4 y 10 dígitos.";
    if (!form.nombreTitular)
      newErrors.nombreTitular = "El nombre del titular es obligatorio.";
    if (!form.tipoTarjeta)
      newErrors.tipoTarjeta = "El tipo de tarjeta es obligatorio.";
    if (!form.fechaExpiracion)
      newErrors.fechaExpiracion = "La fecha de expiración es obligatoria.";
    else if (dayjs(form.fechaExpiracion, "MM/YYYY").isBefore(dayjs(), "month"))
      newErrors.fechaExpiracion =
        "La fecha de expiración debe ser posterior a la fecha actual.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) return;

    const payload = {
      tipo_pago: form.tipoTarjeta,
      nombre_titular: form.nombreTitular,
      fecha_expiracion: form.fechaExpiracion,
      direccion: form.direccion,
      provincia: form.provincia,
      pais: form.pais,
      codigo_postal: form.codigoPostal,
    };

    try {
      setLoading(true);
      console.log("Datos enviados:", payload); // Para depuración
      const response = await axios.put(
        `http://localhost:8000/api/modify-payment-method/${selectedItem.METODO_PAGO_ID}/`,
        payload,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        onSuccess("Método de pago modificado exitosamente", "success");
        handleClose();
      }
    } catch (error) {
      console.error("Error al modificar el método de pago:", error);
      if (error.response) {
        console.error("Datos del error:", error.response.data);
        onSuccess(
          error.response.data.error || "Error desconocido al modificar.",
          "error"
        );
      } else {
        onSuccess("Error de conexión. Intente nuevamente.", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "90%",
          maxWidth: 600,
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
        }}
      >
        <IconButton
          onClick={handleClose}
          sx={{ position: "absolute", top: "8px", right: "8px" }}
          aria-label="Cerrar"
        >
          <CloseIcon />
        </IconButton>
        <Typography
          variant="h6"
          component="h2"
          sx={{ textAlign: "center", fontWeight: "bold", color: "#333", mb: 1 }}
        >
          Modificar Método de Pago
        </Typography>
        <Divider sx={{ mb: 2 }} />

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Dirección"
              value={form.direccion}
              onChange={(e) => handleChange("direccion", e.target.value)}
              error={!!errors.direccion}
              helperText={errors.direccion}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <HomeIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Autocomplete
              options={countries}
              loading={loadingCountries}
              value={form.pais}
              onChange={(event, newValue) => handleChange("pais", newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  label="País"
                  error={!!errors.pais}
                  helperText={errors.pais}
                  variant="outlined"
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: (
                      <InputAdornment position="start">
                        <PublicIcon />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <>
                        {loadingCountries ? (
                          <CircularProgress color="inherit" size={20} />
                        ) : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Autocomplete
              options={provinces}
              loading={loadingProvinces}
              value={form.provincia}
              onChange={(event, newValue) =>
                handleChange("provincia", newValue)
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  label="Provincia"
                  error={!!errors.provincia}
                  helperText={errors.provincia}
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: (
                      <InputAdornment position="start">
                        <LocationCityIcon />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <>
                        {loadingProvinces ? (
                          <CircularProgress color="inherit" size={20} />
                        ) : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Código Postal"
              value={form.codigoPostal}
              onChange={(e) => handleChange("codigoPostal", e.target.value)}
              error={!!errors.codigoPostal}
              helperText={errors.codigoPostal}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <MailIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Nombre del Titular"
              value={form.nombreTitular}
              onChange={(e) => handleChange("nombreTitular", e.target.value)}
              error={!!errors.nombreTitular}
              helperText={errors.nombreTitular}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Autocomplete
              options={tipoTarjetaOptions}
              value={form.tipoTarjeta}
              onChange={(event, newValue) =>
                handleChange("tipoTarjeta", newValue)
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  label="Tipo de Tarjeta"
                  error={!!errors.tipoTarjeta}
                  helperText={errors.tipoTarjeta}
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: (
                      <InputAdornment position="start">
                        <PaymentIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <LocalizationProvider
              dateAdapter={AdapterDateFns}
              adapterLocale={es}
            >
              <DatePicker
                label="Fecha de Expiración"
                views={["year", "month"]}
                value={dayjs(form.fechaExpiracion, "MM/YYYY").toDate()}
                minDate={dayjs().toDate()}
                format="MM/yyyy"
                onChange={(newValue) =>
                  handleChange(
                    "fechaExpiracion",
                    dayjs(newValue).format("MM/YYYY")
                  )
                }
                slotProps={{
                  openPickerButton: {
                    color: "standard",
                  },
                  inputAdornment: {
                    position: "start",
                    size: "small",
                  },
                  textField: {
                    fullWidth: true,
                    error: !!errors.fechaExpiracion,
                    helperText: errors.fechaExpiracion,
                  },
                }}
              />
            </LocalizationProvider>
          </Grid>
        </Grid>
        <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
          <Button
            variant="outlined"
            fullWidth
            onClick={handleClose}
            disabled={loading}
            sx={{ borderColor: "#00308F", color: "#00308F" }}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            fullWidth
            type="submit"
            disabled={loading}
            startIcon={loading && <CircularProgress size={20} />}
            sx={{
              backgroundColor: "#00308F",
              "&:hover": { backgroundColor: "#00246d" },
            }}
          >
            {loading ? "Guardando..." : "Guardar Cambios"}
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
};

export default ModifyPaymentMethod;
