import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import PhoneVerifyStep from "@/components/onboarding/PhoneVerifyStep";

const {
  useAuthCapabilitiesMock,
  requirePhoneVerificationMock,
} = vi.hoisted(() => ({
  useAuthCapabilitiesMock: vi.fn(),
  requirePhoneVerificationMock: vi.fn(),
}));

vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    auth: {
      signInWithOtp: vi.fn(),
      verifyOtp: vi.fn(),
    },
  },
}));

vi.mock("@/hooks/use-toast", () => ({
  useToast: () => ({ toast: vi.fn() }),
}));

vi.mock("@/hooks/useAuthCapabilities", () => ({
  useAuthCapabilities: () => useAuthCapabilitiesMock(),
}));

vi.mock("@/lib/authCapabilities", () => ({
  requirePhoneVerification: () => requirePhoneVerificationMock(),
}));

describe("PhoneVerifyStep fallback behavior", () => {
  it("blocks progress when phone verification is required and provider is unavailable", () => {
    requirePhoneVerificationMock.mockReturnValue(true);
    useAuthCapabilitiesMock.mockReturnValue({
      data: { phoneEnabled: false },
      refetch: vi.fn(),
      isFetching: false,
    });

    render(<PhoneVerifyStep onNext={vi.fn()} />);

    expect(
      screen.getByRole("heading", { name: "Phone verification is unavailable" }),
    ).toBeInTheDocument();
    expect(screen.queryByText("Continue for now")).not.toBeInTheDocument();
  });

  it("allows temporary bypass when phone verification is optional", () => {
    requirePhoneVerificationMock.mockReturnValue(false);
    useAuthCapabilitiesMock.mockReturnValue({
      data: { phoneEnabled: false },
      refetch: vi.fn(),
      isFetching: false,
    });
    const onNext = vi.fn();

    render(<PhoneVerifyStep onNext={onNext} />);

    fireEvent.click(screen.getByRole("button", { name: "Continue for now" }));
    expect(onNext).toHaveBeenCalledWith(false);
  });
});
