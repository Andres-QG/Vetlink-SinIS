import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import GeneralTable from "../components/Consult/GeneralTable";
import { NotificationProvider } from "../components/Notification";

// Mock components
const MockModModal = ({ open, handleClose, selectedItem }) => (
  <div data-testid="mod-modal">
    <button onClick={handleClose}>Close</button>
    <span>Editing {selectedItem?.id}</span>
  </div>
);

const MockDetailsModal = ({ open, handleClose, selectedItem }) => (
  <div data-testid="details-modal">
    <button onClick={handleClose}>Close</button>
    <span>Details for {selectedItem?.id}</span>
  </div>
);

// Mock data
const mockData = [
  { id: 1, name: "Item 1", activo: true },
  { id: 2, name: "Item 2", activo: false },
];

const mockColumns = [
  { field: "id", headerName: "ID", type: "text" },
  { field: "name", headerName: "Name", type: "text" },
  {
    field: "activo",
    headerName: "Status",
    type: "chip",
    chipColors: { activo: "#4caf50", inactivo: "#f44336" },
  },
];

const defaultProps = {
  data: mockData,
  columns: mockColumns,
  totalCount: 2,
  page: 1,
  rowsPerPage: 10,
  onPageChange: jest.fn(),
  deletionUrl: "http://api/delete/",
  pkCol: "id",
  visualIdentifierCol: "name",
  fetchData: jest.fn(),
  ModModal: MockModModal,
  DetailsModal: MockDetailsModal,
  otherData: {},
};

const renderWithProvider = (component) => {
  return render(<NotificationProvider>{component}</NotificationProvider>);
};

describe("GeneralTable Component", () => {
  beforeEach(() => {
    window.innerWidth = 1024;
    window.dispatchEvent(new Event("resize"));
  });

  test("renders table with data in desktop view", () => {
    renderWithProvider(<GeneralTable {...defaultProps} />);
    expect(screen.getByText("Item 1")).toBeInTheDocument();
    expect(screen.getByText("Item 2")).toBeInTheDocument();
  });

  test("renders cards in mobile view", () => {
    window.innerWidth = 500;
    window.dispatchEvent(new Event("resize"));

    renderWithProvider(<GeneralTable {...defaultProps} />);
    expect(screen.getAllByText(/ID:/i)).toHaveLength(2);
  });

  test("displays no data message when data is empty", () => {
    renderWithProvider(<GeneralTable {...defaultProps} data={[]} />);
    expect(screen.getByText("No hay datos disponibles")).toBeInTheDocument();
  });

  test("handles pagination range", () => {
    const props = {
      ...defaultProps,
      totalCount: 30,
      page: 1,
      rowsPerPage: 10,
    };
    renderWithProvider(<GeneralTable {...props} />);
    expect(screen.getByText("1-10 de 30")).toBeInTheDocument();
  });
});
