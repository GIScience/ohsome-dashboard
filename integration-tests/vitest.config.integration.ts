import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['integration-tests/specs/**/*.int-test.ts'],
    environment: 'jsdom',           // no DOM needed for real HTTP calls
    globals: true,
    testTimeout: 30_000,           // real network needs more headroom
    setupFiles: ['./integration-tests/setup-integration.ts'],
    retry: 1,                      // real APIs can be flaky
  },
});
