export interface TrustState {
  phone_verified?: boolean | null;
  selfie_verified?: boolean | null;
  safety_pledge_accepted?: boolean | null;
}

export function isTrustComplete(
  trust: TrustState | null | undefined,
  requirePhoneVerification: boolean,
): boolean {
  if (!trust?.selfie_verified || !trust?.safety_pledge_accepted) return false;
  if (requirePhoneVerification && !trust.phone_verified) return false;
  return true;
}
