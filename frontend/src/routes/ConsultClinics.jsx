import { useState, useEffect } from "react";
import { CircularProgress, Button, Modal, Alert, Stack } from "@mui/material";
import { Add } from "@mui/icons-material";
import GeneralTable from "../components/Consult/GeneralTable";
import SearchBar from "../components/Consult/GeneralizedSearchBar";
import AddClinicModal from "../components/consultClinics/AddClinicModal";
import ModifyClinicModal from "../components/consultClinics/ModifyClinicModal";
import Header from "../components/Header";
import Footer from "../components/Footer";
import axios from "axios";

const ConsultClinics = () => {
  const [clinics, setClinics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchColumn, setSearchColumn] = useState("clinica");
  const [order, setOrder] = useState("asc");
  const rowsPerPage = 10;
  const [open, setOpen] = useState(false);
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "",
  });

  const columns = [
    { field: "clinica", headerName: "Nombre" },
    { field: "direccion", headerName: "Direccion" },
    { field: "telefono", headerName: "Telefono" },
    { field: "dueño", headerName: "Dueño" },
  ];

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    fetchClinics();
  }, [page, searchTerm, searchColumn, order]);

  const fetchClinics = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        search: searchTerm,
        column: searchColumn,
        order,
        page_size: rowsPerPage,
      };
      const response = await axios.get(
        "http://localhost:8000/api/consult-clinics/",
        { params }
      );
      const data = response.data;
      setClinics(data.results);
      setTotalCount(data.count);
    } catch (error) {
      setAlert({
        open: true,
        message: error.response.data.detail,
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (term, column) => {
    setSearchTerm(term);
    setSearchColumn(column);
    setPage(1);
  };

  const handleAddClinicSuccess = (message, severity) => {
    setAlert({ open: true, message, severity });
    fetchClinics();
    handleClose();
  };

  const handleCloseAlert = () => {
    setAlert({ open: false, message: "", severity: "" });
  };

  const handleDelete = (message, severity) => {
    setAlert({ open: true, message, severity });
    fetchClinics();
  };

  const handleModification = (message, severity) => {
    setAlert({ open: true, message, severity });
    fetchClinics();
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-grow p-4">
        {/* Mostrar alerta si está abierta */}
        {alert.open && (
          <Stack sx={{ width: "100%", mb: 2 }} spacing={2}>
            <Alert severity={alert.severity} onClose={handleCloseAlert}>
              {alert.message || "Ocurrió un error desconocido."}
            </Alert>
          </Stack>
        )}

        <div className="flex flex-col items-center justify-between mb-4 space-y-4 md:flex-row md:space-y-0">
          <h1 className="text-2xl font-semibold">Consultar Clínicas</h1>
          <div className="flex flex-col w-full space-y-4 md:w-auto md:flex-row md:items-center md:space-y-0">
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => {
                handleOpen();
              }}
              sx={{
                backgroundColor: "#00308F",
                "&:hover": { backgroundColor: "#00246d" },
                minWidth: "190px",
                marginBottom: { xs: "-4px", md: "0px" },
                marginRight: { xs: "0px", md: "10px" },
                width: { xs: "100%", md: "auto" },
                fontSize: "0.85rem",
              }}
            >
              Agregar Clínica
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
          <GeneralTable
            data={clinics}
            columns={columns}
            totalCount={totalCount}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={setPage}
            deletionUrl="http://localhost:8000/api/delete-clinic/"
            pkCol="clinica_id"
            onDelete={handleDelete}
            visualIdentifierCol="clinica"
            fetchData={fetchClinics}
            OnModModal={ModifyClinicModal}
            onModify={handleModification}
          />
        )}
        {/* Modal agregar */}
        <Modal
          open={open}
          onClose={handleClose}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <AddClinicModal
            handleClose={handleClose}
            onSuccess={handleAddClinicSuccess}
          />
        </Modal>
      </div>
      <Footer />
    </div>
  );
};

export default ConsultClinics;
