# Content Guide — Tone, Photography & Translation

Guidelines for creating and translating content across all 4 locales.

## Tone by Locale

### Croatian (HR) — Warm and Familiar
- Use informal, conversational tone
- Emphasize practical logistics (ferry times, parking, distances)
- Feel like advice from a local friend
- Example: "Dođite rano ujutro — more je stakleno, a svjetlo mekano."

### German (DE) — Precise and Detailed
- Exact distances in meters, travel times in minutes
- Detailed appliance and amenity lists
- Total prices including all fees (PAngV compliance)
- Use "Ferienwohnung" not "Apartment"
- Example: "Strand Matlovac (5,2 km, ca. 8 Min. mit dem Auto)"

### Slovenian (SL) — Warm and Neighborly
- Similar warmth to Croatian, but distinct language
- Emphasize proximity and accessibility from Slovenia
- Example: "Morje, ki vabi ob vsakem delu dneva."

### English (EN) — Universal Clarity
- Benefit-led descriptions
- No jargon, no assumed local knowledge
- Example: "Crystal-clear water just steps from your door."

## Photography Guidelines

- **Minimum resolution:** 1200px wide for any use, 1920px for hero images
- **Format:** JPEG or HEIC from phone camera. Cloudflare handles conversion to WebP/AVIF.
- **Subject matter:** Croatian Adriatic coast, Dalmatian architecture, local food, nature. No generic Mediterranean or non-Croatian imagery.
- **Composition:** Landscape orientation preferred for hero images. Portrait works for gallery items.
- **Lighting:** Golden hour (sunrise/sunset) photos are most impactful for hero use.

## Translation Workflow

1. Write content in Croatian first (base language)
2. Translate to German with cultural adaptation (longer, more detailed)
3. Translate to Slovenian with warmth preserved
4. Translate to English last (universal clarity)
5. Verify natural phrasing: run all four translations past a native speaker or cross-check with at least two LLMs before publishing

Translation is cultural adaptation, not word-for-word. German descriptions may be 30-50% longer than Croatian. That's correct — test heading wrapping with long German strings.

## Page-Level Voice Rules

Certain pages have tighter voice requirements beyond the locale tone rules above:

| Page | Voice rule |
|---|---|
| `aktivnosti` (intro) | Love-letter tone — nature is accepted, not conquered. Warm, unhurried. No superlatives, no "dramatic peaks". |
| `hrana` (intro) | Personal islander voice — first-person plural ("we cook slowly"), sensory detail (sounds, smells). Reads like someone who lives on the island. |
| `galerija` (intro) | Poetic and brief — evoke feeling, not description. Prefer ending with an incomplete or hanging clause that trails off rather than a closed declarative sentence. |
| `404` | Gentle, never alarming. Tie the error to the sea metaphor ("wandered off"). |
| Hero tagline | Consistent tone across all 4 locales — evoke escape and belonging, not a tourism pitch. Translations must feel natural, not literal. |

When editing intro text for these pages via CMS or in code, match the voice already established in all 4 locales. When adding a new locale translation, verify natural phrasing with a native speaker or with multiple LLMs before publishing.

## Content Types

| Collection | Structured Fields | Rich Text |
|-----------|-------------------|-----------|
| Apartments | name, sleeps, bedrooms, amenities, price | description only |
| Testimonials | name, country, rating, quote | none |
| FAQs | question, answer, category | none |
| Guide | name, category, distance, image | description only |
| Editorial | page_key, section_key, title, image | body text |

---

## Related Documentation

- [CMS Guide](cms-guide.md#content-guidelines) - Owner-facing content editing reference
- [SEO Guide](seo.md#editorial-pages-and-seo) - Keyword targets and content intent per page
- [Architecture — Public Page Routes](architecture.md#public-page-routes) - Page slugs and what each page renders
