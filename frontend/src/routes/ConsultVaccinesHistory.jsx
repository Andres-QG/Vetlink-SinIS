import React from "react";
import ConsultView from "../components/Consult/ConsultView";
import { Vaccines } from "@mui/icons-material";

const ConsultVaccinesHistory = () => {
  const rowsPerPage = 7;
  const columns = [
    { field: "nombre_vacuna", headerName: "Nombre de la Vacuna", type: "text" },
    {
      field: "fecha_consulta",
      headerName: "Fecha de la Consulta",
      type: "text",
    },
    {
      field: "nombre_mascota",
      headerName: "Nombre de la Mascota",
      type: "text",
    },
    {
      field: "consulta_id",
      headerName: "ID de la Consulta",
      type: "text",
    },
  ];
  return (
    <ConsultView
      title="Historial de Vacunación"
      titleIcon={Vaccines}
      fetchUrl="http://localhost:8000/api/consult-vaccines-history/"
      rowsPerPage={rowsPerPage}
      columns={columns}
      hideActions={true}
      hideAddButton={true}
    />
  );
};

export default ConsultVaccinesHistory;
