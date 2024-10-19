import ConsultView from "../components/Consult/ConsultView";
import AddPet from "../components/consultPets/AddPet";
import ModifyPet from "../components/consultPets/ModifyPet";

const ConsultPets = () => {
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
