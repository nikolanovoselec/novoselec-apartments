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
      const apiKey = (globalThis as Record<string, unknown>).__RESEND_API_KEY as string | undefined
        ?? (typeof process !== "undefined" ? (process as Record<string, Record<string, string>>).env?.RESEND_API_KEY : undefined);

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
