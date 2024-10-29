import { useState, useEffect } from "react";
import axios from "axios";

import Header from "../components/Header";
import Footer from "../components/Footer";
import SearchBar from "../components/Consult/GeneralizedSearchBar";
import ConsultView from "../components/Consult/ConsultView"

import { CircularProgress, Button, Alert, Stack } from "@mui/material";
import { Add } from "@mui/icons-material";
import AddClinicModal from "../components/consultClinics/AddClinicModal";
import ModifyClinicModal from "../components/consultClinics/ModifyClinicModal";
import { NotificationProvider } from "../components/Notification";

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
      <ConsultView
        title="Consultar Clínicas"
        fetchUrl="http://localhost:8000/api/consult-clinics/"
        deletionUrl="http://localhost:8000/api/delete-clinic"
        addComponent={AddClinicModal}
        modifyComponent={ModifyClinicModal}
        columns={columns}
        pkCol="mascota_id"
        visualIdentifierCol="nombre"
      />
    </>
  );
}

export default Owner;
