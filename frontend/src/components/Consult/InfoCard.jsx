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
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import RestoreIcon from "@mui/icons-material/Restore";

const DESCRIPTION_CHAR_LIMIT = 50;

export default function InfoCard({
  item,
  openDelModal,
  onRestore,
  openModModal,
  hasStatus,
}) {
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

  const isActive = item.estado === 1;

  return (
    <Card
      sx={{
        height: "100%",
        boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
        borderRadius: "8px",
        "&:hover": {
          boxShadow: "0 2px 4px rgba(0,0,0,0.16)",
        },
        padding: "16px",
      }}
    >
      <Box sx={{ p: 2 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            justifyContent: "space-between",
            alignItems: isMobile ? "flex-start" : "center",
            mb: 2,
          }}
        >
          <Typography
            variant="h5"
            sx={{ fontSize: "1rem", fontWeight: 600, mb: isMobile ? 1 : 0 }}
          >
            {item.nombre}
          </Typography>
          {hasStatus && (
            <Chip
              label={isActive ? "Disponible" : "No Disponible"}
              size="medium"
              sx={{
                backgroundColor: isActive ? "#e8f5e9" : "#eeeeee",
                color: isActive ? "#2e7d32" : "#616161",
                fontWeight: 500,
                fontSize: "0.875rem",
              }}
            />
          )}
        </Box>

        <Typography
          variant="body1"
          sx={{
            color: "#666",
            mb: 2,
            fontSize: "1rem",
            lineHeight: 1.5,
            wordWrap: "break-word",
            overflowWrap: "break-word",
            maxHeight: isExpanded ? "none" : "4.5em",
            textOverflow: "ellipsis",
            overflow: "hidden",
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
              fontSize: "0.875rem",
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
            startIcon={<EditIcon sx={{ fontSize: 20 }} />}
            onClick={() => openModModal(item)}
            fullWidth={isMobile}
            sx={{
              textTransform: "none",
              color: "#666",
              fontSize: "1rem",
              padding: "8px 16px",
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
            startIcon={
              hasStatus ? (
                isActive ? (
                  <DeleteIcon sx={{ fontSize: 20 }} />
                ) : (
                  <RestoreIcon sx={{ fontSize: 20 }} />
                )
              ) : (
                <DeleteIcon sx={{ fontSize: 20 }} />
              )
            }
            onClick={() =>
              hasStatus
                ? isActive
                  ? openDelModal(item)
                  : onRestore(item)
                : openDelModal(item)
            }
            fullWidth={isMobile}
            sx={{
              textTransform: "none",
              color: "white",
              fontSize: "1rem",
              padding: "8px 16px",
              minWidth: "auto",
              backgroundColor: hasStatus
                ? isActive
                  ? "#dc3545"
                  : "#28a745"
                : "#dc3545",
              borderRadius: "4px",
              "&:hover": {
                backgroundColor: hasStatus
                  ? isActive
                    ? "#c82333"
                    : "#218838"
                  : "#c82333",
              },
            }}
          >
            {hasStatus ? (isActive ? "Desactivar" : "Reactivar") : "Eliminar"}
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
  openDelModal: PropTypes.func.isRequired,
  openModModal: PropTypes.func.isRequired,
  onRestore: PropTypes.func,
  hasStatus: PropTypes.bool.isRequired,
};
