import React, { useState, useEffect } from "react";
import axios from "axios";

import ConsultView from "../components/Consult/ConsultView";

import AddClinicModal from "../components/consultClinics/AddClinicModal";
import ModifyClinicModal from "../components/consultClinics/ModifyClinicModal";

function Owner() {
  const rowsPerPage = 7;
  const [owners, setOwners] = useState({ owners: [] });

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

  useEffect(() => {
    const fetchOwners = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/get-owners/");
        setOwners({ owners: response.data.owners });
      } catch (error) {
        console.error("Error fetching owners:", error);
      }
    };
    fetchOwners();
  }, []);

  return (
    <>
      <ConsultView
        title="Clínicas"
        fetchUrl="http://localhost:8000/api/consult-clinics/"
        deletionUrl="http://localhost:8000/api/delete-clinic/"
        restoreUrl="http://localhost:8000/api/reactivate-clinic/"
        otherData={owners}
        addComponent={AddClinicModal}
        modifyComponent={ModifyClinicModal}
        rowsPerPage={rowsPerPage}
        columns={columns}
        pkCol="clinica_id"
        visualIdentifierCol="clinica"
      />
    </>
  );
}

export default Owner;
