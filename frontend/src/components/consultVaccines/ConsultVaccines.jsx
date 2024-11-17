import React from "react";
import ConsultGridView from "../Consult/ConsultGridView";

const ConsultVaccines = () => {
  return (
    <ConsultGridView
      fetchUrl="http://localhost:8000/api/consult-clinic-vaccines/"
      columns={["nombre", "descripcion", "estado"]}
      itemKey="vacuna_id"
      itemDisplayName="Vacunas"
    />
  );
};

export default ConsultVaccines;
