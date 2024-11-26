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
  Grid,
  Chip,
} from "@mui/material";
import {
  Receipt as ReceiptIcon,
  Download as DownloadIcon,
} from "@mui/icons-material";
import SearchBar from "../components/Consult/GeneralizedSearchBar";
import { useNotification } from "../components/Notification";
import visaIcon from "../assets/img/payments/visa.png";
import mastercardIcon from "../assets/img/payments/MasterCard.png";
import americanExpressIcon from "../assets/img/payments/american-express.png";
import paypalIcon from "../assets/img/payments/paypal.png";
import efectivoIcon from "../assets/img/payments/efectivo.png";
import cardUndefinedIcon from "../assets/img/payments/desconocida.png";
import getInvoiceTemplate from "../templates/invoiceTemplate";
import pdfMake from "pdfmake";

const cardIcons = {
  VISA: visaIcon,
  MASTERCARD: mastercardIcon,
  AMERICAN_EXPRESS: americanExpressIcon,
  PAYPAL: paypalIcon,
  EFECTIVO: efectivoIcon,
};

const ConsultMyPaymentHistory = () => {
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const showNotification = useNotification();

  useEffect(() => {
    fetchPaymentHistory();
  }, []);

  const fetchPaymentHistory = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:8000/api/consult-payment-history-client/",
        { withCredentials: true }
      );
      const data = response.data.results || [];
      setPaymentHistory(data);
      setFilteredHistory(data);
    } catch (error) {
      console.error("Error fetching payment history:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (searchTerm, filterColumn, order = "asc") => {
    if (!filterColumn) {
      setFilteredHistory(paymentHistory);
      return;
    }

    const filtered = searchTerm
      ? paymentHistory.filter((record) =>
          record[filterColumn]
            ?.toString()
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
        )
      : [...paymentHistory];

    const sorted = filtered.sort((a, b) => {
      const valA = a[filterColumn] ?? "";
      const valB = b[filterColumn] ?? "";

      if (order === "asc") {
        return valA > valB ? 1 : valA < valB ? -1 : 0;
      } else {
        return valA < valB ? 1 : valA > valB ? -1 : 0;
      }
    });

    setFilteredHistory(sorted);
  };

  const logoBase64 =
    "data:image/png;base64,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";

  const handleDownloadInvoice = (payment) => {
    if (!payment) {
      console.error("No hay datos disponibles para generar la factura.");
      return;
    }

    try {
      const docDefinition = getInvoiceTemplate(payment, logoBase64);
      pdfMake
        .createPdf(docDefinition)
        .download(`Factura_${payment.factura_id}.pdf`);
    } catch (error) {
      console.error("Error al generar la factura:", error);
    }
  };

  const handleChangePage = (event, value) => {
    setCurrentPage(value);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getCardIcon = (brand) =>
    cardIcons[brand?.toUpperCase()] || cardUndefinedIcon;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredHistory.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredHistory.length / itemsPerPage);

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
              <ReceiptIcon
                sx={{
                  fontSize: 40,
                  color: "#00308f",
                  verticalAlign: "middle",
                }}
              />
              <Typography
                variant="h4"
                sx={{ fontWeight: "bold", verticalAlign: "middle" }}
              >
                Historial de Pagos
              </Typography>
            </Stack>
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
                columns={[
                  "marca_tarjeta",
                  "tipo_pago",
                  "monto_total",
                  "fecha",
                  "detalle",
                  "estado",
                  "ultimos_4_digitos",
                ]}
                aria-label="Buscar en el historial de pagos"
              />
            </Box>
          </Box>
          <Divider sx={{ mb: 4 }} />

          <Grid container spacing={3} justifyContent="center">
            {currentItems.length > 0 ? (
              currentItems.map((payment, index) => (
                <Grid item xs={12} sm={6} md={4} key={payment.factura_id}>
                  <Grow in timeout={500 + index * 200}>
                    <Card
                      elevation={6}
                      sx={{
                        borderRadius: 2,
                        p: 0,
                        width: "100%",
                        maxWidth: "400px",
                        minWidth: "280px",
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
                          justifyContent: "space-between",
                          alignItems: "center",
                          backgroundColor: "#f0f0f0",
                          padding: "10px 16px",
                          borderTopLeftRadius: 8,
                          borderTopRightRadius: 8,
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            <Box
                              component="img"
                              src={getCardIcon(payment.marca_tarjeta)}
                              alt={payment.marca_tarjeta}
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
                              {payment.tipo_pago === "Efectivo"
                                ? payment.tipo_pago
                                : `Tarjeta de ${payment.tipo_pago}`}
                            </Typography>
                          </Box>
                        </Box>
                        <Chip
                          label={payment.estado}
                          size="small"
                          sx={{
                            backgroundColor:
                              payment.estado === "Exitoso"
                                ? "#b8e6d7"
                                : payment.estado === "Pendiente"
                                  ? "#ffe4b3"
                                  : "#ff7c7d",
                            color: "black",
                          }}
                        />
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
                        {/* Primera fila: Monto y últimos 4 dígitos */}
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <Typography
                            variant="body1"
                            sx={{
                              fontWeight: "bold",
                              color: "black",
                            }}
                          >
                            {payment.monto_total}
                          </Typography>
                          <Typography
                            variant="body1"
                            sx={{
                              fontWeight: "bold",
                              color: "black",
                            }}
                          >
                            •••• {payment.ultimos_4_digitos}
                          </Typography>
                        </Box>

                        {/* Segunda fila: Fecha */}
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{
                              color: "gray",
                              textAlign: "left",
                            }}
                          >
                            {payment.fecha}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              color: "gray",
                            }}
                          >
                            {payment.clinica_nombre}
                          </Typography>
                        </Box>

                        {/* Tercera fila: Detalle */}
                        <Typography
                          variant="body2"
                          sx={{
                            color: "gray",
                            textAlign: "left",
                            mt: 0,
                          }}
                        >
                          {payment.detalle || "Sin detalles disponibles"}
                        </Typography>
                      </CardContent>

                      {/* Actions */}
                      <CardActions
                        sx={{
                          display: "flex",
                          justifyContent: "flex-end",
                          padding: "8px 16px",
                          backgroundColor: "#ffffff",
                        }}
                      >
                        <Button
                          variant="outlined"
                          startIcon={<DownloadIcon />}
                          sx={{
                            borderColor: "#00308f",
                            color: "#00308f",
                            textTransform: "none",
                          }}
                          onClick={() => handleDownloadInvoice(payment)}
                        >
                          Descargar Factura
                        </Button>
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
                No se encontraron pagos en el historial.
              </Typography>
            )}
          </Grid>

          {/* Pagination */}
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={handleChangePage}
              sx={{
                "& .MuiPaginationItem-root": {
                  color: "#00308F !important", // Asegura el color del texto
                },
                "& .Mui-selected": {
                  backgroundColor: "#00308F !important", // Asegura el fondo del elemento seleccionado
                  color: "#fff !important", // Asegura el color del texto del seleccionado
                },
                "& .MuiPaginationItem-root:hover": {
                  backgroundColor: "#00246d !important", // Fondo al pasar el cursor
                  color: "#fff !important",
                },
              }}
            />
          </Box>
        </>
      )}
    </Box>
  );
};

export default ConsultMyPaymentHistory;
