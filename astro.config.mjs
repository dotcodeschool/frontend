// astro.config.mjs
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import vercel from "@astrojs/vercel";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import auth from "auth-astro";

export default defineConfig({
  integrations: [react(), mdx(), auth()],
  vite: {
    plugins: [tailwindcss()],
  },
  // Astro 6 removed 'hybrid' mode. Using 'server' with prerender=true on static
  // pages achieves the same result. auth-astro also requires server output.
  output: "server",
  adapter: vercel(),
});
