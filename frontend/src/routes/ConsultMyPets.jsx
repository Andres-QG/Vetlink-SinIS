import { useEffect, useState } from "react";
import axios from "axios";
import {
  Grid2,
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
import SearchBar from "../components/Consult/GeneralizedSearchBar";
import AddMyPets from "../components/ConsultMyPets/AddMyPets";
import { useNotification } from "../components/Notification";

import dogImage from "../assets/img/pets/dogs/corgi.png";
import catImage from "../assets/img/pets/cats/smile.png";
import defaultPetImage from "../assets/img/pets/general/question.png";

const ConsultMyPets = () => {
  const [pets, setPets] = useState([]);
  const [filteredPets, setFilteredPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const petsPerPage = 8;
  const showNotification = useNotification();

  useEffect(() => {
    fetchMyPets();
  }, []);

  const fetchMyPets = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:8000/api/consult-my-pets/",
        {
          withCredentials: true,
        }
      );
      const petsData = response.data.results || [];
      setPets(petsData);
      setFilteredPets(petsData);
    } catch (error) {
      console.error("Error fetching pets:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (searchTerm, filterColumn, order) => {
    let resultsToSort = searchTerm
      ? pets.filter((pet) => {
          const value = pet[filterColumn]?.toString().toLowerCase() || "";
          return value.includes(searchTerm.toLowerCase());
        })
      : [...pets];

    const sortedResults = resultsToSort.sort((a, b) => {
      if (a[filterColumn] < b[filterColumn]) return order === "asc" ? -1 : 1;
      if (a[filterColumn] > b[filterColumn]) return order === "asc" ? 1 : -1;
      return 0;
    });

    setFilteredPets(sortedResults);
  };

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleAddPetSuccess = (message, type) => {
    showNotification(message, type);
    if (type === "success") {
      fetchMyPets(); // Refrescar la lista de mascotas después de agregar una nueva
      handleCloseModal();
    }
  };

  const columns = ["NOMBRE", "ESPECIE", "RAZA", "FECHA_NACIMIENTO", "SEXO"];

  const getSpeciesImage = (species) => {
    return species.toLowerCase() === "perro"
      ? dogImage
      : species.toLowerCase() === "gato"
        ? catImage
        : defaultPetImage;
  };

  const getCardBackgroundColor = (species) => {
    return species.toLowerCase() === "perro"
      ? "rgba(255, 165, 0, 0.1)"
      : species.toLowerCase() === "gato"
        ? "rgba(0, 123, 255, 0.1)"
        : "rgba(128, 128, 128, 0.1)";
  };

  const handleChangePage = (event, value) => {
    setCurrentPage(value);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const indexOfLastPet = currentPage * petsPerPage;
  const indexOfFirstPet = indexOfLastPet - petsPerPage;
  const currentPets = filteredPets.slice(indexOfFirstPet, indexOfLastPet);
  const totalPages = Math.ceil(filteredPets.length / petsPerPage);

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
              <PetsIcon
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
                Mis Mascotas
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
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleOpenModal}
                sx={{
                  textTransform: "none",
                  minWidth: { xs: "100%", md: "180px" },
                  maxWidth: { md: "190px" },
                  backgroundColor: "#00308F",
                }}
              >
                Agregar Mascota
              </Button>
              <SearchBar onSearch={handleSearch} columns={columns} />
            </Box>
          </Box>
          <Divider sx={{ mb: 4 }} />

          <Grid2
            container
            spacing={3}
            sx={{
              justifyContent: { xs: "center", md: "center" },
            }}
          >
            {currentPets.length > 0 ? (
              currentPets.map((pet, index) => (
                <Grid2 item xs={12} sm={6} md={4} lg={3} key={pet.MASCOTA_ID}>
                  <Grow in timeout={500 + index * 200}>
                    <Card
                      elevation={6}
                      sx={{
                        transition: "transform 0.3s, box-shadow 0.3s",
                        display: "flex",
                        flexDirection: "column",
                        height: "100%",
                        width: "100%",
                        boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.15)",
                        "&:hover": {
                          transform: "scale(1.05)",
                          boxShadow: "0px 6px 20px rgba(0, 0, 0, 0.3)",
                        },
                      }}
                    >
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
                            minWidth: { xs: "auto", md: "360px" },
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
                          <Stack
                            direction="row"
                            alignItems="center"
                            spacing={1}
                          >
                            <GenderIcon color="action" />
                            <Typography variant="body2" color="text.secondary">
                              <strong>Sexo:</strong>{" "}
                              {pet.SEXO === "M" ? "Macho" : "Hembra"}
                            </Typography>
                          </Stack>
                        )}
                      </CardContent>
                      <CardActions sx={{ justifyContent: "center" }}>
                        <Tooltip
                          title="Editar Mascota"
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
                          title="Eliminar Mascota"
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
                No se encontraron mascotas para el criterio de búsqueda
                especificado.
              </Typography>
            )}
          </Grid2>

          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={handleChangePage}
              color="primary"
            />
          </Box>

          {/* Modal para agregar mascota */}
          <AddMyPets
            open={modalOpen}
            handleClose={handleCloseModal}
            onSuccess={handleAddPetSuccess}
          />
        </>
      )}
    </Box>
  );
};

export default ConsultMyPets;
