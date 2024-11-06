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

  test("TC-50: Editar el nombre de una mascota", async () => {
    axios.put.mockResolvedValue({ status: 200 });
    renderComponent();

    fireEvent.change(screen.getByLabelText(/Nombre/i), {
      target: { value: "Max" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Modificar Mascota/i }));

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalledWith(
        "Mascota modificada exitosamente",
        "success"
      );
    });
  });

  test("TC-51: Cambiar la especie de una mascota", async () => {
    axios.put.mockResolvedValue({ status: 200 });
    renderComponent();

    // Cambiar la especie a "Gato"
    fireEvent.mouseDown(screen.getByLabelText(/Especie/i));
    await waitFor(() => screen.getByText("Gato"));
    fireEvent.click(screen.getByText("Gato"));

    // Seleccionar una raza compatible después de cambiar la especie
    fireEvent.mouseDown(screen.getByLabelText(/Raza/i));
    await waitFor(() => screen.getByText("Siamés"));
    fireEvent.click(screen.getByText("Siamés"));

    // Asegura que el formulario esté completo y luego intenta modificar la mascota
    fireEvent.click(screen.getByRole("button", { name: /Modificar Mascota/i }));

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalledWith(
        "Mascota modificada exitosamente",
        "success"
      );
    });
  });

  test("TC-52: Cambiar la fecha de nacimiento de la mascota", async () => {
    axios.put.mockResolvedValue({ status: 200 });
    renderComponent();

    // Cambiar la fecha a una fecha válida en el pasado
    fireEvent.change(screen.getByLabelText(/Fecha de Nacimiento/i), {
      target: { value: dayjs("2019-05-20").format("YYYY-MM-DD") },
    });

    fireEvent.click(screen.getByRole("button", { name: /Modificar Mascota/i }));

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalledWith(
        "Mascota modificada exitosamente",
        "success"
      );
    });
  });

  test("TC-53: Actualizar la raza de la mascota", async () => {
    axios.put.mockResolvedValue({ status: 200 });
    renderComponent();

    fireEvent.mouseDown(screen.getByLabelText(/Raza/i));
    await waitFor(() => screen.getByText("Beagle"));
    fireEvent.click(screen.getByText("Beagle"));

    fireEvent.click(screen.getByRole("button", { name: /Modificar Mascota/i }));

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalledWith(
        "Mascota modificada exitosamente",
        "success"
      );
    });
  });

  test("TC-54: Revisar cambios de múltiples campos", async () => {
    axios.put.mockResolvedValue({ status: 200 });
    renderComponent();

    fireEvent.change(screen.getByLabelText(/Nombre/i), {
      target: { value: "Bobby" },
    });
    fireEvent.mouseDown(screen.getByLabelText(/Especie/i));
    await waitFor(() => screen.getByText("Gato"));
    fireEvent.click(screen.getByText("Gato"));
    fireEvent.mouseDown(screen.getByLabelText(/Raza/i));
    await waitFor(() => screen.getByText("Siamés"));
    fireEvent.click(screen.getByText("Siamés"));
    fireEvent.change(screen.getByLabelText(/Fecha de Nacimiento/i), {
      target: { value: dayjs("2018-03-12").format("YYYY-MM-DD") },
    });

    fireEvent.click(screen.getByRole("button", { name: /Modificar Mascota/i }));

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalledWith(
        "Mascota modificada exitosamente",
        "success"
      );
    });
  });

  test("TC-55: Cancelar modificación y verificar que no se guarden cambios", async () => {
    renderComponent();

    fireEvent.change(screen.getByLabelText(/Nombre/i), {
      target: { value: "Rex" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Cancelar/i }));

    expect(onSuccess).not.toHaveBeenCalled();
    expect(handleClose).toHaveBeenCalled();
  });
});
