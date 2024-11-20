import ConsultView from "../components/Consult/ConsultView";
import AddPet from "../components/consultPets/AddPet";
import ModifyPet from "../components/consultPets/ModifyPet";
import axios from "axios";
import { useState, useEffect } from "react";

const ConsultPets = () => {
  const rowsPerPage = 7;
  const columns = [
    { field: "usuario_cliente", headerName: "Dueño", type: "text" },
    { field: "nombre", headerName: "Nombre", type: "text" },
    {
      field: "fecha_nacimiento",
      headerName: "Fecha de nacimiento",
      type: "text",
    },
    { field: "especie", headerName: "Especie", type: "text" },
    { field: "raza", headerName: "Raza", type: "text" },
    { field: "sexo", headerName: "Sexo", type: "text" },
    {
      field: "activo",
      headerName: "Estado",
      type: "chip",
      chipColors: { activo: "#b8e6d7", inactivo: "#ff7c7d" },
    },
  ];

  const [otherData, setOtherData] = useState({
    clientes: [],
  });

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/get-clients/"
        );
        const clientes = response.data.clients.map((client) => client.usuario);
        setOtherData({ clientes });
      } catch (error) {
        console.error("Error fetching clients:", error);
      }
    };

    fetchClientes();
  }, []);
  return (
    <ConsultView
      title="Mascotas"
      fetchUrl="http://localhost:8000/api/consult-mascotas/"
      deletionUrl="http://localhost:8000/api/delete-pet/"
      restoreUrl=""
      addComponent={AddPet}
      modifyComponent={ModifyPet}
      rowsPerPage={rowsPerPage}
      columns={columns}
      pkCol="mascota_id"
      visualIdentifierCol="nombre"
      otherData={otherData}
    />
  );
};

export default ConsultPets;
