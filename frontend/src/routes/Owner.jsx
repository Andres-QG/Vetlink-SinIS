import { useState, useEffect } from "react";
import axios from "axios";

import Header from "../components/Header";
import Footer from "../components/Footer";
import GeneralTable from "../components/Consult/GeneralTable";
import SearchBar from "../components/Consult/GeneralizedSearchBar";

import { CircularProgress, Button, Alert, Stack } from "@mui/material";
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

  const columns = [
    { field: "clinica", headerName: "Clinica" },
    { field: "direccion", headerName: "Direccion" },
    { field: "telefono", headerName: "Telefono" },
    { field: "dueño", headerName: "Dueño" },
  ];

  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "",
  });

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

  const handleCloseAlert = () => {
    setAlert({ open: false, message: "", severity: "" });
  };

  const handleAdd = async (message, severity) => {
    setAlert({ open: true, message, severity });
    await fetchClinics();
  };

  const handleModification = async (message, severity) => {
    setAlert({ open: true, message, severity });
    await fetchClinics();
  };

  const handleDelete = async (message, severity) => {
    setAlert({ open: true, message, severity });
    await fetchClinics();
  };

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <div className="flex-grow">
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
              OnModModal={ModifyClinicModal}
              onDelete={handleDelete}
              onModify={handleModification}
              onPageChange={setPage}
            />
          )}
        </div>
        <AddClinicaModal
          open={open}
          onClose={() => setOpen(false)}
          onSuccess={handleAdd}
        />
      </div>
    </>
  );
}
export default Owner;
