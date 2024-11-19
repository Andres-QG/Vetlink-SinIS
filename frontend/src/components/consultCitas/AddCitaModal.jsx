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
  Autocomplete,
  MenuItem,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import {
  Close,
  Person as PersonIcon,
  HealthAndSafety as HealthAndSafetyIcon,
  AccessTime as AccessTimeIcon,
  LocalHospital as LocalHospitalIcon,
  Build as BuildIcon,
  Pets as PetsIcon,
  CalendarMonthRounded as CalendarMonthRoundedIcon,
  BorderColor as BorderColorIcon,
  CorporateFare as CorporateFareIcon,
  ArrowDropDown as ArrowDropDownIcon,
  ConstructionOutlined,
  CreditCard as CreditCardIcon,
  Lock as LockIcon
} from "@mui/icons-material";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import Tag from "../Tag";
import { parseISO, isValid, add } from "date-fns";
import axios from "axios";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { es } from "date-fns/locale";

const AddCitaModal = ({ open, handleClose, onSuccess, otherData }) => {
  const stripe = useStripe();
  const elements = useElements();

  const initialFormData = {
    cliente: otherData?.user?.role === 4 ? otherData?.user?.role : null,
    veterinario: null,
    mascota: "",
    fecha: null,
    clinica: null,
    hora: "",
    motivo: "",
    services: [],
    metodo_pago: "",
    nombre_tarjeta: "",
    numero_tarjeta: "",
    fecha_expiracion: null,
    cvv: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [clientes, setClientes] = useState([]);
  const [pets, setPets] = useState([]);
  const [veterinarios, setVeterinarios] = useState([]);
  const [horarios, setHorarios] = useState([]);
  const [clinicas, setClinicas] = useState([]);
  const [loadingClinics, setLoadingClinics] = useState(false);
  const [loadingClients, setLoadingClients] = useState(true);
  const [loadingVets, setLoadingVets] = useState(true);
  const [services, setServices] = useState([]);
  const [loadingTimes, setLoadingTimes] = useState(true);
  const [loadingPets, setLoadingPets] = useState(false);
  const [step, setStep] = useState(0);
  const [user, setUser] = useState({});
  const [lftText, setLftText] = useState("Volver")
  const [rgtText, setRgtText] = useState("Siguiente")

  useEffect(() => {
    if (otherData) {
      setClientes(otherData.clientes || []);
      setPets(otherData.pets || []);
      setVeterinarios(otherData.veterinarios || []);
      setHorarios(otherData.horarios || []);
      setClinicas(otherData.clinicas || []);
      setServices(otherData.services || []);
      setUser(otherData.user || {});

      setLoadingClinics(false);
      setLoadingClients(false);
      setLoadingVets(false);
      setLoadingTimes(false);
      setLoadingPets(false);
    }
  }, [otherData]);

  useEffect(() => {
    if (user.clinica && !formData.clinica) {
      setFormData((prevData) => ({
        ...prevData,
        clinica: clinicas.find((clinic) => clinic.clinica_id === user.clinica) || null,
      }));
    }
  }, [user, clinicas]);


  useEffect(() => {
    const fetchPets = async () => {
      if (formData.cliente) {
        setLoadingPets(true);
        try {
          const response = await axios.put("http://localhost:8000/api/get-pets/", {
            cliente: formData.cliente.usuario,
          });
          setPets(response.data.pets || []);
        } catch (error) {
          console.error("Error fetching pets:", error);
        } finally {
          setLoadingPets(false);
        }
      } else {
        setPets([]);
      }

      setFormData((prevData) => ({ ...prevData, pet: null }));
    };

    fetchPets();
  }, [formData.cliente]);

  const fetchAvailableTimes = async () => {
    try {
      if (formData.veterinario && formData.clinica && formData.fecha) {
        setLoadingTimes(true);
        const formattedDate = formData.fecha.toISOString().split("T")[0];

        const response = await axios.put("http://localhost:8000/api/get-disp-times/", {
          vet_user: formData.veterinario.usuario,
          clinica_id: formData.clinica?.clinica_id,
          full_date: formattedDate,
        });
        setHorarios(response.data.available_times || []);
      }
    } catch (error) {
      console.error("Error fetching available times:", error);
    } finally {
      setLoadingTimes(false)
    }
  };

  // Function used to set the client as the default value
  useEffect(() => {
    if (user.role === 4) {
      const matchingClient = clientes.find((client) => client.usuario === user.user);
      if (matchingClient) {
        setFormData((prevData) => ({
          ...prevData,
          cliente: matchingClient
        }));
      }
    }
  }, [user, clientes]);

  useEffect(() => {
    if (formData.clinica && formData.veterinario && formData.fecha) {
      fetchAvailableTimes();
    } else {
      setHorarios([]);
      setFormData((prevData) => ({ ...prevData, hora: "" }));
      setLoadingTimes(true)
    }
  }, [formData.clinica, formData.veterinario, formData.fecha]);

  useEffect(() => {
    if (user.clinica) {
      const clinic = clinicas.find((clinic) => clinic.clinica_id === user.clinica) || null;
      setFormData((prevData) => ({
        ...prevData,
        clinica: clinic,
      }));
    }
  }, [user.clinica, clinicas, setFormData]);

  const validateStep = (currentStep) => {
    const newErrors = {};

    if (currentStep === 0) {
      if (otherData?.user.role !== 4 && !formData.cliente) newErrors.cliente = "Usuario requerido";
      if (!formData.mascota) newErrors.mascota = "Mascota requerida.";
      if (formData.services.length === 0) newErrors.services = "Al menos un servicio es requerido.";
    }

    if (currentStep === 1) {
      if (!formData.veterinario) newErrors.veterinario = "Veterinario requerido.";
      if (!formData.clinica) newErrors.clinica = "Clínica requerida.";
      if (!formData.fecha) newErrors.fecha = "Fecha requerida.";
      if (!formData.hora) newErrors.hora = "Hora requerida.";
    }

    if (currentStep === 2) {
      // if (!formData.metodo_pago) newErrors.metodo_pago = "Método de pago requerido.";
      // if (!formData.nombre_tarjeta) newErrors.nombre_tarjeta = "Nombre en la tarjeta requerido.";
      // if (!formData.numero_tarjeta) newErrors.numero_tarjeta = "Número de tarjeta requerido.";
      // if (!formData.cvv) newErrors.cvv = "CVV requerido.";
      // if (!formData.fecha_expiracion) newErrors.fecha_expiracion = "Fecha de expiración requerida.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0
  };

  const handleSubmit = async (e) => {
    e.preventDefault();


    if (!validateStep(step)) {
      console.log(errors)
      return;
    }
    

    if (step < 2) {
      setStep(step + 1);
      if (step === 1) {
        setRgtText("Agregar");
      }
      return;
    }

    makePayment()
    // addCita()
  };

  const addCita = async () => {
    setLoading(true);
    try {
      await axios.post("http://localhost:8000/api/add-cita/", formData);
      // onSuccess("Cita agregada correctamente", "success");
      // handleClose();
    } catch (error) {
      console.error(error);
      // onSuccess("Error al agregar cita.", "error");
    } finally {
      setLoading(false);
    }

  }

  const makePayment = async () => {
    setLoading(true);

    if (!stripe || !elements) {
      console.error("Stripe has not loaded yet.");
      onSuccess("Error al procesar el pago.", "error");
      setLoading(false);
      return;
    }

    try {
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: elements.getElement(CardElement),
        billing_details: {
          name: formData.nombre_tarjeta,
        },
      });

      if (error) {
        console.error("Error creating payment method:", error.message);
        onSuccess(error.message, "error");
        setLoading(false);
        return;
      }

      console.log("Payment Method Created:", paymentMethod.id);

      const paymentResponse = await axios.post("http://localhost:8000/api/create-payment/", {
        payment_method_id: paymentMethod.id,
        amount: 1230, 
        currency: "usd",
        email: "test@example.com", 
        description: "Payment for veterinary services",
      });

      if (paymentResponse.status === 201) {
        // onSuccess("Cita pagada correctamente", "success");
        // handleClose();
        return true;
      } else {
        console.error("Payment failed:", paymentResponse.data);
        onSuccess("Error al procesar el pago.", "error");
        return false;
      }
    } catch (error) {
      console.error("Error during payment:", error);
      onSuccess("Error al procesar el pago.", "error");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleBackReset = () => {
    setStep(step > 0 ? step - 1 : 0);
    setRgtText("Siguiente");
    setErrors({});
  };


  const steps = ['Elije la mascota', 'Elije un horario', 'Realiza el pago'];
  const isStepFailed = (step) => {
    return !errors;
  };

  return (
    <Modal open={open} onClose={handleClose} aria-labelledby="modal-title" aria-describedby="modal-description">
      <Box
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full sm:w-4/5 md:w-[650px] bg-white shadow-lg p-6 rounded-lg"
        sx={{
          maxHeight: { xs: "90vh", sm: "auto" },
          overflowY: { xs: "auto", sm: "unset" },
        }}
      >
        <IconButton onClick={handleClose} sx={{ position: "absolute", top: 8, right: 8 }}>
          <Close />
        </IconButton>
        <form onSubmit={handleSubmit} className="w-full flex flex-col items-center" noValidate>
          <Typography id="modal-title" variant="h6" component="h2" sx={{ textAlign: "center", marginBottom: "20px", fontWeight: "bold", color: "#333", borderBottom: "1px solid #ddd", paddingBottom: "10px" }}>
            Agregar Cita
          </Typography>

          {otherData?.user.role === 4 && (<Stepper activeStep={step} alternativeLabel className="py-5 w-full">
            {steps.map((label, index) => {
              const labelProps = {};
              if (isStepFailed(index)) {
                labelProps.optional = (
                  <Typography variant="caption" color="error">
                    La información está errónea
                  </Typography>
                );

                labelProps.error = true;
              }

              const CustomStepIcon = ({ active, completed }) => {
                let bgColor = 'bg-gray-300'; // Default color

                if (active || completed) {
                  bgColor = 'bg-primary';
                }

                return (
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${bgColor} text-white font-bold`}
                  >
                    {completed ? '✓' : index + 1}
                  </div>
                );
              };

              return (
                <Step key={label} >
                  <StepLabel {...labelProps} StepIconComponent={CustomStepIcon}>{label}</StepLabel>
                </Step>
              );
            })}
          </Stepper>)}

          {otherData?.user?.role !== 4 && step === 0 && <Autocomplete
            options={clientes}
            getOptionLabel={(option) => option.usuario || ""}
            value={formData.cliente || ""}
            className="w-full"
            onChange={(event, newValue) => setFormData({ ...formData, cliente: newValue })}
            loading={loadingClients}
            disabled={user.role === 4}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Cliente"
                placeholder="Seleccione un cliente"
                fullWidth
                error={!!errors.cliente}
                helperText={errors.cliente}
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon fontSize="small" />
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
          />}

          {step === 0 && <Autocomplete
            options={pets}
            getOptionLabel={(option) => option.nombre || ""}
            value={formData.mascota || ""}
            onChange={(event, newValue) => { setFormData({ ...formData, mascota: newValue }) }}
            loading={loadingPets}
            className="w-full"
            disabled={!formData.cliente}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Mascota"
                placeholder="Seleccione una mascota"
                fullWidth
                error={!!errors.mascota}
                helperText={errors.mascota}
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <InputAdornment position="start">
                      <PetsIcon fontSize="small" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <>
                      {loadingPets ? <CircularProgress color="inherit" size={21} /> : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
                sx={{ mb: 2 }}
              />
            )}
            renderOption={(props, option) => (
              <li {...props} key={option.mascota_id || option.nombre + "_" + option.ownerId}>
                {option.nombre}
              </li>
            )}
          />}

          {step === 0 && <Autocomplete
            multiple
            options={services}
            getOptionLabel={(option) => option.nombre || ""}
            value={formData.services || ""}
            onChange={(event, newValue) => {
              setFormData({ ...formData, services: newValue });
            }}
            renderTags={(value, getTagProps) => (
              <div
                style={{
                  overflowY: "auto",
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "4px",
                  scrollbarWidth: "none",
                }}
              >
                {value.map((option, index) => {
                  const { key, ...tagProps } = getTagProps({ index });
                  return (
                    <Tag
                      key={option.id || `${option.nombre}-${index}`}
                      label={option.nombre}
                      {...tagProps}
                    />
                  );
                })}
              </div>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                label="Servicios*"
                placeholder={formData.services.length === 0 ? "Selecciona los servicios" : ""}
                error={!!errors.services}
                helperText={errors.services}
                sx={{
                  mb: 2,
                  "& input": {
                    display: formData.services.length > 0 ? "none" : "block",
                    width: formData.services.length > 0 ? "0" : "auto",
                  },
                }}
              />
            )}
            ListboxProps={{
              style: {
                maxHeight: "200px",
                overflow: "auto",
              },
            }}
            sx={{
              width: "100%",
            }}
          />}

          {step === 0 && <TextField
            fullWidth
            className="w-full"
            label="Motivo"
            name="motivo"
            value={formData.motivo}
            onChange={(e) => setFormData({ ...formData, motivo: e.target.value })}
            sx={{ mb: 2 }}
            error={!!errors.motivo}
            helperText={errors.motivo}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <BorderColorIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />}


          {step === 1 && <Autocomplete
            options={veterinarios}
            getOptionLabel={(option) => option.usuario || ""}
            className="w-full"
            value={formData.veterinario || ""}
            onChange={(event, newValue) => setFormData({ ...formData, veterinario: newValue })}
            loading={loadingVets}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Veterinario"
                placeholder="Seleccione un veterinario"
                fullWidth
                error={!!errors.veterinario}
                helperText={errors.veterinario}
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <InputAdornment position="start">
                      <HealthAndSafetyIcon fontSize="small" />
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
          />}

          {step === 1 && <Autocomplete
            options={clinicas}
            getOptionLabel={(option) => option.nombre || ""}
            value={formData.clinica || ""}
            onChange={(event, newValue) => setFormData({ ...formData, clinica: newValue })}
            className="w-full"
            loading={loadingClinics}
            disabled={!!user.clinica}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Clínica"
                placeholder="Seleccione una clínica"
                fullWidth
                error={!!errors.clinica}
                helperText={errors.clinica}
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <InputAdornment position="start">
                      <CorporateFareIcon fontSize="small" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <>
                      {loadingClinics ? <CircularProgress color="inherit" size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
                sx={{ mb: 2 }}
              />
            )}
          />}

          {step === 1 && <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
            <DatePicker
              label="Fecha"
              value={formData.fecha || null}
              onChange={(newDate) => setFormData({ ...formData, fecha: isValid(newDate) ? newDate : null })}
              minDate={new Date()} // Prevents selection of past dates
              slots={{ openPickerIcon: ArrowDropDownIcon }}
              slotProps={{
                textField: {
                  fullWidth: true,
                  required: true,
                  error: !!errors.fecha,
                  helperText: errors.fecha,
                  sx: { mb: 2 },
                  InputProps: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <CalendarMonthRoundedIcon fontSize="small" />
                      </InputAdornment>
                    ),
                  },
                },
              }}
            />
          </LocalizationProvider>}

          {step === 1 && <TextField
            select
            fullWidth
            label="Hora"
            name="hora"
            value={formData.hora || ""}
            onChange={(e) => setFormData({ ...formData, hora: e.target.value })}
            sx={{ mb: 2 }}
            required
            error={!!errors.hora}
            helperText={errors.hora}
            disabled={loadingTimes}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AccessTimeIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          >
            {horarios.length > 0 ? (
              horarios.map((hora) => (
                <MenuItem key={hora} value={hora}>
                  {hora}
                </MenuItem>
              ))
            ) : (
              <MenuItem value="" disabled>
                No hay horarios disponibles
              </MenuItem>
            )}
          </TextField>}

          {step === 2 && <TextField
            select
            fullWidth
            label="Método de Pago"
            name="metodo_pago"
            value={formData.metodo_pago || ""}
            onChange={(e) => setFormData({ ...formData, metodo_pago: e.target.value })}
            sx={{ mb: 2 }}
            required
            error={!!errors.metodo_pago}
            helperText={errors.metodo_pago}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <CreditCardIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          >
            <MenuItem value="tarjeta_credito">Tarjeta de Crédito</MenuItem>
            <MenuItem value="tarjeta_debito">Tarjeta de Débito</MenuItem>
          </TextField>}

          {step === 2 && (
            <Box className="w-full" sx={{ mb: 2 }}>
              <Typography
                variant="body1"
                sx={{
                  mb: 2,
                  fontWeight: "bold",
                  color: "#333",
                  textAlign: "left",
                  width: "100%",
                }}
              >
                Información de la Tarjeta
              </Typography>
              <Box
                sx={{
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  padding: "10px",
                  mb: 2,
                  "& .StripeElement": {
                    fontSize: "16px",
                    color: "#424770",
                  },
                }}
              >
                <CardElement
                  options={{
                    style: {
                      base: {
                        fontSize: "16px",
                        color: "#424770",
                        "::placeholder": {
                          color: "#aab7c4",
                        },
                      },
                      invalid: {
                        color: "#9e2146",
                      },
                    },
                  }}
                />
              </Box>
            </Box>
          )}

          <Box className="w-full" sx={{ display: "flex", gap: 2, mt: 2 }}>
            <Button variant="outlined" onClick={handleBackReset} fullWidth disabled={loading} sx={{ borderColor: "#00308F", color: "#00308F", "&:hover": { color: "#00246d", borderColor: "#00246d" } }}>
              {lftText}
            </Button>
            <Button variant="contained" type="submit" fullWidth disabled={loading} startIcon={loading && <CircularProgress size={20} />} sx={{ minWidth: "160px", backgroundColor: "#00308F", "&:hover": { backgroundColor: "#00246d" } }}>
              {loading ? "Agregando..." : rgtText}
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

export default AddCitaModal;
