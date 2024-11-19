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
  Grid,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Payment as PaymentIcon,
} from "@mui/icons-material";
import SearchBar from "../components/Consult/GeneralizedSearchBar";
import AddPaymentMethod from "../components/ConsultMyPaymentMethods/AddPaymentMethod";
import { useNotification } from "../components/Notification";
import visaIcon from "../assets/img/payments/visa.png";
import mastercardIcon from "../assets/img/payments/MasterCard.png";
import americanExpressIcon from "../assets/img/payments/american-express.png";
import paypalIcon from "../assets/img/payments/paypal.png";
import cardUndefinedIcon from "../assets/img/payments/desconocida.png";

const cardIcons = {
  VISA: visaIcon,
  MASTERCARD: mastercardIcon,
  AMERICAN_EXPRESS: americanExpressIcon,
  PAYPAL: paypalIcon,
};

const ConsultMyPaymentMethods = () => {
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [filteredPaymentMethods, setFilteredPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
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
        "http://localhost:8000/api/consult-payment-methods/",
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
    if (!Array.isArray(paymentMethods)) return; // Validar que paymentMethods es un array
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

  const getCardIcon = (brand) =>
    cardIcons[brand?.toUpperCase()] || cardUndefinedIcon; // Default to cardUndefinedIcon

  const indexOfLastMethod = currentPage * paymentMethodsPerPage;
  const indexOfFirstMethod = indexOfLastMethod - paymentMethodsPerPage;
  const currentPaymentMethods = Array.isArray(filteredPaymentMethods)
    ? filteredPaymentMethods.slice(indexOfFirstMethod, indexOfLastMethod)
    : [];
  const totalPages = Math.ceil(
    (Array.isArray(filteredPaymentMethods)
      ? filteredPaymentMethods.length
      : 0) / paymentMethodsPerPage
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
                  columns={["TIPO_PAGO", "MARCA_TARJETA", "NOMBRE_TITULAR"]}
                  aria-label="Buscar Métodos de Pago"
                />
              </Box>
            )}
          </Box>
          <Divider sx={{ mb: 4 }} />

          <Box sx={{ display: "flex", flexDirection: "column" }}>
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
                <Grid container spacing={3} justifyContent="flex-start" mt={2}>
                  {currentPaymentMethods.length > 0 ? (
                    currentPaymentMethods.map((method, index) => (
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={4}
                        key={method.METODO_PAGO_ID}
                      >
                        <Grow in timeout={500 + index * 200}>
                          <Card
                            elevation={6}
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "space-between",
                              borderRadius: 2,
                              p: 0,
                              width: "100%",
                              maxWidth: "400px",
                              minWidth: "200px",
                              backgroundColor: "#ffffff",
                              "&:hover": {
                                transform: "scale(1.05)",
                                boxShadow: "0px 6px 20px rgba(0, 0, 0, 0.3)",
                              },
                            }}
                          >
                            {/* Header */}
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                backgroundColor: "#f0f0f0",
                                padding: "10px 16px",
                                borderTopLeftRadius: 8,
                                borderTopRightRadius: 8,
                              }}
                            >
                              <Box
                                component="img"
                                src={getCardIcon(method.MARCA_TARJETA)}
                                alt={method.MARCA_TARJETA}
                                sx={{
                                  width: 40,
                                  height: "auto",
                                  mr: 2,
                                }}
                              />
                              <Typography
                                variant="subtitle1"
                                sx={{
                                  fontWeight: "bold",
                                  color: "black",
                                }}
                              >
                                Tarjeta de {method.TIPO_PAGO}
                              </Typography>
                            </Box>

                            {/* Body */}
                            <CardContent
                              sx={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 1,
                                padding: "16px",
                                backgroundColor: "#ffffff",
                              }}
                            >
                              <Box
                                sx={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                }}
                              >
                                <Typography
                                  variant="body1"
                                  sx={{ fontWeight: "bold", color: "black" }}
                                >
                                  {method.NOMBRE_TITULAR}
                                </Typography>
                                <Typography
                                  variant="body1"
                                  sx={{ fontWeight: "bold", color: "black" }}
                                >
                                  •••• {method.ULTIMOS_4_DIGITOS}
                                </Typography>
                              </Box>
                              <Typography
                                variant="body2"
                                sx={{
                                  color: "gray",
                                  mt: 0.5,
                                }}
                              >
                                Expira: {method.FECHA_EXPIRACION}
                              </Typography>
                            </CardContent>

                            {/* Actions */}
                            <CardActions
                              sx={{
                                display: "flex",
                                justifyContent: "flex-start",
                                padding: "8px 16px",
                                backgroundColor: "#ffffff",
                              }}
                            >
                              <Tooltip title="Modificar Método de Pago">
                                <Button
                                  variant="outlined"
                                  color="primary"
                                  startIcon={<EditIcon />}
                                  sx={{
                                    textTransform: "none",
                                  }}
                                >
                                  Modificar
                                </Button>
                              </Tooltip>
                              <Tooltip title="Eliminar Método de Pago">
                                <Button
                                  variant="contained"
                                  color="error"
                                  startIcon={<DeleteIcon />}
                                  sx={{
                                    textTransform: "none",
                                    ml: 2,
                                  }}
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
                    <Typography
                      variant="body1"
                      align="center"
                      color="textSecondary"
                      sx={{ width: "100%", mt: 4 }}
                    >
                      No se encontraron métodos de pago.
                    </Typography>
                  )}
                </Grid>
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
