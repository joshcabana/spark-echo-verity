# Verity Evidence Pack — March 1, 2026

## Scope

Execution evidence for the "100% Completion Runbook" against the canonical project
`itdzdyhdkbcxbqgukzis`, using non-destructive validation and available permissions.

## Canonical Runtime Confirmation

- `.env` points to `itdzdyhdkbcxbqgukzis`.
- `VITE_REQUIRE_PHONE_VERIFICATION="false"` (fallback continuity mode).
- `scripts/check-auth-settings.sh` result:
  - `disable_signup=false`
  - `external.email=true`
  - `external.phone=false`
  - PASS with fallback warning.

## Quality Gates (Local)

All local code quality gates pass.

- `npm ci`: PASS
- `npm run lint`: PASS (warnings only, no errors)
- `npm run test -- --run`: PASS (13/13)
- `npm run build`: PASS
- `npx tsc -b`: PASS
- `npm run check:auth-settings`: PASS in fallback mode

## Browser Validation (Supabase Access)

Result: blocked by project permissions.

- Attempted navigation to:
  - `https://supabase.com/dashboard/project/itdzdyhdkbcxbqgukzis`
- Observed dashboard behavior:
  - Redirect to org projects page
  - Toast: "You do not have access to this project"
  - `Authentication`, `Database`, `Storage` inaccessible.

This prevents SMTP/Twilio configuration from being completed in this session.

## Security/Audit Snapshot

- `npm audit` currently reports **2 moderate** vulnerabilities (esbuild/vite chain).
- Remediation requires `npm audit fix --force` with major Vite upgrade (`vite@7.x`), which is a controlled breaking-change pass and out of safe automatic scope for this runbook execution.

## Filesystem/Environment Check

- `npm ci` is currently functional in `spark-echo-verity-main`.
- `node_modules` has `com.apple.provenance` xattrs present, but no active lock preventing package install in this environment.

## Remaining Manual Actions Required for 100% Completion

1. Restore Supabase access:
   - Grant this logged-in user `Admin` or `Owner` on `itdzdyhdkbcxbqgukzis`.
2. Configure SMTP in Supabase:
   - host, port, username, password, from email.
3. Configure Twilio phone provider in Supabase:
   - Account SID, Auth Token, Message Service SID.
4. Switch production strict mode:
   - set `VITE_REQUIRE_PHONE_VERIFICATION=true`, redeploy.
5. Re-run strict validation:
   - `npm run check:auth-settings` must show `external.phone=true` and no fallback warning.
6. Perform production E2E:
   - signup -> email verify -> OTP -> selfie -> pledge -> lobby -> live drop join.

## Current Status

- Codebase readiness: **Green**
- Runtime fallback continuity: **Green**
- Strict-mode production readiness: **Blocked by external credentials/permissions**
