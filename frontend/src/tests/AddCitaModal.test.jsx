// src/tests/AddCitaModal.test.jsx

import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AddCitaModal from "../components/consultCitas/AddCitaModal";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { es } from "date-fns/locale";
import axios from "axios";
import StripeContext from "../context/StripeContext";

jest.mock("axios");

const mockStripe = {
  createPaymentMethod: jest.fn(),
};

const mockElements = {
  getElement: jest.fn(),
};

const MockStripeProvider = ({ children }) => (
  <StripeContext.Provider value={{ stripe: mockStripe, elements: mockElements }}>
    {children}
  </StripeContext.Provider>
);

const mockHandleClose = jest.fn();
const mockOnSuccess = jest.fn();

const mockOtherDataNonRole4 = {
  clientes: [{ usuario: "user1", nombre: "Client1" }],
  veterinarios: [{ usuario: "vet1", nombre: "Veterinarian1" }],
  clinicas: [{ clinica_id: 1, nombre: "Clinic1" }],
  services: [{ servicio_id: 1, nombre: "Service1" }],
  horarios: ["09:00", "10:00"],
  user: { role: 1, user: "user1", clinica: 1 }, // role !== 4
};

describe("AddCitaModal Component with user.role !== 4", () => {
  beforeEach(async () => {
    jest.clearAllMocks();

    axios.put.mockImplementation((url) => {
      if (url === "http://localhost:8000/api/get-pets/") {
        return Promise.resolve({ data: { pets: [{ mascota_id: 1, nombre: "Pet1" }] } });
      }
      if (url === "http://localhost:8000/api/get-disp-times/") {
        return Promise.resolve({ data: { available_times: ["09:00", "10:00"] } });
      }
      return Promise.reject(new Error("Unknown URL"));
    });

    axios.post.mockImplementation((url) => {
      if (url === "http://localhost:8000/api/add-cita/") {
        return Promise.resolve({ status: 200 });
      }
      if (url === "http://localhost:8000/api/create-payment/") {
        return Promise.resolve({ status: 201 });
      }
      return Promise.reject(new Error("Unknown URL"));
    });

    render(
      <MockStripeProvider>
        <LocalizationProvider dateAdapter={AdapterDateFns} locale={es}>
          <AddCitaModal
            open={true}
            handleClose={mockHandleClose}
            onSuccess={mockOnSuccess}
            otherData={mockOtherDataNonRole4} // user.role !== 4
          />
        </LocalizationProvider>
      </MockStripeProvider>
    );

    await waitFor(() => {
      expect(screen.getByLabelText("Cliente")).toBeInTheDocument();
    });
  });

  it("renders the Cliente field when user role is not 4", () => {
    const clienteField = screen.getByLabelText("Cliente");
    expect(clienteField).toBeInTheDocument();
    expect(clienteField).not.toBeDisabled();
    expect(clienteField).toHaveValue("");
  });

  it("displays validation error message if 'Mascota' field is empty on step 0", async () => {
    const submitButton = screen.getByRole("button", { name: /Siguiente/i });
    const mascotaField = screen.getByLabelText("Mascota");
    expect(mascotaField).toHaveValue("");
    await userEvent.click(submitButton);
    expect(await screen.findByText("Mascota requerida.")).toBeInTheDocument();
  });

  it("displays validation error message if 'Servicios' field is empty on step 0", async () => {
    const submitButton = screen.getByRole("button", { name: /Siguiente/i });
    const serviciosInput = screen.getByLabelText("Servicios*");
    expect(serviciosInput).toBeInTheDocument();
    await userEvent.click(submitButton);
    expect(await screen.findByText("Al menos un servicio es requerido.")).toBeInTheDocument();
  });
});
