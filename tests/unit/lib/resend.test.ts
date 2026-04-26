import { describe, it, expect, vi, beforeEach } from "vitest";
import { sendEmail } from "~/lib/resend";

const RESEND_URL = "https://api.resend.com/emails";

beforeEach(() => {
  vi.unstubAllGlobals();
});

function makeFetchStub(ok: boolean, status = ok ? 200 : 422) {
  return vi.fn().mockResolvedValue({ ok, status });
}

const baseParams = {
  to: ["recipient@example.com"],
  subject: "Test subject",
  html: "<p>Hello</p>",
  apiKey: "re_test_key",
  from: "noreply@example.com",
};

// ---------------------------------------------------------------------------
// sendEmail
// ---------------------------------------------------------------------------

describe("sendEmail()", () => {
  it("returns success: true when API responds 200", async () => {
    vi.stubGlobal("fetch", makeFetchStub(true));

    const result = await sendEmail(baseParams);

    expect(result.success).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it("returns success: false with error message when API responds non-200", async () => {
    vi.stubGlobal("fetch", makeFetchStub(false, 422));

    const result = await sendEmail(baseParams);

    expect(result.success).toBe(false);
    expect(result.error).toBeTruthy();
  });

  it("returns success: false with network error on fetch failure", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("Connection refused")));

    const result = await sendEmail(baseParams);

    expect(result.success).toBe(false);
    expect(result.error).toBeTruthy();
  });

  it("sends correct Authorization Bearer header", async () => {
    const fetchMock = makeFetchStub(true);
    vi.stubGlobal("fetch", fetchMock);

    await sendEmail({ ...baseParams, apiKey: "re_secret_123" });

    const [, init] = fetchMock.mock.calls[0];
    expect((init.headers as Record<string, string>)["Authorization"]).toBe(
      "Bearer re_secret_123",
    );
  });

  it("sends Content-Type application/json header", async () => {
    const fetchMock = makeFetchStub(true);
    vi.stubGlobal("fetch", fetchMock);

    await sendEmail(baseParams);

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe(RESEND_URL);
    expect((init.headers as Record<string, string>)["Content-Type"]).toBe(
      "application/json",
    );
  });

  it("sends correct body fields (from, to, subject, html)", async () => {
    const fetchMock = makeFetchStub(true);
    vi.stubGlobal("fetch", fetchMock);

    await sendEmail({
      ...baseParams,
      to: ["a@example.com", "b@example.com"],
      subject: "Hello",
      html: "<b>World</b>",
      from: "sender@example.com",
    });

    const [, init] = fetchMock.mock.calls[0];
    const body = JSON.parse(init.body as string);
    expect(body.from).toBe("sender@example.com");
    expect(body.to).toEqual(["a@example.com", "b@example.com"]);
    expect(body.subject).toBe("Hello");
    expect(body.html).toBe("<b>World</b>");
  });

  it("includes reply_to in body when provided", async () => {
    const fetchMock = makeFetchStub(true);
    vi.stubGlobal("fetch", fetchMock);

    await sendEmail({ ...baseParams, replyTo: "customer@example.com" });

    const [, init] = fetchMock.mock.calls[0];
    const body = JSON.parse(init.body as string);
    expect(body.reply_to).toBe("customer@example.com");
  });

  it("does not include reply_to in body when not provided", async () => {
    const fetchMock = makeFetchStub(true);
    vi.stubGlobal("fetch", fetchMock);

    await sendEmail(baseParams);

    const [, init] = fetchMock.mock.calls[0];
    const body = JSON.parse(init.body as string);
    expect(body).not.toHaveProperty("reply_to");
  });

  it("returns error immediately for empty recipients without calling fetch", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    const result = await sendEmail({ ...baseParams, to: [] });

    expect(result.success).toBe(false);
    expect(result.error).toBeTruthy();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("includes bcc in body when provided", async () => {
    const fetchMock = makeFetchStub(true);
    vi.stubGlobal("fetch", fetchMock);

    await sendEmail({
      ...baseParams,
      to: ["from@example.com"],
      bcc: ["a@example.com", "b@example.com"],
    });

    const [, init] = fetchMock.mock.calls[0];
    const body = JSON.parse(init.body as string);
    expect(body.bcc).toEqual(["a@example.com", "b@example.com"]);
  });

  it("omits bcc from body when empty", async () => {
    const fetchMock = makeFetchStub(true);
    vi.stubGlobal("fetch", fetchMock);

    await sendEmail({ ...baseParams, bcc: [] });

    const [, init] = fetchMock.mock.calls[0];
    const body = JSON.parse(init.body as string);
    expect(body).not.toHaveProperty("bcc");
  });

  it("sends when only bcc recipients are provided (to is empty)", async () => {
    const fetchMock = makeFetchStub(true);
    vi.stubGlobal("fetch", fetchMock);

    const result = await sendEmail({
      ...baseParams,
      to: [],
      bcc: ["a@example.com"],
    });

    expect(result.success).toBe(true);
    expect(fetchMock).toHaveBeenCalledOnce();
  });
});
