import PropTypes from "prop-types";
import { Modal, Box, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AssignmentIcon from "@mui/icons-material/Assignment";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import MonitorWeightIcon from "@mui/icons-material/MonitorWeight";
import TreatmentIcon from "@mui/icons-material/MedicationLiquid";
import VaccinesIcon from "@mui/icons-material/Vaccines";
import HealingIcon from "@mui/icons-material/Healing";

const DetailedRecordInfo = ({ open, handleClose, selectedItem }) => {
  const details = {
    consulta_id: selectedItem.consulta_id,
    nombre_mascota: selectedItem.nombre_mascota,
    fecha: selectedItem.fecha,
    peso: selectedItem.peso,
    sintomas: selectedItem.sintomas.split(","),
    vacunas: selectedItem.vacunas.split(","),
    tratamientos: selectedItem.tratamientos.split(","),
  };

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
        <h2 className="text-xl font-medium text-gray-700 mb-3 flex items-center">
          <AssignmentIcon sx={{ mr: 1 }} />
          Expediente de consulta ID: {details.consulta_id} de{" "}
          {details.nombre_mascota}
        </h2>
        <div className="mb-3 flex items-center text-gray-500 text-sm">
          <CalendarTodayIcon sx={{ mr: 1 }} />
          Fecha: {details.fecha}
        </div>
        <div className="mb-8">
          <h3 className="text-xl font-semibold flex items-center">
            <MonitorWeightIcon sx={{ mr: 1 }} />
            Peso:
          </h3>
          <p className="text-gray-700">{details.peso} Kg</p>
        </div>
        <div className="mb-8">
          <h3 className="text-xl font-semibold flex items-center">
            <HealingIcon sx={{ mr: 1 }} />
            Síntomas presentados
          </h3>
          <ul className="list-disc list-inside text-gray-700 ml-7">
            {details.sintomas.map((sintoma, index) => (
              <li key={index}>{sintoma.trim()}</li>
            ))}
          </ul>
        </div>
        <div className="mb-8">
          <h3 className="text-xl font-semibold flex items-center">
            <VaccinesIcon sx={{ mr: 1 }} />
            Vacunas suministradas
          </h3>
          <ul className="list-disc list-inside text-gray-700 ml-7">
            {details.vacunas.map((vacuna, index) => (
              <li key={index}>{vacuna.trim()}</li>
            ))}
          </ul>
        </div>
        <div className="mb-8">
          <h3 className="text-xl font-semibold flex items-center">
            <TreatmentIcon sx={{ mr: 1 }} />
            Tratamientos recetados
          </h3>
          <ul className="list-disc list-inside text-gray-700 ml-7">
            {details.tratamientos.map((tratamiento, index) => (
              <li key={index}>{tratamiento.trim()}</li>
            ))}
          </ul>
        </div>
      </Box>
    </Modal>
  );
};

export default DetailedRecordInfo;

DetailedRecordInfo.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  selectedItem: PropTypes.shape({
    consulta_id: PropTypes.string.isRequired,
    nombre_mascota: PropTypes.string.isRequired,
    fecha: PropTypes.string.isRequired,
    peso: PropTypes.string.isRequired,
    sintomas: PropTypes.string.isRequired,
    vacunas: PropTypes.string.isRequired,
    tratamientos: PropTypes.string.isRequired,
  }).isRequired,
};
