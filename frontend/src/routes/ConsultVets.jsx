import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, CircularProgress, Snackbar, Alert } from "@mui/material";
import { Add } from "@mui/icons-material";
import Header from "../components/Header";
import Footer from "../components/Footer";
import SearchBar from "../components/ConsultVets/SearchBar";
import ConsultVetsTable from "../components/ConsultVets/ConsultVetsTable";
import AddVetModal from "../components/ConsultVets/AddVetModal";
import ConsultClientsTable from "../components/ConsultClients/ConsultClientsTable";

const ConsultVets = () => {
  const [vets, setVets] = useState([]);
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
    fetchVets();
  }, [searchTerm, searchColumn, order, page]);

  const fetchVets = async () => {
    setLoading(true);
    const params = {
      search: searchTerm,
      column: searchColumn,
      order: order,
      page: page,
    };

    try {
      const response = await axios.get(
        "http://localhost:8000/api/consult_vet/",
        { params }
      );
      const data = response.data;
      // console.log(data);
      setVets(data.results);
      setTotalPages(Math.ceil(data.count / 10));
    } catch (error) {
      console.error("Failed to fetch vets:", error);
    } finally {
      setLoading(false);
    }
  };

  // Función para agregar un veterinario
  const handleAddVet = async (vetData) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/add_vet/",
        vetData
      );
      setSnackbarMessage("Veterinario agregado exitosamente.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      fetchVets(); // Refrescar la tabla al agregar veterinario
      setOpenModal(false);
    } catch (error) {
      console.error("Failed to add vet:", error);
      setSnackbarMessage("Error al agregar veterinario.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
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
      <div className="flex-grow p-4 md:mt-6 md:mb-6">
        <div className="flex flex-col items-center justify-between mb-4 space-y-4 md:flex-row md:space-y-0">
          <h1 className="text-2xl font-semibold">Consultar Veterinarios</h1>
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
              }}>
              Agregar Veterinario
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
            clients={vets}
            page={page}
            setPage={setPage}
            totalPages={totalPages}
          />
        )}
      </div>
      <Footer />

      {/* Modal para agregar veterinario */}
      <AddVetModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSubmit={handleAddVet}
      />

      {/* Snackbar para mostrar mensajes */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default ConsultVets;
