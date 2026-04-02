import { describe, it, expect } from "vitest";
import { inquirySchema } from "~/schemas/inquiry";

describe("inquirySchema", () => {
  const validBooking = {
    type: "booking" as const,
    checkIn: "2026-07-05",
    checkOut: "2026-07-12",
    adults: 2,
    childrenUnder12: 1,
    children12to17: 0,
    apartmentId: "apt-1",
    name: "Maria König",
    email: "maria@example.com",
    phone: "+49 171 1234567",
    message: "Looking forward to our stay",
    hasPets: false,
    gdprConsent: true as const,
    turnstileToken: "token-123",
    honeypot: "",
    locale: "de" as const,
  };

  const validQuestion = {
    type: "question" as const,
    name: "John Smith",
    email: "john@example.com",
    message: "Is the property suitable for elderly parents?",
    gdprConsent: true as const,
    turnstileToken: "token-456",
    honeypot: "",
    locale: "en" as const,
  };

  it("validates a correct booking inquiry", () => {
    const result = inquirySchema.safeParse(validBooking);
    expect(result.success).toBe(true);
  });

  it("validates a correct quick question", () => {
    const result = inquirySchema.safeParse(validQuestion);
    expect(result.success).toBe(true);
  });

  it("rejects booking with checkout before checkin", () => {
    const result = inquirySchema.safeParse({
      ...validBooking,
      checkIn: "2026-07-12",
      checkOut: "2026-07-05",
    });
    expect(result.success).toBe(false);
  });

  it("rejects booking with same-day check-in/out", () => {
    const result = inquirySchema.safeParse({
      ...validBooking,
      checkIn: "2026-07-05",
      checkOut: "2026-07-05",
    });
    expect(result.success).toBe(false);
  });

  it("rejects missing GDPR consent", () => {
    const result = inquirySchema.safeParse({
      ...validBooking,
      gdprConsent: false,
    });
    expect(result.success).toBe(false);
  });

  it("rejects honeypot with content (bot detection)", () => {
    const result = inquirySchema.safeParse({
      ...validBooking,
      honeypot: "spam content",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid email", () => {
    const result = inquirySchema.safeParse({
      ...validBooking,
      email: "not-an-email",
    });
    expect(result.success).toBe(false);
  });

  it("rejects zero adults for booking", () => {
    const result = inquirySchema.safeParse({
      ...validBooking,
      adults: 0,
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid date format", () => {
    const result = inquirySchema.safeParse({
      ...validBooking,
      checkIn: "07/05/2026",
    });
    expect(result.success).toBe(false);
  });

  it("rejects missing message in quick question", () => {
    const result = inquirySchema.safeParse({
      ...validQuestion,
      message: "",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid locale", () => {
    const result = inquirySchema.safeParse({
      ...validBooking,
      locale: "fr",
    });
    expect(result.success).toBe(false);
  });

  it("allows optional fields to be missing", () => {
    const minimal = {
      type: "booking" as const,
      checkIn: "2026-07-05",
      checkOut: "2026-07-12",
      adults: 2,
      childrenUnder12: 0,
      children12to17: 0,
      apartmentId: "apt-1",
      name: "Test User",
      email: "test@example.com",
      gdprConsent: true as const,
      turnstileToken: "token",
      locale: "hr" as const,
    };
    const result = inquirySchema.safeParse(minimal);
    expect(result.success).toBe(true);
  });
});
