import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import tailwindcss from '@tailwindcss/vite'

// https://astro.build/config
export default defineConfig({
  integrations: [react()],
  vite: {
    // Tailwind 4 ships as a Vite plugin; the old @astrojs/tailwind
    // integration only supports Astro <=5 and Tailwind 3.
    plugins: [tailwindcss()],
  },
})
