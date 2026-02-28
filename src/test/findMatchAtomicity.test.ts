import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

describe("find-match atomic pairing safeguards", () => {
  it("uses SQL row locking with SKIP LOCKED in migration RPC", () => {
    const migrationPath = resolve(
      process.cwd(),
      "supabase/migrations/20260228225500_3f9f0d2e-atomic-match-claim-rpc.sql",
    );
    const sql = readFileSync(migrationPath, "utf8");

    expect(sql).toContain("CREATE OR REPLACE FUNCTION public.claim_match_candidate");
    expect(sql).toContain("FOR UPDATE SKIP LOCKED");
    expect(sql).toContain("SET status = 'matching'");
    expect(sql).toContain("SET status = 'waiting'");
  });

  it("invokes claim_match_candidate RPC and defensive rollback paths", () => {
    const fnPath = resolve(
      process.cwd(),
      "supabase/functions/find-match/index.ts",
    );
    const code = readFileSync(fnPath, "utf8");

    expect(code).toContain('rpc("claim_match_candidate"');
    expect(code).toContain("Failed to finalize match");
    expect(code).toContain(".delete().eq(\"id\", call.id)");
    expect(code).toContain("status: \"waiting\"");
  });
});
