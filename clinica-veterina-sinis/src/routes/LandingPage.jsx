import { useNavigate } from 'react-router-dom';

import Header from "../components/Header";
import Footer from "../components/Footer";
import Button from "../components/Button";

import image from "../assets/veterinary.png"
import image2 from "../assets/hotline.png"
import image3 from "../assets/veterinarian.png"
import image4 from "../assets/vet.png"

function LandingPage() {
    const navigate = useNavigate();

    const handleClick = (route) => {
        console.log("route");
        navigate(`/${route}`);
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow">
                <div className="flex justify-evenly p-24 px-8 bg-bg-primary">
                    <div className="flex-1 flex items-center justify-center">
                        <img src={`${image}`} alt="happy dog" style={{ width: 'auto', height: 'auto' }} />
                    </div>
                    <div className="flex-1">
                        <div className="w-[400px] flex flex-col items-start">
                            <h1 className="text-xl text-text border-0 border-primary bg-primary rounded-full p-3 font-bold text-center">
                                Bienvenidos 
                            </h1>

                            <div className="mt-6 space-y-4 ">
                                <p className="text-left text-9xl text-secondary font-bold">
                                    Somos Vetlink 
                                </p>
                                <p className="text-left text-3xl text-secondary pt-12 font-semibold">
                                    Una veterinaria que se preocupa por tu mascota tanto como vos.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-evenly p-24 px-8 bg-tertiary">
                    <div className="flex flex-col items-center w-96 p-4 ">
                        <h1 className="text-3xl font-bold mb-4 text-secondary">
                            Servicios
                        </h1>
                        <img src={`${image2}`} alt="" className="w-28 h-auto m-4" />
                        <p className="text-center mb-4 text-xl font-semibold text-secondary pt-8">
                            Ofrecemos variedad de servicios para tus mascotas
                        </p>
                        <button className="px-4 py-2 rounded-lg bg-primary text-secondary font-bold
                                           mt-8 hover:bg-secondary hover:text-text transition-all duration-300 transform hover:scale-105"
                                onClick={() => {handleClick('services')}}>
                            Leer más
                        </button>
                    </div>
                    <div className="flex flex-col items-center w-96 p-4 bg-tertiary">
                        <h1 className="text-3xl font-bold mb-4 text-secondary">
                            Más sobre nosotros
                        </h1>
                        <img src={`${image3}`} alt="" className="w-28 h-auto m-4" />
                        <p className="text-center mb-4 text-xl font-semibold text-secondary pt-8">
                            Todo lo que necesites sobre nuestro equipo
                        </p>
                        <button className="px-4 py-2 rounded-lg bg-primary text-secondary font-bold
                                           mt-8 hover:bg-secondary hover:text-text transition-all duration-300 transform hover:scale-105"
                            onClick={""}>
                            Leer más
                        </button>
                    </div>
                </div>

                <div className="flex flex-col items-center justify-center space-y-10 p-24 px-8 bg-tertiary2">
                    <div className="flex-1 flex flex-row items-center text-center mb-6 space-x-10">
                        <p className="mr-4 text-4xl font-semibold text-secondary">Cuidaremos de tu mascota<br />como si fuera nuestra</p>
                        <img src={`${image3}`} alt="Mascotas son importantes" className="w-64 h-auto" />
                    </div>
                    <div className="flex-1 flex flex-row items-center text-center space-x-10">
                        <img src={`${image4}`} alt="La salud importa" className="w-64 h-auto" />
                        <p className="mr-4 text-4xl font-semibold text-secondary">Nos preocupa la salud<br /> de tu mascota</p>
                    </div>
                </div>

            </main>
            <Footer />
        </div>
    )
}
export default LandingPage