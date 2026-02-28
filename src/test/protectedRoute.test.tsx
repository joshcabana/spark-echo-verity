import { describe, expect, it, vi, beforeEach } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import type { Session } from "@supabase/supabase-js";

vi.mock("@/contexts/AuthContext", () => ({
  useAuth: vi.fn(),
}));

const mockUseAuth = vi.mocked(useAuth);
const mockSession = { user: { id: "user-1" } } as unknown as Session;

describe("ProtectedRoute", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("redirects unauthenticated users to /auth", () => {
    mockUseAuth.mockReturnValue({
      session: null,
      isLoading: false,
      isAdmin: false,
      onboardingComplete: false,
      profile: null,
      user: null,
      userTrust: null,
      signOut: async () => {},
    });

    render(
      <MemoryRouter initialEntries={["/lobby"]}>
        <Routes>
          <Route
            path="/lobby"
            element={<ProtectedRoute><div>Lobby</div></ProtectedRoute>}
          />
          <Route path="/auth" element={<div>Auth Page</div>} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText("Auth Page")).toBeInTheDocument();
  });

  it("redirects authenticated but incomplete users to /onboarding", () => {
    mockUseAuth.mockReturnValue({
      session: mockSession,
      isLoading: false,
      isAdmin: false,
      onboardingComplete: false,
      profile: null,
      user: null,
      userTrust: null,
      signOut: async () => {},
    });

    render(
      <MemoryRouter initialEntries={["/lobby"]}>
        <Routes>
          <Route
            path="/lobby"
            element={<ProtectedRoute><div>Lobby</div></ProtectedRoute>}
          />
          <Route path="/onboarding" element={<div>Onboarding Page</div>} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText("Onboarding Page")).toBeInTheDocument();
  });

  it("renders children for authenticated and onboarded users", () => {
    mockUseAuth.mockReturnValue({
      session: mockSession,
      isLoading: false,
      isAdmin: false,
      onboardingComplete: true,
      profile: null,
      user: null,
      userTrust: null,
      signOut: async () => {},
    });

    render(
      <MemoryRouter initialEntries={["/lobby"]}>
        <Routes>
          <Route
            path="/lobby"
            element={<ProtectedRoute><div>Lobby</div></ProtectedRoute>}
          />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText("Lobby")).toBeInTheDocument();
  });
});
