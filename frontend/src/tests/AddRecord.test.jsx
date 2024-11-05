import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
  within,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AddRecord from "../components/consultRecords/AddRecord";

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

    // Open the Autocomplete options
    await act(async () => {
      autocompleteInput.focus();
      fireEvent.mouseDown(autocompleteInput);
    });

    // Find the listbox (the dropdown menu)
    const listbox = await screen.findByRole("listbox");

    // Use within to search for the option inside the listbox
    const optionToSelect = within(listbox).getByText(
      "311 - Paco Raban (dueño: test_client1)"
    );

    // Click on the option
    await act(async () => {
      fireEvent.click(optionToSelect);
    });

    // Check if the option is selected in the input
    expect(autocompleteInput).toHaveValue(
      "311 - Paco Raban (dueño: test_client1)"
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

    // Submit the form
    await act(async () => {
      fireEvent.click(screen.getByText("Agregar Expediente"));
    });

    // Wait for the mockOnSuccess to be called
    await waitFor(() => {
      expect(mockOnSuccess).toHaveBeenCalledWith(
        "Expediente agregado exitosamente.",
        "success"
      );
    });
  });
});
