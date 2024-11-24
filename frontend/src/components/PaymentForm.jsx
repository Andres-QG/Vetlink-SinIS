import React, { useState, useEffect, forwardRef, useImperativeHandle } from "react";
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
  CalendarMonthRounded as CalendarMonthRoundedIcon,
  ArrowDropDown as ArrowDropDownIcon,
  Payment as PaymentIcon,
  Lock as LockIcon,
} from "@mui/icons-material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { es } from "date-fns/locale";
import dayjs from "dayjs";

import visaIcon from "../assets/img/payments/visa.png";
import mastercardIcon from "../assets/img/payments/MasterCard.png";
import americanExpressIcon from "../assets/img/payments/american-express.png";

const PaymentForm = forwardRef(({ onSubmit, includeCVV = false, initialData = {}, paymentMethods = false, setParentFormData, otherData }, ref) => {
  const [form, setForm] = useState({
    direccion: initialData.direccion || "",
    provincia: initialData.provincia || "",
    pais: initialData.pais || "",
    codigoPostal: initialData.codigoPostal || "",
    nombreTitular: initialData.nombreTitular || "",
    numeroTarjeta: initialData.numeroTarjeta || "",
    tipoTarjeta: initialData.tipoTarjeta || "",
    fechaExpiracion: initialData.fechaExpiracion || null,
    marcaTarjeta: initialData.marcaTarjeta || "",
    cvv: "",
  });

  const [errors, setErrors] = useState({});
  const [countries, setCountries] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [loadingCountries, setLoadingCountries] = useState(true);
  const [loadingProvinces, setLoadingProvinces] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingMethod, setLoadingMethod] = useState(false);

  const determineCardBrand = (cardNumber) => {
    const regexPatterns = {
      Visa: /^4[0-9]{12}(?:[0-9]{3})?$/,
      MasterCard: /^5[1-5][0-9]{14}$/,
      AmericanExpress: /^3[47][0-9]{13}$/,
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
        const response = await fetch("https://restcountries.com/v3.1/all");
        const data = await response.json();
        setCountries(data.map((country) => country.name.common).sort());
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingCountries(false);
      }
    };
    fetchCountries();
  }, []);

  const fetchProvinces = async (country) => {
    setLoadingProvinces(true);
    try {
      const response = await fetch(
        "https://countriesnow.space/api/v0.1/countries/states",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ country }),
        }
      );
      const data = await response.json();
      setProvinces(data.data.states.map((state) => state.name).sort());
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingProvinces(false);
    }
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
      ...(field === "numeroTarjeta" && {
        marcaTarjeta: determineCardBrand(value),
      }),
    }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));

    if (field === "pais") {
      setProvinces([]);
      if (value) fetchProvinces(value);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.direccion) newErrors.direccion = "La dirección es obligatoria.";
    if (!form.provincia) newErrors.provincia = "La provincia es obligatoria.";
    if (!form.pais) newErrors.pais = "El país es obligatorio.";
    if (!form.codigoPostal || !/^\d{4,10}$/.test(form.codigoPostal))
      newErrors.codigoPostal = "Código postal inválido.";
    if (!form.nombreTitular) newErrors.nombreTitular = "El nombre del titular es obligatorio.";
    if (!form.numeroTarjeta || !/^\d{16}$/.test(form.numeroTarjeta))
      newErrors.numeroTarjeta = "El número de tarjeta debe contener 16 dígitos.";
    if (!form.tipoTarjeta) newErrors.tipoTarjeta = "El tipo de tarjeta es obligatorio.";
    if (!form.fechaExpiracion) newErrors.fechaExpiracion = "La fecha de expiración es obligatoria.";
    if (includeCVV && (!form.cvv || !/^\d{3,4}$/.test(form.cvv)))
      newErrors.cvv = "El CVV debe contener 3 o 4 dígitos.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    if (setParentFormData) {
      setParentFormData(form);
    }
  }, [form, setParentFormData]);

  const handleSubmit = () => {
    if (!validateForm()) return false;
  };

  useImperativeHandle(ref, () => ({
    submit: handleSubmit,
  }));

  useEffect(() => {
      if (form.method) {
        setForm((prevForm) => ({
          ...prevForm,
          direccion: form.method.direccion || '',
          provincia: form.method.provincia || '',
          pais: form.method.pais || '',
          codigoPostal: form.method.codigo_postal || '',
          nombreTitular: form.method.nombre_titular || '',
          numeroTarjeta: form.method.numero_tarjeta || '',
          tipoTarjeta: form.method.tipo_tarjeta || '',
          fechaExpiracion: form.method.fecha_expiracion
            ? dayjs(form.method.fecha_expiracion, 'MM/YY').toDate()
            : null,
          marcaTarjeta: form.method.marca_tarjeta || '',
          cvv: '',
        }));

        if (form.method.pais) {
          fetchProvinces(form.method.pais);
        }
      } else {
        setForm((prevForm) => ({
          ...prevForm,
          direccion: '',
          provincia: '',
          pais: '',
          codigoPostal: '',
          nombreTitular: '',
          numeroTarjeta: '',
          tipoTarjeta: '',
          fechaExpiracion: null,
          marcaTarjeta: '',
          cvv: '',
        }));
        setProvinces([]);
      }
    }, [form.method]);


  return (
    <Box component="form">
      {paymentMethods && (
        <>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
            Métodos de pago
          </Typography>
          <Autocomplete
            options={otherData.methods || []}
            getOptionLabel={(option) =>
              `${option.tipo_pago} - ${option.ultimos_4_digitos || "XXXX"}`
            }
            onChange={(event, newValue) => {
              setForm({ ...form, method: newValue });
            }}
            loading={loadingMethod}
            className="w-full"
            renderInput={(params) => (
              <TextField
                {...params}
                label="Métodos de pago"
                placeholder="Seleccione un método de pago"
                fullWidth
                error={!!errors.method}
                helperText={errors.method}
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <InputAdornment position="start">
                      <CreditCardIcon fontSize="small" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <>
                      {loadingMethod ? <CircularProgress color="inherit" size={21} /> : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
                sx={{ mb: 2 }}
              />
            )}
            renderOption={(props, option) => (
              <li {...props} key={option.numero_tarjeta || `${option.tipo_pago}_${option.ultimos_4_digitos}`}>
                <div>
                  <strong>{option.tipo_pago}</strong> - {option.ultimos_4_digitos} <br />
                  Titular: {option.nombre_titular} <br />
                  Expira: {option.fecha_expiracion} <br />
                  Marca: {option.marca_tarjeta}
                </div>
              </li>
            )}
          />
        </>
      )}

      <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
        Detalles personales
      </Typography>
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Dirección"
            placeholder="Ingrese su dirección (Ejemplo: Calle 123)"
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
            onChange={(e, newValue) => handleChange("pais", newValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="País"
                error={!!errors.pais}
                helperText={errors.pais}
                placeholder="Seleccione un país"
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <InputAdornment position="start">
                      <PublicIcon />
                    </InputAdornment>
                  ),
                  endAdornment: loadingCountries ? (
                    <CircularProgress color="inherit" size={20} />
                  ) : null,
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
            onChange={(e, newValue) => handleChange("provincia", newValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Provincia"
                placeholder="Seleccione una provincia"
                error={!!errors.provincia}
                helperText={errors.provincia}
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationCityIcon />
                    </InputAdornment>
                  ),
                  endAdornment: loadingProvinces ? (
                    <CircularProgress color="inherit" size={20} />
                  ) : null,
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
            placeholder="Ingrese su código postal (Ejemplo: 10807)"
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
      <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
        Métodos aceptados
      </Typography>
      <Stack direction="row" spacing={3} sx={{ mb: 2 }}>
        <Box component="img" src={visaIcon} alt="Visa" sx={{ height: "60px" }} />
        <Box component="img" src={mastercardIcon} alt="Mastercard" sx={{ height: "60px" }} />
        <Box component="img" src={americanExpressIcon} alt="American Express" sx={{ height: "60px" }} />
      </Stack>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
        Detalles de tarjeta
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Nombre del titular"
            value={form.nombreTitular}
            placeholder="Ingrese el nombre del titular (Ejemplo: Juan Pérez)"
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
            value={form.numeroTarjeta.replace(/(\d{4})(?=\d)/g, "$1-")}
            onChange={(e) => {
              const rawValue = e.target.value.replace(/-/g, "");
              handleChange("numeroTarjeta", rawValue);
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
            options={["Crédito", "Débito"]}
            value={form.tipoTarjeta}
            onChange={(e, newValue) => handleChange("tipoTarjeta", newValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Tipo de tarjeta"
                placeholder="Seleccione el tipo de tarjeta"
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
        {includeCVV ? (
          <>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="CVV"
                value={form.cvv}
                placeholder="Digite el CVV"
                onChange={(e) => handleChange("cvv", e.target.value)}
                error={!!errors.cvv}
                helperText={errors.cvv}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon fontSize="medium" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                <DatePicker
                  label="Fecha de Expiración"
                  views={["year", "month"]}
                  value={form.fechaExpiracion || null}
                  format="MM/yy"
                  onChange={(newValue) =>
                    handleChange("fechaExpiracion", dayjs(newValue).isValid() ? newValue : null)
                  }
                  minDate={new Date()}
                  slots={{ openPickerIcon: ArrowDropDownIcon}}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      required: true,
                      error: !!errors.fechaExpiracion,
                      helperText: errors.fechaExpiracion,
                      InputProps: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <CalendarMonthRoundedIcon fontSize="medium" />
                          </InputAdornment>
                        ),
                      },
                    },
                  }}
                />
              </LocalizationProvider>
            </Grid>
          </>
        ) : (
          <Grid item xs={12}>
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
              <DatePicker
                label="Fecha de Expiración"
                views={["year", "month"]}
                value={form.fechaExpiracion || null}
                format="MM/yy"
                onChange={(newValue) =>
                  handleChange("fechaExpiracion", dayjs(newValue).isValid() ? newValue : null)
                }
                minDate={new Date()}
                slots={{ openPickerIcon: ArrowDropDownIcon }}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    required: true,
                    error: !!errors.fechaExpiracion,
                    helperText: errors.fechaExpiracion,
                    InputProps: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <CalendarMonthRoundedIcon fontSize="medium" />
                        </InputAdornment>
                      ),
                    },
                  },
                }}
              />
            </LocalizationProvider>
          </Grid>
        )}
      </Grid>
    </Box>
  );
});

export default PaymentForm;