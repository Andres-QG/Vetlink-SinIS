import { useState } from "react";
import ConsultView from "../components/Consult/ConsultView";
import InfoIcon from "@mui/icons-material/Info";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";

const ConsultRecords = () => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const columns = [
    { field: "consulta_id", headerName: "ID", type: "text" },
    { field: "usuario_cliente", headerName: "Dueño", type: "text" },
    { field: "mascota_id", headerName: "ID Paciente", type: "text" },
    { field: "nombre_mascota", headerName: "Paciente", type: "text" },
    { field: "fecha", headerName: "Fecha", type: "text" },
    { field: "diagnostico", headerName: "Diagnóstico", type: "text" },
    { field: "peso", headerName: "Peso", type: "text" },
    {
      type: "action",
      icon: <InfoIcon />,
      onClick: handleOpen,
    },
  ];

  return (
    <>
      <ConsultView
        title="Consultar Expedientes"
        fetchUrl="http://localhost:8000/api/consult-pet-records/"
        deletionUrl="/api/delete_pet_record"
        addComponent={() => <div>Agregar Modal Placeholder</div>}
        modifyComponent={() => <div>Modificar Modal Placeholder</div>}
        columns={columns}
        pkCol="consulta_id"
        visualIdentifierCol="consulta_id"
      />
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
          }}
        >
          <h2>Detalles</h2>
          <p>Contenido del modal</p>
        </Box>
      </Modal>
    </>
  );
};

export default ConsultRecords;
