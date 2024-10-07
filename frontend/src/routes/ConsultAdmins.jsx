import { useState, useEffect } from "react";
import { CircularProgress, Button, Snackbar, Alert } from "@mui/material";
import { Add } from "@mui/icons-material";
import GeneralTable2 from "../components/Consult/GeneralTable2";
import SearchBar from "../components/ConsultClients/SearchBar";
import ModifyAdminModal from "../components/ConsultClients/ModifyAdminModal";
import DeleteAdminModal from "../components/ConsultClients/DeleteAdminModal";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";
import AddAdminModal from "../components/ConsultClients/AddAdminModal";

const ConsultAdmins = () => {
  const [admins, setAdmins] = useState([]);
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
    fetchAdmins();
  }, [searchTerm, searchColumn, order, page]);

  const fetchAdmins = async () => {
    setLoading(true);
    const params = {
      search: searchTerm,
      column: searchColumn,
      order: order,
      page: page,
    };

    try {
      const response = await axios.get(
        "http://localhost:8000/api/consult-admin/",
        { params }
      );
      const data = response.data;
      setAdmins(data.results);
      setTotalPages(Math.ceil(data.count / 10));
    } catch (error) {
      console.error("Failed to fetch admins:", error);
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
    { field: "clinica", headerName: "Clinica" },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-grow p-4 md:mt-6 md:mb-6">
        <div className="flex flex-col items-center justify-between mb-4 space-y-4 md:flex-row md:space-y-0">
          <h1 className="text-2xl font-semibold">Consultar Administradores</h1>
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
              Agregar Administrador
            </Button>
            <SearchBar onSearch={handleSearch} />
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center">
            <CircularProgress />
          </div>
        ) : (
          <GeneralTable2
            data={admins}
            columns={columns}
            page={page}
            setPage={setPage}
            totalPages={totalPages}
            fetchData={fetchAdmins}
            showSnackbar={showSnackbar}
            EditModal={ModifyAdminModal}
            DeleteModal={DeleteAdminModal}
            keyField="usuario"
          />
        )}
      </div>
      <Footer />

      <AddAdminModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        fetchClients={fetchAdmins}
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

export default ConsultAdmins;
