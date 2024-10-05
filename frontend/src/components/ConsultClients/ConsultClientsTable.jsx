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

const ConsultClientsTable = ({ clients, page, setPage, totalPages }) => {
  const rowsPerPage = 10; // Número fijo de filas por página

  // Función para obtener la etiqueta ARIA para los botones de paginación
  const getItemAriaLabel = (type) => {
    return `Ir a la página ${type}`;
  };

  return (
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
                <IconButton>
                  <Edit />
                </IconButton>
                <IconButton>
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
          <TableRow>
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
                  justifyContent: "flex-start", // Alinea los controles de paginación al final
                  flexWrap: "wrap", // Permite que los elementos se envuelvan en pantallas pequeñas
                  minWidth: "300px", // Asegura un ancho mínimo para los controles de paginación
                },
                ".MuiTablePagination-spacer": {
                  flex: "none", // Asegura que el spacer adapte su tamaño correctamente
                  minWidth: 50, // Establece un ancho mínimo para el spacer
                  display: "none",
                },
                ".MuiTablePagination-selectRoot": {
                  margin: 0, // Reduce el margen alrededor del selector de páginas
                },
                ".MuiTablePagination-actions": {
                  flexShrink: 0, // Evita que los botones se reduzcan
                },
              }}
            />
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
};

export default ConsultClientsTable;