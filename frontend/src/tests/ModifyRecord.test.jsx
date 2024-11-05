import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
  within,
} from "@testing-library/react";
import ModifyRecord from "../components/consultRecords/ModifyRecord";
import axios from "axios";

jest.mock("axios");

const mockHandleClose = jest.fn();
const mockOnSuccess = jest.fn();
const mockSelectedItem = {
  mascota_id: "311",
  fecha: "2024-10-10T00:00",
  peso: "2",
  diagnostico: "Sano",
  sintomas: ["Fiebre"],
  vacunas: ["Parvovirus Canino"],
  tratamientos: ["Infección respiratoria"],
};
const mockOtherData = {
  mascotas: [
    { mascota_id: "61", nombre: "Firulais", usuario_cliente: "andresqg" },
    {
      mascota_id: "311",
      nombre: "Paco Raban",
      usuario_cliente: "test_client1",
    },
  ],
  vacunas: [{ nombre: "Parvovirus Canino" }, { nombre: "Moquillo Canino" }],
  sintomas: [{ nombre: "Fiebre" }, { nombre: "Tos" }],
  tratamientos: [
    { nombre: "Infección respiratoria" },
    { nombre: "Infección gastrointestinal" },
  ],
};

describe("ModifyRecord Component", () => {
  test("renders ModifyRecord component", async () => {
    render(
      <ModifyRecord
        open={true}
        handleClose={mockHandleClose}
        onSuccess={mockOnSuccess}
        selectedItem={mockSelectedItem}
        otherData={mockOtherData}
      />
    );
    expect(screen.getByText("Modificar Expediente")).toBeInTheDocument();
  });

  test("submits form with valid data", async () => {
    render(
      <ModifyRecord
        open={true}
        handleClose={mockHandleClose}
        onSuccess={mockOnSuccess}
        selectedItem={mockSelectedItem}
        otherData={mockOtherData}
      />
    );

    await act(async () => {
      fireEvent.change(screen.getByLabelText("Peso (Kg)*"), {
        target: { value: "3" },
      });

      fireEvent.change(screen.getByLabelText("Diagnóstico*"), {
        target: { value: "Enfermo" },
      });
    });

    axios.put.mockResolvedValue({ status: 200 });

    const submitButton = screen.getByText("Modificar Expediente");
    await act(async () => {
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(mockOnSuccess).toHaveBeenCalledWith(
        "Expediente modificado exitosamente.",
        "success"
      );
    });
  });

  test("form validation fails when required fields are empty", async () => {
    render(
      <ModifyRecord
        open={true}
        handleClose={mockHandleClose}
        onSuccess={mockOnSuccess}
        selectedItem={mockSelectedItem}
        otherData={mockOtherData}
      />
    );

    await act(async () => {
      fireEvent.change(screen.getByLabelText("Peso (Kg)*"), {
        target: { value: "" },
      });

      fireEvent.change(screen.getByLabelText("Diagnóstico*"), {
        target: { value: "" },
      });
    });

    const submitButton = screen.getByText("Modificar Expediente");
    await act(async () => {
      fireEvent.click(submitButton);
    });

    expect(
      screen.getByText("Por favor, introduzca un peso válido")
    ).toBeInTheDocument();
    expect(screen.getByText("Diagnóstico es obligatorio")).toBeInTheDocument();
  });

  test("form validation fails when invalid data is provided", async () => {
    render(
      <ModifyRecord
        open={true}
        handleClose={mockHandleClose}
        onSuccess={mockOnSuccess}
        selectedItem={mockSelectedItem}
        otherData={mockOtherData}
      />
    );

    await act(async () => {
      fireEvent.change(screen.getByLabelText("Peso (Kg)*"), {
        target: { value: "-5" },
      });

      fireEvent.change(screen.getByLabelText("Diagnóstico*"), {
        target: { value: "A".repeat(256) }, // Exceeding 255 characters
      });
    });

    const submitButton = screen.getByText("Modificar Expediente");
    await act(async () => {
      fireEvent.click(submitButton);
    });

    expect(
      screen.getByText("Por favor, introduzca un peso válido")
    ).toBeInTheDocument();
    expect(
      screen.getByText("El diagnóstico no puede exceder 255 caracteres")
    ).toBeInTheDocument();
  });

  test("form submission fails with 404 error", async () => {
    render(
      <ModifyRecord
        open={true}
        handleClose={mockHandleClose}
        onSuccess={mockOnSuccess}
        selectedItem={mockSelectedItem}
        otherData={mockOtherData}
      />
    );

    await act(async () => {
      fireEvent.change(screen.getByLabelText("Peso (Kg)*"), {
        target: { value: "3" },
      });

      fireEvent.change(screen.getByLabelText("Diagnóstico*"), {
        target: { value: "Enfermo" },
      });
    });

    axios.put.mockRejectedValue({
      response: { status: 404, data: "Not Found" },
    });

    const submitButton = screen.getByText("Modificar Expediente");
    await act(async () => {
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(mockOnSuccess).toHaveBeenCalledWith(
        "Expediente no encontrado.",
        "error"
      );
    });
  });

  test("form submission fails with 400 error", async () => {
    render(
      <ModifyRecord
        open={true}
        handleClose={mockHandleClose}
        onSuccess={mockOnSuccess}
        selectedItem={mockSelectedItem}
        otherData={mockOtherData}
      />
    );

    await act(async () => {
      fireEvent.change(screen.getByLabelText("Peso (Kg)*"), {
        target: { value: "3" },
      });

      fireEvent.change(screen.getByLabelText("Diagnóstico*"), {
        target: { value: "Enfermo" },
      });
    });

    axios.put.mockRejectedValue({
      response: { status: 400, data: "Bad Request" },
    });

    const submitButton = screen.getByText("Modificar Expediente");
    await act(async () => {
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(mockOnSuccess).toHaveBeenCalledWith(
        "Datos inválidos. Revise los campos e intente nuevamente.",
        "error"
      );
    });
  });

  test("form submission fails with unknown error", async () => {
    render(
      <ModifyRecord
        open={true}
        handleClose={mockHandleClose}
        onSuccess={mockOnSuccess}
        selectedItem={mockSelectedItem}
        otherData={mockOtherData}
      />
    );

    await act(async () => {
      fireEvent.change(screen.getByLabelText("Peso (Kg)*"), {
        target: { value: "3" },
      });

      fireEvent.change(screen.getByLabelText("Diagnóstico*"), {
        target: { value: "Enfermo" },
      });
    });

    axios.put.mockRejectedValue(new Error("Network Error"));

    const submitButton = screen.getByText("Modificar Expediente");
    await act(async () => {
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(mockOnSuccess).toHaveBeenCalledWith(
        "Error desconocido. Inténtelo más tarde.",
        "error"
      );
    });
  });
});
