import React, { useEffect, useState } from 'react';
import Header from "../components/Header";
import Footer from "../components/Footer";
import axios from 'axios';

function ConsultClients() {
    const [clientes, setClientes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchClientes = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/consult-client/'); // Cambia la URL si es necesario
                setClientes(response.data);
            } catch (err) {
                setError('Error al cargar los clientes');
            } finally {
                setLoading(false);
            }
        };

        fetchClientes();
    }, []);

    if (loading) return <p>Cargando...</p>;
    if (error) return <p>{error}</p>;

    return (
        <>
            <Header />
            <div className="container mx-auto mt-5">
                <h1 className="mb-4 text-2xl font-bold">Clientes</h1>
                <table className="min-w-full border border-collapse border-gray-300">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="px-4 py-2 border border-gray-300">Usuario</th>
                            <th className="px-4 py-2 border border-gray-300">Cédula</th>
                            <th className="px-4 py-2 border border-gray-300">Nombre</th>
                            <th className="px-4 py-2 border border-gray-300">Teléfono</th>
                            <th className="px-4 py-2 border border-gray-300">Correo</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clientes.map(cliente => (
                            <tr key={cliente.usuario}>
                                <td className="px-4 py-2 border border-gray-300">{cliente.usuario}</td>
                                <td className="px-4 py-2 border border-gray-300">{cliente.cedula}</td>
                                <td className="px-4 py-2 border border-gray-300">{cliente.nombre}</td>
                                <td className="px-4 py-2 border border-gray-300">{cliente.telefono}</td>
                                <td className="px-4 py-2 border border-gray-300">{cliente.correo}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Footer />
        </>
    );
}

export default ConsultClients;