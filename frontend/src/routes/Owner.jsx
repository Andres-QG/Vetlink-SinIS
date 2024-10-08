import { useState, useEffect } from "react";
import axios from "axios";

import Header from "../components/Header";
import Footer from "../components/Footer";
import GeneralTable from "../components/Consult/GeneralTable";
import SearchBar from "../components/Consult/GeneralizedSearchBar";

import { CircularProgress, Button, Modal } from "@mui/material";
import { Add } from "@mui/icons-material";
import AddClinicaModal from "../components/consultClinics/AddClinicModal";
import ModifyClinicModal from "../components/consultClinics/ModifyClinicModal";

function Owner() {
    const [clinicas, setClinicas] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchColumn, setSearchColumn] = useState("nombre");
    const [order, setOrder] = useState("asc");
    const rowsPerPage = 10;
    const [open, setOpen] = useState(false);
    const [openMod, setOpenMod] = useState(false);
    const [selectedClinic, setSelectedClinic] = useState(null);
    const [snackbarMessage, setSnackbarMessage] = useState(""); // Estado para el mensaje de éxito/error
    const [snackbarOpen, setSnackbarOpen] = useState(false); // Controla el estado del Snackbar
    const [snackbarSeverity, setSnackbarSeverity] = useState("success"); // Controla si es éxito o error

    const columns = [
        { field: "clinica", headerName: "Clinica" },
        { field: "direccion", headerName: "Direccion" },
        { field: "telefono", headerName: "Telefono" },
        { field: "dueño", headerName: "Dueño" },
    ];

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
            setClinicas(data.results);
            setTotalCount(data.count);
        } catch (error) {
            console.error("Failed to fetch clinics:", error);
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

    const handleAddClinic = async (clientData) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/add-clinic/",
        clientData
      );
      setSnackbarMessage("Clínica agregada exitosamente.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      fetchClinics(); // Refrescar la tabla al agregar la clinica
      setOpen(false); // Cierra el modal al agregar exitosamente
    } catch (error) {
      // Aquí manejamos los errores del backend
      if (error.response && error.response.data) {
        const backendError = error.response.data.error;

        // Verifica si la clinica ya existe
        if (backendError === "La clinica ya existe") {
          setSnackbarMessage("La clinica ya existe");
        } else {
          setSnackbarMessage(backendError || "Error al agregar clínica.");
        }
      } else {
        setSnackbarMessage("Error de conexión al agregar clínica.");
      }

      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

    const handleOpenModal = (clinic) => {
        setSelectedClinic(clinic);  
        setOpenMod(true);
    };

    return (
        <>
            <Header />
            <div className="flex-grow px-4 md:mt-6 md:mb-6 h-[90vh]">
                <div className="flex flex-col items-center justify-between mb-4 space-y-4 md:flex-row md:space-y-0">
                    <h1 className="text-2xl font-semibold">Consultar Clínicas</h1>
                    <div className="flex flex-col w-full space-y-4 md:w-auto md:flex-row md:items-center md:space-y-0">
                        <Button
                            variant="contained"
                            startIcon={<Add />}
                            onClick={() => setOpen(true)} // Abre el modal
                            sx={{
                                backgroundColor: "#00308F",
                                "&:hover": { backgroundColor: "#00246d" },
                                minWidth: "200px",
                                marginBottom: { xs: "-4px", md: "0px" },
                                marginRight: { xs: "0px", md: "10px" },
                                width: { xs: "100%", md: "auto" },
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
                        data={clinicas}
                        columns={columns}
                        totalCount={totalCount}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        pkCol="clinica_id"
                        deletionUrl="http://localhost:8000/api/delete-clinic"
                        fetchData={fetchClinics}
                        onModModal={handleOpenModal}
                        onPageChange={setPage}>
                    </GeneralTable>
                )}
            </div>
            <AddClinicaModal
                open={open}
                onClose={() => setOpen(false)}
                onSubmit={handleAddClinic}
            />

            <ModifyClinicModal
                open={openMod}
                onClose={() => setOpenMod(false)}
                selectedClinic={selectedClinic}
            />
            
            <Footer />
        </>
    )


} export default Owner