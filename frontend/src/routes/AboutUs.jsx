import React from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
} from "@mui/material";

function AboutUs() {
  const values = [
    {
      title: "Innovación",
      description:
        "Buscamos constantemente nuevas formas de mejorar la atención veterinaria.",
    },
    {
      title: "Compromiso",
      description:
        "Nos dedicamos al bienestar de las mascotas y la satisfacción de sus dueños.",
    },
    {
      title: "Excelencia",
      description:
        "Nos esforzamos por ofrecer el mejor servicio en cada interacción.",
    },
  ];

  return (
    <Box component="main" sx={{ flexGrow: 1, py: 8 }}>
      <Container maxWidth="lg">
        {/* Header */}

        <Typography
          variant="h2"
          component="h1"
          gutterBottom
          color="#0ba6a9"
          fontWeight="bold"
        >
          Sobre Nosotros
        </Typography>

        {/* Main Content */}
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography
              variant="h4"
              component="h2"
              gutterBottom
              color="dark gray"
              fontWeight="bold"
            >
              Nuestra Historia y Misión
            </Typography>
            <Typography variant="body1" paragraph>
              Vetlink nació de la pasión por el cuidado animal y la tecnología.
              Fundada por un equipo de veterinarios y desarrolladores de
              software, nuestra misión es revolucionar la gestión de clínicas
              veterinarias, mejorando la eficiencia y la calidad de atención.
            </Typography>
            <Typography variant="body1" paragraph>
              Desde nuestro inicio, hemos crecido para servir a múltiples
              clínicas, manteniendo siempre nuestro compromiso con la excelencia
              y la innovación en el cuidado de las mascotas.
            </Typography>
            <Typography variant="body1">
              En Vetlink, nos dedicamos a empoderar a las clínicas veterinarias
              con herramientas tecnológicas avanzadas. Nuestro objetivo es
              simplificar la gestión diaria, mejorar la comunicación entre
              veterinarios y dueños de mascotas, y primordialmente, elevar el
              estándar de cuidado animal.
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box
              component="img"
              src="https://images.pexels.com/photos/22504402/pexels-photo-22504402/free-photo-of-a-woman-petting-her-dog-held-by-the-vet.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
              alt="Dueña acariciando a su mascota durante una visita veterinaria"
              sx={{
                width: "100%",
                height: "auto",
                borderRadius: 2,
                boxShadow: 3,
              }}
            />
          </Grid>
        </Grid>

        {/* Our Values */}
        <Box my={8}>
          <Typography
            variant="h4"
            component="h2"
            gutterBottom
            color="dark gray"
            fontWeight="bold"
            textAlign="center"
          >
            Nuestros Valores
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            {values.map((value, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography
                      gutterBottom
                      variant="h5"
                      component="h3"
                      fontWeight="bold"
                    >
                      {value.title}
                    </Typography>
                    <Typography>{value.description}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Join Us */}
        <Box textAlign="center">
          <Typography
            variant="h4"
            component="h2"
            gutterBottom
            color="dark gray"
            fontWeight="bold"
          >
            Únete a Nosotros
          </Typography>
          <Typography variant="body1" paragraph>
            Estamos siempre buscando profesionales apasionados por la tecnología
            y el cuidado animal. Si compartes nuestra visión y quieres ser parte
            de una empresa innovadora en el sector veterinario, ¡nos encantaría
            conocerte!
          </Typography>
          <Typography variant="body1">
            Explora nuestras oportunidades de carrera y únete a un equipo
            dedicado a hacer una diferencia en la vida de las mascotas y sus
            dueños.
          </Typography>
        </Box>
      </Container>
      <Typography
        variant="body1"
        paragraph
        color="gray"
        textAlign="center"
        mt={4}
      >
        Puedes contactarnos en{" "}
        <a href="mailto:help@vetlink.com">help@vetlink.com</a> para más
        información.
      </Typography>
    </Box>
  );
}

export default AboutUs;
