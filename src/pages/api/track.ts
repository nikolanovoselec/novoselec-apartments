import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";
import "~/lib/env";

const validEventTypes = [
  "inquiry_submit",
  "question_submit",
  "whatsapp_click",
  "call_click",
  "apartment_view",
  "gallery_open",
  "language_switch",
  "calendar_select",
] as const;

/**
 * POST /api/track
 * Cookieless analytics event tracking. Writes to D1 events table.
 * No PII stored — only event type, apartment slug, locale, timestamp, page path.
 */
export const POST: APIRoute = async ({ request, locals }) => {
  const db = env.DB;

  const body = await request.json().catch(() => null) as {
    type?: string;
    apartmentSlug?: string;
    locale?: string;
    pagePath?: string;
  } | null;

  if (!body?.type || !validEventTypes.includes(body.type as (typeof validEventTypes)[number])) {
    return new Response(JSON.stringify({ error: "Invalid event type" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Truncate fields to prevent abuse
  const slug = (body.apartmentSlug ?? "").slice(0, 100) || null;
  const locale = (body.locale ?? "").slice(0, 10) || null;
  const pagePath = (body.pagePath ?? "").slice(0, 500) || null;

  try {
    await db
      .prepare("INSERT INTO events (type, apartment_slug, locale, page_path) VALUES (?, ?, ?, ?)")
      .bind(body.type, slug, locale, pagePath)
      .run();
  } catch {
    return new Response(JSON.stringify({ error: "Failed to record event" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ ok: true }), {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "private, no-store",
    },
  });
};
