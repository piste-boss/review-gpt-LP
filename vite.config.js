import { resolve } from 'node:path'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        admin: resolve(__dirname, 'admin/index.html'),
        user: resolve(__dirname, 'user/index.html'),
        confirm: resolve(__dirname, 'confirm.html'),
        thanks: resolve(__dirname, 'thanks.html'),
      },
    },
  },
})
