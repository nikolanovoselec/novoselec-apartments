/**
 * Resend Email Provider Plugin for EmDash
 *
 * Sends emails via Resend API using noreply@graymatter.ch as the sender.
 * Used for magic link authentication and other system emails.
 */
import { definePlugin } from "emdash";

const RESEND_API_KEY = "re_dfb8RNDg_G7ma8bqD3CGFKPPjnmYw9va9";
const FROM_EMAIL = "Apartmani Novoselec <noreply@graymatter.ch>";

export const resendEmailPlugin = definePlugin({
  id: "resend-email",
  version: "1.0.0",
  capabilities: [],
  hooks: {
    "email:deliver": async (event: { message: { to: string; subject: string; text: string; html?: string }; source: string }) => {
      const { message } = event;

      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: FROM_EMAIL,
          to: [message.to],
          subject: message.subject,
          html: message.html ?? message.text,
          text: message.text,
        }),
      });

      if (!res.ok) {
        const err = await res.text();
        console.error(`[resend-email] Failed to send email to ${message.to}: ${res.status} ${err}`);
        throw new Error(`Resend API error: ${res.status}`);
      }

      console.log(`[resend-email] Email sent to ${message.to}: ${message.subject}`);
    },
  },
});
