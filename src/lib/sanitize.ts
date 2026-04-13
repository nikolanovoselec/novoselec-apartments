/**
 * Strip HTML tags from a string.
 */
export function stripHtml(input: string): string {
  return input.replace(/<[^>]*>/g, "");
}

/**
 * Prevent email header injection by removing newlines and carriage returns.
 */
export function sanitizeEmailField(input: string): string {
  return input.replace(/[\r\n]/g, "").trim();
}

/**
 * Strip URLs from a message body (anti-spam).
 */
export function stripUrls(input: string): string {
  return input.replace(/https?:\/\/\S+/gi, "[link removed]");
}

/**
 * Full sanitization pipeline for inquiry form message text.
 */
export function sanitizeMessage(input: string): string {
  return stripUrls(stripHtml(input)).trim();
}

/**
 * Sanitize a name field - strip HTML and limit length.
 */
export function sanitizeName(input: string): string {
  return stripHtml(input).trim().slice(0, 200);
}

/**
 * Validate and sanitize an email address.
 * Returns null if invalid.
 */
export function sanitizeEmail(input: string): string | null {
  const cleaned = sanitizeEmailField(input).toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(cleaned) ? cleaned : null;
}

/**
 * Validate a phone number format (loose - allows international formats).
 * Returns null if clearly invalid.
 */
export function sanitizePhone(input: string): string | null {
  const cleaned = input.replace(/[^\d+\-() ]/g, "").trim();
  if (cleaned.length < 6 || cleaned.length > 20) return null;
  return cleaned;
}

/**
 * Validate a WhatsApp number format (must start with + and country code).
 * Returns null if invalid.
 */
export function validateWhatsAppNumber(input: string): string | null {
  const cleaned = input.replace(/[^\d+]/g, "");
  if (!cleaned.startsWith("+") || cleaned.length < 10 || cleaned.length > 15) return null;
  return cleaned;
}
