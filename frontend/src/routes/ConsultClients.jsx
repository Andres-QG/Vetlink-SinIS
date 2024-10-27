import { useState, useEffect } from "react";
import { CircularProgress, Button, Snackbar, Alert } from "@mui/material";
import { Add } from "@mui/icons-material";
import GeneralTable2 from "../components/Consult/GeneralTable2";
import SearchBar from "../components/Consult/GeneralizedSearchBar";
import ModifyClientModal from "../components/ConsultClients/ModifyClientModal";
import DeleteClientModal from "../components/ConsultClients/DeleteClientModal";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";
import AddClientModal from "../components/ConsultClients/AddClientModal";

const ConsultClients = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchColumn, setSearchColumn] = useState("usuario");
  const [order, setOrder] = useState("asc");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [openModal, setOpenModal] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

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

  const columns = [
    { field: "usuario", headerName: "Usuario" },
    { field: "nombre", headerName: "Nombre" },
    { field: "apellidos", headerName: "Apellido" },
    { field: "cedula", headerName: "Cédula" },
    { field: "telefono", headerName: "Teléfono" },
    { field: "correo", headerName: "Correo" },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow">
        <div className="flex flex-col items-center justify-between mb-4 space-y-4 md:flex-row md:space-y-0">
          <h1 className="text-2xl font-semibold">Consultar Clientes</h1>
          <div className="flex flex-col w-full space-y-4 md:w-auto md:flex-row md:items-center md:space-y-0">
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setOpenModal(true)}
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
            <SearchBar
              onSearch={handleSearch}
              columns={columns.map((col) => col.field)}
            />
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center">
            <CircularProgress />
          </div>
        ) : (
          <GeneralTable2
            data={clients}
            columns={columns}
            page={page}
            setPage={setPage}
            totalPages={totalPages}
            fetchData={fetchClients}
            showSnackbar={showSnackbar}
            EditModal={ModifyClientModal}
            DeleteModal={DeleteClientModal}
            keyField="usuario"
          />
        )}
      </div>

      <AddClientModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        fetchClients={fetchClients}
        showSnackbar={showSnackbar}
      />

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
