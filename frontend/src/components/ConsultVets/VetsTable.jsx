import React, { useState, useEffect } from "react";
import {
  TableContainer,
  Paper,
  Card,
  CardContent,
  Typography,
  CardActions,
  IconButton,
  TablePagination,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Box,
  Modal,
  Button,
} from "@mui/material";
import { Edit, Delete, Restore } from "@mui/icons-material";
import { green } from "@mui/material/colors";

const VetsTable = ({
  data,
  columns,
  totalCount,
  page,
  rowsPerPage,
  onPageChange,
  fetchData,
  onEditVet,
}) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
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

  const handleDeleteOrReactivate = async (vet) => {
    if (vet.estado === "Activo") {
      // Lógica para desactivar
    } else {
      // Lógica para reactivar
    }
  };

  const handleDelete = async () => {
    handleCloseModal();
    if (!selectedItem) return;
    try {
      // Acción de eliminar o desactivar
    } catch (error) {
      // Manejo de errores
    }
  };

  const renderEstadoChip = (estado) => {
    const color =
      estado === "Activo" ? "rgba(184,230,215,255)" : "rgba(255,124,125,255)";
    const label = estado === "Activo" ? "Activo" : "Inactivo";
    return (
      <Box
        sx={{
          backgroundColor: color,
          borderRadius: "16px",
          padding: "4px 12px",
          display: "inline-block",
        }}>
        <Typography variant="body2">{label}</Typography>
      </Box>
    );
  };

  return (
    <>
      <TableContainer component={Paper}>
        {isMobile ? (
          <>
            {data.map((item) => (
              <Card key={item.id} style={{ marginBottom: "10px" }}>
                <CardContent>
                  {columns.map(
                    (col) =>
                      col.headerName && (
                        <Typography
                          key={col.field}
                          variant="body2"
                          component="p">
                          <strong>{col.headerName}:</strong> {item[col.field]}
                        </Typography>
                      )
                  )}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}>
                    <Typography variant="body2" component="p">
                      <strong>Estado:</strong>
                    </Typography>
                    {renderEstadoChip(item.estado)}
                  </div>
                </CardContent>
                <CardActions>
                  <IconButton onClick={() => onEditVet(item)}>
                    <Edit sx={{ color: "rgba(25,118,210,255)" }} />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteOrReactivate(item)}>
                    {item.estado === "Activo" ? (
                      <Delete color="error" />
                    ) : (
                      <Restore style={{ color: green[500] }} />
                    )}
                  </IconButton>
                </CardActions>
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
          </>
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
                  Estado
                </TableCell>
                <TableCell
                  style={{ fontWeight: "bold", backgroundColor: "#f0f0f0" }}>
                  Acciones
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((item) => (
                <TableRow key={`row-${item.id}`}>
                  {columns.map((col) => (
                    <TableCell key={`cell-${item.id}-${col.field}`}>
                      {item[col.field]}
                    </TableCell>
                  ))}
                  <TableCell key={`estado-${item.id}`}>
                    {renderEstadoChip(item.estado)}
                  </TableCell>
                  <TableCell key={`actions-${item.id}`}>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        gap: 1,
                        alignItems: "center",
                      }}>
                      <IconButton onClick={() => onEditVet(item)}>
                        <Edit sx={{ color: "rgba(25,118,210,255)" }} />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDeleteOrReactivate(item)}>
                        {item.estado === "Activo" ? (
                          <Delete color="error" />
                        ) : (
                          <Restore style={{ color: green[500] }} />
                        )}
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
              {data.length === 0 && (
                <TableRow key="empty-row">
                  <TableCell colSpan={columns.length + 2} align="center">
                    No hay datos disponibles
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
            <TableRow>
              <TableCell
                colSpan={columns.length + 2}
                sx={{ borderBottom: "none", padding: "8px 0" }}>
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
              </TableCell>
            </TableRow>
          </Table>
        )}
      </TableContainer>

      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          className="bg-white p-6 rounded-lg shadow-lg"
          style={{ width: 400, margin: "auto", marginTop: "10%" }}>
          <Typography variant="h6" component="h2">
            ¿Estás seguro de que deseas desactivar este veterinario?
          </Typography>
          <Typography sx={{ mt: 2 }}>
            Esta acción desactivará al veterinario. Podrás reactivarlo más
            adelante si lo deseas.
          </Typography>
          <Box mt={4} display="flex" justifyContent="space-between">
            <Button variant="contained" color="error" onClick={handleDelete}>
              Desactivar
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
