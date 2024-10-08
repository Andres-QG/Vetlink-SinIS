import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TablePagination,
  Modal,
  Box,
  Typography,
  Button,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";

const VetsTable = ({
  data,
  columns,
  totalCount,
  page,
  rowsPerPage,
  onPageChange,
  fetchData,
  onEditVet, // Recibir la función de edición
}) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const getItemAriaLabel = (type) => {
    return `Ir a la página ${type}`;
  };

  const [openModal, setOpenModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const handleOpenModal = (item) => {
    setSelectedItem(item);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedItem(null);
  };

  console.log(selectedItem);

  const handleDelete = async () => {
    handleCloseModal();
    if (!selectedItem) return;

    try {
      await axios.delete(
        `http://localhost:8000/api/delete-client/${selectedItem.usuario}/`
      );
      fetchData();
    } catch (error) {
      console.error("Failed to delete vet:", error);
    }
  };

  return (
    <>
      <TableContainer component={Paper}>
        {isMobile ? (
          data.map((item) => (
            <div
              key={item.id}
              style={{
                border: "1px solid #ddd",
                marginBottom: "10px",
                padding: "10px",
              }}>
              {columns.map((col) => (
                <div key={col.field} style={{ marginBottom: "5px" }}>
                  <strong>{col.headerName} :</strong> {item[col.field]}
                </div>
              ))}
              <div>
                <IconButton onClick={() => onEditVet(item)}>
                  <Edit />
                </IconButton>
                <IconButton onClick={() => handleOpenModal(item)}>
                  <Delete />
                </IconButton>
              </div>
            </div>
          ))
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                {columns.map((col) => (
                  <TableCell
                    key={col.field}
                    style={{ fontWeight: "bold", backgroundColor: "#f0f0f0" }}>
                    {col.headerName}
                  </TableCell>
                ))}
                <TableCell
                  style={{ fontWeight: "bold", backgroundColor: "#f0f0f0" }}>
                  Acciones
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((item) => (
                <TableRow key={`row-${item.id}`}>
                  {columns.map((col, index) => (
                    <TableCell key={`cell-${item.id}-${col.field}`}>
                      {item[col.field]}
                    </TableCell>
                  ))}
                  <TableCell key={`actions-${item.id}`}>
                    <IconButton onClick={() => onEditVet(item)}>
                      <Edit />
                    </IconButton>
                    <IconButton onClick={() => handleOpenModal(item)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {data.length === 0 && (
                <TableRow key="empty-row">
                  <TableCell colSpan={columns.length + 1} align="center">
                    No hay datos disponibles
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </TableContainer>

      <TablePagination
        component="div"
        count={totalCount}
        rowsPerPage={rowsPerPage}
        page={page - 1}
        onPageChange={(event, newPage) => onPageChange(newPage + 1)}
        labelDisplayedRows={({ from, to, count }) =>
          `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`
        }
        rowsPerPageOptions={[]}
        showFirstButton={true}
        showLastButton={true}
        getItemAriaLabel={getItemAriaLabel}
      />

      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          className="bg-white p-6 rounded-lg shadow-lg"
          style={{ width: 400, margin: "auto", marginTop: "10%" }}>
          <Typography variant="h6" component="h2">
            ¿Estás seguro de que deseas eliminar este elemento?
          </Typography>
          <Typography sx={{ mt: 2 }}>
            Esta acción no se puede deshacer. El elemento será eliminado
            permanentemente.
          </Typography>
          <Box mt={4} display="flex" justifyContent="space-between">
            <Button variant="contained" color="error" onClick={handleDelete}>
              Eliminar
            </Button>
            <Button variant="outlined" onClick={handleCloseModal}>
              Cancelar
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default VetsTable;
