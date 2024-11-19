import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import InfoCard from "../components/Consult/InfoCard";

const mockItem = {
  nombre: "Test Item",
  estado: 1,
  descripcion:
    "This is a test description that exceeds fifty characters to test truncation.",
};

const mockOpenDelModal = jest.fn();
const mockOpenModModal = jest.fn();
const mockOnRestore = jest.fn();

describe("InfoCard Component", () => {
  test("renders InfoCard with item data", () => {
    render(
      <InfoCard
        item={mockItem}
        openDelModal={mockOpenDelModal}
        openModModal={mockOpenModModal}
        onRestore={mockOnRestore}
        hasStatus={true}
      />
    );

    expect(screen.getByText("Test Item")).toBeTruthy();
    expect(screen.getByText("Disponible")).toBeTruthy();
    expect(
      screen.getByText("This is a test description that exceeds fifty char...")
    ).toBeTruthy();
  });

  test("expands and collapses description text", () => {
    render(
      <InfoCard
        item={mockItem}
        openDelModal={mockOpenDelModal}
        openModModal={mockOpenModModal}
        onRestore={mockOnRestore}
        hasStatus={true}
      />
    );

    const expandButton = screen.getByText("Leer más");
    fireEvent.click(expandButton);
    expect(
      screen.getByText(
        "This is a test description that exceeds fifty characters to test truncation."
      )
    ).toBeTruthy();

    const collapseButton = screen.getByText("Leer menos");
    fireEvent.click(collapseButton);
    expect(
      screen.getByText("This is a test description that exceeds fifty char...")
    ).toBeTruthy();
  });

  test("calls openModModal when Modificar button is clicked", () => {
    render(
      <InfoCard
        item={mockItem}
        openDelModal={mockOpenDelModal}
        openModModal={mockOpenModModal}
        onRestore={mockOnRestore}
        hasStatus={true}
      />
    );

    const modifyButton = screen.getByText("Modificar");
    fireEvent.click(modifyButton);
    expect(mockOpenModModal).toHaveBeenCalledWith(mockItem);
  });

  test("calls openDelModal when Desactivar button is clicked", () => {
    render(
      <InfoCard
        item={mockItem}
        openDelModal={mockOpenDelModal}
        openModModal={mockOpenModModal}
        onRestore={mockOnRestore}
        hasStatus={true}
      />
    );

    const deactivateButton = screen.getByText("Desactivar");
    fireEvent.click(deactivateButton);
    expect(mockOpenDelModal).toHaveBeenCalledWith(mockItem);
  });

  test("calls onRestore when Reactivar button is clicked", () => {
    const inactiveItem = { ...mockItem, estado: 0 };
    render(
      <InfoCard
        item={inactiveItem}
        openDelModal={mockOpenDelModal}
        openModModal={mockOpenModModal}
        onRestore={mockOnRestore}
        hasStatus={true}
      />
    );

    const reactivateButton = screen.getByText("Reactivar");
    fireEvent.click(reactivateButton);
    expect(mockOnRestore).toHaveBeenCalledWith(inactiveItem);
  });

  test("does not render status chip when hasStatus is false", () => {
    render(
      <InfoCard
        item={mockItem}
        openDelModal={mockOpenDelModal}
        openModModal={mockOpenModModal}
        onRestore={mockOnRestore}
        hasStatus={false}
      />
    );

    expect(screen.queryByText("Disponible")).toBeNull();
    expect(screen.queryByText("No Disponible")).toBeNull();
  });

  test("renders correct button text based on item status", () => {
    render(
      <InfoCard
        item={mockItem}
        openDelModal={mockOpenDelModal}
        openModModal={mockOpenModModal}
        onRestore={mockOnRestore}
        hasStatus={true}
      />
    );

    expect(screen.getByText("Desactivar")).toBeTruthy();

    const inactiveItem = { ...mockItem, estado: 0 };
    render(
      <InfoCard
        item={inactiveItem}
        openDelModal={mockOpenDelModal}
        openModModal={mockOpenModModal}
        onRestore={mockOnRestore}
        hasStatus={true}
      />
    );

    expect(screen.getByText("Reactivar")).toBeTruthy();
  });
});
