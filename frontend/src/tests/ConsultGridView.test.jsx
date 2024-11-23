import React from "react";
import {
  render,
  screen,
  waitFor,
  fireEvent,
  act,
} from "@testing-library/react";
import axios from "axios";
import ConsultGridView from "../components/Consult/ConsultGridView";

jest.mock("axios");

describe("ConsultGridView", () => {
  const defaultProps = {
    fetchUrl: "/api/items",
    addUrl: "/api/items/add",
    deletionUrl: "/api/items/delete",
    modificationUrl: "/api/items/modify",
    restoreUrl: "/api/items/restore",
    columns: ["nombre", "descripcion", "estado"],
    itemDisplayName: "Item",
    hasStatus: true,
  };

  const mockData = {
    results: [
      { id: 1, nombre: "Item 1", estado: "1", descripcion: "Descripción 1" },
      { id: 2, nombre: "Item 2", estado: "0", descripcion: "Descripción 2" },
    ],
    next: null,
  };

  beforeEach(() => {
    axios.get.mockResolvedValue({ data: mockData });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders without crashing", () => {
    render(<ConsultGridView {...defaultProps} />);
  });

  test("displays the correct title", () => {
    render(<ConsultGridView {...defaultProps} />);
    expect(screen.getByText("Consultar Item")).toBeInTheDocument();
  });

  test("renders the Add button", () => {
    render(<ConsultGridView {...defaultProps} />);
    expect(screen.getByText("Agregar")).toBeInTheDocument();
  });

  test("handles fetch error", async () => {
    axios.get.mockRejectedValueOnce(new Error("Fetch error"));
    render(<ConsultGridView {...defaultProps} />);
    await waitFor(() =>
      expect(screen.queryByText("Item 1")).not.toBeInTheDocument()
    );
    expect(screen.queryByText("Item 2")).not.toBeInTheDocument();
  });

  test("displays items after fetching", async () => {
    await act(async () => {
      render(<ConsultGridView {...defaultProps} />);
    });
    await waitFor(() => expect(screen.getByText("Item 1")).toBeInTheDocument());
    expect(screen.getByText("Item 2")).toBeInTheDocument();
  });
});
