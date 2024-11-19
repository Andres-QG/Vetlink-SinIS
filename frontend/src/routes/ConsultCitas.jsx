import { useState, useEffect } from "react";
import axios from "axios";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import ConsultView from "../components/Consult/ConsultView";
import AddCitaModal from "../components/consultCitas/AddCitaModal";
import ModifyCitaModal from "../components/consultCitas/ModifyCitaModal";
import ConsultMyAppoints from "./ConsultMyAppoints";


function ConsultCitas() {
  const rowsPerPage = 7;
  const [user, setUser] = useState({})
  const stripePromise = loadStripe("pk_test_51QLypMFlNacvOPfn04CgaWzXQXqJ524WVHJAEn2q0ebrAOcEWDBHRUdkj7dDgPuMyyKxpggIVDHNr7RBqo8Fuvsj00AgzIBn7U");


  const columns = [
    { field: "cliente", headerName: "Cliente", type: "text" },
    { field: "veterinario", headerName: "Veterinario", type: "text" },
    { field: "clinica", headerName: "Clínica", type: "text" },
    { field: "mascota", headerName: "Mascota", type: "text" },
    { field: "fecha", headerName: "Fecha", type: "text" },
    { field: "hora", headerName: "Hora", type: "text" },
    { field: "motivo", headerName: "Motivo", type: "text" },
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
        setUser(user)
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <Elements stripe={stripePromise}>
        {user.role === 3 &&
          <ConsultView
            title="Citas"
            fetchUrl="http://localhost:8000/api/consult-citas/"
            deletionUrl="http://localhost:8000/api/delete-cita/"
            addComponent={AddCitaModal}
            modifyComponent={ModifyCitaModal}
            rowsPerPage={rowsPerPage}
            columns={columns}
            pkCol="cita_id"
            visualIdentifierCol="cliente"
            otherData={otherData}
            customDeleteTitle="¿Desea eliminar esta cita?"
            disableAddButton={true}
            hideAddButton={true}
            hideActions={true}
          />
        }
        {(user.role === 1 || user.role === 2) && <ConsultView
          title="Citas"
          fetchUrl="http://localhost:8000/api/consult-citas/"
          deletionUrl="http://localhost:8000/api/delete-cita/"
          addComponent={AddCitaModal}
          modifyComponent={ModifyCitaModal}
          rowsPerPage={rowsPerPage}
          columns={columns}
          pkCol="cita_id"
          visualIdentifierCol="cliente"
          otherData={otherData}
          customDeleteTitle="¿Desea eliminar esta cita?"
          hideAddButton={false}
          hideActions={false}
        />}
        {user.role === 4 &&
          <ConsultMyAppoints otherData={otherData}></ConsultMyAppoints>
        }
      </Elements>
    </>
  );
};

export default ConsultCitas;
