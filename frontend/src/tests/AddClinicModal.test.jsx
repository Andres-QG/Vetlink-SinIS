import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AddClinicModal from "../components/consultClinics/AddClinicModal";
import axios from "axios";

jest.mock("axios");

const mockHandleClose = jest.fn();
const mockOnSuccess = jest.fn();

describe("AddClinicModal Component", () => {
    beforeEach(() => {
        render(
            <AddClinicModal
                open={true}
                handleClose={mockHandleClose}
                onSuccess={mockOnSuccess}
            />
        );
    });

    it("renders input fields for clinic details", () => {
        expect(screen.getByText("Clinica")).toBeInTheDocument();
        expect(screen.getByText("Direccion")).toBeInTheDocument();
        expect(screen.getByText("Teléfono")).toBeInTheDocument();
        expect(screen.getByText("Dueño")).toBeInTheDocument();
    });
    it("displays validation error if 'Clinica' field is empty", async () => {
        const submitButton = screen.getByRole("button", { name: /Agregar Clinica/i });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText("El nombre de la clinica es requerido.")).toBeInTheDocument();
        });
    });

    it("displays validation error if 'Direccion' field is empty", async () => {
        const submitButton = screen.getByRole("button", { name: /Agregar Clinica/i });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText("La dirección es requerida.")).toBeInTheDocument();
        });
    });

    it("displays validation error if 'Teléfono' field is empty or invalid", async () => {
        const submitButton = screen.getByRole("button", { name: /Agregar Clinica/i });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText("El teléfono debe tener 8 dígitos.")).toBeInTheDocument();
        });
    });


    it("displays validation error if 'Teléfono' field is invalid", async () => {
    fireEvent.change(screen.getByPlaceholderText("Digíte el teléfono"), { target: { value: "123" } });
      const submitButton = screen.getByRole("button", { name: /Agregar Clinica/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
          expect(screen.getByText("El teléfono debe tener 8 dígitos.")).toBeInTheDocument();
      });
  });

  it("resets the form when 'Limpiar' button is clicked", () => {
    fireEvent.change(screen.getByLabelText("Clinica *"), { target: { value: "Test Clinic" } });
    fireEvent.change(screen.getByLabelText("Direccion *"), { target: { value: "Test Address" } });
    fireEvent.change(screen.getByLabelText("Teléfono *"), { target: { value: "12345678" } });

    fireEvent.click(screen.getByRole("button", { name: /Limpiar/i }));

    expect(screen.getByLabelText("Clinica *")).toHaveValue("");
    expect(screen.getByLabelText("Direccion *")).toHaveValue("");
    expect(screen.getByLabelText("Teléfono *")).toHaveValue("");
  });
});
