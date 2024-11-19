import React from "react";
import { render, screen } from "@testing-library/react";
import ConsultVaccines from "../routes/ConsultVaccines";

describe("ConsultVaccines", () => {
  test("renders the component with correct item display name", () => {
    render(<ConsultVaccines />);
    const itemDisplayNameElement = screen.getByText(/Vacunas/i);
    expect(itemDisplayNameElement).toBeInTheDocument();
  });
});
