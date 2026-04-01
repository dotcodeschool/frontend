// astro.config.mjs
import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import tailwindcss from '@tailwindcss/vite'
import mdx from '@astrojs/mdx'
import node from '@astrojs/node'
import auth from 'auth-astro'

export default defineConfig({
  integrations: [
    react(),
    mdx(),
    auth(),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  output: 'server',
  adapter: node({ mode: 'standalone' }),
})
