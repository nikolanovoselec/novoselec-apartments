import { describe, it, expect } from "vitest";
import { buildMediaUrl, buildSrcset } from "~/lib/media";

describe("buildMediaUrl()", () => {
  it("builds basic URL without options", () => {
    expect(buildMediaUrl("abc123")).toBe("/api/img/abc123");
  });

  it("adds width parameter", () => {
    expect(buildMediaUrl("abc123", { width: 800 })).toBe("/api/img/abc123?w=800");
  });

  it("adds multiple parameters", () => {
    const url = buildMediaUrl("abc123", { width: 800, format: "webp", quality: 80 });
    expect(url).toContain("w=800");
    expect(url).toContain("f=webp");
    expect(url).toContain("q=80");
  });

  it("encodes special characters in key", () => {
    const url = buildMediaUrl("path/to/photo.jpg");
    expect(url).toContain("path%2Fto%2Fphoto.jpg");
  });

  it("includes fit parameter", () => {
    const url = buildMediaUrl("abc", { fit: "cover" });
    expect(url).toContain("fit=cover");
  });
});

describe("buildSrcset()", () => {
  it("builds srcset with default widths", () => {
    const srcset = buildSrcset("abc123");
    expect(srcset).toContain("400w");
    expect(srcset).toContain("800w");
    expect(srcset).toContain("1200w");
    expect(srcset).toContain("1920w");
  });

  it("builds srcset with custom widths", () => {
    const srcset = buildSrcset("abc123", [320, 640]);
    expect(srcset).toContain("320w");
    expect(srcset).toContain("640w");
    expect(srcset).not.toContain("1920w");
  });

  it("includes format in each URL", () => {
    const srcset = buildSrcset("abc123", [400, 800], "avif");
    expect(srcset).toContain("f=avif");
  });
});
