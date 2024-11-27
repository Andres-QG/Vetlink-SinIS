import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  CircularProgress,
  Button,
  Box,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import { Add } from "@mui/icons-material";
import GeneralTable from "./GeneralTable";
import SearchBar from "./GeneralizedSearchBar";
import { useNotification } from "../Notification";
import axios from "axios";

const ConsultView = ({
  title,
  fetchUrl,
  deletionUrl,
  restoreUrl,
  addComponent: AddComponent,
  modifyComponent: ModifyComponent,
  detailedInfoComponent: DetailedInfoComponent,
  columns,
  pkCol,
  visualIdentifierCol,
  rowsPerPage,
  otherData,
  customDeleteTitle,
  disableAddButton = false,
  disableModifyAction = false,
  disableDeleteAction = false,
  disableReactivateAction = false,
  hideAddButton = false,
  hideActions = false,
  onDownload,
  disableDownloadAction = false,
  titleIcon: TitleIcon,
}) => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchColumn, setSearchColumn] = useState(columns[0].field);
  const [order, setOrder] = useState("asc");
  const [open, setOpen] = useState(false);
  const [showInactive, setShowInactive] = useState(false);

  const notify = useNotification();

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Verificar si existe el atributo activo
  const hasActivoAttribute = data.length > 0 && "activo" in data[0];

  useEffect(() => {
    fetchAllData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchTerm, searchColumn, order, data, showInactive]);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(fetchUrl, {
        params: { page_size: 1000 },
        withCredentials: true,
      });
      const data = response.data.results || [];
      setData(data);
      console.log(data);
      setTotalCount(data.length);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let results = [...data];

    // Filtrar inactivos si es necesario
    if (!showInactive && hasActivoAttribute) {
      results = results.filter((item) => item.activo === true);
    }

    // Aplicar filtro de búsqueda
    if (searchTerm) {
      results = results.filter((item) =>
        item[searchColumn]
          ?.toString()
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
    }

    // Aplicar ordenamiento
    results.sort((a, b) => {
      if (a[searchColumn] < b[searchColumn]) return order === "asc" ? -1 : 1;
      if (a[searchColumn] > b[searchColumn]) return order === "asc" ? 1 : -1;
      return 0;
    });

    setFilteredData(results);
    setTotalCount(results.length);
  };

  const handleSearch = (term, column, newOrder) => {
    setSearchTerm(term);
    setSearchColumn(column);
    setOrder(newOrder);
    setPage(1);
  };

  const toggleShowInactive = () => {
    setShowInactive((prev) => !prev);
    setPage(1);
  };

  return (
    <div className="flex flex-col">
      <div className="flex-grow">
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: "center",
            mb: 4,
          }}
        >
          {/* Título con ícono opcional */}
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            sx={{ mb: { xs: 2, sm: 0 } }}
          >
            {TitleIcon && (
              <TitleIcon
                sx={{
                  fontSize: 40,
                  color: "#00308F",
                  verticalAlign: "middle",
                }}
              />
            )}
            <Typography
              variant="h4"
              sx={{
                fontWeight: "bold",
                verticalAlign: "middle",
              }}
            >
              {title}
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
            {hasActivoAttribute && (
              <Button
                variant="contained"
                onClick={toggleShowInactive}
                sx={{
                  backgroundColor: showInactive
                    ? "rgba(184,230,215,1)"
                    : "rgba(255,124,125,1)",
                  "&:hover": {
                    backgroundColor: showInactive
                      ? "rgba(184,230,215,0.8)"
                      : "rgba(255,124,125,0.8)",
                  },
                  color: "#000",
                  minWidth: "205px",
                }}
              >
                {showInactive ? "Mostrar solo activos" : "Mostrar inactivos"}
              </Button>
            )}

            {!hideAddButton && (
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={handleOpen}
                disabled={disableAddButton}
                sx={{
                  backgroundColor: disableAddButton ? "grey.500" : "#00308F",
                  "&:hover": {
                    backgroundColor: disableAddButton ? "grey.500" : "#00246d",
                  },
                  minWidth: "190px",
                }}
              >
                Agregar
              </Button>
            )}

            <SearchBar
              onSearch={handleSearch}
              columns={columns.map((col) => col.field)}
            />
          </Box>
        </Box>

        <Divider sx={{ mb: 4 }} />

        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center">
            <CircularProgress />
          </Box>
        ) : (
          <GeneralTable
            data={filteredData.slice(
              (page - 1) * rowsPerPage,
              page * rowsPerPage
            )}
            otherData={otherData}
            columns={columns}
            totalCount={totalCount}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={setPage}
            deletionUrl={deletionUrl}
            restoreUrl={restoreUrl}
            pkCol={pkCol}
            visualIdentifierCol={visualIdentifierCol}
            fetchData={fetchAllData}
            ModModal={ModifyComponent}
            DetailsModal={DetailedInfoComponent}
            customDeleteTitle={customDeleteTitle}
            disableModifyAction={disableModifyAction}
            disableDeleteAction={disableDeleteAction}
            disableReactivateAction={disableReactivateAction}
            hideActions={hideActions}
            onDownload={onDownload}
            disableDownloadAction={disableDownloadAction}
          />
        )}

        {open && (
          <AddComponent
            open={open}
            handleClose={handleClose}
            onSuccess={async (message, severity) => {
              notify(message, severity);
              handleClose();
              await fetchAllData();
            }}
            otherData={otherData}
          />
        )}
      </div>
    </div>
  );
};

ConsultView.propTypes = {
  title: PropTypes.string.isRequired,
  fetchUrl: PropTypes.string.isRequired,
  deletionUrl: PropTypes.string,
  restoreUrl: PropTypes.string,
  addComponent: PropTypes.elementType,
  modifyComponent: PropTypes.elementType,
  detailedInfoComponent: PropTypes.elementType,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      field: PropTypes.string.isRequired,
      headerName: PropTypes.string.isRequired,
      width: PropTypes.number,
      type: PropTypes.oneOf(["text", "chip", "action"]),
      icon: PropTypes.element,
      onClick: PropTypes.func,
      chipColors: PropTypes.object,
    })
  ).isRequired,
  pkCol: PropTypes.string,
  visualIdentifierCol: PropTypes.string,
  rowsPerPage: PropTypes.number,
  otherData: PropTypes.object,
  customDeleteTitle: PropTypes.string,
  disableAddButton: PropTypes.bool,
  disableModifyAction: PropTypes.bool,
  disableDeleteAction: PropTypes.bool,
  disableReactivateAction: PropTypes.bool,
  hideAddButton: PropTypes.bool,
  hideActions: PropTypes.bool,
  onDownload: PropTypes.func,
  disableDownloadAction: PropTypes.bool,
  titleIcon: PropTypes.elementType, // Nueva PropType para el ícono del título
};

export default ConsultView;
