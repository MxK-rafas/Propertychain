import { defineConfig } from 'vitest/config';

export default defineConfig({
  build: { assetsInlineLimit: 0 },
  server: { fs: { allow: ['.', '../fixtures'] } },
  test: { environment: 'jsdom', setupFiles: ['./src/test-setup.ts'], clearMocks: true },
});
