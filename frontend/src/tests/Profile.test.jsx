import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import axios from "axios";
import Profile from "../routes/Profile";
import { BrowserRouter as Router } from "react-router-dom";
import { NotificationProvider } from "../components/Notification";

jest.mock("axios");

describe("Profile Component", () => {
  beforeEach(() => {
    axios.get.mockResolvedValue({
      data: {
        results: [
          {
            usuario: "testuser",
            nombre: "Test",
            apellido1: "User",
            apellido2: "Example",
            cedula: "123456789",
            correo: "test@example.com",
            telefono: "12345678",
          },
        ],
      },
    });
  });

  test("renders Profile component and fetches user data", async () => {
    render(
      <Router>
        <NotificationProvider>
          <Profile />
        </NotificationProvider>
      </Router>
    );

    expect(screen.getByText("Mi Perfil")).toBeInTheDocument();
    expect(screen.getByText("Mis Datos Personales")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByDisplayValue("testuser")).toBeInTheDocument();
      expect(screen.getByDisplayValue("Test")).toBeInTheDocument();
      expect(screen.getByDisplayValue("User Example")).toBeInTheDocument();
      expect(screen.getByDisplayValue("123456789")).toBeInTheDocument();
      expect(screen.getByDisplayValue("test@example.com")).toBeInTheDocument();
      expect(screen.getByDisplayValue("12345678")).toBeInTheDocument();
    });
  });

  test("allows editing and saving user data", async () => {
    render(
      <Router>
        <NotificationProvider>
          <Profile />
        </NotificationProvider>
      </Router>
    );

    await waitFor(() => {
      expect(screen.getByDisplayValue("testuser")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("editar"));

    const nombreInput = screen.getByLabelText("Nombre");
    fireEvent.change(nombreInput, { target: { value: "NewName" } });

    fireEvent.click(screen.getByText("hecho"));

    await waitFor(() => {
      expect(axios.put).toHaveBeenCalledWith(
        "http://localhost:8000/api/update-client/testuser/",
        expect.objectContaining({ nombre: "NewName" }),
        { withCredentials: true }
      );
    });
  });

  test("shows validation errors", async () => {
    render(
      <Router>
        <NotificationProvider>
          <Profile />
        </NotificationProvider>
      </Router>
    );

    await waitFor(() => {
      expect(screen.getByDisplayValue("testuser")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("editar"));

    const cedulaInput = screen.getByLabelText("Cédula");
    fireEvent.change(cedulaInput, { target: { value: "123" } });

    fireEvent.click(screen.getByText("hecho"));

    await waitFor(() => {
      expect(
        screen.getByText("La cédula debe tener 9 dígitos.")
      ).toBeInTheDocument();
    });
  });

  test("account deactivation flow works correctly", async () => {
    // Mock successful deactivation API call
    axios.post.mockResolvedValueOnce({});

    render(
      <Router>
        <NotificationProvider>
          <Profile />
        </NotificationProvider>
      </Router>
    );

    await waitFor(() => {
      expect(screen.getByDisplayValue("testuser")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Desactivar cuenta"));

    expect(screen.getByTestId("popper-title")).toBeInTheDocument();
    expect(
      screen.getByText("Introduzca su usuario para confirmar")
    ).toBeInTheDocument();

    const confirmInput = screen.getByRole("textbox", { name: "" });
    fireEvent.change(confirmInput, { target: { value: "wronguser" } });
    expect(screen.getByText("Sí")).toBeDisabled();

    fireEvent.change(confirmInput, { target: { value: "testuser" } });
    expect(screen.getByText("Sí")).not.toBeDisabled();

    fireEvent.click(screen.getByText("Sí"));
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        "http://localhost:8000/api/deactivate-user-client/",
        {},
        { withCredentials: true }
      );
    });

    fireEvent.click(screen.getByText("Desactivar cuenta"));
    fireEvent.click(screen.getByText("No"));
    expect(screen.queryByTestId("popper-title")).not.toBeInTheDocument();
  });

  test("shows validation errors for invalid correo", async () => {
    render(
      <Router>
        <NotificationProvider>
          <Profile />
        </NotificationProvider>
      </Router>
    );

    await waitFor(() => {
      expect(screen.getByDisplayValue("testuser")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("editar"));

    const correoInput = screen.getByLabelText("Correo electrónico");
    fireEvent.change(correoInput, { target: { value: "invalidemail" } });

    fireEvent.click(screen.getByText("hecho"));

    await waitFor(() => {
      expect(
        screen.getByText("El correo electrónico no es válido.")
      ).toBeInTheDocument();
    });
  });

  test("shows validation errors for invalid telefono", async () => {
    render(
      <Router>
        <NotificationProvider>
          <Profile />
        </NotificationProvider>
      </Router>
    );

    await waitFor(() => {
      expect(screen.getByDisplayValue("testuser")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("editar"));

    const telefonoInput = screen.getByLabelText("Número teléfono");
    fireEvent.change(telefonoInput, { target: { value: "123" } });

    fireEvent.click(screen.getByText("hecho"));

    await waitFor(() => {
      expect(
        screen.getByText("El teléfono debe tener 8 dígitos.")
      ).toBeInTheDocument();
    });
  });

  test("shows validation errors for empty nombre", async () => {
    render(
      <Router>
        <NotificationProvider>
          <Profile />
        </NotificationProvider>
      </Router>
    );

    await waitFor(() => {
      expect(screen.getByDisplayValue("testuser")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("editar"));

    const nombreInput = screen.getByLabelText("Nombre");
    fireEvent.change(nombreInput, { target: { value: "" } });

    fireEvent.click(screen.getByText("hecho"));

    await waitFor(() => {
      expect(screen.getByText("El nombre es requerido.")).toBeInTheDocument();
    });
  });

  test("shows validation errors for empty apellido1", async () => {
    render(
      <Router>
        <NotificationProvider>
          <Profile />
        </NotificationProvider>
      </Router>
    );

    await waitFor(() => {
      expect(screen.getByDisplayValue("testuser")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("editar"));

    const apellido1Input = screen.getByLabelText("Apellido 1");
    fireEvent.change(apellido1Input, { target: { value: "" } });

    fireEvent.click(screen.getByText("hecho"));

    await waitFor(() => {
      expect(
        screen.getByText("El primer apellido es requerido.")
      ).toBeInTheDocument();
    });
  });
});
