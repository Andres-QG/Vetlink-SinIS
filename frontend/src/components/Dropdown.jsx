import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import Error from "../routes/Error";

import {
  ArrowDropDown,
  ArrowDropUp,
} from "@mui/icons-material";

function Dropdown({ items }) {
  const [isOpen, setIsOpen] = useState(false);
  const { role, fetchUserRole } = useContext(AuthContext);

  useEffect(() => {
    fetchUserRole();
  }, []);


  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="hidden lg:block min-w-[105px]">
      <div className="relative group">
        <button
          onClick={toggleDropdown}
          className="w-full font-bold border-none focus:border-primary rounded-md ease-in-out transition duration-150 flex justify-between items-center"
        >
          Acciones
          <span className="transition duration-300">
            {isOpen ? <ArrowDropUp /> : <ArrowDropDown />}
          </span>
        </button>
        <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-primary group-hover:w-[95%] transition-all duration-300"></span>
      </div>
      <div
        className={`absolute w-[200px] mt-1 bg-bgsecondary shadow-lg z-10 transition-all duration-300 ease-out transform ${isOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"
          }`}
      >
        <div className="flex flex-col">
          {items
            .filter(item => item.role.includes(role) >= role)
            .map((item, index) => (
              <a
                key={index}
                href={item.href}
                className="pl-1 py-1 block hover:bg-gray-200 relative group transition duration-300"
              >
                {item.text}
              </a>
            ))}
        </div>
      </div>
    </div>
  );
}

export default Dropdown