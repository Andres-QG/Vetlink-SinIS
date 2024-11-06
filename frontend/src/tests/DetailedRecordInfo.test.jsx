import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import DetailedRecordInfo from "../components/consultRecords/DetailedRecordInfo";
import "@testing-library/jest-dom";

const mockHandleClose = jest.fn();
const mockSelectedItem = {
  consulta_id: 1,
  nombre_mascota: "Firulais",
  fecha: "2024-10-10",
  peso: "2",
  sintomas: "Fiebre,Tos",
  vacunas: "Parvovirus Canino,Moquillo Canino",
  tratamientos: "Infección respiratoria,Infección gastrointestinal",
};

describe("DetailedRecordInfo Component", () => {
  test("renders DetailedRecordInfo component with all details", () => {
    render(
      <DetailedRecordInfo
        open={true}
        handleClose={mockHandleClose}
        selectedItem={mockSelectedItem}
      />
    );

    expect(
      screen.getByText("Expediente de consulta ID: 1 de Firulais")
    ).toBeInTheDocument();
    expect(screen.getByText("Fecha: 2024-10-10")).toBeInTheDocument();
    expect(screen.getByText("Peso: 2 Kg")).toBeInTheDocument();
    expect(screen.getByText("Síntomas presentados")).toBeInTheDocument();
    expect(screen.getByText("Fiebre")).toBeInTheDocument();
    expect(screen.getByText("Tos")).toBeInTheDocument();
    expect(screen.getByText("Vacunas suministradas")).toBeInTheDocument();
    expect(screen.getByText("Parvovirus Canino")).toBeInTheDocument();
    expect(screen.getByText("Moquillo Canino")).toBeInTheDocument();
    expect(screen.getByText("Tratamientos recetados")).toBeInTheDocument();
    expect(screen.getByText("Infección respiratoria")).toBeInTheDocument();
    expect(screen.getByText("Infección gastrointestinal")).toBeInTheDocument();
  });

  test("handles empty sintomas, vacunas, and tratamientos", () => {
    render(
      <DetailedRecordInfo
        open={true}
        handleClose={mockHandleClose}
        selectedItem={{
          ...mockSelectedItem,
          sintomas: "",
          vacunas: "",
          tratamientos: "",
        }}
      />
    );

    expect(screen.getByText("Ningún síntoma registrado")).toBeInTheDocument();
    expect(screen.getByText("Ningúna vacuna registrada")).toBeInTheDocument();
    expect(
      screen.getByText("Ningún tratamiento registrado")
    ).toBeInTheDocument();
  });

  test("calls handleClose when close button is clicked", () => {
    render(
      <DetailedRecordInfo
        open={true}
        handleClose={mockHandleClose}
        selectedItem={mockSelectedItem}
      />
    );

    const closeButton = screen.getByLabelText("close");
    fireEvent.click(closeButton);

    expect(mockHandleClose).toHaveBeenCalledTimes(1);
  });

  test("does not render when open is false", () => {
    render(
      <DetailedRecordInfo
        open={false}
        handleClose={mockHandleClose}
        selectedItem={mockSelectedItem}
      />
    );

    expect(
      screen.queryByText("Expediente de consulta ID: 1 de Firulais")
    ).not.toBeInTheDocument();
  });
});
