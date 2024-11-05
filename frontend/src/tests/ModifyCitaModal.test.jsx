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

    it("renders the Cliente field with initial data", () => {
        expect(screen.getByLabelText("Cliente")).toHaveValue("user1");
    });

    it("renders the Veterinario field with initial data", () => {
        expect(screen.getByLabelText("Veterinario")).toHaveValue("vet1");
    });

    it("renders the Clínica field with initial data", () => {
        expect(screen.getByLabelText("Clínica")).toHaveValue("Clinic1");
    });

    it("renders the Mascota field with initial data", () => {
        expect(screen.getByLabelText("Mascota")).toHaveValue("Pet1");
    });

    it("renders the Motivo field with initial data", () => {
        expect(screen.getByLabelText("Motivo")).toHaveValue("Consulta general");
    });

    it("disables the Cliente field when user role is 4", () => {
        const clienteField = screen.getByLabelText("Cliente");
        expect(clienteField).toBeDisabled();
    });

    it("displays validation error message if 'Cliente' field is empty", async () => {
        const submitButton = screen.getByRole("button", { name: /Modificar Cita/i });

        // Clear the "Cliente" field
        fireEvent.change(screen.getByLabelText("Cliente"), { target: { value: "" } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText("Cliente requerido.")).toBeInTheDocument();
        });
    });

    it("displays validation error message if 'Veterinario' field is empty", async () => {
        const submitButton = screen.getByRole("button", { name: /Modificar Cita/i });

        // Clear the "Veterinario" field
        fireEvent.change(screen.getByLabelText("Veterinario"), { target: { value: "" } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText("Veterinario requerido.")).toBeInTheDocument();
        });
    });

    it("displays validation error message if 'Clínica' field is empty", async () => {
        const submitButton = screen.getByRole("button", { name: /Modificar Cita/i });

        // Clear the "Clínica" field
        fireEvent.change(screen.getByLabelText("Clínica"), { target: { value: "" } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText("Clínica requerida.")).toBeInTheDocument();
        });
    });

    it("displays validation error message if 'Mascota' field is empty", async () => {
        const submitButton = screen.getByRole("button", { name: /Modificar Cita/i });

        // Clear the "Mascota" field
        fireEvent.change(screen.getByLabelText("Mascota"), { target: { value: "" } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText("Mascota requerida.")).toBeInTheDocument();
        });
    });

    it("resets the form to its initial state when 'Limpiar' button is clicked", () => {
        fireEvent.click(screen.getByText("Limpiar"));
        const clienteField = screen.getByLabelText("Cliente");
        expect(clienteField).toBeDisabled();
        expect(screen.getByLabelText("Cliente")).toHaveValue("");
        expect(screen.getByLabelText("Veterinario")).toHaveValue("");
        expect(screen.getByLabelText("Motivo")).toHaveValue("");
        expect(screen.getByLabelText("Mascota")).toHaveValue("");
    });

    it("submits the form successfully", async () => {
    const submitButton = screen.getByRole("button", { name: /Modificar Cita/i });
    
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSuccess).toHaveBeenCalledWith("Cita modificada correctamente", "success");
      expect(mockHandleClose).toHaveBeenCalled();
    });
  });

});
