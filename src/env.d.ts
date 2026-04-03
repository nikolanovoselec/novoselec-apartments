/// <reference types="astro/client" />

import type { Locale } from "./i18n/config";

declare namespace App {
  interface Locals {
    locale: Locale;
  }
}
