import type { APIRoute } from "astro";
import { env as _env } from "cloudflare:workers";
import type { Env } from "~/env";
const env = _env as unknown as Env;
import { verifyJWT } from "~/lib/auth";
import { AwsClient } from "aws4fetch";

const ALLOWED_CONTENT_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/heic",
  "image/heif",
  "image/webp",
  "image/avif",
]);

const MAX_FILENAME_LENGTH = 200;

/**
 * POST /admin/api/upload-url
 * Generate a presigned PUT URL for direct browser-to-R2 upload.
 * Requires authenticated admin session (JWT in cookie).
 */
export const POST: APIRoute = async ({ request, cookies, locals }) => {

  // Auth check - verify JWT from cookie
  const authToken = cookies.get("auth_token")?.value;
  if (!authToken) {
    return jsonResponse({ error: "Authentication required" }, 401);
  }

  const jwtSecret = env.JWT_SECRET ?? "";
  const payload = await verifyJWT(authToken, jwtSecret);
  if (!payload) {
    return jsonResponse({ error: "Invalid or expired session" }, 401);
  }

  const accessKeyId = env.R2_ACCESS_KEY_ID;
  const secretAccessKey = env.R2_SECRET_ACCESS_KEY;
  const accountId = env.CLOUDFLARE_ACCOUNT_ID ?? "";
  const bucketName = env.R2_BUCKET_NAME ?? "";

  if (!accessKeyId || !secretAccessKey || !accountId || !bucketName) {
    return jsonResponse({ error: "Storage not configured" }, 503);
  }

  const body = await request.json().catch(() => null) as { filename?: string; contentType?: string } | null;

  if (!body?.filename || body.filename.length > MAX_FILENAME_LENGTH) {
    return jsonResponse({ error: "Invalid filename" }, 400);
  }

  // Validate content type
  const contentType = body.contentType ?? "application/octet-stream";
  if (!ALLOWED_CONTENT_TYPES.has(contentType)) {
    return jsonResponse({ error: "File type not allowed. Supported: JPEG, PNG, HEIC, WebP, AVIF" }, 400);
  }

  // Generate opaque UUID key with validated extension
  const ALLOWED_EXTENSIONS = new Set(["jpg", "jpeg", "png", "heic", "heif", "webp", "avif"]);
  const extension = body.filename.split(".").pop()?.toLowerCase() ?? "";
  if (!ALLOWED_EXTENSIONS.has(extension)) {
    return jsonResponse({ error: "Invalid file extension" }, 400);
  }
  const objectKey = `${crypto.randomUUID()}.${extension}`;

  const r2Client = new AwsClient({
    accessKeyId,
    secretAccessKey,
    service: "s3",
    region: "auto",
  });

  const endpoint = `https://${accountId}.r2.cloudflarestorage.com`;
  const url = `${endpoint}/${bucketName}/${objectKey}`;

  const signed = await r2Client.sign(url, {
    method: "PUT",
    headers: {
      "Content-Type": contentType,
    },
    aws: { signQuery: true },
  });

  return jsonResponse({
    presignedUrl: signed.url,
    key: objectKey,
  });
};

function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
