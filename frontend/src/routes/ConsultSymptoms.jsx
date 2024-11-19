import React from "react";
import ConsultGridView from "../components/Consult/ConsultGridView";

const ConsultSymptoms = () => {
  return (
    <ConsultGridView
      fetchUrl="http://localhost:8000/api/consult-symptoms/"
      addUrl="http://localhost:8000/api/add-symptom/"
      modificationUrl="http://localhost:8000/api/update-symptom/"
      deletionUrl="http://localhost:8000/api/deactivate-symptom/"
      restoreUrl="http://localhost:8000/api/restore-symptom/"
      columns={["nombre", "descripcion", "estado"]}
      itemDisplayName="Síntomas"
      hasStatus={true}
    />
  );
};

export default ConsultSymptoms;
