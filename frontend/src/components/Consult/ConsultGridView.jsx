import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Button, CircularProgress } from "@mui/material";
import { Add } from "@mui/icons-material";
import axios from "axios";
import CardList from "./CardList";
import SearchBar from "./GeneralizedSearchBar";
import AddModal from "../Consult/gridGeneralCUD/AddModal";
import ModifyModal from "../Consult/gridGeneralCUD/ModifyModal";
import DeactivateModal from "../Consult/gridGeneralCUD/DeactivateModal";
import { useNotification } from "../Notification";

const ConsultGridView = ({
  fetchUrl,
  addUrl,
  deletionUrl,
  modificationUrl,
  restoreUrl,
  columns,
  itemDisplayName,
  hasStatus,
}) => {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [openMod, setOpenMod] = useState(false);
  const [openDel, setOpenDel] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const notify = useNotification();

  const fetchItems = async () => {
    setLoading(true);
    try {
      let allItems = [];
      let nextPage = fetchUrl;
      while (nextPage) {
        const response = await axios.get(nextPage);
        allItems = allItems.concat(response.data.results);
        nextPage = response.data.next;
      }
      setItems(allItems);
      setFilteredItems(allItems);
    } catch (error) {
      console.error(`Error fetching ${itemDisplayName}:`, error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

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

  const handleOpenAdd = () => {
    setOpenAdd(true);
  };

  const handleCloseAdd = () => {
    setOpenAdd(false);
  };

  const handleOpenMod = (selectedItem) => {
    setSelectedItem(selectedItem);
    setOpenMod(true);
  };

  const handleCloseMod = () => {
    setSelectedItem(null);
    setOpenMod(false);
  };

  const handleOpenDel = (selectedItem) => {
    setSelectedItem(selectedItem);
    setOpenDel(true);
  };

  const handleCloseDel = () => {
    setSelectedItem(null);
    setOpenDel(false);
  };

  const onRestore = async (selectedItem) => {
    try {
      await axios.put(`${restoreUrl}${selectedItem.id}/`);
      await fetchItems();
      notify(`${itemDisplayName} restaurado exitosamente.`, "success");
    } catch (error) {
      console.error("Error al restaurar el item:", error);
      notify(`No se pudo restaurar ${itemDisplayName}.`, "error");
    }
  };

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
            openDelModal={handleOpenDel}
            openModModal={handleOpenMod}
            onRestore={onRestore}
            hasStatus={hasStatus}
          />
        )}
        {openAdd && (
          <AddModal
            open={openAdd}
            handleClose={handleCloseAdd}
            addUrl={addUrl}
            onAdd={async (message, severity) => {
              notify(message, severity);
              handleCloseAdd();
              await fetchItems();
            }}
            itemName={itemDisplayName}
          />
        )}
        {openMod && (
          <ModifyModal
            open={openMod}
            handleClose={handleCloseMod}
            modificationUrl={modificationUrl}
            onMod={async (message, severity) => {
              notify(message, severity);
              handleCloseMod();
              await fetchItems();
            }}
            itemName={itemDisplayName}
            selectedItem={selectedItem}
          />
        )}
        {openDel && (
          <DeactivateModal
            open={openDel}
            handleClose={handleCloseDel}
            deletionUrl={deletionUrl}
            onDelete={async (message, severity) => {
              notify(message, severity);
              handleCloseDel();
              await fetchItems();
            }}
            itemName={itemDisplayName}
            selectedItem={selectedItem}
            isRestorable={hasStatus}
          />
        )}
      </div>
    </div>
  );
};

ConsultGridView.propTypes = {
  fetchUrl: PropTypes.string.isRequired,
  addUrl: PropTypes.string.isRequired,
  deletionUrl: PropTypes.string.isRequire
  d,
  modificationUrl: PropTypes.string.isRequired,
  restoreUrl: PropTypes.string.isRequired,
  columns: PropTypes.arrayOf(PropTypes.string).isRequired,
  itemDisplayName: PropTypes.string.isRequired,
  hasStatus: PropTypes.bool,
};

export default ConsultGridView;
