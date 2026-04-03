/**
 * Resend Email Provider Plugin for EmDash
 *
 * Sends emails via Resend API for magic link authentication.
 * Requires RESEND_API_KEY set as a Cloudflare Worker secret.
 *
 * The API key is accessed at runtime via dynamic import of cloudflare:workers.
 * The import is done with Function constructor to avoid Vite trying to resolve it at build time.
 */
import { definePlugin } from "emdash";

const FROM_EMAIL = "Apartmani Novoselec <noreply@graymatter.ch>";

async function getResendKey(): Promise<string | undefined> {
  try {
    // Use Function constructor to create a truly dynamic import that Vite cannot analyze
    const importFn = new Function("specifier", "return import(specifier)");
    const mod = await importFn("cloudflare:workers");
    return (mod.env as Record<string, string>)?.RESEND_API_KEY;
  } catch {
    return undefined;
  }
}

export const resendEmailPlugin = definePlugin({
  id: "resend-email",
  version: "1.0.0",
  capabilities: [],
  hooks: {
    "email:deliver": async (event: { message: { to: string; subject: string; text: string; html?: string }; source: string }) => {
      const { message } = event;

      const apiKey = await getResendKey();
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
