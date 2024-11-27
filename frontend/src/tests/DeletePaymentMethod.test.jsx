// DeletePaymentMethod.test.jsx

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import axios from "axios";
import DeletePaymentMethod from "../components/ConsultMyPaymentMethods/DeletePaymentMethod";
import userEvent from "@testing-library/user-event";
import { act } from "react-dom/test-utils";

// Mock de axios
jest.mock("axios");

// Mock de onSuccess y handleClose
const mockHandleClose = jest.fn();
const mockOnSuccess = jest.fn();

// Datos de muestra para paymentData
const samplePaymentData = {
  METODO_PAGO_ID: "12345",
  NOMBRE_TITULAR: "Juan Pérez",
};

describe("DeletePaymentMethod Component", () => {
  beforeEach(() => {
    // Resetear mocks antes de cada prueba
    jest.clearAllMocks();
  });

  test("1: Renderiza el modal correctamente cuando está abierto", () => {
    render(
      <DeletePaymentMethod
        open={true}
        handleClose={mockHandleClose}
        paymentData={samplePaymentData}
        onSuccess={mockOnSuccess}
      />
    );

    // Verificar que el título se renderiza
    expect(screen.getByText("Eliminar Método de Pago")).toBeInTheDocument();

    // Verificar que el nombre del titular se muestra
    expect(
      screen.getByText(samplePaymentData.NOMBRE_TITULAR)
    ).toBeInTheDocument();

    // Verificar que el mensaje de confirmación se renderiza parcialmente
    expect(
      screen.getByText(
        /¿Estás seguro de que quieres eliminar el método de pago con titular/i
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Esta acción es irreversible\./i)
    ).toBeInTheDocument();

    // Verificar los botones "Cancelar" y "Eliminar"
    expect(
      screen.getByRole("button", { name: /Cancelar/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Eliminar/i })
    ).toBeInTheDocument();
  });

  test("2: No renderiza el modal cuando está cerrado", () => {
    render(
      <DeletePaymentMethod
        open={false}
        handleClose={mockHandleClose}
        paymentData={samplePaymentData}
        onSuccess={mockOnSuccess}
      />
    );

    // Verificar que el modal no está presente
    expect(
      screen.queryByText("Eliminar Método de Pago")
    ).not.toBeInTheDocument();
  });

  test("3: Cierra el modal al hacer clic en 'Cancelar'", async () => {
    render(
      <DeletePaymentMethod
        open={true}
        handleClose={mockHandleClose}
        paymentData={samplePaymentData}
        onSuccess={mockOnSuccess}
      />
    );

    // Esperar a que el botón "Cancelar" esté presente
    const cancelButton = await screen.findByRole("button", {
      name: /Cancelar/i,
    });

    // Hacer clic en el botón "Cancelar"
    await userEvent.click(cancelButton);

    // Verificar que handleClose fue llamado
    expect(mockHandleClose).toHaveBeenCalledTimes(1);
  });

  test("4: Envía solicitud DELETE y maneja éxito correctamente al hacer clic en 'Eliminar'", async () => {
    // Simula un retraso en la solicitud DELETE
    const mockDeletePromise = new Promise((resolve) => {
      setTimeout(() => resolve({ status: 200 }), 100); // Simula un retraso de 100ms
    });

    axios.delete.mockReturnValueOnce(mockDeletePromise);

    render(
      <DeletePaymentMethod
        open={true}
        handleClose={mockHandleClose}
        paymentData={{ METODO_PAGO_ID: 1, NOMBRE_TITULAR: "Juan Pérez" }}
        onSuccess={mockOnSuccess}
      />
    );

    const deleteButton = screen.getByRole("button", { name: /Eliminar/i });

    // Verifica que el botón no está deshabilitado inicialmente
    expect(deleteButton).not.toBeDisabled();

    // Haz clic en el botón "Eliminar"
    userEvent.click(deleteButton);

    // Verifica que el botón se deshabilita durante el estado de carga
    await waitFor(() => expect(deleteButton).toBeDisabled());

    // Verifica que axios.delete fue llamado con la URL correcta
    expect(axios.delete).toHaveBeenCalledWith(
      "http://localhost:8000/api/delete-payment-method/1/",
      { withCredentials: true }
    );

    // Espera a que la promesa se resuelva
    await act(() => mockDeletePromise);

    // Verifica que el modal se cerró y onSuccess fue llamado
    expect(mockHandleClose).toHaveBeenCalled();
    expect(mockOnSuccess).toHaveBeenCalledWith(
      "Método de pago eliminado exitosamente",
      "success"
    );
  });

  test("5: Muestra mensaje de error al fallar la solicitud DELETE", async () => {
    // Simula un error en la solicitud DELETE
    const mockErrorPromise = new Promise((_, reject) => {
      setTimeout(
        () =>
          reject({
            response: {
              data: { error: "Error al eliminar el método de pago" },
            },
          }),
        100
      );
    });

    axios.delete.mockReturnValueOnce(mockErrorPromise);

    render(
      <DeletePaymentMethod
        open={true}
        handleClose={mockHandleClose}
        paymentData={{ METODO_PAGO_ID: 1, NOMBRE_TITULAR: "Juan Pérez" }}
        onSuccess={mockOnSuccess}
      />
    );

    const deleteButton = screen.getByRole("button", { name: /Eliminar/i });

    // Verifica que el botón no está deshabilitado inicialmente
    expect(deleteButton).not.toBeDisabled();

    // Haz clic en el botón "Eliminar"
    userEvent.click(deleteButton);

    // Verifica que el botón se deshabilita mientras está en estado de carga
    await waitFor(() => expect(deleteButton).toBeDisabled());

    // Simula la espera hasta que la promesa de error se resuelva
    await act(() => mockErrorPromise.catch(() => {}));

    // Verifica que el mensaje de error fue mostrado
    expect(mockOnSuccess).toHaveBeenCalledWith(
      "Error al eliminar el método de pago",
      "error"
    );

    // Verifica que el botón vuelve a estar habilitado tras el error
    expect(deleteButton).not.toBeDisabled();
  });

  test("6: Muestra mensaje de error por defecto si no hay mensaje en la respuesta", async () => {
    // Mockear la respuesta fallida de DELETE sin mensaje de error
    axios.delete.mockRejectedValueOnce(new Error("Error desconocido"));

    render(
      <DeletePaymentMethod
        open={true}
        handleClose={mockHandleClose}
        paymentData={samplePaymentData}
        onSuccess={mockOnSuccess}
      />
    );

    // Hacer clic en el botón "Eliminar"
    const deleteButton = screen.getByRole("button", { name: /Eliminar/i });
    userEvent.click(deleteButton);

    // Esperar a que se realice la solicitud DELETE
    await waitFor(() => {
      expect(axios.delete).toHaveBeenCalledWith(
        `http://localhost:8000/api/delete-payment-method/${samplePaymentData.METODO_PAGO_ID}/`,
        { withCredentials: true }
      );
    });

    // Verificar que onSuccess fue llamado con el mensaje de error por defecto
    expect(mockOnSuccess).toHaveBeenCalledWith(
      "Error al eliminar el método de pago",
      "error"
    );

    // Verificar que handleClose NO fue llamado
    expect(mockHandleClose).not.toHaveBeenCalled();
  });

  test("7: Muestra el spinner de carga cuando se está eliminando", async () => {
    // Mock de una promesa para simular retraso en la eliminación
    const mockDeletePromise = new Promise((resolve) => {
      setTimeout(() => resolve({ status: 200 }), 100);
    });

    axios.delete.mockReturnValueOnce(mockDeletePromise);

    render(
      <DeletePaymentMethod
        open={true}
        handleClose={mockHandleClose}
        paymentData={{ METODO_PAGO_ID: 1, NOMBRE_TITULAR: "Juan Pérez" }}
        onSuccess={mockOnSuccess}
      />
    );

    const deleteButton = screen.getByRole("button", { name: /Eliminar/i });

    // Verifica que el botón no está deshabilitado inicialmente
    expect(deleteButton).not.toBeDisabled();

    // Haz clic en el botón "Eliminar"
    userEvent.click(deleteButton);

    // Verifica que el spinner se muestra mientras se está eliminando
    expect(await screen.findByRole("progressbar")).toBeInTheDocument();

    // Simula la resolución de la promesa
    await act(() => mockDeletePromise);

    // Verifica que el spinner desaparece después de completar la acción
    expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
  });
});
