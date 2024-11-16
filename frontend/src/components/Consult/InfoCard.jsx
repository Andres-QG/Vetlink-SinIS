import React from "react";
import PropTypes from "prop-types";
import { Card, Typography, Button, Box, Chip } from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

const InfoCard = ({ item, onDeactivate, onModify }) => (
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
          justifyContent: "space-between",
          alignItems: "center",
          mb: 1,
        }}
      >
        <Typography variant="h6" sx={{ fontSize: "1rem", fontWeight: 600 }}>
          {item.name}
        </Typography>
        <Chip
          label={item.state === "active" ? "Disponible" : "No Disponible"}
          size="small"
          sx={{
            backgroundColor: item.state === "active" ? "#e8f5e9" : "#eeeeee",
            color: item.state === "active" ? "#2e7d32" : "#616161",
            fontWeight: 500,
            fontSize: "0.75rem",
          }}
        />
      </Box>

      <Typography
        variant="body2"
        sx={{
          color: "#666",
          mb: 2,
          fontSize: "0.875rem",
          lineHeight: 1.5,
        }}
      >
        {item.description}
      </Typography>

      <Box sx={{ display: "flex", gap: 1 }}>
        <Button
          startIcon={<EditOutlinedIcon sx={{ fontSize: 18 }} />}
          onClick={() => onModify(item)}
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

InfoCard.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    state: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
  }).isRequired,
  onDeactivate: PropTypes.func.isRequired,
  onModify: PropTypes.func.isRequired,
};

export default InfoCard;
