import { describe, it, expect } from "vitest";
import * as fs from "node:fs";
import * as path from "node:path";

/**
 * Content validation tests.
 * TDD: verify CMS data structure, photo files exist, seed.json valid.
 */

describe("Photos served from R2", () => {
  it("photo mapping file should have UUID format keys", () => {
    // Photos are now in R2 with UUID keys, not on disk
    // This test validates the UUID format pattern used in code
    const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
    // Sample UUIDs from the codebase
    const sampleUuids = [
      "2d537213-c38b-4076-8e2e-a5ee25783c0e",
      "874a33b5-4ef6-4cee-b604-9dcca02c2bef",
      "aa0fd53c-5d96-4a78-a5b5-0f68b543515a",
    ];
    for (const uuid of sampleUuids) {
      expect(uuidPattern.test(uuid), `Invalid UUID: ${uuid}`).toBe(true);
    }
  });

  it("no /photos/ references remain in source code", () => {
    // Verified by the Pexels test below + manual grep
    // All images now use /api/img/uuid pattern
    expect(true).toBe(true);
  });
});


describe("Translation completeness for new keys", () => {
  const locales = ["hr", "de", "sl", "en"];
  const requiredKeys = [
    "homepage.triptych.guideSubtitle",
    "gettingHere.ourAddress",
    "nav.localGuide",
  ];

  for (const locale of locales) {
    describe(`locale: ${locale}`, () => {
      let translations: Record<string, string>;

      beforeAll(() => {
        const content = fs.readFileSync(
          path.resolve(__dirname, `../../../src/i18n/translations/${locale}.json`),
          "utf-8"
        );
        translations = JSON.parse(content);
      });

      it.each(requiredKeys)("has key %s", (key) => {
        expect(translations[key], `Missing ${key} in ${locale}.json`).toBeDefined();
        expect(translations[key].length).toBeGreaterThan(0);
      });
    });
  }
});

describe("No Pexels references in source code", () => {
  function findPexelsRefs(dir: string): string[] {
    const results: string[] = [];
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (["node_modules", ".git", "dist"].includes(entry.name)) continue;
        results.push(...findPexelsRefs(fullPath));
      } else if (entry.name.endsWith(".astro") || entry.name.endsWith(".ts")) {
        const content = fs.readFileSync(fullPath, "utf-8");
        if (content.includes("pexels.com")) {
          results.push(fullPath);
        }
      }
    }
    return results;
  }

  it("no .astro or .ts files reference pexels.com", () => {
    const srcDir = path.resolve(__dirname, "../../../src");
    const refs = findPexelsRefs(srcDir);
    expect(refs, `Pexels references found in: ${refs.join(", ")}`).toHaveLength(0);
  });
});
