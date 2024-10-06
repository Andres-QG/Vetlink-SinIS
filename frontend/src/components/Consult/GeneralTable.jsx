import { useState } from "react";
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
}) => {
  // Función para obtener la etiqueta ARIA para los botones de paginación
  const getItemAriaLabel = (type) => {
    return `Ir a la página ${type}`;
  };

  return (
    <>
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
            {data.map((item) => (
              <TableRow key={item.id}>
                {columns.map((col) => (
                  <TableCell key={col.field}>{item[col.field]}</TableCell>
                ))}
                <TableCell>
                  <IconButton onClick={() => console.log("Edit clicked")}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => console.log("Delete clicked")}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {data.length === 0 && (
              <TableRow>
                <TableCell colSpan={columns.length + 1} align="center">
                  No hay datos disponibles
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={totalCount} // Total de elementos
        rowsPerPage={rowsPerPage} // Número de filas por página
        page={page - 1} // La paginación de Material-UI usa un index 0, así que restamos 1
        onPageChange={(event, newPage) => onPageChange(newPage + 1)} // Cambiar la página
        labelDisplayedRows={({ from, to, count }) =>
          `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`
        }
        rowsPerPageOptions={[]} // No permite cambiar el número de filas por página
        showFirstButton={true}
        showLastButton={true}
        getItemAriaLabel={getItemAriaLabel}
      />
    </>
  );
};

export default GeneralTable;
