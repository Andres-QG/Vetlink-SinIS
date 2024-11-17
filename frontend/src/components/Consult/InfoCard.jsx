import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  Card,
  Typography,
  Button,
  Box,
  Chip,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

const DESCRIPTION_CHAR_LIMIT = 100;

export default function InfoCard({ item, onDeactivate, onModify }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const truncateText = (text, limit) => {
    if (text.length <= limit) return text;
    return text.slice(0, limit) + "...";
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <Card
      sx={{
        height: "100%",
        boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
        borderRadius: "8px",
        "&:hover": {
          boxShadow: "0 2px 4px rgba(0,0,0,0.16)",
        },
      }}
    >
      <Box sx={{ p: 2 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            justifyContent: "space-between",
            alignItems: isMobile ? "flex-start" : "center",
            mb: 1,
          }}
        >
          <Typography
            variant="h6"
            sx={{ fontSize: "1rem", fontWeight: 600, mb: isMobile ? 1 : 0 }}
          >
            {item.nombre}
          </Typography>
          {item.estado && (
            <Chip
              label={item.estado === 1 ? "Disponible" : "No Disponible"}
              size="small"
              sx={{
                backgroundColor: item.estado === 1 ? "#e8f5e9" : "#eeeeee",
                color: item.estado === 1 ? "#2e7d32" : "#616161",
                fontWeight: 500,
                fontSize: "0.75rem",
              }}
            />
          )}
        </Box>

        <Typography
          variant="body2"
          sx={{
            color: "#666",
            mb: 1,
            fontSize: "0.875rem",
            lineHeight: 1.5,
          }}
        >
          {isExpanded
            ? item.descripcion
            : truncateText(item.descripcion, DESCRIPTION_CHAR_LIMIT)}
        </Typography>

        {item.descripcion.length > DESCRIPTION_CHAR_LIMIT && (
          <Button
            onClick={toggleExpand}
            sx={{
              textTransform: "none",
              color: "#1976d2",
              fontSize: "0.75rem",
              padding: "0",
              minWidth: "auto",
              mb: 2,
              "&:hover": {
                backgroundColor: "transparent",
                textDecoration: "underline",
              },
            }}
          >
            {isExpanded ? "Leer menos" : "Leer más"}
          </Button>
        )}

        <Box
          sx={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            gap: 1,
          }}
        >
          <Button
            startIcon={<EditOutlinedIcon sx={{ fontSize: 18 }} />}
            onClick={() => onModify(item)}
            fullWidth={isMobile}
            sx={{
              textTransform: "none",
              color: "#666",
              fontSize: "0.875rem",
              padding: "6px 12px",
              minWidth: "auto",
              border: "1px solid #e0e0e0",
              borderRadius: "4px",
              backgroundColor: "transparent",
              "&:hover": {
                backgroundColor: "#f5f5f5",
              },
            }}
          >
            Modificar
          </Button>
          <Button
            startIcon={<DeleteOutlineIcon sx={{ fontSize: 18 }} />}
            onClick={() => onDeactivate(item)}
            fullWidth={isMobile}
            sx={{
              textTransform: "none",
              color: "white",
              fontSize: "0.875rem",
              padding: "6px 12px",
              minWidth: "auto",
              backgroundColor: "#dc3545",
              borderRadius: "4px",
              "&:hover": {
                backgroundColor: "#c82333",
              },
            }}
          >
            Desactivar
          </Button>
        </Box>
      </Box>
    </Card>
  );
}

InfoCard.propTypes = {
  item: PropTypes.shape({
    nombre: PropTypes.string.isRequired,
    estado: PropTypes.string,
    descripcion: PropTypes.string.isRequired,
  }).isRequired,
  onDeactivate: PropTypes.func.isRequired,
  onModify: PropTypes.func.isRequired,
};
