import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from './Button';

import '../index.css'

function Header() {
    const navigate = useNavigate();

    const [burger_class, setBurgerClass] = useState("burger-bar unclicked")
    const [menu_class, setMenuClass] = useState("menu_hidden")
    const [isMenuClicked, setIsMenuClicked] = useState(false)

    const updateMenu = () => {
        setBurgerClass(isMenuClicked ? "burger-bar unclicked" : "burger-bar clicked");
        setMenuClass(isMenuClicked ? "menu_visible" : "menu_hidden");
        setIsMenuClicked(!isMenuClicked);
        console.log(menu_class)
    }

    const handleClick = () => {
        navigate('/');
    };

    return (
        <>
            <header className="bg-blue-600 text-white py-4">
                <div className="container mx-auto flex flex-wrap justify-between items-center px-4">
                    <h1 className="text-3xl font-bold cursor-pointer hover:text-gray-300 transition-all duration-300" onClick={handleClick}>PetLink</h1>
                    <nav className="flex-1 flex flex-wrap justify-between items-center mt-4 md:mt-0">
                        <ul className="hidden flex-wrap space-x-5 lg:flex md:space-x-10 justify-center md:justify-start lg:ml-auto">
                            <li>
                                <a href="#" className="relative group font-bold text-white hover:text-gray-300 transition-colors duration-300 pb-1">
                                    Sobre nosotros
                                    <span className="absolute block w-0 h-0.5 bg-white bottom-0 left-0 group-hover:w-full transition-all duration-300"></span>
                                </a>
                            </li>
                            <li>
                                <a href="#" className="relative group font-bold text-white hover:text-gray-300 transition-colors duration-300 pb-1">
                                    Servicios
                                    <span className="absolute block w-0 h-0.5 bg-white bottom-0 left-0 group-hover:w-full transition-all duration-300"></span>
                                </a>
                            </li>
                            <li>
                                <a href="#" className="relative group font-bold text-white hover:text-gray-300 transition-colors duration-300 pb-1">
                                    Contacto
                                    <span className="absolute block w-0 h-0.5 bg-white bottom-0 left-0 group-hover:w-full transition-all duration-300"></span>
                                </a>
                            </li>
                        </ul>
                        <div className="hidden lg:flex space-x-3 mt-4 md:mt-0 lg:ml-auto">
                            <Button className="border-2 rounded-md px-3 py-1 hover:text-pink-300 hover:border-pink-300 transition-all duration-300">Iniciar sesión</Button>
                            <Button className="border-2 rounded-md px-3 py-1 hover:text-pink-300 hover:border-pink-300 transition-all duration-300">Registrarme</Button>
                        </div>
                    </nav>
                    <div className="burger-menu flex flex-col space-y-1 lg:hidden cursor-pointer  " onClick={updateMenu}>
                        <div className={`w-6 h-0.5 bg-white transition-all duration-300 ${burger_class === 'burger-bar clicked' ? 'rotate-45 translate-y-1.5' : ''}`}></div>
                        <div className={`w-6 h-0.5 bg-white transition-all duration-300 ${burger_class === 'burger-bar clicked' ? 'opacity-0' : ''}`}></div>
                        <div className={`w-6 h-0.5 bg-white transition-all duration-300 ${burger_class === 'burger-bar clicked' ? '-rotate-45 -translate-y-1.5' : ''}`}></div>
                    </div>
                </div>
            </header>
            <hr className="border-t border-white" />
            <div
                className={`relative flex w-full transition-transform duration-500 ease-in-out ${menu_class} lg:hidden`}
            >
                <ul className="w-full flex flex-col lg:hidden justify-center">
                    <li className="bg-blue-500 text-white p-4 w-full text-center transition-transform transform translate-y-0 opacity-100 duration-300 ease-out">
                        <a href="#" className="relative group font-bold text-white hover:text-gray-300 transition-colors duration-300 pb-1">
                            Sobre nosotros
                        </a>
                    </li>
                    <hr className="border-t border-white" />
                    <li className="bg-blue-500 text-white p-4 w-full text-center transition-transform transform translate-y-0 opacity-100 duration-400 ease-out">
                        <a href="#" className="relative group font-bold text-white hover:text-gray-300 transition-colors duration-300 pb-1">
                            Servicios
                        </a>
                    </li>
                    <hr className="border-t border-white" />
                    <li className="bg-blue-500 text-white p-4 w-full text-center transition-transform transform translate-y-0 opacity-100 duration-500 ease-out">
                        <a href="#" className="relative group font-bold text-white hover:text-gray-300 transition-colors duration-300 pb-1">
                            Contacto
                        </a>
                    </li>
                    <hr className="border-t border-white" />
                    <li className="bg-blue-500 text-white p-4 w-full text-center transition-transform transform translate-y-0 opacity-100 duration-500 ease-out">
                        <a href="#" className="relative group font-bold text-white hover:text-gray-300 transition-colors duration-300 pb-1">
                            Iniciar Sesión
                        </a>
                    </li>
                    <hr className="border-t border-white" />
                    <li className="bg-blue-500 text-white p-4 w-full text-center transition-transform transform translate-y-0 opacity-100 duration-500 ease-out">
                        <a href="#" className="relative group font-bold text-white hover:text-gray-300 transition-colors duration-300 pb-1">
                            Registrarme
                        </a>
                    </li>
                    <hr className="border-t border-white" />
                </ul>
            </div>
        </>
    );
}

export default Header;
