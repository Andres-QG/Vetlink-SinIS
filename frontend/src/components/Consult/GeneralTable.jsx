import { useState, useEffect } from "react";
import PropTypes from "prop-types";
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
  Chip,
} from "@mui/material";
import { Edit, Delete, Info, Restore } from "@mui/icons-material";
import { useNotification } from "../Notification";
import { green } from "@mui/material/colors";

const GeneralTable = ({
  data,
  otherData,
  columns,
  totalCount,
  page,
  rowsPerPage,
  onPageChange,
  deletionUrl,
  restoreUrl,
  pkCol,
  visualIdentifierCol,
  fetchData,
  ModModal,
  DetailsModal,
}) => {
  const [isMobile, setIsMobile] = useState(false);
  const notify = useNotification();

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
  const [openModModal, setOpenModModal] = useState(false);
  const [openDetailsModal, setOpenDetailsModal] = useState(false);
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

    try {
      const url = `${deletionUrl}${selectedItem[pkCol]}/`;
      await axios.delete(url);
      notify("Elemento desactivado correctamente.", "success");
      fetchData();
    } catch (error) {
      if (error.response) {
        notify(
          `Error: ${error.response.status} - ${
            error.response.data.error || error.response.data.detail
          }`,
          "error"
        );
      } else if (error.request) {
        notify(
          "No se recibió respuesta del servidor. Verifica tu conexión.",
          "error"
        );
      } else {
        notify(`Error desconocido: ${error.message}`, "error");
      }
    }
  };

  const handleReactivate = async (item) => {
    if (!restoreUrl) return;

    try {
      const url = `${restoreUrl}${item[pkCol]}/`;
      await axios.put(url);
      notify("Elemento reactivado correctamente.", "success");
      fetchData();
    } catch (error) {
      if (error.response) {
        notify(
          `Error: ${error.response.status} - ${
            error.response.data.error || error.response.data.detail
          }`,
          "error"
        );
      } else if (error.request) {
        notify(
          "No se recibió respuesta del servidor. Verifica tu conexión.",
          "error"
        );
      } else {
        notify(`Error desconocido: ${error.message}`, "error");
      }
    }
  };

  const handleOpenModModal = (item) => {
    setSelectedItem(item);
    setOpenModModal(true);
  };

  const handleCloseModModal = () => {
    setOpenModModal(false);
    setSelectedItem(null);
  };

  const handleOpenDetailsModal = (item) => {
    setSelectedItem(item);
    setOpenDetailsModal(true);
  };

  const handleCloseDetailsModal = () => {
    setOpenDetailsModal(false);
    setSelectedItem(null);
  };

  return (
    <>
      {isMobile ? (
        // Vista móvil
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {data.map((item) => (
            <Card key={item[pkCol]} variant="outlined" sx={{ padding: 1 }}>
              <CardContent>
                {columns.map(
                  (col) =>
                    col.type !== "action" && (
                      <Typography variant="body2" key={col.field}>
                        <strong>{col.headerName}:</strong>{" "}
                        {col.type === "chip" ? (
                          <Chip
                            label={
                              item[col.field] === true ||
                              item[col.field] === "activo"
                                ? "Activo"
                                : "Inactivo"
                            }
                            style={{
                              backgroundColor:
                                item[col.field] === true ||
                                item[col.field] === "activo"
                                  ? col.chipColors?.["activo"]
                                  : col.chipColors?.["inactivo"] || "gray",
                            }}
                          />
                        ) : (
                          item[col.field]
                        )}
                      </Typography>
                    )
                )}
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 1,
                    mt: 2,
                    alignItems: "flex-start",
                  }}>
                  {columns
                    .filter((col) => col.type === "action")
                    .map((col) => (
                      <IconButton
                        key={`action-${col.field}`}
                        onClick={() => col.onClick(item)}>
                        {col.icon}
                      </IconButton>
                    ))}
                  {DetailsModal && (
                    <Button
                      onClick={() => handleOpenDetailsModal(item)}
                      startIcon={<Info />}>
                      Más detalles
                    </Button>
                  )}
                  <Button
                    onClick={() => handleOpenModModal(item)}
                    startIcon={<Edit />}>
                    Modificar
                  </Button>
                  {item.activo === true || item.activo === "activo" ? (
                    <Button
                      onClick={() => handleOpenModal(item)}
                      startIcon={<Delete />}
                      color="error">
                      Desactivar
                    </Button>
                  ) : null}
                  {restoreUrl &&
                    (item.activo === false || item.activo === "inactivo") && (
                      <Button
                        onClick={() => handleReactivate(item)}
                        startIcon={<Restore style={{ color: green[500] }} />}
                        style={{ color: green[500] }}>
                        Reactivar
                      </Button>
                    )}
                </Box>
              </CardContent>
            </Card>
          ))}
          <TablePagination
            component="div"
            count={totalCount}
            rowsPerPage={rowsPerPage}
            page={page - 1}
            onPageChange={(_, newPage) => onPageChange(newPage + 1)}
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
        // Vista de escritorio
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                {columns.map(
                  (col) =>
                    col.type !== "action" && (
                      <TableCell
                        key={col.field}
                        style={{
                          fontWeight: "bold",
                          backgroundColor: "#f0f0f0",
                        }}>
                        {col.headerName}
                      </TableCell>
                    )
                )}
                <TableCell
                  style={{
                    fontWeight: "bold",
                    backgroundColor: "#f0f0f0",
                  }}>
                  Acciones
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((item, index) => (
                <TableRow key={item[pkCol] || `row-${index}`}>
                  {columns.map(
                    (col) =>
                      col.type !== "action" && (
                        <TableCell
                          key={`cell-${item[pkCol] || index}-${col.field}`}>
                          {col.type === "chip" ? (
                            <Chip
                              label={
                                item[col.field] === true ||
                                item[col.field] === "activo"
                                  ? "Activo"
                                  : "Inactivo"
                              }
                              style={{
                                position: "relative",
                                left: "-8px",
                                backgroundColor:
                                  item[col.field] === true ||
                                  item[col.field] === "activo"
                                    ? col.chipColors?.["activo"]
                                    : col.chipColors?.["inactivo"] || "gray",
                              }}
                            />
                          ) : (
                            item[col.field]
                          )}
                        </TableCell>
                      )
                  )}
                  <TableCell key={`actions-${item[pkCol] || index}`}>
                    {columns
                      .filter((col) => col.type === "action")
                      .map((col) => (
                        <IconButton
                          key={`action-${col.field}`}
                          onClick={() => col.onClick(item)}>
                          {col.icon}
                        </IconButton>
                      ))}
                    {DetailsModal && (
                      <IconButton onClick={() => handleOpenDetailsModal(item)}>
                        <Info />
                      </IconButton>
                    )}
                    <IconButton onClick={() => handleOpenModModal(item)}>
                      <Edit />
                    </IconButton>
                    {item.activo === true || item.activo === "activo" ? (
                      <IconButton onClick={() => handleOpenModal(item)}>
                        <Delete color="error" />
                      </IconButton>
                    ) : null}
                    {restoreUrl &&
                      (item.activo === false || item.activo === "inactivo") && (
                        <IconButton onClick={() => handleReactivate(item)}>
                          <Restore style={{ color: green[500] }} />
                        </IconButton>
                      )}
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
                  }}>
                  <TablePagination
                    component="div"
                    count={totalCount}
                    rowsPerPage={rowsPerPage}
                    page={page - 1}
                    onPageChange={(_, newPage) => onPageChange(newPage + 1)}
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

      {/* Modal de confirmación para desactivar */}
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          className="p-6 bg-white rounded-lg shadow-lg"
          sx={{ width: 400, margin: "auto", marginTop: "10%" }}>
          <Typography variant="h6" component="h2">
            ¿Estás seguro de que deseas desactivar{" "}
            {selectedItem?.[visualIdentifierCol]}?
          </Typography>
          <Typography sx={{ mt: 2 }}>Esta acción se puede deshacer.</Typography>
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

      {/* Modal para modificar */}
      {selectedItem && openModModal && (
        <ModModal
          open={openModModal}
          handleClose={handleCloseModModal}
          onSuccess={async (message, severity) => {
            notify(message, severity);
            handleCloseModModal();
            await fetchData();
          }}
          selectedItem={selectedItem}
          otherData={otherData}
        />
      )}

      {/* Modal para detalles */}
      {selectedItem && openDetailsModal && (
        <DetailsModal
          open={openDetailsModal}
          handleClose={handleCloseDetailsModal}
          selectedItem={selectedItem}
        />
      )}
    </>
  );
};

GeneralTable.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      field: PropTypes.string,
      headerName: PropTypes.string,
      width: PropTypes.number,
      type: PropTypes.oneOf(["text", "chip", "action"]).isRequired,
      icon: PropTypes.element,
      chipColors: PropTypes.object,
      onClick: PropTypes.func,
    })
  ).isRequired,
  totalCount: PropTypes.number.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  deletionUrl: PropTypes.string.isRequired,
  restoreUrl: PropTypes.string,
  pkCol: PropTypes.string.isRequired,
  visualIdentifierCol: PropTypes.string.isRequired,
  fetchData: PropTypes.func.isRequired,
  ModModal: PropTypes.elementType.isRequired,
  DetailsModal: PropTypes.elementType,
  otherData: PropTypes.array,
};

export default GeneralTable;
