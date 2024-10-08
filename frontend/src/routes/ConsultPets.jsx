import { useState, useEffect } from "react";
import { CircularProgress, Button, Modal, Alert, Stack } from "@mui/material";
import { Add } from "@mui/icons-material";
import GeneralTable from "../components/Consult/GeneralTable";
import SearchBar from "../components/Consult/GeneralizedSearchBar";
import AddPet from "../components/consultPets/AddPet";
import ModifyPet from "../components/consultPets/ModifyPet";
import Header from "../components/Header";
import Footer from "../components/Footer";
import axios from "axios";

const ConsultPets = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchColumn, setSearchColumn] = useState("nombre");
  const [order, setOrder] = useState("asc");
  const rowsPerPage = 10;
  const [open, setOpen] = useState(false);

  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "",
  });

  const columns = [
    { field: "usuario_cliente", headerName: "Dueño" },
    { field: "nombre", headerName: "Nombre" },
    { field: "fecha_nacimiento", headerName: "Fecha de nacimiento" },
    { field: "especie", headerName: "Especie" },
    { field: "raza", headerName: "Raza" },
    { field: "sexo", headerName: "Sexo" },
  ];

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    fetchPets();
  }, [page, searchTerm, searchColumn, order]);

  const fetchPets = async () => {
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
        "http://localhost:8000/api/consult-mascotas/",
        { params }
      );
      const data = response.data;
      setPets(data.results);
      setTotalCount(data.count);
    } catch (error) {
      console.error("Failed to fetch pets:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (term, column) => {
    setSearchTerm(term);
    setSearchColumn(column);
    setPage(1);
  };

  const handleAddPetSuccess = async (message, severity) => {
    setAlert({ open: true, message, severity });
    handleClose();
    await fetchPets();
  };

  const handleCloseAlert = () => {
    setAlert({ open: false, message: "", severity: "" });
  };

  const handleDelete = async (message, severity) => {
    setAlert({ open: true, message, severity });
    await fetchPets();
  };

  const handleModification = async (message, severity) => {
    setAlert({ open: true, message, severity });
    await fetchPets();
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
          <h1 className="text-2xl font-semibold">Consultar Mascotas</h1>
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
              Agregar Mascota
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
            data={pets}
            columns={columns}
            totalCount={totalCount}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={setPage}
            deletionUrl="http://localhost:8000/api/delete-pet"
            pkCol="mascota_id"
            onDelete={handleDelete}
            visualIdentifierCol="nombre"
            fetchData={fetchPets}
            OnModModal={ModifyPet}
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
          <AddPet handleClose={handleClose} onSuccess={handleAddPetSuccess} />
        </Modal>
      </div>
      <Footer />
    </div>
  );
};

export default ConsultPets;
