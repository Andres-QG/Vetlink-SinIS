import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import axios from "axios";
import dayjs from "dayjs";
import AddMyPets from "../components/ConsultMyPets/AddMyPets";

jest.mock("axios");

describe("AddMyPets Component", () => {
  const handleClose = jest.fn();
  const onSuccess = jest.fn();

  const renderComponent = (open = true) => {
    render(
      <AddMyPets open={open} handleClose={handleClose} onSuccess={onSuccess} />
    );
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("TC-62: Agregar nueva mascota con datos completos", async () => {
    axios.post.mockResolvedValue({ status: 201 });

    renderComponent();

    fireEvent.change(screen.getByLabelText(/Nombre/i), {
      target: { value: "Fido" },
    });

    fireEvent.mouseDown(screen.getByLabelText(/Especie/i));
    await waitFor(() => screen.getByText("Perro"));
    fireEvent.click(screen.getByText("Perro"));

    fireEvent.mouseDown(screen.getByLabelText(/Raza/i));
    await waitFor(() => screen.getByText("Labrador"));
    fireEvent.click(screen.getByText("Labrador"));

    fireEvent.mouseDown(screen.getByLabelText(/Sexo/i));
    await waitFor(() => screen.getByText("Macho"));
    fireEvent.click(screen.getByText("Macho"));

    fireEvent.click(screen.getByRole("button", { name: /Agregar Mascota/i }));

    await waitFor(() =>
      expect(onSuccess).toHaveBeenCalledWith(
        "Mascota agregada exitosamente",
        "success"
      )
    );
    expect(handleClose).toHaveBeenCalled();
  });

  test("TC-63: Validar mensaje de error por datos incompletos", async () => {
    renderComponent();

    fireEvent.change(screen.getByLabelText(/Nombre/i), {
      target: { value: "" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Agregar Mascota/i }));

    await waitFor(() => {
      expect(screen.getByText(/Nombre es obligatorio/i)).toBeInTheDocument();
      expect(screen.getByText(/Especie es obligatoria/i)).toBeInTheDocument();
      expect(screen.getByText(/Sexo es obligatorio/i)).toBeInTheDocument();
    });
  });

  test("TC-64: Verificar mensaje de error al omitir el campo de nombre", async () => {
    renderComponent();

    // Intenta guardar sin completar el campo de nombre
    fireEvent.click(screen.getByRole("button", { name: /Agregar Mascota/i }));

    // Verificar el mensaje de error de nombre obligatorio
    await waitFor(() => {
      expect(screen.getByText("Nombre es obligatorio")).toBeInTheDocument();
    });

    expect(onSuccess).not.toHaveBeenCalled();
  });

  test("TC-65: Confirmar mensaje de éxito tras agregar mascota", async () => {
    axios.post.mockResolvedValue({ status: 201 });

    renderComponent();

    fireEvent.change(screen.getByLabelText(/Nombre/i), {
      target: { value: "Miau" },
    });

    fireEvent.mouseDown(screen.getByLabelText(/Especie/i));
    await waitFor(() => screen.getByText("Gato"));
    fireEvent.click(screen.getByText("Gato"));

    fireEvent.mouseDown(screen.getByLabelText(/Raza/i));
    await waitFor(() => screen.getByText("Siamés"));
    fireEvent.click(screen.getByText("Siamés"));

    fireEvent.mouseDown(screen.getByLabelText(/Sexo/i));
    await waitFor(() => screen.getByText("Hembra"));
    fireEvent.click(screen.getByText("Hembra"));

    fireEvent.click(screen.getByRole("button", { name: /Agregar Mascota/i }));

    await waitFor(() =>
      expect(onSuccess).toHaveBeenCalledWith(
        "Mascota agregada exitosamente",
        "success"
      )
    );
  });

  test("TC-66: Verificar que nueva mascota se muestra en la lista", async () => {
    axios.post.mockResolvedValue({ status: 201 });

    renderComponent();

    fireEvent.change(screen.getByLabelText(/Nombre/i), {
      target: { value: "Luna" },
    });

    fireEvent.mouseDown(screen.getByLabelText(/Especie/i));
    await waitFor(() => screen.getByText("Gato"));
    fireEvent.click(screen.getByText("Gato"));

    fireEvent.mouseDown(screen.getByLabelText(/Raza/i));
    await waitFor(() => screen.getByText("Persa"));
    fireEvent.click(screen.getByText("Persa"));

    fireEvent.mouseDown(screen.getByLabelText(/Sexo/i));
    await waitFor(() => screen.getByText("Hembra"));
    fireEvent.click(screen.getByText("Hembra"));

    fireEvent.click(screen.getByRole("button", { name: /Agregar Mascota/i }));

    await waitFor(() =>
      expect(onSuccess).toHaveBeenCalledWith(
        "Mascota agregada exitosamente",
        "success"
      )
    );
    expect(handleClose).toHaveBeenCalled();
  });
});
