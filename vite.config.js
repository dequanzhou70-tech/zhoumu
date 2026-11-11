import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  build: {
    // Keep the two experiences at separate, stable URLs in the same Pages site.
    modulePreload: false,
    rollupOptions: {
      input: {
        crush: fileURLToPath(new URL('./index.html', import.meta.url)),
        boss: fileURLToPath(new URL('./boss/index.html', import.meta.url)),
      },
    },
  },
});
