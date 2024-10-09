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
    TextField,
    InputAdornment,
    CircularProgress,
    Button,
    IconButton,
    Alert,
    Stack,
} from "@mui/material";
import {
    Email,
    CheckCircleOutline,
    CheckCircle,
    LockReset,
    AccountCircle,
    VpnKey,
    Visibility,
    VisibilityOff,
} from "@mui/icons-material";


function Login() {
    const initialFormData = {
    usuario: "",
    clave: "",
  };
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState(initialFormData);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const { setRole } = useContext(AuthContext);

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const [alert, setAlert] = useState({
        open: false,
        message: "",
        severity: "",
    });

    const passRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^\d[a-zA-Z])[\S]{8,}$/;

    const validate = () => {
    const newErrors = {};

    if (!formData.usuario) {
      newErrors.usuario = "El usuario es requerido.";
    }

    const handleDelete = async (message, severity) => {
        setAlert({ open: true, message, severity });
        await fetchClinics();
    };

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;

    if (!formData.clave || !passwordRegex.test(formData.clave)) {
      newErrors.clave =
        "La contraseña debe tener al menos 8 caracteres, una mayúscula, un número y un carácter especial.";
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true)

        validate()

        const redirectItems = new Map([
            [1, 'owner'],
            [2, 'consultAdmins'],
            [3, 'consultpets'],
            [4, ''],
        ]);

        try {
            const response = await axios.post('http://localhost:8000/api/check-user/', {
                formData,
            }, {
                withCredentials: true
            });
            setLoading(false)
            if (response.data.rol) {
                setRole(response.data.rol)
                document.cookie = "active=true; path=/;";
                navigate(`/${redirectItems.get(response.data.rol)}`);
            } else {
                setAlert({ open: true, message:"Credenciales erróneas", severity:"error"});
                setRole(0)
            }
        } catch (error) {
            setAlert({ open: true, message: "Credenciales erróneas", severity: "error" });
            console.log(error)
            setLoading(false)
        }
    }

    const handleCloseAlert = () => {
        setAlert({ open: false, message: "", severity: "" });
    };

    return (
        <>
            {loading ? (
                <Loading text={"Verificando permisos"} />
            ) : (
                <div className="min-h-screen flex flex-col">
                    <Header />

                    <main className="flex-grow">
                        {alert.open && (
                            <div className="flex justify-center items-center w-full mt-4 mb-4">
                                <Stack sx={{ width: "90%" }} spacing={2}>
                                    <Alert severity={alert.severity} onClose={handleCloseAlert}>
                                        {alert.message || "Ocurrió un error desconocido."}
                                    </Alert>
                                </Stack>
                            </div>
                        )}
                            <div className="h-screen flex items-center justify-center bg-[url('./src/assets/shapes/wave.svg')] bg-bottom bg-no-repeat w-full">
                                <div className="flex flex-col h-[650px] w-[400px] rounded-xl bg-bgsecondary shadow-2xl items-center pt-8 text-secondary">
                                    <h1 className="font-bold text-4xl">Bienvenido</h1>
                                    <img src="./vetlink-logo.png" alt="logo" className="h-20 w-20 my-10" />

                                    {/* Campo correo */}
                                    <form onSubmit={handleSubmit} className="w-full flex flex-col items-center">

                                        <TextField
                                            fullWidth
                                            label="Usuario"
                                            name="usuario"
                                            value={formData.usuario}
                                            onChange={handleChange}
                                            sx={{
                                                maxWidth: "300px",
                                                mb: 2
                                            }}
                                            required
                                            error={!!errors.usuario}
                                            helperText={errors.usuario}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <AccountCircle />
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                        <TextField
                                            fullWidth
                                            label="Contraseña"
                                            type={showPassword ? "text" : "password"}
                                            name="clave"
                                            value={formData.clave}
                                            onChange={handleChange}
                                            sx={{
                                                maxWidth: "300px",
                                                mb: 2
                                            }}
                                            required
                                            error={!!errors.clave}
                                            helperText={errors.clave}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <VpnKey />
                                                    </InputAdornment>
                                                ),
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            onClick={toggleShowPassword}
                                                            edge="end"
                                                            aria-label="toggle password visibility"
                                                        >
                                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                                        </IconButton>
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                        {/* Boton iniciar sesion */}
                                        <Button
                                            variant="contained"
                                            type="submit"
                                            sx={{
                                                minWidth: "300px",
                                                minHeight: "45px",
                                                mt: 3,
                                                backgroundColor: "#00308F",
                                                "&:hover": { backgroundColor: "#00246d" },
                                            }}
                                        >
                                            Iniciar Sesión
                                        </Button>
                                    </form>
                                    {/* Olvidaste tu contraseña */}
                                    <a href="reset" className="pt-5 font-bold text-primary hover:underline">
                                        ¿Olvidaste tu contraseña?
                                    </a>

                                    {/* Registro */}
                                    <p className="pt-5 text-elemsec font-bold opacity-70">¿No tienes un usuario?</p>
                                    <a href="signup" className="font-bold text-primary hover:underline">
                                        Regístrate
                                    </a>
                                </div>
                            </div>
                        </main>
                <Footer />
            </div>
        )}
        </>
    );

}
export default Login
