export interface AuthCapabilities {
  emailEnabled: boolean;
  phoneEnabled: boolean;
  disableSignup: boolean;
  mailerAutoconfirm: boolean;
}

export const DEFAULT_AUTH_CAPABILITIES: AuthCapabilities = {
  emailEnabled: true,
  phoneEnabled: true,
  disableSignup: false,
  mailerAutoconfirm: false,
};

export async function fetchAuthCapabilities(): Promise<AuthCapabilities> {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const apikey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !apikey) {
    return DEFAULT_AUTH_CAPABILITIES;
  }

  const settingsUrl = `${supabaseUrl.replace(/\/+$/, "")}/auth/v1/settings`;

  const response = await fetch(settingsUrl, {
    headers: {
      apikey,
      Authorization: `Bearer ${apikey}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Auth settings request failed (${response.status})`);
  }

  const settings = await response.json();

  return {
    emailEnabled: settings?.external?.email !== false,
    phoneEnabled: settings?.external?.phone === true,
    disableSignup: settings?.disable_signup === true,
    mailerAutoconfirm: settings?.mailer_autoconfirm === true,
  };
}
