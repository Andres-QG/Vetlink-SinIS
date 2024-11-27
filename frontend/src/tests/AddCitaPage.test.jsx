import React from "react";
import { render, screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AddCitaPage from "../components/consultCitas/AddCitaPage";
import axios from "axios";
import StripeContext from "../context/StripeContext";

jest.mock("axios");

const MockPaymentForm = React.forwardRef((props, ref) => (
    <div data-testid="mock-payment-form">
        <button onClick={() => props.onSubmit({}, () => {})}>Submit Payment</button>
    </div>
));

jest.mock("../components/PaymentForm", () => ({
    __esModule: true,
    default: MockPaymentForm,
    PaymentForm: MockPaymentForm,
}));

const mockOnSuccess = jest.fn();

const mockOtherData = {
    user: { role: 2 },
    clientes: [{ user: "user1", nombre: "Client1" }],
    pets: [{ mascota_id: 1, nombre: "Pet1", ownerId: "user1" }],
    veterinarios: [{ usuario: "vet1", nombre: "Veterinarian1" }],
    horarios: ["08:00", "09:00"],
    clinicas: [{ clinica_id: 1, nombre: "Clinic1" }],
    services: [{ id: 1, nombre: "Service1", costo: 1000 }],
};

const mockStripe = {};
const mockElements = {};

describe("AddCitaPage Component", () => {
    beforeEach(() => {
        jest.clearAllMocks();

        axios.put.mockImplementation((url, data) => {
            if (url.endsWith("/api/get-pets/")) {
                return Promise.resolve({ data: { pets: mockOtherData.pets } });
            }
            if (url.endsWith("/api/get-disp-times/")) {
                return Promise.resolve({ data: { available_times: mockOtherData.horarios } });
            }
            return Promise.reject(new Error("not mocked"));
        });
    });

    const renderComponent = () =>
        render(
            <StripeContext.Provider value={{ stripe: mockStripe, elements: mockElements }}>
                <AddCitaPage onSuccess={mockOnSuccess} otherData={mockOtherData} />
            </StripeContext.Provider>
        );

    it("renders step 0 correctly", () => {
        act(() => {
            renderComponent();
        });

        expect(screen.getByText("Selecciona una mascota")).toBeInTheDocument();
        expect(screen.getByLabelText("Mascota")).toBeInTheDocument();
        expect(screen.getByLabelText("Servicios*")).toBeInTheDocument();
        expect(screen.getByLabelText("Motivo")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /Volver/i })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /Siguiente/i })).toBeInTheDocument();
    });

    it("navigates to step 1 when step 0 is filled and Siguiente is clicked", async () => {
        act(() => {
            renderComponent();
        });

        const mascotaInput = screen.getByLabelText("Mascota");
        await act(async () => {
            await userEvent.click(mascotaInput);
            await userEvent.type(mascotaInput, "Pet1");
            const mascotaOption = await screen.findByText("Pet1");
            await userEvent.click(mascotaOption);
        });

        const serviciosInput = screen.getByLabelText("Servicios*");
        await act(async () => {
            await userEvent.click(serviciosInput);
            await userEvent.type(serviciosInput, "Service1");
            const serviceOption = await screen.findByText("Service1");
            await userEvent.click(serviceOption);
        });

        const motivoInput = screen.getByLabelText("Motivo");
        await act(async () => {
            await userEvent.type(motivoInput, "Checkup");
        });

        const siguienteButton = screen.getByRole("button", { name: /Siguiente/i });
        await act(async () => {
            await userEvent.click(siguienteButton);
        });

        await waitFor(() => {
            expect(screen.getByText("Selecciona una fecha y veterinario")).toBeInTheDocument();
            expect(screen.getByLabelText("Veterinario")).toBeInTheDocument();
            expect(screen.getByLabelText("Clínica")).toBeInTheDocument();
            expect(screen.getByLabelText("Fecha *")).toBeInTheDocument();
            expect(screen.getByLabelText("Hora *")).toBeInTheDocument();
        });
    });

    it("shows errors when required fields in step 1 are missing", async () => {
        act(() => {
            renderComponent();
        });

        const mascotaInput = screen.getByLabelText("Mascota");
        await act(async () => {
            await userEvent.click(mascotaInput);
            await userEvent.type(mascotaInput, "Pet1");
            const mascotaOption = await screen.findByText("Pet1");
            await userEvent.click(mascotaOption);
        });

        const serviciosInput = screen.getByLabelText("Servicios*");
        await act(async () => {
            await userEvent.click(serviciosInput);
            await userEvent.type(serviciosInput, "Service1");
            const serviceOption = await screen.findByText("Service1");
            await userEvent.click(serviceOption);
        });

        const motivoInput = screen.getByLabelText("Motivo");
        await act(async () => {
            await userEvent.type(motivoInput, "Checkup");
        });

        const siguienteButton = screen.getByRole("button", { name: /Siguiente/i });
        await act(async () => {
            await userEvent.click(siguienteButton);
        });

        await waitFor(() => {
            expect(screen.getByText("Selecciona una fecha y veterinario")).toBeInTheDocument();
        });

        await act(async () => {
            await userEvent.click(siguienteButton);
        });

        expect(screen.getByText("Veterinario requerido.")).toBeInTheDocument();
        expect(screen.getByText("Clínica requerida.")).toBeInTheDocument();
        expect(screen.getByText("Fecha requerida.")).toBeInTheDocument();
        expect(screen.getByText("Hora requerida.")).toBeInTheDocument();
    });

    it("allows navigation to Step 2 only when all Step 1 fields are valid", async () => {
        act(() => {
            renderComponent();
        });

        const mascotaInput = screen.getByLabelText("Mascota");
        await act(async () => {
            await userEvent.click(mascotaInput);
            await userEvent.type(mascotaInput, "Pet1");
            const mascotaOption = await screen.findByText("Pet1");
            await userEvent.click(mascotaOption);
        });

        const serviciosInput = screen.getByLabelText("Servicios*");
        await act(async () => {
            await userEvent.click(serviciosInput);
            await userEvent.type(serviciosInput, "Service1");
            const serviceOption = await screen.findByText("Service1");
            await userEvent.click(serviceOption);
        });

        const motivoInput = screen.getByLabelText("Motivo");
        await act(async () => {
            await userEvent.type(motivoInput, "Checkup");
        });

        const siguienteButton = screen.getByRole("button", { name: /Siguiente/i });
        await act(async () => {
            await userEvent.click(siguienteButton);
        });

        await waitFor(() => {
            expect(screen.getByText("Selecciona una fecha y veterinario")).toBeInTheDocument();
        });

        const veterinarioInput = screen.getByLabelText("Veterinario");
        await act(async () => {
            await userEvent.click(veterinarioInput);
            await userEvent.type(veterinarioInput, "vet1");
            const veterinarianOption = await screen.findByText("vet1");
            await userEvent.click(veterinarianOption);
        });

        const clinicaInput = screen.getByLabelText("Clínica");
        await act(async () => {
            await userEvent.click(clinicaInput);
            await userEvent.type(clinicaInput, "Clinic1");
            const clinicaOption = await screen.findByText("Clinic1");
            await userEvent.click(clinicaOption);
        });

        const fechaInput = screen.getByLabelText("Fecha *");
        await act(async () => {
            await userEvent.type(fechaInput, "01/12/2024");
        });

        await act(async () => {
            await userEvent.click(siguienteButton);
        });

    });
});
