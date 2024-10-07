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
  Paper,
  Modal,
  Box,
  Typography,
  Button,
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
  onOpenModal,
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
  const [selectedItem, setSelectedItem] = useState(null);

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

    console.log(selectedItem);

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
              }}
            >
              {columns.map((col) => (
                <div key={col.field} style={{ marginBottom: "5px" }}>
                  <strong>{col.headerName} :</strong> {item[col.field]}
                </div>
              ))}
              <div>
                <IconButton onClick={() => console.log("Edit clicked")}>
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
                    <IconButton onClick={() => {onOpenModal(item, item.dueño)}}>
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
      {/*Modal de confirmación de eliminación*/}
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          className="bg-white p-6 rounded-lg shadow-lg"
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
    </>
  );
};

export default GeneralTable;
