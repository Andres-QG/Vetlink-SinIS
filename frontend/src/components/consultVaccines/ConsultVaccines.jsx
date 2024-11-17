import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import axios from "axios";
import CardList from "../Consult/CardList";

const ConsultVaccines = () => {
  const [openDeactivate, setOpenDeactivate] = useState(false);
  const [openModify, setOpenModify] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchVaccines = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/consult-clinic-vaccines/"
        );
        setItems(response.data.results);
      } catch (error) {
        console.error("Error fetching vaccines:", error);
      }
    };

    fetchVaccines();
  }, []);

  const handleDeactivate = (item) => {
    setSelectedItem(item);
    setOpenDeactivate(true);
  };

  const handleModify = (item) => {
    setSelectedItem(item);
    setOpenModify(true);
  };

  const DeactivateModal = (
    <Dialog
      open={openDeactivate}
      onClose={() => setOpenDeactivate(false)}
      PaperProps={{
        sx: { borderRadius: "8px" },
      }}
    >
      <DialogTitle>Desactivar Vacuna</DialogTitle>
      <DialogContent>
        ¿Está seguro que desea desactivar {selectedItem?.name}?
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => setOpenDeactivate(false)}
          sx={{ textTransform: "none" }}
        >
          Cancelar
        </Button>
        <Button
          onClick={() => setOpenDeactivate(false)}
          color="error"
          sx={{ textTransform: "none" }}
        >
          Desactivar
        </Button>
      </DialogActions>
    </Dialog>
  );

  const ModifyModal = (
    <Dialog
      open={openModify}
      onClose={() => setOpenModify(false)}
      PaperProps={{
        sx: { borderRadius: "8px" },
      }}
    >
      <DialogTitle>Modificar Vacuna</DialogTitle>
      <DialogContent>
        Formulario de modificación para {selectedItem?.name}
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => setOpenModify(false)}
          sx={{ textTransform: "none" }}
        >
          Cancelar
        </Button>
        <Button
          onClick={() => setOpenModify(false)}
          color="primary"
          sx={{ textTransform: "none" }}
        >
          Guardar Cambios
        </Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <CardList
      items={items}
      onDeactivate={handleDeactivate}
      onModify={handleModify}
      DeactivateModal={DeactivateModal}
      ModifyModal={ModifyModal}
    />
  );
};

export default ConsultVaccines;
