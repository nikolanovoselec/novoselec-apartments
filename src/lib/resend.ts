interface SendEmailParams {
  readonly to: readonly string[];
  readonly subject: string;
  readonly html: string;
  readonly replyTo?: string;
  readonly apiKey: string;
  readonly from: string;
}

interface SendEmailResult {
  readonly success: boolean;
  readonly error?: string;
}

/**
 * Send an email via Resend API (fetch-based, no SDK needed).
 */
export async function sendEmail(params: SendEmailParams): Promise<SendEmailResult> {
  const { to, subject, html, replyTo, apiKey, from } = params;

  if (to.length === 0) {
    return { success: false, error: "No recipients" };
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      signal: AbortSignal.timeout(10_000),
      body: JSON.stringify({
        from,
        to: [...to],
        subject,
        html,
        ...(replyTo ? { reply_to: replyTo } : {}),
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text().catch(() => "");
      console.error("[resend] API error:", response.status, errorBody);
      return { success: false, error: "Failed to send email" };
    }

    return { success: true };
  } catch {
    return { success: false, error: "Network error sending email" };
  }
}
