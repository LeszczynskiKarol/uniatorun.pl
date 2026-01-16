import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://unia-torun.pl",
  output: "static",
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    sitemap({
      i18n: {
        defaultLocale: "pl",
        locales: {
          pl: "pl-PL",
        },
      },
    }),
  ],

  // Vite config for environment variables
  vite: {
    define: {
      "import.meta.env.CMS_URL": JSON.stringify(
        process.env.CMS_URL || "http://localhost:3000"
      ),
      "import.meta.env.CMS_API_KEY": JSON.stringify(
        process.env.CMS_API_KEY || ""
      ),
    },
  },
  build: {
    inlineStylesheets: "auto",
  },
  vite: {
    build: {
      cssMinify: true,
    },
  },
});
