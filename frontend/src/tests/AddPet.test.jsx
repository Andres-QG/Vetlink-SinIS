// AddPet.test.jsx

import React from "react";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import AddPet from "../components/consultPets/AddPet";
import axios from "axios";
import "@testing-library/jest-dom";

jest.mock("axios");

describe("AddPet Component", () => {
  const handleClose = jest.fn();
  const onSuccess = jest.fn();
  const otherData = {
    user: { role: 3 },
    clientes: ["Cliente1", "Cliente2"],
  };

  beforeEach(() => {
    axios.post.mockClear();
    handleClose.mockClear();
    onSuccess.mockClear();
  });

  test("renders form fields correctly", () => {
    render(
      <AddPet
        open={true}
        handleClose={handleClose}
        onSuccess={onSuccess}
        otherData={otherData}
      />
    );

    expect(screen.getByLabelText(/Usuario Cliente/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Nombre/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Edad \(años\)/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Especie$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Raza$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Sexo$/i)).toBeInTheDocument();
  });

  test("displays validation errors when required fields are empty", async () => {
    render(
      <AddPet
        open={true}
        handleClose={handleClose}
        onSuccess={onSuccess}
        otherData={otherData}
      />
    );

    fireEvent.click(screen.getByText(/Agregar Mascota/i));

    await waitFor(() => {
      expect(
        screen.getByText(/Usuario cliente es obligatorio/i)
      ).toBeInTheDocument();
      expect(screen.getByText(/Nombre es obligatorio/i)).toBeInTheDocument();
      expect(
        screen.getByText(/Por favor, introduzca una edad válida/i)
      ).toBeInTheDocument();
    });
  });

  test("submits the form successfully", async () => {
    axios.post.mockResolvedValue({ status: 201 });

    render(
      <AddPet
        open={true}
        handleClose={handleClose}
        onSuccess={onSuccess}
        otherData={otherData}
      />
    );

    // Seleccionar Usuario Cliente
    const usuarioClienteInput = screen.getByLabelText(/Usuario Cliente/i);

    // Abrir las opciones del Autocomplete
    fireEvent.mouseDown(usuarioClienteInput);

    // Seleccionar una opción
    const opcionCliente = await screen.findByText("Cliente1");
    fireEvent.click(opcionCliente);

    // Completar otros campos
    fireEvent.change(screen.getByLabelText(/Nombre/i), {
      target: { value: "Firulais" },
    });
    fireEvent.change(screen.getByLabelText(/Edad \(años\)/i), {
      target: { value: "3" },
    });

    // Seleccionar Especie
    fireEvent.mouseDown(screen.getByLabelText(/^Especie$/i));
    const especieOption = await screen.findByText("Perro");
    fireEvent.click(especieOption);

    // Seleccionar Raza
    fireEvent.mouseDown(screen.getByLabelText(/^Raza$/i));
    const razaOption = await screen.findByText("Labrador");
    fireEvent.click(razaOption);

    // Seleccionar Sexo
    fireEvent.mouseDown(screen.getByLabelText(/^Sexo$/i));
    const sexoOption = await screen.findByText("Macho");
    fireEvent.click(sexoOption);

    // Enviar formulario
    fireEvent.click(screen.getByText(/Agregar Mascota/i));

    expect(screen.getByText(/Agregando.../i)).toBeInTheDocument();

    await waitFor(() =>
      expect(onSuccess).toHaveBeenCalledWith(
        "Mascota agregada exitosamente.",
        "success"
      )
    );
  });

  test("handles API error responses", async () => {
    axios.post.mockRejectedValue({ response: { status: 400 } });

    render(
      <AddPet
        open={true}
        handleClose={handleClose}
        onSuccess={onSuccess}
        otherData={otherData}
      />
    );

    // Interactuar con el Autocomplete de Usuario Cliente
    const usuarioClienteInput = screen.getByLabelText(/Usuario Cliente/i);

    // Abrir las opciones del Autocomplete
    fireEvent.mouseDown(usuarioClienteInput);

    // Seleccionar una opción
    const opcionCliente = await screen.findByText("Cliente1");
    fireEvent.click(opcionCliente);

    // Completar otros campos
    fireEvent.change(screen.getByLabelText(/Nombre/i), {
      target: { value: "Firulais" },
    });
    fireEvent.change(screen.getByLabelText(/Edad \(años\)/i), {
      target: { value: "3" },
    });

    // Seleccionar Especie
    fireEvent.mouseDown(screen.getByLabelText(/^Especie$/i));
    const especieOption = await screen.findByText("Perro");
    fireEvent.click(especieOption);

    // Seleccionar Raza
    fireEvent.mouseDown(screen.getByLabelText(/^Raza$/i));
    const razaOption = await screen.findByText("Labrador");
    fireEvent.click(razaOption);

    // Seleccionar Sexo
    fireEvent.mouseDown(screen.getByLabelText(/^Sexo$/i));
    const sexoOption = await screen.findByText("Macho");
    fireEvent.click(sexoOption);

    // Enviar formulario
    fireEvent.click(screen.getByText(/Agregar Mascota/i));

    // Esperar a que onSuccess sea llamado con el mensaje de error
    await waitFor(() =>
      expect(onSuccess).toHaveBeenCalledWith(
        "Datos inválidos. Revise los campos e intente nuevamente.",
        "error"
      )
    );
  });
});
