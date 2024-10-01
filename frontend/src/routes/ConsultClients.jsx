import React, { useEffect, useState } from "react";
import UserTable from "../components/UserTable";
import Header from "../components/Header";
import Footer from "../components/Footer";
import SearchBar from "../components/SearchBar";
import LoadingSpinner from "../components/LoadingSpinner"; // Importa el componente

const ConsultClients = () => {
  const [users, setUsers] = useState([]);
  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterColumn, setFilterColumn] = useState('usuario');
  const [order, setOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false); // Estado para mostrar la rueda de carga

  const fetchUsers = async (page = 1) => {
    setIsLoading(true); // Inicia el estado de carga
    const url = `http://localhost:8000/api/consult-client/?page=${page}&search=${searchTerm}&column=${filterColumn}&order=${order}`;
    
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      setUsers(data.results);
      setNextPage(data.next);
      setPrevPage(data.previous);
      setTotalPages(Math.ceil(data.count / 10));
      setCurrentPage(page);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setIsLoading(false); // Finaliza el estado de carga
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [searchTerm, filterColumn, order]);

  const handlePageChange = (page) => {
    fetchUsers(page); // Cambia a la página seleccionada
  };

  const handleSearch = (term, column, sortOrder) => {
    setSearchTerm(term);
    setFilterColumn(column);
    setOrder(sortOrder);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-col flex-grow">
        <div className="flex items-center justify-between m-5 mb-0">
          <div className="flex items-center">
            <h1 className="mr-2 text-2xl font-bold">Clientes</h1>
            <button onClick={() => alert("Agregar nuevo cliente")}>
              <span className="mt-3 text-brand material-symbols-outlined">person_add</span>
            </button>
          </div>
          <div className="flex items-center">
            <SearchBar onSearch={handleSearch} />
          </div>
        </div>
        {/* Muestra la rueda de carga si los datos están cargando */}
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <UserTable
            users={users}
            nextPage={nextPage}
            prevPage={prevPage}
            onPageChange={handlePageChange}
            totalPages={totalPages}
            currentPage={currentPage}
          />
        )}
      </div>
      <Footer />
    </div>
  );
};

export default ConsultClients;
