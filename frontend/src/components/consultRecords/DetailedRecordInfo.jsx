import PropTypes from "prop-types";
import { Modal, Box, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AssignmentIcon from "@mui/icons-material/Assignment";
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
    sintomas: selectedItem.sintomas
      ? selectedItem.sintomas.split(",")
      : ["Ningún síntoma registrado"],
    vacunas: selectedItem.vacunas
      ? selectedItem.vacunas.split(",")
      : ["Ningúna vacuna registrada"],
    tratamientos: selectedItem.tratamientos
      ? selectedItem.tratamientos.split(",")
      : ["Ningún tratamiento registrado"],
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
        <h2 className="text-xl font-bold flex items-center">
          <AssignmentIcon sx={{ mr: 1 }} />
          Expediente de consulta ID: {details.consulta_id} de{" "}
          {details.nombre_mascota}
        </h2>
        <div className="mb-3 ml-8 flex items-center text-gray-700 text-sm">
          Fecha: {details.fecha}
        </div>
        <div className="mb-8">
          <h3 className="text-xl font-medium text-gray-700 flex items-center">
            <MonitorWeightIcon sx={{ mr: 1 }} />
            Peso: {details.peso} Kg
          </h3>
        </div>
        <div className="mb-8">
          <h3 className="text-xl font-medium text-gray-700 flex items-center">
            <HealingIcon sx={{ mr: 1 }} />
            Síntomas presentados
          </h3>
          <ul className="list-disc list-inside text-gray-700 ml-7">
            {details.sintomas.map((sintoma) => (
              <li key={sintoma.trim()}>{sintoma.trim()}</li>
            ))}
          </ul>
        </div>
        <div className="mb-8">
          <h3 className="text-xl font-medium text-gray-700 flex items-center">
            <VaccinesIcon sx={{ mr: 1 }} />
            Vacunas suministradas
          </h3>
          <ul className="list-disc list-inside text-gray-700 ml-7">
            {details.vacunas.map((vacuna) => (
              <li key={vacuna.trim()}>{vacuna.trim()}</li>
            ))}
          </ul>
        </div>
        <div className="mb-8">
          <h3 className="text-xl font-medium text-gray-700 flex items-center">
            <TreatmentIcon sx={{ mr: 1 }} />
            Tratamientos recetados
          </h3>
          <ul className="list-disc list-inside text-gray-700 ml-7">
            {details.tratamientos.map((tratamiento) => (
              <li key={tratamiento.trim()}>{tratamiento.trim()}</li>
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
    consulta_id: PropTypes.number.isRequired,
    nombre_mascota: PropTypes.string.isRequired,
    fecha: PropTypes.string.isRequired,
    peso: PropTypes.string.isRequired,
    sintomas: PropTypes.string,
    vacunas: PropTypes.string,
    tratamientos: PropTypes.string,
  }).isRequired,
};
