// ConsultMyPaymentHistory.test.jsx

import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import ConsultMyPaymentHistory from "../routes/ConsultMyPaymentHistory";
import axios from "axios";
import pdfMake from "pdfmake";

jest.mock("axios");
jest.mock("pdfmake", () => ({
  createPdf: jest.fn(() => ({
    download: jest.fn(),
  })),
}));

describe("ConsultMyPaymentHistory Component", () => {
  const mockPaymentData = [
    {
      factura_id: 1,
      marca_tarjeta: "VISA",
      tipo_pago: "Crédito",
      monto_total: "$100.00",
      fecha: "2023-10-01",
      detalle: "Consulta veterinaria",
      estado: "Exitoso",
      ultimos_4_digitos: "1234",
      clinica_nombre: "Clínica Veterinaria XYZ",
    },
    {
      factura_id: 2,
      marca_tarjeta: "MASTERCARD",
      tipo_pago: "Débito",
      monto_total: "$200.00",
      fecha: "2023-10-05",
      detalle: "Vacunación",
      estado: "Pendiente",
      ultimos_4_digitos: "5678",
      clinica_nombre: "Clínica Veterinaria ABC",
    },
  ];

  beforeEach(() => {
    axios.get.mockResolvedValue({
      data: {
        results: mockPaymentData,
      },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("1: Carga y muestra el historial de pagos", async () => {
    render(<ConsultMyPaymentHistory />);

    expect(screen.getByRole("progressbar")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Historial de Pagos")).toBeInTheDocument();
    });

    expect(screen.getByText("Consulta veterinaria")).toBeInTheDocument();
    expect(screen.getByText("Vacunación")).toBeInTheDocument();
  });

  test("2: Muestra mensaje cuando no hay pagos en el historial", async () => {
    axios.get.mockResolvedValue({
      data: {
        results: [],
      },
    });

    render(<ConsultMyPaymentHistory />);

    await waitFor(() => {
      expect(
        screen.getByText("No se encontraron pagos en el historial.")
      ).toBeInTheDocument();
    });
  });

  test("3: Funcionalidad de búsqueda", async () => {
    render(<ConsultMyPaymentHistory />);

    await waitFor(() => {
      expect(screen.getByText("Historial de Pagos")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: /Abrir filtros/i }));

    await waitFor(() => {
      expect(screen.getByText("Configuración de Filtro")).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText("Columna:"), {
      target: { value: "detalle" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Aplicar" }));

    expect(
      screen.getByPlaceholderText(/Buscar por detalle/i)
    ).toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText(/Buscar por detalle/i), {
      target: { value: "Vacunación" },
    });

    fireEvent.submit(
      screen.getByRole("form", { name: /Formulario de búsqueda/i })
    );

    await waitFor(() => {
      expect(screen.getByText("Vacunación")).toBeInTheDocument();
      expect(
        screen.queryByText("Consulta veterinaria")
      ).not.toBeInTheDocument();
    });
  });

  test("4: Funcionalidad de paginación", async () => {
    const largeMockData = Array.from({ length: 20 }, (_, index) => ({
      factura_id: index + 1,
      marca_tarjeta: "VISA",
      tipo_pago: "Crédito",
      monto_total: `$${(index + 1) * 10}.00`,
      fecha: `2023-10-${(index % 30) + 1}`,
      detalle: `Pago ${index + 1}`,
      estado: index % 2 === 0 ? "Exitoso" : "Pendiente",
      ultimos_4_digitos: "1234",
      clinica_nombre: "Clínica Veterinaria XYZ",
    }));

    axios.get.mockResolvedValue({
      data: {
        results: largeMockData,
      },
    });

    render(<ConsultMyPaymentHistory />);

    await waitFor(() => {
      expect(screen.getByText("Historial de Pagos")).toBeInTheDocument();
    });

    expect(screen.getByText("Pago 1")).toBeInTheDocument();
    expect(screen.getByText("Pago 8")).toBeInTheDocument();
    expect(screen.queryByText("Pago 9")).not.toBeInTheDocument();

    const page2Button = screen.getByLabelText("Ir a la página 2");

    fireEvent.click(page2Button);

    await waitFor(() => {
      expect(screen.getByText("Pago 9")).toBeInTheDocument();
    });

    expect(screen.queryByText("Pago 1")).not.toBeInTheDocument();
  });

  test("5: Manejo de error al cargar datos", async () => {
    axios.get.mockRejectedValue(new Error("Error al cargar datos"));

    render(<ConsultMyPaymentHistory />);

    await waitFor(() => {
      // Aquí puedes verificar si se muestra un mensaje de error o una notificación
    });
  });
});
