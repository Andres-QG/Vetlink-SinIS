import React, { useState } from "react";
import {
  Box,
  TextField,
  Typography,
  Grid,
  Button,
  Stack,
  InputAdornment,
} from "@mui/material";
import {
  Home as HomeIcon,
  LocationCity as LocationCityIcon,
  Public as PublicIcon,
  MailOutline as MailIcon,
  Person as PersonIcon,
  CreditCard as CreditCardIcon,
  CalendarToday as CalendarIcon,
} from "@mui/icons-material";
import visaIcon from "../../assets/img/payments/visa.png";
import paypalIcon from "../../assets/img/payments/paypal.png";
import mastercardIcon from "../../assets/img/payments/MasterCard.png";
import americanExpressIcon from "../../assets/img/payments/american-express.png";

const AddPaymentMethod = () => {
  const [form, setForm] = useState({
    direccion: "",
    provincia: "",
    pais: "",
    codigoPostal: "",
    nombreTitular: "",
    numeroTarjeta: "",
    fechaExpiracion: "",
  });

  const [errors, setErrors] = useState({});

  const handleSubmit = (event) => {
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
    if (
      !form.fechaExpiracion ||
      !/^(0[1-9]|1[0-2])\/\d{2}$/.test(form.fechaExpiracion)
    )
      newErrors.fechaExpiracion =
        "La fecha de expiración es obligatoria y debe tener el formato MM/AA.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    console.log("Método de pago agregado:", form);
  };

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
    setErrors({ ...errors, [field]: undefined });
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
          <TextField
            fullWidth
            label="Provincia"
            placeholder="Ingrese su provincia (Ejemplo: San José)"
            variant="outlined"
            value={form.provincia}
            onChange={(e) => handleChange("provincia", e.target.value)}
            error={!!errors.provincia}
            helperText={errors.provincia}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LocationCityIcon />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="País"
            placeholder="Ingrese su país (Ejemplo: Costa Rica)"
            variant="outlined"
            value={form.pais}
            onChange={(e) => handleChange("pais", e.target.value)}
            error={!!errors.pais}
            helperText={errors.pais}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PublicIcon />
                </InputAdornment>
              ),
            }}
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
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Número de tarjeta"
            placeholder="Ingrese los 16 dígitos de su tarjeta"
            variant="outlined"
            value={form.numeroTarjeta}
            onChange={(e) => handleChange("numeroTarjeta", e.target.value)}
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
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Fecha de expiración"
            placeholder="MM/AA (Ejemplo: 12/25)"
            variant="outlined"
            value={form.fechaExpiracion}
            onChange={(e) => handleChange("fechaExpiracion", e.target.value)}
            error={!!errors.fechaExpiracion}
            helperText={errors.fechaExpiracion}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <CalendarIcon />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
      </Grid>

      {/* Botón agregar */}
      <Box sx={{ textAlign: "center" }}>
        <Button
          type="submit"
          variant="contained"
          sx={{
            textTransform: "none",
            backgroundColor: "#00308F",
            color: "white",
            width: "100%",
            height: "50px",
            fontSize: "16px",
            "&:hover": {
              backgroundColor: "#002766",
            },
          }}
        >
          Agregar
        </Button>
      </Box>
    </Box>
  );
};

export default AddPaymentMethod;
