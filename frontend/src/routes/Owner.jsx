import ConsultView from "../components/Consult/ConsultView"

import AddClinicModal from "../components/consultClinics/AddClinicModal";
import ModifyClinicModal from "../components/consultClinics/ModifyClinicModal";

function Owner() {
  const rowsPerPage = 7;

  const columns = [
    { field: "clinica", headerName: "Clínica", type: "text" },
    { field: "direccion", headerName: "Dirección", type: "text" },
    { field: "telefono", headerName: "Teléfono", type: "text" },
    { field: "dueño", headerName: "Dueño", type: "text" },
    {
      field: "activo",
      headerName: "Estado",
      type: "chip",
      chipColors: { activo: "#b8e6d7", inactivo: "#ff7c7d" },
    },
  ];

  return (
    <>
      <ConsultView
        title="Consultar Clínicas"
        fetchUrl="http://localhost:8000/api/consult-clinics/"
        deletionUrl="http://localhost:8000/api/delete-clinic"
        addComponent={AddClinicModal}
        modifyComponent={ModifyClinicModal}
        rowsPerPage={rowsPerPage}
        columns={columns}
        pkCol="mascota_id"
        visualIdentifierCol="clinica"
      />
    </>
  );
}

export default Owner;
