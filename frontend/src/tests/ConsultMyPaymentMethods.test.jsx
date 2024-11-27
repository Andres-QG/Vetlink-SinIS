// ConsultMyPaymentMethods.test.jsx

import React from "react";
import {
  render,
  screen,
  waitFor,
  fireEvent,
  within,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import ConsultMyPaymentMethods from "../routes/ConsultMyPaymentMethods";
import axios from "axios";
import { useNotification } from "../components/Notification";

// Mocks
jest.mock("axios");
jest.mock("../components/Notification", () => ({
  useNotification: jest.fn(),
}));

// Mock de los componentes modales para enfocarnos en el componente principal
jest.mock("../components/ConsultMyPaymentMethods/ModifyPaymentMethod", () => ({
  __esModule: true,
  default: ({ open, handleClose, onSuccess, selectedItem }) => (
    <div data-testid="modify-payment-method-modal">
      <h2>Modificar Método de Pago</h2>
      <button onClick={handleClose} aria-label="Cerrar">
        Cerrar
      </button>
      {/* Simulamos el formulario */}
      <form>
        {/* Campos del formulario simulados */}
        <input name="direccion" />
        <button type="submit">Guardar Cambios</button>
      </form>
    </div>
  ),
}));

jest.mock("../components/ConsultMyPaymentMethods/DeletePaymentMethod", () => ({
  __esModule: true,
  default: ({ open, handleClose, onSuccess, paymentData }) => (
    <div data-testid="delete-payment-method-modal">
      <h2>Eliminar Método de Pago</h2>
      <button onClick={handleClose} aria-label="Cancelar">
        Cancelar
      </button>
      {/* Simulamos el contenido */}
      <button>Confirmar Eliminación</button>
    </div>
  ),
}));

describe("ConsultMyPaymentMethods Component", () => {
  const mockPaymentMethods = [
    {
      METODO_PAGO_ID: 1,
      TIPO_PAGO: "Crédito",
      MARCA_TARJETA: "VISA",
      NOMBRE_TITULAR: "Juan Pérez",
      ULTIMOS_4_DIGITOS: "1234",
      FECHA_EXPIRACION: "12/24",
      DIRECCION: "Calle 123",
      PROVINCIA: "Buenos Aires",
      PAIS: "Argentina",
      CODIGO_POSTAL: "1000",
    },
    {
      METODO_PAGO_ID: 2,
      TIPO_PAGO: "Débito",
      MARCA_TARJETA: "MASTERCARD",
      NOMBRE_TITULAR: "María Gómez",
      ULTIMOS_4_DIGITOS: "5678",
      FECHA_EXPIRACION: "11/23",
      DIRECCION: "Avenida 456",
      PROVINCIA: "Córdoba",
      PAIS: "Argentina",
      CODIGO_POSTAL: "2000",
    },
  ];

  const mockNotification = jest.fn();

  beforeEach(() => {
    axios.get.mockResolvedValue({
      data: {
        results: mockPaymentMethods,
      },
    });

    useNotification.mockReturnValue(mockNotification);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("1: Carga y muestra los métodos de pago", async () => {
    render(<ConsultMyPaymentMethods />);

    // Verifica que se muestra el spinner de carga
    expect(screen.getByRole("progressbar")).toBeInTheDocument();

    // Espera a que se carguen los datos
    await waitFor(() => {
      expect(screen.getByText("Métodos de Pago")).toBeInTheDocument();
    });

    // Verifica que los métodos de pago se muestran en pantalla
    expect(screen.getByText("Juan Pérez")).toBeInTheDocument();
    expect(screen.getByText("María Gómez")).toBeInTheDocument();
  });

  test("2: Muestra mensaje cuando no hay métodos de pago", async () => {
    axios.get.mockResolvedValue({
      data: {
        results: [],
      },
    });

    render(<ConsultMyPaymentMethods />);

    await waitFor(() => {
      expect(screen.getByText("Métodos de Pago")).toBeInTheDocument();
    });

    expect(
      screen.getByText("No se encontraron métodos de pago.")
    ).toBeInTheDocument();
  });

  test("3: Funcionalidad de búsqueda y filtrado", async () => {
    render(<ConsultMyPaymentMethods />);

    await waitFor(() => {
      expect(screen.getByText("Métodos de Pago")).toBeInTheDocument();
    });

    // Simula abrir el modal de filtros
    fireEvent.click(screen.getByRole("button", { name: /Abrir filtros/i }));

    // Espera a que el modal aparezca
    await waitFor(() => {
      expect(screen.getByText("Configuración de Filtro")).toBeInTheDocument();
    });

    // Cambia la columna de filtro a 'NOMBRE_TITULAR'
    fireEvent.change(screen.getByLabelText("Columna:"), {
      target: { value: "NOMBRE_TITULAR" },
    });

    // Haz clic en 'Aplicar' para cerrar el modal y aplicar el filtro
    fireEvent.click(screen.getByRole("button", { name: "Aplicar" }));

    // Verifica que el placeholder del input se actualizó
    expect(
      screen.getByPlaceholderText(/Buscar por NOMBRE_TITULAR/i)
    ).toBeInTheDocument();

    // Ingresa el término de búsqueda
    fireEvent.change(
      screen.getByPlaceholderText(/Buscar por NOMBRE_TITULAR/i),
      {
        target: { value: "María" },
      }
    );

    // Envía el formulario de búsqueda
    fireEvent.submit(
      screen.getByRole("form", { name: /Formulario de búsqueda/i })
    );

    // Espera a que los resultados se actualicen
    await waitFor(() => {
      expect(screen.getByText("María Gómez")).toBeInTheDocument();
      expect(screen.queryByText("Juan Pérez")).not.toBeInTheDocument();
    });
  });

  test("4: Navegación entre pestañas", async () => {
    // Mockear las llamadas a las APIs externas para el componente AddPaymentMethod
    axios.get.mockImplementation((url) => {
      if (url === "https://restcountries.com/v3.1/all") {
        return Promise.resolve({
          data: [
            { name: { common: "Argentina" } },
            { name: { common: "Brasil" } },
          ],
        });
      }
      return Promise.resolve({ data: [] });
    });

    axios.post.mockImplementation((url, data) => {
      if (url === "https://countriesnow.space/api/v0.1/countries/states") {
        return Promise.resolve({
          data: {
            data: {
              states: [{ name: "Buenos Aires" }, { name: "Córdoba" }],
            },
          },
        });
      }
      return Promise.resolve({ data: { data: { states: [] } } });
    });

    render(<ConsultMyPaymentMethods />);

    await waitFor(() => {
      expect(screen.getByText("Métodos de Pago")).toBeInTheDocument();
    });

    // Verifica que estamos en la pestaña 'Consultar'
    expect(screen.getByRole("tab", { name: "Consultar" })).toHaveAttribute(
      "aria-selected",
      "true"
    );

    // Haz clic en la pestaña 'Agregar'
    fireEvent.click(screen.getByRole("tab", { name: "Agregar" }));

    // Verifica que estamos en la pestaña 'Agregar'
    expect(screen.getByRole("tab", { name: "Agregar" })).toHaveAttribute(
      "aria-selected",
      "true"
    );

    // Espera a que se renderice el componente 'AddPaymentMethod' y verifica que muestra "Detalles personales"
    await waitFor(() => {
      expect(screen.getByText("Detalles personales")).toBeInTheDocument();
    });
  });

  test("5: Interacción con botones de modificar y eliminar", async () => {
    render(<ConsultMyPaymentMethods />);

    await waitFor(() => {
      expect(screen.getByText("Métodos de Pago")).toBeInTheDocument();
    });

    // Encuentra el botón de 'Modificar' del primer método de pago
    const modifyButtons = screen.getAllByRole("button", { name: /Modificar/i });
    fireEvent.click(modifyButtons[0]);

    // Verifica que se abre el modal de modificación
    await waitFor(() => {
      expect(
        screen.getByTestId("modify-payment-method-modal")
      ).toBeInTheDocument();
      expect(screen.getByText("Modificar Método de Pago")).toBeInTheDocument();
    });

    // Cierra el modal de modificación
    fireEvent.click(screen.getByRole("button", { name: /Cerrar/i }));

    // Verifica que el modal de modificación ya no está en el DOM
    await waitFor(() => {
      expect(
        screen.queryByTestId("modify-payment-method-modal")
      ).not.toBeInTheDocument();
    });

    // Encuentra el botón de 'Eliminar' del primer método de pago
    const deleteButtons = screen.getAllByRole("button", { name: /Eliminar/i });
    fireEvent.click(deleteButtons[0]);

    // Verifica que se abre el modal de eliminación
    await waitFor(() => {
      expect(
        screen.getByTestId("delete-payment-method-modal")
      ).toBeInTheDocument();
      expect(screen.getByText("Eliminar Método de Pago")).toBeInTheDocument();
    });

    // Cierra el modal de eliminación
    fireEvent.click(screen.getByRole("button", { name: /Cancelar/i }));

    // Verifica que el modal de eliminación ya no está en el DOM
    await waitFor(() => {
      expect(
        screen.queryByTestId("delete-payment-method-modal")
      ).not.toBeInTheDocument();
    });
  });

  test("6: Paginación", async () => {
    // Simula más de 8 métodos de pago para activar la paginación
    const largeMockData = Array.from({ length: 20 }, (_, index) => ({
      METODO_PAGO_ID: index + 1,
      TIPO_PAGO: "Crédito",
      MARCA_TARJETA: "VISA",
      NOMBRE_TITULAR: `Titular ${index + 1}`,
      ULTIMOS_4_DIGITOS: `123${index}`,
      FECHA_EXPIRACION: "12/24",
      DIRECCION: `Dirección ${index + 1}`,
      PROVINCIA: "Buenos Aires",
      PAIS: "Argentina",
      CODIGO_POSTAL: `100${index}`,
    }));

    axios.get.mockResolvedValue({
      data: {
        results: largeMockData,
      },
    });

    render(<ConsultMyPaymentMethods />);

    await waitFor(() => {
      expect(screen.getByText("Métodos de Pago")).toBeInTheDocument();
    });

    // Verifica que se muestran los elementos de la primera página
    expect(screen.getByText("Titular 1")).toBeInTheDocument();
    expect(screen.getByText("Titular 8")).toBeInTheDocument();
    expect(screen.queryByText("Titular 9")).not.toBeInTheDocument();

    // Encuentra el botón de la página 2
    const page2Button = screen.getByLabelText("Ir a la página 2");

    // Haz clic en el botón de la página 2
    fireEvent.click(page2Button);

    // Espera a que la página se actualice
    await waitFor(() => {
      expect(screen.getByText("Titular 9")).toBeInTheDocument();
    });

    // Verifica que ya no se muestran los elementos de la primera página
    expect(screen.queryByText("Titular 1")).not.toBeInTheDocument();
  });

  test("7: Manejo de error al cargar métodos de pago", async () => {
    axios.get.mockRejectedValue(new Error("Error al cargar métodos de pago"));

    render(<ConsultMyPaymentMethods />);

    await waitFor(() => {
      expect(mockNotification).toHaveBeenCalledWith(
        "Error al cargar métodos de pago.",
        "error"
      );
    });
  });
});
