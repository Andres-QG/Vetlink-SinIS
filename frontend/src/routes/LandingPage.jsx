import React from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useNavigate } from "react-router-dom";

import vetlinkTextIconLogo from "../assets/icons/vetlink-full-logo.png";
import vetlinkFaceLogo from "../assets/icons/vetlink-logo-face.png";
import heroImage from "../assets/img/hero_dog.jpg";
import feature1 from "../assets/img/feature1.jpg";
import feature2 from "../assets/img/feature2.jpg";
import feature3 from "../assets/img/feature3.jpg";
import whoAreWe from "../assets/img/who_are_we.jpg";

function LandingPage() {
  const navigate = useNavigate();

  const faqs = [
    {
      title: "¿Qué información se almacena sobre mi mascota en este sistema?",
      content:
        "Se almacena información básica de tu mascota, como su nombre, especie, raza, edad, sexo, peso, padecimientos y vacunaciones. Esto ayuda a los veterinarios a ofrecer un mejor servicio y atención médica.",
    },
    {
      title: "¿Puedo acceder al historial médico de mi mascota?",
      content:
        "Actualmente, el sistema está diseñado para ser usado por veterinarios y administradores de la clínica. Si deseas acceder al historial médico de tu mascota, puedes solicitarlo directamente a tu clínica veterinaria, que podrá proporcionarte la información.",
    },
    {
      title: "¿Cómo protege el sistema mi información y la de mi mascota?",
      content:
        "La seguridad de la información es una prioridad. Todos los datos personales y médicos se almacenan de forma segura, cumpliendo con los estándares de protección de datos.",
    },
    {
      title: "¿Puedo actualizar los datos de mi mascota en el sistema?",
      content:
        "Para actualizar los datos de tu mascota, puedes comunicarte con tu clínica veterinaria. Ellos podrán realizar las modificaciones necesarias en el sistema.",
    },
    {
      title: "¿Este sistema permite teleconsultas o consultas en línea?",
      content:
        "De momento, el sistema está diseñado para gestionar la información interna de la clínica, por lo que no se ofrecen consultas en línea.",
    },
    {
      title: "¿Qué sucede si cambio de clínica veterinaria?",
      content:
        "Si decides cambiar de clínica, puedes solicitar que te proporcionen una copia del historial médico de tu mascota para que lo lleves a tu nueva veterinaria. Sin embargo si el cambio de clínica es dentro alguna de nuestras clínicas entonces el cambio se hará de forma automática al solicitar el cambio.",
    },
  ];

  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <Box component="main" flexGrow={1}>
        {/* Sección Hero */}
        <Box
          position="relative"
          display="flex"
          alignItems="center"
          width="100%"
          minHeight="60vh"
          sx={{
            backgroundImage: `url(${heroImage})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center calc(30%)",
            color: "white",
            fontFamily: "Montserrat",
            marginTop: 0,
            paddingTop: 0,
          }}
        >
          <Container
            maxWidth="lg"
            sx={{ position: "relative", zIndex: 10, py: 4 }}
          >
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} lg={6}>
                <Box textAlign={{ xs: "center", lg: "left" }}>
                  <Box mb={8}>
                    <img
                      src={vetlinkTextIconLogo}
                      alt="Vetlink Logo"
                      style={{
                        width: "100%",
                        maxWidth: 700,
                        height: "auto",
                        marginLeft: "auto",
                        marginRight: "auto",
                      }}
                    />
                  </Box>
                  <Typography
                    variant="h1"
                    component="h1"
                    sx={{
                      mb: 2,
                      fontWeight: "bold",
                      color: "bgsecondary",
                      fontSize: { xs: "2rem", lg: "4rem", xl: "5rem" },
                    }}
                  >
                    Cuida a tu mascota sin complicaciones
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{
                      mb: 4,
                      color: "bgsecondary",
                      fontSize: { xs: "1rem", lg: "1.5rem", xl: "2rem" },
                    }}
                  >
                    Regístrate y mantén todo bajo control desde nuestra
                    plataforma.
                  </Typography>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => navigate("/signup")}
                    sx={{
                      bgcolor: "#0ba6a9",
                      color: "#ffffff",
                      "&:hover": {
                        bgcolor: "#0049db",
                        transform: "scale(1.05)",
                        transition:
                          "transform 0.3s ease-in-out, bgcolor 0.3s ease-in-out, color 0.3s ease-in-out",
                      },
                      px: { xs: 4, lg: 8 },
                      py: { xs: 1, lg: 2 },
                      fontSize: { xs: "1rem", lg: "1.5rem" },
                    }}
                  >
                    Regístrate ahora
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Container>
        </Box>
        {/* Sección de características principales */}
        <Box sx={{ fontFamily: "Montserrat", py: 4 }}>
          <Typography
            variant="h2"
            component="h2"
            align="center"
            sx={{ mt: 4, mb: 1, fontWeight: "bold", color: "secondary" }}
          >
            Facilitamos el cuidado de tu mascota
          </Typography>
          <Container maxWidth="lg" sx={{ py: 4 }}>
            <Grid container spacing={4}>
              {/* Característica 1 */}
              <Grid item xs={12} md={4}>
                <Box
                  p={4}
                  sx={{
                    backgroundColor: "#F8F8F8",
                    borderRadius: 2,
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <Box display="flex" justifyContent="center" mb={4}>
                    <img
                      src={feature1}
                      alt="Perro con collar isabelino"
                      style={{
                        width: 256,
                        height: 256,
                        borderRadius: "50%",
                      }}
                    />
                  </Box>
                  <Typography
                    variant="h5"
                    component="h3"
                    align="center"
                    sx={{ color: "#0ba6a9", fontWeight: "bold", mb: 2 }}
                  >
                    Gestiona medicamentos y citas de tu mascota
                  </Typography>
                  <Typography variant="body1" align="center">
                    Mantén un control preciso sobre los medicamentos de tu
                    mascota y las próximas citas veterinarias. Visualiza
                    fácilmente sus tratamientos actuales y asegúrate de que no
                    falte a ninguna consulta importante.
                  </Typography>
                </Box>
              </Grid>
              {/* Característica 2 */}
              <Grid item xs={12} md={4}>
                <Box
                  p={4}
                  sx={{
                    backgroundColor: "#F8F8F8",
                    borderRadius: 2,
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <Box display="flex" justifyContent="center" mb={4}>
                    <img
                      src={feature2}
                      alt="Radiografía de un perro"
                      style={{
                        width: 256,
                        height: 256,
                        borderRadius: "50%",
                      }}
                    />
                  </Box>
                  <Typography
                    variant="h5"
                    component="h3"
                    align="center"
                    sx={{ color: "#0ba6a9", fontWeight: "bold", mb: 2 }}
                  >
                    Accede al historial médico de tu mascota en línea
                  </Typography>
                  <Typography variant="body1" align="center">
                    Consulta el historial de salud de tu mascota de forma rápida
                    y segura. Revisa diagnósticos, vacunas y tratamientos desde
                    cualquier dispositivo, todo en un solo lugar.
                  </Typography>
                </Box>
              </Grid>
              {/* Característica 3 */}
              <Grid item xs={12} md={4}>
                <Box
                  p={4}
                  sx={{
                    backgroundColor: "#F8F8F8",
                    borderRadius: 2,
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <Box display="flex" justifyContent="center" mb={4}>
                    <img
                      src={feature3}
                      alt="Gato en el veterinario"
                      style={{
                        width: 256,
                        height: 256,
                        borderRadius: "50%",
                      }}
                    />
                  </Box>
                  <Typography
                    variant="h5"
                    component="h3"
                    align="center"
                    sx={{ color: "#0ba6a9", fontWeight: "bold", mb: 2 }}
                  >
                    Agenda citas veterinarias en línea
                  </Typography>
                  <Typography variant="body1" align="center">
                    Programa las visitas de tu mascota con nuestro sistema de
                    citas en línea. Elige la fecha y hora que mejor se ajusten a
                    tu agenda, sin complicaciones ni llamadas telefónicas.
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Container>
        </Box>
        {/* Sección "Quiénes somos" */}
        <Box sx={{ mt: 8 }}>
          <Container maxWidth="lg">
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Box
                  p={4}
                  sx={{
                    backgroundColor: "#0ba6a9",
                    borderRadius: 2,
                    color: "white",
                  }}
                >
                  <Box
                    display="flex"
                    alignItems="center"
                    mb={4}
                    sx={{
                      maxWidth: "100%", // Limita el ancho total del contenedor
                      overflow: "hidden", // Evita desbordamiento
                    }}
                  >
                    <Typography
                      variant="h2"
                      component="h2"
                      sx={{
                        color: "bgsecondary",
                        fontWeight: "bold",
                        flexGrow: 1,
                        fontSize: {
                          xs: "1.5rem", // Tamaño adecuado en pantallas pequeñas
                          sm: "2rem",
                          md: "2.5rem",
                          lg: "3rem", // Grande en pantallas grandes
                        },
                        textAlign: { xs: "center", md: "left" },
                      }}
                    >
                      ¿Quiénes somos?
                    </Typography>
                    <img
                      src={vetlinkFaceLogo}
                      alt="Logo Vetlink"
                      style={{
                        width: "auto", // Para que mantenga la proporción
                        maxWidth: 80, // Limita el ancho máximo del logo
                        height: 48, // Fija la altura deseada
                        flexShrink: 0, // Evita que el logo crezca más allá del contenedor
                        marginLeft: 8, // Espacio entre el texto y el logo
                      }}
                    />
                  </Box>

                  <Typography
                    variant="h6"
                    component="p"
                    sx={{
                      color: "bgsecondary",
                      fontSize: "1.25rem",
                      fontWeight: "regular",
                    }}
                  >
                    Somos una plataforma diseñada para optimizar la gestión de
                    nuestras clínicas veterinarias, conectando a veterinarios y
                    dueños de mascotas de manera eficiente. Nuestro objetivo es
                    mejorar la operación diaria y facilitar la comunicación,
                    brindando un servicio más ágil y centrado en el bienestar
                    animal. Vetlink se adapta al crecimiento de nuestra red de
                    clínicas, asegurando una atención de calidad en cada una de
                    ellas.
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box
                  sx={{
                    height: "100%",
                    backgroundImage: `url(${whoAreWe})`,
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    borderRadius: 2,
                  }}
                ></Box>
              </Grid>
            </Grid>
          </Container>
        </Box>
        {/* Sección de preguntas frecuentes */}
        <Box
          sx={{
            fontFamily: "Montserrat",
            px: { xs: 2, lg: 6 },
            mt: 10,
            mb: 4,
          }}
        >
          <Typography
            variant="h2"
            component="h2"
            align="center"
            sx={{ mb: 4, fontWeight: "bold", color: "secondary" }}
          >
            Preguntas Frecuentes
          </Typography>
          <Container maxWidth="lg">
            {faqs.map((faq) => (
              <Accordion key={faq.title}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls={`panel-${faq.title}-content`}
                  id={`panel-${faq.title}-header`}
                >
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    {faq.title}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>{faq.content}</Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Container>
        </Box>
      </Box>
    </Box>
  );
}

export default LandingPage;
