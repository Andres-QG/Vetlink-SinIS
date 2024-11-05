import React from "react";
import PropTypes from "prop-types";
import { Modal, Box, Typography, Button, IconButton } from "@mui/material";
import { Close } from "@mui/icons-material";

const HOST = "http://localhost:8000/";

const InformationServiceModal = ({ open, handleClose, selectedItem }) => {
  const imageSrc =
    selectedItem?.imagen && selectedItem.imagen.startsWith("static/")
      ? `${HOST}${selectedItem.imagen}`
      : "./assets/img/default_service.jpg";
  // console.log(selectedItem);
  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          p: 3,
          borderRadius: 2,
          boxShadow: 3,
          bgcolor: "#fff",
          width: "100%",
          maxWidth: "500px",
          maxHeight: "90vh",
          overflowY: "auto",
          mx: "auto",
          mt: "5%",
        }}>
        {/* Cabecera con botón de cierre */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}>
          <Typography variant="h6" component="h2">
            Información del Servicio
          </Typography>
          <IconButton onClick={handleClose}>
            <Close />
          </IconButton>
        </Box>

        {/* Imagen del servicio */}
        <Box
          component="img"
          src={imageSrc}
          alt={selectedItem?.nombre || "Imagen del servicio"}
          sx={{
            width: "100%",
            height: "auto",
            borderRadius: 2,
            mb: 2,
          }}
        />

        {/* Descripción del servicio */}
        <Typography variant="body1" sx={{ mb: 2 }}>
          {selectedItem?.descripcion || "No hay descripción disponible."}
        </Typography>

        {/* Botón de cerrar */}
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button variant="contained" onClick={handleClose}>
            Cerrar
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

InformationServiceModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  selectedItem: PropTypes.object.isRequired,
};

export default InformationServiceModal;
