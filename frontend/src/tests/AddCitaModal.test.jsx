import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AddCitaModal from "../components/consultCitas/AddCitaModal";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { es } from "date-fns/locale";
import axios from "axios";

jest.mock("axios");

const mockHandleClose = jest.fn();
const mockOnSuccess = jest.fn();

const mockOtherData = {
  clientes: [{ usuario: "user1", nombre: "Client1" }],
  veterinarios: [{ usuario: "vet1", nombre: "Veterinarian1" }],
  clinicas: [{ clinica_id: 1, nombre: "Clinic1" }],
  services: [{ servicio_id: 1, nombre: "Service1" }],
  horarios: ["09:00", "10:00"],
  user: { role: 4, user: "user1" },
};

describe("AddCitaModal Component", () => {
  beforeEach(() => {
    render(
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
        <AddCitaModal
          open={true}
          handleClose={mockHandleClose}
          onSuccess={mockOnSuccess}
          otherData={mockOtherData}
        />
      </LocalizationProvider>
    );
  });

  it("disables the Cliente field when user role is 4", () => {
    const clienteField = screen.getByLabelText("Cliente");
    expect(clienteField).toBeDisabled();
  });

  it("displays validation error message if 'Cliente' field is empty", async () => {
    const submitButton = screen.getByRole("button", { name: /Agregar Cita/i });

    // Clear the "Cliente" field
    fireEvent.change(screen.getByLabelText("Cliente"), { target: { value: "" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Cliente requerido.")).toBeInTheDocument();
    });
  });

  it("displays validation error message if 'Veterinario' field is empty", async () => {
    const submitButton = screen.getByRole("button", { name: /Agregar Cita/i });

    // Clear the "Veterinario" field
    fireEvent.change(screen.getByLabelText("Veterinario"), { target: { value: "" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Veterinario requerido.")).toBeInTheDocument();
    });
  });

  it("displays validation error message if 'Clínica' field is empty", async () => {
    const submitButton = screen.getByRole("button", { name: /Agregar Cita/i });

    // Clear the "Clínica" field
    fireEvent.change(screen.getByLabelText("Clínica"), { target: { value: "" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Clínica requerida.")).toBeInTheDocument();
    });
  });

  it("displays validation error message if 'Mascota' field is empty", async () => {
    const submitButton = screen.getByRole("button", { name: /Agregar Cita/i });

    // Clear the "Mascota" field
    fireEvent.change(screen.getByLabelText("Mascota"), { target: { value: "" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Mascota requerida.")).toBeInTheDocument();
    });
  });

  it("resets the form to its initial state when 'Limpiar' button is clicked", () => {
    fireEvent.click(screen.getByText("Limpiar"));
    expect(screen.getByLabelText("Cliente")).toHaveValue("");
    expect(screen.getByLabelText("Veterinario")).toHaveValue("");
    expect(screen.getByLabelText("Motivo")).toHaveValue("");
    expect(screen.getByLabelText("Mascota")).toHaveValue("");
  });
});
