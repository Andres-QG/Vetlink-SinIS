import { useContext } from "react";
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  CardActionArea,
  List,
  ListItem,
  ListItemText,
  Divider,
  Grow,
  useTheme,
} from "@mui/material";
import PetsIcon from "@mui/icons-material/Pets";
import PeopleIcon from "@mui/icons-material/People";
import EventIcon from "@mui/icons-material/Event";
import DashboardIcon from "@mui/icons-material/Dashboard";
import TaskIcon from "@mui/icons-material/Task";
import { AuthContext } from "../context/AuthContext";

const Dashboard = () => {
  const theme = useTheme();
  const { role } = useContext(AuthContext);

  // Información de las tarjetas (genéricas para todos los roles)
  const infoCards = [
    {
      title: "Clientes",
      value: "1200",
      icon: (
        <PeopleIcon sx={{ fontSize: 40, color: theme.palette.primary.main }} />
      ),
      description: "Número total de clientes activos",
    },
    {
      title: "Mascotas Registradas",
      value: "850",
      icon: (
        <PetsIcon sx={{ fontSize: 40, color: theme.palette.success.main }} />
      ),
      description: "Total de mascotas registradas en el sistema",
    },
    {
      title: "Próximas Citas",
      value: "150",
      icon: (
        <EventIcon sx={{ fontSize: 40, color: theme.palette.warning.main }} />
      ),
      description: "Citas programadas en los próximos días",
    },
  ];

  // Tareas pendientes (ficticias)
  const pendingTasks = [
    "Confirmar citas del día",
    "Actualizar perfil de cliente",
  ];

  return (
    <Box sx={{ flexGrow: 1, padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Bienvenido al Panel de{" "}
        {role === 1
          ? "Dueño"
          : role === 2
            ? "Administrador"
            : role === 3
              ? "Veterinario"
              : "Cliente"}
      </Typography>

      {/* Grid de tarjetas con animación Grow */}
      <Grid container spacing={3}>
        {infoCards.map((card, index) => (
          <Grow in={true} timeout={(index + 1) * 500} key={index}>
            <Grid item xs={12} sm={6} md={4}>
              <CardActionArea>
                <Card
                  sx={{
                    transition: "transform 0.3s",
                    "&:hover": {
                      transform: "scale(1.05)",
                    },
                  }}
                >
                  <CardContent sx={{ display: "flex", alignItems: "center" }}>
                    <Box sx={{ marginRight: 2 }}>{card.icon}</Box>
                    <Box>
                      <Typography variant="h6">{card.title}</Typography>
                      <Typography variant="h4">{card.value}</Typography>
                      <Typography variant="body2" color="textSecondary">
                        {card.description}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </CardActionArea>
            </Grid>
          </Grow>
        ))}
      </Grid>

      {/* Sección de Próximos Eventos */}
      <Box mt={4}>
        <Typography variant="h5" gutterBottom>
          Próximos Eventos
        </Typography>
        <List>
          <ListItem>
            <ListItemText
              primary="Cita con Juan Pérez"
              secondary="10/11/2024"
            />
          </ListItem>
          <Divider />
          <ListItem>
            <ListItemText
              primary="Reunión con el equipo"
              secondary="12/11/2024"
            />
          </ListItem>
        </List>
      </Box>

      {/* Nueva sección: Tareas pendientes */}
      <Box mt={4}>
        <Typography variant="h5" gutterBottom>
          Tareas Pendientes
        </Typography>
        <Card>
          <CardContent>
            <List>
              {pendingTasks.map((task, index) => (
                <ListItem key={index}>
                  <TaskIcon
                    sx={{ marginRight: 2, color: theme.palette.info.main }}
                  />
                  <ListItemText primary={task} />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default Dashboard;
