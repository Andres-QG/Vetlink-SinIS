// src/tests/PaymentForm.test.jsx
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PaymentForm from "../components/PaymentForm";

describe("PaymentForm Component", () => {
    const mockOnSubmit = jest.fn();
    const mockSetParentFormData = jest.fn();

    const mockOtherData = {
        methods: [
            {
                nombre_titular: "Ana Gómez",
                ultimos_4_digitos: "1234",
                tipo_pago: "Débito",
                fecha_expiracion: "2024-12-31",
                marca_tarjeta: "MasterCard",
            },
        ],
    };

    const renderComponent = (props = {}) => {
        const ref = React.createRef();
        render(
            <PaymentForm
                onSubmit={mockOnSubmit}
                setParentFormData={mockSetParentFormData}
                {...props}
                otherData={props.otherData || mockOtherData}
                ref={ref}
            />
        );
        return ref;
    };

    beforeEach(() => {
        jest.clearAllMocks();
        global.fetch = jest.fn((url) => {
            if (url === "https://restcountries.com/v3.1/all") {
                return Promise.resolve({
                    json: () =>
                        Promise.resolve([
                            { name: { common: "Costa Rica" } },
                            { name: { common: "Panama" } },
                        ]),
                });
            }
            if (url === "https://countriesnow.space/api/v0.1/countries/states") {
                return Promise.resolve({
                    json: () =>
                        Promise.resolve({
                            data: {
                                states: [
                                    { name: "San Jose" },
                                    { name: "Alajuela" },
                                ],
                            },
                        }),
                });
            }
            return Promise.reject(new Error("Unknown URL"));
        });
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it("renders the form correctly without CVV and payment methods", async () => {
        renderComponent();

        await waitFor(() => {
            expect(screen.getByLabelText("País")).toBeEnabled();
        });

        expect(screen.getByText("Detalles personales")).toBeInTheDocument();
        expect(screen.getByLabelText("Dirección")).toBeInTheDocument();
        expect(screen.getByLabelText("País")).toBeInTheDocument();
        expect(screen.getByLabelText("Provincia")).toBeInTheDocument();
        expect(screen.getByLabelText("Código Postal")).toBeInTheDocument();
        expect(screen.getByLabelText("Nombre del titular")).toBeInTheDocument();
        expect(screen.getByLabelText("Número de tarjeta")).toBeInTheDocument();
        expect(screen.getByLabelText("Tipo de tarjeta")).toBeInTheDocument();
        expect(screen.getByLabelText("Fecha de Expiración *")).toBeInTheDocument();
    });

    it("renders payment methods when paymentMethods is true", async () => {
        const mockOtherDataWithMethods = {
            ...mockOtherData,
            methods: [
                {
                    nombre_titular: "Ana Gómez",
                    ultimos_4_digitos: "1234",
                    tipo_pago: "Débito",
                    fecha_expiracion: "2024-12-31",
                    marca_tarjeta: "MasterCard",
                },
            ],
        };

        renderComponent({ paymentMethods: true, otherData: mockOtherDataWithMethods });

        expect(screen.getByRole("heading", { name: "Métodos de pago" })).toBeInTheDocument();
        expect(screen.getByLabelText("Métodos de pago")).toBeInTheDocument();
    });
});
