import cloudflare from "@astrojs/cloudflare";
import react from "@astrojs/react";
import { d1, access } from "@emdash-cms/cloudflare";
import { defineConfig } from "astro/config";
import emdash from "emdash/astro";

export default defineConfig({
  output: "server",
  adapter: cloudflare(),
  integrations: [
    react(),
    emdash({
      database: d1({ binding: "DB" }),
      storage: {
        entrypoint: "~/lib/storage-r2-hybrid",
        config: { binding: "MEDIA", bucketName: "apartmani-media" },
      },
      auth: access({
        teamDomain: "m4f1j0z0.cloudflareaccess.com",
        audienceEnvVar: "CF_ACCESS_AUDIENCE",
        autoProvision: true,
        defaultRole: 50, // Admin
      }),
    }),
  ],
  i18n: {
    defaultLocale: "hr",
    locales: ["hr", "de", "sl", "en"],
    routing: "manual",
  },
  image: {
    layout: "constrained",
    responsiveStyles: true,
  },
  devToolbar: { enabled: false },
});
