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
import { useTheme } from "@mui/material/styles";

const GeneralTable2 = ({
  data,
  columns,
  page,
  setPage,
  totalPages,
  fetchData,
  showSnackbar,
  EditModal,
  DeleteModal,
  keyField, // Prop para especificar el campo usado como clave única
}) => {
  const rowsPerPage = 10;
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleEditClick = (item) => {
    setSelectedItem(item);
    setOpenEditModal(true);
  };

  const handleDeleteClick = (item) => {
    setSelectedItem(item);
    setOpenDeleteModal(true);
  };

  const handleCloseEditModal = () => {
    setOpenEditModal(false);
    setSelectedItem(null);
  };

  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false);
    setSelectedItem(null);
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
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {data.map((item) => (
            <Card
              key={item[keyField]} // Usa keyField para el valor de la clave
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
                    justifyContent: "flex-end",
                    gap: 1,
                    mt: 2,
                  }}
                >
                  <Button
                    onClick={() => handleEditClick(item)}
                    startIcon={<Edit />}
                  >
                    Modificar
                  </Button>
                  <Button
                    onClick={() => handleDeleteClick(item)}
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
            count={totalPages * rowsPerPage}
            rowsPerPage={rowsPerPage}
            page={page - 1}
            onPageChange={(event, newPage) => setPage(newPage + 1)}
            labelDisplayedRows={({ from, to, count }) =>
              `${from}-${to} de ${count}`
            }
            rowsPerPageOptions={[]}
            showFirstButton
            showLastButton
            getItemAriaLabel={getItemAriaLabel}
            sx={{
              ".MuiTablePagination-toolbar": {
                justifyContent: "flex-start",
                flexWrap: "wrap",
                minWidth: "300px",
              },
            }}
          />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow
                sx={{
                  fontWeight: "bold",
                  fontSize: "0.875rem",
                  backgroundColor: "#f0f0f0",
                }}
              >
                {columns.map((col) => (
                  <TableCell key={col.field}>{col.headerName}</TableCell>
                ))}
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((item) => (
                <TableRow key={item[keyField]}>
                  {columns.map((col) => (
                    <TableCell key={col.field}>{item[col.field]}</TableCell>
                  ))}
                  <TableCell>
                    <IconButton onClick={() => handleEditClick(item)}>
                      <Edit />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteClick(item)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {data.length === 0 && (
                <TableRow>
                  <TableCell colSpan={columns.length + 1} align="center">
                    No se encontraron datos
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
                    count={totalPages * rowsPerPage}
                    rowsPerPage={rowsPerPage}
                    page={page - 1}
                    onPageChange={(event, newPage) => setPage(newPage + 1)}
                    labelDisplayedRows={({ from, to, count }) =>
                      `${from}-${to} de ${count}`
                    }
                    rowsPerPageOptions={[]}
                    showFirstButton
                    showLastButton
                    getItemAriaLabel={getItemAriaLabel}
                  />
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      )}

      {selectedItem && (
        <EditModal
          open={openEditModal}
          onClose={handleCloseEditModal}
          data={selectedItem} // Pasamos data como prop generalizado
          fetchData={fetchData}
          showSnackbar={showSnackbar}
        />
      )}

      {selectedItem && (
        <DeleteModal
          open={openDeleteModal}
          onClose={handleCloseDeleteModal}
          data={selectedItem} // Pasamos data como prop generalizado
          fetchData={fetchData}
          showSnackbar={showSnackbar}
        />
      )}
    </>
  );
};

export default GeneralTable2;
