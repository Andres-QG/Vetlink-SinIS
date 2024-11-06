import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import ConsultRecords from "../routes/ConsultRecords";
import axios from "axios";

jest.mock("axios");

describe("ConsultRecords", () => {
  beforeEach(() => {
    axios.get.mockImplementation((url, config) => {
      if (url.includes("consult-mascotas")) {
        return Promise.resolve({ data: { results: [] } });
      } else if (url.includes("consult-vaccines")) {
        return Promise.resolve({ data: {} });
      } else if (url.includes("consult-symptoms")) {
        return Promise.resolve({ data: {} });
      } else if (url.includes("consult-treatments")) {
        return Promise.resolve({ data: {} });
      } else if (url.includes("consult-pet-records")) {
        return Promise.resolve({ data: { results: [] } });
      } else {
        return Promise.reject(new Error("Unknown URL"));
      }
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("Renders ConsultView", async () => {
    render(<ConsultRecords />);

    await waitFor(() => expect(axios.get).toHaveBeenCalled());

    expect(screen.getByText("Expedientes")).toBeInTheDocument();
  });

  test("fetch all data", async () => {
    render(<ConsultRecords />);

    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(5));

    expect(axios.get).toHaveBeenCalledWith(
      expect.stringContaining("consult-pet-records/"),
      { params: { page_size: 1000 }, withCredentials: true }
    );
    expect(axios.get).toHaveBeenCalledWith(
      expect.stringContaining("consult-mascotas/?page_size=1000")
    );
    expect(axios.get).toHaveBeenCalledWith(
      expect.stringContaining("consult-vaccines/?page_size=1000")
    );
    expect(axios.get).toHaveBeenCalledWith(
      expect.stringContaining("consult-symptoms/?page_size=1000")
    );
    expect(axios.get).toHaveBeenCalledWith(
      expect.stringContaining("consult-treatments/?page_size=1000")
    );
  });
});
