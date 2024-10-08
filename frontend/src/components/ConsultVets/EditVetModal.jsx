import React from "react";
import { Modal, Box, Typography, Button } from "@mui/material";

const EditVetModal = ({ open, onClose, vet }) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ ...modalStyle }}>
        <Typography variant="h6" component="h2">
          Adentro del botón
        </Typography>
        {vet && (
          <div>
            <Typography variant="body1">Usuario: {vet.usuario}</Typography>
            <Typography variant="body1">Nombre: {vet.nombre}</Typography>
            <Typography variant="body1">
              Apellidos: {vet.apellido1} {vet.apellido2}
            </Typography>
            <Typography variant="body1">Correo: {vet.correo}</Typography>
            <Typography variant="body1">Teléfono: {vet.telefono}</Typography>
            <Typography variant="body1">
              Clínica: {vet.clinica ? vet.clinica.nombre : ""}
            </Typography>
            <Typography variant="body1">
              Especialidad: {vet.especialidad ? vet.especialidad.nombre : ""}
            </Typography>
          </div>
        )}
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
          <Button onClick={onClose} color="primary">
            Cerrar
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  maxWidth: 600,
  maxHeight: "90vh",
  overflowY: "auto",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

export default EditVetModal;
