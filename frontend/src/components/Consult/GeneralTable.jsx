import { useState, useEffect } from "react";
import axios from "axios";
import {
  IconButton,
  TablePagination,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableFooter,
  Paper,
  Modal,
  Box,
  Typography,
  Button,
  Card,
  CardContent,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";

// TODO: Props: data, columns, totalCount, page, rowsPerPage, onPageChange
const GeneralTable = ({
  data,
  columns,
  totalCount,
  page,
  rowsPerPage,
  onPageChange,
  deletionUrl,
  pkCol,
  onDelete,
  visualIdentifierCol,
  fetchData,
  OnModModal,
  onModify,
}) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 905);
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
  const [openModModal, setOpenModModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // "Delete" modal
  const handleOpenModal = (item) => {
    setSelectedItem(item);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedItem(null);
  };

  const handleDelete = async () => {
    handleCloseModal();
    if (!selectedItem) return;

    try {
      const url = `${deletionUrl}/${selectedItem[pkCol]}/`;
      const response = await axios.delete(url);
      onDelete("Elemento eliminado correctamente.", "success");
    } catch (error) {
      if (error.response) {
        onDelete(
          `Error: ${error.response.status} - ${
            error.response.data.error || error.response.data.detail
          }`
        );
      } else if (error.request) {
        onDelete("No se recibió respuesta del servidor. Verifica tu conexión.");
      } else {
        onDelete(`Error desconocido: ${error.message}`);
      }
    }
    fetchData();
  };

  // "Modify" modal
  const handleOpenModModal = (item) => {
    setSelectedItem(item);
    setOpenModModal(true);
  };

  const handleCloseModModal = () => {
    setOpenModModal(false);
    setSelectedItem(null);
  };

  return (
    <>
      {isMobile ? (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {data.map((item) => (
            <Card
              key={item.id} // Usa keyField para el valor de la clave
              variant="outlined"
              sx={{ padding: 1 }}
            >
              <CardContent>
                {columns.map((col) => (
                  <Typography variant="body2" key={col.field}>
                    <strong>{col.headerName}:</strong> {item[col.field]}
                  </Typography>
                ))}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-start",
                    gap: 1,
                    mt: 2,
                  }}
                >
                  <Button
                    onClick={() => handleOpenModModal(item)}
                    startIcon={<Edit />}
                  >
                    Modificar
                  </Button>
                  <Button
                    onClick={() => handleOpenModal(item)}
                    startIcon={<Delete />}
                    color="error"
                  >
                    Eliminar
                  </Button>
                </Box>
              </CardContent>
            </Card>
          ))}
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
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                {columns.map((col) => (
                  <TableCell
                    key={col.field}
                    style={{ fontWeight: "bold", backgroundColor: "#f0f0f0" }}
                  >
                    {col.headerName}
                  </TableCell>
                ))}
                <TableCell
                  style={{ fontWeight: "bold", backgroundColor: "#f0f0f0" }}
                >
                  Acciones
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((item, index) => (
                <TableRow key={item.id || `row-${index}`}>
                  {columns.map((col) => (
                    <TableCell key={`cell-${item.id || index}-${col.field}`}>
                      {item[col.field]}
                    </TableCell>
                  ))}
                  <TableCell key={`actions-${item.id || index}`}>
                    <IconButton onClick={() => handleOpenModModal(item)}>
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
            <TableFooter>
              <TableRow>
                <TableCell
                  colSpan={columns.length + 1}
                  sx={{
                    borderBottom: "none",
                    padding: "8px 0",
                  }}
                >
                  <TablePagination
                    component="div"
                    count={totalCount}
                    rowsPerPage={rowsPerPage}
                    page={page - 1}
                    onPageChange={(event, newPage) => onPageChange(newPage + 1)}
                    labelDisplayedRows={({ from, to, count }) =>
                      `${from}-${to} de ${
                        count !== -1 ? count : `más de ${to}`
                      }`
                    }
                    rowsPerPageOptions={[]}
                    showFirstButton={true}
                    showLastButton={true}
                    getItemAriaLabel={getItemAriaLabel}
                  />
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      )}

      {/*Modal de confirmación de eliminación*/}
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          className="p-6 bg-white rounded-lg shadow-lg"
          style={{ width: 400, margin: "auto", marginTop: "10%" }}
        >
          <Typography variant="h6" component="h2">
            ¿Estás seguro de que deseas eliminar{" a "}
            {selectedItem?.[visualIdentifierCol]}?
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
      {/*Modal de modificación*/}
      {selectedItem && openModModal && (
        <OnModModal
          handleOpen={openModModal}
          handleClose={handleCloseModModal}
          onSuccess={onModify}
          selectedItem={selectedItem}
        />
      )}
    </>
  );
};

export default GeneralTable;
