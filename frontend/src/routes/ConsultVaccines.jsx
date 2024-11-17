import React from "react";
import ConsultGridView from "../components/Consult/ConsultGridView";

const ConsultVaccines = () => {
  return (
    <ConsultGridView
      fetchUrl="http://localhost:8000/api/consult-clinic-vaccines/"
      addUrl="http://localhost:8000/api/add-clinic-vaccine/"
      modificationUrl="http://localhost:8000/api/update-clinic-vaccine/"
      deletionUrl="http://localhost:8000/api/deactivate-clinic-vaccine/"
      restoreUrl="http://localhost:8000/api/restore-clinic-vaccine/"
      columns={["nombre", "descripcion", "estado"]}
      itemDisplayName="Vacunas"
      hasStatus={true}
    />
  );
};

export default ConsultVaccines;
