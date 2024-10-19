import ConsultView from "../components/Consult/ConsultView";
import AddPet from "../components/consultPets/AddPet";
import ModifyPet from "../components/consultPets/ModifyPet";

const ConsultPets = () => {
  const columns = [
    { field: "usuario_cliente", headerName: "Dueño" },
    { field: "nombre", headerName: "Nombre" },
    { field: "fecha_nacimiento", headerName: "Fecha de nacimiento" },
    { field: "especie", headerName: "Especie" },
    { field: "raza", headerName: "Raza" },
    { field: "sexo", headerName: "Sexo" },
  ];

  return (
    <ConsultView
      title="Consultar Mascotas"
      fetchUrl="http://localhost:8000/api/consult-mascotas/"
      deletionUrl="http://localhost:8000/api/delete-pet"
      addComponent={AddPet}
      modifyComponent={ModifyPet}
      columns={columns}
      pkCol="mascota_id"
      visualIdentifierCol="nombre"
    />
  );
};

export default ConsultPets;
