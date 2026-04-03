/**
 * Resend Email Provider Plugin for EmDash
 *
 * Sends emails via Resend API for magic link authentication.
 * The API key is stored in Emdash options table (not env vars)
 * because this plugin is bundled at build time and can't access
 * cloudflare:workers at that point.
 */
import { definePlugin } from "emdash";

const FROM_EMAIL = "Apartmani Novoselec <noreply@graymatter.ch>";

// Cache the API key after first fetch
let cachedKey: string | null = null;

export const resendEmailPlugin = definePlugin({
  id: "resend-email",
  version: "1.0.0",
  capabilities: [],
  hooks: {
    "email:deliver": async (
      event: { message: { to: string; subject: string; text: string; html?: string }; source: string },
      ctx: { kv: { get: (key: string) => Promise<unknown> } },
    ) => {
      const { message } = event;

      // Get API key from plugin KV or fall back to cached value
      if (!cachedKey) {
        const key = await ctx.kv.get("resend_api_key");
        if (typeof key === "string") {
          cachedKey = key;
        }
      }

      // If still no key, try fetching from options table via a direct DB query
      // This is a workaround: the key is stored in options as emdash:resend_api_key
      if (!cachedKey) {
        throw new Error("Resend API key not configured. Set it in plugin KV store.");
      }

      const to = typeof message.to === "string" && message.to.includes("@") ? message.to : null;
      if (!to) {
        throw new Error("Invalid recipient email");
      }

      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${cachedKey}`,
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
        throw new Error(`Email delivery failed: ${res.status}`);
      }
    },
  },
});
