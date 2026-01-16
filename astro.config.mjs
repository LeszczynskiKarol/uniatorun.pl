import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://www.uniatorun.pl",
  output: "static",
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    sitemap(),
  ],
  build: {
    inlineStylesheets: "auto",
  },
  vite: {
    define: {
      "import.meta.env.CMS_URL": JSON.stringify(
        process.env.CMS_URL || "http://localhost:3000"
      ),
      "import.meta.env.CMS_API_KEY": JSON.stringify(
        process.env.CMS_API_KEY || ""
      ),
    },
    build: {
      cssMinify: true,
    },
  },
});
