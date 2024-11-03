import { useState, useEffect } from "react";
import axios from "axios";
import ConsultView from "../components/Consult/ConsultView";
import DetailedRecordInfo from "../components/consultRecords/DetailedRecordInfo";
import AddRecord from "../components/consultRecords/AddRecord";
import ModifyRecord from "../components/consultRecords/ModifyRecord";

const ConsultRecords = () => {
  const rowsPerPage = 7;

  const columns = [
    { field: "consulta_id", headerName: "ID", type: "text" },
    { field: "usuario_cliente", headerName: "Dueño", type: "text" },
    { field: "mascota_id", headerName: "ID Paciente", type: "text" },
    { field: "nombre_mascota", headerName: "Paciente", type: "text" },
    { field: "fecha", headerName: "Fecha", type: "text" },
    { field: "diagnostico", headerName: "Diagnóstico", type: "text" },
  ];

  const [otherData, setOtherData] = useState({
    mascotas: [],
    vacunas: [],
    sintomas: [],
    tratamientos: [],
  });

  useEffect(() => {
    const fetchMascotas = async () => {
      const response = await axios.get(
        "http://localhost:8000/api/consult-mascotas/"
      );
      return response.data.results;
    };

    const fetchVacunas = async () => {
      const response = await axios.get(
        "http://localhost:8000/api/consult-vaccines/"
      );
      return response.data;
    };

    const fetchSintomas = async () => {
      const response = await axios.get(
        "http://localhost:8000/api/consult-symptoms/"
      );
      return response.data;
    };

    const fetchTratamientos = async () => {
      const response = await axios.get(
        "http://localhost:8000/api/consult-treatments/"
      );
      return response.data;
    };

    const fetchData = async () => {
      try {
        const [mascotas, vacunas, sintomas, tratamientos] = await Promise.all([
          fetchMascotas(),
          fetchVacunas(),
          fetchSintomas(),
          fetchTratamientos(),
        ]);

        setOtherData({
          mascotas,
          vacunas,
          sintomas,
          tratamientos,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <ConsultView
      title="Consultar Expedientes"
      fetchUrl="http://localhost:8000/api/consult-pet-records/"
      deletionUrl="http://localhost:8000/api/delete-pet-record/"
      addComponent={AddRecord}
      modifyComponent={ModifyRecord}
      detailedInfoComponent={DetailedRecordInfo}
      rowsPerPage={rowsPerPage}
      columns={columns}
      pkCol="consulta_id"
      visualIdentifierCol="consulta_id"
      otherData={otherData}
    />
  );
};

export default ConsultRecords;
