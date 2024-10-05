import React from 'react';
import { useNavigate } from "react-router-dom";
import { useState, useContext } from 'react';
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
} from "@mui/icons-material";
import rootShouldForwardProp from '@mui/material/styles/rootShouldForwardProp';

export function PassReset() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);
    const { setRole } = useContext(AuthContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true)

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError(true)
            return
        };
        setError(false)

        try {
            
            const response = await axios.post('http://localhost:8000/api/reset-password/', {
                email,
            }, {
                withCredentials: true
            });
            setLoading(false)
            if (response.data.success) {
                setRole(5)
                navigate('/check-reset');
            } 
        } catch (error) {
            setLoading(false)
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

export function CheckCode() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:8000/api/check-user/', {
                email,
            }, {
                withCredentials: true
            });
            if (response.data.success) {
                navigate('/check-reset')
            }
        } catch (error) {
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

