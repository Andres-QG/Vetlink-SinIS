import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

import axios from "axios";
import Button from "./Button";
import Loading from "../components/Loading";
import Dropdown from "./Dropdown";

function Header() {
  const navigate = useNavigate();
  const isActive = document.cookie.includes("true");
  const { role } = useContext(AuthContext);

  const [burger_class, setBurgerClass] = useState("burger-bar unclicked");
  const [menu_class, setMenuClass] = useState("menu_hidden");
  const [isMenuClicked, setIsMenuClicked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadText, setLoadText] = useState("Cerrando sesión");

  const items = [
    { text: "Consultar clínicas", href: "/owner", role: [1] },
    { text: "Consultar clientes", href: "/consultclients", role: [1, 2, 3] },
    { text: "Consultar mascotas", href: "/consultpets", role: [1, 2, 3] },
    { text: "Consultar veterinarios", href: "/consultvets", role: [1, 2] },
    { text: "Consultar administradores", href: "/consultAdmins", role: [1] },
  ];

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

  async function logOut() {
    try {
      setLoadText("Cerrando sesión");
      setLoading(true);
      await axios.post(
        "http://localhost:8000/api/log-out/",
        {},
        { withCredentials: true }
      );
      document.cookie = "active=false;path=/;";
      setLoading(false);
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  }

  useEffect(() => {
    if (!isActive && !document.cookie.includes("false")) {
      logOut();
    }
  }, [document.cookie]);

  const menuItems = isActive
    ? [
        { text: "Sobre nosotros", href: "/" },
        { text: "Servicios", href: "services" },
        { text: "Contacto", href: "#" },
        { text: "Cerrar Sesión", onClick: logOut },
      ]
    : [
        { text: "Sobre nosotros", href: "/" },
        { text: "Servicios", href: "services" },
        { text: "Contacto", href: "#" },
        { text: "Iniciar Sesión", href: "login" },
        { text: "Registrarme", href: "signup" },
      ];

  const additionalItems = items.filter((item) => item.role.includes(role));
  menuItems.splice(3, 0, ...additionalItems);

  if (loading) {
    return <Loading text={loadText} />;
  }

  return (
    <>
      <header className="z-10 w-full py-4 bg-bgsecondary text-primary font-montserrat">
        <div className="flex flex-wrap items-center justify-between w-full px-4 mx-auto">
          <div
            className="left-0 flex transition-all duration-300 ease-in-out hover:scale-105 text-secondary"
            onClick={() => {
              handleClick("");
            }}
          >
            <img
              src="./src/assets/icons/logo.png"
              alt="logo"
              className="w-10 h-10"
            />
            <h1 className="pt-1 pl-2 text-3xl font-bold cursor-pointer">
              VetLink
            </h1>
          </div>
          <nav className="items-center pl-10 mt-4 md:mt-0">
            <ul className="flex-wrap hidden lg:flex md:space-x-10">
              <li>
                <a
                  href="#"
                  className="relative pb-1 font-bold transition-colors duration-300 group hover:text-primary"
                >
                  Sobre nosotros
                  <span className="absolute block w-0 h-0.5 bg-primary bottom-0 left-0 group-hover:w-full transition-all duration-300"></span>
                </a>
              </li>
              <li>
                <a
                  href="services"
                  className="relative pb-1 font-bold transition-colors duration-300 group hover:text-primary"
                >
                  Servicios
                  <span className="absolute block w-0 h-0.5 bg-primary bottom-0 left-0 group-hover:w-full transition-all duration-300"></span>
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="relative pb-1 font-bold transition-colors duration-300 group hover:text-primary"
                >
                  Contacto
                  <span className="absolute block w-0 h-0.5 bg-primary bottom-0 left-0 group-hover:w-full transition-all duration-300"></span>
                </a>
              </li>
              {isActive ? (
                <li>
                  <Dropdown items={items} />
                </li>
              ) : null}
            </ul>
          </nav>
          {!isActive ? (
            <div className="hidden mt-4 space-x-3 font-bold lg:flex md:mt-0">
              <Button
                className="transition-all duration-300 border-primary hover:scale-105"
                onClick={() => {
                  handleClick("login");
                }}
              >
                Iniciar sesión
              </Button>
              <Button
                className="transition-all duration-300 border-primary bg-primary text-bgsecondary hover:text-bgprimary hover:border-primary hover:scale-105"
                onClick={() => handleClick("signup")}
              >
                Registrarme
              </Button>
            </div>
          ) : (
            <>
              <Button
                className="hidden transition-all duration-300 lg:flex border-primary bg-primary text-bgsecondary hover:text-bgprimary hover:border-primary hover:scale-105"
                onClick={logOut}
              >
                Cerrar Sesión
              </Button>
            </>
          )}

          <div
            className="flex flex-col space-y-1 cursor-pointer burger-menu lg:hidden "
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
        <ul className="flex flex-col justify-center h-full">
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
                  onClick={(e) => {
                    e.preventDefault();
                    if (item.onClick) {
                      item.onClick();
                    } else {
                      window.location.href = item.href;
                    }
                  }}
                  className="font-bold transition duration-500 cursor-pointer hover:text-action"
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
