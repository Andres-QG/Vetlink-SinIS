import React from "react";
import ConsultView from "../components/Consult/ConsultView";
import EmergencyIcon from '@mui/icons-material/Emergency';

const ConsultTreatmentHistory = () => {
  const rowsPerPage = 7;
  const columns = [
    {
      field: "nombre_tratamiento",
      headerName: "Nombre del Tratamiento",
      type: "text",
    },
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
      title="Historial de Tratamientos"
      titleIcon={EmergencyIcon}
      fetchUrl="http://localhost:8000/api/consult-treatment-history/"
      rowsPerPage={rowsPerPage}
      columns={columns}
      hideActions={true}
      hideAddButton={true}
    />
  );
};

export default ConsultTreatmentHistory;
