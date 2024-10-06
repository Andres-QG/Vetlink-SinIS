import React from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { useState, useContext, useRef } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Button from '../components/Button';
import Loading from '../components/Loading';
import { AuthContext } from '../context/AuthContext';
import {
  TextField,
  InputAdornment,
} from "@mui/material";
import {
  Email,
  CheckCircleOutline,
  CheckCircle,
} from "@mui/icons-material";

// Pagina que pide el correo al usuario

export function PassReset() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [error, setError] = useState(false);
    const { setRole } = useContext(AuthContext);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError(true)
            return
        };
        setError(false)
        console.log("Sending")

        try {
            const response = await axios.post('http://localhost:8000/api/reset-password/', {
                email,
            }, {
                withCredentials: true
            });
            console.log(response)
            if (response.data.rol) {
                setRole(response.data.rol)
                navigate('/check-reset');
            } 
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <>
            <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-grow">
                    <div className="h-screen flex items-center justify-center bg-[url('./src/assets/shapes/wave.svg')] bg-bottom bg-no-repeat w-full">
                        <div className="flex flex-col h-[650px] w-[400px] rounded-xl bg-bgsecondary shadow-2xl items-center pt-8 text-secondary">
                            <h1 className="font-bold text-2xl text-center">¿Olvidaste tu contraseña?</h1>
                            <p className='font-bold text-center m-2'>Escribe tu correo para enviarte un código de verificación</p>
                            <form onSubmit={handleSubmit} className="w-full flex flex-col items-center">

                                {/* Campo correo */}
                                <TextField
                                    label="Correo"
                                    name="correo"
                                    value={email}
                                    error={error}
                                    onChange={(e) => setEmail(e.target.value)}
                                    sx={{ m: 2 }}
                                    required
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Email />
                                            </InputAdornment>
                                        ),
                                    }}
                                />

                                {/* Boton enviar correo */}
                                <Button
                                    className="mt-5 text-3xl w-64 h-12 border-none text-bgsecondary bg-primary hover:scale-[1.03]"
                                    type="submit"
                                    onClick={handleSubmit}
                                >
                                    Enviar correo
                                </Button>
                            </form>

                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        </>
    );
};

// Pagina que revisa el codigo digitado por el usuario

export function CheckCode() {
    const navigate = useNavigate();
    const [values, setValues] = useState(new Array(6).fill(''));
    const { role, setRole } = useContext(AuthContext);

    const inputRefs = useRef([]);

    const handleChange = (e, index) => {
        const value = e.target.value;
        if (isNaN(value) || value.length > 1) {
            return;
        }

        const newValues = [...values];
        newValues[index] = value;
        setValues(newValues);

        if (value && index < 5) {
            document.getElementById(`digit-${index + 1}`).focus();
        }
    };

    const handleBackspace = (e, index) => {
        if (e.key === 'Backspace' && !e.target.value && index > 0) { // Maneja el input de borrar un digito
            inputRefs.current[index - 1].focus();
        }

    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pasteData = e.clipboardData.getData('Text').slice(0, 6); // Limite de copiar 6 caracteres
        const updatedValues = pasteData.split('').concat(Array(6).fill('')).slice(0, 6); // Llena los 6 caracteres

        for (const value of updatedValues) {
            if (isNaN(value) || value.length > 1) {
                return;
            }
        }

        setValues(updatedValues);

        // LLena los campos con lo que se obtuvo del clipboard
        const lastFilledIndex = updatedValues.findIndex(value => value === '');
        if (lastFilledIndex !== -1) {
            const nextInput = document.getElementById(`input-${lastFilledIndex}`);
            nextInput && nextInput.focus();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:8000/api/verify-code/', {
                values
            }, {
                withCredentials: true
            });
            console.log(response)
            if (response.data.status === "success") {
                console.log(role)
                navigate('/change-pass');
            }
        } catch (error) {
            setRole(null)
            console.log(error)
        }

    }

    return (
        <>
            <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-grow">
                    <div className="h-screen flex items-center justify-center bg-[url('./src/assets/shapes/wave.svg')] bg-bottom bg-no-repeat w-full">
                        <div className="flex flex-col h-[650px] w-[400px] rounded-xl bg-bgsecondary shadow-2xl items-center pt-8 text-secondary">
                            <h1 className="font-bold text-2xl text-center">Código de Verificación</h1>
                            <p className='font-bold text-center m-2'>Digita el código enviado a tu correo</p>
                            <form onSubmit={handleSubmit} className="w-full flex flex-col items-center">

                                {/* Campo valores */}

                                <div className="flex space-x-2" onPaste={handlePaste}>
                                    {values.map((value, index) => (
                                        <input
                                            key={index}
                                            id={`digit-${index}`}
                                            type="text"
                                            maxLength="1"
                                            value={value}
                                            onChange={(e) => handleChange(e, index)}
                                            onKeyDown={(e) => handleBackspace(e, index)}
                                            ref={(el) => (inputRefs.current[index] = el)}
                                            className="w-10 h-10 text-center border border-gray-300 rounded-md text-lg"
                                        />
                                    ))}
                                </div>
                                
                                {/* Boton enviar correo */}
                                <p className='font-bold text-center m-2'>¿No lo has recibido?</p>
                                <a href=""></a>
                                <Button
                                    className="mt-5 text-2xl w-72 h-12 border-none text-bgsecondary bg-primary hover:scale-[1.03]"
                                    type="submit"
                                    onClick={handleSubmit}
                                >
                                    Confirmar Código
                                </Button>
                            </form>

                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        </>
    );
};

// Pagina que recibe la contraseña nueva del usuario

export function ChangePass() {
    const navigate = useNavigate();
    const [newPass, setNewPass] = useState('');
    const [confPass, setConfPass] = useState('');
    const [errors, setErrors] = useState({});

    const passRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^\d[a-zA-Z])[\S]{8,}$/;

    const handleSubmit = async (e) => {
        e.preventDefault();
        let validationErrors = {};

        // Revisa que las contraseñas sean iguales
        if (newPass !== confPass) {
            validationErrors['confPass'] = 'Las contraseñas deben ser iguales';
        }

        // Revisa que la contraseña tenga los caracteres necesarios
        if (!passRegex.test(newPass)) {
            validationErrors['newPass'] = 'La contraseña debe tener al menos 8 caracteres, un número y un símbolo.';
        } 

        // Revisa si el objeto de validacion de errores tiene elementos
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        } else {
            setErrors({});
        }

        try {
            const response = await axios.post('http://localhost:8000/api/check-new-pass/', {
                newPass,
                confPass,
            }, {
                withCredentials: true
            });
            console.log(response)
            if (response.data.same === true) {
                console.log("Password can't be the same")
            }
            if (response.data.status === 'success') {
                navigate('/pass-success');
            }
        } catch (error) {
            console.log(error)
        }

    }

    return (
        <>
            <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-grow">
                    <div className="h-screen flex items-center justify-center bg-[url('./src/assets/shapes/wave.svg')] bg-bottom bg-no-repeat w-full">
                        <div className="flex flex-col h-[650px] w-[400px] rounded-xl bg-bgsecondary shadow-2xl items-center pt-8 text-secondary">
                            <h1 className="font-bold text-2xl text-center">Crea una contraseña nueva</h1>
                            <p className='font-bold text-center m-2'>Dígita tu nueva contraseña</p>
                            <form onSubmit={handleSubmit} className="w-full flex flex-col items-center m-14">

                                {/* Campo nueva contraseña */}

                                <TextField
                                    label="Dígita tu nueva contraseña"
                                    type="password"
                                    name="newpass"
                                    value={newPass}
                                    error={!!errors['newPass']}
                                    helperText={errors['newPass']}
                                    onChange={(e) => setNewPass(e.target.value)}
                                    sx={{ mb: 2, width: '19rem' }}
                                />

                                {/* Campo repetir contraseña */}

                                <TextField
                                    label="Confirma tu contraseña"
                                    type="password"
                                    name="confirmation"
                                    value={confPass}
                                    error={!!errors['confPass']}
                                    helperText={errors['confPass']}
                                    onChange={(e) => setConfPass(e.target.value)}
                                    sx={{ mb: 2, width: '19rem' }}
                                />
                                <div className='flex flex-col items-left justify-center w-72 h-20 bg-bgsecondary m-8'>
                                    <div className="flex items-center space-x-2">
                                        <CheckCircleOutline />
                                        <span>Al menos 8 carácteres</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <CheckCircleOutline />
                                        <span>Al menos una letra mayúscula</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <CheckCircleOutline />
                                        <span>Al menos un número y un símbolo</span>
                                    </div>
                                </div>

                                {/* Boton enviar correo */}
                                <a href=""></a>
                                <Button
                                    className="mt-5 text-xl w-72 h-12 border-none text-bgsecondary bg-primary hover:scale-[1.03]"
                                    type="submit"
                                    onClick={handleSubmit}
                                >
                                    Establecer Contraseña
                                </Button>
                            </form>

                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        </>
    );
};

export function PassSuccess() {
    const navigate = useNavigate();

    return (
        <>
            <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-grow">
                    <div className="h-screen flex items-center justify-center bg-[url('./src/assets/shapes/wave.svg')] bg-bottom bg-no-repeat w-full">
                        <div className="flex flex-col h-[650px] w-[400px] rounded-xl bg-bgsecondary shadow-2xl items-center pt-8 text-secondary">
                            <CheckCircle/>
                            <p>Listo</p>
                            <p>Tu contraseña ha sido cambiada</p>
                            <p>Ya puedes iniciar sesión con tu contraseña nueva</p>
                            
                            <Button
                                className="mt-5 text-xl w-72 h-12 border-none text-bgsecondary bg-primary hover:scale-[1.03]"
                                type="submit"
                                onClick={() => navigate('/login')}
                            >
                                Iniciar Sesión
                            </Button>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        </>
    );
};