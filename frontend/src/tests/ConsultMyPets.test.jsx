import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import ConsultMyPets from "../routes/ConsultMyPets";
import axios from "axios";

jest.mock("axios");

describe("ConsultMyPets Component", () => {
  beforeEach(() => {
    axios.get.mockResolvedValue({
      data: {
        results: [
          {
            MASCOTA_ID: 1,
            NOMBRE: "Fido",
            ESPECIE: "Perro",
            RAZA: "Labrador",
            FECHA_NACIMIENTO: "2020-01-01",
            SEXO: "M",
          },
          {
            MASCOTA_ID: 2,
            NOMBRE: "Whiskers",
            ESPECIE: "Gato",
            RAZA: "Persa",
            FECHA_NACIMIENTO: "2018-05-10",
            SEXO: "H",
          },
        ],
      },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("TC-44: Cargar y mostrar lista inicial de mascotas", async () => {
    render(<ConsultMyPets />);

    await waitFor(() => {
      expect(screen.getByText("Fido")).toBeInTheDocument();
      expect(screen.getByText("Whiskers")).toBeInTheDocument();
    });
  });

  test("TC-45: Filtrar lista de mascotas por nombre (Fido)", async () => {
    render(<ConsultMyPets />);

    await waitFor(() => screen.getByText("Fido"));

    fireEvent.change(screen.getByRole("textbox", { name: "Search Pets" }), {
      target: { value: "Fido" },
    });
    fireEvent.submit(screen.getByRole("button", { name: /Search/i }));

    await waitFor(() => {
      expect(screen.getByText("Fido")).toBeInTheDocument();
      expect(screen.queryByText("Whiskers")).not.toBeInTheDocument();
    });
  });

  test("TC-46: Mostrar mensaje al no encontrar mascotas", async () => {
    render(<ConsultMyPets />);

    await waitFor(() => screen.getByText("Fido"));

    fireEvent.change(screen.getByRole("textbox", { name: "Search Pets" }), {
      target: { value: "Inexistente" },
    });
    fireEvent.submit(screen.getByRole("button", { name: /Search/i }));

    await waitFor(() => {
      expect(
        screen.getByText(
          /No se encontraron mascotas para el criterio de búsqueda especificado/i
        )
      ).toBeInTheDocument();
    });
  });

  test("TC-47: Verificar la paginación de la lista de mascotas", async () => {
    axios.get.mockResolvedValue({
      data: {
        results: new Array(16).fill(0).map((_, i) => ({
          MASCOTA_ID: i + 1,
          NOMBRE: `Mascota ${i + 1}`,
          ESPECIE: i % 2 === 0 ? "Perro" : "Gato",
          RAZA: i % 2 === 0 ? "Labrador" : "Persa",
          FECHA_NACIMIENTO: "2020-01-01",
          SEXO: "M",
        })),
      },
    });

    render(<ConsultMyPets />);

    await waitFor(() => screen.getByText("Mascota 1"));

    fireEvent.click(screen.getByRole("button", { name: /2/i }));

    await waitFor(() => {
      expect(screen.getByText("Mascota 9")).toBeInTheDocument();
    });
  });

  test("TC-50: Verificar que el modal para agregar mascota se abre correctamente", async () => {
    render(<ConsultMyPets />);

    await waitFor(() => screen.getByText("Agregar Mascota"));

    const addButton = screen.getByRole("button", { name: /Agregar Mascota/i });
    fireEvent.click(addButton);

    await waitFor(() => {
      // Buscar el encabezado "Agregar Mascota" como título (heading) en el modal
      expect(
        screen.getByRole("heading", { name: "Agregar Mascota" })
      ).toBeInTheDocument();
    });
  });

  test("TC-51: Verificar que el modal para editar mascota se abre correctamente", async () => {
    render(<ConsultMyPets />);

    await waitFor(() => screen.getByText("Fido"));

    const editButton = screen.getAllByRole("button", { name: /Editar/i })[0];
    fireEvent.click(editButton);

    await waitFor(() => {
      // Buscar el encabezado "Modificar Mascota" como título (heading) en el modal
      expect(
        screen.getByRole("heading", { name: "Modificar Mascota" })
      ).toBeInTheDocument();
    });
  });
});
