interface TurnstileResult {
  readonly success: boolean;
  readonly errorCodes: readonly string[];
}

/**
 * Verify a Cloudflare Turnstile token server-side.
 */
export async function verifyTurnstileToken(
  token: string,
  secretKey: string,
  remoteIp: string | null,
): Promise<TurnstileResult> {
  const body = new URLSearchParams();
  body.append("secret", secretKey);
  body.append("response", token);
  if (remoteIp) {
    body.append("remoteip", remoteIp);
  }

  try {
    const response = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body,
        signal: AbortSignal.timeout(10_000),
      },
    );

    if (!response.ok) {
      return { success: false, errorCodes: [`http_${response.status}`] };
    }

    const data = (await response.json()) as {
      success: boolean;
      "error-codes"?: string[];
    };

    return {
      success: data.success,
      errorCodes: data["error-codes"] ?? [],
    };
  } catch {
    return { success: false, errorCodes: ["network_error"] };
  }
}

/**
 * Check if a Turnstile failure is due to token expiry.
 */
export function isTokenExpired(errorCodes: readonly string[]): boolean {
  return errorCodes.includes("timeout-or-duplicate");
}
