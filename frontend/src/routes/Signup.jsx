import Header from "../components/Header";
import Footer from "../components/Footer";
import Loading from "../components/Loading";

import eyeOnIcon from "../assets/icons/eye-on.png";
import eyeOffIcon from "../assets/icons/eye-off.png";

import axios from 'axios';
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from '../context/AuthContext';

import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  InputAdornment,
} from "@mui/material";
import {
  AccountCircle,
  Badge,
  Email,
  Margin,
  Person,
  Phone,
  VpnKey,
} from "@mui/icons-material";

function Signup() {
    const initialFormData = {
    usuario: "",
    cedula: "",
    correo: "",
    nombre: "",
    apellido1: "",
    apellido2: "",
    telefono: "",
    clave: "",
  };

  const navigate = useNavigate()

  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Validation function
  const validate = () => {
    const newErrors = {};

    if (!formData.usuario) newErrors.usuario = "El usuario es requerido.";

    const cedulaRegex = /^[0-9]{9}$/;
    if (!formData.cedula || !cedulaRegex.test(formData.cedula)) {
      newErrors.cedula = "La cédula debe tener 9 dígitos.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.correo || !emailRegex.test(formData.correo)) {
      newErrors.correo = "El correo electrónico no es válido.";
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
    if (!formData.clave || !passwordRegex.test(formData.clave)) {
      newErrors.clave = "La contraseña debe tener al menos 8 caracteres, una mayúscula, un número y un carácter especial.";
    }

    const telefonoRegex = /^[0-9]{8}$/;
    if (!formData.telefono || !telefonoRegex.test(formData.telefono)) {
      newErrors.telefono = "El teléfono debe tener 8 dígitos.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    if (validate()) {
      setLoading(true);
      console.log(formData)
      try {
        const response = await axios.post('http://localhost:8000/api/add-client/', formData, {
          withCredentials: true
        });
        setLoading(false)
        if(response.data.success === true) {
          navigate('/')
        }
      }
      catch (error) {
        console.log(error)
        setLoading(false)
      }
      setLoading(false);
    }
  };

  const handleClear = () => {
    setFormData(initialFormData);
    setErrors({});
  };

  return (
    <>
      <Header />
      <div className=" bg-white flex w-full h-[93vh] sm:bg-[#274B92]">
        <div className="hidden w-6/12 h-full sm:flex flex-col py-40 items-center justify-center">
          <p className="text-5xl w-96 text-center text-white">
            Estas cerca de tener acceso al
            <span className="text-blue-300"> mejor cuidado </span>
            para tu mascota
          </p>
          <img className='w-80 py-20' src="./src/assets/icons/big_logo.png" alt="" />
        </div>
        <div className="max-w-5xl bg-white h-full ml-auto rounded-l-3xl flex items-center justify-center">
         <div className="mx-auto flex justify-center">
            <div className="w-[70%] p-6 rounded-md">
              <Typography variant="h4" component="h1" className="text-left pb-10">
                Crear Cuenta
              </Typography>

              {/* Form Fields */}
              <TextField
                fullWidth
                label="Usuario"
                name="usuario"
                value={formData.usuario}
                onChange={handleChange}
                required
                error={!!errors.usuario}
                helperText={errors.usuario}
                sx={{ mb: 2 }}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><AccountCircle /></InputAdornment>,
                }}
              />
              <TextField
                fullWidth
                label="Contraseña"
                type="password"
                name="clave"
                value={formData.clave}
                onChange={handleChange}
                required
                error={!!errors.clave}
                helperText={errors.clave}
                sx={{ mb: 2 }}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><VpnKey /></InputAdornment>,
                }}
              />
              <TextField
                fullWidth
                label="Cédula"
                name="cedula"
                value={formData.cedula}
                onChange={handleChange}
                required
                error={!!errors.cedula}
                helperText={errors.cedula}
                sx={{ mb: 2 }}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><Badge /></InputAdornment>,
                }}
              />
              <TextField
                fullWidth
                label="Correo"
                name="correo"
                value={formData.correo}
                onChange={handleChange}
                required
                error={!!errors.correo}
                helperText={errors.correo}
                sx={{ mb: 2 }}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><Email /></InputAdornment>,
                }}
              />
              <TextField
                fullWidth
                label="Nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
                sx={{ mb: 2 }}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><Person /></InputAdornment>,
                }}
              />
              <TextField
                fullWidth
                label="Primer Apellido"
                name="apellido1"
                value={formData.apellido1}
                onChange={handleChange}
                required
                sx={{ mb: 2 }}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><Person /></InputAdornment>,
                }}
              />
              <TextField
                fullWidth
                label="Segundo Apellido"
                name="apellido2"
                value={formData.apellido2}
                onChange={handleChange}
                sx={{ mb: 2 }}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><Person /></InputAdornment>,
                }}
              />
              <TextField
                fullWidth
                label="Teléfono"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                required
                error={!!errors.telefono}
                helperText={errors.telefono}
                sx={{ mb: 2 }}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><Phone /></InputAdornment>,
                }}
              />

              {/* Button */}
              <Button
                variant="contained"
                onClick={handleSubmit}
                fullWidth
                disabled={loading}
                startIcon={loading && <CircularProgress size={20} />}
                sx={{ bgcolor: "#00308F", '&:hover': { bgcolor: "#00246d" } }}
              >
                {loading ? "Agregando..." : "Crear cuenta"}
              </Button>
            </div>
          </div>
      
          
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Signup