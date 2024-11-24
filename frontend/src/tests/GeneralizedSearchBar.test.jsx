import React from "react";
import { render, fireEvent } from "@testing-library/react";
import SearchBar from "../components/Consult/GeneralizedSearchBar";

describe("SearchBar", () => {
  const columns = ["name", "age", "breed"];
  const onSearch = jest.fn();

  it("renders without crashing", () => {
    const { getByPlaceholderText } = render(
      <SearchBar onSearch={onSearch} columns={columns} />
    );
    expect(
      getByPlaceholderText(`Buscar por ${columns[0]}`)
    ).toBeInTheDocument();
  });

  it("calls onSearch with correct parameters when search is submitted", () => {
    const { getByPlaceholderText, getByRole } = render(
      <SearchBar onSearch={onSearch} columns={columns} />
    );
    const input = getByPlaceholderText(`Buscar por ${columns[0]}`);
    const button = getByRole("button", { name: /search/i });

    fireEvent.change(input, { target: { value: "test" } });
    fireEvent.click(button);

    expect(onSearch).toHaveBeenCalledWith("test", columns[0], "asc");
  });

  it("opens and closes the filter modal", () => {
    const { getByText, queryByText } = render(
      <SearchBar onSearch={onSearch} columns={columns} />
    );
    const filterButton = getByText("tune");

    fireEvent.click(filterButton);
    expect(getByText("Configuración de Filtro")).toBeInTheDocument();

    const cancelButton = getByText("Cancelar");
    fireEvent.click(cancelButton);
    expect(queryByText("Configuración de Filtro")).not.toBeInTheDocument();
  });

  it("applies filters correctly", () => {
    const { getByText, getByLabelText } = render(
      <SearchBar onSearch={onSearch} columns={columns} />
    );
    const filterButton = getByText("tune");

    fireEvent.click(filterButton);
    const columnSelect = getByLabelText("Columna:");
    const orderSelect = getByLabelText("Orden:");
    const applyButton = getByText("Aplicar");

    fireEvent.change(columnSelect, { target: { value: columns[1] } });
    fireEvent.change(orderSelect, { target: { value: "desc" } });
    fireEvent.click(applyButton);

    expect(onSearch).toHaveBeenCalledWith("", columns[1], "desc");
  });
});
