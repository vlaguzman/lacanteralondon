import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'

export default defineConfig({
  appType: 'mpa',
  build: {
    rollupOptions: {
      input: {
        main: fileURLToPath(new URL('./index.html', import.meta.url)),
        brandManual: fileURLToPath(new URL('./brand-manual/index.html', import.meta.url)),
      },
    },
  },
})
