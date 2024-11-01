import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  CircularProgress,
  Box,
  CardActions,
  Button,
  Stack,
  Divider,
  Pagination,
  Tooltip,
  Grow,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Pets as PetsIcon,
  Add as AddIcon,
  Info as InfoIcon,
  CalendarToday as CalendarIcon,
  Transgender as GenderIcon,
} from "@mui/icons-material";

// Importación de las imágenes generales
import dogImage from "../assets/img/pets/dogs/corgi.png";
import catImage from "../assets/img/pets/cats/smile.png";
import defaultPetImage from "../assets/img/pets/general/question.png";

const ConsultMyPets = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estado para la paginación
  const [currentPage, setCurrentPage] = useState(1);
  const petsPerPage = 8; // Número de mascotas por página

  useEffect(() => {
    fetchMyPets();
  }, []);

  const fetchMyPets = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/consult-my-pets/",
        {
          withCredentials: true,
        }
      );
      const petsData = response.data.results || [];
      setPets(petsData);
    } catch (error) {
      console.error("Error fetching pets:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="70vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (pets.length === 0) {
    return (
      <Typography variant="h6" align="center" mt={4}>
        No tienes mascotas registradas.
      </Typography>
    );
  }

  // Función para obtener la imagen según la especie
  const getSpeciesImage = (species) => {
    if (species.toLowerCase() === "perro") {
      return dogImage;
    } else if (species.toLowerCase() === "gato") {
      return catImage;
    } else {
      return defaultPetImage; // Imagen por defecto para otras especies
    }
  };

  // Función para obtener el color de fondo basado en la especie
  const getCardBackgroundColor = (species) => {
    switch (species.toLowerCase()) {
      case "perro":
        return "rgba(255, 165, 0, 0.1)"; // Naranja claro semitransparente
      case "gato":
        return "rgba(0, 123, 255, 0.1)"; // Azul claro semitransparente
      default:
        return "rgba(128, 128, 128, 0.1)"; // Gris claro semitransparente
    }
  };

  // Manejar cambio de página
  const handleChangePage = (event, value) => {
    setCurrentPage(value);
    window.scrollTo({ top: 0, behavior: "smooth" }); // Opcional: scroll al inicio al cambiar de página
  };

  // Calcular los índices para la paginación
  const indexOfLastPet = currentPage * petsPerPage;
  const indexOfFirstPet = indexOfLastPet - petsPerPage;
  const currentPets = pets.slice(indexOfFirstPet, indexOfLastPet);
  const totalPages = Math.ceil(pets.length / petsPerPage);

  return (
    <Box sx={{ flexGrow: 1, p: { xs: 2, md: 3 } }}>
      {/* Título y Botón "Agregar Mascota" */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "center" },
          mb: 4,
        }}
      >
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          sx={{ mb: { xs: 2, sm: 0 } }}
        >
          <PetsIcon sx={{ fontSize: 40, color: "primary.main" }} />
          <Typography variant="h4" sx={{ fontWeight: "bold" }}>
            Mis Mascotas
          </Typography>
        </Stack>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          sx={{ textTransform: "none" }}
          // onClick={handleAddPet} // Implementa esta función según tus necesidades
        >
          Agregar Mascota
        </Button>
      </Box>
      <Divider sx={{ mb: 4 }} />
      <Grid container spacing={3}>
        {currentPets.map((pet, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={pet.MASCOTA_ID}>
            <Grow in timeout={500 + index * 200}>
              <Card
                elevation={6}
                sx={{
                  transition: "transform 0.3s",
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                  "&:hover": {
                    transform: "scale(1.02)",
                  },
                }}
              >
                {/* Contenedor de la imagen con fondo */}
                <Box
                  sx={{
                    position: "relative",
                    height: { xs: 180, md: 200 },
                    backgroundColor: getCardBackgroundColor(pet.ESPECIE),
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <CardMedia
                    component="img"
                    sx={{
                      height: "100%",
                      width: "auto",
                      objectFit: "contain",
                    }}
                    image={getSpeciesImage(pet.ESPECIE)}
                    alt={pet.NOMBRE}
                  />
                </Box>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography
                    gutterBottom
                    variant="h5"
                    component="div"
                    sx={{ textAlign: "center" }}
                  >
                    {pet.NOMBRE}
                  </Typography>
                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={1}
                    sx={{ mb: 1 }}
                  >
                    <PetsIcon color="action" />
                    <Typography variant="body2" color="text.secondary">
                      <strong>Especie:</strong> {pet.ESPECIE}
                    </Typography>
                  </Stack>
                  {pet.RAZA && (
                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={1}
                      sx={{ mb: 1 }}
                    >
                      <InfoIcon color="action" />
                      <Typography variant="body2" color="text.secondary">
                        <strong>Raza:</strong> {pet.RAZA}
                      </Typography>
                    </Stack>
                  )}
                  {pet.FECHA_NACIMIENTO && (
                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={1}
                      sx={{ mb: 1 }}
                    >
                      <CalendarIcon color="action" />
                      <Typography variant="body2" color="text.secondary">
                        <strong>Fecha de Nacimiento:</strong>{" "}
                        {pet.FECHA_NACIMIENTO}
                      </Typography>
                    </Stack>
                  )}
                  {pet.SEXO && (
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <GenderIcon color="action" />
                      <Typography variant="body2" color="text.secondary">
                        <strong>Sexo:</strong>{" "}
                        {pet.SEXO === "M" ? "Macho" : "Hembra"}
                      </Typography>
                    </Stack>
                  )}
                </CardContent>
                <CardActions sx={{ justifyContent: "center" }}>
                  <Tooltip title="Editar Mascota">
                    <Button
                      size="small"
                      color="primary"
                      startIcon={<EditIcon />}
                      sx={{ textTransform: "none", mr: 1 }}
                      // onClick={() => handleEditPet(pet.MASCOTA_ID)}
                    >
                      Editar
                    </Button>
                  </Tooltip>
                  <Tooltip title="Eliminar Mascota">
                    <Button
                      size="small"
                      color="error"
                      startIcon={<DeleteIcon />}
                      sx={{ textTransform: "none" }}
                      // onClick={() => handleDeletePet(pet.MASCOTA_ID)}
                    >
                      Eliminar
                    </Button>
                  </Tooltip>
                </CardActions>
              </Card>
            </Grow>
          </Grid>
        ))}
      </Grid>
      {/* Paginación */}
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={handleChangePage}
          color="primary"
        />
      </Box>
    </Box>
  );
};

export default ConsultMyPets;
