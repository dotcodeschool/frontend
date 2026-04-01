// astro.config.mjs
import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import tailwindcss from '@tailwindcss/vite'
import mdx from '@astrojs/mdx'
import node from '@astrojs/node'

export default defineConfig({
  integrations: [
    react(),
    mdx(),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  output: 'server',
  adapter: node({ mode: 'standalone' }),
})
