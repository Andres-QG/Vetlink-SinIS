import React from "react";
import { render, screen } from "@testing-library/react";
import ConsultVaccinesHistory from "../routes/ConsultVaccinesHistory";

describe("ConsultVaccinesHistory", () => {
  test("renders the component with correct title", () => {
    render(<ConsultVaccinesHistory />);
    const titleElement = screen.getByText(/Historial de Vacunación/i);
    expect(titleElement).toBeInTheDocument();
  });
});
