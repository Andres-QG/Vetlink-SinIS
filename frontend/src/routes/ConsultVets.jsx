import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, CircularProgress, Snackbar, Alert } from "@mui/material";
import { Add } from "@mui/icons-material";
import Header from "../components/Header";
import Footer from "../components/Footer";
import GeneralizedSearchBar from "../components/Consult/GeneralizedSearchBar";
import AddVetModal from "../components/ConsultVets/AddVetModal";
import VetsTable from "../components/ConsultVets/VetsTable";
import EditVetModal from "../components/ConsultVets/EditVetModal";

const ConsultVets = () => {
  const [vets, setVets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchColumn, setSearchColumn] = useState("usuario");
  const [order, setOrder] = useState("asc");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedVet, setSelectedVet] = useState(null); // Estado para el veterinario seleccionado
  const [clinics, setClinics] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  useEffect(() => {
    fetchVets();
    fetchClinics();
    fetchSpecialties();
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
        "http://localhost:8000/api/consult-vet/",
        { params }
      );
      const data = response.data;
      setVets(data.results);
      setTotalPages(Math.ceil(data.count / 10));
    } catch (error) {
      console.error("Failed to fetch vets:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchClinics = async () => {
    let allClinics = [];
    let nextPage = "http://localhost:8000/api/consult-clinics/";
    try {
      while (nextPage) {
        const response = await axios.get(nextPage);
        const data = response.data;
        allClinics = allClinics.concat(data.results);

        nextPage = data.next;
      }
      setClinics(allClinics);
    } catch (error) {
      console.error("Failed to fetch clinics:", error);
    }
  };

  const fetchSpecialties = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/consult-specialties/"
      );
      setSpecialties(response.data.results);
    } catch (error) {
      console.error("Failed to fetch specialties:", error);
    }
  };

  const handleAddVet = async (vetData) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/add-vet/",
        vetData
      );
      setSnackbarMessage("Veterinario agregado exitosamente.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      fetchVets();
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

  const handleEditVet = (vet) => {
    setSelectedVet(vet);
    setOpenEditModal(true);
  };

  const columns = [
    { field: "usuario", headerName: "Usuario" },
    { field: "nombre", headerName: "Nombre" },
    { field: "apellidos", headerName: "Apellidos" },
    { field: "correo", headerName: "Email" },
    { field: "telefono", headerName: "Teléfono" },
    { field: "clinica", headerName: "Clinica" },
    { field: "especialidad", headerName: "Especialidad" },
    { field: "id", headerName: "" },
  ];

  const formatVetsData = (vets) => {
    return vets.map((vet) => ({
      ...vet,
      apellidos: `${vet.apellido1} ${vet.apellido2}`,
      clinica: vet.clinica ? vet.clinica.nombre : "",
      especialidad: vet.especialidad ? vet.especialidad.nombre : "",
    }));
  };

  const formattedVets = formatVetsData(vets);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow">
        <div className="flex flex-col items-center justify-between mb-4 space-y-4 md:flex-row md:space-y-0">
          <h1 className="text-2xl font-semibold">Consultar Veterinarios</h1>
          <div className="flex flex-col w-full space-y-4 md:w-auto md:flex-row md:items-center md:space-y-0">
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setOpenAddModal(true)}
              sx={{
                backgroundColor: "#00308F",
                "&:hover": { backgroundColor: "#00246d" },
                minWidth: "240px",
                marginBottom: { xs: "-4px", md: "0px" },
                marginRight: { xs: "0px", md: "10px" },
                width: { xs: "100%", md: "auto" },
              }}
            >
              Agregar Veterinario
            </Button>
            <GeneralizedSearchBar
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
          <VetsTable
            data={formattedVets}
            columns={columns}
            totalCount={totalPages * 10}
            page={page}
            rowsPerPage={10}
            onPageChange={setPage}
            fetchData={fetchVets}
            onEditVet={handleEditVet} // Pasar la función de edición a VetsTable
          />
        )}
      </div>

      <AddVetModal
        open={openAddModal}
        onClose={() => setOpenAddModal(false)}
        onSubmit={handleAddVet}
        clinics={clinics}
        specialties={specialties}
      />

      <EditVetModal
        open={openEditModal}
        onClose={() => setOpenEditModal(false)}
        vet={selectedVet}
        clinics={clinics}
        specialties={specialties}
        fetchVets={fetchVets}
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

export default ConsultVets;
