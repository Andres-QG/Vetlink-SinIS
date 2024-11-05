import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AddClinicModal from "../components/consultClinics/AddClinicModal";
import axios from "axios";

jest.mock("axios");

const mockHandleClose = jest.fn();
const mockOnSuccess = jest.fn();

const mockOtherData = {
    owners: [
        { usuario: "owner1", nombre: "Owner One" },
        { usuario: "owner2", nombre: "Owner Two" },
    ],
};

describe("AddClinicModal Component", () => {
    beforeEach(() => {
        render(
            <AddClinicModal
                open={true}
                handleClose={mockHandleClose}
                onSuccess={mockOnSuccess}
                otherData={mockOtherData}
            />
        );
    });

    it("renders input fields for clinic details", () => {
        expect(screen.getByLabelText("Clinica *")).toBeInTheDocument();
        expect(screen.getByLabelText("Direccion *")).toBeInTheDocument();
        expect(screen.getByLabelText("Teléfono *")).toBeInTheDocument();
        expect(screen.getByLabelText("Dueño *")).toBeInTheDocument();
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
        fireEvent.change(screen.getByLabelText("Teléfono *"), { target: { value: "123" } });
        const submitButton = screen.getByRole("button", { name: /Agregar Clinica/i });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText("El teléfono debe tener 8 dígitos.")).toBeInTheDocument();
        });
    });

    it("displays owners from otherData in the 'Dueño' dropdown", () => {
        fireEvent.mouseDown(screen.getByLabelText("Dueño *"));
        expect(screen.getByText("Owner One")).toBeInTheDocument();
        expect(screen.getByText("Owner Two")).toBeInTheDocument();
    });

    it("calls onSuccess with success message on successful submission", async () => {
        axios.post.mockResolvedValueOnce({ data: { message: "Clínica agregada correctamente" } });

        fireEvent.change(screen.getByLabelText("Clinica *"), { target: { value: "Test Clinic" } });
        fireEvent.change(screen.getByLabelText("Direccion *"), { target: { value: "Test Address" } });
        fireEvent.change(screen.getByLabelText("Teléfono *"), { target: { value: "12345678" } });
        fireEvent.mouseDown(screen.getByLabelText("Dueño *"));
        fireEvent.click(screen.getByText("Owner One"));

        const submitButton = screen.getByRole("button", { name: /Agregar Clinica/i });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(mockOnSuccess).toHaveBeenCalledWith("Clínica agregada correctamente", "success");
            expect(mockHandleClose).toHaveBeenCalled();
        });
    });

    it("displays error message if API call fails", async () => {
        axios.post.mockRejectedValueOnce(new Error("Network error"));

        fireEvent.change(screen.getByLabelText("Clinica *"), { target: { value: "Test Clinic" } });
        fireEvent.change(screen.getByLabelText("Direccion *"), { target: { value: "Test Address" } });
        fireEvent.change(screen.getByLabelText("Teléfono *"), { target: { value: "12345678" } });
        fireEvent.mouseDown(screen.getByLabelText("Dueño *"));
        fireEvent.click(screen.getByText("Owner One"));

        const submitButton = screen.getByRole("button", { name: /Agregar Clinica/i });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(mockOnSuccess).toHaveBeenCalledWith("Datos inválidos. Revise los campos e intente nuevamente.", "error");
        });
    });
});
