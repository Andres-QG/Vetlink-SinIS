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
import CardList from "./CardList";
import SearchBar from "./GeneralizedSearchBar";

const ConsultGridView = ({ fetchUrl, columns, itemKey, itemDisplayName }) => {
  const [openDeactivate, setOpenDeactivate] = useState(false);
  const [openModify, setOpenModify] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newItem, setNewItem] = useState({});

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      try {
        const response = await axios.get(fetchUrl);
        setItems(response.data.results);
        setFilteredItems(response.data.results);
      } catch (error) {
        console.error(`Error fetching ${itemDisplayName}:`, error);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [fetchUrl, itemDisplayName]);

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

    const sorted = filtered.sort((a, b) => {
      if (a[column] < b[column]) return order === "asc" ? -1 : 1;
      if (a[column] > b[column]) return order === "asc" ? 1 : -1;
      return 0;
    });

    setFilteredItems(sorted);
  };

  const handleOpenAdd = () => {
    setNewItem({});
    setOpenAdd(true);
  };
  const handleCloseAdd = () => setOpenAdd(false);

  const handleAddItem = async () => {
    setLoading(true);
    try {
      const response = await axios.post(fetchUrl, newItem);
      setItems([...items, response.data]);
      setFilteredItems([...items, response.data]);
      handleCloseAdd();
    } catch (error) {
      console.error(`Error adding ${itemDisplayName}:`, error);
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
      <DialogTitle>Desactivar {itemDisplayName.slice(0, -1)}</DialogTitle>
      <DialogContent>
        ¿Está seguro que desea desactivar {selectedItem?.nombre}?
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
      <DialogTitle>Modificar {itemDisplayName.slice(0, -1)}</DialogTitle>
      <DialogContent>
        {/* Formulario de modificación para {selectedItem?.nombre} */}
        {/* Agrega aquí tu formulario de modificación */}
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
      <DialogTitle>Agregar {itemDisplayName.slice(0, -1)}</DialogTitle>
      <DialogContent>
        {columns.map((column) => (
          <TextField
            key={column}
            margin="dense"
            label={column.charAt(0).toUpperCase() + column.slice(1)}
            type="text"
            fullWidth
            variant="outlined"
            value={newItem[column] || ""}
            onChange={(e) =>
              setNewItem({ ...newItem, [column]: e.target.value })
            }
          />
        ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseAdd} sx={{ textTransform: "none" }}>
          Cancelar
        </Button>
        <Button
          onClick={handleAddItem}
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
          <h1 className="text-2xl font-semibold">
            Consultar {itemDisplayName}
          </h1>
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
            <SearchBar onSearch={handleSearch} columns={columns} />
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

export default ConsultGridView;
