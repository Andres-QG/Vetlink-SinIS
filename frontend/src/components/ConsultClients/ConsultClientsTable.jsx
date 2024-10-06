import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TableFooter,
  TablePagination,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  useMediaQuery,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import ModifyClientModal from "./ModifyClientModal";
import DeleteClientModal from "./DeleteClientModal";
import { useTheme } from "@mui/material/styles";

const ConsultClientsTable = ({
  clients,
  page,
  setPage,
  totalPages,
  fetchClients,
  showSnackbar,
}) => {
  const rowsPerPage = 10;
  const [openModal, setOpenModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);

  // Determina si la vista es móvil o no
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleEditClick = (client) => {
    setSelectedClient(client);
    setOpenModal(true);
  };

  const handleDeleteClick = (client) => {
    setSelectedClient(client);
    setOpenDeleteModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedClient(null);
  };

  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false);
    setSelectedClient(null);
  };

  const getItemAriaLabel = (type) => {
    if (type === "first") return "Ir a la primera página";
    if (type === "last") return "Ir a la última página";
    if (type === "next") return "Ir a la siguiente página";
    if (type === "previous") return "Ir a la página anterior";
    return "";
  };

  return (
    <>
      {isMobile ? (
        // Vista en formato de tarjeta para dispositivos móviles
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {clients.map((client) => (
            <Card key={client.usuario} variant="outlined" sx={{ padding: 1 }}>
              <CardContent>
                <Typography variant="h6">{client.nombre}</Typography>
                <Typography variant="body2">
                  <strong>Usuario:</strong> {client.usuario}
                </Typography>
                <Typography variant="body2">
                  <strong>Apellido:</strong> {client.apellidos}
                </Typography>
                <Typography variant="body2">
                  <strong>Cédula:</strong> {client.cedula}
                </Typography>
                <Typography variant="body2">
                  <strong>Teléfono:</strong> {client.telefono}
                </Typography>
                <Typography variant="body2">
                  <strong>Correo:</strong> {client.correo}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: 1,
                    mt: 2,
                  }}
                >
                  <Button
                    onClick={() => handleEditClick(client)}
                    startIcon={<Edit />}
                  >
                    Modificar
                  </Button>
                  <Button
                    onClick={() => handleDeleteClick(client)}
                    startIcon={<Delete />}
                    color="error"
                  >
                    Eliminar
                  </Button>
                </Box>
              </CardContent>
            </Card>
          ))}
          {/* Agrega la paginación debajo de las tarjetas */}
          <TablePagination
            component="div"
            count={totalPages * rowsPerPage}
            rowsPerPage={rowsPerPage}
            page={page - 1}
            onPageChange={(event, newPage) => setPage(newPage + 1)}
            labelDisplayedRows={({ from, to, count }) =>
              `${from}-${to} de ${count}`
            }
            rowsPerPageOptions={[]}
            showFirstButton={true}
            showLastButton={true}
            getItemAriaLabel={getItemAriaLabel}
            sx={{
              ".MuiTablePagination-toolbar": {
                justifyContent: "flex-start",
                flexWrap: "wrap",
                minWidth: "300px",
              },
              ".MuiTablePagination-spacer": {
                flex: "none",
                minWidth: 50,
                display: "none",
              },
              ".MuiTablePagination-selectRoot": {
                margin: 0,
              },
              ".MuiTablePagination-actions": {
                flexShrink: 0,
              },
            }}
          />
        </Box>
      ) : (
        // Vista en formato de tabla para dispositivos no móviles
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow
                sx={{
                  fontWeight: "bold",
                  fontSize: "0.875rem",
                  backgroundColor: "#f0f0f0",
                  color: "#000",
                  textAlign: "left",
                  padding: "16px",
                }}
              >
                <TableCell sx={{ width: "10%" }}>Usuario</TableCell>
                <TableCell>Nombre</TableCell>
                <TableCell>Apellido</TableCell>
                <TableCell>Cédula</TableCell>
                <TableCell>Teléfono</TableCell>
                <TableCell>Correo</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {clients.map((client) => (
                <TableRow key={client.usuario}>
                  <TableCell>{client.usuario}</TableCell>
                  <TableCell>{client.nombre}</TableCell>
                  <TableCell>{client.apellidos}</TableCell>
                  <TableCell>{client.cedula}</TableCell>
                  <TableCell>{client.telefono}</TableCell>
                  <TableCell>{client.correo}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEditClick(client)}>
                      <Edit />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteClick(client)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {clients.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    No se encontraron clientes
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
            <TableFooter>
              <TableRow
                sx={{
                  height: "auto",
                }}
              >
                <TableCell
                  colSpan={7}
                  sx={{
                    borderBottom: "none",
                    padding: "8px 0",
                  }}
                >
                  <TablePagination
                    component="div"
                    count={totalPages * rowsPerPage}
                    rowsPerPage={rowsPerPage}
                    page={page - 1}
                    onPageChange={(event, newPage) => setPage(newPage + 1)}
                    labelDisplayedRows={({ from, to, count }) =>
                      `${from}-${to} de ${count}`
                    }
                    rowsPerPageOptions={[]} // No muestra la selección de 'rows per page'
                    showFirstButton={true}
                    showLastButton={true}
                    getItemAriaLabel={getItemAriaLabel}
                    sx={{
                      ".MuiTablePagination-toolbar": {
                        justifyContent: "flex-start",
                        flexWrap: "wrap",
                        minWidth: "300px",
                      },
                      ".MuiTablePagination-spacer": {
                        flex: "none",
                        minWidth: 50,
                        display: "none",
                      },
                      ".MuiTablePagination-selectRoot": {
                        margin: 0,
                      },
                      ".MuiTablePagination-actions": {
                        flexShrink: 0,
                      },
                    }}
                  />
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      )}

      {selectedClient && (
        <ModifyClientModal
          open={openModal}
          onClose={handleCloseModal}
          client={selectedClient}
          fetchClients={fetchClients}
          showSnackbar={showSnackbar}
        />
      )}

      {selectedClient && (
        <DeleteClientModal
          open={openDeleteModal}
          onClose={handleCloseDeleteModal}
          client={selectedClient}
          fetchClients={fetchClients}
          showSnackbar={showSnackbar}
        />
      )}
    </>
  );
};

export default ConsultClientsTable;
