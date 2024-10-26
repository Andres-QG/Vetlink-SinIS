import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import Error from "../routes/Error";
import { Player } from "@lottiefiles/react-lottie-player";
import Box from "@mui/material/Box";
import runningRabbitAnimation from "../assets/animations/RabbitAnimation.json";

function ProtectedRoute({ children, requiredRoles }) {
  const { role, fetchUserRole } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyRole = async () => {
      await fetchUserRole();
      setLoading(false);
    };
    verifyRole();
  }, [fetchUserRole]);

  if (loading) {
    // Animación Lottie durante el estado de carga
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Player
          autoplay
          loop
          src={runningRabbitAnimation} // La animación Lottie que cargaste
          style={{ height: "300px", width: "300px" }} // Puedes ajustar el tamaño de la animación
        />
      </Box>
    );
  }

  if (!requiredRoles?.includes(role)) {
    document.cookie = "active=false; path=/;";
    return <Error />;
  }

  return children;
}

export default ProtectedRoute;
