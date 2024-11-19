import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import CardList from "../components/Consult/CardList";

jest.mock("../components/Consult/InfoCard", () =>
  jest.fn(({ item }) => <div>{item.nombre}</div>)
);

describe("CardList", () => {
  const items = Array.from({ length: 20 }, (_, index) => ({
    nombre: `Item ${index + 1}`,
    estado: index % 2 === 0 ? 1 : 0, // Alternating between 1 and 0
    descripcion: `Descripcion ${index + 1}`,
  }));

  const openDelModal = jest.fn();
  const onRestore = jest.fn();
  const openModModal = jest.fn();

  const renderComponent = (props = {}) =>
    render(
      <CardList
        items={items}
        openDelModal={openDelModal}
        onRestore={onRestore}
        openModModal={openModModal}
        hasStatus={true}
        {...props}
      />
    );

  it("renders the correct number of InfoCard components per page", () => {
    renderComponent();
    expect(screen.getAllByText(/Item \d+/)).toHaveLength(9);
  });

  it("changes page when pagination controls are used", () => {
    renderComponent();
    fireEvent.click(screen.getByLabelText("Ir a la página next"));
    expect(screen.getAllByText(/Item \d+/)).toHaveLength(9);
    fireEvent.click(screen.getByLabelText("Ir a la página previous"));
    expect(screen.getAllByText(/Item \d+/)).toHaveLength(9);
  });

  it("displays the correct items on the first page", () => {
    renderComponent();
    items.slice(0, 9).forEach((item, index) => {
      expect(screen.getByText(`Item ${index + 1}`)).toBeInTheDocument();
    });
  });

  it("displays the correct items on the second page", () => {
    renderComponent();
    fireEvent.click(screen.getByLabelText("Ir a la página next"));
    items.slice(9, 18).forEach((item, index) => {
      expect(screen.getByText(`Item ${index + 10}`)).toBeInTheDocument();
    });
  });
});
