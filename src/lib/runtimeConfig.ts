const FALSE_VALUES = new Set(["0", "false", "no", "off"]);

function parseBooleanFlag(value: string | undefined, defaultValue: boolean): boolean {
  if (value == null) return defaultValue;
  return !FALSE_VALUES.has(value.trim().toLowerCase());
}

export const REQUIRE_PHONE_VERIFICATION = parseBooleanFlag(
  import.meta.env.VITE_REQUIRE_PHONE_VERIFICATION,
  true,
);
