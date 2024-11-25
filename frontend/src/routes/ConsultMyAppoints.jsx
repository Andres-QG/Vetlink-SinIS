import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  CardActions,
  Button,
  Stack,
  Divider,
  Pagination,
  Tooltip,
  Grow,
  Tabs,
  Tab,
  IconButton,
  Dialog,
  TextField,
  Grid,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  CalendarToday as CalendarTodayIcon,
  Info as InfoIcon,
  Close,
} from "@mui/icons-material";
import SearchBar from "../components/Consult/GeneralizedSearchBar";
import { useNotification } from "../components/Notification";
import AddCitaPage from "../components/consultCitas/AddCitaPage";
import ModifyCitaModal from "../components/consultCitas/ModifyCitaModal";

const ConsultMyAppoints = () => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [tabIndex, setTabIndex] = useState(0);
  const appointmentsPerPage = 9; // Adjusted to 9 for 3 per row on md (12 / 4 = 3)
  const showNotification = useNotification();

  const [otherData, setOtherData] = useState({
    user: {},
    services: [],
    clinicas: [],
    clientes: [],
    veterinarios: [],
  });

  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:8000/api/consult-citas/", {
        withCredentials: true,
      });
      const appointmentsData = response.data.results || [];
      setAppointments(appointmentsData);
      setFilteredAppointments(appointmentsData);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/get-user/", {
          withCredentials: true,
        });
        return response.data.data;
      } catch (error) {
        console.error("Error fetching user:", error);
        return {};
      }
    };

    const fetchClientes = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/get-clients/");
        return response.data.clients;
      } catch (error) {
        console.error("Error fetching clients:", error);
        return [];
      }
    };

    const fetchVeterinarios = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/get-vets/");
        return response.data.vets;
      } catch (error) {
        console.error("Error fetching veterinarians:", error);
        return [];
      }
    };

    const fetchServices = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/get-services/");
        return response.data.services;
      } catch (error) {
        console.error("Error fetching services:", error);
        return [];
      }
    };

    const fetchClinicas = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/get-clinics/");
        return response.data.clinics;
      } catch (error) {
        console.error("Error fetching clinics:", error);
        return [];
      }
    };

    const fetchPaymentMethods = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/get-payment-methods/", {
          withCredentials: true,
        });
        console.log(response)
        return response.data.methods;
      } catch (error) {
        console.error("Error fetching clinics:", error);
        return [];
      }
    };

    const fetchData = async () => {
      try {
        const [user, clientes, veterinarios, services, clinicas, paymentMethods] = await Promise.all([
          fetchUser(),
          fetchClientes(),
          fetchVeterinarios(),
          fetchServices(),
          fetchClinicas(),
          fetchPaymentMethods(),
        ]);
        setOtherData({
          user: user || {},
          services: services || [],
          clinicas: clinicas || [],
          clientes: clientes || [],
          veterinarios: veterinarios || [],
          methods: paymentMethods || [],
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
    fetchAppointments();
  }, []);

  const handleSearch = (searchTerm, filterColumn, order) => {
    const resultsToSort = searchTerm
      ? appointments.filter((appointment) =>
        appointment[filterColumn]
          ?.toString()
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      )
      : [...appointments];

    const sortedResults = resultsToSort.sort((a, b) => {
      if (a[filterColumn] < b[filterColumn]) return order === "asc" ? -1 : 1;
      if (a[filterColumn] > b[filterColumn]) return order === "asc" ? 1 : -1;
      return 0;
    });

    setFilteredAppointments(sortedResults);
  };

  const handleChangePage = (event, value) => {
    setCurrentPage(value);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleActionSuccess = (message, type) => {
    if (type === "success") {
      showNotification(message, type);
      fetchAppointments();
      setTabIndex(0);
    }
  };

  const columns = ["cliente", "veterinario", "nombre", "fecha"];

  const indexOfLastAppointment = currentPage * appointmentsPerPage;
  const indexOfFirstAppointment = indexOfLastAppointment - appointmentsPerPage;
  const currentAppointments = filteredAppointments.slice(
    indexOfFirstAppointment,
    indexOfLastAppointment
  );
  const totalPages = Math.ceil(filteredAppointments.length / appointmentsPerPage);

  const handleDeleteAppointment = async (appointmentId) => {
    try {
      await axios.delete(`http://localhost:8000/api/delete-cita/${appointmentId}/`, {
        withCredentials: true,
      });
      showNotification("Cita eliminada exitosamente", "success");
      fetchAppointments();
    } catch (error) {
      console.error("Error eliminando cita:", error);
      showNotification("Error al eliminar la cita", "error");
    }
  };


  const handleEditAppointment = (appointment) => {
    console.log(appointment)
    setSelectedAppointment(appointment);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setSelectedAppointment(null);
    setIsEditModalOpen(false);
  };

  const handleOpenModal = (appointment) => {
    setSelectedAppointment(appointment);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedAppointment(null);
    setIsModalOpen(false);
  };

  return (
    <Box sx={{ flexGrow: 1, p: { xs: 2, md: 3 } }}>
      {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="70vh"
        >
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
              gap: 1,
            }}
          >
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              sx={{ mb: { xs: 1, sm: 0 } }}
            >
              <CalendarTodayIcon
                className="text-primary"
                sx={{
                  fontSize: 40,
                  verticalAlign: "middle",
                }}
              />
              <Typography
                variant="h4"
                sx={{ fontWeight: "bold", verticalAlign: "middle" }}
              >
                Citas
              </Typography>
            </Stack>
            {tabIndex === 0 && (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", md: "row" },
                  alignItems: "center",
                  gap: 0.5,
                  width: { xs: "100%", md: "auto" },
                }}
              >
                <SearchBar
                  onSearch={handleSearch}
                  columns={columns}
                  aria-label="Buscar Citas"
                />
              </Box>
            )}
          </Box>

          <Divider sx={{ mb: 2, width: "100%" }} />

          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Tabs
              value={tabIndex}
              onChange={(_, newValue) => setTabIndex(newValue)}
              textColor="inherit"
              indicatorColor="primary"
              sx={{
                mb: 1.5,
                "& .MuiTabs-indicator": {
                  backgroundColor: "var(--color-primary)",
                },
              }}
            >
              <Tab
                label="Consultar"
                sx={{
                  color: "gray",
                  "&.Mui-selected": {
                    color: "var(--color-primary)",
                  },
                }}
              />
              <Tab
                label="Agregar"
                sx={{
                  color: "gray",
                  "&.Mui-selected": {
                    color: "var(--color-primary)",
                  },
                }}
              />
            </Tabs>

            {tabIndex === 0 && (
              <>
                <Grid
                  container
                  spacing={1.5}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "flex-start",
                    textAlign: "center",
                  }}
                  mt={1}
                >
                  {currentAppointments.length > 0 ? (
                    currentAppointments.map((appointment, index) => (
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={4}
                        key={appointment.cita_id}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <Grow in timeout={500 + index * 200}>
                          <Card
                            elevation={6}
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "space-between",
                              borderRadius: 2,
                              m: 1,
                              p: 0,
                              width: "100%",
                              maxWidth: "400px",
                              backgroundColor: "#ffffff",
                              "&:hover": {
                                transform: "scale(1.05)",
                                boxShadow: "0px 6px 20px rgba(0, 0, 0, 0.3)",
                              },
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                backgroundColor: "#f0f0f0",
                                padding: "8px 10px",
                                borderTopLeftRadius: 8,
                                borderTopRightRadius: 8,
                              }}
                            >
                              <Typography
                                variant="subtitle1"
                                sx={{
                                  fontWeight: "bold",
                                }}
                              >
                                {appointment.fecha}
                              </Typography>
                              <Typography
                                variant="subtitle1"
                                sx={{
                                  fontWeight: "bold",
                                }}
                              >
                                {appointment.clinica}
                              </Typography>
                            </Box>

                            <CardContent
                              sx={{
                                display: "flex",
                                flexDirection: "column",
                                backgroundColor: "#ffffff",
                                gap: 0.3,
                                flexGrow: 1,
                              }}
                            >
                              <Typography
                                variant="body2"
                                sx={{
                                  color: "black",
                                  textAlign: "left",
                                }}
                              >
                                Mascota: {appointment.mascota}
                              </Typography>
                              <Typography
                                variant="body2"
                                sx={{
                                  color: "black",
                                  textAlign: "left",
                                }}
                              >
                                Hora: {appointment.hora}
                              </Typography>
                              <Typography
                                variant="body2"
                                sx={{
                                  color: "black",
                                  textAlign: "left",
                                }}
                              >
                                Motivo: {appointment.motivo || "No especificado"}
                              </Typography>
                            </CardContent>

                            <CardActions
                              sx={{
                                display: "flex",
                                flexDirection: { xs: "column", md: "column", lg: "row" },
                                justifyContent: "space-between",
                                backgroundColor: "#ffffff",
                                gap: { xs: 1, lg: 0 },
                              }}
                            >
                              <Tooltip title="Modificar Cita">
                                <Button
                                  variant="outlined"
                                  startIcon={<EditIcon />}
                                  sx={{
                                    borderColor: "#00308F",
                                    color: "#00308F",
                                    textTransform: "none",
                                    width: { xs: "100%", lg: "auto" },
                                  }}
                                  onClick={() => handleEditAppointment(appointment)}
                                  aria-label={`Modificar cita para ${appointment.cliente}`}
                                >
                                  Modificar
                                </Button>
                              </Tooltip>
                              <Tooltip title="Ver más">
                                <Button
                                  variant="outlined"
                                  startIcon={<InfoIcon />}
                                  className="relative right-1"
                                  sx={{
                                    borderColor: "#00308F",
                                    color: "#00308F",
                                    textTransform: "none",
                                    width: { xs: "100%", lg: "auto" },
                                  }}
                                  onClick={() => handleOpenModal(appointment)}
                                  aria-label={`Ver más detalles de la cita para ${appointment.cliente}`}
                                >
                                  Ver más
                                </Button>
                              </Tooltip>
                              <Tooltip title="Eliminar Cita">
                                <Button
                                  variant="contained"
                                  className="relative right-1"
                                  color="error"
                                  startIcon={<DeleteIcon />}
                                  sx={{
                                    textTransform: "none",
                                    width: { xs: "100%", lg: "auto" },
                                  }}
                                  onClick={() =>
                                    handleDeleteAppointment(appointment.cita_id)
                                  }
                                  aria-label={`Eliminar cita para ${appointment.cliente}`}
                                >
                                  Eliminar
                                </Button>
                              </Tooltip>
                            </CardActions>
                          </Card>
                        </Grow>
                      </Grid>
                    ))
                    ) : (
                      <Grid item xs={12}>
                        <Typography
                          variant="body1"
                          align="center"
                          color="textSecondary"
                          sx={{ width: "100%", mt: 2 }}
                        >
                          No se encontraron citas para el criterio de búsqueda
                          especificado.
                        </Typography>
                      </Grid>
                    )}
                  </Grid>

                  <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                    <Pagination
                      count={totalPages}
                      page={currentPage}
                      onChange={handleChangePage}
                      color="primary"
                      sx={{
                        "& .MuiPaginationItem-root": {
                          color: "#00308F !important",
                        },
                        "& .Mui-selected": {
                          backgroundColor: "#00308F !important",
                          color: "#fff !important",
                        },
                        "& .MuiPaginationItem-root:hover": {
                          backgroundColor: "#00246d !important",
                          color: "#fff !important",
                        },
                      }}
                    />
                  </Box>
                </>
              )}

              {tabIndex === 1 && (
                <Box sx={{ width: "100%" }}>
                  <AddCitaPage onSuccess={handleActionSuccess} otherData={otherData} />
                </Box>
              )}
            </Box>
            <Dialog
              open={isModalOpen}
              onClose={handleCloseModal}
              className="border-r-8"
              fullWidth
              maxWidth="sm"
            >
              <Box sx={{ position: 'relative', textAlign: 'center', padding: '16px' }}>
                <Typography
                  variant="h6"
                  component="div"
                  sx={{
                    textAlign: 'center',
                    marginBottom: '16px',
                    fontWeight: 'bold',
                    color: '#333',
                    borderBottom: '1px solid #ddd',
                    paddingBottom: '10px',
                    display: 'inline-block',
                    position: 'relative',
                  }}
                >
                  Detalles de la Cita
                </Typography>

                <IconButton
                  onClick={handleCloseModal}
                  sx={{ position: 'absolute', top: 8, right: 8 }}
                  aria-label="Cerrar"
                >
                  <Close />
                </IconButton>
              </Box>

              <DialogContent>
                {selectedAppointment ? (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {/* Veterinario */}
                    <TextField
                      label="Veterinario"
                      value={selectedAppointment.veterinario || ''}
                      InputProps={{
                        readOnly: true,
                      }}
                      variant="outlined"
                      fullWidth
                    />

                    {/* Mascota */}
                    <TextField
                      label="Mascota"
                      value={selectedAppointment.mascota || ''}
                      InputProps={{
                        readOnly: true,
                      }}
                      variant="outlined"
                      fullWidth
                    />

                    {/* Fecha */}
                    <TextField
                      label="Fecha"
                      value={selectedAppointment.fecha
                        ? new Date(selectedAppointment.fecha).toLocaleDateString()
                        : ''}
                      InputProps={{
                        readOnly: true,
                      }}
                      variant="outlined"
                      fullWidth
                    />

                    {/* Hora */}
                    <TextField
                      label="Hora"
                      value={selectedAppointment.hora || ''}
                      InputProps={{
                        readOnly: true,
                      }}
                      variant="outlined"
                      fullWidth
                    />

                    {/* Clínica */}
                    <TextField
                      label="Clínica"
                      value={selectedAppointment.clinica || ''}
                      InputProps={{
                        readOnly: true,
                      }}
                      variant="outlined"
                      fullWidth
                    />

                    {/* Motivo */}
                    <TextField
                      label="Motivo"
                      value={selectedAppointment.motivo || 'No especificado'}
                      InputProps={{
                        readOnly: true,
                      }}
                      variant="outlined"
                      fullWidth
                    />

                    {/* Servicios */}
                    <TextField
                      label="Servicios"
                      value={
                        Array.isArray(selectedAppointment.services) &&
                          selectedAppointment.services.length > 0
                          ? selectedAppointment.services.map((service) => service.nombre).join(', ')
                          : 'N/A'
                      }
                      InputProps={{
                        readOnly: true,
                      }}
                      variant="outlined"
                      fullWidth
                    />
                  </Box>
                ) : (
                  <Typography variant="body1" align="center">
                    No se encontraron detalles para esta cita.
                  </Typography>
                )}
              </DialogContent>
            </Dialog>
            {isEditModalOpen && selectedAppointment && (
            <ModifyCitaModal
              open={isEditModalOpen}
              selectedItem={selectedAppointment}
              onSuccess={(message, type) => {
                handleActionSuccess(message, type);
                setIsEditModalOpen(false);
              }}
              handleClose={handleCloseEditModal}
              otherData={otherData}
            />
          )}
        </>
      )}
    </Box>
  );
};

export default ConsultMyAppoints;
