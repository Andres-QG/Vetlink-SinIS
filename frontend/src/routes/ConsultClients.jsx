import React, { useEffect, useState } from "react";
import UserTable from "../components/UserTable";
import Header from "../components/Header";
import Footer from "../components/Footer";

const ConsultClients = () => {
  const [users, setUsers] = useState([]);
  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);
  const [totalPages, setTotalPages] = useState(0);

  const fetchUsers = async (url) => {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Network response was not ok");
      
      const data = await response.json();
      setUsers(data.results); // Asegúrate de que la estructura de datos sea correcta
      setNextPage(data.next); // URL para la siguiente página
      setPrevPage(data.previous); // URL para la página anterior
      const count = data.count; // Asumiendo que tu API devuelve el total de usuarios
      setTotalPages(Math.ceil(count / 10)); // Cambia 10 por el tamaño de tu página
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers("http://localhost:8000/api/consult-client/?page=1");
  }, []);

  const handlePageChange = (url) => {
    fetchUsers(url);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-grow">
        <h1 className="m-5 text-2xl font-bold">Clientes</h1>
        <UserTable
          users={users}
          nextPage={nextPage}
          prevPage={prevPage}
          onPageChange={handlePageChange}
          totalPages={totalPages} // Pasamos totalPages al componente UserTable
        />
      </div>
      <Footer />
    </div>
  );
};

export default ConsultClients;
