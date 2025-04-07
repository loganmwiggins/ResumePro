import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import SignUp from "../pages/SignUp";
import { vi } from "vitest";

// Mock showToast to prevent real toast popups
vi.mock("../utils/Toast", () => ({
  showToast: vi.fn(),
}));

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => ({
  ...(await vi.importActual("react-router-dom")),
  useNavigate: () => mockNavigate,
}));

describe("SignUp Page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders form fields and submit button", () => {
    render(
      <MemoryRouter>
        <SignUp />
      </MemoryRouter>
    );

    expect(screen.getByPlaceholderText("First Name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Last Name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Confirm Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sign up/i })).toBeInTheDocument();
  });

  test("shows error toast if required fields are empty", async () => {
    const { showToast } = await import("../utils/Toast");

    render(
      <MemoryRouter>
        <SignUp />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

    await waitFor(() => {
      expect(showToast).toHaveBeenCalledWith("Please fill in all fields.", "error");
    });
  });

  test("shows error toast for invalid email", async () => {
    const { showToast } = await import("../utils/Toast");

    render(
      <MemoryRouter>
        <SignUp />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText("First Name"), { target: { value: "Jane" } });
    fireEvent.change(screen.getByPlaceholderText("Last Name"), { target: { value: "Doe" } });
    fireEvent.change(screen.getByPlaceholderText("Email"), { target: { value: "invalid-email" } });
    fireEvent.change(screen.getByPlaceholderText("Password"), { target: { value: "pass123" } });
    fireEvent.change(screen.getByPlaceholderText("Confirm Password"), { target: { value: "pass123" } });

    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

    await waitFor(() => {
      expect(showToast).toHaveBeenCalledWith("Please enter a valid email address.", "error");
    });
  });

  test("submits form and navigates on success", async () => {
    const { showToast } = await import("../utils/Toast");

    // Mock fetch success response
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ message: "Account created" }),
      })
    );

    render(
      <MemoryRouter>
        <SignUp />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText("First Name"), { target: { value: "Jane" } });
    fireEvent.change(screen.getByPlaceholderText("Last Name"), { target: { value: "Doe" } });
    fireEvent.change(screen.getByPlaceholderText("Email"), { target: { value: "jane@example.com" } });
    fireEvent.change(screen.getByPlaceholderText("Password"), { target: { value: "pass123" } });
    fireEvent.change(screen.getByPlaceholderText("Confirm Password"), { target: { value: "pass123" } });

    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

    await waitFor(() => {
      expect(showToast).toHaveBeenCalledWith("Your account has been created.", "success", "Thanks for Joining!");
      expect(mockNavigate).toHaveBeenCalledWith("/login");
    });
  });

  test("displays error toast when API returns validation errors", async () => {
    const { showToast } = await import("../utils/Toast");

    // Mock fetch with validation errors
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve([{ description: "Email already taken" }]),
      })
    );

    render(
      <MemoryRouter>
        <SignUp />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText("First Name"), { target: { value: "Jane" } });
    fireEvent.change(screen.getByPlaceholderText("Last Name"), { target: { value: "Doe" } });
    fireEvent.change(screen.getByPlaceholderText("Email"), { target: { value: "jane@example.com" } });
    fireEvent.change(screen.getByPlaceholderText("Password"), { target: { value: "pass123" } });
    fireEvent.change(screen.getByPlaceholderText("Confirm Password"), { target: { value: "pass123" } });

    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

    await waitFor(() => {
      expect(showToast).toHaveBeenCalledWith("Email already taken", "error");
    });
  });
});
