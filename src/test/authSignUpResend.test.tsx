import { describe, expect, it, vi, beforeEach } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Auth from "@/pages/Auth";

const {
  signUpMock,
  signInWithPasswordMock,
  resendMock,
  maybeSingleMock,
  toastMock,
} = vi.hoisted(() => ({
  signUpMock: vi.fn(),
  signInWithPasswordMock: vi.fn(),
  resendMock: vi.fn(),
  maybeSingleMock: vi.fn(),
  toastMock: vi.fn(),
}));

vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    auth: {
      signUp: signUpMock,
      signInWithPassword: signInWithPasswordMock,
      resend: resendMock,
    },
    from: () => ({
      select: () => ({
        eq: () => ({
          maybeSingle: maybeSingleMock,
        }),
      }),
    }),
  },
}));

vi.mock("@/hooks/use-toast", () => ({
  useToast: () => ({ toast: toastMock }),
}));

describe("Auth signup and resend flow", () => {
  beforeEach(() => {
    signUpMock.mockResolvedValue({ error: null });
    signInWithPasswordMock.mockResolvedValue({ data: { user: null }, error: null });
    resendMock.mockResolvedValue({ error: null });
    maybeSingleMock.mockResolvedValue({ data: null });
    toastMock.mockReset();
  });

  it("normalizes email on signup and supports resend verification", async () => {
    const nowSpy = vi.spyOn(Date, "now");
    nowSpy.mockReturnValue(100_000);

    render(
      <MemoryRouter>
        <Auth />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole("button", { name: "New here? Create an account" }));

    fireEvent.change(screen.getByPlaceholderText("Your email address"), {
      target: { value: "  USER@Example.COM " },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "password123" },
    });
    fireEvent.change(screen.getByPlaceholderText("Display name"), {
      target: { value: "User" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Create account" }));

    await waitFor(() => expect(signUpMock).toHaveBeenCalledTimes(1));
    expect(signUpMock).toHaveBeenCalledWith(
      expect.objectContaining({
        email: "user@example.com",
      }),
    );

    expect(
      await screen.findByRole("button", { name: "Resend verification email" }),
    ).toBeInTheDocument();

    nowSpy.mockReturnValue(131_000);
    fireEvent.click(screen.getByRole("button", { name: "Resend verification email" }));

    await waitFor(() => expect(resendMock).toHaveBeenCalledTimes(1));
    expect(resendMock).toHaveBeenCalledWith({
      type: "signup",
      email: "user@example.com",
      options: { emailRedirectTo: window.location.origin },
    });

    nowSpy.mockRestore();
  });
});
