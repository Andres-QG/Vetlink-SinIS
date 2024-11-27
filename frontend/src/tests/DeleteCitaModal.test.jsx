// src/tests/DeleteCitaModal.test.jsx

import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DeleteCitaModal from "../components/consultCitas/DeleteCitaModal";
import axios from "axios";

jest.mock("axios");

const mockHandleClose = jest.fn();
const mockOnSuccess = jest.fn();

const mockCitaData = {
  cita_id: 1,
  PET_NAME: "Pet1",
  FECHA: "01/12/2024",
  HORA: "8:00",
};

describe("DeleteCitaModal Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("calls handleClose when Cancelar is clicked", async () => {
    render(
      <DeleteCitaModal
        open={true}
        handleClose={mockHandleClose}
        citaData={mockCitaData}
        onSuccess={mockOnSuccess}
      />
    );

    const cancelarButton = screen.getByRole("button", { name: /Cancelar/i });
    await userEvent.click(cancelarButton);

    expect(mockHandleClose).toHaveBeenCalledTimes(1);
  });

  it("handles successful deletion", async () => {
    axios.delete.mockResolvedValueOnce({ status: 200 });

    render(
      <DeleteCitaModal
        open={true}
        handleClose={mockHandleClose}
        citaData={mockCitaData}
        onSuccess={mockOnSuccess}
      />
    );

    const eliminarButton = screen.getByRole("button", { name: /Eliminar/i });
    await userEvent.click(eliminarButton);

    await waitFor(() => {
      expect(axios.delete).toHaveBeenCalledWith(
        `http://localhost:8000/api/delete-cita/${mockCitaData.cita_id}/`,
        { withCredentials: true }
      );
      expect(mockOnSuccess).toHaveBeenCalledWith(
        "Cita eliminada exitosamente",
        "success"
      );
      expect(mockHandleClose).toHaveBeenCalled();
    });
  });

  it("handles deletion failure", async () => {
    axios.delete.mockRejectedValueOnce({
      response: { data: { error: "Error al eliminar la cita" } },
    });

    render(
      <DeleteCitaModal
        open={true}
        handleClose={mockHandleClose}
        citaData={mockCitaData}
        onSuccess={mockOnSuccess}
      />
    );

    const eliminarButton = screen.getByRole("button", { name: /Eliminar/i });
    await userEvent.click(eliminarButton);

    await waitFor(() => {
      expect(axios.delete).toHaveBeenCalledWith(
        `http://localhost:8000/api/delete-cita/${mockCitaData.cita_id}/`,
        { withCredentials: true }
      );
      expect(mockOnSuccess).toHaveBeenCalledWith(
        "Error al eliminar la cita",
        "error"
      );
      expect(mockHandleClose).not.toHaveBeenCalled();
    });
  });

  it("disables Eliminar button and shows loading indicator when deleting", async () => {
    let resolvePromise;
    axios.delete.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolvePromise = resolve;
        })
    );

    render(
      <DeleteCitaModal
        open={true}
        handleClose={mockHandleClose}
        citaData={mockCitaData}
        onSuccess={mockOnSuccess}
      />
    );

    const eliminarButton = screen.getByRole("button", { name: /Eliminar/i });
    await userEvent.click(eliminarButton);

    expect(eliminarButton).toBeDisabled();
    expect(screen.getByText("Eliminando...")).toBeInTheDocument();

    resolvePromise({ status: 200 });

    await waitFor(() => {
      expect(screen.queryByRole("button", { name: /Eliminar/i })).not.toBeInTheDocument();
    });
  });
});
