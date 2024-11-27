import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import ModifyMyPets from "../components/ConsultMyPets/ModifyMyPets";
import dayjs from "dayjs";
import axios from "axios";

jest.mock("axios");

const petData = {
  MASCOTA_ID: 1,
  NOMBRE: "Fido",
  FECHA_NACIMIENTO: dayjs("2020-01-01").format("YYYY-MM-DD"),
  ESPECIE: "Perro",
  RAZA: "Labrador",
  SEXO: "M",
};

describe("ModifyMyPets Component", () => {
  const handleClose = jest.fn();
  const onSuccess = jest.fn();

  const renderComponent = (open = true) => {
    render(
      <ModifyMyPets
        open={open}
        handleClose={handleClose}
        petData={petData}
        onSuccess={onSuccess}
      />
    );
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("1: Cierra el modal al hacer clic en 'Cancelar'", () => {
    renderComponent();

    fireEvent.click(screen.getByRole("button", { name: /Cancelar/i }));

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  test("2: Envía datos válidos correctamente", async () => {
    axios.put.mockResolvedValueOnce({ status: 200 });
    renderComponent();

    fireEvent.change(screen.getByLabelText(/Nombre/i), {
      target: { value: "Max" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Guardar Cambios/i }));

    await waitFor(() => {
      expect(axios.put).toHaveBeenCalledWith(
        `http://localhost:8000/api/update-my-pet/${petData.MASCOTA_ID}/`,
        expect.objectContaining({
          nombre: "Max",
          especie: "Perro",
          raza: "Labrador",
          sexo: "M",
        }),
        expect.any(Object)
      );
      expect(onSuccess).toHaveBeenCalledWith(
        "Mascota modificada exitosamente",
        "success"
      );
    });
  });

  test("3: Maneja errores al fallar la solicitud de modificación", async () => {
    axios.put.mockRejectedValueOnce({
      response: {
        data: { error: "Error al modificar la mascota" },
      },
    });

    renderComponent();

    fireEvent.click(screen.getByRole("button", { name: /Guardar Cambios/i }));

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalledWith(
        "Error al modificar la mascota",
        "error"
      );
    });
  });
});
