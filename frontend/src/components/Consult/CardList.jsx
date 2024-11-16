import React, { useState } from "react";
import PropTypes from "prop-types";
import { Grid, Box, Pagination } from "@mui/material";
import InfoCard from "./InfoCard";

const CardList = ({
  items,
  onDeactivate,
  onModify,
  DeactivateModal,
  ModifyModal,
}) => {
  const [page, setPage] = useState(1);
  const itemsPerPage = 6;
  const totalPages = Math.ceil(items.length / itemsPerPage);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const getCurrentItems = () => {
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return items.slice(start, end);
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1200, margin: "0 auto" }}>
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
        <Pagination
          count={totalPages}
          page={page}
          onChange={handlePageChange}
          shape="rounded"
          sx={{
            "& .MuiPaginationItem-root": {
              color: "#666",
              "&.Mui-selected": {
                backgroundColor: "#0046b8",
                color: "white",
                "&:hover": {
                  backgroundColor: "#003d9e",
                },
              },
            },
          }}
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
