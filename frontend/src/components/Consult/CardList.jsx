import React, { useState } from "react";
import PropTypes from "prop-types";
import { Grid, Box, TablePagination } from "@mui/material";
import InfoCard from "./InfoCard";

const CardList = ({
  items,
  onDeactivate,
  onModify,
  DeactivateModal,
  ModifyModal,
}) => {
  const [page, setPage] = useState(0);
  const itemsPerPage = 9;

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const getCurrentItems = () => {
    const start = page * itemsPerPage;
    const end = start + itemsPerPage;
    return items.slice(start, end);
  };

  return (
    <Box
      sx={{
        p: 3,
        width: "100%",
        margin: "0 auto",
      }}
    >
      <Grid container spacing={2}>
        {getCurrentItems().map((item, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <InfoCard
              item={item}
              onDeactivate={onDeactivate}
              onModify={onModify}
            />
          </Grid>
        ))}
      </Grid>

      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <TablePagination
          component="div"
          count={items.length}
          rowsPerPage={itemsPerPage}
          page={page}
          onPageChange={handlePageChange}
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`
          }
          rowsPerPageOptions={[]}
          showFirstButton={true}
          showLastButton={true}
          getItemAriaLabel={(type) => `Ir a la página ${type}`}
        />
      </Box>

      {DeactivateModal}
      {ModifyModal}
    </Box>
  );
};

CardList.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      nombre: PropTypes.string.isRequired,
      estado: PropTypes.string,
      descripcion: PropTypes.string.isRequired,
    })
  ).isRequired,
  onDeactivate: PropTypes.func.isRequired,
  onModify: PropTypes.func.isRequired,
  DeactivateModal: PropTypes.node,
  ModifyModal: PropTypes.node,
};

export default CardList;