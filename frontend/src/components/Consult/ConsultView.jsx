import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { CircularProgress, Button } from "@mui/material";
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

  const notify = useNotification();

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    fetchAllData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchTerm, searchColumn, order, data]);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(fetchUrl, {
        params: { page_size: 1000 }, // Ajuste para cargar todos los datos
        withCredentials: true,
      });
      console.log(response.data)
      const data = response.data.results || [];
      setData(data);
      setTotalCount(data.length);
      setFilteredData(data);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let results = [...data];

    if (searchTerm) {
      results = results.filter((item) =>
        item[searchColumn]
          ?.toString()
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
    }

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

  return (
    <div className="flex flex-col">
      <div className="flex-grow">
        <div className="flex flex-col items-center justify-between mb-4 space-y-4 md:flex-row md:space-y-0">
          <h1 className="text-2xl font-semibold">{title}</h1>
          <div className="flex flex-col w-full space-y-4 md:w-auto md:flex-row md:items-center md:space-y-0">
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={handleOpen}
              sx={{
                backgroundColor: "#00308F",
                "&:hover": { backgroundColor: "#00246d" },
                minWidth: "190px",
                marginBottom: { xs: "-4px", md: "0px" },
                marginRight: { xs: "0px", md: "10px" },
                width: { xs: "100%", md: "auto" },
                fontSize: "0.85rem",
              }}>
              Agregar
            </Button>
            <SearchBar
              onSearch={handleSearch}
              columns={columns.map((col) => col.field)}
            />
          </div>
        </div>
        {loading ? (
          <div className="flex items-center justify-center">
            <CircularProgress />
          </div>
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
  deletionUrl: PropTypes.string.isRequired,
  restoreUrl: PropTypes.string,
  addComponent: PropTypes.elementType.isRequired,
  modifyComponent: PropTypes.elementType.isRequired,
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
  pkCol: PropTypes.string.isRequired,
  visualIdentifierCol: PropTypes.string.isRequired,
};

export default ConsultView;
