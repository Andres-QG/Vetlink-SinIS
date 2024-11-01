import ConsultView from "../components/Consult/ConsultView";
import DetailedRecordInfo from "../components/consultRecords/DetailedRecordInfo";
import AddRecord from "../components/consultRecords/AddRecord";

const ConsultRecords = () => {
  const rowsPerPage = 7;

  const columns = [
    { field: "consulta_id", headerName: "ID", type: "text" },
    { field: "usuario_cliente", headerName: "Dueño", type: "text" },
    { field: "mascota_id", headerName: "ID Paciente", type: "text" },
    { field: "nombre_mascota", headerName: "Paciente", type: "text" },
    { field: "fecha", headerName: "Fecha", type: "text" },
    { field: "diagnostico", headerName: "Diagnóstico", type: "text" },
  ];

  return (
    <>
      <ConsultView
        title="Consultar Expedientes"
        fetchUrl="http://localhost:8000/api/consult-pet-records/"
        deletionUrl="http://localhost:8000/api/delete-pet-record"
        addComponent={AddRecord}
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
