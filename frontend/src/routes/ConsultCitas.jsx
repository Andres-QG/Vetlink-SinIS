import { useState, useEffect } from "react";
import axios from "axios";

import ConsultView from "../components/Consult/ConsultView";
import AddCitaModal from "../components/consultCitas/AddCitaModal";
import ModifyCitaModal from "../components/consultCitas/ModifyCitaModal";


function ConsultCitas() {
  const rowsPerPage = 7;

  const columns = [
    { field: "cliente", headerName: "Cliente", type: "text" },
    { field: "veterinario", headerName: "Veterinario", type: "text" },
    { field: "clinica", headerName: "Clínica", type: "text" },
    { field: "mascota", headerName: "Mascota", type: "text" },
    { field: "fecha", headerName: "Fecha", type: "text" },
    { field: "hora", headerName: "Hora", type: "text" },
    { field: "motivo", headerName: "Motivo", type: "text" },
    { field: "estado", headerName: "Estado", type: "text" },
  ];

  const [otherData, setOtherData] = useState({
    user: {},
    services: [],
    clinicas: [],
    clientes: [],
    veterinarios: [],
  });

  useEffect(() => {
    const fetchUser = async () => {
      const response = await axios.get("http://localhost:8000/api/get-user/", { withCredentials: true });
      return response.data.data;
    };

    const fetchClientes = async () => {
      const response = await axios.get("http://localhost:8000/api/get-clients/");
      return response.data.clients;
    };

    const fetchVeterinarios = async () => {
      const response = await axios.get("http://localhost:8000/api/get-vets/");
      return response.data.vets;
    };

    const fetchServices = async () => {
      const response = await axios.get("http://localhost:8000/api/get-services/");
      return response.data.services;
    };

    const fetchClinicas = async () => {
      const response = await axios.get("http://localhost:8000/api/get-clinics/");
      return response.data.clinics;
    };

    const fetchData = async () => {
      try {
        const [user, clientes, veterinarios, services, clinicas] = await Promise.all([
          fetchUser(),
          fetchClientes(),
          fetchVeterinarios(),
          fetchServices(),
          fetchClinicas(),
        ]);

        setOtherData({
          user: user || {},
          services: services || [],
          clinicas: clinicas || [],
          clientes: clientes || [],
          veterinarios: veterinarios || [],
        });
        console.log(otherData)
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);
 
  return (
    <>
      <ConsultView
        title="Citas"
        fetchUrl="http://localhost:8000/api/consult-citas/"
        deletionUrl="http://localhost:8000/api/delete-citas"
        addComponent={AddCitaModal}
        modifyComponent={ModifyCitaModal}
        rowsPerPage={rowsPerPage}
        columns={columns}
        pkCol="cita_id"
        visualIdentifierCol="cliente"
        otherData={otherData}
      />
    </>
  );
};

export default ConsultCitas;
