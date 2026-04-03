/**
 * Resend Email Provider Plugin for EmDash
 *
 * Sends emails via Resend API for magic link authentication.
 * Requires RESEND_API_KEY environment variable (set via wrangler secret).
 */
import { definePlugin } from "emdash";

const FROM_EMAIL = "Apartmani Novoselec <noreply@graymatter.ch>";

export const resendEmailPlugin = definePlugin({
  id: "resend-email",
  version: "1.0.0",
  capabilities: [],
  hooks: {
    "email:deliver": async (event: { message: { to: string; subject: string; text: string; html?: string }; source: string }) => {
      const { message } = event;

      // Read API key from environment at runtime (set via wrangler secret)
      // On Cloudflare Workers, env vars are available via the cloudflare:workers module
      let apiKey: string | undefined;
      try {
        const { env } = await import("cloudflare:workers");
        apiKey = (env as Record<string, string>).RESEND_API_KEY;
      } catch {
        // Not on Cloudflare — try process.env
        try { apiKey = (globalThis as unknown as Record<string, Record<string, string>>).process?.env?.RESEND_API_KEY; } catch { /* */ }
      }

      if (!apiKey) {
        console.error("[resend-email] RESEND_API_KEY not configured");
        throw new Error("Email provider not configured");
      }

      const to = typeof message.to === "string" && message.to.includes("@") ? message.to : null;
      if (!to) {
        throw new Error("Invalid recipient email");
      }

      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: FROM_EMAIL,
          to: [to],
          subject: message.subject,
          html: message.html ?? message.text,
          text: message.text,
        }),
      });

      if (!res.ok) {
        console.error(`[resend-email] Send failed: ${res.status}`);
        throw new Error(`Email delivery failed: ${res.status}`);
      }
    },
  },
});
