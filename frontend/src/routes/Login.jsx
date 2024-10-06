import Header from "../components/Header";
import Footer from "../components/Footer";
import Button from "../components/Button";
import Loading from "../components/Loading";

import eyeOnIcon from "../assets/icons/eye-on.png";
import eyeOffIcon from "../assets/icons/eye-off.png";

import axios from 'axios';
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from '../context/AuthContext';

function Login() {
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);
    const [user, setUser] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { setRole } = useContext(AuthContext);

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    const passRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^\d[a-zA-Z])[\S]{8,}$/;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true)

        if (!passRegex.test(password)) {
            setError(errorTexts[3])
            return
        };

        const redirectItems = new Map([
            [1, 'owner'],
            [2, 'admin'],
            [3, 'vet'],
            [4, 'clnt'],
        ]);

        try {
            const response = await axios.post('http://localhost:8000/api/check-user/', {
                user,
                password,
            }, {
                withCredentials: true
            });
            setLoading(false)
            if (response.data.rol) {
                setRole(response.data.rol)
                navigate(`/${redirectItems.get(response.data.rol)}`);
            } else {
                setRole(0)
                setError(errorTexts[4])
            }
        } catch (error) {
            console.log(error)
            setLoading(false)
            setError(errorTexts[4]);
        }
    }

    const errorTexts = [
        'Correo o contraseña incorrectas.',
        'Contraseña incorrecta.',
        'Digite un correo válido.',
        'Digite una contraseña válida.',
        'Login no funcionó.',
    ];


    return (
        <>
            {loading ? (
                <Loading text={"Verificando Rol"} />
            ) : (
            <div className="min-h-screen flex flex-col">
                        <Header />
                        <main className="flex-grow">
                            <div className="h-screen flex items-center justify-center bg-[url('./src/assets/shapes/wave.svg')] bg-bottom bg-no-repeat w-full">
                                <div className="flex flex-col h-[650px] w-[400px] rounded-xl bg-bgsecondary shadow-2xl items-center pt-8 text-secondary">
                                    <h1 className="font-bold text-4xl">Bienvenido</h1>
                                    <img src="./vetlink-logo.png" alt="logo" className="h-20 w-20 my-10" />

                                    {/* Campo correo */}
                                    <form onSubmit={handleSubmit} className="w-full flex flex-col items-center">

                                        <label htmlFor="user" className="w-[300px] text-lg text-secondary text-left font-bold">Usuario</label>
                                        <input
                                            id="usuario"
                                            type="text"
                                            value={user}
                                            placeholder="Escribe tu usuario"
                                            onChange={(e) => setUser(e.target.value)}
                                            className="h-6 w-[300px] mb-5 bg-transparent border-b-2 border-secondary focus:border-primary focus:outline-none placeholder-gray-500 text-lg"
                                        />

                                        {/* Campo contraseña */}
                                        <label htmlFor="contraseña" className="w-[300px] text-lg text-secondary text-left font-bold">Contraseña</label>
                                        <input
                                            id="contraseña"
                                            type={showPassword ? "text" : "password"}
                                            value={password}
                                            placeholder="Escribe tu contraseña"
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="h-6 w-[300px] bg-transparent border-b-2 border-secondary focus:border-primary focus:outline-none placeholder-gray-500 text-lg"
                                        />

                                        {/* Boton ver contraseña */}
                                        <button
                                            type="button"
                                            onClick={togglePasswordVisibility}
                                            className="relative bottom-6 left-[8.7rem]"
                                        >
                                            <img
                                                src={showPassword ? eyeOnIcon : eyeOffIcon}
                                                alt="Toggle password visibility"
                                                className="h-5 w-5"
                                            />
                                        </button>

                                        {/* Error */}
                                        {error && (
                                            <div className="flex items-center justify-center h-14 w-40 rounded-md text-bgprimary bg-red-700 bg-opacity-90">
                                                <div className="text-center">{error}</div>
                                            </div>
                                        )}

                                        {/* Olvidaste tu contraseña */}
                                        <a href="reset" className="pt-5 font-bold text-primary hover:underline">
                                            ¿Olvidaste tu contraseña?
                                        </a>

                                        {/* Boton iniciar sesion */}
                                        <Button
                                            className="mt-5 text-3xl w-64 h-12 border-none text-bgsecondary bg-primary hover:scale-[1.03]"
                                            type="submit"
                                            onClick={handleSubmit}
                                        >
                                            Iniciar Sesión
                                        </Button>
                                    </form>

                                    {/* Registro */}
                                    <p className="pt-5 text-elemsec font-bold opacity-70">¿No tienes un usuario?</p>
                                    <a href="registro" className="font-bold text-primary hover:underline">
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
