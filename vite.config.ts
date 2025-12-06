import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'fileTrail',
      fileName: 'index',
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: ['path'],
    },
  },
  test: {
    globals: true,
    environment: 'node',
    exclude: ['node_modules', 'dist', 'e2e/**'],
  },
});
