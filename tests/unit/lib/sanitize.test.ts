import { describe, it, expect } from "vitest";
import {
  stripHtml,
  sanitizeEmailField,
  stripUrls,
  sanitizeMessage,
  sanitizeName,
  sanitizeEmail,
  sanitizePhone,
  validateWhatsAppNumber,
} from "~/lib/sanitize";

describe("stripHtml()", () => {
  it("removes HTML tags", () => {
    expect(stripHtml("<b>hello</b>")).toBe("hello");
    expect(stripHtml('<script>alert("xss")</script>')).toBe('alert("xss")');
    expect(stripHtml("<p>text</p>")).toBe("text");
  });

  it("preserves plain text", () => {
    expect(stripHtml("no tags here")).toBe("no tags here");
  });
});

describe("sanitizeEmailField()", () => {
  it("removes newlines (header injection prevention)", () => {
    expect(sanitizeEmailField("test@example.com\r\nBcc: attacker@evil.com")).toBe(
      "test@example.comBcc: attacker@evil.com",
    );
  });

  it("trims whitespace", () => {
    expect(sanitizeEmailField("  test@example.com  ")).toBe("test@example.com");
  });
});

describe("stripUrls()", () => {
  it("replaces HTTP URLs", () => {
    expect(stripUrls("visit http://spam.com now")).toBe("visit [link removed] now");
  });

  it("replaces HTTPS URLs", () => {
    expect(stripUrls("check https://spam.com/path?q=1")).toBe("check [link removed]");
  });

  it("preserves text without URLs", () => {
    expect(stripUrls("no links here")).toBe("no links here");
  });
});

describe("sanitizeMessage()", () => {
  it("strips HTML and URLs", () => {
    expect(sanitizeMessage('<a href="http://spam.com">click</a>')).toBe("click");
  });

  it("trims result", () => {
    expect(sanitizeMessage("  hello  ")).toBe("hello");
  });
});

describe("sanitizeName()", () => {
  it("strips HTML from names", () => {
    expect(sanitizeName("<b>John</b> Doe")).toBe("John Doe");
  });

  it("limits to 200 characters", () => {
    const longName = "A".repeat(300);
    expect(sanitizeName(longName)).toHaveLength(200);
  });
});

describe("sanitizeEmail()", () => {
  it("accepts valid emails", () => {
    expect(sanitizeEmail("test@example.com")).toBe("test@example.com");
    expect(sanitizeEmail("USER@Example.COM")).toBe("user@example.com");
  });

  it("rejects invalid emails", () => {
    expect(sanitizeEmail("not-an-email")).toBeNull();
    expect(sanitizeEmail("@no-local.com")).toBeNull();
    expect(sanitizeEmail("no-domain@")).toBeNull();
    expect(sanitizeEmail("")).toBeNull();
  });

  it("rejects emails with injection attempts", () => {
    expect(sanitizeEmail("test@example.com\r\nBcc: evil@hack.com")).toBeNull();
  });
});

describe("sanitizePhone()", () => {
  it("accepts valid phone numbers", () => {
    expect(sanitizePhone("+385 91 123 4567")).toBe("+385 91 123 4567");
    expect(sanitizePhone("(091) 123-4567")).toBe("(091) 123-4567");
  });

  it("rejects too short", () => {
    expect(sanitizePhone("123")).toBeNull();
  });

  it("rejects too long", () => {
    expect(sanitizePhone("+" + "1".repeat(20))).toBeNull();
  });
});

describe("validateWhatsAppNumber()", () => {
  it("accepts valid WhatsApp numbers", () => {
    expect(validateWhatsAppNumber("+385911234567")).toBe("+385911234567");
    expect(validateWhatsAppNumber("+49 171 1234567")).toBe("+491711234567");
  });

  it("rejects numbers without country code", () => {
    expect(validateWhatsAppNumber("0911234567")).toBeNull();
  });

  it("rejects too short", () => {
    expect(validateWhatsAppNumber("+385")).toBeNull();
  });
});
