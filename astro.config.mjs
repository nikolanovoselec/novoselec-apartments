import cloudflare from "@astrojs/cloudflare";
import react from "@astrojs/react";
import { d1, r2 } from "@emdash-cms/cloudflare";
import { defineConfig } from "astro/config";
import emdash from "emdash/astro";

export default defineConfig({
  output: "server",
  adapter: cloudflare(),
  integrations: [
    react(),
    emdash({
      database: d1({ binding: "DB", session: "auto" }),
      storage: r2({ binding: "MEDIA" }),
    }),
  ],
  i18n: {
    defaultLocale: "hr",
    locales: ["hr", "de", "sl", "en"],
    routing: {
      prefixDefaultLocale: true,
    },
  },
  image: {
    layout: "constrained",
    responsiveStyles: true,
  },
  devToolbar: { enabled: false },
});
