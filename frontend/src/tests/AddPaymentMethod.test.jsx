// AddPaymentMethod.test.jsx

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import axios from "axios";
import AddPaymentMethod from "../components/ConsultMyPaymentMethods/AddPaymentMethod";
import { useNotification } from "../components/Notification";

// Importa userEvent para interacciones más realistas
import userEvent from "@testing-library/user-event";

// Mock de axios
jest.mock("axios");

// Mock de useNotification
jest.mock("../components/Notification", () => ({
  useNotification: jest.fn(),
}));

describe("AddPaymentMethod Component", () => {
  const mockNotification = jest.fn();

  beforeEach(() => {
    // Configurar el mock de useNotification
    useNotification.mockReturnValue(mockNotification);

    // Mockear la respuesta de obtener países
    axios.get.mockResolvedValue({
      data: [{ name: { common: "Argentina" } }, { name: { common: "Chile" } }],
    });

    // Mockear la respuesta de obtener provincias
    axios.post.mockImplementation((url, data) => {
      if (url === "https://countriesnow.space/api/v0.1/countries/states") {
        if (data.country === "Argentina") {
          return Promise.resolve({
            data: {
              data: {
                states: [{ name: "Buenos Aires" }, { name: "Córdoba" }],
              },
            },
          });
        }
        return Promise.resolve({
          data: {
            data: {
              states: [],
            },
          },
        });
      }
      if (url === "http://localhost:8000/api/add-payment-method/") {
        return Promise.resolve({
          status: 201,
          data: { message: "Método de pago agregado exitosamente" },
        });
      }
      return Promise.reject(new Error("Unknown POST request"));
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("1: Renderiza correctamente el formulario", async () => {
    render(<AddPaymentMethod onSuccess={jest.fn()} />);
    expect(screen.getByText("Detalles personales")).toBeInTheDocument();
    expect(screen.getByText("Métodos aceptados")).toBeInTheDocument();
    expect(screen.getByText("Detalles de tarjeta")).toBeInTheDocument();

    // Espera a que se carguen los países
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(
        "https://restcountries.com/v3.1/all"
      );
    });

    // Verifica que los campos del formulario están presentes utilizando selectores específicos
    expect(screen.getByLabelText("Dirección")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Seleccione un país")
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Seleccione una provincia")
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Código Postal")).toBeInTheDocument();
    expect(screen.getByLabelText("Nombre del titular")).toBeInTheDocument();
    expect(screen.getByLabelText("Número de tarjeta")).toBeInTheDocument();
    expect(screen.getByLabelText("Tipo de tarjeta")).toBeInTheDocument();
    expect(screen.getByLabelText("Fecha de Expiración")).toBeInTheDocument();

    // Verifica que los íconos de métodos de pago están presentes
    expect(screen.getByAltText("Visa")).toBeInTheDocument();
    expect(screen.getByAltText("Mastercard")).toBeInTheDocument();
    expect(screen.getByAltText("American Express")).toBeInTheDocument();
  });

  test("2: Envía datos válidos correctamente", async () => {
    const onSuccessMock = jest.fn();
    render(<AddPaymentMethod onSuccess={onSuccessMock} />);

    // Completa los campos del formulario
    fireEvent.change(screen.getByLabelText("Dirección"), {
      target: { value: "Calle Falsa 123" },
    });
    fireEvent.change(screen.getByLabelText("Código Postal"), {
      target: { value: "1234" },
    });
    fireEvent.change(screen.getByLabelText("Nombre del titular"), {
      target: { value: "Juan Pérez" },
    });
    fireEvent.change(screen.getByLabelText("Número de tarjeta"), {
      target: { value: "4111111111111111" }, // Visa válida
    });

    // Seleccionar tipo de tarjeta
    fireEvent.mouseDown(screen.getByLabelText("Tipo de tarjeta"));
    await waitFor(() => {
      expect(screen.getByText("Crédito")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText("Crédito"));

    // Seleccionar país
    fireEvent.mouseDown(screen.getByPlaceholderText("Seleccione un país"));
    await waitFor(() => {
      expect(screen.getByText("Argentina")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText("Argentina"));

    // Espera a que se carguen las provincias
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        "https://countriesnow.space/api/v0.1/countries/states",
        { country: "Argentina" }
      );
    });

    // Seleccionar provincia
    fireEvent.mouseDown(
      screen.getByPlaceholderText("Seleccione una provincia")
    );
    await waitFor(() => {
      expect(screen.getByText("Buenos Aires")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText("Buenos Aires"));

    // Seleccionar fecha de expiración
    fireEvent.change(screen.getByLabelText("Fecha de Expiración"), {
      target: { value: "12/2030" },
    });

    // Hacer clic en "Agregar"
    fireEvent.click(screen.getByRole("button", { name: /Agregar/i }));

    // Verifica que onSuccess se haya llamado con el mensaje de éxito
    await waitFor(() => {
      expect(onSuccessMock).toHaveBeenCalledWith(
        "Método de pago agregado exitosamente",
        "success"
      );
    });
  });

  test("3: Validación de campos obligatorios", async () => {
    const onSuccessMock = jest.fn();
    render(<AddPaymentMethod onSuccess={onSuccessMock} />);

    // Haz clic en el botón "Agregar" sin llenar el formulario
    fireEvent.click(screen.getByRole("button", { name: /Agregar/i }));

    // Verifica que se muestran los mensajes de error correspondientes
    await waitFor(() => {
      expect(
        screen.getByText(/La dirección es obligatoria\./i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/La provincia es obligatoria\./i)
      ).toBeInTheDocument();
      expect(screen.getByText(/El país es obligatorio\./i)).toBeInTheDocument();
      expect(
        screen.getByText(
          /El código postal es obligatorio y debe contener entre 4 y 10 dígitos\./i
        )
      ).toBeInTheDocument();
      expect(
        screen.getByText(/El nombre del titular es obligatorio\./i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          /El número de tarjeta es obligatorio y debe contener 16 dígitos\./i
        )
      ).toBeInTheDocument();
      expect(
        screen.getByText(/El tipo de tarjeta es obligatorio\./i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/La fecha de expiración es obligatoria\./i)
      ).toBeInTheDocument();
    });

    // Asegúrate de que onSuccess no haya sido llamado
    expect(onSuccessMock).not.toHaveBeenCalled();
  });

  test("4: Validación de marca de tarjeta", async () => {
    const onSuccessMock = jest.fn();
    render(<AddPaymentMethod onSuccess={onSuccessMock} />);

    // Completa los campos del formulario con una tarjeta inválida (no Visa ni MasterCard)
    fireEvent.change(screen.getByLabelText("Dirección"), {
      target: { value: "Calle Falsa 123" },
    });
    fireEvent.change(screen.getByLabelText("Código Postal"), {
      target: { value: "1234" },
    });
    fireEvent.change(screen.getByLabelText("Nombre del titular"), {
      target: { value: "Juan Pérez" },
    });
    fireEvent.change(screen.getByLabelText("Número de tarjeta"), {
      target: { value: "1234567890123456" }, // No Visa ni MasterCard
    });

    // Seleccionar tipo de tarjeta
    fireEvent.mouseDown(screen.getByLabelText("Tipo de tarjeta"));
    await waitFor(() => {
      expect(screen.getByText("Crédito")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText("Crédito"));

    // Seleccionar país
    fireEvent.mouseDown(screen.getByPlaceholderText("Seleccione un país"));
    await waitFor(() => {
      expect(screen.getByText("Argentina")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText("Argentina"));

    // Espera a que se carguen las provincias
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        "https://countriesnow.space/api/v0.1/countries/states",
        { country: "Argentina" }
      );
    });

    // Seleccionar provincia
    fireEvent.mouseDown(
      screen.getByPlaceholderText("Seleccione una provincia")
    );
    await waitFor(() => {
      expect(screen.getByText("Buenos Aires")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText("Buenos Aires"));

    // Seleccionar fecha de expiración
    fireEvent.change(screen.getByLabelText("Fecha de Expiración"), {
      target: { value: "12/2030" },
    });

    // Hacer clic en "Agregar"
    fireEvent.click(screen.getByRole("button", { name: /Agregar/i }));

    // Verifica que se muestra el mensaje de error de marca de tarjeta
    await waitFor(() => {
      expect(
        screen.getByText(/Solo se aceptan tarjetas Visa y MasterCard\./i)
      ).toBeInTheDocument();
    });

    // Asegúrate de que onSuccess no haya sido llamado
    expect(onSuccessMock).not.toHaveBeenCalled();
  });
});
