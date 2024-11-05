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
import ModifyMyPets from "../components/ConsultMyPets/ModifyMyPets";
import DeleteMyPets from "../components/ConsultMyPets/DeleteMyPets";
import { useNotification } from "../components/Notification";

// Imágenes específicas por raza
// Perros
import labradorImage from "../assets/img/pets/dogs/labrador.jpg";
import bulldogImage from "../assets/img/pets/dogs/bulldog.jpg";
import beagleImage from "../assets/img/pets/dogs/beagle.jpg";
import poodleImage from "../assets/img/pets/dogs/poodle.jpg";
import chihuahuaImage from "../assets/img/pets/dogs/chihuahua.jpg";
import pastorAlemanImage from "../assets/img/pets/dogs/pastorAleman.jpg";
// Gatos
import persaImage from "../assets/img/pets/cats/persa.jpg";
import siamesImage from "../assets/img/pets/cats/siames.jpg";
import bengaliImage from "../assets/img/pets/cats/bengali.jpg";
import sphynxImage from "../assets/img/pets/cats/sphynx.jpg";
import maineCoonImage from "../assets/img/pets/cats/maineCoon.jpg";
import angoraImage from "../assets/img/pets/cats/angora.jpg";
import defaultPetImage from "../assets/img/pets/general/question.png";

const breedImages = {
  Perro: {
    Labrador: labradorImage,
    Bulldog: bulldogImage,
    Beagle: beagleImage,
    Poodle: poodleImage,
    Chihuahua: chihuahuaImage,
    "Pastor Alemán": pastorAlemanImage,
  },
  Gato: {
    Persa: persaImage,
    Siamés: siamesImage,
    Bengalí: bengaliImage,
    Sphynx: sphynxImage,
    "Maine Coon": maineCoonImage,
    Angora: angoraImage,
  },
};

const ConsultMyPets = () => {
  const [pets, setPets] = useState([]);
  const [filteredPets, setFilteredPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [modalState, setModalState] = useState({
    open: false,
    type: "",
    pet: null,
  });
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

  const openModal = (type, pet = null) => {
    setModalState({ open: true, type, pet });
  };

  const closeModal = () => {
    setModalState({ open: false, type: "", pet: null });
  };

  const handleActionSuccess = (message, type) => {
    showNotification(message, type);
    if (type === "success") {
      fetchMyPets();
      closeModal();
    }
  };

  const handleSearch = (searchTerm, filterColumn, order) => {
    const resultsToSort = searchTerm
      ? pets.filter((pet) =>
          pet[filterColumn]
            ?.toString()
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
        )
      : [...pets];

    setFilteredPets(
      resultsToSort.sort((a, b) => {
        if (a[filterColumn] < b[filterColumn]) return order === "asc" ? -1 : 1;
        if (a[filterColumn] > b[filterColumn]) return order === "asc" ? 1 : -1;
        return 0;
      })
    );
  };

  const columns = ["NOMBRE", "ESPECIE", "RAZA", "FECHA_NACIMIENTO", "SEXO"];

  const getSpeciesImage = (species, breed) =>
    breedImages[species]?.[breed] || defaultPetImage;

  const getCardBackgroundColor = (species) =>
    species.toLowerCase() === "perro"
      ? "rgba(255, 165, 0, 0.1)"
      : species.toLowerCase() === "gato"
        ? "rgba(0, 123, 255, 0.1)"
        : "rgba(128, 128, 128, 0.1)";

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
                onClick={() => openModal("add")}
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
                        width: "300px", // Ancho fijo para todas las tarjetas
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
                          width: "100%",
                          height: 200,
                          backgroundColor: getCardBackgroundColor(pet.ESPECIE),
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          overflow: "hidden",
                        }}
                      >
                        <CardMedia
                          component="img"
                          sx={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                          image={getSpeciesImage(pet.ESPECIE, pet.RAZA)}
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
                            onClick={() => openModal("edit", pet)}
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
                            onClick={() => openModal("delete", pet)}
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

          {/* Modals */}
          {modalState.type === "add" && (
            <AddMyPets
              open={modalState.open}
              handleClose={closeModal}
              onSuccess={handleActionSuccess}
            />
          )}
          {modalState.type === "edit" && modalState.pet && (
            <ModifyMyPets
              open={modalState.open}
              handleClose={closeModal}
              petData={modalState.pet}
              onSuccess={handleActionSuccess}
            />
          )}
          {modalState.type === "delete" && modalState.pet && (
            <DeleteMyPets
              open={modalState.open}
              handleClose={closeModal}
              petData={modalState.pet}
              onSuccess={handleActionSuccess}
            />
          )}
        </>
      )}
    </Box>
  );
};

export default ConsultMyPets;
