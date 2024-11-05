import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ModifyClinicModal from "../components/consultClinics/ModifyClinicModal";
import axios from "axios";

jest.mock("axios");

const mockHandleClose = jest.fn();
const mockOnSuccess = jest.fn();

const mockSelectedItem = {
  clinica_id: 1,
  clinica: "Clinica ABC",
  direccion: "123 Main St",
  telefono: "12345678",
  dueño: "Owner1",
};

describe("ModifyClinicModal Component", () => {
  beforeEach(() => {
    render(
      <ModifyClinicModal
        open={true}
        handleClose={mockHandleClose}
        onSuccess={mockOnSuccess}
        selectedItem={mockSelectedItem}
      />
    );
  });

  it("pre-fills fields with selectedItem data", () => {
    expect(screen.getByLabelText("Clínica *")).toHaveValue("Clinica ABC");
    expect(screen.getByLabelText("Direccion *")).toHaveValue("123 Main St");
    expect(screen.getByLabelText("Teléfono *")).toHaveValue("12345678");
    expect(screen.getByLabelText("Dueño *")).toHaveValue("Owner1");
  });

  it("displays validation error if 'Clínica' field is empty", async () => {
    fireEvent.change(screen.getByLabelText("Clínica *"), { target: { value: "" } });
    const submitButton = screen.getByRole("button", { name: /Modificar Clinica/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("El nombre de la clinica es requerido.")).toBeInTheDocument();
    });
  });

  it("displays validation error if 'Direccion' field is empty", async () => {
    fireEvent.change(screen.getByLabelText("Direccion *"), { target: { value: "" } });
    const submitButton = screen.getByRole("button", { name: /Modificar Clinica/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("La dirección es requerida.")).toBeInTheDocument();
    });
  });

  it("displays validation error if 'Teléfono' field is empty or invalid", async () => {
    fireEvent.change(screen.getByLabelText("Teléfono *"), { target: { value: "" } });
    const submitButton = screen.getByRole("button", { name: /Modificar Clinica/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("El teléfono debe tener 8 dígitos.")).toBeInTheDocument();
    });
  });

  it("calls onSuccess with success message on successful submission", async () => {
    axios.put.mockResolvedValueOnce({ data: { message: "Clínica modificada" } });

    const submitButton = screen.getByRole("button", { name: /Modificar Clinica/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSuccess).toHaveBeenCalledWith("Clínica modificada", "success");
      expect(mockHandleClose).toHaveBeenCalled();
    });
  });

  it("displays error message if API call fails", async () => {
    axios.put.mockRejectedValueOnce(new Error("Network error"));

    const submitButton = screen.getByRole("button", { name: /Modificar Clinica/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSuccess).toHaveBeenCalledWith("No se pudo modificar la clínica", "error");
    });
  });

  it("resets the form to initial selectedItem data when 'Limpiar' button is clicked", () => {
    // Modify form data
    fireEvent.change(screen.getByLabelText("Clínica *"), { target: { value: "New Clinic Name" } });
    fireEvent.change(screen.getByLabelText("Direccion *"), { target: { value: "456 New St" } });
    fireEvent.change(screen.getByLabelText("Teléfono *"), { target: { value: "87654321" } });

    // Click 'Limpiar' to reset
    const clearButton = screen.getByRole("button", { name: /Limpiar/i });
    fireEvent.click(clearButton);

    // Verify fields are reset to selectedItem data
    expect(screen.getByLabelText("Clínica *")).toHaveValue("Clinica ABC");
    expect(screen.getByLabelText("Direccion *")).toHaveValue("123 Main St");
    expect(screen.getByLabelText("Teléfono *")).toHaveValue("12345678");
    expect(screen.getByLabelText("Dueño *")).toHaveValue("Owner1");
  });
});
