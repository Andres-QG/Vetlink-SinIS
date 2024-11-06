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
  CircularProgress,
  Stack,
} from "@mui/material";
import {
  Edit,
  Delete,
  Info,
  Restore,
  Close as CloseIcon,
} from "@mui/icons-material";
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
  customDeleteTitle,
  fetchData,
  ModModal,
  DetailsModal,
  disableModifyAction = false,
  disableDeleteAction = false,
  disableReactivateAction = false,
  hideActions = false,
}) => {
  const [isMobile, setIsMobile] = useState(false);
  const notify = useNotification();
  const [openModal, setOpenModal] = useState(false);
  const [openModModal, setOpenModModal] = useState(false);
  const [openDetailsModal, setOpenDetailsModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loadingDelete, setLoadingDelete] = useState(false);

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

  const getItemAriaLabel = (type) => `Ir a la página ${type}`;

  const handleOpenModal = (item) => {
    setSelectedItem(item);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedItem(null);
  };

  const handleDelete = async () => {
    if (!selectedItem) return;

    setLoadingDelete(true);
    try {
      const url = `${deletionUrl}${selectedItem[pkCol]}/`;
      await axios.delete(url);
      const message = restoreUrl
        ? "Elemento desactivado correctamente."
        : "Elemento eliminado correctamente.";
      notify(message, "success");
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
    } finally {
      setLoadingDelete(false);
      handleCloseModal(); // Cierra el modal al final de la operación
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
                  {!hideActions && (
                    <>
                      {DetailsModal && (
                        <Button
                          onClick={() => handleOpenDetailsModal(item)}
                          startIcon={<Info />}>
                          Más detalles
                        </Button>
                      )}
                      <Button
                        onClick={() => handleOpenModModal(item)}
                        startIcon={<Edit />}
                        color="primary"
                        disabled={disableModifyAction}>
                        Modificar
                      </Button>
                      {item.activo === true || item.activo === "activo" ? (
                        <Button
                          onClick={() => handleOpenModal(item)}
                          startIcon={<Delete />}
                          color="error"
                          disabled={disableDeleteAction}>
                          Desactivar
                        </Button>
                      ) : deletionUrl && !restoreUrl ? (
                        <Button
                          onClick={() => handleOpenModal(item)}
                          startIcon={<Delete />}
                          color="error"
                          disabled={disableDeleteAction}>
                          Eliminar
                        </Button>
                      ) : null}
                      {restoreUrl &&
                        (item.activo === false ||
                          item.activo === "inactivo") && (
                          <Button
                            onClick={() => handleReactivate(item)}
                            startIcon={<Restore />}
                            color="success"
                            disabled={disableReactivateAction}>
                            Reactivar
                          </Button>
                        )}
                    </>
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
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                {columns.map(
                  (col) =>
                    col.type !== "action" && (
                      <TableCell
                        className="h-[68px]"
                        key={col.field}
                        style={{
                          fontWeight: "bold",
                          backgroundColor: "#f0f0f0",
                        }}>
                        {col.headerName}
                      </TableCell>
                    )
                )}
                {!hideActions && (
                  <TableCell
                    style={{
                      fontWeight: "bold",
                      backgroundColor: "#f0f0f0",
                    }}>
                    Acciones
                  </TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((item, index) => (
                <TableRow
                  className="h-[68px]"
                  key={item[pkCol] || `row-${index}`}>
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
                                // modificar tamaño
                                textAlign: "center",
                                height: "30px",
                                width: 80,
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
                  {!hideActions && (
                    <TableCell key={`actions-${item[pkCol] || index}`}>
                      {DetailsModal && (
                        <IconButton
                          onClick={() => handleOpenDetailsModal(item)}
                          disabled={disableModifyAction}>
                          <Info />
                        </IconButton>
                      )}
                      <IconButton
                        onClick={() => handleOpenModModal(item)}
                        disabled={disableModifyAction}
                        color="primary">
                        <Edit />
                      </IconButton>
                      {item.activo === true || item.activo === "activo" ? (
                        <IconButton
                          onClick={() => handleOpenModal(item)}
                          color="error"
                          disabled={disableDeleteAction}>
                          <Delete />
                        </IconButton>
                      ) : deletionUrl && !restoreUrl ? (
                        <IconButton
                          onClick={() => handleOpenModal(item)}
                          color="error"
                          disabled={disableDeleteAction}>
                          <Delete />
                        </IconButton>
                      ) : null}
                      {restoreUrl &&
                        (item.activo === false ||
                          item.activo === "inactivo") && (
                          <IconButton
                            onClick={() => handleReactivate(item)}
                            sx={{ color: green[500] }}
                            disabled={disableReactivateAction}>
                            <Restore />
                          </IconButton>
                        )}
                    </TableCell>
                  )}
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
                      `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`
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
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            p: { xs: 2, sm: 3 },
            borderRadius: 2,
            boxShadow: 3,
            bgcolor: "#fff",
            width: "90%",
            maxWidth: "400px",
            textAlign: "center",
          }}>
          <IconButton
            onClick={handleCloseModal}
            sx={{
              position: "absolute",
              top: "4px",
              right: "8px",
            }}>
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
            {customDeleteTitle ||
              `¿Estás seguro de que deseas ${
                restoreUrl ? "desactivar" : "eliminar"
              } el registro ${selectedItem?.[visualIdentifierCol]}?`}
          </Typography>
          <Typography variant="body1" sx={{ mb: 4 }}>
            Esta acción{" "}
            {restoreUrl
              ? "se puede deshacer activándola nuevamente."
              : "es irreversible."}
          </Typography>
          <Stack direction="row" spacing={2} sx={{ justifyContent: "center" }}>
            <Button
              onClick={handleCloseModal}
              variant="outlined"
              sx={{ borderColor: "#00308F", color: "#00308F" }}>
              Cancelar
            </Button>
            <Button
              onClick={handleDelete}
              variant="contained"
              color="error"
              disabled={loadingDelete}
              startIcon={loadingDelete && <CircularProgress size={20} />}
              sx={{
                backgroundColor: "#D32F2F",
                "&:hover": { backgroundColor: "#B71C1C" },
              }}>
              {loadingDelete
                ? "Eliminando..."
                : restoreUrl
                  ? "Desactivar"
                  : "Eliminar"}
            </Button>
          </Stack>
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
  customDeleteTitle: PropTypes.string,
  fetchData: PropTypes.func.isRequired,
  ModModal: PropTypes.elementType.isRequired,
  DetailsModal: PropTypes.elementType,
  otherData: PropTypes.object,
  disableAddButton: PropTypes.bool,
  disableModifyAction: PropTypes.bool,
  disableDeleteAction: PropTypes.bool,
  disableReactivateAction: PropTypes.bool,
};

export default GeneralTable;
