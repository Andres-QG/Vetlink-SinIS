import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

import Button from "./Button";

function Header() {
  const navigate = useNavigate();

  const [burger_class, setBurgerClass] = useState("burger-bar unclicked");
  const [menu_class, setMenuClass] = useState("menu_hidden");
  const [isMenuClicked, setIsMenuClicked] = useState(false);

  const { role } = useContext(AuthContext);

  const updateMenu = () => {
    setBurgerClass(
      isMenuClicked ? "burger-bar unclicked" : "burger-bar clicked"
    );
    setMenuClass(isMenuClicked ? "menu_hidden" : "menu_visible");
    setIsMenuClicked(!isMenuClicked);
  };

  const handleClick = (route) => {
    navigate(`/${route}`);
  };

  const menuItems = role !== 0
    ? [
      { text: "Sobre nosotros", href: "/" },
      { text: "Servicios", href: "services" },
      { text: "Contacto", href: "#" },
      { text: "Dashboard", href: role }, 
      { text: "Cerrar Sesión", href: "logout" },
    ]
    : [
      { text: "Sobre nosotros", href: "/" },
      { text: "Servicios", href: "services" },
      { text: "Contacto", href: "#" },
      { text: "Iniciar Sesión", href: "login" },
      { text: "Registrarme", href: "#" },
    ]; 

  return (
    <>
      <header className="bg-bgsecondary text-primary py-4 z-10 w-full font-montserrat">
        <div className="w-full mx-auto flex flex-wrap justify-between items-center px-4">
          <div
            className="flex hover:scale-105 transition-all duration-300 ease-in-out left-0 text-secondary"
            onClick={() => {
              handleClick("");
            }}
          >
            <img
              src="./src/assets/icons/logo.png"
              alt="logo"
              className="h-10 w-10"
            />
            <h1 className="text-3xl font-bold cursor-pointer pl-2 pt-1">
              VetLink
            </h1>
          </div>
          <nav className="items-center mt-4 md:mt-0 pl-10">
            <ul className="hidden flex-wrap lg:flex md:space-x-10">
              <li>
                <a
                  href="#"
                  className="relative group font-bold hover:text-primary transition-colors duration-300 pb-1"
                >
                  Sobre nosotros
                  <span className="absolute block w-0 h-0.5 bg-primary bottom-0 left-0 group-hover:w-full transition-all duration-300"></span>
                </a>
              </li>
              <li>
                <a
                  href="services"
                  className="relative group font-bold hover:text-primary transition-colors duration-300 pb-1"
                >
                  Servicios
                  <span className="absolute block w-0 h-0.5 bg-primary bottom-0 left-0 group-hover:w-full transition-all duration-300"></span>
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="relative group font-bold hover:text-primary transition-colors duration-300 pb-1"
                >
                  Contacto
                  <span className="absolute block w-0 h-0.5 bg-primary bottom-0 left-0 group-hover:w-full transition-all duration-300"></span>
                </a>
              </li>
            </ul>
          </nav>
          {role === 0 ? (
            <div className="hidden lg:flex space-x-3 mt-4 md:mt-0 font-bold">
              <Button
                className="border-primary transition-all duration-300 hover:scale-105"
                onClick={() => {
                  handleClick("login");
                }}
              >
                Iniciar sesión
              </Button>
              <Button className="border-primary bg-primary text-bgsecondary hover:text-bgprimary hover:border-primary hover:scale-105 transition-all duration-300">
                Registrarme
              </Button>
            </div>
          ) : (
            <Button
              className="border-primary bg-primary text-bgsecondary hover:text-bgprimary hover:border-primary hover:scale-105 transition-all duration-300"
              onClick={() => {
              }}
            >
              Cerrar Sesión
            </Button>
          )
          }
          <div
            className="burger-menu flex flex-col space-y-1 lg:hidden cursor-pointer  "
            onClick={updateMenu}
          >
            <div
              className={`w-6 h-0.5 bg-secondary transition-all duration-300 ${
                burger_class === "burger-bar unclicked"
                  ? ""
                  : "rotate-45 translate-y-1.5"
              }`}
            ></div>
            <div
              className={`w-6 h-0.5 bg-secondary transition-all duration-300 ${
                burger_class === "burger-bar unclicked" ? "" : "opacity-0"
              }`}
            ></div>
            <div
              className={`w-6 h-0.5 bg-secondary transition-all duration-300 ${
                burger_class === "burger-bar unclicked"
                  ? ""
                  : "-rotate-45 -translate-y-1.5"
              }`}
            ></div>
          </div>
        </div>
      </header>
      <div
        className={`absolute top-[4.3rem] w-full z-20 bg-bgsecondary text-secondary lg:hidden transition-opacity duration-500 ${
          isMenuClicked ? "opacity-1" : "opacity-0 pointer-events-none"
        }`}
      >
        <ul className="flex flex-col h-full justify-center">
          {menuItems.map((item, index) => (
            <React.Fragment key={item.text}>
              {" "}
              {/* Use a unique id or index as a fallback */}
              <hr className="border-t border-secondary" />
              <li
                className={`p-4 text-center ${menu_class} -translate-x-6`}
                style={{
                  transitionDelay: `${index * 0.05}s`, // Use index for delay if necessary
                }}
              >
                <a
                  href={item.href}
                  className="font-bold hover:text-action transition duration-500"
                >
                  {item.text}
                </a>
              </li>
            </React.Fragment>
          ))}
          <hr className="border-t border-secondary" />
        </ul>
      </div>
    </>
  );
}

export default Header;
