import { describe, it, expect } from "vitest";
import * as fs from "node:fs";
import * as path from "node:path";

/**
 * Content validation tests.
 * TDD: verify CMS data structure, photo files exist, seed.json valid.
 */

describe("Photo files exist on disk", () => {
  const photosDir = path.resolve(__dirname, "../../../public/photos");

  const requiredPhotos = [
    // Exterior (collage)
    "apt-nikola-terrace-dining.jpg",
    "apt-nikola-terrace-wide.jpg",
    "apt-nikola-terrace-loungers.jpg",
    "apt-nikola-terrace-bbq.jpg",
    "apt-bbq-garden.jpg",
    "apt-marko-balcony.jpg",
    "apt-marko-balcony-view.jpg",
    "apt-marko-pine-view.jpg",
    "apt-building-exterior.jpg",
    "apt-nikola-wine-glass.jpg",
    // Interior Nikola
    "apt-nikola-living.jpg",
    "apt-nikola-kitchen-new.jpg",
    "apt-nikola-bedroom1.jpg",
    "apt-nikola-bedroom2.jpg",
    "apt-nikola-bathroom.jpg",
    "apt-nikola-kids-sofa.jpg",
    // Interior Marko
    "apt-marko-kitchen.jpg",
    // Landscape
    "zdrelac-from-sea.jpg",
    "beach-zdrelac.jpg",
    "marina-harbor.jpg",
    "pine-trees-golden.jpg",
    "church-tower.jpg",
    "parents-portrait.jpg",
  ];

  it.each(requiredPhotos)("photo %s exists", (photo) => {
    const filePath = path.join(photosDir, photo);
    expect(fs.existsSync(filePath), `Missing photo: ${photo}`).toBe(true);
  });

  it("all photos are under 800KB", () => {
    const files = fs.readdirSync(photosDir);
    for (const file of files) {
      if (!file.endsWith(".jpg")) continue;
      const stat = fs.statSync(path.join(photosDir, file));
      expect(stat.size, `${file} is ${Math.round(stat.size / 1024)}KB`).toBeLessThan(820000);
    }
  });
});

describe("Seed.json validity", () => {
  const seedPath = path.resolve(__dirname, "../../../seed/seed.json");

  it("seed.json is valid JSON", () => {
    const content = fs.readFileSync(seedPath, "utf-8");
    expect(() => JSON.parse(content)).not.toThrow();
  });

  it("seed.json has collections array", () => {
    const seed = JSON.parse(fs.readFileSync(seedPath, "utf-8"));
    expect(seed).toHaveProperty("collections");
    expect(Array.isArray(seed.collections)).toBe(true);
  });

  it("seed.json has apartments collection", () => {
    const seed = JSON.parse(fs.readFileSync(seedPath, "utf-8"));
    const apartments = seed.collections.find(
      (c: { slug: string }) => c.slug === "apartments"
    );
    expect(apartments).toBeDefined();
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
