import React from "react";
import ConsultGridView from "../Consult/ConsultGridView";

const ConsultVaccines = () => {
  return (
    <ConsultGridView
      fetchUrl="http://localhost:8000/api/consult-clinic-vaccines/"
      addUrl="http://localhost:8000/api/add-clinic-vaccines/"
      modificationUrl="http://localhost:8000/api/update-clinic-vaccines/"
      deletionUrl="http://localhost:8000/api/deactivate-clinic-vaccines/"
      restoreUrl="http://localhost:8000/api/restore-clinic-vaccines/"
      columns={["nombre", "descripcion", "estado"]}
      itemKey="vacuna_id"
      itemDisplayName="Vacunas"
    />
  );
};

export default ConsultVaccines;
