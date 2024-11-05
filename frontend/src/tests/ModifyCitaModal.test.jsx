import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ModifyCitaModal from "../components/consultCitas/ModifyCitaModal";
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
  user: { role: 4, user: "user1" }, // Assuming role 4 is for client
};

const mockSelectedItem = {
  cliente_usuario: "user1",
  veterinario_usuario: "vet1",
  clinica_id: 1,
  mascota: "Pet1",
  mascota_id: 100,
  fecha: "2023-12-12",
  hora: "09:00",
  motivo: "Consulta general",
  services: [{ servicio_id: 1, nombre: "Service1" }],
};

describe("ModifyCitaModal Component", () => {
  beforeEach(() => {
    render(
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
        <ModifyCitaModal
          open={true}
          handleClose={mockHandleClose}
          onSuccess={mockOnSuccess}
          otherData={mockOtherData}
          selectedItem={mockSelectedItem}
        />
      </LocalizationProvider>
    );
  });

  it("renders the modal correctly with pre-filled data", () => {
    // Check if modal title is rendered
    expect(screen.getByText("Modificar Cita")).toBeInTheDocument();

    // Check if form fields are populated with initial data
    expect(screen.getByLabelText("Cliente")).toHaveValue("user1");
    expect(screen.getByLabelText("Veterinario")).toHaveValue("vet1");
    expect(screen.getByLabelText("Motivo")).toHaveValue("Consulta general");
  });

  it("disables the Cliente field when user role is 4", () => {
    const clienteField = screen.getByLabelText("Cliente");
    expect(clienteField).toBeDisabled();
  });

  it("displays validation error messages if required fields are empty", async () => {
    const motivoField = screen.getByLabelText("Motivo");
    const submitButton = screen.getByRole("button", { name: /Modificar Cita/i });

    // Clear the "Motivo" field to trigger validation error
    fireEvent.change(motivoField, { target: { value: "" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Motivo requerido.")).toBeInTheDocument();
    });
  });

  it("submits the form successfully", async () => {
    const submitButton = screen.getByRole("button", { name: /Modificar Cita/i });
    
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSuccess).toHaveBeenCalledWith("Cita modificada correctamente", "success");
      expect(mockHandleClose).toHaveBeenCalled();
    });
  });

  it("calls handleClose when clicking the close button", () => {
    const closeButton = screen.getByLabelText("Close");
    fireEvent.click(closeButton);
    expect(mockHandleClose).toHaveBeenCalled();
  });
});
