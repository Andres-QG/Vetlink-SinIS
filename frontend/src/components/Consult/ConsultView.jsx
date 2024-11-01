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
    fetchData();
  }, [page, searchTerm, searchColumn, order]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        search: searchTerm,
        column: searchColumn,
        order,
        page_size: rowsPerPage,
      };

      const response = await axios.get(fetchUrl, {
        params,
        withCredentials: true, // Habilita el envío de credenciales (cookies de sesión)
      });
      const data = response.data;
      console.log(data);
      setData(data.results);
      setTotalCount(data.count);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (term, column) => {
    setSearchTerm(term);
    setSearchColumn(column);
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
              }}
            >
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
            data={data}
            otherData={otherData}
            columns={columns}
            totalCount={totalCount}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={setPage}
            deletionUrl={deletionUrl}
            pkCol={pkCol}
            visualIdentifierCol={visualIdentifierCol}
            fetchData={fetchData}
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
              await fetchData();
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
