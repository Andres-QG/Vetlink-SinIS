import React from "react";
import ConsultView from "../components/Consult/ConsultView";
import AddAdminModal from "../components/ConsultAdmins/AddAdminModal";
import ModifyAdminModal from "../components/ConsultAdmins/ModifyAdminModal";

const ConsultAdmins = () => {
  const columns = [
    { field: "usuario", headerName: "Usuario", type: "text" },
    { field: "nombre", headerName: "Nombre", type: "text" },
    { field: "apellidos", headerName: "Apellido", type: "text" },
    { field: "cedula", headerName: "Cédula", type: "text" },
    { field: "telefono", headerName: "Teléfono", type: "text" },
    { field: "correo", headerName: "Correo", type: "text" },
    { field: "clinica", headerName: "Clínica", type: "text" },
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
      title="Administradores"
      fetchUrl="http://localhost:8000/api/consult-admin/"
      deletionUrl="http://localhost:8000/api/delete-admin/"
      restoreUrl="http://localhost:8000/api/reactivate-user/"
      addComponent={AddAdminModal}
      modifyComponent={ModifyAdminModal}
      columns={columns}
      pkCol="usuario"
      visualIdentifierCol="usuario"
      rowsPerPage={rowsPerPage}
    />
  );
};

export default ConsultAdmins;
