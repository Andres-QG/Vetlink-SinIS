import Header from "../components/Header";
import Footer from "../components/Footer";
import Button from "../components/Button";

import eyeOnIcon from "../assets/icons/eye-on.png";
import eyeOffIcon from "../assets/icons/eye-off.png";

import { useState } from "react";

function Login() {

    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow">
                <div className="h-screen flex items-center justify-center">
                    <div className="hidden sm:flex flex-col h-[650px] w-[400px] rounded-xl bg-bgsecondary shadow-2xl items-center pt-8 text-secondary">
                        <h1 className="font-bold text-4xl">Bienvenido</h1>
                        <img src="./vetlink-logo.png" alt="logo" className="h-20 w-20 my-10" />
                        <label htmlFor="correo" className="w-[300px] text-lg text-secondary text-left font-bold">Correo</label>
                        <input
                            id="correo"
                            type="text"
                            placeholder="Escribe tu correo"
                            className="h-6 w-[300px] mb-5 bg-transparent border-b-2 border-secondary focus:border-primary focus:outline-none placeholder-gray-500 text-lg"
                        />
                        <label htmlFor="contraseña" className="w-[300px] text-lg text-secondary text-left font-bold">Contraseña</label>
                        <input
                            id="contraseña"
                            type={showPassword ? "text" : "password"}
                            placeholder="Escribe tu contraseña"
                            className="h-6 w-[300px] bg-transparent border-b-2 border-secondary focus:border-primary focus:outline-none placeholder-gray-500 text-lg"
                        />
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

                        <a  href="verificacion"
                            className="pt-5 font-bold text-primary hover:underline"
                        >¿Olvidaste tu contraseña?
                        </a>
                        <Button className="mt-5 text-3xl w-64 h-14 text-bgsecondary bg-primary hover:scale-[1.03]">
                            Iniciar Sesión
                        </Button>
                        <p className="pt-5 text-elemsec font-bold opacity-70">¿No tienes un usuario?</p>
                        <a  href="registro"
                            className=" font-bold text-primary hover:underline"
                        >Regístrate
                        </a>

                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}
export default Login
