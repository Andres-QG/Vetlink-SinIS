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
  const itemsPerPage = 6;
  const totalPages = Math.ceil(items.length / itemsPerPage);

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
        maxWidth: 1200,
        margin: "0 auto",
      }}
    >
      <Grid container spacing={2}>
        {getCurrentItems().map((item) => (
          <Grid item xs={12} sm={6} key={item.id}>
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
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired,
      state: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
    })
  ).isRequired,
  onDeactivate: PropTypes.func.isRequired,
  onModify: PropTypes.func.isRequired,
  DeactivateModal: PropTypes.node,
  ModifyModal: PropTypes.node,
};

export default CardList;
