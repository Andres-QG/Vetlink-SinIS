import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  TextField,
} from "@mui/material";
import { Add } from "@mui/icons-material";
import axios from "axios";
import CardList from "../Consult/CardList";
import SearchBar from "../Consult/GeneralizedSearchBar";

const ConsultVaccines = () => {
  const [openDeactivate, setOpenDeactivate] = useState(false);
  const [openModify, setOpenModify] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newVaccine, setNewVaccine] = useState({
    name: "",
    description: "",
    status: "1",
  });

  useEffect(() => {
    const fetchVaccines = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "http://localhost:8000/api/consult-clinic-vaccines/"
        );
        setItems(response.data.results);
        setFilteredItems(response.data.results);
      } catch (error) {
        console.error("Error fetching vaccines:", error);
      } finally {
        setLoading(false);
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

  const handleSearch = (term, column, order) => {
    let searchTerm = term.toLowerCase();
    if (column === "estado") {
      if (searchTerm === "disponible") {
        searchTerm = "1";
      } else if (searchTerm === "no disponible") {
        searchTerm = "0";
      }
    }

    const filtered = items.filter((item) =>
      item[column].toString().toLowerCase().includes(searchTerm)
    );

    const sorted = filtered.toSorted((a, b) => {
      if (a[column] < b[column]) return order === "asc" ? -1 : 1;
      if (a[column] > b[column]) return order === "asc" ? 1 : -1;
      return 0;
    });

    setFilteredItems(sorted);
  };

  const handleOpenAdd = () => setOpenAdd(true);
  const handleCloseAdd = () => setOpenAdd(false);

  const handleAddVaccine = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:8000/api/vaccines/",
        newVaccine
      );
      setItems([...items, response.data]);
      setFilteredItems([...items, response.data]);
      handleCloseAdd();
    } catch (error) {
      console.error("Error adding vaccine:", error);
    } finally {
      setLoading(false);
    }
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

  const AddModal = (
    <Dialog
      open={openAdd}
      onClose={handleCloseAdd}
      PaperProps={{
        sx: { borderRadius: "8px" },
      }}
    >
      <DialogTitle>Agregar Vacuna</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Nombre"
          type="text"
          fullWidth
          variant="outlined"
          value={newVaccine.name}
          onChange={(e) =>
            setNewVaccine({ ...newVaccine, name: e.target.value })
          }
        />
        <TextField
          margin="dense"
          label="Descripción"
          type="text"
          fullWidth
          variant="outlined"
          value={newVaccine.description}
          onChange={(e) =>
            setNewVaccine({ ...newVaccine, description: e.target.value })
          }
        />
        <TextField
          margin="dense"
          label="Estado"
          type="text"
          fullWidth
          variant="outlined"
          value={newVaccine.status}
          onChange={(e) =>
            setNewVaccine({ ...newVaccine, status: e.target.value })
          }
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseAdd} sx={{ textTransform: "none" }}>
          Cancelar
        </Button>
        <Button
          onClick={handleAddVaccine}
          color="primary"
          sx={{ textTransform: "none" }}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : "Agregar"}
        </Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <div className="flex flex-col">
      <div className="flex-grow">
        <div className="flex flex-col items-center justify-between mb-4 space-y-4 md:flex-row md:space-y-0">
          <h1 className="text-2xl font-semibold">Consultar Vacunas</h1>
          <div className="flex flex-col w-full space-y-4 md:w-auto md:flex-row md:items-center md:space-y-0">
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={handleOpenAdd}
              sx={{
                backgroundColor: "#00308F",
                "&:hover": {
                  backgroundColor: "#00246d",
                },
                minWidth: "190px",
                marginBottom: { xs: "-4px", md: "0px" },
                marginRight: { xs: "0px", md: "10px" },
                width: { xs: "100%", md: "auto" },
                fontSize: "0.85rem",
              }}
            >
              Agregar
            </Button>
            <SearchBar
              onSearch={handleSearch}
              columns={["nombre", "descripcion", "estado"]}
            />
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center">
            <CircularProgress />
          </div>
        ) : (
          <CardList
            items={filteredItems}
            onDeactivate={handleDeactivate}
            onModify={handleModify}
            DeactivateModal={DeactivateModal}
            ModifyModal={ModifyModal}
          />
        )}

        {AddModal}
      </div>
    </div>
  );
};

export default ConsultVaccines;
