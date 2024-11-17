import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  CircularProgress,
} from "@mui/material";

const AddModal = ({ open, onClose, onAdd, itemDisplayName, loading }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = () => {
    onAdd(formData);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { borderRadius: "8px" },
      }}
    >
      <DialogTitle>Agregar {itemDisplayName}</DialogTitle>
      <DialogContent>
        <TextField
          name="nombre"
          margin="dense"
          label="Nombre"
          type="text"
          fullWidth
          variant="outlined"
          value={formData.nombre}
          onChange={handleChange}
        />
        <TextField
          name="descripcion"
          margin="dense"
          label="Descripción"
          type="text"
          fullWidth
          variant="outlined"
          multiline
          rows={4}
          value={formData.descripcion}
          onChange={handleChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} sx={{ textTransform: "none" }}>
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          color="primary"
          sx={{ textTransform: "none" }}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : "Agregar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddModal;
