import React from "react";
import ConsultView from "../components/Consult/ConsultView";
import AddClientModal from "../components/ConsultClients/AddClientModal";
import ModifyClientModal from "../components/ConsultClients/ModifyClientModal";

const ConsultClients = () => {
  const columns = [
    { field: "usuario", headerName: "Usuario", type: "text" },
    { field: "nombre", headerName: "Nombre", type: "text" },
    { field: "apellidos", headerName: "Apellido", type: "text" },
    { field: "cedula", headerName: "Cédula", type: "text" },
    { field: "telefono", headerName: "Teléfono", type: "text" },
    { field: "correo", headerName: "Correo", type: "text" },
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
      title="Clientes"
      fetchUrl="http://localhost:8000/api/consult-client/"
      deletionUrl="http://localhost:8000/api/delete-client/"
      restoreUrl="http://localhost:8000/api/reactivate-user/"
      addComponent={AddClientModal}
      modifyComponent={ModifyClientModal}
      columns={columns}
      pkCol="usuario"
      visualIdentifierCol="usuario"
      rowsPerPage={rowsPerPage}
    />
  );
};

export default ConsultClients;
