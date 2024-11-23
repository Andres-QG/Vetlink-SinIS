import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import {
  NotificationProvider,
  useNotification,
} from "../components/Notification";

const TestComponent = () => {
  const showNotification = useNotification();
  return (
    <button onClick={() => showNotification("Test message", "success")}>
      Show Notification
    </button>
  );
};

describe("NotificationProvider", () => {
  test("renders children correctly", () => {
    render(
      <NotificationProvider>
        <div>Child Component</div>
      </NotificationProvider>
    );
    expect(screen.getByText("Child Component")).toBeInTheDocument();
  });

  test("shows notification with correct message and type", () => {
    render(
      <NotificationProvider>
        <TestComponent />
      </NotificationProvider>
    );

    fireEvent.click(screen.getByText("Show Notification"));
    expect(screen.getByText("Test message")).toBeInTheDocument();
    expect(screen.getByText("Éxito")).toBeInTheDocument();
  });

  test("closes notification on close button click", () => {
    render(
      <NotificationProvider>
        <TestComponent />
      </NotificationProvider>
    );

    fireEvent.click(screen.getByText("Show Notification"));
    expect(screen.getByText("Test message")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /close/i }));
    expect(screen.queryByText("Test message")).not.toBeInTheDocument();
  });

  test("displays correct title based on notification type", () => {
    render(
      <NotificationProvider>
        <TestComponent />
      </NotificationProvider>
    );

    fireEvent.click(screen.getByText("Show Notification"));
    expect(screen.getByText("Éxito")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /close/i }));

    fireEvent.click(screen.getByText("Show Notification"));
    expect(screen.getByText("Éxito")).toBeInTheDocument();
  });
});
