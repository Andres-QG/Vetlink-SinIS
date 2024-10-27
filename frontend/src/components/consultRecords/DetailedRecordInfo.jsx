import { Modal, Box, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const DetailedRecordInfo = ({ open, handleClose, selectedItem }) => {
  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          p: 3,
          borderRadius: 2,
          boxShadow: 3,
          bgcolor: "#fff",
          width: "100%",
          maxWidth: "500px",
          mx: "auto",
        }}
        className="p-6 bg-white rounded-lg shadow-lg"
      >
        <IconButton
          sx={{ position: "absolute", top: 8, right: 8 }}
          onClick={handleClose}
        >
          <CloseIcon />
        </IconButton>
        <h2 className="text-2xl font-bold mb-4 pt-4">
          Detalles sobre el campo de expediente ID({selectedItem.consulta_id})
        </h2>
        <div className="mb-8">
          <h3 className="text-xl font-semibold">Peso en Kilogramos:</h3>
          <p className="text-gray-700">{selectedItem.peso}</p>
        </div>
        <div className="mb-8">
          <h3 className="text-xl font-semibold">Síntomas presentados</h3>
          <ul className="list-disc list-inside text-gray-700">
            {selectedItem.sintomas.split(",").map((sintoma, index) => (
              <li key={index}>{sintoma.trim()}</li>
            ))}
          </ul>
        </div>
        <div className="mb-8">
          <h3 className="text-xl font-semibold">Vacunas suministradas</h3>
          <ul className="list-disc list-inside text-gray-700">
            {selectedItem.vacunas.split(",").map((vacuna, index) => (
              <li key={index}>{vacuna.trim()}</li>
            ))}
          </ul>
        </div>
        <div className="mb-8">
          <h3 className="text-xl font-semibold">Tratamientos recetados</h3>
          <ul className="list-disc list-inside text-gray-700">
            {selectedItem.tratamientos.split(",").map((tratamiento, index) => (
              <li key={index}>{tratamiento.trim()}</li>
            ))}
          </ul>
        </div>
      </Box>
    </Modal>
  );
};

export default DetailedRecordInfo;
