import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["ar", "en"],
  localePrefix: "as-needed",
  defaultLocale: "ar",
});
