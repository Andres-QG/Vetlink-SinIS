import ConsultView from "../components/Consult/ConsultView";

import AddCitaModal from "../components/consultCitas/AddCitaModal";
import ModifyClinicModal from "../components/consultClinics/ModifyClinicModal";


function ConsultCitas() {
  const rowsPerPage = 7;

  const columns = [
  { field: "cliente", headerName: "Cliente", type: "text" },
  { field: "veterinario", headerName: "Veterinario", type: "text" },
  { field: "mascota", headerName: "Mascota", type: "text" },
  { field: "fecha", headerName: "Fecha", type: "text" },
  { field: "hora", headerName: "Hora", type: "text" },
  { field: "motivo", headerName: "Motivo", type: "text" },
  { field: "estado", headerName: "Estado", type: "text" },
];
 
  return (
    <>
      <ConsultView
        title="Citas"
        fetchUrl="http://localhost:8000/api/consult-citas/"
        deletionUrl="http://localhost:8000/api/delete-citas"
        addComponent={AddCitaModal}
        modifyComponent={ModifyClinicModal}
        rowsPerPage={rowsPerPage}
        columns={columns}
        pkCol="cita_id"
        visualIdentifierCol="cliente"
      />
    </>
  );
};

export default ConsultCitas;
