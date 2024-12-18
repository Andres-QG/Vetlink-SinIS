import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
  within,
} from "@testing-library/react";
import AddRecord from "../components/consultRecords/AddRecord";
import axios from "axios";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import userEvent from "@testing-library/user-event";

jest.mock("axios");

const mockHandleClose = jest.fn();
const mockOnSuccess = jest.fn();
const mockOtherData = {
  mascotas: [
    { mascota_id: "61", nombre: "Firulais", usuario_cliente: "andresqg" },
    {
      mascota_id: "311",
      nombre: "Paco Raban",
      usuario_cliente: "test_client1",
    },
  ],
  vacunas: [{ nombre: "Parvovirus Canino" }, { nombre: "Moquillo Canino" }],
  sintomas: [{ nombre: "Fiebre" }, { nombre: "Fiebre" }],
  tratamientos: [
    { nombre: "Infección respiratoria" },
    { nombre: "Infección respiratoria" },
  ],
};

describe("AddRecord Component", () => {
  test("renders AddRecord component", async () => {
    render(
      <AddRecord
        open={true}
        handleClose={mockHandleClose}
        onSuccess={mockOnSuccess}
        otherData={mockOtherData}
      />
    );
    expect(screen.getByText("Agrega Expediente")).toBeInTheDocument();
  });

  test("submits form with valid data", async () => {
    render(
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <AddRecord
          open={true}
          handleClose={mockHandleClose}
          onSuccess={mockOnSuccess}
          otherData={mockOtherData}
        />
      </LocalizationProvider>
    );

    const autocompleteInput = screen.getByRole("combobox", {
      name: /ID de la mascota\*/i,
    });

    await act(async () => {
      autocompleteInput.focus();
      fireEvent.mouseDown(autocompleteInput);
    });

    const listbox = await screen.findByRole("listbox");

    const optionToSelect = within(listbox).getByText(
      "311 - Paco Raban (dueño: test_client1)"
    );

    await act(async () => {
      fireEvent.click(optionToSelect);
    });

    expect(autocompleteInput).toHaveValue(
      "311 - Paco Raban (dueño: test_client1)"
    );

    await act(async () => {
      const dateInput = screen.getByLabelText("Fecha y hora de consulta*");
      userEvent.clear(dateInput);
      await userEvent.type(dateInput, "10/10/2023 10:00 AM");

      fireEvent.change(screen.getByLabelText("Peso (Kg)*"), {
        target: { value: "2" },
      });

      fireEvent.change(screen.getByLabelText("Diagnóstico*"), {
        target: { value: "Sano" },
      });
    });

    axios.post.mockResolvedValue({ status: 201 });

    const submitButton = screen.getByText("Agregar Expediente");
    await act(async () => {
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(mockOnSuccess).toHaveBeenCalledWith(
        "Expediente agregado exitosamente.",
        "success"
      );
    });
  });

  test("form validation fails when required fields are empty", async () => {
    render(
      <AddRecord
        open={true}
        handleClose={mockHandleClose}
        onSuccess={mockOnSuccess}
        otherData={mockOtherData}
      />
    );

    const submitButton = screen.getByText("Agregar Expediente");
    await act(async () => {
      fireEvent.click(submitButton);
    });

    expect(
      screen.getByText("Por favor, introduzca un ID de mascota válido")
    ).toBeInTheDocument();
    expect(screen.getByText("Fecha es obligatoria")).toBeInTheDocument();
    expect(
      screen.getByText("Por favor, introduzca un peso válido")
    ).toBeInTheDocument();
    expect(screen.getByText("Diagnóstico es obligatorio")).toBeInTheDocument();
  });

  test("form validation fails when invalid data is provided", async () => {
    render(
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <AddRecord
          open={true}
          handleClose={mockHandleClose}
          onSuccess={mockOnSuccess}
          otherData={mockOtherData}
        />
      </LocalizationProvider>
    );

    const datePickerInput = screen.getByLabelText(
      /Fecha y hora de consulta\*/i
    );
    fireEvent.change(datePickerInput, {
      target: { value: "12/12/2025 03:30 PM" },
    });
    await act(async () => {
      fireEvent.change(screen.getByLabelText("ID de la mascota*"), {
        target: { value: "-1" },
      });

      fireEvent.change(screen.getByLabelText("Peso (Kg)*"), {
        target: { value: "-5" },
      });

      fireEvent.change(screen.getByLabelText("Diagnóstico*"), {
        target: { value: "A".repeat(256) }, // Exceeding 255 characters
      });
    });

    const submitButton = screen.getByText("Agregar Expediente");
    await act(async () => {
      fireEvent.click(submitButton);
    });
    await waitFor(() => {
      expect(
        screen.getByText("Por favor, introduzca un ID de mascota válido")
      ).toBeInTheDocument();
      expect(
        screen.getByText("La fecha no puede ser en el futuro")
      ).toBeInTheDocument();
      expect(
        screen.getByText("Por favor, introduzca un peso válido")
      ).toBeInTheDocument();
      expect(
        screen.getByText("El diagnóstico no puede exceder 255 caracteres")
      ).toBeInTheDocument();
    });
  });

  test("form validation fails when weight exceeds 4 digits", async () => {
    render(
      <AddRecord
        open={true}
        handleClose={mockHandleClose}
        onSuccess={mockOnSuccess}
        otherData={mockOtherData}
      />
    );

    await act(async () => {
      fireEvent.change(screen.getByLabelText("Peso (Kg)*"), {
        target: { value: "12345" },
      });
    });

    const submitButton = screen.getByText("Agregar Expediente");
    await act(async () => {
      fireEvent.click(submitButton);
    });

    expect(
      screen.getByText("El peso no puede tener más de 4 dígitos")
    ).toBeInTheDocument();
  });

  test("form validation fails when diagnosis exceeds 255 characters", async () => {
    render(
      <AddRecord
        open={true}
        handleClose={mockHandleClose}
        onSuccess={mockOnSuccess}
        otherData={mockOtherData}
      />
    );

    await act(async () => {
      fireEvent.change(screen.getByLabelText("Diagnóstico*"), {
        target: { value: "A".repeat(256) },
      });
    });

    const submitButton = screen.getByText("Agregar Expediente");
    await act(async () => {
      fireEvent.click(submitButton);
    });

    expect(
      screen.getByText("El diagnóstico no puede exceder 255 caracteres")
    ).toBeInTheDocument();
  });

  test("form submission fails with 404 error", async () => {
    render(
      <AddRecord
        open={true}
        handleClose={mockHandleClose}
        onSuccess={mockOnSuccess}
        otherData={mockOtherData}
      />
    );

    const autocompleteInput = screen.getByRole("combobox", {
      name: /ID de la mascota\*/i,
    });

    await act(async () => {
      autocompleteInput.focus();
      fireEvent.mouseDown(autocompleteInput);
    });

    const listbox = await screen.findByRole("listbox");

    const optionToSelect = within(listbox).getByText(
      "311 - Paco Raban (dueño: test_client1)"
    );

    await act(async () => {
      fireEvent.click(optionToSelect);
    });

    expect(autocompleteInput).toHaveValue(
      "311 - Paco Raban (dueño: test_client1)"
    );

    const datePickerInput = screen.getByLabelText(
      /Fecha y hora de consulta\*/i
    );
    fireEvent.change(datePickerInput, {
      target: { value: "10/10/2023 03:30 PM" },
    });

    await act(async () => {
      fireEvent.change(screen.getByLabelText("Peso (Kg)*"), {
        target: { value: "2" },
      });

      fireEvent.change(screen.getByLabelText("Diagnóstico*"), {
        target: { value: "Sano" },
      });
    });

    axios.post.mockRejectedValue({
      response: { status: 404, data: "Not Found" },
    });

    const submitButton = screen.getByText("Agregar Expediente");
    await act(async () => {
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(mockOnSuccess).toHaveBeenCalledWith(
        "Expediente no encontrado.",
        "error"
      );
    });
  });

  test("form submission fails with 400 error", async () => {
    render(
      <AddRecord
        open={true}
        handleClose={mockHandleClose}
        onSuccess={mockOnSuccess}
        otherData={mockOtherData}
      />
    );

    const autocompleteInput = screen.getByRole("combobox", {
      name: /ID de la mascota\*/i,
    });

    await act(async () => {
      autocompleteInput.focus();
      fireEvent.mouseDown(autocompleteInput);
    });

    const listbox = await screen.findByRole("listbox");

    const optionToSelect = within(listbox).getByText(
      "311 - Paco Raban (dueño: test_client1)"
    );

    await act(async () => {
      fireEvent.click(optionToSelect);
    });

    expect(autocompleteInput).toHaveValue(
      "311 - Paco Raban (dueño: test_client1)"
    );

    const datePickerInput = screen.getByLabelText(
      /Fecha y hora de consulta\*/i
    );
    fireEvent.change(datePickerInput, {
      target: { value: "10/10/2024 03:30 PM" },
    });
    await act(async () => {
      fireEvent.change(screen.getByLabelText("Peso (Kg)*"), {
        target: { value: "2" },
      });

      fireEvent.change(screen.getByLabelText("Diagnóstico*"), {
        target: { value: "Sano" },
      });
    });

    axios.post.mockRejectedValue({
      response: { status: 400, data: "Bad Request" },
    });

    const submitButton = screen.getByText("Agregar Expediente");
    await act(async () => {
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(mockOnSuccess).toHaveBeenCalledWith(
        "Datos inválidos. Revise los campos e intente nuevamente.",
        "error"
      );
    });
  });

  test("form submission fails with unknown error", async () => {
    render(
      <AddRecord
        open={true}
        handleClose={mockHandleClose}
        onSuccess={mockOnSuccess}
        otherData={mockOtherData}
      />
    );

    const autocompleteInput = screen.getByRole("combobox", {
      name: /ID de la mascota\*/i,
    });

    await act(async () => {
      autocompleteInput.focus();
      fireEvent.mouseDown(autocompleteInput);
    });

    const listbox = await screen.findByRole("listbox");

    const optionToSelect = within(listbox).getByText(
      "311 - Paco Raban (dueño: test_client1)"
    );

    await act(async () => {
      fireEvent.click(optionToSelect);
    });

    expect(autocompleteInput).toHaveValue(
      "311 - Paco Raban (dueño: test_client1)"
    );

    const datePickerInput = screen.getByLabelText(
      /Fecha y hora de consulta\*/i
    );
    fireEvent.change(datePickerInput, {
      target: { value: "10/10/2024 12:00 AM" },
    });
    await act(async () => {
      fireEvent.change(screen.getByLabelText("Peso (Kg)*"), {
        target: { value: "2" },
      });

      fireEvent.change(screen.getByLabelText("Diagnóstico*"), {
        target: { value: "Sano" },
      });
    });

    axios.post.mockRejectedValue(new Error("Network Error"));

    const submitButton = screen.getByText("Agregar Expediente");
    await act(async () => {
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(mockOnSuccess).toHaveBeenCalledWith(
        "Error desconocido. Inténtelo más tarde.",
        "error"
      );
    });
  });
  test("clears form when 'Limpiar' button is clicked", async () => {
    render(
      <AddRecord
        open={true}
        handleClose={mockHandleClose}
        onSuccess={mockOnSuccess}
        otherData={mockOtherData}
      />
    );

    await act(async () => {
      fireEvent.change(screen.getByLabelText("Fecha y hora de consulta*"), {
        target: { value: "2024-10-10T00:00" },
      });

      fireEvent.change(screen.getByLabelText("Peso (Kg)*"), {
        target: { value: "2" },
      });

      fireEvent.change(screen.getByLabelText("Diagnóstico*"), {
        target: { value: "Sano" },
      });
    });

    const clearButton = screen.getByText("Limpiar");
    await act(async () => {
      fireEvent.click(clearButton);
    });

    expect(screen.getByLabelText("Fecha y hora de consulta*")).toHaveValue("");
    expect(screen.getByLabelText("Peso (Kg)*")).toHaveValue("");
    expect(screen.getByLabelText("Diagnóstico*")).toHaveValue("");
  });

  test("displays server error message when status is 500", async () => {
    render(
      <AddRecord
        open={true}
        handleClose={mockHandleClose}
        onSuccess={mockOnSuccess}
        otherData={mockOtherData}
      />
    );

    const autocompleteInput = screen.getByRole("combobox", {
      name: /ID de la mascota\*/i,
    });

    await act(async () => {
      autocompleteInput.focus();
      fireEvent.mouseDown(autocompleteInput);
    });

    const listbox = await screen.findByRole("listbox");

    const optionToSelect = within(listbox).getByText(
      "311 - Paco Raban (dueño: test_client1)"
    );

    await act(async () => {
      fireEvent.click(optionToSelect);
    });

    expect(autocompleteInput).toHaveValue(
      "311 - Paco Raban (dueño: test_client1)"
    );

    const datePickerInput = screen.getByLabelText(
      /Fecha y hora de consulta\*/i
    );
    fireEvent.change(datePickerInput, {
      target: { value: "10/10/2024 12:00 AM" },
    });

    await act(async () => {
      fireEvent.change(screen.getByLabelText("Peso (Kg)*"), {
        target: { value: "2" },
      });

      fireEvent.change(screen.getByLabelText("Diagnóstico*"), {
        target: { value: "Sano" },
      });
    });

    axios.post.mockRejectedValue({
      response: { status: 500, data: "Internal Server Error" },
    });

    const submitButton = screen.getByText("Agregar Expediente");
    await act(async () => {
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(mockOnSuccess).toHaveBeenCalledWith(
        "Error interno del servidor. Inténtelo más tarde.",
        "error"
      );
    });
  });

  test("handles empty sintomas, vacunas, and tratamientos", async () => {
    render(
      <AddRecord
        open={true}
        handleClose={mockHandleClose}
        onSuccess={mockOnSuccess}
        otherData={mockOtherData}
      />
    );

    await act(async () => {
      fireEvent.change(screen.getByLabelText("Fecha y hora de consulta*"), {
        target: { value: "2024-10-10T00:00" },
      });

      fireEvent.change(screen.getByLabelText("Peso (Kg)*"), {
        target: { value: "2" },
      });

      fireEvent.change(screen.getByLabelText("Diagnóstico*"), {
        target: { value: "Sano" },
      });
    });

    axios.post.mockResolvedValue({ status: 201 });

    const submitButton = screen.getByText("Agregar Expediente");
    await act(async () => {
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(mockOnSuccess).toHaveBeenCalledWith(
        "Expediente agregado exitosamente.",
        "success"
      );
    });
  });

  test("handles empty sintomas, vacunas, and tratamientos", async () => {
    render(
      <AddRecord
        open={true}
        handleClose={mockHandleClose}
        onSuccess={mockOnSuccess}
        otherData={{
          ...mockOtherData,
          sintomas: [],
          vacunas: [],
          tratamientos: [],
        }}
      />
    );

    await act(async () => {
      fireEvent.change(screen.getByLabelText("Fecha y hora de consulta*"), {
        target: { value: "2024-10-10T00:00" },
      });

      fireEvent.change(screen.getByLabelText("Peso (Kg)*"), {
        target: { value: "2" },
      });

      fireEvent.change(screen.getByLabelText("Diagnóstico*"), {
        target: { value: "Sano" },
      });
    });

    axios.post.mockResolvedValue({ status: 201 });

    const submitButton = screen.getByText("Agregar Expediente");
    await act(async () => {
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(mockOnSuccess).toHaveBeenCalledWith(
        "Expediente agregado exitosamente.",
        "success"
      );
    });
  });

  test("handles error when sending form data fails", async () => {
    render(
      <AddRecord
        open={true}
        handleClose={mockHandleClose}
        onSuccess={mockOnSuccess}
        otherData={mockOtherData}
      />
    );

    const datePickerInput = screen.getByLabelText(
      /Fecha y hora de consulta\*/i
    );
    fireEvent.change(datePickerInput, {
      target: { value: "10/10/2024 12:00 AM" },
    });
    await act(async () => {
      fireEvent.change(screen.getByLabelText("Peso (Kg)*"), {
        target: { value: "2" },
      });

      fireEvent.change(screen.getByLabelText("Diagnóstico*"), {
        target: { value: "Sano" },
      });
    });

    axios.post.mockRejectedValue(new Error("Network Error"));

    const submitButton = screen.getByText("Agregar Expediente");
    await act(async () => {
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(mockOnSuccess).toHaveBeenCalledWith(
        "Error desconocido. Inténtelo más tarde.",
        "error"
      );
    });
  });

  test("displays validation errors for empty fields", async () => {
    render(
      <AddRecord
        open={true}
        handleClose={mockHandleClose}
        onSuccess={mockOnSuccess}
        otherData={mockOtherData}
      />
    );

    const submitButton = screen.getByText("Agregar Expediente");
    await act(async () => {
      fireEvent.click(submitButton);
    });

    expect(
      screen.getByText("Por favor, introduzca un ID de mascota válido")
    ).toBeInTheDocument();
    expect(screen.getByText("Fecha es obligatoria")).toBeInTheDocument();
    expect(
      screen.getByText("Por favor, introduzca un peso válido")
    ).toBeInTheDocument();
    expect(screen.getByText("Diagnóstico es obligatorio")).toBeInTheDocument();
  });
});
