import { useState, useEffect } from "react";
import {
  IconButton,
  TablePagination,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";

// TODO: Props: data, columns, totalCount, page, rowsPerPage, onPageChange
const GeneralTable = ({
  data,
  columns,
  totalCount,
  page,
  rowsPerPage,
  onPageChange,
}) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 905);
    };

    // Initialize the state on component mount
    handleResize();

    // Add event listener to window resize
    window.addEventListener("resize", handleResize);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const getItemAriaLabel = (type) => {
    return `Ir a la página ${type}`;
  };

  return (
    <>
      <TableContainer component={Paper}>
        {isMobile ? (
          data.map((item) => (
            <div
              key={item.id}
              style={{
                border: "1px solid #ddd",
                marginBottom: "10px",
                padding: "10px",
              }}
            >
              {columns.map((col) => (
                <div key={col.field} style={{ marginBottom: "5px" }}>
                  <strong>{col.headerName}:</strong> {item[col.field]}
                </div>
              ))}
              <div>
                <IconButton onClick={() => console.log("Edit clicked")}>
                  <Edit />
                </IconButton>
                <IconButton onClick={() => console.log("Delete clicked")}>
                  <Delete />
                </IconButton>
              </div>
            </div>
          ))
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                {columns.map((col) => (
                  <TableCell
                    key={col.field}
                    style={{ fontWeight: "bold", backgroundColor: "#f0f0f0" }}
                  >
                    {col.headerName}
                  </TableCell>
                ))}
                <TableCell
                  style={{ fontWeight: "bold", backgroundColor: "#f0f0f0" }}
                >
                  Acciones
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((item) => (
                <TableRow key={item.id}>
                  {columns.map((col) => (
                    <TableCell key={col.field}>{item[col.field]}</TableCell>
                  ))}
                  <TableCell>
                    <IconButton onClick={() => console.log("Edit clicked")}>
                      <Edit />
                    </IconButton>
                    <IconButton onClick={() => console.log("Delete clicked")}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {data.length === 0 && (
                <TableRow>
                  <TableCell colSpan={columns.length + 1} align="center">
                    No hay datos disponibles
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </TableContainer>

      <TablePagination
        component="div"
        count={totalCount}
        rowsPerPage={rowsPerPage}
        page={page - 1}
        onPageChange={(event, newPage) => onPageChange(newPage + 1)}
        labelDisplayedRows={({ from, to, count }) =>
          `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`
        }
        rowsPerPageOptions={[]}
        showFirstButton={true}
        showLastButton={true}
        getItemAriaLabel={getItemAriaLabel}
      />
    </>
  );
};

export default GeneralTable;
