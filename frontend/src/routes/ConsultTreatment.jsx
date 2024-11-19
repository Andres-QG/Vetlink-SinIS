import React from "react";
import ConsultGridView from "../components/Consult/ConsultGridView";

const ConsultTreatment = () => {
  return (
    <ConsultGridView
      fetchUrl="http://localhost:8000/api/consult-treatments/"
      addUrl="http://localhost:8000/api/add-treatment/"
      modificationUrl="http://localhost:8000/api/update-treatment/"
      deletionUrl="http://localhost:8000/api/desactivate-treatment/"
      restoreUrl="http://localhost:8000/api/restore-treatment/"
      columns={["nombre", "descripcion", "estado"]}
      itemDisplayName="Tratamientos"
      hasStatus={true}
    />
  );
};

export default ConsultTreatment;
