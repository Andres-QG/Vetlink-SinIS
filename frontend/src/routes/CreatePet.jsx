import axios from "axios";
import {
  TextInput,
  DateInput,
  SelectInput,
} from "../components/FormComponents";
import { useState } from "react";

const AddPetForm = () => {
  const [formData, setFormData] = useState({
    usuario_cliente: "",
    nombre: "",
    fecha_nacimiento: "",
    especie: "",
    raza: "",
    sexo: "M",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formattedDate = new Date(formData.fecha_nacimiento)
      .toISOString()
      .split("T")[0];

    try {
      const response = await axios.post(
        "http://localhost:8000/api/create-pet/",
        {
          ...formData,
          fecha_nacimiento: formattedDate,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201) {
        alert("Mascota agregada exitosamente");
        setFormData({
          usuario_cliente: "",
          nombre: "",
          fecha_nacimiento: "",
          especie: "",
          raza: "",
          sexo: "M",
        });
      }
    } catch (error) {
      console.error(
        "Error al agregar la mascota:",
        error.response?.data || error.message
      );
      const errorMessage = error.response?.data
        ? JSON.stringify(error.response.data)
        : "Error desconocido";
      alert("Hubo un error al agregar la mascota: " + errorMessage);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-bgsecondary p-8 mt-10 rounded shadow font-montserrat">
      <h2 className="text-2xl font-bold mb-6 text-center text-secondary">
        Agregar Mascota
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <TextInput
          label="Usuario Cliente"
          name="usuario_cliente"
          value={formData.usuario_cliente}
          onChange={handleChange}
          required={true}
        />
        <TextInput
          label="Nombre de la Mascota"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          required={true}
        />
        <DateInput
          label="Fecha de Nacimiento"
          name="fecha_nacimiento"
          value={formData.fecha_nacimiento}
          onChange={handleChange}
        />
        <TextInput
          label="Especie"
          name="especie"
          value={formData.especie}
          onChange={handleChange}
          required={true}
        />
        <TextInput
          label="Raza"
          name="raza"
          value={formData.raza}
          onChange={handleChange}
        />
        <SelectInput
          label="Sexo"
          name="sexo"
          value={formData.sexo}
          onChange={handleChange}
          options={[
            { value: "M", label: "Macho" },
            { value: "H", label: "Hembra" },
          ]}
        />
        <button
          type="submit"
          className="w-full bg-brand text-white py-2 rounded font-semibold hover:bg-teal-600"
        >
          Agregar Mascota
        </button>
      </form>
    </div>
  );
};

export default AddPetForm;
