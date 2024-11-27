import React from "react";
import ConsultGridView from "../components/Consult/ConsultGridView";

const ConsultSpecialties = () => {
  return (
    <ConsultGridView
      fetchUrl="http://localhost:8000/api/consult-specialties-to-cards/"
      addUrl="http://localhost:8000/api/add-specialty/"
      modificationUrl="http://localhost:8000/api/update-specialty/"
      deletionUrl="http://localhost:8000/api/deactivate-specialty/"
      restoreUrl="http://localhost:8000/api/restore-specialty/"
      columns={["nombre", "descripcion", "estado"]}
      itemDisplayName="Especialidades Veterinarias"
      hasStatus={true}
    />
  );
};

export default ConsultSpecialties;
