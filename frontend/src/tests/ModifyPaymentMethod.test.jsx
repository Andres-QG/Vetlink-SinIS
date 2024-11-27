import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ModifyPaymentMethod from "../components/ConsultMyPaymentMethods/ModifyPaymentMethod";
import axios from "axios";
import "@testing-library/jest-dom";

jest.mock("axios");

describe("ModifyPaymentMethod Component", () => {
  const mockHandleClose = jest.fn();
  const mockOnSuccess = jest.fn();
  const selectedItem = {
    METODO_PAGO_ID: 1,
    DIRECCION: "Calle 123",
    PROVINCIA: "Buenos Aires",
    PAIS: "Argentina",
    CODIGO_POSTAL: "10807",
    NOMBRE_TITULAR: "Juan Pérez",
    TIPO_PAGO: "Crédito",
    FECHA_EXPIRACION: "12/2025",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("1: Renderiza correctamente cuando está abierto", () => {
    render(
      <ModifyPaymentMethod
        open={true}
        handleClose={mockHandleClose}
        onSuccess={mockOnSuccess}
        selectedItem={selectedItem}
      />
    );

    expect(screen.getByText("Modificar Método de Pago")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Calle 123")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Buenos Aires")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Argentina")).toBeInTheDocument();
    expect(screen.getByDisplayValue("10807")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Juan Pérez")).toBeInTheDocument();
  });

  test("2: Cierra el modal al hacer clic en 'Cancelar'", () => {
    render(
      <ModifyPaymentMethod
        open={true}
        handleClose={mockHandleClose}
        onSuccess={mockOnSuccess}
        selectedItem={selectedItem}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Cancelar" }));
    expect(mockHandleClose).toHaveBeenCalledTimes(1);
  });

  test("3: Muestra errores si los campos obligatorios están vacíos", async () => {
    render(
      <ModifyPaymentMethod
        open={true}
        handleClose={mockHandleClose}
        onSuccess={mockOnSuccess}
        selectedItem={selectedItem}
      />
    );

    fireEvent.change(screen.getByLabelText("Dirección"), {
      target: { value: "" },
    });
    fireEvent.change(screen.getByLabelText("Nombre del Titular"), {
      target: { value: "" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Guardar Cambios" }));

    await waitFor(() => {
      expect(
        screen.getByText("La dirección es obligatoria.")
      ).toBeInTheDocument();
      expect(
        screen.getByText("El nombre del titular es obligatorio.")
      ).toBeInTheDocument();
    });
  });

  test("4: Envía datos válidos correctamente", async () => {
    axios.put.mockResolvedValueOnce({ status: 200 });

    render(
      <ModifyPaymentMethod
        open={true}
        handleClose={mockHandleClose}
        onSuccess={mockOnSuccess}
        selectedItem={selectedItem}
      />
    );

    fireEvent.change(screen.getByLabelText("Dirección"), {
      target: { value: "Nueva Dirección 456" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Guardar Cambios" }));

    await waitFor(() => {
      expect(axios.put).toHaveBeenCalledWith(
        `http://localhost:8000/api/modify-payment-method/${selectedItem.METODO_PAGO_ID}/`,
        expect.objectContaining({ direccion: "Nueva Dirección 456" }),
        expect.any(Object)
      );
      expect(mockOnSuccess).toHaveBeenCalledWith(
        "Método de pago modificado exitosamente",
        "success"
      );
    });
  });

  test("5: Maneja errores al fallar la solicitud de modificación", async () => {
    axios.put.mockRejectedValueOnce({
      response: {
        data: { error: "Error al modificar el método de pago." },
      },
    });

    render(
      <ModifyPaymentMethod
        open={true}
        handleClose={mockHandleClose}
        onSuccess={mockOnSuccess}
        selectedItem={selectedItem}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Guardar Cambios" }));

    await waitFor(() => {
      expect(mockOnSuccess).toHaveBeenCalledWith(
        "Error al modificar el método de pago.",
        "error"
      );
    });
  });
});
