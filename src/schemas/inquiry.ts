import { z } from "zod";

export const bookingInquirySchema = z.object({
  type: z.literal("booking"),
  checkIn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  checkOut: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  adults: z.number().int().min(1).max(20),
  childrenUnder12: z.number().int().min(0).max(10),
  children12to17: z.number().int().min(0).max(10),
  apartmentId: z.string().min(1),
  name: z.string().min(1).max(200),
  email: z.string().email(),
  phone: z.string().max(20).optional(),
  message: z.string().max(2000).optional(),
  hasPets: z.boolean().optional(),
  petNote: z.string().max(500).optional(),
  gdprConsent: z.literal(true),
  turnstileToken: z.string().min(1),
  honeypot: z.string().max(0).optional(), // must be empty
  locale: z.enum(["hr", "de", "sl", "en"]),
}).refine(
  (data) => data.checkIn < data.checkOut,
  { message: "Check-out must be after check-in", path: ["checkOut"] },
);

export const quickQuestionSchema = z.object({
  type: z.literal("question"),
  name: z.string().min(1).max(200),
  email: z.string().email(),
  message: z.string().min(1).max(2000),
  gdprConsent: z.literal(true),
  turnstileToken: z.string().min(1),
  honeypot: z.string().max(0).optional(),
  locale: z.enum(["hr", "de", "sl", "en"]),
  apartmentId: z.string().optional(),
});

export const inquirySchema = z.discriminatedUnion("type", [
  bookingInquirySchema,
  quickQuestionSchema,
]);

export type BookingInquiry = z.infer<typeof bookingInquirySchema>;
export type QuickQuestion = z.infer<typeof quickQuestionSchema>;
export type Inquiry = z.infer<typeof inquirySchema>;
