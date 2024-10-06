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
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import ModifyClientModal from "./ModifyClientModal";
import DeleteClientModal from "./DeleteClientModal";

const ConsultClientsTable = ({
  clients,
  page,
  setPage,
  totalPages,
  fetchClients,
  showSnackbar,
}) => {
  const rowsPerPage = 10; // Número fijo de filas por página
  const [openModal, setOpenModal] = useState(false); // Controla el modal de modificación
  const [openDeleteModal, setOpenDeleteModal] = useState(false); // Controla el modal de eliminación
  const [selectedClient, setSelectedClient] = useState(null); // Cliente seleccionado

  // Función para abrir el modal de modificación
  const handleEditClick = (client) => {
    setSelectedClient(client);
    setOpenModal(true);
  };

  // Función para abrir el modal de eliminación
  const handleDeleteClick = (client) => {
    setSelectedClient(client);
    setOpenDeleteModal(true);
  };

  // Función para cerrar el modal de modificación
  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedClient(null);
  };

  // Función para cerrar el modal de eliminación
  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false);
    setSelectedClient(null);
  };

  // Definición de etiquetas de paginación accesibles
  const getItemAriaLabel = (type) => {
    if (type === "first") return "Ir a la primera página";
    if (type === "last") return "Ir a la última página";
    if (type === "next") return "Ir a la siguiente página";
    if (type === "previous") return "Ir a la página anterior";
    return "";
  };

  return (
    <>
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

      {/* Modal de modificación de cliente */}
      {selectedClient && (
        <ModifyClientModal
          open={openModal}
          onClose={handleCloseModal}
          client={selectedClient}
          fetchClients={fetchClients}
          showSnackbar={showSnackbar}
        />
      )}

      {/* Modal de eliminación de cliente */}
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
