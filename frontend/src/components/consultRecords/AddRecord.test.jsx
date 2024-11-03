import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AddRecord from "./AddRecord";

const mockHandleClose = jest.fn();
const mockOnSuccess = jest.fn();
const mockOtherData = {
  mascotas: [
    { mascota_id: "61", nombre: "Firulais", usuario_cliente: "andresqg" },
    {
      mascota_id: "102",
      nombre: "Paco Raban",
      usuario_cliente: "test_client1",
    },
  ],
  vacunas: [{ nombre: "Parvovirus Canino" }, { nombre: "Moquillo Canino" }],
  sintomas: [{ nombre: "Fiebre" }, { nombre: "Fiebre" }],
  tratamientos: [
    { nombre: "Infección respiratoria" },
    { nombre: "Infección respiratoria" },
  ],
};

describe("AddRecord Component", () => {
  test("renders AddRecord component", () => {
    render(
      <AddRecord
        open={true}
        handleClose={mockHandleClose}
        onSuccess={mockOnSuccess}
        otherData={mockOtherData}
      />
    );
    expect(screen.getByText("Agregar Expediente")).toBeInTheDocument();
  });

  test("validates form fields", async () => {
    render(
      <AddRecord
        open={true}
        handleClose={mockHandleClose}
        onSuccess={mockOnSuccess}
        otherData={mockOtherData}
      />
    );

    fireEvent.click(screen.getByText("Agregar Expediente"));

    await waitFor(() => {
      expect(
        screen.getByText("Nombre de mascota es obligatorio")
      ).toBeInTheDocument();
      expect(screen.getByText("Fecha es obligatoria")).toBeInTheDocument();
      expect(
        screen.getByText("Por favor, introduzca un peso válido")
      ).toBeInTheDocument();
      expect(
        screen.getByText("Diagnóstico es obligatorio")
      ).toBeInTheDocument();
      expect(screen.getByText("Síntomas son obligatorios")).toBeInTheDocument();
      expect(screen.getByText("Vacunas son obligatorias")).toBeInTheDocument();
      expect(
        screen.getByText("Tratamientos son obligatorios")
      ).toBeInTheDocument();
    });
  });

  test("submits form with valid data", async () => {
    render(
      <AddRecord
        open={true}
        handleClose={mockHandleClose}
        onSuccess={mockOnSuccess}
        otherData={mockOtherData}
      />
    );

    userEvent.type(screen.getByLabelText("ID de la mascota*"), "61");
    userEvent.type(
      screen.getByLabelText("Fecha y hora de consulta*"),
      "2024-10-25T00:00:00"
    );
    userEvent.type(screen.getByLabelText("Peso (Kg)*"), "2");
    userEvent.type(
      screen.getByLabelText("Diagnóstico*"),
      "Infección respiratoria"
    );

    fireEvent.click(screen.getByText("Agregar Expediente"));

    await waitFor(() => {
      expect(mockOnSuccess).toHaveBeenCalledWith(
        "Expediente agregado exitosamente.",
        "success"
      );
    });
  });
});
