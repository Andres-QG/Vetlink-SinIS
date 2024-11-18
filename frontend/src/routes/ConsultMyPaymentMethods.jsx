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
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Payment as PaymentIcon,
} from "@mui/icons-material";
import SearchBar from "../components/Consult/GeneralizedSearchBar";
import AddPaymentMethod from "../components/ConsultMyPaymentMethods/AddPaymentMethod";
import { useNotification } from "../components/Notification";
import Grid2 from "@mui/material/Grid2";

const ConsultMyPaymentMethods = () => {
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [filteredPaymentMethods, setFilteredPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [modalState, setModalState] = useState({
    open: false,
    type: "",
    paymentMethod: null,
  });
  const [tabIndex, setTabIndex] = useState(0);
  const paymentMethodsPerPage = 8;
  const showNotification = useNotification();

  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  const fetchPaymentMethods = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:8000/api/consult-my-payment-methods/",
        {
          withCredentials: true,
        }
      );
      const paymentMethodsData = response.data.results || [];
      setPaymentMethods(paymentMethodsData);
      setFilteredPaymentMethods(paymentMethodsData);
    } catch (error) {
      console.error("Error fetching payment methods:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (searchTerm, filterColumn, order) => {
    const resultsToSort = searchTerm
      ? paymentMethods.filter((method) =>
          method[filterColumn]
            ?.toString()
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
        )
      : [...paymentMethods];

    setFilteredPaymentMethods(
      resultsToSort.sort((a, b) => {
        if (a[filterColumn] < b[filterColumn]) return order === "asc" ? -1 : 1;
        if (a[filterColumn] > b[filterColumn]) return order === "asc" ? 1 : -1;
        return 0;
      })
    );
  };

  const handleChangePage = (event, value) => {
    setCurrentPage(value);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleActionSuccess = (message, type) => {
    showNotification(message, type);
    if (type === "success") {
      fetchPaymentMethods();
    }
  };

  const columns = ["TIPO_PAGO", "NOMBRE_TITULAR", "NUMERO_TARJETA", "PAIS"];

  const indexOfLastMethod = currentPage * paymentMethodsPerPage;
  const indexOfFirstMethod = indexOfLastMethod - paymentMethodsPerPage;
  const currentPaymentMethods = filteredPaymentMethods.slice(
    indexOfFirstMethod,
    indexOfLastMethod
  );
  const totalPages = Math.ceil(
    filteredPaymentMethods.length / paymentMethodsPerPage
  );

  return (
    <Box sx={{ flexGrow: 1, p: { xs: 2, md: 3 } }}>
      {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="70vh"
        >
          <CircularProgress color="primary" size={60} />
        </Box>
      ) : (
        <>
          {/* Encabezado */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              justifyContent: "space-between",
              alignItems: "center",
              mb: 4,
              gap: 2,
            }}
          >
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              sx={{ mb: { xs: 2, sm: 0 } }}
            >
              <PaymentIcon
                sx={{
                  fontSize: 40,
                  color: "primary.main",
                  verticalAlign: "middle",
                }}
              />
              <Typography
                variant="h4"
                sx={{ fontWeight: "bold", verticalAlign: "middle" }}
              >
                Métodos de Pago
              </Typography>
            </Stack>
            {tabIndex === 0 && (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", md: "row" },
                  alignItems: "center",
                  gap: 2,
                  width: { xs: "100%", md: "auto" },
                }}
              >
                <SearchBar
                  onSearch={handleSearch}
                  columns={columns}
                  aria-label="Buscar Métodos de Pago"
                />
              </Box>
            )}
          </Box>

          {/* Separador */}
          <Divider sx={{ mb: 4 }} />

          {/* Contenido principal */}
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            {/* Pestañas */}
            <Tabs
              value={tabIndex}
              onChange={(_, newValue) => setTabIndex(newValue)}
              sx={{ mb: 0 }}
              textColor="primary"
              indicatorColor="primary"
            >
              <Tab label="Consultar" />
              <Tab label="Agregar" />
            </Tabs>

            {tabIndex === 0 && (
              <>
                <Grid2
                  container
                  spacing={3}
                  sx={{
                    justifyContent: { xs: "center", md: "center" },
                  }}
                >
                  {currentPaymentMethods.length > 0 ? (
                    currentPaymentMethods.map((method, index) => (
                      <Grid2
                        item
                        xs={12}
                        sm={6}
                        md={4}
                        lg={3}
                        key={method.METODO_PAGO_ID}
                      >
                        <Grow in timeout={500 + index * 200}>
                          <Card
                            elevation={6}
                            sx={{
                              transition: "transform 0.3s, box-shadow 0.3s",
                              display: "flex",
                              flexDirection: "column",
                              height: "100%",
                              width: "300px",
                              boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.15)",
                              "&:hover": {
                                transform: "scale(1.05)",
                                boxShadow: "0px 6px 20px rgba(0, 0, 0, 0.3)",
                              },
                            }}
                          >
                            <CardContent sx={{ flexGrow: 1 }}>
                              <Typography
                                gutterBottom
                                variant="h5"
                                component="div"
                                sx={{ textAlign: "center" }}
                              >
                                {method.TIPO_PAGO}
                              </Typography>
                              <Stack
                                direction="column"
                                spacing={1}
                                sx={{ mt: 2 }}
                              >
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  <strong>Nombre del Titular:</strong>{" "}
                                  {method.NOMBRE_TITULAR}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  <strong>Número de Tarjeta:</strong> **** ****
                                  **** {method.NUMERO_TARJETA.slice(-4)}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  <strong>Fecha de Expiración:</strong>{" "}
                                  {new Date(
                                    method.FECHA_EXPIRACION
                                  ).toLocaleDateString()}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  <strong>País:</strong> {method.PAIS}
                                </Typography>
                              </Stack>
                            </CardContent>
                            <CardActions sx={{ justifyContent: "center" }}>
                              <Tooltip
                                title="Editar Método de Pago"
                                TransitionComponent={Grow}
                              >
                                <Button
                                  size="small"
                                  color="primary"
                                  startIcon={<EditIcon />}
                                  sx={{ textTransform: "none", mr: 1 }}
                                >
                                  Editar
                                </Button>
                              </Tooltip>
                              <Tooltip
                                title="Eliminar Método de Pago"
                                TransitionComponent={Grow}
                              >
                                <Button
                                  size="small"
                                  color="error"
                                  startIcon={<DeleteIcon />}
                                  sx={{ textTransform: "none" }}
                                >
                                  Eliminar
                                </Button>
                              </Tooltip>
                            </CardActions>
                          </Card>
                        </Grow>
                      </Grid2>
                    ))
                  ) : (
                    <Typography
                      variant="body1"
                      align="center"
                      color="textSecondary"
                      sx={{ width: "100%", mt: 4 }}
                    >
                      No se encontraron métodos de pago para el criterio de
                      búsqueda especificado.
                    </Typography>
                  )}
                </Grid2>

                {/* Paginación centrada */}
                <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                  <Pagination
                    count={totalPages}
                    page={currentPage}
                    onChange={handleChangePage}
                    color="primary"
                  />
                </Box>
              </>
            )}

            {tabIndex === 1 && (
              <Box sx={{ width: "100%" }}>
                <AddPaymentMethod onSuccess={handleActionSuccess} />
              </Box>
            )}
          </Box>
        </>
      )}
    </Box>
  );
};

export default ConsultMyPaymentMethods;
