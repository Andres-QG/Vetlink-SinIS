import React from "react";
import ConsultView from "../components/Consult/ConsultView";
import AddVetModal from "../components/ConsultVets/AddVetModal";
import EditVetModal from "../components/ConsultVets/ModifyVetModal";

const ConsultVets = () => {
  const columns = [
    { field: "usuario", headerName: "Usuario", type: "text" },
    { field: "nombre", headerName: "Nombre", type: "text" },
    { field: "apellido1", headerName: "Apellido 1", type: "text" },
    { field: "apellido2", headerName: "Apellido 2", type: "text" },
    { field: "correo", headerName: "Email", type: "text" },
    { field: "telefono", headerName: "Teléfono", type: "text" },
    { field: "clinica", headerName: "Clinica", type: "text" },
    { field: "especialidad", headerName: "Especialidad", type: "text" },
    {
      field: "activo",
      headerName: "Estado",
      type: "chip",
      chipColors: { activo: "#b8e6d7", inactivo: "#ff7c7d" },
    },
  ];

  const rowsPerPage = 7;

  return (
    <ConsultView
      title="Veterinarios"
      fetchUrl="http://localhost:8000/api/consult-vets-formatted/"
      deletionUrl="http://localhost:8000/api/delete-client/"
      restoreUrl="http://localhost:8000/api/reactivate-user/"
      addComponent={AddVetModal}
      modifyComponent={EditVetModal}
      columns={columns}
      pkCol="usuario"
      visualIdentifierCol="usuario"
      rowsPerPage={rowsPerPage}
    />
  );
};

export default ConsultVets;
