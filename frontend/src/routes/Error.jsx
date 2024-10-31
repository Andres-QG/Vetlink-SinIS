import React from "react";
import { useNavigate } from "react-router-dom";

function Error() {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white bg-opacity-90 text-secondary">
      <div className="text-center bg-white rounded-lg shadow-lg p-14">
        <h1 className="text-6xl font-bold">Error 404</h1>
        <h2 className="pt-10 text-3xl">
          La página que buscas no puede cargarse ahora
          <br />o no tienes los permisos necesarios.
        </h2>
        <p className="p-10 text-3xl">
          Revisa la URL o contacta con el administrador
        </p>
        <button
          onClick={() => navigate("/")}
          className="text-2xl text-blue-500 underline"
        >
          Volver a la página de inicio
        </button>
      </div>
    </div>
  );
}

export default Error;
