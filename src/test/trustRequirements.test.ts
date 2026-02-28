import { describe, expect, it } from "vitest";
import { isTrustComplete } from "@/lib/trust";

describe("isTrustComplete", () => {
  it("requires selfie and pledge regardless of phone policy", () => {
    expect(
      isTrustComplete(
        { phone_verified: true, selfie_verified: false, safety_pledge_accepted: true },
        true,
      ),
    ).toBe(false);

    expect(
      isTrustComplete(
        { phone_verified: true, selfie_verified: true, safety_pledge_accepted: false },
        false,
      ),
    ).toBe(false);
  });

  it("requires phone verification when strict mode is on", () => {
    expect(
      isTrustComplete(
        { phone_verified: false, selfie_verified: true, safety_pledge_accepted: true },
        true,
      ),
    ).toBe(false);
  });

  it("allows missing phone verification when strict mode is off", () => {
    expect(
      isTrustComplete(
        { phone_verified: false, selfie_verified: true, safety_pledge_accepted: true },
        false,
      ),
    ).toBe(true);
  });
});
