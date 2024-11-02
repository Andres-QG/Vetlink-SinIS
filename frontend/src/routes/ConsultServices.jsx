import ConsultView from "../components/Consult/ConsultView";
import AddServicesModal from "../components/consultServices/AddServicesModal";
import ModifyServicesModal from "../components/consultServices/ModifyServicesModal";

const ConsultServices = () => {
  const rowsPerPage = 7;
  const columns = [
    { field: "nombre", headerName: "Nombre", type: "text" },
    { field: "descripcion", headerName: "Descripción", type: "text" },
    {
      field: "numero_sesiones",
      headerName: "Número de Sesiones",
      type: "text",
    },
    { field: "minutos_sesion", headerName: "Minutos por Sesión", type: "text" },
    { field: "costo", headerName: "Costo", type: "text" },
    {
      field: "activo",
      headerName: "Estado",
      type: "chip",
      chipColors: { activo: "#b8e6d7", inactivo: "#ff7c7d" },
    },
  ];

  return (
    <ConsultView
      title="Consultar Servicios"
      fetchUrl="http://localhost:8000/api/consult-services/"
      deletionUrl="http://localhost:8000/api/delete-service/"
      restoreUrl="http://localhost:8000/api/reactivate-service/"
      addComponent={AddServicesModal}
      modifyComponent={ModifyServicesModal}
      rowsPerPage={rowsPerPage}
      columns={columns}
      pkCol="servicio_id"
      visualIdentifierCol="nombre"
      otherData={[]}
    />
  );
};

export default ConsultServices;
