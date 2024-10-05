import { useState, useEffect } from "react";
import { CircularProgress, Button, Box } from "@mui/material";
import { Add } from "@mui/icons-material";
import ConsultClientsTable from "../components/ConsultClients/ConsultClientsTable";
import SearchBar from "../components/ConsultClients/SearchBar";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";

const ConsultClients = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchColumn, setSearchColumn] = useState("usuario");
  const [order, setOrder] = useState("asc");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchClients();
  }, [searchTerm, searchColumn, order, page]);

  const fetchClients = async () => {
    setLoading(true);
    const params = {
      search: searchTerm,
      column: searchColumn,
      order: order,
      page: page,
    };

    try {
      const response = await axios.get(
        "http://localhost:8000/api/consult-client/",
        { params }
      );
      const data = response.data;
      setClients(data.results);
      setTotalPages(Math.ceil(data.count / 10));
    } catch (error) {
      console.error("Failed to fetch clients:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (term, column, sortOrder) => {
    setSearchTerm(term);
    setSearchColumn(column);
    setOrder(sortOrder);
    setPage(1);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-grow p-4">
        <div className="flex flex-col items-center justify-between mb-4 space-y-4 md:flex-row md:space-y-0">
          <h1 className="text-2xl font-semibold">Consultar Clientes</h1>
          <div className="flex flex-col w-full space-y-4 md:w-auto md:flex-row md:items-center md:space-y-0">
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => {}}
              sx={{
                backgroundColor: "#00308F",
                "&:hover": { backgroundColor: "#00246d" },
                minWidth: "190px",
                marginBottom: { xs: "-4px", md: "0px" },
                marginRight: { xs: "0px", md: "10px" },
                width: { xs: "100%", md: "auto" }, // Se ajusta en pantallas pequeñas
              }}
            >
              Agregar Cliente
            </Button>
            <SearchBar onSearch={handleSearch} />
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center">
            <CircularProgress />
          </div>
        ) : (
          <ConsultClientsTable
            clients={clients}
            page={page}
            setPage={setPage}
            totalPages={totalPages}
          />
        )}
      </div>
      <Footer />
    </div>
  );
};

export default ConsultClients;
