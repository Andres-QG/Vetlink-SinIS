import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ModifyPet from "../components/consultPets/ModifyPet";
import axios from "axios";

jest.mock("axios");

describe("ModifyPet Component", () => {
  const handleClose = jest.fn();
  const onSuccess = jest.fn();
  const selectedItem = {
    mascota_id: 1,
    usuario_cliente: "cliente1",
    nombre: "Firulais",
    fecha_nacimiento: "2015-05-20",
    especie: "Perro",
    raza: "Labrador",
    sexo: "M",
  };
  const otherData = {
    clientes: ["cliente1", "cliente2"],
  };

  test("renders the component with the provided data", () => {
    render(
      <ModifyPet
        open={true}
        handleClose={handleClose}
        onSuccess={onSuccess}
        selectedItem={selectedItem}
        otherData={otherData}
      />
    );

    expect(screen.getByText("Modificar Mascota")).toBeInTheDocument();
    expect(screen.getByDisplayValue("cliente1")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Firulais")).toBeInTheDocument();
  });

  test("updates form fields correctly", () => {
    render(
      <ModifyPet
        open={true}
        handleClose={handleClose}
        onSuccess={onSuccess}
        selectedItem={selectedItem}
        otherData={otherData}
      />
    );

    fireEvent.change(screen.getByLabelText("Nombre"), {
      target: { value: "Max" },
    });

    expect(screen.getByDisplayValue("Max")).toBeInTheDocument();
  });

  test("validates the form and shows errors", async () => {
    render(
      <ModifyPet
        open={true}
        handleClose={handleClose}
        onSuccess={onSuccess}
        selectedItem={selectedItem}
        otherData={otherData}
      />
    );

    fireEvent.change(screen.getByLabelText("Edad (años)"), {
      target: { value: "-1" },
    });

    fireEvent.click(screen.getByText("Modificar Mascota"));

    expect(
      await screen.findByText("Por favor, introduzca una edad válida")
    ).toBeInTheDocument();
  });

  test("calls onSuccess and handleClose on successful submission", async () => {
    axios.put.mockResolvedValue({ status: 200 });

    render(
      <ModifyPet
        open={true}
        handleClose={handleClose}
        onSuccess={onSuccess}
        selectedItem={selectedItem}
        otherData={otherData}
      />
    );

    fireEvent.change(screen.getByLabelText("Edad (años)"), {
      target: { value: "1" },
    });

    fireEvent.click(screen.getByText("Modificar Mascota"));

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalledWith(
        "Mascota actualizada exitosamente.",
        "success"
      );
      expect(handleClose).toHaveBeenCalled();
    });
  });

  test("clears the form when 'Limpiar' button is clicked", () => {
    render(
      <ModifyPet
        open={true}
        handleClose={handleClose}
        onSuccess={onSuccess}
        selectedItem={selectedItem}
        otherData={otherData}
      />
    );

    fireEvent.change(screen.getByLabelText("Nombre"), {
      target: { value: "Max" },
    });
    fireEvent.change(screen.getByLabelText("Edad (años)"), {
      target: { value: "5" },
    });

    fireEvent.mouseDown(screen.getByLabelText("Especie"));
    fireEvent.click(screen.getByText("Gato"));

    fireEvent.mouseDown(screen.getByLabelText("Raza"));
    fireEvent.click(screen.getByText("Persa"));

    fireEvent.mouseDown(screen.getByLabelText("Sexo"));
    fireEvent.click(screen.getByText("Hembra"));

    fireEvent.click(screen.getByText("Limpiar"));

    expect(screen.getByLabelText("Nombre").value).toBe("");
    expect(screen.getByLabelText("Edad (años)").value).toBe("");
  });

  test("shows validation errors when fields are empty", async () => {
    render(
      <ModifyPet
        open={true}
        handleClose={handleClose}
        onSuccess={onSuccess}
        selectedItem={selectedItem}
        otherData={otherData}
      />
    );

    fireEvent.change(screen.getByLabelText("Nombre"), {
      target: { value: "" },
    });
    fireEvent.change(screen.getByLabelText("Edad (años)"), {
      target: { value: "" },
    });

    fireEvent.click(screen.getByText("Modificar Mascota"));

    await waitFor(() => {
      expect(screen.getByText("Nombre es obligatorio")).toBeInTheDocument();
      expect(
        screen.getByText("Por favor, introduzca una edad válida")
      ).toBeInTheDocument();
    });
  });

  test("renders the component with the provided data", () => {
    render(
      <ModifyPet
        open={true}
        handleClose={handleClose}
        onSuccess={onSuccess}
        selectedItem={selectedItem}
        otherData={otherData}
      />
    );

    expect(screen.getByText("Modificar Mascota")).toBeInTheDocument();
    expect(screen.getByDisplayValue("cliente1")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Firulais")).toBeInTheDocument();
  });

  test("handles API error responses", async () => {
    axios.put.mockRejectedValue({
      response: { status: 400, data: { error: "Datos inválidos" } },
    });

    render(
      <ModifyPet
        open={true}
        handleClose={handleClose}
        onSuccess={onSuccess}
        selectedItem={selectedItem}
        otherData={otherData}
      />
    );

    fireEvent.change(screen.getByLabelText("Edad (años)"), {
      target: { value: "1" },
    });

    fireEvent.click(screen.getByText("Modificar Mascota"));

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalledWith(
        "Datos inválidos. Revise los campos e intente nuevamente.",
        "error"
      );
    });
  });
});
