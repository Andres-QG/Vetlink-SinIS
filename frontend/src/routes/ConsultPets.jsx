import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Modal,
  CircularProgress,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Pagination,
  Box,
} from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material";
import CreatePet from "./CreatePet";

const ConsultPets = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchColumn, setSearchColumn] = useState("nombre"); // Columna para la búsqueda
  const [order, setOrder] = useState("asc"); // Orden ascendente o descendente
  const [open, setOpen] = useState(false); // Para el modal "Agregar Mascota"
  const [page, setPage] = useState(1); // Página actual
  const [totalPages, setTotalPages] = useState(1); // Total de páginas
  const itemsPerPage = 10; // Número de elementos por página

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Obtener las mascotas del backend con paginación y búsqueda
  const fetchPets = async () => {
    setLoading(true);
    try {
      // Si la columna seleccionada es "edad", ordenamos por "fecha_nacimiento"
      const columnToSend =
        searchColumn === "edad" ? "fecha_nacimiento" : searchColumn;

      const response = await fetch(
        `http://localhost:8000/api/consult-mascotas/?search=${searchTerm}&column=${columnToSend}&order=${order}&page=${page}`
      );
      const data = await response.json();
      setPets(data.results);
      setTotalPages(Math.ceil(data.count / itemsPerPage)); // número total de páginas
      setLoading(false);
    } catch (error) {
      console.error("Error al consultar las mascotas:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPets();
  }, [searchTerm, searchColumn, order, page]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setPage(1);
  };

  const handleChangePage = (event, value) => {
    setPage(value);
  };

  const calculateAge = (birthDate) => {
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }
    return age;
  };

  // Cambiar el orden de la columna
  const toggleOrder = () => {
    setOrder(order === "asc" ? "desc" : "asc");
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Consultar Mascotas</h1>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleOpen}
          sx={{
            backgroundColor: "#00308F",
            color: "#fff",
            "&:hover": {
              backgroundColor: "#00246d",
            },
          }}
        >
          Agregar Mascota
        </Button>
      </div>

      {/* Búsqueda */}
      <div className="flex gap-4 mb-4">
        <TextField
          label={`Buscar por ${searchColumn}`}
          variant="outlined"
          sx={{ flex: 1 }}
          value={searchTerm}
          onChange={handleSearch}
        />

        <FormControl variant="outlined">
          <InputLabel>Columna</InputLabel>
          <Select
            value={searchColumn}
            onChange={(e) => setSearchColumn(e.target.value)}
            label="Columna"
            sx={{ flex: 2 }}
          >
            <MenuItem value="nombre">Nombre</MenuItem>
            <MenuItem value="especie">Especie</MenuItem>
            <MenuItem value="raza">Raza</MenuItem>
            <MenuItem value="sexo">Sexo</MenuItem>
            <MenuItem value="edad">Edad</MenuItem>
            <MenuItem value="usuario_cliente">Due o</MenuItem>{" "}
          </Select>
        </FormControl>

        <Button
          variant="contained"
          onClick={toggleOrder}
          sx={{ marginLeft: "10px" }}
        >
          {order === "asc" ? "Ascendente" : "Descendente"}
        </Button>
      </div>

      {/* Círculo de carga */}
      {loading ? (
        <div className="flex justify-center items-center">
          <CircularProgress />
        </div>
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Especie</TableCell>
                  <TableCell>Raza</TableCell>
                  <TableCell>Sexo</TableCell>
                  <TableCell>Edad</TableCell>
                  <TableCell>Dueño</TableCell> {/* Se añade la columna dueño */}
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pets.length > 0 ? (
                  pets.map((pet) => (
                    <TableRow key={pet.mascota_id}>
                      <TableCell>{pet.nombre}</TableCell>
                      <TableCell>{pet.especie}</TableCell>
                      <TableCell>{pet.raza}</TableCell>
                      <TableCell>{pet.sexo}</TableCell>
                      <TableCell>
                        {calculateAge(pet.fecha_nacimiento)}
                      </TableCell>
                      <TableCell>{pet.usuario_cliente}</TableCell>{" "}
                      <TableCell>
                        <IconButton>
                          <Edit />
                        </IconButton>
                        <IconButton>
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      No se encontraron mascotas
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <Box display="flex" justifyContent="center" marginY={2}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={handleChangePage}
              color="primary"
            />
          </Box>
        </>
      )}

      {/* Modal para agregar mascota */}
      <Modal open={open} onClose={handleClose}>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg">
          <CreatePet handleClose={handleClose} />
        </div>
      </Modal>
    </div>
  );
};

export default ConsultPets;
