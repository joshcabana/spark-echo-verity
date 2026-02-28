import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import PhoneVerifyStep from "@/components/onboarding/PhoneVerifyStep";

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

describe("PhoneVerifyStep fallback behavior", () => {
  it("blocks progress when phone verification is required and provider is unavailable", () => {
    render(
      <PhoneVerifyStep
        onNext={vi.fn()}
        phoneEnabled={false}
        requirePhoneVerification
      />,
    );

    expect(
      screen.getByRole("heading", { name: "Phone verification unavailable" }),
    ).toBeInTheDocument();
    expect(screen.queryByText("Continue for now")).not.toBeInTheDocument();
  });

  it("allows temporary bypass when phone verification is optional", () => {
    const onSkip = vi.fn();

    render(
      <PhoneVerifyStep
        onNext={vi.fn()}
        onSkip={onSkip}
        phoneEnabled={false}
        requirePhoneVerification={false}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Continue for now" }));
    expect(onSkip).toHaveBeenCalledTimes(1);
  });
});
