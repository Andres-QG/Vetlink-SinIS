// src/tests/Signup.test.jsx

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Signup from "../routes/Signup";
import axios from "axios";
import { BrowserRouter } from "react-router-dom";

// Define mock functions
const mockNavigate = jest.fn();
const mockShowNotification = jest.fn();

// Mock react-router-dom's useNavigate
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

// Mock useNotification to return mockShowNotification
jest.mock("../components/Notification", () => ({
  useNotification: () => mockShowNotification,
}));

// Mock axios
jest.mock("axios");

describe("Signup Component", () => {
  const fillField = (name, value) => {
    const input = screen.getByLabelText(new RegExp(name, "i"));
    fireEvent.change(input, {
      target: { value },
    });
  };

  beforeEach(() => {
    render(
      <BrowserRouter>
        <Signup />
      </BrowserRouter>
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("1: Cargar y mostrar formulario de registro", () => {
    expect(screen.getByText(/Registro/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Nombre/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Cédula/i)).toBeInTheDocument();
  });

  test("2: Mostrar error en cédula inválida al enviar el formulario", async () => {
    fillField("Cédula", "123"); // Valor inválido
    // Completa los demás campos con valores válidos
    fillField("Nombre", "Juan");
    fillField("Primer Apellido", "Pérez");
    fillField("Segundo Apellido", "Gómez");
    fillField("Usuario", "juanperez");
    fillField("Contraseña", "Password1!");
    fillField("Correo Electrónico", "juan@example.com");
    fillField("Teléfono", "12345678");

    fireEvent.click(screen.getByRole("button", { name: /Crear cuenta/i }));

    // Esperar a que el mensaje de error aparezca en el DOM
    const errorMessage = await screen.findByText(
      "La cédula debe tener 9 dígitos."
    );
    expect(errorMessage).toBeInTheDocument();
  });

  test("3: Validar correo electrónico inválido al enviar el formulario", async () => {
    fillField("Correo Electrónico", "correo@"); // Valor inválido
    // Completa los demás campos con valores válidos
    fillField("Nombre", "Juan");
    fillField("Cédula", "123456789");
    fillField("Primer Apellido", "Pérez");
    fillField("Segundo Apellido", "Gómez");
    fillField("Usuario", "juanperez");
    fillField("Contraseña", "Password1!");
    fillField("Teléfono", "12345678");

    fireEvent.click(screen.getByRole("button", { name: /Crear cuenta/i }));

    // Esperar a que el mensaje de error aparezca en el DOM
    const errorMessage = await screen.findByText("Correo inválido.");
    expect(errorMessage).toBeInTheDocument();
  });

  test("4: Mostrar error en contraseña inválida al enviar el formulario", async () => {
    fillField("Contraseña", "abc"); // Valor inválido
    // Completa los demás campos con valores válidos
    fillField("Nombre", "Juan");
    fillField("Cédula", "123456789");
    fillField("Primer Apellido", "Pérez");
    fillField("Segundo Apellido", "Gómez");
    fillField("Usuario", "juanperez");
    fillField("Correo Electrónico", "juan@example.com");
    fillField("Teléfono", "12345678");

    fireEvent.click(screen.getByRole("button", { name: /Crear cuenta/i }));

    // Esperar a que el mensaje de error aparezca en el DOM
    const errorMessage = await screen.findByText(
      "Contraseña debe tener 8 caracteres, una mayúscula, un número y un carácter especial."
    );
    expect(errorMessage).toBeInTheDocument();
  });

  test("5: Manejar error del servidor al crear cuenta", async () => {
    axios.post.mockRejectedValue({
      response: { data: { error: "El usuario ya existe" } },
    });

    const formData = {
      Nombre: "Juan",
      Cédula: "123456789",
      "Primer Apellido": "Pérez",
      "Segundo Apellido": "Gómez",
      Usuario: "juanperez", // Usuario existente
      Contraseña: "Password1!",
      "Correo Electrónico": "juan@example.com",
      Teléfono: "12345678",
    };

    Object.entries(formData).forEach(([label, value]) =>
      fillField(label, value)
    );

    fireEvent.click(screen.getByRole("button", { name: /Crear cuenta/i }));

    // Esperar a que showNotification sea llamado con el mensaje de error
    await waitFor(() => {
      expect(mockShowNotification).toHaveBeenCalledWith(
        "El usuario ya existe",
        "error"
      );
    });
  });

  test("6: Limpiar formulario al presionar el botón 'Limpiar'", () => {
    const formData = {
      Nombre: "Juan",
      Cédula: "123456789",
      "Primer Apellido": "Pérez",
      "Segundo Apellido": "Gómez",
      Usuario: "juanperez",
      Contraseña: "Password1!",
      "Correo Electrónico": "juan@example.com",
      Teléfono: "12345678",
    };

    Object.entries(formData).forEach(([label, value]) =>
      fillField(label, value)
    );

    fireEvent.click(screen.getByRole("button", { name: /Limpiar/i }));

    // Verificar que todos los campos estén vacíos
    Object.keys(formData).forEach((field) => {
      expect(screen.getByLabelText(new RegExp(field, "i"))).toHaveValue("");
    });

    // Verificar que no haya mensajes de error
    expect(screen.queryByText(/requerido/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/inválido/i)).not.toBeInTheDocument();
  });

  test("7: Redireccionar al hacer clic en '¿Ya tienes una cuenta? Inicia sesión'", () => {
    fireEvent.click(screen.getByRole("button", { name: /Inicia sesión/i }));
    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });
});
