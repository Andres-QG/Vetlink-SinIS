import { useState } from "react";
import ConsultView from "../components/Consult/ConsultView";
import DetailedRecordInfo from "../components/consultRecords/DetailedRecordInfo";

const ConsultRecords = () => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const rowsPerPage = 7

  const columns = [
    { field: "consulta_id", headerName: "ID", type: "text" },
    { field: "usuario_cliente", headerName: "Dueño", type: "text" },
    { field: "mascota_id", headerName: "ID Paciente", type: "text" },
    { field: "nombre_mascota", headerName: "Paciente", type: "text" },
    { field: "fecha", headerName: "Fecha", type: "text" },
    { field: "diagnostico", headerName: "Diagnóstico", type: "text" },
    { field: "peso", headerName: "Peso", type: "text" },
  ];

  return (
    <>
      <ConsultView
        title="Consultar Expedientes"
        fetchUrl="http://localhost:8000/api/consult-pet-records/"
        deletionUrl="/api/delete_pet_record"
        addComponent={() => <div>Agregar Modal Placeholder</div>}
        modifyComponent={() => <div>Modificar Modal Placeholder</div>}
        detailedInfoComponent={DetailedRecordInfo}
        rowsPerPage={rowsPerPage}
        columns={columns}
        pkCol="consulta_id"
        visualIdentifierCol="consulta_id"
      />
    </>
  );
};

export default ConsultRecords;
