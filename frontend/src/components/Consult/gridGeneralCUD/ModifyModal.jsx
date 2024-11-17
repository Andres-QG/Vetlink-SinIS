import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  CircularProgress,
} from "@mui/material";

const ModifyModal = ({
  open,
  onClose,
  onModify,
  selectedItem,
  itemDisplayName,
  loading,
}) => {
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
  });

  useEffect(() => {
    if (selectedItem) {
      setFormData({
        nombre: selectedItem.nombre || "",
        descripcion: selectedItem.descripcion || "",
      });
    }
  }, [selectedItem]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = () => {
    onModify(formData);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { borderRadius: "8px" },
      }}
    >
      <DialogTitle>Modificar {itemDisplayName}</DialogTitle>
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
          {loading ? <CircularProgress size={24} /> : "Guardar Cambios"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModifyModal;
