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
  CircularProgress,
} from "@mui/material";
import {
  Home as HomeIcon,
  LocationCity as LocationCityIcon,
  Public as PublicIcon,
  MailOutline as MailIcon,
  Person as PersonIcon,
  CreditCard as CreditCardIcon,
  Payment as PaymentIcon,
} from "@mui/icons-material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { es } from "date-fns/locale";
import visaIcon from "../../assets/img/payments/visa.png";
import paypalIcon from "../../assets/img/payments/paypal.png";
import mastercardIcon from "../../assets/img/payments/MasterCard.png";
import americanExpressIcon from "../../assets/img/payments/american-express.png";
import axios from "axios";
import dayjs from "dayjs";
import { useNotification } from "../Notification";

const AddPaymentMethod = () => {
  const [form, setForm] = useState({
    direccion: "",
    provincia: "",
    pais: "",
    codigoPostal: "",
    nombreTitular: "",
    numeroTarjeta: "",
    tipoTarjeta: "",
    fechaExpiracion: "",
    marcaTarjeta: "", // Nueva propiedad
  });

  const [errors, setErrors] = useState({});
  const [countries, setCountries] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [loadingCountries, setLoadingCountries] = useState(true);
  const [loadingProvinces, setLoadingProvinces] = useState(false);
  const [loading, setLoading] = useState(false);
  const showNotification = useNotification();

  const tipoTarjetaOptions = ["Crédito", "Débito"];

  const determineCardBrand = (cardNumber) => {
    const regexPatterns = {
      Visa: /^4[0-9]{12}(?:[0-9]{3})?$/,
      MasterCard: /^5[1-5][0-9]{14}$/,
      AmericanExpress: /^3[47][0-9]{13}$/,
      Discover: /^6(?:011|5[0-9]{2})[0-9]{12}$/,
    };

    for (const [brand, pattern] of Object.entries(regexPatterns)) {
      if (pattern.test(cardNumber)) {
        return brand;
      }
    }
    return "Desconocida";
  };

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

  const handleSubmit = async (event) => {
    event.preventDefault();

    const newErrors = {};
    if (!form.direccion) newErrors.direccion = "La dirección es obligatoria.";
    if (!form.provincia) newErrors.provincia = "La provincia es obligatoria.";
    if (!form.pais) newErrors.pais = "El país es obligatorio.";
    if (!form.codigoPostal || !/^\d{4,10}$/.test(form.codigoPostal))
      newErrors.codigoPostal =
        "El código postal es obligatorio y debe contener entre 4 y 10 dígitos.";
    if (!form.nombreTitular)
      newErrors.nombreTitular = "El nombre del titular es obligatorio.";
    if (!form.numeroTarjeta || !/^\d{16}$/.test(form.numeroTarjeta))
      newErrors.numeroTarjeta =
        "El número de tarjeta es obligatorio y debe contener 16 dígitos.";
    if (!form.tipoTarjeta)
      newErrors.tipoTarjeta = "El tipo de tarjeta es obligatorio.";
    if (!form.fechaExpiracion)
      newErrors.fechaExpiracion = "La fecha de expiración es obligatoria.";
    else if (dayjs(form.fechaExpiracion, "MM/YYYY").isBefore(dayjs(), "month"))
      newErrors.fechaExpiracion =
        "La fecha de expiración debe ser posterior a la fecha actual.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);
      console.log("Datos enviados:", {
        direccion: form.direccion,
        provincia: form.provincia,
        pais: form.pais,
        codigo_postal: form.codigoPostal,
        nombre_titular: form.nombreTitular,
        numero_tarjeta: form.numeroTarjeta,
        tipo_pago: form.tipoTarjeta,
        fecha_expiracion: form.fechaExpiracion,
        marca_tarjeta: form.marcaTarjeta, // Marca de la tarjeta
      });
      const response = await axios.post(
        "http://localhost:8000/api/add-payment-method/",
        {
          direccion: form.direccion,
          provincia: form.provincia,
          pais: form.pais,
          codigo_postal: form.codigoPostal,
          nombre_titular: form.nombreTitular,
          numero_tarjeta: form.numeroTarjeta,
          tipo_pago: form.tipoTarjeta,
          fecha_expiracion: form.fechaExpiracion,
          marca_tarjeta: form.marcaTarjeta,
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (response.status === 201) {
        showNotification("Método de pago agregado exitosamente", "success");
        setForm({
          direccion: "",
          provincia: "",
          pais: "",
          codigoPostal: "",
          nombreTitular: "",
          numeroTarjeta: "",
          tipoTarjeta: "",
          fechaExpiracion: "",
          marcaTarjeta: "",
        });
      }
    } catch (error) {
      const errorMessage =
        error.response && error.response.data && error.response.data.error
          ? error.response.data.error
          : "Error al agregar el método de pago. Por favor, intente de nuevo.";
      console.error("Error al agregar método de pago:", error);
      showNotification(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setForm((prevForm) => ({
      ...prevForm,
      [field]: value,
      ...(field === "numeroTarjeta" && {
        marcaTarjeta: determineCardBrand(value),
      }),
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

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ maxWidth: "800px", mx: "auto", mt: 2 }}
    >
      {/* Detalles personales */}
      <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
        Detalles personales
      </Typography>
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Dirección"
            placeholder="Ingrese su dirección (Ejemplo: Calle 123)"
            variant="outlined"
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
                placeholder="Seleccione un país"
                variant="outlined"
                error={!!errors.pais}
                helperText={errors.pais}
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
            onChange={(event, newValue) => handleChange("provincia", newValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                fullWidth
                label="Provincia"
                placeholder="Seleccione una provincia"
                variant="outlined"
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
            placeholder="Ingrese su código postal (Ejemplo: 10807)"
            variant="outlined"
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
      </Grid>

      {/* Métodos aceptados */}
      <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
        Métodos aceptados
      </Typography>
      <Stack direction="row" spacing={3} sx={{ mb: 2 }}>
        <Box
          component="img"
          src={visaIcon}
          alt="Visa"
          sx={{
            width: "auto",
            height: "60px",
            objectFit: "contain",
          }}
        />
        <Box
          component="img"
          src={paypalIcon}
          alt="PayPal"
          sx={{
            width: "auto",
            height: "60px",
            objectFit: "contain",
          }}
        />
        <Box
          component="img"
          src={mastercardIcon}
          alt="Mastercard"
          sx={{
            width: "auto",
            height: "60px",
            objectFit: "contain",
          }}
        />
        <Box
          component="img"
          src={americanExpressIcon}
          alt="American Express"
          sx={{
            width: "auto",
            height: "60px",
            objectFit: "contain",
          }}
        />
      </Stack>

      {/* Detalles de tarjeta */}
      <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
        Detalles de tarjeta
      </Typography>
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Nombre del titular"
            placeholder="Ingrese el nombre del titular (Ejemplo: Juan Pérez)"
            variant="outlined"
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
          <TextField
            fullWidth
            label="Número de tarjeta"
            placeholder="Ingrese los 16 dígitos de su tarjeta"
            variant="outlined"
            value={form.numeroTarjeta.replace(/(\d{4})(?=\d)/g, "$1-")}
            onChange={(e) => {
              // Remover guiones y guardar solo los dígitos
              const rawValue = e.target.value.replace(/-/g, "");
              if (/^\d{0,16}$/.test(rawValue)) {
                handleChange("numeroTarjeta", rawValue);
              }
            }}
            error={!!errors.numeroTarjeta}
            helperText={errors.numeroTarjeta}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <CreditCardIcon />
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
                label="Tipo de tarjeta"
                placeholder="Seleccione el tipo de tarjeta"
                variant="outlined"
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
        <Grid item xs={12}>
          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
            <DatePicker
              label="Fecha de Expiración"
              views={["year", "month"]}
              value={""}
              minDate={dayjs().toDate()}
              format="MM/yyyy"
              onChange={(newValue) => {
                const formattedDate = dayjs(newValue).format("MM/YYYY");
                handleChange("fechaExpiracion", formattedDate);
              }}
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

      {/* Botón agregar */}
      <Box sx={{ textAlign: "center" }}>
        <Button
          type="submit"
          variant="contained"
          disabled={loading} // Deshabilitar el botón mientras se carga
          sx={{
            textTransform: "none",
            backgroundColor: loading ? "#cccccc" : "#00308F",
            color: "white",
            width: "100%",
            height: "50px",
            fontSize: "16px",
            "&:hover": {
              backgroundColor: loading ? "#cccccc" : "#002766",
            },
          }}
        >
          {loading ? "Cargando..." : "Agregar"}
        </Button>
      </Box>
    </Box>
  );
};

export default AddPaymentMethod;
