import React from 'react';
import { useNavigate } from "react-router-dom";

function Error() {
    const navigate = useNavigate();

    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white bg-opacity-90 text-secondary">
            <div className="text-center p-14 bg-white rounded-lg shadow-lg">
                <h1 className="font-bold text-6xl">Error 404</h1>
                <h2 className="text-3xl pt-10">
                    La página que buscas no puede cargarse ahora
                    <br />
                    o no tienes los permisos necesarios.
                </h2>
                <p className="text-3xl p-10">Revisa la URL o contacta con el administrador</p>
                <button
                    onClick={() => navigate("/")}
                    className="text-2xl underline text-blue-500"
                >
                    Volver a la página de inicio
                </button>
            </div>
        </div>
    );
}

export default Error;
