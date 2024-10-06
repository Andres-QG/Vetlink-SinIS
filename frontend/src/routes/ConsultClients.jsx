import { useState, useEffect } from "react";
import { CircularProgress, Button, Box, Snackbar, Alert } from "@mui/material";
import { Add } from "@mui/icons-material";
import ConsultClientsTable from "../components/ConsultClients/ConsultClientsTable";
import SearchBar from "../components/ConsultClients/SearchBar";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";
import AddClientModal from "../components/ConsultClients/AddClientModal"; // Modal para agregar cliente

const ConsultClients = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchColumn, setSearchColumn] = useState("usuario");
  const [order, setOrder] = useState("asc");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [openModal, setOpenModal] = useState(false); // Estado para abrir/cerrar modal
  const [snackbarMessage, setSnackbarMessage] = useState(""); // Estado para el mensaje de éxito/error
  const [snackbarOpen, setSnackbarOpen] = useState(false); // Controla el estado del Snackbar
  const [snackbarSeverity, setSnackbarSeverity] = useState("success"); // Controla si es éxito o error

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

  // Función para agregar un cliente
  const handleAddClient = async (clientData) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/add-client/",
        clientData
      );
      setSnackbarMessage("Cliente agregado exitosamente.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      fetchClients(); // Refrescar la tabla al agregar cliente
      setOpenModal(false); // Cierra el modal al agregar exitosamente
    } catch (error) {
      // Aquí manejamos los errores del backend
      if (error.response && error.response.data) {
        const backendError = error.response.data.error;

        // Verifica si el error es de usuario o correo duplicados
        if (backendError === "El usuario o el correo ya están en uso.") {
          setSnackbarMessage("El usuario o el correo ya están en uso.");
        } else {
          setSnackbarMessage(backendError || "Error al agregar cliente.");
        }
      } else {
        setSnackbarMessage("Error de conexión al agregar cliente.");
      }

      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  // Función para mostrar el Snackbar desde ConsultClientsTable
  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
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
      <div className="flex-grow p-4 md:mt-6 md:mb-6">
        <div className="flex flex-col items-center justify-between mb-4 space-y-4 md:flex-row md:space-y-0">
          <h1 className="text-2xl font-semibold">Consultar Clientes</h1>
          <div className="flex flex-col w-full space-y-4 md:w-auto md:flex-row md:items-center md:space-y-0">
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setOpenModal(true)} // Abre el modal
              sx={{
                backgroundColor: "#00308F",
                "&:hover": { backgroundColor: "#00246d" },
                minWidth: "190px",
                marginBottom: { xs: "-4px", md: "0px" },
                marginRight: { xs: "0px", md: "10px" },
                width: { xs: "100%", md: "auto" },
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
            fetchClients={fetchClients} // Pasa la función para recargar la tabla
            showSnackbar={showSnackbar} // Pasa la función para mostrar el snackbar
          />
        )}
      </div>
      <Footer />

      {/* Modal para agregar cliente */}
      <AddClientModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSubmit={handleAddClient}
      />

      {/* Snackbar para mostrar mensajes */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default ConsultClients;
