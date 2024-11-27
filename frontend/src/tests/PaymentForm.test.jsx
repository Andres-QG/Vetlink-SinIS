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

    it("fills out the form correctly and submits", async () => {
        renderComponent();

        userEvent.type(screen.getByLabelText("Dirección"), "Calle 123");
        userEvent.click(screen.getByLabelText("País"));
        userEvent.type(screen.getByLabelText("País"), "Costa Rica");
        const countryOption = await screen.findByText("Costa Rica");
        userEvent.click(countryOption);

        await waitFor(() => {
            expect(screen.getByLabelText("Provincia")).not.toBeDisabled();
        });

        userEvent.click(screen.getByLabelText("Provincia"));
        userEvent.type(screen.getByLabelText("Provincia"), "San Jose");
        const provinceOption = await screen.findByText("San Jose");
        userEvent.click(provinceOption);

        userEvent.type(screen.getByLabelText("Código Postal"), "10807");
        userEvent.type(screen.getByLabelText("Nombre del titular"), "Juan Pérez");
        userEvent.type(screen.getByLabelText("Número de tarjeta"), "4111111111111111");
        userEvent.click(screen.getByLabelText("Tipo de tarjeta"));
        userEvent.type(screen.getByLabelText("Tipo de tarjeta"), "Crédito");
        const tipoTarjetaOption = await screen.findByText("Crédito");
        userEvent.click(tipoTarjetaOption);

        userEvent.click(screen.getByLabelText("Fecha de Expiración"));
        userEvent.type(screen.getByLabelText("Fecha de Expiración"), "12/25");

        userEvent.click(screen.getByRole('button', { name: /Submit Payment/i }));

        await waitFor(() => {
            expect(mockOnSubmit).toHaveBeenCalled();
        });

        expect(mockSetParentFormData).toHaveBeenCalledWith({
            direccion: "Calle 123",
            provincia: "San Jose",
            pais: "Costa Rica",
            codigoPostal: "10807",
            nombreTitular: "Juan Pérez",
            numeroTarjeta: "4111111111111111",
            tipoTarjeta: "Crédito",
            fechaExpiracion: expect.any(Date),
            marcaTarjeta: "Visa",
            cvv: "",
        });
    });

    it("shows validation errors when required fields are missing", async () => {
        renderComponent();

        userEvent.click(screen.getByRole('button', { name: /Submit Payment/i }));

        await waitFor(() => {
            expect(screen.getByText("La dirección es obligatoria.")).toBeInTheDocument();
            expect(screen.getByText("El país es obligatorio.")).toBeInTheDocument();
            expect(screen.getByText("La provincia es obligatoria.")).toBeInTheDocument();
            expect(screen.getByText("Código postal inválido.")).toBeInTheDocument();
            expect(screen.getByText("El nombre del titular es obligatorio.")).toBeInTheDocument();
            expect(screen.getByText("El número de tarjeta debe contener 16 dígitos.")).toBeInTheDocument();
            expect(screen.getByText("El tipo de tarjeta es obligatorio.")).toBeInTheDocument();
            expect(screen.getByText("La fecha es obligatoria y debe ser válida.")).toBeInTheDocument();
        });

        expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it("shows CVV error when includeCVV is true and CVV is invalid", async () => {
        renderComponent({ includeCVV: true });

        userEvent.type(screen.getByLabelText("Dirección"), "Calle 123");
        userEvent.click(screen.getByLabelText("País"));
        userEvent.type(screen.getByLabelText("País"), "Costa Rica");
        const countryOption = await screen.findByText("Costa Rica");
        userEvent.click(countryOption);

        await waitFor(() => {
            expect(screen.getByLabelText("Provincia")).not.toBeDisabled();
        });

        userEvent.click(screen.getByLabelText("Provincia"));
        userEvent.type(screen.getByLabelText("Provincia"), "San Jose");
        const provinceOption = await screen.findByText("San Jose");
        userEvent.click(provinceOption);

        userEvent.type(screen.getByLabelText("Código Postal"), "10807");
        userEvent.type(screen.getByLabelText("Nombre del titular"), "Juan Pérez");
        userEvent.type(screen.getByLabelText("Número de tarjeta"), "4111111111111111");
        userEvent.click(screen.getByLabelText("Tipo de tarjeta"));
        userEvent.type(screen.getByLabelText("Tipo de tarjeta"), "Crédito");
        const tipoTarjetaOption = await screen.findByText("Crédito");
        userEvent.click(tipoTarjetaOption);

        userEvent.click(screen.getByLabelText("Fecha de Expiración *"));
        userEvent.type(screen.getByLabelText("Fecha de Expiración *"), "12/25");

        userEvent.type(screen.getByLabelText("CVV"), "12");

        userEvent.click(screen.getByRole('button', { name: /Submit Payment/i }));

        await waitFor(() => {
            expect(screen.getByText("El CVV debe contener 3 o 4 dígitos.")).toBeInTheDocument();
        });

        expect(mockOnSubmit).not.toHaveBeenCalled();
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

        expect(screen.getByText("Métodos de pago")).toBeInTheDocument();
        expect(screen.getByLabelText("Métodos de pago")).toBeInTheDocument();
    });

    it("selects a payment method and populates the form", async () => {
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

        userEvent.click(screen.getByLabelText("Métodos de pago"));
        userEvent.type(screen.getByLabelText("Métodos de pago"), "Ana Gómez");
        const paymentMethodOption = await screen.findByRole('option', { name: /Débito - 1234/i });
        userEvent.click(paymentMethodOption);

        await waitFor(() => {
            expect(screen.getByLabelText("Nombre del titular")).toHaveValue("Ana Gómez");
            expect(screen.getByLabelText("Número de tarjeta")).toHaveValue("1234");
            expect(screen.getByLabelText("Tipo de tarjeta")).toHaveValue("Débito");
            expect(screen.getByLabelText("Fecha de Expiración *")).toHaveValue("12/24");
            expect(screen.getByLabelText("CVV")).toHaveValue("");
        });
    });
});
