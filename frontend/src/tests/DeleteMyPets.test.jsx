import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import DeleteMyPets from "../components/ConsultMyPets/DeleteMyPets";
import axios from "axios";

jest.mock("axios");

const petData = {
  MASCOTA_ID: 1,
  NOMBRE: "Fido",
};

describe("DeleteMyPets Component", () => {
  const handleClose = jest.fn();
  const onSuccess = jest.fn();

  const renderComponent = (open = true) => {
    render(
      <DeleteMyPets
        open={open}
        handleClose={handleClose}
        petData={petData}
        onSuccess={onSuccess}
      />
    );
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("TC-56: Eliminar una mascota y verificar eliminación", async () => {
    axios.delete.mockResolvedValue({ status: 200 });
    renderComponent();

    fireEvent.click(screen.getByRole("button", { name: /Eliminar/i }));

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalledWith(
        "Mascota eliminada exitosamente",
        "success"
      );
    });
  });

  test("TC-57: Confirmar mensaje de confirmación antes de eliminar", () => {
    renderComponent();

    // Busca el mensaje de confirmación utilizando una función que haga coincidir solo una parte del texto
    expect(
      screen.getByText((content, element) => {
        return (
          content.includes("¿Estás seguro de que quieres eliminar a") &&
          content.includes("Esta acción es irreversible.")
        );
      })
    ).toBeInTheDocument();
  });

  test("TC-58: Cancelar eliminación y verificar persistencia", () => {
    renderComponent();

    fireEvent.click(screen.getByRole("button", { name: /Cancelar/i }));

    expect(handleClose).toHaveBeenCalled();
    expect(onSuccess).not.toHaveBeenCalled();
  });

  test("TC-59: Verificar actualización automática de la lista tras eliminar mascota", async () => {
    axios.delete.mockResolvedValue({ status: 200 });
    renderComponent();

    fireEvent.click(screen.getByRole("button", { name: /Eliminar/i }));

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalledWith(
        "Mascota eliminada exitosamente",
        "success"
      );
      expect(handleClose).toHaveBeenCalled();
    });
  });

  test("TC-60: Validar mensaje de éxito tras la eliminación de una mascota", async () => {
    axios.delete.mockResolvedValue({ status: 200 });
    renderComponent();

    fireEvent.click(screen.getByRole("button", { name: /Eliminar/i }));

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalledWith(
        "Mascota eliminada exitosamente",
        "success"
      );
    });
  });

  test("TC-61: Revisar permisos de eliminación por roles", async () => {
    axios.delete.mockRejectedValue({
      response: { status: 403, data: { error: "Permisos insuficientes" } },
    });
    renderComponent();

    fireEvent.click(screen.getByRole("button", { name: /Eliminar/i }));

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalledWith("Permisos insuficientes", "error");
    });
  });
});
