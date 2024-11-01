import ConsultView from "../components/Consult/ConsultView";
import AddSchedule from "../components/ConsultSchedules/AddSchedule";
import ModifySchedule from "../components/ConsultSchedules/ModifySchedule";

const ConsultSchedules = () => {
  const rowsPerPage = 7;
  const columns = [
    { field: "usuario_veterinario", headerName: "Veterinario", type: "text" },
    { field: "clinica", headerName: "Clínica", type: "text" },
    { field: "dia", headerName: "Día", type: "text" },
    {
      field: "hora_inicio",
      headerName: "Hora de Inicio",
      type: "text",
    },
    {
      field: "hora_fin",
      headerName: "Hora de Fin",
      type: "text",
    },
    {
      field: "activo",
      headerName: "Estado",
      type: "chip",
      chipColors: { activo: "#b8e6d7", inactivo: "#ff7c7d" },
    },
  ];

  return (
    <ConsultView
      title="Consultar Horarios"
      fetchUrl="http://localhost:8000/api/consult-schedules/"
      addComponent={AddSchedule}
      modifyComponent={ModifySchedule}
      deletionUrl="http://localhost:8000/api/delete-vet-schedule"
      rowsPerPage={rowsPerPage}
      columns={columns}
      pkCol="horario_id"
      visualIdentifierCol="dia"
    />
  );
};

export default ConsultSchedules;
